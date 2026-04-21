"""
Bot 1 — CMS ASP Quarterly Refresh
Downloads the latest CMS Average Sales Price quarterly data file,
compares against current data, updates changed values, logs all changes.

Supports both CSV and Excel (.xlsx/.xls) file formats from CMS.
Uses header-row detection and column aliasing for robustness against
CMS format variations across quarters.
"""

from __future__ import annotations

import csv
import io
import json
import re
import time
import zipfile
from datetime import datetime
from pathlib import Path

import httpx
import pandas as pd

from lib.changelog import log_update
from lib.validate import validate_cms_asp

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
CMS_ASP_URL = "https://www.cms.gov/medicare/payment/part-b-drugs/asp-pricing-files"

# ---------------------------------------------------------------------------
# Column aliasing: CMS format varies slightly by quarter.
# Each key maps to a list of known column name variations.
# ---------------------------------------------------------------------------
COLUMN_ALIASES = {
    "hcpcs": ["HCPCS Code", "HCPCS", "Code", "HCPCS_Code"],
    "description": [
        "Short Description",
        "Description",
        "Drug Name",
        "Long Description",
    ],
    "asp": [
        "ASP (Per Unit)",
        "Weighted Average ASP",
        "ASP Price",
        "ASP",
        "Payment Limit",
        "ASP+6%",
        "Medicare Part B Drug Payment",
    ],
    "unit": ["Unit", "Billing Unit", "Unit of Service", "Dosage"],
}


def _resolve_column(columns: list[str], alias_key: str) -> str | None:
    """Find the first matching column name from alias list, case-insensitive."""
    aliases = COLUMN_ALIASES.get(alias_key, [])
    col_map = {c.strip().lower(): c for c in columns}
    for alias in aliases:
        if alias.strip().lower() in col_map:
            return col_map[alias.strip().lower()]
    return None


# ---------------------------------------------------------------------------
# Excel parsing with header-row detection
# ---------------------------------------------------------------------------

def _find_header_row(df_raw: pd.DataFrame, max_scan: int = 15) -> int:
    """
    CMS Excel files sometimes have metadata rows before the actual header.
    Scan the first `max_scan` rows to find the one containing 'HCPCS'.
    Returns the 0-based row index of the header row.
    """
    scan_limit = min(max_scan, len(df_raw))
    for idx in range(scan_limit):
        row_values = df_raw.iloc[idx].astype(str).str.strip().str.upper().tolist()
        for val in row_values:
            # Only match short header-like cells. Reject prose (notes, descriptions)
            # that merely mention HCPCS.
            if len(val) <= 40 and (val == "HCPCS" or val.startswith("HCPCS ") or val.startswith("HCPCS_")):
                return idx
    return 0  # fallback: assume first row is header


def _parse_excel(file_bytes: bytes) -> list[dict]:
    """
    Parse a CMS ASP Excel file with robust header detection and column aliasing.
    Returns a list of dicts with keys: hcpcs, description, asp_cents, unit.
    """
    # Read without header first to scan for the real header row
    df_raw = pd.read_excel(io.BytesIO(file_bytes), header=None, dtype=str)
    header_idx = _find_header_row(df_raw)

    # Re-read with correct header
    df = pd.read_excel(
        io.BytesIO(file_bytes), header=header_idx, dtype=str
    )
    # Strip whitespace from column names
    df.columns = [str(c).strip() for c in df.columns]

    # Resolve actual column names via aliases
    hcpcs_col = _resolve_column(list(df.columns), "hcpcs")
    asp_col = _resolve_column(list(df.columns), "asp")
    desc_col = _resolve_column(list(df.columns), "description")
    unit_col = _resolve_column(list(df.columns), "unit")

    if not hcpcs_col:
        raise ValueError(
            f"Could not find HCPCS column in Excel. Columns found: {list(df.columns)}"
        )
    if not asp_col:
        raise ValueError(
            f"Could not find ASP column in Excel. Columns found: {list(df.columns)}"
        )

    records = []
    for _, row in df.iterrows():
        hcpcs = str(row.get(hcpcs_col, "")).strip()
        asp_str = str(row.get(asp_col, "0")).replace("$", "").replace(",", "").strip()
        try:
            asp_cents = int(float(asp_str) * 100)
        except (ValueError, TypeError):
            continue
        if not hcpcs or asp_cents <= 0:
            continue

        record = {"hcpcs": hcpcs, "asp_cents": asp_cents}
        if desc_col:
            record["description"] = str(row.get(desc_col, "")).strip()
        if unit_col:
            record["unit"] = str(row.get(unit_col, "")).strip()
        records.append(record)

    return records


def _parse_csv(file_bytes: bytes) -> list[dict]:
    """
    Parse a CMS ASP CSV file with column aliasing.
    Returns a list of dicts with keys: hcpcs, description, asp_cents, unit.
    """
    text = file_bytes.decode("utf-8-sig")
    lines = text.splitlines()

    # Header-row detection for CSV: find first line whose first cell is a
    # short HCPCS header (not a prose note that mentions HCPCS).
    header_idx = 0
    for idx, line in enumerate(lines[:15]):
        first = line.split(",", 1)[0].strip().strip('"').upper()
        if len(first) <= 40 and (first == "HCPCS" or first.startswith("HCPCS ") or first.startswith("HCPCS_")):
            header_idx = idx
            break

    reader = csv.DictReader(lines[header_idx:])
    columns = list(reader.fieldnames or [])

    hcpcs_col = _resolve_column(columns, "hcpcs")
    asp_col = _resolve_column(columns, "asp")
    desc_col = _resolve_column(columns, "description")
    unit_col = _resolve_column(columns, "unit")

    if not hcpcs_col:
        raise ValueError(
            f"Could not find HCPCS column in CSV. Columns found: {columns}"
        )
    if not asp_col:
        raise ValueError(
            f"Could not find ASP column in CSV. Columns found: {columns}"
        )

    records = []
    for row in reader:
        hcpcs = (row.get(hcpcs_col) or "").strip()
        asp_str = (row.get(asp_col) or "0").replace("$", "").replace(",", "").strip()
        try:
            asp_cents = int(float(asp_str) * 100)
        except (ValueError, TypeError):
            continue
        if not hcpcs or asp_cents <= 0:
            continue

        record = {"hcpcs": hcpcs, "asp_cents": asp_cents}
        if desc_col:
            record["description"] = (row.get(desc_col) or "").strip()
        if unit_col:
            record["unit"] = (row.get(unit_col) or "").strip()
        records.append(record)

    return records


def _extract_and_parse(zip_bytes: bytes) -> list[dict]:
    """
    Open a ZIP archive and parse the first CSV or Excel file found inside.
    Returns parsed records list.
    """
    z = zipfile.ZipFile(io.BytesIO(zip_bytes))
    names = z.namelist()

    # Prefer Excel files, fall back to CSV
    excel_files = [n for n in names if n.lower().endswith((".xlsx", ".xls"))]
    csv_files = [n for n in names if n.lower().endswith(".csv")]

    if excel_files:
        print(f"  Found Excel file: {excel_files[0]}")
        return _parse_excel(z.read(excel_files[0]))
    elif csv_files:
        print(f"  Found CSV file: {csv_files[0]}")
        return _parse_csv(z.read(csv_files[0]))
    else:
        raise ValueError(f"No CSV or Excel file found in ZIP. Contents: {names}")


def run():
    start_time = time.time()
    print(f"[{datetime.now()}] BOT: CMS ASP refresh starting...")

    run_stats = {
        "trigger": "scheduled",
        "records_processed": 0,
        "records_inserted": 0,
        "records_updated": 0,
        "records_skipped": 0,
        "unmatched_hcpcs": 0,
        "duration_seconds": 0.0,
        "status": "success",
        "error_message": None,
    }

    try:
        # 1. Fetch the CMS ASP page and find the latest quarterly ZIP link
        res = httpx.get(CMS_ASP_URL, follow_redirects=True, timeout=30)
        res.raise_for_status()

        # CMS naming shifted from aspYYQQ.zip to descriptive
        # "MONTH-YEAR-asp-pricing..." or "MONTH-YEAR-medicare-part-b-payment-limit-files..."
        # Match pricing-file links but skip NDC-HCPCS crosswalks and NOC files.
        month_to_q = {
            "january": 1, "april": 2, "july": 3, "october": 4,
        }
        candidates = re.findall(
            r'href="([^"]*\.zip)"', res.text, re.IGNORECASE
        )
        links = []
        for href in candidates:
            low = href.lower()
            if "ndc-hcpcs" in low or "crosswalk" in low or "noc-pricing" in low or "noc" in low.split("/")[-1].split("-"):
                continue
            if "asp-pricing" not in low and "payment-limit" not in low:
                continue
            # Legacy short form
            m_legacy = re.search(r"asp(\d{2})q(\d)", low)
            # New long form: {month}-{year}-...
            m_long = re.search(r"(january|april|july|october)-(\d{4})", low)
            if m_legacy or m_long:
                links.append((href, m_legacy, m_long))

        if not links:
            raise RuntimeError("Could not find CMS ASP ZIP link on page")

        href, m_legacy, m_long = links[0]
        latest_url = href if href.startswith("http") else f"https://www.cms.gov{href}"

        if m_legacy:
            data_year = int(f"20{m_legacy.group(1)}")
            data_quarter = int(m_legacy.group(2))
        else:
            data_year = int(m_long.group(2))
            data_quarter = month_to_q[m_long.group(1)]

        quarter_key = f"{data_year}-Q{data_quarter}"

        # Check if we already have this quarter
        asp_path = DATA_DIR / "cms_asp.json"
        existing = json.loads(asp_path.read_text()) if asp_path.exists() else []

        existing_quarters = set()
        for drug in existing:
            for q in drug.get("quarterly_asp", []):
                existing_quarters.add(q["quarter"])

        if quarter_key in existing_quarters:
            print(f"Already have {quarter_key} — skipping")
            run_stats["status"] = "success"
            run_stats["duration_seconds"] = round(time.time() - start_time, 2)
            log_update(
                drug_name="ALL",
                manufacturer="ALL",
                source="CMS ASP Connector",
                update_type="QUARTERLY_REFRESH",
                description=f"CMS ASP quarterly refresh: skipped — {quarter_key} already present",
                source_url=latest_url,
                connector_run=run_stats,
            )
            return

        # 2. Download and parse ZIP
        print(f"  Downloading {latest_url}...")
        zip_res = httpx.get(latest_url, timeout=60)
        zip_res.raise_for_status()

        parsed_records = _extract_and_parse(zip_res.content)
        run_stats["records_processed"] = len(parsed_records)

        # 3. Build update map: HCPCS code -> parsed data
        updates = {}
        for rec in parsed_records:
            updates[rec["hcpcs"]] = rec

        print(f"  Parsed {len(updates)} HCPCS codes from {quarter_key}")

        # 4. Update existing data, detect price hikes
        matched_hcpcs = set()
        hike_count = 0

        for drug in existing:
            hcpcs = drug.get("hcpcs_code") or drug.get("ndc", "")
            if hcpcs not in updates:
                continue

            matched_hcpcs.add(hcpcs)
            rec = updates[hcpcs]
            prev_quarters = drug.get("quarterly_asp", [])
            prev_asp = prev_quarters[-1]["asp_per_unit"] if prev_quarters else None
            new_asp = rec["asp_cents"]

            new_q = {
                "quarter": quarter_key,
                "asp_per_unit": new_asp,
                "data_year": data_year,
                "data_quarter": data_quarter,
                "source": "CMS_ASP",
                "flagged": False,
            }

            # Check if value actually changed
            if prev_asp is not None and prev_asp == new_asp:
                run_stats["records_skipped"] += 1
                # Still append the quarter record even if unchanged
                if "quarterly_asp" not in drug:
                    drug["quarterly_asp"] = []
                drug["quarterly_asp"].append(new_q)
                continue

            # Flag price hike if > 5% increase
            if prev_asp and new_asp > prev_asp * 1.05:
                new_q["flagged"] = True
                pct = round((new_asp - prev_asp) / prev_asp * 100, 1)
                hike_count += 1
                log_update(
                    drug_name=drug.get("drug_name", hcpcs),
                    manufacturer=drug.get("manufacturer", "Unknown"),
                    source="CMS ASP",
                    update_type="PRICE_INCREASE",
                    description=f"ASP increased {pct}% in {quarter_key}",
                    prev=prev_asp,
                    new=new_asp,
                    pct=pct,
                    source_url=latest_url,
                )

            if prev_asp is not None:
                pct_change = round((new_asp - prev_asp) / prev_asp * 100, 1)
                new_q["quarter_over_quarter_change"] = pct_change

            if "quarterly_asp" not in drug:
                drug["quarterly_asp"] = []
            drug["quarterly_asp"].append(new_q)

            if prev_asp is not None and prev_asp != new_asp:
                run_stats["records_updated"] += 1
            else:
                run_stats["records_inserted"] += 1

        # Count HCPCS codes in CMS data that did not match any existing drug
        run_stats["unmatched_hcpcs"] = len(updates) - len(matched_hcpcs)

        # 5. Validate and write
        validate_cms_asp(existing)
        asp_path.write_text(json.dumps(existing, indent=2))

        run_stats["duration_seconds"] = round(time.time() - start_time, 2)

        inserted = run_stats["records_inserted"]
        updated = run_stats["records_updated"]
        skipped = run_stats["records_skipped"]

        log_update(
            drug_name="ALL",
            manufacturer="ALL",
            source="CMS ASP Connector",
            update_type="QUARTERLY_REFRESH",
            description=(
                f"CMS ASP quarterly refresh: {run_stats['records_processed']} records processed, "
                f"{inserted} new, {updated} updated, {skipped} unchanged"
            ),
            source_url=latest_url,
            connector_run=run_stats,
        )

        print(
            f"[{datetime.now()}] BOT: CMS ASP refresh complete — {quarter_key} "
            f"({inserted} inserted, {updated} updated, {skipped} skipped, "
            f"{hike_count} hikes, {run_stats['unmatched_hcpcs']} unmatched)"
        )

    except Exception as exc:
        run_stats["status"] = "error"
        run_stats["error_message"] = str(exc)
        run_stats["duration_seconds"] = round(time.time() - start_time, 2)

        log_update(
            drug_name="ALL",
            manufacturer="ALL",
            source="CMS ASP Connector",
            update_type="QUARTERLY_REFRESH",
            description=f"CMS ASP quarterly refresh failed: {exc}",
            connector_run=run_stats,
        )

        print(f"[{datetime.now()}] BOT ERROR: CMS ASP refresh failed — {exc}")
        raise


if __name__ == "__main__":
    run()

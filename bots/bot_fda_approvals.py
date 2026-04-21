"""
Bot 3 — FDA Approvals & Patent Monitor
Checks for new drug approvals, new biosimilar approvals, and Orange Book
patent updates weekly. Feeds the Pipeline Watch and Generic Gap apps.
"""

from __future__ import annotations

import json
from datetime import datetime, timedelta
from pathlib import Path

import httpx

from lib.changelog import log_update

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
OPENFDA_APPROVALS = "https://api.fda.gov/drug/drugsfda.json"
ORANGE_BOOK_ZIP_URL = "https://www.fda.gov/media/76860/download"


def fetch_new_approvals(days_back: int = 7) -> list[dict]:
    """Fetch new original drug approvals from openFDA."""
    cutoff = (datetime.now() - timedelta(days=days_back)).strftime("%Y%m%d")
    try:
        res = httpx.get(
            OPENFDA_APPROVALS,
            params={
                "search": (
                    f"submissions.submission_status_date:[{cutoff}+TO+99991231]"
                    "+AND+submissions.submission_type:ORIG"
                ),
                "limit": 50,
            },
            timeout=30,
        )
        if res.status_code != 200:
            print(f"  openFDA returned {res.status_code}")
            return []
        return res.json().get("results", [])
    except Exception as e:
        print(f"  openFDA fetch error: {e}")
        return []


def fetch_new_biosimilar_approvals(days_back: int = 7) -> list[dict]:
    """Fetch new BLA (biosimilar) approvals from openFDA."""
    cutoff = (datetime.now() - timedelta(days=days_back)).strftime("%Y%m%d")
    try:
        res = httpx.get(
            OPENFDA_APPROVALS,
            params={
                "search": (
                    "submissions.submission_type:BLA"
                    f"+AND+submissions.submission_status_date:[{cutoff}+TO+99991231]"
                ),
                "limit": 20,
            },
            timeout=30,
        )
        if res.status_code != 200:
            return []
        return res.json().get("results", [])
    except Exception as e:
        print(f"  openFDA BLA fetch error: {e}")
        return []


def check_orange_book_update() -> str | None:
    """Check if FDA Orange Book has been updated. Returns Last-Modified or None."""
    try:
        head = httpx.head(ORANGE_BOOK_ZIP_URL, follow_redirects=True, timeout=15)
        return head.headers.get("last-modified")
    except Exception as e:
        print(f"  Orange Book HEAD request error: {e}")
        return None


def refresh_orange_book_data(last_modified: str):
    """Download and process updated Orange Book patent data."""
    import csv
    import io
    import zipfile

    try:
        res = httpx.get(ORANGE_BOOK_ZIP_URL, follow_redirects=True, timeout=60)
        res.raise_for_status()
        z = zipfile.ZipFile(io.BytesIO(res.content))

        # Look for the products or patent file
        patent_files = [n for n in z.namelist() if "patent" in n.lower() and n.endswith(".txt")]
        if not patent_files:
            print("  No patent file found in Orange Book ZIP")
            return

        reader = csv.DictReader(
            io.StringIO(z.read(patent_files[0]).decode("utf-8-sig")),
            delimiter="~",
        )

        patents_path = DATA_DIR / "patents.json"
        current_patents = json.loads(patents_path.read_text()) if patents_path.exists() else []

        # Index existing patents by drug_id for update
        patent_by_drug = {}
        for p in current_patents:
            drug_id = p.get("drug_id", "")
            if drug_id:
                patent_by_drug[drug_id] = p

        updated_count = 0
        for row in reader:
            trade_name = (row.get("Trade_Name") or "").strip()
            patent_no = (row.get("Patent_No") or "").strip()
            patent_expire = (row.get("Patent_Expire_Date_Text") or "").strip()

            if not trade_name or not patent_expire:
                continue

            drug_id = trade_name.lower().replace(" ", "-")
            if drug_id in patent_by_drug:
                existing = patent_by_drug[drug_id]
                # Add new patent if not already tracked
                known_patents = [p.get("patent_number") for p in existing.get("secondary_patents", [])]
                if patent_no and patent_no not in known_patents:
                    if "secondary_patents" not in existing:
                        existing["secondary_patents"] = []
                    existing["secondary_patents"].append({
                        "patent_number": patent_no,
                        "expiry_date": patent_expire,
                    })
                    updated_count += 1

        # Tag with Orange Book version
        if current_patents:
            current_patents[0]["_orange_book_last_modified"] = last_modified

        patents_path.write_text(json.dumps(current_patents, indent=2))
        print(f"  Orange Book refresh: {updated_count} patent updates")

        log_update(
            drug_name="ALL",
            manufacturer="ALL",
            source="FDA Orange Book",
            update_type="PATENT_REFRESH",
            description=f"Orange Book patent data refreshed ({updated_count} updates)",
            source_url="https://www.fda.gov/drugs/drug-approvals-and-databases/orange-book-data-files",
        )

    except Exception as e:
        print(f"  Orange Book refresh error: {e}")


def run():
    print(f"[{datetime.now()}] BOT: FDA approvals monitor starting...")

    # 1. Check for new drug approvals in the last 7 days
    new_results = fetch_new_approvals(days_back=7)
    new_approvals = []

    for result in new_results:
        brand = result.get("brand_name", "Unknown")
        generic = result.get("generic_name", "")
        applicant = result.get("applicant_full_name", "")
        submissions = result.get("submissions", [{}])
        approval_date = submissions[0].get("submission_status_date", "") if submissions else ""

        approval = {
            "brand_name": brand,
            "generic_name": generic,
            "manufacturer": applicant,
            "approval_date": approval_date,
            "needs_data_enrichment": True,
        }
        new_approvals.append(approval)

        log_update(
            drug_name=brand,
            manufacturer=applicant,
            source="FDA",
            update_type="NEW_DRUG",
            description=f"New FDA approval: {brand} ({generic}) by {applicant}",
            source_url="https://www.fda.gov/drugs/drug-approvals-and-databases/drugs-fda-data-files",
        )

    if new_approvals:
        print(f"  {len(new_approvals)} new drug approvals found")

    # 2. Check for new biosimilar approvals
    bla_results = fetch_new_biosimilar_approvals(days_back=7)
    new_biosimilars = []

    for result in bla_results:
        brand = result.get("brand_name", "Unknown")
        generic = result.get("generic_name", "")
        applicant = result.get("applicant_full_name", "")

        new_biosimilars.append({
            "brand_name": brand,
            "generic_name": generic,
            "manufacturer": applicant,
        })

        log_update(
            drug_name=brand,
            manufacturer=applicant,
            source="FDA",
            update_type="NEW_BIOSIMILAR",
            description=f"New biosimilar approval: {brand} ({generic}) by {applicant}",
            source_url="https://www.fda.gov/drugs/biosimilars/biosimilar-product-information",
        )

    if new_biosimilars:
        print(f"  {len(new_biosimilars)} new biosimilar approvals found")

    # 3. Check if Orange Book has been updated
    last_modified = check_orange_book_update()
    if last_modified:
        patents_path = DATA_DIR / "patents.json"
        current_patents = json.loads(patents_path.read_text()) if patents_path.exists() else []
        stored_lm = current_patents[0].get("_orange_book_last_modified", "") if current_patents else ""

        if last_modified != stored_lm:
            print("  Orange Book updated — refreshing patent data...")
            refresh_orange_book_data(last_modified)
        else:
            print("  Orange Book unchanged — skipping")

    print(
        f"[{datetime.now()}] BOT: FDA monitor complete — "
        f"{len(new_approvals)} new approvals, {len(new_biosimilars)} new biosimilars"
    )


if __name__ == "__main__":
    run()

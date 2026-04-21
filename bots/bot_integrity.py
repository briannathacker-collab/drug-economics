"""
Bot 8 — Data Integrity Checker
Runs every day at 5am before users arrive.
Catches data quality issues before they reach the public.
This is the bot that protects credibility.
"""

import json
from datetime import datetime
from pathlib import Path

from lib.notify import send_integrity_alert

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

# Maximum days before data is considered stale
STALE_THRESHOLDS = {
    "CMS ASP": 120,                # CMS updates quarterly
    "WAC Monitor": 14,             # WAC checked weekly
    "SEC 10-Q": 100,               # SEC quarterly
    "IRA/CMS": 35,                 # Monthly check
    "FDA Orange Book": 35,         # Monthly
    "ClinicalTrials.gov": 10,      # Weekly check
    "FDA Purple Book": 10,         # Weekly check
}


def run():
    print(f"[{datetime.now()}] BOT: Integrity check starting...")
    issues = []

    # 1. Check for stale data files
    changelog_path = DATA_DIR / "changelog.json"
    if changelog_path.exists():
        changelog = json.loads(changelog_path.read_text())

        for source_name, max_days in STALE_THRESHOLDS.items():
            # Find most recent update for this source
            recent = [
                e for e in changelog
                if source_name.lower() in (e.get("source") or "").lower()
            ]
            if not recent:
                issues.append(f"STALE: No changelog entries found for {source_name}")
                continue

            try:
                last_update = datetime.strptime(recent[0]["date"], "%Y-%m-%d")
                days_old = (datetime.now() - last_update).days
                if days_old > max_days:
                    issues.append(
                        f"STALE: {source_name} last updated {days_old} days ago "
                        f"(threshold: {max_days})"
                    )
            except (KeyError, ValueError) as e:
                issues.append(f"PARSE ERROR: Could not read date for {source_name}: {e}")
    else:
        issues.append("MISSING: changelog.json does not exist")

    # 2. Check for COGS estimates missing source URLs
    cogs_path = DATA_DIR / "cogs_estimates.json"
    if cogs_path.exists():
        cogs = json.loads(cogs_path.read_text())
        for drug in cogs:
            drug_name = drug.get("drug_name", "Unknown")
            for est in drug.get("estimates", []):
                if not est.get("source_url") and not est.get("source"):
                    issues.append(f"MISSING SOURCE: {drug_name} COGS estimate has no source_url")
                if not est.get("publication_year") and not est.get("year"):
                    issues.append(f"MISSING YEAR: {drug_name} COGS estimate has no publication_year")
                if not est.get("author") and not est.get("institution"):
                    issues.append(f"MISSING AUTHOR: {drug_name} COGS estimate has no author/institution")

    # 3. Check for WAC figures with only 1 source (low confidence)
    wac_path = DATA_DIR / "wac_prices.json"
    if wac_path.exists():
        wac = json.loads(wac_path.read_text())
        low_confidence = [
            d.get("drug_name", "Unknown") for d in wac
            if d.get("wac_confidence") == "low"
        ]
        if low_confidence:
            issues.append(
                f"LOW CONFIDENCE WAC: {len(low_confidence)} drugs need second source verification: "
                f"{low_confidence[:5]}"
            )

    # 4. Check for negative or zero COGS estimates (data error)
    if cogs_path.exists():
        cogs = json.loads(cogs_path.read_text())
        for drug in cogs:
            drug_name = drug.get("drug_name", "Unknown")
            est = drug.get("estimated_cogs_monthly", 0)
            if est is not None and est <= 0 and not drug.get("no_data"):
                issues.append(
                    f"DATA ERROR: {drug_name} has zero or negative COGS estimate"
                )

    # 5. Check for WAC < COGS (impossible — indicates data error)
    if wac_path.exists() and cogs_path.exists():
        wac = json.loads(wac_path.read_text())
        cogs = json.loads(cogs_path.read_text())

        wac_by_name = {d.get("drug_name", "").lower(): d for d in wac}
        cogs_by_name = {d.get("drug_name", "").lower(): d for d in cogs}

        for name in set(wac_by_name.keys()) & set(cogs_by_name.keys()):
            if not name:
                continue
            w = wac_by_name[name].get("wac_monthly", 0)
            c = cogs_by_name[name].get("estimated_cogs_monthly", 0)
            if w and c and w < c:
                issues.append(
                    f"DATA ERROR: {name} — WAC (${w / 100:.0f}) is LESS than "
                    f"COGS estimate (${c / 100:.0f}) — impossible, check data"
                )

    # 6. Check delay_tactics drugs for missing patient population data
    delay_path = DATA_DIR / "delay_tactics.json"
    if delay_path.exists():
        delays = json.loads(delay_path.read_text())
        for entry in delays:
            drug_name = entry.get("drug_name", "Unknown")
            pop = entry.get("estimated_patient_population")
            if pop is None or (isinstance(pop, (int, float)) and pop <= 0):
                issues.append(f"MISSING PATIENT POPULATION: {drug_name} in delay_tactics has no estimated_patient_population")

    # 7. Check data freshness — flag records missing year/quarter or outdated
    now = datetime.now()
    current_year = now.year
    current_quarter = (now.month - 1) // 3 + 1

    for data_file, year_key, quarter_key in [
        ("wac_prices.json", "data_year", "data_quarter"),
        ("cms_asp.json", "data_year", "data_quarter"),
    ]:
        fpath = DATA_DIR / data_file
        if fpath.exists():
            records = json.loads(fpath.read_text())
            missing_freshness = 0
            outdated = 0
            for rec in records:
                dy = rec.get(year_key)
                dq = rec.get(quarter_key)
                if dy is None:
                    missing_freshness += 1
                elif isinstance(dy, int):
                    q_num = {"Q1": 1, "Q2": 2, "Q3": 3, "Q4": 4}.get(str(dq), 1)
                    quarters_old = ((current_year - dy) * 4) + (current_quarter - q_num)
                    if quarters_old > 8:
                        outdated += 1
            if missing_freshness > 0:
                issues.append(
                    f"MISSING FRESHNESS: {missing_freshness} records in {data_file} "
                    f"have no {year_key} — cannot determine data age"
                )
            if outdated > 0:
                issues.append(
                    f"OUTDATED DATA: {outdated} records in {data_file} are 9+ quarters old"
                )

    # 8a. Freshness auto-enforcement — check effective_dates across all data files
    freshness_checks = [
        ("wac_prices.json", "effective_date", 180),      # WAC should be < 6 months old
        ("cogs_estimates.json", "data_year", 365),        # COGS can be older (academic)
        ("biosimilar_pipeline.json", None, None),         # Structure check only
        ("manufacturer_financials.json", None, None),     # Structure check only
    ]
    for fname, date_field, max_days in freshness_checks:
        fpath = DATA_DIR / fname
        if not fpath.exists() or date_field is None or max_days is None:
            continue
        records = json.loads(fpath.read_text())
        stale_count = 0
        for rec in records:
            if date_field == "data_year":
                dy = rec.get("data_year")
                if dy and isinstance(dy, int) and (current_year - dy) > 2:
                    stale_count += 1
            elif date_field == "effective_date":
                ed = rec.get("effective_date", "")
                try:
                    ed_date = datetime.strptime(ed, "%Y-%m-%d")
                    if (now - ed_date).days > max_days:
                        stale_count += 1
                except (ValueError, TypeError):
                    pass
        if stale_count > 0:
            issues.append(
                f"FRESHNESS WARNING: {stale_count}/{len(records)} records in {fname} "
                f"have {date_field} older than {max_days} days"
            )

    # 8b. Cross-file coverage checks
    if wac_path.exists():
        wac_ids = {d["drug_id"] for d in json.loads(wac_path.read_text())}

        # Check drug_revenue coverage
        rev_path = DATA_DIR / "drug_revenue.json"
        if rev_path.exists():
            rev_ids = {d["drug_id"] for d in json.loads(rev_path.read_text())}
            missing_rev = wac_ids - rev_ids
            if missing_rev:
                issues.append(
                    f"COVERAGE GAP: {len(missing_rev)} drugs in WAC without revenue data: "
                    f"{list(missing_rev)[:5]}"
                )

        # Check wac_history coverage
        hist_path = DATA_DIR / "wac_history.json"
        if hist_path.exists():
            hist_ids = {d["drug_id"] for d in json.loads(hist_path.read_text())}
            missing_hist = wac_ids - hist_ids
            if missing_hist:
                issues.append(
                    f"COVERAGE GAP: {len(missing_hist)} drugs in WAC without price history: "
                    f"{list(missing_hist)[:5]}"
                )

        # Check cogs coverage
        if cogs_path.exists():
            cogs_ids = {d["drug_id"] for d in json.loads(cogs_path.read_text())}
            missing_cogs = wac_ids - cogs_ids
            if missing_cogs:
                issues.append(
                    f"COVERAGE GAP: {len(missing_cogs)} drugs in WAC without COGS estimates: "
                    f"{list(missing_cogs)[:5]}"
                )

    # 8c. Check that all required data files exist
    required_files = [
        "wac_prices.json",
        "wac_history.json",
        "cogs_estimates.json",
        "cms_asp.json",
        "manufacturer_financials.json",
        "patents.json",
        "biosimilar_pipeline.json",
        "pipeline_trials.json",
        "insurer_financials.json",
        "changelog.json",
        "international_prices.json",
    ]
    for fname in required_files:
        fpath = DATA_DIR / fname
        if not fpath.exists():
            issues.append(f"MISSING FILE: {fname}")
        elif fpath.stat().st_size == 0:
            issues.append(f"EMPTY FILE: {fname}")

    # 8. Check for duplicate drug entries in WAC data
    if wac_path.exists():
        wac = json.loads(wac_path.read_text())
        drug_ids = [d.get("drug_id", "") for d in wac if d.get("drug_id")]
        dupes = set(d for d in drug_ids if drug_ids.count(d) > 1)
        if dupes:
            issues.append(f"DUPLICATE ENTRIES: {len(dupes)} duplicate drug_ids in wac_prices.json: {list(dupes)[:5]}")

    # 9. Report
    if issues:
        print(f"  INTEGRITY ISSUES FOUND: {len(issues)}")
        for issue in issues:
            print(f"    - {issue}")
        send_integrity_alert(issues)
    else:
        print("  All integrity checks passed")

    # Write integrity report
    report = {
        "checked_at": datetime.now().isoformat(),
        "issues_found": len(issues),
        "issues": issues,
        "status": "FAIL" if issues else "PASS",
    }
    report_path = DATA_DIR / "integrity_report.json"
    report_path.write_text(json.dumps(report, indent=2))

    print(f"[{datetime.now()}] BOT: Integrity check complete — {len(issues)} issues")


if __name__ == "__main__":
    run()

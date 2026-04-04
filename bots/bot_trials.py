"""
Bot 6 — ClinicalTrials.gov Pipeline Refresh
Refreshes clinical trial pipeline data weekly.
Updates the Pipeline Watch app with latest trial statuses.
"""

import json
from datetime import datetime, timedelta
from pathlib import Path

import httpx

from lib.changelog import log_update
from lib.validate import validate_pipeline_trials

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

# ClinicalTrials.gov v2 API
CT_API_BASE = "https://clinicaltrials.gov/api/v2/studies"


def fetch_trials_for_drug(drug_name: str, nct_ids: list[str] | None = None) -> list[dict]:
    """Fetch trial updates from ClinicalTrials.gov API v2."""
    results = []

    # If we have specific NCT IDs, fetch those directly
    if nct_ids:
        for nct_id in nct_ids:
            try:
                res = httpx.get(
                    f"{CT_API_BASE}/{nct_id}",
                    params={"format": "json"},
                    timeout=15,
                )
                if res.status_code == 200:
                    results.append(res.json())
            except Exception as e:
                print(f"  CT.gov fetch error for {nct_id}: {e}")
        return results

    # Otherwise search by drug name
    try:
        res = httpx.get(
            CT_API_BASE,
            params={
                "query.intr": drug_name,
                "filter.overallStatus": "RECRUITING,ACTIVE_NOT_RECRUITING,ENROLLING_BY_INVITATION,NOT_YET_RECRUITING",
                "pageSize": 10,
                "format": "json",
            },
            timeout=15,
        )
        if res.status_code == 200:
            data = res.json()
            results = data.get("studies", [])
    except Exception as e:
        print(f"  CT.gov search error for {drug_name}: {e}")

    return results


def parse_trial_data(study: dict) -> dict | None:
    """Parse a ClinicalTrials.gov API v2 study into our format."""
    protocol = study.get("protocolSection", {})
    id_module = protocol.get("identificationModule", {})
    status_module = protocol.get("statusModule", {})
    design_module = protocol.get("designModule", {})
    desc_module = protocol.get("descriptionModule", {})

    nct_id = id_module.get("nctId", "")
    if not nct_id:
        return None

    # Map API phase to our phase format
    phases = design_module.get("phases", [])
    phase_map = {
        "PHASE1": "Phase I",
        "PHASE2": "Phase II",
        "PHASE3": "Phase III",
        "PHASE4": "Phase IV",
        "EARLY_PHASE1": "Phase I",
    }
    phase = "Unknown"
    for p in phases:
        if p in phase_map:
            phase = phase_map[p]
            break

    return {
        "nct_id": nct_id,
        "title": id_module.get("briefTitle", ""),
        "phase": phase,
        "status": status_module.get("overallStatus", ""),
        "start_date": status_module.get("startDateStruct", {}).get("date", ""),
        "completion_date": status_module.get("completionDateStruct", {}).get("date", ""),
        "enrollment": design_module.get("enrollmentInfo", {}).get("count"),
        "description": desc_module.get("briefSummary", ""),
        "last_updated": status_module.get("lastUpdateSubmitDate", ""),
    }


def run():
    print(f"[{datetime.now()}] BOT: ClinicalTrials pipeline refresh starting...")

    trials_path = DATA_DIR / "pipeline_trials.json"
    if not trials_path.exists():
        print("ERROR: pipeline_trials.json not found")
        return

    current_trials = json.loads(trials_path.read_text())
    updated_count = 0
    new_count = 0

    # Group existing trials by drug for efficient lookup
    for trial in current_trials:
        drug_name = trial.get("drug_name", "")
        nct_id = trial.get("nct_id", "")

        if not nct_id:
            continue

        # Fetch latest status for this trial
        studies = fetch_trials_for_drug(drug_name, nct_ids=[nct_id])
        if not studies:
            continue

        parsed = parse_trial_data(studies[0])
        if not parsed:
            continue

        # Check for status changes
        old_status = trial.get("status", "")
        new_status = parsed.get("status", "")

        if old_status != new_status and new_status:
            print(f"  {drug_name} ({nct_id}): {old_status} -> {new_status}")
            trial["status"] = new_status
            trial["last_updated"] = parsed.get("last_updated", "")

            # Update enrollment if changed
            if parsed.get("enrollment"):
                trial["enrollment"] = parsed["enrollment"]

            # Update completion date if changed
            if parsed.get("completion_date"):
                trial["completion_date"] = parsed["completion_date"]

            updated_count += 1

            log_update(
                drug_name=drug_name,
                manufacturer=trial.get("manufacturer", ""),
                source="ClinicalTrials.gov",
                update_type="TRIAL_STATUS_CHANGE",
                description=f"{drug_name} trial {nct_id}: status changed from {old_status} to {new_status}",
                source_url=f"https://clinicaltrials.gov/study/{nct_id}",
            )

    # Validate and write
    validate_pipeline_trials(current_trials)
    trials_path.write_text(json.dumps(current_trials, indent=2))

    log_update(
        drug_name="ALL",
        manufacturer="ALL",
        source="ClinicalTrials.gov",
        update_type="WEEKLY_REFRESH",
        description=f"Pipeline trials refreshed ({updated_count} status changes, {new_count} new trials)",
        source_url="https://clinicaltrials.gov/",
    )

    print(
        f"[{datetime.now()}] BOT: ClinicalTrials refresh complete — "
        f"{updated_count} updates, {new_count} new"
    )


if __name__ == "__main__":
    run()

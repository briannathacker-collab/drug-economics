"""
Bot 7 — FDA Biosimilar Approval Monitor
Checks for new biosimilar approvals and status changes weekly.
Updates the Pipeline Watch and Generic Gap apps.
"""

import json
from datetime import datetime, timedelta
from pathlib import Path

import httpx

from lib.changelog import log_update
from lib.validate import validate_biosimilar_pipeline

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

# FDA Purple Book API for biosimilar products
PURPLE_BOOK_URL = "https://purplebooksearch.fda.gov/api/v1/products"
# openFDA as fallback
OPENFDA_URL = "https://api.fda.gov/drug/drugsfda.json"


def fetch_purple_book_updates() -> list[dict]:
    """Fetch recent biosimilar entries from FDA Purple Book."""
    try:
        res = httpx.get(
            PURPLE_BOOK_URL,
            params={
                "type": "biosimilar",
                "limit": 50,
            },
            timeout=30,
        )
        if res.status_code == 200:
            return res.json().get("results", [])
    except Exception as e:
        print(f"  Purple Book fetch error: {e}")

    # Fallback to openFDA
    try:
        week_ago = (datetime.now() - timedelta(days=7)).strftime("%Y%m%d")
        res = httpx.get(
            OPENFDA_URL,
            params={
                "search": (
                    "submissions.submission_type:BLA"
                    f"+AND+submissions.submission_status_date:[{week_ago}+TO+99991231]"
                ),
                "limit": 20,
            },
            timeout=30,
        )
        if res.status_code == 200:
            return res.json().get("results", [])
    except Exception as e:
        print(f"  openFDA BLA fallback error: {e}")

    return []


def run():
    print(f"[{datetime.now()}] BOT: Biosimilar monitor starting...")

    bio_path = DATA_DIR / "biosimilar_pipeline.json"
    if not bio_path.exists():
        print("ERROR: biosimilar_pipeline.json not found")
        return

    current = json.loads(bio_path.read_text())

    # Build index of known biosimilars for matching
    known_by_name = {}
    for entry in current:
        for bio in entry.get("biosimilars", []):
            name = bio.get("biosimilar_name", "").lower()
            if name:
                known_by_name[name] = {
                    "parent_entry": entry,
                    "biosimilar": bio,
                }

    # Fetch latest from FDA
    fda_results = fetch_purple_book_updates()
    new_approvals = 0
    status_changes = 0

    for result in fda_results:
        product_name = (
            result.get("proprietary_name")
            or result.get("brand_name")
            or ""
        ).strip()

        if not product_name:
            continue

        name_lower = product_name.lower()
        approval_status = (
            result.get("approval_status")
            or result.get("submissions", [{}])[0].get("submission_status", "")
        )

        if name_lower in known_by_name:
            # Check for status changes
            bio = known_by_name[name_lower]["biosimilar"]
            old_status = bio.get("status", "")
            new_status = ""

            if "approved" in str(approval_status).lower():
                new_status = "approved"
            elif "tentative" in str(approval_status).lower():
                new_status = "tentative_approval"
            elif "filed" in str(approval_status).lower():
                new_status = "filed"

            if new_status and new_status != old_status:
                bio["status"] = new_status
                bio["status_date"] = datetime.today().strftime("%Y-%m-%d")
                status_changes += 1

                ref_drug = known_by_name[name_lower]["parent_entry"].get("drug_name", "")
                log_update(
                    drug_name=product_name,
                    manufacturer=result.get("applicant", ""),
                    source="FDA Purple Book",
                    update_type="BIOSIMILAR_STATUS_CHANGE",
                    description=(
                        f"Biosimilar {product_name} (ref: {ref_drug}) "
                        f"status: {old_status} -> {new_status}"
                    ),
                    source_url="https://purplebooksearch.fda.gov/",
                )
                print(f"  Status change: {product_name} {old_status} -> {new_status}")
        else:
            # Potentially a new biosimilar we don't track yet
            if "approved" in str(approval_status).lower():
                new_approvals += 1
                log_update(
                    drug_name=product_name,
                    manufacturer=result.get("applicant", ""),
                    source="FDA Purple Book",
                    update_type="NEW_BIOSIMILAR",
                    description=f"New biosimilar detected: {product_name} — needs manual data enrichment",
                    source_url="https://purplebooksearch.fda.gov/",
                )
                print(f"  New biosimilar detected: {product_name} (needs enrichment)")

    # Validate and write
    validate_biosimilar_pipeline(current)
    bio_path.write_text(json.dumps(current, indent=2))

    log_update(
        drug_name="ALL",
        manufacturer="ALL",
        source="FDA Purple Book",
        update_type="WEEKLY_REFRESH",
        description=(
            f"Biosimilar pipeline refreshed "
            f"({status_changes} status changes, {new_approvals} new detections)"
        ),
        source_url="https://purplebooksearch.fda.gov/",
    )

    print(
        f"[{datetime.now()}] BOT: Biosimilar monitor complete — "
        f"{status_changes} status changes, {new_approvals} new"
    )


if __name__ == "__main__":
    run()

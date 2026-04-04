"""
Bot 4 — IRA Negotiated Price Monitor
Checks for updates to CMS's IRA Maximum Fair Price list.
These are the most politically significant numbers on the site —
they show what Medicare actually negotiated vs. what manufacturers charge.
"""

import json
from datetime import datetime
from pathlib import Path

import httpx

from lib.changelog import log_update

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

# CMS publishes IRA negotiated prices here
IRA_PAGE_URL = "https://www.cms.gov/inflation-reduction-act-and-medicare/medicare-drug-price-negotiation"
# Direct PDF link (when available)
IRA_PDF_URL = "https://www.cms.gov/files/document/ira-negotiated-prices.pdf"


def fetch_ira_page_for_updates() -> bool:
    """Check the CMS IRA page for new announcements. Returns True if changes detected."""
    try:
        res = httpx.get(IRA_PAGE_URL, follow_redirects=True, timeout=30)
        if res.status_code != 200:
            print(f"  CMS IRA page returned {res.status_code}")
            return False

        # Look for date indicators of new content
        # CMS typically updates this page when new MFPs are announced
        text = res.text.lower()
        current_year = str(datetime.now().year)

        # Simple heuristic: check if page mentions recent dates
        if f"maximum fair price" in text and current_year in text:
            return True
        return False
    except Exception as e:
        print(f"  CMS IRA page fetch error: {e}")
        return False


def compute_ira_savings(data: list[dict]) -> list[dict]:
    """For each IRA drug, compute discount vs WAC and annual patient savings."""
    wac_path = DATA_DIR / "wac_prices.json"
    wac_data = json.loads(wac_path.read_text()) if wac_path.exists() else []
    wac_by_name = {d.get("drug_name", "").lower(): d for d in wac_data}

    for drug in data:
        drug_name_lower = drug.get("drug_name", "").lower()
        mfp_cents = drug.get("mfp_cents")
        wac_cents = drug.get("wac_cents")

        # Try to pull WAC from our data if not in IRA data
        if not wac_cents and drug_name_lower in wac_by_name:
            wac_cents = wac_by_name[drug_name_lower].get("wac_monthly", 0)
            drug["wac_cents"] = wac_cents
            drug["wac_source"] = "wac_prices.json"

        # Compute the most powerful comparison on the site:
        # "Medicare negotiated $X. You pay $Y. The difference is $Z."
        if mfp_cents and wac_cents and wac_cents > 0:
            drug["discount_vs_wac_pct"] = round(
                (wac_cents - mfp_cents) / wac_cents * 100, 1
            )
            drug["patient_annual_savings_cents"] = (wac_cents - mfp_cents) * 12
        else:
            drug["discount_vs_wac_pct"] = None
            drug["patient_annual_savings_cents"] = None

    return data


def run():
    print(f"[{datetime.now()}] BOT: IRA price monitor starting...")

    ira_path = DATA_DIR / "ira_negotiated.json"

    # Load existing IRA data or initialize empty
    if ira_path.exists():
        current = json.loads(ira_path.read_text())
    else:
        current = []
        print("  No existing IRA data — will create on first update")

    # Check for page updates
    has_updates = fetch_ira_page_for_updates()
    if has_updates:
        print("  CMS IRA page may have new content — flagging for review")
        log_update(
            drug_name="ALL",
            manufacturer="CMS",
            source="IRA/CMS",
            update_type="IRA_PAGE_UPDATE",
            description="CMS IRA negotiation page has new content — manual review recommended",
            source_url=IRA_PAGE_URL,
        )

    # Recompute savings for all IRA drugs (even without new prices,
    # WAC may have changed from bot_wac_monitor)
    if current:
        current = compute_ira_savings(current)
        ira_path.write_text(json.dumps(current, indent=2))

        # Log summary
        drugs_with_savings = [d for d in current if d.get("discount_vs_wac_pct")]
        if drugs_with_savings:
            avg_discount = sum(d["discount_vs_wac_pct"] for d in drugs_with_savings) / len(drugs_with_savings)
            print(f"  {len(drugs_with_savings)} IRA drugs with computed savings (avg discount: {avg_discount:.1f}%)")

    # NOTE: IRA prices for the first 10 drugs took effect Jan 1, 2026
    # Next batch (15 drugs) announced 2025, effective 2027
    # This bot checks for new announcements and new effective dates

    log_update(
        drug_name="ALL",
        manufacturer="CMS",
        source="IRA/CMS",
        update_type="MONTHLY_CHECK",
        description=f"IRA negotiated price monthly check complete ({len(current)} drugs tracked)",
        source_url=IRA_PAGE_URL,
    )

    print(f"[{datetime.now()}] BOT: IRA price monitor complete")


if __name__ == "__main__":
    run()

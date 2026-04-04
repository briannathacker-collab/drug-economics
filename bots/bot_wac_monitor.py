"""
Bot 2 — WAC Price Increase Monitor
The most important bot. Detects WAC price increases by cross-referencing
multiple sources. Most increases happen Jan 1 and July 1 — runs weekly
so nothing slips through.

Three-source detection approach: only logs a price increase when confirmed
by at least 2 of 3 sources to prevent false positives.
"""

import json
import re
from datetime import datetime
from pathlib import Path

import httpx

from lib.changelog import log_update
from lib.notify import send_price_increase_alert

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

# Source 1: California HCAI WAC dataset (updated quarterly)
# Uses CHHS open data API — Socrata-based
HCAI_API_BASE = "https://data.chhs.ca.gov/api/3/action/datastore_search"

# Source 2: CMS Drug Spending Dashboard
CMS_SPENDING_URL = "https://data.cms.gov/provider-data/api/1/datastore/query/mu2r-ecim/0"

# Source 3: SEC EDGAR full-text search for WAC increase disclosures
EDGAR_EFTS_URL = "https://efts.sec.gov/LATEST/search-index"


def fetch_hcai_wac(drug_name: str) -> int | None:
    """Query California HCAI for latest WAC price. Returns cents or None."""
    try:
        res = httpx.get(
            HCAI_API_BASE,
            params={
                "q": drug_name,
                "limit": 5,
            },
            timeout=15,
        )
        if res.status_code != 200:
            return None
        data = res.json()
        records = data.get("result", {}).get("records", [])
        for rec in records:
            wac_str = str(rec.get("WAC_Unit_Price") or rec.get("wac_price") or "")
            wac_str = wac_str.replace("$", "").replace(",", "").strip()
            if wac_str:
                try:
                    return int(float(wac_str) * 100)
                except (ValueError, TypeError):
                    continue
    except Exception as e:
        print(f"  HCAI fetch error for {drug_name}: {e}")
    return None


def fetch_cms_wac(ndc: str) -> int | None:
    """Query CMS Drug Spending data for WAC price. Returns cents or None."""
    try:
        res = httpx.get(
            CMS_SPENDING_URL,
            params={
                "filter[ndc]": ndc,
                "limit": 1,
                "sort": "-year",
            },
            timeout=15,
        )
        if res.status_code != 200:
            return None
        results = res.json().get("results", [])
        if results:
            cost_str = str(results[0].get("avg_cost_per_unit") or "")
            cost_str = cost_str.replace("$", "").replace(",", "").strip()
            if cost_str:
                return int(float(cost_str) * 100)
    except Exception as e:
        print(f"  CMS fetch error for NDC {ndc}: {e}")
    return None


def search_edgar_wac_increase(drug_name: str) -> dict | None:
    """Search SEC EDGAR full-text for recent WAC increase disclosures."""
    try:
        res = httpx.get(
            "https://efts.sec.gov/LATEST/search-index",
            params={
                "q": f'"{drug_name}" AND ("WAC increase" OR "list price increase")',
                "dateRange": "custom",
                "startdt": datetime.now().strftime("%Y-01-01"),
                "enddt": datetime.now().strftime("%Y-%m-%d"),
                "forms": "10-K,10-Q,8-K",
            },
            headers={"User-Agent": "DrugEconomics contact@drugeconomics.com"},
            timeout=15,
        )
        if res.status_code != 200:
            return None
        hits = res.json().get("hits", {}).get("hits", [])
        if hits:
            # Found a filing mentioning WAC increase for this drug
            return {"source": "SEC_EDGAR", "filing_count": len(hits)}
    except Exception as e:
        print(f"  EDGAR search error for {drug_name}: {e}")
    return None


def update_wac_data(confirmed_increases: list[dict]):
    """Write confirmed price increases to wac_prices.json and log them."""
    wac_path = DATA_DIR / "wac_prices.json"
    wac_data = json.loads(wac_path.read_text()) if wac_path.exists() else []
    wac_by_name = {d.get("drug_name", "").lower(): d for d in wac_data}

    for inc in confirmed_increases:
        key = inc["drug_name"].lower()
        if key in wac_by_name:
            drug = wac_by_name[key]
            drug["wac_monthly"] = inc["new_wac_cents"]
            drug["wac_per_unit"] = inc["new_wac_cents"]
            drug["wac_annual"] = inc["new_wac_cents"] * 12
            drug["wac_confirmed_by"] = inc["confirmed_by"]
            drug["wac_confidence"] = inc["confidence"]
            drug["wac_last_verified"] = inc["detected_date"]
            drug["effective_date"] = inc["detected_date"]

        log_update(
            drug_name=inc["drug_name"],
            manufacturer=inc["manufacturer"],
            source="WAC Monitor",
            update_type="PRICE_INCREASE",
            description=(
                f"WAC increased {inc['pct_increase']}% "
                f"(confirmed by: {', '.join(inc['confirmed_by'])})"
            ),
            prev=inc["old_wac_cents"],
            new=inc["new_wac_cents"],
            pct=inc["pct_increase"],
        )

    wac_path.write_text(json.dumps(wac_data, indent=2))


def run():
    print(f"[{datetime.now()}] BOT: WAC monitor starting...")

    wac_path = DATA_DIR / "wac_prices.json"
    if not wac_path.exists():
        print("ERROR: wac_prices.json not found")
        return

    current_wac = json.loads(wac_path.read_text())
    confirmed_increases = []

    for drug in current_wac:
        drug_name = drug.get("drug_name", "")
        current_wac_cents = drug.get("wac_monthly", 0)
        ndc = drug.get("ndc", "")

        if not current_wac_cents:
            continue

        # Source 1: Check HCAI
        hcai_wac = fetch_hcai_wac(drug_name)

        # Source 2: Check CMS dashboard
        cms_wac = fetch_cms_wac(ndc) if ndc else None

        # Source 3: Search EDGAR for recent press releases
        edgar_increase = search_edgar_wac_increase(drug_name)

        # Require 2-of-3 confirmation
        sources_confirming = []
        new_wac_cents = None

        if hcai_wac and hcai_wac > current_wac_cents * 1.001:
            sources_confirming.append(("HCAI", hcai_wac))
            new_wac_cents = hcai_wac

        if cms_wac and cms_wac > current_wac_cents * 1.001:
            sources_confirming.append(("CMS", cms_wac))
            new_wac_cents = cms_wac

        if edgar_increase:
            sources_confirming.append(("SEC_EDGAR", None))

        if len(sources_confirming) >= 2 and new_wac_cents:
            pct = round((new_wac_cents - current_wac_cents) / current_wac_cents * 100, 1)
            increase = {
                "drug_name": drug_name,
                "manufacturer": drug.get("manufacturer_id", "Unknown"),
                "old_wac_cents": current_wac_cents,
                "new_wac_cents": new_wac_cents,
                "pct_increase": pct,
                "confirmed_by": [s[0] for s in sources_confirming],
                "detected_date": datetime.today().strftime("%Y-%m-%d"),
                "confidence": "high" if len(sources_confirming) == 3 else "medium",
            }
            confirmed_increases.append(increase)
            print(
                f"  INCREASE CONFIRMED: {drug_name} +{pct}% "
                f"(sources: {[s[0] for s in sources_confirming]})"
            )

    # Update data and send alerts
    if confirmed_increases:
        update_wac_data(confirmed_increases)
        major = [i for i in confirmed_increases if i["pct_increase"] >= 5.0]
        if major:
            send_price_increase_alert(major)

    print(
        f"[{datetime.now()}] BOT: WAC monitor complete — "
        f"{len(confirmed_increases)} increases confirmed"
    )


if __name__ == "__main__":
    run()

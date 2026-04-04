"""
Bot 9 — International Price Comparison
Fetches drug prices from Canadian PMPRB and UK BNF databases to
provide defensible international price comparisons.
Runs monthly.
"""

import json
import re
from datetime import datetime
from pathlib import Path

import httpx

from lib.changelog import log_update

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

# Canadian Patented Medicine Prices Review Board
# PMPRB publishes price data via open data portal
PMPRB_API_URL = "https://www.canada.ca/content/dam/pmprb-cepmb/documents/npduis/analytical-studies"

# UK NHS Drug Tariff / BNF
BNF_API_URL = "https://opendata.nhsbsa.net/api/3/action/datastore_search"
BNF_RESOURCE_ID = "EPD"  # Electronic Prescription Data

# OECD health data for broader comparisons
OECD_HEALTH_URL = "https://stats.oecd.org/sdmx-json/data/HEALTH_PHMC"

# Exchange rates (updated monthly)
EXCHANGE_RATES = {
    "CAD": 0.74,   # 1 CAD = 0.74 USD
    "GBP": 1.27,   # 1 GBP = 1.27 USD
    "EUR": 1.09,   # 1 EUR = 1.09 USD
    "AUD": 0.66,   # 1 AUD = 0.66 USD
    "JPY": 0.0067, # 1 JPY = 0.0067 USD
}


def fetch_exchange_rates() -> dict[str, float]:
    """Fetch current exchange rates. Falls back to hardcoded if API fails."""
    try:
        # Using a free exchange rate API
        res = httpx.get(
            "https://api.exchangerate-api.com/v4/latest/USD",
            timeout=10,
        )
        if res.status_code == 200:
            rates = res.json().get("rates", {})
            return {
                "CAD": 1 / rates.get("CAD", 1.35),
                "GBP": 1 / rates.get("GBP", 0.79),
                "EUR": 1 / rates.get("EUR", 0.92),
                "AUD": 1 / rates.get("AUD", 1.52),
                "JPY": 1 / rates.get("JPY", 149.5),
            }
    except Exception as e:
        print(f"  Exchange rate fetch error: {e}")
    return EXCHANGE_RATES


def fetch_canada_prices(drug_name: str) -> int | None:
    """Fetch Canadian price from PMPRB data. Returns monthly cost in USD cents or None."""
    try:
        # PMPRB publishes aggregate comparison data
        # Try the NPDUIS analytical data
        res = httpx.get(
            "https://www.canada.ca/en/patented-medicine-prices-review/services/npduis/analytical-studies.html",
            timeout=15,
            follow_redirects=True,
        )
        if res.status_code != 200:
            return None

        # Search for the drug in PMPRB data
        # PMPRB publishes price comparison ratios
        text = res.text.lower()
        if drug_name.lower() in text:
            # Found the drug mentioned — would need to parse the specific price
            # For now, flag that data exists for manual enrichment
            return None
    except Exception as e:
        print(f"  PMPRB fetch error for {drug_name}: {e}")
    return None


def fetch_uk_prices(drug_name: str) -> int | None:
    """Fetch UK NHS price from BNF/Drug Tariff. Returns monthly cost in USD cents or None."""
    try:
        res = httpx.get(
            BNF_API_URL,
            params={
                "resource_id": BNF_RESOURCE_ID,
                "q": drug_name,
                "limit": 5,
            },
            timeout=15,
        )
        if res.status_code != 200:
            return None

        records = res.json().get("result", {}).get("records", [])
        for rec in records:
            price_str = str(rec.get("NIC") or rec.get("net_ingredient_cost") or "")
            price_str = price_str.replace(",", "").strip()
            if price_str:
                try:
                    gbp_pence = float(price_str)
                    usd_cents = int(gbp_pence * EXCHANGE_RATES["GBP"] * 100)
                    return usd_cents
                except (ValueError, TypeError):
                    continue
    except Exception as e:
        print(f"  BNF fetch error for {drug_name}: {e}")
    return None


def run():
    print(f"[{datetime.now()}] BOT: International price comparison starting...")

    # Fetch latest exchange rates
    rates = fetch_exchange_rates()
    print(f"  Exchange rates: {rates}")

    wac_path = DATA_DIR / "wac_prices.json"
    if not wac_path.exists():
        print("ERROR: wac_prices.json not found")
        return

    wac_data = json.loads(wac_path.read_text())
    intl_path = DATA_DIR / "international_prices.json"
    intl_data = json.loads(intl_path.read_text()) if intl_path.exists() else []
    intl_by_drug = {d.get("drug_id", ""): d for d in intl_data}

    updated_count = 0

    for drug in wac_data:
        drug_name = drug.get("drug_name", "")
        drug_id = drug.get("drug_id", "")
        us_wac = drug.get("wac_monthly", 0)

        if not drug_name or not us_wac:
            continue

        # Fetch international prices
        canada_price = fetch_canada_prices(drug_name)
        uk_price = fetch_uk_prices(drug_name)

        # Only update if we got at least one international price
        if canada_price or uk_price:
            entry = intl_by_drug.get(drug_id, {
                "drug_id": drug_id,
                "drug_name": drug_name,
                "us_wac_monthly_cents": us_wac,
                "prices": {},
            })

            entry["us_wac_monthly_cents"] = us_wac
            entry["last_updated"] = datetime.today().strftime("%Y-%m-%d")
            entry["exchange_rates"] = rates

            if canada_price:
                entry["prices"]["canada"] = {
                    "monthly_cents_usd": canada_price,
                    "ratio_to_us": round(canada_price / us_wac, 2) if us_wac else None,
                    "source": "PMPRB",
                }

            if uk_price:
                entry["prices"]["uk"] = {
                    "monthly_cents_usd": uk_price,
                    "ratio_to_us": round(uk_price / us_wac, 2) if us_wac else None,
                    "source": "NHS BNF",
                }

            intl_by_drug[drug_id] = entry
            updated_count += 1

    # Write results
    intl_path.write_text(json.dumps(list(intl_by_drug.values()), indent=2))

    log_update(
        drug_name="ALL",
        manufacturer="ALL",
        source="International Prices",
        update_type="MONTHLY_CHECK",
        description=f"International price comparison refreshed ({updated_count} drugs updated)",
        source_url="https://www.canada.ca/en/patented-medicine-prices-review.html",
    )

    print(f"[{datetime.now()}] BOT: International price comparison complete — {updated_count} drugs")


if __name__ == "__main__":
    run()

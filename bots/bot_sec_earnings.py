"""
Bot 5 — SEC Earnings Refresh
After each quarterly earnings window, refreshes manufacturer financial data.
Updates revenue, profit margins, R&D spend, and recalculates the
manufacturer profit figures shown on cards.

Uses SEC EDGAR API (no API key needed, just a user-agent header).
"""

from __future__ import annotations

import json
import re
from datetime import datetime
from pathlib import Path

import httpx

from lib.changelog import log_update
from lib.validate import validate_manufacturer_financials

DATA_DIR = Path(__file__).resolve().parent.parent / "data"

# SEC EDGAR company filings API
EDGAR_SUBMISSIONS_URL = "https://data.sec.gov/submissions/CIK{cik}.json"
EDGAR_COMPANY_FACTS_URL = "https://data.sec.gov/api/xbrl/companyfacts/CIK{cik}.json"

# Map tickers to CIK numbers (10-digit zero-padded)
MANUFACTURER_CIKS = {
    "ABBV": "0001551152",
    "MRK": "0000310158",
    "PFE": "0000078003",
    "NVO": "0000353278",
    "BMY": "0000014272",
    "SNY": "0001121404",
    "JNJ": "0000200406",
    "LLY": "0000059478",
    "AZN": "0000901832",
    "NVS": "0001114448",
    "AMGN": "0000318154",
    "GILD": "0000882095",
    "REGN": "0000872589",
    "BIIB": "0000875045",
    "CVS": "0000064803",
    "UNH": "0000731766",
    "CI": "0001739940",
    "ELV": "0001156039",
}

HEADERS = {"User-Agent": "DrugEconomics contact@drugeconomics.com"}


def fetch_company_facts(cik: str) -> dict | None:
    """Fetch XBRL company facts from SEC EDGAR."""
    try:
        url = EDGAR_COMPANY_FACTS_URL.format(cik=cik)
        res = httpx.get(url, headers=HEADERS, timeout=30)
        if res.status_code != 200:
            return None
        return res.json()
    except Exception as e:
        print(f"  EDGAR facts fetch error for CIK {cik}: {e}")
        return None


def extract_latest_financials(facts: dict, ticker: str) -> dict | None:
    """Extract latest quarterly financials from XBRL company facts."""
    us_gaap = facts.get("facts", {}).get("us-gaap", {})
    if not us_gaap:
        return None

    def get_latest_value(concept: str) -> tuple[int | None, str | None]:
        """Get most recent quarterly value for a concept. Returns (cents, period)."""
        data = us_gaap.get(concept, {}).get("units", {}).get("USD", [])
        if not data:
            return None, None
        # Filter to quarterly filings (10-Q form)
        quarterly = [
            d for d in data
            if d.get("form") == "10-Q" and d.get("val") is not None
        ]
        if not quarterly:
            return None, None
        # Sort by end date, most recent first
        quarterly.sort(key=lambda x: x.get("end", ""), reverse=True)
        latest = quarterly[0]
        # SEC reports in dollars, we store in cents
        val_cents = int(latest["val"] * 100) if latest["val"] else None
        return val_cents, latest.get("end")

    revenue, rev_period = get_latest_value("Revenues") or get_latest_value("RevenueFromContractWithCustomerExcludingAssessedTax")
    if not revenue:
        revenue, rev_period = get_latest_value("SalesRevenueNet")

    net_income, _ = get_latest_value("NetIncomeLoss")
    rd_expense, _ = get_latest_value("ResearchAndDevelopmentExpense")
    gross_profit, _ = get_latest_value("GrossProfit")

    if not revenue:
        return None

    # Determine quarter from period end date
    quarter = None
    year = None
    if rev_period:
        try:
            end_date = datetime.strptime(rev_period, "%Y-%m-%d")
            year = end_date.year
            month = end_date.month
            quarter = (month - 1) // 3 + 1
        except ValueError:
            pass

    gross_margin_pct = None
    if gross_profit and revenue and revenue > 0:
        gross_margin_pct = round(gross_profit / revenue * 100, 1)

    return {
        "year": year,
        "quarter": quarter,
        "net_revenue_cents": revenue,
        "net_income_cents": net_income,
        "rd_expense_cents": rd_expense,
        "gross_margin_pct": gross_margin_pct,
        "period_end": rev_period,
        "filing_source": "SEC EDGAR XBRL",
    }


def run():
    print(f"[{datetime.now()}] BOT: SEC earnings refresh starting...")

    financials_path = DATA_DIR / "manufacturer_financials.json"
    if not financials_path.exists():
        print("ERROR: manufacturer_financials.json not found")
        return

    current = json.loads(financials_path.read_text())
    current_by_ticker = {}
    for mfr in current:
        ticker = mfr.get("ticker", "")
        if ticker:
            current_by_ticker[ticker] = mfr

    updated_count = 0

    for ticker, cik in MANUFACTURER_CIKS.items():
        if ticker not in current_by_ticker:
            continue

        facts = fetch_company_facts(cik)
        if not facts:
            print(f"  No EDGAR data for {ticker}")
            continue

        financials = extract_latest_financials(facts, ticker)
        if not financials:
            print(f"  Could not extract financials for {ticker}")
            continue

        mfr = current_by_ticker[ticker]

        # Check if this is new data
        existing_annual = mfr.get("annual", [])
        if existing_annual:
            latest_existing = existing_annual[-1]
            # Skip if we already have this period
            if (
                latest_existing.get("year") == financials["year"]
                and latest_existing.get("quarter") == financials["quarter"]
            ):
                continue

        # Add new quarterly data
        if "annual" not in mfr:
            mfr["annual"] = []
        mfr["annual"].append(financials)
        updated_count += 1

        q_label = f"Q{financials['quarter']}" if financials.get("quarter") else "?"
        year_label = financials.get("year", "?")

        log_update(
            drug_name="N/A",
            manufacturer=mfr.get("manufacturer", ticker),
            source="SEC 10-Q",
            update_type="QUARTERLY_REFRESH",
            description=f"{mfr.get('manufacturer', ticker)} {q_label} {year_label} earnings filed",
            source_url=f"https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK={cik}&type=10-Q",
        )

        print(f"  Updated {ticker}: {q_label} {year_label}")

    # Validate and write
    validate_manufacturer_financials(current)
    financials_path.write_text(json.dumps(current, indent=2))

    print(f"[{datetime.now()}] BOT: SEC earnings refresh complete — {updated_count} manufacturers updated")


if __name__ == "__main__":
    run()

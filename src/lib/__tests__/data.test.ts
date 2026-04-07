import { describe, it, expect } from 'vitest';
import {
  getManufacturerCards,
  getSummaryMetrics,
  getCogsForDrug,
  getDrugById,
  getHistoryForDrug,
  getManufacturerById,
  getDrugsByManufacturer,
  getPatentForDrug,
  getDelayTacticsForDrug,
  getLatestChangelogDate,
} from '@/lib/data';

// -------------------------------------------------------------------
// getManufacturerCards
// -------------------------------------------------------------------
describe('getManufacturerCards', () => {
  it('returns an array of manufacturer cards', () => {
    const cards = getManufacturerCards();
    expect(Array.isArray(cards)).toBe(true);
    expect(cards.length).toBeGreaterThan(0);
  });

  it('returns the correct count of manufacturers', () => {
    const cards = getManufacturerCards();
    // Should match the 21 manufacturers in manufacturer_financials.json
    expect(cards.length).toBe(21);
  });

  it('each card has required fields', () => {
    const cards = getManufacturerCards();
    for (const card of cards) {
      expect(card.manufacturer_id).toBeTruthy();
      expect(card.name).toBeTruthy();
      expect(card.ticker).toBeTruthy();
      expect(typeof card.revenue).toBe('number');
      expect(typeof card.net_income).toBe('number');
      expect(typeof card.rd_spend).toBe('number');
      expect(typeof card.gross_margin).toBe('number');
      expect(Array.isArray(card.drugs)).toBe(true);
    }
  });

  it('each drug card within a manufacturer has correct structure', () => {
    const cards = getManufacturerCards();
    const firstCardWithDrugs = cards.find(c => c.drugs.length > 0);
    expect(firstCardWithDrugs).toBeDefined();

    const drug = firstCardWithDrugs!.drugs[0];
    expect(drug.drug_id).toBeTruthy();
    expect(drug.name).toBeTruthy();
    expect(drug.generic_name).toBeTruthy();
    expect(drug.specialty).toBeTruthy();
    expect(typeof drug.wac_monthly).toBe('number');
    expect(typeof drug.wac_annual).toBe('number');
  });
});

// -------------------------------------------------------------------
// getSummaryMetrics
// -------------------------------------------------------------------
describe('getSummaryMetrics', () => {
  it('returns valid summary metrics object', () => {
    const metrics = getSummaryMetrics();
    expect(metrics).toBeDefined();
    expect(typeof metrics.totalDrugs).toBe('number');
    expect(typeof metrics.totalManufacturers).toBe('number');
    expect(typeof metrics.avgMarkup).toBe('number');
    expect(typeof metrics.maxMarkup).toBe('number');
    expect(typeof metrics.maxMarkupDrug).toBe('string');
    expect(typeof metrics.totalRevenue).toBe('number');
  });

  it('has correct drug and manufacturer counts', () => {
    const metrics = getSummaryMetrics();
    expect(metrics.totalDrugs).toBe(100);
    expect(metrics.totalManufacturers).toBe(21);
  });

  it('avgMarkup is a positive number', () => {
    const metrics = getSummaryMetrics();
    expect(metrics.avgMarkup).toBeGreaterThan(0);
  });

  it('maxMarkup is greater than avgMarkup', () => {
    const metrics = getSummaryMetrics();
    expect(metrics.maxMarkup).toBeGreaterThan(metrics.avgMarkup);
  });

  it('maxMarkupDrug is a non-empty string', () => {
    const metrics = getSummaryMetrics();
    expect(metrics.maxMarkupDrug.length).toBeGreaterThan(0);
  });

  it('totalRevenue is a large positive number (stored in cents)', () => {
    const metrics = getSummaryMetrics();
    expect(metrics.totalRevenue).toBeGreaterThan(0);
  });
});

// -------------------------------------------------------------------
// getCogsForDrug
// -------------------------------------------------------------------
describe('getCogsForDrug', () => {
  it('returns enriched data for humira', () => {
    const cogs = getCogsForDrug('humira');
    expect(cogs).toBeDefined();
    expect(cogs!.drug_id).toBe('humira');
    expect(cogs!.drug_name).toBe('Humira');
  });

  it('normalizes estimate_preferred from estimated_cogs_monthly', () => {
    const cogs = getCogsForDrug('humira');
    expect(cogs).toBeDefined();
    // Humira has estimated_cogs_monthly: 17500 in the data
    // The normalizer should set estimate_preferred if it's missing
    expect(cogs!.estimate_preferred).toBeDefined();
    expect(cogs!.estimate_preferred).toBeGreaterThan(0);
  });

  it('returns undefined for non-existent drug', () => {
    const cogs = getCogsForDrug('non_existent_drug_xyz');
    expect(cogs).toBeUndefined();
  });

  it('returns cogs with estimated_cogs_monthly field', () => {
    const cogs = getCogsForDrug('humira');
    expect(cogs).toBeDefined();
    expect(cogs!.estimated_cogs_monthly).toBeDefined();
    expect(typeof cogs!.estimated_cogs_monthly).toBe('number');
    expect(cogs!.estimated_cogs_monthly).toBeGreaterThan(0);
  });

  it('returns cogs for keytruda', () => {
    const cogs = getCogsForDrug('keytruda');
    expect(cogs).toBeDefined();
    expect(cogs!.drug_id).toBe('keytruda');
    expect(cogs!.estimate_preferred).toBeGreaterThan(0);
  });

  it('returns cogs for eliquis', () => {
    const cogs = getCogsForDrug('eliquis');
    expect(cogs).toBeDefined();
    expect(cogs!.drug_id).toBe('eliquis');
  });
});

// -------------------------------------------------------------------
// getDrugById
// -------------------------------------------------------------------
describe('getDrugById', () => {
  it('returns correct drug for humira', () => {
    const drug = getDrugById('humira');
    expect(drug).toBeDefined();
    expect(drug!.drug_id).toBe('humira');
    expect(drug!.drug_name).toBe('Humira');
    expect(drug!.generic_name).toBe('adalimumab');
    expect(drug!.manufacturer_id).toBe('abbvie');
  });

  it('returns correct drug for keytruda', () => {
    const drug = getDrugById('keytruda');
    expect(drug).toBeDefined();
    expect(drug!.drug_id).toBe('keytruda');
    expect(drug!.drug_name).toBe('Keytruda');
    expect(drug!.manufacturer_id).toBe('merck');
  });

  it('returns undefined for non-existent drug', () => {
    const drug = getDrugById('fake_drug_abc');
    expect(drug).toBeUndefined();
  });

  it('returns drug with valid monetary values', () => {
    const drug = getDrugById('humira');
    expect(drug).toBeDefined();
    expect(drug!.wac_monthly).toBeGreaterThan(0);
    expect(drug!.wac_annual).toBeGreaterThan(0);
    expect(drug!.wac_annual).toBe(drug!.wac_monthly * 12);
  });
});

// -------------------------------------------------------------------
// getHistoryForDrug
// -------------------------------------------------------------------
describe('getHistoryForDrug', () => {
  it('returns price history for humira', () => {
    const history = getHistoryForDrug('humira');
    expect(history).toBeDefined();
    expect(history!.drug_id).toBe('humira');
    expect(Array.isArray(history!.price_history)).toBe(true);
    expect(history!.price_history.length).toBeGreaterThan(0);
  });

  it('price history entries have required fields', () => {
    const history = getHistoryForDrug('humira');
    expect(history).toBeDefined();
    for (const point of history!.price_history) {
      expect(point.date).toBeTruthy();
      expect(typeof point.wac_monthly).toBe('number');
      expect(point.wac_monthly).toBeGreaterThan(0);
      expect(typeof point.change_percent).toBe('number');
    }
  });

  it('returns launch_price and launch_date', () => {
    const history = getHistoryForDrug('humira');
    expect(history).toBeDefined();
    expect(history!.launch_price).toBeGreaterThan(0);
    expect(history!.launch_date).toBeTruthy();
  });

  it('returns total_increase_percent and cagr', () => {
    const history = getHistoryForDrug('humira');
    expect(history).toBeDefined();
    expect(typeof history!.total_increase_percent).toBe('number');
    expect(history!.total_increase_percent).toBeGreaterThan(0);
    expect(typeof history!.cagr).toBe('number');
    expect(history!.cagr).toBeGreaterThan(0);
  });

  it('returns undefined for non-existent drug', () => {
    const history = getHistoryForDrug('fake_drug_abc');
    expect(history).toBeUndefined();
  });

  it('price history is chronologically ordered (ascending dates)', () => {
    const history = getHistoryForDrug('humira');
    expect(history).toBeDefined();
    const dates = history!.price_history.map(p => p.date);
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i] >= dates[i - 1], `Date ${dates[i]} should be >= ${dates[i - 1]}`).toBe(true);
    }
  });
});

// -------------------------------------------------------------------
// getManufacturerById
// -------------------------------------------------------------------
describe('getManufacturerById', () => {
  it('returns correct manufacturer for abbvie', () => {
    const mfr = getManufacturerById('abbvie');
    expect(mfr).toBeDefined();
    expect(mfr!.manufacturer_id).toBe('abbvie');
    expect(mfr!.name).toBeTruthy();
    expect(mfr!.ticker).toBeTruthy();
  });

  it('returns undefined for non-existent manufacturer', () => {
    const mfr = getManufacturerById('fake_manufacturer');
    expect(mfr).toBeUndefined();
  });
});

// -------------------------------------------------------------------
// getDrugsByManufacturer
// -------------------------------------------------------------------
describe('getDrugsByManufacturer', () => {
  it('returns multiple drugs for abbvie', () => {
    const drugs = getDrugsByManufacturer('abbvie');
    expect(drugs.length).toBeGreaterThan(0);
    for (const drug of drugs) {
      expect(drug.manufacturer_id).toBe('abbvie');
    }
  });

  it('returns empty array for non-existent manufacturer', () => {
    const drugs = getDrugsByManufacturer('fake_manufacturer');
    expect(drugs.length).toBe(0);
  });
});

// -------------------------------------------------------------------
// getPatentForDrug
// -------------------------------------------------------------------
describe('getPatentForDrug', () => {
  it('returns patent data for a drug with patents', () => {
    const patent = getPatentForDrug('humira');
    if (patent) {
      expect(patent.drug_id).toBe('humira');
      expect(patent.drug_name).toBeTruthy();
      expect(patent.original_patent_expiry).toBeTruthy();
    }
  });

  it('returns undefined for non-existent drug', () => {
    const patent = getPatentForDrug('fake_drug_abc');
    expect(patent).toBeUndefined();
  });
});

// -------------------------------------------------------------------
// getDelayTacticsForDrug
// -------------------------------------------------------------------
describe('getDelayTacticsForDrug', () => {
  it('returns delay tactics for a drug that has them', () => {
    const tactics = getDelayTacticsForDrug('humira');
    if (tactics) {
      expect(tactics.drug_id).toBe('humira');
      expect(Array.isArray(tactics.tactics)).toBe(true);
      expect(tactics.total_delay_years).toBeGreaterThan(0);
    }
  });

  it('returns undefined for non-existent drug', () => {
    const tactics = getDelayTacticsForDrug('fake_drug_abc');
    expect(tactics).toBeUndefined();
  });
});

// -------------------------------------------------------------------
// getLatestChangelogDate
// -------------------------------------------------------------------
describe('getLatestChangelogDate', () => {
  it('returns a non-empty ISO date string', () => {
    const date = getLatestChangelogDate();
    expect(date).toBeTruthy();
    expect(date.length).toBe(10); // YYYY-MM-DD
    // Basic ISO date format check
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

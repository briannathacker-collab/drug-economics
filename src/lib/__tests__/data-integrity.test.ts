import { describe, it, expect } from 'vitest';
import {
  getWacPrices,
  getCogsEstimates,
  getWacHistory,
  getManufacturerFinancials,
  getBiosimilarPipeline,
  getCmsAsp,
  getDrugRevenue,
  getPatents,
  getPipelineTrials,
  getInsurerFinancials,
  getPbmRebates,
  getPremiumHistory,
  getDelayTactics,
  getChangelog,
} from '@/lib/data';

// -------------------------------------------------------------------
// 1. All 14 JSON data files load without error
// -------------------------------------------------------------------
describe('Data file loading', () => {
  it('loads wac_prices.json without error', () => {
    expect(() => getWacPrices()).not.toThrow();
    expect(getWacPrices().length).toBeGreaterThan(0);
  });

  it('loads cogs_estimates.json without error', () => {
    expect(() => getCogsEstimates()).not.toThrow();
    expect(getCogsEstimates().length).toBeGreaterThan(0);
  });

  it('loads wac_history.json without error', () => {
    expect(() => getWacHistory()).not.toThrow();
    expect(getWacHistory().length).toBeGreaterThan(0);
  });

  it('loads manufacturer_financials.json without error', () => {
    expect(() => getManufacturerFinancials()).not.toThrow();
    expect(getManufacturerFinancials().length).toBeGreaterThan(0);
  });

  it('loads biosimilar_pipeline.json without error', () => {
    expect(() => getBiosimilarPipeline()).not.toThrow();
    expect(getBiosimilarPipeline().length).toBeGreaterThan(0);
  });

  it('loads cms_asp.json without error', () => {
    expect(() => getCmsAsp()).not.toThrow();
    expect(getCmsAsp().length).toBeGreaterThan(0);
  });

  it('loads drug_revenue.json without error', () => {
    expect(() => getDrugRevenue()).not.toThrow();
    expect(getDrugRevenue().length).toBeGreaterThan(0);
  });

  it('loads patents.json without error', () => {
    expect(() => getPatents()).not.toThrow();
    expect(getPatents().length).toBeGreaterThan(0);
  });

  it('loads pipeline_trials.json without error', () => {
    expect(() => getPipelineTrials()).not.toThrow();
    expect(getPipelineTrials().length).toBeGreaterThan(0);
  });

  it('loads insurer_financials.json without error', () => {
    expect(() => getInsurerFinancials()).not.toThrow();
    expect(getInsurerFinancials().length).toBeGreaterThan(0);
  });

  it('loads pbm_rebates.json without error', () => {
    expect(() => getPbmRebates()).not.toThrow();
    expect(getPbmRebates().length).toBeGreaterThan(0);
  });

  it('loads premium_history.json without error', () => {
    expect(() => getPremiumHistory()).not.toThrow();
    expect(getPremiumHistory().length).toBeGreaterThan(0);
  });

  it('loads delay_tactics.json without error', () => {
    expect(() => getDelayTactics()).not.toThrow();
    expect(getDelayTactics().length).toBeGreaterThan(0);
  });

  it('loads changelog.json without error', () => {
    expect(() => getChangelog()).not.toThrow();
    expect(getChangelog().length).toBeGreaterThan(0);
  });
});

// -------------------------------------------------------------------
// 2. Cross-reference integrity
// -------------------------------------------------------------------
describe('Cross-reference integrity', () => {
  it('all drug_ids in wac_prices exist in cogs_estimates', () => {
    const wacDrugIds = getWacPrices().map(d => d.drug_id);
    const cogsDrugIds = new Set(getCogsEstimates().map(c => c.drug_id));

    for (const drugId of wacDrugIds) {
      expect(cogsDrugIds.has(drugId), `drug_id "${drugId}" in wac_prices but missing from cogs_estimates`).toBe(true);
    }
  });

  it('all drug_ids in wac_prices exist in wac_history', () => {
    const wacDrugIds = getWacPrices().map(d => d.drug_id);
    const historyDrugIds = new Set(getWacHistory().map(h => h.drug_id));

    for (const drugId of wacDrugIds) {
      expect(historyDrugIds.has(drugId), `drug_id "${drugId}" in wac_prices but missing from wac_history`).toBe(true);
    }
  });

  it('all manufacturer_ids in wac_prices exist in manufacturer_financials', () => {
    const wacManufacturerIds = new Set(getWacPrices().map(d => d.manufacturer_id));
    const mfrIds = new Set(getManufacturerFinancials().map(m => m.manufacturer_id));

    for (const mfrId of wacManufacturerIds) {
      expect(mfrIds.has(mfrId), `manufacturer_id "${mfrId}" in wac_prices but missing from manufacturer_financials`).toBe(true);
    }
  });

  it('all biosimilar reference_drug_ids exist in wac_prices', () => {
    const wacDrugIds = new Set(getWacPrices().map(d => d.drug_id));
    const biosimilars = getBiosimilarPipeline();
    const refDrugIds = new Set(biosimilars.map(b => b.reference_drug_id));

    for (const refId of refDrugIds) {
      expect(wacDrugIds.has(refId), `biosimilar reference_drug_id "${refId}" not found in wac_prices`).toBe(true);
    }
  });
});

// -------------------------------------------------------------------
// 3. No duplicate drug_ids within files
// -------------------------------------------------------------------
describe('No duplicate drug_ids', () => {
  it('no duplicate drug_ids in wac_prices', () => {
    const drugIds = getWacPrices().map(d => d.drug_id);
    const uniqueIds = new Set(drugIds);
    expect(drugIds.length).toBe(uniqueIds.size);
  });

  it('no duplicate drug_ids in cogs_estimates', () => {
    const drugIds = getCogsEstimates().map(c => c.drug_id);
    const uniqueIds = new Set(drugIds);
    expect(drugIds.length).toBe(uniqueIds.size);
  });

  it('no duplicate drug_ids in wac_history', () => {
    const drugIds = getWacHistory().map(h => h.drug_id);
    const uniqueIds = new Set(drugIds);
    expect(drugIds.length).toBe(uniqueIds.size);
  });

  it('no duplicate manufacturer_ids in manufacturer_financials', () => {
    const mfrIds = getManufacturerFinancials().map(m => m.manufacturer_id);
    const uniqueIds = new Set(mfrIds);
    expect(mfrIds.length).toBe(uniqueIds.size);
  });
});

// -------------------------------------------------------------------
// 4. All monetary values are positive integers (cents)
// -------------------------------------------------------------------
describe('Monetary values are positive integers (cents)', () => {
  it('wac_prices: wac_monthly, wac_annual, and wac_per_unit are positive integers', () => {
    const drugs = getWacPrices();
    for (const drug of drugs) {
      expect(Number.isInteger(drug.wac_monthly), `${drug.drug_id} wac_monthly (${drug.wac_monthly}) is not an integer`).toBe(true);
      expect(drug.wac_monthly).toBeGreaterThan(0);

      expect(Number.isInteger(drug.wac_annual), `${drug.drug_id} wac_annual (${drug.wac_annual}) is not an integer`).toBe(true);
      expect(drug.wac_annual).toBeGreaterThan(0);

      expect(Number.isInteger(drug.wac_per_unit), `${drug.drug_id} wac_per_unit (${drug.wac_per_unit}) is not an integer`).toBe(true);
      expect(drug.wac_per_unit).toBeGreaterThan(0);
    }
  });

  it('cogs_estimates: estimated_cogs_monthly values are positive integers', () => {
    const cogs = getCogsEstimates();
    for (const entry of cogs) {
      if (entry.estimated_cogs_monthly !== undefined) {
        expect(Number.isInteger(entry.estimated_cogs_monthly), `${entry.drug_id} estimated_cogs_monthly (${entry.estimated_cogs_monthly}) is not an integer`).toBe(true);
        expect(entry.estimated_cogs_monthly).toBeGreaterThan(0);
      }
    }
  });

  it('wac_history: launch_price values are positive integers', () => {
    const history = getWacHistory();
    for (const entry of history) {
      expect(Number.isInteger(entry.launch_price), `${entry.drug_id} launch_price (${entry.launch_price}) is not an integer`).toBe(true);
      expect(entry.launch_price).toBeGreaterThan(0);
    }
  });

  it('wac_history: price_history wac_monthly values are positive integers', () => {
    const history = getWacHistory();
    for (const entry of history) {
      for (const point of entry.price_history) {
        expect(Number.isInteger(point.wac_monthly), `${entry.drug_id} price_history wac_monthly (${point.wac_monthly}) is not an integer`).toBe(true);
        expect(point.wac_monthly).toBeGreaterThan(0);
      }
    }
  });
});

// -------------------------------------------------------------------
// 5. wac_monthly * 12 === wac_annual for all drugs
// -------------------------------------------------------------------
describe('WAC annual/monthly consistency', () => {
  // Some drugs (e.g. tepezza) have non-monthly dosing schedules where annual != monthly * 12
  // tepezza: infusion schedule (not monthly). abecma/luxturna: one-time therapies with minor rounding.
  const NON_MONTHLY_DRUGS = new Set(['tepezza', 'abecma', 'luxturna']);

  it('wac_monthly * 12 === wac_annual for standard monthly drugs', () => {
    const drugs = getWacPrices().filter(d => !NON_MONTHLY_DRUGS.has(d.drug_id));
    for (const drug of drugs) {
      expect(
        drug.wac_monthly * 12,
        `${drug.drug_id}: wac_monthly (${drug.wac_monthly}) * 12 = ${drug.wac_monthly * 12} !== wac_annual (${drug.wac_annual})`
      ).toBe(drug.wac_annual);
    }
  });
});

// -------------------------------------------------------------------
// 6. Drug count matches across files
// -------------------------------------------------------------------
describe('Drug counts', () => {
  it('wac_prices contains 100 drugs', () => {
    expect(getWacPrices().length).toBe(100);
  });

  it('cogs_estimates contains 100 drugs', () => {
    expect(getCogsEstimates().length).toBe(100);
  });

  it('wac_history contains 100 drugs', () => {
    expect(getWacHistory().length).toBe(100);
  });

  it('all three files have the same drug count', () => {
    const wacCount = getWacPrices().length;
    const cogsCount = getCogsEstimates().length;
    const historyCount = getWacHistory().length;
    expect(wacCount).toBe(cogsCount);
    expect(wacCount).toBe(historyCount);
  });
});

// -------------------------------------------------------------------
// 7. Structural checks on key fields
// -------------------------------------------------------------------
describe('Structural field checks', () => {
  it('every wac_prices entry has required fields', () => {
    const drugs = getWacPrices();
    for (const drug of drugs) {
      expect(drug.drug_id).toBeTruthy();
      expect(drug.drug_name).toBeTruthy();
      expect(drug.generic_name).toBeTruthy();
      expect(drug.manufacturer_id).toBeTruthy();
      expect(drug.dosage_form).toBeTruthy();
      expect(drug.ndc).toBeTruthy();
    }
  });

  it('every manufacturer_financials entry has required fields', () => {
    const mfrs = getManufacturerFinancials();
    for (const mfr of mfrs) {
      expect(mfr.manufacturer_id).toBeTruthy();
      expect(mfr.name).toBeTruthy();
      expect(mfr.ticker).toBeTruthy();
      expect(Array.isArray(mfr.annual_revenue)).toBe(true);
      expect(mfr.annual_revenue.length).toBeGreaterThan(0);
    }
  });

  it('every wac_history entry has price_history array', () => {
    const history = getWacHistory();
    for (const entry of history) {
      expect(Array.isArray(entry.price_history)).toBe(true);
      expect(entry.price_history.length).toBeGreaterThan(0);
    }
  });

  it('every changelog entry has required fields', () => {
    const changelog = getChangelog();
    for (const entry of changelog) {
      expect(entry.date).toBeTruthy();
      expect(entry.source).toBeTruthy();
      expect(entry.update_type).toBeTruthy();
      expect(entry.drug_name).toBeTruthy();
      expect(entry.description).toBeTruthy();
    }
  });
});

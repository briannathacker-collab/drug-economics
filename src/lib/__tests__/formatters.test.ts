import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatPercent,
  formatMarkup,
  computeMarkupPercent,
  computeAnnualMarkup,
  formatAnnual,
  formatNumber,
  formatCompact,
  centsToAnnual,
  formatDate,
  formatYear,
} from '@/lib/formatters';
import type { CogsEstimate, WacPrice } from '@/lib/types';

// -------------------------------------------------------------------
// formatCurrency — converts cents to display dollars
// -------------------------------------------------------------------
describe('formatCurrency', () => {
  it('formats 0 cents as $0.00', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats 100 cents as $1.00', () => {
    expect(formatCurrency(100)).toBe('$1.00');
  });

  it('formats 1000 cents (= $10.00) with two decimal places', () => {
    expect(formatCurrency(1000)).toBe('$10.00');
  });

  it('formats 100000 cents (= $1,000) with no decimal places (dollars >= 100)', () => {
    // $1,000 >= 100 so no decimals
    expect(formatCurrency(100_00)).toBe('$100');
  });

  it('formats 10000 cents (= $100) with no decimal places', () => {
    expect(formatCurrency(10000)).toBe('$100');
  });

  it('formats 9999 cents (= $99.99) with two decimal places', () => {
    expect(formatCurrency(9999)).toBe('$99.99');
  });

  it('formats large value 1000000000 cents (= $10,000,000) with no decimals', () => {
    expect(formatCurrency(1_000_000_000)).toBe('$10,000,000');
  });

  // Compact mode
  it('compact mode: formats thousands as K', () => {
    // 100000 cents = $1,000 -> $1.0K
    expect(formatCurrency(100_000, true)).toBe('$1.0K');
  });

  it('compact mode: formats millions as M', () => {
    // 100_000_000 cents = $1,000,000 -> $1.0M
    expect(formatCurrency(100_000_000, true)).toBe('$1.0M');
  });

  it('compact mode: formats billions as B', () => {
    // 100_000_000_000 cents = $1,000,000,000 -> $1.0B
    expect(formatCurrency(100_000_000_000, true)).toBe('$1.0B');
  });

  it('compact mode: small values fall through to normal formatting', () => {
    expect(formatCurrency(5000, true)).toBe('$50.00');
  });

  it('compact mode: formats $7,282 as $7.3K', () => {
    // Humira: 728200 cents = $7,282 -> $7.3K
    expect(formatCurrency(728200, true)).toBe('$7.3K');
  });
});

// -------------------------------------------------------------------
// formatPercent
// -------------------------------------------------------------------
describe('formatPercent', () => {
  it('formats with default 1 decimal place', () => {
    expect(formatPercent(82.456)).toBe('82.5%');
  });

  it('formats with 0 decimal places', () => {
    expect(formatPercent(82.456, 0)).toBe('82%');
  });

  it('formats with 2 decimal places', () => {
    expect(formatPercent(82.456, 2)).toBe('82.46%');
  });

  it('formats 0 percent', () => {
    expect(formatPercent(0)).toBe('0.0%');
  });

  it('formats 100 percent', () => {
    expect(formatPercent(100)).toBe('100.0%');
  });

  it('formats negative percent', () => {
    expect(formatPercent(-5.3)).toBe('-5.3%');
  });
});

// -------------------------------------------------------------------
// formatMarkup — (wac - cogs) / cogs * 100, rounded to 0 decimals
// -------------------------------------------------------------------
describe('formatMarkup', () => {
  it('calculates correct markup', () => {
    // COGS = 100, WAC = 500 -> (500-100)/100*100 = 400%
    expect(formatMarkup(100, 500)).toBe('400%');
  });

  it('returns N/A when COGS is 0', () => {
    expect(formatMarkup(0, 500)).toBe('N/A');
  });

  it('returns N/A when COGS is negative', () => {
    expect(formatMarkup(-10, 500)).toBe('N/A');
  });

  it('handles WAC equal to COGS (0% markup)', () => {
    expect(formatMarkup(100, 100)).toBe('0%');
  });

  it('handles typical drug markup (Humira-like: COGS 17500, WAC 728200)', () => {
    // (728200 - 17500) / 17500 * 100 = 4061.1%
    const result = formatMarkup(17500, 728200);
    expect(result).toBe('4061%');
  });

  it('handles WAC less than COGS (negative markup)', () => {
    expect(formatMarkup(500, 100)).toBe('-80%');
  });
});

// -------------------------------------------------------------------
// computeMarkupPercent — returns numeric markup
// -------------------------------------------------------------------
describe('formatCurrency trillion threshold', () => {
  it('renders trillions with T suffix, not inflated billions', () => {
    // 204,254,012,000,000 cents = $2.04 trillion.
    // Previously rendered as "$2042.5B" which is misleading formatting.
    expect(formatCurrency(204_254_012_000_000, true)).toBe('$2.04T');
  });

  it('renders exactly 1 trillion', () => {
    expect(formatCurrency(100_000_000_000_000, true)).toBe('$1.00T');
  });

  it('keeps sub-trillion values in B', () => {
    expect(formatCurrency(99_900_000_000_000, true)).toBe('$999.0B');
  });
});

describe('computeMarkupPercent', () => {
  it('returns 0 when COGS is 0', () => {
    expect(computeMarkupPercent(0, 500)).toBe(0);
  });

  it('returns 0 when COGS is negative', () => {
    expect(computeMarkupPercent(-10, 500)).toBe(0);
  });

  it('computes correct numeric markup', () => {
    expect(computeMarkupPercent(100, 500)).toBe(400);
  });

  it('computes 0 when WAC equals COGS', () => {
    expect(computeMarkupPercent(100, 100)).toBe(0);
  });
});

// -------------------------------------------------------------------
// computeAnnualMarkup — unit-normalized markup from typed records
// -------------------------------------------------------------------
describe('computeAnnualMarkup', () => {
  const humiraWac = {
    drug_id: 'humira',
    wac_monthly: 728200,
    wac_annual: 8738400,
    units_per_month: 1,
  } as unknown as WacPrice;

  it('returns unavailable when either record is missing', () => {
    expect(computeAnnualMarkup(undefined, humiraWac).method).toBe('unavailable');
    expect(computeAnnualMarkup({} as CogsEstimate, undefined).method).toBe('unavailable');
  });

  it('uses annual field when present', () => {
    const cogs = { estimated_cogs_annual: 210000 } as unknown as CogsEstimate;
    const result = computeAnnualMarkup(cogs, humiraWac);
    expect(result.method).toBe('annual');
    expect(result.cogs_annual_cents).toBe(210000);
    expect(result.wac_annual_cents).toBe(8738400);
    // (8738400 - 210000) / 210000 × 100 ≈ 4061.14
    expect(result.percent).toBeCloseTo(4061.14, 1);
  });

  it('falls back to monthly × 12 when annual is missing', () => {
    const cogs = { estimated_cogs_monthly: 17500 } as unknown as CogsEstimate;
    const result = computeAnnualMarkup(cogs, humiraWac);
    expect(result.method).toBe('monthly_x12');
    expect(result.cogs_annual_cents).toBe(210000);
  });

  it('falls back to per_unit × units_per_month × 12 when only per-unit data present', () => {
    const cogs = { estimated_cogs_per_unit: 30 } as unknown as CogsEstimate;
    const wac = { ...humiraWac, units_per_month: 30 } as unknown as WacPrice;
    const result = computeAnnualMarkup(cogs, wac);
    expect(result.method).toBe('per_unit_x_units');
    expect(result.cogs_annual_cents).toBe(30 * 30 * 12);
  });

  it('returns unavailable rather than dividing by zero when cogs fields are empty', () => {
    const cogs = {} as CogsEstimate;
    expect(computeAnnualMarkup(cogs, humiraWac).method).toBe('unavailable');
  });

  it('prefers estimate_preferred over estimated_cogs_monthly', () => {
    const cogs = { estimate_preferred: 20000, estimated_cogs_monthly: 17500 } as unknown as CogsEstimate;
    const result = computeAnnualMarkup(cogs, humiraWac);
    expect(result.cogs_annual_cents).toBe(20000 * 12);
  });
});

// -------------------------------------------------------------------
// formatAnnual — monthly cents * 12, then formatCurrency
// -------------------------------------------------------------------
describe('formatAnnual', () => {
  it('converts monthly to annual and formats', () => {
    // 728200 cents * 12 = 8738400 cents = $87,384
    expect(formatAnnual(728200)).toBe('$87,384');
  });

  it('handles small monthly amounts', () => {
    // 100 cents * 12 = 1200 cents = $12.00
    expect(formatAnnual(100)).toBe('$12.00');
  });
});

// -------------------------------------------------------------------
// formatNumber — comma-separated integer formatting
// -------------------------------------------------------------------
describe('formatNumber', () => {
  it('formats thousands with commas', () => {
    expect(formatNumber(1000)).toBe('1,000');
  });

  it('formats millions with commas', () => {
    expect(formatNumber(1000000)).toBe('1,000,000');
  });

  it('formats small numbers without commas', () => {
    expect(formatNumber(42)).toBe('42');
  });
});

// -------------------------------------------------------------------
// formatCompact — raw number (not cents) with K/M/B suffixes
// -------------------------------------------------------------------
describe('formatCompact', () => {
  it('formats thousands as K', () => {
    expect(formatCompact(1000)).toBe('1.0K');
  });

  it('formats millions as M', () => {
    expect(formatCompact(1000000)).toBe('1.0M');
  });

  it('formats billions as B', () => {
    expect(formatCompact(1000000000)).toBe('1.0B');
  });

  it('leaves small numbers as-is', () => {
    expect(formatCompact(500)).toBe('500');
  });

  it('formats 5280 as 5.3K', () => {
    expect(formatCompact(5280)).toBe('5.3K');
  });
});

// -------------------------------------------------------------------
// centsToAnnual — simple multiplier
// -------------------------------------------------------------------
describe('centsToAnnual', () => {
  it('multiplies monthly cents by 12', () => {
    expect(centsToAnnual(728200)).toBe(8738400);
  });

  it('handles zero', () => {
    expect(centsToAnnual(0)).toBe(0);
  });
});

// -------------------------------------------------------------------
// formatDate — ISO string to "MMM D, YYYY"
// -------------------------------------------------------------------
describe('formatDate', () => {
  it('formats an ISO date string', () => {
    // Use mid-month date to avoid timezone boundary issues
    const result = formatDate('2026-06-15');
    expect(result).toContain('2026');
    expect(result).toContain('Jun');
  });
});

// -------------------------------------------------------------------
// formatYear — extract year from ISO date
// -------------------------------------------------------------------
describe('formatYear', () => {
  it('extracts the year from an ISO date', () => {
    expect(formatYear('2026-03-15')).toBe('2026');
  });

  it('extracts the year from an older date', () => {
    // Use mid-month date to avoid timezone boundary issues
    expect(formatYear('2003-06-15')).toBe('2003');
  });
});

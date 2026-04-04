import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { computeFreshness, formatFreshnessAge } from '@/lib/freshness';

// -------------------------------------------------------------------
// computeFreshness
// We mock Date to control "now" for deterministic tests.
// -------------------------------------------------------------------
describe('computeFreshness', () => {
  beforeEach(() => {
    // Fix "now" to 2026-03-10 (Q1 2026)
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-10T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // ------- Fresh (0-1 quarters old) -------
  it('current quarter data is "Fresh"', () => {
    const result = computeFreshness(2026, 'Q1');
    expect(result.label).toBe('Fresh');
    expect(result.color).toBe('green');
    expect(result.quarters_old).toBe(0);
  });

  it('data from previous quarter (Q4 2025 = 1 quarter ago) is "Fresh"', () => {
    const result = computeFreshness(2025, 'Q4');
    expect(result.label).toBe('Fresh');
    expect(result.color).toBe('green');
    expect(result.quarters_old).toBe(1);
  });

  // ------- Recent (2-3 quarters old) -------
  it('data from 2 quarters ago (Q3 2025) is "Recent"', () => {
    const result = computeFreshness(2025, 'Q3');
    expect(result.label).toBe('Recent');
    expect(result.color).toBe('yellow');
    expect(result.quarters_old).toBe(2);
  });

  it('data from 3 quarters ago (Q2 2025) is "Recent"', () => {
    const result = computeFreshness(2025, 'Q2');
    expect(result.label).toBe('Recent');
    expect(result.color).toBe('yellow');
    expect(result.quarters_old).toBe(3);
  });

  // ------- Stale (4-5 quarters old) -------
  it('data from 4 quarters ago (Q1 2025) is "Stale"', () => {
    const result = computeFreshness(2025, 'Q1');
    expect(result.label).toBe('Stale');
    expect(result.color).toBe('orange');
    expect(result.quarters_old).toBe(4);
  });

  it('data from 5 quarters ago (Q4 2024) is "Stale"', () => {
    const result = computeFreshness(2024, 'Q4');
    expect(result.label).toBe('Stale');
    expect(result.color).toBe('orange');
    expect(result.quarters_old).toBe(5);
  });

  // ------- Outdated (6+ quarters old) -------
  it('data from 6+ quarters ago is "Outdated"', () => {
    const result = computeFreshness(2024, 'Q3');
    expect(result.label).toBe('Outdated');
    expect(result.color).toBe('red');
    expect(result.quarters_old).toBe(6);
  });

  it('very old data (2020 Q1) is "Outdated"', () => {
    const result = computeFreshness(2020, 'Q1');
    expect(result.label).toBe('Outdated');
    expect(result.color).toBe('red');
    expect(result.quarters_old).toBe(24); // 6 years * 4 quarters
  });

  // ------- Unknown (null year) -------
  it('null year returns "Unknown"', () => {
    const result = computeFreshness(null, null);
    expect(result.label).toBe('Unknown');
    expect(result.color).toBe('gray');
    expect(result.quarters_old).toBeNull();
  });

  it('null year with non-null quarter still returns "Unknown"', () => {
    const result = computeFreshness(null, 'Q2');
    expect(result.label).toBe('Unknown');
    expect(result.color).toBe('gray');
    expect(result.quarters_old).toBeNull();
  });

  // ------- Future data -------
  it('future data is treated as "Fresh"', () => {
    const result = computeFreshness(2027, 'Q1');
    expect(result.label).toBe('Fresh');
    expect(result.color).toBe('green');
    expect(result.quarters_old).toBe(0);
  });

  // ------- Null quarter defaults to Q2 -------
  it('null quarter defaults to Q2 for calculation', () => {
    // 2026, null quarter -> defaults to Q2
    // Now is Q1 2026, so Q2 2026 is -1 quarters old (future) -> Fresh
    const result = computeFreshness(2026, null);
    expect(result.label).toBe('Fresh');
    expect(result.color).toBe('green');
    expect(result.quarters_old).toBe(0); // clamped to 0 for future
  });

  it('null quarter with older year defaults to Q2', () => {
    // 2025, null quarter -> defaults to Q2
    // Now is Q1 2026: (2026-2025)*4 + (1-2) = 4 - 1 = 3 quarters old -> "Recent"
    const result = computeFreshness(2025, null);
    expect(result.label).toBe('Recent');
    expect(result.color).toBe('yellow');
    expect(result.quarters_old).toBe(3);
  });
});

// -------------------------------------------------------------------
// formatFreshnessAge
// -------------------------------------------------------------------
describe('formatFreshnessAge', () => {
  it('returns "age unknown" for null', () => {
    expect(formatFreshnessAge(null)).toBe('age unknown');
  });

  it('returns "current quarter" for 0', () => {
    expect(formatFreshnessAge(0)).toBe('current quarter');
  });

  it('returns "1 quarter ago" for 1', () => {
    expect(formatFreshnessAge(1)).toBe('1 quarter ago');
  });

  it('returns "2 quarters ago" for 2', () => {
    expect(formatFreshnessAge(2)).toBe('2 quarters ago');
  });

  it('returns "3 quarters ago" for 3', () => {
    expect(formatFreshnessAge(3)).toBe('3 quarters ago');
  });

  it('returns "1y ago" for 4 quarters', () => {
    expect(formatFreshnessAge(4)).toBe('1y ago');
  });

  it('returns "1y 2q ago" for 6 quarters', () => {
    expect(formatFreshnessAge(6)).toBe('1y 2q ago');
  });

  it('returns "2y ago" for 8 quarters', () => {
    expect(formatFreshnessAge(8)).toBe('2y ago');
  });

  it('returns "6y ago" for 24 quarters', () => {
    expect(formatFreshnessAge(24)).toBe('6y ago');
  });

  it('returns "6y 1q ago" for 25 quarters', () => {
    expect(formatFreshnessAge(25)).toBe('6y 1q ago');
  });
});

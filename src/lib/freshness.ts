import type { FreshnessResult } from '@/lib/types';

/**
 * Convert a quarter string like "Q1" to a numeric value (1-4).
 */
function quarterToNum(q: string | null): number | null {
  if (!q) return null;
  const match = q.match(/Q(\d)/i);
  return match ? parseInt(match[1], 10) : null;
}

/**
 * Get the current fiscal quarter (1-4) from today's date.
 */
function currentQuarter(): number {
  const month = new Date().getMonth(); // 0-indexed
  return Math.floor(month / 3) + 1;
}

/**
 * Compute how fresh a data point is, returning a label, color, and age in quarters.
 *
 * Thresholds:
 *   - Fresh   (green):  0-1 quarters old
 *   - Recent  (yellow): 2-3 quarters old
 *   - Stale   (orange): 4-5 quarters old
 *   - Outdated (red):   6+ quarters old
 *   - Unknown (gray):   missing year
 */
export function computeFreshness(
  dataYear: number | null,
  dataQuarter: string | null
): FreshnessResult {
  if (dataYear === null) {
    return { label: 'Unknown', color: 'gray', quarters_old: null };
  }

  const now = new Date();
  const nowYear = now.getFullYear();
  const nowQ = currentQuarter();
  const dq = quarterToNum(dataQuarter) ?? 2; // default to Q2 if quarter not specified

  const quartersOld = (nowYear - dataYear) * 4 + (nowQ - dq);

  if (quartersOld < 0) {
    // Future data — treat as fresh
    return { label: 'Fresh', color: 'green', quarters_old: 0 };
  }

  if (quartersOld <= 1) {
    return { label: 'Fresh', color: 'green', quarters_old: quartersOld };
  }
  if (quartersOld <= 3) {
    return { label: 'Recent', color: 'yellow', quarters_old: quartersOld };
  }
  if (quartersOld <= 5) {
    return { label: 'Stale', color: 'orange', quarters_old: quartersOld };
  }
  return { label: 'Outdated', color: 'red', quarters_old: quartersOld };
}

/**
 * Format a quarters-old count into a human-readable age string.
 */
export function formatFreshnessAge(quartersOld: number | null): string {
  if (quartersOld === null) return 'age unknown';
  if (quartersOld === 0) return 'current quarter';
  if (quartersOld === 1) return '1 quarter ago';
  if (quartersOld < 4) return `${quartersOld} quarters ago`;
  const years = Math.floor(quartersOld / 4);
  const rem = quartersOld % 4;
  if (rem === 0) return `${years}y ago`;
  return `${years}y ${rem}q ago`;
}

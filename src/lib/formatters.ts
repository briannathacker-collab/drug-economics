// Drug Economics — Formatting Utilities
// All monetary values stored as cents — these functions convert to display dollars

import type { CogsEstimate, WacPrice } from './types';

export function formatCurrency(cents: number, compact = false): string {
  const dollars = cents / 100;
  if (compact) {
    if (dollars >= 1_000_000_000_000) return `$${(dollars / 1_000_000_000_000).toFixed(2)}T`;
    if (dollars >= 1_000_000_000) return `$${(dollars / 1_000_000_000).toFixed(1)}B`;
    if (dollars >= 1_000_000) return `$${(dollars / 1_000_000).toFixed(1)}M`;
    if (dollars >= 1_000) return `$${(dollars / 1_000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: dollars >= 100 ? 0 : 2,
    maximumFractionDigits: dollars >= 100 ? 0 : 2,
  }).format(dollars);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatMarkup(cogs: number, wac: number): string {
  if (cogs <= 0) return 'N/A';
  const markup = ((wac - cogs) / cogs) * 100;
  return `${markup.toFixed(0)}%`;
}

// Display helper for markup. Small markups (< 500%) stay as % for precision;
// large markups render as Nx ratios (e.g., "2,734×") which are more readable
// and more consistent with how academic / journalistic citations present the
// figure. Takes percent as input, returns a formatted string suffix-free.
export function formatMarkupDisplay(percent: number): string {
  if (!isFinite(percent) || percent <= 0) return 'N/A';
  if (percent < 500) return `${percent.toFixed(0)}%`;
  const ratio = percent / 100 + 1; // (wac - cogs) / cogs + 1 = wac / cogs
  return `${formatNumber(Math.round(ratio))}×`;
}

export function computeMarkupPercent(cogs: number, wac: number): number {
  if (cogs <= 0) return 0;
  return ((wac - cogs) / cogs) * 100;
}

// Normalize both sides to annual cents before computing markup so per-unit /
// monthly / annual mixes can't produce inflated ratios. Prefers the explicit
// annual field on each record; falls back to monthly × 12.
export interface AnnualMarkup {
  percent: number;
  cogs_annual_cents: number;
  wac_annual_cents: number;
  method: 'annual' | 'monthly_x12' | 'per_unit_x_units' | 'unavailable';
}

export function computeAnnualMarkup(
  cogs: CogsEstimate | undefined,
  wac: WacPrice | undefined,
): AnnualMarkup {
  if (!cogs || !wac) {
    return { percent: 0, cogs_annual_cents: 0, wac_annual_cents: 0, method: 'unavailable' };
  }

  const wacAnnual =
    wac.wac_annual && wac.wac_annual > 0
      ? wac.wac_annual
      : wac.wac_monthly > 0
        ? wac.wac_monthly * 12
        : 0;

  let cogsAnnual = 0;
  let method: AnnualMarkup['method'] = 'unavailable';
  const anyCogs = cogs as unknown as { estimated_cogs_annual?: number; estimated_cogs_per_unit?: number };
  if (anyCogs.estimated_cogs_annual && anyCogs.estimated_cogs_annual > 0) {
    cogsAnnual = anyCogs.estimated_cogs_annual;
    method = 'annual';
  } else if (cogs.estimate_preferred && cogs.estimate_preferred > 0) {
    cogsAnnual = cogs.estimate_preferred * 12;
    method = 'monthly_x12';
  } else if (cogs.estimated_cogs_monthly && cogs.estimated_cogs_monthly > 0) {
    cogsAnnual = cogs.estimated_cogs_monthly * 12;
    method = 'monthly_x12';
  } else if (anyCogs.estimated_cogs_per_unit && anyCogs.estimated_cogs_per_unit > 0 && wac.units_per_month) {
    cogsAnnual = anyCogs.estimated_cogs_per_unit * wac.units_per_month * 12;
    method = 'per_unit_x_units';
  }

  if (cogsAnnual <= 0 || wacAnnual <= 0) {
    return { percent: 0, cogs_annual_cents: cogsAnnual, wac_annual_cents: wacAnnual, method: 'unavailable' };
  }

  return {
    percent: ((wacAnnual - cogsAnnual) / cogsAnnual) * 100,
    cogs_annual_cents: cogsAnnual,
    wac_annual_cents: wacAnnual,
    method,
  };
}

export function formatAnnual(monthlyAmountCents: number): string {
  return formatCurrency(monthlyAmountCents * 12);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

export function formatCompact(n: number): string {
  if (n >= 1_000_000_000_000) return `${(n / 1_000_000_000_000).toFixed(2)}T`;
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function centsToAnnual(monthlyCents: number): number {
  return monthlyCents * 12;
}

export function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatYear(isoDate: string): string {
  return new Date(isoDate).getFullYear().toString();
}

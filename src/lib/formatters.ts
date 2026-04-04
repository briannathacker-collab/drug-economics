// Drug Economics — Formatting Utilities
// All monetary values stored as cents — these functions convert to display dollars

export function formatCurrency(cents: number, compact = false): string {
  const dollars = cents / 100;
  if (compact) {
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

export function computeMarkupPercent(cogs: number, wac: number): number {
  if (cogs <= 0) return 0;
  return ((wac - cogs) / cogs) * 100;
}

export function formatAnnual(monthlyAmountCents: number): string {
  return formatCurrency(monthlyAmountCents * 12);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

export function formatCompact(n: number): string {
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

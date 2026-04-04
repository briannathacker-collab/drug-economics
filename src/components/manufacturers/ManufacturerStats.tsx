import { formatCurrency } from '@/lib/formatters';
import type { ManufacturerCardData } from '@/lib/types';

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-[#E5ECE8] bg-white px-5 py-4">
      <p className="text-[10px] font-medium uppercase tracking-wider text-[#6B7771] font-body">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-[#1F2A24] font-mono">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-[#6B7771] font-body">{sub}</p>}
    </div>
  );
}

export function ManufacturerStats({ data }: { data: ManufacturerCardData }) {
  const avgWac = data.drugs.length > 0
    ? data.drugs.reduce((sum, d) => sum + d.wac_annual, 0) / data.drugs.length
    : 0;

  const avgMarkup = (() => {
    const withMarkup = data.drugs.filter(d => d.markup_percent !== undefined);
    if (withMarkup.length === 0) return null;
    return withMarkup.reduce((sum, d) => sum + (d.markup_percent || 0), 0) / withMarkup.length;
  })();

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard
        label="Revenue"
        value={formatCurrency(data.revenue, true)}
        sub="most recent year"
      />
      <StatCard
        label="Net Income"
        value={formatCurrency(data.net_income, true)}
      />
      <StatCard
        label="R&D Spend"
        value={formatCurrency(data.rd_spend, true)}
      />
      <StatCard
        label="Drugs Tracked"
        value={String(data.drugs.length)}
      />
      <StatCard
        label="Avg WAC (Wholesale Acquisition Cost)"
        value={formatCurrency(avgWac, true)}
        sub={avgMarkup !== null ? `Annual avg · Markup: ${avgMarkup.toFixed(0)}%` : 'annual avg'}
      />
    </div>
  );
}

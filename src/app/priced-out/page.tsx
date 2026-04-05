'use client';

import { useState, useMemo } from 'react';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { ControlsBar } from '@/components/layout/ControlsBar';
import { MetricCard } from '@/components/ui/MetricCard';
import { ManufacturerCard } from '@/components/ui/ManufacturerCard';
import { DrugDetailDrawer } from './DrugDetailDrawer';
import { getManufacturerCards, getSummaryMetrics } from '@/lib/data';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { FreshnessBadge } from '@/components/ui/FreshnessBadge';
import { ExportButton } from '@/components/ui/ExportButton';
import { JargonTooltip } from '@/components/ui/JargonTooltip';
import { DollarSign, TrendingUp, Building2, Pill, Info } from 'lucide-react';

export default function PricedOutPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [sortBy, setSortBy] = useState('revenue');
  const [selectedDrug, setSelectedDrug] = useState<string | null>(null);

  const manufacturerCards = useMemo(() => getManufacturerCards(), []);
  const metrics = useMemo(() => getSummaryMetrics(), []);

  // Specialties from drug data
  const specialties = useMemo(() => {
    const s = new Set<string>();
    manufacturerCards.forEach(m => m.drugs.forEach(d => s.add(d.specialty)));
    return Array.from(s).sort();
  }, [manufacturerCards]);

  // Filter & sort
  const filtered = useMemo(() => {
    let cards = manufacturerCards;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      cards = cards.filter(
        m =>
          m.name.toLowerCase().includes(q) ||
          m.drugs.some(d => d.name.toLowerCase().includes(q) || d.generic_name.toLowerCase().includes(q))
      );
    }

    if (specialty) {
      cards = cards
        .map(m => ({
          ...m,
          drugs: m.drugs.filter(d => d.specialty === specialty),
        }))
        .filter(m => m.drugs.length > 0);
    }

    cards = [...cards].sort((a, b) => {
      switch (sortBy) {
        case 'markup': {
          const aMax = Math.max(...a.drugs.map(d => d.markup_percent || 0));
          const bMax = Math.max(...b.drugs.map(d => d.markup_percent || 0));
          return bMax - aMax;
        }
        case 'name':
          return a.name.localeCompare(b.name);
        case 'drugs':
          return b.drugs.length - a.drugs.length;
        default:
          return b.revenue - a.revenue;
      }
    });

    return cards;
  }, [manufacturerCards, searchQuery, specialty, sortBy]);

  return (
    <div className="min-h-screen bg-[#F7F9F8]">
      <TopNav />

      {/* Green header */}
      <section className="bg-[#0B6B3A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight">Priced Out</h1>
          <p className="mt-2 text-[#E6F2EC] text-base sm:text-lg font-body max-w-2xl">
            What drugs really cost to make vs. what manufacturers charge. Compare <JargonTooltip term="WAC">WAC</JargonTooltip> prices, manufacturing costs, and profit margins.
          </p>
          <p className="mt-2 text-xs text-[#6B7771] font-body">
            WAC = Wholesale Acquisition Cost — manufacturer list price before rebates
          </p>
        </div>
      </section>

      <ControlsBar
        onSearch={setSearchQuery}
        onSpecialtyChange={setSpecialty}
        onSortChange={setSortBy}
        specialties={specialties}
      />

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Summary metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="Drugs Tracked"
            value={metrics.totalDrugs}
            subLabel={`Across ${metrics.totalManufacturers} manufacturers`}
            icon={<Pill className="w-5 h-5" />}
          />
          <MetricCard
            label="Avg. Markup Over Cost"
            value={formatPercent(metrics.avgMarkup, 0)}
            subLabel="WAC vs. estimated manufacturing cost"
            icon={<TrendingUp className="w-5 h-5" />}
            isEstimate
            confidence="medium"
            variant="danger"
            sourceLabel="Aggregate from peer-reviewed COGS literature"
            lastUpdated="Q1 2026"
          />
          <MetricCard
            label="Highest Markup"
            value={formatPercent(metrics.maxMarkup, 0)}
            subLabel={
              <span className="inline-flex items-center gap-1">
                {metrics.maxMarkupDrug}
                <span className="relative group">
                  <Info className="w-3 h-3 text-[#6B7771] cursor-help" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block w-64 p-2 bg-[#1F2A24] text-white text-[10px] rounded-lg shadow-lg z-50 font-normal leading-relaxed">
                    Tafamidis (Vyndaqel) manufacturing cost estimated at ~$1.50–$3.00/dose based on transthyretin-targeting small molecule synthesis (Kantarjian et al. methodology). WAC ~$19,000/mo. Estimate labeled accordingly.
                  </span>
                </span>
              </span>
            }
            icon={<DollarSign className="w-5 h-5" />}
            isEstimate
            confidence="medium"
            variant="danger"
            sourceLabel="Peer-reviewed COGS literature"
            lastUpdated="Q1 2026"
          />
          <MetricCard
            label="Combined Revenue"
            value={formatCurrency(metrics.totalRevenue, true)}
            subLabel="Top manufacturers, most recent year"
            icon={<Building2 className="w-5 h-5" />}
          />
        </div>

        <p className="text-[10px] text-[#6B7771] font-mono mb-6 flex items-center gap-2">
          <FreshnessBadge dataYear={2026} dataQuarter="Q1" source="WAC_MONITOR" />
          <span>· Manufacturer financials: FY 2024 actuals · Sources: CMS, FDA, SEC EDGAR, peer-reviewed literature</span>
        </p>

        {/* Legend — plain-English glossary */}
        <details className="mb-8 rounded-xl border border-[#E5ECE8] bg-white shadow-sm">
          <summary className="cursor-pointer px-5 py-3 text-sm font-semibold text-[#0B6B3A] font-body select-none hover:bg-[#F7F9F8] rounded-xl transition-colors">
            What do these numbers mean?
          </summary>
          <div className="px-5 pb-5 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm text-[#6B7771] font-body">
            <div>
              <p className="font-semibold text-[#1F2A24]">WAC (Wholesale Acquisition Cost)</p>
              <p>The manufacturer&apos;s list price for a drug before any rebates, insurer negotiations, or PBM discounts. Think of it as the &ldquo;sticker price.&rdquo; Almost nobody actually pays WAC, but it&apos;s the starting point that determines what everyone else pays.</p>
            </div>
            <div>
              <p className="font-semibold text-[#1F2A24]">Cost to Make (COGS)</p>
              <p>An estimate of what it actually costs to manufacture the drug — ingredients, production, packaging. These come from peer-reviewed academic studies and are labeled with a confidence level.</p>
            </div>
            <div>
              <p className="font-semibold text-[#1F2A24]">Markup %</p>
              <p>How much the list price (WAC) exceeds the estimated manufacturing cost. A 1,000% markup means a drug that costs ~$100/mo to make is listed at ~$1,100/mo.</p>
            </div>
            <div>
              <p className="font-semibold text-[#1F2A24]">Revenue</p>
              <p>The company&apos;s total annual sales across all products worldwide — not just drugs on this page. Gives context for how large the manufacturer is.</p>
            </div>
            <div>
              <p className="font-semibold text-[#1F2A24]">Net Income</p>
              <p>The company&apos;s profit after all expenses, taxes, and costs are subtracted from revenue. This is what they actually take home.</p>
            </div>
            <div>
              <p className="font-semibold text-[#1F2A24]">R&amp;D Spend</p>
              <p>How much the company spends on research and development. Often cited to justify high drug prices — you can compare it to their profit to judge for yourself.</p>
            </div>
            <div>
              <p className="font-semibold text-[#1F2A24]">Gross Margin</p>
              <p>The percentage of revenue left after subtracting the cost of goods sold. A 75% gross margin means for every $1 in sales, $0.75 is gross profit.</p>
            </div>
            <div>
              <p className="font-semibold text-[#1F2A24]">Combined Revenue</p>
              <p>Total annual revenue of all manufacturers shown on this page, added together. Shows the scale of the companies setting these prices.</p>
            </div>
          </div>
        </details>

        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#1F2A24] font-display">
            Manufacturers
          </h2>
          <div className="flex items-center gap-3">
            <ExportButton
              filename="drug-economics-pricing"
              data={filtered.flatMap(m => m.drugs.map(d => ({
                manufacturer: m.name,
                drug: d.name,
                generic_name: d.generic_name,
                specialty: d.specialty,
                wac_monthly: d.wac_monthly,
                wac_annual: d.wac_annual,
                cogs_estimate: d.cogs_estimate || '',
                markup_percent: d.markup_percent ? d.markup_percent.toFixed(1) : '',
              })))}
              columns={[
                { key: 'manufacturer', label: 'Manufacturer' },
                { key: 'drug', label: 'Drug' },
                { key: 'generic_name', label: 'Generic Name' },
                { key: 'specialty', label: 'Specialty' },
                { key: 'wac_monthly', label: 'WAC Monthly (cents)' },
                { key: 'wac_annual', label: 'WAC Annual (cents)' },
                { key: 'cogs_estimate', label: 'COGS Est. Monthly (cents)' },
                { key: 'markup_percent', label: 'Markup %' },
              ]}
            />
            <span className="px-3 py-1 bg-[#E6F2EC] text-[#0B6B3A] rounded-full text-sm font-medium font-mono">
              {filtered.length}
            </span>
          </div>
        </div>

        {/* ARIA live region announces filter results to screen readers */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {searchQuery || specialty
            ? `Showing ${filtered.length} manufacturer${filtered.length !== 1 ? 's' : ''} matching your filters. ${filtered.reduce((sum, m) => sum + m.drugs.length, 0)} drugs displayed.`
            : `Showing all ${filtered.length} manufacturers.`
          }
        </div>

        {/* Manufacturer card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" role="list" aria-label="Manufacturer cards">
          {filtered.map(mfr => (
            <ManufacturerCard
              key={mfr.manufacturer_id}
              data={mfr}
              onOpenDrug={setSelectedDrug}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16" role="status">
            <p className="text-[#6B7771] font-body">No manufacturers match your search.</p>
          </div>
        )}
      </main>

      <Footer />

      {/* Drug detail drawer */}
      {selectedDrug && (
        <DrugDetailDrawer
          drugId={selectedDrug}
          onClose={() => setSelectedDrug(null)}
        />
      )}
    </div>
  );
}

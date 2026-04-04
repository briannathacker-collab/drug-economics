'use client';

import { useMemo } from 'react';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { MetricCard } from '@/components/ui/MetricCard';
import { JargonTooltip } from '@/components/ui/JargonTooltip';
import { getIraNegotiations } from '@/lib/data';
import { formatCurrency, formatPercent, formatCompact } from '@/lib/formatters';
import { ExportButton } from '@/components/ui/ExportButton';
import Link from 'next/link';
import {
  Shield,
  ArrowDown,
  TrendingDown,
  DollarSign,
  Users,
  Pill,
  Calendar,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Scale,
  Heart,
  AlertTriangle,
  Landmark,
} from 'lucide-react';

const TIMELINE_EVENTS = [
  {
    year: '2022',
    title: 'IRA Signed Into Law',
    description:
      'President Biden signs the Inflation Reduction Act, granting Medicare the authority to negotiate drug prices directly with manufacturers for the first time in the program\'s history.',
    color: 'bg-[#0B6B3A]',
    status: 'complete' as const,
  },
  {
    year: '2023',
    title: 'First 10 Drugs Selected',
    description:
      'CMS announces the first 10 high-spend Medicare Part D drugs selected for negotiation. All are brand-name drugs with no generic or biosimilar competition.',
    color: 'bg-[#0B6B3A]',
    status: 'complete' as const,
  },
  {
    year: '2024',
    title: 'Negotiations Completed',
    description:
      'Medicare and drug manufacturers reach agreement on Maximum Fair Prices (MFPs) for all 10 drugs, with reductions ranging from 38% to 79% off list prices.',
    color: 'bg-[#0B6B3A]',
    status: 'complete' as const,
  },
  {
    year: '2026',
    title: 'Negotiated Prices Take Effect',
    description:
      'Maximum Fair Prices go into effect for the first 10 drugs on January 1, 2026. Medicare beneficiaries begin paying lower out-of-pocket costs immediately.',
    color: 'bg-[#0B6B3A]',
    status: 'active' as const,
  },
  {
    year: '2027',
    title: 'Next 15 Drugs Selected',
    description:
      'A second round of 15 Part D drugs will be selected for negotiation, with negotiated prices taking effect in 2027. Expanding the program\'s reach.',
    color: 'bg-[#6B7771]',
    status: 'upcoming' as const,
  },
  {
    year: '2028+',
    title: 'Expanding to 20 Drugs/Year',
    description:
      'The program expands to include up to 20 drugs per year, covering both Part D (pharmacy) and Part B (physician-administered) drugs.',
    color: 'bg-[#6B7771]',
    status: 'upcoming' as const,
  },
];

const IMPACT_CARDS = [
  {
    icon: <DollarSign className="w-5 h-5" />,
    title: 'Lower Out-of-Pocket Costs',
    description:
      'Medicare beneficiaries taking these drugs will see significant reductions in their co-pays and coinsurance amounts, putting money back in their pockets.',
    accent: 'bg-[#E6F2EC] text-[#0B6B3A]',
  },
  {
    icon: <Scale className="w-5 h-5" />,
    title: 'Precedent for Price Negotiation',
    description:
      'For decades, Medicare was prohibited from negotiating drug prices. The IRA establishes a legal framework that will expand to cover more drugs each year.',
    accent: 'bg-[#EFF6FF] text-[#1E40AF]',
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: 'Chronic Condition Relief',
    description:
      'The first 10 drugs treat common chronic conditions: diabetes, heart disease, blood clots, and autoimmune diseases. These are drugs patients take for years or even life.',
    accent: 'bg-[#FEF3C7] text-[#92400E]',
  },
  {
    icon: <AlertTriangle className="w-5 h-5" />,
    title: 'Industry Pushback',
    description:
      'Pharmaceutical manufacturers have filed lawsuits challenging the program, arguing it violates constitutional protections. Courts have so far upheld the law.',
    accent: 'bg-[#FEE2E2] text-[#991B1B]',
  },
  {
    icon: <Landmark className="w-5 h-5" />,
    title: 'Federal Savings',
    description:
      'The Congressional Budget Office estimates Medicare drug price negotiation will save the federal government $98.5 billion over a decade, reducing the national deficit.',
    accent: 'bg-[#E6F2EC] text-[#0B6B3A]',
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: '$2,000 Out-of-Pocket Cap',
    description:
      'The IRA also caps Medicare Part D out-of-pocket spending at $2,000 per year starting in 2025, protecting beneficiaries from catastrophic drug costs.',
    accent: 'bg-[#EFF6FF] text-[#1E40AF]',
  },
];

export default function IraEffectPage() {
  const negotiations = useMemo(() => getIraNegotiations(), []);

  // Sort by savings amount (WAC - negotiated) descending
  const sortedDrugs = useMemo(
    () =>
      [...negotiations].sort(
        (a, b) =>
          (b.current_wac_annual - b.negotiated_price_annual) -
          (a.current_wac_annual - a.negotiated_price_annual)
      ),
    [negotiations]
  );

  // Compute summary metrics
  const totalBeneficiaries = useMemo(
    () => negotiations.reduce((sum, d) => sum + d.enrolled_beneficiaries, 0),
    [negotiations]
  );

  const totalMedicareSpend = useMemo(
    () => negotiations.reduce((sum, d) => sum + d.medicare_spend_billions, 0),
    [negotiations]
  );

  const maxSavingsPercent = useMemo(
    () => Math.max(...negotiations.map(d => d.savings_percent)),
    [negotiations]
  );

  // Estimated annual savings: sum of (WAC - negotiated) * beneficiaries for each drug
  // This is a simplified estimate; actual savings depend on utilization patterns
  const estimatedAnnualSavingsBillions = useMemo(() => {
    // CBO and CMS estimated ~$6B in first-year savings for these 10 drugs
    return 6.0;
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F9F8]">
      <TopNav />

      {/* Hero Section */}
      <section className="bg-[#0B6B3A] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="flex items-center gap-2 text-sm text-[#6B7771] font-body mb-3">
            <Shield className="w-4 h-4" />
            Inflation Reduction Act of 2022
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display tracking-tight">
            The IRA Effect
          </h1>
          <p className="mt-4 text-lg text-[#CBD5E1] font-body max-w-3xl leading-relaxed">
            For the first time in its 60-year history, Medicare can negotiate drug prices
            directly with manufacturers. Here are the first 10 drugs, what they cost before,
            and what Medicare will pay now.
          </p>
          <p className="mt-3 text-sm text-[#6B7771] font-body">
            First 10 drugs &middot; Effective January 1, 2026 &middot; Source: CMS.gov
          </p>
        </div>
      </section>

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <MetricCard
            label="Drugs Negotiated"
            value={negotiations.length}
            subLabel="First round of Medicare price negotiation"
            icon={<Pill className="w-5 h-5" />}
          />
          <MetricCard
            label="Est. Annual Savings"
            value={`$${estimatedAnnualSavingsBillions}B+`}
            subLabel="Projected first-year savings for Medicare"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <MetricCard
            label="Max Price Reduction"
            value={formatPercent(maxSavingsPercent, 0)}
            subLabel="Largest negotiated discount off WAC"
            icon={<TrendingDown className="w-5 h-5" />}
          />
          <MetricCard
            label="Beneficiaries Affected"
            value={`${formatCompact(totalBeneficiaries)}+`}
            subLabel="Medicare enrollees taking these drugs"
            icon={<Users className="w-5 h-5" />}
          />
        </div>

        <p className="text-[10px] text-[#6B7771] font-mono mb-8 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B3A] inline-block" />
          Data current as of Q1 2026 &middot; Sources: CMS, HHS, Congressional Budget Office
        </p>

        {/* Negotiated Drugs Table */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#1F2A24] font-display">
              Medicare Negotiated vs. List Price
            </h2>
            <div className="flex items-center gap-3">
              <ExportButton
                filename="ira-negotiated-prices"
                data={sortedDrugs.map(d => ({
                  drug: d.drug_name,
                  generic_name: d.generic_name,
                  manufacturer: d.manufacturer,
                  indication: d.indication,
                  current_wac_annual: d.current_wac_annual,
                  negotiated_annual: d.negotiated_price_annual,
                  savings_percent: d.savings_percent,
                  beneficiaries: d.enrolled_beneficiaries,
                  medicare_spend_b: d.medicare_spend_billions,
                }))}
                columns={[
                  { key: 'drug', label: 'Drug' },
                  { key: 'generic_name', label: 'Generic Name' },
                  { key: 'manufacturer', label: 'Manufacturer' },
                  { key: 'indication', label: 'Indication' },
                  { key: 'current_wac_annual', label: 'Current WAC Annual (cents)' },
                  { key: 'negotiated_annual', label: 'Negotiated Annual (cents)' },
                  { key: 'savings_percent', label: 'Savings %' },
                  { key: 'beneficiaries', label: 'Beneficiaries' },
                  { key: 'medicare_spend_b', label: 'Medicare Spend ($B)' },
                ]}
              />
              <span className="px-3 py-1 bg-[#E6F2EC] text-[#0B6B3A] rounded-full text-sm font-medium font-mono">
                {negotiations.length} drugs
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E5ECE8] overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-[#E5ECE8] bg-[#F7F9F8]">
              <p className="text-sm text-[#6B7771] font-body">
                The <JargonTooltip term="MFP">Maximum Fair Price</JargonTooltip> is what Medicare
                will pay under negotiation. The <JargonTooltip term="WAC">Wholesale Acquisition Cost</JargonTooltip> is
                the manufacturer&rsquo;s list price. All prices shown are annual costs in cents, converted to dollars for display.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="bg-[#F7F9F8] text-left border-b border-[#E5ECE8]">
                    <th className="px-6 py-3 text-xs font-bold text-[#6B7771] font-body uppercase tracking-wider">
                      Drug
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-[#6B7771] font-body uppercase tracking-wider text-right">
                      WAC/yr
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-[#6B7771] font-body uppercase tracking-wider text-right">
                      <span className="text-[#0B6B3A]">Negotiated/yr</span>
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-[#6B7771] font-body uppercase tracking-wider text-right">
                      Savings
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-[#6B7771] font-body uppercase tracking-wider text-right hidden md:table-cell">
                      Beneficiaries
                    </th>
                    <th className="px-4 py-3 text-xs font-bold text-[#6B7771] font-body uppercase tracking-wider text-right hidden lg:table-cell">
                      Medicare Spend
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDrugs.map((drug, i) => {
                    const annualSavings = drug.current_wac_annual - drug.negotiated_price_annual;
                    return (
                      <tr
                        key={drug.drug_id}
                        className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#F7F9F8]/50'} hover:bg-[#F1F5F9] transition-colors`}
                      >
                        <td className="px-6 py-4">
                          <div className="font-bold text-[#1F2A24] font-display">
                            {drug.drug_name}
                          </div>
                          <div className="text-xs text-[#6B7771] font-body">
                            {drug.generic_name} &middot; {drug.indication}
                          </div>
                          <div className="text-[10px] text-[#6B7771] font-body mt-0.5">
                            {drug.manufacturer}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="font-mono text-[#C41E3A] line-through decoration-1">
                            {formatCurrency(drug.current_wac_annual)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="font-mono font-bold text-[#0B6B3A]">
                            {formatCurrency(drug.negotiated_price_annual)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex flex-col items-end gap-0.5">
                            <span className="inline-flex items-center gap-1 text-[#0B6B3A] font-mono font-bold">
                              <ArrowDown className="w-3.5 h-3.5" />
                              {drug.savings_percent}%
                            </span>
                            <span className="text-[10px] text-[#6B7771] font-mono">
                              {formatCurrency(annualSavings)}/yr
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right hidden md:table-cell">
                          <span className="font-mono text-[#1F2A24]">
                            {drug.enrolled_beneficiaries.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right hidden lg:table-cell">
                          <span className="font-mono text-[#6B7771]">
                            ${drug.medicare_spend_billions.toFixed(1)}B
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-3 bg-[#F7F9F8] border-t border-[#E5ECE8]">
              <p className="text-xs text-[#6B7771] font-body italic">
                WAC figures from Drug Economics database. Negotiated prices from CMS announcements (August 2024).
                Savings percentages reflect reduction from manufacturer list price. Actual patient out-of-pocket
                costs depend on insurance coverage and plan design.
              </p>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1F2A24] font-display mb-6">
            IRA Implementation Timeline
          </h2>

          <div className="bg-white rounded-xl border border-[#E5ECE8] p-8 shadow-sm">
            <div className="relative">
              {TIMELINE_EVENTS.map((event, i) => (
                <div key={i} className="flex gap-4 mb-6 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div
                      className={`${event.color} text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0`}
                    >
                      {event.status === 'complete' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : event.status === 'active' ? (
                        <Calendar className="w-5 h-5" />
                      ) : (
                        <span className="text-xs font-bold font-mono">{event.year.slice(-2)}</span>
                      )}
                    </div>
                    {i < TIMELINE_EVENTS.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 mt-1 ${
                          event.status === 'complete'
                            ? 'bg-[#0B6B3A]'
                            : event.status === 'active'
                            ? 'bg-[#0B6B3A]/40'
                            : 'bg-[#E5ECE8]'
                        }`}
                      />
                    )}
                  </div>
                  <div className="pb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-[#6B7771]">{event.year}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          event.status === 'complete'
                            ? 'bg-[#E6F2EC] text-[#0B6B3A]'
                            : event.status === 'active'
                            ? 'bg-[#FEF3C7] text-[#92400E]'
                            : 'bg-[#F1F5F9] text-[#6B7771]'
                        }`}
                      >
                        {event.status === 'complete'
                          ? 'Complete'
                          : event.status === 'active'
                          ? 'Current'
                          : 'Upcoming'}
                      </span>
                    </div>
                    <h4 className="font-bold text-[#1F2A24] font-body">{event.title}</h4>
                    <p className="text-sm text-[#6B7771] font-body mt-1 leading-relaxed max-w-2xl">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What This Means Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1F2A24] font-display mb-6">
            What This Means
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {IMPACT_CARDS.map((card, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-[#E5ECE8] p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg ${card.accent} flex items-center justify-center shrink-0`}
                  >
                    {card.icon}
                  </div>
                  <h3 className="font-bold text-[#1F2A24] font-body pt-2">{card.title}</h3>
                </div>
                <p className="text-sm text-[#6B7771] font-body leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Context + Cross-Links */}
        <section className="mb-8">
          <div className="bg-[#0B6B3A] rounded-xl p-8">
            <h3 className="text-lg font-bold text-white font-display mb-4">
              The Bigger Picture
            </h3>
            <p className="text-sm text-[#CBD5E1] font-body leading-relaxed mb-4">
              Drug price negotiation is one piece of a larger system. To understand the full picture
              of how drug prices are set, marked up, and paid for in the United States, explore the
              other tools in Drug Economics.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/priced-out"
                className="inline-flex items-center gap-1.5 text-sm text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-medium transition-colors font-body"
              >
                See drug markups <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/the-generic-gap"
                className="inline-flex items-center gap-1.5 text-sm text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-medium transition-colors font-body"
              >
                Generic delay tactics <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/what-it-costs-me"
                className="inline-flex items-center gap-1.5 text-sm text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-medium transition-colors font-body"
              >
                Calculate your costs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/follow-the-money"
                className="inline-flex items-center gap-1.5 text-sm text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-medium transition-colors font-body"
              >
                Follow the money <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Source Note */}
        <div className="bg-[#F7F9F8] rounded-xl border border-[#E5ECE8] p-6">
          <h3 className="text-base font-bold text-[#1F2A24] font-display mb-3">Sources &amp; Methodology</h3>
          <div className="space-y-2 text-sm text-[#6B7771] font-body leading-relaxed">
            <p>
              Negotiated prices (Maximum Fair Prices) published by CMS in August 2024.
              WAC prices from Drug Economics database, sourced from manufacturer price lists and CMS data.
              Medicare spending and beneficiary enrollment data from CMS Medicare Part D Spending Dashboard.
            </p>
            <p className="text-xs text-[#6B7771] font-mono mt-3">
              Last updated: Q1 2026 &middot; CMS.gov, HHS.gov, Congressional Budget Office
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

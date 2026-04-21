'use client';

import { useState, useMemo } from 'react';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { MetricCard } from '@/components/ui/MetricCard';
import { EstBadge } from '@/components/ui/EstBadge';
import { MethodologyTooltip } from '@/components/ui/MethodologyTooltip';
import { getDelayTactics, getPatents, getWacPrices } from '@/lib/data';
import { formatCurrency } from '@/lib/formatters';
import { SourceIcon } from '@/components/ui/SourceIcon';
import { METHODOLOGY_COMPLETE } from '@/components/ui/MethodologyModal';
import { ExportButton } from '@/components/ui/ExportButton';
import { ShieldAlert, Search, ArrowRight, ExternalLink, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const TACTIC_INFO: Record<string, { name: string; description: string }> = {
  patent_thicket: {
    name: 'Patent Thicket',
    description: 'Filing dozens or hundreds of secondary patents around a drug to create an impenetrable wall of intellectual property that deters generic competition through sheer complexity and litigation risk.',
  },
  evergreening: {
    name: 'Evergreening',
    description: 'Making minor modifications to a drug — new formulation, new delivery device, new dosage — and patenting each change to extend exclusivity long beyond the original patent term.',
  },
  pay_for_delay: {
    name: 'Pay-for-Delay',
    description: 'Brand-name manufacturers pay generic competitors to delay entering the market. The FTC has called these agreements "the most anticompetitive conduct in the pharmaceutical industry."',
  },
  rems_abuse: {
    name: 'REMS Abuse',
    description: 'Exploiting FDA safety programs (Risk Evaluation and Mitigation Strategies) to restrict sample access, making it impossible for generic makers to conduct required bioequivalence testing.',
  },
  authorized_generic: {
    name: 'Authorized Generic',
    description: 'Launching the brand manufacturer\'s own "generic" version to flood the market and undercut independent generic competitors, maintaining market control while appearing to support competition.',
  },
  pbm_exclusion: {
    name: 'PBM Exclusion',
    description: 'Negotiating exclusive formulary placement with PBMs, offering large rebates on condition that competing generics or biosimilars are excluded from coverage.',
  },
  citizen_petition: {
    name: 'Citizen Petition',
    description: 'Filing petitions at the FDA raising safety or scientific concerns about generic competitors, triggering delays in FDA review and approval of competing products.',
  },
  '30_month_stay': {
    name: '30-Month Stay',
    description: 'Filing patent infringement lawsuits against generic applicants to trigger an automatic 30-month delay in FDA approval — a regulatory mechanism that rewards litigation.',
  },
};

export default function TheGenericGapPage() {
  const [activeView, setActiveView] = useState<'explainer' | 'encyclopedia' | 'lookup' | 'action'>('explainer');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrug, setSelectedDrug] = useState<string | null>(null);

  const delays = useMemo(() => getDelayTactics(), []);
  const patents = useMemo(() => getPatents(), []);
  const drugs = useMemo(() => getWacPrices(), []);
  // Total patient cost of documented delays
  const totalDelayCost = useMemo(
    () => delays.reduce((sum, d) => sum + d.estimated_patient_cost_of_delay, 0),
    [delays]
  );

  const totalDelayYears = useMemo(
    () => delays.reduce((sum, d) => sum + d.total_delay_years, 0),
    [delays]
  );

  // Filtered drugs for lookup
  const filteredDelays = useMemo(() => {
    if (!searchQuery) return delays;
    const q = searchQuery.toLowerCase();
    return delays.filter(
      d => d.drug_name.toLowerCase().includes(q) || d.manufacturer.toLowerCase().includes(q)
    );
  }, [delays, searchQuery]);

  const views = [
    { id: 'explainer' as const, label: 'How 12 Years Becomes 20+' },
    { id: 'encyclopedia' as const, label: 'Delay Tactic Encyclopedia' },
    { id: 'lookup' as const, label: 'Drug Lookup' },
    { id: 'action' as const, label: 'What You Can Do' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9F8]">
      <TopNav />

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1F2A24] font-display">The Generic Gap</h1>
          <p className="mt-2 text-[#6B7771] font-body">
            Why isn&apos;t there a cheaper version yet? Track the tactics manufacturers use to delay generic competition — and what it costs patients.
          </p>
          <p className="mt-2 text-[10px] text-[#6B7771] font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B3A] inline-block" />
            Delay data current as of Q1 2026 · Sources: FTC, DOJ, court records, peer-reviewed studies
          </p>
        </div>

        {/* Summary metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <MetricCard
            label="Drugs With Documented Delays"
            value={delays.length}
            subLabel="Tactics documented from FTC, DOJ, and court records"
            icon={<ShieldAlert className="w-5 h-5" />}
            variant="danger"
          />
          <MetricCard
            label="Total Years Stolen"
            value={totalDelayYears}
            subLabel="Combined years of delayed generic access"
            icon={<Clock className="w-5 h-5" />}
            variant="danger"
          />
          {METHODOLOGY_COMPLETE ? (
            <div className="bg-[#FEE2E2] rounded-xl border border-[#C41E3A]/20 p-5 shadow-sm">
              <p className="text-sm font-medium text-[#C41E3A] font-body flex items-center gap-1">
                <MethodologyTooltip
                  label="Estimated Patient Cost of Delays"
                  formula="sum over drugs: delay_years × annual_WAC × patient_population"
                  inputs={[
                    { label: 'Drugs with documented delays', value: `${delays.length}` },
                    { label: 'Total delay-years', value: `${totalDelayYears}` },
                    { label: 'WAC basis', value: 'annual_WAC from WAC monitor' },
                    { label: 'Population basis', value: 'stored per-drug estimate' },
                  ]}
                  note="Each drug's contribution = delay_years × annual_WAC × estimated_patient_population. Patient population is a rough estimate per drug; see the delay encyclopedia for per-drug sourcing."
                  sourceLabel="FTC, DOJ, court records, peer-reviewed studies"
                >
                  <span>Estimated Patient Cost of Delays</span>
                </MethodologyTooltip>
              </p>
              <p className="text-3xl font-bold text-[#C41E3A] font-mono mt-2">
                {formatCurrency(totalDelayCost, true)}
              </p>
              <p className="text-xs text-[#6B7771] font-body mt-1 flex items-center gap-1">
                <EstBadge /> Based on delay years × annual WAC × patient population
                <SourceIcon sourceLabel="Calculated: delay years × annual WAC × patient population" lastUpdated="Q1 2026" />
              </p>
            </div>
          ) : (
            <div className="bg-[#F1F5F9] rounded-xl border border-[#E5ECE8] p-5 shadow-sm">
              <p className="text-sm font-medium text-[#6B7771] font-body">Estimated Patient Cost of Delays</p>
              <p className="text-sm text-[#6B7771] font-body mt-2">Estimate not available — methodology documentation in progress</p>
            </div>
          )}
        </div>

        {/* Methodology breakdown */}
        <details className="mb-8 bg-white rounded-xl border border-[#E5ECE8] shadow-sm">
          <summary className="px-5 py-4 cursor-pointer text-sm font-semibold text-[#1F2A24] font-body flex items-center gap-2 hover:bg-[#F7F9F8] rounded-xl">
            <AlertTriangle className="w-4 h-4 text-[#B45309]" />
            How We Calculated These Numbers
          </summary>
          <div className="px-5 pb-5 space-y-4 border-t border-[#E5ECE8]">
            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-[#F0FDF4] border border-[#0B6B3A]/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-[#1F2A24] font-body">Drugs With Documented Delays</p>
                  <span className="text-[10px] font-mono font-bold text-[#0B6B3A] bg-[#0B6B3A]/10 px-2 py-0.5 rounded">HIGH</span>
                </div>
                <p className="text-xs text-[#6B7771] font-body leading-relaxed">
                  Count of drugs with at least one documented delay tactic from FTC enforcement actions, DOJ antitrust filings, court records, or peer-reviewed studies. Each entry is individually sourced.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-[#FFFBEB] border border-[#B45309]/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-[#1F2A24] font-body">Total Years Stolen</p>
                  <span className="text-[10px] font-mono font-bold text-[#B45309] bg-[#B45309]/10 px-2 py-0.5 rounded">MEDIUM</span>
                </div>
                <p className="text-xs text-[#6B7771] font-body leading-relaxed">
                  Sum of delay years per drug, calculated as the difference between expected generic entry (patent expiry + 180-day exclusivity) and actual or projected generic availability. Some dates are estimates based on litigation timelines.
                </p>
              </div>
              <div className="p-4 rounded-lg bg-[#FEF2F2] border border-[#C41E3A]/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-[#1F2A24] font-body">Estimated Patient Cost</p>
                  <span className="text-[10px] font-mono font-bold text-[#C41E3A] bg-[#C41E3A]/10 px-2 py-0.5 rounded">LOW</span>
                </div>
                <p className="text-xs text-[#6B7771] font-body leading-relaxed">
                  Delay years &times; annual WAC price &times; estimated patient population. Uses list price (WAC), not net price after rebates. Actual patient cost varies by insurance status. This is a rough order-of-magnitude estimate.
                </p>
              </div>
            </div>
            <p className="text-[10px] text-[#6B7771] font-mono">
              Confidence: HIGH = directly from public records · MEDIUM = calculated from public data with assumptions · LOW = rough estimate with significant uncertainty
            </p>
          </div>
        </details>

        {/* View tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2" role="tablist" aria-label="Generic gap data views">
          {views.map(v => (
            <button
              key={v.id}
              role="tab"
              aria-selected={activeView === v.id}
              onClick={() => setActiveView(v.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors font-body ${
                activeView === v.id
                  ? 'bg-[#0B6B3A] text-white'
                  : 'bg-white text-[#6B7771] border border-[#E5ECE8] hover:bg-[#F1F5F9]'
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* ARIA live region for screen reader announcements */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {activeView === 'explainer' && 'Showing delay explainer timeline.'}
          {activeView === 'encyclopedia' && `Showing ${Object.keys(TACTIC_INFO).length} delay tactics in the encyclopedia.`}
          {activeView === 'lookup' && (
            searchQuery
              ? `Showing ${filteredDelays.length} drug${filteredDelays.length !== 1 ? 's' : ''} matching "${searchQuery}".`
              : `Showing all ${filteredDelays.length} drugs with documented delays.`
          )}
          {activeView === 'action' && 'Showing actions you can take.'}
        </div>

        {/* How 12 Years Becomes 20+ */}
        {activeView === 'explainer' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E5ECE8] p-8 shadow-sm">
              <h3 className="text-xl font-bold text-[#1F2A24] font-display mb-6 text-center">
                How a 12-Year Patent Becomes 20+ Years of Monopoly Pricing
              </h3>

              <div className="relative">
                {/* Timeline steps */}
                {[
                  {
                    year: 'Year 0',
                    title: 'Original Patent Filed',
                    desc: 'The drug compound is patented. The clock starts on 20 years of exclusivity.',
                    color: 'bg-[#0B6B3A]',
                    yearRange: '20 yr patent life',
                  },
                  {
                    year: 'Year 8',
                    title: 'FDA Approval + Market Exclusivity',
                    desc: 'After clinical trials, the FDA grants approval plus 5–7 years of additional market exclusivity (NCE, orphan, pediatric).',
                    color: 'bg-[#0B6B3A]',
                    yearRange: '+5-7 yr exclusivity',
                  },
                  {
                    year: 'Year 12',
                    title: 'Original Patent Expires, But…',
                    desc: 'Manufacturer files dozens of secondary patents: new formulations, devices, dosing methods, treatment combinations.',
                    color: 'bg-[#B45309]',
                    yearRange: 'Patent thicket begins',
                  },
                  {
                    year: 'Year 14',
                    title: 'Generic Files Application',
                    desc: 'A generic maker files an ANDA. The brand company immediately sues for patent infringement, triggering an automatic 30-month FDA delay.',
                    color: 'bg-[#C41E3A]',
                    yearRange: '+30 month stay',
                  },
                  {
                    year: 'Year 16',
                    title: 'Pay-for-Delay Settlement',
                    desc: 'Rather than risk losing in court, the brand company pays the generic maker millions to delay launch. The generic agrees to wait.',
                    color: 'bg-[#C41E3A]',
                    yearRange: '+2-5 yr settlement',
                  },
                  {
                    year: 'Year 18',
                    title: 'REMS Abuse & Citizen Petitions',
                    desc: 'The brand blocks sample access using safety programs and files citizen petitions at FDA to delay generic review.',
                    color: 'bg-[#C41E3A]',
                    yearRange: '+1-3 yr delay',
                  },
                  {
                    year: 'Year 20+',
                    title: 'Generic Finally Launches',
                    desc: 'After years of delay, a generic or biosimilar finally reaches patients — at prices that could have been available 8+ years earlier.',
                    color: 'bg-[#6B7771]',
                    yearRange: 'Finally',
                  },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4 mb-6 last:mb-0">
                    <div className="flex flex-col items-center">
                      <div className={`${step.color} text-white w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold font-mono shrink-0`}>
                        {i + 1}
                      </div>
                      {i < 6 && <div className="w-0.5 flex-1 bg-[#E5ECE8] mt-1" />}
                    </div>
                    <div className="pb-6">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-[#6B7771]">{step.year}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                          step.color === 'bg-[#C41E3A]' ? 'bg-[#FEE2E2] text-[#C41E3A]' :
                          step.color === 'bg-[#B45309]' ? 'bg-[#FFFBEB] text-[#B45309]' :
                          'bg-[#E6F2EC] text-[#0B6B3A]'
                        }`}>
                          {step.yearRange}
                        </span>
                      </div>
                      <h4 className="font-bold text-[#1F2A24] font-body">{step.title}</h4>
                      <p className="text-sm text-[#6B7771] font-body mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-[#FEE2E2] rounded-lg p-5 text-center">
                <p className="text-sm font-semibold text-[#C41E3A] font-body">
                  Every year of delay = another year patients pay monopoly prices.
                </p>
                <p className="text-xs text-[#6B7771] font-body mt-1">
                  These tactics are legal. That is the problem.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Delay Tactic Encyclopedia */}
        {activeView === 'encyclopedia' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(TACTIC_INFO).map(([key, info]) => {
              // Find real examples
              const examples = delays
                .filter(d => d.tactics.some(t => t.type === key))
                .map(d => ({
                  drug: d.drug_name,
                  manufacturer: d.manufacturer,
                  tactic: d.tactics.find(t => t.type === key)!,
                }));

              return (
                <div key={key} className="bg-white rounded-xl border border-[#E5ECE8] p-5 shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FEE2E2] flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-4 h-4 text-[#C41E3A]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1F2A24] font-body">{info.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-[#6B7771] font-body leading-relaxed mb-4">
                    {info.description}
                  </p>

                  {examples.length > 0 && (
                    <div className="border-t border-[#E5ECE8] pt-3">
                      <p className="text-[10px] uppercase text-[#6B7771] font-body tracking-wider mb-2">Documented Examples</p>
                      {examples.slice(0, 2).map((ex, i) => (
                        <div key={i} className="bg-[#F7F9F8] rounded-lg p-3 mb-2 last:mb-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-[#C41E3A] font-body">{ex.drug}</span>
                            <span className="text-xs text-[#6B7771] font-body">{ex.manufacturer}</span>
                          </div>
                          <p className="text-xs text-[#6B7771] font-body mt-1 line-clamp-2">{ex.tactic.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-[10px] text-[#6B7771]">
                            <span className="font-mono">Delay: {ex.tactic.delay_months}mo</span>
                            {ex.tactic.ftc_case_ref && (
                              <span className="text-[#B45309]">FTC case documented</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Drug Lookup */}
        {activeView === 'lookup' && (
          <div>
            {/* Search + Export */}
            <div className="flex items-center gap-3 mb-6">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7771]" />
              <input
                type="text"
                placeholder="Search by drug or manufacturer..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#E5ECE8] bg-white text-sm text-[#1F2A24] placeholder:text-[#6B7771] focus:outline-none focus:ring-2 focus:ring-[#0B6B3A]/20 focus:border-[#0B6B3A] font-body"
              />
            </div>
              <ExportButton
                filename="delay-tactics"
                data={filteredDelays.map(d => {
                  const drug = drugs.find(dr => dr.drug_id === d.drug_id);
                  return {
                    drug_name: d.drug_name,
                    manufacturer: d.manufacturer,
                    total_delay_years: d.total_delay_years,
                    tactics_used: d.tactics.map(t => TACTIC_INFO[t.type]?.name || t.type).join('; '),
                    estimated_patient_cost: d.estimated_patient_cost_of_delay,
                    patient_population: d.estimated_patient_population,
                    wac_annual: drug?.wac_annual || '',
                  };
                })}
                columns={[
                  { key: 'drug_name', label: 'Drug' },
                  { key: 'manufacturer', label: 'Manufacturer' },
                  { key: 'total_delay_years', label: 'Delay (Years)' },
                  { key: 'tactics_used', label: 'Tactics Used' },
                  { key: 'estimated_patient_cost', label: 'Est. Patient Cost (cents)' },
                  { key: 'patient_population', label: 'Patient Population' },
                  { key: 'wac_annual', label: 'WAC Annual (cents)' },
                ]}
              />
            </div>

            <div className="space-y-4">
              {filteredDelays.map(delay => {
                const drug = drugs.find(d => d.drug_id === delay.drug_id);
                const patent = patents.find(p => p.drug_id === delay.drug_id);
                const isExpanded = selectedDrug === delay.drug_id;

                return (
                  <div key={delay.drug_id} className="bg-white rounded-xl border border-[#E5ECE8] shadow-sm overflow-hidden">
                    <div
                      className="p-5 cursor-pointer hover:bg-[#F7F9F8] transition-colors"
                      onClick={() => setSelectedDrug(isExpanded ? null : delay.drug_id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-[#1F2A24] font-display">{delay.drug_name}</h3>
                          <p className="text-xs text-[#6B7771] font-body">{delay.manufacturer}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-[#C41E3A] font-mono">{delay.total_delay_years} yr</p>
                            <p className="text-[10px] text-[#6B7771] font-body uppercase">Gap</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-[#C41E3A] font-mono">
                              {formatCurrency(delay.estimated_patient_cost_of_delay, true)}
                            </p>
                            <p className="text-[10px] text-[#6B7771] font-body uppercase flex items-center gap-0.5 justify-end">
                              Est. cost <EstBadge />
                              <SourceIcon sourceLabel="Delay years × annual WAC × patient population" lastUpdated="Q4 2024" />
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Tactic chips */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {delay.tactics.map((t, i) => (
                          <span key={i} className="text-[10px] bg-[#FEE2E2] text-[#C41E3A] px-2 py-0.5 rounded-full font-medium">
                            {TACTIC_INFO[t.type]?.name || t.type.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-[#E5ECE8] bg-[#F7F9F8] p-5">
                        {/* Drug pricing context */}
                        {drug && (
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                            <div className="bg-white rounded-lg p-3">
                              <p className="text-[10px] text-[#6B7771] uppercase">Monthly WAC</p>
                              <p className="font-bold text-[#C41E3A] font-mono">{formatCurrency(drug.wac_monthly)}</p>
                            </div>
                            <div className="bg-white rounded-lg p-3">
                              <p className="text-[10px] text-[#6B7771] uppercase">Annual Cost</p>
                              <p className="font-bold text-[#C41E3A] font-mono">{formatCurrency(drug.wac_annual)}</p>
                            </div>
                            {patent && (
                              <div className="bg-white rounded-lg p-3">
                                <p className="text-[10px] text-[#6B7771] uppercase">Patent Cliff</p>
                                <p className="font-bold text-[#1F2A24] font-mono">
                                  {new Date(patent.patent_cliff_date).getFullYear()}
                                </p>
                              </div>
                            )}
                            <div className="bg-white rounded-lg p-3">
                              <p className="text-[10px] text-[#6B7771] uppercase">Patients Affected</p>
                              <p className="font-bold text-[#1F2A24] font-mono">
                                {delay.estimated_patient_population.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Each tactic detail */}
                        <h4 className="text-sm font-semibold text-[#1F2A24] font-body mb-3">Tactics Used</h4>
                        <div className="space-y-3">
                          {delay.tactics.map((tactic, i) => (
                            <div key={i} className="bg-white rounded-lg border border-[#E5ECE8] p-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-[#C41E3A] bg-[#FEE2E2] px-2 py-0.5 rounded font-body">
                                  {TACTIC_INFO[tactic.type]?.name || tactic.type.replace(/_/g, ' ')}
                                </span>
                                <span className="text-xs font-mono text-[#6B7771]">
                                  {tactic.delay_months} months delay
                                </span>
                              </div>
                              <p className="text-sm text-[#6B7771] font-body leading-relaxed">
                                {tactic.description}
                              </p>
                              {tactic.ftc_case_ref && (
                                <p className="text-xs text-[#B45309] mt-2 font-body">
                                  <AlertTriangle className="w-3 h-3 inline mr-1" />
                                  {tactic.ftc_case_ref}
                                </p>
                              )}
                              {tactic.court_case && (
                                <p className="text-xs text-[#6B7771] mt-1 font-mono">{tactic.court_case}</p>
                              )}
                              {tactic.outcome && (
                                <p className="text-xs text-[#6B7771] mt-2 font-body italic">
                                  Outcome: {tactic.outcome}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Gap cost calculator */}
                        <div className="mt-6 bg-[#FEE2E2] rounded-lg p-5 text-center">
                          <p className="text-xs text-[#C41E3A] font-semibold uppercase tracking-wider font-body">
                            Estimated Cost of This Delay
                          </p>
                          <p className="text-3xl font-bold text-[#C41E3A] font-mono mt-2">
                            {formatCurrency(delay.estimated_patient_cost_of_delay, true)}
                          </p>
                          <p className="text-xs text-[#6B7771] font-body mt-2 flex items-center gap-1 justify-center">
                            <EstBadge />
                            {delay.total_delay_years} years × {formatCurrency(drug?.wac_annual || 0)}/yr × {delay.estimated_patient_population.toLocaleString()} patients
                            <SourceIcon sourceLabel="Delay years × annual WAC × patient population" lastUpdated="Q4 2024" />
                          </p>
                        </div>
                        {/* Cross-app links */}
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Link
                            href={`/what-it-costs-me?drug=${delay.drug_id}`}
                            className="inline-flex items-center gap-1 text-xs text-[#0B6B3A] font-medium hover:underline font-body bg-[#E6F2EC] px-3 py-1.5 rounded-lg"
                          >
                            Calculate your cost <ArrowRight className="w-3 h-3" />
                          </Link>
                          <Link
                            href="/pipeline-watch"
                            className="inline-flex items-center gap-1 text-xs text-[#0B6B3A] font-medium hover:underline font-body bg-[#F1F5F9] px-3 py-1.5 rounded-lg"
                          >
                            View patent timeline <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredDelays.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-[#6B7771] font-body">No drugs match your search.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* What You Can Do */}
        {activeView === 'action' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E5ECE8] p-8 shadow-sm">
              <h3 className="text-xl font-bold text-[#1F2A24] font-display mb-6">What You Can Do</h3>

              <div className="space-y-4">
                {[
                  {
                    title: 'Contact Your Representatives',
                    desc: 'Your members of Congress vote on drug pricing legislation. Call or email them to demand action on patent abuse and pay-for-delay settlements.',
                    link: 'https://www.congress.gov/members/find-your-member',
                    linkText: 'Find your representatives',
                  },
                  {
                    title: 'File an FTC Complaint',
                    desc: 'If you believe a drug manufacturer is engaging in anti-competitive practices, you can file a complaint with the Federal Trade Commission.',
                    link: 'https://reportfraud.ftc.gov/',
                    linkText: 'FTC Complaint Portal',
                  },
                  {
                    title: 'Support Drug Pricing Reform Organizations',
                    desc: 'Organizations like Patients for Affordable Drugs, T1International, and the Campaign for Sustainable Rx Pricing advocate for systemic reform.',
                    link: 'https://www.patientsforaffordabledrugs.org/',
                    linkText: 'Patients for Affordable Drugs',
                  },
                  {
                    title: 'Ask Your Doctor About Alternatives',
                    desc: 'Your doctor may not know about generic equivalents, therapeutic alternatives, or patient assistance programs. Ask them to check for cheaper options.',
                    link: null,
                    linkText: null,
                  },
                  {
                    title: 'Check for Patient Assistance Programs',
                    desc: 'Programs like NeedyMeds, RxAssist, and manufacturer PAP programs can provide medications at reduced or no cost for qualifying patients.',
                    link: 'https://www.needymeds.org/',
                    linkText: 'NeedyMeds Database',
                  },
                  {
                    title: 'Share This Data',
                    desc: 'The pharmaceutical pricing system thrives on complexity and opacity. Share Drug Economics with your family, friends, and community to make these facts visible.',
                    link: null,
                    linkText: null,
                  },
                ].map((action, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-[#F7F9F8] rounded-lg">
                    <div className="w-8 h-8 rounded-full bg-[#E6F2EC] flex items-center justify-center shrink-0 text-sm font-bold text-[#0B6B3A] font-mono">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1F2A24] font-body">{action.title}</h4>
                      <p className="text-sm text-[#6B7771] font-body mt-1 leading-relaxed">{action.desc}</p>
                      {action.link && (
                        <a
                          href={action.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-[#0B6B3A] font-medium mt-2 hover:underline font-body"
                        >
                          {action.linkText}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0B6B3A] rounded-xl p-8 text-center">
              <p className="text-lg font-accent text-[#E6F2EC] leading-relaxed">
                These pricing practices are not accidents. They are strategies.
                They are documented. And they are legal — for now.
              </p>
              <p className="text-sm text-[#6B7771] font-body mt-4">
                Every day of delay is another day patients pay monopoly prices for drugs
                that could cost a fraction of what they charge.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

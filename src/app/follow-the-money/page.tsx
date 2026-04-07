'use client';

import { useState, useMemo } from 'react';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { MetricCard } from '@/components/ui/MetricCard';
import { JargonTooltip } from '@/components/ui/JargonTooltip';
import { getInsurerFinancials, getPbmRebates, getPremiumHistory, getRevolvingDoor, getCaseStudies } from '@/lib/data';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import type { RevolvingDoorPerson, CaseStudy } from '@/lib/types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { SourceIcon } from '@/components/ui/SourceIcon';
import { EstBadge } from '@/components/ui/EstBadge';
import { AccessibleDataTable } from '@/components/ui/AccessibleDataTable';
import { ExportButton } from '@/components/ui/ExportButton';
import { Building2, DollarSign, TrendingUp, ChevronDown, ChevronUp, ArrowRight, Info, AlertTriangle, ExternalLink, Users } from 'lucide-react';

const POSITION_COLORS: Record<string, string> = {
  government: '#2563EB',
  pharma: '#C41E3A',
  trade_assoc: '#B45309',
  think_tank: '#7C3AED',
  tech: '#0891B2',
  venture_capital: '#059669',
  academic: '#4F46E5',
  other: '#6B7771',
};

const CATEGORY_LABELS: Record<string, string> = {
  insurance: 'Insurance',
  drug_pricing: 'Drug Pricing',
  pbm: 'PBM',
  hospital: 'Hospital',
};

function formatUSD(usd: number): string {
  if (usd >= 1_000_000_000) return `$${(usd / 1_000_000_000).toFixed(0)}B`;
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(0)}M`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(0)}K`;
  return `$${usd}`;
}

function PositionTimeline({ positions }: { positions: RevolvingDoorPerson['positions'] }) {
  const sorted = [...positions].sort((a, b) => a.start_year - b.start_year);
  const minYear = sorted[0]?.start_year || 2000;
  const maxYear = Math.max(...sorted.map(p => p.end_year || 2026));
  const range = maxYear - minYear || 1;

  return (
    <div className="mt-4">
      <div className="flex justify-between text-[10px] text-[#6B7771] mb-1 font-mono">
        <span>{minYear}</span>
        <span>{maxYear}</span>
      </div>
      <div className="space-y-1.5">
        {sorted.map((pos, i) => {
          const left = ((pos.start_year - minYear) / range) * 100;
          const width = (((pos.end_year || 2026) - pos.start_year) / range) * 100;
          const color = POSITION_COLORS[pos.org_type] || POSITION_COLORS.other;
          return (
            <div key={i} className="relative h-7">
              <div
                className="absolute h-full rounded flex items-center px-2 overflow-hidden"
                style={{
                  left: `${left}%`,
                  width: `${Math.max(width, 4)}%`,
                  backgroundColor: color + '1a',
                  borderLeft: `3px solid ${color}`,
                }}
                title={`${pos.title} @ ${pos.org_name} (${pos.start_year}–${pos.end_year || 'present'})`}
              >
                <span className="text-[10px] text-[#1F2A24] whitespace-nowrap overflow-hidden text-ellipsis font-body">
                  {pos.org_name}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-3 mt-2 flex-wrap">
        {Array.from(new Set(sorted.map(p => p.org_type))).map(type => (
          <div key={type} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: POSITION_COLORS[type] || POSITION_COLORS.other }} />
            <span className="text-[10px] text-[#6B7771] capitalize font-body">{type.replace('_', ' ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function FollowTheMoneyPage() {
  const [expandedInsurer, setExpandedInsurer] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'rebates' | 'premiums' | 'integration' | 'revolving-door' | 'case-studies'>('overview');
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  const [caseFilter, setCaseFilter] = useState<string>('');

  const insurers = useMemo(() => getInsurerFinancials(), []);
  const pbmData = useMemo(() => getPbmRebates(), []);
  const premiums = useMemo(() => getPremiumHistory(), []);
  const revolvingDoor = useMemo(() => getRevolvingDoor(), []);
  const caseStudies = useMemo(() => getCaseStudies(), []);

  const filteredCases = useMemo(() => {
    if (!caseFilter) return caseStudies;
    return caseStudies.filter((cs: CaseStudy) => cs.category === caseFilter);
  }, [caseStudies, caseFilter]);

  const PBM_COLORS = ['#0B6B3A', '#0B6B3A', '#6BB899', '#6B7771'];

  const views = [
    { id: 'overview' as const, label: 'Insurer Profiles' },
    { id: 'rebates' as const, label: 'Rebate Flow' },
    { id: 'premiums' as const, label: 'Premium Trends' },
    { id: 'integration' as const, label: 'Vertical Integration' },
    { id: 'revolving-door' as const, label: 'Revolving Door' },
    { id: 'case-studies' as const, label: 'Case Studies' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9F8]">
      <TopNav />

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1F2A24] font-display">Follow the Money</h1>
          <p className="mt-2 text-[#6B7771] font-body">
            Where does every dollar of your premium actually go? Track insurer profits, PBM rebates, and the flow of money.
          </p>
          <p className="mt-2 text-[10px] text-[#6B7771] font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B3A] inline-block" />
            Insurer financials: FY 2024 actuals · PBM data: Q4 2024 · Sources: SEC EDGAR, KFF, FTC reports
          </p>
        </div>

        {/* View tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2" role="tablist" aria-label="Financial data views">
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
          {activeView === 'overview' && `Showing ${insurers.length} insurer profiles.`}
          {activeView === 'rebates' && `Showing PBM rebate flow data for ${pbmData.length} PBMs.`}
          {activeView === 'premiums' && `Showing premium trends from ${premiums[premiums.length - 1]?.year || ''} to ${premiums[0]?.year || ''}.`}
          {activeView === 'integration' && `Showing vertical integration map.`}
        </div>

        {/* Overview — insurer profiles */}
        {activeView === 'overview' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <ExportButton
                filename="insurer-financials"
                data={insurers.map(ins => ({
                  name: ins.name,
                  ticker: ins.ticker,
                  type: ins.type,
                  revenue: ins.annual_revenue[0]?.revenue || '',
                  net_income: ins.net_income[0]?.income || '',
                  mlr: ins.medical_loss_ratio,
                  denial_rate: ins.prior_auth_denial_rate,
                  ceo_name: ins.ceo_name,
                  ceo_compensation: ins.ceo_compensation,
                  subsidiaries: ins.subsidiaries.join('; '),
                }))}
                columns={[
                  { key: 'name', label: 'Insurer' },
                  { key: 'ticker', label: 'Ticker' },
                  { key: 'type', label: 'Type' },
                  { key: 'revenue', label: 'Revenue (cents)' },
                  { key: 'net_income', label: 'Net Income (cents)' },
                  { key: 'mlr', label: 'Medical Loss Ratio' },
                  { key: 'denial_rate', label: 'Prior Auth Denial Rate' },
                  { key: 'ceo_name', label: 'CEO' },
                  { key: 'ceo_compensation', label: 'CEO Compensation (cents)' },
                  { key: 'subsidiaries', label: 'Subsidiaries' },
                ]}
              />
            </div>
            {insurers.map(insurer => {
              const isExpanded = expandedInsurer === insurer.insurer_id;
              const latestRevenue = insurer.annual_revenue[0]?.revenue || 0;
              const latestIncome = insurer.net_income[0]?.income || 0;

              return (
                <div key={insurer.insurer_id} className="bg-white rounded-xl border border-[#E5ECE8] shadow-sm overflow-hidden">
                  <div
                    className="p-5 cursor-pointer hover:bg-[#F7F9F8] transition-colors"
                    onClick={() => setExpandedInsurer(isExpanded ? null : insurer.insurer_id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#0B6B3A] flex items-center justify-center text-white font-bold font-display text-sm">
                          {insurer.name.split(' ')[0].slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#1F2A24] font-display">{insurer.name}</h3>
                          <p className="text-xs text-[#6B7771] font-mono">{insurer.ticker} · {insurer.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs text-[#6B7771]">Revenue</p>
                          <p className="font-mono font-bold text-[#1F2A24]">{formatCurrency(latestRevenue, true)}</p>
                        </div>
                        <div className="text-right hidden sm:block">
                          <p className="text-xs text-[#6B7771]">
                            <JargonTooltip term="MLR">MLR</JargonTooltip>
                          </p>
                          <p className="font-mono font-bold text-[#1F2A24]">{formatPercent(insurer.medical_loss_ratio)}</p>
                        </div>
                        <div className="text-right hidden sm:block relative group">
                          <p className="text-xs text-[#6B7771]">Denial Rate</p>
                          <p className="font-mono font-bold text-[#C41E3A] flex items-center gap-1 justify-end">
                            {formatPercent(insurer.prior_auth_denial_rate)}
                            <Info className="w-3 h-3 text-[#6B7771]" />
                          </p>
                          <div className="absolute right-0 top-full mt-1 w-72 bg-[#1F2A24] text-white text-xs p-3 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50 font-body leading-relaxed">
                            Source: CMS Prior Authorization and Claims Denial data (2023); ProPublica/KFF analysis of Medicare Advantage denial patterns. Methodologies vary; see Estimates/Proxies.
                          </div>
                        </div>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-[#6B7771]" /> : <ChevronDown className="w-5 h-5 text-[#6B7771]" />}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-[#E5ECE8] p-5 bg-[#F7F9F8]">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                        <MetricCard label="Revenue" value={formatCurrency(latestRevenue, true)} icon={<DollarSign className="w-4 h-4" />} />
                        <MetricCard label="Net Income" value={formatCurrency(latestIncome, true)} icon={<TrendingUp className="w-4 h-4" />} />
                        <MetricCard label="CEO Pay" value={formatCurrency(insurer.ceo_compensation, true)} subLabel={insurer.ceo_name} />
                        <MetricCard
                          label="Prior Auth Denial Rate"
                          value={formatPercent(insurer.prior_auth_denial_rate)}
                          variant="danger"
                          sourceLabel="CMS Prior Authorization and Claims Denial data (2023); ProPublica/KFF analysis of Medicare Advantage denial patterns. Methodologies vary; see Estimates/Proxies."
                          lastUpdated="2023"
                        />
                      </div>

                      {insurer.subsidiaries.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-[#1F2A24] mb-2 font-body">Subsidiaries & Divisions</p>
                          <div className="flex flex-wrap gap-1.5">
                            {insurer.subsidiaries.map((sub, i) => (
                              <span key={i} className="text-xs bg-[#E6F2EC] text-[#0B6B3A] px-2 py-0.5 rounded-full font-body">
                                {sub}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Rebate flow */}
        {activeView === 'rebates' && (
          <div className="space-y-8">
            <div className="flex justify-end">
              <ExportButton
                filename="pbm-rebate-data"
                data={pbmData.map(p => ({
                  pbm_name: p.pbm_name,
                  parent_company: p.parent_company,
                  market_share: p.market_share,
                  passthrough_rate: p.passthrough_rate,
                  retained_rate: p.retained_rate,
                  estimated_rebate_revenue: p.estimated_rebate_revenue,
                  source: p.source,
                  year: p.year,
                }))}
                columns={[
                  { key: 'pbm_name', label: 'PBM' },
                  { key: 'parent_company', label: 'Parent Company' },
                  { key: 'market_share', label: 'Market Share' },
                  { key: 'passthrough_rate', label: 'Passthrough Rate' },
                  { key: 'retained_rate', label: 'Retained Rate' },
                  { key: 'estimated_rebate_revenue', label: 'Est. Rebate Revenue (cents)' },
                  { key: 'source', label: 'Source' },
                  { key: 'year', label: 'Year' },
                ]}
              />
            </div>
            {/* Rebate flow explainer */}
            <div className="bg-white rounded-xl border border-[#E5ECE8] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#1F2A24] font-display mb-6">How Rebates Flow</h3>
              <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
                {[
                  { label: 'Drug Manufacturer', sub: 'Sets list price (WAC)', color: 'bg-[#C41E3A]' },
                  { label: 'PBM', sub: 'Negotiates rebate, keeps portion', color: 'bg-[#B45309]' },
                  { label: 'Insurance Plan', sub: 'Receives partial rebate', color: 'bg-[#0B6B3A]' },
                  { label: 'Patient', sub: 'Pays copay on LIST price', color: 'bg-[#6B7771]' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="text-center">
                      <div className={`${step.color} text-white w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-2`}>
                        <Building2 className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-semibold text-[#1F2A24] font-body">{step.label}</p>
                      <p className="text-[10px] text-[#6B7771] font-body mt-0.5">{step.sub}</p>
                    </div>
                    {i < 3 && <ArrowRight className="w-5 h-5 text-[#6B7771] hidden md:block" />}
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-[#FEE2E2] rounded-lg p-4 text-sm text-[#C41E3A] font-body">
                <strong>Key insight:</strong> Patients pay copays and coinsurance based on the drug&apos;s
                <strong> list price</strong>, not the discounted price the PBM negotiated.
                The rebate goes to the PBM and plan — the patient sees none of it.
              </div>
            </div>

            {/* PBM market share */}
            <div className="bg-white rounded-xl border border-[#E5ECE8] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#1F2A24] font-display mb-4">
                <JargonTooltip term="PBM">PBM</JargonTooltip> Market Concentration
              </h3>
              <p className="text-sm text-[#6B7771] font-body mb-6">
                Three companies control approximately 80% of all prescription drug benefits in America.
              </p>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pbmData.map(p => ({ name: p.pbm_name, value: p.market_share }))}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={2}
                      >
                        {pbmData.map((_, i) => (
                          <Cell key={i} fill={PBM_COLORS[i % PBM_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                  {pbmData.map((pbm, i) => (
                    <div key={pbm.pbm_id} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PBM_COLORS[i] }} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-[#1F2A24] font-body">{pbm.pbm_name}</span>
                          <span className="text-sm font-mono font-bold text-[#1F2A24]">{formatPercent(pbm.market_share, 0)}</span>
                        </div>
                        <p className="text-xs text-[#6B7771] font-body flex items-center gap-0.5">
                          Parent: {pbm.parent_company} · Passthrough: ~{formatPercent(pbm.passthrough_rate, 0)}
                          <EstBadge confidence="low" />
                          <SourceIcon
                            sourceLabel={`${pbm.source || 'FTC Interim Report on PBMs'}, ${pbm.year || 2024}`}
                            lastUpdated={String(pbm.year || 2024)}
                          />
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accessible data table for PBM chart */}
              <AccessibleDataTable
                caption="PBM market share, parent company, and estimated rebate revenue"
                columns={[
                  { key: 'name', label: 'PBM' },
                  { key: 'parent', label: 'Parent Company' },
                  { key: 'share', label: 'Market Share', format: (v) => `${v}%` },
                  { key: 'passthrough', label: 'Passthrough Rate', format: (v) => `${v}%` },
                  { key: 'revenue', label: 'Est. Rebate Revenue', format: (v) => formatCurrency(Number(v), true) },
                ]}
                rows={pbmData.map(p => ({
                  name: p.pbm_name,
                  parent: p.parent_company,
                  share: p.market_share,
                  passthrough: p.passthrough_rate,
                  revenue: p.estimated_rebate_revenue,
                }))}
              />
            </div>

            {/* Spread pricing */}
            <div className="bg-white rounded-xl border border-[#E5ECE8] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#1F2A24] font-display mb-2">Spread Pricing Explained</h3>
              <p className="text-xs text-[#6B7771] font-body mb-4 flex items-center gap-1">
                Illustrative example based on FTC findings
                <EstBadge confidence="low" />
                <SourceIcon sourceLabel="FTC Interim Report on PBMs, 2024" lastUpdated="2024" />
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#FEE2E2] rounded-lg p-5">
                  <p className="text-xs text-[#C41E3A] font-semibold mb-2 font-body uppercase tracking-wider">PBM bills the plan</p>
                  <p className="text-3xl font-bold text-[#C41E3A] font-mono">$500</p>
                  <p className="text-sm text-[#6B7771] font-body mt-1">For a 30-day supply</p>
                </div>
                <div className="bg-[#E6F2EC] rounded-lg p-5">
                  <p className="text-xs text-[#0B6B3A] font-semibold mb-2 font-body uppercase tracking-wider">PBM pays the pharmacy</p>
                  <p className="text-3xl font-bold text-[#0B6B3A] font-mono">$350</p>
                  <p className="text-sm text-[#6B7771] font-body mt-1">For the same 30-day supply</p>
                </div>
              </div>
              <div className="mt-4 bg-[#FFFBEB] rounded-lg p-4 text-center">
                <p className="text-xs text-[#B45309] font-semibold font-body">THE SPREAD</p>
                <p className="text-2xl font-bold text-[#B45309] font-mono">$150</p>
                <p className="text-sm text-[#6B7771] font-body mt-1">
                  The PBM keeps this difference. The patient, pharmacy, and plan sponsor may never see it.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Premium trends */}
        {activeView === 'premiums' && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <ExportButton
                filename="premium-history"
                data={premiums.map(p => ({
                  year: p.year,
                  avg_family_premium: p.avg_family_premium,
                  avg_family_deductible: p.avg_family_deductible,
                  avg_individual_premium: p.avg_individual_premium,
                  avg_individual_deductible: p.avg_individual_deductible,
                  source: p.source,
                }))}
                columns={[
                  { key: 'year', label: 'Year' },
                  { key: 'avg_family_premium', label: 'Avg Family Premium (cents)' },
                  { key: 'avg_family_deductible', label: 'Avg Family Deductible (cents)' },
                  { key: 'avg_individual_premium', label: 'Avg Individual Premium (cents)' },
                  { key: 'avg_individual_deductible', label: 'Avg Individual Deductible (cents)' },
                  { key: 'source', label: 'Source' },
                ]}
              />
            </div>
            <div className="bg-white rounded-xl border border-[#E5ECE8] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#1F2A24] font-display mb-4">
                Premiums Rise, Coverage Stays Flat
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={premiums.map(p => ({
                    year: p.year,
                    premium: p.avg_family_premium / 100,
                    deductible: p.avg_family_deductible / 100,
                  }))}>
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#6B7771', fontFamily: 'DM Mono' }} />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#6B7771', fontFamily: 'DM Mono' }}
                      tickFormatter={v => `$${(v / 1000).toFixed(0)}K`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2A24', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                      formatter={(value) => [`$${Number(value).toLocaleString()}`, '']}
                    />
                    <Line type="monotone" dataKey="premium" stroke="#C41E3A" strokeWidth={2} name="Avg Family Premium" dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="deductible" stroke="#2563EB" strokeWidth={2} name="Avg Family Deductible" dot={{ r: 2 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-6 mt-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#C41E3A]" />
                  <span className="text-xs text-[#6B7771] font-body">Average Family Premium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#2563EB]" />
                  <span className="text-xs text-[#6B7771] font-body">Average Family Deductible</span>
                </div>
              </div>
              <p className="text-xs text-[#6B7771] mt-4 font-body text-center">
                Source: Kaiser Family Foundation Employer Health Benefits Survey
              </p>

              {/* Accessible data table for premium trends chart */}
              <AccessibleDataTable
                caption="Average family health insurance premiums and deductibles by year"
                columns={[
                  { key: 'year', label: 'Year' },
                  { key: 'premium', label: 'Avg Family Premium', format: (v) => formatCurrency(Number(v)) },
                  { key: 'deductible', label: 'Avg Family Deductible', format: (v) => formatCurrency(Number(v)) },
                ]}
                rows={premiums.map(p => ({
                  year: p.year,
                  premium: p.avg_family_premium,
                  deductible: p.avg_family_deductible,
                }))}
              />
            </div>
          </div>
        )}

        {/* Vertical integration */}
        {activeView === 'integration' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E5ECE8] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#1F2A24] font-display mb-2">Vertical Integration</h3>
              <p className="text-sm text-[#6B7771] font-body mb-6">
                The largest health companies own the insurer, the PBM, the pharmacy, and the clinics.
                They profit at every step of the supply chain.
              </p>

              {insurers
                .filter(ins => ins.type === 'integrated' || ins.subsidiaries.length > 2)
                .map(ins => (
                  <div key={ins.insurer_id} className="mb-6 last:mb-0">
                    <div className="bg-[#0B6B3A] text-white rounded-t-xl p-4">
                      <h4 className="font-bold font-display text-lg">{ins.name}</h4>
                      <p className="text-sm text-[#E6F2EC] font-mono">{ins.ticker}</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0.5 bg-[#E5ECE8]">
                      {ins.subsidiaries.map((sub, i) => (
                        <div key={i} className="bg-white p-3 text-center">
                          <p className="text-xs text-[#6B7771] font-body">
                            {i === 0 ? 'Insurance' : i === 1 ? 'PBM' : i === 2 ? 'Pharmacy' : 'Other'}
                          </p>
                          <p className="text-sm font-medium text-[#1F2A24] font-body mt-1">{sub}</p>
                        </div>
                      ))}
                    </div>
                    <div className="bg-[#FEE2E2] rounded-b-xl p-3 text-xs text-[#C41E3A] font-body text-center">
                      One company profits as insurer, pharmacy manager, and pharmacy — all from the same patient.
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        {/* Revolving Door */}
        {activeView === 'revolving-door' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E5ECE8] p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-[#C41E3A]" />
                <h3 className="text-lg font-bold text-[#1F2A24] font-display">The Revolving Door</h3>
              </div>
              <p className="text-sm text-[#6B7771] font-body mb-1">
                Officials who move between government agencies and the industries they regulate — carrying policy influence and insider knowledge with them.
              </p>
              <p className="text-[10px] text-[#6B7771] font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B3A] inline-block" />
                Sources: OpenSecrets, SEC EDGAR, CMS, FDA · {revolvingDoor.length} profiles
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {revolvingDoor.map((person) => (
                <div key={person.id} className="bg-white rounded-xl border border-[#E5ECE8] p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold text-[#1F2A24] font-display">{person.full_name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${
                      person.significance === 'high'
                        ? 'bg-[#FEE2E2] text-[#C41E3A]'
                        : 'bg-[#FFFBEB] text-[#B45309]'
                    }`}>
                      {person.significance} significance
                    </span>
                  </div>

                  <PositionTimeline positions={person.positions} />

                  <p className="text-sm text-[#6B7771] font-body mt-4 leading-relaxed">
                    {person.known_policy_influence}
                  </p>

                  <div className="mt-4 space-y-1.5">
                    {person.positions.map((pos, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        <div
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                          style={{ backgroundColor: POSITION_COLORS[pos.org_type] || POSITION_COLORS.other }}
                        />
                        <span className="text-[#1F2A24] font-body font-medium">{pos.title}</span>
                        <span className="text-[#6B7771] font-body">
                          @ {pos.org_name} ({pos.start_year}–{pos.end_year || 'present'})
                        </span>
                      </div>
                    ))}
                  </div>

                  {person.source_urls.length > 0 && (
                    <div className="mt-3 flex gap-2">
                      {person.source_urls.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                          className="text-[10px] text-[#6B7771] hover:text-[#0B6B3A] underline font-body flex items-center gap-0.5">
                          Source {i + 1} <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Case Studies */}
        {activeView === 'case-studies' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-[#E5ECE8] p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-[#C41E3A]" />
                <h3 className="text-lg font-bold text-[#1F2A24] font-display">Case Studies</h3>
              </div>
              <p className="text-sm text-[#6B7771] font-body">
                Investigative analysis of lobbying operations and their direct impact on patients and costs.
              </p>
            </div>

            {/* Category filters */}
            <div className="flex gap-2 flex-wrap">
              {['', 'insurance', 'drug_pricing', 'pbm', 'hospital'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCaseFilter(cat)}
                  className={`px-3 py-1.5 text-xs rounded-full border transition-colors font-body ${
                    caseFilter === cat
                      ? 'bg-[#0B6B3A] text-white border-[#0B6B3A]'
                      : 'border-[#E5ECE8] text-[#6B7771] hover:text-[#1F2A24] bg-white'
                  }`}
                >
                  {cat ? CATEGORY_LABELS[cat] || cat : 'All'}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredCases.map((cs: CaseStudy) => {
                const isExpanded = expandedCase === cs.id;
                return (
                  <div key={cs.id} className="bg-white rounded-xl border border-[#E5ECE8] shadow-sm overflow-hidden">
                    <div
                      className="p-6 cursor-pointer hover:bg-[#F7F9F8] transition-colors"
                      onClick={() => setExpandedCase(isExpanded ? null : cs.id)}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            {cs.category && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#E5ECE8] text-[#6B7771] font-body">
                                {CATEGORY_LABELS[cs.category] || cs.category}
                              </span>
                            )}
                            {cs.is_featured && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFFBEB] text-[#B45309] font-body">
                                Featured
                              </span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold text-[#1F2A24] font-display">{cs.title}</h3>
                          <p className="text-sm text-[#6B7771] font-body mt-1 italic">{cs.subtitle}</p>
                        </div>
                        {isExpanded ? <ChevronUp className="w-5 h-5 text-[#6B7771] flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-[#6B7771] flex-shrink-0" />}
                      </div>

                      <div className="flex gap-6 mt-4">
                        {cs.estimated_patient_cost_usd > 0 && (
                          <div>
                            <div className="text-[10px] text-[#6B7771] uppercase font-mono">Patient Cost</div>
                            <div className="font-mono text-sm text-[#C41E3A] font-bold">{formatUSD(cs.estimated_patient_cost_usd)}</div>
                          </div>
                        )}
                        {cs.lobbying_spend_related_usd > 0 && (
                          <div>
                            <div className="text-[10px] text-[#6B7771] uppercase font-mono">Lobbying Spend</div>
                            <div className="font-mono text-sm text-[#1F2A24] font-bold">{formatUSD(cs.lobbying_spend_related_usd)}</div>
                          </div>
                        )}
                        {cs.organizations.length > 0 && (
                          <div>
                            <div className="text-[10px] text-[#6B7771] uppercase font-mono">Organizations</div>
                            <div className="text-xs text-[#6B7771] font-body">{cs.organizations.join(', ')}</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-[#E5ECE8] p-6 bg-[#F7F9F8]">
                        {/* Key Findings */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-[#1F2A24] font-body mb-3">Key Findings</h4>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {cs.key_findings.map((finding, i) => (
                              <div key={i} className="flex items-start gap-2 bg-white rounded-lg p-3 border border-[#E5ECE8]">
                                <span className="text-[#C41E3A] font-bold text-xs mt-0.5">●</span>
                                <span className="text-sm text-[#1F2A24] font-body leading-relaxed">{finding}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Full content */}
                        <div className="mb-6">
                          <h4 className="text-sm font-semibold text-[#1F2A24] font-body mb-3">Analysis</h4>
                          <div className="bg-white rounded-lg border border-[#E5ECE8] p-5">
                            {cs.full_content.split('\n\n').map((paragraph, i) => (
                              <p key={i} className="text-sm text-[#1F2A24] font-body leading-relaxed mb-3 last:mb-0">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        </div>

                        {/* Sources */}
                        {cs.sources.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-[#1F2A24] font-body mb-2">Sources</h4>
                            <div className="flex flex-wrap gap-2">
                              {cs.sources.map((source, i) => (
                                <a
                                  key={i}
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-[#0B6B3A] hover:underline font-body flex items-center gap-1 bg-white rounded-full px-3 py-1 border border-[#E5ECE8]"
                                >
                                  {source.name} <ExternalLink className="w-3 h-3" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

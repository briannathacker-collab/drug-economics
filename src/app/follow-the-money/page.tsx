'use client';

import { useState, useMemo } from 'react';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { MetricCard } from '@/components/ui/MetricCard';
import { JargonTooltip } from '@/components/ui/JargonTooltip';
import { getInsurerFinancials, getPbmRebates, getPremiumHistory } from '@/lib/data';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { SourceIcon } from '@/components/ui/SourceIcon';
import { EstBadge } from '@/components/ui/EstBadge';
import { AccessibleDataTable } from '@/components/ui/AccessibleDataTable';
import { ExportButton } from '@/components/ui/ExportButton';
import { Building2, DollarSign, TrendingUp, ChevronDown, ChevronUp, ArrowRight, Info } from 'lucide-react';

export default function FollowTheMoneyPage() {
  const [expandedInsurer, setExpandedInsurer] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'overview' | 'rebates' | 'premiums' | 'integration'>('overview');

  const insurers = useMemo(() => getInsurerFinancials(), []);
  const pbmData = useMemo(() => getPbmRebates(), []);
  const premiums = useMemo(() => getPremiumHistory(), []);

  const PBM_COLORS = ['#0B6B3A', '#0B6B3A', '#6BB899', '#6B7771'];

  const totalPbmRevenue = pbmData.reduce((sum, p) => sum + p.estimated_rebate_revenue, 0);

  const views = [
    { id: 'overview' as const, label: 'Insurer Profiles' },
    { id: 'rebates' as const, label: 'Rebate Flow' },
    { id: 'premiums' as const, label: 'Premium Trends' },
    { id: 'integration' as const, label: 'Vertical Integration' },
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
      </main>

      <Footer />
    </div>
  );
}

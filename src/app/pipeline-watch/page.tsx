'use client';

import { useState, useMemo } from 'react';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { getPatents, getBiosimilarPipeline, getPipelineTrials, getDelayTactics, getWacPrices } from '@/lib/data';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { EstBadge } from '@/components/ui/EstBadge';
import { ExportButton } from '@/components/ui/ExportButton';
import { Clock, FlaskConical, ShieldAlert, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type Tab = 'timeline' | 'biosimilars' | 'trials';

export default function PipelineWatchPage() {
  const [activeTab, setActiveTab] = useState<Tab>('timeline');
  const [expandedDrug, setExpandedDrug] = useState<string | null>(null);
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('');

  const patents = useMemo(() => getPatents(), []);
  const biosimilars = useMemo(() => getBiosimilarPipeline(), []);
  const trials = useMemo(() => getPipelineTrials(), []);
  const delays = useMemo(() => getDelayTactics(), []);
  const drugs = useMemo(() => getWacPrices(), []);

  const tabs = [
    { id: 'timeline' as Tab, label: 'Patent Cliff Timeline', icon: <Clock className="w-4 h-4" /> },
    { id: 'biosimilars' as Tab, label: 'Biosimilar Tracker', icon: <FlaskConical className="w-4 h-4" /> },
    { id: 'trials' as Tab, label: 'Drugs in Trials', icon: <ShieldAlert className="w-4 h-4" /> },
  ];

  // Sort patents by cliff date
  const sortedPatents = useMemo(
    () => [...patents].sort((a, b) => new Date(a.patent_cliff_date).getTime() - new Date(b.patent_cliff_date).getTime()),
    [patents]
  );

  // Filter trials
  const filteredTrials = useMemo(() => {
    let t = trials;
    if (specialtyFilter) t = t.filter(x => x.specialty === specialtyFilter);
    if (phaseFilter) t = t.filter(x => x.phase === phaseFilter);
    return t;
  }, [trials, specialtyFilter, phaseFilter]);

  const trialSpecialties = useMemo(() => Array.from(new Set(trials.map(t => t.specialty))).sort(), [trials]);

  return (
    <div className="min-h-screen bg-[#F7F9F8]">
      <TopNav />

      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1F2A24] font-display">Pipeline Watch</h1>
          <p className="mt-2 text-[#6B7771] font-body">
            When will there be a cheaper version of your drug? Track patent cliffs, biosimilar progress, and clinical trials.
          </p>
          <p className="mt-2 text-[10px] text-[#6B7771] font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B6B3A] inline-block" />
            Patent and pipeline data current as of Q4 2024 · Sources: FDA Orange Book, ClinicalTrials.gov, SEC filings
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2" role="tablist" aria-label="Pipeline data views">
          {tabs.map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors font-body ${
                activeTab === tab.id
                  ? 'bg-[#0B6B3A] text-white'
                  : 'bg-white text-[#6B7771] border border-[#E5ECE8] hover:bg-[#F1F5F9]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ARIA live region for screen reader announcements */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {activeTab === 'timeline' && `Showing Patent Cliff Timeline with ${sortedPatents.length} drugs.`}
          {activeTab === 'biosimilars' && `Showing Biosimilar Tracker with ${biosimilars.length} entries.`}
          {activeTab === 'trials' && `Showing ${filteredTrials.length} clinical trial${filteredTrials.length !== 1 ? 's' : ''}${specialtyFilter || phaseFilter ? ' matching your filters' : ''}.`}
        </div>

        {/* Patent cliff timeline */}
        {activeTab === 'timeline' && (
          <div id="panel-timeline" role="tabpanel" aria-label="Patent Cliff Timeline">
            <div className="flex justify-end mb-4">
              <ExportButton
                filename="patent-cliff-timeline"
                data={sortedPatents.map(p => {
                  const delay = delays.find(d => d.drug_id === p.drug_id);
                  const drug = drugs.find(d => d.drug_id === p.drug_id);
                  return {
                    drug_name: p.drug_name,
                    patent_cliff_date: p.patent_cliff_date,
                    exclusivity_type: p.exclusivity_type,
                    secondary_patents: p.secondary_patents.length,
                    delay_years: p.delay_years,
                    wac_monthly: drug?.wac_monthly || '',
                    wac_annual: drug?.wac_annual || '',
                    delay_tactics: delay?.tactics.map(t => t.type).join('; ') || '',
                  };
                })}
                columns={[
                  { key: 'drug_name', label: 'Drug' },
                  { key: 'patent_cliff_date', label: 'Patent Cliff' },
                  { key: 'exclusivity_type', label: 'Exclusivity' },
                  { key: 'secondary_patents', label: 'Secondary Patents' },
                  { key: 'delay_years', label: 'Delay (Years)' },
                  { key: 'wac_monthly', label: 'WAC Monthly (cents)' },
                  { key: 'wac_annual', label: 'WAC Annual (cents)' },
                  { key: 'delay_tactics', label: 'Delay Tactics' },
                ]}
              />
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Year markers */}
                <div className="flex items-end border-b border-[#E5ECE8] pb-2 mb-4">
                  {Array.from({ length: 12 }, (_, i) => 2024 + i).map(year => (
                    <div key={year} className="flex-1 text-center">
                      <span className="text-xs font-mono text-[#6B7771]">{year}</span>
                    </div>
                  ))}
                </div>

                {/* Drug chips on timeline */}
                <div className="space-y-2">
                  {sortedPatents.map(patent => {
                    const cliffYear = new Date(patent.patent_cliff_date).getFullYear();
                    const startYear = 2024;
                    const offsetPercent = ((cliffYear - startYear) / 12) * 100;
                    const hasBiosimilar = biosimilars.some(
                      b => b.reference_drug_id === patent.drug_id && b.status === 'launched'
                    );
                    const delay = delays.find(d => d.drug_id === patent.drug_id);
                    const drug = drugs.find(d => d.drug_id === patent.drug_id);
                    const isExpanded = expandedDrug === patent.drug_id;

                    return (
                      <div key={patent.drug_id}>
                        <div className="relative h-10 bg-[#F1F5F9] rounded-lg">
                          <div
                            className={`absolute top-1 h-8 rounded-md px-3 flex items-center gap-1 text-xs font-medium cursor-pointer transition-all ${
                              hasBiosimilar
                                ? 'bg-[#E6F2EC] text-[#0B6B3A] border border-[#0B6B3A]/30'
                                : 'bg-[#FEE2E2] text-[#C41E3A] border border-[#C41E3A]/30'
                            }`}
                            style={{ left: `${Math.max(0, Math.min(90, offsetPercent))}%` }}
                            onClick={() => setExpandedDrug(isExpanded ? null : patent.drug_id)}
                          >
                            <span className="font-semibold">{patent.drug_name}</span>
                            <span className="font-mono text-[10px] opacity-70">{cliffYear}</span>
                            {delay && delay.total_delay_years > 0 && (
                              <span className="bg-[#C41E3A] text-white px-1 rounded text-[10px]">
                                +{delay.total_delay_years}yr delay
                              </span>
                            )}
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </div>
                        </div>

                        {/* Expanded detail */}
                        {isExpanded && (
                          <div className="bg-white rounded-lg border border-[#E5ECE8] p-4 mt-1 ml-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-[#6B7771] text-xs font-body">Patent Cliff</p>
                                <p className="font-medium text-[#1F2A24] font-mono">{formatDate(patent.patent_cliff_date)}</p>
                              </div>
                              <div>
                                <p className="text-[#6B7771] text-xs font-body">Exclusivity</p>
                                <p className="font-medium text-[#1F2A24] font-body">{patent.exclusivity_type}</p>
                              </div>
                              <div>
                                <p className="text-[#6B7771] text-xs font-body">Secondary Patents</p>
                                <p className="font-medium text-[#1F2A24] font-mono">{patent.secondary_patents.length}</p>
                              </div>
                              <div>
                                <p className="text-[#6B7771] text-xs font-body">Delay</p>
                                <p className="font-medium text-[#C41E3A] font-mono">
                                  {patent.delay_years > 0 ? `${patent.delay_years} years` : 'None documented'}
                                </p>
                              </div>
                            </div>
                            {drug && (
                              <div className="mt-3 pt-3 border-t border-[#E5ECE8]">
                                <p className="text-xs text-[#6B7771] font-body">
                                  Current WAC: <span className="text-[#C41E3A] font-mono font-bold">{formatCurrency(drug.wac_monthly)}/mo</span>
                                  {' · '}Annual: <span className="text-[#C41E3A] font-mono font-bold">{formatCurrency(drug.wac_annual)}</span>
                                </p>
                              </div>
                            )}
                            {delay && delay.tactics.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-[#E5ECE8]">
                                <p className="text-xs font-semibold text-[#1F2A24] mb-2">Delay Tactics Used:</p>
                                <div className="flex flex-wrap gap-1">
                                  {delay.tactics.map((t, i) => (
                                    <span key={i} className="text-[10px] bg-[#FEE2E2] text-[#C41E3A] px-2 py-0.5 rounded-full">
                                      {t.type.replace(/_/g, ' ')}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {/* Cross-app links */}
                            <div className="mt-3 pt-3 border-t border-[#E5ECE8] flex flex-wrap gap-2">
                              <Link
                                href={`/what-it-costs-me?drug=${patent.drug_id}`}
                                className="inline-flex items-center gap-1 text-xs text-[#0B6B3A] font-medium hover:underline font-body"
                              >
                                Calculate your cost <ArrowRight className="w-3 h-3" />
                              </Link>
                              {delay && delay.total_delay_years > 0 && (
                                <Link
                                  href="/the-generic-gap"
                                  className="inline-flex items-center gap-1 text-xs text-[#C41E3A] font-medium hover:underline font-body"
                                >
                                  See delay tactics <ArrowRight className="w-3 h-3" />
                                </Link>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Biosimilar tracker */}
        {activeTab === 'biosimilars' && (
          <div id="panel-biosimilars" role="tabpanel" aria-label="Biosimilar Tracker">
            <div className="flex justify-end mb-4">
              <ExportButton
                filename="biosimilar-tracker"
                data={biosimilars.map(bio => ({
                  reference_drug: bio.reference_drug_name,
                  biosimilar: bio.biosimilar_name,
                  applicant: bio.applicant,
                  status: bio.status,
                  discount_percent: bio.current_discount_percent || '',
                  filing_date: bio.filing_date || '',
                  approval_date: bio.approval_date || '',
                }))}
                columns={[
                  { key: 'reference_drug', label: 'Reference Drug' },
                  { key: 'biosimilar', label: 'Biosimilar' },
                  { key: 'applicant', label: 'Applicant' },
                  { key: 'status', label: 'Status' },
                  { key: 'discount_percent', label: 'Discount %' },
                  { key: 'filing_date', label: 'Filing Date' },
                  { key: 'approval_date', label: 'Approval Date' },
                ]}
              />
            </div>
            <div className="bg-white rounded-xl border border-[#E5ECE8] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E5ECE8] bg-[#F7F9F8]">
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7771] uppercase tracking-wider font-body">Reference Drug</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7771] uppercase tracking-wider font-body">Biosimilar</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7771] uppercase tracking-wider font-body">Applicant</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7771] uppercase tracking-wider font-body">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-[#6B7771] uppercase tracking-wider font-body">Discount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7771] uppercase tracking-wider font-body">Filed</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-[#6B7771] uppercase tracking-wider font-body">Approved</th>
                  </tr>
                </thead>
                <tbody>
                  {biosimilars.map((bio, i) => (
                    <tr key={i} className="border-b border-[#E5ECE8] hover:bg-[#F7F9F8]">
                      <td className="px-4 py-3 font-medium text-[#1F2A24] font-body">{bio.reference_drug_name}</td>
                      <td className="px-4 py-3 text-[#0B6B3A] font-body font-medium">{bio.biosimilar_name}</td>
                      <td className="px-4 py-3 text-[#6B7771] font-body">{bio.applicant}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          bio.status === 'launched' ? 'bg-[#E6F2EC] text-[#0B6B3A]' :
                          bio.status === 'approved' ? 'bg-[#FFFBEB] text-[#B45309]' :
                          bio.status === 'filed' ? 'bg-[#F1F5F9] text-[#6B7771]' :
                          'bg-[#FEE2E2] text-[#C41E3A]'
                        }`}>
                          {bio.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-[#0B6B3A] font-medium">
                        {bio.current_discount_percent ? `${bio.current_discount_percent}%` : '—'}
                      </td>
                      <td className="px-4 py-3 text-[#6B7771] font-mono text-xs">{bio.filing_date ? formatDate(bio.filing_date) : '—'}</td>
                      <td className="px-4 py-3 text-[#6B7771] font-mono text-xs">
                        {bio.approval_date ? formatDate(bio.approval_date) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          </div>
        )}

        {/* Pipeline trials */}
        {activeTab === 'trials' && (
          <div id="panel-trials" role="tabpanel" aria-label="Drugs in Trials">
            {/* Filters + Export */}
            <div className="flex items-center gap-3 mb-6">
              <select
                value={specialtyFilter}
                onChange={e => setSpecialtyFilter(e.target.value)}
                aria-label="Filter trials by specialty"
                className="px-3 py-2 rounded-lg border border-[#E5ECE8] bg-white text-sm text-[#6B7771] font-body"
              >
                <option value="">All Specialties</option>
                {trialSpecialties.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={phaseFilter}
                onChange={e => setPhaseFilter(e.target.value)}
                aria-label="Filter trials by phase"
                className="px-3 py-2 rounded-lg border border-[#E5ECE8] bg-white text-sm text-[#6B7771] font-body"
              >
                <option value="">All Phases</option>
                <option value="Phase 2">Phase 2</option>
                <option value="Phase 3">Phase 3</option>
              </select>
              <div className="ml-auto">
                <ExportButton
                  filename="pipeline-trials"
                  data={filteredTrials.map(t => ({
                    drug_name: t.drug_name,
                    developer: t.developer || '',
                    phase: t.phase,
                    condition: t.condition || '',
                    specialty: t.specialty || '',
                    nct_number: t.nct_number || '',
                    enrollment: t.enrollment,
                    estimated_completion: t.estimated_completion || '',
                    designation: t.designation || '',
                    current_soc_monthly: t.current_soc_monthly_cost || '',
                  }))}
                  columns={[
                    { key: 'drug_name', label: 'Drug' },
                    { key: 'developer', label: 'Developer' },
                    { key: 'phase', label: 'Phase' },
                    { key: 'condition', label: 'Condition' },
                    { key: 'specialty', label: 'Specialty' },
                    { key: 'nct_number', label: 'NCT Number' },
                    { key: 'enrollment', label: 'Enrollment' },
                    { key: 'estimated_completion', label: 'Est. Completion' },
                    { key: 'designation', label: 'Designation' },
                    { key: 'current_soc_monthly', label: 'Current SOC Monthly (cents)' },
                  ]}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTrials.map(trial => (
                <div key={trial.nct_number} className="bg-white rounded-xl border border-[#E5ECE8] p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-[#1F2A24] font-body">{trial.drug_name}</h3>
                      <p className="text-xs text-[#6B7771] font-body">{trial.developer}</p>
                    </div>
                    {trial.designation && (
                      <span className="px-2 py-0.5 bg-[#E6F2EC] text-[#0B6B3A] rounded-full text-[10px] font-medium uppercase">
                        {trial.designation.replace('_', ' ')}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-[#6B7771] font-body mb-3">{trial.condition}</p>

                  {/* Phase progress */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#6B7771] font-body">{trial.phase}</span>
                      <span className="text-[#6B7771] font-mono">{trial.nct_number}</span>
                    </div>
                    <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0B6B3A] rounded-full"
                        style={{ width: trial.phase === 'Phase 3' ? '75%' : trial.phase === 'Phase 2' ? '50%' : '25%' }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-[#6B7771]">Enrollment</p>
                      <p className="font-mono text-[#1F2A24]">{trial.enrollment.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-[#6B7771]">Est. Completion</p>
                      <p className="font-mono text-[#1F2A24]">{trial.estimated_completion ? formatDate(trial.estimated_completion) : '—'}</p>
                    </div>
                    <div>
                      <p className="text-[#6B7771]">Specialty</p>
                      <p className="text-[#1F2A24]">{trial.specialty}</p>
                    </div>
                    {trial.current_soc_monthly_cost && (
                      <div>
                        <p className="text-[#6B7771]">Current SOC Cost</p>
                        <p className="font-mono text-[#C41E3A] font-medium">{formatCurrency(trial.current_soc_monthly_cost)}/mo</p>
                      </div>
                    )}
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

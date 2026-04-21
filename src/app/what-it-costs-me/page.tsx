'use client';

import { useState, useMemo, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { MetricCard } from '@/components/ui/MetricCard';
import { EstBadge } from '@/components/ui/EstBadge';
import { getWacPrices, getCogsForDrug } from '@/lib/data';
import { formatCurrency } from '@/lib/formatters';
import { SourceIcon } from '@/components/ui/SourceIcon';
import { Calculator, DollarSign, Globe, Info, ExternalLink, Share2, Check } from 'lucide-react';

// Source of truth is wac_prices.json's `pricing_model` field; this set is a
// defensive fallback for records that haven't been tagged yet.
const ONE_TIME_THERAPIES = new Set([
  'hemgenix', 'zolgensma', 'luxturna', 'kymriah', 'yescarta', 'carvykti', 'abecma',
]);

function isOneTime(drug: { drug_id: string; pricing_model?: string }): boolean {
  return drug.pricing_model === 'one_time' || ONE_TIME_THERAPIES.has(drug.drug_id);
}

const INSURANCE_TYPES = [
  { id: 'employer', label: 'Employer Plan', copayRate: 0.20, deductible: 150000 },
  { id: 'marketplace_silver', label: 'ACA Silver Plan', copayRate: 0.30, deductible: 300000 },
  { id: 'marketplace_bronze', label: 'ACA Bronze Plan', copayRate: 0.40, deductible: 700000 },
  { id: 'medicare_b', label: 'Medicare Part B', copayRate: 0.20, deductible: 24000 },
  { id: 'medicare_d', label: 'Medicare Part D', copayRate: 0.25, deductible: 54500 },
  { id: 'medicaid', label: 'Medicaid', copayRate: 0.03, deductible: 0 },
  { id: 'va', label: 'VA / Military', copayRate: 0.0, deductible: 0 },
  { id: 'uninsured', label: 'Uninsured', copayRate: 1.0, deductible: 0 },
];

// Approximate international prices as percentage of US WAC
const INTL_PRICES: Record<string, number> = {
  Canada: 0.55,
  Germany: 0.50,
  Australia: 0.45,
  UK: 0.42,
  Japan: 0.48,
};

function WhatItCostsMe() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedDrug, setSelectedDrug] = useState(() => searchParams.get('drug') || '');
  const [insuranceType, setInsuranceType] = useState(() => searchParams.get('plan') || '');
  const [deductibleMet, setDeductibleMet] = useState(() => searchParams.get('deductible') === 'yes');
  const [showResults, setShowResults] = useState(() => !!(searchParams.get('drug') && searchParams.get('plan')));
  const [copied, setCopied] = useState(false);

  const drugs = useMemo(() => getWacPrices(), []);

  const drug = useMemo(() => drugs.find(d => d.drug_id === selectedDrug), [drugs, selectedDrug]);
  const insurance = useMemo(() => INSURANCE_TYPES.find(i => i.id === insuranceType), [insuranceType]);
  const cogs = useMemo(() => drug ? getCogsForDrug(drug.drug_id) : undefined, [drug]);

  // Update URL when results are shown
  const updateUrl = useCallback((drugId: string, plan: string, deductible: boolean) => {
    if (drugId && plan) {
      const params = new URLSearchParams();
      params.set('drug', drugId);
      params.set('plan', plan);
      params.set('deductible', deductible ? 'yes' : 'no');
      router.replace(`/what-it-costs-me?${params.toString()}`, { scroll: false });
    }
  }, [router]);

  const calculate = () => {
    if (drug && insurance) {
      setShowResults(true);
      updateUrl(selectedDrug, insuranceType, deductibleMet);
    }
  };

  const shareUrl = () => {
    const params = new URLSearchParams();
    params.set('drug', selectedDrug);
    params.set('plan', insuranceType);
    params.set('deductible', deductibleMet ? 'yes' : 'no');
    const url = `${window.location.origin}/what-it-costs-me?${params.toString()}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate patient OOP. For one-time therapies, compute against the total
  // one-time price (wac_annual) rather than multiplying monthly by 12.
  const oopTotal = useMemo(() => {
    if (!drug || !insurance) return 0;
    const priceBasis = drug && isOneTime(drug) ? drug.wac_annual : drug.wac_monthly;
    if (insurance.id === 'uninsured') return priceBasis;
    if (deductibleMet) return Math.round(priceBasis * insurance.copayRate);
    return priceBasis;
  }, [drug, insurance, deductibleMet]);

  const oneTime = drug ? isOneTime(drug) : false;
  const oopMonthly = oneTime ? oopTotal : oopTotal;
  const oopAnnual = oneTime ? oopTotal : oopTotal * 12;

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <TopNav />

      <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1a1a1a] font-display">What It Costs Me</h1>
          <p className="mt-2 text-[#555555] font-body">
            What will you personally pay for your medication? Select your drug and insurance to find out.
          </p>
        </div>

        {/* Calculator form */}
        <div className="bg-white rounded-xl border border-[#e0ddd5] p-6 shadow-sm mb-8">
          <div className="space-y-6">
            {/* Step 1: Drug selector */}
            <div>
              <label htmlFor="drug-select" className="block text-sm font-semibold text-[#1a1a1a] font-body mb-2">
                <span className="bg-[#2d5016] text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs mr-2" aria-hidden="true">1</span>
                Select Your Drug
              </label>
              <select
                id="drug-select"
                value={selectedDrug}
                onChange={e => { setSelectedDrug(e.target.value); setShowResults(false); }}
                aria-label="Select a drug to calculate cost"
                className="w-full px-4 py-3 rounded-lg border border-[#e0ddd5] bg-white text-sm text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 focus:border-[#2d5016] font-body"
              >
                <option value="">Choose a drug...</option>
                {drugs.map(d => (
                  <option key={d.drug_id} value={d.drug_id}>
                    {d.drug_name} ({d.generic_name}) — {isOneTime(d)
                      ? `${formatCurrency(d.wac_annual)} total (one-time)`
                      : `${formatCurrency(d.wac_monthly)}/mo`}
                  </option>
                ))}
              </select>
            </div>

            {/* Step 2: Insurance type */}
            <fieldset>
              <legend className="block text-sm font-semibold text-[#1a1a1a] font-body mb-2">
                <span className="bg-[#2d5016] text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs mr-2" aria-hidden="true">2</span>
                Your Insurance Type
              </legend>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="group" aria-label="Insurance type selection">
                {INSURANCE_TYPES.map(ins => (
                  <button
                    key={ins.id}
                    onClick={() => { setInsuranceType(ins.id); setShowResults(false); }}
                    aria-pressed={insuranceType === ins.id}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors font-body ${
                      insuranceType === ins.id
                        ? 'bg-[#2d5016] text-white'
                        : 'bg-[#f5f5f0] text-[#555555] border border-[#e0ddd5] hover:border-[#2d5016]'
                    }`}
                  >
                    {ins.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {/* Step 3: Deductible */}
            <fieldset>
              <legend className="block text-sm font-semibold text-[#1a1a1a] font-body mb-2">
                <span className="bg-[#2d5016] text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-xs mr-2" aria-hidden="true">3</span>
                Have you met your deductible?
              </legend>
              <div className="flex gap-3">
                <button
                  onClick={() => { setDeductibleMet(true); setShowResults(false); }}
                  aria-pressed={deductibleMet}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors font-body ${
                    deductibleMet
                      ? 'bg-[#2d5016] text-white'
                      : 'bg-[#f5f5f0] text-[#555555] border border-[#e0ddd5]'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => { setDeductibleMet(false); setShowResults(false); }}
                  aria-pressed={!deductibleMet}
                  className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors font-body ${
                    !deductibleMet
                      ? 'bg-[#c0392b] text-white'
                      : 'bg-[#f5f5f0] text-[#555555] border border-[#e0ddd5]'
                  }`}
                >
                  No
                </button>
              </div>
            </fieldset>

            {/* Calculate button */}
            <button
              onClick={calculate}
              disabled={!selectedDrug || !insuranceType}
              aria-label={!selectedDrug || !insuranceType ? 'Select a drug and insurance type first' : 'Calculate your estimated cost'}
              className="w-full py-3 bg-[#2d5016] text-white rounded-lg font-semibold text-sm hover:bg-[#3a6b1e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-body flex items-center justify-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Calculate My Cost
            </button>
          </div>
        </div>

        {/* ARIA live region for calculator result announcements */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {showResults && drug && insurance && (oneTime
            ? `Your estimated one-time out-of-pocket cost for ${drug.drug_name} with ${insurance.label} is ${formatCurrency(oopTotal)}.`
            : `Your estimated monthly cost for ${drug.drug_name} with ${insurance.label} is ${formatCurrency(oopMonthly)} per month, or ${formatCurrency(oopAnnual)} per year.`)
          }
        </div>

        {/* Results */}
        {showResults && drug && insurance && (
          <div className="space-y-6 animate-count-up">
            {/* Monthly cost */}
            <div className="bg-[#FEE2E2] rounded-xl p-8 text-center relative">
              <button
                onClick={shareUrl}
                className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/80 text-[#555555] hover:bg-white transition-colors font-body"
                aria-label="Copy shareable link to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#2d5016]" /> : <Share2 className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Share'}
              </button>
              <p className="text-sm text-[#555555] font-body mb-2">
                {oneTime ? 'Your estimated one-time out-of-pocket cost' : 'Your estimated monthly cost'}
              </p>
              <p className="text-5xl font-bold text-[#c0392b] font-mono">
                {formatCurrency(oopTotal)}
              </p>
              {!oneTime && (
                <p className="text-lg text-[#c0392b] font-mono mt-1">
                  {formatCurrency(oopAnnual)} / year
                </p>
              )}
              {oneTime && (
                <p className="text-xs text-[#b8860b] mt-3 font-body flex items-center gap-1 justify-center">
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  One-time gene/cell therapy. Total shown is the full treatment price — not a monthly or annualized figure.
                </p>
              )}
              <p className="text-xs text-[#555555] mt-3 font-body">
                Based on {insurance.label} · Deductible {deductibleMet ? 'met' : 'not met'}
              </p>
            </div>

            {/* Breakdown cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MetricCard
                label={oneTime ? 'Drug Treatment Price (WAC)' : 'Drug List Price (WAC)'}
                value={oneTime ? formatCurrency(drug.wac_annual) : formatCurrency(drug.wac_monthly)}
                subLabel={oneTime ? 'One-time treatment' : `Annual: ${formatCurrency(drug.wac_annual)}`}
                icon={<DollarSign className="w-5 h-5" />}
                variant="danger"
              />
              {cogs && (() => {
                const cogsBasis = oneTime
                  ? (cogs.estimated_cogs_annual || (cogs.estimate_preferred || 0) * 12)
                  : (cogs.estimate_preferred || 0);
                const wacBasis = oneTime ? drug.wac_annual : drug.wac_monthly;
                const markupPct = cogsBasis > 0 ? ((wacBasis - cogsBasis) / cogsBasis) * 100 : 0;
                return (
                  <MetricCard
                    label="Cost to Manufacture"
                    value={formatCurrency(cogsBasis)}
                    subLabel={`Markup: ${markupPct.toFixed(0)}%`}
                    isEstimate
                    confidence={cogs.confidence}
                    sourceLabel={cogs.citation || 'Peer-reviewed COGS literature'}
                    sourceUrl={cogs.source_url}
                    lastUpdated={cogs.publication_year ? String(cogs.publication_year) : '2024'}
                  />
                );
              })()}
              <MetricCard
                label="You Pay"
                value={formatCurrency(oopTotal)}
                subLabel={`${(oopTotal / (oneTime ? drug.wac_annual : drug.wac_monthly) * 100).toFixed(0)}% of list price`}
                variant="danger"
              />
            </div>

            {/* International comparison */}
            <div className="bg-white rounded-xl border border-[#e0ddd5] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#1a1a1a] font-display mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#2d5016]" />
                International Price Comparison
              </h3>
              <p className="text-xs text-[#555555] font-body mb-4">
                What this drug costs in other countries (approximate, based on published reference pricing studies)
              </p>
              <div className="space-y-3">
                {Object.entries(INTL_PRICES).map(([country, ratio]) => {
                  const usPrice = oneTime ? drug.wac_annual : drug.wac_monthly;
                  const intlPrice = Math.round(usPrice * ratio);
                  const savings = usPrice - intlPrice;
                  return (
                    <div key={country} className="flex items-center gap-3">
                      <span className="w-24 text-sm text-[#555555] font-body">{country}</span>
                      <div className="flex-1 h-6 bg-[#F1F5F9] rounded-full overflow-hidden relative">
                        <div
                          className="h-full bg-[#2d5016] rounded-full"
                          style={{ width: `${ratio * 100}%` }}
                        />
                        <div
                          className="absolute top-0 h-full bg-[#c0392b] rounded-r-full opacity-20"
                          style={{ left: `${ratio * 100}%`, width: `${(1 - ratio) * 100}%` }}
                        />
                      </div>
                      <span className="w-24 text-right text-sm font-mono text-[#2d5016] font-medium">
                        {formatCurrency(intlPrice)}
                      </span>
                      <span className="w-28 text-right text-xs text-[#c0392b] font-mono">
                        Save {formatCurrency(savings)}
                      </span>
                    </div>
                  );
                })}
                <div className="flex items-center gap-3 border-t border-[#e0ddd5] pt-3">
                  <span className="w-24 text-sm font-bold text-[#c0392b] font-body">US Price</span>
                  <div className="flex-1 h-6 bg-[#c0392b] rounded-full" />
                  <span className="w-24 text-right text-sm font-mono text-[#c0392b] font-bold">
                    {formatCurrency(oneTime ? drug.wac_annual : drug.wac_monthly)}
                  </span>
                  <span className="w-28 text-right text-xs text-[#555555] font-mono">—</span>
                </div>
              </div>
              <p className="text-[10px] text-[#555555] mt-3 italic font-body flex items-center gap-1">
                <EstBadge /> International prices are estimates based on published reference pricing studies and may vary by formulation and dosage.
                <SourceIcon
                  sourceLabel="Published reference pricing studies"
                  lastUpdated="Q4 2024"
                />
              </p>
            </div>

            {/* Copay cards & patient assistance */}
            <div className="bg-white rounded-xl border border-[#e0ddd5] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#1a1a1a] font-display mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-[#2d5016]" />
                Lowering Your Cost: Copay Cards, Assistance Programs &amp; Generics
              </h3>
              <div className="text-sm text-[#555555] font-body space-y-4 leading-relaxed">
                <p>
                  <strong className="text-[#1a1a1a]">If you have commercial or employer insurance,</strong> check whether
                  the manufacturer offers a <strong>copay card</strong> for your drug. These cards can significantly
                  reduce what you pay at the pharmacy — sometimes to $0 or a low flat copay per fill.
                </p>
                <p>
                  However, whether copay card payments count toward your deductible or out-of-pocket maximum
                  depends on your specific plan. Some plans apply those payments to your totals, while others
                  use <strong>copay accumulator</strong> or <strong>copay maximizer</strong> programs that
                  do not count manufacturer payments toward your deductible. This means a copay card can lower
                  your upfront costs but may not always reduce your total yearly spending. Check your plan
                  documents or call your insurer to find out how your plan handles copay card payments.
                </p>
                <p>
                  <strong className="text-[#1a1a1a]">If you have Medicare, Medicaid, or other government insurance,</strong> you
                  generally cannot use manufacturer copay cards. However, many manufacturers offer separate
                  <strong> patient assistance programs (PAPs)</strong> that provide medications at reduced or
                  no cost for patients who meet income and medical criteria. Visit the manufacturer&apos;s website
                  for the specific drug to see what programs are available.
                </p>
                <p>
                  <strong className="text-[#1a1a1a]">If a generic version exists,</strong> compare the cash price
                  of the generic through{' '}
                  <a href="https://www.costplusdrugs.com" target="_blank" rel="noopener noreferrer"
                    className="text-[#2d5016] font-medium hover:underline inline-flex items-center gap-0.5">
                    Cost Plus Drugs<ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  and other discount pharmacies. In some cases, paying cash for a generic can be less expensive
                  than using your insurance copay for the brand-name drug.
                </p>
              </div>

              {/* Where to look for help */}
              <div className="mt-5 pt-5 border-t border-[#e0ddd5]">
                <h4 className="text-sm font-semibold text-[#1a1a1a] font-body mb-3">Where to Look for Help</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { name: 'NeedyMeds', url: 'https://www.needymeds.org', desc: 'Drug assistance database' },
                    { name: 'Patient Advocate Foundation Co-Pay Relief', url: 'https://copays.org', desc: 'Copay assistance fund' },
                    { name: 'PAN Foundation', url: 'https://www.panfoundation.org', desc: 'Underinsured patient support' },
                    { name: 'Good Days', url: 'https://www.mygooddays.org', desc: 'Financial assistance for chronic illness' },
                    { name: 'HealthWell Foundation', url: 'https://www.healthwellfoundation.org', desc: 'Premium & copay assistance' },
                    { name: 'Cost Plus Drugs', url: 'https://www.costplusdrugs.com', desc: 'Low-cost generic prescriptions' },
                  ].map(resource => (
                    <a
                      key={resource.name}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#f5f5f0] hover:bg-[#E6F2EC] transition-colors group"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#555555] group-hover:text-[#3a6b1e] shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#2d5016] group-hover:underline truncate">{resource.name}</p>
                        <p className="text-[10px] text-[#555555]">{resource.desc}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Practical takeaway */}
              <div className="mt-5 bg-[#E6F2EC] rounded-lg p-4">
                <p className="text-sm text-[#2d5016] font-body font-medium leading-relaxed">
                  Before filling your prescription, compare all available options: your insurance copay,
                  a manufacturer copay card, a manufacturer patient assistance program, nonprofit assistance funds,
                  and — if a generic exists — cash pricing through discount pharmacies. The lowest-cost
                  option may not be the most obvious one.
                </p>
              </div>
            </div>

            {/* What-If scenarios */}
            <div className="bg-white rounded-xl border border-[#e0ddd5] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#1a1a1a] font-display mb-4">What If...</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#E6F2EC] rounded-lg p-4">
                  <p className="text-xs text-[#2d5016] font-semibold font-body mb-1">If a biosimilar existed</p>
                  <p className="text-xl font-bold text-[#2d5016] font-mono">
                    {formatCurrency(Math.round(oopMonthly * 0.55))}
                  </p>
                  <p className="text-xs text-[#555555] font-body mt-1 flex items-center gap-0.5">
                    ~45% lower (typical biosimilar discount)
                    <SourceIcon sourceLabel="Typical biosimilar discount range" lastUpdated="Q4 2024" />
                  </p>
                </div>
                <div className="bg-[#E6F2EC] rounded-lg p-4">
                  <p className="text-xs text-[#2d5016] font-semibold font-body mb-1">If Medicare negotiated</p>
                  <p className="text-xl font-bold text-[#2d5016] font-mono">
                    {formatCurrency(Math.round(oopMonthly * 0.40))}
                  </p>
                  <p className="text-xs text-[#555555] font-body mt-1 flex items-center gap-0.5">
                    ~60% lower (IRA negotiation target)
                    <SourceIcon sourceLabel="IRA negotiation projections" lastUpdated="Q4 2024" />
                  </p>
                </div>
                <div className="bg-[#E6F2EC] rounded-lg p-4">
                  <p className="text-xs text-[#2d5016] font-semibold font-body mb-1">With manufacturer copay card</p>
                  <p className="text-xl font-bold text-[#2d5016] font-mono">
                    {formatCurrency(Math.round(oopMonthly * 0.10))}
                  </p>
                  <p className="text-xs text-[#555555] font-body mt-1">
                    Check eligibility — may not reduce total yearly cost
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function WhatItCostsMeSkeleton() {
  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <TopNav />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="h-9 w-64 bg-[#e0ddd5] rounded-lg animate-pulse" />
          <div className="mt-3 h-5 w-96 bg-[#e0ddd5] rounded animate-pulse" />
        </div>
        <div className="bg-white rounded-xl border border-[#e0ddd5] p-6 shadow-sm">
          <div className="space-y-6">
            <div>
              <div className="h-5 w-36 bg-[#e0ddd5] rounded animate-pulse mb-2" />
              <div className="h-12 w-full bg-[#F1F5F9] rounded-lg animate-pulse" />
            </div>
            <div>
              <div className="h-5 w-40 bg-[#e0ddd5] rounded animate-pulse mb-2" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-10 bg-[#F1F5F9] rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
            <div>
              <div className="h-5 w-56 bg-[#e0ddd5] rounded animate-pulse mb-2" />
              <div className="flex gap-3">
                <div className="h-10 w-20 bg-[#F1F5F9] rounded-lg animate-pulse" />
                <div className="h-10 w-20 bg-[#F1F5F9] rounded-lg animate-pulse" />
              </div>
            </div>
            <div className="h-12 w-full bg-[#2d5016]/20 rounded-lg animate-pulse" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function WhatItCostsMePage() {
  return (
    <Suspense fallback={<WhatItCostsMeSkeleton />}>
      <WhatItCostsMe />
    </Suspense>
  );
}

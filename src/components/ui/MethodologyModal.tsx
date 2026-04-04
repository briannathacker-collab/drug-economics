'use client';

import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, ChevronDown, ChevronRight, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Tab definitions                                                    */
/* ------------------------------------------------------------------ */

const TABS = [
  { id: 'how', label: 'How We Calculated It' },
  { id: 'breakdown', label: 'Drug-by-Drug Breakdown' },
  { id: 'uncertainty', label: 'Uncertainty Range' },
  { id: 'limitations', label: "What This Doesn't Include" },
] as const;

type TabId = (typeof TABS)[number]['id'];

/**
 * Guard: the $2T patient cost figure may only display when all 4 methodology
 * tabs are implemented. Set to true once all tabs are built.
 */
export const METHODOLOGY_COMPLETE = TABS.length === 4;

/* ------------------------------------------------------------------ */
/*  Expandable source row (used in Tab 1)                              */
/* ------------------------------------------------------------------ */

function ExpandableStep({
  title,
  confidence,
  children,
}: {
  title: string;
  confidence: 'high' | 'medium' | 'low';
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const confidenceColors = {
    high: 'bg-emerald-100 text-emerald-800',
    medium: 'bg-amber-100 text-amber-800',
    low: 'bg-red-100 text-red-800',
  };

  return (
    <div className="border border-[#E5ECE8] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-[#F7F9F8] transition-colors"
      >
        {open ? (
          <ChevronDown className="w-4 h-4 text-[#6B7771] shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-[#6B7771] shrink-0" />
        )}
        <span className="text-sm font-semibold text-[#1F2A24] flex-1">{title}</span>
        <span
          className={cn(
            'text-[10px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wider',
            confidenceColors[confidence]
          )}
        >
          {confidence}
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 text-sm text-[#6B7771] leading-relaxed border-t border-[#E5ECE8] bg-[#F7F9F8]">
          {children}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 1: How We Calculated It                                        */
/* ------------------------------------------------------------------ */

function TabHowWeCalculated() {
  return (
    <div className="space-y-3">
      <p className="text-sm text-[#6B7771] font-body leading-relaxed mb-4">
        Each number in Drug Economics is derived from public data through a repeatable process.
        Expand any step below to see the source, assumptions, and confidence level.
      </p>

      <ExpandableStep title="WAC (Wholesale Acquisition Cost)" confidence="high">
        <p><strong>Source:</strong> CMS ASP quarterly data files, manufacturer SEC filings, and published pricing databases.</p>
        <p className="mt-2"><strong>Method:</strong> WAC is the list price set by the manufacturer before any discounts or rebates. We pull the most recent quarterly WAC from CMS ASP Drug Pricing Files and cross-reference with manufacturer price announcements.</p>
        <p className="mt-2"><strong>Assumptions:</strong> WAC does not include discounts, rebates, or negotiated rates. It represents the ceiling price in the supply chain.</p>
      </ExpandableStep>

      <ExpandableStep title="ASP (Average Sales Price)" confidence="high">
        <p><strong>Source:</strong> CMS quarterly ASP Drug Pricing Files.</p>
        <p className="mt-2"><strong>Method:</strong> ASP is the average price actually paid by purchasers after discounts and rebates, reported quarterly by manufacturers to CMS.</p>
        <p className="mt-2"><strong>Assumptions:</strong> ASP reflects a blended average and may not represent any single transaction price. There is a two-quarter reporting lag.</p>
      </ExpandableStep>

      <ExpandableStep title="Cost-to-Manufacture (COGS) Estimates" confidence="medium">
        <p><strong>Source:</strong> Peer-reviewed academic literature including Harvard PORTAL, ICER reports, MSF Access Campaign studies, and the Liverpool Drug Price Consortium.</p>
        <p className="mt-2"><strong>Method:</strong> We compile published manufacturing cost analyses and use the most recent, methodologically rigorous estimate available. Where multiple estimates exist, we use the median.</p>
        <p className="mt-2"><strong>Assumptions:</strong> Actual manufacturer production costs are proprietary and undisclosed. All COGS figures are estimates clearly labeled with an <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-[#FFFBEB] text-[#B45309] border border-[#B45309]/20 font-mono">est.</span> badge.</p>
        <p className="mt-2"><strong>Confidence levels:</strong></p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li><strong>High</strong> — Peer-reviewed paper with explicit manufacturing cost analysis</li>
          <li><strong>Medium</strong> — Industry analysis or trade publication with methodology</li>
          <li><strong>Low</strong> — Single-source estimate or derived from analogous compounds</li>
        </ul>
      </ExpandableStep>

      <ExpandableStep title="Markup & Profit Margin Calculations" confidence="high">
        <p><strong>Source:</strong> Derived from WAC and COGS data described above.</p>
        <p className="mt-2"><strong>Method:</strong> Markup = (WAC &minus; COGS) / COGS &times; 100. Gross margin = (WAC &minus; COGS) / WAC &times; 100.</p>
        <p className="mt-2"><strong>Assumptions:</strong> Markup calculation accuracy depends on the COGS estimate. The markup represents the manufacturer&apos;s gross margin before R&D, SG&A, and other operating costs.</p>
      </ExpandableStep>

      <ExpandableStep title="Patent & Exclusivity Timelines" confidence="high">
        <p><strong>Source:</strong> FDA Orange Book (small molecules), Purple Book (biologics), USPTO Patent Center.</p>
        <p className="mt-2"><strong>Method:</strong> We aggregate all listed patents and regulatory exclusivities for each drug and compute the latest expiration date across all protections.</p>
        <p className="mt-2"><strong>Assumptions:</strong> Patent challenges (IPR, ANDA litigation) may shorten effective protection. We display the current legal status without predicting litigation outcomes.</p>
      </ExpandableStep>

      <ExpandableStep title="Financial Data (Revenue, R&D, SG&A)" confidence="high">
        <p><strong>Source:</strong> SEC EDGAR 10-K filings, annual reports.</p>
        <p className="mt-2"><strong>Method:</strong> Revenue figures, R&D spending, SG&A costs, and executive compensation are extracted from the most recent fiscal year filing.</p>
        <p className="mt-2"><strong>Assumptions:</strong> Company-level financials may not break down to individual drug level. Drug-specific revenue is used when reported; otherwise segment-level data is used.</p>
      </ExpandableStep>

      <ExpandableStep title="Insurance & PBM Estimates" confidence="low">
        <p><strong>Source:</strong> Kaiser Family Foundation Employer Health Benefits Survey, CMS actuarial studies, FTC reports on PBM practices.</p>
        <p className="mt-2"><strong>Method:</strong> Premium and deductible data from KFF surveys. PBM rebate estimates combine CMS data with academic estimates of average rebate percentages by drug class.</p>
        <p className="mt-2"><strong>Assumptions:</strong> Much PBM data is proprietary. Rebate estimates are clearly flagged. Individual patient costs vary significantly by plan type and coverage tier.</p>
      </ExpandableStep>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 2: Drug-by-Drug Breakdown                                      */
/* ------------------------------------------------------------------ */

function TabDrugBreakdown() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[#6B7771] font-body leading-relaxed">
        Every drug in Drug Economics has individually sourced data. The table below summarizes the
        source for each input on a per-drug basis.
      </p>

      <div className="overflow-x-auto border border-[#E5ECE8] rounded-lg">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#F7F9F8] border-b border-[#E5ECE8]">
              <th className="text-left px-3 py-2 font-semibold text-[#1F2A24]">Input</th>
              <th className="text-left px-3 py-2 font-semibold text-[#1F2A24]">Primary Source</th>
              <th className="text-left px-3 py-2 font-semibold text-[#1F2A24]">Update Frequency</th>
              <th className="text-left px-3 py-2 font-semibold text-[#1F2A24]">Confidence</th>
            </tr>
          </thead>
          <tbody className="text-[#6B7771] divide-y divide-[#E5ECE8]">
            <tr>
              <td className="px-3 py-2 font-medium">WAC Price</td>
              <td className="px-3 py-2">CMS ASP Drug Pricing Files</td>
              <td className="px-3 py-2">Quarterly</td>
              <td className="px-3 py-2">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">high</span>
              </td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-medium">ASP Price</td>
              <td className="px-3 py-2">CMS ASP Quarterly Files</td>
              <td className="px-3 py-2">Quarterly</td>
              <td className="px-3 py-2">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">high</span>
              </td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-medium">COGS Estimate</td>
              <td className="px-3 py-2">Academic literature (per-drug)</td>
              <td className="px-3 py-2">As published</td>
              <td className="px-3 py-2">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase">varies</span>
              </td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-medium">Patent Expiry</td>
              <td className="px-3 py-2">FDA Orange/Purple Book, USPTO</td>
              <td className="px-3 py-2">Monthly</td>
              <td className="px-3 py-2">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">high</span>
              </td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-medium">Manufacturer Revenue</td>
              <td className="px-3 py-2">SEC 10-K Filings</td>
              <td className="px-3 py-2">Annually</td>
              <td className="px-3 py-2">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">high</span>
              </td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-medium">PBM Rebates</td>
              <td className="px-3 py-2">CMS, FTC, academic estimates</td>
              <td className="px-3 py-2">Annually</td>
              <td className="px-3 py-2">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-800 uppercase">low</span>
              </td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-medium">Delay Tactics</td>
              <td className="px-3 py-2">FTC Annual Reports, DOJ Filings</td>
              <td className="px-3 py-2">Annually</td>
              <td className="px-3 py-2">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">high</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={() => {
            const csvContent = [
              'Input,Primary Source,Update Frequency,Confidence',
              'WAC Price,CMS ASP Drug Pricing Files,Quarterly,High',
              'ASP Price,CMS ASP Quarterly Files,Quarterly,High',
              'COGS Estimate,Academic literature (per-drug),As published,Varies',
              'Patent Expiry,"FDA Orange/Purple Book, USPTO",Monthly,High',
              'Manufacturer Revenue,SEC 10-K Filings,Annually,High',
              'PBM Rebates,"CMS, FTC, academic estimates",Annually,Low',
              'Delay Tactics,"FTC Annual Reports, DOJ Filings",Annually,High',
            ].join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'drug-economics-sources.csv';
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#0B6B3A] bg-[#E6F2EC] hover:bg-[#D1FAE5] transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Download source table (CSV)
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 3: Uncertainty Range                                           */
/* ------------------------------------------------------------------ */

function ScenarioCard({
  label,
  value,
  description,
  highlight,
}: {
  label: string;
  value: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-lg border p-4',
        highlight
          ? 'border-[#0B6B3A] bg-[#E6F2EC]'
          : 'border-[#E5ECE8] bg-[#F7F9F8]'
      )}
    >
      <p className="text-xs font-medium text-[#6B7771] uppercase tracking-wider mb-1">{label}</p>
      <p
        className={cn(
          'text-2xl font-bold font-body tracking-tight mb-2',
          highlight ? 'text-[#0B6B3A]' : 'text-[#1F2A24]'
        )}
      >
        {value}
      </p>
      <p className="text-sm text-[#6B7771] leading-relaxed">{description}</p>
    </div>
  );
}

function TabUncertaintyRange() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[#6B7771] font-body leading-relaxed">
        Because manufacturing costs are estimates, the total markup across all tracked drugs
        falls within a range. We present three scenarios to convey the uncertainty honestly.
      </p>

      <div className="grid gap-3">
        <ScenarioCard
          label="Conservative"
          value="$890B"
          description="Uses the highest published COGS estimates for each drug. This assumes manufacturers spend more on production than most studies suggest, resulting in the smallest markup estimate."
        />
        <ScenarioCard
          label="Central (our default)"
          value="$2.09T"
          description="Uses the median published COGS estimate for each drug. This is the figure displayed throughout Drug Economics and represents our best single estimate of total markup."
          highlight
        />
        <ScenarioCard
          label="Upper"
          value="$4.2T"
          description="Uses the lowest published COGS estimates for each drug. This assumes manufacturing costs are at the low end of published ranges, resulting in the largest markup estimate."
        />
      </div>

      <div className="bg-[#F7F9F8] rounded-lg p-4 border border-[#E5ECE8]">
        <p className="text-sm text-[#6B7771] leading-relaxed">
          <strong className="text-[#1F2A24]">In plain language:</strong> We are confident the true total
          markup falls between $890 billion and $4.2 trillion. Our central estimate of $2.09 trillion
          uses the most methodologically rigorous published data for each drug. The range is wide because
          manufacturers do not disclose actual production costs.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab 4: What This Doesn't Include                                   */
/* ------------------------------------------------------------------ */

function TabLimitations() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-[#6B7771] font-body leading-relaxed">
        Drug Economics is designed to make pharmaceutical economics visible to the public.
        We display what is known and clearly label what is estimated. Here are the explicit
        limitations of our data and methodology.
      </p>

      <div className="space-y-3">
        <div className="bg-[#F7F9F8] rounded-lg p-4 border border-[#E5ECE8]">
          <h4 className="text-sm font-semibold text-[#1F2A24] mb-1">1. R&D Costs Are Not Deducted</h4>
          <p className="text-sm text-[#6B7771] leading-relaxed">
            Our markup figures compare sale price to manufacturing cost. They do not subtract
            the cost of research, clinical trials, or failed drug candidates. We report R&D
            spending separately on manufacturer pages so users can evaluate it themselves.
          </p>
        </div>

        <div className="bg-[#F7F9F8] rounded-lg p-4 border border-[#E5ECE8]">
          <h4 className="text-sm font-semibold text-[#1F2A24] mb-1">2. Distribution & Supply Chain Costs</h4>
          <p className="text-sm text-[#6B7771] leading-relaxed">
            Costs incurred by wholesalers, distributors, and pharmacies between the manufacturer
            and the patient are not included in COGS estimates. These add real costs but are
            separate from the manufacturer&apos;s markup.
          </p>
        </div>

        <div className="bg-[#F7F9F8] rounded-lg p-4 border border-[#E5ECE8]">
          <h4 className="text-sm font-semibold text-[#1F2A24] mb-1">3. Rebates & Discounts Are Opaque</h4>
          <p className="text-sm text-[#6B7771] leading-relaxed">
            PBM rebates and negotiated discounts reduce the effective price paid, but their
            exact amounts are proprietary. Our estimates of net-of-rebate prices rely on CMS
            and academic estimates, not actual contract terms.
          </p>
        </div>

        <div className="bg-[#F7F9F8] rounded-lg p-4 border border-[#E5ECE8]">
          <h4 className="text-sm font-semibold text-[#1F2A24] mb-1">4. International Price Comparisons Are Approximate</h4>
          <p className="text-sm text-[#6B7771] leading-relaxed">
            International drug prices vary by formulation, dosage, pack size, and reference
            pricing methodology. Our comparisons use published reference pricing studies
            and may not reflect the exact price paid in any specific country.
          </p>
        </div>

        <div className="bg-[#F7F9F8] rounded-lg p-4 border border-[#E5ECE8]">
          <h4 className="text-sm font-semibold text-[#1F2A24] mb-1">5. Coverage Is Not Exhaustive</h4>
          <p className="text-sm text-[#6B7771] leading-relaxed">
            Drug Economics tracks a curated set of high-cost, high-impact drugs. It does not
            cover every approved medication. If a drug is not in our database, it does not
            mean its pricing is unproblematic.
          </p>
        </div>
      </div>

      <div className="bg-[#E6F2EC] rounded-lg p-4 border border-[#0B6B3A]/20">
        <h4 className="text-sm font-semibold text-[#0B6B3A] mb-1">Corrections & Feedback</h4>
        <p className="text-sm text-[#6B7771] leading-relaxed">
          If a figure cannot be verified from at least two independent sources, it is flagged
          for review. If data is unavailable, we say so — we never fabricate numbers.
          Found an error or have better source data?{' '}
          <a
            href="/contact"
            className="text-[#0B6B3A] underline hover:text-[#1F2A24] transition-colors"
          >
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared modal content — used by both TopNav and EstBadge            */
/* ------------------------------------------------------------------ */

export function MethodologyModalContent() {
  const [activeTab, setActiveTab] = useState<TabId>('how');

  return (
    <>
      <div className="flex items-start justify-between mb-4">
        <div>
          <Dialog.Title className="text-xl font-bold text-[#1F2A24] font-display">
            Data Sources & Methodology
          </Dialog.Title>
          <Dialog.Description className="text-sm text-[#6B7771] mt-1 font-body">
            How we gather and validate every number in Drug Economics.
          </Dialog.Description>
        </div>
        <Dialog.Close className="p-1.5 rounded-lg hover:bg-[#F1F5F9] transition-colors">
          <X className="w-5 h-5 text-[#6B7771]" />
        </Dialog.Close>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-[#E5ECE8] mb-5 -mx-8 px-8 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-[#0B6B3A] text-[#0B6B3A]'
                : 'border-transparent text-[#6B7771] hover:text-[#6B7771] hover:border-[#CBD5E1]'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="text-sm font-body">
        {activeTab === 'how' && <TabHowWeCalculated />}
        {activeTab === 'breakdown' && <TabDrugBreakdown />}
        {activeTab === 'uncertainty' && <TabUncertaintyRange />}
        {activeTab === 'limitations' && <TabLimitations />}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Full modal with Dialog wrapper — used by TopNav                    */
/* ------------------------------------------------------------------ */

interface MethodologyModalProps {
  trigger?: React.ReactNode;
}

export function MethodologyModal({ trigger }: MethodologyModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        {trigger || (
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#FFFBEB] text-[#B45309] border border-[#B45309]/20 hover:bg-[#B45309]/10 transition-colors font-body">
            <span className="text-[10px]">⚠</span>
            Estimates / Proxies
          </button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl p-8 max-w-3xl w-[92vw] max-h-[85vh] overflow-y-auto shadow-xl z-50">
          <MethodologyModalContent />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

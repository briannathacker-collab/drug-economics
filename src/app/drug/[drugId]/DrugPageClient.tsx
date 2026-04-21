'use client';

import { ProfitBar } from '@/components/ui/ProfitBar';
import { PriceTimeline } from '@/components/ui/PriceTimeline';
import { EstBadge } from '@/components/ui/EstBadge';
import { ShareDrugCard } from '@/components/ui/ShareDrugCard';
import { DataQualityScore } from '@/components/ui/DataQualityScore';
import { JargonTooltip } from '@/components/ui/JargonTooltip';
import { formatCurrency, computeAnnualMarkup } from '@/lib/formatters';
import type {
  WacPrice,
  CogsEstimate,
  WacHistoryEntry,
  ManufacturerFinancials,
  PatentEntry,
  DelayTactic,
} from '@/lib/types';
import { Calendar, Building2, FlaskConical, ExternalLink } from 'lucide-react';

interface DrugPageClientProps {
  drug: WacPrice;
  cogs: CogsEstimate | null;
  history: WacHistoryEntry | null;
  manufacturer: ManufacturerFinancials | null;
  patent: PatentEntry | null;
  delayTactics: DelayTactic | null;
}

export function DrugPageClient({
  drug,
  cogs,
  history,
  manufacturer,
  patent,
  delayTactics,
}: DrugPageClientProps) {
  const annualCost = drug.wac_monthly * 12;
  const markup = computeAnnualMarkup(cogs ?? undefined, drug);
  const markupPct = markup.method === 'unavailable' ? null : markup.percent;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] font-display">
            {drug.drug_name}
          </h1>
          <p className="text-lg text-[#555555] font-body mt-1">
            {drug.generic_name} &middot; {manufacturer?.name || drug.manufacturer_id}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {drug.dosage_form && (
              <span className="text-xs bg-[#F1F5F9] text-[#555555] px-2.5 py-1 rounded-full font-body">
                {drug.dosage_form}
              </span>
            )}
            {drug.strength && (
              <span className="text-xs bg-[#F1F5F9] text-[#555555] px-2.5 py-1 rounded-full font-body">
                {drug.strength}
              </span>
            )}
            {drug.ndc && (
              <span className="text-xs bg-[#F1F5F9] text-[#555555] px-2.5 py-1 rounded-full font-mono">
                NDC: {drug.ndc}
              </span>
            )}
          </div>
        </div>

        {/* Data Quality Score */}
        <DataQualityScore
          drug={drug}
          cogs={cogs}
          history={history}
        />
      </div>

      {/* Key metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <div className="bg-white rounded-xl border border-[#e0ddd5] p-4">
          <p className="text-xs text-[#555555] font-body uppercase tracking-wider">
            Monthly <JargonTooltip term="WAC">WAC</JargonTooltip>
          </p>
          <p className="text-2xl font-bold text-[#c0392b] font-mono mt-1">
            {formatCurrency(drug.wac_monthly)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#e0ddd5] p-4">
          <p className="text-xs text-[#555555] font-body uppercase tracking-wider">Annual Cost</p>
          <p className="text-2xl font-bold text-[#c0392b] font-mono mt-1">
            {formatCurrency(annualCost)}
          </p>
        </div>
        {cogs?.estimate_preferred ? (
          <div className="bg-[#E6F2EC] rounded-xl border border-[#2d5016]/10 p-4">
            <p className="text-xs text-[#555555] font-body uppercase tracking-wider flex items-center gap-1">
              Cost to Make <EstBadge confidence={cogs.confidence} />
            </p>
            <p className="text-2xl font-bold text-[#2d5016] font-mono mt-1">
              {formatCurrency(cogs.estimate_preferred)}
            </p>
            <p className="text-[10px] text-[#555555] mt-0.5 italic">
              Estimated from published academic research.
              {cogs.citation && ` Source: ${cogs.citation}${cogs.publication_year ? `, ${cogs.publication_year}` : ''}.`}
            </p>
          </div>
        ) : (
          <div className="bg-[#F1F5F9] rounded-xl border border-[#e0ddd5] p-4">
            <p className="text-xs text-[#555555] font-body uppercase tracking-wider">Cost to Make</p>
            <p className="text-lg text-[#555555] font-mono mt-1">Not available</p>
          </div>
        )}
        <div className="bg-white rounded-xl border border-[#e0ddd5] p-4">
          <p className="text-xs text-[#555555] font-body uppercase tracking-wider">Markup</p>
          {markupPct != null ? (
            <>
              <p className="text-2xl font-bold text-[#c0392b] font-mono mt-1">
                {markupPct.toFixed(0)}%
              </p>
              <p className="text-xs text-[#555555] mt-1 font-body">
                For every <span className="font-mono font-bold text-[#1a1a1a]">$1</span> estimated to make, charges{' '}
                <span className="font-mono font-bold text-[#c0392b]">
                  ${(drug.wac_monthly / (cogs!.estimate_preferred || 1)).toFixed(0)}
                </span>
              </p>
            </>
          ) : (
            <p className="text-lg text-[#555555] font-mono mt-1">N/A</p>
          )}
        </div>
      </div>

      {/* Profit breakdown */}
      {cogs?.estimate_preferred && (
        <div className="bg-white rounded-xl border border-[#e0ddd5] p-6 mb-8">
          <h2 className="text-lg font-bold text-[#1a1a1a] font-display mb-4">Profit Breakdown</h2>
          <ProfitBar
            costToMake={cogs.estimate_preferred}
            wac={drug.wac_monthly}
            confidence={cogs.confidence}
            sourceLabel={cogs.citation || 'Peer-reviewed COGS literature'}
            sourceUrl={cogs.source_url}
            lastUpdated={cogs.publication_year ? String(cogs.publication_year) : '2024'}
          />
        </div>
      )}

      {/* Price history */}
      {history && (
        <div className="bg-white rounded-xl border border-[#e0ddd5] p-6 mb-8">
          <PriceTimeline data={history} />
        </div>
      )}

      {/* Patent + delay info */}
      {(patent || delayTactics) && (
        <div className="bg-white rounded-xl border border-[#e0ddd5] p-6 mb-8">
          <h2 className="text-lg font-bold text-[#1a1a1a] font-display mb-4">Patent & Competition</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {patent && (
              <>
                <div>
                  <p className="text-xs text-[#555555] font-body uppercase">Patent Cliff</p>
                  <p className="text-base font-bold text-[#1a1a1a] font-mono mt-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#555555]" />
                    {patent.patent_cliff_date ? new Date(patent.patent_cliff_date).getFullYear() : 'Unknown'}
                  </p>
                </div>
                {patent.delay_years > 0 && (
                  <div>
                    <p className="text-xs text-[#555555] font-body uppercase">Competition Delayed</p>
                    <p className="text-base font-bold text-[#c0392b] font-mono mt-1">
                      {patent.delay_years} years
                    </p>
                  </div>
                )}
              </>
            )}
            {delayTactics && delayTactics.tactics.length > 0 && (
              <div className="sm:col-span-2">
                <p className="text-xs text-[#555555] font-body uppercase mb-2">Delay Tactics Used</p>
                <div className="flex flex-wrap gap-1.5">
                  {delayTactics.tactics.map((t, i) => (
                    <span
                      key={i}
                      className="text-xs bg-[#FEE2E2] text-[#c0392b] px-2.5 py-1 rounded-full font-body"
                    >
                      {t.type}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* COGS source detail */}
      {cogs && (
        <div className="bg-[#f5f5f0] rounded-xl border border-[#e0ddd5] p-6 mb-8">
          <h2 className="text-lg font-bold text-[#1a1a1a] font-display mb-3">Manufacturing Cost Source</h2>
          <p className="text-sm text-[#555555] font-body">{cogs.citation}</p>
          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-[#555555]">
            {cogs.author && <span>Author: {cogs.author}</span>}
            {cogs.publication_year && <span>Year: {cogs.publication_year}</span>}
            <span className="flex items-center gap-1">
              Confidence: <EstBadge confidence={cogs.confidence} />
            </span>
          </div>
          {(cogs.estimate_low || cogs.estimate_high) && (
            <div className="mt-2 text-xs text-[#555555]">
              Range: {formatCurrency(cogs.estimate_low || 0)} — {formatCurrency(cogs.estimate_high || 0)} /mo
            </div>
          )}
          {cogs.source_url && (
            <a
              href={cogs.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#2d5016] font-medium mt-3 hover:underline font-body"
            >
              <ExternalLink className="w-3 h-3" />
              View source
            </a>
          )}
        </div>
      )}

      {/* Manufacturer info */}
      {manufacturer && (
        <div className="bg-white rounded-xl border border-[#e0ddd5] p-6 mb-8">
          <h2 className="text-lg font-bold text-[#1a1a1a] font-display mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#555555]" />
            {manufacturer.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-[#555555] font-body">Revenue</p>
              <p className="text-base font-bold text-[#1a1a1a] font-mono">
                {formatCurrency(manufacturer.annual_revenue[0]?.revenue || 0, true)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#555555] font-body">Net Income</p>
              <p className="text-base font-bold text-[#1a1a1a] font-mono">
                {formatCurrency(manufacturer.net_income[0]?.income || 0, true)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#555555] font-body">R&D Spend</p>
              <p className="text-base font-bold text-[#1a1a1a] font-mono flex items-center gap-1">
                <FlaskConical className="w-3.5 h-3.5 text-[#555555]" />
                {formatCurrency(manufacturer.rd_spend[0]?.spend || 0, true)}
              </p>
            </div>
            <div>
              <p className="text-xs text-[#555555] font-body">CEO Comp</p>
              <p className="text-base font-bold text-[#1a1a1a] font-mono">
                {formatCurrency(manufacturer.ceo_compensation, true)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Share */}
      <div className="bg-white rounded-xl border border-[#e0ddd5] p-6">
        <ShareDrugCard drugId={drug.drug_id} drugName={drug.drug_name} />
      </div>
    </div>
  );
}

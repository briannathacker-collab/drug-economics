'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import { X, ExternalLink as ExternalLinkIcon } from 'lucide-react';
import { ProfitBar } from '@/components/ui/ProfitBar';
import { PriceTimeline } from '@/components/ui/PriceTimeline';
import { EstBadge } from '@/components/ui/EstBadge';
import { SourceIcon } from '@/components/ui/SourceIcon';
import { ShareDrugCard } from '@/components/ui/ShareDrugCard';
import { JargonTooltip } from '@/components/ui/JargonTooltip';
import { FreshnessBadge } from '@/components/ui/FreshnessBadge';
import { getDrugById, getCogsForDrug, getHistoryForDrug, getManufacturerById } from '@/lib/data';
import { formatCurrency } from '@/lib/formatters';

interface DrugDetailDrawerProps {
  drugId: string;
  onClose: () => void;
}

export function DrugDetailDrawer({ drugId, onClose }: DrugDetailDrawerProps) {
  const drug = useMemo(() => getDrugById(drugId), [drugId]);
  const cogs = useMemo(() => getCogsForDrug(drugId), [drugId]);
  const history = useMemo(() => getHistoryForDrug(drugId), [drugId]);
  const manufacturer = useMemo(
    () => (drug ? getManufacturerById(drug.manufacturer_id) : undefined),
    [drug]
  );

  if (!drug) return null;

  const annualCost = drug.wac_monthly * 12;

  return (
    <Dialog.Root open onOpenChange={open => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed inset-0 sm:inset-auto sm:right-0 sm:top-0 sm:h-full sm:w-full sm:max-w-xl bg-white shadow-2xl z-50 overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <Dialog.Title className="text-2xl font-bold text-[#1a1a1a] font-display">
                  {drug.drug_name}
                </Dialog.Title>
                <p className="text-sm text-[#555555] font-body mt-1">
                  {drug.generic_name} · {manufacturer?.name || drug.manufacturer_id}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/drug/${drugId}`}
                  className="hidden sm:inline-flex items-center gap-1 text-xs text-[#2d5016] font-medium hover:underline font-body"
                >
                  <ExternalLinkIcon className="w-3 h-3" />
                  Full page
                </Link>
                <Dialog.Close className="p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors" aria-label="Close drug details">
                  <X className="w-5 h-5 text-[#555555]" />
                </Dialog.Close>
              </div>
            </div>

            {/* Key price metrics */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-[#f5f5f0] rounded-lg p-4">
                <p className="text-xs text-[#555555] font-body uppercase tracking-wider">
                  Monthly <JargonTooltip term="WAC">WAC</JargonTooltip>
                </p>
                <p className="text-xl font-bold text-[#c0392b] font-mono mt-1">
                  {formatCurrency(drug.wac_monthly)}
                </p>
              </div>
              <div className="bg-[#FEE2E2] rounded-lg p-4">
                <p className="text-xs text-[#555555] font-body uppercase tracking-wider">
                  Annual Cost
                </p>
                <p className="text-xl font-bold text-[#c0392b] font-mono mt-1">
                  {formatCurrency(annualCost)}
                </p>
                <p className="text-[10px] text-[#555555] mt-0.5">WAC x 12</p>
              </div>
              {cogs && (
                <>
                  <div className="bg-[#E6F2EC] rounded-lg p-4">
                    <p className="text-xs text-[#555555] font-body uppercase tracking-wider flex items-center gap-1">
                      Cost to Make <EstBadge confidence={cogs.confidence} />
                      <SourceIcon
                        sourceLabel={cogs.citation || 'Peer-reviewed COGS literature'}
                        sourceUrl={cogs.source_url}
                        lastUpdated={cogs.publication_year ? String(cogs.publication_year) : '2024'}
                      />
                    </p>
                    <p className="text-xl font-bold text-[#2d5016] font-mono mt-1">
                      {formatCurrency((cogs.estimate_preferred || 0))}
                    </p>
                    <p className="text-[10px] text-[#555555] mt-0.5 italic">
                      Estimated from published academic research. Actual manufacturer production costs are proprietary and not publicly disclosed.
                      {cogs.citation && ` Source: ${cogs.citation}${cogs.publication_year ? `, ${cogs.publication_year}` : ''}.`}
                    </p>
                  </div>
                  <div className="bg-[#FEE2E2] rounded-lg p-4">
                    <p className="text-xs text-[#555555] font-body uppercase tracking-wider">
                      Markup
                    </p>
                    <p className="text-xl font-bold text-[#c0392b] font-mono mt-1">
                      {((drug.wac_monthly - (cogs.estimate_preferred || 0)) / (cogs.estimate_preferred || 0) * 100).toFixed(0)}%
                    </p>
                    <p className="text-[10px] text-[#555555] mt-0.5">
                      WAC vs. est. cost to make
                    </p>
                    {(cogs.estimate_preferred || 0) > 0 && (
                      <p className="text-xs text-[#555555] mt-1.5 font-body">
                        For every <span className="font-mono font-bold text-[#1a1a1a]">$1</span> estimated to make, the manufacturer charges{' '}
                        <span className="font-mono font-bold text-[#c0392b]">
                          ${(drug.wac_monthly / (cogs.estimate_preferred || 1)).toFixed(0)}
                        </span>
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Profit breakdown bars */}
            {cogs && (
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-[#1a1a1a] font-body mb-3">
                  Profit Breakdown
                </h3>
                <ProfitBar
                  costToMake={(cogs.estimate_preferred || 0)}
                  wac={drug.wac_monthly}
                  confidence={cogs.confidence}
                  sourceLabel={cogs.citation || 'Peer-reviewed COGS literature'}
                  sourceUrl={cogs.source_url}
                  lastUpdated={cogs.publication_year ? String(cogs.publication_year) : '2024'}
                />
              </div>
            )}

            {/* Share drug card */}
            {cogs && (
              <div className="mb-6">
                <ShareDrugCard drugId={drugId} drugName={drug.drug_name} />
              </div>
            )}

            {/* COGS source */}
            {cogs && (
              <div className="bg-[#f5f5f0] rounded-lg p-4 mb-6 text-sm">
                <h4 className="font-semibold text-[#1a1a1a] font-body mb-2">Manufacturing Cost Source</h4>
                <p className="text-[#555555] font-body">{cogs.citation}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-[#555555]">
                  <span>Author: {cogs.author}</span>
                  <span>Year: {cogs.publication_year}</span>
                  <span className="flex items-center gap-1">
                    Confidence: <EstBadge confidence={cogs.confidence} />
                  </span>
                </div>
                <div className="mt-2 text-xs text-[#555555]">
                  Range: {formatCurrency(cogs.estimate_low || 0)} — {formatCurrency(cogs.estimate_high || 0)} /mo
                </div>
              </div>
            )}

            {/* Price history timeline */}
            {history && (
              <div className="mb-8">
                <PriceTimeline data={history} />
              </div>
            )}

            {/* Drug info */}
            <div className="border-t border-[#e0ddd5] pt-6">
              <h3 className="text-sm font-semibold text-[#1a1a1a] font-body mb-3">Drug Details</h3>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-[#555555] font-body">Dosage Form</dt>
                  <dd className="text-[#1a1a1a] font-body mt-0.5">{drug.dosage_form}</dd>
                </div>
                <div>
                  <dt className="text-[#555555] font-body">Strength</dt>
                  <dd className="text-[#1a1a1a] font-body mt-0.5">{drug.strength}</dd>
                </div>
                <div>
                  <dt className="text-[#555555] font-body">Manufacturer</dt>
                  <dd className="text-[#2d5016] font-body font-medium mt-0.5">{manufacturer?.name}</dd>
                </div>
                <div>
                  <dt className="text-[#555555] font-body">
                    <JargonTooltip term="NDC">NDC</JargonTooltip>
                  </dt>
                  <dd className="text-[#1a1a1a] font-mono mt-0.5">{drug.ndc}</dd>
                </div>
              </dl>
              <div className="mt-4 pt-3 border-t border-[#e0ddd5]">
                <p className="text-[10px] text-[#555555] font-body mb-1">Pricing Data</p>
                <FreshnessBadge
                  dataYear={(drug as Record<string, unknown>).data_year as number | undefined}
                  dataQuarter={(drug as Record<string, unknown>).data_quarter as string | undefined}
                  source={((drug as Record<string, unknown>).source as string) || 'WAC_MONITOR'}
                />
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

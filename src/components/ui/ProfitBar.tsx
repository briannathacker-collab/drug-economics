'use client';

import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatters';
import { EstBadge } from './EstBadge';
import { SourceIcon } from './SourceIcon';

interface ProfitBarProps {
  costToMake: number; // cents
  wac: number; // cents
  insuranceReimb?: number; // cents
  patientPays?: number; // cents
  isEstimate?: boolean;
  confidence?: 'high' | 'medium' | 'low';
  className?: string;
  sourceLabel?: string;
  sourceUrl?: string;
  lastUpdated?: string;
}

export function ProfitBar({
  costToMake,
  wac,
  insuranceReimb,
  isEstimate = true,
  confidence,
  className,
  sourceLabel,
  sourceUrl,
  lastUpdated,
}: ProfitBarProps) {
  const maxVal = Math.max(wac, insuranceReimb || 0);
  const costPercent = maxVal > 0 ? (costToMake / maxVal) * 100 : 0;
  const wacPercent = maxVal > 0 ? (wac / maxVal) * 100 : 0;
  const profit = wac - costToMake;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Cost to make */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-[#555555] font-body flex items-center gap-1">
            Cost to manufacture
            {isEstimate && <EstBadge confidence={confidence} />}
            {isEstimate && sourceLabel && (
              <SourceIcon sourceLabel={sourceLabel} sourceUrl={sourceUrl} lastUpdated={lastUpdated ?? ''} />
            )}
          </span>
          <span className="font-mono text-[#1a1a1a] font-medium">{formatCurrency(costToMake)}</span>
        </div>
        <div className="h-4 bg-[#F1F5F9] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2d5016] rounded-full transition-all duration-500"
            style={{ width: `${costPercent}%` }}
          />
        </div>
        <p className="text-[10px] text-[#555555] mt-0.5 italic font-body">
          Estimated — actual manufacturer costs are proprietary and undisclosed.
        </p>
      </div>

      {/* WAC / List price */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-[#555555] font-body">
            List price (<span className="border-b border-dotted border-[#555555] cursor-help" title="Wholesale Acquisition Cost — the list price a manufacturer charges wholesalers before any discounts or rebates.">WAC</span>)
          </span>
          <span className="font-mono text-[#c0392b] font-bold">{formatCurrency(wac)}</span>
        </div>
        <div className="h-4 bg-[#F1F5F9] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#c0392b] rounded-full transition-all duration-500"
            style={{ width: `${wacPercent}%` }}
          />
        </div>
      </div>

      {/* Profit gap visualization */}
      <div className="bg-[#FEE2E2] rounded-lg p-3 text-center">
        <p className="text-xs text-[#555555] font-body">Manufacturer profit per month</p>
        <p className="text-lg font-bold text-[#c0392b] font-body">
          {formatCurrency(profit)}
        </p>
        <p className="text-xs text-[#555555] font-body">
          Annual: {formatCurrency(profit * 12)}
        </p>
        {costToMake > 0 && (
          <p className="text-sm text-[#555555] mt-2 font-body">
            For every{' '}
            <span className="font-mono font-bold text-[#1a1a1a]">$1</span> estimated to make, the manufacturer charges{' '}
            <span className="font-mono font-bold text-[#c0392b]">
              ${(wac / costToMake).toFixed(0)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

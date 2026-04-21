'use client';

import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatters';
import { ArrowRight } from 'lucide-react';
import type { ManufacturerCardData } from '@/lib/types';

interface ManufacturerCardProps {
  data: ManufacturerCardData;
  onOpenDrug?: (drugId: string) => void;
  className?: string;
}

export function ManufacturerCard({ data, onOpenDrug, className }: ManufacturerCardProps) {
  const router = useRouter();

  const initials = data.name
    .split(/[\s&]+/)
    .filter(w => w.length > 1)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  function handleNavigate() {
    router.push(`/priced-out/manufacturers/${data.manufacturer_id}`);
  }

  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-[#e0ddd5] shadow-sm overflow-hidden cursor-pointer hover:shadow-md hover:border-[#2d5016]/30 transition-all',
        className
      )}
      onClick={handleNavigate}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleNavigate()}
      aria-label={`View ${data.name} drug portfolio`}
    >
      {/* Card header */}
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#2d5016] font-display">{data.name}</h3>
            <p className="text-xs text-[#555555] font-mono mt-0.5">{data.ticker}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#E6F2EC] flex items-center justify-center text-sm font-bold text-[#2d5016] font-display">
            {initials}
          </div>
        </div>

        {/* 2x2 metric grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-[#f5f5f0] rounded-lg p-3">
            <p className="text-[10px] uppercase text-[#555555] font-body tracking-wider">Revenue</p>
            <p className="text-sm font-bold text-[#1a1a1a] font-mono mt-0.5">
              {formatCurrency(data.revenue, true)}
            </p>
          </div>
          <div className="bg-[#f5f5f0] rounded-lg p-3">
            <p className="text-[10px] uppercase text-[#555555] font-body tracking-wider">Net Income</p>
            <p className="text-sm font-bold text-[#1a1a1a] font-mono mt-0.5">
              {formatCurrency(data.net_income, true)}
            </p>
          </div>
          <div className="bg-[#f5f5f0] rounded-lg p-3">
            <p className="text-[10px] uppercase text-[#555555] font-body tracking-wider">R&D Spend</p>
            <p className="text-sm font-bold text-[#1a1a1a] font-mono mt-0.5">
              {formatCurrency(data.rd_spend, true)}
            </p>
          </div>
          <div className="bg-[#f5f5f0] rounded-lg p-3">
            <p className="text-[10px] uppercase text-[#555555] font-body tracking-wider">Gross Margin</p>
            <p className="text-sm font-bold text-[#1a1a1a] font-mono mt-0.5">
              {data.gross_margin.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Drug list */}
        <div className="mt-4">
          <p className="text-xs text-[#555555] font-body mb-2">
            {data.drugs.length} drug{data.drugs.length !== 1 ? 's' : ''} tracked
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.drugs.slice(0, 5).map(drug => (
              <span
                key={drug.drug_id}
                className="text-xs bg-[#E6F2EC] text-[#2d5016] px-2 py-0.5 rounded-full font-body cursor-pointer hover:bg-[#3a6b1e] hover:text-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDrug?.(drug.drug_id);
                }}
              >
                {drug.name}
              </span>
            ))}
            {data.drugs.length > 5 && (
              <span className="text-xs text-[#555555] px-2 py-0.5 font-body">
                +{data.drugs.length - 5} more
              </span>
            )}
          </div>
        </div>

        {/* Navigate indicator */}
        <div className="mt-4 flex items-center justify-end">
          <span className="text-xs text-[#555555] flex items-center gap-1 font-body group-hover:text-[#3a6b1e]">
            View portfolio <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}

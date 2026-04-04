'use client';

import { cn } from '@/lib/utils';
import type { FreshnessColor } from '@/lib/types';
import { computeFreshness, formatFreshnessAge } from '@/lib/freshness';

interface FreshnessBadgeProps {
  dataYear?: number | null;
  dataQuarter?: string | null;
  source?: string;
  className?: string;
  /** Compact mode shows just the dot + label, no age text */
  compact?: boolean;
}

export function FreshnessBadge({
  dataYear,
  dataQuarter,
  source,
  className,
  compact = false,
}: FreshnessBadgeProps) {
  const freshness = computeFreshness(dataYear ?? null, dataQuarter ?? null);

  const dotColors: Record<FreshnessColor, string> = {
    green: 'bg-[#0B6B3A]',
    yellow: 'bg-[#B45309]',
    orange: 'bg-orange-500',
    red: 'bg-[#C41E3A]',
    gray: 'bg-[#6B7771]',
  };

  const textColors: Record<FreshnessColor, string> = {
    green: 'text-[#0B6B3A]',
    yellow: 'text-[#B45309]',
    orange: 'text-orange-600',
    red: 'text-[#C41E3A]',
    gray: 'text-[#6B7771]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[10px] font-mono',
        textColors[freshness.color],
        className
      )}
      title={`Data from ${dataYear || '?'} ${dataQuarter || '?'} · ${source || 'Unknown source'} · ${formatFreshnessAge(freshness.quarters_old)}`}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[freshness.color])} />
      {freshness.label}
      {!compact && freshness.quarters_old !== null && (
        <span className="text-[#6B7771]">
          · {source || ''} {dataYear} {dataQuarter} ({formatFreshnessAge(freshness.quarters_old)})
        </span>
      )}
    </span>
  );
}

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
    green: 'bg-[#2d5016]',
    yellow: 'bg-[#b8860b]',
    orange: 'bg-orange-500',
    red: 'bg-[#c0392b]',
    gray: 'bg-[#555555]',
  };

  const textColors: Record<FreshnessColor, string> = {
    green: 'text-[#2d5016]',
    yellow: 'text-[#b8860b]',
    orange: 'text-orange-600',
    red: 'text-[#c0392b]',
    gray: 'text-[#555555]',
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
        <span className="text-[#555555]">
          · {source || ''} {dataYear} {dataQuarter} ({formatFreshnessAge(freshness.quarters_old)})
        </span>
      )}
    </span>
  );
}

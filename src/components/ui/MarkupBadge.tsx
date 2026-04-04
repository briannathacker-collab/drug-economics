'use client';

import { cn } from '@/lib/utils';
import { SourceIcon } from './SourceIcon';

interface MarkupBadgeProps {
  percent: number;
  className?: string;
  sourceLabel?: string;
  sourceUrl?: string;
  lastUpdated?: string;
}

export function MarkupBadge({ percent, className, sourceLabel, sourceUrl, lastUpdated }: MarkupBadgeProps) {
  const isExtreme = percent > 1000;
  const isHigh = percent > 500;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold font-mono',
        isExtreme
          ? 'bg-[#FEE2E2] text-[#C41E3A]'
          : isHigh
          ? 'bg-[#FEE2E2] text-[#C41E3A]'
          : 'bg-[#FFFBEB] text-[#B45309]',
        className
      )}
    >
      {percent.toFixed(0)}% markup
      {sourceLabel && (
        <SourceIcon
          sourceLabel={sourceLabel}
          sourceUrl={sourceUrl}
          lastUpdated={lastUpdated ?? ''}
        />
      )}
    </span>
  );
}

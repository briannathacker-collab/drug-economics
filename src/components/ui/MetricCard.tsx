'use client';

import { cn } from '@/lib/utils';
import { EstBadge } from './EstBadge';
import { SourceIcon } from './SourceIcon';
import type { ReactNode } from 'react';

interface MetricCardProps {
  label: ReactNode;
  value: string | number;
  subLabel?: ReactNode;
  icon?: ReactNode;
  isEstimate?: boolean;
  confidence?: 'high' | 'medium' | 'low';
  variant?: 'default' | 'danger' | 'warning';
  className?: string;
  sourceLabel?: string;
  sourceUrl?: string;
  lastUpdated?: string;
}

export function MetricCard({
  label,
  value,
  subLabel,
  icon,
  isEstimate = false,
  confidence,
  variant = 'default',
  className,
  sourceLabel,
  sourceUrl,
  lastUpdated,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-[#e0ddd5] p-5 shadow-sm',
        variant === 'danger' && 'border-l-4 border-l-[#c0392b]',
        variant === 'warning' && 'border-l-4 border-l-[#b8860b]',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-[#555555] font-body">{label}</span>
        {icon && <span className="text-[#555555]">{icon}</span>}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-[#1a1a1a] font-body tracking-tight">{value}</span>
        {isEstimate && <EstBadge confidence={confidence} />}
        {isEstimate && sourceLabel && (
          <SourceIcon
            sourceLabel={sourceLabel}
            sourceUrl={sourceUrl}
            lastUpdated={lastUpdated ?? ''}
          />
        )}
      </div>
      {subLabel && (
        <p className="mt-1 text-sm text-[#555555] font-body">{subLabel}</p>
      )}
    </div>
  );
}

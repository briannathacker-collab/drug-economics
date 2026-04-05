'use client';

import { cn } from '@/lib/utils';
import { EstBadge } from './EstBadge';
import { SourceIcon } from './SourceIcon';
import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
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
        'bg-white rounded-xl border border-[#E5ECE8] p-5 shadow-sm',
        variant === 'danger' && 'border-l-4 border-l-[#C41E3A]',
        variant === 'warning' && 'border-l-4 border-l-[#B45309]',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-sm font-medium text-[#6B7771] font-body">{label}</span>
        {icon && <span className="text-[#6B7771]">{icon}</span>}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-[#1F2A24] font-body tracking-tight">{value}</span>
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
        <p className="mt-1 text-sm text-[#6B7771] font-body">{subLabel}</p>
      )}
    </div>
  );
}

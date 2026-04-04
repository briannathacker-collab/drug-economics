'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { WacPrice, CogsEstimate, WacHistoryEntry } from '@/lib/types';

interface DataQualityScoreProps {
  drug: WacPrice;
  cogs: CogsEstimate | null;
  history: WacHistoryEntry | null;
  className?: string;
}

type Grade = 'A' | 'B' | 'C';

function computeGrade(drug: WacPrice, cogs: CogsEstimate | null, history: WacHistoryEntry | null): {
  grade: Grade;
  score: number;
  factors: string[];
} {
  let score = 0;
  const factors: string[] = [];

  // COGS data exists (0-30 points)
  if (cogs?.estimate_preferred && cogs.estimate_preferred > 0) {
    score += 15;
    factors.push('COGS estimate available');

    // COGS confidence
    if (cogs.confidence === 'high') {
      score += 15;
      factors.push('High-confidence COGS');
    } else if (cogs.confidence === 'medium') {
      score += 10;
      factors.push('Medium-confidence COGS');
    } else {
      score += 5;
      factors.push('Low-confidence COGS');
    }

    // COGS has source URL
    if (cogs.source_url) {
      score += 5;
      factors.push('COGS source linked');
    }
  }

  // WAC data quality (0-25 points)
  if (drug.wac_monthly > 0) {
    score += 10;
    factors.push('WAC price verified');
  }
  if (drug.ndc) {
    score += 5;
    factors.push('NDC code present');
  }
  const wacConfirmedBy = (drug as Record<string, unknown>).wac_confirmed_by;
  if (Array.isArray(wacConfirmedBy)) {
    if (wacConfirmedBy.length >= 3) {
      score += 10;
      factors.push('WAC confirmed by 3 sources');
    } else if (wacConfirmedBy.length >= 2) {
      score += 7;
      factors.push('WAC confirmed by 2 sources');
    }
  }

  // Price history (0-20 points)
  if (history) {
    score += 10;
    factors.push('Price history available');
    if (history.price_history.length >= 5) {
      score += 10;
      factors.push('5+ years of history');
    } else if (history.price_history.length >= 3) {
      score += 5;
      factors.push('3+ years of history');
    }
  }

  // Freshness (0-15 points)
  const effectiveDate = (drug as Record<string, unknown>).effective_date as string | undefined;
  if (effectiveDate) {
    const daysSinceUpdate = Math.floor(
      (Date.now() - new Date(effectiveDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceUpdate < 30) {
      score += 15;
      factors.push('Updated within 30 days');
    } else if (daysSinceUpdate < 90) {
      score += 10;
      factors.push('Updated within 90 days');
    } else if (daysSinceUpdate < 180) {
      score += 5;
      factors.push('Updated within 180 days');
    }
  }

  let grade: Grade;
  if (score >= 70) grade = 'A';
  else if (score >= 40) grade = 'B';
  else grade = 'C';

  return { grade, score, factors };
}

const GRADE_STYLES: Record<Grade, { bg: string; text: string; border: string; label: string }> = {
  A: {
    bg: 'bg-[#E6F2EC]',
    text: 'text-[#0B6B3A]',
    border: 'border-[#0B6B3A]/20',
    label: 'Comprehensive data',
  },
  B: {
    bg: 'bg-[#FFFBEB]',
    text: 'text-[#B45309]',
    border: 'border-[#B45309]/20',
    label: 'Partial data',
  },
  C: {
    bg: 'bg-[#FEE2E2]',
    text: 'text-[#C41E3A]',
    border: 'border-[#C41E3A]/20',
    label: 'Limited data',
  },
};

export function DataQualityScore({ drug, cogs, history, className }: DataQualityScoreProps) {
  const { grade, score, factors } = useMemo(
    () => computeGrade(drug, cogs, history),
    [drug, cogs, history]
  );

  const style = GRADE_STYLES[grade];

  return (
    <div
      className={cn(
        'rounded-xl border p-4 text-center min-w-[120px]',
        style.bg,
        style.border,
        className
      )}
      title={`Data Quality Score: ${grade} (${score}/100)\n${factors.join('\n')}`}
    >
      <p className="text-xs text-[#6B7771] font-body uppercase tracking-wider mb-1">
        Data Quality
      </p>
      <p className={cn('text-3xl font-bold font-mono', style.text)}>{grade}</p>
      <p className={cn('text-xs font-body mt-1', style.text)}>{style.label}</p>
      <p className="text-[10px] text-[#6B7771] font-mono mt-1">{score}/100</p>
    </div>
  );
}

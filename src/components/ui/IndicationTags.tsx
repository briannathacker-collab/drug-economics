'use client';

import { cn } from '@/lib/utils';
import type { Indication } from '@/lib/types';

interface IndicationTagsProps {
  indications: Indication[];
  className?: string;
}

export function IndicationTags({ indications, className }: IndicationTagsProps) {
  if (!indications.length) return null;

  return (
    <div className={cn('flex flex-wrap gap-1.5', className)}>
      {indications.map((ind, i) => (
        <span
          key={i}
          className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium font-body',
            ind.type === 'on-label'
              ? 'bg-[#E6F2EC] text-[#2d5016]'
              : 'bg-[#FFFBEB] text-[#b8860b]'
          )}
          title={
            ind.type === 'off-label'
              ? 'Off-label: prescribed for this condition without specific FDA approval'
              : 'FDA-approved indication'
          }
        >
          {ind.type === 'off-label' && (
            <span className="mr-1 text-[10px]">⚠</span>
          )}
          {ind.name}
        </span>
      ))}
    </div>
  );
}

'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SourceIconProps {
  sourceLabel: string;
  sourceUrl?: string;
  lastUpdated: string;
  className?: string;
}

export function SourceIcon({ sourceLabel, sourceUrl, lastUpdated, className }: SourceIconProps) {
  return (
    <Tooltip.Provider delayDuration={300}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span
            className={cn('inline-flex items-center ml-1 cursor-pointer', className)}
            aria-label={`Source: ${sourceLabel}`}
          >
            <Info
              size={13}
              className="text-[#6B7771] hover:text-[#6B7771] transition-colors"
            />
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={6}
            className="z-50 bg-[#1F2A24] text-white text-xs rounded-lg px-3 py-2 max-w-xs shadow-lg font-body"
          >
            <p>
              <span className="font-semibold">Source:</span> {sourceLabel}
            </p>
            <p className="text-[#6B7771] mt-0.5">Updated {lastUpdated}</p>
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#60A5FA] hover:underline mt-1 inline-block"
                onClick={(e) => e.stopPropagation()}
              >
                View source →
              </a>
            )}
            <Tooltip.Arrow className="fill-[#1F2A24]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

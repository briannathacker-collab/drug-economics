'use client';

import * as Tooltip from '@radix-ui/react-tooltip';
import { Info } from 'lucide-react';

interface MethodologyInput {
  label: string;
  value: string;
  source?: string;
}

interface MethodologyTooltipProps {
  label: string;
  formula: string;
  inputs?: MethodologyInput[];
  note?: string;
  sourceLabel?: string;
  sourceUrl?: string;
  children?: React.ReactNode;
}

export function MethodologyTooltip({
  label,
  formula,
  inputs,
  note,
  sourceLabel,
  sourceUrl,
  children,
}: MethodologyTooltipProps) {
  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span className="inline-flex items-center gap-1 cursor-help text-inherit">
            {children}
            <Info className="w-3 h-3 text-[#6B7771] shrink-0" aria-label={`How ${label} is calculated`} />
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-[#1F2A24] text-white text-xs px-4 py-3 rounded-lg max-w-sm shadow-lg z-50 font-body"
            sideOffset={5}
          >
            <p className="font-semibold text-[#E6F2EC] mb-1">How we compute {label}</p>
            <p className="font-mono text-[11px] text-gray-200 mb-2">{formula}</p>
            {inputs && inputs.length > 0 && (
              <div className="mb-2 space-y-0.5">
                {inputs.map((i) => (
                  <div key={i.label} className="flex justify-between gap-2 text-[11px]">
                    <span className="text-gray-400">{i.label}</span>
                    <span className="font-mono text-gray-200">{i.value}</span>
                  </div>
                ))}
              </div>
            )}
            {note && <p className="text-gray-300 text-[11px] leading-relaxed">{note}</p>}
            {sourceLabel && (
              <p className="text-[10px] text-gray-400 mt-2 border-t border-gray-700 pt-2">
                Source:{' '}
                {sourceUrl ? (
                  <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[#7FB8A0] underline">
                    {sourceLabel}
                  </a>
                ) : (
                  sourceLabel
                )}
              </p>
            )}
            <Tooltip.Arrow className="fill-[#1F2A24]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

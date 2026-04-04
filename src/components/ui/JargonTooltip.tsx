'use client';

import * as Tooltip from '@radix-ui/react-tooltip';

const JARGON: Record<string, string> = {
  WAC: 'Wholesale Acquisition Cost — the manufacturer\'s list price before rebates, insurer negotiations, or PBM discounts. WAC is the starting point from which all markups, spreads, and patient costs flow — but almost nobody actually pays it.',
  ASP: 'Average Sales Price — the average price actually paid for a drug, after discounts. Used by Medicare Part B.',
  PBM: 'Pharmacy Benefit Manager — a middleman that negotiates drug prices between manufacturers, insurers, and pharmacies.',
  DIR: 'Direct and Indirect Remuneration — fees that PBMs charge pharmacies after a sale, often clawing back profits.',
  COGS: 'Cost of Goods Sold — the estimated cost to manufacture the drug.',
  NDC: 'National Drug Code — a unique identifier for every drug product in the US.',
  ANDA: 'Abbreviated New Drug Application — the FDA pathway for generic drug approval.',
  BLA: 'Biologics License Application — the FDA approval pathway for biologic drugs.',
  NCE: 'New Chemical Entity — a drug containing an active ingredient never previously approved by the FDA.',
  MLR: 'Medical Loss Ratio — the percentage of premiums an insurer must spend on medical care (minimum 80-85%).',
  IRA: 'Inflation Reduction Act — 2022 law allowing Medicare to negotiate prices on some drugs.',
  REMS: 'Risk Evaluation and Mitigation Strategies — FDA safety requirements sometimes used to block generic competition.',
  '340B': 'A federal program requiring drug makers to sell at a discount to safety-net providers.',
  ICER: 'Institute for Clinical and Economic Review — independent body that evaluates drug cost-effectiveness.',
};

interface JargonTooltipProps {
  term: string;
  children?: React.ReactNode;
}

export function JargonTooltip({ term, children }: JargonTooltipProps) {
  const definition = JARGON[term.toUpperCase()] || JARGON[term] || `${term}: definition pending.`;

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span className="border-b border-dotted border-[#6B7771] cursor-help text-inherit">
            {children || term}
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-[#1F2A24] text-white text-sm px-3 py-2 rounded-lg max-w-xs shadow-lg z-50 font-body"
            sideOffset={5}
          >
            <p className="font-semibold text-[#E6F2EC] mb-1">{term.toUpperCase()}</p>
            <p className="text-gray-300 text-xs leading-relaxed">{definition}</p>
            <Tooltip.Arrow className="fill-[#1F2A24]" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

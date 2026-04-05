'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatters';
import { EstBadge } from '@/components/ui/EstBadge';
import { SourceIcon } from '@/components/ui/SourceIcon';
import type { DrugCardData } from '@/lib/types';

const COLUMNS = [
  { key: 'name',            label: 'Drug',           sortable: true  },
  { key: 'specialty',       label: 'Specialty',      sortable: true  },
  { key: 'cogs_estimate',   label: 'Cost to Make',   sortable: true  },
  { key: 'wac_monthly',     label: 'WAC (Wholesale Acquisition Cost) /mo', sortable: true  },
  { key: 'wac_annual',      label: 'WAC Annual',     sortable: true  },
  { key: 'markup_percent',  label: 'Markup',         sortable: true  },
] as const;

type SortKey = typeof COLUMNS[number]['key'];

export function ManufacturerDrugTable({ drugs }: { drugs: DrugCardData[] }) {
  const router = useRouter();
  const [sortKey, setSortKey] = useState<SortKey>('wac_annual');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const sorted = [...drugs].sort((a, b) => {
    const av = a[sortKey] ?? 0;
    const bv = b[sortKey] ?? 0;
    if (typeof av === 'string' && typeof bv === 'string') {
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    return sortDir === 'asc' ? Number(av) - Number(bv) : Number(bv) - Number(av);
  });

  return (
    <div className="overflow-x-auto rounded-lg border border-[#E5ECE8]">
      <table className="min-w-full divide-y divide-[#E5ECE8] text-sm">
        <thead className="bg-[#F7F9F8]">
          <tr>
            {COLUMNS.map(col => (
              <th
                key={col.key}
                onClick={() => col.sortable && toggleSort(col.key)}
                className={cn(
                  'whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#6B7771] font-body',
                  col.sortable && 'cursor-pointer select-none hover:text-[#1F2A24]',
                  col.key !== 'name' && col.key !== 'specialty' && 'text-right'
                )}
              >
                {col.label}
                {col.sortable && sortKey === col.key && (
                  <span className="ml-1">{sortDir === 'asc' ? '\u2191' : '\u2193'}</span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5ECE8] bg-white">
          {sorted.map(drug => (
            <tr
              key={drug.drug_id}
              onClick={() => router.push(`/drug/${drug.drug_id}`)}
              className="cursor-pointer hover:bg-[#F7F9F8] transition-colors"
            >
              <td className="px-4 py-3">
                <p className="font-medium text-[#1F2A24] font-body">{drug.name}</p>
                <p className="text-xs text-[#6B7771] font-body">{drug.generic_name}</p>
              </td>
              <td className="px-4 py-3 text-[#6B7771] font-body">{drug.specialty}</td>
              <td className="px-4 py-3 text-right font-mono">
                {drug.cogs_estimate ? (
                  <span className="flex items-center justify-end gap-1">
                    {formatCurrency(drug.cogs_estimate)}
                    <EstBadge confidence={drug.cogs_confidence} />
                    {drug.cogs_source_label && (
                      <SourceIcon
                        sourceLabel={drug.cogs_source_label}
                        sourceUrl={drug.cogs_source_url}
                        lastUpdated="2024"
                      />
                    )}
                  </span>
                ) : (
                  <span className="text-[#6B7771] italic text-xs">Not available</span>
                )}
              </td>
              <td className="px-4 py-3 text-right font-mono text-[#C41E3A] font-medium">
                {formatCurrency(drug.wac_monthly)}
              </td>
              <td className="px-4 py-3 text-right">
                <span className="bg-[#FEE2E2] text-[#C41E3A] px-2 py-0.5 rounded text-xs font-bold font-mono">
                  {formatCurrency(drug.wac_annual)}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                {drug.markup_percent !== undefined ? (
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-bold font-mono',
                    drug.markup_percent > 1000 ? 'bg-[#FEE2E2] text-[#C41E3A]' : 'bg-[#FFFBEB] text-[#B45309]'
                  )}>
                    {drug.markup_percent.toFixed(0)}%
                  </span>
                ) : (
                  <span className="text-[#6B7771] italic text-xs">&mdash;</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {sorted.length === 0 && (
        <div className="py-16 text-center text-sm text-[#6B7771] font-body">
          No drugs found for this manufacturer.
        </div>
      )}
    </div>
  );
}

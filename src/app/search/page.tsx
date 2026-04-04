'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { MarkupBadge } from '@/components/ui/MarkupBadge';
import { getWacPrices, getCogsForDrug, getManufacturerById } from '@/lib/data';
import { formatCurrency, computeMarkupPercent } from '@/lib/formatters';
import { Search, ArrowRight, Pill } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  const allDrugs = useMemo(() => getWacPrices(), []);

  const results = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return allDrugs
      .filter(
        d =>
          d.drug_name.toLowerCase().includes(q) ||
          d.generic_name.toLowerCase().includes(q) ||
          d.manufacturer_id.toLowerCase().includes(q) ||
          (d.ndc && d.ndc.includes(q))
      )
      .slice(0, 50);
  }, [allDrugs, query]);

  return (
    <div className="min-h-screen bg-[#F7F9F8]">
      <TopNav />

      <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1F2A24] font-display">Search Drugs</h1>
          <p className="mt-2 text-[#6B7771] font-body">
            Find any drug by brand name, generic name, manufacturer, or NDC code.
          </p>
        </div>

        {/* Search input */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7771]" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search by drug name, generic, manufacturer, or NDC..."
            aria-label="Search drugs"
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-xl border border-[#E5ECE8] bg-white text-lg text-[#1F2A24] placeholder:text-[#6B7771] focus:outline-none focus:ring-2 focus:ring-[#0B6B3A]/20 focus:border-[#0B6B3A] font-body shadow-sm"
          />
        </div>

        {/* Results */}
        {query.length >= 2 && (
          <p className="text-sm text-[#6B7771] font-body mb-4">
            {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
          </p>
        )}

        <div className="space-y-3">
          {results.map(drug => {
            const cogs = getCogsForDrug(drug.drug_id);
            const mfr = getManufacturerById(drug.manufacturer_id);
            const markupPct = cogs?.estimate_preferred
              ? computeMarkupPercent(cogs.estimate_preferred, drug.wac_monthly)
              : null;

            return (
              <Link
                key={drug.drug_id}
                href={`/drug/${drug.drug_id}`}
                className="group flex items-center justify-between bg-white rounded-xl border border-[#E5ECE8] p-4 shadow-sm hover:shadow-md hover:border-[#0B6B3A]/30 transition-all"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
                    <Pill className="w-5 h-5 text-[#6B7771]" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-[#1F2A24] font-display truncate">
                      {drug.drug_name}
                    </h3>
                    <p className="text-sm text-[#6B7771] font-body truncate">
                      {drug.generic_name} &middot; {mfr?.name || drug.manufacturer_id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-mono font-bold text-[#C41E3A]">
                      {formatCurrency(drug.wac_monthly)}/mo
                    </p>
                    {markupPct != null && markupPct > 0 && (
                      <MarkupBadge percent={markupPct} className="mt-1" />
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#6B7771] group-hover:text-[#07542D] transition-colors" />
                </div>
              </Link>
            );
          })}
        </div>

        {query.length >= 2 && results.length === 0 && (
          <div className="text-center py-16">
            <Pill className="w-12 h-12 text-[#E5ECE8] mx-auto mb-4" />
            <p className="text-[#6B7771] font-body">No drugs found matching &ldquo;{query}&rdquo;</p>
            <p className="text-sm text-[#6B7771] font-body mt-1">
              Try searching by brand name, generic name, or manufacturer.
            </p>
          </div>
        )}

        {query.length < 2 && (
          <div className="text-center py-16">
            <Search className="w-12 h-12 text-[#E5ECE8] mx-auto mb-4" />
            <p className="text-[#6B7771] font-body">Start typing to search {allDrugs.length} drugs</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

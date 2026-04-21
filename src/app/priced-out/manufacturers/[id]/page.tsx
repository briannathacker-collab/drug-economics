'use client';

import { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { ManufacturerStats } from '@/components/manufacturers/ManufacturerStats';
import { ManufacturerDrugTable } from '@/components/manufacturers/ManufacturerDrugTable';
import { FreshnessBadge } from '@/components/ui/FreshnessBadge';
import { ExportButton } from '@/components/ui/ExportButton';
import { getManufacturerCards } from '@/lib/data';
import { ArrowLeft } from 'lucide-react';

export default function ManufacturerPage() {
  const params = useParams();
  const id = params.id as string;

  const allCards = useMemo(() => getManufacturerCards(), []);
  const manufacturer = useMemo(
    () => allCards.find(m => m.manufacturer_id === id),
    [allCards, id]
  );

  if (!manufacturer) {
    return (
      <div className="min-h-screen bg-[#f5f5f0]">
        <TopNav />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <h1 className="text-2xl font-bold text-[#1a1a1a] font-display">Manufacturer not found</h1>
          <p className="mt-2 text-[#555555] font-body">
            No manufacturer with ID &ldquo;{id}&rdquo; exists in our data.
          </p>
          <Link
            href="/priced-out"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[#2d5016] hover:text-[#3a6b1e] transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Priced Out
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <TopNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-[#555555] font-body">
          <Link href="/priced-out" className="hover:text-[#1a1a1a] transition-colors">
            Priced Out
          </Link>
          <span>&rsaquo;</span>
          <Link href="/priced-out#manufacturers" className="hover:text-[#1a1a1a] transition-colors">
            Manufacturers
          </Link>
          <span>&rsaquo;</span>
          <span className="text-[#1a1a1a] font-medium">{manufacturer.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#1a1a1a] font-display">{manufacturer.name}</h1>
            <p className="mt-1 text-sm text-[#555555] font-mono">{manufacturer.ticker}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#E6F2EC] flex items-center justify-center text-lg font-bold text-[#2d5016] font-display">
            {manufacturer.name
              .split(/[\s&]+/)
              .filter(w => w.length > 1)
              .slice(0, 2)
              .map(w => w[0])
              .join('')
              .toUpperCase()}
          </div>
        </div>

        {/* KPI Stats Row */}
        <ManufacturerStats data={manufacturer} />

        {/* Drug Table */}
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#1a1a1a] font-display">
              Drug Portfolio
              <span className="ml-2 text-sm font-normal text-[#555555] font-body">
                {manufacturer.drugs.length} drug{manufacturer.drugs.length !== 1 ? 's' : ''} tracked
              </span>
            </h2>
            <ExportButton
              filename={`${manufacturer.name.toLowerCase().replace(/\s+/g, '-')}-drugs`}
              data={manufacturer.drugs.map(d => ({
                drug: d.name,
                generic_name: d.generic_name,
                specialty: d.specialty,
                wac_monthly: d.wac_monthly,
                wac_annual: d.wac_annual,
                cogs_estimate: d.cogs_estimate || '',
                markup_percent: d.markup_percent ? d.markup_percent.toFixed(1) : '',
              }))}
              columns={[
                { key: 'drug', label: 'Drug' },
                { key: 'generic_name', label: 'Generic Name' },
                { key: 'specialty', label: 'Specialty' },
                { key: 'wac_monthly', label: 'WAC Monthly (cents)' },
                { key: 'wac_annual', label: 'WAC Annual (cents)' },
                { key: 'cogs_estimate', label: 'COGS Est. Monthly (cents)' },
                { key: 'markup_percent', label: 'Markup %' },
              ]}
            />
          </div>

          <p className="text-[10px] text-[#555555] font-mono mb-4 flex items-center gap-2">
            <FreshnessBadge dataYear={2026} dataQuarter="Q1" source="WAC_MONITOR" />
            <span>&middot; Sources: CMS, FDA, SEC EDGAR, peer-reviewed literature</span>
          </p>

          <ManufacturerDrugTable drugs={manufacturer.drugs} />
        </div>
      </main>

      <Footer />
    </div>
  );
}

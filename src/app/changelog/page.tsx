'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { getChangelog } from '@/lib/data';
import { formatCurrency } from '@/lib/formatters';
import { ExternalLink, Search, Clock, TrendingUp, Pill, RefreshCw, Shield, AlertTriangle, FlaskConical } from 'lucide-react';
import type { ChangelogUpdateType } from '@/lib/types';

const TYPE_CONFIG: Record<string, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  PRICE_INCREASE: { label: 'Price Increase', bg: 'bg-[#FEE2E2]', text: 'text-[#c0392b]', icon: <TrendingUp className="w-3.5 h-3.5" /> },
  NEW_DRUG: { label: 'New Drug', bg: 'bg-[#E6F2EC]', text: 'text-[#2d5016]', icon: <Pill className="w-3.5 h-3.5" /> },
  NEW_BIOSIMILAR: { label: 'New Biosimilar', bg: 'bg-[#E6F2EC]', text: 'text-[#2d5016]', icon: <FlaskConical className="w-3.5 h-3.5" /> },
  BIOSIMILAR_STATUS_CHANGE: { label: 'Biosimilar Update', bg: 'bg-[#E6F2EC]', text: 'text-[#2d5016]', icon: <RefreshCw className="w-3.5 h-3.5" /> },
  TRIAL_STATUS_CHANGE: { label: 'Trial Update', bg: 'bg-[#EDE9FE]', text: 'text-[#7C3AED]', icon: <FlaskConical className="w-3.5 h-3.5" /> },
  QUARTERLY_REFRESH: { label: 'Quarterly Refresh', bg: 'bg-[#F1F5F9]', text: 'text-[#555555]', icon: <RefreshCw className="w-3.5 h-3.5" /> },
  WEEKLY_REFRESH: { label: 'Weekly Refresh', bg: 'bg-[#F1F5F9]', text: 'text-[#555555]', icon: <RefreshCw className="w-3.5 h-3.5" /> },
  MONTHLY_CHECK: { label: 'Monthly Check', bg: 'bg-[#F1F5F9]', text: 'text-[#555555]', icon: <Clock className="w-3.5 h-3.5" /> },
  PATENT_REFRESH: { label: 'Patent Update', bg: 'bg-[#FFFBEB]', text: 'text-[#b8860b]', icon: <Shield className="w-3.5 h-3.5" /> },
  IRA_PAGE_UPDATE: { label: 'IRA Update', bg: 'bg-[#1E3A5F]/10', text: 'text-[#1E3A5F]', icon: <Shield className="w-3.5 h-3.5" /> },
  IRA_UPDATE: { label: 'IRA Update', bg: 'bg-[#1E3A5F]/10', text: 'text-[#1E3A5F]', icon: <Shield className="w-3.5 h-3.5" /> },
  DATA_CORRECTION: { label: 'Data Correction', bg: 'bg-[#FFFBEB]', text: 'text-[#b8860b]', icon: <AlertTriangle className="w-3.5 h-3.5" /> },
};

const DEFAULT_CONFIG = { label: 'Update', bg: 'bg-[#F1F5F9]', text: 'text-[#555555]', icon: <RefreshCw className="w-3.5 h-3.5" /> };

const FILTERS: { id: ChangelogUpdateType | 'ALL'; label: string }[] = [
  { id: 'ALL', label: 'All' },
  { id: 'PRICE_INCREASE', label: 'Price Increases' },
  { id: 'NEW_DRUG', label: 'New Drugs' },
  { id: 'NEW_BIOSIMILAR', label: 'Biosimilars' },
  { id: 'TRIAL_STATUS_CHANGE', label: 'Trials' },
  { id: 'QUARTERLY_REFRESH', label: 'Refreshes' },
  { id: 'IRA_UPDATE', label: 'IRA' },
  { id: 'DATA_CORRECTION', label: 'Corrections' },
];

function timeAgo(dateStr: string, timestampStr?: string): string {
  const date = timestampStr ? new Date(timestampStr) : new Date(dateStr + 'T12:00:00');
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ChangelogPage() {
  const [filter, setFilter] = useState<ChangelogUpdateType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const changelog = useMemo(() => getChangelog(), []);

  const filtered = useMemo(() => {
    let entries = changelog;
    if (filter !== 'ALL') {
      entries = entries.filter(entry => entry.update_type === filter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      entries = entries.filter(
        entry =>
          entry.drug_name.toLowerCase().includes(q) ||
          entry.manufacturer.toLowerCase().includes(q) ||
          entry.description.toLowerCase().includes(q)
      );
    }
    return entries;
  }, [changelog, filter, searchQuery]);

  // Group filtered entries by date
  const groupedByDate = useMemo(() => {
    const groups: Record<string, typeof filtered> = {};
    for (const entry of filtered) {
      if (!groups[entry.date]) {
        groups[entry.date] = [];
      }
      groups[entry.date].push(entry);
    }
    // Return sorted date keys (newest first) with their entries
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  // Stats
  const priceIncreases = changelog.filter(e => e.update_type === 'PRICE_INCREASE').length;
  const latestUpdate = changelog[0];

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <TopNav />

      <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#1a1a1a] font-display">Data Updates</h1>
          <p className="mt-2 text-[#555555] font-body">
            Automated tracking of all price changes, new drugs, and data corrections.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-lg border border-[#e0ddd5] p-3 text-center">
            <p className="text-xl font-bold text-[#1a1a1a] font-mono">{changelog.length}</p>
            <p className="text-[10px] text-[#555555] font-body">Total updates</p>
          </div>
          <div className="bg-white rounded-lg border border-[#e0ddd5] p-3 text-center">
            <p className="text-xl font-bold text-[#c0392b] font-mono">{priceIncreases}</p>
            <p className="text-[10px] text-[#555555] font-body">Price increases</p>
          </div>
          <div className="bg-white rounded-lg border border-[#e0ddd5] p-3 text-center">
            <p className="text-xl font-bold text-[#2d5016] font-mono">
              {latestUpdate ? timeAgo(latestUpdate.date) : '—'}
            </p>
            <p className="text-[10px] text-[#555555] font-body">Last update</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555]" aria-hidden="true" />
          <input
            type="search"
            placeholder="Filter by drug, manufacturer..."
            aria-label="Filter changelog entries"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-[#e0ddd5] bg-white text-sm text-[#1a1a1a] placeholder:text-[#555555] focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 focus:border-[#2d5016] font-body"
          />
        </div>

        {/* Filter bar */}
        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-2 scrollbar-hide" role="tablist" aria-label="Changelog filters">
          {FILTERS.map(f => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors font-body ${
                filter === f.id
                  ? 'bg-[#2d5016] text-white'
                  : 'bg-white text-[#555555] border border-[#e0ddd5] hover:bg-[#F1F5F9]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs text-[#555555] font-mono mb-4">
          {filtered.length} entries
        </p>

        {/* Timeline — grouped by date */}
        <div className="space-y-8">
          {groupedByDate.map(([date, entries]) => (
            <div key={date}>
              {/* Date group header */}
              <h3 className="text-sm font-bold text-[#1a1a1a] font-display mb-3 sticky top-14 bg-[#f5f5f0] py-2 z-10 border-b border-[#e0ddd5]">
                {new Date(date + 'T12:00:00').toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>

              <div className="space-y-3">
                {entries.map((entry, i) => {
                  const config = TYPE_CONFIG[entry.update_type] || DEFAULT_CONFIG;
                  const ts = (entry as unknown as Record<string, unknown>).timestamp as string | undefined;

                  return (
                    <div
                      key={`${entry.date}-${entry.drug_name}-${i}`}
                      className="bg-white rounded-xl border border-[#e0ddd5] shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                      <div className="p-4 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            {/* Type pill + relative time */}
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`${config.bg} ${config.text} inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold font-body`}>
                                {config.icon}
                                {config.label}
                              </span>
                              <span className="text-xs text-[#555555] font-mono" title={entry.date}>
                                {timeAgo(entry.date, ts)}
                              </span>
                            </div>

                            {/* Drug + manufacturer */}
                            <h4 className="text-base font-bold text-[#1a1a1a] font-display">
                              {entry.drug_name !== 'ALL' && entry.drug_name !== 'N/A' ? (
                                <Link href={`/drug/${entry.drug_name.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-[#3a6b1e] transition-colors">
                                  {entry.drug_name}
                                </Link>
                              ) : (
                                entry.drug_name
                              )}
                            </h4>
                            {entry.manufacturer && entry.manufacturer !== 'ALL' && (
                              <p className="text-xs text-[#555555] font-body">{entry.manufacturer}</p>
                            )}

                            {/* Description */}
                            <p className="text-sm text-[#555555] font-body mt-1.5 leading-relaxed">
                              {entry.description}
                            </p>

                            {/* Price change details */}
                            {entry.previous_value_cents != null && entry.new_value_cents != null && (
                              <div className="mt-2 flex items-center gap-3">
                                <span className="text-sm font-mono text-[#555555]">
                                  {formatCurrency(entry.previous_value_cents)}
                                </span>
                                <span className="text-[#555555]">&rarr;</span>
                                <span className="text-sm font-mono font-bold text-[#c0392b]">
                                  {formatCurrency(entry.new_value_cents)}
                                </span>
                                {entry.pct_change != null && (
                                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                                    entry.pct_change > 0
                                      ? 'bg-[#FEE2E2] text-[#c0392b]'
                                      : 'bg-[#E6F2EC] text-[#2d5016]'
                                  }`}>
                                    {entry.pct_change > 0 ? '+' : ''}{entry.pct_change}%
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Source link */}
                            {entry.source_url && (
                              <a
                                href={entry.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-[#2d5016] font-medium mt-2 hover:underline font-body"
                              >
                                <ExternalLink className="w-3 h-3" />
                                {entry.source}
                              </a>
                            )}
                            {!entry.source_url && entry.source && (
                              <p className="text-xs text-[#555555] font-body mt-2">
                                {entry.source}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#555555] font-body">No entries match your filters.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

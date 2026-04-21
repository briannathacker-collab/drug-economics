'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

interface ControlsBarProps {
  onSearch?: (query: string) => void;
  onSpecialtyChange?: (specialty: string) => void;
  onSortChange?: (sort: string) => void;
  specialties?: string[];
}

export function ControlsBar({
  onSearch,
  onSpecialtyChange,
  onSortChange,
  specialties = [],
}: ControlsBarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="sticky top-14 z-20 bg-[#f5f5f0] border-b border-[#e0ddd5] py-3" role="toolbar" aria-label="Filter and sort controls">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px] sm:min-w-[200px] sm:max-w-md order-1 basis-full sm:basis-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555]" aria-hidden="true" />
            <input
              type="search"
              placeholder="Search drugs, manufacturers..."
              aria-label="Search drugs and manufacturers"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                onSearch?.(e.target.value);
              }}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-[#e0ddd5] bg-white text-sm text-[#1a1a1a] placeholder:text-[#555555] focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 focus:border-[#2d5016] font-body"
            />
          </div>

          {/* Specialty dropdown */}
          <select
            onChange={e => onSpecialtyChange?.(e.target.value)}
            aria-label="Filter by specialty"
            className="px-3 py-2 rounded-lg border border-[#e0ddd5] bg-white text-sm text-[#555555] focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 font-body order-2 flex-1 sm:flex-none"
          >
            <option value="">All Specialties</option>
            {specialties.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            onChange={e => onSortChange?.(e.target.value)}
            aria-label="Sort manufacturers"
            className="px-3 py-2 rounded-lg border border-[#e0ddd5] bg-white text-sm text-[#555555] focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 font-body order-3 flex-1 sm:flex-none"
          >
            <option value="revenue">Sort by Revenue</option>
            <option value="markup">Sort by Markup</option>
            <option value="name">Sort by Name</option>
            <option value="drugs">Sort by Drug Count</option>
          </select>
        </div>
      </div>
    </div>
  );
}

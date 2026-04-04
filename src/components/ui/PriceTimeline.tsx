'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatCurrency } from '@/lib/formatters';
import { AccessibleDataTable } from './AccessibleDataTable';
import type { WacHistoryEntry } from '@/lib/types';

interface PriceTimelineProps {
  data: WacHistoryEntry;
  className?: string;
}

export function PriceTimeline({ data, className }: PriceTimelineProps) {
  const chartData = data.price_history.map(h => ({
    date: new Date(h.date).getFullYear(),
    price: h.wac_monthly / 100, // convert cents to dollars for display
    change: h.change_percent,
  }));

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-[#1F2A24] font-body">Price History</h4>
        <div className="flex items-center gap-3 text-xs text-[#6B7771] font-mono">
          <span>Launch: {formatCurrency(data.launch_price)}</span>
          <span className="text-[#C41E3A] font-bold">+{data.total_increase_percent.toFixed(0)}% total</span>
        </div>
      </div>

      <div className="h-48 w-full" role="img" aria-label={`Price history chart for ${data.drug_name}: ${data.num_increases} price increases totaling ${data.total_increase_percent.toFixed(0)}% since launch, CAGR ${data.cagr.toFixed(1)}%`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#6B7771', fontFamily: 'DM Mono' }}
              axisLine={{ stroke: '#E5ECE8' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6B7771', fontFamily: 'DM Mono' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2A24',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'DM Sans',
                color: '#fff',
              }}
              formatter={(value) => [`$${Number(value).toLocaleString()}/mo`, 'WAC']}
              labelFormatter={(label) => `Year: ${label}`}
            />
            <Line
              type="stepAfter"
              dataKey="price"
              stroke="#C41E3A"
              strokeWidth={2}
              dot={{ fill: '#C41E3A', r: 3 }}
              activeDot={{ fill: '#C41E3A', r: 5, stroke: '#FEE2E2', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex items-center gap-4 text-xs text-[#6B7771] font-body">
        <span>{data.num_increases} price increases</span>
        <span>CAGR: {data.cagr.toFixed(1)}%</span>
      </div>

      {/* Inflation comparison anchor */}
      {data.launch_date && data.launch_price > 0 && (() => {
        const launchYear = new Date(data.launch_date).getFullYear();
        const currentYear = new Date().getFullYear();
        const yearsElapsed = currentYear - launchYear;
        const inflationPct = Math.round(2.6 * yearsElapsed);
        return yearsElapsed > 0 ? (
          <div className="mt-2 text-sm text-[#6B7771] font-body">
            Since {launchYear}: price increased{' '}
            <span className="text-[#C41E3A] font-bold">
              {data.total_increase_percent.toFixed(0)}%
            </span>
            {' '}&mdash; inflation over the same period:{' '}
            <span className="text-[#1F2A24] font-bold">
              {inflationPct}%
            </span>
          </div>
        ) : null;
      })()}

      {/* Accessible data table toggle */}
      <AccessibleDataTable
        caption={`Price history for ${data.drug_name}`}
        columns={[
          { key: 'date', label: 'Year' },
          { key: 'price', label: 'WAC/mo', format: (v) => `$${Number(v).toLocaleString()}` },
          { key: 'change', label: 'Change %', format: (v) => v != null ? `${Number(v) > 0 ? '+' : ''}${v}%` : '—' },
        ]}
        rows={chartData}
      />
    </div>
  );
}

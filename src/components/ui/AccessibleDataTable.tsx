'use client';

import { useState } from 'react';
import { Table, Eye } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  format?: (value: unknown) => string;
}

interface AccessibleDataTableProps {
  columns: Column[];
  rows: Record<string, unknown>[];
  caption: string;
  className?: string;
}

/**
 * Toggle-able data table for chart accessibility.
 * Place below any Recharts visualization to provide
 * screen reader access to the underlying data.
 */
export function AccessibleDataTable({ columns, rows, caption, className }: AccessibleDataTableProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={className}>
      <button
        onClick={() => setVisible(!visible)}
        className="inline-flex items-center gap-1.5 text-xs text-[#555555] hover:text-[#555555] font-body transition-colors mt-2"
        aria-expanded={visible}
        aria-controls="data-table"
      >
        {visible ? <Eye className="w-3.5 h-3.5" /> : <Table className="w-3.5 h-3.5" />}
        {visible ? 'Hide data table' : 'Show data table'}
      </button>

      {visible && (
        <div id="data-table" className="mt-3 overflow-x-auto rounded-lg border border-[#e0ddd5]">
          <table className="w-full text-xs" role="table">
            <caption className="sr-only">{caption}</caption>
            <thead>
              <tr className="bg-[#f5f5f0]">
                {columns.map(col => (
                  <th
                    key={col.key}
                    className="px-3 py-2 text-left font-bold text-[#555555] font-body uppercase tracking-wider"
                    scope="col"
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#f5f5f0]/50'}>
                  {columns.map(col => (
                    <td key={col.key} className="px-3 py-2 text-[#1a1a1a] font-mono">
                      {col.format ? col.format(row[col.key]) : String(row[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Screen reader only table (always present for assistive tech) */}
      {!visible && (
        <table className="sr-only" role="table">
          <caption>{caption}</caption>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} scope="col">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {columns.map(col => (
                  <td key={col.key}>
                    {col.format ? col.format(row[col.key]) : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

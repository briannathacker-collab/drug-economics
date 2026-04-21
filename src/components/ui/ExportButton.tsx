'use client';

import { useState } from 'react';
import { Download, FileText, Table } from 'lucide-react';

interface ExportButtonProps {
  data: Record<string, unknown>[];
  filename: string;
  columns: { key: string; label: string; format?: (value: unknown) => string }[];
  className?: string;
}

/**
 * Export button that lets users download data as CSV.
 * Placed alongside any data display to enable research use.
 */
export function ExportButton({ data, filename, columns, className }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  function exportCSV() {
    const header = columns.map(c => c.label).join(',');
    const rows = data.map(row =>
      columns.map(c => {
        const val = row[c.key];
        const formatted = c.format ? c.format(val) : String(val ?? '');
        // Escape commas and quotes in CSV
        if (formatted.includes(',') || formatted.includes('"') || formatted.includes('\n')) {
          return `"${formatted.replace(/"/g, '""')}"`;
        }
        return formatted;
      }).join(',')
    );

    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setIsOpen(false);
  }

  function exportJSON() {
    const exportData = data.map(row => {
      const obj: Record<string, unknown> = {};
      columns.forEach(c => {
        obj[c.label] = row[c.key];
      });
      return obj;
    });

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setIsOpen(false);
  }

  return (
    <div className={`relative inline-block ${className || ''}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#555555] bg-white border border-[#e0ddd5] rounded-lg hover:bg-[#F1F5F9] transition-colors font-body"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Download className="w-3.5 h-3.5" />
        Export
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-[#e0ddd5] z-50 py-1">
            <button
              onClick={exportCSV}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#1a1a1a] hover:bg-[#F1F5F9] transition-colors font-body"
            >
              <Table className="w-4 h-4 text-[#555555]" />
              CSV (.csv)
            </button>
            <button
              onClick={exportJSON}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#1a1a1a] hover:bg-[#F1F5F9] transition-colors font-body"
            >
              <FileText className="w-4 h-4 text-[#555555]" />
              JSON (.json)
            </button>
          </div>
        </>
      )}
    </div>
  );
}

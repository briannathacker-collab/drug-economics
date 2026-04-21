'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[The Generic Gap Error]', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#FEE2E2] flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-[#c0392b]" />
        </div>
        <h2 className="text-2xl font-bold text-[#1a1a1a] font-display mb-2">
          Something went wrong
        </h2>
        <p className="text-[#64748B] font-body mb-1">
          An error occurred in the The Generic Gap section.
        </p>
        <p className="text-sm text-[#555555] font-mono mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-[#2d5016] text-white rounded-lg font-medium hover:bg-[#3a6b1e] transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-4 py-2 border border-[#e0ddd5] rounded-lg text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

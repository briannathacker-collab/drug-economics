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
    console.error('[The IRA Effect Error]', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#FEE2E2] flex items-center justify-center">
          <AlertTriangle className="w-8 h-8 text-[#C41E3A]" />
        </div>
        <h2 className="text-2xl font-bold text-[#1F2A24] font-display mb-2">
          Something went wrong
        </h2>
        <p className="text-[#64748B] font-body mb-1">
          An error occurred in the The IRA Effect section.
        </p>
        <p className="text-sm text-[#6B7771] font-mono mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 bg-[#0B6B3A] text-white rounded-lg font-medium hover:bg-[#07542D] transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-4 py-2 border border-[#E5ECE8] rounded-lg text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

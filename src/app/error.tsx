'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f5f5f0] flex flex-col items-center justify-center px-4 sm:px-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mx-auto w-14 h-14 rounded-full bg-[#FEE2E2] flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-[#c0392b]" />
        </div>

        {/* Heading */}
        <h1 className="mt-6 text-3xl sm:text-4xl font-bold font-display text-[#2d5016] tracking-tight">
          Something went wrong
        </h1>

        {/* Error detail */}
        <p className="mt-4 text-sm font-body text-[#555555] leading-relaxed">
          An unexpected error occurred. You can try again or return to the home
          page.
        </p>
        {error.message && (
          <p className="mt-3 text-xs font-mono text-[#555555] bg-white border border-[#e0ddd5] rounded-lg px-4 py-2 break-words">
            {error.message}
          </p>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2d5016] text-white rounded-lg text-sm font-semibold hover:bg-[#3a6b1e] transition-colors font-body"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#2d5016] border border-[#e0ddd5] rounded-lg text-sm font-semibold hover:bg-[#F1F5F9] transition-colors font-body"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

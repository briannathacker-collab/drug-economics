'use client';

import Link from 'next/link';
import Image from 'next/image';

const NAV_LINKS = [
  { name: 'Priced Out', href: '/priced-out' },
  { name: 'Pipeline Watch', href: '/pipeline-watch' },
  { name: 'What It Costs Me', href: '/what-it-costs-me' },
  { name: 'Follow the Money', href: '/follow-the-money' },
  { name: 'The Generic Gap', href: '/the-generic-gap' },
  { name: 'IRA Effect', href: '/the-ira-effect' },
  { name: 'Changelog', href: '/changelog' },
];

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Row 1: Brand + Nav */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-8 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Image
              src="/logo/vitarecord-logo.png"
              alt="VitaRecord"
              width={24}
              height={26}
              className="w-6 h-6 brightness-0 invert opacity-50"
            />
            <p className="text-sm font-body text-[#555555]">
              Drug Economics — Vytalis Research
            </p>
          </div>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label="Footer navigation">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-body text-[#555555] hover:text-[#E6F2EC] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Row 2: Legal Disclaimer */}
        <div className="py-8 space-y-4">
          <div className="space-y-3">
            <p className="text-xs font-body text-[#64748B] leading-relaxed">
              This site is for educational and informational purposes only. It is
              not medical, financial, or legal advice.
            </p>
            <p className="text-xs font-body text-[#64748B] leading-relaxed">
              All cost-to-manufacture figures are estimates based on peer-reviewed
              literature and are clearly labeled. Actual manufacturer costs are
              proprietary.
            </p>
            <p className="text-xs font-mono text-[#64748B] leading-relaxed">
              Data sourced from CMS, FDA, SEC EDGAR, KFF, FTC, and peer-reviewed
              academic studies.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-white/5">
            <p className="text-xs font-body text-[#64748B]">
              &copy; 2026 Vytalis Research. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/contact"
                className="text-xs font-body text-[#64748B] hover:text-[#E6F2EC] transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/privacy"
                className="text-xs font-body text-[#64748B] hover:text-[#E6F2EC] transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-xs font-body text-[#64748B] hover:text-[#E6F2EC] transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

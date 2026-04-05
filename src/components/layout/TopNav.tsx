'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { MethodologyModal } from '@/components/ui/MethodologyModal';
import { getLatestChangelogDate } from '@/lib/data';
import { formatDate } from '@/lib/formatters';
import Image from 'next/image';
import { Menu, X, Search } from 'lucide-react';

const APPS = [
  { name: 'Priced Out', href: '/priced-out', id: 'priced-out' },
  { name: 'Pipeline Watch', href: '/pipeline-watch', id: 'pipeline-watch' },
  { name: 'What It Costs Me', href: '/what-it-costs-me', id: 'what-it-costs-me' },
  { name: 'Follow the Money', href: '/follow-the-money', id: 'follow-the-money' },
  { name: 'The Generic Gap', href: '/the-generic-gap', id: 'the-generic-gap' },
  { name: 'IRA Effect', href: '/the-ira-effect', id: 'the-ira-effect' },
];

const latestDate = getLatestChangelogDate();

export function TopNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false); // eslint-disable-line react-hooks/set-state-in-effect
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E5ECE8] shadow-sm" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Suite name */}
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Drug Economics — Home">
            <Image
              src="/logo/vytalis-symbol.svg"
              alt="Vytalis Research"
              width={28}
              height={28}
              className="w-7 h-7"
              priority
            />
            <span className="text-lg font-semibold text-[#0B6B3A] font-display tracking-tight">
              Drug Economics
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 mx-4" aria-label="Main navigation">
            {APPS.map(app => {
              const isActive = pathname.startsWith(app.href);
              return (
                <Link
                  key={app.id}
                  href={app.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors font-body whitespace-nowrap',
                    isActive
                      ? 'bg-[#E6F2EC] text-[#0B6B3A]'
                      : 'text-[#6B7771] hover:text-[#1F2A24] hover:bg-[#F1F5F9]'
                  )}
                >
                  {app.name}
                </Link>
              );
            })}
          </nav>

          {/* Right side: Search + Updated date + Estimates badge + hamburger */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/search"
              className="p-2 rounded-lg text-[#6B7771] hover:bg-[#F1F5F9] hover:text-[#1F2A24] transition-colors"
              aria-label="Search drugs"
            >
              <Search className="w-4 h-4" />
            </Link>
            {latestDate && (
              <Link
                href="/changelog"
                className="text-[10px] text-[#6B7771] hover:text-[#6B7771] transition-colors font-mono hidden lg:inline"
              >
                Updated {formatDate(latestDate)}
              </Link>
            )}
            <div className="hidden sm:block">
              <MethodologyModal />
            </div>

            {/* Hamburger button — mobile only */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#6B7771] hover:bg-[#F1F5F9] transition-colors"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 top-14 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile slide-down menu */}
      <nav
        id="mobile-nav"
        className={cn(
          'md:hidden fixed left-0 right-0 top-14 z-50 bg-white border-b border-[#E5ECE8] shadow-lg transition-all duration-200 ease-out',
          mobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        )}
        aria-label="Main navigation (mobile)"
        aria-hidden={!mobileMenuOpen}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
          {APPS.map(app => {
            const isActive = pathname.startsWith(app.href);
            return (
              <Link
                key={app.id}
                href={app.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'block px-4 py-3 rounded-lg text-sm font-medium transition-colors font-body',
                  isActive
                    ? 'bg-[#E6F2EC] text-[#0B6B3A]'
                    : 'text-[#6B7771] hover:bg-[#F1F5F9] hover:text-[#1F2A24]'
                )}
              >
                {app.name}
              </Link>
            );
          })}
          {/* Changelog link on mobile */}
          <Link
            href="/changelog"
            className={cn(
              'block px-4 py-3 rounded-lg text-sm font-medium transition-colors font-body',
              pathname.startsWith('/changelog')
                ? 'bg-[#E6F2EC] text-[#0B6B3A]'
                : 'text-[#6B7771] hover:bg-[#F1F5F9] hover:text-[#1F2A24]'
            )}
          >
            Changelog
          </Link>
          {/* Show methodology modal on mobile too */}
          <div className="pt-2 border-t border-[#E5ECE8] mt-2 sm:hidden">
            <MethodologyModal />
          </div>
        </div>
      </nav>
    </header>
  );
}

import Link from 'next/link';
import {
  Home,
  DollarSign,
  Clock,
  Calculator,
  Building2,
  ShieldAlert,
  ArrowLeft,
} from 'lucide-react';

const APPS = [
  {
    name: 'Priced Out',
    href: '/priced-out',
    icon: DollarSign,
    description: 'Drug pricing explorer',
  },
  {
    name: 'Pipeline Watch',
    href: '/pipeline-watch',
    icon: Clock,
    description: 'Patent cliff timeline',
  },
  {
    name: 'What It Costs Me',
    href: '/what-it-costs-me',
    icon: Calculator,
    description: 'Out-of-pocket calculator',
  },
  {
    name: 'Follow the Money',
    href: '/follow-the-money',
    icon: Building2,
    description: 'Insurer & PBM tracker',
  },
  {
    name: 'The Generic Gap',
    href: '/the-generic-gap',
    icon: ShieldAlert,
    description: 'Patent thicket tracker',
  },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F9F8] flex flex-col items-center justify-center px-4 sm:px-6">
      <div className="max-w-lg w-full text-center">
        {/* 404 indicator */}
        <p className="text-sm font-mono text-[#0B6B3A] tracking-widest uppercase">
          Error 404
        </p>
        <h1 className="mt-3 text-4xl sm:text-5xl font-bold font-display text-[#0B6B3A] tracking-tight">
          Page not found
        </h1>
        <p className="mt-4 text-base font-body text-[#6B7771] leading-relaxed">
          The page you are looking for does not exist or may have been moved.
          Try navigating back to the homepage or explore one of the apps below.
        </p>

        {/* Home link */}
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-[#0B6B3A] text-white rounded-lg text-sm font-semibold hover:bg-[#236B44] transition-colors font-body"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Divider */}
        <div className="mt-10 border-t border-[#E5ECE8]" />

        {/* App links */}
        <p className="mt-8 text-sm font-body text-[#6B7771] uppercase tracking-wider">
          Or explore an app
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {APPS.map(app => {
            const Icon = app.icon;
            return (
              <Link
                key={app.href}
                href={app.href}
                className="flex items-center gap-3 p-3 rounded-lg border border-[#E5ECE8] bg-white hover:border-[#0B6B3A]/30 hover:shadow-sm transition-all text-left"
              >
                <div className="w-8 h-8 rounded-md bg-[#E6F2EC] flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-[#0B6B3A]" />
                </div>
                <div>
                  <p className="text-sm font-semibold font-display text-[#1F2A24]">
                    {app.name}
                  </p>
                  <p className="text-xs font-body text-[#6B7771]">
                    {app.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { permanentRedirect } from 'next/navigation';

// Legacy path preserved for bookmarks. The next.config.ts `redirects()` hook
// is not being applied by the Next.js 16 + Turbopack production build on this
// deploy target, so we route it through an App Router page instead.
export default function LegacyIraEffectRedirect(): never {
  permanentRedirect('/the-ira-effect');
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The IRA Effect — Medicare Drug Price Negotiation | Drug Economics',
  description:
    'Track the Inflation Reduction Act\'s impact on drug pricing. See the first 10 Medicare-negotiated drugs, how much prices dropped, and what comes next. Savings of up to 79% off list prices for 9M+ beneficiaries.',
  keywords: [
    'Inflation Reduction Act',
    'IRA drug pricing',
    'Medicare negotiation',
    'drug price negotiation',
    'Maximum Fair Price',
    'MFP',
    'Medicare Part D',
    'Eliquis',
    'Jardiance',
    'Xarelto',
    'Januvia',
    'drug pricing transparency',
  ],
  openGraph: {
    title: 'The IRA Effect — Medicare Drug Price Negotiation',
    description:
      'For the first time, Medicare negotiated drug prices. See the 10 drugs, the savings, and what it means for patients.',
    type: 'website',
    url: 'https://drug-economics.vytalisresearch.com/the-ira-effect',
  },
};

export default function IraEffectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

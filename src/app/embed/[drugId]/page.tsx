import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getWacPrices,
  getDrugById,
  getCogsForDrug,
  getManufacturerById,
} from '@/lib/data';
import { computeMarkupPercent } from '@/lib/formatters';
import { EmbedCard } from './EmbedCard';

interface Props {
  params: Promise<{ drugId: string }>;
}

export async function generateStaticParams() {
  return getWacPrices().map(d => ({ drugId: d.drug_id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { drugId } = await params;
  const drug = getDrugById(drugId);
  if (!drug) return { title: 'Not Found' };
  return {
    title: `${drug.drug_name} — Drug Economics Embed`,
    robots: { index: false, follow: false },
  };
}

export default async function EmbedPage({ params }: Props) {
  const { drugId } = await params;
  const drug = getDrugById(drugId);
  if (!drug) notFound();

  const cogs = getCogsForDrug(drugId);
  const manufacturer = getManufacturerById(drug.manufacturer_id);
  const markupPct = cogs?.estimate_preferred
    ? computeMarkupPercent(cogs.estimate_preferred, drug.wac_monthly)
    : null;

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: 'transparent', fontFamily: 'DM Sans, system-ui, sans-serif' }}>
        <EmbedCard
          drugName={drug.drug_name}
          genericName={drug.generic_name}
          manufacturer={manufacturer?.name || drug.manufacturer_id}
          wacMonthly={drug.wac_monthly}
          cogsEstimate={cogs?.estimate_preferred || null}
          markupPct={markupPct}
          confidence={cogs?.confidence || null}
          drugId={drugId}
        />
      </body>
    </html>
  );
}

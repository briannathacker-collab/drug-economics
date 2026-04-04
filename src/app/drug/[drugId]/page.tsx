import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { DrugPageClient } from './DrugPageClient';
import {
  getWacPrices,
  getDrugById,
  getCogsForDrug,
  getHistoryForDrug,
  getManufacturerById,
  getPatentForDrug,
  getDelayTacticsForDrug,
} from '@/lib/data';
import { formatCurrency, computeMarkupPercent } from '@/lib/formatters';

interface Props {
  params: Promise<{ drugId: string }>;
}

export async function generateStaticParams() {
  return getWacPrices().map(d => ({ drugId: d.drug_id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { drugId } = await params;
  const drug = getDrugById(drugId);
  if (!drug) return { title: 'Drug Not Found — Drug Economics' };

  const cogs = getCogsForDrug(drugId);
  const markup = cogs?.estimate_preferred
    ? computeMarkupPercent(cogs.estimate_preferred, drug.wac_monthly)
    : null;
  const mfr = getManufacturerById(drug.manufacturer_id);

  const title = `${drug.drug_name} (${drug.generic_name}) — Drug Economics`;
  const description = markup
    ? `${drug.drug_name} costs an estimated ${formatCurrency(cogs!.estimate_preferred!)} to make but lists at ${formatCurrency(drug.wac_monthly)}/mo — a ${markup.toFixed(0)}% markup. By ${mfr?.name || drug.manufacturer_id}.`
    : `${drug.drug_name} (${drug.generic_name}) lists at ${formatCurrency(drug.wac_monthly)}/mo. Pricing data by Drug Economics.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://drug-economics.vytalisresearch.com/drug/${drugId}`,
      images: [`/api/drug-card?drug=${drugId}`],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function DrugPage({ params }: Props) {
  const { drugId } = await params;
  const drug = getDrugById(drugId);

  if (!drug) notFound();

  const cogs = getCogsForDrug(drugId);
  const history = getHistoryForDrug(drugId);
  const manufacturer = getManufacturerById(drug.manufacturer_id);
  const patent = getPatentForDrug(drugId);
  const delayTactics = getDelayTacticsForDrug(drugId);

  return (
    <div className="min-h-screen bg-[#F7F9F8]">
      <TopNav />

      <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-[#6B7771] font-body mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5">
            <li><Link href="/" className="hover:text-[#6B7771]">Home</Link></li>
            <li>/</li>
            <li><Link href="/priced-out" className="hover:text-[#6B7771]">Priced Out</Link></li>
            <li>/</li>
            <li className="text-[#1F2A24] font-medium">{drug.drug_name}</li>
          </ol>
        </nav>

        <DrugPageClient
          drug={drug}
          cogs={cogs || null}
          history={history || null}
          manufacturer={manufacturer || null}
          patent={patent || null}
          delayTactics={delayTactics || null}
        />
      </main>

      <Footer />
    </div>
  );
}

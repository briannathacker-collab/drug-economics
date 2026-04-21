'use client';

import { useState, useMemo } from 'react';
import { TopNav } from '@/components/layout/TopNav';
import { Footer } from '@/components/layout/Footer';
import { getWacPrices } from '@/lib/data';
import { Code, Copy, Check, ExternalLink } from 'lucide-react';

export default function EmbedDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const drugs = useMemo(() => getWacPrices(), []);
  const siteUrl = 'https://drug-economics.vytalisresearch.com';

  const filtered = useMemo(() => {
    if (!searchQuery) return drugs.slice(0, 20);
    const q = searchQuery.toLowerCase();
    return drugs.filter(
      d => d.drug_name.toLowerCase().includes(q) || d.generic_name.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [drugs, searchQuery]);

  function getEmbedCode(drugId: string) {
    return `<iframe src="${siteUrl}/embed/${drugId}" width="500" height="320" style="border:none;border-radius:12px;overflow:hidden;" title="Drug Economics - ${drugId}" loading="lazy"></iframe>`;
  }

  function copyCode(drugId: string) {
    navigator.clipboard.writeText(getEmbedCode(drugId));
    setCopied(drugId);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <TopNav />

      <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#2d5016] flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-[#1a1a1a] font-display">Embed Drug Cards</h1>
          </div>
          <p className="text-[#555555] font-body">
            Embed interactive drug pricing cards on your website, blog, or research publication.
            Each card shows real-time pricing data with source attribution.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl border border-[#e0ddd5] p-6 mb-8">
          <h2 className="text-lg font-bold text-[#1a1a1a] font-display mb-4">How to Embed</h2>
          <ol className="space-y-3 text-sm text-[#555555] font-body">
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#E6F2EC] text-[#2d5016] flex items-center justify-center text-xs font-bold shrink-0">1</span>
              <span>Find your drug below and click &quot;Copy embed code&quot;</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#E6F2EC] text-[#2d5016] flex items-center justify-center text-xs font-bold shrink-0">2</span>
              <span>Paste the iframe code into your HTML where you want the card to appear</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-[#E6F2EC] text-[#2d5016] flex items-center justify-center text-xs font-bold shrink-0">3</span>
              <span>The card auto-updates when our data refreshes — no maintenance needed</span>
            </li>
          </ol>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="search"
            placeholder="Search drugs by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-[#e0ddd5] bg-white text-[#1a1a1a] font-body text-sm placeholder:text-[#555555] focus:outline-none focus:ring-2 focus:ring-[#2d5016] focus:border-transparent"
          />
        </div>

        {/* Drug list */}
        <div className="space-y-3">
          {filtered.map(drug => (
            <div key={drug.drug_id} className="bg-white rounded-lg border border-[#e0ddd5] p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#1a1a1a] font-display">{drug.drug_name}</h3>
                  <p className="text-xs text-[#555555] font-mono">{drug.generic_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`/embed/${drug.drug_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-[#555555] border border-[#e0ddd5] rounded-lg hover:bg-[#F1F5F9] transition-colors font-body"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Preview
                  </a>
                  <button
                    onClick={() => copyCode(drug.drug_id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs text-white bg-[#2d5016] rounded-lg hover:bg-[#3a6b1e] transition-colors font-body"
                  >
                    {copied === drug.drug_id ? (
                      <><Check className="w-3 h-3" /> Copied!</>
                    ) : (
                      <><Copy className="w-3 h-3" /> Copy embed code</>
                    )}
                  </button>
                </div>
              </div>

              {copied === drug.drug_id && (
                <div className="mt-3 bg-[#f5f5f0] rounded-lg p-3 overflow-x-auto">
                  <code className="text-xs text-[#555555] font-mono break-all">
                    {getEmbedCode(drug.drug_id)}
                  </code>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#555555] font-body">No drugs match your search.</p>
          </div>
        )}

        {!searchQuery && drugs.length > 20 && (
          <p className="text-center text-xs text-[#555555] font-body mt-6">
            Showing first 20 drugs. Search to find specific drugs — {drugs.length} total available.
          </p>
        )}
      </main>

      <Footer />
    </div>
  );
}

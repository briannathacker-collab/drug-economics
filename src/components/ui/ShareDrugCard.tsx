'use client';

import { useState } from 'react';
import { Share2, Download, Check } from 'lucide-react';

interface ShareDrugCardProps {
  drugId: string;
  drugName: string;
  className?: string;
}

export function ShareDrugCard({ drugId, drugName, className }: ShareDrugCardProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const cardUrl = `/api/drug-card?drug=${encodeURIComponent(drugId)}`;

  const handleDownload = async () => {
    setStatus('loading');
    try {
      const res = await fetch(cardUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${drugId}-drug-economics.png`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus('done');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('idle');
    }
  };

  const handleShare = async () => {
    setStatus('loading');
    try {
      const res = await fetch(cardUrl);
      const blob = await res.blob();
      const file = new File([blob], `${drugId}-drug-economics.png`, { type: 'image/png' });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: `${drugName} — Drug Economics`,
          text: `See what ${drugName} really costs vs. what patients pay.`,
          files: [file],
        });
        setStatus('idle');
        return;
      }
    } catch {
      // Fall through to download
    }
    handleDownload();
  };

  return (
    <div className={`flex gap-2 ${className || ''}`}>
      <button
        onClick={handleShare}
        disabled={status === 'loading'}
        className="flex items-center gap-2 px-4 py-2 bg-[#c0392b] hover:bg-[#A01830] text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 font-body"
      >
        {status === 'done' ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
        {status === 'done' ? 'Shared!' : 'Share this drug'}
      </button>
      <button
        onClick={handleDownload}
        disabled={status === 'loading'}
        className="flex items-center gap-2 px-4 py-2 border border-[#e0ddd5] hover:bg-[#f5f5f0] text-[#555555] text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 font-body"
      >
        <Download className="w-4 h-4" />
        Download card
      </button>
    </div>
  );
}

'use client';

import { formatCurrency } from '@/lib/formatters';

interface EmbedCardProps {
  drugName: string;
  genericName: string;
  manufacturer: string;
  wacMonthly: number;
  cogsEstimate: number | null;
  markupPct: number | null;
  confidence: 'high' | 'medium' | 'low' | null;
  drugId: string;
}

export function EmbedCard({
  drugName,
  genericName,
  manufacturer,
  wacMonthly,
  cogsEstimate,
  markupPct,
  confidence,
  drugId,
}: EmbedCardProps) {
  const annualCost = wacMonthly * 12;
  const siteUrl = 'https://drug-economics.vytalisresearch.com';

  return (
    <div
      style={{
        maxWidth: 480,
        borderRadius: 12,
        border: '1px solid #e0ddd5',
        background: '#FFFFFF',
        overflow: 'hidden',
        fontFamily: 'DM Sans, system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{ background: '#2d5016', padding: '16px 20px' }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#FFFFFF' }}>{drugName}</div>
        <div style={{ fontSize: 13, color: '#555555', marginTop: 2 }}>
          {genericName} &middot; {manufacturer}
        </div>
      </div>

      {/* Metrics */}
      <div style={{ padding: 20, display: 'grid', gridTemplateColumns: cogsEstimate ? '1fr 1fr' : '1fr', gap: 16 }}>
        <div>
          <div style={{ fontSize: 11, color: '#555555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            List Price (WAC)
          </div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#c0392b', fontFamily: 'DM Mono, monospace' }}>
            {formatCurrency(wacMonthly)}/mo
          </div>
          <div style={{ fontSize: 12, color: '#555555' }}>
            {formatCurrency(annualCost)}/year
          </div>
        </div>

        {cogsEstimate && (
          <div>
            <div style={{ fontSize: 11, color: '#555555', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Est. Cost to Make
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#2d5016', fontFamily: 'DM Mono, monospace' }}>
              {formatCurrency(cogsEstimate)}/mo
            </div>
            {confidence && (
              <div style={{
                display: 'inline-block',
                fontSize: 10,
                background: '#FFFBEB',
                color: '#b8860b',
                padding: '2px 6px',
                borderRadius: 4,
                fontWeight: 600,
                marginTop: 2,
              }}>
                est. ({confidence})
              </div>
            )}
          </div>
        )}
      </div>

      {/* Markup bar */}
      {markupPct != null && cogsEstimate && (
        <div style={{ padding: '0 20px 16px' }}>
          <div style={{
            background: '#FEE2E2',
            borderRadius: 8,
            padding: 12,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 12, color: '#555555' }}>Markup over est. manufacturing cost</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#c0392b', fontFamily: 'DM Mono, monospace' }}>
              {markupPct.toFixed(0)}%
            </div>
            <div style={{ fontSize: 13, color: '#555555', marginTop: 4 }}>
              For every <strong>$1</strong> estimated to make, charges{' '}
              <strong style={{ color: '#c0392b' }}>
                ${(wacMonthly / cogsEstimate).toFixed(0)}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div style={{
        borderTop: '1px solid #e0ddd5',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: 10, color: '#555555' }}>
          Data from Drug Economics &middot; Sources: CMS, FDA, SEC, peer-reviewed literature
        </div>
        <a
          href={`${siteUrl}/drug/${drugId}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 11,
            color: '#2d5016',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Full details &rarr;
        </a>
      </div>
    </div>
  );
}

import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getDrugById, getCogsForDrug, getManufacturerById } from '@/lib/data';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const drugId = searchParams.get('drug') ?? '';
  const format = searchParams.get('format') ?? 'landscape';

  const width = format === 'square' ? 1080 : 1200;
  const height = format === 'square' ? 1080 : 675;

  const drug = getDrugById(drugId);
  if (!drug) {
    return new Response('Drug not found', { status: 404 });
  }

  const cogs = getCogsForDrug(drugId);
  const manufacturer = getManufacturerById(drug.manufacturer_id);

  const cogsValue = cogs?.estimate_preferred || 0;
  const markup = cogsValue > 0
    ? Math.round(((drug.wac_monthly - cogsValue) / cogsValue) * 100)
    : 0;
  const annualCents = drug.wac_monthly * 12;

  const fmt = (cents: number) =>
    '$' + (cents / 100).toLocaleString('en-US', { maximumFractionDigits: 0 });

  const isSquare = format === 'square';

  return new ImageResponse(
    (
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          background: '#1F2A24',
          display: 'flex',
          flexDirection: 'column',
          padding: isSquare ? '56px' : '48px',
          justifyContent: 'space-between',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#C41E3A', fontSize: 28, fontWeight: 800, letterSpacing: '4px' }}>
            DRUG ECONOMICS
          </span>
          <span style={{ color: '#6B7771', fontSize: 18 }}>drugeconomics.com</span>
        </div>

        {/* Drug identity */}
        <div style={{ display: 'flex', flexDirection: 'column', marginTop: isSquare ? 32 : 0 }}>
          <div style={{ color: 'white', fontSize: isSquare ? 52 : 56, fontWeight: 800, lineHeight: 1 }}>
            {drug.drug_name.toUpperCase()}
          </div>
          <div style={{ color: '#6B7771', fontSize: 22, marginTop: 8, display: 'flex' }}>
            {drug.generic_name} · {manufacturer?.name || drug.manufacturer_id}
          </div>
        </div>

        {/* Three stat boxes */}
        <div
          style={{
            display: 'flex',
            flexDirection: isSquare ? 'column' : 'row',
            gap: 24,
            marginTop: isSquare ? 32 : 0,
          }}
        >
          {/* Cost to make */}
          {cogsValue > 0 && (
            <div
              style={{
                flex: 1,
                border: '2px solid #0B6B3A',
                borderRadius: 12,
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <span style={{ color: '#6B7771', fontSize: 14, letterSpacing: '2px', fontWeight: 600 }}>
                COSTS TO MAKE
              </span>
              <span style={{ color: '#0B6B3A', fontSize: isSquare ? 40 : 44, fontWeight: 800, fontFamily: 'monospace' }}>
                ~{fmt(cogsValue)}
              </span>
              <span style={{ color: '#64748B', fontSize: 16, display: 'flex' }}>per month · est.</span>
            </div>
          )}

          {/* Patients pay */}
          <div
            style={{
              flex: 1,
              border: '2px solid #C41E3A',
              borderRadius: 12,
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <span style={{ color: '#6B7771', fontSize: 14, letterSpacing: '2px', fontWeight: 600 }}>
              PATIENTS PAY
            </span>
            <span style={{ color: '#C41E3A', fontSize: isSquare ? 40 : 44, fontWeight: 800, fontFamily: 'monospace' }}>
              {fmt(drug.wac_monthly)}
            </span>
            <span style={{ color: '#64748B', fontSize: 16, display: 'flex' }}>per month · list price</span>
          </div>

          {/* Markup */}
          {markup > 0 && (
            <div
              style={{
                flex: 1,
                border: '3px solid #C41E3A',
                borderRadius: 12,
                background: '#1a0505',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <span style={{ color: '#6B7771', fontSize: 14, letterSpacing: '2px', fontWeight: 600 }}>
                MARKUP
              </span>
              <span style={{ color: '#C41E3A', fontSize: isSquare ? 48 : 52, fontWeight: 800, fontFamily: 'monospace' }}>
                {markup.toLocaleString()}%
              </span>
              <span style={{ color: '#64748B', fontSize: 16, display: 'flex' }}>est.</span>
            </div>
          )}
        </div>

        {/* Annual cost + source */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: isSquare ? 32 : 0 }}>
          <span style={{ color: 'white', fontSize: 20, display: 'flex' }}>
            Patients pay{' '}
            <span style={{ color: '#C41E3A', fontWeight: 700, marginLeft: 6, marginRight: 6 }}>
              {fmt(annualCents)}
            </span>{' '}
            per year for this drug
          </span>
          <span style={{ color: '#6B7771', fontSize: 14, textAlign: 'right', display: 'flex' }}>
            {cogsValue > 0 ? 'COGS est: peer-reviewed · Price: CMS' : 'Price: CMS'}
          </span>
        </div>
      </div>
    ),
    { width, height }
  );
}

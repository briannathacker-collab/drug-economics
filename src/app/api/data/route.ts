import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Live data API — reads JSON data files at request time so the frontend
 * reflects bot updates without a redeploy.
 *
 * GET /api/data?file=wac_prices
 * GET /api/data?file=changelog
 * GET /api/data?file=integrity_report
 */

const ALLOWED_FILES = new Set([
  'wac_prices',
  'wac_history',
  'cogs_estimates',
  'cms_asp',
  'drug_revenue',
  'manufacturer_financials',
  'insurer_financials',
  'pbm_rebates',
  'patents',
  'biosimilar_pipeline',
  'pipeline_trials',
  'delay_tactics',
  'premium_history',
  'changelog',
  'ira_negotiated',
  'integrity_report',
]);

export async function GET(request: NextRequest) {
  const file = request.nextUrl.searchParams.get('file');

  if (!file || !ALLOWED_FILES.has(file)) {
    return NextResponse.json(
      { error: 'Invalid file parameter', allowed: Array.from(ALLOWED_FILES) },
      { status: 400 }
    );
  }

  const dataDir = join(process.cwd(), 'data');
  const filePath = join(dataDir, `${file}.json`);

  if (!existsSync(filePath)) {
    return NextResponse.json(
      { error: `File ${file}.json not found` },
      { status: 404 }
    );
  }

  try {
    const content = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch {
    return NextResponse.json(
      { error: `Failed to read ${file}.json` },
      { status: 500 }
    );
  }
}

// Drug Economics — Data Loader
// Typed data loader functions for each /data/*.json file

/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  ManufacturerFinancials,
  WacPrice,
  WacHistoryEntry,
  CogsEstimate,
  CmsAspEntry,
  DrugRevenue,
  PatentEntry,
  BiosimilarEntry,
  PipelineTrial,
  InsurerFinancials,
  PbmRebateData,
  PremiumHistory,
  DelayTactic,
  ManufacturerCardData,
  DrugCardData,
  ChangelogEntry,
  IraNegotiation,
  RevolvingDoorPerson,
  CaseStudy,
} from './types';

import manufacturerFinancialsData from '../../data/manufacturer_financials.json';
import wacPricesData from '../../data/wac_prices.json';
import wacHistoryData from '../../data/wac_history.json';
import cogsEstimatesData from '../../data/cogs_estimates.json';
import cmsAspData from '../../data/cms_asp.json';
import drugRevenueData from '../../data/drug_revenue.json';
import patentsData from '../../data/patents.json';
import biosimilarPipelineData from '../../data/biosimilar_pipeline.json';
import pipelineTrialsData from '../../data/pipeline_trials.json';
import insurerFinancialsData from '../../data/insurer_financials.json';
import pbmRebatesData from '../../data/pbm_rebates.json';
import premiumHistoryData from '../../data/premium_history.json';
import delayTacticsData from '../../data/delay_tactics.json';
import changelogData from '../../data/changelog.json';
import iraNegotiationsData from '../../data/ira_negotiations.json';
import internationalPricesData from '../../data/international_prices.json';
import revolvingDoorData from '../../data/revolving_door.json';
import caseStudiesData from '../../data/case_studies.json';

// Raw data accessors — use unknown intermediate to handle data shape variations
export function getManufacturerFinancials(): ManufacturerFinancials[] {
  return manufacturerFinancialsData as unknown as ManufacturerFinancials[];
}

export function getWacPrices(): WacPrice[] {
  return wacPricesData as unknown as WacPrice[];
}

export function getWacHistory(): WacHistoryEntry[] {
  return wacHistoryData as unknown as WacHistoryEntry[];
}

export function getCogsEstimates(): CogsEstimate[] {
  return cogsEstimatesData as unknown as CogsEstimate[];
}

export function getCmsAsp(): CmsAspEntry[] {
  return cmsAspData as unknown as CmsAspEntry[];
}

export function getDrugRevenue(): DrugRevenue[] {
  return drugRevenueData as unknown as DrugRevenue[];
}

export function getPatents(): PatentEntry[] {
  return patentsData as unknown as PatentEntry[];
}

export function getBiosimilarPipeline(): BiosimilarEntry[] {
  // Data may be nested — flatten if needed
  const raw = biosimilarPipelineData as unknown as any[];
  const flat: BiosimilarEntry[] = [];
  for (const entry of raw) {
    if (entry.biosimilars && Array.isArray(entry.biosimilars)) {
      for (const bio of entry.biosimilars) {
        flat.push({
          reference_drug_id: entry.reference_drug_id,
          reference_drug_name: entry.reference_drug_name,
          biosimilar_name: bio.biosimilar_name || bio.brand_name || bio.name,
          applicant: bio.applicant || bio.manufacturer,
          filing_date: bio.filing_date || bio.bla_submission_date || bio.fda_approval_date || null,
          approval_date: bio.approval_date || bio.fda_approval_date,
          launch_date: bio.launch_date || bio.us_launch_date,
          current_discount_percent: bio.current_discount_percent || bio.discount_to_reference,
          status: bio.status || (bio.us_launch_date || bio.launch_date ? 'launched' : bio.fda_approval_date || bio.approval_date ? 'approved' : 'filed'),
        });
      }
    } else {
      flat.push(entry as BiosimilarEntry);
    }
  }
  return flat;
}

export function getPipelineTrials(): PipelineTrial[] {
  const raw = pipelineTrialsData as unknown as any[];
  return raw.map(t => ({
    ...t,
    nct_number: t.nct_number || t.trial_id,
    developer: t.developer || t.manufacturer,
    condition: t.condition || t.indication,
    specialty: t.specialty || t.therapeutic_area || 'Other',
    estimated_completion: t.estimated_completion || t.estimated_completion_date,
    current_soc_monthly_cost: t.current_soc_monthly_cost || t.estimated_wac_monthly,
  }));
}

export function getInsurerFinancials(): InsurerFinancials[] {
  return insurerFinancialsData as unknown as InsurerFinancials[];
}

export function getPbmRebates(): PbmRebateData[] {
  return pbmRebatesData as unknown as PbmRebateData[];
}

export function getPremiumHistory(): PremiumHistory[] {
  return premiumHistoryData as unknown as PremiumHistory[];
}

export function getDelayTactics(): DelayTactic[] {
  return delayTacticsData as unknown as DelayTactic[];
}

export function getIraNegotiations(): IraNegotiation[] {
  return iraNegotiationsData as unknown as IraNegotiation[];
}

// International prices
export interface InternationalPrice {
  drug_id: string;
  drug_name: string;
  us_wac_annual: number;
  prices: Record<string, { annual: number; currency: string; source: string; ratio_to_us: number }>;
  data_year: number;
  data_quarter: string;
}

export function getInternationalPrices(): InternationalPrice[] {
  return internationalPricesData as unknown as InternationalPrice[];
}

export function getInternationalPriceForDrug(drugId: string): InternationalPrice | undefined {
  return getInternationalPrices().find(p => p.drug_id === drugId);
}

// Changelog
export function getChangelog(): ChangelogEntry[] {
  return changelogData as unknown as ChangelogEntry[];
}

export function getRevolvingDoor(): RevolvingDoorPerson[] {
  return revolvingDoorData as unknown as RevolvingDoorPerson[];
}

export function getCaseStudies(): CaseStudy[] {
  return caseStudiesData as unknown as CaseStudy[];
}

export function getLatestChangelogDate(): string {
  const entries = getChangelog();
  if (entries.length === 0) return '';
  return entries.sort((a, b) => b.date.localeCompare(a.date))[0].date;
}

// Computed data accessors
export function getManufacturerById(id: string): ManufacturerFinancials | undefined {
  return getManufacturerFinancials().find(m => m.manufacturer_id === id);
}

export function getDrugsByManufacturer(manufacturerId: string): WacPrice[] {
  return getWacPrices().filter(d => d.manufacturer_id === manufacturerId);
}

export function getDrugById(drugId: string): WacPrice | undefined {
  return getWacPrices().find(d => d.drug_id === drugId);
}

export function getCogsForDrug(drugId: string): CogsEstimate | undefined {
  const cogs = getCogsEstimates().find(c => c.drug_id === drugId);
  if (!cogs) return undefined;
  // Normalize — data may use estimated_cogs_monthly instead of estimate_preferred
  if (!cogs.estimate_preferred && cogs.estimated_cogs_monthly) {
    cogs.estimate_preferred = cogs.estimated_cogs_monthly;
  }
  // Extract from estimates array if present
  if (!cogs.estimate_preferred && cogs.estimates && cogs.estimates.length > 0) {
    const preferred = cogs.estimates.find((e: any) => e.preferred) || cogs.estimates[0];
    cogs.estimate_preferred = preferred.monthly_cost || preferred.estimate;
    cogs.estimate_low = cogs.estimates.reduce((min: number, e: any) => Math.min(min, e.monthly_cost || e.estimate || Infinity), Infinity);
    cogs.estimate_high = cogs.estimates.reduce((max: number, e: any) => Math.max(max, e.monthly_cost || e.estimate || 0), 0);
    cogs.author = preferred.source_author || preferred.source;
    cogs.publication_year = preferred.year || preferred.publication_year;
    cogs.source_url = preferred.source_url || '';
    cogs.citation = preferred.citation || `${preferred.source_author || 'Research estimate'}, ${preferred.year || ''}`;
    cogs.confidence = preferred.confidence || 'medium';
  }
  return cogs;
}

export function getHistoryForDrug(drugId: string): WacHistoryEntry | undefined {
  return getWacHistory().find(h => h.drug_id === drugId);
}

export function getPatentForDrug(drugId: string): PatentEntry | undefined {
  return getPatents().find(p => p.drug_id === drugId);
}

export function getDelayTacticsForDrug(drugId: string): DelayTactic | undefined {
  return getDelayTactics().find(d => d.drug_id === drugId);
}

function inferSpecialty(drugName: string): string {
  const map: Record<string, string> = {
    'Humira': 'Immunology',
    'Keytruda': 'Oncology',
    'Eliquis': 'Cardiology',
    'Stelara': 'Immunology',
    'Ibrance': 'Oncology',
    'Revlimid': 'Oncology',
    'Ozempic': 'Diabetes/Metabolism',
    'Xarelto': 'Cardiology',
    'Jardiance': 'Diabetes/Metabolism',
    'Trulicity': 'Diabetes/Metabolism',
    'Opdivo': 'Oncology',
    'Imbruvica': 'Oncology',
    'Enbrel': 'Immunology',
    'Rinvoq': 'Immunology',
    'Skyrizi': 'Immunology',
    'Gleevec': 'Oncology',
    'Sovaldi': 'Hepatology',
    'Tecfidera': 'Neurology',
    'Tagrisso': 'Oncology',
    'Trikafta': 'Pulmonology',
    'Dupixent': 'Immunology',
    'Pomalyst': 'Oncology',
    'Harvoni': 'Hepatology',
    'Sprycel': 'Oncology',
    'Afinitor': 'Oncology',
    'Xeljanz': 'Immunology',
    'Venclexta': 'Oncology',
    'Wegovy': 'Obesity',
    'Mounjaro': 'Diabetes/Metabolism',
    'Zepbound': 'Obesity',
    'Saxenda': 'Obesity',
    'Rybelsus': 'Diabetes/Metabolism',
    'Victoza': 'Diabetes/Metabolism',
    'Eylea': 'Ophthalmology',
    'Entresto': 'Cardiology',
    'Darzalex': 'Oncology',
    'Ocrevus': 'Neurology',
    'Biktarvy': 'Infectious Disease',
    'Cosentyx': 'Immunology',
    'Repatha': 'Cardiology',
    'Tremfya': 'Immunology',
    'Kisqali': 'Oncology',
    'Verzenio': 'Oncology',
    'Lynparza': 'Oncology',
    'Farxiga': 'Diabetes/Metabolism',
    'Otezla': 'Immunology',
    'Vyvanse': 'Psychiatry',
    'Xtandi': 'Oncology',
    'Januvia': 'Diabetes/Metabolism',
    'Gardasil 9': 'Vaccines',
    'Bridion': 'Anesthesiology',
    'Welireg': 'Oncology',
    'Lagevrio': 'Infectious Disease',
    'Vyndaqel': 'Cardiology',
    'Prolia': 'Bone Health',
    'Remicade': 'Immunology',
    'Rituxan': 'Oncology',
    'Herceptin': 'Oncology',
    'Botox': 'Neurology',
    'Prevnar 20': 'Vaccines',
    'Paxlovid': 'Infectious Disease',
    'Trelegy Ellipta': 'Respiratory',
    'Vraylar': 'Psychiatry',
    // 23 enriched drugs
    'Yervoy': 'Oncology',
    'Tecentriq': 'Oncology',
    'Avastin': 'Oncology',
    'Imfinzi': 'Oncology',
    'Enhertu': 'Oncology',
    'Kymriah': 'Oncology',
    'Yescarta': 'Oncology',
    'Spinraza': 'Neurology',
    'Zolgensma': 'Rare Disease',
    'Soliris': 'Rare Disease',
    'Ultomiris': 'Rare Disease',
    'Hemgenix': 'Rare Disease',
    'Vimizim': 'Rare Disease',
    'Naglazyme': 'Rare Disease',
    'Voxzogo': 'Rare Disease',
    'NovoLog': 'Diabetes/Metabolism',
    'Lantus': 'Diabetes/Metabolism',
    'Kesimpta': 'Neurology',
    'Aimovig': 'Neurology',
    'Hemlibra': 'Hematology',
    'Adakveo': 'Hematology',
    'Vabysmo': 'Ophthalmology',
    'Beovu': 'Ophthalmology',
    // 14 new drugs (March 2026)
    'Leqembi': 'Neurology',
    'Tepezza': 'Endocrinology',
    'Praluent': 'Cardiology',
    'Taltz': 'Immunology',
    'Carvykti': 'Oncology',
    'Abecma': 'Oncology',
    'Nurtec ODT': 'Neurology',
    'Jakafi': 'Oncology',
    'Trodelvy': 'Oncology',
    'Padcev': 'Oncology',
    'Xgeva': 'Oncology',
    'Lumakras': 'Oncology',
    'Luxturna': 'Ophthalmology',
    'Evenity': 'Bone Health',
  };
  return map[drugName] || 'Other';
}

// Build manufacturer card data with computed metrics
export function getManufacturerCards(): ManufacturerCardData[] {
  const manufacturers = getManufacturerFinancials();
  const drugs = getWacPrices();

  return manufacturers.map(mfr => {
    const mfrDrugs = drugs.filter(d => d.manufacturer_id === mfr.manufacturer_id);
    const latestRevenue = mfr.annual_revenue[0]?.revenue || 0;
    const latestIncome = mfr.net_income[0]?.income || 0;
    const latestRd = mfr.rd_spend[0]?.spend || 0;

    const drugCards: DrugCardData[] = mfrDrugs.map(drug => {
      const cogs = getCogsForDrug(drug.drug_id);
      const history = getWacHistory().find(h => h.drug_id === drug.drug_id);
      const cogsValue = cogs?.estimate_preferred || 0;
      const markup = cogsValue > 0
        ? ((drug.wac_monthly - cogsValue) / cogsValue) * 100
        : undefined;

      return {
        drug_id: drug.drug_id,
        name: drug.drug_name,
        generic_name: drug.generic_name,
        specialty: inferSpecialty(drug.drug_name),
        year_approved: 2010,
        wac_monthly: drug.wac_monthly,
        wac_annual: drug.wac_annual,
        cogs_estimate: cogsValue || undefined,
        cogs_confidence: cogs?.confidence,
        markup_percent: markup,
        asp: undefined,
        indications: [],
        price_history: history,
        cogs_source_url: cogs?.source_url,
        cogs_source_label: cogs?.citation || (cogs?.author ? `${cogs.author}, ${cogs.publication_year || ''}` : undefined),
      };
    });

    return {
      manufacturer_id: mfr.manufacturer_id,
      name: mfr.name,
      ticker: mfr.ticker,
      revenue: latestRevenue,
      net_income: latestIncome,
      rd_spend: latestRd,
      gross_margin: mfr.gross_margin,
      drugs: drugCards,
      ceo_compensation: mfr.ceo_compensation,
    };
  });
}

// Summary metrics across all data
export function getSummaryMetrics() {
  const drugs = getWacPrices();
  const manufacturers = getManufacturerFinancials();

  const totalDrugs = drugs.length;
  const totalManufacturers = manufacturers.length;

  let totalMarkup = 0;
  let markupCount = 0;
  let maxMarkupDrug = '';
  let maxMarkup = 0;

  drugs.forEach(drug => {
    const c = getCogsForDrug(drug.drug_id);
    const cogsValue = c?.estimate_preferred || 0;
    if (cogsValue > 0) {
      const m = ((drug.wac_monthly - cogsValue) / cogsValue) * 100;
      totalMarkup += m;
      markupCount++;
      if (m > maxMarkup) {
        maxMarkup = m;
        maxMarkupDrug = drug.drug_name;
      }
    }
  });

  const avgMarkup = markupCount > 0 ? totalMarkup / markupCount : 0;
  const totalRevenue = manufacturers.reduce((sum, m) => sum + (m.annual_revenue[0]?.revenue || 0), 0);

  return {
    totalDrugs,
    totalManufacturers,
    avgMarkup,
    maxMarkupDrug,
    maxMarkup,
    totalRevenue,
  };
}

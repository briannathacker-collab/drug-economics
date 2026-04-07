// Drug Economics — Core Data Types
// All monetary values stored as cents (integers). Display layer converts to dollars.
// All percentages stored as floats (e.g., 82.4 not '82.4%').
// All dates stored as ISO 8601 strings.

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface DrugEntry {
  drug_id: string;
  name: string;
  generic_name: string;
  manufacturer_id: string;
  ndc_codes: string[];
  specialty: string;
  year_approved: number;
  wac_monthly: number;
  indications: Indication[];
}

export interface Indication {
  name: string;
  type: 'on-label' | 'off-label';
  year_approved?: number;
}

export interface CmsAspEntry {
  drug_id: string;
  drug_name: string;
  [key: string]: any;
}

export interface WacPrice {
  drug_id: string;
  drug_name: string;
  generic_name: string;
  manufacturer_id: string;
  dosage_form: string;
  strength: string;
  wac_per_unit: number;
  wac_monthly: number;
  wac_annual: number;
  ndc: string;
  [key: string]: any;
}

export interface WacHistoryEntry {
  drug_id: string;
  drug_name: string;
  price_history: {
    date: string;
    wac_monthly: number;
    change_percent: number;
  }[];
  total_increase_percent: number;
  num_increases: number;
  cagr: number;
  launch_price: number;
  launch_date: string;
  [key: string]: any;
}

export interface CogsEstimate {
  drug_id: string;
  drug_name: string;
  estimate_low?: number;
  estimate_high?: number;
  estimate_preferred?: number;
  estimated_cogs_monthly?: number;
  source_url?: string;
  author?: string;
  publication_year?: number;
  confidence?: 'high' | 'medium' | 'low';
  citation?: string;
  estimates?: any[];
  markup_over_cogs?: number;
  [key: string]: any;
}

export interface ManufacturerFinancials {
  manufacturer_id: string;
  name: string;
  ticker: string;
  annual_revenue: { year: number; revenue: number }[];
  net_income: { year: number; income: number }[];
  rd_spend: { year: number; spend: number }[];
  sga_spend: { year: number; spend: number }[];
  gross_margin: number;
  ceo_compensation: number;
  ceo_name: string;
  headquarters: string;
  employees: number;
}

export interface DrugRevenue {
  drug_id: string;
  drug_name: string;
  manufacturer_id: string;
  annual_revenue: { year: number; revenue: number }[];
  peak_revenue_year: number;
  trajectory: 'growing' | 'stable' | 'declining';
  [key: string]: any;
}

export interface PatentEntry {
  drug_id: string;
  drug_name: string;
  original_patent_expiry: string;
  secondary_patents: any[];
  exclusivity_type: string;
  patent_cliff_date: string;
  delay_years: number;
  [key: string]: any;
}

export interface BiosimilarEntry {
  reference_drug_id: string;
  reference_drug_name: string;
  biosimilar_name?: string;
  applicant?: string;
  filing_date?: string;
  approval_date?: string;
  launch_date?: string;
  current_discount_percent?: number;
  status?: string;
  biosimilars?: any[];
  [key: string]: any;
}

export interface PipelineTrial {
  nct_number?: string;
  trial_id?: string;
  drug_name: string;
  developer?: string;
  manufacturer?: string;
  phase: string;
  condition?: string;
  indication?: string;
  specialty?: string;
  therapeutic_area?: string;
  estimated_completion?: string;
  estimated_completion_date?: string;
  primary_endpoint: string;
  enrollment: number;
  designation?: string;
  existing_drug_in_class?: boolean;
  current_soc_monthly_cost?: number;
  [key: string]: any;
}

export interface InsurerFinancials {
  insurer_id: string;
  name: string;
  ticker: string;
  type: string;
  annual_revenue: { year: number; revenue: number }[];
  medical_loss_ratio: number;
  net_income: { year: number; income: number }[];
  ceo_compensation: number;
  ceo_name: string;
  prior_auth_denial_rate: number;
  subsidiaries: string[];
}

export interface PbmRebateData {
  pbm_id: string;
  pbm_name: string;
  parent_company: string;
  market_share: number;
  estimated_rebate_revenue: number;
  passthrough_rate: number;
  retained_rate: number;
  source: string;
  year: number;
}

export interface PremiumHistory {
  year: number;
  avg_family_premium: number;
  avg_family_deductible: number;
  avg_individual_premium: number;
  avg_individual_deductible: number;
  source: string;
}

export interface DelayTactic {
  drug_id: string;
  drug_name: string;
  manufacturer: string;
  tactics: {
    type: string;
    description: string;
    ftc_case_ref?: string;
    court_case?: string;
    settlement_amount?: number;
    delay_months: number;
    outcome?: string;
  }[];
  total_delay_years: number;
  estimated_patient_cost_of_delay: number;
  estimated_patient_population: number;
}

// IRA Medicare negotiation data
export interface IraNegotiation {
  drug_id: string;
  drug_name: string;
  generic_name: string;
  manufacturer: string;
  indication: string;
  medicare_spend_billions: number;
  enrolled_beneficiaries: number;
  current_wac_annual: number;       // cents
  negotiated_price_annual: number;   // cents
  savings_percent: number;
  effective_date: string;
  status: 'active' | 'pending' | 'announced';
  round: number;
}

// Revolving Door
export interface RevolvingDoorPosition {
  title: string;
  org_name: string;
  org_type: string;
  start_year: number;
  end_year: number | null;
  notes?: string;
}

export interface RevolvingDoorPerson {
  id: string;
  full_name: string;
  significance: 'high' | 'medium';
  known_policy_influence: string;
  positions: RevolvingDoorPosition[];
  source_urls: string[];
}

// Case Studies
export interface CaseStudySource {
  name: string;
  url: string;
}

export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  is_featured: boolean;
  summary: string;
  estimated_patient_cost_usd: number;
  lobbying_spend_related_usd: number;
  organizations: string[];
  key_findings: string[];
  full_content: string;
  sources: CaseStudySource[];
}

// Source attribution for estimated/derived figures
export interface SourceMetadata {
  sourceLabel: string;
  sourceUrl?: string;
  lastUpdated: string; // e.g. "March 2026" or ISO date
}

// Changelog entry types
export type ChangelogUpdateType =
  | 'QUARTERLY_REFRESH'
  | 'PRICE_INCREASE'
  | 'NEW_DRUG'
  | 'NEW_BIOSIMILAR'
  | 'BIOSIMILAR_STATUS_CHANGE'
  | 'TRIAL_STATUS_CHANGE'
  | 'WEEKLY_REFRESH'
  | 'MONTHLY_CHECK'
  | 'PATENT_REFRESH'
  | 'IRA_PAGE_UPDATE'
  | 'IRA_UPDATE'
  | 'DATA_CORRECTION';

export interface ChangelogEntry {
  date: string;
  source: string;
  update_type: ChangelogUpdateType;
  drug_name: string;
  manufacturer: string;
  description: string;
  previous_value_cents: number | null;
  new_value_cents: number | null;
  pct_change: number | null;
  source_url: string | null;
}

// Data freshness tracking (ported from DrugTracker)
export type FreshnessLabel = 'Fresh' | 'Recent' | 'Stale' | 'Outdated' | 'Unknown';
export type FreshnessColor = 'green' | 'yellow' | 'orange' | 'red' | 'gray';

export interface FreshnessMetadata {
  data_year: number | null;
  data_quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4' | null;
  source: string;   // 'CMS_ASP', 'WAC_MONITOR', 'SEED', etc.
  ingested_at: string; // ISO date
}

export interface FreshnessResult {
  label: FreshnessLabel;
  color: FreshnessColor;
  quarters_old: number | null;
}

// App-specific computed types
export interface ManufacturerCardData {
  manufacturer_id: string;
  name: string;
  ticker: string;
  revenue: number;
  net_income: number;
  rd_spend: number;
  gross_margin: number;
  drugs: DrugCardData[];
  ceo_compensation: number;
}

export interface DrugCardData {
  drug_id: string;
  name: string;
  generic_name: string;
  specialty: string;
  year_approved: number;
  wac_monthly: number;
  wac_annual: number;
  cogs_estimate?: number;
  cogs_confidence?: 'high' | 'medium' | 'low';
  markup_percent?: number;
  asp?: number;
  indications: Indication[];
  price_history?: WacHistoryEntry;
  cogs_source_url?: string;
  cogs_source_label?: string;
}

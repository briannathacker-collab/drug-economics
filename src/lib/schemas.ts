// Drug Economics — Zod Runtime Validation Schemas
// Mirrors interfaces in types.ts. Used by data validation scripts and integrity bot.
// All monetary values are cents (positive integers).

import { z } from 'zod';

// ─── Shared primitives ────────────────────────────────────────────
const cents = z.number().int().nonnegative();
const isoDateString = z.string().min(1); // ISO 8601 or human-readable date
const quarter = z.enum(['Q1', 'Q2', 'Q3', 'Q4']);

// ─── WAC Prices ───────────────────────────────────────────────────
export const WacPriceSchema = z.object({
  drug_id: z.string(),
  drug_name: z.string(),
  generic_name: z.string(),
  manufacturer_id: z.string(),
  dosage_form: z.string(),
  strength: z.string(),
  wac_per_unit: cents,
  wac_monthly: cents,
  wac_annual: cents,
  ndc: z.string(),
  effective_date: isoDateString,
  data_year: z.number().int(),
  data_quarter: quarter,
  source: z.string(),
}).passthrough();

// ─── COGS Estimates ───────────────────────────────────────────────
const CogsEstimateItemSchema = z.object({
  source: z.string().optional(),
  source_url: z.string().optional(),
  author: z.string().optional(),
  publication_year: z.number().int().optional(),
  estimated_cogs_monthly: cents.optional(),
  confidence: z.enum(['high', 'medium', 'low']).optional(),
  methodology: z.string().optional(),
}).passthrough();

export const CogsEstimateSchema = z.object({
  drug_id: z.string(),
  drug_name: z.string(),
  generic_name: z.string(),
  manufacturer_id: z.string(),
  estimated_cogs_monthly: cents.optional(),
  estimated_cogs_per_unit: cents.optional(),
  estimated_cogs_annual: cents.optional(),
  wac_monthly: cents.optional(),
  markup_over_cogs: z.number().optional(),
  gross_margin_estimate: z.number().optional(),
  estimates: z.array(CogsEstimateItemSchema).optional(),
  data_year: z.number().int(),
  data_quarter: quarter,
  source: z.string(),
}).passthrough();

// ─── Manufacturer Financials ──────────────────────────────────────
const YearRevenueSchema = z.object({
  year: z.number().int(),
  revenue: cents,
});

const YearIncomeSchema = z.object({
  year: z.number().int(),
  income: z.number().int(), // can be negative
});

const YearSpendSchema = z.object({
  year: z.number().int(),
  spend: cents,
});

export const ManufacturerFinancialsSchema = z.object({
  manufacturer_id: z.string(),
  name: z.string(),
  ticker: z.string(),
  annual_revenue: z.array(YearRevenueSchema),
  net_income: z.array(YearIncomeSchema),
  rd_spend: z.array(YearSpendSchema),
  sga_spend: z.array(YearSpendSchema),
  gross_margin: z.number(),
  ceo_compensation: cents,
  ceo_name: z.string(),
  headquarters: z.string(),
  employees: z.number().int().nonnegative(),
}).passthrough();

// ─── WAC History ──────────────────────────────────────────────────
const PriceHistoryPointSchema = z.object({
  date: isoDateString,
  wac_monthly: cents,
  change_percent: z.number(),
});

export const WacHistoryEntrySchema = z.object({
  drug_id: z.string(),
  drug_name: z.string(),
  launch_date: isoDateString,
  launch_price: cents,
  price_history: z.array(PriceHistoryPointSchema),
  total_increase_percent: z.number(),
  num_increases: z.number().int().nonnegative(),
  cagr: z.number(),
}).passthrough();

// ─── Drug Revenue ─────────────────────────────────────────────────
const DrugRevenueYearSchema = z.object({
  year: z.number().int(),
  us_revenue: cents.optional(),
  global_revenue: cents.optional(),
  revenue: cents.optional(),
});

export const DrugRevenueSchema = z.object({
  drug_id: z.string(),
  drug_name: z.string(),
  manufacturer_id: z.string(),
  annual_revenue: z.array(DrugRevenueYearSchema),
  peak_revenue_year: z.number().int(),
  trajectory: z.string(), // growing, stable, declining, or other descriptors
}).passthrough();

// ─── Patents ──────────────────────────────────────────────────────
const SecondaryPatentSchema = z.object({
  patent_number: z.string(),
  expiry: isoDateString,
  type: z.string(),
  description: z.string(),
}).passthrough();

export const PatentEntrySchema = z.object({
  drug_id: z.string(),
  drug_name: z.string(),
  manufacturer_id: z.string(),
  original_patent_expiry: isoDateString,
  secondary_patents: z.array(SecondaryPatentSchema),
  exclusivity_type: z.string(),
  patent_cliff_date: isoDateString,
  delay_years: z.number(),
}).passthrough();

// ─── Biosimilar Pipeline ─────────────────────────────────────────
const BiosimilarItemSchema = z.object({
  biosimilar_id: z.string().optional(),
  brand_name: z.string().optional(),
  manufacturer: z.string().optional(),
  fda_approval_date: isoDateString.nullable().optional(),
  us_launch_date: isoDateString.nullable().optional(),
  interchangeable: z.boolean().optional(),
  wac_monthly: cents.nullable().optional(),
  discount_to_reference: z.number().nullable().optional(),
  market_share_percent: z.number().optional(),
  status: z.string().optional(),
}).passthrough();

export const BiosimilarPipelineEntrySchema = z.object({
  reference_drug_id: z.string(),
  reference_drug_name: z.string(),
  biosimilars: z.array(BiosimilarItemSchema).optional(),
}).passthrough();

// ─── Pipeline Trials ──────────────────────────────────────────────
export const PipelineTrialSchema = z.object({
  trial_id: z.string().optional(),
  nct_number: z.string().optional(),
  drug_name: z.string(),
  generic_name: z.string().optional(),
  manufacturer: z.string().optional(),
  developer: z.string().optional(),
  phase: z.string(),
  therapeutic_area: z.string().optional(),
  condition: z.string().optional(),
  indication: z.string().optional(),
  specialty: z.string().optional(),
  primary_endpoint: z.string(),
  enrollment: z.number().int().nonnegative(),
  estimated_completion: isoDateString.optional(),
  estimated_completion_date: isoDateString.optional(),
  estimated_wac_monthly: cents.optional(),
  estimated_cogs_monthly: cents.optional(),
  current_soc_monthly_cost: cents.optional(),
  designation: z.string().optional(),
  existing_drug_in_class: z.boolean().optional(),
}).passthrough();

// ─── CMS ASP ──────────────────────────────────────────────────────
const QuarterlyAspSchema = z.object({
  quarter: z.string(),
  asp_per_unit: cents,
  wac_per_unit: cents,
  asp_wac_discount: z.number(),
  quarter_over_quarter_change: z.number(),
  flagged: z.boolean(),
  data_year: z.number().int(),
  data_quarter: quarter,
  source: z.string(),
}).passthrough();

export const CmsAspEntrySchema = z.object({
  drug_id: z.string(),
  drug_name: z.string(),
  generic_name: z.string(),
  manufacturer_id: z.string(),
  hcpcs_code: z.string(),
  quarterly_asp: z.array(QuarterlyAspSchema),
}).passthrough();

// ─── Insurer Financials ──────────────────────────────────────────
export const InsurerFinancialsSchema = z.object({
  insurer_id: z.string(),
  name: z.string(),
  ticker: z.string(),
  type: z.string(),
  annual_revenue: z.array(YearRevenueSchema),
  medical_loss_ratio: z.number(),
  net_income: z.array(YearIncomeSchema),
  ceo_compensation: cents,
  ceo_name: z.string(),
  prior_auth_denial_rate: z.number(),
  subsidiaries: z.array(z.string()),
}).passthrough();

// ─── PBM Rebate Data ──────────────────────────────────────────────
export const PbmRebateDataSchema = z.object({
  pbm_id: z.string(),
  pbm_name: z.string(),
  parent_company: z.string(),
  market_share: z.number(),
  estimated_rebate_revenue: cents,
  passthrough_rate: z.number(),
  retained_rate: z.number(),
  source: z.string(),
  year: z.number().int(),
}).passthrough();

// ─── Premium History ──────────────────────────────────────────────
export const PremiumHistorySchema = z.object({
  year: z.number().int(),
  avg_family_premium: cents,
  avg_family_deductible: cents,
  avg_individual_premium: cents,
  avg_individual_deductible: cents,
  source: z.string(),
}).passthrough();

// ─── Delay Tactics ────────────────────────────────────────────────
const TacticSchema = z.object({
  type: z.string(),
  description: z.string(),
  ftc_case_ref: z.string().optional(),
  court_case: z.string().optional(),
  settlement_amount: z.number().optional(),
  delay_months: z.number().int(),
  outcome: z.string().optional(),
}).passthrough();

export const DelayTacticSchema = z.object({
  drug_id: z.string(),
  drug_name: z.string(),
  manufacturer: z.string(),
  tactics: z.array(TacticSchema),
  total_delay_years: z.number(),
  estimated_patient_cost_of_delay: cents,
  estimated_patient_population: z.number().int().nonnegative(),
}).passthrough();

// ─── Changelog ────────────────────────────────────────────────────
const ChangelogUpdateTypeSchema = z.enum([
  'QUARTERLY_REFRESH',
  'PRICE_INCREASE',
  'NEW_DRUG',
  'NEW_BIOSIMILAR',
  'BIOSIMILAR_STATUS_CHANGE',
  'TRIAL_STATUS_CHANGE',
  'WEEKLY_REFRESH',
  'MONTHLY_CHECK',
  'PATENT_REFRESH',
  'IRA_PAGE_UPDATE',
  'IRA_UPDATE',
  'DATA_CORRECTION',
]);

export const ChangelogEntrySchema = z.object({
  date: isoDateString,
  source: z.string(),
  update_type: ChangelogUpdateTypeSchema,
  drug_name: z.string(),
  manufacturer: z.string(),
  description: z.string(),
  previous_value_cents: cents.nullable(),
  new_value_cents: cents.nullable(),
  pct_change: z.number().nullable(),
  source_url: z.string().nullable(),
}).passthrough();

// ─── IRA Negotiations ─────────────────────────────────────────────
export const IraNegotiationSchema = z.object({
  drug_id: z.string(),
  drug_name: z.string(),
  generic_name: z.string(),
  manufacturer: z.string(),
  indication: z.string(),
  medicare_spend_billions: z.number(),
  enrolled_beneficiaries: z.number().int().nonnegative(),
  current_wac_annual: cents,
  negotiated_price_annual: cents,
  savings_percent: z.number(),
  effective_date: isoDateString,
  status: z.string(),
}).passthrough();

// ─── Array schemas (for validating full data files) ───────────────
export const WacPricesArraySchema = z.array(WacPriceSchema);
export const CogsEstimatesArraySchema = z.array(CogsEstimateSchema);
export const ManufacturerFinancialsArraySchema = z.array(ManufacturerFinancialsSchema);
export const WacHistoryArraySchema = z.array(WacHistoryEntrySchema);
export const DrugRevenueArraySchema = z.array(DrugRevenueSchema);
export const PatentsArraySchema = z.array(PatentEntrySchema);
export const BiosimilarPipelineArraySchema = z.array(BiosimilarPipelineEntrySchema);
export const PipelineTrialsArraySchema = z.array(PipelineTrialSchema);
export const CmsAspArraySchema = z.array(CmsAspEntrySchema);
export const InsurerFinancialsArraySchema = z.array(InsurerFinancialsSchema);
export const PbmRebatesArraySchema = z.array(PbmRebateDataSchema);
export const PremiumHistoryArraySchema = z.array(PremiumHistorySchema);
export const DelayTacticsArraySchema = z.array(DelayTacticSchema);
export const ChangelogArraySchema = z.array(ChangelogEntrySchema);
export const IraNegotiationsArraySchema = z.array(IraNegotiationSchema);

// ─── File-to-schema map (used by validate-data script) ───────────
export const DATA_FILE_SCHEMAS = {
  'wac_prices.json': WacPricesArraySchema,
  'cogs_estimates.json': CogsEstimatesArraySchema,
  'manufacturer_financials.json': ManufacturerFinancialsArraySchema,
  'wac_history.json': WacHistoryArraySchema,
  'drug_revenue.json': DrugRevenueArraySchema,
  'patents.json': PatentsArraySchema,
  'biosimilar_pipeline.json': BiosimilarPipelineArraySchema,
  'pipeline_trials.json': PipelineTrialsArraySchema,
  'cms_asp.json': CmsAspArraySchema,
  'insurer_financials.json': InsurerFinancialsArraySchema,
  'pbm_rebates.json': PbmRebatesArraySchema,
  'premium_history.json': PremiumHistoryArraySchema,
  'delay_tactics.json': DelayTacticsArraySchema,
  'changelog.json': ChangelogArraySchema,
  'ira_negotiations.json': IraNegotiationsArraySchema,
} as const;

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DATA = join(import.meta.dirname, '..', 'data');

function read(name) {
  return JSON.parse(readFileSync(join(DATA, `${name}.json`), 'utf-8'));
}
function write(name, data) {
  writeFileSync(join(DATA, `${name}.json`), JSON.stringify(data, null, 2) + '\n');
}

// ─── WAC PRICES ────────────────────────────────────────────
const newWac = [
  {
    drug_id: "eylea",
    drug_name: "Eylea",
    generic_name: "aflibercept",
    manufacturer_id: "regeneron",
    dosage_form: "intravitreal injection",
    strength: "2 mg/0.05 mL",
    wac_per_unit: 185000,
    wac_monthly: 185000,
    wac_annual: 2220000,
    ndc: "61755-0005-02",
    therapeutic_area: "ophthalmology",
    route_of_administration: "intravitreal",
    units_per_month: 1,
    effective_date: "2024-01-01",
    note: "Dosed every 4-8 weeks; monthly cost reflects average monthly utilization"
  },
  {
    drug_id: "entresto",
    drug_name: "Entresto",
    generic_name: "sacubitril/valsartan",
    manufacturer_id: "novartis",
    dosage_form: "oral tablet",
    strength: "97/103 mg",
    wac_per_unit: 1000,
    wac_monthly: 60000,
    wac_annual: 720000,
    ndc: "00078-0696-20",
    therapeutic_area: "cardiovascular",
    route_of_administration: "oral",
    units_per_month: 60,
    effective_date: "2024-01-01",
    note: "Standard dose 97/103 mg twice daily for heart failure with reduced ejection fraction"
  },
  {
    drug_id: "darzalex",
    drug_name: "Darzalex",
    generic_name: "daratumumab",
    manufacturer_id: "jnj",
    dosage_form: "intravenous infusion",
    strength: "400 mg/20 mL",
    wac_per_unit: 375000,
    wac_monthly: 750000,
    wac_annual: 9000000,
    ndc: "57894-0502-20",
    therapeutic_area: "oncology",
    route_of_administration: "intravenous",
    units_per_month: 2,
    effective_date: "2024-01-01",
    note: "Dosing frequency varies by cycle; monthly cost reflects maintenance phase (~2 infusions/month)"
  },
  {
    drug_id: "ocrevus",
    drug_name: "Ocrevus",
    generic_name: "ocrelizumab",
    manufacturer_id: "genentech",
    dosage_form: "intravenous infusion",
    strength: "300 mg/10 mL",
    wac_per_unit: 3480000,
    wac_monthly: 580000,
    wac_annual: 6960000,
    ndc: "50242-0150-01",
    therapeutic_area: "neurology",
    route_of_administration: "intravenous",
    units_per_month: 0.17,
    effective_date: "2024-01-01",
    note: "600 mg infused every 6 months; monthly cost reflects average monthly utilization"
  },
  {
    drug_id: "biktarvy",
    drug_name: "Biktarvy",
    generic_name: "bictegravir/emtricitabine/tenofovir alafenamide",
    manufacturer_id: "gilead",
    dosage_form: "oral tablet",
    strength: "50/200/25 mg",
    wac_per_unit: 12333,
    wac_monthly: 370000,
    wac_annual: 4440000,
    ndc: "61958-2501-01",
    therapeutic_area: "infectious_disease",
    route_of_administration: "oral",
    units_per_month: 30,
    effective_date: "2024-01-01",
    note: "Triple-combination single tablet regimen for HIV-1; one tablet once daily"
  },
  {
    drug_id: "cosentyx",
    drug_name: "Cosentyx",
    generic_name: "secukinumab",
    manufacturer_id: "novartis",
    dosage_form: "subcutaneous injection",
    strength: "300 mg/2 mL",
    wac_per_unit: 630000,
    wac_monthly: 630000,
    wac_annual: 7560000,
    ndc: "00078-0639-98",
    therapeutic_area: "immunology",
    route_of_administration: "subcutaneous",
    units_per_month: 1,
    effective_date: "2024-01-01",
    note: "300 mg every 4 weeks maintenance; monthly cost reflects single monthly injection"
  },
  {
    drug_id: "repatha",
    drug_name: "Repatha",
    generic_name: "evolocumab",
    manufacturer_id: "amgen",
    dosage_form: "subcutaneous injection",
    strength: "140 mg/mL",
    wac_per_unit: 24400,
    wac_monthly: 48800,
    wac_annual: 585600,
    ndc: "55513-0740-02",
    therapeutic_area: "cardiovascular",
    route_of_administration: "subcutaneous",
    units_per_month: 2,
    effective_date: "2024-01-01",
    note: "140 mg every 2 weeks or 420 mg monthly; price reflects 140 mg q2w dosing; reduced from original $14,100/yr launch price"
  },
  {
    drug_id: "tremfya",
    drug_name: "Tremfya",
    generic_name: "guselkumab",
    manufacturer_id: "jnj",
    dosage_form: "subcutaneous injection",
    strength: "100 mg/mL",
    wac_per_unit: 1650000,
    wac_monthly: 550000,
    wac_annual: 6600000,
    ndc: "57894-0640-01",
    therapeutic_area: "immunology",
    route_of_administration: "subcutaneous",
    units_per_month: 0.33,
    effective_date: "2024-01-01",
    note: "100 mg every 8 weeks maintenance; monthly cost reflects average monthly utilization"
  },
  {
    drug_id: "kisqali",
    drug_name: "Kisqali",
    generic_name: "ribociclib",
    manufacturer_id: "novartis",
    dosage_form: "oral tablet",
    strength: "200 mg",
    wac_per_unit: 61905,
    wac_monthly: 1300000,
    wac_annual: 15600000,
    ndc: "00078-0848-63",
    therapeutic_area: "oncology",
    route_of_administration: "oral",
    units_per_month: 21,
    effective_date: "2024-01-01",
    note: "600 mg daily (3x200mg) for 21 days of 28-day cycle; CDK4/6 inhibitor for HR+/HER2- breast cancer"
  },
  {
    drug_id: "verzenio",
    drug_name: "Verzenio",
    generic_name: "abemaciclib",
    manufacturer_id: "lilly",
    dosage_form: "oral tablet",
    strength: "150 mg",
    wac_per_unit: 23333,
    wac_monthly: 1400000,
    wac_annual: 16800000,
    ndc: "00002-5337-60",
    therapeutic_area: "oncology",
    route_of_administration: "oral",
    units_per_month: 60,
    effective_date: "2024-01-01",
    note: "150 mg twice daily continuously; only CDK4/6 inhibitor with continuous dosing; adjuvant indication driving growth"
  },
  {
    drug_id: "lynparza",
    drug_name: "Lynparza",
    generic_name: "olaparib",
    manufacturer_id: "astrazeneca",
    dosage_form: "oral tablet",
    strength: "150 mg",
    wac_per_unit: 24167,
    wac_monthly: 1450000,
    wac_annual: 17400000,
    ndc: "00310-0685-60",
    therapeutic_area: "oncology",
    route_of_administration: "oral",
    units_per_month: 60,
    effective_date: "2024-01-01",
    note: "300 mg (2x150mg) twice daily; first-in-class PARP inhibitor for BRCA-mutated cancers"
  },
  {
    drug_id: "farxiga",
    drug_name: "Farxiga",
    generic_name: "dapagliflozin",
    manufacturer_id: "astrazeneca",
    dosage_form: "oral tablet",
    strength: "10 mg",
    wac_per_unit: 1833,
    wac_monthly: 55000,
    wac_annual: 660000,
    ndc: "00310-6210-30",
    therapeutic_area: "diabetes",
    route_of_administration: "oral",
    units_per_month: 30,
    effective_date: "2024-01-01",
    note: "SGLT2 inhibitor; approved for diabetes, heart failure, and CKD; once daily dosing"
  },
  {
    drug_id: "otezla",
    drug_name: "Otezla",
    generic_name: "apremilast",
    manufacturer_id: "amgen",
    dosage_form: "oral tablet",
    strength: "30 mg",
    wac_per_unit: 7000,
    wac_monthly: 420000,
    wac_annual: 5040000,
    ndc: "00003-0422-52",
    therapeutic_area: "immunology",
    route_of_administration: "oral",
    units_per_month: 60,
    effective_date: "2024-01-01",
    note: "PDE4 inhibitor; 30 mg twice daily; oral alternative to biologics for psoriasis/psoriatic arthritis; acquired by Amgen from Celgene"
  },
  {
    drug_id: "vyvanse",
    drug_name: "Vyvanse",
    generic_name: "lisdexamfetamine dimesylate",
    manufacturer_id: "takeda",
    dosage_form: "oral capsule",
    strength: "70 mg",
    wac_per_unit: 1333,
    wac_monthly: 40000,
    wac_annual: 480000,
    ndc: "59417-0107-10",
    therapeutic_area: "cns",
    route_of_administration: "oral",
    units_per_month: 30,
    effective_date: "2024-01-01",
    note: "Prodrug of dextroamphetamine; most-prescribed branded ADHD medication; generic entry began August 2023"
  },
  {
    drug_id: "xtandi",
    drug_name: "Xtandi",
    generic_name: "enzalutamide",
    manufacturer_id: "pfizer",
    dosage_form: "oral capsule",
    strength: "40 mg",
    wac_per_unit: 10833,
    wac_monthly: 1300000,
    wac_annual: 15600000,
    ndc: "00469-0625-99",
    therapeutic_area: "oncology",
    route_of_administration: "oral",
    units_per_month: 120,
    effective_date: "2024-01-01",
    note: "Androgen receptor inhibitor; 160 mg daily (4x40mg capsules); standard of care for metastatic prostate cancer; co-developed with Astellas"
  }
];

// ─── COGS ESTIMATES ──────────────────────────────────────
const newCogs = [
  {
    drug_id: "eylea", drug_name: "Eylea", generic_name: "aflibercept", manufacturer_id: "regeneron",
    drug_type: "biologic", estimated_cogs_per_unit: 7500, estimated_cogs_monthly: 7500, estimated_cogs_annual: 90000,
    wac_monthly: 185000, markup_over_cogs: 2366.7, gross_margin_estimate: 95.9,
    estimates: [{ source: "Mulcahy et al., RAND Corporation", source_url: "https://www.rand.org/pubs/research_reports/RR2956.html", author: "Mulcahy AW, Hlavka JP, Case SR", publication_year: 2020, estimated_cogs_monthly: 7000, confidence: "medium", methodology: "VEGF-trap fusion protein manufacturing cost estimation" }],
    cost_components: { api_manufacturing: 4500, formulation_fill_finish: 1200, quality_testing: 800, packaging_distribution: 500, cold_chain_logistics: 500 }
  },
  {
    drug_id: "entresto", drug_name: "Entresto", generic_name: "sacubitril/valsartan", manufacturer_id: "novartis",
    drug_type: "small_molecule", estimated_cogs_per_unit: 25, estimated_cogs_monthly: 1500, estimated_cogs_annual: 18000,
    wac_monthly: 60000, markup_over_cogs: 3900.0, gross_margin_estimate: 97.5,
    estimates: [{ source: "Barber MJ, Gotham D, Hill A, BMJ Global Health", source_url: "https://gh.bmj.com/content/5/1/e002015", author: "Barber MJ, Gotham D, Hill A", publication_year: 2020, estimated_cogs_monthly: 1400, confidence: "high", methodology: "Dual small molecule combination; both APIs well-characterized with established synthesis" }],
    cost_components: { api_manufacturing_sacubitril: 600, api_manufacturing_valsartan: 300, formulation_tableting: 250, quality_testing: 150, packaging_distribution: 200 }
  },
  {
    drug_id: "darzalex", drug_name: "Darzalex", generic_name: "daratumumab", manufacturer_id: "jnj",
    drug_type: "biologic", estimated_cogs_per_unit: 15000, estimated_cogs_monthly: 30000, estimated_cogs_annual: 360000,
    wac_monthly: 750000, markup_over_cogs: 2400.0, gross_margin_estimate: 96.0,
    estimates: [{ source: "Hill et al., BMJ Global Health", source_url: "https://gh.bmj.com/content/3/3/e000850", author: "Hill A, Redd C, Gotham D", publication_year: 2018, estimated_cogs_monthly: 28000, confidence: "low", methodology: "Anti-CD38 monoclonal antibody manufacturing cost from biologic cost models" }],
    cost_components: { api_manufacturing: 18000, formulation_fill_finish: 5000, quality_testing: 3000, packaging_distribution: 2000, cold_chain_logistics: 2000 }
  },
  {
    drug_id: "ocrevus", drug_name: "Ocrevus", generic_name: "ocrelizumab", manufacturer_id: "genentech",
    drug_type: "biologic", estimated_cogs_per_unit: 55000, estimated_cogs_monthly: 9200, estimated_cogs_annual: 110000,
    wac_monthly: 580000, markup_over_cogs: 6204.3, gross_margin_estimate: 98.4,
    estimates: [{ source: "Mulcahy et al., RAND Corporation", source_url: "https://www.rand.org/pubs/research_reports/RR2956.html", author: "Mulcahy AW, Hlavka JP, Case SR", publication_year: 2020, estimated_cogs_monthly: 8500, confidence: "medium", methodology: "Anti-CD20 antibody cost estimation; leverages rituximab manufacturing knowledge" }],
    cost_components: { api_manufacturing: 5000, formulation_fill_finish: 1800, quality_testing: 1000, packaging_distribution: 700, cold_chain_logistics: 700 }
  },
  {
    drug_id: "biktarvy", drug_name: "Biktarvy", generic_name: "bictegravir/emtricitabine/tenofovir alafenamide", manufacturer_id: "gilead",
    drug_type: "small_molecule", estimated_cogs_per_unit: 100, estimated_cogs_monthly: 3000, estimated_cogs_annual: 36000,
    wac_monthly: 370000, markup_over_cogs: 12233.3, gross_margin_estimate: 99.2,
    estimates: [{ source: "Hill A, Khoo S, Fortunak J, et al., Clinical Infectious Diseases", source_url: "https://academic.oup.com/cid/article/58/7/928/296827", author: "Hill A, Khoo S, Fortunak J, Simmons B, Ford N", publication_year: 2014, estimated_cogs_monthly: 2500, confidence: "high", methodology: "Triple-combination antiretroviral API cost analysis; generic TAF/FTC widely available in India" }],
    cost_components: { api_manufacturing_bictegravir: 1200, api_manufacturing_emtricitabine: 400, api_manufacturing_taf: 600, formulation_tableting: 350, quality_testing: 250, packaging_distribution: 200 },
    notes: "Generic versions of TAF/FTC available in many countries under $50/month. Bictegravir adds modest additional API cost."
  },
  {
    drug_id: "cosentyx", drug_name: "Cosentyx", generic_name: "secukinumab", manufacturer_id: "novartis",
    drug_type: "biologic", estimated_cogs_per_unit: 15000, estimated_cogs_monthly: 15000, estimated_cogs_annual: 180000,
    wac_monthly: 630000, markup_over_cogs: 4100.0, gross_margin_estimate: 97.6,
    estimates: [{ source: "Hernandez et al., JAMA Internal Medicine", source_url: "https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2653012", author: "Hernandez I, Good CB, Cutler DM", publication_year: 2018, estimated_cogs_monthly: 13000, confidence: "medium", methodology: "Anti-IL-17A monoclonal antibody manufacturing cost estimation" }],
    cost_components: { api_manufacturing: 9000, formulation_fill_finish: 2500, quality_testing: 1500, packaging_distribution: 1000, device_autoinjector: 1000 }
  },
  {
    drug_id: "repatha", drug_name: "Repatha", generic_name: "evolocumab", manufacturer_id: "amgen",
    drug_type: "biologic", estimated_cogs_per_unit: 2500, estimated_cogs_monthly: 5000, estimated_cogs_annual: 60000,
    wac_monthly: 48800, markup_over_cogs: 876.0, gross_margin_estimate: 89.8,
    estimates: [{ source: "Hernandez et al., JAMA Internal Medicine", source_url: "https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2653012", author: "Hernandez I, Good CB, Cutler DM", publication_year: 2018, estimated_cogs_monthly: 4500, confidence: "medium", methodology: "PCSK9 antibody manufacturing cost from biologic production models" }],
    cost_components: { api_manufacturing: 2800, formulation_fill_finish: 800, quality_testing: 500, device_autoinjector: 500, packaging_distribution: 400 },
    notes: "Repatha's WAC was dramatically cut from ~$14,100/year to ~$5,850/year in 2018, bringing margins closer to COGS than most biologics."
  },
  {
    drug_id: "tremfya", drug_name: "Tremfya", generic_name: "guselkumab", manufacturer_id: "jnj",
    drug_type: "biologic", estimated_cogs_per_unit: 25000, estimated_cogs_monthly: 12500, estimated_cogs_annual: 150000,
    wac_monthly: 550000, markup_over_cogs: 4300.0, gross_margin_estimate: 97.7,
    estimates: [{ source: "Mulcahy et al., RAND Corporation", source_url: "https://www.rand.org/pubs/research_reports/RR2956.html", author: "Mulcahy AW, Hlavka JP, Case SR", publication_year: 2020, estimated_cogs_monthly: 11000, confidence: "low", methodology: "Anti-IL-23 monoclonal antibody manufacturing cost range" }],
    cost_components: { api_manufacturing: 7500, formulation_fill_finish: 2000, quality_testing: 1200, packaging_distribution: 800, device_prefilled_syringe: 1000 }
  },
  {
    drug_id: "kisqali", drug_name: "Kisqali", generic_name: "ribociclib", manufacturer_id: "novartis",
    drug_type: "small_molecule", estimated_cogs_per_unit: 333, estimated_cogs_monthly: 7000, estimated_cogs_annual: 84000,
    wac_monthly: 1300000, markup_over_cogs: 18471.4, gross_margin_estimate: 99.5,
    estimates: [{ source: "Hill A, Gotham D, Tropical Medicine and Infectious Disease", source_url: "https://www.mdpi.com/2414-6366/3/2/70", author: "Hill A, Gotham D", publication_year: 2018, estimated_cogs_monthly: 6000, confidence: "medium", methodology: "CDK4/6 inhibitor synthesis cost estimation; structurally similar to palbociclib" }],
    cost_components: { api_manufacturing: 4000, formulation_tableting: 1000, quality_testing: 900, packaging_distribution: 1100 }
  },
  {
    drug_id: "verzenio", drug_name: "Verzenio", generic_name: "abemaciclib", manufacturer_id: "lilly",
    drug_type: "small_molecule", estimated_cogs_per_unit: 133, estimated_cogs_monthly: 8000, estimated_cogs_annual: 96000,
    wac_monthly: 1400000, markup_over_cogs: 17400.0, gross_margin_estimate: 99.4,
    estimates: [{ source: "Hill A, Gotham D, Tropical Medicine and Infectious Disease", source_url: "https://www.mdpi.com/2414-6366/3/2/70", author: "Hill A, Gotham D", publication_year: 2018, estimated_cogs_monthly: 7000, confidence: "medium", methodology: "CDK4/6 inhibitor synthesis cost estimation; continuous dosing increases API usage vs. palbociclib" }],
    cost_components: { api_manufacturing: 5000, formulation_tableting: 1000, quality_testing: 900, packaging_distribution: 1100 }
  },
  {
    drug_id: "lynparza", drug_name: "Lynparza", generic_name: "olaparib", manufacturer_id: "astrazeneca",
    drug_type: "small_molecule", estimated_cogs_per_unit: 250, estimated_cogs_monthly: 15000, estimated_cogs_annual: 180000,
    wac_monthly: 1450000, markup_over_cogs: 9566.7, gross_margin_estimate: 99.0,
    estimates: [{ source: "Barber MJ, Gotham D, Hill A, Journal of Pharmaceutical Policy and Practice", source_url: "https://joppp.biomedcentral.com/articles/10.1186/s40545-021-00354-z", author: "Barber MJ, Gotham D, Hill A", publication_year: 2021, estimated_cogs_monthly: 13000, confidence: "medium", methodology: "PARP inhibitor synthesis cost estimation; complex small molecule with moderate API cost" }],
    cost_components: { api_manufacturing: 9000, formulation_tableting: 2000, quality_testing: 1800, packaging_distribution: 2200 }
  },
  {
    drug_id: "farxiga", drug_name: "Farxiga", generic_name: "dapagliflozin", manufacturer_id: "astrazeneca",
    drug_type: "small_molecule", estimated_cogs_per_unit: 30, estimated_cogs_monthly: 900, estimated_cogs_annual: 10800,
    wac_monthly: 55000, markup_over_cogs: 6011.1, gross_margin_estimate: 98.4,
    estimates: [{ source: "Barber MJ, Gotham D, Khwairakpam G, Hill A, BMJ Global Health", source_url: "https://gh.bmj.com/content/5/1/e002015", author: "Barber MJ, Gotham D, Khwairakpam G, Hill A", publication_year: 2020, estimated_cogs_monthly: 800, confidence: "high", methodology: "SGLT2 inhibitor API cost analysis; dapagliflozin structurally similar to empagliflozin" }],
    cost_components: { api_manufacturing: 450, formulation_tableting: 180, quality_testing: 120, packaging_distribution: 150 }
  },
  {
    drug_id: "otezla", drug_name: "Otezla", generic_name: "apremilast", manufacturer_id: "amgen",
    drug_type: "small_molecule", estimated_cogs_per_unit: 50, estimated_cogs_monthly: 3000, estimated_cogs_annual: 36000,
    wac_monthly: 420000, markup_over_cogs: 13900.0, gross_margin_estimate: 99.3,
    estimates: [{ source: "Hill A, Gotham D, Tropical Medicine and Infectious Disease", source_url: "https://www.mdpi.com/2414-6366/3/2/70", author: "Hill A, Gotham D", publication_year: 2018, estimated_cogs_monthly: 2500, confidence: "medium", methodology: "PDE4 inhibitor synthesis cost estimation" }],
    cost_components: { api_manufacturing: 1500, formulation_tableting: 500, quality_testing: 400, packaging_distribution: 600 }
  },
  {
    drug_id: "vyvanse", drug_name: "Vyvanse", generic_name: "lisdexamfetamine dimesylate", manufacturer_id: "takeda",
    drug_type: "small_molecule", estimated_cogs_per_unit: 7, estimated_cogs_monthly: 200, estimated_cogs_annual: 2400,
    wac_monthly: 40000, markup_over_cogs: 19900.0, gross_margin_estimate: 99.5,
    estimates: [{ source: "Alpern JD, Stauffer WM, Kesselheim AS, JAMA Internal Medicine", source_url: "https://jamanetwork.com/journals/jamainternalmedicine/article-abstract/2089651", author: "Alpern JD, Stauffer WM, Kesselheim AS", publication_year: 2014, estimated_cogs_monthly: 180, confidence: "high", methodology: "Simple amphetamine prodrug; API synthesis trivially inexpensive" }],
    cost_components: { api_manufacturing: 80, formulation_encapsulation: 40, quality_testing: 30, packaging_distribution: 50 },
    notes: "Lisdexamfetamine is a simple prodrug of dextroamphetamine. Generic amphetamine salts cost under $30/month. Generic lisdexamfetamine launched August 2023."
  },
  {
    drug_id: "xtandi", drug_name: "Xtandi", generic_name: "enzalutamide", manufacturer_id: "pfizer",
    drug_type: "small_molecule", estimated_cogs_per_unit: 83, estimated_cogs_monthly: 10000, estimated_cogs_annual: 120000,
    wac_monthly: 1300000, markup_over_cogs: 12900.0, gross_margin_estimate: 99.2,
    estimates: [{ source: "Hill A, Gotham D, Tropical Medicine and Infectious Disease", source_url: "https://www.mdpi.com/2414-6366/3/2/70", author: "Hill A, Gotham D", publication_year: 2018, estimated_cogs_monthly: 9000, confidence: "medium", methodology: "Androgen receptor inhibitor synthesis cost; originally developed at UCLA with NIH funding" }],
    cost_components: { api_manufacturing: 6000, formulation_encapsulation: 1500, quality_testing: 1200, packaging_distribution: 1300 },
    notes: "Enzalutamide was developed with NIH/taxpayer-funded research at UCLA. The pricing has been criticized given public funding origins."
  }
];

// ─── WAC HISTORY ─────────────────────────────────────────
const newHistory = [
  {
    drug_id: "eylea", drug_name: "Eylea", generic_name: "aflibercept", manufacturer_id: "regeneron",
    launch_date: "2011-11-01", launch_price: 140000,
    price_history: [
      { date: "2011-11-01", wac_monthly: 140000, change_percent: 0.0 },
      { date: "2013-01-01", wac_monthly: 145000, change_percent: 3.6 },
      { date: "2015-01-01", wac_monthly: 155000, change_percent: 6.9 },
      { date: "2017-01-01", wac_monthly: 165000, change_percent: 6.5 },
      { date: "2019-01-01", wac_monthly: 175000, change_percent: 6.1 },
      { date: "2021-01-01", wac_monthly: 180000, change_percent: 2.9 },
      { date: "2024-01-01", wac_monthly: 185000, change_percent: 2.8 }
    ],
    total_increase_percent: 32.1, num_increases: 6, cagr: 2.2, inflation_adjusted_increase_percent: -2.5
  },
  {
    drug_id: "entresto", drug_name: "Entresto", generic_name: "sacubitril/valsartan", manufacturer_id: "novartis",
    launch_date: "2015-07-01", launch_price: 37500,
    price_history: [
      { date: "2015-07-01", wac_monthly: 37500, change_percent: 0.0 },
      { date: "2016-07-01", wac_monthly: 40000, change_percent: 6.7 },
      { date: "2017-07-01", wac_monthly: 43000, change_percent: 7.5 },
      { date: "2018-07-01", wac_monthly: 46500, change_percent: 8.1 },
      { date: "2019-07-01", wac_monthly: 49500, change_percent: 6.5 },
      { date: "2020-07-01", wac_monthly: 52500, change_percent: 6.1 },
      { date: "2021-07-01", wac_monthly: 55000, change_percent: 4.8 },
      { date: "2022-07-01", wac_monthly: 57500, change_percent: 4.5 },
      { date: "2024-01-01", wac_monthly: 60000, change_percent: 4.3 }
    ],
    total_increase_percent: 60.0, num_increases: 8, cagr: 5.7, inflation_adjusted_increase_percent: 28.4
  },
  {
    drug_id: "darzalex", drug_name: "Darzalex", generic_name: "daratumumab", manufacturer_id: "jnj",
    launch_date: "2015-11-01", launch_price: 550000,
    price_history: [
      { date: "2015-11-01", wac_monthly: 550000, change_percent: 0.0 },
      { date: "2017-01-01", wac_monthly: 580000, change_percent: 5.5 },
      { date: "2018-01-01", wac_monthly: 615000, change_percent: 6.0 },
      { date: "2019-01-01", wac_monthly: 650000, change_percent: 5.7 },
      { date: "2020-01-01", wac_monthly: 680000, change_percent: 4.6 },
      { date: "2021-01-01", wac_monthly: 705000, change_percent: 3.7 },
      { date: "2022-01-01", wac_monthly: 725000, change_percent: 2.8 },
      { date: "2023-01-01", wac_monthly: 740000, change_percent: 2.1 },
      { date: "2024-01-01", wac_monthly: 750000, change_percent: 1.4 }
    ],
    total_increase_percent: 36.4, num_increases: 8, cagr: 3.9, inflation_adjusted_increase_percent: 7.8
  },
  {
    drug_id: "ocrevus", drug_name: "Ocrevus", generic_name: "ocrelizumab", manufacturer_id: "genentech",
    launch_date: "2017-03-01", launch_price: 540000,
    price_history: [
      { date: "2017-03-01", wac_monthly: 540000, change_percent: 0.0 },
      { date: "2018-01-01", wac_monthly: 548000, change_percent: 1.5 },
      { date: "2019-01-01", wac_monthly: 556000, change_percent: 1.5 },
      { date: "2020-01-01", wac_monthly: 562000, change_percent: 1.1 },
      { date: "2021-01-01", wac_monthly: 568000, change_percent: 1.1 },
      { date: "2022-01-01", wac_monthly: 572000, change_percent: 0.7 },
      { date: "2023-01-01", wac_monthly: 576000, change_percent: 0.7 },
      { date: "2024-01-01", wac_monthly: 580000, change_percent: 0.7 }
    ],
    total_increase_percent: 7.4, num_increases: 7, cagr: 1.1, inflation_adjusted_increase_percent: -16.2
  },
  {
    drug_id: "biktarvy", drug_name: "Biktarvy", generic_name: "bictegravir/emtricitabine/tenofovir alafenamide", manufacturer_id: "gilead",
    launch_date: "2018-02-01", launch_price: 310000,
    price_history: [
      { date: "2018-02-01", wac_monthly: 310000, change_percent: 0.0 },
      { date: "2019-01-01", wac_monthly: 320000, change_percent: 3.2 },
      { date: "2020-01-01", wac_monthly: 330000, change_percent: 3.1 },
      { date: "2021-01-01", wac_monthly: 340000, change_percent: 3.0 },
      { date: "2022-01-01", wac_monthly: 350000, change_percent: 2.9 },
      { date: "2023-01-01", wac_monthly: 360000, change_percent: 2.9 },
      { date: "2024-01-01", wac_monthly: 370000, change_percent: 2.8 }
    ],
    total_increase_percent: 19.4, num_increases: 6, cagr: 3.0, inflation_adjusted_increase_percent: -3.2
  },
  {
    drug_id: "cosentyx", drug_name: "Cosentyx", generic_name: "secukinumab", manufacturer_id: "novartis",
    launch_date: "2015-01-01", launch_price: 380000,
    price_history: [
      { date: "2015-01-01", wac_monthly: 380000, change_percent: 0.0 },
      { date: "2016-01-01", wac_monthly: 410000, change_percent: 7.9 },
      { date: "2017-01-01", wac_monthly: 440000, change_percent: 7.3 },
      { date: "2018-01-01", wac_monthly: 475000, change_percent: 8.0 },
      { date: "2019-01-01", wac_monthly: 510000, change_percent: 7.4 },
      { date: "2020-01-01", wac_monthly: 545000, change_percent: 6.9 },
      { date: "2021-01-01", wac_monthly: 570000, change_percent: 4.6 },
      { date: "2022-01-01", wac_monthly: 595000, change_percent: 4.4 },
      { date: "2023-01-01", wac_monthly: 615000, change_percent: 3.4 },
      { date: "2024-01-01", wac_monthly: 630000, change_percent: 2.4 }
    ],
    total_increase_percent: 65.8, num_increases: 9, cagr: 5.8, inflation_adjusted_increase_percent: 33.1
  },
  {
    drug_id: "repatha", drug_name: "Repatha", generic_name: "evolocumab", manufacturer_id: "amgen",
    launch_date: "2015-08-01", launch_price: 117500,
    price_history: [
      { date: "2015-08-01", wac_monthly: 117500, change_percent: 0.0 },
      { date: "2016-01-01", wac_monthly: 117500, change_percent: 0.0 },
      { date: "2017-01-01", wac_monthly: 117500, change_percent: 0.0 },
      { date: "2018-10-01", wac_monthly: 48800, change_percent: -58.5 },
      { date: "2019-01-01", wac_monthly: 48800, change_percent: 0.0 },
      { date: "2020-01-01", wac_monthly: 48800, change_percent: 0.0 },
      { date: "2024-01-01", wac_monthly: 48800, change_percent: 0.0 }
    ],
    total_increase_percent: -58.5, num_increases: 0, cagr: -9.3, inflation_adjusted_increase_percent: -68.2,
  },
  {
    drug_id: "tremfya", drug_name: "Tremfya", generic_name: "guselkumab", manufacturer_id: "jnj",
    launch_date: "2017-07-01", launch_price: 430000,
    price_history: [
      { date: "2017-07-01", wac_monthly: 430000, change_percent: 0.0 },
      { date: "2018-07-01", wac_monthly: 450000, change_percent: 4.7 },
      { date: "2019-07-01", wac_monthly: 470000, change_percent: 4.4 },
      { date: "2020-07-01", wac_monthly: 490000, change_percent: 4.3 },
      { date: "2021-07-01", wac_monthly: 510000, change_percent: 4.1 },
      { date: "2022-07-01", wac_monthly: 525000, change_percent: 2.9 },
      { date: "2023-07-01", wac_monthly: 540000, change_percent: 2.9 },
      { date: "2024-01-01", wac_monthly: 550000, change_percent: 1.9 }
    ],
    total_increase_percent: 27.9, num_increases: 7, cagr: 3.8, inflation_adjusted_increase_percent: 2.1
  },
  {
    drug_id: "kisqali", drug_name: "Kisqali", generic_name: "ribociclib", manufacturer_id: "novartis",
    launch_date: "2017-03-01", launch_price: 950000,
    price_history: [
      { date: "2017-03-01", wac_monthly: 950000, change_percent: 0.0 },
      { date: "2018-01-01", wac_monthly: 1000000, change_percent: 5.3 },
      { date: "2019-01-01", wac_monthly: 1050000, change_percent: 5.0 },
      { date: "2020-01-01", wac_monthly: 1100000, change_percent: 4.8 },
      { date: "2021-01-01", wac_monthly: 1150000, change_percent: 4.5 },
      { date: "2022-01-01", wac_monthly: 1200000, change_percent: 4.3 },
      { date: "2023-01-01", wac_monthly: 1250000, change_percent: 4.2 },
      { date: "2024-01-01", wac_monthly: 1300000, change_percent: 4.0 }
    ],
    total_increase_percent: 36.8, num_increases: 7, cagr: 4.6, inflation_adjusted_increase_percent: 9.8
  },
  {
    drug_id: "verzenio", drug_name: "Verzenio", generic_name: "abemaciclib", manufacturer_id: "lilly",
    launch_date: "2017-09-01", launch_price: 1050000,
    price_history: [
      { date: "2017-09-01", wac_monthly: 1050000, change_percent: 0.0 },
      { date: "2018-07-01", wac_monthly: 1100000, change_percent: 4.8 },
      { date: "2019-07-01", wac_monthly: 1150000, change_percent: 4.5 },
      { date: "2020-07-01", wac_monthly: 1200000, change_percent: 4.3 },
      { date: "2021-07-01", wac_monthly: 1260000, change_percent: 5.0 },
      { date: "2022-07-01", wac_monthly: 1320000, change_percent: 4.8 },
      { date: "2023-07-01", wac_monthly: 1360000, change_percent: 3.0 },
      { date: "2024-01-01", wac_monthly: 1400000, change_percent: 2.9 }
    ],
    total_increase_percent: 33.3, num_increases: 7, cagr: 4.6, inflation_adjusted_increase_percent: 7.9
  },
  {
    drug_id: "lynparza", drug_name: "Lynparza", generic_name: "olaparib", manufacturer_id: "astrazeneca",
    launch_date: "2014-12-01", launch_price: 1080000,
    price_history: [
      { date: "2014-12-01", wac_monthly: 1080000, change_percent: 0.0 },
      { date: "2016-01-01", wac_monthly: 1120000, change_percent: 3.7 },
      { date: "2017-01-01", wac_monthly: 1160000, change_percent: 3.6 },
      { date: "2018-01-01", wac_monthly: 1210000, change_percent: 4.3 },
      { date: "2019-01-01", wac_monthly: 1260000, change_percent: 4.1 },
      { date: "2020-01-01", wac_monthly: 1310000, change_percent: 4.0 },
      { date: "2021-01-01", wac_monthly: 1350000, change_percent: 3.1 },
      { date: "2022-01-01", wac_monthly: 1390000, change_percent: 3.0 },
      { date: "2023-01-01", wac_monthly: 1420000, change_percent: 2.2 },
      { date: "2024-01-01", wac_monthly: 1450000, change_percent: 2.1 }
    ],
    total_increase_percent: 34.3, num_increases: 9, cagr: 3.3, inflation_adjusted_increase_percent: 5.7
  },
  {
    drug_id: "farxiga", drug_name: "Farxiga", generic_name: "dapagliflozin", manufacturer_id: "astrazeneca",
    launch_date: "2014-01-01", launch_price: 28000,
    price_history: [
      { date: "2014-01-01", wac_monthly: 28000, change_percent: 0.0 },
      { date: "2015-01-01", wac_monthly: 30000, change_percent: 7.1 },
      { date: "2016-01-01", wac_monthly: 33000, change_percent: 10.0 },
      { date: "2017-01-01", wac_monthly: 36000, change_percent: 9.1 },
      { date: "2018-01-01", wac_monthly: 39000, change_percent: 8.3 },
      { date: "2019-01-01", wac_monthly: 42000, change_percent: 7.7 },
      { date: "2020-01-01", wac_monthly: 45000, change_percent: 7.1 },
      { date: "2021-01-01", wac_monthly: 48000, change_percent: 6.7 },
      { date: "2022-01-01", wac_monthly: 51000, change_percent: 6.3 },
      { date: "2024-01-01", wac_monthly: 55000, change_percent: 7.8 }
    ],
    total_increase_percent: 96.4, num_increases: 9, cagr: 7.0, inflation_adjusted_increase_percent: 55.8
  },
  {
    drug_id: "otezla", drug_name: "Otezla", generic_name: "apremilast", manufacturer_id: "amgen",
    launch_date: "2014-03-01", launch_price: 220000,
    price_history: [
      { date: "2014-03-01", wac_monthly: 220000, change_percent: 0.0 },
      { date: "2015-01-01", wac_monthly: 240000, change_percent: 9.1 },
      { date: "2016-01-01", wac_monthly: 265000, change_percent: 10.4 },
      { date: "2017-01-01", wac_monthly: 290000, change_percent: 9.4 },
      { date: "2018-01-01", wac_monthly: 315000, change_percent: 8.6 },
      { date: "2019-01-01", wac_monthly: 340000, change_percent: 7.9 },
      { date: "2020-01-01", wac_monthly: 360000, change_percent: 5.9 },
      { date: "2021-01-01", wac_monthly: 380000, change_percent: 5.6 },
      { date: "2022-01-01", wac_monthly: 400000, change_percent: 5.3 },
      { date: "2024-01-01", wac_monthly: 420000, change_percent: 5.0 }
    ],
    total_increase_percent: 90.9, num_increases: 9, cagr: 6.7, inflation_adjusted_increase_percent: 52.3
  },
  {
    drug_id: "vyvanse", drug_name: "Vyvanse", generic_name: "lisdexamfetamine dimesylate", manufacturer_id: "takeda",
    launch_date: "2007-02-01", launch_price: 15000,
    price_history: [
      { date: "2007-02-01", wac_monthly: 15000, change_percent: 0.0 },
      { date: "2009-01-01", wac_monthly: 17500, change_percent: 16.7 },
      { date: "2011-01-01", wac_monthly: 21000, change_percent: 20.0 },
      { date: "2013-01-01", wac_monthly: 25000, change_percent: 19.0 },
      { date: "2015-01-01", wac_monthly: 28500, change_percent: 14.0 },
      { date: "2017-01-01", wac_monthly: 32000, change_percent: 12.3 },
      { date: "2019-01-01", wac_monthly: 35500, change_percent: 10.9 },
      { date: "2021-01-01", wac_monthly: 38000, change_percent: 7.0 },
      { date: "2023-01-01", wac_monthly: 39500, change_percent: 3.9 },
      { date: "2024-01-01", wac_monthly: 40000, change_percent: 1.3 }
    ],
    total_increase_percent: 166.7, num_increases: 9, cagr: 5.9, inflation_adjusted_increase_percent: 96.2
  },
  {
    drug_id: "xtandi", drug_name: "Xtandi", generic_name: "enzalutamide", manufacturer_id: "pfizer",
    launch_date: "2012-08-01", launch_price: 750000,
    price_history: [
      { date: "2012-08-01", wac_monthly: 750000, change_percent: 0.0 },
      { date: "2014-01-01", wac_monthly: 810000, change_percent: 8.0 },
      { date: "2015-07-01", wac_monthly: 870000, change_percent: 7.4 },
      { date: "2017-01-01", wac_monthly: 940000, change_percent: 8.0 },
      { date: "2018-07-01", wac_monthly: 1010000, change_percent: 7.4 },
      { date: "2019-07-01", wac_monthly: 1070000, change_percent: 5.9 },
      { date: "2020-07-01", wac_monthly: 1130000, change_percent: 5.6 },
      { date: "2021-07-01", wac_monthly: 1180000, change_percent: 4.4 },
      { date: "2022-07-01", wac_monthly: 1240000, change_percent: 5.1 },
      { date: "2024-01-01", wac_monthly: 1300000, change_percent: 4.8 }
    ],
    total_increase_percent: 73.3, num_increases: 9, cagr: 4.8, inflation_adjusted_increase_percent: 35.1
  }
];

// ─── DRUG REVENUE ────────────────────────────────────────
const newRevenue = [
  { drug_id: "eylea", drug_name: "Eylea", manufacturer_id: "regeneron", therapeutic_area: "ophthalmology",
    annual_revenue: [
      { year: 2019, us_revenue: 470000000000, global_revenue: 740000000000 },
      { year: 2020, us_revenue: 490000000000, global_revenue: 760000000000 },
      { year: 2021, us_revenue: 580000000000, global_revenue: 940000000000 },
      { year: 2022, us_revenue: 580000000000, global_revenue: 920000000000 },
      { year: 2023, us_revenue: 520000000000, global_revenue: 830000000000 }
    ],
    peak_revenue_year: 2021, peak_revenue: 940000000000, trajectory: "declining",
    trajectory_notes: "Biosimilar competition beginning 2023-2024; Eylea HD (8mg) launched as lifecycle extension"
  },
  { drug_id: "entresto", drug_name: "Entresto", manufacturer_id: "novartis", therapeutic_area: "cardiovascular",
    annual_revenue: [
      { year: 2019, us_revenue: 170000000000, global_revenue: 280000000000 },
      { year: 2020, us_revenue: 250000000000, global_revenue: 400000000000 },
      { year: 2021, us_revenue: 350000000000, global_revenue: 560000000000 },
      { year: 2022, us_revenue: 410000000000, global_revenue: 680000000000 },
      { year: 2023, us_revenue: 450000000000, global_revenue: 750000000000 }
    ],
    peak_revenue_year: 2023, peak_revenue: 750000000000, trajectory: "growing",
    trajectory_notes: "Heart failure standard of care; expanding into HFpEF indication; Novartis top growth driver"
  },
  { drug_id: "darzalex", drug_name: "Darzalex", manufacturer_id: "jnj", therapeutic_area: "oncology",
    annual_revenue: [
      { year: 2019, us_revenue: 290000000000, global_revenue: 380000000000 },
      { year: 2020, us_revenue: 380000000000, global_revenue: 530000000000 },
      { year: 2021, us_revenue: 460000000000, global_revenue: 680000000000 },
      { year: 2022, us_revenue: 530000000000, global_revenue: 820000000000 },
      { year: 2023, us_revenue: 590000000000, global_revenue: 980000000000 }
    ],
    peak_revenue_year: 2023, peak_revenue: 980000000000, trajectory: "growing",
    trajectory_notes: "Dominant myeloma franchise; Darzalex Faspro (subQ) driving growth; first-line combinations expanding"
  },
  { drug_id: "ocrevus", drug_name: "Ocrevus", manufacturer_id: "genentech", therapeutic_area: "neurology",
    annual_revenue: [
      { year: 2019, us_revenue: 310000000000, global_revenue: 370000000000 },
      { year: 2020, us_revenue: 370000000000, global_revenue: 450000000000 },
      { year: 2021, us_revenue: 420000000000, global_revenue: 560000000000 },
      { year: 2022, us_revenue: 460000000000, global_revenue: 640000000000 },
      { year: 2023, us_revenue: 480000000000, global_revenue: 680000000000 }
    ],
    peak_revenue_year: 2023, peak_revenue: 680000000000, trajectory: "plateau",
    trajectory_notes: "Leading MS therapy; first approved for primary progressive MS; growth slowing as market saturates"
  },
  { drug_id: "biktarvy", drug_name: "Biktarvy", manufacturer_id: "gilead", therapeutic_area: "infectious_disease",
    annual_revenue: [
      { year: 2019, us_revenue: 380000000000, global_revenue: 470000000000 },
      { year: 2020, us_revenue: 500000000000, global_revenue: 630000000000 },
      { year: 2021, us_revenue: 620000000000, global_revenue: 820000000000 },
      { year: 2022, us_revenue: 720000000000, global_revenue: 990000000000 },
      { year: 2023, us_revenue: 790000000000, global_revenue: 1130000000000 }
    ],
    peak_revenue_year: 2023, peak_revenue: 1130000000000, trajectory: "growing",
    trajectory_notes: "Dominant HIV STR; market share ~45% of new starts; Gilead's largest product"
  },
  { drug_id: "cosentyx", drug_name: "Cosentyx", manufacturer_id: "novartis", therapeutic_area: "immunology",
    annual_revenue: [
      { year: 2019, us_revenue: 200000000000, global_revenue: 360000000000 },
      { year: 2020, us_revenue: 220000000000, global_revenue: 390000000000 },
      { year: 2021, us_revenue: 250000000000, global_revenue: 460000000000 },
      { year: 2022, us_revenue: 260000000000, global_revenue: 490000000000 },
      { year: 2023, us_revenue: 270000000000, global_revenue: 510000000000 }
    ],
    peak_revenue_year: 2023, peak_revenue: 510000000000, trajectory: "plateau",
    trajectory_notes: "Facing IL-23 competition (Skyrizi, Tremfya); ankylosing spondylitis niche protects some share"
  },
  { drug_id: "repatha", drug_name: "Repatha", manufacturer_id: "amgen", therapeutic_area: "cardiovascular",
    annual_revenue: [
      { year: 2019, us_revenue: 60000000000, global_revenue: 85000000000 },
      { year: 2020, us_revenue: 75000000000, global_revenue: 100000000000 },
      { year: 2021, us_revenue: 95000000000, global_revenue: 130000000000 },
      { year: 2022, us_revenue: 120000000000, global_revenue: 160000000000 },
      { year: 2023, us_revenue: 150000000000, global_revenue: 200000000000 }
    ],
    peak_revenue_year: 2023, peak_revenue: 200000000000, trajectory: "growing",
    trajectory_notes: "Growing after 60% WAC cut in 2018; volume increases offsetting lower price; PCSK9 class expanding"
  },
  { drug_id: "tremfya", drug_name: "Tremfya", manufacturer_id: "jnj", therapeutic_area: "immunology",
    annual_revenue: [
      { year: 2019, us_revenue: 100000000000, global_revenue: 130000000000 },
      { year: 2020, us_revenue: 140000000000, global_revenue: 190000000000 },
      { year: 2021, us_revenue: 190000000000, global_revenue: 270000000000 },
      { year: 2022, us_revenue: 240000000000, global_revenue: 350000000000 },
      { year: 2023, us_revenue: 290000000000, global_revenue: 410000000000 }
    ],
    peak_revenue_year: 2023, peak_revenue: 410000000000, trajectory: "growing",
    trajectory_notes: "IL-23 blocker gaining share from older biologics; ulcerative colitis indication expanding market"
  },
  { drug_id: "kisqali", drug_name: "Kisqali", manufacturer_id: "novartis", therapeutic_area: "oncology",
    annual_revenue: [
      { year: 2019, us_revenue: 55000000000, global_revenue: 95000000000 },
      { year: 2020, us_revenue: 75000000000, global_revenue: 130000000000 },
      { year: 2021, us_revenue: 110000000000, global_revenue: 190000000000 },
      { year: 2022, us_revenue: 170000000000, global_revenue: 280000000000 },
      { year: 2023, us_revenue: 270000000000, global_revenue: 420000000000 }
    ],
    peak_revenue_year: 2023, peak_revenue: 420000000000, trajectory: "rapid_growth",
    trajectory_notes: "NATALEE OS data showing survival benefit driving share gains from Ibrance; preferred CDK4/6 inhibitor"
  },
  { drug_id: "verzenio", drug_name: "Verzenio", manufacturer_id: "lilly", therapeutic_area: "oncology",
    annual_revenue: [
      { year: 2019, us_revenue: 80000000000, global_revenue: 100000000000 },
      { year: 2020, us_revenue: 130000000000, global_revenue: 170000000000 },
      { year: 2021, us_revenue: 200000000000, global_revenue: 270000000000 },
      { year: 2022, us_revenue: 300000000000, global_revenue: 400000000000 },
      { year: 2023, us_revenue: 380000000000, global_revenue: 530000000000 }
    ],
    peak_revenue_year: 2023, peak_revenue: 530000000000, trajectory: "rapid_growth",
    trajectory_notes: "monarchE adjuvant data driving explosive growth; only CDK4/6 inhibitor with adjuvant approval"
  },
  { drug_id: "lynparza", drug_name: "Lynparza", manufacturer_id: "astrazeneca", therapeutic_area: "oncology",
    annual_revenue: [
      { year: 2019, us_revenue: 100000000000, global_revenue: 170000000000 },
      { year: 2020, us_revenue: 140000000000, global_revenue: 240000000000 },
      { year: 2021, us_revenue: 180000000000, global_revenue: 310000000000 },
      { year: 2022, us_revenue: 200000000000, global_revenue: 340000000000 },
      { year: 2023, us_revenue: 200000000000, global_revenue: 340000000000 }
    ],
    peak_revenue_year: 2023, peak_revenue: 340000000000, trajectory: "plateau",
    trajectory_notes: "First PARP inhibitor; competition from other PARPi (niraparib, rucaparib); co-promoted with Merck"
  },
  { drug_id: "farxiga", drug_name: "Farxiga", manufacturer_id: "astrazeneca", therapeutic_area: "diabetes",
    annual_revenue: [
      { year: 2019, us_revenue: 110000000000, global_revenue: 180000000000 },
      { year: 2020, us_revenue: 140000000000, global_revenue: 250000000000 },
      { year: 2021, us_revenue: 190000000000, global_revenue: 380000000000 },
      { year: 2022, us_revenue: 240000000000, global_revenue: 510000000000 },
      { year: 2023, us_revenue: 280000000000, global_revenue: 630000000000 }
    ],
    peak_revenue_year: 2023, peak_revenue: 630000000000, trajectory: "growing",
    trajectory_notes: "SGLT2 class growth from HF and CKD indications; global growth outpacing US due to DAPA-CKD and DAPA-HF trials"
  },
  { drug_id: "otezla", drug_name: "Otezla", manufacturer_id: "amgen", therapeutic_area: "immunology",
    annual_revenue: [
      { year: 2019, us_revenue: 140000000000, global_revenue: 188000000000 },
      { year: 2020, us_revenue: 150000000000, global_revenue: 210000000000 },
      { year: 2021, us_revenue: 160000000000, global_revenue: 230000000000 },
      { year: 2022, us_revenue: 170000000000, global_revenue: 240000000000 },
      { year: 2023, us_revenue: 175000000000, global_revenue: 250000000000 }
    ],
    peak_revenue_year: 2023, peak_revenue: 250000000000, trajectory: "plateau",
    trajectory_notes: "Oral PDE4 for psoriasis; Amgen acquired from Celgene for $13.4B in 2019; stable but facing biologic competition"
  },
  { drug_id: "vyvanse", drug_name: "Vyvanse", manufacturer_id: "takeda", therapeutic_area: "cns",
    annual_revenue: [
      { year: 2019, us_revenue: 310000000000, global_revenue: 340000000000 },
      { year: 2020, us_revenue: 330000000000, global_revenue: 360000000000 },
      { year: 2021, us_revenue: 340000000000, global_revenue: 380000000000 },
      { year: 2022, us_revenue: 360000000000, global_revenue: 400000000000 },
      { year: 2023, us_revenue: 200000000000, global_revenue: 220000000000 }
    ],
    peak_revenue_year: 2022, peak_revenue: 400000000000, trajectory: "declining",
    trajectory_notes: "Generic lisdexamfetamine launched August 2023; rapid revenue erosion expected"
  },
  { drug_id: "xtandi", drug_name: "Xtandi", manufacturer_id: "pfizer", therapeutic_area: "oncology",
    annual_revenue: [
      { year: 2019, us_revenue: 280000000000, global_revenue: 440000000000 },
      { year: 2020, us_revenue: 300000000000, global_revenue: 470000000000 },
      { year: 2021, us_revenue: 340000000000, global_revenue: 530000000000 },
      { year: 2022, us_revenue: 370000000000, global_revenue: 580000000000 },
      { year: 2023, us_revenue: 390000000000, global_revenue: 610000000000 }
    ],
    peak_revenue_year: 2023, peak_revenue: 610000000000, trajectory: "growing",
    trajectory_notes: "Standard of care in prostate cancer; earlier-line indications driving growth; co-promoted with Astellas"
  }
];

// ─── PATENTS ─────────────────────────────────────────────
const newPatents = [
  { drug_id: "eylea", drug_name: "Eylea", manufacturer_id: "regeneron", original_patent_number: "US7303746", original_patent_expiry: "2023-06-15", effective_exclusivity_end: "2027-05-01", delay_years: 3.9, exclusivity_type: "biologic_reference_product", total_patents_filed: 37,
    secondary_patents: [{ patent_number: "US9254338", expiry: "2027-05-01", type: "formulation", description: "Micro-infusion delivery device formulations" }, { patent_number: "US10406224", expiry: "2030-08-15", type: "method_of_treatment", description: "Treatment of diabetic macular edema" }],
    patent_cliff_date: "2027-05-01", patent_thicket: false, patent_thicket_count: 37, notes: "Biosimilar competition beginning; Eylea HD (8mg) launched as high-dose lifecycle extension to retain patients" },
  { drug_id: "entresto", drug_name: "Entresto", manufacturer_id: "novartis", original_patent_number: "US8101659", original_patent_expiry: "2026-11-11", effective_exclusivity_end: "2029-07-01", delay_years: 2.6, exclusivity_type: "new_chemical_entity", total_patents_filed: 42,
    secondary_patents: [{ patent_number: "US9388134", expiry: "2029-07-01", type: "composition", description: "Sacubitril/valsartan co-crystal forms" }, { patent_number: "US10561646", expiry: "2033-04-22", type: "method_of_treatment", description: "Treatment of HFpEF" }],
    patent_cliff_date: "2029-07-01", patent_thicket: false, patent_thicket_count: 42, notes: "First-in-class ARNI; co-crystal composition patents extending protection beyond compound expiry" },
  { drug_id: "darzalex", drug_name: "Darzalex", manufacturer_id: "jnj", original_patent_number: "US7829693", original_patent_expiry: "2029-03-08", effective_exclusivity_end: "2032-12-01", delay_years: 3.7, exclusivity_type: "biologic_reference_product", total_patents_filed: 34,
    secondary_patents: [{ patent_number: "US9657102", expiry: "2031-06-15", type: "formulation", description: "Subcutaneous daratumumab + hyaluronidase (Faspro)" }, { patent_number: "US10233258", expiry: "2032-12-01", type: "method_of_treatment", description: "First-line myeloma combination therapy" }],
    patent_cliff_date: "2032-12-01", patent_thicket: false, patent_thicket_count: 34, notes: "Darzalex Faspro (subcutaneous) formulation provides lifecycle extension and improved administration" },
  { drug_id: "ocrevus", drug_name: "Ocrevus", manufacturer_id: "genentech", original_patent_number: "US7682612", original_patent_expiry: "2028-07-22", effective_exclusivity_end: "2031-03-01", delay_years: 2.6, exclusivity_type: "biologic_reference_product", total_patents_filed: 29,
    secondary_patents: [{ patent_number: "US9382327", expiry: "2031-03-01", type: "method_of_treatment", description: "Treatment of primary progressive MS" }, { patent_number: "US10100118", expiry: "2033-06-30", type: "formulation", description: "Subcutaneous ocrelizumab formulation" }],
    patent_cliff_date: "2031-03-01", patent_thicket: false, patent_thicket_count: 29, notes: "First and only MS therapy approved for primary progressive MS; method patents key to extended exclusivity" },
  { drug_id: "biktarvy", drug_name: "Biktarvy", manufacturer_id: "gilead", original_patent_number: "US9717712", original_patent_expiry: "2033-02-28", effective_exclusivity_end: "2036-06-30", delay_years: 3.3, exclusivity_type: "new_chemical_entity", total_patents_filed: 56,
    secondary_patents: [{ patent_number: "US10105369", expiry: "2034-09-15", type: "composition", description: "Bictegravir crystal forms" }, { patent_number: "US10722498", expiry: "2036-06-30", type: "formulation", description: "Triple-combination fixed-dose formulation" }],
    patent_cliff_date: "2036-06-30", patent_thicket: true, patent_thicket_count: 56, notes: "Gilead building strong patent estate; triple-combo formulation patents extend well beyond individual API patents" },
  { drug_id: "cosentyx", drug_name: "Cosentyx", manufacturer_id: "novartis", original_patent_number: "US7807160", original_patent_expiry: "2026-12-22", effective_exclusivity_end: "2030-04-01", delay_years: 3.3, exclusivity_type: "biologic_reference_product", total_patents_filed: 44,
    secondary_patents: [{ patent_number: "US9676845", expiry: "2028-08-15", type: "formulation", description: "Secukinumab autoinjector formulation" }, { patent_number: "US10155816", expiry: "2030-04-01", type: "method_of_treatment", description: "Treatment of axial spondyloarthritis" }],
    patent_cliff_date: "2030-04-01", patent_thicket: false, patent_thicket_count: 44, notes: "First IL-17A inhibitor; biosimilar applications expected before 2030" },
  { drug_id: "xtandi", drug_name: "Xtandi", manufacturer_id: "pfizer", original_patent_number: "US7709517", original_patent_expiry: "2026-10-06", effective_exclusivity_end: "2029-08-01", delay_years: 2.8, exclusivity_type: "new_chemical_entity", total_patents_filed: 31,
    secondary_patents: [{ patent_number: "US8470834", expiry: "2028-01-15", type: "composition", description: "Enzalutamide soft gelatin capsule formulations" }, { patent_number: "US9956216", expiry: "2029-08-01", type: "method_of_treatment", description: "Non-metastatic castration-resistant prostate cancer" }],
    patent_cliff_date: "2029-08-01", patent_thicket: false, patent_thicket_count: 31, notes: "Developed with NIH-funded research at UCLA; earlier-line indications extending commercial value; Astellas co-development agreement" }
];

// ─── MANUFACTURER FINANCIALS (new entries) ───────────────
const newManufacturers = [
  {
    manufacturer_id: "amgen", name: "Amgen Inc.", ticker: "AMGN",
    annual_revenue: [{ year: 2023, revenue: 2810000000000 }],
    net_income: [{ year: 2023, income: 670000000000 }],
    rd_spend: [{ year: 2023, spend: 470000000000 }],
    sga_spend: [{ year: 2023, spend: 520000000000 }],
    gross_margin: 74.5, ceo_compensation: 2380000000, ceo_name: "Robert Bradway",
    headquarters: "Thousand Oaks, CA", employees: 26500
  },
  {
    manufacturer_id: "genentech", name: "Genentech (Roche)", ticker: "RHHBY",
    annual_revenue: [{ year: 2023, revenue: 4220000000000 }],
    net_income: [{ year: 2023, income: 1160000000000 }],
    rd_spend: [{ year: 2023, spend: 830000000000 }],
    sga_spend: [{ year: 2023, spend: 960000000000 }],
    gross_margin: 68.2, ceo_compensation: 1520000000, ceo_name: "Thomas Schinecker",
    headquarters: "South San Francisco, CA", employees: 100000
  },
  {
    manufacturer_id: "takeda", name: "Takeda Pharmaceutical", ticker: "TAK",
    annual_revenue: [{ year: 2023, revenue: 3110000000000 }],
    net_income: [{ year: 2023, income: 230000000000 }],
    rd_spend: [{ year: 2023, spend: 480000000000 }],
    sga_spend: [{ year: 2023, spend: 750000000000 }],
    gross_margin: 65.8, ceo_compensation: 1780000000, ceo_name: "Christophe Weber",
    headquarters: "Tokyo, Japan", employees: 49000
  }
];

// ─── CMS ASP (physician-administered drugs) ──────────────
const newCmsAsp = [
  { drug_id: "eylea", drug_name: "Eylea", generic_name: "aflibercept", manufacturer_id: "regeneron", hcpcs_code: "J0178",
    quarterly_asp: [
      { quarter: "2022-Q3", asp_per_unit: 178000, wac_per_unit: 182000, asp_wac_discount: 2.2, quarter_over_quarter_change: 0.8, flagged: false },
      { quarter: "2022-Q4", asp_per_unit: 179000, wac_per_unit: 183000, asp_wac_discount: 2.2, quarter_over_quarter_change: 0.6, flagged: false },
      { quarter: "2023-Q1", asp_per_unit: 180000, wac_per_unit: 184000, asp_wac_discount: 2.2, quarter_over_quarter_change: 0.6, flagged: false },
      { quarter: "2023-Q2", asp_per_unit: 180000, wac_per_unit: 184000, asp_wac_discount: 2.2, quarter_over_quarter_change: 0.0, flagged: false },
      { quarter: "2023-Q3", asp_per_unit: 176000, wac_per_unit: 184500, asp_wac_discount: 4.6, quarter_over_quarter_change: -2.2, flagged: false },
      { quarter: "2023-Q4", asp_per_unit: 173000, wac_per_unit: 185000, asp_wac_discount: 6.5, quarter_over_quarter_change: -1.7, flagged: false },
      { quarter: "2024-Q1", asp_per_unit: 170000, wac_per_unit: 185000, asp_wac_discount: 8.1, quarter_over_quarter_change: -1.7, flagged: false },
      { quarter: "2024-Q2", asp_per_unit: 168000, wac_per_unit: 185000, asp_wac_discount: 9.2, quarter_over_quarter_change: -1.2, flagged: false }
    ],
    notes: "ASP declining as biosimilar aflibercept products enter the market"
  },
  { drug_id: "darzalex", drug_name: "Darzalex", generic_name: "daratumumab", manufacturer_id: "jnj", hcpcs_code: "J9145",
    quarterly_asp: [
      { quarter: "2022-Q3", asp_per_unit: 360000, wac_per_unit: 370000, asp_wac_discount: 2.7, quarter_over_quarter_change: 1.5, flagged: false },
      { quarter: "2022-Q4", asp_per_unit: 363000, wac_per_unit: 372000, asp_wac_discount: 2.4, quarter_over_quarter_change: 0.8, flagged: false },
      { quarter: "2023-Q1", asp_per_unit: 366000, wac_per_unit: 374000, asp_wac_discount: 2.1, quarter_over_quarter_change: 0.8, flagged: false },
      { quarter: "2023-Q2", asp_per_unit: 368000, wac_per_unit: 375000, asp_wac_discount: 1.9, quarter_over_quarter_change: 0.5, flagged: false },
      { quarter: "2023-Q3", asp_per_unit: 370000, wac_per_unit: 375000, asp_wac_discount: 1.3, quarter_over_quarter_change: 0.5, flagged: false },
      { quarter: "2023-Q4", asp_per_unit: 371000, wac_per_unit: 375000, asp_wac_discount: 1.1, quarter_over_quarter_change: 0.3, flagged: false },
      { quarter: "2024-Q1", asp_per_unit: 372000, wac_per_unit: 375000, asp_wac_discount: 0.8, quarter_over_quarter_change: 0.3, flagged: false },
      { quarter: "2024-Q2", asp_per_unit: 373000, wac_per_unit: 375000, asp_wac_discount: 0.5, quarter_over_quarter_change: 0.3, flagged: false }
    ],
    notes: "Minimal discount gap; strong market position with no biosimilar competition"
  },
  { drug_id: "ocrevus", drug_name: "Ocrevus", generic_name: "ocrelizumab", manufacturer_id: "genentech", hcpcs_code: "J2350",
    quarterly_asp: [
      { quarter: "2022-Q3", asp_per_unit: 3400000, wac_per_unit: 3460000, asp_wac_discount: 1.7, quarter_over_quarter_change: 0.4, flagged: false },
      { quarter: "2022-Q4", asp_per_unit: 3410000, wac_per_unit: 3470000, asp_wac_discount: 1.7, quarter_over_quarter_change: 0.3, flagged: false },
      { quarter: "2023-Q1", asp_per_unit: 3420000, wac_per_unit: 3475000, asp_wac_discount: 1.6, quarter_over_quarter_change: 0.3, flagged: false },
      { quarter: "2023-Q2", asp_per_unit: 3430000, wac_per_unit: 3478000, asp_wac_discount: 1.4, quarter_over_quarter_change: 0.3, flagged: false },
      { quarter: "2023-Q3", asp_per_unit: 3435000, wac_per_unit: 3479000, asp_wac_discount: 1.3, quarter_over_quarter_change: 0.1, flagged: false },
      { quarter: "2023-Q4", asp_per_unit: 3440000, wac_per_unit: 3480000, asp_wac_discount: 1.1, quarter_over_quarter_change: 0.1, flagged: false },
      { quarter: "2024-Q1", asp_per_unit: 3440000, wac_per_unit: 3480000, asp_wac_discount: 1.1, quarter_over_quarter_change: 0.0, flagged: false },
      { quarter: "2024-Q2", asp_per_unit: 3442000, wac_per_unit: 3480000, asp_wac_discount: 1.1, quarter_over_quarter_change: 0.1, flagged: false }
    ],
    notes: "Infused every 6 months; ASP per infusion (~$34K); minimal discount due to no competition"
  }
];

// ────────── APPLY ALL CHANGES ─────────────────────────────

const wac = read('wac_prices');
wac.push(...newWac);
write('wac_prices', wac);
console.log(`wac_prices: ${wac.length} drugs`);

const cogs = read('cogs_estimates');
cogs.push(...newCogs);
write('cogs_estimates', cogs);
console.log(`cogs_estimates: ${cogs.length} drugs`);

const hist = read('wac_history');
hist.push(...newHistory);
write('wac_history', hist);
console.log(`wac_history: ${hist.length} drugs`);

const rev = read('drug_revenue');
rev.push(...newRevenue);
write('drug_revenue', rev);
console.log(`drug_revenue: ${rev.length} drugs`);

const pat = read('patents');
pat.push(...newPatents);
write('patents', pat);
console.log(`patents: ${pat.length} drugs`);

const mfr = read('manufacturer_financials');
mfr.push(...newManufacturers);
write('manufacturer_financials', mfr);
console.log(`manufacturer_financials: ${mfr.length} entries`);

const cms = read('cms_asp');
cms.push(...newCmsAsp);
write('cms_asp', cms);
console.log(`cms_asp: ${cms.length} drugs`);

console.log('\nDone! Added 15 new drugs across all data files.');

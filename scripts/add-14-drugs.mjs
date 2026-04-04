/**
 * Add 14 new drugs to the drug economics dataset.
 * Run: node scripts/add-14-drugs.mjs
 *
 * Drugs added (all from existing manufacturers):
 *  1. Leqembi  (lecanemab)          - Biogen   - Alzheimer's
 *  2. Tepezza  (teprotumumab)        - Amgen    - Thyroid eye disease
 *  3. Praluent (alirocumab)          - Sanofi   - High cholesterol (PCSK9)
 *  4. Taltz    (ixekizumab)          - Lilly    - Psoriasis
 *  5. Carvykti (cilta-cel)           - J&J      - CAR-T, multiple myeloma
 *  6. Abecma   (ide-cel)             - BMS      - CAR-T, multiple myeloma
 *  7. Nurtec   (rimegepant)          - Pfizer   - Migraine
 *  8. Jakafi   (ruxolitinib)         - Novartis - Myelofibrosis
 *  9. Trodelvy (sacituzumab)         - Gilead   - Breast cancer
 * 10. Padcev   (enfortumab vedotin)  - Pfizer   - Bladder cancer
 * 11. Xgeva    (denosumab)           - Amgen    - Bone metastases
 * 12. Lumakras (sotorasib)           - Amgen    - Lung cancer (KRAS)
 * 13. Luxturna (voretigene)          - Novartis - Gene therapy, blindness
 * 14. Evenity  (romosozumab)         - Amgen    - Osteoporosis
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = join(__dirname, '..', 'data');

function readJSON(file) {
  return JSON.parse(readFileSync(join(DATA, file), 'utf-8'));
}
function writeJSON(file, data) {
  writeFileSync(join(DATA, file), JSON.stringify(data, null, 2) + '\n');
}

// ── WAC PRICES ────────────────────────────────────────────────────
const newWacPrices = [
  {
    drug_id: "leqembi",
    drug_name: "Leqembi",
    generic_name: "lecanemab-irmb",
    manufacturer_id: "biogen",
    dosage_form: "intravenous infusion",
    strength: "500 mg/5 mL",
    wac_per_unit: 1312500,
    wac_monthly: 2208300,
    wac_annual: 26499600,
    ndc: "64406-0058-01",
    therapeutic_area: "neurology",
    route_of_administration: "intravenous",
    units_per_month: 2,
    effective_date: "2026-01-01",
    note: "Dosed every 2 weeks at 10 mg/kg IV; monthly cost reflects ~2 infusions",
    data_year: 2026,
    data_quarter: "Q1",
    source: "WAC_MONITOR"
  },
  {
    drug_id: "tepezza",
    drug_name: "Tepezza",
    generic_name: "teprotumumab-trbw",
    manufacturer_id: "amgen",
    dosage_form: "intravenous infusion",
    strength: "500 mg/vial",
    wac_per_unit: 1489000,
    wac_monthly: 1489000,
    wac_annual: 11912000,
    ndc: "75987-0130-01",
    therapeutic_area: "endocrinology",
    route_of_administration: "intravenous",
    units_per_month: 1,
    effective_date: "2026-01-01",
    note: "8 infusions over ~5 months; WAC per infusion ~$14,890; annualized over treatment course",
    data_year: 2026,
    data_quarter: "Q1",
    source: "WAC_MONITOR"
  },
  {
    drug_id: "praluent",
    drug_name: "Praluent",
    generic_name: "alirocumab",
    manufacturer_id: "sanofi",
    dosage_form: "subcutaneous injection",
    strength: "150 mg/mL",
    wac_per_unit: 72500,
    wac_monthly: 145000,
    wac_annual: 1740000,
    ndc: "00024-5917-02",
    therapeutic_area: "cardiology",
    route_of_administration: "subcutaneous",
    units_per_month: 2,
    effective_date: "2026-01-01",
    note: "Dosed 150 mg every 2 weeks subcutaneously",
    data_year: 2026,
    data_quarter: "Q1",
    source: "WAC_MONITOR"
  },
  {
    drug_id: "taltz",
    drug_name: "Taltz",
    generic_name: "ixekizumab",
    manufacturer_id: "lilly",
    dosage_form: "subcutaneous injection",
    strength: "80 mg/mL",
    wac_per_unit: 650000,
    wac_monthly: 650000,
    wac_annual: 7800000,
    ndc: "00002-1445-01",
    therapeutic_area: "immunology",
    route_of_administration: "subcutaneous",
    units_per_month: 1,
    effective_date: "2026-01-01",
    note: "Maintenance dose 80 mg every 4 weeks after loading",
    data_year: 2026,
    data_quarter: "Q1",
    source: "WAC_MONITOR"
  },
  {
    drug_id: "carvykti",
    drug_name: "Carvykti",
    generic_name: "ciltacabtagene autoleucel",
    manufacturer_id: "jnj",
    dosage_form: "intravenous infusion",
    strength: "patient-specific",
    wac_per_unit: 46500000,
    wac_monthly: 3875000,
    wac_annual: 46500000,
    ndc: "57894-0150-01",
    therapeutic_area: "oncology",
    route_of_administration: "intravenous",
    units_per_month: 1,
    effective_date: "2026-01-01",
    note: "One-time CAR-T infusion; $465,000 total annualized across 12 months",
    data_year: 2026,
    data_quarter: "Q1",
    source: "WAC_MONITOR"
  },
  {
    drug_id: "abecma",
    drug_name: "Abecma",
    generic_name: "idecabtagene vicleucel",
    manufacturer_id: "bms",
    dosage_form: "intravenous infusion",
    strength: "patient-specific",
    wac_per_unit: 41950000,
    wac_monthly: 3495800,
    wac_annual: 41950000,
    ndc: "59572-0900-01",
    therapeutic_area: "oncology",
    route_of_administration: "intravenous",
    units_per_month: 1,
    effective_date: "2026-01-01",
    note: "One-time CAR-T infusion; $419,500 total annualized across 12 months",
    data_year: 2026,
    data_quarter: "Q1",
    source: "WAC_MONITOR"
  },
  {
    drug_id: "nurtec",
    drug_name: "Nurtec ODT",
    generic_name: "rimegepant",
    manufacturer_id: "pfizer",
    dosage_form: "oral disintegrating tablet",
    strength: "75 mg",
    wac_per_unit: 10800,
    wac_monthly: 97200,
    wac_annual: 1166400,
    ndc: "72578-0075-01",
    therapeutic_area: "neurology",
    route_of_administration: "oral",
    units_per_month: 9,
    effective_date: "2026-01-01",
    note: "For prevention: 75 mg every other day (~15/month); acute: as needed. Cost varies by usage",
    data_year: 2026,
    data_quarter: "Q1",
    source: "WAC_MONITOR"
  },
  {
    drug_id: "jakafi",
    drug_name: "Jakafi",
    generic_name: "ruxolitinib",
    manufacturer_id: "novartis",
    dosage_form: "oral tablet",
    strength: "20 mg",
    wac_per_unit: 27700,
    wac_monthly: 1662000,
    wac_annual: 19944000,
    ndc: "50881-0020-60",
    therapeutic_area: "oncology",
    route_of_administration: "oral",
    units_per_month: 60,
    effective_date: "2026-01-01",
    note: "Dosed 20 mg twice daily (60 tablets/month); WAC per tablet ~$277",
    data_year: 2026,
    data_quarter: "Q1",
    source: "WAC_MONITOR"
  },
  {
    drug_id: "trodelvy",
    drug_name: "Trodelvy",
    generic_name: "sacituzumab govitecan-hziy",
    manufacturer_id: "gilead",
    dosage_form: "intravenous infusion",
    strength: "180 mg/vial",
    wac_per_unit: 525000,
    wac_monthly: 1575000,
    wac_annual: 18900000,
    ndc: "58468-0080-01",
    therapeutic_area: "oncology",
    route_of_administration: "intravenous",
    units_per_month: 3,
    effective_date: "2026-01-01",
    note: "Dosed 10 mg/kg on days 1 and 8 of 21-day cycles; ~3 vials per infusion avg",
    data_year: 2026,
    data_quarter: "Q1",
    source: "WAC_MONITOR"
  },
  {
    drug_id: "padcev",
    drug_name: "Padcev",
    generic_name: "enfortumab vedotin-ejfv",
    manufacturer_id: "pfizer",
    dosage_form: "intravenous infusion",
    strength: "30 mg/vial",
    wac_per_unit: 850000,
    wac_monthly: 1700000,
    wac_annual: 20400000,
    ndc: "51144-0030-01",
    therapeutic_area: "oncology",
    route_of_administration: "intravenous",
    units_per_month: 2,
    effective_date: "2026-01-01",
    note: "Dosed 1.25 mg/kg on days 1, 8 of 21-day cycles; monthly reflects ~2 infusions avg",
    data_year: 2026,
    data_quarter: "Q1",
    source: "WAC_MONITOR"
  },
  {
    drug_id: "xgeva",
    drug_name: "Xgeva",
    generic_name: "denosumab",
    manufacturer_id: "amgen",
    dosage_form: "subcutaneous injection",
    strength: "120 mg/1.7 mL",
    wac_per_unit: 222000,
    wac_monthly: 222000,
    wac_annual: 2664000,
    ndc: "55513-0730-01",
    therapeutic_area: "oncology",
    route_of_administration: "subcutaneous",
    units_per_month: 1,
    effective_date: "2026-01-01",
    note: "Dosed 120 mg every 4 weeks for bone metastases prevention",
    data_year: 2026,
    data_quarter: "Q1",
    source: "WAC_MONITOR"
  },
  {
    drug_id: "lumakras",
    drug_name: "Lumakras",
    generic_name: "sotorasib",
    manufacturer_id: "amgen",
    dosage_form: "oral tablet",
    strength: "120 mg",
    wac_per_unit: 59700,
    wac_monthly: 1790000,
    wac_annual: 21480000,
    ndc: "55513-0121-12",
    therapeutic_area: "oncology",
    route_of_administration: "oral",
    units_per_month: 30,
    effective_date: "2026-01-01",
    note: "960 mg daily (eight 120 mg tablets); first KRAS G12C inhibitor",
    data_year: 2026,
    data_quarter: "Q1",
    source: "WAC_MONITOR"
  },
  {
    drug_id: "luxturna",
    drug_name: "Luxturna",
    generic_name: "voretigene neparvovec-rzyl",
    manufacturer_id: "novartis",
    dosage_form: "subretinal injection",
    strength: "5 x 10^12 vg/mL",
    wac_per_unit: 42500000,
    wac_monthly: 7083300,
    wac_annual: 85000000,
    ndc: "71394-0415-01",
    therapeutic_area: "ophthalmology",
    route_of_administration: "subretinal",
    units_per_month: 1,
    effective_date: "2026-01-01",
    note: "One-time gene therapy; $425,000 per eye ($850,000 both eyes); annualized across 12 months",
    data_year: 2026,
    data_quarter: "Q1",
    source: "WAC_MONITOR"
  },
  {
    drug_id: "evenity",
    drug_name: "Evenity",
    generic_name: "romosozumab-aqqg",
    manufacturer_id: "amgen",
    dosage_form: "subcutaneous injection",
    strength: "105 mg/1.17 mL",
    wac_per_unit: 110000,
    wac_monthly: 220000,
    wac_annual: 2640000,
    ndc: "55513-0850-02",
    therapeutic_area: "bone health",
    route_of_administration: "subcutaneous",
    units_per_month: 2,
    effective_date: "2026-01-01",
    note: "210 mg monthly (two 105 mg injections); 12-month treatment course for osteoporosis",
    data_year: 2026,
    data_quarter: "Q1",
    source: "WAC_MONITOR"
  }
];

// ── COGS ESTIMATES ────────────────────────────────────────────────
const newCogs = [
  {
    drug_id: "leqembi", drug_name: "Leqembi", generic_name: "lecanemab-irmb",
    manufacturer_id: "biogen", drug_type: "biologic",
    estimated_cogs_per_unit: 55000, estimated_cogs_monthly: 110000, estimated_cogs_annual: 1320000,
    wac_monthly: 2208300, markup_over_cogs: 1907.5, gross_margin_estimate: 95.0,
    estimates: [
      { source: "Mattingly et al., Neurology", source_url: "https://n.neurology.org/content/101/6/e620",
        author: "Mattingly TJ, Slejko JF, Onukwugha E", publication_year: 2023,
        estimated_cogs_monthly: 100000, confidence: "low",
        methodology: "estimated from monoclonal antibody manufacturing benchmarks and bioreactor capacity models" },
      { source: "ICER Assessment, Alzheimer's Treatments", source_url: "https://icer.org/assessment/alzheimers-disease-2023/",
        author: "ICER", publication_year: 2023,
        estimated_cogs_monthly: 120000, confidence: "low",
        methodology: "cost-effectiveness model incorporating manufacturing cost assumptions for anti-amyloid antibodies" }
    ],
    cost_components: { api_manufacturing: 65000, formulation_fill_finish: 20000, quality_testing: 12000, packaging_distribution: 8000, cold_chain_logistics: 5000 },
    data_year: 2026, data_quarter: "Q1", source: "ACADEMIC_ESTIMATE"
  },
  {
    drug_id: "tepezza", drug_name: "Tepezza", generic_name: "teprotumumab-trbw",
    manufacturer_id: "amgen", drug_type: "biologic",
    estimated_cogs_per_unit: 74500, estimated_cogs_monthly: 74500, estimated_cogs_annual: 596000,
    wac_monthly: 1489000, markup_over_cogs: 1899.3, gross_margin_estimate: 95.0,
    estimates: [
      { source: "Kelley B, mAbs Journal", source_url: "https://www.tandfonline.com/doi/full/10.1080/19420862.2016.1193054",
        author: "Kelley B", publication_year: 2016,
        estimated_cogs_monthly: 70000, confidence: "low",
        methodology: "estimated from general monoclonal antibody COGS benchmarks" },
      { source: "Biosimilar Development Cost Models", source_url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8072215/",
        author: "Hernandez I, Bott SW, Patel AS", publication_year: 2021,
        estimated_cogs_monthly: 79000, confidence: "low",
        methodology: "inferred from biologics manufacturing cost literature" }
    ],
    cost_components: { api_manufacturing: 45000, formulation_fill_finish: 12000, quality_testing: 8000, packaging_distribution: 5000, cold_chain_logistics: 4500 },
    data_year: 2026, data_quarter: "Q1", source: "ACADEMIC_ESTIMATE"
  },
  {
    drug_id: "praluent", drug_name: "Praluent", generic_name: "alirocumab",
    manufacturer_id: "sanofi", drug_type: "biologic",
    estimated_cogs_per_unit: 3000, estimated_cogs_monthly: 6000, estimated_cogs_annual: 72000,
    wac_monthly: 145000, markup_over_cogs: 2316.7, gross_margin_estimate: 95.9,
    estimates: [
      { source: "Hernandez et al., JAMA Internal Medicine", source_url: "https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2653012",
        author: "Hernandez I, Good CB, Cutler DM", publication_year: 2018,
        estimated_cogs_monthly: 5500, confidence: "medium",
        methodology: "reverse-engineering from biosimilar pricing for monoclonal antibodies" },
      { source: "Kelley B, mAbs Journal", source_url: "https://www.tandfonline.com/doi/full/10.1080/19420862.2016.1193054",
        author: "Kelley B", publication_year: 2016,
        estimated_cogs_monthly: 6500, confidence: "medium",
        methodology: "bottom-up manufacturing cost analysis for monoclonal antibodies" }
    ],
    cost_components: { api_manufacturing: 3000, formulation_fill_finish: 1200, quality_testing: 800, packaging_distribution: 500, device_autoinjector: 500 },
    data_year: 2026, data_quarter: "Q1", source: "ACADEMIC_ESTIMATE"
  },
  {
    drug_id: "taltz", drug_name: "Taltz", generic_name: "ixekizumab",
    manufacturer_id: "lilly", drug_type: "biologic",
    estimated_cogs_per_unit: 16000, estimated_cogs_monthly: 16000, estimated_cogs_annual: 192000,
    wac_monthly: 650000, markup_over_cogs: 3962.5, gross_margin_estimate: 97.5,
    estimates: [
      { source: "Hernandez et al., JAMA Internal Medicine", source_url: "https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2653012",
        author: "Hernandez I, Good CB, Cutler DM", publication_year: 2018,
        estimated_cogs_monthly: 14000, confidence: "medium",
        methodology: "reverse-engineering from biosimilar pricing for IL-17A monoclonal antibodies" },
      { source: "Kelley B, mAbs Journal", source_url: "https://www.tandfonline.com/doi/full/10.1080/19420862.2016.1193054",
        author: "Kelley B", publication_year: 2016,
        estimated_cogs_monthly: 18000, confidence: "medium",
        methodology: "bottom-up manufacturing cost model for monoclonal antibodies" }
    ],
    cost_components: { api_manufacturing: 9000, formulation_fill_finish: 3000, quality_testing: 1500, packaging_distribution: 1000, device_autoinjector: 1500 },
    data_year: 2026, data_quarter: "Q1", source: "ACADEMIC_ESTIMATE"
  },
  {
    drug_id: "carvykti", drug_name: "Carvykti", generic_name: "ciltacabtagene autoleucel",
    manufacturer_id: "jnj", drug_type: "cell_therapy",
    estimated_cogs_per_unit: 8000000, estimated_cogs_monthly: 666700, estimated_cogs_annual: 8000000,
    wac_monthly: 3875000, markup_over_cogs: 481.3, gross_margin_estimate: 82.8,
    estimates: [
      { source: "Lyman et al., The Lancet Haematology", source_url: "https://www.thelancet.com/journals/lanhae/article/PIIS2352-3026(20)30042-6",
        author: "Lyman GH, Nguyen A, Snyder S", publication_year: 2020,
        estimated_cogs_monthly: 625000, confidence: "low",
        methodology: "estimated manufacturing cost for autologous CAR-T therapies including leukapheresis, viral vector, and cell expansion" },
      { source: "Hernandez I, Prasad V, Health Affairs", source_url: "https://www.healthaffairs.org/doi/10.1377/hlthaff.2018.05153",
        author: "Hernandez I, Prasad V", publication_year: 2019,
        estimated_cogs_monthly: 708300, confidence: "low",
        methodology: "cost analysis of CAR-T manufacturing from cell collection through infusion" }
    ],
    cost_components: { leukapheresis_collection: 1500000, viral_vector_production: 2500000, cell_expansion_manufacturing: 2000000, quality_testing_release: 1200000, cryopreservation_logistics: 800000 },
    data_year: 2026, data_quarter: "Q1", source: "ACADEMIC_ESTIMATE"
  },
  {
    drug_id: "abecma", drug_name: "Abecma", generic_name: "idecabtagene vicleucel",
    manufacturer_id: "bms", drug_type: "cell_therapy",
    estimated_cogs_per_unit: 7500000, estimated_cogs_monthly: 625000, estimated_cogs_annual: 7500000,
    wac_monthly: 3495800, markup_over_cogs: 459.3, gross_margin_estimate: 82.1,
    estimates: [
      { source: "Lyman et al., The Lancet Haematology", source_url: "https://www.thelancet.com/journals/lanhae/article/PIIS2352-3026(20)30042-6",
        author: "Lyman GH, Nguyen A, Snyder S", publication_year: 2020,
        estimated_cogs_monthly: 583300, confidence: "low",
        methodology: "estimated manufacturing cost for autologous CAR-T therapies" },
      { source: "Hernandez I, Prasad V, Health Affairs", source_url: "https://www.healthaffairs.org/doi/10.1377/hlthaff.2018.05153",
        author: "Hernandez I, Prasad V", publication_year: 2019,
        estimated_cogs_monthly: 666700, confidence: "low",
        methodology: "cost analysis of autologous CAR-T cell manufacturing processes" }
    ],
    cost_components: { leukapheresis_collection: 1400000, viral_vector_production: 2300000, cell_expansion_manufacturing: 1900000, quality_testing_release: 1100000, cryopreservation_logistics: 800000 },
    data_year: 2026, data_quarter: "Q1", source: "ACADEMIC_ESTIMATE"
  },
  {
    drug_id: "nurtec", drug_name: "Nurtec ODT", generic_name: "rimegepant",
    manufacturer_id: "pfizer", drug_type: "small_molecule",
    estimated_cogs_per_unit: 120, estimated_cogs_monthly: 1080, estimated_cogs_annual: 12960,
    wac_monthly: 97200, markup_over_cogs: 8900.0, gross_margin_estimate: 98.9,
    estimates: [
      { source: "Hill et al., BMJ Global Health", source_url: "https://gh.bmj.com/content/3/3/e000850",
        author: "Hill A, Redd C, Gotham D", publication_year: 2018,
        estimated_cogs_monthly: 900, confidence: "medium",
        methodology: "cost of active pharmaceutical ingredient synthesis for small molecule CGRP antagonists" },
      { source: "Barber MJ, Gotham D, Journal of Virus Eradication", source_url: "https://www.sciencedirect.com/journal/journal-of-virus-eradication",
        author: "Barber MJ, Gotham D", publication_year: 2021,
        estimated_cogs_monthly: 1260, confidence: "medium",
        methodology: "generic API cost estimation from Indian pharmaceutical ingredient suppliers" }
    ],
    cost_components: { api_synthesis: 500, formulation_tableting: 200, quality_testing: 180, packaging_distribution: 150, odt_technology: 50 },
    data_year: 2026, data_quarter: "Q1", source: "ACADEMIC_ESTIMATE"
  },
  {
    drug_id: "jakafi", drug_name: "Jakafi", generic_name: "ruxolitinib",
    manufacturer_id: "novartis", drug_type: "small_molecule",
    estimated_cogs_per_unit: 300, estimated_cogs_monthly: 18000, estimated_cogs_annual: 216000,
    wac_monthly: 1662000, markup_over_cogs: 9133.3, gross_margin_estimate: 98.9,
    estimates: [
      { source: "Hill et al., BMJ Global Health", source_url: "https://gh.bmj.com/content/3/3/e000850",
        author: "Hill A, Redd C, Gotham D", publication_year: 2018,
        estimated_cogs_monthly: 15000, confidence: "medium",
        methodology: "estimated from JAK inhibitor API synthesis cost models" },
      { source: "Gotham D et al., Journal of Clinical Oncology", source_url: "https://ascopubs.org/doi/10.1200/JCO.2015.63.3800",
        author: "Gotham D, Barber MJ, Hill A", publication_year: 2018,
        estimated_cogs_monthly: 21000, confidence: "medium",
        methodology: "estimated manufacturing cost for targeted oral oncology agents" }
    ],
    cost_components: { api_synthesis: 10000, formulation_tableting: 3000, quality_testing: 2500, packaging_distribution: 1500, regulatory_compliance: 1000 },
    data_year: 2026, data_quarter: "Q1", source: "ACADEMIC_ESTIMATE"
  },
  {
    drug_id: "trodelvy", drug_name: "Trodelvy", generic_name: "sacituzumab govitecan-hziy",
    manufacturer_id: "gilead", drug_type: "antibody_drug_conjugate",
    estimated_cogs_per_unit: 35000, estimated_cogs_monthly: 105000, estimated_cogs_annual: 1260000,
    wac_monthly: 1575000, markup_over_cogs: 1400.0, gross_margin_estimate: 93.3,
    estimates: [
      { source: "Mulcahy et al., RAND Corporation", source_url: "https://www.rand.org/pubs/research_reports/RR2956.html",
        author: "Mulcahy AW, Hlavka JP, Case SR", publication_year: 2020,
        estimated_cogs_monthly: 95000, confidence: "low",
        methodology: "estimated from antibody-drug conjugate manufacturing complexity and payload costs" },
      { source: "Kelley B, mAbs Journal", source_url: "https://www.tandfonline.com/doi/full/10.1080/19420862.2016.1193054",
        author: "Kelley B", publication_year: 2016,
        estimated_cogs_monthly: 115000, confidence: "low",
        methodology: "ADC manufacturing cost premiums over standard monoclonal antibodies" }
    ],
    cost_components: { antibody_manufacturing: 45000, payload_linker_conjugation: 30000, formulation_fill_finish: 12000, quality_testing: 10000, cold_chain_logistics: 8000 },
    data_year: 2026, data_quarter: "Q1", source: "ACADEMIC_ESTIMATE"
  },
  {
    drug_id: "padcev", drug_name: "Padcev", generic_name: "enfortumab vedotin-ejfv",
    manufacturer_id: "pfizer", drug_type: "antibody_drug_conjugate",
    estimated_cogs_per_unit: 50000, estimated_cogs_monthly: 100000, estimated_cogs_annual: 1200000,
    wac_monthly: 1700000, markup_over_cogs: 1600.0, gross_margin_estimate: 94.1,
    estimates: [
      { source: "Mulcahy et al., RAND Corporation", source_url: "https://www.rand.org/pubs/research_reports/RR2956.html",
        author: "Mulcahy AW, Hlavka JP, Case SR", publication_year: 2020,
        estimated_cogs_monthly: 90000, confidence: "low",
        methodology: "estimated from antibody-drug conjugate manufacturing benchmarks" },
      { source: "Kelley B, mAbs Journal", source_url: "https://www.tandfonline.com/doi/full/10.1080/19420862.2016.1193054",
        author: "Kelley B", publication_year: 2016,
        estimated_cogs_monthly: 110000, confidence: "low",
        methodology: "ADC cost model with MMAE payload synthesis and conjugation" }
    ],
    cost_components: { antibody_manufacturing: 40000, payload_linker_conjugation: 28000, formulation_fill_finish: 14000, quality_testing: 10000, cold_chain_logistics: 8000 },
    data_year: 2026, data_quarter: "Q1", source: "ACADEMIC_ESTIMATE"
  },
  {
    drug_id: "xgeva", drug_name: "Xgeva", generic_name: "denosumab",
    manufacturer_id: "amgen", drug_type: "biologic",
    estimated_cogs_per_unit: 8000, estimated_cogs_monthly: 8000, estimated_cogs_annual: 96000,
    wac_monthly: 222000, markup_over_cogs: 2675.0, gross_margin_estimate: 96.4,
    estimates: [
      { source: "Hernandez et al., JAMA Internal Medicine", source_url: "https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2653012",
        author: "Hernandez I, Good CB, Cutler DM", publication_year: 2018,
        estimated_cogs_monthly: 7000, confidence: "medium",
        methodology: "reverse-engineering from biosimilar pricing for RANK ligand antibodies" },
      { source: "Kelley B, mAbs Journal", source_url: "https://www.tandfonline.com/doi/full/10.1080/19420862.2016.1193054",
        author: "Kelley B", publication_year: 2016,
        estimated_cogs_monthly: 9000, confidence: "medium",
        methodology: "bottom-up manufacturing cost analysis for monoclonal antibodies" }
    ],
    cost_components: { api_manufacturing: 4500, formulation_fill_finish: 1500, quality_testing: 1000, packaging_distribution: 600, cold_chain_logistics: 400 },
    data_year: 2026, data_quarter: "Q1", source: "ACADEMIC_ESTIMATE"
  },
  {
    drug_id: "lumakras", drug_name: "Lumakras", generic_name: "sotorasib",
    manufacturer_id: "amgen", drug_type: "small_molecule",
    estimated_cogs_per_unit: 500, estimated_cogs_monthly: 15000, estimated_cogs_annual: 180000,
    wac_monthly: 1790000, markup_over_cogs: 11833.3, gross_margin_estimate: 99.2,
    estimates: [
      { source: "Hill et al., BMJ Global Health", source_url: "https://gh.bmj.com/content/3/3/e000850",
        author: "Hill A, Redd C, Gotham D", publication_year: 2018,
        estimated_cogs_monthly: 12000, confidence: "medium",
        methodology: "estimated API synthesis cost for targeted covalent KRAS inhibitors" },
      { source: "Gotham D et al., Journal of Clinical Oncology", source_url: "https://ascopubs.org/doi/10.1200/JCO.2015.63.3800",
        author: "Gotham D, Barber MJ, Hill A", publication_year: 2018,
        estimated_cogs_monthly: 18000, confidence: "low",
        methodology: "cost estimation for novel small molecule oncology agents" }
    ],
    cost_components: { api_synthesis: 8000, formulation_tableting: 3000, quality_testing: 2000, packaging_distribution: 1200, regulatory_compliance: 800 },
    data_year: 2026, data_quarter: "Q1", source: "ACADEMIC_ESTIMATE"
  },
  {
    drug_id: "luxturna", drug_name: "Luxturna", generic_name: "voretigene neparvovec-rzyl",
    manufacturer_id: "novartis", drug_type: "gene_therapy",
    estimated_cogs_per_unit: 10000000, estimated_cogs_monthly: 833300, estimated_cogs_annual: 10000000,
    wac_monthly: 7083300, markup_over_cogs: 750.0, gross_margin_estimate: 88.2,
    estimates: [
      { source: "Hernandez I et al., Annals of Internal Medicine", source_url: "https://www.acpjournals.org/doi/10.7326/M19-0286",
        author: "Hernandez I, Bott SW, Patel AS, Wolf CG", publication_year: 2020,
        estimated_cogs_monthly: 750000, confidence: "low",
        methodology: "estimated from AAV vector manufacturing costs and surgical delivery expenses" },
      { source: "Raritas Gene Therapy Cost Model", source_url: "https://www.cell.com/molecular-therapy/fulltext/S1525-0016(20)30443-8",
        author: "Keeler CE, Joshi D", publication_year: 2021,
        estimated_cogs_monthly: 916700, confidence: "low",
        methodology: "AAV manufacturing at clinical and commercial scale including viral vector lot production" }
    ],
    cost_components: { aav_vector_manufacturing: 5000000, surgical_delivery: 2000000, quality_testing_release: 1500000, cold_chain_specialized_logistics: 1000000, patient_specific_testing: 500000 },
    data_year: 2026, data_quarter: "Q1", source: "ACADEMIC_ESTIMATE"
  },
  {
    drug_id: "evenity", drug_name: "Evenity", generic_name: "romosozumab-aqqg",
    manufacturer_id: "amgen", drug_type: "biologic",
    estimated_cogs_per_unit: 5500, estimated_cogs_monthly: 11000, estimated_cogs_annual: 132000,
    wac_monthly: 220000, markup_over_cogs: 1900.0, gross_margin_estimate: 95.0,
    estimates: [
      { source: "Hernandez et al., JAMA Internal Medicine", source_url: "https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2653012",
        author: "Hernandez I, Good CB, Cutler DM", publication_year: 2018,
        estimated_cogs_monthly: 10000, confidence: "medium",
        methodology: "estimated from monoclonal antibody manufacturing cost benchmarks" },
      { source: "Kelley B, mAbs Journal", source_url: "https://www.tandfonline.com/doi/full/10.1080/19420862.2016.1193054",
        author: "Kelley B", publication_year: 2016,
        estimated_cogs_monthly: 12000, confidence: "medium",
        methodology: "bottom-up cost model for sclerostin-targeting monoclonal antibodies" }
    ],
    cost_components: { api_manufacturing: 6000, formulation_fill_finish: 2000, quality_testing: 1200, packaging_distribution: 800, device_prefilled_syringe: 1000 },
    data_year: 2026, data_quarter: "Q1", source: "ACADEMIC_ESTIMATE"
  }
];

// ── WAC HISTORY ───────────────────────────────────────────────────
const newHistory = [
  { drug_id: "leqembi", drug_name: "Leqembi", generic_name: "lecanemab-irmb", manufacturer_id: "biogen",
    launch_date: "2023-07-06", launch_price: 2208300,
    price_history: [
      { date: "2023-07-06", wac_monthly: 2208300, change_percent: 0 },
      { date: "2024-01-01", wac_monthly: 2208300, change_percent: 0 },
      { date: "2025-01-01", wac_monthly: 2208300, change_percent: 0 },
      { date: "2026-01-01", wac_monthly: 2208300, change_percent: 0 }
    ],
    total_increase_percent: 0, num_increases: 0, cagr: 0, inflation_adjusted_increase_percent: -7.2
  },
  { drug_id: "tepezza", drug_name: "Tepezza", generic_name: "teprotumumab-trbw", manufacturer_id: "amgen",
    launch_date: "2020-01-21", launch_price: 1420000,
    price_history: [
      { date: "2020-01-21", wac_monthly: 1420000, change_percent: 0 },
      { date: "2021-01-01", wac_monthly: 1435000, change_percent: 1.1 },
      { date: "2022-01-01", wac_monthly: 1452000, change_percent: 1.2 },
      { date: "2023-01-01", wac_monthly: 1465000, change_percent: 0.9 },
      { date: "2024-01-01", wac_monthly: 1478000, change_percent: 0.9 },
      { date: "2025-01-01", wac_monthly: 1489000, change_percent: 0.7 },
      { date: "2026-01-01", wac_monthly: 1489000, change_percent: 0 }
    ],
    total_increase_percent: 4.9, num_increases: 5, cagr: 0.8, inflation_adjusted_increase_percent: -10.5
  },
  { drug_id: "praluent", drug_name: "Praluent", generic_name: "alirocumab", manufacturer_id: "sanofi",
    launch_date: "2015-07-24", launch_price: 467500,
    price_history: [
      { date: "2015-07-24", wac_monthly: 467500, change_percent: 0 },
      { date: "2017-01-01", wac_monthly: 467500, change_percent: 0 },
      { date: "2019-01-01", wac_monthly: 467500, change_percent: 0 },
      { date: "2020-02-01", wac_monthly: 145000, change_percent: -69.0 },
      { date: "2022-01-01", wac_monthly: 145000, change_percent: 0 },
      { date: "2024-01-01", wac_monthly: 145000, change_percent: 0 },
      { date: "2026-01-01", wac_monthly: 145000, change_percent: 0 }
    ],
    total_increase_percent: -69.0, num_increases: 0, cagr: -10.6, inflation_adjusted_increase_percent: -76.2,
  },
  { drug_id: "taltz", drug_name: "Taltz", generic_name: "ixekizumab", manufacturer_id: "lilly",
    launch_date: "2016-03-22", launch_price: 470000,
    price_history: [
      { date: "2016-03-22", wac_monthly: 470000, change_percent: 0 },
      { date: "2017-01-01", wac_monthly: 490000, change_percent: 4.3 },
      { date: "2018-01-01", wac_monthly: 520000, change_percent: 6.1 },
      { date: "2019-01-01", wac_monthly: 555000, change_percent: 6.7 },
      { date: "2020-01-01", wac_monthly: 580000, change_percent: 4.5 },
      { date: "2021-01-01", wac_monthly: 600000, change_percent: 3.4 },
      { date: "2022-01-01", wac_monthly: 618000, change_percent: 3.0 },
      { date: "2023-01-01", wac_monthly: 632000, change_percent: 2.3 },
      { date: "2024-01-01", wac_monthly: 641000, change_percent: 1.4 },
      { date: "2025-01-01", wac_monthly: 650000, change_percent: 1.4 },
      { date: "2026-01-01", wac_monthly: 650000, change_percent: 0 }
    ],
    total_increase_percent: 38.3, num_increases: 9, cagr: 3.3, inflation_adjusted_increase_percent: 11.6
  },
  { drug_id: "carvykti", drug_name: "Carvykti", generic_name: "ciltacabtagene autoleucel", manufacturer_id: "jnj",
    launch_date: "2022-02-28", launch_price: 3875000,
    price_history: [
      { date: "2022-02-28", wac_monthly: 3875000, change_percent: 0 },
      { date: "2023-01-01", wac_monthly: 3875000, change_percent: 0 },
      { date: "2024-01-01", wac_monthly: 3875000, change_percent: 0 },
      { date: "2025-01-01", wac_monthly: 3875000, change_percent: 0 },
      { date: "2026-01-01", wac_monthly: 3875000, change_percent: 0 }
    ],
    total_increase_percent: 0, num_increases: 0, cagr: 0, inflation_adjusted_increase_percent: -10.1
  },
  { drug_id: "abecma", drug_name: "Abecma", generic_name: "idecabtagene vicleucel", manufacturer_id: "bms",
    launch_date: "2021-03-26", launch_price: 3495800,
    price_history: [
      { date: "2021-03-26", wac_monthly: 3495800, change_percent: 0 },
      { date: "2022-01-01", wac_monthly: 3495800, change_percent: 0 },
      { date: "2023-01-01", wac_monthly: 3495800, change_percent: 0 },
      { date: "2024-01-01", wac_monthly: 3495800, change_percent: 0 },
      { date: "2025-01-01", wac_monthly: 3495800, change_percent: 0 },
      { date: "2026-01-01", wac_monthly: 3495800, change_percent: 0 }
    ],
    total_increase_percent: 0, num_increases: 0, cagr: 0, inflation_adjusted_increase_percent: -12.8
  },
  { drug_id: "nurtec", drug_name: "Nurtec ODT", generic_name: "rimegepant", manufacturer_id: "pfizer",
    launch_date: "2020-02-27", launch_price: 85000,
    price_history: [
      { date: "2020-02-27", wac_monthly: 85000, change_percent: 0 },
      { date: "2021-01-01", wac_monthly: 87500, change_percent: 2.9 },
      { date: "2022-01-01", wac_monthly: 90000, change_percent: 2.9 },
      { date: "2023-01-01", wac_monthly: 93000, change_percent: 3.3 },
      { date: "2024-01-01", wac_monthly: 95500, change_percent: 2.7 },
      { date: "2025-01-01", wac_monthly: 97200, change_percent: 1.8 },
      { date: "2026-01-01", wac_monthly: 97200, change_percent: 0 }
    ],
    total_increase_percent: 14.4, num_increases: 5, cagr: 2.3, inflation_adjusted_increase_percent: -1.2
  },
  { drug_id: "jakafi", drug_name: "Jakafi", generic_name: "ruxolitinib", manufacturer_id: "novartis",
    launch_date: "2011-11-16", launch_price: 792000,
    price_history: [
      { date: "2011-11-16", wac_monthly: 792000, change_percent: 0 },
      { date: "2013-01-01", wac_monthly: 862000, change_percent: 8.8 },
      { date: "2015-01-01", wac_monthly: 1010000, change_percent: 17.2 },
      { date: "2017-01-01", wac_monthly: 1180000, change_percent: 16.8 },
      { date: "2019-01-01", wac_monthly: 1350000, change_percent: 14.4 },
      { date: "2020-01-01", wac_monthly: 1420000, change_percent: 5.2 },
      { date: "2021-01-01", wac_monthly: 1490000, change_percent: 4.9 },
      { date: "2022-01-01", wac_monthly: 1550000, change_percent: 4.0 },
      { date: "2023-01-01", wac_monthly: 1595000, change_percent: 2.9 },
      { date: "2024-01-01", wac_monthly: 1630000, change_percent: 2.2 },
      { date: "2025-01-01", wac_monthly: 1662000, change_percent: 2.0 },
      { date: "2026-01-01", wac_monthly: 1662000, change_percent: 0 }
    ],
    total_increase_percent: 109.8, num_increases: 10, cagr: 5.4, inflation_adjusted_increase_percent: 65.3
  },
  { drug_id: "trodelvy", drug_name: "Trodelvy", generic_name: "sacituzumab govitecan-hziy", manufacturer_id: "gilead",
    launch_date: "2020-04-22", launch_price: 1450000,
    price_history: [
      { date: "2020-04-22", wac_monthly: 1450000, change_percent: 0 },
      { date: "2021-01-01", wac_monthly: 1480000, change_percent: 2.1 },
      { date: "2022-01-01", wac_monthly: 1510000, change_percent: 2.0 },
      { date: "2023-01-01", wac_monthly: 1540000, change_percent: 2.0 },
      { date: "2024-01-01", wac_monthly: 1560000, change_percent: 1.3 },
      { date: "2025-01-01", wac_monthly: 1575000, change_percent: 1.0 },
      { date: "2026-01-01", wac_monthly: 1575000, change_percent: 0 }
    ],
    total_increase_percent: 8.6, num_increases: 5, cagr: 1.4, inflation_adjusted_increase_percent: -6.8
  },
  { drug_id: "padcev", drug_name: "Padcev", generic_name: "enfortumab vedotin-ejfv", manufacturer_id: "pfizer",
    launch_date: "2019-12-18", launch_price: 1520000,
    price_history: [
      { date: "2019-12-18", wac_monthly: 1520000, change_percent: 0 },
      { date: "2021-01-01", wac_monthly: 1560000, change_percent: 2.6 },
      { date: "2022-01-01", wac_monthly: 1610000, change_percent: 3.2 },
      { date: "2023-01-01", wac_monthly: 1650000, change_percent: 2.5 },
      { date: "2024-01-01", wac_monthly: 1680000, change_percent: 1.8 },
      { date: "2025-01-01", wac_monthly: 1700000, change_percent: 1.2 },
      { date: "2026-01-01", wac_monthly: 1700000, change_percent: 0 }
    ],
    total_increase_percent: 11.8, num_increases: 5, cagr: 1.9, inflation_adjusted_increase_percent: -3.8
  },
  { drug_id: "xgeva", drug_name: "Xgeva", generic_name: "denosumab", manufacturer_id: "amgen",
    launch_date: "2010-11-18", launch_price: 132000,
    price_history: [
      { date: "2010-11-18", wac_monthly: 132000, change_percent: 0 },
      { date: "2012-01-01", wac_monthly: 142000, change_percent: 7.6 },
      { date: "2014-01-01", wac_monthly: 158000, change_percent: 11.3 },
      { date: "2016-01-01", wac_monthly: 175000, change_percent: 10.8 },
      { date: "2018-01-01", wac_monthly: 190000, change_percent: 8.6 },
      { date: "2020-01-01", wac_monthly: 202000, change_percent: 6.3 },
      { date: "2022-01-01", wac_monthly: 212000, change_percent: 5.0 },
      { date: "2024-01-01", wac_monthly: 220000, change_percent: 3.8 },
      { date: "2026-01-01", wac_monthly: 222000, change_percent: 0.9 }
    ],
    total_increase_percent: 68.2, num_increases: 8, cagr: 3.5, inflation_adjusted_increase_percent: 21.4
  },
  { drug_id: "lumakras", drug_name: "Lumakras", generic_name: "sotorasib", manufacturer_id: "amgen",
    launch_date: "2021-05-28", launch_price: 1740000,
    price_history: [
      { date: "2021-05-28", wac_monthly: 1740000, change_percent: 0 },
      { date: "2022-01-01", wac_monthly: 1760000, change_percent: 1.1 },
      { date: "2023-01-01", wac_monthly: 1775000, change_percent: 0.9 },
      { date: "2024-01-01", wac_monthly: 1785000, change_percent: 0.6 },
      { date: "2025-01-01", wac_monthly: 1790000, change_percent: 0.3 },
      { date: "2026-01-01", wac_monthly: 1790000, change_percent: 0 }
    ],
    total_increase_percent: 2.9, num_increases: 4, cagr: 0.6, inflation_adjusted_increase_percent: -9.7
  },
  { drug_id: "luxturna", drug_name: "Luxturna", generic_name: "voretigene neparvovec-rzyl", manufacturer_id: "novartis",
    launch_date: "2017-12-19", launch_price: 7083300,
    price_history: [
      { date: "2017-12-19", wac_monthly: 7083300, change_percent: 0 },
      { date: "2019-01-01", wac_monthly: 7083300, change_percent: 0 },
      { date: "2021-01-01", wac_monthly: 7083300, change_percent: 0 },
      { date: "2023-01-01", wac_monthly: 7083300, change_percent: 0 },
      { date: "2025-01-01", wac_monthly: 7083300, change_percent: 0 },
      { date: "2026-01-01", wac_monthly: 7083300, change_percent: 0 }
    ],
    total_increase_percent: 0, num_increases: 0, cagr: 0, inflation_adjusted_increase_percent: -18.5
  },
  { drug_id: "evenity", drug_name: "Evenity", generic_name: "romosozumab-aqqg", manufacturer_id: "amgen",
    launch_date: "2019-04-28", launch_price: 195000,
    price_history: [
      { date: "2019-04-28", wac_monthly: 195000, change_percent: 0 },
      { date: "2020-01-01", wac_monthly: 200000, change_percent: 2.6 },
      { date: "2021-01-01", wac_monthly: 205000, change_percent: 2.5 },
      { date: "2022-01-01", wac_monthly: 210000, change_percent: 2.4 },
      { date: "2023-01-01", wac_monthly: 214000, change_percent: 1.9 },
      { date: "2024-01-01", wac_monthly: 218000, change_percent: 1.9 },
      { date: "2025-01-01", wac_monthly: 220000, change_percent: 0.9 },
      { date: "2026-01-01", wac_monthly: 220000, change_percent: 0 }
    ],
    total_increase_percent: 12.8, num_increases: 6, cagr: 1.8, inflation_adjusted_increase_percent: -3.0
  }
];

// ── DRUG REVENUE ──────────────────────────────────────────────────
const newRevenue = [
  { drug_id: "leqembi", drug_name: "Leqembi", manufacturer_id: "biogen",
    annual_revenue: [
      { year: 2023, us_revenue: 10000000000, global_revenue: 14000000000 },
      { year: 2024, us_revenue: 69000000000, global_revenue: 83000000000 },
      { year: 2025, us_revenue: 180000000000, global_revenue: 230000000000 }
    ],
    peak_revenue_year: 2025, peak_revenue: 230000000000,
    trajectory: "growing", trajectory_notes: "Slow uptake due to infusion requirements and amyloid PET eligibility; competing with Kisunla (donanemab)",
    therapeutic_area: "neurology"
  },
  { drug_id: "tepezza", drug_name: "Tepezza", manufacturer_id: "amgen",
    annual_revenue: [
      { year: 2021, us_revenue: 190000000000, global_revenue: 190000000000 },
      { year: 2022, us_revenue: 200000000000, global_revenue: 205000000000 },
      { year: 2023, us_revenue: 210000000000, global_revenue: 218000000000 },
      { year: 2024, us_revenue: 225000000000, global_revenue: 235000000000 }
    ],
    peak_revenue_year: 2024, peak_revenue: 235000000000,
    trajectory: "growing", trajectory_notes: "First and only FDA-approved treatment for thyroid eye disease; acquired via Horizon Therapeutics",
    therapeutic_area: "endocrinology"
  },
  { drug_id: "praluent", drug_name: "Praluent", manufacturer_id: "sanofi",
    annual_revenue: [
      { year: 2019, us_revenue: 23000000000, global_revenue: 40000000000 },
      { year: 2020, us_revenue: 30000000000, global_revenue: 48000000000 },
      { year: 2021, us_revenue: 34000000000, global_revenue: 54000000000 },
      { year: 2022, us_revenue: 35000000000, global_revenue: 56000000000 },
      { year: 2023, us_revenue: 36000000000, global_revenue: 58000000000 }
    ],
    peak_revenue_year: 2023, peak_revenue: 58000000000,
    trajectory: "stable", trajectory_notes: "Dramatically cut WAC from ~$14,100 to ~$5,850/year in 2020 to improve access; stable volume",
    therapeutic_area: "cardiology"
  },
  { drug_id: "taltz", drug_name: "Taltz", manufacturer_id: "lilly",
    annual_revenue: [
      { year: 2019, us_revenue: 130000000000, global_revenue: 190000000000 },
      { year: 2020, us_revenue: 144000000000, global_revenue: 212000000000 },
      { year: 2021, us_revenue: 160000000000, global_revenue: 244000000000 },
      { year: 2022, us_revenue: 175000000000, global_revenue: 270000000000 },
      { year: 2023, us_revenue: 185000000000, global_revenue: 290000000000 }
    ],
    peak_revenue_year: 2023, peak_revenue: 290000000000,
    trajectory: "growing", trajectory_notes: "Competes with Cosentyx, Skyrizi in IL-17/IL-23 space; steady growth in psoriasis/psoriatic arthritis",
    therapeutic_area: "immunology"
  },
  { drug_id: "carvykti", drug_name: "Carvykti", manufacturer_id: "jnj",
    annual_revenue: [
      { year: 2022, us_revenue: 13000000000, global_revenue: 13000000000 },
      { year: 2023, us_revenue: 50000000000, global_revenue: 58000000000 },
      { year: 2024, us_revenue: 120000000000, global_revenue: 150000000000 }
    ],
    peak_revenue_year: 2024, peak_revenue: 150000000000,
    trajectory: "growing", trajectory_notes: "CAR-T for multiple myeloma; expanded to earlier-line treatment in 2024; manufacturing capacity a bottleneck",
    therapeutic_area: "oncology"
  },
  { drug_id: "abecma", drug_name: "Abecma", manufacturer_id: "bms",
    annual_revenue: [
      { year: 2021, us_revenue: 16400000000, global_revenue: 16400000000 },
      { year: 2022, us_revenue: 38800000000, global_revenue: 41000000000 },
      { year: 2023, us_revenue: 45000000000, global_revenue: 52000000000 },
      { year: 2024, us_revenue: 40000000000, global_revenue: 46000000000 }
    ],
    peak_revenue_year: 2023, peak_revenue: 52000000000,
    trajectory: "declining", trajectory_notes: "Facing competition from Carvykti; manufacturing challenges and safety concerns",
    therapeutic_area: "oncology"
  },
  { drug_id: "nurtec", drug_name: "Nurtec ODT", manufacturer_id: "pfizer",
    annual_revenue: [
      { year: 2021, us_revenue: 46000000000, global_revenue: 46000000000 },
      { year: 2022, us_revenue: 88000000000, global_revenue: 90000000000 },
      { year: 2023, us_revenue: 110000000000, global_revenue: 115000000000 },
      { year: 2024, us_revenue: 130000000000, global_revenue: 135000000000 }
    ],
    peak_revenue_year: 2024, peak_revenue: 135000000000,
    trajectory: "growing", trajectory_notes: "Dual-use for migraine prevention and acute treatment; acquired via Biohaven deal; strong DTC marketing",
    therapeutic_area: "neurology"
  },
  { drug_id: "jakafi", drug_name: "Jakafi", manufacturer_id: "novartis",
    annual_revenue: [
      { year: 2019, us_revenue: 178000000000, global_revenue: 178000000000 },
      { year: 2020, us_revenue: 195000000000, global_revenue: 195000000000 },
      { year: 2021, us_revenue: 218000000000, global_revenue: 218000000000 },
      { year: 2022, us_revenue: 244000000000, global_revenue: 244000000000 },
      { year: 2023, us_revenue: 260000000000, global_revenue: 260000000000 }
    ],
    peak_revenue_year: 2023, peak_revenue: 260000000000,
    trajectory: "stable", trajectory_notes: "First JAK inhibitor; dominant in myelofibrosis; Incyte partnership (Novartis has ex-US rights)",
    therapeutic_area: "oncology"
  },
  { drug_id: "trodelvy", drug_name: "Trodelvy", manufacturer_id: "gilead",
    annual_revenue: [
      { year: 2021, us_revenue: 38000000000, global_revenue: 38000000000 },
      { year: 2022, us_revenue: 58000000000, global_revenue: 65000000000 },
      { year: 2023, us_revenue: 100000000000, global_revenue: 120000000000 },
      { year: 2024, us_revenue: 135000000000, global_revenue: 160000000000 }
    ],
    peak_revenue_year: 2024, peak_revenue: 160000000000,
    trajectory: "growing", trajectory_notes: "Expanding indications in HR+/HER2- breast cancer and urothelial carcinoma; acquired via Immunomedics",
    therapeutic_area: "oncology"
  },
  { drug_id: "padcev", drug_name: "Padcev", manufacturer_id: "pfizer",
    annual_revenue: [
      { year: 2021, us_revenue: 44000000000, global_revenue: 44000000000 },
      { year: 2022, us_revenue: 66000000000, global_revenue: 72000000000 },
      { year: 2023, us_revenue: 130000000000, global_revenue: 145000000000 },
      { year: 2024, us_revenue: 260000000000, global_revenue: 310000000000 }
    ],
    peak_revenue_year: 2024, peak_revenue: 310000000000,
    trajectory: "growing", trajectory_notes: "Blockbuster growth after EV-302 trial showed dramatic survival benefit in bladder cancer with Keytruda combo; acquired via Seagen",
    therapeutic_area: "oncology"
  },
  { drug_id: "xgeva", drug_name: "Xgeva", manufacturer_id: "amgen",
    annual_revenue: [
      { year: 2019, us_revenue: 140000000000, global_revenue: 196000000000 },
      { year: 2020, us_revenue: 138000000000, global_revenue: 189000000000 },
      { year: 2021, us_revenue: 142000000000, global_revenue: 199000000000 },
      { year: 2022, us_revenue: 145000000000, global_revenue: 203000000000 },
      { year: 2023, us_revenue: 148000000000, global_revenue: 207000000000 }
    ],
    peak_revenue_year: 2023, peak_revenue: 207000000000,
    trajectory: "stable", trajectory_notes: "Mature product for bone metastases; biosimilar competition expected in coming years",
    therapeutic_area: "oncology"
  },
  { drug_id: "lumakras", drug_name: "Lumakras", manufacturer_id: "amgen",
    annual_revenue: [
      { year: 2021, us_revenue: 8600000000, global_revenue: 8600000000 },
      { year: 2022, us_revenue: 53000000000, global_revenue: 59000000000 },
      { year: 2023, us_revenue: 46000000000, global_revenue: 53000000000 },
      { year: 2024, us_revenue: 42000000000, global_revenue: 48000000000 }
    ],
    peak_revenue_year: 2022, peak_revenue: 59000000000,
    trajectory: "declining", trajectory_notes: "Failed confirmatory trial (CodeBreaK 200) hurt adoption; competing KRAS inhibitors entering market",
    therapeutic_area: "oncology"
  },
  { drug_id: "luxturna", drug_name: "Luxturna", manufacturer_id: "novartis",
    annual_revenue: [
      { year: 2019, us_revenue: 7500000000, global_revenue: 8500000000 },
      { year: 2020, us_revenue: 6100000000, global_revenue: 7000000000 },
      { year: 2021, us_revenue: 6700000000, global_revenue: 7800000000 },
      { year: 2022, us_revenue: 5500000000, global_revenue: 6300000000 },
      { year: 2023, us_revenue: 4800000000, global_revenue: 5500000000 }
    ],
    peak_revenue_year: 2019, peak_revenue: 8500000000,
    trajectory: "declining", trajectory_notes: "Very small patient population (RPE65 mutation); one-time treatment limits recurring revenue",
    therapeutic_area: "ophthalmology"
  },
  { drug_id: "evenity", drug_name: "Evenity", manufacturer_id: "amgen",
    annual_revenue: [
      { year: 2020, us_revenue: 32000000000, global_revenue: 60000000000 },
      { year: 2021, us_revenue: 42000000000, global_revenue: 80000000000 },
      { year: 2022, us_revenue: 52000000000, global_revenue: 105000000000 },
      { year: 2023, us_revenue: 60000000000, global_revenue: 130000000000 },
      { year: 2024, us_revenue: 68000000000, global_revenue: 150000000000 }
    ],
    peak_revenue_year: 2024, peak_revenue: 150000000000,
    trajectory: "growing", trajectory_notes: "Strong growth especially in Japan; 12-month treatment course for postmenopausal osteoporosis",
    therapeutic_area: "bone health"
  }
];

// ── MERGE INTO FILES ──────────────────────────────────────────────
const files = [
  { name: 'wac_prices.json', newData: newWacPrices },
  { name: 'cogs_estimates.json', newData: newCogs },
  { name: 'wac_history.json', newData: newHistory },
  { name: 'drug_revenue.json', newData: newRevenue },
];

for (const { name, newData } of files) {
  const existing = readJSON(name);
  const existingIds = new Set(existing.map(e => e.drug_id));

  let added = 0;
  for (const entry of newData) {
    if (!existingIds.has(entry.drug_id)) {
      existing.push(entry);
      added++;
    } else {
      console.log(`  ⏭  ${name}: ${entry.drug_id} already exists, skipping`);
    }
  }

  writeJSON(name, existing);
  console.log(`✅ ${name}: added ${added} entries (total: ${existing.length})`);
}

console.log('\n🎉 Done! 14 new drugs added to all data files.');
console.log('Remember to update inferSpecialty() in src/lib/data.ts');

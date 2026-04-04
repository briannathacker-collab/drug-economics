#!/usr/bin/env node
/**
 * Add 5 additional Merck drugs to all relevant data files:
 * 1. Januvia (sitagliptin) — diabetes, DPP-4 inhibitor, IRA negotiated
 * 2. Gardasil 9 (HPV vaccine) — vaccines, massive global revenue
 * 3. Bridion (sugammadex) — anesthesiology, neuromuscular blockade reversal
 * 4. Welireg (belzutifan) — oncology, first-in-class HIF-2α inhibitor
 * 5. Lagevrio (molnupiravir) — infectious disease, COVID-19 antiviral
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const dataDir = join(import.meta.dirname, "..", "data");

function readJson(filename) {
  return JSON.parse(readFileSync(join(dataDir, filename), "utf-8"));
}

function writeJson(filename, data) {
  writeFileSync(join(dataDir, filename), JSON.stringify(data, null, 2) + "\n");
}

// ─── WAC PRICES ──────────────────────────────────────────────
const newWac = [
  {
    drug_id: "januvia",
    drug_name: "Januvia",
    generic_name: "sitagliptin",
    manufacturer_id: "merck",
    dosage_form: "oral tablet",
    strength: "100 mg",
    wac_per_unit: 1770,
    wac_monthly: 53100,
    wac_annual: 637200,
    ndc: "00006-0277-31",
    therapeutic_area: "diabetes",
    route_of_administration: "oral",
    units_per_month: 30,
    effective_date: "2024-01-01",
    note: "Selected for IRA Medicare price negotiation; maximum fair price of $113/month effective January 2026"
  },
  {
    drug_id: "gardasil",
    drug_name: "Gardasil 9",
    generic_name: "human papillomavirus 9-valent vaccine, recombinant",
    manufacturer_id: "merck",
    dosage_form: "intramuscular injection",
    strength: "0.5 mL",
    wac_per_unit: 30600,
    wac_monthly: 30600,
    wac_annual: 91800,
    ndc: "00006-4119-03",
    therapeutic_area: "vaccines",
    route_of_administration: "intramuscular",
    units_per_month: 1,
    effective_date: "2024-01-01",
    note: "Per-dose pricing; standard series is 2-3 doses over 6-12 months depending on age at initiation"
  },
  {
    drug_id: "bridion",
    drug_name: "Bridion",
    generic_name: "sugammadex",
    manufacturer_id: "merck",
    dosage_form: "intravenous injection",
    strength: "200 mg/2 mL",
    wac_per_unit: 14800,
    wac_monthly: 14800,
    wac_annual: 177600,
    ndc: "00006-0910-01",
    therapeutic_area: "anesthesiology",
    route_of_administration: "intravenous",
    units_per_month: 1,
    effective_date: "2024-01-01",
    note: "Single-dose neuromuscular blockade reversal agent; per-administration pricing; typically one vial per surgical procedure"
  },
  {
    drug_id: "welireg",
    drug_name: "Welireg",
    generic_name: "belzutifan",
    manufacturer_id: "merck",
    dosage_form: "oral tablet",
    strength: "40 mg",
    wac_per_unit: 21800,
    wac_monthly: 1962000,
    wac_annual: 23544000,
    ndc: "00006-5042-30",
    therapeutic_area: "oncology",
    route_of_administration: "oral",
    units_per_month: 90,
    effective_date: "2024-01-01",
    note: "First-in-class HIF-2α inhibitor; 120 mg daily (3 x 40 mg tablets); approved for VHL-associated tumors and advanced RCC"
  },
  {
    drug_id: "lagevrio",
    drug_name: "Lagevrio",
    generic_name: "molnupiravir",
    manufacturer_id: "merck",
    dosage_form: "oral capsule",
    strength: "200 mg",
    wac_per_unit: 1750,
    wac_monthly: 70000,
    wac_annual: 70000,
    ndc: "00006-5055-40",
    therapeutic_area: "infectious_disease",
    route_of_administration: "oral",
    units_per_month: 40,
    effective_date: "2024-01-01",
    note: "5-day treatment course (800 mg twice daily = 40 capsules); course cost shown; developed in partnership with Ridgeback Biotherapeutics"
  }
];

// ─── COGS ESTIMATES ──────────────────────────────────────────
const newCogs = [
  {
    drug_id: "januvia",
    drug_name: "Januvia",
    generic_name: "sitagliptin",
    manufacturer_id: "merck",
    drug_type: "small_molecule",
    estimated_cogs_per_unit: 8,
    estimated_cogs_monthly: 240,
    estimated_cogs_annual: 2880,
    wac_monthly: 53100,
    markup_over_cogs: 22025,
    gross_margin_estimate: 99.5,
    estimates: [
      {
        source: "Hill et al., Journal of Virus Eradication",
        source_url: "https://doi.org/10.1016/S2055-6640(20)30053-4",
        author: "Hill A, Gotham D, Fortunak J",
        publication_year: 2016,
        estimated_cogs_monthly: 200,
        confidence: "high",
        methodology: "API cost analysis based on Indian generic manufacturer pricing and synthesis routes"
      },
      {
        source: "Wouters et al., JAMA",
        source_url: "https://jamanetwork.com/journals/jama/fullarticle/2762308",
        author: "Wouters OJ, McKee M, Luyten J",
        publication_year: 2020,
        estimated_cogs_monthly: 280,
        confidence: "medium",
        methodology: "comparative analysis of generic API costs and manufacturing overheads for small molecules"
      }
    ],
    cost_components: {
      api_manufacturing: 120,
      formulation_tableting: 50,
      quality_testing: 30,
      packaging_distribution: 40
    }
  },
  {
    drug_id: "gardasil",
    drug_name: "Gardasil 9",
    generic_name: "human papillomavirus 9-valent vaccine, recombinant",
    manufacturer_id: "merck",
    drug_type: "vaccine",
    estimated_cogs_per_unit: 1800,
    estimated_cogs_monthly: 1800,
    estimated_cogs_annual: 5400,
    wac_monthly: 30600,
    markup_over_cogs: 1600,
    gross_margin_estimate: 94.1,
    estimates: [
      {
        source: "Clendinen et al., Vaccine",
        source_url: "https://doi.org/10.1016/j.vaccine.2016.11.044",
        author: "Clendinen C, Zhang Y, Warber R, et al.",
        publication_year: 2016,
        estimated_cogs_monthly: 1500,
        confidence: "medium",
        methodology: "bottom-up cost modeling for recombinant yeast-expressed virus-like particle vaccines"
      },
      {
        source: "WHO COGS analysis for HPV vaccines",
        source_url: "https://www.who.int/publications/i/item/9789241515580",
        author: "WHO Essential Medicines and Health Products",
        publication_year: 2020,
        estimated_cogs_monthly: 2100,
        confidence: "medium",
        methodology: "manufacturing cost analysis for multi-antigen recombinant vaccines at scale"
      }
    ],
    cost_components: {
      antigen_production_yeast_vlp: 800,
      adjuvant_amorphous_aluminum: 200,
      formulation_fill_finish: 350,
      quality_testing: 250,
      cold_chain_logistics: 200
    }
  },
  {
    drug_id: "bridion",
    drug_name: "Bridion",
    generic_name: "sugammadex",
    manufacturer_id: "merck",
    drug_type: "small_molecule",
    estimated_cogs_per_unit: 800,
    estimated_cogs_monthly: 800,
    estimated_cogs_annual: 9600,
    wac_monthly: 14800,
    markup_over_cogs: 1750,
    gross_margin_estimate: 94.6,
    estimates: [
      {
        source: "Raft et al., Anaesthesia",
        source_url: "https://doi.org/10.1111/anae.14485",
        author: "Raft J, Betala Belinga JF, Jurkolow G, et al.",
        publication_year: 2018,
        estimated_cogs_monthly: 700,
        confidence: "low",
        methodology: "estimated from modified gamma-cyclodextrin synthesis costs and sterile injectable manufacturing"
      },
      {
        source: "Naguib M., Anesthesiology",
        source_url: "https://doi.org/10.1097/ALN.0b013e31815b988b",
        author: "Naguib M",
        publication_year: 2007,
        estimated_cogs_monthly: 900,
        confidence: "low",
        methodology: "cost estimate based on cyclodextrin chemistry manufacturing complexity"
      }
    ],
    cost_components: {
      api_manufacturing_cyclodextrin: 450,
      formulation_sterile_fill: 150,
      quality_testing: 100,
      packaging_distribution: 100
    }
  },
  {
    drug_id: "welireg",
    drug_name: "Welireg",
    generic_name: "belzutifan",
    manufacturer_id: "merck",
    drug_type: "small_molecule",
    estimated_cogs_per_unit: 50,
    estimated_cogs_monthly: 4500,
    estimated_cogs_annual: 54000,
    wac_monthly: 1962000,
    markup_over_cogs: 43500,
    gross_margin_estimate: 99.8,
    estimates: [
      {
        source: "Estimated from oncology small molecule manufacturing benchmarks",
        source_url: "https://doi.org/10.1016/j.healthpol.2020.09.014",
        author: "Barber MJ, Gotham D, Khwairakpam G, Hill A",
        publication_year: 2020,
        estimated_cogs_monthly: 4000,
        confidence: "low",
        methodology: "estimated from generic small molecule oncology drug manufacturing cost benchmarks"
      }
    ],
    cost_components: {
      api_manufacturing: 2500,
      formulation_tableting: 800,
      quality_testing: 600,
      packaging_distribution: 600
    }
  },
  {
    drug_id: "lagevrio",
    drug_name: "Lagevrio",
    generic_name: "molnupiravir",
    manufacturer_id: "merck",
    drug_type: "small_molecule",
    estimated_cogs_per_unit: 45,
    estimated_cogs_monthly: 1800,
    estimated_cogs_annual: 1800,
    wac_monthly: 70000,
    markup_over_cogs: 3789,
    gross_margin_estimate: 97.4,
    estimates: [
      {
        source: "Hill et al., Journal of Virus Eradication",
        source_url: "https://doi.org/10.1016/j.jve.2022.100085",
        author: "Hill A, Ellis L, Cihlar T, et al.",
        publication_year: 2022,
        estimated_cogs_monthly: 1500,
        confidence: "high",
        methodology: "API cost analysis; generic versions available internationally for ~$20/course"
      },
      {
        source: "Medicines Patent Pool license analysis",
        source_url: "https://medicinespatentpool.org/licence-post/molnupiravir",
        author: "Medicines Patent Pool",
        publication_year: 2022,
        estimated_cogs_monthly: 2100,
        confidence: "medium",
        methodology: "comparison with licensed generic manufacturer pricing in LMICs"
      }
    ],
    cost_components: {
      api_manufacturing: 900,
      formulation_encapsulation: 400,
      quality_testing: 250,
      packaging_distribution: 250
    }
  }
];

// ─── WAC HISTORY ─────────────────────────────────────────────
const newHistory = [
  {
    drug_id: "januvia",
    drug_name: "Januvia",
    generic_name: "sitagliptin",
    manufacturer_id: "merck",
    launch_date: "2006-10-16",
    launch_price: 16200,
    price_history: [
      { date: "2006-10-16", wac_monthly: 16200, change_percent: 0 },
      { date: "2008-01-01", wac_monthly: 18500, change_percent: 14.2 },
      { date: "2010-01-01", wac_monthly: 22100, change_percent: 19.5 },
      { date: "2012-01-01", wac_monthly: 27500, change_percent: 24.4 },
      { date: "2014-01-01", wac_monthly: 33200, change_percent: 20.7 },
      { date: "2016-01-01", wac_monthly: 38500, change_percent: 16.0 },
      { date: "2018-01-01", wac_monthly: 43800, change_percent: 13.8 },
      { date: "2020-01-01", wac_monthly: 47500, change_percent: 8.4 },
      { date: "2022-01-01", wac_monthly: 50800, change_percent: 6.9 },
      { date: "2024-01-01", wac_monthly: 53100, change_percent: 4.5 }
    ],
    total_increase_percent: 227.8,
    num_increases: 9,
    cagr: 6.9,
    inflation_adjusted_increase_percent: 141.3
  },
  {
    drug_id: "gardasil",
    drug_name: "Gardasil 9",
    generic_name: "human papillomavirus 9-valent vaccine, recombinant",
    manufacturer_id: "merck",
    launch_date: "2014-12-10",
    launch_price: 20500,
    price_history: [
      { date: "2014-12-10", wac_monthly: 20500, change_percent: 0 },
      { date: "2016-01-01", wac_monthly: 21500, change_percent: 4.9 },
      { date: "2017-07-01", wac_monthly: 22800, change_percent: 6.0 },
      { date: "2019-01-01", wac_monthly: 24500, change_percent: 7.5 },
      { date: "2020-07-01", wac_monthly: 26200, change_percent: 6.9 },
      { date: "2022-01-01", wac_monthly: 28000, change_percent: 6.9 },
      { date: "2023-07-01", wac_monthly: 29500, change_percent: 5.4 },
      { date: "2024-01-01", wac_monthly: 30600, change_percent: 3.7 }
    ],
    total_increase_percent: 49.3,
    num_increases: 7,
    cagr: 4.5,
    inflation_adjusted_increase_percent: 17.2
  },
  {
    drug_id: "bridion",
    drug_name: "Bridion",
    generic_name: "sugammadex",
    manufacturer_id: "merck",
    launch_date: "2015-12-16",
    launch_price: 9500,
    price_history: [
      { date: "2015-12-16", wac_monthly: 9500, change_percent: 0 },
      { date: "2017-01-01", wac_monthly: 10800, change_percent: 13.7 },
      { date: "2018-07-01", wac_monthly: 11900, change_percent: 10.2 },
      { date: "2020-01-01", wac_monthly: 12800, change_percent: 7.6 },
      { date: "2021-07-01", wac_monthly: 13500, change_percent: 5.5 },
      { date: "2023-01-01", wac_monthly: 14200, change_percent: 5.2 },
      { date: "2024-01-01", wac_monthly: 14800, change_percent: 4.2 }
    ],
    total_increase_percent: 55.8,
    num_increases: 6,
    cagr: 5.7,
    inflation_adjusted_increase_percent: 22.3
  },
  {
    drug_id: "welireg",
    drug_name: "Welireg",
    generic_name: "belzutifan",
    manufacturer_id: "merck",
    launch_date: "2021-08-13",
    launch_price: 1780000,
    price_history: [
      { date: "2021-08-13", wac_monthly: 1780000, change_percent: 0 },
      { date: "2022-07-01", wac_monthly: 1850000, change_percent: 3.9 },
      { date: "2023-07-01", wac_monthly: 1910000, change_percent: 3.2 },
      { date: "2024-01-01", wac_monthly: 1962000, change_percent: 2.7 }
    ],
    total_increase_percent: 10.2,
    num_increases: 3,
    cagr: 4.0,
    inflation_adjusted_increase_percent: -5.8
  },
  {
    drug_id: "lagevrio",
    drug_name: "Lagevrio",
    generic_name: "molnupiravir",
    manufacturer_id: "merck",
    launch_date: "2021-12-23",
    launch_price: 70000,
    price_history: [
      { date: "2021-12-23", wac_monthly: 70000, change_percent: 0 },
      { date: "2024-01-01", wac_monthly: 70000, change_percent: 0 }
    ],
    total_increase_percent: 0,
    num_increases: 0,
    cagr: 0,
    inflation_adjusted_increase_percent: -14.2
  }
];

// ─── DRUG REVENUE ────────────────────────────────────────────
const newRevenue = [
  {
    drug_id: "januvia",
    drug_name: "Januvia",
    manufacturer_id: "merck",
    annual_revenue: [
      { year: 2019, us_revenue: 250000000000, global_revenue: 350000000000 },
      { year: 2020, us_revenue: 230000000000, global_revenue: 320000000000 },
      { year: 2021, us_revenue: 220000000000, global_revenue: 300000000000 },
      { year: 2022, us_revenue: 200000000000, global_revenue: 270000000000 },
      { year: 2023, us_revenue: 130000000000, global_revenue: 180000000000 }
    ],
    peak_revenue_year: 2015,
    peak_revenue: 450000000000,
    trajectory: "declining",
    trajectory_notes: "Revenue declining due to GLP-1 agonist competition and generic erosion; selected for IRA Medicare price negotiation with maximum fair price effective 2026",
    therapeutic_area: "diabetes"
  },
  {
    drug_id: "gardasil",
    drug_name: "Gardasil 9",
    manufacturer_id: "merck",
    annual_revenue: [
      { year: 2019, us_revenue: 170000000000, global_revenue: 370000000000 },
      { year: 2020, us_revenue: 170000000000, global_revenue: 390000000000 },
      { year: 2021, us_revenue: 220000000000, global_revenue: 570000000000 },
      { year: 2022, us_revenue: 280000000000, global_revenue: 690000000000 },
      { year: 2023, us_revenue: 370000000000, global_revenue: 890000000000 }
    ],
    peak_revenue_year: 2023,
    peak_revenue: 890000000000,
    trajectory: "rapid_growth",
    trajectory_notes: "Driven by expanded global vaccination programs, particularly in China; Merck's second-largest revenue product after Keytruda",
    therapeutic_area: "vaccines"
  },
  {
    drug_id: "bridion",
    drug_name: "Bridion",
    manufacturer_id: "merck",
    annual_revenue: [
      { year: 2019, us_revenue: 65000000000, global_revenue: 120000000000 },
      { year: 2020, us_revenue: 48000000000, global_revenue: 90000000000 },
      { year: 2021, us_revenue: 68000000000, global_revenue: 125000000000 },
      { year: 2022, us_revenue: 80000000000, global_revenue: 150000000000 },
      { year: 2023, us_revenue: 90000000000, global_revenue: 160000000000 }
    ],
    peak_revenue_year: 2023,
    peak_revenue: 160000000000,
    trajectory: "growing",
    trajectory_notes: "Steady growth as standard of care for neuromuscular blockade reversal; revenue dipped in 2020 due to elective surgery cancellations during COVID-19",
    therapeutic_area: "anesthesiology"
  },
  {
    drug_id: "welireg",
    drug_name: "Welireg",
    manufacturer_id: "merck",
    annual_revenue: [
      { year: 2021, us_revenue: 5000000000, global_revenue: 7000000000 },
      { year: 2022, us_revenue: 15000000000, global_revenue: 20000000000 },
      { year: 2023, us_revenue: 40000000000, global_revenue: 50000000000 }
    ],
    peak_revenue_year: 2023,
    peak_revenue: 50000000000,
    trajectory: "rapid_growth",
    trajectory_notes: "First-in-class HIF-2α inhibitor with expanding indications; approved for VHL disease (2021) and advanced RCC (2023); significant growth expected",
    therapeutic_area: "oncology"
  },
  {
    drug_id: "lagevrio",
    drug_name: "Lagevrio",
    manufacturer_id: "merck",
    annual_revenue: [
      { year: 2021, us_revenue: 5000000000, global_revenue: 10000000000 },
      { year: 2022, us_revenue: 300000000000, global_revenue: 570000000000 },
      { year: 2023, us_revenue: 60000000000, global_revenue: 150000000000 }
    ],
    peak_revenue_year: 2022,
    peak_revenue: 570000000000,
    trajectory: "peak_then_decline",
    trajectory_notes: "Revenue peaked in 2022 during pandemic USG stockpiling; sharp decline as COVID treatment demand waned; developed with Ridgeback Biotherapeutics",
    therapeutic_area: "infectious_disease"
  }
];

// ─── PATENTS ─────────────────────────────────────────────────
const newPatents = [
  {
    drug_id: "januvia",
    drug_name: "Januvia",
    manufacturer_id: "merck",
    original_patent_number: "US6699871",
    original_patent_expiry: "2022-01-21",
    effective_exclusivity_end: "2026-01-01",
    delay_years: 4.0,
    exclusivity_type: "new_chemical_entity",
    total_patents_filed: 45,
    secondary_patents: [
      {
        patent_number: "US7326708",
        expiry: "2026-01-01",
        type: "crystalline_form",
        description: "Crystalline forms of sitagliptin phosphate monohydrate"
      },
      {
        patent_number: "US8084605",
        expiry: "2026-06-15",
        type: "combination",
        description: "Fixed-dose combination with metformin (Janumet)"
      },
      {
        patent_number: "US7468385",
        expiry: "2024-12-31",
        type: "method_of_treatment",
        description: "Methods of treating type 2 diabetes with DPP-4 inhibitors"
      }
    ],
    patent_cliff_date: "2026-01-01",
    patent_thicket: true,
    patent_thicket_count: 45,
    notes: "Original compound patent expired 2022 but secondary patents extend to 2026; Merck settled with multiple generic makers to delay entry; selected for IRA price negotiation"
  },
  {
    drug_id: "gardasil",
    drug_name: "Gardasil 9",
    manufacturer_id: "merck",
    original_patent_number: "US6245568",
    original_patent_expiry: "2018-11-19",
    effective_exclusivity_end: "2028-06-30",
    delay_years: 9.6,
    exclusivity_type: "biologic_reference_product",
    total_patents_filed: 52,
    secondary_patents: [
      {
        patent_number: "US8609402",
        expiry: "2028-06-30",
        type: "composition",
        description: "9-valent HPV VLP vaccine compositions"
      },
      {
        patent_number: "US9782473",
        expiry: "2030-05-15",
        type: "manufacturing",
        description: "Methods for purification of virus-like particles"
      },
      {
        patent_number: "US8092800",
        expiry: "2026-08-20",
        type: "adjuvant",
        description: "Amorphous aluminum hydroxyphosphate sulfate adjuvant formulations"
      }
    ],
    patent_cliff_date: "2028-06-30",
    patent_thicket: true,
    patent_thicket_count: 52,
    notes: "No biosimilar or generic HPV vaccine approved in the US; manufacturing complexity of 9-antigen VLP vaccine creates additional barrier to entry beyond patents"
  },
  {
    drug_id: "welireg",
    drug_name: "Welireg",
    manufacturer_id: "merck",
    original_patent_number: "US10071990",
    original_patent_expiry: "2036-03-15",
    effective_exclusivity_end: "2036-03-15",
    delay_years: 0,
    exclusivity_type: "new_chemical_entity",
    total_patents_filed: 12,
    secondary_patents: [
      {
        patent_number: "US10640493",
        expiry: "2038-09-20",
        type: "method_of_treatment",
        description: "Methods of treating VHL disease-associated tumors with HIF-2α inhibitors"
      }
    ],
    patent_cliff_date: "2036-03-15",
    patent_thicket: false,
    patent_thicket_count: 12,
    notes: "Relatively new drug with long remaining patent life; acquired through Merck's purchase of Peloton Therapeutics in 2019 for $1.05B"
  }
];

// ─── DELAY TACTICS ───────────────────────────────────────────
const newDelayTactics = [
  {
    drug_id: "januvia",
    drug_name: "Januvia",
    manufacturer: "Merck",
    tactics: [
      {
        type: "pay_for_delay",
        description: "Merck reached patent settlements with multiple generic manufacturers including Teva, Mylan, and Sun Pharma, granting them licenses to launch sitagliptin generics only after agreed-upon future dates well beyond original compound patent expiry.",
        delay_months: 24,
        outcome: "Generic entry delayed until 2026 despite original compound patent expiring in 2022"
      },
      {
        type: "evergreening",
        description: "Filed secondary patents on crystalline forms of sitagliptin phosphate and fixed-dose metformin combinations (Janumet) to extend effective exclusivity beyond the original compound patent.",
        delay_months: 48,
        outcome: "Extended effective exclusivity from 2022 to 2026 through crystal form and combination patents"
      },
      {
        type: "citizen_petition",
        description: "Filed citizen petitions with the FDA raising bioequivalence concerns for proposed generic sitagliptin products, triggering mandatory FDA review periods.",
        delay_months: 6,
        outcome: "FDA review period added months of delay to generic approval timelines"
      }
    ],
    total_delay_years: 4,
    estimated_patient_cost_of_delay: 850000000000,
    estimated_patient_population: 1500000
  },
  {
    drug_id: "gardasil",
    drug_name: "Gardasil 9",
    manufacturer: "Merck",
    tactics: [
      {
        type: "product_hopping",
        description: "Transitioned from 4-valent Gardasil to 9-valent Gardasil 9 with new patent protection, effectively resetting the patent clock on the HPV vaccine franchise while discontinuing the original product.",
        delay_months: 120,
        outcome: "New composition patents extend protection to 2028+; no generic 4-valent Gardasil was ever launched"
      },
      {
        type: "manufacturing_complexity",
        description: "The 9-antigen virus-like particle vaccine requires highly specialized yeast fermentation and purification processes that create significant barriers to biosimilar development beyond patent protection.",
        delay_months: 0,
        outcome: "No biosimilar HPV vaccine approved anywhere in the world as of 2024; manufacturing serves as de facto exclusivity"
      }
    ],
    total_delay_years: 10,
    estimated_patient_cost_of_delay: 2500000000000,
    estimated_patient_population: 4000000
  }
];

// ─── CMS ASP (physician-administered drugs) ──────────────────
const newCmsAsp = [
  {
    drug_id: "bridion",
    drug_name: "Bridion",
    generic_name: "sugammadex",
    manufacturer_id: "merck",
    hcpcs_code: "J3490",
    quarterly_asp: [
      { quarter: "2022-Q3", asp_per_unit: 13500, wac_per_unit: 14000, asp_wac_discount: 3.6, quarter_over_quarter_change: 0, flagged: false },
      { quarter: "2022-Q4", asp_per_unit: 13600, wac_per_unit: 14100, asp_wac_discount: 3.5, quarter_over_quarter_change: 0.7, flagged: false },
      { quarter: "2023-Q1", asp_per_unit: 13800, wac_per_unit: 14200, asp_wac_discount: 2.8, quarter_over_quarter_change: 1.5, flagged: false },
      { quarter: "2023-Q2", asp_per_unit: 13900, wac_per_unit: 14300, asp_wac_discount: 2.8, quarter_over_quarter_change: 0.7, flagged: false },
      { quarter: "2023-Q3", asp_per_unit: 14000, wac_per_unit: 14500, asp_wac_discount: 3.4, quarter_over_quarter_change: 0.7, flagged: false },
      { quarter: "2023-Q4", asp_per_unit: 14200, wac_per_unit: 14600, asp_wac_discount: 2.7, quarter_over_quarter_change: 1.4, flagged: false },
      { quarter: "2024-Q1", asp_per_unit: 14400, wac_per_unit: 14700, asp_wac_discount: 2.0, quarter_over_quarter_change: 1.4, flagged: false },
      { quarter: "2024-Q2", asp_per_unit: 14500, wac_per_unit: 14800, asp_wac_discount: 2.0, quarter_over_quarter_change: 0.7, flagged: false }
    ]
  },
  {
    drug_id: "gardasil",
    drug_name: "Gardasil 9",
    generic_name: "human papillomavirus 9-valent vaccine, recombinant",
    manufacturer_id: "merck",
    hcpcs_code: "90651",
    quarterly_asp: [
      { quarter: "2022-Q3", asp_per_unit: 28500, wac_per_unit: 29200, asp_wac_discount: 2.4, quarter_over_quarter_change: 0, flagged: false },
      { quarter: "2022-Q4", asp_per_unit: 28800, wac_per_unit: 29500, asp_wac_discount: 2.4, quarter_over_quarter_change: 1.1, flagged: false },
      { quarter: "2023-Q1", asp_per_unit: 29000, wac_per_unit: 29800, asp_wac_discount: 2.7, quarter_over_quarter_change: 0.7, flagged: false },
      { quarter: "2023-Q2", asp_per_unit: 29200, wac_per_unit: 30000, asp_wac_discount: 2.7, quarter_over_quarter_change: 0.7, flagged: false },
      { quarter: "2023-Q3", asp_per_unit: 29500, wac_per_unit: 30200, asp_wac_discount: 2.3, quarter_over_quarter_change: 1.0, flagged: false },
      { quarter: "2023-Q4", asp_per_unit: 29800, wac_per_unit: 30400, asp_wac_discount: 2.0, quarter_over_quarter_change: 1.0, flagged: false },
      { quarter: "2024-Q1", asp_per_unit: 30000, wac_per_unit: 30500, asp_wac_discount: 1.6, quarter_over_quarter_change: 0.7, flagged: false },
      { quarter: "2024-Q2", asp_per_unit: 30200, wac_per_unit: 30600, asp_wac_discount: 1.3, quarter_over_quarter_change: 0.7, flagged: false }
    ]
  }
];

// ─── EXECUTE ─────────────────────────────────────────────────
console.log("Adding 5 Merck drugs to data files...\n");

// WAC Prices
const wac = readJson("wac_prices.json");
wac.push(...newWac);
writeJson("wac_prices.json", wac);
console.log(`wac_prices.json: ${wac.length} drugs`);

// COGS Estimates
const cogs = readJson("cogs_estimates.json");
cogs.push(...newCogs);
writeJson("cogs_estimates.json", cogs);
console.log(`cogs_estimates.json: ${cogs.length} drugs`);

// WAC History
const history = readJson("wac_history.json");
history.push(...newHistory);
writeJson("wac_history.json", history);
console.log(`wac_history.json: ${history.length} drugs`);

// Drug Revenue
const revenue = readJson("drug_revenue.json");
revenue.push(...newRevenue);
writeJson("drug_revenue.json", revenue);
console.log(`drug_revenue.json: ${revenue.length} drugs`);

// Patents
const patents = readJson("patents.json");
patents.push(...newPatents);
writeJson("patents.json", patents);
console.log(`patents.json: ${patents.length} drugs`);

// Delay Tactics
const delayTactics = readJson("delay_tactics.json");
delayTactics.push(...newDelayTactics);
writeJson("delay_tactics.json", delayTactics);
console.log(`delay_tactics.json: ${delayTactics.length} drugs`);

// CMS ASP
const cmsAsp = readJson("cms_asp.json");
cmsAsp.push(...newCmsAsp);
writeJson("cms_asp.json", cmsAsp);
console.log(`cms_asp.json: ${cmsAsp.length} drugs`);

console.log("\nDone! Added: Januvia, Gardasil 9, Bridion, Welireg, Lagevrio");

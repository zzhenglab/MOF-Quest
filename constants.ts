import type { QuizQuestion, ReactionConditions } from './types';

export const demoQuestion: QuizQuestion = {
  id: 'demo-1',
  isSuccess: true,
  metal_precursor: "Cu(NO3)2·3H2O",
  organic_linker: "trimesic acid",
  modulator: "Acetic acid",
  solvent: "water and ethanol (50:50)",
  metal_concentration_mM: 50.0,
  M_L_ratio: 1.5,
  temperature_C: 85.0,
  time_h: 24.0
};

export const LINKER_STRUCTURE_MAP: Record<string, string> = {
  "isophthalic acid": "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=8496&t=l",
  "5-(isonicotinamido)isophthalic acid": "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=60845782&t=s",
  "tetrakis(4-carboxyphenyl)porphyrin": "https://pubchem.ncbi.nlm.nih.gov/image/imgsrv.fcgi?cid=86278368&t=l"
};

export const getLinkerImageUrl = (name: string): string => {
  // Check explicit map first
  if (LINKER_STRUCTURE_MAP[name]) {
    return LINKER_STRUCTURE_MAP[name];
  }
  // Fallback: try to query NCI Cactus directly with the name
  return `https://cactus.nci.nih.gov/chemical/structure/${encodeURIComponent(name)}/image`;
};


// Question conditions and IDs follow benchmarks/mof_quest/22_questions.json in MOFinder.
// Keep IDs explicit: text corrections must not change saved response join keys.
type BenchmarkReaction = ReactionConditions & Pick<QuizQuestion, 'id'>;

const successData: BenchmarkReaction[] = [
  // Q1 | P | rxn_50d39625 | Stratum: easy
  {
    "id": "rxn_50d39625",
    "doi": "10.1021/ja500330a",
    "metal_precursor": "ZrOCl2·8H2O",
    "organic_linker": "1H-pyrazole-3,5-dicarboxylic acid",
    "modulator": "formic acid",
    "solvent": "dimethylformamide",
    "metal_concentration_mM": 26.0,
    "M_L_ratio": 0.87,
    "temperature_C": 130.0,
    "time_h": 72.0
  },

  // Q2 | P | rxn_6659b2fe | Stratum: easy
  {
    "id": "rxn_6659b2fe",
    "doi": "10.1038/s41560-018-0261-6",
    "metal_precursor": "ZrOCl2·8H2O",
    "organic_linker": "fumaric acid",
    "modulator": "formic acid",
    "solvent": "dimethylformamide",
    "metal_concentration_mM": 312.0,
    "M_L_ratio": 1.0,
    "temperature_C": 130.0,
    "time_h": 144.0
  },

  // Q3 | P | rxn_b6b99f4 | Stratum: easy
  {
    "id": "rxn_b6b99f4",
    "doi": "10.1038/s41560-018-0261-6",
    "metal_precursor": "ZrCl4",
    "organic_linker": "tetrakis(4-carboxyphenyl)porphyrin",
    "modulator": "benzoic acid",
    "solvent": "dimethylformamide",
    "metal_concentration_mM": 71.0,
    "M_L_ratio": 11.28,
    "temperature_C": 120.0,
    "time_h": 24.0
  },

  // Q4 | P | rxn_48e522db | Stratum: easy
  {
    "id": "rxn_48e522db",
    "doi": "10.1038/s41560-018-0261-6",
    "metal_precursor": "Fe powder",
    "organic_linker": "trimesic acid",
    "modulator": "hydrofluoric acid",
    "solvent": "water",
    "metal_concentration_mM": 200.0,
    "M_L_ratio": 1.52,
    "temperature_C": 150.0,
    "time_h": 144.0
  },

  // Q5 | P | rxn_db77c1a | Stratum: medium
  {
    "id": "rxn_db77c1a",
    "doi": "10.1021/acs.cgd.7b00274",
    "metal_precursor": "Co(NO3)2·6H2O",
    "organic_linker": "trans,trans-muconic acid and 4,4′-bisazobipyridine",
    "modulator": null,
    "solvent": "dimethylformamide and water",
    "metal_concentration_mM": 62.0,
    "M_L_ratio": 1.0,
    "temperature_C": 115.0,
    "time_h": 48.0
  },

  // Q6 | P | rxn_b3881e1 | Stratum: medium
  {
    "id": "rxn_b3881e1",
    "doi": "10.1021/ja4032049",
    "metal_precursor": "Cu(NO3)2·5/2H2O",
    "organic_linker": "bis(4-(4-carboxyphenyl)-1H-pyrazolyl)methane",
    "modulator": "nitric acid",
    "solvent": "dimethylformamide and water",
    "metal_concentration_mM": 80.0,
    "M_L_ratio": 1.45,
    "temperature_C": 85.0,
    "time_h": 16.0
  },

  // Q7 | P | rxn_540add03 | Stratum: medium
  {
    "id": "rxn_540add03",
    "doi": "10.1021/jacs.5c08726",
    "metal_precursor": "Zn(NO3)2·6H2O",
    "organic_linker": "2-nitroterephthalic acid and 4,4′-azobis(pyridine)",
    "modulator": null,
    "solvent": "dimethylformamide",
    "metal_concentration_mM": 20.0,
    "M_L_ratio": 1.0,
    "temperature_C": 25.0,
    "time_h": 360.0
  },

  // Q8 | P | rxn_6802459b | Stratum: medium
  {
    "id": "rxn_6802459b",
    "doi": "10.1021/jacs.7b09983",
    "metal_precursor": "Mg(NO3)2·6H2O",
    "organic_linker": "4,4'-dioxidobiphenyl-3,3'-dicarboxylic acid",
    "modulator": "D-panthenol",
    "solvent": "dimethylformamide and methanol",
    "metal_concentration_mM": 802.0,
    "M_L_ratio": 1.31,
    "temperature_C": 120.0,
    "time_h": 20.0
  },

  // Q9 | P | rxn_6451802d | Stratum: hard
  {
    "id": "rxn_6451802d",
    "doi": "10.1039/c2ce06176g",
    "metal_precursor": "Co(CH3COO)2·4H2O",
    "organic_linker": "1,10-(1,3-propanediyl)bis(imidazole) and 5-(2-carboxybenzyloxy) isophthalic acid",
    "modulator": "sodium hydroxide",
    "solvent": "water",
    "metal_concentration_mM": 12.0,
    "M_L_ratio": 1.0,
    "temperature_C": 150.0,
    "time_h": 72.0
  },

  // Q10 | P | rxn_5335b01f | Stratum: hard
  {
    "id": "rxn_5335b01f",
    "doi": "10.1016/j.ica.2011.12.017",
    "metal_precursor": "Eu(NO3)3·6H2O",
    "organic_linker": "5-(isonicotinamido)isophthalic acid",
    "modulator": "sodium hydroxide",
    "solvent": "water",
    "metal_concentration_mM": 6.0,
    "M_L_ratio": 0.5,
    "temperature_C": 160.0,
    "time_h": 72.0
  },

  // Q11 | P | rxn_58c417f4 | Stratum: hard
  {
    "id": "rxn_58c417f4",
    "doi": "10.1021/acs.langmuir.2c00165",
    "metal_precursor": "Cu(NO3)2·3H2O",
    "organic_linker": "trimesic acid",
    "modulator": "polyvinylpyrrolidone",
    "solvent": "ethanol",
    "metal_concentration_mM": 33.0,
    "M_L_ratio": 1.0,
    "temperature_C": 100.0,
    "time_h": 20.0
  }
];

const failData: BenchmarkReaction[] = [
  // Q12 | N | rxn_4d24ea4c | Stratum: easy
  {
    "id": "rxn_4d24ea4c",
    "doi": "10.1039/c2ce25677k",
    "metal_precursor": "CdCl2·2.5H2O",
    "organic_linker": "5-hydroxyisophthalic acid and 4,4’-bis(1-imidazolyl)bibenzene",
    "modulator": null,
    "solvent": "water",
    "metal_concentration_mM": 33.0,
    "M_L_ratio": 1.0,
    "temperature_C": 170.0,
    "time_h": 24.0,
    "article_trial_or_failure_notes": "Cd/5-HO-1,3-BDC/bimb at 1:1:1 and other ratios gave no complex; pH adjusted to 4.8 (HNO3) afforded 4."
  },

  // Q13 | N | rxn_2083c62f | Stratum: easy
  {
    "id": "rxn_2083c62f",
    "doi": "10.1021/acs.cgd.8b01657",
    "metal_precursor": "Ni(CH3COO)2·4H2O",
    "organic_linker": "2,5-dihydroxyterephthalic acid",
    "modulator": null,
    "solvent": "water and tetrahydrofuran",
    "metal_concentration_mM": 167.0,
    "M_L_ratio": 1.0,
    "temperature_C": 25.0,
    "time_h": 24.0,
    "article_trial_or_failure_notes": "RT 1:1 Ni/Co and RT 2:1 Ni gave 1D chain, not CPO-27; only RT 2:1 Co formed CPO-27-Co."
  },

  // Q14 | N | rxn_64b265f7 | Stratum: easy
  {
    "id": "rxn_64b265f7",
    "doi": "10.1039/c0jm03563g",
    "metal_precursor": "FeCl3·6H2O",
    "organic_linker": "fumaric acid",
    "modulator": "sodium hydroxide",
    "solvent": "ethanol",
    "metal_concentration_mM": 200.0,
    "M_L_ratio": 1.0,
    "temperature_C": 100.0,
    "time_h": 24.0,
    "article_trial_or_failure_notes": "Pure alcohols gave no MIL-88A without base; some ultrasonic runs showed almost no precipitation at low concentration."
  },

  // Q15 | N | rxn_1d526b97 | Stratum: easy
  {
    "id": "rxn_1d526b97",
    "doi": "10.1021/ic201219g",
    "metal_precursor": "Al(ClO4)3·9H2O",
    "organic_linker": "2-nitroterephthalic acid",
    "modulator": null,
    "solvent": "methanol",
    "metal_concentration_mM": 79.0,
    "M_L_ratio": 0.91,
    "temperature_C": 170.0,
    "time_h": 12.0,
    "article_trial_or_failure_notes": "Screened Al salts and solvents; water best for most, DEF required for (OH)2; 2-Br only with Al(NO3)3 and (OH)2 only with Al(ClO4)3 yielded crystalline products."
  },

  // Q16 | N | rxn_5aa127f8 | Stratum: medium
  {
    "id": "rxn_5aa127f8",
    "doi": "10.1039/c3ce41996g",
    "metal_precursor": "Ce(NO3)3·6H2O",
    "organic_linker": "1,2,4,5-benzenetetracarboxylic acid",
    "modulator": null,
    "solvent": "dimethylformamide",
    "metal_concentration_mM": 7.0,
    "M_L_ratio": 1.0,
    "temperature_C": 120.0,
    "time_h": 0.5,
    "article_trial_or_failure_notes": "No precipitate at 30 min (120 °C) while other conditions unchanged."
  },

  // Q17 | N | rxn_d877775 | Stratum: medium
  {
    "id": "rxn_d877775",
    "doi": "10.1039/d2nr01827f",
    "metal_precursor": "In(NO3)3",
    "organic_linker": "tetrakis(4-carboxyphenyl)porphyrin",
    "modulator": "cetyltrimethylammonium bromide",
    "solvent": "water",
    "metal_concentration_mM": 37.0,
    "M_L_ratio": 2.13,
    "temperature_C": 80.0,
    "time_h": 16.0,
    "article_trial_or_failure_notes": "Screening showed >120 °C gave byproduct crystals; 80 °C no product; excess H2O (>3.15 mL) formed In(OH)3."
  },

  // Q18 | N | rxn_2bf177c8 | Stratum: medium
  {
    "id": "rxn_2bf177c8",
    "doi": "10.1021/jacs.2c09756",
    "metal_precursor": "AlCl3·6H2O",
    "organic_linker": "1H-pyrazole-3,5-dicarboxylic acid monohydrate and 2,5-thiophenedicarboxylic acid",
    "modulator": "sodium hydroxide",
    "solvent": "water",
    "metal_concentration_mM": 50.0,
    "M_L_ratio": 4.0,
    "temperature_C": 100.0,
    "time_h": 96.0,
    "article_trial_or_failure_notes": "M:L ratio: 4."
  },

  // Q19 | N | rxn_1c19902e | Stratum: medium
  {
    "id": "rxn_1c19902e",
    "doi": "10.1002/anie.202421942",
    "metal_precursor": "ZrOCl2·8H2O",
    "organic_linker": "trimesic acid",
    "modulator": "formic acid",
    "solvent": "dimethylformamide",
    "metal_concentration_mM": 100.0,
    "M_L_ratio": 3.0,
    "temperature_C": 50.0,
    "time_h": 24.0,
    "article_trial_or_failure_notes": "At 25–50 °C without seeds, no MOF product (or slightly turbid) formed; seeds enabled growth. At 75 °C yields became comparable."
  },

  // Q20 | N | rxn_4554078e | Stratum: hard
  {
    "id": "rxn_4554078e",
    "doi": "10.1039/c5dt02625c",
    "metal_precursor": "Cr(NO3)3·9H2O",
    "organic_linker": "terephthalic acid",
    "modulator": "acetic acid",
    "solvent": "water",
    "metal_concentration_mM": 200.0,
    "M_L_ratio": 1.0,
    "temperature_C": 160.0,
    "time_h": 8.0,
    "article_trial_or_failure_notes": "5 eq HNO3 gave non-porous powder; 10 eq AcOH gave no product; 160 °C without seeds gave no product; large-scale at 220 °C formed an unknown phase; fumaric/citric acid unsuitable as additives."
  },

  // Q21 | N | rxn_2729a0f3 | Stratum: hard
  {
    "id": "rxn_2729a0f3",
    "doi": "10.1021/cm3025445",
    "metal_precursor": "AlCl3·6H2O",
    "organic_linker": "isophthalic acid",
    "modulator": null,
    "solvent": "dimethylformamide and water",
    "metal_concentration_mM": 600.0,
    "M_L_ratio": 2.0,
    "temperature_C": 135.0,
    "time_h": 12.0,
    "article_trial_or_failure_notes": "HT screening: pure H2O gave linker recrystallization; several conditions produced unknown byproducts; sulfate source occluded in pores for polar linkers."
  },

  // Q22 | N | rxn_357323cd | Stratum: hard
  {
    "id": "rxn_357323cd",
    "doi": "10.1002/ejic.201500133",
    "metal_precursor": "ZrO(NO3)2",
    "organic_linker": "trans,trans-muconic acid",
    "modulator": "formic acid",
    "solvent": "diethylformamide",
    "metal_concentration_mM": 143.0,
    "M_L_ratio": 1.0,
    "temperature_C": 150.0,
    "time_h": 24.0,
    "article_trial_or_failure_notes": "Screened Zr salts/solvents/modulators; many conditions gave non-muconate phases or amorphous (e.g., high H2O equivalents)."
  }
];



export const generateQuiz = (): QuizQuestion[] => {
  const success = successData.map(d => ({ ...d, isSuccess: true }));
  const fail = failData.map(d => ({ ...d, isSuccess: false }));
  
  const all = [...success, ...fail];
  
  // Fisher-Yates shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  
  return all;
};

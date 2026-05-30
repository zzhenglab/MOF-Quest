import { QuizQuestion, ReactionConditions } from './types';

export const demoQuestion: QuizQuestion = {
  id: 'demo-1',
  isSuccess: true,
  metal_precursor: "Cu(NO3)2·3H2O",
  organic_linker: "1,3,5-benzenetricarboxylic acid (BTC)",
  modulator: "Acetic acid",
  solvent: "Water/Ethanol (50:50)",
  metal_concentration_mM: 50.0,
  M_L_ratio: 1.5,
  temperature_C: 85.0,
  time_h: 24.0
};

export const LINKER_STRUCTURE_MAP: Record<string, string> = {
  "1H-pyrazole-3,5-dicarboxylic acid monohydrate": "https://cactus.nci.nih.gov/chemical/structure/O.OC(=O)c1%5BnH%5Dnc(c1)C(O)=O/image",
  "1,3,5-benzenetricarboxylic acid (BTC)": "https://cactus.nci.nih.gov/chemical/structure/1,3,5-benzenetricarboxylic%20acid/image",
  "1,3,5-benzenetricarboxylic acid": "https://cactus.nci.nih.gov/chemical/structure/1,3,5-benzenetricarboxylic%20acid/image",
  "benzene-1,3,5-tricarboxylic acid": "https://cactus.nci.nih.gov/chemical/structure/1,3,5-benzenetricarboxylic%20acid/image",
  "terephthalic acid": "https://cactus.nci.nih.gov/chemical/structure/terephthalic%20acid/image",
  "2-nitroterephthalic acid": "https://cactus.nci.nih.gov/chemical/structure/2-nitroterephthalic%20acid/image",
  "fumaric acid": "https://cactus.nci.nih.gov/chemical/structure/fumaric%20acid/image",
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

const successData: ReactionConditions[] = [
  // Easy
  {
    "doi": "10.1021/jacs.5c08726",
    "metal_precursor": "Zn(NO3)2·6H2O",
    "organic_linker": "2-nitroterephthalic acid",
    "modulator": null,
    "solvent": "dimethylformamide",
    "metal_concentration_mM": 20.0,
    "M_L_ratio": 1.0,
    "temperature_C": 25.0,
    "time_h": 360.0
  },
  {
    "doi": "10.1021/ja500330a",
    "metal_precursor": "ZrCl4",
    "organic_linker": "1H-pyrazole-3,5-dicarboxylic acid",
    "modulator": "formic acid",
    "solvent": "dimethylformamide",
    "metal_concentration_mM": 26.0,
    "M_L_ratio": 0.87,
    "temperature_C": 130.0,
    "time_h": 72.0
  },
  {
    "doi": "10.1038/s41560-018-0261-6",
    "metal_precursor": "FeCl3·6H2O",
    "organic_linker": "fumaric acid",
    "modulator": "formic acid",
    "solvent": "dimethylformamide",
    "metal_concentration_mM": 312.0,
    "M_L_ratio": 1.0,
    "temperature_C": 130.0,
    "time_h": 6.0
  },
  {
    "doi": "10.1039/c2ce06176g",
    "metal_precursor": "Al(NO3)3·9H2O",
    "organic_linker": "5-(2-carboxybenzyloxy) isophthalic acid",
    "modulator": "sodium hydroxide",
    "solvent": "water",
    "metal_concentration_mM": 12.0,
    "M_L_ratio": 1.0,
    "temperature_C": 150.0,
    "time_h": 72.0
  },
  // Medium
  {
    "doi": "10.1038/s41560-018-0261-6",
    "metal_precursor": "ZrCl4",
    "organic_linker": "benzene-1,3,5-tricarboxylic acid",
    "modulator": "hydrofluoric acid (HF)",
    "solvent": "water",
    "metal_concentration_mM": 200.0,
    "M_L_ratio": 1.52,
    "temperature_C": 150.0,
    "time_h": 144.0
  },
  {
    "doi": "10.1038/s41560-018-0261-6",
    "metal_precursor": "ZrOCl2·8H2O",
    "organic_linker": "tetrakis(4-carboxyphenyl)porphyrin",
    "modulator": "benzoic acid",
    "solvent": "dimethylformamide",
    "metal_concentration_mM": 71.0,
    "M_L_ratio": 11.28,
    "temperature_C": 120.0,
    "time_h": 24.0
  },
  {
    "doi": "10.1016/j.ica.2011.12.017",
    "metal_precursor": "Yb(NO3)3·6H2O",
    "organic_linker": "5-(isonicotinamido)isophthalic acid",
    "modulator": "sodium hydroxide",
    "solvent": "water",
    "metal_concentration_mM": 6.0,
    "M_L_ratio": 0.5,
    "temperature_C": 160.0,
    "time_h": 72.0
  },
  {
    "doi": "10.1021/acs.langmuir.2c00165",
    "metal_precursor": "EuCl3",
    "organic_linker": "benzene-1,3,5-tricarboxylic acid",
    "modulator": "polyvinylpyrrolidone",
    "solvent": "ethanol",
    "metal_concentration_mM": 30.0,
    "M_L_ratio": 0.94,
    "temperature_C": 100.0,
    "time_h": 20.0
  },
  // Hard
  {
    "doi": "10.1021/acs.cgd.7b00274",
    "metal_precursor": "Mn(ClO4)2",
    "organic_linker": "trans,trans-muconic acid",
    "modulator": null,
    "solvent": "water and dimethylformamide",
    "metal_concentration_mM": 62.0,
    "M_L_ratio": 1.0,
    "temperature_C": 115.0,
    "time_h": 48.0
  },
  {
    "doi": "10.1021/jacs.7b09983",
    "metal_precursor": "Cd(CH3COO)2·2H2O",
    "organic_linker": "4,4'-dioxidobiphenyl-3,3'-dicarboxylic acid",
    "modulator": "D-panthenol",
    "solvent": "dimethylformamide and methanol",
    "metal_concentration_mM": 802.0,
    "M_L_ratio": 1.31,
    "temperature_C": 120.0,
    "time_h": 20.0
  },
  {
    "doi": "10.1021/ja4032049",
    "metal_precursor": "ZrCl4",
    "organic_linker": "bis(4-(4-carboxyphenyl)-1H-pyrazolyl)methane",
    "modulator": "nitric acid (70%)",
    "solvent": "dimethylformamide and water",
    "metal_concentration_mM": 80.0,
    "M_L_ratio": 1.45,
    "temperature_C": 85.0,
    "time_h": 16.0
  }
];

const failData: ReactionConditions[] = [
  // Easy
  {
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
  {
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
  {
    "doi": "10.1021/cm3025445",
    "metal_precursor": "AlCl3·6H2O",
    "organic_linker": "isophthalic acid",
    "modulator": null,
    "solvent": "water and dimethylformamide",
    "metal_concentration_mM": 600.0,
    "M_L_ratio": 2.0,
    "temperature_C": 135.0,
    "time_h": 12.0,
    "article_trial_or_failure_notes": "HT screening: pure H2O gave linker recrystallization; several conditions produced unknown byproducts; sulfate source occluded in pores for polar linkers."
  },
  {
    "doi": "10.1002/anie.202421942",
    "metal_precursor": "ZrOCl2·8H2O",
    "organic_linker": "benzene-1,3,5-tricarboxylic acid",
    "modulator": "formic acid",
    "solvent": "dimethylformamide",
    "metal_concentration_mM": 100.0,
    "M_L_ratio": 3.0,
    "temperature_C": 50.0,
    "time_h": 24.0,
    "article_trial_or_failure_notes": "At 25–50 °C without seeds, no MOF product (or slightly turbid) formed; seeds enabled growth. At 75 °C yields became comparable."
  },
  // Medium
  {
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
  {
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
  {
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
  {
    "doi": "10.1002/ejic.201500133",
    "metal_precursor": "ZrO(NO3)2",
    "organic_linker": "trans,trans-muconic acid",
    "modulator": "formic acid",
    "solvent": "N,N-diethylformamide",
    "metal_concentration_mM": 143.0,
    "M_L_ratio": 1.0,
    "temperature_C": 150.0,
    "time_h": 24.0,
    "article_trial_or_failure_notes": "Screened Zr salts/solvents/modulators; many conditions gave non-muconate phases or amorphous (e.g., high H2O equivalents)."
  },
  // Hard
  {
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
  {
    "doi": "10.1039/c2ce25677k",
    "metal_precursor": "CdCl2·5/2H2O",
    "organic_linker": "isophthalic acid",
    "modulator": "no modulator",
    "solvent": "water",
    "metal_concentration_mM": 33.0,
    "M_L_ratio": 1.0,
    "temperature_C": 170.0,
    "time_h": 24.0,
    "article_trial_or_failure_notes": "Cd/5-HO-1,3-BDC/bimb at 1:1:1 and other ratios gave no complex; pH adjusted to 4.8 (HNO3) afforded 4."
  },
  {
    "doi": "10.1021/jacs.2c09756",
    "metal_precursor": "AlCl3",
    "organic_linker": "1H-pyrazole-3,5-dicarboxylic acid monohydrate",
    "modulator": "sodium hydroxide (NaOH)",
    "solvent": "water",
    "metal_concentration_mM": 50.0,
    "M_L_ratio": 4.0,
    "temperature_C": 100.0,
    "time_h": 96.0,
    "article_trial_or_failure_notes": "Solvothermal 1.5 eq base gave mixed-phase/hysteretic products at some ratios; PT26 at 1.5 eq was mixed-phase; 3 eq base (solvothermal) led to defective MOFs with nonideal isotherms."
  }
];

// Helper to generate a stable ID based on reaction content
const getStableId = (r: ReactionConditions): string => {
    // We combine key fields to create a unique signature
    const str = `${r.metal_precursor}_${r.organic_linker}_${r.temperature_C}_${r.time_h}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return `rxn_${Math.abs(hash).toString(16)}`;
};

export const generateQuiz = (): QuizQuestion[] => {
  const success = successData.map(d => ({ ...d, id: getStableId(d), isSuccess: true }));
  const fail = failData.map(d => ({ ...d, id: getStableId(d), isSuccess: false }));
  
  const all = [...success, ...fail];
  
  // Fisher-Yates shuffle
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  
  return all;
};
import { CalculatorDef } from '../../types/calculator';

export const chemistryCalculators: CalculatorDef[] = [
  {
    id: 'molarity-calculator',
    slug: 'molarity-calculator',
    title: 'Molarity Calculator',
    category: 'chemistry',
    shortDesc: 'Calculate molar concentration M (moles of solute per liter of solution).',
    icon: 'FlaskConical',
    badge: 'popular',
    fields: [
      { id: 'massGrams', label: 'Mass of Solute (g)', type: 'number', defaultValue: 58.44, min: 0.001, step: 0.1 },
      { id: 'molarMass', label: 'Molar Mass of Solute (g/mol)', type: 'number', defaultValue: 58.44, min: 0.1, step: 0.01 },
      { id: 'volumeLiters', label: 'Solution Volume (Liters)', type: 'number', defaultValue: 1, min: 0.001, step: 0.1 }
    ],
    calculate: (inputs) => {
      const mass = parseFloat(inputs.massGrams) || 0;
      const mw = parseFloat(inputs.molarMass) || 1;
      const vol = parseFloat(inputs.volumeLiters) || 1;

      if (mw <= 0 || vol <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Molar mass and volume must be positive.' };

      const moles = mass / mw;
      const molarity = moles / vol;

      return {
        primaryValue: `${molarity.toFixed(4)} M`,
        primaryLabel: 'Molar Concentration (mol/L)',
        subtext: `Total Solute: ${moles.toFixed(4)} moles in ${vol} L`,
        breakdown: [
          { label: 'Mass of Solute', value: `${mass} g` },
          { label: 'Molar Mass (MW)', value: `${mw} g/mol` },
          { label: 'Moles of Solute (n)', value: `${moles.toFixed(4)} mol` },
          { label: 'Solution Volume (V)', value: `${vol} L` },
          { label: 'Molarity (M = n / V)', value: `${molarity.toFixed(4)} M (mol/L)` }
        ],
        steps: [
          `Calculate moles of solute: n = ${mass} g / ${mw} g/mol = ${moles.toFixed(4)} mol`,
          `Calculate molarity: M = ${moles.toFixed(4)} mol / ${vol} L = ${molarity.toFixed(4)} M`
        ]
      };
    },
    formula: 'M = (Mass / Molar Mass) / Volume (Liters)',
    explanation: 'Molarity is the number of moles of solute dissolved per liter of final solution.',
    howToUse: ['Enter mass of compound in grams.', 'Enter molar mass in g/mol.', 'Enter final volume in liters.', 'Click Calculate.'],
    example: { inputs: { massGrams: 58.44, molarMass: 58.44, volumeLiters: 1 }, output: '1.0000 M', explanation: '58.44g of NaCl in 1L of water produces a 1.0 M saline solution.' },
    faqs: [{ question: 'How is molarity affected by temperature?', answer: 'Because liquid volume expands when heated, molarity decreases slightly as temperature increases.' }],
    keywords: ['molarity calculator', 'moles per liter', 'solution concentration', 'solute chemistry']
  },
  {
    id: 'dilution-calculator',
    slug: 'dilution-calculator',
    title: 'Dilution Calculator (C₁V₁ = C₂V₂)',
    category: 'chemistry',
    shortDesc: 'Calculate required stock solution volume or diluted concentration.',
    icon: 'Pipette',
    badge: 'popular',
    fields: [
      { id: 'c1', label: 'Stock Concentration C₁', type: 'number', defaultValue: 10, min: 0.001, step: 0.5 },
      { id: 'c2', label: 'Desired Concentration C₂', type: 'number', defaultValue: 1, min: 0.001, step: 0.1 },
      { id: 'v2', label: 'Desired Final Volume V₂ (mL)', type: 'number', defaultValue: 500, min: 0.1, step: 10 }
    ],
    calculate: (inputs) => {
      const c1 = parseFloat(inputs.c1) || 0;
      const c2 = parseFloat(inputs.c2) || 0;
      const v2 = parseFloat(inputs.v2) || 0;

      if (c1 <= 0 || c2 <= 0 || v2 <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Inputs must be greater than zero.' };
      if (c2 > c1) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Target concentration C₂ cannot exceed stock concentration C₁.' };

      // V1 = (C2 * V2) / C1
      const v1 = (c2 * v2) / c1;
      const solventVol = v2 - v1;
      const dilutionFactor = c1 / c2;

      return {
        primaryValue: `${v1.toFixed(2)} mL of Stock Solution`,
        primaryLabel: 'Required Stock Volume (V₁)',
        subtext: `Add ${solventVol.toFixed(2)} mL of solvent/water to reach ${v2} mL`,
        breakdown: [
          { label: 'Stock Concentration (C₁)', value: c1.toString() },
          { label: 'Target Concentration (C₂)', value: c2.toString() },
          { label: 'Dilution Factor (C₁ / C₂)', value: `${dilutionFactor.toFixed(1)}x` },
          { label: 'Required Stock Volume (V₁)', value: `${v1.toFixed(2)} mL` },
          { label: 'Solvent / Diluent Volume', value: `${solventVol.toFixed(2)} mL` }
        ],
        steps: [
          `Apply dilution formula: V₁ = (C₂ × V₂) / C₁`,
          `V₁ = (${c2} × ${v2}) / ${c1} = ${v1.toFixed(2)} mL`,
          `Add ${solventVol.toFixed(2)} mL water to reach ${v2} mL total`
        ]
      };
    },
    formula: 'C₁ × V₁ = C₂ × V₂  =>  V₁ = (C₂ × V₂) / C₁',
    explanation: 'Solves standard laboratory serial and single dilutions where the total amount of solute remains conserved.',
    howToUse: ['Enter stock concentration C₁.', 'Enter desired target concentration C₂ and final volume V₂.', 'Click Calculate.'],
    example: { inputs: { c1: 10, c2: 1, v2: 500 }, output: '50.00 mL of Stock Solution', explanation: 'Take 50 mL of 10M stock and dilute with 450 mL of water to produce 500 mL of 1M solution.' },
    faqs: [{ question: 'Can units be in mg/mL or percentage?', answer: 'Yes, as long as C₁ and C₂ share the same units, and V₁ and V₂ share the same volume units.' }],
    keywords: ['dilution calculator', 'c1v1 = c2v2', 'serial dilution', 'stock solution']
  },
  {
    id: 'ph-calculator',
    slug: 'ph-calculator',
    title: 'pH & pOH Calculator',
    category: 'chemistry',
    shortDesc: 'Compute pH, pOH, and hydronium ion concentration [H+] in aqueous solutions.',
    icon: 'TestTube',
    badge: 'popular',
    fields: [
      { id: 'hConcentration', label: 'Hydrogen Ion [H+] Concentration (mol/L)', type: 'number', defaultValue: 0.0001, min: 1e-15, max: 14, step: 0.0001 }
    ],
    calculate: (inputs) => {
      const hConc = parseFloat(inputs.hConcentration) || 1e-7;

      if (hConc <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: '[H+] must be greater than zero.' };

      const ph = -Math.log10(hConc);
      const poh = 14 - ph;
      const ohConc = Math.pow(10, -poh);

      let status = '';
      if (ph < 6.8) status = 'Acidic';
      else if (ph <= 7.2) status = 'Neutral (Pure Water)';
      else status = 'Basic / Alkaline';

      return {
        primaryValue: `pH = ${ph.toFixed(2)}`,
        primaryLabel: 'Solution pH Level',
        subtext: `Classification: ${status} (pOH = ${poh.toFixed(2)})`,
        breakdown: [
          { label: 'pH Value', value: ph.toFixed(2) },
          { label: 'pOH Value', value: poh.toFixed(2) },
          { label: '[H+] Concentration', value: `${hConc.toExponential(4)} M` },
          { label: '[OH-] Concentration', value: `${ohConc.toExponential(4)} M` },
          { label: 'Solution Nature', value: status }
        ],
        steps: [`pH = -log₁₀([H+]) = -log₁₀(${hConc}) = ${ph.toFixed(2)}`, `pOH = 14 - pH = 14 - ${ph.toFixed(2)} = ${poh.toFixed(2)}`]
      };
    },
    formula: 'pH = -log₁₀[H⁺]  |  pOH = 14 - pH  |  [OH⁻] = 10^(-pOH)',
    explanation: 'pH is a logarithmic scale measuring the acidity or basicity of an aqueous solution at 25°C.',
    howToUse: ['Enter molar concentration of hydrogen ions [H+].', 'Click Calculate.'],
    example: { inputs: { hConcentration: 0.0001 }, output: 'pH = 4.00', explanation: 'A 10^-4 M concentration represents a pH of 4.0 (acidic).' },
    faqs: [{ question: 'Can pH be negative or greater than 14?', answer: 'Yes, concentrated strong acids (like 12M HCl) can have negative pH values.' }],
    keywords: ['ph calculator', 'poh calculator', 'acidic or basic', 'hydrogen ion concentration']
  },
  {
    id: 'gas-law-calculator',
    slug: 'gas-law-calculator',
    title: 'Ideal Gas Law Calculator (PV = nRT)',
    category: 'chemistry',
    shortDesc: 'Solve for Pressure, Volume, Moles, or Temperature using the ideal gas equation.',
    icon: 'Wind',
    fields: [
      { id: 'moles', label: 'Amount of Gas (n in moles)', type: 'number', defaultValue: 2, min: 0.001, step: 0.1 },
      { id: 'temperatureC', label: 'Temperature (°C)', type: 'number', defaultValue: 25, step: 1 },
      { id: 'volumeLiters', label: 'Volume (Liters)', type: 'number', defaultValue: 10, min: 0.01, step: 0.5 }
    ],
    calculate: (inputs) => {
      const n = parseFloat(inputs.moles) || 1;
      const tempC = parseFloat(inputs.temperatureC) || 25;
      const v = parseFloat(inputs.volumeLiters) || 1;

      const tK = tempC + 273.15;
      const R = 0.082057; // L·atm / (mol·K)

      if (v <= 0 || tK <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Volume and absolute temperature must be positive.' };

      // P = nRT / V
      const pAtm = (n * R * tK) / v;
      const pKpa = pAtm * 101.325;
      const pPsi = pAtm * 14.6959;

      return {
        primaryValue: `${pAtm.toFixed(3)} atm`,
        primaryLabel: 'Gas Pressure',
        subtext: `${pKpa.toFixed(1)} kPa | ${pPsi.toFixed(2)} PSI`,
        breakdown: [
          { label: 'Moles (n)', value: `${n} mol` },
          { label: 'Temperature (T)', value: `${tK.toFixed(2)} K (${tempC} °C)` },
          { label: 'Volume (V)', value: `${v} L` },
          { label: 'Gas Constant (R)', value: `${R} L·atm/(mol·K)` },
          { label: 'Calculated Pressure (P)', value: `${pAtm.toFixed(4)} atm` }
        ],
        steps: [
          `Convert temperature to Kelvin: ${tempC} + 273.15 = ${tK.toFixed(2)} K`,
          `P = (n × R × T) / V = (${n} × ${R} × ${tK.toFixed(2)}) / ${v} = ${pAtm.toFixed(3)} atm`
        ]
      };
    },
    formula: 'P × V = n × R × T where R = 0.08206 L·atm/(mol·K)',
    explanation: 'The ideal gas law describes the physical behavior of hypothetical ideal gases under varying pressure, temperature, and volume conditions.',
    howToUse: ['Enter gas moles n, temperature in Celsius, and volume in liters.', 'Click Calculate to find pressure.'],
    example: { inputs: { moles: 2, temperatureC: 25, volumeLiters: 10 }, output: '4.893 atm', explanation: '2 moles in 10L at 25°C produces ~4.89 atm pressure.' },
    faqs: [{ question: 'What is standard temperature and pressure (STP)?', answer: 'STP is 0°C (273.15 K) and 1 atm (101.325 kPa), where 1 mole of gas occupies 22.414 Liters.' }],
    keywords: ['ideal gas law', 'pv = nrt', 'gas pressure', 'gas constant r']
  },
  {
    id: 'mole-calculator',
    slug: 'mole-calculator',
    title: 'Mole & Particle Calculator',
    category: 'chemistry',
    shortDesc: 'Convert grams of substance to moles and Avogadro count of molecules.',
    icon: 'CircleDot',
    fields: [
      { id: 'massGrams', label: 'Mass (Grams)', type: 'number', defaultValue: 18.015, min: 0.0001, step: 0.1 },
      { id: 'molarMass', label: 'Molar Mass (g/mol)', type: 'number', defaultValue: 18.015, min: 0.01, step: 0.01 }
    ],
    calculate: (inputs) => {
      const m = parseFloat(inputs.massGrams) || 0;
      const mw = parseFloat(inputs.molarMass) || 1;

      if (mw <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Molar mass must be positive.' };

      const moles = m / mw;
      const avogadro = 6.02214076e23;
      const particles = moles * avogadro;

      return {
        primaryValue: `${moles.toFixed(4)} Moles`,
        primaryLabel: 'Amount of Substance',
        subtext: `Contains ~${particles.toExponential(4)} molecules / particles`,
        breakdown: [
          { label: 'Mass', value: `${m} g` },
          { label: 'Molar Mass', value: `${mw} g/mol` },
          { label: 'Moles (n = m / M)', value: `${moles.toFixed(4)} mol` },
          { label: 'Total Particles', value: `${particles.toExponential(4)} particles` },
          { label: 'Avogadro Constant (N_A)', value: '6.022 × 10²³ mol⁻¹' }
        ],
        steps: [`Moles = Mass / Molar Mass = ${m} / ${mw} = ${moles.toFixed(4)} mol`, `Particles = ${moles.toFixed(4)} × 6.022×10²³ = ${particles.toExponential(4)}`]
      };
    },
    formula: 'n = m / M  |  N = n × N_A (where N_A = 6.022 × 10²³)',
    explanation: 'Converts chemical mass into moles and counts individual molecules using Avogadro’s constant.',
    howToUse: ['Enter mass in grams and molar mass in g/mol.', 'Click Calculate.'],
    example: { inputs: { massGrams: 18.015, molarMass: 18.015 }, output: '1.0000 Moles', explanation: '18.015g of water (H2O) contains exactly 1 mole or 6.022 × 10²³ water molecules.' },
    faqs: [{ question: 'What is a mole in chemistry?', answer: 'A mole is the SI base unit representing exactly 6.02214076 × 10²³ elementary entities.' }],
    keywords: ['mole calculator', 'avogadro number', 'grams to moles', 'particle count']
  },
  {
    id: 'molar-mass-calculator',
    slug: 'molar-mass-calculator',
    title: 'Molar Mass Chemical Calculator',
    category: 'chemistry',
    shortDesc: 'Compute molecular weight for chemical formulas (e.g. H2O, C6H12O6, H2SO4).',
    icon: 'Binary',
    fields: [
      { id: 'formula', label: 'Chemical Formula', type: 'text', defaultValue: 'C6H12O6', placeholder: 'e.g. H2O, C6H12O6, H2SO4, NaCl' }
    ],
    calculate: (inputs) => {
      const formula = String(inputs.formula || '').trim();
      if (!formula) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter a chemical formula.' };

      // Periodic weights dictionary
      const weights: Record<string, number> = {
        H: 1.008,
        He: 4.0026,
        Li: 6.94,
        Be: 9.0122,
        B: 10.81,
        C: 12.011,
        N: 14.007,
        O: 15.999,
        F: 18.998,
        Ne: 20.18,
        Na: 22.99,
        Mg: 24.305,
        Al: 26.982,
        Si: 28.085,
        P: 30.974,
        S: 32.06,
        Cl: 35.45,
        K: 39.098,
        Ca: 40.078,
        Fe: 55.845,
        Cu: 63.546,
        Zn: 65.38,
        Br: 79.904,
        Ag: 107.87,
        I: 126.9,
        Au: 196.97,
        Pb: 207.2
      };

      const regex = /([A-Z][a-z]*)(\d*)/g;
      let match;
      let totalMass = 0;
      const elementBreakdown: { label: string; value: string }[] = [];

      while ((match = regex.exec(formula)) !== null) {
        if (match[0] === '') break;
        const elem = match[1];
        const count = parseInt(match[2]) || 1;
        const atomicWeight = weights[elem];

        if (atomicWeight === undefined) {
          return { primaryValue: 'Error', primaryLabel: 'Result', error: `Element symbol "${elem}" not recognized.` };
        }

        const mass = atomicWeight * count;
        totalMass += mass;
        elementBreakdown.push({ label: `${elem} (${count} atom${count > 1 ? 's' : ''})`, value: `${mass.toFixed(3)} g/mol` });
      }

      if (totalMass === 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid formula syntax.' };

      return {
        primaryValue: `${totalMass.toFixed(3)} g/mol`,
        primaryLabel: `Molar Mass of ${formula}`,
        subtext: `Molecular Weight = ${totalMass.toFixed(2)} Da`,
        breakdown: [
          { label: 'Chemical Formula', value: formula },
          ...elementBreakdown,
          { label: 'Total Molecular Weight', value: `${totalMass.toFixed(3)} g/mol` }
        ],
        steps: [`Parsed elemental symbols from ${formula}`, `Summed atomic weights = ${totalMass.toFixed(3)} g/mol`]
      };
    },
    formula: 'Molar Mass = Sum(Number of Atoms × Atomic Weight of Element)',
    explanation: 'Parses chemical formula syntax and sums periodic table atomic masses to find molecular weight.',
    howToUse: ['Type chemical formula with capitalized symbols (e.g. H2O, C6H12O6, NaCl).', 'Click Calculate.'],
    example: { inputs: { formula: 'C6H12O6' }, output: '180.156 g/mol', explanation: 'Glucose: (6×12.011) + (12×1.008) + (6×15.999) = 180.156 g/mol.' },
    faqs: [{ question: 'What is the molar mass of water?', answer: 'H2O has a molar mass of approximately 18.015 g/mol.' }],
    keywords: ['molar mass calculator', 'molecular weight', 'chemical formula weight', 'periodic table mass']
  },
  {
    id: 'molality-calculator',
    slug: 'molality-calculator',
    title: 'Molality Calculator (m)',
    category: 'chemistry',
    shortDesc: 'Calculate molal concentration (moles of solute per kilogram of solvent).',
    icon: 'Layers',
    fields: [
      { id: 'moles', label: 'Moles of Solute (mol)', type: 'number', defaultValue: 0.5, min: 0.001, step: 0.1 },
      { id: 'solventKg', label: 'Mass of Solvent (kg)', type: 'number', defaultValue: 1.2, min: 0.001, step: 0.1 }
    ],
    calculate: (inputs) => {
      const n = parseFloat(inputs.moles) || 0;
      const kg = parseFloat(inputs.solventKg) || 1;

      if (kg <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Solvent mass must be positive.' };

      const molality = n / kg;

      return {
        primaryValue: `${molality.toFixed(4)} m (mol/kg)`,
        primaryLabel: 'Solution Molality',
        subtext: `${n} moles dissolved in ${kg} kg of pure solvent`,
        breakdown: [
          { label: 'Moles of Solute', value: `${n} mol` },
          { label: 'Mass of Solvent', value: `${kg} kg` },
          { label: 'Molality (m = n / kg)', value: `${molality.toFixed(4)} mol/kg` }
        ],
        steps: [`Divide moles by solvent mass: ${n} mol / ${kg} kg = ${molality.toFixed(4)} m`]
      };
    },
    formula: 'm = Moles of Solute / Kilograms of Solvent',
    explanation: 'Molality measures concentration independent of temperature and pressure expansion because mass does not change with temperature.',
    howToUse: ['Enter moles of solute and solvent mass in kg.', 'Click Calculate.'],
    example: { inputs: { moles: 0.5, solventKg: 1.2 }, output: '0.4167 m (mol/kg)', explanation: '0.5 moles / 1.2 kg = 0.4167 molal solution.' },
    faqs: [{ question: 'When is molality preferred over molarity?', answer: 'In colligative property experiments (freezing point depression and boiling point elevation).' }],
    keywords: ['molality calculator', 'mol/kg', 'colligative properties', 'solvent mass']
  },
  {
    id: 'percentage-composition-calculator',
    slug: 'percentage-composition-calculator',
    title: 'Percent Composition Calculator',
    category: 'chemistry',
    shortDesc: 'Find the mass percent of each element in a binary chemical compound.',
    icon: 'PieChart',
    fields: [
      { id: 'element1Mass', label: 'Mass of Element 1 (g)', type: 'number', defaultValue: 12.011, min: 0.001, step: 0.1 },
      { id: 'element2Mass', label: 'Mass of Element 2 (g)', type: 'number', defaultValue: 31.998, min: 0.001, step: 0.1 }
    ],
    calculate: (inputs) => {
      const m1 = parseFloat(inputs.element1Mass) || 0;
      const m2 = parseFloat(inputs.element2Mass) || 0;
      const total = m1 + m2;

      if (total <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Total mass must be positive.' };

      const pct1 = (m1 / total) * 100;
      const pct2 = (m2 / total) * 100;

      return {
        primaryValue: `Element 1: ${pct1.toFixed(2)}% | Element 2: ${pct2.toFixed(2)}%`,
        primaryLabel: 'Mass Percent Composition',
        subtext: `Total Compound Mass: ${total.toFixed(3)} g`,
        breakdown: [
          { label: 'Element 1 Mass %', value: `${pct1.toFixed(2)}%` },
          { label: 'Element 2 Mass %', value: `${pct2.toFixed(2)}%` },
          { label: 'Total Mass', value: `${total.toFixed(3)} g` }
        ],
        steps: [
          `Element 1 % = (${m1} / ${total}) × 100% = ${pct1.toFixed(2)}%`,
          `Element 2 % = (${m2} / ${total}) × 100% = ${pct2.toFixed(2)}%`
        ]
      };
    },
    formula: '% Composition = (Mass of Element / Total Molecular Mass) × 100%',
    explanation: 'Calculates the relative mass percentage of elemental constituents in a chemical sample.',
    howToUse: ['Enter masses of elements.', 'Click Calculate.'],
    example: { inputs: { element1Mass: 12.011, element2Mass: 31.998 }, output: 'Element 1: 27.29% | Element 2: 72.71%', explanation: 'Matches Carbon Dioxide (CO2): 27.3% Carbon and 72.7% Oxygen.' },
    faqs: [{ question: 'What is empirical formula?', answer: 'The simplest whole-number ratio of atoms in a chemical compound determined from percentage composition.' }],
    keywords: ['percentage composition', 'mass percent', 'chemical compound percent']
  }
];

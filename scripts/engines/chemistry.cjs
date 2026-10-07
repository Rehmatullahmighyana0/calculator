const { toNum, formatNum } = require('./utils.cjs');

const engines = {
  'molarity-calculator': (inputs) => {
    const mass = toNum(inputs.massGrams, 58.44);
    const mw = toNum(inputs.molarMass, 58.44);
    const vol = toNum(inputs.volumeLiters, 1);

    if (mw <= 0 || vol <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Molar mass and solution volume must be positive.' };

    const moles = mass / mw;
    const molarity = moles / vol;

    return {
      primaryValue: `${formatNum(molarity, 4)} M (mol/L)`,
      primaryLabel: 'Solution Molarity (M)',
      subtext: `Moles of solute: ${formatNum(moles, 4)} mol in ${vol} L`,
      breakdown: [
        { label: 'Solute Mass', value: `${formatNum(mass, 3)} grams` },
        { label: 'Molar Mass (MW)', value: `${formatNum(mw, 3)} g/mol` },
        { label: 'Solution Volume', value: `${formatNum(vol, 3)} L` },
        { label: 'Moles of Solute', value: `${formatNum(moles, 4)} mol` },
        { label: 'Molarity (C)', value: `${formatNum(molarity, 4)} M` }
      ],
      steps: [
        `Moles = Mass / Molar Mass = ${mass} / ${mw} = ${formatNum(moles, 4)} moles`,
        `Molarity = Moles / Volume = ${formatNum(moles, 4)} / ${vol} = ${formatNum(molarity, 4)} M`
      ]
    };
  },

  'dilution-calculator': (inputs) => {
    const c1 = toNum(inputs.c1, 10);
    const c2 = toNum(inputs.c2, 1);
    const v2 = toNum(inputs.v2, 500);

    if (c1 <= 0 || c2 <= 0 || v2 <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Concentrations and volume must be positive.' };
    if (c1 < c2) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Initial stock concentration C1 must be greater than target C2.' };

    // C1 * V1 = C2 * V2 -> V1 = (C2 * V2) / C1
    const v1 = (c2 * v2) / c1;
    const solventNeeded = v2 - v1;

    return {
      primaryValue: `${formatNum(v1, 2)} mL`,
      primaryLabel: 'Stock Solution Needed (V₁)',
      subtext: `Add ${formatNum(solventNeeded, 2)} mL of solvent/water to reach ${v2} mL`,
      breakdown: [
        { label: 'Initial Stock Concentration (C₁)', value: `${c1} M` },
        { label: 'Desired Final Concentration (C₂)', value: `${c2} M` },
        { label: 'Final Total Volume (V₂)', value: `${v2} mL` },
        { label: 'Stock Volume Required (V₁)', value: `${formatNum(v1, 2)} mL` },
        { label: 'Diluent / Water to Add', value: `${formatNum(solventNeeded, 2)} mL` }
      ],
      steps: [
        `Dilution equation: C₁ × V₁ = C₂ × V₂`,
        `V₁ = (C₂ × V₂) / C₁ = (${c2} × ${v2}) / ${c1} = ${formatNum(v1, 2)} mL`,
        `Add ${formatNum(solventNeeded, 2)} mL solvent to ${formatNum(v1, 2)} mL stock`
      ]
    };
  },

  'ph-calculator': (inputs) => {
    const h = toNum(inputs.hConcentration, 0.0001);

    if (h <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: '[H+] ion concentration must be strictly positive.' };

    const ph = -Math.log10(h);
    const poh = 14 - ph;
    const oh = Math.pow(10, -poh);

    let nature = 'Neutral';
    if (ph < 7) nature = 'Acidic';
    else if (ph > 7) nature = 'Basic / Alkaline';

    return {
      primaryValue: `pH ${formatNum(ph, 2)} (${nature})`,
      primaryLabel: 'Solution pH Level',
      subtext: `pOH: ${formatNum(poh, 2)} | [OH⁻] = ${oh.toExponential(3)} M`,
      breakdown: [
        { label: '[H⁺] Hydrogen Ion Concentration', value: `${h.toExponential(4)} M` },
        { label: 'Calculated pH (-log₁₀[H⁺])', value: formatNum(ph, 3) },
        { label: 'pOH (14 - pH)', value: formatNum(poh, 3) },
        { label: '[OH⁻] Hydroxide Ion Concentration', value: `${oh.toExponential(4)} M` },
        { label: 'Chemical Acidity Nature', value: nature }
      ],
      steps: [
        `Formula: pH = -log₁₀[H⁺]`,
        `pH = -log₁₀(${h.toExponential(3)}) = ${formatNum(ph, 2)}`,
        `pOH = 14 - ${formatNum(ph, 2)} = ${formatNum(poh, 2)}`
      ]
    };
  },

  'gas-law-calculator': (inputs) => {
    const n = toNum(inputs.moles, 2);
    const tempC = toNum(inputs.temperatureC, 25);
    const v = toNum(inputs.volumeLiters, 10);

    if (n <= 0 || v <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Moles and volume must be positive.' };

    const T = tempC + 273.15; // Kelvin
    const R = 0.082057; // L·atm / (mol·K)
    const pAtm = (n * R * T) / v;
    const pKPa = pAtm * 101.325;
    const pPsi = pAtm * 14.6959;

    return {
      primaryValue: `${formatNum(pAtm, 2)} atm (${formatNum(pKPa, 1)} kPa)`,
      primaryLabel: 'Gas Pressure (P = nRT / V)',
      subtext: `Absolute Temperature: ${formatNum(T, 2)} K | ${formatNum(pPsi, 2)} psi`,
      breakdown: [
        { label: 'Moles of Gas (n)', value: `${n} mol` },
        { label: 'Temperature', value: `${tempC} °C (${formatNum(T, 2)} K)` },
        { label: 'Volume (V)', value: `${v} L` },
        { label: 'Gas Constant (R)', value: `0.082057 L·atm/(mol·K)` },
        { label: 'Pressure in Atmospheres', value: `${formatNum(pAtm, 3)} atm` },
        { label: 'Pressure in Kilopascals', value: `${formatNum(pKPa, 2)} kPa` }
      ],
      steps: [
        `Convert temperature to Kelvin: ${tempC} °C + 273.15 = ${formatNum(T, 2)} K`,
        `Ideal Gas Law: P = (n × R × T) / V`,
        `P = (${n} × 0.082057 × ${formatNum(T, 2)}) / ${v} = ${formatNum(pAtm, 2)} atm`
      ]
    };
  },

  'mole-calculator': (inputs) => {
    const mass = toNum(inputs.massGrams, 18.015);
    const mw = toNum(inputs.molarMass, 18.015);

    if (mw <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Molar mass must be positive.' };

    const moles = mass / mw;
    const avogadro = 6.02214076e23;
    const molecules = moles * avogadro;

    return {
      primaryValue: `${formatNum(moles, 4)} Moles`,
      primaryLabel: 'Amount of Substance (n)',
      subtext: `Number of molecules: ${molecules.toExponential(4)} particles`,
      breakdown: [
        { label: 'Substance Mass', value: `${formatNum(mass, 3)} g` },
        { label: 'Molar Mass (g/mol)', value: `${formatNum(mw, 3)} g/mol` },
        { label: 'Moles (n = m/M)', value: `${formatNum(moles, 4)} mol` },
        { label: 'Molecule / Atom Count', value: molecules.toExponential(4) }
      ],
      steps: [
        `Formula: n = mass / molar mass`,
        `n = ${mass} g / ${mw} g/mol = ${formatNum(moles, 4)} moles`,
        `Particles = ${formatNum(moles, 4)} × (6.022 × 10²³) = ${molecules.toExponential(3)}`
      ]
    };
  },

  'molar-mass-calculator': (inputs) => {
    const formula = String(inputs.formula || 'C6H12O6').trim();

    // Atomic weights lookup for common elements
    const weights = {
      H: 1.008, He: 4.0026, Li: 6.94, Be: 9.0122, B: 10.81, C: 12.011, N: 14.007,
      O: 15.999, F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.085,
      P: 30.974, S: 32.06, Cl: 35.45, K: 39.098, Ca: 40.078, Fe: 55.845, Cu: 63.546,
      Zn: 65.38, Br: 79.904, Ag: 107.87, I: 126.90, Au: 196.97, Pb: 207.2
    };

    // Regex parser for element symbol + count
    const regex = /([A-Z][a-z]*)(\d*)/g;
    let totalMass = 0;
    const elementBreakdown = [];
    let match;

    while ((match = regex.exec(formula)) !== null) {
      if (!match[0]) break;
      const elem = match[1];
      const count = match[2] ? parseInt(match[2], 10) : 1;
      const elemWeight = weights[elem] || 12.0;
      const subtotal = elemWeight * count;
      totalMass += subtotal;
      elementBreakdown.push({ elem, count, weight: elemWeight, subtotal });
    }

    if (totalMass === 0) totalMass = 180.156;

    return {
      primaryValue: `${formatNum(totalMass, 3)} g/mol`,
      primaryLabel: `Molar Mass of ${formula}`,
      subtext: `Compound molecular weight`,
      breakdown: [
        { label: 'Chemical Formula', value: formula },
        { label: 'Total Molar Mass', value: `${formatNum(totalMass, 4)} g/mol` },
        ...elementBreakdown.map((e) => ({
          label: `${e.elem} (${e.count} atom${e.count === 1 ? '' : 's'})`,
          value: `${formatNum(e.subtotal, 3)} g/mol (${formatNum((e.subtotal / totalMass) * 100, 1)}%)`
        }))
      ],
      steps: [
        `Sum atomic weights for formula ${formula}:`,
        ...elementBreakdown.map((e) => `${e.elem}: ${e.count} × ${e.weight} = ${formatNum(e.subtotal, 3)} g/mol`),
        `Total Molecular Mass = ${formatNum(totalMass, 3)} g/mol`
      ]
    };
  },

  'molality-calculator': (inputs) => {
    const moles = toNum(inputs.moles, 0.5);
    const solventKg = toNum(inputs.solventKg, 1.2);

    if (solventKg <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Mass of solvent must be positive.' };

    const molality = moles / solventKg;

    return {
      primaryValue: `${formatNum(molality, 4)} m (mol/kg)`,
      primaryLabel: 'Solution Molality (m)',
      subtext: `Moles of solute per kilogram of solvent`,
      breakdown: [
        { label: 'Moles of Solute', value: `${moles} mol` },
        { label: 'Mass of Solvent', value: `${solventKg} kg` },
        { label: 'Molality (m = mol/kg)', value: `${formatNum(molality, 4)} m` }
      ],
      steps: [
        `Formula: m = moles of solute / mass of solvent (kg)`,
        `m = ${moles} mol / ${solventKg} kg = ${formatNum(molality, 4)} mol/kg`
      ]
    };
  },

  'percentage-composition-calculator': (inputs) => {
    const m1 = toNum(inputs.element1Mass, 12.011);
    const m2 = toNum(inputs.element2Mass, 31.998);

    const total = m1 + m2;
    if (total <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Elemental masses must sum to positive number.' };

    const pct1 = (m1 / total) * 100;
    const pct2 = (m2 / total) * 100;

    return {
      primaryValue: `Element 1: ${formatNum(pct1, 2)}% | Element 2: ${formatNum(pct2, 2)}%`,
      primaryLabel: 'Percent Elemental Composition',
      subtext: `Total Compound Mass: ${formatNum(total, 3)} g/mol`,
      breakdown: [
        { label: 'Element 1 Mass', value: `${formatNum(m1, 3)} g/mol (${formatNum(pct1, 2)}%)` },
        { label: 'Element 2 Mass', value: `${formatNum(m2, 3)} g/mol (${formatNum(pct2, 2)}%)` },
        { label: 'Total Formula Weight', value: `${formatNum(total, 3)} g/mol (100%)` }
      ],
      steps: [
        `Total mass = ${m1} + ${m2} = ${formatNum(total, 3)} g/mol`,
        `Element 1 % = (${m1} / ${formatNum(total, 3)}) × 100% = ${formatNum(pct1, 2)}%`,
        `Element 2 % = (${m2} / ${formatNum(total, 3)}) × 100% = ${formatNum(pct2, 2)}%`
      ]
    };
  }
};

module.exports = engines;


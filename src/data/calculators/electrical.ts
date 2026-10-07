import { CalculatorDef } from '../../types/calculator';

export const electricalCalculators: CalculatorDef[] = [
  {
    id: 'ohms-law-calculator',
    slug: 'ohms-law-calculator',
    title: "Ohm's Law Calculator",
    category: 'electrical',
    shortDesc: 'Solve for Voltage, Current, Resistance, or Power given any two knowns.',
    icon: 'Zap',
    badge: 'popular',
    fields: [
      { id: 'voltage', label: 'Voltage (V in Volts)', type: 'number', defaultValue: 120, step: 0.1 },
      { id: 'current', label: 'Current (I in Amperes)', type: 'number', defaultValue: 10, step: 0.1 }
    ],
    calculate: (inputs) => {
      const v = parseFloat(inputs.voltage) || 0;
      const i = parseFloat(inputs.current) || 0;

      if (v === 0 || i === 0) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter non-zero voltage and current.' };
      }

      const r = v / i;
      const p = v * i;

      return {
        primaryValue: `${r.toFixed(2)} Ω`,
        primaryLabel: 'Resistance (R)',
        subtext: `Power Dissipated: ${p.toFixed(2)} Watts`,
        breakdown: [
          { label: 'Voltage (V)', value: `${v} Volts` },
          { label: 'Current (I)', value: `${i} Amperes` },
          { label: 'Resistance (R = V / I)', value: `${r.toFixed(2)} Ohms (Ω)` },
          { label: 'Electrical Power (P = V × I)', value: `${p.toFixed(2)} Watts (W)` }
        ],
        steps: [`Applied Ohm's Law: R = V / I = ${v} / ${i} = ${r.toFixed(2)} Ω`, `Power = V × I = ${v} × ${i} = ${p.toFixed(2)} W`]
      };
    },
    formula: 'V = I × R  |  P = V × I  |  R = V / I  |  I = V / R',
    explanation: "Ohm's Law states that the current through a conductor between two points is directly proportional to the voltage across the two points.",
    howToUse: ['Enter voltage in volts.', 'Enter current in amperes.', 'Click Calculate to find resistance and power.'],
    example: { inputs: { voltage: 120, current: 10 }, output: '12.00 Ω', explanation: 'At 120V and 10A, resistance is 12 Ohms and power is 1,200 Watts.' },
    faqs: [{ question: 'What is Ohm’s law wheel?', answer: 'A circular formula chart showing all 12 mathematical relationships between Voltage, Current, Resistance, and Power.' }],
    keywords: ["ohm's law", 'voltage', 'current', 'resistance', 'watts', 'amps', 'ohms']
  },
  {
    id: 'voltage-calculator',
    slug: 'voltage-calculator',
    title: 'Voltage Calculator',
    category: 'electrical',
    shortDesc: 'Compute voltage across a load from current and resistance (V = I × R) or power.',
    icon: 'Activity',
    fields: [
      { id: 'current', label: 'Current (Amps)', type: 'number', defaultValue: 5, min: 0.001, step: 0.1 },
      { id: 'resistance', label: 'Resistance (Ohms)', type: 'number', defaultValue: 24, min: 0.001, step: 0.5 }
    ],
    calculate: (inputs) => {
      const i = parseFloat(inputs.current) || 0;
      const r = parseFloat(inputs.resistance) || 0;

      const v = i * r;
      const p = i * v;

      return {
        primaryValue: `${v.toFixed(2)} Volts`,
        primaryLabel: 'Calculated Voltage (V)',
        subtext: `Power: ${p.toFixed(2)} Watts`,
        breakdown: [
          { label: 'Current (I)', value: `${i} A` },
          { label: 'Resistance (R)', value: `${r} Ω` },
          { label: 'Voltage (V = I × R)', value: `${v.toFixed(2)} V` },
          { label: 'Power (P = I² × R)', value: `${p.toFixed(2)} W` }
        ],
        steps: [`Multiply current by resistance: ${i} × ${r} = ${v.toFixed(2)} Volts`]
      };
    },
    formula: 'V = I × R  |  V = P / I  |  V = √(P × R)',
    explanation: 'Voltage is the electric potential difference between two points, driving the flow of electric current.',
    howToUse: ['Enter current in Amperes and resistance in Ohms.', 'Click Calculate.'],
    example: { inputs: { current: 5, resistance: 24 }, output: '120.00 Volts', explanation: '5A × 24Ω = 120 Volts.' },
    faqs: [{ question: 'What is the standard household voltage in North America vs Europe?', answer: 'North America standard is 120V @ 60Hz, while Europe is 230V @ 50Hz.' }],
    keywords: ['voltage calculator', 'electric potential', 'volts', 'ohm law voltage']
  },
  {
    id: 'current-calculator',
    slug: 'current-calculator',
    title: 'Current Calculator (Amps)',
    category: 'electrical',
    shortDesc: 'Compute electrical current in Amperes from power and voltage or resistance.',
    icon: 'Repeat',
    fields: [
      { id: 'power', label: 'Power (Watts)', type: 'number', defaultValue: 1500, min: 1, step: 50 },
      { id: 'voltage', label: 'Voltage (Volts)', type: 'number', defaultValue: 120, min: 1, step: 1 }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.power) || 0;
      const v = parseFloat(inputs.voltage) || 120;

      const i = p / v;
      const r = (v * v) / p;

      return {
        primaryValue: `${i.toFixed(2)} Amps`,
        primaryLabel: 'Electric Current (I)',
        subtext: `Load Resistance: ${r.toFixed(2)} Ω`,
        breakdown: [
          { label: 'Power (P)', value: `${p} Watts` },
          { label: 'Voltage (V)', value: `${v} Volts` },
          { label: 'Current (I = P / V)', value: `${i.toFixed(2)} Amperes` },
          { label: 'Equivalent Resistance', value: `${r.toFixed(2)} Ohms` }
        ],
        steps: [`Divide Power by Voltage: ${p} / ${v} = ${i.toFixed(2)} Amps`]
      };
    },
    formula: 'I = P / V  |  I = V / R  |  I = √(P / R)',
    explanation: 'Electric current is the flow of electric charge carried by moving electrons in a circuit.',
    howToUse: ['Enter appliance wattage and circuit voltage.', 'Click Calculate.'],
    example: { inputs: { power: 1500, voltage: 120 }, output: '12.50 Amps', explanation: 'A 1500W space heater draws 12.5 Amps on a 120V circuit.' },
    faqs: [{ question: 'Can a 1500W heater run on a 15-Amp breaker?', answer: 'Yes, 12.5A is within the 80% continuous load rule (12A) of a 15A breaker.' }],
    keywords: ['current calculator', 'amperage calculator', 'amps from watts', 'draw current']
  },
  {
    id: 'resistance-calculator',
    slug: 'resistance-calculator',
    title: 'Resistance Calculator',
    category: 'electrical',
    shortDesc: 'Compute electrical resistance in Ohms from voltage, current, or power.',
    icon: 'MinusCircle',
    fields: [
      { id: 'voltage', label: 'Voltage (Volts)', type: 'number', defaultValue: 24, min: 0.1, step: 1 },
      { id: 'power', label: 'Power (Watts)', type: 'number', defaultValue: 48, min: 0.1, step: 1 }
    ],
    calculate: (inputs) => {
      const v = parseFloat(inputs.voltage) || 0;
      const p = parseFloat(inputs.power) || 1;

      const r = (v * v) / p;
      const i = p / v;

      return {
        primaryValue: `${r.toFixed(2)} Ω`,
        primaryLabel: 'Electrical Resistance',
        subtext: `Current Draw: ${i.toFixed(2)} Amps`,
        breakdown: [
          { label: 'Voltage', value: `${v} V` },
          { label: 'Power', value: `${p} W` },
          { label: 'Resistance (V² / P)', value: `${r.toFixed(2)} Ohms` },
          { label: 'Current (P / V)', value: `${i.toFixed(2)} A` }
        ],
        steps: [`R = V² / P = (${v})² / ${p} = ${r.toFixed(2)} Ω`]
      };
    },
    formula: 'R = V / I  |  R = V² / P  |  R = P / I²',
    explanation: 'Resistance measures how strongly a component opposes the flow of electric current.',
    howToUse: ['Enter voltage and power.', 'Click Calculate.'],
    example: { inputs: { voltage: 24, power: 48 }, output: '12.00 Ω', explanation: '24² / 48 = 576 / 48 = 12 Ohms.' },
    faqs: [{ question: 'What is a superconductor?', answer: 'A material that conducts electricity with exactly zero electrical resistance when cooled below its critical temperature.' }],
    keywords: ['resistance calculator', 'ohms', 'circuit resistance', 'resistor value']
  },
  {
    id: 'power-calculator',
    slug: 'power-calculator',
    title: 'Electrical Power Calculator (Watts)',
    category: 'electrical',
    shortDesc: 'Compute power dissipation in Watts from voltage, current, and resistance.',
    icon: 'Zap',
    badge: 'popular',
    fields: [
      { id: 'voltage', label: 'Voltage (Volts)', type: 'number', defaultValue: 120, min: 1, step: 1 },
      { id: 'current', label: 'Current (Amps)', type: 'number', defaultValue: 15, min: 0.1, step: 0.5 }
    ],
    calculate: (inputs) => {
      const v = parseFloat(inputs.voltage) || 0;
      const i = parseFloat(inputs.current) || 0;

      const w = v * i;
      const kw = w / 1000;
      const hp = w / 745.7;

      return {
        primaryValue: `${w.toLocaleString()} Watts (${kw.toFixed(2)} kW)`,
        primaryLabel: 'Electrical Power',
        subtext: `Horsepower equivalent: ${hp.toFixed(2)} HP`,
        breakdown: [
          { label: 'Watts (W)', value: `${w.toLocaleString()} W` },
          { label: 'Kilowatts (kW)', value: `${kw.toFixed(2)} kW` },
          { label: 'Horsepower (HP)', value: `${hp.toFixed(2)} HP` },
          { label: 'BTU per Hour', value: `${(w * 3.412142).toFixed(0)} BTU/hr` }
        ],
        steps: [`Multiply Voltage by Current: ${v} V × ${i} A = ${w} Watts`]
      };
    },
    formula: 'P = V × I  |  P = I² × R  |  P = V² / R',
    explanation: 'Electric power is the rate per unit time at which electrical energy is transferred by an electric circuit.',
    howToUse: ['Enter voltage and amperage.', 'Click Calculate.'],
    example: { inputs: { voltage: 120, current: 15 }, output: '1,800 Watts (1.80 kW)', explanation: '120V × 15A = 1,800 Watts.' },
    faqs: [{ question: 'What is apparent vs real power?', answer: 'Real power (Watts) performs physical work; apparent power (VA) includes reactive power in AC circuits.' }],
    keywords: ['power calculator', 'watts calculator', 'volts to watts', 'electrical load']
  },
  {
    id: 'electrical-cost-calculator',
    slug: 'electrical-cost-calculator',
    title: 'Electricity Cost Calculator',
    category: 'electrical',
    shortDesc: 'Compute daily, monthly, and annual running cost of any electrical appliance.',
    icon: 'DollarSign',
    badge: 'popular',
    fields: [
      { id: 'wattage', label: 'Appliance Power (Watts)', type: 'number', defaultValue: 1500, min: 1, step: 50 },
      { id: 'hoursPerDay', label: 'Hours Used per Day', type: 'number', defaultValue: 4, min: 0.1, max: 24, step: 0.5 },
      { id: 'ratePerKwh', label: 'Electricity Cost ($ per kWh)', type: 'number', defaultValue: 0.16, min: 0.01, step: 0.01 }
    ],
    calculate: (inputs) => {
      const watts = parseFloat(inputs.wattage) || 0;
      const hours = parseFloat(inputs.hoursPerDay) || 0;
      const rate = parseFloat(inputs.ratePerKwh) || 0.15;

      const dailyKwh = (watts * hours) / 1000;
      const monthlyKwh = dailyKwh * 30.42;
      const annualKwh = dailyKwh * 365;

      const dailyCost = dailyKwh * rate;
      const monthlyCost = monthlyKwh * rate;
      const annualCost = annualKwh * rate;

      return {
        primaryValue: `$${monthlyCost.toFixed(2)}/month`,
        primaryLabel: 'Monthly Electricity Cost',
        subtext: `Annual: $${annualCost.toFixed(2)}/year (${annualKwh.toFixed(0)} kWh/yr)`,
        breakdown: [
          { label: 'Daily Energy Used', value: `${dailyKwh.toFixed(2)} kWh ($${dailyCost.toFixed(2)}/day)` },
          { label: 'Monthly Energy Used', value: `${monthlyKwh.toFixed(1)} kWh` },
          { label: 'Monthly Cost', value: `$${monthlyCost.toFixed(2)}` },
          { label: 'Annual Cost', value: `$${annualCost.toFixed(2)}` }
        ],
        steps: [
          `Daily kWh = (${watts} W × ${hours} hrs) / 1000 = ${dailyKwh.toFixed(2)} kWh`,
          `Monthly cost = ${dailyKwh.toFixed(2)} kWh × 30.42 days × $${rate}/kWh = $${monthlyCost.toFixed(2)}`
        ]
      };
    },
    formula: 'Cost = (Watts × Hours / 1000) × Cost_per_kWh',
    explanation: 'Estimates utility bill charges based on appliance wattage, daily runtime, and utility rate per kilowatt-hour.',
    howToUse: ['Enter device wattage.', 'Enter average hours on per day.', 'Input electric rate from your electric bill.', 'Click Calculate.'],
    example: { inputs: { wattage: 1500, hoursPerDay: 4, ratePerKwh: 0.16 }, output: '$29.20/month', explanation: '6 kWh per day at $0.16/kWh equals ~$29.20 per month or $350.40 annually.' },
    faqs: [{ question: 'What uses the most electricity in a home?', answer: 'Central air conditioning and heating, followed by water heaters, refrigerators, and clothes dryers.' }],
    keywords: ['electricity cost calculator', 'kwh cost', 'appliance running cost', 'electric bill']
  },
  {
    id: 'resistor-calculator',
    slug: 'resistor-calculator',
    title: 'Resistor Color Code Calculator',
    category: 'electrical',
    shortDesc: 'Decode 4-band resistor color codes to resistance value and tolerance.',
    icon: 'ListFilter',
    fields: [
      {
        id: 'band1',
        label: '1st Band (Digit)',
        type: 'select',
        defaultValue: '4',
        options: [
          { label: 'Brown (1)', value: '1' },
          { label: 'Red (2)', value: '2' },
          { label: 'Orange (3)', value: '3' },
          { label: 'Yellow (4)', value: '4' },
          { label: 'Green (5)', value: '5' },
          { label: 'Blue (6)', value: '6' },
          { label: 'Violet (7)', value: '7' },
          { label: 'Grey (8)', value: '8' },
          { label: 'White (9)', value: '9' }
        ]
      },
      {
        id: 'band2',
        label: '2nd Band (Digit)',
        type: 'select',
        defaultValue: '7',
        options: [
          { label: 'Black (0)', value: '0' },
          { label: 'Brown (1)', value: '1' },
          { label: 'Red (2)', value: '2' },
          { label: 'Orange (3)', value: '3' },
          { label: 'Yellow (4)', value: '4' },
          { label: 'Green (5)', value: '5' },
          { label: 'Blue (6)', value: '6' },
          { label: 'Violet (7)', value: '7' },
          { label: 'Grey (8)', value: '8' },
          { label: 'White (9)', value: '9' }
        ]
      },
      {
        id: 'multiplier',
        label: '3rd Band (Multiplier)',
        type: 'select',
        defaultValue: '100',
        options: [
          { label: 'Black (×1)', value: '1' },
          { label: 'Brown (×10)', value: '10' },
          { label: 'Red (×100)', value: '100' },
          { label: 'Orange (×1k)', value: '1000' },
          { label: 'Yellow (×10k)', value: '10000' },
          { label: 'Green (×100k)', value: '100000' },
          { label: 'Blue (×1M)', value: '1000000' },
          { label: 'Gold (×0.1)', value: '0.1' },
          { label: 'Silver (×0.01)', value: '0.01' }
        ]
      },
      {
        id: 'tolerance',
        label: '4th Band (Tolerance)',
        type: 'select',
        defaultValue: '5',
        options: [
          { label: 'Gold (±5%)', value: '5' },
          { label: 'Silver (±10%)', value: '10' },
          { label: 'Brown (±1%)', value: '1' },
          { label: 'Red (±2%)', value: '2' }
        ]
      }
    ],
    calculate: (inputs) => {
      const d1 = inputs.band1 || '4';
      const d2 = inputs.band2 || '7';
      const mult = parseFloat(inputs.multiplier) || 100;
      const tol = parseFloat(inputs.tolerance) || 5;

      const digits = parseInt(`${d1}${d2}`) || 0;
      const ohms = digits * mult;

      let formattedOhms = '';
      if (ohms >= 1e6) formattedOhms = `${(ohms / 1e6).toFixed(2)} MΩ`;
      else if (ohms >= 1e3) formattedOhms = `${(ohms / 1e3).toFixed(2)} kΩ`;
      else formattedOhms = `${ohms} Ω`;

      const minOhms = ohms * (1 - tol / 100);
      const maxOhms = ohms * (1 + tol / 100);

      return {
        primaryValue: `${formattedOhms} ±${tol}%`,
        primaryLabel: 'Resistor Value',
        subtext: `Tolerance Range: ${minOhms.toFixed(1)} Ω to ${maxOhms.toFixed(1)} Ω`,
        breakdown: [
          { label: 'Base Digits', value: digits.toString() },
          { label: 'Multiplier', value: `× ${mult}` },
          { label: 'Nominal Resistance', value: `${ohms.toLocaleString()} Ohms` },
          { label: 'Tolerance', value: `±${tol}%` }
        ],
        steps: [`Digits: ${d1}${d2} = ${digits}`, `Multiply: ${digits} × ${mult} = ${ohms.toLocaleString()} Ohms ±${tol}%`]
      };
    },
    formula: 'Resistance = (Digit 1 × 10 + Digit 2) × Multiplier ± Tolerance %',
    explanation: 'Decodes electronic axial resistor color bands into standardized ohmic resistance values.',
    howToUse: ['Select the color of each band from left to right.', 'Click Calculate.'],
    example: { inputs: { band1: '4', band2: '7', multiplier: '100', tolerance: '5' }, output: '4.70 kΩ ±5%', explanation: 'Yellow (4), Violet (7), Red (×100), Gold (±5%) = 4,700 Ohms (4.7kΩ).' },
    faqs: [{ question: 'How do you tell which side of the resistor to read from?', answer: 'The tolerance band (usually Gold or Silver) is set apart with a wider gap, so start reading from the opposite end.' }],
    keywords: ['resistor color code', 'resistor calculator', 'ohms color bands', 'electronic components']
  },
  {
    id: 'series-parallel-calculator',
    slug: 'series-parallel-calculator',
    title: 'Series & Parallel Resistance Calculator',
    category: 'electrical',
    shortDesc: 'Calculate total equivalent resistance for resistors in series or parallel.',
    icon: 'GitBranch',
    fields: [
      { id: 'r1', label: 'Resistor 1 (Ohms)', type: 'number', defaultValue: 100, min: 0.1, step: 10 },
      { id: 'r2', label: 'Resistor 2 (Ohms)', type: 'number', defaultValue: 100, min: 0.1, step: 10 },
      { id: 'r3', label: 'Resistor 3 (Ohms) (optional)', type: 'number', defaultValue: 0, min: 0, step: 10 }
    ],
    calculate: (inputs) => {
      const r1 = parseFloat(inputs.r1) || 0;
      const r2 = parseFloat(inputs.r2) || 0;
      const r3 = parseFloat(inputs.r3) || 0;

      const validR = [r1, r2, r3].filter((r) => r > 0);
      if (validR.length < 2) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please provide at least 2 resistors.' };

      const rSeries = validR.reduce((sum, r) => sum + r, 0);
      const rParallel = 1 / validR.reduce((sum, r) => sum + 1 / r, 0);

      return {
        primaryValue: `Parallel: ${rParallel.toFixed(2)} Ω | Series: ${rSeries.toFixed(2)} Ω`,
        primaryLabel: 'Equivalent Resistance',
        subtext: `Tested on [${validR.join(' Ω, ')} Ω]`,
        breakdown: [
          { label: 'Series Total (R₁ + R₂ + ...)', value: `${rSeries.toFixed(2)} Ω` },
          { label: 'Parallel Total (1 / Σ(1/R))', value: `${rParallel.toFixed(2)} Ω` }
        ],
        steps: [
          `Series: Sum of resistors = ${validR.join(' + ')} = ${rSeries.toFixed(2)} Ω`,
          `Parallel: 1 / (${validR.map((r) => `1/${r}`).join(' + ')}) = ${rParallel.toFixed(2)} Ω`
        ]
      };
    },
    formula: 'Series: R_total = R₁ + R₂ + ...  |  Parallel: 1/R_total = 1/R₁ + 1/R₂ + ...',
    explanation: 'Resistors in series add directly; resistors in parallel decrease equivalent resistance below the smallest branch resistor.',
    howToUse: ['Enter resistor values in Ohms.', 'Click Calculate to compare series and parallel results.'],
    example: { inputs: { r1: 100, r2: 100, r3: 0 }, output: 'Parallel: 50.00 Ω | Series: 200.00 Ω', explanation: 'Two 100-ohm resistors in parallel give 50 ohms; in series they give 200 ohms.' },
    faqs: [{ question: 'Why does parallel resistance decrease?', answer: 'Parallel paths provide additional channels for current to flow, reducing overall circuit opposition.' }],
    keywords: ['series parallel resistance', 'equivalent resistance', 'parallel resistors', 'circuit builder']
  },
  {
    id: 'energy-calculator',
    slug: 'energy-calculator',
    title: 'Electrical Energy Calculator',
    category: 'electrical',
    shortDesc: 'Calculate total electrical energy in Watt-hours and Joules (E = P × t).',
    icon: 'BatteryCharging',
    fields: [
      { id: 'powerWatts', label: 'Power (Watts)', type: 'number', defaultValue: 100, min: 1, step: 10 },
      { id: 'hours', label: 'Time of Operation (Hours)', type: 'number', defaultValue: 10, min: 0.1, step: 1 }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.powerWatts) || 0;
      const t = parseFloat(inputs.hours) || 0;

      const wh = p * t;
      const kwh = wh / 1000;
      const joules = wh * 3600;

      return {
        primaryValue: `${kwh.toFixed(3)} kWh`,
        primaryLabel: 'Total Electrical Energy',
        subtext: `Equivalent to ${wh.toLocaleString()} Watt-hours or ${(joules / 1e6).toFixed(2)} Megajoules`,
        breakdown: [
          { label: 'Watt-hours (Wh)', value: `${wh.toLocaleString()} Wh` },
          { label: 'Kilowatt-hours (kWh)', value: `${kwh.toFixed(3)} kWh` },
          { label: 'Joules (J)', value: `${joules.toLocaleString()} J` },
          { label: 'Megajoules (MJ)', value: `${(joules / 1e6).toFixed(3)} MJ` }
        ],
        steps: [`Multiply power by hours: ${p} W × ${t} h = ${wh} Wh`, `Convert to kWh: ${wh} / 1000 = ${kwh.toFixed(3)} kWh`]
      };
    },
    formula: 'Energy (Wh) = Power (W) × Time (h)  |  1 kWh = 3,600,000 Joules',
    explanation: 'Measures total work delivered by electricity over a specified operating timeframe.',
    howToUse: ['Enter appliance power in Watts.', 'Enter running time in hours.', 'Click Calculate.'],
    example: { inputs: { powerWatts: 100, hours: 10 }, output: '1.000 kWh', explanation: 'A 100W light bulb on for 10 hours consumes exactly 1 kilowatt-hour of energy.' },
    faqs: [{ question: 'What is 1 kWh equivalent to in battery terms?', answer: 'Roughly eighty 12V 1Ah lithium battery cells.' }],
    keywords: ['electrical energy', 'kwh calculator', 'watt hours', 'energy consumption']
  }
];

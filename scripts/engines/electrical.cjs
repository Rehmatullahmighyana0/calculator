const { toNum, formatNum } = require('./utils.cjs');

const engines = {
  'ohms-law-calculator': (inputs) => {
    const v = toNum(inputs.voltage, 120);
    const i = toNum(inputs.current, 10);

    if (i <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Current must be strictly positive.' };

    const r = v / i;
    const p = v * i;

    return {
      primaryValue: `${formatNum(r, 2)} Ω (Ohms)`,
      primaryLabel: 'Resistance (R = V / I)',
      subtext: `Dissipated Power: ${formatNum(p, 2)} Watts (W)`,
      breakdown: [
        { label: 'Voltage (V)', value: `${formatNum(v, 2)} Volts (V)` },
        { label: 'Current (I)', value: `${formatNum(i, 2)} Amperes (A)` },
        { label: 'Resistance (R)', value: `${formatNum(r, 4)} Ohms (Ω)` },
        { label: 'Power (P = V × I)', value: `${formatNum(p, 2)} Watts (W)` }
      ],
      steps: [
        `Ohm's Law: R = V / I`,
        `R = ${v} V / ${i} A = ${formatNum(r, 2)} Ω`,
        `Power: P = V × I = ${v} × ${i} = ${formatNum(p, 2)} W`
      ]
    };
  },

  'voltage-calculator': (inputs) => {
    const i = toNum(inputs.current, 5);
    const r = toNum(inputs.resistance, 24);

    const v = i * r;
    const p = i * i * r;

    return {
      primaryValue: `${formatNum(v, 2)} Volts (V)`,
      primaryLabel: 'Calculated Voltage (V = I × R)',
      subtext: `Power Dissipation: ${formatNum(p, 2)} Watts`,
      breakdown: [
        { label: 'Current (I)', value: `${formatNum(i, 2)} A` },
        { label: 'Resistance (R)', value: `${formatNum(r, 2)} Ω` },
        { label: 'Voltage (V)', value: `${formatNum(v, 2)} V` },
        { label: 'Power (P = I²R)', value: `${formatNum(p, 2)} W` }
      ],
      steps: [
        `Voltage formula: V = I × R`,
        `V = ${i} A × ${r} Ω = ${formatNum(v, 2)} Volts`,
        `Power = (${i})² × ${r} = ${formatNum(p, 2)} W`
      ]
    };
  },

  'current-calculator': (inputs) => {
    const p = toNum(inputs.power, 1500);
    const v = toNum(inputs.voltage, 120);

    if (v <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Voltage must be positive.' };

    const i = p / v;
    const r = v / i;

    return {
      primaryValue: `${formatNum(i, 2)} Amperes (A)`,
      primaryLabel: 'Current Draw (I = P / V)',
      subtext: `Equivalent Load Resistance: ${formatNum(r, 2)} Ω`,
      breakdown: [
        { label: 'Power Load (P)', value: `${formatNum(p, 1)} W` },
        { label: 'Supply Voltage (V)', value: `${formatNum(v, 1)} V` },
        { label: 'Current Draw (I)', value: `${formatNum(i, 3)} A` },
        { label: 'Resistance (R = V²/P)', value: `${formatNum(r, 2)} Ω` }
      ],
      steps: [
        `Formula: Current = Power / Voltage`,
        `I = ${p} W / ${v} V = ${formatNum(i, 2)} Amps`,
        `Load resistance = ${v} / ${formatNum(i, 2)} = ${formatNum(r, 2)} Ω`
      ]
    };
  },

  'resistance-calculator': (inputs) => {
    const v = toNum(inputs.voltage, 24);
    const p = toNum(inputs.power, 48);

    if (p <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Power must be positive.' };

    const r = (v * v) / p;
    const i = p / v;

    return {
      primaryValue: `${formatNum(r, 2)} Ω`,
      primaryLabel: 'Resistance (R = V² / P)',
      subtext: `Resulting Current: ${formatNum(i, 2)} A`,
      breakdown: [
        { label: 'Voltage (V)', value: `${formatNum(v)} V` },
        { label: 'Power Dissipated (P)', value: `${formatNum(p)} W` },
        { label: 'Resistance (R)', value: `${formatNum(r, 3)} Ω` },
        { label: 'Current (I = P/V)', value: `${formatNum(i, 3)} A` }
      ],
      steps: [
        `Formula: R = V² / P`,
        `R = (${v})² / ${p} = ${v * v} / ${p} = ${formatNum(r, 2)} Ω`
      ]
    };
  },

  'power-calculator': (inputs) => {
    const v = toNum(inputs.voltage, 120);
    const i = toNum(inputs.current, 15);

    const p = v * i;
    const hp = p / 745.699872;

    return {
      primaryValue: `${formatNum(p, 1)} Watts (W)`,
      primaryLabel: 'Electrical Power (P = V × I)',
      subtext: `Kilowatts: ${formatNum(p / 1000, 3)} kW | Horsepower: ${formatNum(hp, 2)} hp`,
      breakdown: [
        { label: 'Voltage (V)', value: `${formatNum(v)} V` },
        { label: 'Current (I)', value: `${formatNum(i)} A` },
        { label: 'Real Power (W)', value: `${formatNum(p, 1)} W` },
        { label: 'Kilowatts (kW)', value: `${formatNum(p / 1000, 3)} kW` },
        { label: 'Equivalent Horsepower', value: `${formatNum(hp, 2)} hp` }
      ],
      steps: [
        `Formula: P = V × I`,
        `P = ${v} V × ${i} A = ${formatNum(p, 1)} Watts`,
        `Kilowatts = ${formatNum(p, 1)} / 1000 = ${formatNum(p / 1000, 3)} kW`
      ]
    };
  },

  'electrical-cost-calculator': (inputs) => {
    const watts = toNum(inputs.wattage, 1500);
    const hoursPerDay = toNum(inputs.hoursPerDay, 4);
    const rateKwh = toNum(inputs.ratePerKwh, 0.16);

    const dailyKwh = (watts * hoursPerDay) / 1000;
    const dailyCost = dailyKwh * rateKwh;
    const monthlyCost = dailyCost * 30.4167; // average month days
    const annualCost = dailyCost * 365;

    return {
      primaryValue: `$${formatNum(monthlyCost, 2)} / month`,
      primaryLabel: 'Estimated Monthly Electric Cost',
      subtext: `Daily Cost: $${formatNum(dailyCost, 2)} | Annual Cost: $${formatNum(annualCost, 2)} (${formatNum(dailyKwh * 365, 0)} kWh/yr)`,
      breakdown: [
        { label: 'Appliance Rating', value: `${formatNum(watts)} Watts (${formatNum(watts / 1000, 2)} kW)` },
        { label: 'Usage per Day', value: `${hoursPerDay} hours` },
        { label: 'Daily Energy Used', value: `${formatNum(dailyKwh, 2)} kWh` },
        { label: 'Rate per kWh', value: `$${formatNum(rateKwh, 3)} / kWh` },
        { label: 'Daily Electricity Cost', value: `$${formatNum(dailyCost, 3)}` },
        { label: 'Monthly Cost (30 days)', value: `$${formatNum(monthlyCost, 2)}` },
        { label: 'Annual Electricity Cost', value: `$${formatNum(annualCost, 2)}` }
      ],
      steps: [
        `Daily Energy = (${watts} W × ${hoursPerDay} hrs) / 1000 = ${formatNum(dailyKwh, 2)} kWh/day`,
        `Daily Cost = ${formatNum(dailyKwh, 2)} kWh × $${rateKwh} = $${formatNum(dailyCost, 3)}`,
        `Monthly Cost = $${formatNum(dailyCost, 3)} × 30.42 = $${formatNum(monthlyCost, 2)}`
      ]
    };
  },

  'resistor-calculator': (inputs) => {
    const b1 = Math.round(toNum(inputs.band1, 4)); // yellow
    const b2 = Math.round(toNum(inputs.band2, 7)); // violet
    const mult = toNum(inputs.multiplier, 100);   // red
    const tol = toNum(inputs.tolerance, 5);       // gold 5%

    const baseVal = (b1 * 10 + b2) * mult;
    let formattedVal = `${baseVal} Ω`;
    if (baseVal >= 1e6) formattedVal = `${formatNum(baseVal / 1e6, 2)} MΩ`;
    else if (baseVal >= 1e3) formattedVal = `${formatNum(baseVal / 1e3, 2)} kΩ`;

    const minVal = baseVal * (1 - tol / 100);
    const maxVal = baseVal * (1 + tol / 100);

    return {
      primaryValue: `${formattedVal} ±${tol}%`,
      primaryLabel: '4-Band Resistor Value',
      subtext: `Tolerance Range: ${formatNum(minVal)} Ω to ${formatNum(maxVal)} Ω`,
      breakdown: [
        { label: 'Significant Digits (Bands 1 & 2)', value: `${b1}${b2}` },
        { label: 'Multiplier Band', value: `× ${mult}` },
        { label: 'Nominal Resistance', value: formattedVal },
        { label: 'Tolerance (Band 4)', value: `±${tol}%` },
        { label: 'Minimum Permissible', value: `${formatNum(minVal)} Ω` },
        { label: 'Maximum Permissible', value: `${formatNum(maxVal)} Ω` }
      ],
      steps: [
        `Combine Band 1 (${b1}) and Band 2 (${b2}) = ${b1}${b2}`,
        `Multiply by Band 3 multiplier: ${b1}${b2} × ${mult} = ${baseVal} Ω (${formattedVal})`,
        `Apply ±${tol}% tolerance: ${formatNum(minVal)} Ω - ${formatNum(maxVal)} Ω`
      ]
    };
  },

  'series-parallel-calculator': (inputs) => {
    const r1 = toNum(inputs.r1, 100);
    const r2 = toNum(inputs.r2, 100);
    const r3 = toNum(inputs.r3, 0);

    const series = r1 + r2 + r3;

    // Parallel: 1/R = 1/R1 + 1/R2 + 1/R3 (ignore 0)
    const valid = [r1, r2, r3].filter((r) => r > 0);
    const sumInv = valid.reduce((acc, r) => acc + (1 / r), 0);
    const parallel = sumInv > 0 ? 1 / sumInv : 0;

    return {
      primaryValue: `Series: ${formatNum(series, 2)} Ω | Parallel: ${formatNum(parallel, 2)} Ω`,
      primaryLabel: 'Equivalent Resistance',
      subtext: `Computed for ${valid.length} resistors in circuit configuration`,
      breakdown: [
        { label: 'Resistors', value: valid.map((r) => `${r} Ω`).join(', ') },
        { label: 'Series Total (R₁ + R₂ + R₃)', value: `${formatNum(series, 2)} Ω` },
        { label: 'Parallel Total (1 / Σ(1/Rᵢ))', value: `${formatNum(parallel, 3)} Ω` }
      ],
      steps: [
        `Series addition: R_s = ${valid.join(' + ')} = ${formatNum(series, 2)} Ω`,
        `Parallel reciprocal sum: 1/R_p = ${valid.map((r) => `(1/${r})`).join(' + ')} = ${formatNum(sumInv, 6)}`,
        `R_p = 1 / ${formatNum(sumInv, 6)} = ${formatNum(parallel, 3)} Ω`
      ]
    };
  },

  'energy-calculator': (inputs) => {
    const watts = toNum(inputs.powerWatts, 100);
    const hours = toNum(inputs.hours, 10);

    const wh = watts * hours;
    const kwh = wh / 1000;
    const joules = wh * 3600;

    return {
      primaryValue: `${formatNum(kwh, 3)} kWh`,
      primaryLabel: 'Total Electrical Energy Consumed',
      subtext: `Watt-hours: ${formatNum(wh, 1)} Wh | Joules: ${formatNum(joules, 0)} J`,
      breakdown: [
        { label: 'Power Consumption', value: `${watts} Watts` },
        { label: 'Operating Time', value: `${hours} hours` },
        { label: 'Energy in Kilowatt-hours', value: `${formatNum(kwh, 3)} kWh` },
        { label: 'Energy in Joules (J)', value: `${joules.toLocaleString('en-US')} J` }
      ],
      steps: [
        `Formula: Energy (kWh) = (Watts × Hours) / 1000`,
        `Energy = (${watts} × ${hours}) / 1000 = ${formatNum(kwh, 3)} kWh`,
        `In Joules: ${formatNum(kwh, 3)} kWh × 3,600,000 J/kWh = ${joules.toLocaleString('en-US')} Joules`
      ]
    };
  }
};

module.exports = engines;


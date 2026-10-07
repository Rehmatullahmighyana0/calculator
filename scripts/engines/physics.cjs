const { toNum, formatNum } = require('./utils.cjs');

const engines = {
  'force-calculator': (inputs) => {
    const m = toNum(inputs.mass, 1200);
    const a = toNum(inputs.acceleration, 3.5);

    const f = m * a;

    return {
      primaryValue: `${formatNum(f, 2)} Newtons (N)`,
      primaryLabel: 'Net Force (F = m × a)',
      subtext: `Kilonewtons: ${formatNum(f / 1000, 3)} kN | Pound-force: ${formatNum(f / 4.448222, 2)} lbf`,
      breakdown: [
        { label: 'Mass (m)', value: `${formatNum(m)} kg` },
        { label: 'Acceleration (a)', value: `${formatNum(a)} m/s²` },
        { label: 'Force (F = ma)', value: `${formatNum(f, 2)} N` },
        { label: 'Pound-force (lbf)', value: `${formatNum(f / 4.448222, 2)} lbf` }
      ],
      steps: [
        `Newton's Second Law: F = m × a`,
        `F = ${m} kg × ${a} m/s² = ${formatNum(f, 2)} N`
      ]
    };
  },

  'kinetic-energy-calculator': (inputs) => {
    const m = toNum(inputs.massKg, 1500);
    const v = toNum(inputs.velocityMs, 25);

    const ke = 0.5 * m * v * v;

    return {
      primaryValue: `${formatNum(ke, 1)} Joules (J)`,
      primaryLabel: 'Kinetic Energy (½ mv²)',
      subtext: `Kilojoules: ${formatNum(ke / 1000, 2)} kJ | Megajoules: ${formatNum(ke / 1e6, 4)} MJ`,
      breakdown: [
        { label: 'Mass (m)', value: `${formatNum(m)} kg` },
        { label: 'Velocity (v)', value: `${formatNum(v)} m/s (${formatNum(v * 3.6, 1)} km/h)` },
        { label: 'Kinetic Energy', value: `${formatNum(ke, 1)} J` },
        { label: 'Kilojoules (kJ)', value: `${formatNum(ke / 1000, 2)} kJ` }
      ],
      steps: [
        `Formula: KE = 0.5 × m × v²`,
        `KE = 0.5 × ${m} kg × (${v} m/s)² = 0.5 × ${m} × ${v * v} = ${formatNum(ke, 1)} Joules`
      ]
    };
  },

  'potential-energy-calculator': (inputs) => {
    const m = toNum(inputs.massKg, 50);
    const h = toNum(inputs.heightM, 20);
    const g = toNum(inputs.gravity, 9.80665);

    const pe = m * g * h;

    return {
      primaryValue: `${formatNum(pe, 1)} Joules (J)`,
      primaryLabel: 'Gravitational Potential Energy (mgh)',
      subtext: `Kilojoules: ${formatNum(pe / 1000, 3)} kJ`,
      breakdown: [
        { label: 'Mass (m)', value: `${formatNum(m)} kg` },
        { label: 'Height (h)', value: `${formatNum(h)} m` },
        { label: 'Gravitational Acceleration (g)', value: `${formatNum(g, 4)} m/s²` },
        { label: 'Potential Energy (PE)', value: `${formatNum(pe, 1)} J` }
      ],
      steps: [
        `Formula: PE = m × g × h`,
        `PE = ${m} kg × ${g} m/s² × ${h} m = ${formatNum(pe, 1)} Joules`
      ]
    };
  },

  'velocity-calculator': (inputs) => {
    const d = toNum(inputs.distanceM, 100);
    const t = toNum(inputs.timeSec, 9.58);

    if (t <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Time duration must be strictly positive.' };

    const v = d / t;
    const kmh = v * 3.6;
    const mph = v * 2.23694;

    return {
      primaryValue: `${formatNum(v, 2)} m/s`,
      primaryLabel: 'Average Velocity / Speed',
      subtext: `${formatNum(kmh, 2)} km/h | ${formatNum(mph, 2)} mph`,
      breakdown: [
        { label: 'Distance (d)', value: `${formatNum(d)} meters` },
        { label: 'Elapsed Time (t)', value: `${formatNum(t)} seconds` },
        { label: 'Meters per Second', value: `${formatNum(v, 4)} m/s` },
        { label: 'Kilometers per Hour', value: `${formatNum(kmh, 2)} km/h` },
        { label: 'Miles per Hour', value: `${formatNum(mph, 2)} mph` }
      ],
      steps: [
        `Formula: Velocity = Distance / Time`,
        `v = ${d} m / ${t} s = ${formatNum(v, 4)} m/s`,
        `v = ${formatNum(v, 4)} × 3.6 = ${formatNum(kmh, 2)} km/h`
      ]
    };
  },

  'acceleration-calculator': (inputs) => {
    const v0 = toNum(inputs.vInitial, 0);
    const vf = toNum(inputs.vFinal, 27.78);
    const t = toNum(inputs.time, 3.2);

    if (t <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Time must be positive.' };

    const a = (vf - v0) / t;
    const dist = v0 * t + 0.5 * a * t * t;
    const gForces = a / 9.80665;

    return {
      primaryValue: `${formatNum(a, 2)} m/s²`,
      primaryLabel: 'Linear Acceleration (a)',
      subtext: `g-Force: ${formatNum(gForces, 2)} g | Distance Traveled: ${formatNum(dist, 1)} m`,
      breakdown: [
        { label: 'Initial Velocity (v₀)', value: `${formatNum(v0)} m/s (${formatNum(v0 * 3.6, 1)} km/h)` },
        { label: 'Final Velocity (v_f)', value: `${formatNum(vf)} m/s (${formatNum(vf * 3.6, 1)} km/h)` },
        { label: 'Time Elapsed (t)', value: `${formatNum(t)} s` },
        { label: 'Acceleration (a)', value: `${formatNum(a, 4)} m/s²` },
        { label: 'Displacement (s)', value: `${formatNum(dist, 2)} meters` }
      ],
      steps: [
        `Formula: a = (v_f - v₀) / t`,
        `a = (${vf} - ${v0}) / ${t} = ${formatNum(vf - v0, 2)} / ${t} = ${formatNum(a, 2)} m/s²`,
        `Distance = v₀t + ½at² = ${formatNum(dist, 2)} m`
      ]
    };
  },

  'work-calculator': (inputs) => {
    const f = toNum(inputs.forceN, 150);
    const d = toNum(inputs.distanceM, 10);
    const deg = toNum(inputs.angleDeg, 0);

    const rad = deg * (Math.PI / 180);
    const w = f * d * Math.cos(rad);

    return {
      primaryValue: `${formatNum(w, 2)} Joules (J)`,
      primaryLabel: 'Work Done (W = F × d × cos θ)',
      subtext: `Force: ${f} N, Distance: ${d} m, Angle: ${deg}°`,
      breakdown: [
        { label: 'Force (F)', value: `${f} N` },
        { label: 'Displacement (d)', value: `${d} m` },
        { label: 'Angle θ', value: `${deg}° (cos θ = ${formatNum(Math.cos(rad), 4)})` },
        { label: 'Mechanical Work Done', value: `${formatNum(w, 2)} J (N·m)` }
      ],
      steps: [
        `Formula: W = F × d × cos(θ)`,
        `cos(${deg}°) = ${formatNum(Math.cos(rad), 4)}`,
        `W = ${f} × ${d} × ${formatNum(Math.cos(rad), 4)} = ${formatNum(w, 2)} Joules`
      ]
    };
  },

  'momentum-calculator': (inputs) => {
    const m = toNum(inputs.massKg, 80);
    const v = toNum(inputs.velocityMs, 12);

    const p = m * v;
    const ke = 0.5 * m * v * v;

    return {
      primaryValue: `${formatNum(p, 2)} kg·m/s`,
      primaryLabel: 'Linear Momentum (p = m × v)',
      subtext: `Associated Kinetic Energy: ${formatNum(ke, 1)} J`,
      breakdown: [
        { label: 'Mass (m)', value: `${m} kg` },
        { label: 'Velocity (v)', value: `${v} m/s` },
        { label: 'Momentum (p = mv)', value: `${formatNum(p, 2)} kg·m/s (N·s)` },
        { label: 'Kinetic Energy (p²/2m)', value: `${formatNum(ke, 1)} J` }
      ],
      steps: [
        `Formula: p = m × v`,
        `p = ${m} kg × ${v} m/s = ${formatNum(p, 2)} kg·m/s`
      ]
    };
  },

  'density-calculator': (inputs) => {
    const m = toNum(inputs.mass, 19.3);
    const v = toNum(inputs.volume, 1);

    if (v <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Volume must be strictly positive.' };

    const rho = m / v;

    return {
      primaryValue: `${formatNum(rho, 4)} g/cm³`,
      primaryLabel: 'Density (ρ = m / V)',
      subtext: `SI Equivalent: ${formatNum(rho * 1000, 1)} kg/m³`,
      breakdown: [
        { label: 'Mass (m)', value: `${formatNum(m)} g` },
        { label: 'Volume (V)', value: `${formatNum(v)} cm³` },
        { label: 'Density (ρ)', value: `${formatNum(rho, 4)} g/cm³` },
        { label: 'SI Metric (kg/m³)', value: `${formatNum(rho * 1000, 1)} kg/m³` }
      ],
      steps: [
        `Formula: ρ = mass / volume`,
        `ρ = ${m} / ${v} = ${formatNum(rho, 4)} g/cm³`
      ]
    };
  },

  'pressure-physics-calculator': (inputs) => {
    const f = toNum(inputs.forceN, 5000);
    const a = toNum(inputs.areaM2, 0.05);

    if (a <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Surface contact area must be positive.' };

    const p = f / a;
    const kpa = p / 1000;
    const bar = p / 100000;
    const psi = p / 6894.757;

    return {
      primaryValue: `${formatNum(p, 1)} Pa (Pascals)`,
      primaryLabel: 'Pressure (P = F / A)',
      subtext: `${formatNum(kpa, 2)} kPa | ${formatNum(bar, 3)} bar | ${formatNum(psi, 2)} psi`,
      breakdown: [
        { label: 'Normal Force (F)', value: `${formatNum(f)} N` },
        { label: 'Area (A)', value: `${formatNum(a)} m²` },
        { label: 'Pressure (Pa)', value: `${formatNum(p, 1)} Pa (N/m²)` },
        { label: 'Kilopascals (kPa)', value: `${formatNum(kpa, 2)} kPa` },
        { label: 'Bar', value: `${formatNum(bar, 4)} bar` },
        { label: 'PSI', value: `${formatNum(psi, 2)} psi` }
      ],
      steps: [
        `Formula: P = F / A`,
        `P = ${f} N / ${a} m² = ${formatNum(p, 1)} Pascals`
      ]
    };
  },

  'coulombs-law-calculator': (inputs) => {
    const q1 = toNum(inputs.q1, 0.000001);
    const q2 = toNum(inputs.q2, 0.000002);
    const r = toNum(inputs.r, 0.05);

    if (r <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Distance r must be greater than zero.' };

    const k = 8.9875517923e9; // N·m²/C²
    const f = (k * Math.abs(q1 * q2)) / (r * r);
    const isAttractive = (q1 > 0 && q2 < 0) || (q1 < 0 && q2 > 0);

    return {
      primaryValue: `${formatNum(f, 3)} N (${isAttractive ? 'Attraction' : 'Repulsion'})`,
      primaryLabel: 'Electrostatic Force (F)',
      subtext: `Coulomb Constant k ≈ 8.99 × 10⁹ N·m²/C²`,
      breakdown: [
        { label: 'Charge 1 (q₁)', value: `${q1.toExponential(4)} C` },
        { label: 'Charge 2 (q₂)', value: `${q2.toExponential(4)} C` },
        { label: 'Distance (r)', value: `${r} m` },
        { label: 'Force Nature', value: isAttractive ? 'Attractive (Opposite signs)' : 'Repulsive (Same sign)' },
        { label: 'Electrostatic Force', value: `${formatNum(f, 4)} Newtons` }
      ],
      steps: [
        `Formula: F = k × |q₁ × q₂| / r²`,
        `k = 8.988 × 10⁹ N·m²/C²`,
        `F = (8.988e9 × |${q1} × ${q2}|) / (${r})² = ${formatNum(f, 3)} N`
      ]
    };
  },

  'gravitational-force-calculator': (inputs) => {
    const m1 = toNum(inputs.m1, 5.972e24);
    const m2 = toNum(inputs.m2, 70);
    const r = toNum(inputs.r, 6371000);

    if (m1 <= 0 || m2 <= 0 || r <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Masses and separation distance must be positive.' };

    const G = 6.67430e-11; // N·m²/kg²
    const f = (G * m1 * m2) / (r * r);

    return {
      primaryValue: `${formatNum(f, 2)} Newtons (N)`,
      primaryLabel: 'Universal Gravitational Force',
      subtext: `G = 6.674 × 10⁻¹¹ N·m²/kg²`,
      breakdown: [
        { label: 'Mass 1 (m₁)', value: `${m1.toExponential(4)} kg` },
        { label: 'Mass 2 (m₂)', value: `${m2} kg` },
        { label: 'Separation (r)', value: `${r.toExponential(4)} m` },
        { label: 'Attractive Force (F)', value: `${formatNum(f, 2)} N` }
      ],
      steps: [
        `Newton's Law: F = G × (m₁ × m₂) / r²`,
        `F = (6.674e-11 × ${m1} × ${m2}) / (${r})² = ${formatNum(f, 2)} N`
      ]
    };
  },

  'heat-energy-calculator': (inputs) => {
    const m = toNum(inputs.mass, 2.5);
    const c = toNum(inputs.specificHeat, 4184);
    const t1 = toNum(inputs.tempInitial, 20);
    const t2 = toNum(inputs.tempFinal, 80);

    const deltaT = t2 - t1;
    const q = m * c * deltaT;
    const qKJ = q / 1000;

    return {
      primaryValue: `${formatNum(qKJ, 2)} kJ (${Math.round(q).toLocaleString('en-US')} J)`,
      primaryLabel: 'Thermal Heat Energy (Q)',
      subtext: `Temperature Change ΔT = ${formatNum(deltaT, 1)} °C`,
      breakdown: [
        { label: 'Mass (m)', value: `${m} kg` },
        { label: 'Specific Heat (c)', value: `${c} J/(kg·°C)` },
        { label: 'Initial Temp (T₁)', value: `${t1} °C` },
        { label: 'Final Temp (T₂)', value: `${t2} °C` },
        { label: 'Temp Delta (ΔT)', value: `${formatNum(deltaT, 2)} °C` },
        { label: 'Heat Transferred (Q)', value: `${formatNum(qKJ, 2)} kJ` }
      ],
      steps: [
        `Formula: Q = m × c × ΔT`,
        `ΔT = ${t2} - ${t1} = ${formatNum(deltaT, 1)} °C`,
        `Q = ${m} kg × ${c} J/kg°C × ${deltaT} °C = ${Math.round(q)} Joules (${formatNum(qKJ, 2)} kJ)`
      ]
    };
  },

  'wavelength-calculator': (inputs) => {
    const type = inputs.waveType || 'light';
    const f = toNum(inputs.frequency, 100000000);
    const customV = toNum(inputs.customSpeed, 300);

    if (f <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Frequency must be strictly positive.' };

    let v = 299792458; // speed of light in vacuum
    if (type === 'sound') v = 343; // sound in air 20C
    else if (type === 'custom') v = customV;

    const lambda = v / f;
    const period = 1 / f;

    let lambdaFormatted = `${formatNum(lambda, 4)} m`;
    if (lambda < 1e-6) lambdaFormatted = `${formatNum(lambda * 1e9, 2)} nm`;
    else if (lambda < 1e-3) lambdaFormatted = `${formatNum(lambda * 1e6, 2)} µm`;
    else if (lambda < 1) lambdaFormatted = `${formatNum(lambda * 100, 2)} cm`;
    else if (lambda >= 1000) lambdaFormatted = `${formatNum(lambda / 1000, 3)} km`;

    return {
      primaryValue: lambdaFormatted,
      primaryLabel: 'Wavelength (λ = v / f)',
      subtext: `Wave Velocity: ${formatNum(v)} m/s | Period: ${period.toExponential(3)} s`,
      breakdown: [
        { label: 'Wave Velocity (v)', value: `${formatNum(v)} m/s` },
        { label: 'Frequency (f)', value: `${formatNum(f)} Hz` },
        { label: 'Wavelength (λ)', value: lambdaFormatted },
        { label: 'Wave Period (T = 1/f)', value: `${period.toExponential(4)} seconds` }
      ],
      steps: [
        `Formula: λ = v / f`,
        `λ = ${v} m/s / ${f} Hz = ${formatNum(lambda, 6)} meters (${lambdaFormatted})`
      ]
    };
  }
};

module.exports = engines;


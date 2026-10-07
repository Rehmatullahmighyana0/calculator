import { CalculatorDef } from '../../types/calculator';

export const physicsCalculators: CalculatorDef[] = [
  {
    id: 'force-calculator',
    slug: 'force-calculator',
    title: 'Force Calculator (Newton Second Law)',
    category: 'physics',
    shortDesc: 'Calculate net force from mass and acceleration using Newton’s Second Law F = m × a.',
    icon: 'Activity',
    badge: 'popular',
    fields: [
      { id: 'mass', label: 'Mass (m in kg)', type: 'number', defaultValue: 1200, min: 0.001, step: 1 },
      { id: 'acceleration', label: 'Acceleration (a in m/s²)', type: 'number', defaultValue: 3.5, step: 0.1 }
    ],
    calculate: (inputs) => {
      const m = parseFloat(inputs.mass) || 0;
      const a = parseFloat(inputs.acceleration) || 0;

      const f = m * a;
      const lbf = f * 0.224809;

      return {
        primaryValue: `${f.toLocaleString('en-US', { maximumFractionDigits: 2 })} N`,
        primaryLabel: 'Net Force (Newtons)',
        subtext: `Equivalent to ${lbf.toFixed(2)} pounds-force (lbf)`,
        breakdown: [
          { label: 'Mass (m)', value: `${m} kg` },
          { label: 'Acceleration (a)', value: `${a} m/s²` },
          { label: 'Net Force (F = m × a)', value: `${f.toFixed(2)} Newtons (N)` },
          { label: 'Force in Kilonewtons', value: `${(f / 1000).toFixed(4)} kN` },
          { label: 'Pounds-force (lbf)', value: `${lbf.toFixed(2)} lbf` }
        ],
        steps: [`Apply Newton's Second Law: F = m × a = ${m} kg × ${a} m/s² = ${f.toFixed(2)} N`]
      };
    },
    formula: 'F = m × a (Force = Mass × Acceleration)',
    explanation: 'Newton’s second law states that the force acting on an object is equal to the mass of that object times its acceleration.',
    howToUse: ['Enter mass in kilograms.', 'Enter acceleration in meters per second squared.', 'Click Calculate.'],
    example: { inputs: { mass: 1200, acceleration: 3.5 }, output: '4,200.00 N', explanation: 'A 1,200kg vehicle accelerating at 3.5 m/s² requires 4,200 Newtons of force.' },
    faqs: [{ question: 'What is 1 Newton in everyday terms?', answer: 'Roughly the force of Earth’s gravity pulling on a medium-sized apple (~102 grams).' }],
    keywords: ['force calculator', 'f=ma', 'newton second law', 'acceleration to force']
  },
  {
    id: 'kinetic-energy-calculator',
    slug: 'kinetic-energy-calculator',
    title: 'Kinetic Energy Calculator',
    category: 'physics',
    shortDesc: 'Compute the kinetic energy of a moving object from mass and velocity (KE = ½mv²).',
    icon: 'Flame',
    badge: 'popular',
    fields: [
      { id: 'massKg', label: 'Mass (kg)', type: 'number', defaultValue: 1500, min: 0.01, step: 10 },
      { id: 'velocityMs', label: 'Velocity (m/s)', type: 'number', defaultValue: 25, min: 0, step: 1 }
    ],
    calculate: (inputs) => {
      const m = parseFloat(inputs.massKg) || 0;
      const v = parseFloat(inputs.velocityMs) || 0;

      const ke = 0.5 * m * v * v;
      const kj = ke / 1000;
      const speedKmh = v * 3.6;

      return {
        primaryValue: `${ke.toLocaleString('en-US', { maximumFractionDigits: 1 })} Joules`,
        primaryLabel: 'Kinetic Energy',
        subtext: `${kj.toFixed(2)} kJ (Speed: ${speedKmh.toFixed(1)} km/h or ${(v * 2.237).toFixed(1)} mph)`,
        breakdown: [
          { label: 'Mass', value: `${m} kg` },
          { label: 'Velocity', value: `${v} m/s (${speedKmh.toFixed(1)} km/h)` },
          { label: 'Kinetic Energy (0.5 × m × v²)', value: `${ke.toLocaleString()} J` },
          { label: 'Kilojoules (kJ)', value: `${kj.toFixed(2)} kJ` },
          { label: 'Foot-pounds (ft-lb)', value: `${(ke * 0.737562).toLocaleString('en-US', { maximumFractionDigits: 0 })} ft-lb` }
        ],
        steps: [`Multiply: 0.5 × ${m} kg × (${v} m/s)² = 0.5 × ${m} × ${v * v} = ${ke.toFixed(1)} Joules`]
      };
    },
    formula: 'KE = ½ × m × v²',
    explanation: 'Kinetic energy is the energy that an object possesses due to its motion, scaling quadratically with velocity.',
    howToUse: ['Enter mass in kilograms.', 'Enter velocity in meters per second.', 'Click Calculate.'],
    example: { inputs: { massKg: 1500, velocityMs: 25 }, output: '468,750.0 Joules', explanation: 'A 1,500kg car driving at 90 km/h possesses 468.75 kJ of kinetic energy.' },
    faqs: [{ question: 'Why does doubling speed quadruple braking distance?', answer: 'Because kinetic energy scales with the square of velocity (v²).' }],
    keywords: ['kinetic energy calculator', 'ke = 1/2 mv2', 'joules calculator', 'motion energy']
  },
  {
    id: 'potential-energy-calculator',
    slug: 'potential-energy-calculator',
    title: 'Gravitational Potential Energy Calculator',
    category: 'physics',
    shortDesc: 'Compute gravitational potential energy of an elevated mass (PE = m × g × h).',
    icon: 'ArrowDownUp',
    fields: [
      { id: 'massKg', label: 'Mass (kg)', type: 'number', defaultValue: 50, min: 0.01, step: 1 },
      { id: 'heightM', label: 'Height above ground (m)', type: 'number', defaultValue: 20, min: 0, step: 1 },
      { id: 'gravity', label: 'Gravitational Acceleration (g in m/s²)', type: 'number', defaultValue: 9.80665, step: 0.01 }
    ],
    calculate: (inputs) => {
      const m = parseFloat(inputs.massKg) || 0;
      const h = parseFloat(inputs.heightM) || 0;
      const g = parseFloat(inputs.gravity) || 9.81;

      const pe = m * g * h;
      const kj = pe / 1000;

      return {
        primaryValue: `${pe.toLocaleString('en-US', { maximumFractionDigits: 1 })} Joules`,
        primaryLabel: 'Gravitational Potential Energy',
        subtext: `${kj.toFixed(3)} kJ (${(pe * 0.737562).toFixed(1)} ft-lb)`,
        breakdown: [
          { label: 'Mass (m)', value: `${m} kg` },
          { label: 'Height (h)', value: `${h} meters` },
          { label: 'Gravity constant (g)', value: `${g} m/s²` },
          { label: 'Potential Energy (mgh)', value: `${pe.toFixed(1)} Joules` }
        ],
        steps: [`Multiply mass × gravity × height: ${m} × ${g} × ${h} = ${pe.toFixed(1)} Joules`]
      };
    },
    formula: 'PE = m × g × h',
    explanation: 'Gravitational potential energy is stored energy an object possesses due to its vertical elevation in a gravitational field.',
    howToUse: ['Enter mass in kg and height in meters.', 'Click Calculate.'],
    example: { inputs: { massKg: 50, heightM: 20, gravity: 9.80665 }, output: '9,806.7 Joules', explanation: 'A 50kg weight lifted 20 meters stores 9.81 kJ of potential energy.' },
    faqs: [{ question: 'What is g on the Moon?', answer: 'Lunar gravity is approximately 1.62 m/s² (~16.6% of Earth’s).' }],
    keywords: ['potential energy', 'pe = mgh', 'gravitational energy', 'physics']
  },
  {
    id: 'velocity-calculator',
    slug: 'velocity-calculator',
    title: 'Velocity & Speed Calculator',
    category: 'physics',
    shortDesc: 'Compute velocity from distance and time (v = d / t) with acceleration models.',
    icon: 'FastForward',
    fields: [
      { id: 'distanceM', label: 'Distance Traveled (Meters)', type: 'number', defaultValue: 100, min: 0.1, step: 1 },
      { id: 'timeSec', label: 'Time Elapsed (Seconds)', type: 'number', defaultValue: 9.58, min: 0.01, step: 0.01 }
    ],
    calculate: (inputs) => {
      const d = parseFloat(inputs.distanceM) || 0;
      const t = parseFloat(inputs.timeSec) || 1;

      if (t <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Time must be positive.' };

      const vMs = d / t;
      const vKmh = vMs * 3.6;
      const vMph = vMs * 2.23694;

      return {
        primaryValue: `${vMs.toFixed(2)} m/s`,
        primaryLabel: 'Average Velocity',
        subtext: `${vKmh.toFixed(2)} km/h | ${vMph.toFixed(2)} mph`,
        breakdown: [
          { label: 'Distance', value: `${d} m` },
          { label: 'Time', value: `${t} s` },
          { label: 'Meters per Second', value: `${vMs.toFixed(2)} m/s` },
          { label: 'Kilometers per Hour', value: `${vKmh.toFixed(2)} km/h` },
          { label: 'Miles per Hour', value: `${vMph.toFixed(2)} mph` }
        ],
        steps: [`Divide distance by time: ${d} m / ${t} s = ${vMs.toFixed(2)} m/s`]
      };
    },
    formula: 'v = d / t',
    explanation: 'Velocity is the directional speed of an object in motion as an indication of its rate of position change.',
    howToUse: ['Enter distance in meters and time in seconds.', 'Click Calculate.'],
    example: { inputs: { distanceM: 100, timeSec: 9.58 }, output: '10.44 m/s', explanation: 'Usain Bolt’s 100m world record average velocity is 10.44 m/s (37.58 km/h).' },
    faqs: [{ question: 'Difference between speed and velocity?', answer: 'Speed is a scalar (magnitude only); velocity is a vector having both magnitude and direction.' }],
    keywords: ['velocity calculator', 'speed calculator', 'v = d/t', 'meters per second to kmh']
  },
  {
    id: 'acceleration-calculator',
    slug: 'acceleration-calculator',
    title: 'Acceleration Calculator',
    category: 'physics',
    shortDesc: 'Compute acceleration rate from initial velocity, final velocity, and elapsed time.',
    icon: 'TrendingUp',
    fields: [
      { id: 'vInitial', label: 'Initial Velocity v₀ (m/s)', type: 'number', defaultValue: 0, step: 1 },
      { id: 'vFinal', label: 'Final Velocity v (m/s)', type: 'number', defaultValue: 27.78, step: 1 },
      { id: 'time', label: 'Time Elapsed t (Seconds)', type: 'number', defaultValue: 3.2, min: 0.01, step: 0.1 }
    ],
    calculate: (inputs) => {
      const v0 = parseFloat(inputs.vInitial) || 0;
      const v = parseFloat(inputs.vFinal) || 0;
      const t = parseFloat(inputs.time) || 1;

      if (t <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Time must be positive.' };

      const a = (v - v0) / t;
      const gForce = a / 9.80665;
      const dist = v0 * t + 0.5 * a * t * t;

      return {
        primaryValue: `${a.toFixed(2)} m/s²`,
        primaryLabel: 'Average Acceleration',
        subtext: `G-Force: ${gForce.toFixed(2)} g | Distance Traveled: ${dist.toFixed(1)} m`,
        breakdown: [
          { label: 'Initial Velocity', value: `${v0} m/s (${(v0 * 3.6).toFixed(1)} km/h)` },
          { label: 'Final Velocity', value: `${v} m/s (${(v * 3.6).toFixed(1)} km/h)` },
          { label: 'Acceleration Rate', value: `${a.toFixed(2)} m/s²` },
          { label: 'Equivalent G-Force', value: `${gForce.toFixed(2)} g` },
          { label: 'Distance Covered (d = v₀t + ½at²)', value: `${dist.toFixed(2)} meters` }
        ],
        steps: [`Calculate velocity change: Δv = ${v} - ${v0} = ${(v - v0).toFixed(2)} m/s`, `Divide by time: Δv / ${t} = ${a.toFixed(2)} m/s²`]
      };
    },
    formula: 'a = (v - v₀) / t  |  d = v₀t + ½at²',
    explanation: 'Acceleration is the rate of change of velocity with respect to time.',
    howToUse: ['Enter starting and ending velocities.', 'Enter time taken.', 'Click Calculate.'],
    example: { inputs: { vInitial: 0, vFinal: 27.78, time: 3.2 }, output: '8.68 m/s²', explanation: '0 to 100 km/h (27.78 m/s) in 3.2s gives an acceleration of 8.68 m/s² (0.89 g).' },
    faqs: [{ question: 'What is deceleration?', answer: 'Deceleration is negative acceleration, indicating that the object is slowing down.' }],
    keywords: ['acceleration calculator', 'rate of change of speed', 'g force', '0 to 60 acceleration']
  },
  {
    id: 'work-calculator',
    slug: 'work-calculator',
    title: 'Work Calculator',
    category: 'physics',
    shortDesc: 'Compute mechanical work in Joules from force, displacement, and angle (W = F × d × cos θ).',
    icon: 'Maximize',
    fields: [
      { id: 'forceN', label: 'Force (Newtons)', type: 'number', defaultValue: 150, step: 5 },
      { id: 'distanceM', label: 'Displacement (Meters)', type: 'number', defaultValue: 10, step: 0.5 },
      { id: 'angleDeg', label: 'Angle θ (Degrees between Force and Motion)', type: 'number', defaultValue: 0, min: 0, max: 180, step: 5 }
    ],
    calculate: (inputs) => {
      const f = parseFloat(inputs.forceN) || 0;
      const d = parseFloat(inputs.distanceM) || 0;
      const deg = parseFloat(inputs.angleDeg) || 0;

      const rad = deg * (Math.PI / 180);
      const w = f * d * Math.cos(rad);

      return {
        primaryValue: `${w.toFixed(2)} Joules`,
        primaryLabel: 'Mechanical Work Done',
        subtext: `Force: ${f} N | Displacement: ${d} m | Angle: ${deg}°`,
        breakdown: [
          { label: 'Force', value: `${f} N` },
          { label: 'Displacement', value: `${d} m` },
          { label: 'cos(θ)', value: Math.cos(rad).toFixed(4) },
          { label: 'Total Work Done', value: `${w.toFixed(2)} J` }
        ],
        steps: [`Calculate angle cosine: cos(${deg}°) = ${Math.cos(rad).toFixed(4)}`, `Work = ${f} × ${d} × ${Math.cos(rad).toFixed(4)} = ${w.toFixed(2)} Joules`]
      };
    },
    formula: 'W = F × d × cos(θ)',
    explanation: 'Work is the measure of energy transfer that occurs when an object is moved over a distance by an external force at least partly in the direction of the displacement.',
    howToUse: ['Enter applied force and displacement.', 'Enter angle θ (0° if force is aligned with motion).', 'Click Calculate.'],
    example: { inputs: { forceN: 150, distanceM: 10, angleDeg: 0 }, output: '1,500.00 Joules', explanation: '150 N × 10 m × cos(0°) = 1,500 Joules.' },
    faqs: [{ question: 'What if the angle is 90 degrees?', answer: 'If force is perpendicular to motion (e.g. holding a suitcase while walking), cos(90°) = 0, so zero mechanical work is done.' }],
    keywords: ['work calculator', 'physics work', 'joules', 'force times distance']
  },
  {
    id: 'momentum-calculator',
    slug: 'momentum-calculator',
    title: 'Linear Momentum Calculator',
    category: 'physics',
    shortDesc: 'Compute linear momentum of a moving mass (p = m × v).',
    icon: 'Move',
    fields: [
      { id: 'massKg', label: 'Mass (kg)', type: 'number', defaultValue: 80, min: 0.01, step: 1 },
      { id: 'velocityMs', label: 'Velocity (m/s)', type: 'number', defaultValue: 12, step: 0.5 }
    ],
    calculate: (inputs) => {
      const m = parseFloat(inputs.massKg) || 0;
      const v = parseFloat(inputs.velocityMs) || 0;

      const p = m * v;

      return {
        primaryValue: `${p.toFixed(2)} kg·m/s`,
        primaryLabel: 'Linear Momentum (p)',
        subtext: `Mass: ${m} kg | Velocity: ${v} m/s`,
        breakdown: [
          { label: 'Mass (m)', value: `${m} kg` },
          { label: 'Velocity (v)', value: `${v} m/s` },
          { label: 'Momentum (p = m × v)', value: `${p.toFixed(2)} kg·m/s (N·s)` }
        ],
        steps: [`Multiply mass by velocity: ${m} kg × ${v} m/s = ${p.toFixed(2)} kg·m/s`]
      };
    },
    formula: 'p = m × v',
    explanation: 'Linear momentum is the product of the mass and velocity of an object, conserved in all closed physical systems.',
    howToUse: ['Enter mass and velocity.', 'Click Calculate.'],
    example: { inputs: { massKg: 80, velocityMs: 12 }, output: '960.00 kg·m/s', explanation: '80 kg × 12 m/s = 960 kg·m/s.' },
    faqs: [{ question: 'What is the law of conservation of momentum?', answer: 'In an isolated system without external forces, the total momentum before any collision equals total momentum after.' }],
    keywords: ['momentum calculator', 'linear momentum', 'p=mv', 'collision physics']
  },
  {
    id: 'density-calculator',
    slug: 'density-calculator',
    title: 'Density Calculator (ρ = m / V)',
    category: 'physics',
    shortDesc: 'Compute physical density from mass and volume or solve for unknown mass.',
    icon: 'Box',
    fields: [
      { id: 'mass', label: 'Mass (kg)', type: 'number', defaultValue: 19.3, min: 0.001, step: 0.1 },
      { id: 'volume', label: 'Volume (Liters)', type: 'number', defaultValue: 1, min: 0.001, step: 0.1 }
    ],
    calculate: (inputs) => {
      const m = parseFloat(inputs.mass) || 0;
      const vLiters = parseFloat(inputs.volume) || 1;

      if (vLiters <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Volume must be positive.' };

      const vCuM = vLiters / 1000;
      const densityKgM3 = m / vCuM;
      const densityGcm3 = densityKgM3 / 1000;

      let materialHint = '';
      if (Math.abs(densityGcm3 - 1) < 0.05) materialHint = 'Water (~1.0 g/cm³)';
      else if (Math.abs(densityGcm3 - 19.3) < 0.5) materialHint = 'Pure Gold (~19.3 g/cm³)';
      else if (Math.abs(densityGcm3 - 7.8) < 0.5) materialHint = 'Iron / Steel (~7.8 g/cm³)';
      else if (Math.abs(densityGcm3 - 2.7) < 0.3) materialHint = 'Aluminum (~2.7 g/cm³)';

      return {
        primaryValue: `${densityGcm3.toFixed(2)} g/cm³`,
        primaryLabel: 'Material Density (ρ)',
        subtext: `${densityKgM3.toFixed(0)} kg/m³${materialHint ? ` - Resembles ${materialHint}` : ''}`,
        breakdown: [
          { label: 'Mass', value: `${m} kg` },
          { label: 'Volume', value: `${vLiters} L (${vCuM.toFixed(4)} m³)` },
          { label: 'Density (g/cm³)', value: `${densityGcm3.toFixed(3)} g/cm³` },
          { label: 'Density (kg/m³)', value: `${densityKgM3.toFixed(1)} kg/m³` },
          { label: 'Specific Gravity (vs Water)', value: densityGcm3.toFixed(3) }
        ],
        steps: [`Convert volume to m³: ${vLiters} L / 1000 = ${vCuM} m³`, `Density = ${m} kg / ${vCuM} m³ = ${densityKgM3.toFixed(1)} kg/m³`]
      };
    },
    formula: 'ρ = m / V  |  Specific Gravity = ρ_substance / ρ_water',
    explanation: 'Density is a characteristic physical property defined as mass per unit volume.',
    howToUse: ['Enter mass in kg.', 'Enter volume in liters.', 'Click Calculate.'],
    example: { inputs: { mass: 19.3, volume: 1 }, output: '19.30 g/cm³', explanation: '19.3 kg in 1 Liter matches the exact density of 24K gold.' },
    faqs: [{ question: 'Will an object float in water?', answer: 'If its density is less than 1.0 g/cm³ (water density), it will float.' }],
    keywords: ['density calculator', 'mass over volume', 'specific gravity', 'material density']
  },
  {
    id: 'pressure-physics-calculator',
    slug: 'pressure-physics-calculator',
    title: 'Physical Pressure Calculator',
    category: 'physics',
    shortDesc: 'Compute pressure in Pascals and atmospheres from applied force and contact surface area.',
    icon: 'Gauge',
    fields: [
      { id: 'forceN', label: 'Applied Force (Newtons)', type: 'number', defaultValue: 5000, min: 1, step: 100 },
      { id: 'areaM2', label: 'Contact Surface Area (m²)', type: 'number', defaultValue: 0.05, min: 0.0001, step: 0.005 }
    ],
    calculate: (inputs) => {
      const f = parseFloat(inputs.forceN) || 0;
      const a = parseFloat(inputs.areaM2) || 1;

      if (a <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Area must be greater than zero.' };

      const pa = f / a;
      const kpa = pa / 1000;
      const bar = pa / 100000;
      const psi = pa / 6894.757;

      return {
        primaryValue: `${kpa.toFixed(2)} kPa`,
        primaryLabel: 'Pressure Generated',
        subtext: `${bar.toFixed(3)} Bar | ${psi.toFixed(2)} PSI (${pa.toLocaleString()} Pascals)`,
        breakdown: [
          { label: 'Force', value: `${f} N` },
          { label: 'Area', value: `${a} m²` },
          { label: 'Pascals (N/m²)', value: `${pa.toLocaleString()} Pa` },
          { label: 'Kilopascals', value: `${kpa.toFixed(2)} kPa` },
          { label: 'PSI', value: `${psi.toFixed(2)} psi` }
        ],
        steps: [`Pressure = Force / Area = ${f} N / ${a} m² = ${pa.toFixed(1)} Pascals`]
      };
    },
    formula: 'P = F / A (1 Pascal = 1 Newton / m²)',
    explanation: 'Pressure is the perpendicular force applied per unit area on a surface.',
    howToUse: ['Enter applied force in Newtons and contact area in square meters.', 'Click Calculate.'],
    example: { inputs: { forceN: 5000, areaM2: 0.05 }, output: '100.00 kPa', explanation: '5,000 N over 0.05 m² produces 100 kPa (~14.5 PSI).' },
    faqs: [{ question: 'Why are sharp knives more effective at cutting?', answer: 'Because the blade’s edge has a tiny surface area A, creating enormous pressure with minimal force.' }],
    keywords: ['pressure calculator', 'p = f/a', 'pascals', 'surface pressure']
  }
];

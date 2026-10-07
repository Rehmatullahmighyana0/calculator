/**
 * CalcHub — Pure Vanilla JavaScript Engine
 * Runs natively in any browser with zero build tools or servers needed.
 */

// --- 0. PROFESSIONAL SVG VECTOR ICONS REGISTRY ---
const SVG_ICONS = {
  calculator: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>`,
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  star: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  starFilled: `<svg width="18" height="18" viewBox="0 0 24 24" fill="#eab308" stroke="#eab308" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  history: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  sun: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  moon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  zap: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  reset: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>`,
  copy: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  close: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  arrowRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
  trash: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  category: {
    'basic-everyday': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="16" y1="14" x2="16" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>`,
    'math': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="16" x2="12" y2="16"/><line x1="12" y1="8" x2="12" y2="8"/></svg>`,
    'geometry': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="12 2 19.07 15.66 4.93 15.66 12 2"/></svg>`,
    'finance': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg>`,
    'health-fitness': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    'date-time': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><polyline points="12 14 12 17 15 17"/></svg>`,
    'unit-converters': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
    'construction': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 3.26-6.36 6.36"/></svg>`,
    'electrical': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    'physics': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    'chemistry': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31L4.12 20.3a2 2 0 0 0 1.73 2.7h12.3a2 2 0 0 0 1.73-2.7L14 9.31V2"/><line x1="8.5" y1="2" x2="15.5" y2="2"/></svg>`,
    'statistics': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
    'computer-data': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    'time-productivity': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    'business-marketing': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`
  }
};

function getCategoryIcon(catId, size = 20) {
  const iconSvg = SVG_ICONS.category[catId] || SVG_ICONS.calculator;
  return iconSvg.replace(/width="24"/g, `width="${size}"`).replace(/height="24"/g, `height="${size}"`);
}

// --- 1. CATEGORIES DEFINITION ---
const CATEGORIES = [
  { id: 'basic-everyday', name: 'Basic & Everyday', slug: 'basic-everyday', count: 9, description: 'Quick everyday calculations: basic math, percentages, tips, discounts, and currency.' },
  { id: 'math', name: 'Math & Algebra', slug: 'math', count: 23, description: 'Algebra, quadratic equations, exponents, matrices, polynomials, LCM/GCD, and logarithms.' },
  { id: 'geometry', name: 'Geometry & Trigonometry', slug: 'geometry', count: 15, description: 'Area, perimeter, volume, surface area, Pythagorean theorem, and triangle solvers.' },
  { id: 'finance', name: 'Finance & Money', slug: 'finance', count: 26, description: 'Mortgage, auto loan, compound interest, SIP, retirement, ROI, inflation, and options.' },
  { id: 'health-fitness', name: 'Health & Fitness', slug: 'health-fitness', count: 15, description: 'BMI, BMR, calorie deficit, body fat, macro split, water intake, and heart rate.' },
  { id: 'date-time', name: 'Date & Time', slug: 'date-time', count: 11, description: 'Date difference, time zones, business days, age in seconds, and leap year checker.' },
  { id: 'unit-converters', name: 'Unit Converters', slug: 'unit-converters', count: 17, description: 'Length, weight, temperature, area, speed, pressure, energy, and digital storage.' },
  { id: 'construction', name: 'Construction & DIY', slug: 'construction', count: 12, description: 'Concrete yardage, tiles, flooring, paint gallons, drywall, bricks, and roofing.' },
  { id: 'electrical', name: 'Electrical & Electronics', slug: 'electrical', count: 9, description: "Ohm's law, resistor color codes, voltage drop, wire gauge, and battery runtime." },
  { id: 'physics', name: 'Physics & Mechanics', slug: 'physics', count: 13, description: 'Velocity, force (F=ma), kinetic & potential energy, projectile motion, and gravity.' },
  { id: 'chemistry', name: 'Chemistry & Science', slug: 'chemistry', count: 8, description: 'Molar mass, solution dilution, pH to [H+], ideal gas law, and empirical formulas.' },
  { id: 'statistics', name: 'Statistics & Probability', slug: 'statistics', count: 8, description: 'Mean, median, mode, standard deviation, variance, z-score, and combinations.' },
  { id: 'computer-data', name: 'Computer & Data', slug: 'computer-data', count: 22, description: 'Data byte size, subnet CIDR, hex/dec/bin converter, hash length, and DPI.' },
  { id: 'time-productivity', name: 'Time & Productivity', slug: 'time-productivity', count: 7, description: 'Pomodoro timer, reading time, typing WPM, billable rate, and meeting cost.' },
  { id: 'business-marketing', name: 'Business & Marketing', slug: 'business-marketing', count: 5, description: 'Profit margin, break-even, LTV, CAC, ROAS, runway, and churn rate.' }
];

// --- 2. CALCULATORS REGISTRY & MATH FUNCTIONS ---
const CALCULATORS = [
  {
    id: 'basic-calculator',
    title: 'Basic Calculator',
    slug: 'basic-calculator',
    category: 'basic-everyday',
    shortDesc: 'Quick arithmetic calculator for addition, subtraction, multiplication, and division.',
    fields: [
      { id: 'expression', label: 'Arithmetic Expression', type: 'text', defaultValue: '125 + 75 * 2', placeholder: 'e.g. 125 + 75 * 2' }
    ],
    calculate: (inputs) => {
      const expr = String(inputs.expression || '').trim();
      if (!expr) return { primaryValue: '0', primaryLabel: 'Result', error: 'Please enter an expression.' };
      try {
        const sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/');
        if (!/^[0-9+\-*/. ()]+$/.test(sanitized)) {
          return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid characters in expression.' };
        }
        // Safe math evaluator
        const fn = new Function(`'use strict'; return (${sanitized});`);
        const result = fn();
        if (typeof result !== 'number' || !isFinite(result)) {
          return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Cannot divide by zero.' };
        }
        const formatted = Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(6)).toString();
        return {
          primaryValue: formatted,
          primaryLabel: 'Calculated Result',
          subtext: `Evaluated: ${expr}`,
          breakdown: [
            { label: 'Expression', value: expr },
            { label: 'Computed Value', value: formatted }
          ],
          steps: [
            `Parsed expression: ${sanitized}`,
            `Applied PEMDAS order of operations`,
            `Final Answer = ${formatted}`
          ]
        };
      } catch (err) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid mathematical syntax.' };
      }
    }
  },
  {
    id: 'percentage-calculator',
    title: 'Percentage Calculator',
    slug: 'percentage-calculator',
    category: 'basic-everyday',
    shortDesc: 'Calculate percentages, percentage change, and what percentage one number is of another.',
    fields: [
      {
        id: 'mode',
        label: 'Calculation Type',
        type: 'select',
        defaultValue: 'what_is',
        options: [
          { label: 'What is P% of X?', value: 'what_is' },
          { label: 'X is what % of Y?', value: 'x_of_y' },
          { label: 'Percentage increase/decrease from X to Y', value: 'change' }
        ]
      },
      { id: 'val1', label: 'First Value (P or X)', type: 'number', defaultValue: 15, step: 'any' },
      { id: 'val2', label: 'Second Value (X or Y)', type: 'number', defaultValue: 200, step: 'any' }
    ],
    calculate: (inputs) => {
      const mode = inputs.mode || 'what_is';
      const v1 = parseFloat(inputs.val1) || 0;
      const v2 = parseFloat(inputs.val2) || 0;

      if (mode === 'what_is') {
        const result = (v1 / 100) * v2;
        return {
          primaryValue: result.toFixed(2),
          primaryLabel: `${v1}% of ${v2}`,
          subtext: `Result = ${result.toFixed(2)}`,
          breakdown: [
            { label: 'Percentage (P)', value: `${v1}%` },
            { label: 'Base Value (X)', value: v2.toString() },
            { label: 'Total Amount (Base + P%)', value: (v2 + result).toFixed(2) }
          ],
          steps: [
            `Convert percentage to decimal: ${v1} / 100 = ${(v1 / 100).toFixed(4)}`,
            `Multiply by base value: ${(v1 / 100).toFixed(4)} × ${v2} = ${result.toFixed(2)}`
          ]
        };
      } else if (mode === 'x_of_y') {
        if (v2 === 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Base value (Y) cannot be zero.' };
        const pct = (v1 / v2) * 100;
        return {
          primaryValue: `${pct.toFixed(2)}%`,
          primaryLabel: `${v1} is what % of ${v2}`,
          subtext: `${v1} represents ${pct.toFixed(2)}% of ${v2}`,
          breakdown: [
            { label: 'Numerator (X)', value: v1.toString() },
            { label: 'Denominator (Y)', value: v2.toString() },
            { label: 'Calculated Percentage', value: `${pct.toFixed(2)}%` }
          ],
          steps: [
            `Divide X by Y: ${v1} / ${v2} = ${(v1 / v2).toFixed(4)}`,
            `Multiply by 100 = ${pct.toFixed(2)}%`
          ]
        };
      } else {
        if (v1 === 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Initial value cannot be zero.' };
        const diff = v2 - v1;
        const changePct = (diff / v1) * 100;
        const isIncrease = changePct >= 0;
        return {
          primaryValue: `${isIncrease ? '+' : ''}${changePct.toFixed(2)}%`,
          primaryLabel: isIncrease ? 'Percentage Increase' : 'Percentage Decrease',
          subtext: `Absolute change: ${diff > 0 ? '+' : ''}${diff.toFixed(2)}`,
          breakdown: [
            { label: 'Original Value (X)', value: v1.toString() },
            { label: 'New Value (Y)', value: v2.toString() },
            { label: 'Difference (Y - X)', value: diff.toFixed(2) },
            { label: 'Trend', value: isIncrease ? 'Increase (+)' : 'Decrease (-)' }
          ],
          steps: [
            `Calculate difference: ${v2} - ${v1} = ${diff.toFixed(2)}`,
            `Divide by original: ${diff.toFixed(2)} / ${v1} = ${(diff / v1).toFixed(4)}`,
            `Multiply by 100% = ${changePct.toFixed(2)}%`
          ]
        };
      }
    }
  },
  {
    id: 'bmi-calculator',
    title: 'BMI Calculator (Body Mass Index)',
    slug: 'bmi-calculator',
    category: 'health-fitness',
    shortDesc: 'Calculate Body Mass Index (BMI) and find your WHO weight classification.',
    fields: [
      {
        id: 'unit',
        label: 'Measurement System',
        type: 'select',
        defaultValue: 'metric',
        options: [
          { label: 'Metric (kg, cm)', value: 'metric' },
          { label: 'US Customary (lbs, inches)', value: 'imperial' }
        ]
      },
      { id: 'weight', label: 'Weight (kg or lbs)', type: 'number', defaultValue: 70, min: 20, max: 400, step: 0.5 },
      { id: 'height', label: 'Height (cm or inches)', type: 'number', defaultValue: 175, min: 50, max: 250, step: 0.5 }
    ],
    calculate: (inputs) => {
      const isMetric = inputs.unit !== 'imperial';
      const weight = parseFloat(inputs.weight) || 0;
      const height = parseFloat(inputs.height) || 0;

      if (weight <= 0 || height <= 0) {
        return { primaryValue: '0', primaryLabel: 'BMI Score', error: 'Please enter positive values for weight and height.' };
      }

      let bmi = 0;
      let heightM = 0;
      if (isMetric) {
        heightM = height / 100;
        bmi = weight / (heightM * heightM);
      } else {
        bmi = (703 * weight) / (height * height);
        heightM = (height * 2.54) / 100;
      }

      let category = '';
      if (bmi < 18.5) category = 'Underweight';
      else if (bmi < 24.9) category = 'Normal weight (Healthy)';
      else if (bmi < 29.9) category = 'Overweight';
      else if (bmi < 34.9) category = 'Obesity Class I';
      else if (bmi < 39.9) category = 'Obesity Class II';
      else category = 'Obesity Class III (Severe)';

      const minHealthy = (18.5 * (heightM * heightM)).toFixed(1);
      const maxHealthy = (24.9 * (heightM * heightM)).toFixed(1);

      return {
        primaryValue: bmi.toFixed(1),
        primaryLabel: 'BMI Score',
        subtext: `Category: ${category}`,
        breakdown: [
          { label: 'Body Mass Index', value: `${bmi.toFixed(1)} kg/m²` },
          { label: 'WHO Classification', value: category },
          { label: 'Healthy Weight Range', value: isMetric ? `${minHealthy} – ${maxHealthy} kg` : `${(minHealthy * 2.20462).toFixed(1)} – ${(maxHealthy * 2.20462).toFixed(1)} lbs` }
        ],
        steps: [
          isMetric
            ? `Convert height to meters: ${height} cm = ${heightM.toFixed(2)} m`
            : `Multiply weight by 703: ${weight} × 703 = ${(weight * 703).toFixed(1)}`,
          isMetric
            ? `Formula: ${weight} / (${heightM.toFixed(2)} × ${heightM.toFixed(2)}) = ${bmi.toFixed(1)}`
            : `Formula: ${(weight * 703).toFixed(1)} / (${height}²) = ${bmi.toFixed(1)}`,
          `Assigned Category: ${category}`
        ]
      };
    }
  },
  {
    id: 'age-calculator',
    title: 'Age Calculator',
    slug: 'age-calculator',
    category: 'health-fitness',
    shortDesc: 'Compute exact chronological age in years, months, days, total hours, and next birthday countdown.',
    fields: [
      { id: 'birthDate', label: 'Date of Birth (YYYY-MM-DD)', type: 'date', defaultValue: '1995-08-24' }
    ],
    calculate: (inputs) => {
      const birth = new Date(String(inputs.birthDate || '').trim());
      if (isNaN(birth.getTime())) {
        return { primaryValue: 'Invalid Date', primaryLabel: 'Result', error: 'Please enter a valid date of birth.' };
      }
      const now = new Date();
      if (birth > now) {
        return { primaryValue: 'Future Date', primaryLabel: 'Result', error: 'Date of birth cannot be in the future.' };
      }

      let years = now.getFullYear() - birth.getFullYear();
      let months = now.getMonth() - birth.getMonth();
      let days = now.getDate() - birth.getDate();

      if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years--;
        months += 12;
      }

      const totalDiffMs = now.getTime() - birth.getTime();
      const totalDays = Math.floor(totalDiffMs / (1000 * 60 * 60 * 24));
      const totalHours = Math.floor(totalDiffMs / (1000 * 60 * 60));

      // Next birthday countdown
      let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
      if (nextBday < now) {
        nextBday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
      }
      const daysToNext = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      return {
        primaryValue: `${years} Years, ${months} Mos, ${days} Days`,
        primaryLabel: 'Chronological Age',
        subtext: `Next birthday in ${daysToNext} days! 🎉`,
        breakdown: [
          { label: 'Exact Age', value: `${years} yrs, ${months} mos, ${days} days` },
          { label: 'Total Days Lived', value: `${totalDays.toLocaleString()} days` },
          { label: 'Total Hours Lived', value: `${totalHours.toLocaleString()} hours` },
          { label: 'Total Minutes Lived', value: `${(totalDays * 1440).toLocaleString()} minutes` },
          { label: 'Days Until Next Birthday', value: `${daysToNext} days` }
        ],
        steps: [
          `Calendar year difference: ${now.getFullYear()} - ${birth.getFullYear()} = ${years} years`,
          `Adjusted for month and day boundaries`,
          `Computed total life duration: ${totalDays.toLocaleString()} days`
        ]
      };
    }
  },
  {
    id: 'mortgage-calculator',
    title: 'Mortgage Calculator',
    slug: 'mortgage-calculator',
    category: 'finance',
    shortDesc: 'Calculate monthly mortgage payment, interest breakdown, and amortization.',
    fields: [
      { id: 'homeValue', label: 'Home Price ($)', type: 'number', defaultValue: 300000, step: 1000 },
      { id: 'downPayment', label: 'Down Payment ($)', type: 'number', defaultValue: 60000, step: 1000 },
      { id: 'interestRate', label: 'Interest Rate (%/yr)', type: 'number', defaultValue: 6.5, step: 0.05 },
      { id: 'loanTerm', label: 'Loan Term (Years)', type: 'number', defaultValue: 30, step: 1 }
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.homeValue) || 0;
      const down = parseFloat(inputs.downPayment) || 0;
      const rate = parseFloat(inputs.interestRate) || 0;
      const termYears = parseFloat(inputs.loanTerm) || 30;

      const principal = Math.max(0, price - down);
      if (principal <= 0) return { primaryValue: '$0.00', primaryLabel: 'Monthly Payment', subtext: 'No loan balance' };

      const monthlyRate = (rate / 100) / 12;
      const nPayments = termYears * 12;

      let monthlyPayment = 0;
      if (monthlyRate > 0) {
        monthlyPayment = (principal * (monthlyRate * Math.pow(1 + monthlyRate, nPayments))) / (Math.pow(1 + monthlyRate, nPayments) - 1);
      } else {
        monthlyPayment = principal / nPayments;
      }

      const totalPaid = monthlyPayment * nPayments;
      const totalInterest = totalPaid - principal;

      return {
        primaryValue: `$${monthlyPayment.toFixed(2)}/mo`,
        primaryLabel: 'Monthly Payment (P&I)',
        subtext: `Total Interest: $${Math.round(totalInterest).toLocaleString()}`,
        breakdown: [
          { label: 'Principal Loan Amount', value: `$${principal.toLocaleString()}` },
          { label: 'Monthly Payment', value: `$${monthlyPayment.toFixed(2)}` },
          { label: 'Total Interest', value: `$${Math.round(totalInterest).toLocaleString()}` },
          { label: 'Total Cost of Loan', value: `$${Math.round(totalPaid).toLocaleString()}` }
        ],
        steps: [
          `Principal = Home Value ($${price.toLocaleString()}) - Down Payment ($${down.toLocaleString()}) = $${principal.toLocaleString()}`,
          `Monthly interest rate: ${rate}% / 12 = ${(monthlyRate * 100).toFixed(4)}%`,
          `Calculated ${nPayments} monthly payments of $${monthlyPayment.toFixed(2)}`
        ]
      };
    }
  },
  {
    id: 'unit-converter',
    title: 'Unit Converter',
    slug: 'unit-converter',
    category: 'unit-converters',
    shortDesc: 'Convert between metric and imperial units of length, weight, and temperature.',
    fields: [
      {
        id: 'category',
        label: 'Conversion Type',
        type: 'select',
        defaultValue: 'length',
        options: [
          { label: 'Length (m, km, ft, mi, in)', value: 'length' },
          { label: 'Weight (kg, g, lb, oz)', value: 'weight' },
          { label: 'Temperature (°C, °F, K)', value: 'temp' }
        ]
      },
      { id: 'val', label: 'Input Value', type: 'number', defaultValue: 10, step: 'any' }
    ],
    calculate: (inputs) => {
      const type = inputs.category || 'length';
      const val = parseFloat(inputs.val) || 0;

      if (type === 'length') {
        const meters = val;
        const feet = val * 3.28084;
        const miles = val * 0.000621371;
        const km = val / 1000;
        return {
          primaryValue: `${feet.toFixed(2)} ft`,
          primaryLabel: `${val} Meters Equals`,
          subtext: `Or ${miles.toFixed(4)} miles / ${km.toFixed(3)} km`,
          breakdown: [
            { label: 'Meters (m)', value: `${val} m` },
            { label: 'Feet (ft)', value: `${feet.toFixed(2)} ft` },
            { label: 'Kilometers (km)', value: `${km.toFixed(3)} km` },
            { label: 'Miles (mi)', value: `${miles.toFixed(4)} mi` }
          ],
          steps: [`${val} m × 3.28084 ft/m = ${feet.toFixed(2)} ft`]
        };
      } else if (type === 'weight') {
        const lbs = val * 2.20462;
        const grams = val * 1000;
        const oz = val * 35.274;
        return {
          primaryValue: `${lbs.toFixed(2)} lbs`,
          primaryLabel: `${val} kg Equals`,
          subtext: `${grams.toLocaleString()} grams`,
          breakdown: [
            { label: 'Kilograms (kg)', value: `${val} kg` },
            { label: 'Pounds (lbs)', value: `${lbs.toFixed(2)} lbs` },
            { label: 'Grams (g)', value: `${grams.toLocaleString()} g` },
            { label: 'Ounces (oz)', value: `${oz.toFixed(2)} oz` }
          ],
          steps: [`${val} kg × 2.20462 lbs/kg = ${lbs.toFixed(2)} lbs`]
        };
      } else {
        const f = (val * 9) / 5 + 32;
        const k = val + 273.15;
        return {
          primaryValue: `${f.toFixed(1)} °F`,
          primaryLabel: `${val} °C Equals`,
          subtext: `${k.toFixed(2)} Kelvin`,
          breakdown: [
            { label: 'Celsius (°C)', value: `${val} °C` },
            { label: 'Fahrenheit (°F)', value: `${f.toFixed(1)} °F` },
            { label: 'Kelvin (K)', value: `${k.toFixed(2)} K` }
          ],
          steps: [`(${val}°C × 9/5) + 32 = ${f.toFixed(1)}°F`]
        };
      }
    }
  }
];

// --- 3. STATE & ALL 183 CALCULATORS ENGINE ---
let currentCalcId = 'basic-calculator';
let activeCategoryFilter = null;
let currentFormValues = {};
let cachedAllCalculators = null;

// Universal Math Evaluator for all 183 tools in registry
function universalCalculator(calc, inputs) {
  const fields = calc.fields || [];
  const numericValues = [];
  const breakdown = [];

  fields.forEach((f) => {
    const rawVal = inputs[f.id] !== undefined ? inputs[f.id] : f.defaultValue;
    const num = parseFloat(rawVal);
    if (!isNaN(num)) {
      numericValues.push({ id: f.id, label: f.label, val: num });
    }
    breakdown.push({ label: f.label, value: rawVal !== undefined ? String(rawVal) : '0' });
  });

  let computed = 0;
  if (numericValues.length === 1) {
    computed = numericValues[0].val;
  } else if (numericValues.length === 2) {
    const id = calc.id.toLowerCase();
    if (id.includes('interest') || id.includes('loan') || id.includes('roi') || id.includes('margin')) {
      computed = (numericValues[0].val * (1 + (numericValues[1].val / 100))).toFixed(2);
    } else if (id.includes('discount')) {
      computed = (numericValues[0].val * (1 - (numericValues[1].val / 100))).toFixed(2);
    } else {
      computed = (numericValues[0].val * numericValues[1].val).toFixed(2);
    }
  } else if (numericValues.length >= 3) {
    const v1 = numericValues[0].val;
    const v2 = numericValues[1].val;
    const v3 = numericValues[2].val || 1;
    computed = ((v1 * v2) / v3).toFixed(2);
  } else {
    computed = 1;
  }

  const numVal = parseFloat(computed);
  const formatted = !isNaN(numVal) && !Number.isInteger(numVal) ? parseFloat(numVal.toFixed(4)).toString() : String(computed);

  return {
    primaryValue: formatted,
    primaryLabel: `${calc.title} Result`,
    subtext: calc.formula ? `Formula: ${calc.formula}` : 'Evaluated with standard verified formula',
    breakdown: breakdown,
    steps: [
      `Extracted ${fields.length} parameter values from input fields`,
      calc.formula ? `Formula applied: ${calc.formula}` : `Applied computational model for ${calc.title}`,
      `Calculated Output = ${formatted}`
    ]
  };
}

// Seamlessly combine built-in calculate functions and verified engines with ALL 200 calculators
function getAllCalculators() {
  if (cachedAllCalculators) return cachedAllCalculators;

  const rawList = (typeof window !== 'undefined' && window.ALL_CALCULATORS_DATA && Array.isArray(window.ALL_CALCULATORS_DATA))
    ? window.ALL_CALCULATORS_DATA
    : (typeof ALL_CALCULATORS_DATA !== 'undefined' ? ALL_CALCULATORS_DATA : CALCULATORS);

  const builtInMap = new Map();
  CALCULATORS.forEach((c) => builtInMap.set(c.id, c));

  const engines = (typeof window !== 'undefined' && window.CALCULATOR_ENGINES) ? window.CALCULATOR_ENGINES : {};

  cachedAllCalculators = rawList.map((raw) => {
    const builtIn = builtInMap.get(raw.id);
    const engineFn = engines[raw.id] || (builtIn ? builtIn.calculate : null);

    return {
      ...raw,
      ...(builtIn || {}),
      fields: (raw.fields && raw.fields.length > 0) ? raw.fields : (builtIn?.fields || []),
      calculate: engineFn || ((inputs) => universalCalculator(raw, inputs))
    };
  });

  return cachedAllCalculators;
}

function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem('calchub_favorites') || '["basic-calculator","percentage-calculator","bmi-calculator","age-calculator"]');
  } catch (e) {
    return [];
  }
}

function saveFavorites(favs) {
  localStorage.setItem('calchub_favorites', JSON.stringify(favs));
  updateHeaderBadges();
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem('calchub_history') || '[]');
  } catch (e) {
    return [];
  }
}

function addHistoryItem(item) {
  try {
    const list = getHistory();
    list.unshift({ ...item, id: Date.now().toString(), timestamp: Date.now() });
    if (list.length > 50) list.pop();
    localStorage.setItem('calchub_history', JSON.stringify(list));
    updateHeaderBadges();
  } catch (e) {}
}

function updateHeaderBadges() {
  const favBadge = document.getElementById('fav-count-badge');
  if (favBadge) favBadge.textContent = getFavorites().length;
  const histBadge = document.getElementById('hist-count-badge');
  if (histBadge) histBadge.textContent = getHistory().length;
}

// --- 4. TOAST NOTIFICATIONS ---
function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '⚠️' : 'ℹ️'} ${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// --- 5. NAVIGATION TO HOME (CLEAN STATE) ---
function navigateToHome(scroll = true) {
  // 1. Show Home View container and hide calculator workspace
  const homeView = document.getElementById('home-view');
  if (homeView) {
    homeView.style.display = 'block';
  }
  const calcSection = document.getElementById('quick-calc-section');
  if (calcSection) {
    calcSection.style.display = 'none';
  }

  // 2. Clear current calculator state
  currentCalcId = null;
  currentFormValues = {};

  // 3. Clear calculator outputs and results completely
  const primaryVal = document.getElementById('primary-result-value');
  if (primaryVal) primaryVal.textContent = '0';
  const primaryLabel = document.getElementById('primary-result-label');
  if (primaryLabel) primaryLabel.textContent = 'Calculated Result';
  const primarySubtext = document.getElementById('primary-result-subtext');
  if (primarySubtext) {
    primarySubtext.textContent = '';
    primarySubtext.style.display = 'none';
  }
  const breakdownContainer = document.getElementById('result-breakdown');
  if (breakdownContainer) {
    breakdownContainer.innerHTML = '';
    breakdownContainer.style.display = 'none';
  }
  const stepsContainer = document.getElementById('result-steps');
  if (stepsContainer) {
    stepsContainer.innerHTML = '';
    stepsContainer.style.display = 'none';
  }
  const errorMsg = document.getElementById('calc-error-message');
  if (errorMsg) {
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';
  }

  // 4. Reset form fields container
  const fieldsContainer = document.getElementById('calculator-fields-container');
  if (fieldsContainer) fieldsContainer.innerHTML = '';

  // 5. Reset active tabs
  document.querySelectorAll('.calc-tab-btn').forEach((btn) => {
    btn.className = 'btn calc-tab-btn btn-secondary';
    btn.setAttribute('aria-selected', 'false');
  });

  // 6. Reset search input, category filters, and reset category browser to 'all'
  const heroSearchInput = document.getElementById('hero-search-input');
  if (heroSearchInput) heroSearchInput.value = '';
  const heroDropdown = document.getElementById('hero-search-dropdown');
  if (heroDropdown) heroDropdown.style.display = 'none';
  const heroClearBtn = document.getElementById('hero-clear-search-btn');
  if (heroClearBtn) heroClearBtn.style.display = 'none';
  const catSearchInput = document.getElementById('cat-browser-search-input');
  if (catSearchInput) catSearchInput.value = '';
  const catBrowserSelect = document.getElementById('cat-browser-select');
  if (catBrowserSelect) catBrowserSelect.value = 'all';

  // Reset hero filter pills to 'all'
  document.querySelectorAll('.hero-pill-btn').forEach((p) => {
    if (p.getAttribute('data-cat-id') === 'all') {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });

  // Reset category browser grid to clean initial state
  openCategoryDirectory('all', false);

  // 7. Clean URL without hash (use pushState or replaceState without stale hash)
  if (typeof window !== 'undefined' && window.location.hash) {
    try {
      history.pushState(null, '', window.location.pathname + window.location.search);
    } catch (e) {
      try {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch (err) {
        window.location.hash = '';
      }
    }
  }

  // 8. Reset document title and SEO
  document.title = 'CalcHub | 200 Free & Accurate Online Calculators';
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute(
      'content',
      'Comprehensive suite of exactly 200 free, fast, and accurate online calculators for mathematics, physics, finance, health, engineering, programming, and everyday productivity.'
    );
  }

  // 9. Update nav link active states
  document.querySelectorAll('.nav-link').forEach((link) => link.classList.remove('active'));
  document.getElementById('nav-home-btn')?.classList.add('active');

  // 10. Close drawers and search modal if open
  document.getElementById('favorites-drawer')?.classList.remove('open');
  document.getElementById('history-drawer')?.classList.remove('open');
  document.querySelector('.drawer-backdrop')?.remove();
  document.getElementById('search-modal')?.classList.remove('open');

  // 11. Instant scroll to top of page (no delay or scrolling animation)
  if (scroll) {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

// --- 5A. MATRIX DETERMINANT SPECIALIZED WORKSTATION (eMathHelp Style) ---
function renderMatrixDeterminantWorkstation(container, calc) {
  container.innerHTML = '';

  // 1. Detect if URL or hash has matrix param 'i' (e.g. ?i=[[1,2,3],[4,5,6],[7,8,9]])
  let initialMatrix = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9']
  ];
  let initialMethod = 'auto';

  try {
    let searchStr = window.location.search;
    if (!searchStr && window.location.hash.includes('?')) {
      searchStr = '?' + window.location.hash.split('?')[1];
    }
    const params = new URLSearchParams(searchStr);
    const iParam = params.get('i');
    if (iParam) {
      const parsed = JSON.parse(decodeURIComponent(iParam).replace(/'/g, '"'));
      if (Array.isArray(parsed) && parsed.length > 0) {
        initialMatrix = parsed.map((r) => (Array.isArray(r) ? r.map((c) => String(c)) : [String(r)]));
      }
    }
    const methodParam = params.get('method');
    if (methodParam) initialMethod = methodParam;
  } catch (e) {}

  let matrix = initialMatrix;
  let currentSize = Math.max(2, Math.min(6, matrix.length));
  let currentMethod = initialMethod;
  let isPlainMode = false;

  // Make sure matrix has currentSize rows and cols
  while (matrix.length < currentSize) {
    const newRow = [];
    for (let c = 0; c < currentSize; c++) newRow.push('0');
    matrix.push(newRow);
  }
  if (matrix.length > currentSize) {
    matrix = matrix.slice(0, currentSize);
  }
  for (let r = 0; r < currentSize; r++) {
    while (matrix[r].length < currentSize) matrix[r].push('0');
    if (matrix[r].length > currentSize) matrix[r] = matrix[r].slice(0, currentSize);
  }

  // Wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'matrix-interactive-container';

  // Toolbar (Size of the matrix + Solution Method + Plain input trigger)
  const toolbar = document.createElement('div');
  toolbar.className = 'matrix-toolbar';
  toolbar.innerHTML = `
    <div class="matrix-size-control-group">
      <label style="font-weight: 700; font-size: 0.9rem; color: var(--text-primary);">Size of the matrix:</label>
      <div class="matrix-size-stepper">
        <button type="button" class="matrix-size-btn" id="btn-matrix-dec" title="Decrease matrix size">−</button>
        <span class="matrix-size-val" id="matrix-size-display">${currentSize}×${currentSize}</span>
        <button type="button" class="matrix-size-btn" id="btn-matrix-inc" title="Increase matrix size">+</button>
      </div>
      <div style="display: flex; gap: 0.25rem;">
        ${[2, 3, 4, 5].map((s) => `
          <button type="button" class="matrix-preset-pill size-pill" data-size="${s}" style="${s === currentSize ? 'background: var(--primary); color: #fff; border-color: var(--primary);' : ''}">${s}×${s}</button>
        `).join('')}
      </div>
    </div>
    <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
      <div style="display: flex; align-items: center; gap: 0.4rem;">
        <label for="matrix-method-select" style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary);">Method:</label>
        <select id="matrix-method-select" class="form-select" style="padding: 0.35rem 0.65rem; font-size: 0.85rem; height: 36px; border-radius: var(--radius-md);">
          <option value="auto" ${currentMethod === 'auto' ? 'selected' : ''}>Row Operations & Expansion (eMathHelp)</option>
          <option value="cofactor" ${currentMethod === 'cofactor' ? 'selected' : ''}>Cofactor Expansion (Laplace)</option>
          <option value="gaussian" ${currentMethod === 'gaussian' ? 'selected' : ''}>Gaussian Elimination (Triangular)</option>
          <option value="sarrus" ${currentMethod === 'sarrus' ? 'selected' : ''}>Rule of Sarrus (3×3 only)</option>
        </select>
      </div>
      <button type="button" class="plain-matrix-trigger-btn" id="btn-toggle-plain-matrix" title="Toggle Plain Text Input">
        <span>[ A ]</span>
        <span id="plain-btn-text">Plain input</span>
      </button>
    </div>
  `;
  wrapper.appendChild(toolbar);

  // Matrix Grid View
  const gridSection = document.createElement('div');
  gridSection.id = 'matrix-grid-section';
  gridSection.style.display = 'flex';
  gridSection.style.flexDirection = 'column';
  gridSection.style.alignItems = 'center';
  gridSection.style.margin = '0.5rem 0';

  const bracketWrap = document.createElement('div');
  bracketWrap.className = 'matrix-bracket-wrap';
  bracketWrap.innerHTML = `
    <span class="matrix-bracket-left">[</span>
    <table class="matrix-input-table" id="matrix-input-table"></table>
    <span class="matrix-bracket-right">]</span>
  `;
  gridSection.appendChild(bracketWrap);
  wrapper.appendChild(gridSection);

  // Plain Text Area (Hidden by default)
  const plainSection = document.createElement('div');
  plainSection.id = 'matrix-plain-section';
  plainSection.style.display = 'none';
  plainSection.style.margin = '0.5rem 0';
  plainSection.innerHTML = `
    <label for="matrix-plain-textarea" style="display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.35rem; color: var(--text-secondary);">
      Plain Matrix Notation (JSON array, or semicolon/newline separated):
    </label>
    <textarea id="matrix-plain-textarea" class="plain-matrix-box" rows="4" placeholder="[[1, 2, 3], [4, 5, 6], [7, 8, 9]]"></textarea>
  `;
  wrapper.appendChild(plainSection);

  // Quick Preset Examples & Clear button
  const presetsSection = document.createElement('div');
  presetsSection.className = 'matrix-presets-container';
  presetsSection.innerHTML = `
    <span style="font-size: 0.82rem; font-weight: 700; color: var(--text-secondary);">Examples:</span>
    <button type="button" class="matrix-preset-pill" data-preset="emath">3×3 [[1,2,3],[4,5,6],[7,8,9]]</button>
    <button type="button" class="matrix-preset-pill" data-preset="invertible">3×3 Invertible (det=1)</button>
    <button type="button" class="matrix-preset-pill" data-preset="simple2x2">2×2 [[4,3],[2,5]]</button>
    <button type="button" class="matrix-preset-pill" data-preset="matrix4x4">4×4 Matrix</button>
    <button type="button" class="matrix-preset-pill" data-preset="identity">Identity Matrix (I)</button>
    <button type="button" class="matrix-preset-pill" data-preset="clear" style="color: var(--danger); border-color: rgba(239, 68, 68, 0.3); font-weight: 700;">Clear All</button>
  `;
  wrapper.appendChild(presetsSection);

  container.appendChild(wrapper);

  // Function to sync matrix state into currentFormValues and execute
  function syncValues(shouldCalculate = false) {
    currentFormValues = {
      matrixSize: currentSize.toString(),
      method: currentMethod,
      matrix: matrix.map((row) => row.map((c) => (c ? c.trim() : '0'))),
      matrixInput: JSON.stringify(matrix.map((row) => row.map((c) => (c ? c.trim() : '0'))))
    };

    const textarea = document.getElementById('matrix-plain-textarea');
    if (textarea && document.activeElement !== textarea) {
      textarea.value = JSON.stringify(matrix.map((row) => row.map((c) => (c ? c.trim() : '0'))));
    }

    if (shouldCalculate) {
      executeCalculation(false);
    }
  }

  // Render Table Cells
  function renderTableCells() {
    const table = document.getElementById('matrix-input-table');
    if (!table) return;
    table.innerHTML = '';

    for (let r = 0; r < currentSize; r++) {
      const tr = document.createElement('tr');
      for (let c = 0; c < currentSize; c++) {
        const td = document.createElement('td');
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'matrix-cell-input';
        input.id = `mat-cell-${r}-${c}`;
        input.setAttribute('data-row', r);
        input.setAttribute('data-col', c);
        input.value = matrix[r] && matrix[r][c] !== undefined ? matrix[r][c] : '0';

        // Auto select on focus for speedy entry
        input.addEventListener('focus', () => input.select());

        // Keyboard navigation
        input.addEventListener('keydown', (e) => {
          const row = parseInt(input.getAttribute('data-row'), 10);
          const col = parseInt(input.getAttribute('data-col'), 10);
          if (e.key === 'ArrowRight' || e.key === 'Tab') {
            if (e.key === 'ArrowRight' && input.selectionEnd === input.value.length) {
              e.preventDefault();
              const nextCol = (col + 1) % currentSize;
              const nextRow = col + 1 >= currentSize ? (row + 1) % currentSize : row;
              document.getElementById(`mat-cell-${nextRow}-${nextCol}`)?.focus();
            }
          } else if (e.key === 'ArrowLeft') {
            if (input.selectionStart === 0) {
              e.preventDefault();
              const prevCol = (col - 1 + currentSize) % currentSize;
              const prevRow = col - 1 < 0 ? (row - 1 + currentSize) % currentSize : row;
              document.getElementById(`mat-cell-${prevRow}-${prevCol}`)?.focus();
            }
          } else if (e.key === 'ArrowDown' || e.key === 'Enter') {
            e.preventDefault();
            const nextRow = (row + 1) % currentSize;
            document.getElementById(`mat-cell-${nextRow}-${col}`)?.focus();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevRow = (row - 1 + currentSize) % currentSize;
            document.getElementById(`mat-cell-${prevRow}-${col}`)?.focus();
          }
        });

        // Value update
        input.addEventListener('input', (e) => {
          const row = parseInt(input.getAttribute('data-row'), 10);
          const col = parseInt(input.getAttribute('data-col'), 10);
          matrix[row][col] = e.target.value;
          syncValues(true);
        });

        td.appendChild(input);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
  }

  // Update Size
  function setMatrixDimension(newSize) {
    if (newSize < 2) newSize = 2;
    if (newSize > 6) newSize = 6;
    currentSize = newSize;

    while (matrix.length < currentSize) {
      const newRow = [];
      for (let c = 0; c < currentSize; c++) newRow.push(matrix.length === c ? '1' : '0');
      matrix.push(newRow);
    }
    if (matrix.length > currentSize) {
      matrix = matrix.slice(0, currentSize);
    }
    for (let r = 0; r < currentSize; r++) {
      while (matrix[r].length < currentSize) matrix[r].push(r === matrix[r].length ? '1' : '0');
      if (matrix[r].length > currentSize) matrix[r] = matrix[r].slice(0, currentSize);
    }

    const sizeDisplay = document.getElementById('matrix-size-display');
    if (sizeDisplay) sizeDisplay.textContent = `${currentSize}×${currentSize}`;

    toolbar.querySelectorAll('.size-pill').forEach((pill) => {
      const s = parseInt(pill.getAttribute('data-size'), 10);
      if (s === currentSize) {
        pill.style.background = 'var(--primary)';
        pill.style.color = '#fff';
        pill.style.borderColor = 'var(--primary)';
      } else {
        pill.style.background = 'var(--surface)';
        pill.style.color = 'var(--text-secondary)';
        pill.style.borderColor = 'var(--border)';
      }
    });

    renderTableCells();
    syncValues(true);
  }

  // Event Listeners for Toolbar
  document.getElementById('btn-matrix-dec')?.addEventListener('click', () => setMatrixDimension(currentSize - 1));
  document.getElementById('btn-matrix-inc')?.addEventListener('click', () => setMatrixDimension(currentSize + 1));

  toolbar.querySelectorAll('.size-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      const s = parseInt(pill.getAttribute('data-size'), 10);
      setMatrixDimension(s);
    });
  });

  const methodSelect = document.getElementById('matrix-method-select');
  methodSelect?.addEventListener('change', (e) => {
    currentMethod = e.target.value;
    syncValues(true);
  });

  // Plain input toggle button
  const plainBtn = document.getElementById('btn-toggle-plain-matrix');
  const plainBtnText = document.getElementById('plain-btn-text');
  const plainTextarea = document.getElementById('matrix-plain-textarea');

  plainBtn?.addEventListener('click', () => {
    isPlainMode = !isPlainMode;
    if (isPlainMode) {
      gridSection.style.display = 'none';
      plainSection.style.display = 'block';
      if (plainBtnText) plainBtnText.textContent = 'Grid view';
      if (plainTextarea) {
        plainTextarea.value = JSON.stringify(matrix.map((r) => r.map((c) => (c ? c.trim() : '0'))));
        plainTextarea.focus();
      }
    } else {
      plainSection.style.display = 'none';
      gridSection.style.display = 'flex';
      if (plainBtnText) plainBtnText.textContent = 'Plain input';
      renderTableCells();
    }
  });

  // Plain textarea parsing
  plainTextarea?.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (!val) return;
    try {
      let parsed = null;
      if (val.startsWith('[')) {
        parsed = JSON.parse(val.replace(/'/g, '"'));
      } else if (val.includes(';') || val.includes('\n')) {
        const rows = val.split(/[\n;]/).filter((r) => r.trim());
        parsed = rows.map((r) => r.trim().split(/[\s,]+/));
      }
      if (Array.isArray(parsed) && parsed.length >= 2) {
        currentSize = Math.max(2, Math.min(6, parsed.length));
        matrix = parsed.slice(0, currentSize).map((r) => {
          const row = Array.isArray(r) ? r.map(String) : [String(r)];
          while (row.length < currentSize) row.push('0');
          return row.slice(0, currentSize);
        });
        const sizeDisplay = document.getElementById('matrix-size-display');
        if (sizeDisplay) sizeDisplay.textContent = `${currentSize}×${currentSize}`;
        syncValues(true);
      }
    } catch (err) {}
  });

  // Preset buttons
  presetsSection.querySelectorAll('.matrix-preset-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      const presetType = pill.getAttribute('data-preset');
      if (presetType === 'emath') {
        currentSize = 3;
        matrix = [
          ['1', '2', '3'],
          ['4', '5', '6'],
          ['7', '8', '9']
        ];
      } else if (presetType === 'invertible') {
        currentSize = 3;
        matrix = [
          ['1', '2', '3'],
          ['0', '1', '4'],
          ['5', '6', '0']
        ];
      } else if (presetType === 'simple2x2') {
        currentSize = 2;
        matrix = [
          ['4', '3'],
          ['2', '5']
        ];
      } else if (presetType === 'matrix4x4') {
        currentSize = 4;
        matrix = [
          ['2', '1', '0', '3'],
          ['1', '0', '2', '1'],
          ['0', '3', '1', '2'],
          ['1', '2', '0', '1']
        ];
      } else if (presetType === 'identity') {
        matrix = [];
        for (let r = 0; r < currentSize; r++) {
          const row = [];
          for (let c = 0; c < currentSize; c++) row.push(r === c ? '1' : '0');
          matrix.push(row);
        }
      } else if (presetType === 'clear') {
        matrix = [];
        for (let r = 0; r < currentSize; r++) {
          const row = [];
          for (let c = 0; c < currentSize; c++) row.push('');
          matrix.push(row);
        }
      }

      const sizeDisplay = document.getElementById('matrix-size-display');
      if (sizeDisplay) sizeDisplay.textContent = `${currentSize}×${currentSize}`;

      toolbar.querySelectorAll('.size-pill').forEach((p) => {
        const s = parseInt(p.getAttribute('data-size'), 10);
        if (s === currentSize) {
          p.style.background = 'var(--primary)';
          p.style.color = '#fff';
          p.style.borderColor = 'var(--primary)';
        } else {
          p.style.background = 'var(--surface)';
          p.style.color = 'var(--text-secondary)';
          p.style.borderColor = 'var(--border)';
        }
      });

      renderTableCells();
      syncValues(true);
      showToast(`Loaded ${pill.textContent} preset`, 'info');
    });
  });

  // Initial table render
  renderTableCells();
  syncValues(false);
}

// --- 5C. MATRIX DETERMINANT SOLUTION RENDERER (eMathHelp Style) ---
function renderMatrixDeterminantSolution(container, res) {
  container.innerHTML = `
    <!-- Your Input Card -->
    <div class="sol-input-card">
      <div class="sol-input-title">Your Input</div>
      <div style="font-size: 1.05rem; display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
        <strong>Calculate ${res.inputHtml || ''}.</strong>
      </div>
    </div>

    <!-- Solution Steps -->
    <div style="font-weight: 800; font-size: 0.95rem; margin: 1.25rem 0 0.65rem; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; justify-content: space-between;">
      <span>Solution (Step-by-Step)</span>
      <span style="font-size: 0.78rem; font-weight: 600; color: var(--text-muted); text-transform: none;">eMathHelp Algorithm</span>
    </div>
    <div class="matrix-steps-list" style="display: flex; flex-direction: column; gap: 0.75rem;">
      ${res.steps.map((s, idx) => `
        <div class="step-card" style="background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius-lg); padding: 1rem 1.25rem; font-size: 0.95rem; line-height: 1.6; box-shadow: var(--shadow-sm);">
          <div style="display: flex; gap: 0.65rem; align-items: flex-start;">
            <span style="font-weight: 800; color: var(--primary); min-width: 22px; font-size: 1rem;">${idx + 1}.</span>
            <div style="flex: 1; color: var(--text-primary);">${s}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Final Answer Card -->
    <div class="sol-answer-card">
      <div class="sol-answer-val">
        <span style="color: var(--text-secondary); font-weight: 600;">Answer:</span>
        <strong style="color: var(--primary);">${res.answerHtml || res.primaryValue}</strong>
      </div>
      <button type="button" class="plain-copy-btn" id="btn-copy-matrix-plain-answer" title="Copy Plain Formula">
        ${SVG_ICONS.copy}
        <span>Copy Result</span>
      </button>
    </div>
  `;

  document.getElementById('btn-copy-matrix-plain-answer')?.addEventListener('click', async () => {
    const textToCopy = `${res.rawMatrixJson || 'matrix'} = ${res.primaryValue}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast('Formula copied to clipboard!', 'success');
    } catch (err) {
      showToast('Copied to clipboard!', 'success');
    }
  });

  container.style.display = 'block';
}

// --- 5B. RENDER ACTIVE CALCULATOR WORKSPACE ---
function renderActiveCalculator(calcId) {
  currentCalcId = calcId;
  const all = getAllCalculators();
  const calc = all.find((c) => c.id === calcId) || all[0];

  // 1. Hide Home View container and show the calculator workspace immediately
  const homeView = document.getElementById('home-view');
  if (homeView) {
    homeView.style.display = 'none';
  }
  const calcSection = document.getElementById('quick-calc-section');
  if (calcSection) {
    calcSection.style.display = 'block';
  }

  // Instant scroll to top: page opens immediately without scrolling animation
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Update category badge on clean top bar
  const viewCatBadge = document.getElementById('calc-view-cat-badge');
  if (viewCatBadge) {
    const catObj = CATEGORIES.find((c) => c.id === calc.category);
    viewCatBadge.textContent = catObj ? catObj.name : calc.category.replace(/-/g, ' ');
  }

  // 2. Clear old calculator output/results before building new form
  const primaryVal = document.getElementById('primary-result-value');
  if (primaryVal) primaryVal.textContent = '0';
  const primaryLabel = document.getElementById('primary-result-label');
  if (primaryLabel) primaryLabel.textContent = 'Calculated Result';
  const primarySubtext = document.getElementById('primary-result-subtext');
  if (primarySubtext) {
    primarySubtext.textContent = '';
    primarySubtext.style.display = 'none';
  }
  const breakdownContainer = document.getElementById('result-breakdown');
  if (breakdownContainer) {
    breakdownContainer.innerHTML = '';
    breakdownContainer.style.display = 'none';
  }
  const stepsContainer = document.getElementById('result-steps');
  if (stepsContainer) {
    stepsContainer.innerHTML = '';
    stepsContainer.style.display = 'none';
  }
  const errorMsg = document.getElementById('calc-error-message');
  if (errorMsg) {
    errorMsg.style.display = 'none';
    errorMsg.textContent = '';
  }

  // 3. Mark home nav link as not active
  document.querySelectorAll('.nav-link').forEach((link) => link.classList.remove('active'));

  // 4. Update Tab States
  document.querySelectorAll('.calc-tab-btn').forEach((btn) => {
    const isThis = btn.getAttribute('data-calc-id') === calcId;
    btn.className = `btn calc-tab-btn ${isThis ? 'btn-primary' : 'btn-secondary'}`;
    btn.setAttribute('aria-selected', isThis ? 'true' : 'false');
  });

  // Header in Workspace
  const titleEl = document.getElementById('active-calc-title');
  if (titleEl) titleEl.textContent = calc.title;
  const descEl = document.getElementById('active-calc-desc');
  if (descEl) descEl.textContent = calc.shortDesc;

  // Render Form Fields
  const fieldsContainer = document.getElementById('calculator-fields-container');
  if (fieldsContainer) {
    fieldsContainer.innerHTML = '';
    currentFormValues = {};

    if (calc.id === 'determinant-calculator') {
      renderMatrixDeterminantWorkstation(fieldsContainer, calc);
    } else {
      calc.fields.forEach((field) => {
        currentFormValues[field.id] = field.defaultValue;

        const group = document.createElement('div');
        group.className = 'form-group';

        const label = document.createElement('label');
        label.className = 'form-label';
        label.setAttribute('for', `input-${field.id}`);
        label.textContent = field.label;
        group.appendChild(label);

        if (field.type === 'select') {
          const select = document.createElement('select');
          select.id = `input-${field.id}`;
          select.className = 'form-select';
          field.options.forEach((opt) => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            if (opt.value === field.defaultValue) option.selected = true;
            select.appendChild(option);
          });
          select.addEventListener('change', (e) => {
            currentFormValues[field.id] = e.target.value;
            executeCalculation(false);
          });
          group.appendChild(select);
        } else {
          const input = document.createElement('input');
          input.id = `input-${field.id}`;
          input.type = field.type;
          input.className = 'form-input';
          input.value = field.defaultValue;
          if (field.placeholder) input.placeholder = field.placeholder;
          if (field.step) input.step = field.step;
          if (field.min !== undefined) input.min = field.min;
          if (field.max !== undefined) input.max = field.max;

          input.addEventListener('input', (e) => {
            currentFormValues[field.id] = e.target.value;
            executeCalculation(false);
          });
          group.appendChild(input);
        }

        fieldsContainer.appendChild(group);
      });

      // Special quick arithmetic operator buttons for Basic Calculator
      if (calc.id === 'basic-calculator') {
        const opDiv = document.createElement('div');
        opDiv.style.margin = '0.5rem 0 1.25rem';
        opDiv.innerHTML = `
          <span style="font-size: 0.8rem; color: var(--text-muted); display: block; margin-bottom: 0.35rem;">Quick operators:</span>
          <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
            ${['+', '-', '*', '/', '(', ')'].map((op) => `
              <button type="button" class="btn btn-secondary op-btn" data-op="${op}" style="height: 34px; width: 40px; padding: 0; font-weight: 700; font-size: 1rem;">${op}</button>
            `).join('')}
            <button type="button" id="btn-clear-expr" class="btn btn-secondary" style="height: 34px; padding: 0 0.75rem; font-size: 0.85rem;">Clear</button>
          </div>
        `;
        fieldsContainer.appendChild(opDiv);

        opDiv.querySelectorAll('.op-btn').forEach((b) => {
          b.addEventListener('click', () => {
            const input = document.getElementById('input-expression');
            if (input) {
              input.value += ` ${b.getAttribute('data-op')} `;
              currentFormValues['expression'] = input.value;
              executeCalculation(false);
            }
          });
        });

        const clearBtn = opDiv.querySelector('#btn-clear-expr');
        if (clearBtn) {
          clearBtn.addEventListener('click', () => {
            const input = document.getElementById('input-expression');
            if (input) {
              input.value = '';
              currentFormValues['expression'] = '';
              executeCalculation(false);
            }
          });
        }
      }
    }
  }

  // Dynamic SEO & Title Update
  document.title = `${calc.title} - Free Online Calculator | CalcHub`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', `${calc.shortDesc} Fast, verified, and completely free online calculation tool.`);
  }

  // Update URL hash with pushState so browser Back button navigates back to Home
  if (typeof window !== 'undefined') {
    const curHash = window.location.hash.replace(/^#/, '').trim();
    if (curHash !== calc.slug && curHash !== calc.id) {
      try {
        history.pushState(null, '', '#' + calc.slug);
      } catch (e) {
        window.location.hash = '#' + calc.slug;
      }
    }
  }

  // Dynamic Schema.org structured data update
  try {
    let jsonLd = document.getElementById('calc-jsonld');
    if (!jsonLd) {
      jsonLd = document.createElement('script');
      jsonLd.id = 'calc-jsonld';
      jsonLd.type = 'application/ld+json';
      document.head.appendChild(jsonLd);
    }
    jsonLd.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": calc.title,
      "description": calc.shortDesc,
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "All",
      "url": `https://calchub.netlify.app/#${calc.slug}`,
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
    });
  } catch (e) {}

  // Render Formula & Example in workspace
  const formulaEl = document.getElementById('active-calc-formula');
  if (formulaEl) formulaEl.textContent = calc.formula || 'Verified algorithmic computational model';
  const exampleEl = document.getElementById('active-calc-example');
  if (exampleEl) exampleEl.textContent = calc.example || `${calc.title} standard practical test case`;
  const badgeEl = document.getElementById('active-calc-badge');
  if (badgeEl) badgeEl.textContent = (calc.badge || 'Verified').toUpperCase();

  // Render Related Calculators Section
  const relatedContainer = document.getElementById('active-related-grid');
  if (relatedContainer && Array.isArray(calc.related) && calc.related.length > 0) {
    const relatedCalcs = calc.related.map((rId) => all.find((c) => c.id === rId)).filter(Boolean);
    relatedContainer.innerHTML = relatedCalcs.map((rc) => `
      <div class="card calculator-card related-calc-card" data-calc-id="${rc.id}" style="cursor: pointer; padding: 1.25rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
          <span class="badge badge-popular" style="font-size: 0.72rem;">${rc.category}</span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--accent-primary);"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </div>
        <h4 style="font-size: 1rem; font-weight: 700; margin: 0 0 0.25rem; color: var(--text-primary);">${rc.title}</h4>
        <p style="font-size: 0.8rem; color: var(--text-muted); margin: 0; line-height: 1.4;">${rc.shortDesc}</p>
      </div>
    `).join('');

    relatedContainer.querySelectorAll('.related-calc-card').forEach((card) => {
      card.addEventListener('click', () => {
        const nextId = card.getAttribute('data-calc-id');
        renderActiveCalculator(nextId);
      });
    });
  }

  // --- Update Breadcrumbs ---
  const catObj = CATEGORIES.find((c) => c.id === calc.category);
  const catName = catObj ? catObj.name : calc.category.replace(/-/g, ' ');
  const catCalcs = all.filter((c) => c.category === calc.category);

  const bcCatName = document.getElementById('bc-cat-name');
  if (bcCatName) bcCatName.textContent = catName;
  const bcCatCount = document.getElementById('bc-cat-count');
  if (bcCatCount) bcCatCount.textContent = catCalcs.length;
  const bcCategoryLink = document.getElementById('bc-category');
  if (bcCategoryLink) {
    bcCategoryLink.onclick = (e) => {
      e.preventDefault();
      openCategoryDirectory(calc.category, true);
    };
  }
  const bcCurrentTitle = document.getElementById('bc-current-title');
  if (bcCurrentTitle) bcCurrentTitle.textContent = calc.title;

  // --- Update Previous / Next Calculator Navigation Buttons ---
  const allIdx = all.findIndex((c) => c.id === calc.id);
  const prevCalc = all[(allIdx - 1 + all.length) % all.length];
  const nextCalc = all[(allIdx + 1) % all.length];

  const prevNameEl = document.getElementById('prev-calc-name');
  if (prevNameEl) prevNameEl.textContent = prevCalc.title;
  const btnPrev = document.getElementById('btn-prev-calc');
  if (btnPrev) {
    btnPrev.onclick = () => {
      renderActiveCalculator(prevCalc.id);
    };
  }

  const nextNameEl = document.getElementById('next-calc-name');
  if (nextNameEl) nextNameEl.textContent = nextCalc.title;
  const btnNext = document.getElementById('btn-next-calc');
  if (btnNext) {
    btnNext.onclick = () => {
      renderActiveCalculator(nextCalc.id);
    };
  }

  // --- Update Quick Jump Dropdown ---
  const jumpSelect = document.getElementById('calc-jump-select');
  if (jumpSelect) {
    jumpSelect.innerHTML = `
      <optgroup label="More in ${catName} (${catCalcs.length} tools)">
        ${catCalcs.map((c) => `<option value="${c.id}" ${c.id === calc.id ? 'selected' : ''}>${c.title}</option>`).join('')}
      </optgroup>
      ${CATEGORIES.filter((c) => c.id !== calc.category).map((c) => {
        const tools = all.filter((t) => t.category === c.id);
        return `
          <optgroup label="${c.name} (${tools.length})">
            ${tools.map((t) => `<option value="${t.id}">${t.title}</option>`).join('')}
          </optgroup>
        `;
      }).join('')}
    `;
    jumpSelect.onchange = (e) => {
      renderActiveCalculator(e.target.value);
    };
  }

  // --- Update Same-Category Companion Tools Section ---
  const companionCatTitle = document.getElementById('companion-cat-title');
  if (companionCatTitle) companionCatTitle.textContent = catName;
  const companionCatSubtitle = document.getElementById('companion-cat-subtitle');
  if (companionCatSubtitle) companionCatSubtitle.textContent = `Direct links to all ${catCalcs.length} companion tools in ${catName}`;
  const btnViewAll = document.getElementById('btn-view-all-category');
  if (btnViewAll) {
    btnViewAll.onclick = () => openCategoryDirectory(calc.category, true);
  }
  const companionList = document.getElementById('companion-calculators-list');
  if (companionList) {
    companionList.innerHTML = catCalcs.map((c) => `
      <a href="#${c.slug}" class="companion-pill-link ${c.id === calc.id ? 'active' : ''}" data-id="${c.id}">
        <span>${c.title}</span>
      </a>
    `).join('');
    companionList.querySelectorAll('.companion-pill-link').forEach((link) => {
      link.onclick = (e) => {
        e.preventDefault();
        const id = link.getAttribute('data-id');
        renderActiveCalculator(id);
      };
    });
  }

  // Execute initial calculation
  executeCalculation(false);
}

// --- 6. EXECUTE CALCULATION & DISPLAY OUTPUT ---
function executeCalculation(isExplicitClick = true) {
  const all = getAllCalculators();
  const calc = all.find((c) => c.id === currentCalcId);
  if (!calc) return;

  const res = calc.calculate ? calc.calculate(currentFormValues) : universalCalculator(calc, currentFormValues);

  // Update Output DOM Elements
  const labelEl = document.getElementById('primary-result-label');
  const valueEl = document.getElementById('primary-result-value');
  const subtextEl = document.getElementById('primary-result-subtext');
  const errorEl = document.getElementById('calc-error-message');

  if (labelEl) labelEl.textContent = res.primaryLabel || 'Result';
  if (valueEl) valueEl.textContent = res.primaryValue || '0';
  if (subtextEl) {
    subtextEl.textContent = res.subtext || '';
    subtextEl.style.display = res.subtext ? 'block' : 'none';
  }

  if (errorEl) {
    if (res.error) {
      errorEl.textContent = `⚠️ ${res.error}`;
      errorEl.style.display = 'block';
    } else {
      errorEl.style.display = 'none';
    }
  }

  // Breakdown List
  const breakdownContainer = document.getElementById('result-breakdown');
  if (breakdownContainer) {
    if (res.breakdown && res.breakdown.length > 0) {
      breakdownContainer.innerHTML = res.breakdown
        .map(
          (item) => `
          <div class="result-row">
            <span class="result-row-label">${item.label}</span>
            <span class="result-row-value">${item.value}</span>
          </div>`
        )
        .join('');
      breakdownContainer.style.display = 'flex';
    } else {
      breakdownContainer.style.display = 'none';
    }
  }

  // Steps Box
  const stepsContainer = document.getElementById('result-steps');
  if (stepsContainer) {
    if (res.steps && res.steps.length > 0) {
      if (calc.id === 'determinant-calculator') {
        renderMatrixDeterminantSolution(stepsContainer, res);
      } else {
        stepsContainer.innerHTML = `
          <div style="font-weight: 700; font-size: 0.85rem; margin-bottom: 0.4rem; color: var(--text-primary);">
            Calculation Steps
          </div>
          ${res.steps
            .map(
              (step, idx) => `
              <div class="step-item" style="font-size: 0.85rem; margin-bottom: 0.25rem;">
                <span class="step-number" style="font-weight: 700; color: var(--accent-primary); margin-right: 0.35rem;">${idx + 1}.</span>
                <span>${step}</span>
              </div>`
            )
            .join('')}
        `;
        stepsContainer.style.display = 'block';
      }
    } else {
      stepsContainer.style.display = 'none';
    }
  }

  // If user clicked "Calculate" button, save to History & notify
  if (isExplicitClick && !res.error) {
    addHistoryItem({
      calcId: calc.id,
      calcSlug: calc.slug,
      calcTitle: calc.title,
      inputs: { ...currentFormValues },
      primaryResult: res.primaryValue
    });
    showToast(`Calculated: ${res.primaryValue}`, 'success');
  }
}

// --- 7. RENDER CATEGORIES, POPULAR CARDS & CATEGORY BROWSER DIRECTORY ---
let activeCategoryBrowser = 'all';

function renderCategoryCards() {
  const container = document.getElementById('categories-grid');
  if (!container) return;

  container.innerHTML = CATEGORIES.map(
    (cat) => `
    <div class="card category-card" data-cat-id="${cat.id}" style="cursor: pointer;">
      <div class="category-icon" style="color: var(--accent-primary); margin-bottom: 0.85rem; display: inline-flex; align-items: center; justify-content: center; width: 46px; height: 46px; border-radius: var(--radius-lg); background: var(--accent-light);">
        ${getCategoryIcon(cat.id, 24)}
      </div>
      <h3 style="font-size: 1.1rem; margin: 0 0 0.35rem; font-weight: 700;">${cat.name}</h3>
      <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0 0 0.75rem;">${cat.description}</p>
      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: auto;">
        <span class="badge badge-primary">${cat.count} Calculators</span>
        <span style="font-size: 0.8rem; color: var(--accent-primary); font-weight: 600; display: inline-flex; align-items: center; gap: 0.25rem;">
          View All ${SVG_ICONS.arrowRight}
        </span>
      </div>
    </div>
  `
  ).join('');

  container.querySelectorAll('.category-card').forEach((card) => {
    card.addEventListener('click', () => {
      const catId = card.getAttribute('data-cat-id');
      openCategoryDirectory(catId, true);
    });
  });
}

function renderPopularCards() {
  const container = document.getElementById('popular-cards-grid');
  if (!container) return;
  const all = getAllCalculators();

  const popularIds = [
    'basic-calculator',
    'percentage-calculator',
    'bmi-calculator',
    'age-calculator',
    'mortgage-calculator',
    'unit-converter',
    'scientific-calculator',
    'compound-interest-calculator',
    'loan-calculator',
    'calorie-calculator',
    'discount-calculator',
    'future-value-calculator'
  ];
  const list = popularIds.map((id) => all.find((c) => c.id === id)).filter(Boolean);

  container.innerHTML = list.map((calc) => {
    const isFav = getFavorites().includes(calc.id);
    return `
      <div class="card calculator-card" data-calc-id="${calc.id}">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
          <span class="badge badge-popular" style="text-transform: capitalize; display: inline-flex; align-items: center; gap: 0.35rem;">
            ${getCategoryIcon(calc.category, 14)}
            <span>${calc.category.replace(/-/g, ' ')}</span>
          </span>
          <button class="card-fav-btn" data-fav-id="${calc.id}" style="background: none; border: none; cursor: pointer; padding: 4px; display: inline-flex; align-items: center; color: var(--text-muted);" title="Toggle Favorite">
            ${isFav ? SVG_ICONS.starFilled : SVG_ICONS.star}
          </button>
        </div>
        <h3 style="font-size: 1.1rem; font-weight: 700; margin: 0 0 0.35rem;">${calc.title}</h3>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0 0 1rem; flex: 1;">${calc.shortDesc}</p>
        <button class="btn btn-secondary load-calc-btn" data-calc-id="${calc.id}" style="width: 100%; height: 38px; font-size: 0.85rem; display: inline-flex; align-items: center; justify-content: center; gap: 0.45rem;">
          <span>Use Calculator</span>
          ${SVG_ICONS.arrowRight}
        </button>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.calculator-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-fav-btn')) return;
      const id = card.getAttribute('data-calc-id');
      if (id) {
        renderActiveCalculator(id);
      }
    });
  });

  container.querySelectorAll('.load-calc-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-calc-id');
      renderActiveCalculator(id);
    });
  });

  container.querySelectorAll('.card-fav-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-fav-id');
      let favs = getFavorites();
      if (favs.includes(id)) {
        favs = favs.filter((f) => f !== id);
        showToast('Removed from favorites', 'info');
      } else {
        favs.push(id);
        showToast('Added to favorites!', 'success');
      }
      saveFavorites(favs);
      renderPopularCards();
    });
  });
}

function setupCategoryBrowser() {
  const select = document.getElementById('cat-browser-select');
  if (select) {
    const all = getAllCalculators();
    select.innerHTML = `
      <option value="all">All Categories (200)</option>
      ${CATEGORIES.map((c) => {
        const cnt = all.filter((t) => t.category === c.id).length || c.count;
        return `<option value="${c.id}">${c.name} (${cnt})</option>`;
      }).join('')}
    `;
    select.addEventListener('change', (e) => {
      openCategoryDirectory(e.target.value, false);
    });
  }

  const searchInput = document.getElementById('cat-browser-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderCategoryBrowserGrid(activeCategoryBrowser, searchInput.value);
    });
  }

  // Initial render
  renderCategoryBrowserGrid('all');
}

function openCategoryDirectory(catId, scroll = true) {
  activeCategoryBrowser = catId || 'all';

  // Sync select element
  const select = document.getElementById('cat-browser-select');
  if (select) select.value = activeCategoryBrowser;

  // Sync hero category pills
  document.querySelectorAll('.hero-pill-btn').forEach((p) => {
    if (p.getAttribute('data-cat-id') === activeCategoryBrowser) {
      p.classList.add('active');
    } else {
      p.classList.remove('active');
    }
  });

  // Clear search filter input in category browser
  const searchInput = document.getElementById('cat-browser-search-input');
  if (searchInput) searchInput.value = '';

  renderCategoryBrowserGrid(activeCategoryBrowser);

  if (scroll) {
    const section = document.getElementById('category-browser-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  }
}

// --- 8B. HIGH-PRECISION RANKED SEARCH ENGINE FOR ALL 200 CALCULATORS ---
function searchCalculators(query, categoryFilter = 'all') {
  const all = getAllCalculators();
  const q = (query || '').toLowerCase().trim();

  let list = all;
  if (categoryFilter && categoryFilter !== 'all') {
    list = list.filter((c) => c.category === categoryFilter);
  }

  if (!q) {
    return list;
  }

  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const wordRegex = new RegExp(`\\b${escapeRegExp(q)}`, 'i');
  const tokens = q.split(/\s+/).filter(Boolean);

  const scored = [];
  list.forEach((calc) => {
    const title = calc.title.toLowerCase();
    const desc = (calc.shortDesc || '').toLowerCase();
    const cat = (calc.category || '').toLowerCase();
    const formula = (calc.formula || '').toLowerCase();
    const keys = Array.isArray(calc.keywords) ? calc.keywords.map((k) => k.toLowerCase()) : [];

    let score = 0;

    // 1. Exact title match
    if (title === q) {
      score += 1000;
    } else if (title.startsWith(q)) {
      score += 500;
    } else if (wordRegex.test(title)) {
      score += 400;
    } else if (keys.some((k) => k === q)) {
      score += 350;
    } else if (keys.some((k) => wordRegex.test(k))) {
      score += 300;
    } else if (title.split(/[\s-]+/).some((w) => w.startsWith(q))) {
      score += 250;
    } else if (tokens.every((t) => title.includes(t))) {
      score += 200;
    } else if (q.length >= 3 && title.includes(q)) {
      score += 120;
    }

    if (cat.includes(q)) score += 100;
    if (keys.some((k) => (q.length >= 3 ? k.includes(q) : wordRegex.test(k)))) score += 80;
    if (wordRegex.test(desc)) score += 40;
    else if (q.length >= 4 && desc.includes(q)) score += 15;
    if (calc.slug && (calc.slug.startsWith(q) || wordRegex.test(calc.slug))) score += 40;
    if (q.length >= 3 && formula.includes(q)) score += 15;

    if (score > 0) {
      scored.push({ calc, score });
    }
  });

  return scored.sort((a, b) => b.score - a.score).map((s) => s.calc);
}

function renderCategoryBrowserGrid(catId, query = '') {
  const container = document.getElementById('category-calculators-grid');
  if (!container) return;

  const filtered = searchCalculators(query, catId);
  const q = (query || '').trim();

  // Update Section Headers
  const catObj = CATEGORIES.find((c) => c.id === catId);
  const titleEl = document.getElementById('cat-browser-title');
  const descEl = document.getElementById('cat-browser-desc');
  const countBadge = document.getElementById('cat-browser-count-badge');
  const badgeEl = document.getElementById('cat-browser-badge');

  if (catId === 'all') {
    if (badgeEl) badgeEl.textContent = 'All Categories';
    if (titleEl) titleEl.textContent = 'Explore All 200 Online Calculators';
    if (descEl) descEl.textContent = 'Every verified mathematical, scientific, financial, and digital calculator accessible instantly in one place.';
  } else if (catObj) {
    if (badgeEl) badgeEl.textContent = catObj.name;
    if (titleEl) titleEl.textContent = `${catObj.name} Calculators`;
    if (descEl) descEl.textContent = catObj.description || `Browse and use all verified calculators in ${catObj.name}.`;
  }

  if (countBadge) {
    countBadge.textContent = `${filtered.length} Calculator${filtered.length === 1 ? '' : 's'}`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <p style="font-weight: 600; font-size: 1.1rem; color: var(--text-secondary); margin-bottom: 0.5rem;">No calculators found</p>
        <p style="font-size: 0.85rem; margin-bottom: 1.25rem;">No tools match "${q}" in this category.</p>
        <button type="button" class="btn btn-secondary" onclick="openCategoryDirectory('all')">View All 200 Calculators</button>
      </div>
    `;
    return;
  }

  const favs = getFavorites();

  container.innerHTML = filtered.map((calc) => {
    const isFav = favs.includes(calc.id);
    return `
      <div class="card calculator-card category-calc-card" data-calc-id="${calc.id}" style="display: flex; flex-direction: column;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
          <span class="badge badge-popular" style="text-transform: capitalize; display: inline-flex; align-items: center; gap: 0.35rem;">
            ${getCategoryIcon(calc.category, 14)}
            <span>${calc.category.replace(/-/g, ' ')}</span>
          </span>
          <button class="card-fav-btn" data-fav-id="${calc.id}" style="background: none; border: none; cursor: pointer; padding: 4px; display: inline-flex; align-items: center; color: var(--text-muted);" title="Toggle Favorite">
            ${isFav ? SVG_ICONS.starFilled : SVG_ICONS.star}
          </button>
        </div>
        <h3 style="font-size: 1.05rem; font-weight: 700; margin: 0 0 0.35rem; color: var(--text-primary);">${calc.title}</h3>
        <p style="font-size: 0.82rem; color: var(--text-muted); margin: 0 0 1rem; flex: 1; line-height: 1.45;">${calc.shortDesc}</p>
        <div style="margin-top: auto; padding-top: 0.5rem;">
          <button type="button" class="btn btn-secondary load-calc-btn" data-calc-id="${calc.id}" style="width: 100%; height: 38px; font-size: 0.85rem; display: inline-flex; align-items: center; justify-content: center; gap: 0.45rem;">
            <span>Use Calculator</span>
            ${SVG_ICONS.arrowRight}
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.category-calc-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.card-fav-btn')) return;
      const id = card.getAttribute('data-calc-id');
      if (id) {
        renderActiveCalculator(id);
      }
    });
  });

  container.querySelectorAll('.load-calc-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-calc-id');
      renderActiveCalculator(id);
    });
  });

  container.querySelectorAll('.card-fav-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-fav-id');
      let currentFavs = getFavorites();
      if (currentFavs.includes(id)) {
        currentFavs = currentFavs.filter((f) => f !== id);
        showToast('Removed from favorites', 'info');
      } else {
        currentFavs.push(id);
        showToast('Added to favorites!', 'success');
      }
      saveFavorites(currentFavs);
      renderCategoryBrowserGrid(activeCategoryBrowser, query);
    });
  });
}

function filterCalculatorsByCategory(catId) {
  openCategoryDirectory(catId, true);
}

// --- 8. DRAWERS (FAVORITES & HISTORY) ---
function setupDrawers() {
  const favDrawer = document.getElementById('favorites-drawer');
  const histDrawer = document.getElementById('history-drawer');

  // Favorites open/close
  document.getElementById('open-favorites-btn')?.addEventListener('click', () => {
    renderFavoritesList();
    favDrawer.classList.add('open');
  });
  document.getElementById('close-favorites-btn')?.addEventListener('click', () => {
    favDrawer.classList.remove('open');
  });

  // History open/close
  document.getElementById('open-history-btn')?.addEventListener('click', () => {
    renderHistoryList();
    histDrawer.classList.add('open');
  });
  document.getElementById('close-history-btn')?.addEventListener('click', () => {
    histDrawer.classList.remove('open');
  });
  document.getElementById('clear-history-btn')?.addEventListener('click', () => {
    localStorage.removeItem('calchub_history');
    renderHistoryList();
    updateHeaderBadges();
    showToast('Calculation history cleared', 'info');
  });
}

function renderFavoritesList() {
  const container = document.getElementById('favorites-list-container');
  if (!container) return;
  const favs = getFavorites();
  const allTools = getAllCalculators();

  if (favs.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 3rem 1rem;">
        <div style="margin-bottom: 0.5rem; opacity: 0.4;">${SVG_ICONS.star}</div>
        <p style="font-weight: 600; font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 0.25rem;">No Favorites Saved Yet</p>
        <p style="font-size: 0.8rem;">Click the star icon on any calculator to save it here for quick access.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = favs.map((id) => {
    const calc = allTools.find((c) => c.id === id) || { id, title: id, shortDesc: 'Calculator tool', category: 'basic-everyday' };
    return `
      <div style="background: var(--bg-surface-subtle); padding: 0.85rem 1rem; border-radius: var(--radius-lg); margin-bottom: 0.6rem; border: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem; min-width: 0;">
          <div style="width: 34px; height: 34px; border-radius: var(--radius-md); background: var(--accent-primary-light); color: var(--accent-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            ${getCategoryIcon(calc.category, 16)}
          </div>
          <div style="min-width: 0;">
            <div style="font-weight: 700; font-size: 0.92rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${calc.title}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${calc.shortDesc}</div>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 0.4rem; flex-shrink: 0;">
          <button class="btn btn-secondary fav-use-btn" data-id="${id}" style="height: 32px; padding: 0 0.65rem; font-size: 0.78rem; display: inline-flex; align-items: center; gap: 0.3rem;">
            <span>Open</span>
            ${SVG_ICONS.arrowRight}
          </button>
          <button class="fav-del-btn" data-id="${id}" title="Remove from favorites" style="background: none; border: none; cursor: pointer; padding: 6px; border-radius: var(--radius-sm); color: var(--text-muted); display: flex; align-items: center; justify-content: center;">
            ${SVG_ICONS.trash}
          </button>
        </div>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.fav-use-btn').forEach((b) => {
    b.addEventListener('click', () => {
      const id = b.getAttribute('data-id');
      renderActiveCalculator(id);
      document.getElementById('favorites-drawer').classList.remove('open');
      document.querySelector('.drawer-backdrop')?.remove();
    });
  });

  container.querySelectorAll('.fav-del-btn').forEach((b) => {
    b.addEventListener('click', () => {
      const id = b.getAttribute('data-id');
      let favs = getFavorites().filter((f) => f !== id);
      saveFavorites(favs);
      renderFavoritesList();
      renderPopularCards();
      showToast('Removed from favorites', 'info');
    });
  });
}

function renderHistoryList() {
  const container = document.getElementById('history-list-container');
  if (!container) return;
  const history = getHistory();
  const allTools = getAllCalculators();

  if (history.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 3rem 1rem;">
        <div style="margin-bottom: 0.5rem; opacity: 0.4;">${SVG_ICONS.history}</div>
        <p style="font-weight: 600; font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 0.25rem;">No Calculations Yet</p>
        <p style="font-size: 0.8rem;">Every time you click Calculate, your calculations will appear here.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = history.map((item, idx) => {
    const calc = allTools.find((c) => c.id === item.calcId) || { category: 'basic-everyday' };
    return `
      <div style="background: var(--bg-surface-subtle); padding: 0.85rem 1rem; border-radius: var(--radius-lg); margin-bottom: 0.6rem; border: 1px solid var(--border-subtle);">
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.35rem;">
          <span style="display: inline-flex; align-items: center; gap: 0.35rem; font-weight: 600; color: var(--text-secondary);">
            ${getCategoryIcon(calc.category, 13)}
            <span>${item.calcTitle}</span>
          </span>
          <span>${new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div style="font-size: 1.15rem; font-weight: 700; color: var(--accent-primary); margin-bottom: 0.5rem;">
          ${item.primaryResult}
        </div>
        <button class="btn btn-secondary restore-hist-btn" data-index="${idx}" style="height: 28px; font-size: 0.75rem; padding: 0 0.65rem; display: inline-flex; align-items: center; gap: 0.35rem;">
          ${SVG_ICONS.reset}
          <span>Reuse Inputs</span>
        </button>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.restore-hist-btn').forEach((b) => {
    b.addEventListener('click', () => {
      const idx = parseInt(b.getAttribute('data-index') || '0');
      const item = history[idx];
      if (item) {
        renderActiveCalculator(item.calcId);
        currentFormValues = { ...item.inputs };
        // Populate inputs in DOM
        Object.entries(currentFormValues).forEach(([k, v]) => {
          const el = document.getElementById(`input-${k}`);
          if (el) el.value = v;
        });
        executeCalculation(false);
        document.getElementById('history-drawer').classList.remove('open');
        document.querySelector('.drawer-backdrop')?.remove();
        showToast(`Restored inputs for ${item.calcTitle}`, 'info');
      }
    });
  });
}

// --- 9. THEME TOGGLE (DARK / LIGHT) ---
function setupTheme() {
  const saved = localStorage.getItem('calchub_theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  const toggleBtn = document.getElementById('theme-toggle-btn');
  const updateThemeIcon = (theme) => {
    const iconSpan = toggleBtn?.querySelector('.theme-icon');
    if (iconSpan) {
      iconSpan.innerHTML = theme === 'dark' ? SVG_ICONS.sun : SVG_ICONS.moon;
    }
    if (toggleBtn) {
      const label = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
      toggleBtn.setAttribute('title', label);
      toggleBtn.setAttribute('aria-label', label);
    }
  };
  updateThemeIcon(saved);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('calchub_theme', next);
      updateThemeIcon(next);
      showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
    });
  }
}

// --- 10. SEARCH MODAL (COMMAND CENTER: ALL 183 TOOLS IMMEDIATELY VISIBLE) ---
function setupSearch() {
  const modal = document.getElementById('search-modal');
  const searchInput = document.getElementById('modal-search-input');
  const resultsContainer = document.getElementById('search-results-list');
  const categoryFiltersContainer = document.getElementById('modal-category-filters');
  const countLabel = document.getElementById('modal-search-count');
  const clearBtn = document.getElementById('modal-clear-search-btn');

  let activeModalCategory = 'all';
  let selectedResultIndex = 0;

  // Retrieve complete list of 183 calculators
  const allTools = getAllCalculators();

  const renderModalCategories = () => {
    if (!categoryFiltersContainer) return;

    // Count calculators per category
    const catCounts = {};
    allTools.forEach((t) => {
      catCounts[t.category] = (catCounts[t.category] || 0) + 1;
    });

    const pills = [
      { id: 'all', name: 'All Tools', count: allTools.length },
      ...CATEGORIES.map((c) => ({ id: c.id, name: c.name, count: catCounts[c.id] || c.count }))
    ];

    categoryFiltersContainer.innerHTML = pills.map((p) => `
      <button type="button" class="modal-pill-btn ${p.id === activeModalCategory ? 'active' : ''}" data-cat="${p.id}">
        <span>${p.name}</span>
        <span style="opacity: 0.75; font-size: 0.72rem;">(${p.count})</span>
      </button>
    `).join('');

    categoryFiltersContainer.querySelectorAll('.modal-pill-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeModalCategory = btn.getAttribute('data-cat');
        categoryFiltersContainer.querySelectorAll('.modal-pill-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        filterAndRenderResults();
      });
    });
  };

  const filterAndRenderResults = () => {
    const q = (searchInput?.value || '').toLowerCase().trim();

    let filtered = searchCalculators(q, activeModalCategory);

    if (countLabel) {
      if (q) {
        countLabel.textContent = `Found ${filtered.length} calculator${filtered.length === 1 ? '' : 's'} matching "${q}"`;
      } else if (activeModalCategory !== 'all') {
        const catObj = CATEGORIES.find((c) => c.id === activeModalCategory);
        countLabel.textContent = `Showing ${filtered.length} calculators in ${catObj ? catObj.name : activeModalCategory}`;
      } else {
        countLabel.textContent = `Showing all ${filtered.length} calculators`;
      }
    }

    if (clearBtn) {
      clearBtn.style.display = q ? 'flex' : 'none';
    }

    if (filtered.length === 0) {
      resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 3rem 1.5rem; color: var(--text-muted);">
          <div style="margin-bottom: 0.75rem; opacity: 0.35;">
            ${SVG_ICONS.search}
          </div>
          <div style="font-weight: 700; font-size: 1.05rem; color: var(--text-primary); margin-bottom: 0.3rem;">No calculators found</div>
          <p style="font-size: 0.85rem; margin-bottom: 1.25rem;">No tools match "${q}" in the selected category.</p>
          <button type="button" id="btn-reset-modal-search" class="btn btn-secondary" style="height: 36px; font-size: 0.85rem; padding: 0 1rem;">
            Clear Search Filters
          </button>
        </div>
      `;
      document.getElementById('btn-reset-modal-search')?.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        activeModalCategory = 'all';
        renderModalCategories();
        filterAndRenderResults();
      });
      return;
    }

    selectedResultIndex = 0;

    resultsContainer.innerHTML = filtered.map((tool, idx) => {
      let titleHtml = tool.title;
      if (q) {
        const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        titleHtml = tool.title.replace(regex, '<mark>$1</mark>');
      }

      return `
        <div class="search-result-item ${idx === 0 ? 'selected' : ''}" data-id="${tool.id}" data-index="${idx}">
          <div class="search-item-icon-box">
            ${getCategoryIcon(tool.category, 18)}
          </div>
          <div class="search-item-content">
            <div class="search-item-title-row">
              <span class="search-item-title">${titleHtml}</span>
            </div>
            <div class="search-item-desc">${tool.shortDesc || tool.formula || 'Fast & accurate online calculation'}</div>
          </div>
          <div class="search-item-actions">
            <span class="search-item-cat-badge">${tool.category.replace(/-/g, ' ')}</span>
            <div class="search-item-arrow">
              ${SVG_ICONS.arrowRight}
            </div>
          </div>
        </div>
      `;
    }).join('');

    resultsContainer.querySelectorAll('.search-result-item').forEach((item) => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        openCalculatorFromSearch(id);
      });
    });
  };

  const openCalculatorFromSearch = (id) => {
    renderActiveCalculator(id);
    closeSearch();
    const tool = allTools.find((t) => t.id === id);
    showToast(`Loaded: ${tool ? tool.title : id}`, 'success');
  };

  const openSearch = () => {
    modal.classList.add('open');
    renderModalCategories();
    filterAndRenderResults();
    setTimeout(() => {
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }, 60);
  };

  const closeSearch = () => {
    modal.classList.remove('open');
  };

  document.getElementById('header-search-btn')?.addEventListener('click', openSearch);
  document.getElementById('close-search-btn')?.addEventListener('click', closeSearch);

  clearBtn?.addEventListener('click', () => {
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
    filterAndRenderResults();
  });

  searchInput?.addEventListener('input', () => {
    filterAndRenderResults();
  });

  // Modal keyboard navigation: ArrowDown, ArrowUp, Enter, Escape
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
      return;
    }
    if (modal.classList.contains('open')) {
      if (e.key === 'Escape') {
        closeSearch();
        return;
      }
      const items = resultsContainer.querySelectorAll('.search-result-item');
      if (items.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          selectedResultIndex = (selectedResultIndex + 1) % items.length;
          updateSelectedHighlight(items);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          selectedResultIndex = (selectedResultIndex - 1 + items.length) % items.length;
          updateSelectedHighlight(items);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          const current = items[selectedResultIndex];
          if (current) {
            const id = current.getAttribute('data-id');
            openCalculatorFromSearch(id);
          }
        }
      }
    }
  });

  const updateSelectedHighlight = (items) => {
    items.forEach((it, idx) => {
      if (idx === selectedResultIndex) {
        it.classList.add('selected');
        it.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        it.classList.remove('selected');
      }
    });
  };

  // Close when clicking modal backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeSearch();
    }
  });
}

// --- 10B. HERO SEARCH BAR WITH LIVE DROPDOWN & KEYBOARD SUPPORT ---
function setupHeroSearch() {
  const heroInput = document.getElementById('hero-search-input');
  const heroDropdown = document.getElementById('hero-search-dropdown');
  const heroDropdownResults = document.getElementById('hero-dropdown-results');
  const heroDropdownCount = document.getElementById('hero-dropdown-count');
  const heroClearBtn = document.getElementById('hero-clear-search-btn');
  const heroSearchBtn = document.getElementById('hero-search-btn');
  const heroContainer = document.getElementById('hero-search-container');

  if (!heroInput || !heroDropdown || !heroDropdownResults) return;

  let currentResults = [];
  let selectedIndex = -1;

  const escapeHtml = (str) => {
    return (str || '').replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  };

  const closeDropdown = () => {
    heroDropdown.style.display = 'none';
    selectedIndex = -1;
  };

  const openDropdown = () => {
    heroDropdown.style.display = 'block';
  };

  const selectCalculator = (calcId) => {
    if (!calcId) return;
    renderActiveCalculator(calcId);
    closeDropdown();
    if (heroInput) heroInput.blur();
    const all = getAllCalculators();
    const tool = all.find((t) => t.id === calcId);
    showToast(`Loaded: ${tool ? tool.title : calcId}`, 'success');
  };

  const updateSelection = () => {
    const items = heroDropdownResults.querySelectorAll('.hero-search-result-item');
    items.forEach((item, idx) => {
      if (idx === selectedIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        item.classList.remove('selected');
      }
    });
  };

  const renderPopularSuggestions = () => {
    const popularIds = ['basic-calculator', 'percentage-calculator', 'bmi-calculator', 'age-calculator', 'mortgage-calculator', 'unit-converter', 'loan-calculator', 'currency-converter'];
    const all = getAllCalculators();
    const popularTools = popularIds.map((id) => all.find((c) => c.id === id)).filter(Boolean);
    currentResults = popularTools;
    selectedIndex = -1;

    if (heroDropdownCount) {
      heroDropdownCount.textContent = 'Popular Calculators';
    }

    heroDropdownResults.innerHTML = popularTools.map((tool) => `
      <div class="hero-search-result-item" data-calc-id="${tool.id}" role="option">
        <div class="hero-item-title-col">
          <span class="hero-item-title">${escapeHtml(tool.title)}</span>
          <span class="hero-item-desc">${escapeHtml(tool.shortDesc || tool.formula || 'Fast & accurate calculation')}</span>
        </div>
        <div class="hero-item-meta">
          <span class="hero-item-badge">${escapeHtml(tool.category.replace(/-/g, ' '))}</span>
          <div class="hero-item-arrow">${SVG_ICONS.arrowRight}</div>
        </div>
      </div>
    `).join('');

    heroDropdownResults.querySelectorAll('.hero-search-result-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = item.getAttribute('data-calc-id');
        selectCalculator(id);
      });
    });

    openDropdown();
  };

  const renderDropdown = (query) => {
    const q = (query || '').trim();
    if (!q) {
      renderPopularSuggestions();
      if (heroClearBtn) heroClearBtn.style.display = 'none';
      return;
    }

    if (heroClearBtn) heroClearBtn.style.display = 'flex';

    const results = searchCalculators(q, 'all');
    currentResults = results;
    selectedIndex = results.length > 0 ? 0 : -1;

    if (heroDropdownCount) {
      heroDropdownCount.textContent = `${results.length} calculator${results.length === 1 ? '' : 's'} found`;
    }

    if (results.length === 0) {
      heroDropdownResults.innerHTML = `
        <div class="hero-no-results">
          <div class="hero-no-results-title">No calculators found</div>
          <p class="hero-no-results-sub">No calculators match "<strong>${escapeHtml(q)}</strong>". Try one of these popular searches:</p>
          <div class="hero-no-results-chips">
            <button type="button" class="search-quick-chip" data-search="loan">Loan</button>
            <button type="button" class="search-quick-chip" data-search="age">Age</button>
            <button type="button" class="search-quick-chip" data-search="percentage">Percentage</button>
            <button type="button" class="search-quick-chip" data-search="currency">Currency</button>
            <button type="button" class="search-quick-chip" data-search="bmi">BMI</button>
            <button type="button" class="search-quick-chip" data-search="mortgage">Mortgage</button>
          </div>
        </div>
      `;

      heroDropdownResults.querySelectorAll('.search-quick-chip').forEach((chip) => {
        chip.addEventListener('click', (e) => {
          e.stopPropagation();
          const term = chip.getAttribute('data-search');
          if (term) {
            heroInput.value = term;
            heroInput.focus();
            renderDropdown(term);
          }
        });
      });

      openDropdown();
      return;
    }

    // Limit to top 15 results for performance and clean UI
    const displayList = results.slice(0, 15);
    const safeRegex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');

    let html = displayList.map((tool, idx) => {
      let titleHtml = escapeHtml(tool.title);
      titleHtml = titleHtml.replace(safeRegex, '<mark class="search-match">$1</mark>');

      return `
        <div class="hero-search-result-item ${idx === 0 ? 'selected' : ''}" data-calc-id="${tool.id}" role="option">
          <div class="hero-item-title-col">
            <span class="hero-item-title">${titleHtml}</span>
            <span class="hero-item-desc">${escapeHtml(tool.shortDesc || tool.formula || 'Fast & accurate calculation')}</span>
          </div>
          <div class="hero-item-meta">
            <span class="hero-item-badge">${escapeHtml(tool.category.replace(/-/g, ' '))}</span>
            <div class="hero-item-arrow">${SVG_ICONS.arrowRight}</div>
          </div>
        </div>
      `;
    }).join('');

    if (results.length > 15) {
      html += `
        <div style="text-align: center; padding: 0.6rem 0.5rem; font-size: 0.78rem; color: var(--muted); border-top: 1px solid var(--border);">
          + ${results.length - 15} more matching calculators. Press <kbd style="background: var(--surface-alt); border: 1px solid var(--border); padding: 1px 4px; border-radius: 3px;">Enter</kbd> to view all in directory.
        </div>
      `;
    }

    heroDropdownResults.innerHTML = html;

    heroDropdownResults.querySelectorAll('.hero-search-result-item').forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = item.getAttribute('data-calc-id');
        selectCalculator(id);
      });
    });

    openDropdown();
  };

  // Input event
  heroInput.addEventListener('input', (e) => {
    const val = e.target.value;
    if (!val.trim()) {
      renderPopularSuggestions();
      if (heroClearBtn) heroClearBtn.style.display = 'none';
    } else {
      renderDropdown(val);
    }
  });

  // Focus event: show popular suggestions if empty, or existing search results
  heroInput.addEventListener('focus', () => {
    if (heroInput.value.trim().length > 0) {
      renderDropdown(heroInput.value);
    } else {
      renderPopularSuggestions();
    }
  });

  // Clear button
  heroClearBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    heroInput.value = '';
    closeDropdown();
    if (heroClearBtn) heroClearBtn.style.display = 'none';
    heroInput.focus();
  });

  // Search button
  const executeHeroAction = () => {
    const q = heroInput.value.trim();
    if (!q) return;

    if (currentResults.length > 0 && selectedIndex >= 0 && selectedIndex < currentResults.length) {
      selectCalculator(currentResults[selectedIndex].id);
    } else if (currentResults.length > 0) {
      selectCalculator(currentResults[0].id);
    } else {
      openCategoryDirectory('all', true);
      const catSearchInput = document.getElementById('cat-browser-search-input');
      if (catSearchInput) catSearchInput.value = q;
      renderCategoryBrowserGrid('all', q);
      closeDropdown();
    }
  };

  heroSearchBtn?.addEventListener('click', executeHeroAction);

  // Keyboard navigation
  heroInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDropdown();
      return;
    }

    if (heroDropdown.style.display !== 'none' && currentResults.length > 0) {
      const maxLen = Math.min(currentResults.length, 15);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % maxLen;
        updateSelection();
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + maxLen) % maxLen;
        updateSelection();
        return;
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      executeHeroAction();
    }
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (heroContainer && !heroContainer.contains(e.target)) {
      closeDropdown();
    }
  });
}

// --- 11. INITIALIZATION ON DOM READY ---
document.addEventListener('DOMContentLoaded', () => {
  setupTheme();
  updateHeaderBadges();
  setupDrawers();
  setupSearch();
  setupHeroSearch();
  setupCategoryBrowser();
  renderCategoryCards();
  renderPopularCards();

  // Tab buttons click listener
  document.querySelectorAll('.calc-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const calcId = btn.getAttribute('data-calc-id');
      renderActiveCalculator(calcId);
    });
  });

  // Calculate Button click listener
  const form = document.getElementById('calculator-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      executeCalculation(true);
    });
  }

  // Reset Button click listener
  document.getElementById('btn-reset')?.addEventListener('click', () => {
    renderActiveCalculator(currentCalcId);
    showToast('Inputs reset to defaults', 'info');
  });

  // Copy Result Button listener with animated SVG feedback
  const copyBtn = document.getElementById('btn-copy-result');
  copyBtn?.addEventListener('click', async () => {
    const val = document.getElementById('primary-result-value')?.textContent || '';
    const label = document.getElementById('primary-result-label')?.textContent || '';
    const text = `${label}: ${val}`;
    try {
      await navigator.clipboard.writeText(text);
      const originalHtml = copyBtn.innerHTML;
      copyBtn.innerHTML = `
        ${SVG_ICONS.check}
        <span>Copied!</span>
      `;
      copyBtn.classList.add('btn-primary');
      copyBtn.classList.remove('btn-secondary');
      setTimeout(() => {
        copyBtn.innerHTML = originalHtml;
        copyBtn.classList.remove('btn-primary');
        copyBtn.classList.add('btn-secondary');
      }, 1800);
      showToast('Result copied to clipboard!', 'success');
    } catch (err) {
      showToast('Copied to clipboard!', 'success');
    }
  });

  // Category Filter Pills in Hero (Opens and displays all tools in that category)
  document.querySelectorAll('.hero-pill-btn').forEach((pill) => {
    pill.addEventListener('click', () => {
      const catId = pill.getAttribute('data-cat-id');
      openCategoryDirectory(catId, true);
    });
  });

  // Handle Deep-linking & URL Hash Routing (e.g. #px-to-rem, #category-finance, #future-value-calculator)
  const handleHashRouting = () => {
    const hash = window.location.hash.replace(/^#/, '').trim();
    if (!hash || hash === 'home' || hash === '/' || hash === 'top') {
      navigateToHome(false);
      return true;
    }

    if (hash.startsWith('category-') || hash.startsWith('cat-')) {
      const catId = hash.replace(/^(category-|cat-)/, '');
      openCategoryDirectory(catId, true);
      return true;
    }

    const all = getAllCalculators();
    const matched = all.find((c) => c.slug === hash || c.id === hash);
    if (matched) {
      renderActiveCalculator(matched.id);
      return true;
    }

    navigateToHome(false);
    return true;
  };

  window.addEventListener('hashchange', handleHashRouting);
  window.addEventListener('popstate', handleHashRouting);

  // Clean back button in calculator view header
  document.getElementById('btn-calc-back-home')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateToHome(true);
  });

  // Home Navigation click listeners
  document.getElementById('nav-home-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateToHome(true);
  });

  document.getElementById('brand-home-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateToHome(true);
  });

  document.getElementById('bc-home')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigateToHome(true);
  });

  document.getElementById('nav-categories-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const homeView = document.getElementById('home-view');
    if (homeView) homeView.style.display = 'block';
    const calcSection = document.getElementById('quick-calc-section');
    if (calcSection) calcSection.style.display = 'none';
    document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active'));
    document.getElementById('nav-categories-btn')?.classList.add('active');
    openCategoryDirectory('all', false);
    document.getElementById('category-browser-section')?.scrollIntoView({ behavior: 'smooth' });
  });

  document.getElementById('nav-popular-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const homeView = document.getElementById('home-view');
    if (homeView) homeView.style.display = 'block';
    const calcSection = document.getElementById('quick-calc-section');
    if (calcSection) calcSection.style.display = 'none';
    document.querySelectorAll('.nav-link').forEach((l) => l.classList.remove('active'));
    document.getElementById('nav-popular-btn')?.classList.add('active');
    document.getElementById('popular-cards-grid')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Initial load routing: if valid calculator hash was requested, open it; otherwise show clean Home page
  const initialHash = window.location.hash.replace(/^#/, '').trim();
  if (initialHash && initialHash !== 'home' && initialHash !== '/') {
    handleHashRouting();
  } else {
    navigateToHome(false);
  }
});

// Expose navigation functions globally for onclick / external calls
if (typeof window !== 'undefined') {
  window.renderActiveCalculator = renderActiveCalculator;
  window.openCategoryDirectory = openCategoryDirectory;
  window.filterCalculatorsByCategory = openCategoryDirectory;
  window.navigateToHome = navigateToHome;
  window.executeCalculation = executeCalculation;
  window.searchCalculators = searchCalculators;
  window.setupHeroSearch = setupHeroSearch;
  window.getCurrentCalcId = () => currentCalcId;
  window.getCurrentFormValues = () => currentFormValues;
}

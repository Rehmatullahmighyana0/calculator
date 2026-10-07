const { toNum, formatNum, gcd, lcm } = require('./utils.cjs');

const engines = {
  'basic-calculator': (inputs) => {
    const expr = String(inputs.expression || '').trim();
    if (!expr) return { primaryValue: '0', primaryLabel: 'Result', error: 'Please enter an expression.' };
    try {
      const sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/');
      if (!/^[0-9+\-*/. ()]+$/.test(sanitized)) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid characters in expression. Only digits and + - * / ( ) allowed.' };
      }
      const fn = new Function(`'use strict'; return (${sanitized});`);
      const result = fn();
      if (typeof result !== 'number' || !isFinite(result)) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Calculation error or division by zero.' };
      }
      const formatted = formatNum(result, 6);
      return {
        primaryValue: formatted,
        primaryLabel: 'Calculated Result',
        subtext: `Evaluated: ${expr}`,
        breakdown: [
          { label: 'Expression', value: expr },
          { label: 'Evaluated Math', value: sanitized },
          { label: 'Calculated Value', value: formatted }
        ],
        steps: [
          `Parsed expression: ${expr}`,
          `Evaluated using standard PEMDAS order of operations`,
          `Result = ${formatted}`
        ]
      };
    } catch (e) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid mathematical syntax.' };
    }
  },

  'scientific-calculator': (inputs) => {
    const expr = String(inputs.expression || '').trim();
    const mode = inputs.angleUnit || 'deg';
    if (!expr) return { primaryValue: '0', primaryLabel: 'Result', error: 'Please enter an expression.' };

    try {
      let code = expr.toLowerCase();
      // Replace degree trig if in deg mode
      if (mode === 'deg') {
        code = code.replace(/sin\(([^)]+)\)/g, '(Math.sin(($1) * Math.PI / 180))')
                   .replace(/cos\(([^)]+)\)/g, '(Math.cos(($1) * Math.PI / 180))')
                   .replace(/tan\(([^)]+)\)/g, '(Math.tan(($1) * Math.PI / 180))');
      } else {
        code = code.replace(/sin\(/g, 'Math.sin(')
                   .replace(/cos\(/g, 'Math.cos(')
                   .replace(/tan\(/g, 'Math.tan(');
      }
      code = code.replace(/sqrt\(/g, 'Math.sqrt(')
                 .replace(/log\(/g, 'Math.log10(')
                 .replace(/ln\(/g, 'Math.log(')
                 .replace(/pi/g, 'Math.PI')
                 .replace(/\be\b/g, 'Math.E')
                 .replace(/\^/g, '**');

      const fn = new Function(`'use strict'; return (${code});`);
      const result = fn();
      if (typeof result !== 'number' || !isFinite(result)) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Evaluation failed or out of mathematical domain.' };
      }
      const formatted = formatNum(result, 6);
      return {
        primaryValue: formatted,
        primaryLabel: 'Function Result',
        subtext: `Evaluated in ${mode.toUpperCase()} mode`,
        breakdown: [
          { label: 'Input Function', value: expr },
          { label: 'Angle Mode', value: mode === 'deg' ? 'Degrees' : 'Radians' },
          { label: 'Output Value', value: formatted }
        ],
        steps: [
          `Read function: ${expr}`,
          `Applied ${mode === 'deg' ? 'degree conversion (π/180)' : 'radian mode'} for trigonometric functions`,
          `Computed scientific output = ${formatted}`
        ]
      };
    } catch (err) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid scientific function syntax.' };
    }
  },

  'percentage-calculator': (inputs) => {
    const mode = inputs.mode || 'what_is';
    const v1 = toNum(inputs.val1, 15);
    const v2 = toNum(inputs.val2, 200);

    if (mode === 'what_is') {
      const result = (v1 / 100) * v2;
      return {
        primaryValue: formatNum(result, 4),
        primaryLabel: `${v1}% of ${v2}`,
        subtext: `Result = ${formatNum(result, 2)}`,
        breakdown: [
          { label: 'Percentage (P)', value: `${v1}%` },
          { label: 'Base Value (X)', value: formatNum(v2) },
          { label: 'Calculated Portion', value: formatNum(result, 4) },
          { label: 'Total (Base + P%)', value: formatNum(v2 + result, 2) }
        ],
        steps: [
          `Convert percentage to decimal: ${v1} / 100 = ${formatNum(v1 / 100, 4)}`,
          `Multiply by base value: ${formatNum(v1 / 100, 4)} × ${v2} = ${formatNum(result, 4)}`
        ]
      };
    } else if (mode === 'x_of_y') {
      if (v2 === 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Base value Y cannot be zero.' };
      const pct = (v1 / v2) * 100;
      return {
        primaryValue: `${formatNum(pct, 2)}%`,
        primaryLabel: `${v1} is what % of ${v2}?`,
        subtext: `${v1} is ${formatNum(pct, 2)}% of ${v2}`,
        breakdown: [
          { label: 'Value (X)', value: formatNum(v1) },
          { label: 'Total (Y)', value: formatNum(v2) },
          { label: 'Percentage', value: `${formatNum(pct, 4)}%` }
        ],
        steps: [
          `Divide X by Y: ${v1} / ${v2} = ${formatNum(v1 / v2, 6)}`,
          `Multiply by 100 to get percent: ${formatNum(v1 / v2, 6)} × 100 = ${formatNum(pct, 2)}%`
        ]
      };
    } else {
      if (v1 === 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Initial value X cannot be zero.' };
      const diff = v2 - v1;
      const pctChange = (diff / v1) * 100;
      const direction = pctChange >= 0 ? 'Increase' : 'Decrease';
      return {
        primaryValue: `${pctChange >= 0 ? '+' : ''}${formatNum(pctChange, 2)}%`,
        primaryLabel: `Percentage ${direction}`,
        subtext: `From ${v1} to ${v2}: ${Math.abs(pctChange).toFixed(2)}% ${direction.toLowerCase()}`,
        breakdown: [
          { label: 'Original Value (X)', value: formatNum(v1) },
          { label: 'New Value (Y)', value: formatNum(v2) },
          { label: 'Absolute Change', value: `${diff >= 0 ? '+' : ''}${formatNum(diff, 2)}` },
          { label: 'Percentage Change', value: `${formatNum(pctChange, 2)}%` }
        ],
        steps: [
          `Find absolute change: ${v2} - ${v1} = ${formatNum(diff, 4)}`,
          `Divide change by original value: ${formatNum(diff, 4)} / ${v1} = ${formatNum(diff / v1, 6)}`,
          `Multiply by 100%: ${formatNum(pctChange, 2)}%`
        ]
      };
    }
  },

  'fraction-calculator': (inputs) => {
    const num1 = Math.round(toNum(inputs.num1, 3));
    const den1 = Math.round(toNum(inputs.den1, 4));
    const op = inputs.op || '+';
    const num2 = Math.round(toNum(inputs.num2, 2));
    const den2 = Math.round(toNum(inputs.den2, 5));

    if (den1 === 0 || den2 === 0) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Denominator cannot be zero.' };
    }

    let resNum = 0;
    let resDen = 1;

    if (op === '+') {
      resNum = num1 * den2 + num2 * den1;
      resDen = den1 * den2;
    } else if (op === '-') {
      resNum = num1 * den2 - num2 * den1;
      resDen = den1 * den2;
    } else if (op === '*') {
      resNum = num1 * num2;
      resDen = den1 * den2;
    } else if (op === '/') {
      if (num2 === 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Cannot divide by a fraction of zero.' };
      resNum = num1 * den2;
      resDen = den1 * num2;
    }

    if (resDen < 0) {
      resNum = -resNum;
      resDen = -resDen;
    }

    const d = gcd(resNum, resDen);
    const simpNum = resNum / d;
    const simpDen = resDen / d;

    const decimalVal = simpNum / simpDen;
    let mixedStr = '';
    if (Math.abs(simpNum) >= simpDen && simpDen !== 1) {
      const whole = Math.trunc(simpNum / simpDen);
      const rem = Math.abs(simpNum % simpDen);
      mixedStr = rem === 0 ? `${whole}` : `${whole} ${rem}/${simpDen}`;
    }

    return {
      primaryValue: simpDen === 1 ? `${simpNum}` : `${simpNum}/${simpDen}`,
      primaryLabel: 'Simplified Fraction',
      subtext: `Decimal value: ${formatNum(decimalVal, 4)}${mixedStr ? ` (Mixed: ${mixedStr})` : ''}`,
      breakdown: [
        { label: 'Input Expression', value: `(${num1}/${den1}) ${op} (${num2}/${den2})` },
        { label: 'Unsimplified Result', value: `${resNum}/${resDen}` },
        { label: 'Simplified Fraction', value: simpDen === 1 ? `${simpNum}` : `${simpNum}/${simpDen}` },
        { label: 'Decimal Equivalent', value: formatNum(decimalVal, 6) }
      ],
      steps: [
        `Common denominator: ${den1} × ${den2} = ${den1 * den2}`,
        `Perform operation: ${num1}/${den1} ${op} ${num2}/${den2} = ${resNum}/${resDen}`,
        `Greatest Common Divisor (GCD) is ${d}`,
        `Divide numerator and denominator by ${d} -> ${simpDen === 1 ? `${simpNum}` : `${simpNum}/${simpDen}`}`
      ]
    };
  },

  'average-calculator': (inputs) => {
    const raw = String(inputs.numbers || '').trim();
    if (!raw) return { primaryValue: '0', primaryLabel: 'Average', error: 'Please enter a list of numbers.' };
    const nums = raw.split(/[\s,]+/).map(Number).filter((n) => !isNaN(n));
    if (nums.length === 0) return { primaryValue: 'Error', primaryLabel: 'Average', error: 'No valid numbers provided.' };

    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / nums.length;
    const sorted = [...nums].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

    return {
      primaryValue: formatNum(mean, 4),
      primaryLabel: 'Arithmetic Mean (Average)',
      subtext: `Count: ${nums.length} values | Median: ${formatNum(median, 2)}`,
      breakdown: [
        { label: 'Count (N)', value: `${nums.length}` },
        { label: 'Sum of Values (Σx)', value: formatNum(sum, 2) },
        { label: 'Mean Average', value: formatNum(mean, 4) },
        { label: 'Median Value', value: formatNum(median, 2) },
        { label: 'Minimum', value: formatNum(min) },
        { label: 'Maximum', value: formatNum(max) }
      ],
      steps: [
        `Summed all ${nums.length} values: Σ = ${formatNum(sum, 2)}`,
        `Divided sum by count: ${formatNum(sum, 2)} / ${nums.length} = ${formatNum(mean, 4)}`,
        `Sorted array to find median: ${formatNum(median, 2)}`
      ]
    };
  },

  'ratio-calculator': (inputs) => {
    const a = toNum(inputs.a, 12);
    const b = toNum(inputs.b, 16);
    const c = toNum(inputs.c, 30);

    if (a === 0 || b === 0) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Ratio terms A and B cannot be zero.' };
    }

    // Solve for D in A:B = C:D -> D = (B * C) / A
    const d = (b * c) / a;
    const div = gcd(a, b);
    const simpA = a / div;
    const simpB = b / div;

    return {
      primaryValue: formatNum(d, 4),
      primaryLabel: 'Solved Value D',
      subtext: `Proportion: ${a} : ${b} = ${c} : ${formatNum(d, 2)}`,
      breakdown: [
        { label: 'Original Ratio (A : B)', value: `${a} : ${b}` },
        { label: 'Simplified Ratio', value: `${simpA} : ${simpB}` },
        { label: 'Known Term C', value: formatNum(c) },
        { label: 'Solved Fourth Term D', value: formatNum(d, 4) }
      ],
      steps: [
        `Given ratio relationship: A / B = C / D`,
        `Cross-multiply: A × D = B × C`,
        `D = (B × C) / A = (${b} × ${c}) / ${a} = ${formatNum(d, 4)}`
      ]
    };
  },

  'proportion-calculator': (inputs) => {
    const type = inputs.type || 'direct';
    const a = toNum(inputs.a, 10);
    const b = toNum(inputs.b, 25);
    const c = toNum(inputs.c, 50);

    if (a === 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Value A cannot be zero.' };

    let d = 0;
    if (type === 'direct') {
      // Direct proportion: a / b = c / d -> d = (b * c) / a
      d = (b * c) / a;
    } else {
      // Inverse proportion: a * b = c * d -> d = (a * b) / c
      if (c === 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Value C cannot be zero in inverse proportion.' };
      d = (a * b) / c;
    }

    return {
      primaryValue: formatNum(d, 4),
      primaryLabel: `Result (D) [${type === 'direct' ? 'Direct' : 'Inverse'}]`,
      subtext: `Calculated with ${type} variation model`,
      breakdown: [
        { label: 'Proportion Model', value: type === 'direct' ? 'Direct (y = kx)' : 'Inverse (y = k/x)' },
        { label: 'Given Pair (A, B)', value: `${a}, ${b}` },
        { label: 'Third Term (C)', value: `${c}` },
        { label: 'Calculated Term (D)', value: formatNum(d, 4) }
      ],
      steps: [
        type === 'direct'
          ? `Direct formula: A/B = C/D => D = (B × C) / A`
          : `Inverse formula: A × B = C × D => D = (A × B) / C`,
        type === 'direct'
          ? `(${b} × ${c}) / ${a} = ${formatNum(d, 4)}`
          : `(${a} × ${b}) / ${c} = ${formatNum(d, 4)}`
      ]
    };
  },

  'random-number-generator': (inputs) => {
    const min = Math.round(toNum(inputs.min, 1));
    const max = Math.round(toNum(inputs.max, 100));
    const count = Math.min(Math.max(Math.round(toNum(inputs.count, 5)), 1), 100);
    const unique = inputs.unique === 'yes';

    if (min >= max) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Minimum must be strictly less than Maximum.' };
    }

    if (unique && (max - min + 1) < count) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: `Range [${min}, ${max}] has fewer than ${count} unique integers.` };
    }

    const results = [];
    const pool = new Set();

    while (results.length < count) {
      const rand = Math.floor(Math.random() * (max - min + 1)) + min;
      if (unique) {
        if (!pool.has(rand)) {
          pool.add(rand);
          results.push(rand);
        }
      } else {
        results.push(rand);
      }
    }

    return {
      primaryValue: results.join(', '),
      primaryLabel: `${count} Random Numbers [${min} - ${max}]`,
      subtext: `Generated ${unique ? 'unique' : 'standard'} pseudo-random integers`,
      breakdown: [
        { label: 'Lower Bound (Min)', value: `${min}` },
        { label: 'Upper Bound (Max)', value: `${max}` },
        { label: 'Sample Count', value: `${count}` },
        { label: 'Uniqueness', value: unique ? 'No Duplicates' : 'Duplicates Allowed' }
      ],
      steps: [
        `Configured interval: [${min}, ${max}]`,
        `Generated ${count} random numbers`,
        `List: ${results.join(', ')}`
      ]
    };
  },

  'number-sequence-calculator': (inputs) => {
    const type = inputs.type || 'arithmetic';
    const a1 = toNum(inputs.firstTerm, 3);
    const d = toNum(inputs.diffOrRatio, 4);
    const n = Math.min(Math.max(Math.round(toNum(inputs.terms, 10)), 1), 50);

    const seq = [];
    let sum = 0;

    for (let i = 0; i < n; i++) {
      let term = 0;
      if (type === 'arithmetic') {
        term = a1 + i * d;
      } else {
        term = a1 * Math.pow(d, i);
      }
      seq.push(term);
      sum += term;
    }

    const nthTerm = seq[n - 1];

    return {
      primaryValue: formatNum(nthTerm, 4),
      primaryLabel: `Term a_${n} (${type})`,
      subtext: `Sum of first ${n} terms: ${formatNum(sum, 2)}`,
      breakdown: [
        { label: 'Sequence Type', value: type === 'arithmetic' ? 'Arithmetic Progression (AP)' : 'Geometric Progression (GP)' },
        { label: 'Initial Term (a₁)', value: formatNum(a1) },
        { label: type === 'arithmetic' ? 'Common Difference (d)' : 'Common Ratio (r)', value: formatNum(d) },
        { label: `Nth Term (a_${n})`, value: formatNum(nthTerm, 4) },
        { label: `Sum of ${n} terms (S_${n})`, value: formatNum(sum, 4) }
      ],
      steps: [
        type === 'arithmetic'
          ? `Nth term formula: a_n = a₁ + (n - 1)d = ${a1} + (${n} - 1) × ${d} = ${formatNum(nthTerm, 4)}`
          : `Nth term formula: a_n = a₁ × r^(n - 1) = ${a1} × (${d})^${n - 1} = ${formatNum(nthTerm, 4)}`,
        `Sum formula computed: S_${n} = ${formatNum(sum, 4)}`,
        `First terms: ${seq.slice(0, 6).map((x) => formatNum(x)).join(', ')}${n > 6 ? '...' : ''}`
      ]
    };
  }
};

module.exports = engines;


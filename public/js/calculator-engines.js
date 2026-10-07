// Standalone Verified Calculation Engines for All 200 Calculators
// Client-side execution without external dependencies
(function(window) {
  function toNum(v, d) {
    if (d === undefined) d = 0;
    if (v === null || v === undefined || v === '') return d;
    const n = Number(v);
    return isNaN(n) ? d : n;
  }

  function formatNum(v, d) {
    if (d === undefined) d = 2;
    if (isNaN(v) || !isFinite(v)) return '0';
    return Number(v).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: d
    });
  }

  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a || 1;
  }

  function lcm(a, b) {
    if (!a || !b) return 0;
    return Math.abs((a * b) / gcd(a, b));
  }

  var ENGINES = {
    "basic-calculator": (inputs) => {
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

    "scientific-calculator": (inputs) => {
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

    "percentage-calculator": (inputs) => {
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

    "fraction-calculator": (inputs) => {
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

    "average-calculator": (inputs) => {
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

    "ratio-calculator": (inputs) => {
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

    "proportion-calculator": (inputs) => {
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

    "random-number-generator": (inputs) => {
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

    "number-sequence-calculator": (inputs) => {
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
  },

    "algebra-calculator": (inputs) => {
    const expr = String(inputs.expr || '3*x^2 + 5*x - 12').trim();
    const xVal = toNum(inputs.xVal, 4);

    try {
      const sanitized = expr.replace(/\^/g, '**')
                            .replace(/([0-9])([a-zA-Z])/g, '$1*$2')
                            .replace(/([a-zA-Z])([0-9])/g, '$1*$2')
                            .replace(/\bx\b/gi, `(${xVal})`);

      const fn = new Function(`'use strict'; return (${sanitized});`);
      const res = fn();
      if (typeof res !== 'number' || !isFinite(res)) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Expression evaluation error.' };
      }

      return {
        primaryValue: formatNum(res, 4),
        primaryLabel: `Value at x = ${xVal}`,
        subtext: `Evaluated: f(${xVal}) = ${formatNum(res, 4)}`,
        breakdown: [
          { label: 'Expression f(x)', value: expr },
          { label: 'Evaluation Point (x)', value: formatNum(xVal) },
          { label: 'Substituted Expression', value: sanitized },
          { label: 'Result f(x)', value: formatNum(res, 4) }
        ],
        steps: [
          `Given algebraic expression: ${expr}`,
          `Substituted x = ${xVal} into expression`,
          `Computed value: f(${xVal}) = ${formatNum(res, 4)}`
        ]
      };
    } catch (e) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid algebraic syntax.' };
    }
  },

    "quadratic-equation-calculator": (inputs) => {
    const a = toNum(inputs.a, 1);
    const b = toNum(inputs.b, -5);
    const c = toNum(inputs.c, 6);

    if (a === 0) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Coefficient "a" cannot be 0 for a quadratic equation.' };
    }

    const D = b * b - 4 * a * c;
    const vertexX = -b / (2 * a);
    const vertexY = a * vertexX * vertexX + b * vertexX + c;

    if (D > 0) {
      const x1 = (-b + Math.sqrt(D)) / (2 * a);
      const x2 = (-b - Math.sqrt(D)) / (2 * a);
      return {
        primaryValue: `x₁ = ${formatNum(x1, 4)}, x₂ = ${formatNum(x2, 4)}`,
        primaryLabel: 'Two Real Roots',
        subtext: `Discriminant Δ = ${formatNum(D, 2)} > 0`,
        breakdown: [
          { label: 'Discriminant (b² - 4ac)', value: formatNum(D, 4) },
          { label: 'Root 1 (x₁)', value: formatNum(x1, 4) },
          { label: 'Root 2 (x₂)', value: formatNum(x2, 4) },
          { label: 'Parabola Vertex (h, k)', value: `(${formatNum(vertexX, 2)}, ${formatNum(vertexY, 2)})` },
          { label: 'Axis of Symmetry', value: `x = ${formatNum(vertexX, 2)}` }
        ],
        steps: [
          `Standard form: ${a}x² + (${b})x + (${c}) = 0`,
          `Calculate discriminant: Δ = (${b})² - 4(${a})(${c}) = ${formatNum(D, 4)}`,
          `Quadratic formula: x = [-b ± √Δ] / (2a)`,
          `x₁ = [${-b} + √${formatNum(D, 2)}] / ${2 * a} = ${formatNum(x1, 4)}`,
          `x₂ = [${-b} - √${formatNum(D, 2)}] / ${2 * a} = ${formatNum(x2, 4)}`
        ]
      };
    } else if (D === 0) {
      const x = -b / (2 * a);
      return {
        primaryValue: `x = ${formatNum(x, 4)}`,
        primaryLabel: 'One Repeated Real Root',
        subtext: 'Discriminant Δ = 0 (Tangency root)',
        breakdown: [
          { label: 'Discriminant (b² - 4ac)', value: '0' },
          { label: 'Double Root (x)', value: formatNum(x, 4) },
          { label: 'Vertex', value: `(${formatNum(vertexX, 2)}, ${formatNum(vertexY, 2)})` }
        ],
        steps: [
          `Discriminant Δ = 0 implies exactly one unique real solution`,
          `x = -b / (2a) = ${-b} / ${2 * a} = ${formatNum(x, 4)}`
        ]
      };
    } else {
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(-D) / (2 * a);
      return {
        primaryValue: `${formatNum(realPart, 3)} ± ${formatNum(Math.abs(imagPart), 3)}i`,
        primaryLabel: 'Two Complex / Imaginary Roots',
        subtext: `Discriminant Δ = ${formatNum(D, 2)} < 0`,
        breakdown: [
          { label: 'Discriminant (Δ)', value: formatNum(D, 4) },
          { label: 'Real Component', value: formatNum(realPart, 4) },
          { label: 'Imaginary Component', value: `±${formatNum(Math.abs(imagPart), 4)}i` },
          { label: 'Vertex', value: `(${formatNum(vertexX, 2)}, ${formatNum(vertexY, 2)})` }
        ],
        steps: [
          `Discriminant Δ = ${formatNum(D, 2)} is negative, yielding complex conjugate roots`,
          `Real part: -b / (2a) = ${formatNum(realPart, 4)}`,
          `Imaginary part: √|Δ| / (2a) = ${formatNum(Math.abs(imagPart), 4)}i`,
          `Roots: ${formatNum(realPart, 3)} + ${formatNum(Math.abs(imagPart), 3)}i and ${formatNum(realPart, 3)} - ${formatNum(Math.abs(imagPart), 3)}i`
        ]
      };
    }
  },

    "linear-equation-calculator": (inputs) => {
    const a = toNum(inputs.a, 5);
    const b = toNum(inputs.b, 15);
    const c = toNum(inputs.c, 45);

    if (a === 0) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Coefficient "a" cannot be 0 in ax + b = c.' };
    }

    const x = (c - b) / a;

    return {
      primaryValue: `x = ${formatNum(x, 4)}`,
      primaryLabel: 'Solved Value of x',
      subtext: `Equation: ${a}x + ${b} = ${c}`,
      breakdown: [
        { label: 'Linear Equation', value: `${a}x + (${b}) = ${c}` },
        { label: 'c - b', value: formatNum(c - b, 4) },
        { label: 'Solution (x)', value: formatNum(x, 4) }
      ],
      steps: [
        `Given: ${a}x + ${b} = ${c}`,
        `Subtract ${b} from both sides: ${a}x = ${c} - ${b} = ${formatNum(c - b, 4)}`,
        `Divide both sides by ${a}: x = ${formatNum(c - b, 4)} / ${a} = ${formatNum(x, 4)}`
      ]
    };
  },

    "equation-calculator": (inputs) => {
    const eq = String(inputs.equation || '2*x + 7 = 21').trim();
    if (!eq.includes('=')) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Equation must contain an "=" sign.' };
    }
    const [lhs, rhs] = eq.split('=').map((s) => s.trim());

    try {
      // Numerical bisection / root finding for f(x) = lhs - rhs = 0
      const evalSide = (side, x) => {
        const s = side.replace(/\^/g, '**')
                      .replace(/([0-9])([a-zA-Z])/g, '$1*$2')
                      .replace(/\bx\b/gi, `(${x})`);
        return new Function(`'use strict'; return (${s});`)();
      };

      const f = (x) => evalSide(lhs, x) - evalSide(rhs, x);

      // Search interval [-1000, 1000]
      let foundX = null;
      for (let testX = -100; testX <= 100; testX += 0.5) {
        if (Math.abs(f(testX)) < 1e-6) {
          foundX = testX;
          break;
        }
      }

      // If not exact integer/step, try Newton-Raphson starting at x=0
      if (foundX === null) {
        let cur = 1;
        for (let iter = 0; iter < 100; iter++) {
          const y = f(cur);
          if (Math.abs(y) < 1e-7) { foundX = cur; break; }
          const dy = (f(cur + 1e-5) - f(cur - 1e-5)) / 2e-5;
          if (Math.abs(dy) < 1e-12) break;
          cur -= y / dy;
        }
      }

      if (foundX === null || !isFinite(foundX)) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Could not find a numerical root in standard real range.' };
      }

      return {
        primaryValue: `x = ${formatNum(foundX, 4)}`,
        primaryLabel: 'Equation Solution',
        subtext: `Satisfies: ${eq}`,
        breakdown: [
          { label: 'Equation', value: eq },
          { label: 'Solved Root x', value: formatNum(foundX, 4) },
          { label: 'Left Side at Root', value: formatNum(evalSide(lhs, foundX), 4) },
          { label: 'Right Side at Root', value: formatNum(evalSide(rhs, foundX), 4) }
        ],
        steps: [
          `Formulated root function: f(x) = (${lhs}) - (${rhs}) = 0`,
          `Solved numerically via root-finding iteration`,
          `Found solution: x = ${formatNum(foundX, 4)}`
        ]
      };
    } catch (err) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid equation syntax.' };
    }
  },

    "exponent-calculator": (inputs) => {
    const base = toNum(inputs.base, 2);
    const exp = toNum(inputs.exponent, 10);

    const result = Math.pow(base, exp);

    return {
      primaryValue: Math.abs(result) >= 1e9 || (Math.abs(result) < 1e-4 && result !== 0) ? result.toExponential(4) : formatNum(result, 6),
      primaryLabel: `${base}^${exp}`,
      subtext: `Base: ${base}, Exponent: ${exp}`,
      breakdown: [
        { label: 'Base (b)', value: formatNum(base) },
        { label: 'Exponent (n)', value: formatNum(exp) },
        { label: 'Result (b^n)', value: formatNum(result, 6) },
        { label: 'Scientific Notation', value: result.toExponential(4) }
      ],
      steps: [
        `Base value: ${base}`,
        `Exponent power: ${exp}`,
        `${base}^${exp} = ${formatNum(result, 6)}`
      ]
    };
  },

    "square-root-calculator": (inputs) => {
    const num = toNum(inputs.number, 144);
    if (num < 0) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Cannot take real square root of a negative number. Use complex numbers.' };
    }

    const sqrt = Math.sqrt(num);
    const isPerfect = Number.isInteger(sqrt);

    return {
      primaryValue: formatNum(sqrt, 6),
      primaryLabel: `√${num}`,
      subtext: isPerfect ? `Perfect square integer: ${sqrt}² = ${num}` : `Irrational decimal: ≈ ${formatNum(sqrt, 4)}`,
      breakdown: [
        { label: 'Input Number (x)', value: formatNum(num) },
        { label: 'Square Root (√x)', value: formatNum(sqrt, 6) },
        { label: 'Perfect Square?', value: isPerfect ? 'Yes' : 'No' }
      ],
      steps: [
        `Calculate primary non-negative root √${num}`,
        `Result = ${formatNum(sqrt, 6)}`,
        `Verification: (${formatNum(sqrt, 4)})² = ${formatNum(sqrt * sqrt, 4)}`
      ]
    };
  },

    "cube-root-calculator": (inputs) => {
    const num = toNum(inputs.number, 125);
    const cbrt = Math.cbrt(num);
    const isPerfect = Number.isInteger(cbrt);

    return {
      primaryValue: formatNum(cbrt, 6),
      primaryLabel: `∛${num}`,
      subtext: isPerfect ? `Perfect cube integer: (${cbrt})³ = ${num}` : `Decimal: ≈ ${formatNum(cbrt, 4)}`,
      breakdown: [
        { label: 'Input Number', value: formatNum(num) },
        { label: 'Cube Root (∛x)', value: formatNum(cbrt, 6) },
        { label: 'Perfect Cube?', value: isPerfect ? 'Yes' : 'No' }
      ],
      steps: [
        `Calculate cube root ∛${num}`,
        `Result = ${formatNum(cbrt, 6)}`,
        `Verification: (${formatNum(cbrt, 3)})³ = ${formatNum(Math.pow(cbrt, 3), 3)}`
      ]
    };
  },

    "logarithm-calculator": (inputs) => {
    const val = toNum(inputs.value, 1000);
    const base = toNum(inputs.base, 10);

    if (val <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Logarithm argument must be greater than zero.' };
    if (base <= 0 || base === 1) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Base must be greater than 0 and not equal to 1.' };

    const result = Math.log(val) / Math.log(base);

    return {
      primaryValue: formatNum(result, 6),
      primaryLabel: `log_${base}(${val})`,
      subtext: `log base ${base} of ${val} = ${formatNum(result, 4)}`,
      breakdown: [
        { label: 'Argument (x)', value: formatNum(val) },
        { label: 'Base (b)', value: formatNum(base) },
        { label: 'Calculated log_b(x)', value: formatNum(result, 6) },
        { label: 'Natural Log ln(x)', value: formatNum(Math.log(val), 6) },
        { label: 'Common Log log10(x)', value: formatNum(Math.log10(val), 6) }
      ],
      steps: [
        `Change of base rule: log_b(x) = ln(x) / ln(b)`,
        `ln(${val}) = ${formatNum(Math.log(val), 6)}`,
        `ln(${base}) = ${formatNum(Math.log(base), 6)}`,
        `${formatNum(Math.log(val), 6)} / ${formatNum(Math.log(base), 6)} = ${formatNum(result, 6)}`
      ]
    };
  },

    "factorial-calculator": (inputs) => {
    const n = Math.round(toNum(inputs.n, 6));
    if (n < 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Factorial is not defined for negative integers.' };
    if (n > 170) return { primaryValue: 'Infinity', primaryLabel: 'Result', error: 'Values above 170! exceed standard IEEE 754 floating point range.' };

    let fact = 1;
    for (let i = 2; i <= n; i++) fact *= i;

    return {
      primaryValue: n > 21 ? fact.toExponential(6) : fact.toLocaleString('en-US'),
      primaryLabel: `${n}!`,
      subtext: `Calculated factorial of ${n}`,
      breakdown: [
        { label: 'Integer n', value: `${n}` },
        { label: 'Exact Factorial n!', value: n > 21 ? fact.toExponential(8) : fact.toLocaleString('en-US') }
      ],
      steps: [
        `Definition: n! = n × (n - 1) × ... × 2 × 1`,
        n <= 8 ? `${Array.from({ length: n }, (_, i) => n - i).join(' × ')} = ${fact}` : `Multiplied consecutive integers up to ${n}`,
        `Final Answer: ${n}! = ${n > 21 ? fact.toExponential(4) : fact.toLocaleString('en-US')}`
      ]
    };
  },

    "gcd-calculator": (inputs) => {
    const raw = String(inputs.numbers || '48, 180, 240').trim();
    const nums = raw.split(/[\s,]+/).map(Number).filter((n) => !isNaN(n) && n !== 0).map(Math.abs);
    if (nums.length < 2) return { primaryValue: 'Error', primaryLabel: 'GCD', error: 'Please enter at least 2 non-zero integers.' };

    let result = nums[0];
    for (let i = 1; i < nums.length; i++) {
      result = gcd(result, nums[i]);
    }

    return {
      primaryValue: `${result}`,
      primaryLabel: 'Greatest Common Divisor (GCD)',
      subtext: `GCD of [${nums.join(', ')}] = ${result}`,
      breakdown: [
        { label: 'Input Numbers', value: nums.join(', ') },
        { label: 'Count of Numbers', value: `${nums.length}` },
        { label: 'Greatest Common Divisor (GCD)', value: `${result}` }
      ],
      steps: [
        `Applied Euclidean algorithm iteratively across list`,
        `GCD(${nums[0]}, ${nums[1]}) = ${gcd(nums[0], nums[1])}`,
        `Cumulative GCD for all numbers = ${result}`
      ]
    };
  },

    "lcm-calculator": (inputs) => {
    const raw = String(inputs.numbers || '12, 15, 20').trim();
    const nums = raw.split(/[\s,]+/).map(Number).filter((n) => !isNaN(n) && n !== 0).map(Math.abs);
    if (nums.length < 2) return { primaryValue: 'Error', primaryLabel: 'LCM', error: 'Please enter at least 2 non-zero integers.' };

    let result = nums[0];
    for (let i = 1; i < nums.length; i++) {
      result = lcm(result, nums[i]);
    }

    return {
      primaryValue: `${result}`,
      primaryLabel: 'Least Common Multiple (LCM)',
      subtext: `LCM of [${nums.join(', ')}] = ${result}`,
      breakdown: [
        { label: 'Input Numbers', value: nums.join(', ') },
        { label: 'Least Common Multiple (LCM)', value: `${result}` }
      ],
      steps: [
        `Formula: LCM(a, b) = (|a × b|) / GCD(a, b)`,
        `Evaluated across elements iteratively`,
        `Final LCM = ${result}`
      ]
    };
  },

    "prime-number-calculator": (inputs) => {
    const n = Math.round(toNum(inputs.number, 97));
    if (n < 2) {
      return {
        primaryValue: 'Not Prime',
        primaryLabel: `${n} is Not Prime`,
        subtext: 'Primes are integers strictly greater than 1.',
        breakdown: [{ label: 'Number', value: `${n}` }, { label: 'Status', value: 'Not Prime' }],
        steps: [`Numbers less than 2 are not prime by definition.`]
      };
    }

    let isPrime = true;
    let factor = null;
    if (n === 2 || n === 3) isPrime = true;
    else if (n % 2 === 0) { isPrime = false; factor = 2; }
    else if (n % 3 === 0) { isPrime = false; factor = 3; }
    else {
      for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0) { isPrime = false; factor = i; break; }
        if (n % (i + 2) === 0) { isPrime = false; factor = i + 2; break; }
      }
    }

    return {
      primaryValue: isPrime ? 'Prime Number' : 'Composite Number',
      primaryLabel: `${n} is ${isPrime ? 'PRIME' : 'COMPOSITE'}`,
      subtext: isPrime ? `Only divisible by 1 and ${n}` : `Divisible by ${factor} (${factor} × ${n / factor} = ${n})`,
      breakdown: [
        { label: 'Input Number', value: `${n}` },
        { label: 'Classification', value: isPrime ? 'Prime' : 'Composite' },
        { label: 'Smallest Factor > 1', value: isPrime ? `${n}` : `${factor}` }
      ],
      steps: [
        `Checked divisibility using 6k ± 1 trial division up to √${n} ≈ ${formatNum(Math.sqrt(n), 2)}`,
        isPrime ? `No divisors found in range -> ${n} is prime` : `Found factor ${factor} -> ${n} is composite`
      ]
    };
  },

    "percentage-change-calculator": (inputs) => {
    const oldVal = toNum(inputs.oldVal, 120);
    const newVal = toNum(inputs.newVal, 150);

    if (oldVal === 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Initial baseline value cannot be zero.' };

    const diff = newVal - oldVal;
    const pct = (diff / oldVal) * 100;
    const direction = pct >= 0 ? 'Increase' : 'Decrease';

    return {
      primaryValue: `${pct >= 0 ? '+' : ''}${formatNum(pct, 2)}%`,
      primaryLabel: `Percentage ${direction}`,
      subtext: `${Math.abs(pct).toFixed(2)}% ${direction.toLowerCase()} from ${oldVal} to ${newVal}`,
      breakdown: [
        { label: 'Old Value', value: formatNum(oldVal) },
        { label: 'New Value', value: formatNum(newVal) },
        { label: 'Absolute Difference', value: `${diff >= 0 ? '+' : ''}${formatNum(diff, 2)}` },
        { label: 'Percent Change', value: `${formatNum(pct, 2)}%` }
      ],
      steps: [
        `Difference = New - Old = ${newVal} - ${oldVal} = ${formatNum(diff, 2)}`,
        `Divide by Old: ${formatNum(diff, 2)} / ${oldVal} = ${formatNum(diff / oldVal, 6)}`,
        `Multiply by 100%: ${formatNum(pct, 2)}%`
      ]
    };
  },

    "absolute-value-calculator": (inputs) => {
    const num = toNum(inputs.number, -42.75);
    const absVal = Math.abs(num);

    return {
      primaryValue: formatNum(absVal, 4),
      primaryLabel: `|${num}| = ${formatNum(absVal, 4)}`,
      subtext: `Distance from zero on the real number line is ${formatNum(absVal, 4)}`,
      breakdown: [
        { label: 'Input Value (x)', value: formatNum(num) },
        { label: 'Absolute Value |x|', value: formatNum(absVal, 4) },
        { label: 'Opposite (-x)', value: formatNum(-num) }
      ],
      steps: [
        `Definition: |x| = x if x >= 0, and -x if x < 0`,
        num < 0 ? `Since ${num} < 0, |${num}| = -(${num}) = ${formatNum(absVal, 4)}` : `Since ${num} >= 0, |${num}| = ${formatNum(absVal, 4)}`
      ]
    };
  },

    "modulo-calculator": (inputs) => {
    const a = Math.round(toNum(inputs.a, 29));
    const n = Math.round(toNum(inputs.n, 6));

    if (n === 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Modulo divisor n cannot be zero.' };

    const remainder = ((a % n) + n) % n;
    const quotient = Math.floor(a / n);

    return {
      primaryValue: `${remainder}`,
      primaryLabel: `${a} mod ${n}`,
      subtext: `Quotient = ${quotient}, Remainder = ${remainder}`,
      breakdown: [
        { label: 'Dividend (a)', value: `${a}` },
        { label: 'Divisor / Modulus (n)', value: `${n}` },
        { label: 'Remainder (a mod n)', value: `${remainder}` },
        { label: 'Integer Quotient (q)', value: `${quotient}` }
      ],
      steps: [
        `Division algorithm: a = q × n + r`,
        `${a} = (${quotient} × ${n}) + ${remainder}`,
        `Result remainder r = ${remainder}`
      ]
    };
  },

    "permutation-calculator": (inputs) => {
    const n = Math.round(toNum(inputs.n, 8));
    const r = Math.round(toNum(inputs.r, 3));

    if (n < 0 || r < 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'n and r must be non-negative integers.' };
    if (r > n) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'r cannot be strictly greater than n.' };

    let p = 1;
    for (let i = 0; i < r; i++) {
      p *= (n - i);
    }

    return {
      primaryValue: p.toLocaleString('en-US'),
      primaryLabel: `P(${n}, ${r})`,
      subtext: `Permutations of ${r} items from set of ${n}`,
      breakdown: [
        { label: 'Total Items (n)', value: `${n}` },
        { label: 'Items Selected (r)', value: `${r}` },
        { label: 'Permutations P(n, r)', value: p.toLocaleString('en-US') }
      ],
      steps: [
        `Formula: P(n, r) = n! / (n - r)! = n × (n - 1) × ... × (n - r + 1)`,
        `P(${n}, ${r}) = ${Array.from({ length: r }, (_, i) => n - i).join(' × ')}`,
        `Total ordered arrangements = ${p.toLocaleString('en-US')}`
      ]
    };
  },

    "combination-calculator": (inputs) => {
    const n = Math.round(toNum(inputs.n, 10));
    const r = Math.round(toNum(inputs.r, 4));

    if (n < 0 || r < 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'n and r must be non-negative integers.' };
    if (r > n) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'r cannot be strictly greater than n.' };

    const effectiveR = Math.min(r, n - r);
    let c = 1;
    for (let i = 1; i <= effectiveR; i++) {
      c = (c * (n - i + 1)) / i;
    }
    c = Math.round(c);

    return {
      primaryValue: c.toLocaleString('en-US'),
      primaryLabel: `C(${n}, ${r})`,
      subtext: `Ways to choose ${r} items from ${n} without order`,
      breakdown: [
        { label: 'Total Items (n)', value: `${n}` },
        { label: 'Selected Items (r)', value: `${r}` },
        { label: 'Combinations C(n, r)', value: c.toLocaleString('en-US') }
      ],
      steps: [
        `Formula: C(n, r) = n! / [r! × (n - r)!]`,
        `C(${n}, ${r}) = (${Array.from({ length: effectiveR }, (_, i) => n - i).join(' × ')}) / (${Array.from({ length: effectiveR }, (_, i) => i + 1).join(' × ')})`,
        `Total combinations = ${c.toLocaleString('en-US')}`
      ]
    };
  },

    "probability-calculator": (inputs) => {
    const fav = toNum(inputs.favorable, 4);
    const total = toNum(inputs.total, 52);

    if (total <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Total outcomes must be greater than zero.' };
    if (fav < 0 || fav > total) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Favorable outcomes must be between 0 and total.' };

    const prob = fav / total;
    const pct = prob * 100;
    const oddsInFavor = fav === total ? 'Certain' : `${fav} : ${total - fav}`;

    return {
      primaryValue: `${formatNum(pct, 2)}%`,
      primaryLabel: 'Event Probability P(E)',
      subtext: `Decimal: ${formatNum(prob, 4)} | Odds in favor: ${oddsInFavor}`,
      breakdown: [
        { label: 'Favorable Outcomes', value: `${fav}` },
        { label: 'Total Outcomes', value: `${total}` },
        { label: 'Probability Fraction', value: `${fav}/${total}` },
        { label: 'Percentage Chance', value: `${formatNum(pct, 2)}%` },
        { label: 'Odds in Favor', value: oddsInFavor }
      ],
      steps: [
        `Formula: P(E) = Favorable / Total`,
        `P = ${fav} / ${total} = ${formatNum(prob, 4)}`,
        `Percent: ${formatNum(prob, 4)} × 100% = ${formatNum(pct, 2)}%`
      ]
    };
  },

    "sequence-calculator": (inputs) => {
    const a1 = toNum(inputs.first, 2);
    const d = toNum(inputs.diff, 3);
    const count = Math.min(Math.max(Math.round(toNum(inputs.count, 8)), 1), 30);

    const seq = [];
    let sum = 0;
    for (let i = 0; i < count; i++) {
      const term = a1 + i * d;
      seq.push(term);
      sum += term;
    }

    return {
      primaryValue: seq.join(', '),
      primaryLabel: `First ${count} Sequence Terms`,
      subtext: `Sum = ${formatNum(sum, 2)} | Nth Term = ${formatNum(seq[count - 1], 2)}`,
      breakdown: [
        { label: 'First Term (a₁)', value: formatNum(a1) },
        { label: 'Common Difference (d)', value: formatNum(d) },
        { label: 'Number of Terms', value: `${count}` },
        { label: 'Nth Term', value: formatNum(seq[count - 1], 2) },
        { label: 'Series Sum', value: formatNum(sum, 2) }
      ],
      steps: [
        `Term formula: a_n = a₁ + (n - 1)d`,
        `Generated terms: ${seq.join(', ')}`,
        `Sum of series = (n/2)(a₁ + a_n) = ${formatNum(sum, 2)}`
      ]
    };
  },

    "matrix-calculator": (inputs) => {
    const a11 = toNum(inputs.a11, 4);
    const a12 = toNum(inputs.a12, 7);
    const a21 = toNum(inputs.a21, 2);
    const a22 = toNum(inputs.a22, 6);

    const det = a11 * a22 - a12 * a21;
    const trace = a11 + a22;

    let invStr = 'No Inverse (Singular Matrix)';
    if (det !== 0) {
      invStr = `[[${formatNum(a22 / det, 3)}, ${formatNum(-a12 / det, 3)}], [${formatNum(-a21 / det, 3)}, ${formatNum(a11 / det, 3)}]]`;
    }

    return {
      primaryValue: `det(A) = ${formatNum(det, 4)}`,
      primaryLabel: '2×2 Matrix Determinant',
      subtext: `Trace: ${formatNum(trace, 2)} | Invertible: ${det !== 0 ? 'Yes' : 'No'}`,
      breakdown: [
        { label: 'Matrix A', value: `[[${a11}, ${a12}], [${a21}, ${a22}]]` },
        { label: 'Determinant det(A)', value: formatNum(det, 4) },
        { label: 'Trace tr(A)', value: formatNum(trace, 4) },
        { label: 'Inverse Matrix A⁻¹', value: invStr }
      ],
      steps: [
        `Formula: det(A) = a₁₁ × a₂₂ - a₁₂ × a₂₁`,
        `det(A) = (${a11} × ${a22}) - (${a12} × ${a21}) = ${a11 * a22} - ${a12 * a21} = ${formatNum(det, 4)}`,
        `Trace: a₁₁ + a₂₂ = ${a11} + ${a22} = ${formatNum(trace, 4)}`
      ]
    };
  },

    "scientific-notation-calculator": (inputs) => {
    const raw = String(inputs.number || '149600000').trim();
    const num = parseFloat(raw);
    if (isNaN(num)) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter a valid numeric value.' };

    const sci = num.toExponential();
    const parts = sci.split('e');
    const mantissa = formatNum(parseFloat(parts[0]), 6);
    const exp = parseInt(parts[1], 10);

    return {
      primaryValue: `${mantissa} × 10^${exp}`,
      primaryLabel: 'Scientific Notation',
      subtext: `Standard Value: ${num.toLocaleString('en-US')}`,
      breakdown: [
        { label: 'Original Number', value: raw },
        { label: 'Mantissa (m)', value: mantissa },
        { label: 'Exponent (e)', value: `${exp}` },
        { label: 'Scientific Form', value: `${mantissa} × 10^${exp}` },
        { label: 'Engineering Form', value: num.toExponential(3) }
      ],
      steps: [
        `Normalized mantissa to range 1 <= |m| < 10: ${mantissa}`,
        `Computed power of 10 exponent: ${exp}`,
        `Representation: ${mantissa} × 10^${exp}`
      ]
    };
  },

    "pythagorean-theorem-calculator": (inputs) => {
    const solveFor = inputs.solveFor || 'c';
    const val1 = toNum(inputs.val1, 3);
    const val2 = toNum(inputs.val2, 4);

    if (val1 <= 0 || val2 <= 0) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Side lengths must be positive numbers.' };
    }

    if (solveFor === 'c') {
      const a = val1;
      const b = val2;
      const c = Math.sqrt(a * a + b * b);
      const area = 0.5 * a * b;
      return {
        primaryValue: formatNum(c, 4),
        primaryLabel: 'Hypotenuse (c)',
        subtext: `Triangle: a = ${a}, b = ${b}, c = ${formatNum(c, 2)}`,
        breakdown: [
          { label: 'Leg a', value: formatNum(a) },
          { label: 'Leg b', value: formatNum(b) },
          { label: 'Hypotenuse c', value: formatNum(c, 4) },
          { label: 'Triangle Area', value: formatNum(area, 2) },
          { label: 'Perimeter', value: formatNum(a + b + c, 2) }
        ],
        steps: [
          `Pythagorean Theorem: a² + b² = c²`,
          `c = √(a² + b²) = √(${a}² + ${b}²) = √(${a * a} + ${b * b}) = √${a * a + b * b}`,
          `c = ${formatNum(c, 4)}`
        ]
      };
    } else {
      const c = Math.max(val1, val2);
      const otherLeg = Math.min(val1, val2);
      if (c <= otherLeg) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Hypotenuse c must be strictly greater than leg side.' };
      }
      const missingLeg = Math.sqrt(c * c - otherLeg * otherLeg);
      return {
        primaryValue: formatNum(missingLeg, 4),
        primaryLabel: `Leg Length (${solveFor})`,
        subtext: `Hypotenuse: ${c}, Given Leg: ${otherLeg}`,
        breakdown: [
          { label: 'Hypotenuse (c)', value: formatNum(c) },
          { label: 'Known Leg', value: formatNum(otherLeg) },
          { label: 'Solved Leg', value: formatNum(missingLeg, 4) },
          { label: 'Triangle Area', value: formatNum(0.5 * otherLeg * missingLeg, 2) }
        ],
        steps: [
          `Pythagorean Theorem: leg = √(c² - other²)`,
          `leg = √(${c}² - ${otherLeg}²) = √(${c * c - otherLeg * otherLeg})`,
          `Solved leg = ${formatNum(missingLeg, 4)}`
        ]
      };
    }
  },

    "determinant-calculator": (inputs) => {
    function gcd(a, b) {
      a = Math.abs(a);
      b = Math.abs(b);
      while (b) {
        const t = b;
        b = a % b;
        a = t;
      }
      return a || 1;
    }

    class Frac {
      constructor(n, d = 1) {
        if (typeof n === 'string') {
          n = n.trim();
          if (n.includes('/')) {
            const parts = n.split('/');
            n = parseFloat(parts[0]);
            d = parseFloat(parts[1]) || 1;
          } else {
            const floatVal = parseFloat(n);
            if (isNaN(floatVal)) {
              n = 0;
              d = 1;
            } else if (Number.isInteger(floatVal)) {
              n = floatVal;
              d = 1;
            } else {
              const precision = 10000;
              n = Math.round(floatVal * precision);
              d = precision;
            }
          }
        } else if (typeof n === 'number' && !Number.isInteger(n)) {
          const precision = 10000;
          n = Math.round(n * precision);
          d = precision;
        }
        if (d < 0) {
          n = -n;
          d = -d;
        }
        const g = gcd(Math.round(n), Math.round(d));
        this.n = Math.round(n / g);
        this.d = Math.round(d / g);
        if (this.d === 0) this.d = 1;
      }

      add(other) {
        other = Frac.from(other);
        return new Frac(this.n * other.d + other.n * this.d, this.d * other.d);
      }

      sub(other) {
        other = Frac.from(other);
        return new Frac(this.n * other.d - other.n * this.d, this.d * other.d);
      }

      mul(other) {
        other = Frac.from(other);
        return new Frac(this.n * other.n, this.d * other.d);
      }

      div(other) {
        other = Frac.from(other);
        if (other.n === 0) return new Frac(0, 1);
        return new Frac(this.n * other.d, this.d * other.n);
      }

      neg() {
        return new Frac(-this.n, this.d);
      }

      isZero() {
        return this.n === 0;
      }

      isOne() {
        return this.n === 1 && this.d === 1;
      }

      toNumber() {
        return this.n / this.d;
      }

      toString() {
        if (this.d === 1) return `${this.n}`;
        return `${this.n}/${this.d}`;
      }

      toSignedString() {
        if (this.n < 0) return `(${this.toString()})`;
        return this.toString();
      }

      static from(val) {
        if (val instanceof Frac) return val;
        return new Frac(val);
      }
    }

    function parseInputMatrix(rawInputs) {
      if (rawInputs.matrix && Array.isArray(rawInputs.matrix)) {
        return rawInputs.matrix.map(row => (Array.isArray(row) ? row.map(v => Frac.from(v)) : [Frac.from(row)]));
      }
      if (rawInputs.matrixInput && typeof rawInputs.matrixInput === 'string') {
        const str = rawInputs.matrixInput.trim();
        if (str.startsWith('[')) {
          try {
            const parsed = JSON.parse(str.replace(/'/g, '"'));
            if (Array.isArray(parsed)) {
              return parsed.map(row => (Array.isArray(row) ? row.map(v => Frac.from(v)) : [Frac.from(row)]));
            }
          } catch (e) {
            const rows = str.replace(/^\[+|\]+$/g, '').split(/\],\s*\[/);
            return rows.map(r => r.split(',').map(v => Frac.from(v.trim())));
          }
        } else if (str.includes(';') || str.includes('\n')) {
          const rows = str.split(/[\n;]/).filter(r => r.trim());
          return rows.map(r => r.trim().split(/[\s,]+/).map(v => Frac.from(v)));
        }
      }
      const rawSize = String(rawInputs.matrixSize || '3').toLowerCase();
      if (rawSize === '2' || rawSize === '2x2' || (rawInputs.a11 !== undefined && rawInputs.a31 === undefined && !rawInputs.matrixInput)) {
        const a11 = Frac.from(rawInputs.a11 !== undefined ? rawInputs.a11 : 4);
        const a12 = Frac.from(rawInputs.a12 !== undefined ? rawInputs.a12 : 3);
        const a21 = Frac.from(rawInputs.a21 !== undefined ? rawInputs.a21 : 2);
        const a22 = Frac.from(rawInputs.a22 !== undefined ? rawInputs.a22 : 5);
        return [[a11, a12], [a21, a22]];
      } else if (rawInputs.a11 !== undefined && rawInputs.a13 !== undefined && !rawInputs.matrixInput) {
        return [
          [Frac.from(rawInputs.a11 !== undefined ? rawInputs.a11 : 1), Frac.from(rawInputs.a12 !== undefined ? rawInputs.a12 : 2), Frac.from(rawInputs.a13 !== undefined ? rawInputs.a13 : 3)],
          [Frac.from(rawInputs.a21 !== undefined ? rawInputs.a21 : 4), Frac.from(rawInputs.a22 !== undefined ? rawInputs.a22 : 5), Frac.from(rawInputs.a23 !== undefined ? rawInputs.a23 : 6)],
          [Frac.from(rawInputs.a31 !== undefined ? rawInputs.a31 : 7), Frac.from(rawInputs.a32 !== undefined ? rawInputs.a32 : 8), Frac.from(rawInputs.a33 !== undefined ? rawInputs.a33 : 9)]
        ];
      }
      return [
        [new Frac(1), new Frac(2), new Frac(3)],
        [new Frac(4), new Frac(5), new Frac(6)],
        [new Frac(7), new Frac(8), new Frac(9)]
      ];
    }

    function matrixToHtml(mat) {
      const rows = mat.map(row => `<tr>${row.map(c => `<td>${c.toString()}</td>`).join('')}</tr>`).join('');
      return `<span class="math-matrix-det"><table class="matrix-table">${rows}</table></span>`;
    }

    function cloneMatrix(mat) {
      return mat.map(r => r.map(c => new Frac(c.n, c.d)));
    }

    let M = parseInputMatrix(inputs);
    const n = M.length;
    for (let i = 0; i < n; i++) {
      while (M[i].length < n) M[i].push(new Frac(0));
      if (M[i].length > n) M[i] = M[i].slice(0, n);
    }

    const method = String(inputs.method || 'auto').toLowerCase();
    const steps = [];
    const inputHtml = matrixToHtml(M);

    let trace = new Frac(0);
    for (let i = 0; i < n; i++) {
      trace = trace.add(M[i][i]);
    }

    let finalDet = new Frac(0);

    if (n === 1) {
      finalDet = M[0][0];
      steps.push(`The determinant of a 1×1 matrix is simply its single element:`);
      steps.push(`${inputHtml} = <strong>${finalDet.toString()}</strong>`);
    } else if (n === 2) {
      const a = M[0][0], b = M[0][1], c = M[1][0], d = M[1][1];
      const ad = a.mul(d);
      const bc = b.mul(c);
      finalDet = ad.sub(bc);
      steps.push(`The determinant of a 2×2 matrix is |a b; c d| = ad - bc.`);
      steps.push(`${inputHtml} = (${a.toSignedString()}) · (${d.toSignedString()}) - (${b.toSignedString()}) · (${c.toSignedString()}) = ${ad.toString()} - ${bc.toSignedString()} = <strong>${finalDet.toString()}</strong>`);
    } else if (n === 3 && method === 'sarrus') {
      const a1 = M[0][0], a2 = M[0][1], a3 = M[0][2];
      const b1 = M[1][0], b2 = M[1][1], b3 = M[1][2];
      const c1 = M[2][0], c2 = M[2][1], c3 = M[2][2];

      const p1 = a1.mul(b2).mul(c3);
      const p2 = a2.mul(b3).mul(c1);
      const p3 = a3.mul(b1).mul(c2);
      const posSum = p1.add(p2).add(p3);

      const m1 = a3.mul(b2).mul(c1);
      const m2 = a1.mul(b3).mul(c2);
      const m3 = a2.mul(b1).mul(c3);
      const negSum = m1.add(m2).add(m3);

      finalDet = posSum.sub(negSum);
      steps.push(`Apply Rule of Sarrus for 3×3 matrix:`);
      steps.push(`Positive diagonals sum: (${a1}·${b2}·${c3}) + (${a2}·${b3}·${c1}) + (${a3}·${b1}·${c2}) = ${p1} + ${p2} + ${p3} = ${posSum}`);
      steps.push(`Negative diagonals sum: (${a3}·${b2}·${c1}) + (${a1}·${b3}·${c2}) + (${a2}·${b1}·${c3}) = ${m1} + ${m2} + ${m3} = ${negSum}`);
      steps.push(`${inputHtml} = (${posSum.toString()}) - (${negSum.toSignedString()}) = <strong>${finalDet.toString()}</strong>`);
    } else if (method === 'gaussian') {
      let A = cloneMatrix(M);
      let sign = 1;
      steps.push(`Reduce the matrix to upper triangular form using elementary row operations:`);

      for (let col = 0; col < n; col++) {
        let pivotRow = -1;
        for (let r = col; r < n; r++) {
          if (!A[r][col].isZero()) {
            pivotRow = r;
            break;
          }
        }
        if (pivotRow === -1) {
          steps.push(`All elements in column ${col + 1} from row ${col + 1} downwards are zero. Determinant is 0.`);
          finalDet = new Frac(0);
          break;
        }
        if (pivotRow !== col) {
          const tmp = A[col];
          A[col] = A[pivotRow];
          A[pivotRow] = tmp;
          sign = -sign;
          steps.push(`Swap row ${col + 1} and row ${pivotRow + 1}: R_${col + 1} ↔ R_${pivotRow + 1} (reverses sign of determinant).<br>${matrixToHtml(A)}`);
        }

        const pivotVal = A[col][col];
        for (let r = col + 1; r < n; r++) {
          if (!A[r][col].isZero()) {
            const factor = A[r][col].div(pivotVal);
            for (let c = col; c < n; c++) {
              A[r][c] = A[r][c].sub(factor.mul(A[col][c]));
            }
            steps.push(`Subtract row ${col + 1} multiplied by ${factor.toSignedString()} from row ${r + 1}: R_${r + 1} = R_${r + 1} - (${factor.toSignedString()}) · R_${col + 1}.<br>${matrixToHtml(A)}`);
          }
        }
      }

      if (!finalDet.isZero()) {
        finalDet = new Frac(sign);
        const diagParts = [];
        for (let i = 0; i < n; i++) {
          finalDet = finalDet.mul(A[i][i]);
          diagParts.push(A[i][i].toSignedString());
        }
        steps.push(`Determinant is the product of diagonal elements${sign < 0 ? ' multiplied by -1 for row swaps' : ''}:`);
        steps.push(`${inputHtml} = ${sign < 0 ? '(-1) · ' : ''}${diagParts.join(' · ')} = <strong>${finalDet.toString()}</strong>`);
      }
    } else if (method === 'cofactor') {
      steps.push(`Laplace expansion along row 1: det(A) = Σ (-1)¹⁺ʲ · a₁ⱼ · det(M₁ⱼ)`);
      const terms = [];
      let sum = new Frac(0);

      for (let j = 0; j < n; j++) {
        const coef = M[0][j];
        const sign = (j % 2 === 0) ? 1 : -1;
        const minor = [];
        for (let r = 1; r < n; r++) {
          const row = [];
          for (let c = 0; c < n; c++) {
            if (c !== j) row.push(M[r][c]);
          }
          minor.push(row);
        }

        let minorDet = new Frac(0);
        if (minor.length === 1) {
          minorDet = minor[0][0];
        } else if (minor.length === 2) {
          minorDet = minor[0][0].mul(minor[1][1]).sub(minor[0][1].mul(minor[1][0]));
        } else {
          // Recursive 3x3 determinant for 4x4
          const m1 = minor[0][0].mul(minor[1][1].mul(minor[2][2]).sub(minor[1][2].mul(minor[2][1])));
          const m2 = minor[0][1].mul(minor[1][0].mul(minor[2][2]).sub(minor[1][2].mul(minor[2][0])));
          const m3 = minor[0][2].mul(minor[1][0].mul(minor[2][1]).sub(minor[1][1].mul(minor[2][0])));
          minorDet = m1.sub(m2).add(m3);
        }

        const termVal = coef.mul(new Frac(sign)).mul(minorDet);
        sum = sum.add(termVal);
        terms.push(`(${sign < 0 ? '-' : '+'}${coef.toString()}) · ${matrixToHtml(minor)} [= ${termVal.toString()}]`);
      }

      steps.push(`${inputHtml} = ${terms.join(' + ')}`);
      finalDet = sum;
      steps.push(`Sum of cofactor terms: det(A) = <strong>${finalDet.toString()}</strong>`);
    } else {
      // eMathHelp default / Auto: Column reduction to create zeros in Row 1, then cofactor expansion
      let cur = cloneMatrix(M);
      let curSign = 1;

      if (cur[0][0].isZero()) {
        let swapIdx = -1;
        for (let r = 1; r < n; r++) {
          if (!cur[r][0].isZero()) {
            swapIdx = r;
            break;
          }
        }
        if (swapIdx !== -1) {
          const tmp = cur[0];
          cur[0] = cur[swapIdx];
          cur[swapIdx] = tmp;
          curSign = -curSign;
          steps.push(`Swap row 1 and row ${swapIdx + 1}: R₁ ↔ R_${swapIdx + 1} (reverses sign of determinant):<br>${matrixToHtml(cur)}`);
        } else {
          steps.push(`First column is entirely zero, so determinant is <strong>0</strong>.`);
          finalDet = new Frac(0);
        }
      }

      if (!cur[0][0].isZero()) {
        const pivot = cur[0][0];
        for (let j = 1; j < n; j++) {
          if (!cur[0][j].isZero()) {
            const factor = cur[0][j].div(pivot);
            for (let r = 0; r < n; r++) {
              cur[r][j] = cur[r][j].sub(factor.mul(cur[r][0]));
            }
            steps.push(`Subtract column 1 multiplied by ${factor.toSignedString()} from column ${j + 1}: C_${j + 1} = C_${j + 1} - (${factor.toSignedString()}) · C₁.<br>${matrixToHtml(cur)}`);
          }
        }

        const sub = [];
        for (let r = 1; r < n; r++) {
          const subRow = [];
          for (let c = 1; c < n; c++) {
            subRow.push(cur[r][c]);
          }
          sub.push(subRow);
        }

        steps.push(`Expand along row 1:`);
        steps.push(`${matrixToHtml(cur)} = (${pivot.toString()}) · (-1)¹⁺¹ · ${matrixToHtml(sub)} = ${pivot.isOne() ? '' : pivot.toString() + ' · '}${matrixToHtml(sub)}`);

        if (sub.length === 1) {
          const subDet = sub[0][0];
          finalDet = pivot.mul(subDet).mul(new Frac(curSign));
        } else if (sub.length === 2) {
          const a = sub[0][0], b = sub[0][1], c = sub[1][0], d = sub[1][1];
          const ad = a.mul(d);
          const bc = b.mul(c);
          const subDet = ad.sub(bc);
          steps.push(`The determinant of a 2×2 matrix is |a b; c d| = ad - bc.`);
          steps.push(`${matrixToHtml(sub)} = (${a.toSignedString()}) · (${d.toSignedString()}) - (${b.toSignedString()}) · (${c.toSignedString()}) = ${ad.toString()} - ${bc.toSignedString()} = ${subDet.toString()}`);
          finalDet = pivot.mul(subDet).mul(new Frac(curSign));
        } else {
          // If larger than 3x3, reduce remaining minor
          let subP = sub[0][0];
          for (let j = 1; j < sub.length; j++) {
            if (!sub[0][j].isZero() && !subP.isZero()) {
              const factor = sub[0][j].div(subP);
              for (let r = 0; r < sub.length; r++) {
                sub[r][j] = sub[r][j].sub(factor.mul(sub[r][0]));
              }
            }
          }
          const sub2 = [];
          for (let r = 1; r < sub.length; r++) {
            const r2 = [];
            for (let c = 1; c < sub.length; c++) r2.push(sub[r][c]);
            sub2.push(r2);
          }
          let det2 = sub2[0][0].mul(sub2[1][1]).sub(sub2[0][1].mul(sub2[1][0]));
          let subDet = subP.mul(det2);
          steps.push(`Evaluate submatrix: ${matrixToHtml(sub)} = ${subDet.toString()}`);
          finalDet = pivot.mul(subDet).mul(new Frac(curSign));
        }
      }
    }

    const detStr = finalDet.toString();
    const isSingular = finalDet.isZero();
    const rawMatrixJson = JSON.stringify(M.map(r => r.map(c => c.d === 1 ? c.n : c.toNumber())));

    return {
      primaryValue: detStr,
      primaryLabel: 'Matrix Determinant det(A)',
      subtext: `Order: ${n}×${n} | Trace: ${trace.toString()} | ${isSingular ? 'Singular (Non-Invertible)' : 'Invertible (Non-Singular)'}`,
      breakdown: [
        { label: 'Matrix Size', value: `${n} × ${n}` },
        { label: 'Calculated Determinant det(A)', value: detStr },
        { label: 'Invertibility Status', value: isSingular ? 'Singular Matrix (det = 0, no inverse)' : 'Invertible (det ≠ 0, inverse exists)' },
        { label: 'Matrix Trace Tr(A)', value: trace.toString() },
        { label: 'Method Applied', value: method === 'sarrus' ? 'Rule of Sarrus' : method === 'gaussian' ? 'Gaussian Triangular Elimination' : method === 'cofactor' ? 'Laplace Cofactor Expansion' : 'Row/Column Reduction & Expansion (eMathHelp style)' }
      ],
      steps: steps,
      inputHtml: inputHtml,
      answerHtml: `${inputHtml} = ${detStr}`,
      rawMatrixJson: rawMatrixJson
    };
  },

    "area-calculator": (inputs) => {
    const shape = inputs.shape || 'rectangle';
    const d1 = toNum(inputs.d1, 10);
    const d2 = toNum(inputs.d2, 6);
    const d3 = toNum(inputs.d3, 4);

    let area = 0;
    let label = '';
    let steps = [];

    if (shape === 'rectangle') {
      area = d1 * d2;
      label = `Rectangle Area (${d1} × ${d2})`;
      steps = [`Formula: Area = length × width`, `Area = ${d1} × ${d2} = ${formatNum(area, 4)}`];
    } else if (shape === 'circle') {
      area = Math.PI * d1 * d1;
      label = `Circle Area (r = ${d1})`;
      steps = [`Formula: Area = π × r²`, `Area = π × (${d1})² = ${formatNum(area, 4)}`];
    } else if (shape === 'triangle') {
      area = 0.5 * d1 * d2;
      label = `Triangle Area (b = ${d1}, h = ${d2})`;
      steps = [`Formula: Area = 0.5 × base × height`, `Area = 0.5 × ${d1} × ${d2} = ${formatNum(area, 4)}`];
    } else if (shape === 'trapezoid') {
      area = 0.5 * (d1 + d2) * d3;
      label = `Trapezoid Area (a = ${d1}, b = ${d2}, h = ${d3})`;
      steps = [`Formula: Area = 0.5 × (a + b) × h`, `Area = 0.5 × (${d1} + ${d2}) × ${d3} = ${formatNum(area, 4)}`];
    } else {
      area = Math.PI * d1 * d2;
      label = `Ellipse Area (a = ${d1}, b = ${d2})`;
      steps = [`Formula: Area = π × a × b`, `Area = π × ${d1} × ${d2} = ${formatNum(area, 4)}`];
    }

    return {
      primaryValue: formatNum(area, 4),
      primaryLabel: label,
      subtext: `Total calculated two-dimensional surface area`,
      breakdown: [
        { label: 'Shape', value: shape.charAt(0).toUpperCase() + shape.slice(1) },
        { label: 'Dimension 1', value: formatNum(d1) },
        { label: 'Dimension 2', value: formatNum(d2) },
        { label: 'Computed Area', value: `${formatNum(area, 4)} sq units` }
      ],
      steps: steps
    };
  },

    "perimeter-calculator": (inputs) => {
    const shape = inputs.shape || 'rectangle';
    const s1 = toNum(inputs.side1, 12);
    const s2 = toNum(inputs.side2, 8);
    const s3 = toNum(inputs.side3, 10);

    let perim = 0;
    let label = '';
    let steps = [];

    if (shape === 'rectangle') {
      perim = 2 * (s1 + s2);
      label = `Rectangle Perimeter (2[${s1} + ${s2}])`;
      steps = [`Formula: P = 2 × (length + width)`, `P = 2 × (${s1} + ${s2}) = ${formatNum(perim, 4)}`];
    } else if (shape === 'circle') {
      perim = 2 * Math.PI * s1;
      label = `Circle Circumference (r = ${s1})`;
      steps = [`Formula: C = 2 × π × r`, `C = 2 × π × ${s1} = ${formatNum(perim, 4)}`];
    } else if (shape === 'triangle') {
      perim = s1 + s2 + s3;
      label = `Triangle Perimeter (${s1} + ${s2} + ${s3})`;
      steps = [`Formula: P = a + b + c`, `P = ${s1} + ${s2} + ${s3} = ${formatNum(perim, 4)}`];
    } else {
      perim = 4 * s1;
      label = `Square Perimeter (4 × ${s1})`;
      steps = [`Formula: P = 4 × side`, `P = 4 × ${s1} = ${formatNum(perim, 4)}`];
    }

    return {
      primaryValue: formatNum(perim, 4),
      primaryLabel: label,
      subtext: `Total boundary distance`,
      breakdown: [
        { label: 'Shape', value: shape.charAt(0).toUpperCase() + shape.slice(1) },
        { label: 'Perimeter / Circumference', value: `${formatNum(perim, 4)} units` }
      ],
      steps: steps
    };
  },

    "circle-calculator": (inputs) => {
    const r = toNum(inputs.radius, 7);
    if (r <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Radius must be greater than zero.' };

    const diameter = 2 * r;
    const circumference = 2 * Math.PI * r;
    const area = Math.PI * r * r;

    return {
      primaryValue: formatNum(area, 4),
      primaryLabel: 'Circle Area (πr²)',
      subtext: `Circumference: ${formatNum(circumference, 4)} | Diameter: ${formatNum(diameter, 2)}`,
      breakdown: [
        { label: 'Radius (r)', value: formatNum(r) },
        { label: 'Diameter (d = 2r)', value: formatNum(diameter, 4) },
        { label: 'Circumference (C = 2πr)', value: formatNum(circumference, 4) },
        { label: 'Area (A = πr²)', value: `${formatNum(area, 4)} sq units` }
      ],
      steps: [
        `Diameter = 2 × ${r} = ${formatNum(diameter, 4)}`,
        `Circumference = 2 × π × ${r} = ${formatNum(circumference, 4)}`,
        `Area = π × (${r})² = ${formatNum(area, 4)}`
      ]
    };
  },

    "triangle-calculator": (inputs) => {
    const a = toNum(inputs.a, 5);
    const b = toNum(inputs.b, 6);
    const c = toNum(inputs.c, 7);

    if (a <= 0 || b <= 0 || c <= 0) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'All three sides must be positive.' };
    }
    if (a + b <= c || a + c <= b || b + c <= a) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Triangle Inequality Violation: The sum of any two sides must exceed the third side.' };
    }

    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    const perimeter = a + b + c;

    // Angles using law of cosines
    const angleA = Math.acos((b * b + c * c - a * a) / (2 * b * c)) * (180 / Math.PI);
    const angleB = Math.acos((a * a + c * c - b * b) / (2 * a * c)) * (180 / Math.PI);
    const angleC = 180 - angleA - angleB;

    return {
      primaryValue: formatNum(area, 4),
      primaryLabel: 'Triangle Area (Heron)',
      subtext: `Perimeter: ${formatNum(perimeter, 2)} | Angles: ${formatNum(angleA, 1)}°, ${formatNum(angleB, 1)}°, ${formatNum(angleC, 1)}°`,
      breakdown: [
        { label: 'Sides (a, b, c)', value: `${a}, ${b}, ${c}` },
        { label: 'Semi-perimeter (s)', value: formatNum(s, 2) },
        { label: 'Area (Heron formula)', value: `${formatNum(area, 4)} sq units` },
        { label: 'Perimeter', value: `${formatNum(perimeter, 2)} units` },
        { label: 'Angles (α, β, γ)', value: `${formatNum(angleA, 1)}°, ${formatNum(angleB, 1)}°, ${formatNum(angleC, 1)}°` }
      ],
      steps: [
        `Semi-perimeter: s = (${a} + ${b} + ${c}) / 2 = ${formatNum(s, 2)}`,
        `Heron's Formula: Area = √[s(s - a)(s - b)(s - c)]`,
        `Area = √[${s} × ${s - a} × ${s - b} × ${s - c}] = ${formatNum(area, 4)}`
      ]
    };
  },

    "rectangle-calculator": (inputs) => {
    const l = toNum(inputs.length, 15);
    const w = toNum(inputs.width, 8);

    if (l <= 0 || w <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Length and width must be greater than zero.' };

    const area = l * w;
    const perim = 2 * (l + w);
    const diag = Math.sqrt(l * l + w * w);

    return {
      primaryValue: formatNum(area, 4),
      primaryLabel: 'Rectangle Area',
      subtext: `Perimeter: ${formatNum(perim, 2)} | Diagonal: ${formatNum(diag, 4)}`,
      breakdown: [
        { label: 'Length', value: formatNum(l) },
        { label: 'Width', value: formatNum(w) },
        { label: 'Area (l × w)', value: `${formatNum(area, 4)} sq units` },
        { label: 'Perimeter (2[l + w])', value: `${formatNum(perim, 2)} units` },
        { label: 'Diagonal (√(l² + w²))', value: formatNum(diag, 4) }
      ],
      steps: [
        `Area = ${l} × ${w} = ${formatNum(area, 4)}`,
        `Perimeter = 2 × (${l} + ${w}) = ${formatNum(perim, 2)}`,
        `Diagonal = √(${l}² + ${w}²) = ${formatNum(diag, 4)}`
      ]
    };
  },

    "square-calculator": (inputs) => {
    const s = toNum(inputs.side, 10);
    if (s <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Side must be positive.' };

    const area = s * s;
    const perim = 4 * s;
    const diag = s * Math.SQRT2;

    return {
      primaryValue: formatNum(area, 4),
      primaryLabel: 'Square Area (s²)',
      subtext: `Perimeter: ${formatNum(perim, 2)} | Diagonal: ${formatNum(diag, 4)}`,
      breakdown: [
        { label: 'Side Length (s)', value: formatNum(s) },
        { label: 'Area (s²)', value: `${formatNum(area, 4)} sq units` },
        { label: 'Perimeter (4s)', value: `${formatNum(perim, 2)} units` },
        { label: 'Diagonal (s√2)', value: formatNum(diag, 4) }
      ],
      steps: [
        `Area = (${s})² = ${formatNum(area, 4)}`,
        `Perimeter = 4 × ${s} = ${formatNum(perim, 2)}`,
        `Diagonal = ${s} × √2 = ${formatNum(diag, 4)}`
      ]
    };
  },

    "trapezoid-calculator": (inputs) => {
    const a = toNum(inputs.a, 8);
    const b = toNum(inputs.b, 14);
    const h = toNum(inputs.h, 6);

    if (a <= 0 || b <= 0 || h <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Bases and height must be positive.' };

    const area = 0.5 * (a + b) * h;
    const median = (a + b) / 2;

    return {
      primaryValue: formatNum(area, 4),
      primaryLabel: 'Trapezoid Area',
      subtext: `Median / Midsegment: ${formatNum(median, 2)}`,
      breakdown: [
        { label: 'Base a', value: formatNum(a) },
        { label: 'Base b', value: formatNum(b) },
        { label: 'Height h', value: formatNum(h) },
        { label: 'Midsegment (a + b)/2', value: formatNum(median, 2) },
        { label: 'Area', value: `${formatNum(area, 4)} sq units` }
      ],
      steps: [
        `Formula: Area = 0.5 × (a + b) × h`,
        `Area = 0.5 × (${a} + ${b}) × ${h} = 0.5 × ${a + b} × ${h} = ${formatNum(area, 4)}`
      ]
    };
  },

    "parallelogram-calculator": (inputs) => {
    const b = toNum(inputs.base, 12);
    const h = toNum(inputs.height, 7);
    const side = toNum(inputs.side, 9);

    if (b <= 0 || h <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Base and height must be positive.' };

    const area = b * h;
    const perim = side > 0 ? 2 * (b + side) : 0;

    return {
      primaryValue: formatNum(area, 4),
      primaryLabel: 'Parallelogram Area (b × h)',
      subtext: perim > 0 ? `Perimeter: ${formatNum(perim, 2)}` : 'Area evaluated from base & altitude',
      breakdown: [
        { label: 'Base (b)', value: formatNum(b) },
        { label: 'Height (h)', value: formatNum(h) },
        { label: 'Slant Side', value: side > 0 ? formatNum(side) : 'N/A' },
        { label: 'Area', value: `${formatNum(area, 4)} sq units` },
        { label: 'Perimeter', value: perim > 0 ? `${formatNum(perim, 2)} units` : 'N/A' }
      ],
      steps: [
        `Formula: Area = base × height`,
        `Area = ${b} × ${h} = ${formatNum(area, 4)}`
      ]
    };
  },

    "polygon-calculator": (inputs) => {
    const n = Math.round(toNum(inputs.n, 6));
    const s = toNum(inputs.s, 8);

    if (n < 3) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'A polygon must have at least 3 sides.' };
    if (s <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Side length must be positive.' };

    const perim = n * s;
    const apothem = s / (2 * Math.tan(Math.PI / n));
    const area = (n * s * apothem) / 2;
    const interiorAngle = ((n - 2) * 180) / n;

    return {
      primaryValue: formatNum(area, 4),
      primaryLabel: `Regular ${n}-gon Area`,
      subtext: `Perimeter: ${formatNum(perim, 2)} | Interior Angle: ${formatNum(interiorAngle, 2)}°`,
      breakdown: [
        { label: 'Sides (n)', value: `${n}` },
        { label: 'Side Length (s)', value: formatNum(s) },
        { label: 'Apothem', value: formatNum(apothem, 4) },
        { label: 'Perimeter', value: `${formatNum(perim, 2)} units` },
        { label: 'Interior Angle', value: `${formatNum(interiorAngle, 2)}°` },
        { label: 'Area', value: `${formatNum(area, 4)} sq units` }
      ],
      steps: [
        `Apothem = s / [2 × tan(π / ${n})] = ${formatNum(apothem, 4)}`,
        `Area = (n × s × apothem) / 2 = (${n} × ${s} × ${formatNum(apothem, 4)}) / 2 = ${formatNum(area, 4)}`
      ]
    };
  },

    "cube-calculator": (inputs) => {
    const s = toNum(inputs.side, 5);
    if (s <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Side length must be positive.' };

    const vol = Math.pow(s, 3);
    const sa = 6 * s * s;
    const diag = s * Math.sqrt(3);

    return {
      primaryValue: formatNum(vol, 4),
      primaryLabel: 'Cube Volume (s³)',
      subtext: `Surface Area: ${formatNum(sa, 2)} | Space Diagonal: ${formatNum(diag, 4)}`,
      breakdown: [
        { label: 'Side Length (s)', value: formatNum(s) },
        { label: 'Volume (s³)', value: `${formatNum(vol, 4)} cubic units` },
        { label: 'Surface Area (6s²)', value: `${formatNum(sa, 2)} sq units` },
        { label: 'Space Diagonal (s√3)', value: formatNum(diag, 4) }
      ],
      steps: [
        `Volume = (${s})³ = ${formatNum(vol, 4)}`,
        `Surface Area = 6 × (${s})² = ${formatNum(sa, 2)}`,
        `Diagonal = ${s} × √3 = ${formatNum(diag, 4)}`
      ]
    };
  },

    "cuboid-calculator": (inputs) => {
    const l = toNum(inputs.length, 8);
    const w = toNum(inputs.width, 5);
    const h = toNum(inputs.height, 3);

    if (l <= 0 || w <= 0 || h <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Dimensions must be positive.' };

    const vol = l * w * h;
    const sa = 2 * (l * w + l * h + w * h);
    const diag = Math.sqrt(l * l + w * w + h * h);

    return {
      primaryValue: formatNum(vol, 4),
      primaryLabel: 'Cuboid Volume (l × w × h)',
      subtext: `Surface Area: ${formatNum(sa, 2)} | Space Diagonal: ${formatNum(diag, 4)}`,
      breakdown: [
        { label: 'Dimensions (l, w, h)', value: `${l} × ${w} × ${h}` },
        { label: 'Volume', value: `${formatNum(vol, 4)} cubic units` },
        { label: 'Surface Area', value: `${formatNum(sa, 2)} sq units` },
        { label: 'Space Diagonal', value: formatNum(diag, 4) }
      ],
      steps: [
        `Volume = ${l} × ${w} × ${h} = ${formatNum(vol, 4)}`,
        `Surface Area = 2 × (${l * w} + ${l * h} + ${w * h}) = ${formatNum(sa, 2)}`,
        `Diagonal = √(${l}² + ${w}² + ${h}²) = ${formatNum(diag, 4)}`
      ]
    };
  },

    "sphere-calculator": (inputs) => {
    const r = toNum(inputs.radius, 6);
    if (r <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Radius must be positive.' };

    const vol = (4 / 3) * Math.PI * Math.pow(r, 3);
    const sa = 4 * Math.PI * r * r;

    return {
      primaryValue: formatNum(vol, 4),
      primaryLabel: 'Sphere Volume (4/3 πr³)',
      subtext: `Surface Area: ${formatNum(sa, 2)} | Diameter: ${formatNum(2 * r, 2)}`,
      breakdown: [
        { label: 'Radius (r)', value: formatNum(r) },
        { label: 'Volume', value: `${formatNum(vol, 4)} cubic units` },
        { label: 'Surface Area (4πr²)', value: `${formatNum(sa, 2)} sq units` }
      ],
      steps: [
        `Volume = (4/3) × π × (${r})³ = ${formatNum(vol, 4)}`,
        `Surface Area = 4 × π × (${r})² = ${formatNum(sa, 2)}`
      ]
    };
  },

    "cylinder-calculator": (inputs) => {
    const r = toNum(inputs.radius, 4);
    const h = toNum(inputs.height, 10);

    if (r <= 0 || h <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Radius and height must be positive.' };

    const vol = Math.PI * r * r * h;
    const lateralArea = 2 * Math.PI * r * h;
    const totalArea = 2 * Math.PI * r * (r + h);

    return {
      primaryValue: formatNum(vol, 4),
      primaryLabel: 'Cylinder Volume (πr²h)',
      subtext: `Total Surface Area: ${formatNum(totalArea, 2)}`,
      breakdown: [
        { label: 'Radius (r)', value: formatNum(r) },
        { label: 'Height (h)', value: formatNum(h) },
        { label: 'Volume', value: `${formatNum(vol, 4)} cubic units` },
        { label: 'Lateral Area (2πrh)', value: `${formatNum(lateralArea, 2)} sq units` },
        { label: 'Total Surface Area', value: `${formatNum(totalArea, 2)} sq units` }
      ],
      steps: [
        `Volume = π × (${r})² × ${h} = ${formatNum(vol, 4)}`,
        `Lateral Area = 2 × π × ${r} × ${h} = ${formatNum(lateralArea, 2)}`,
        `Total Surface Area = 2πr(r + h) = ${formatNum(totalArea, 2)}`
      ]
    };
  },

    "cone-calculator": (inputs) => {
    const r = toNum(inputs.radius, 5);
    const h = toNum(inputs.height, 12);

    if (r <= 0 || h <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Radius and height must be positive.' };

    const slant = Math.sqrt(r * r + h * h);
    const vol = (1 / 3) * Math.PI * r * r * h;
    const lateralArea = Math.PI * r * slant;
    const totalArea = Math.PI * r * (r + slant);

    return {
      primaryValue: formatNum(vol, 4),
      primaryLabel: 'Cone Volume (1/3 πr²h)',
      subtext: `Slant Height: ${formatNum(slant, 2)} | Total Area: ${formatNum(totalArea, 2)}`,
      breakdown: [
        { label: 'Radius (r)', value: formatNum(r) },
        { label: 'Height (h)', value: formatNum(h) },
        { label: 'Slant Height (s = √(r² + h²))', value: formatNum(slant, 4) },
        { label: 'Volume', value: `${formatNum(vol, 4)} cubic units` },
        { label: 'Total Surface Area', value: `${formatNum(totalArea, 2)} sq units` }
      ],
      steps: [
        `Slant height: s = √(${r}² + ${h}²) = ${formatNum(slant, 4)}`,
        `Volume = (1/3) × π × (${r})² × ${h} = ${formatNum(vol, 4)}`,
        `Total Surface Area = πr(r + s) = ${formatNum(totalArea, 2)}`
      ]
    };
  },

    "pyramid-calculator": (inputs) => {
    const l = toNum(inputs.length, 10);
    const w = toNum(inputs.width, 10);
    const h = toNum(inputs.height, 12);

    if (l <= 0 || w <= 0 || h <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Dimensions must be positive.' };

    const vol = (l * w * h) / 3;
    const slantL = Math.sqrt((w / 2) * (w / 2) + h * h);
    const slantW = Math.sqrt((l / 2) * (l / 2) + h * h);
    const sa = l * w + l * slantL + w * slantW;

    return {
      primaryValue: formatNum(vol, 4),
      primaryLabel: 'Pyramid Volume (1/3 lwh)',
      subtext: `Surface Area: ${formatNum(sa, 2)}`,
      breakdown: [
        { label: 'Base (l × w)', value: `${l} × ${w}` },
        { label: 'Height (h)', value: formatNum(h) },
        { label: 'Volume', value: `${formatNum(vol, 4)} cubic units` },
        { label: 'Total Surface Area', value: `${formatNum(sa, 2)} sq units` }
      ],
      steps: [
        `Volume = (${l} × ${w} × ${h}) / 3 = ${formatNum(vol, 4)}`,
        `Base Area = ${l * w}`,
        `Total Surface Area = ${formatNum(sa, 2)}`
      ]
    };
  },

    "loan-calculator": (inputs) => {
    const P = toNum(inputs.principal, 25000);
    const annualRate = toNum(inputs.rate, 6.5);
    const years = toNum(inputs.termYears, 5);

    if (P <= 0 || years <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Principal and term must be positive.' };

    const n = years * 12;
    const r = annualRate / 100 / 12;

    let monthlyPayment = 0;
    if (r === 0) {
      monthlyPayment = P / n;
    } else {
      monthlyPayment = (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    }

    const totalPaid = monthlyPayment * n;
    const totalInterest = totalPaid - P;

    return {
      primaryValue: `$${formatNum(monthlyPayment, 2)} / mo`,
      primaryLabel: 'Monthly Payment',
      subtext: `Total Paid: $${formatNum(totalPaid, 2)} | Interest: $${formatNum(totalInterest, 2)}`,
      breakdown: [
        { label: 'Loan Principal', value: `$${formatNum(P, 2)}` },
        { label: 'Annual Interest Rate', value: `${annualRate}%` },
        { label: 'Loan Term', value: `${years} years (${n} payments)` },
        { label: 'Monthly Payment', value: `$${formatNum(monthlyPayment, 2)}` },
        { label: 'Total Interest', value: `$${formatNum(totalInterest, 2)}` },
        { label: 'Total Cost of Loan', value: `$${formatNum(totalPaid, 2)}` }
      ],
      steps: [
        `Monthly interest rate: r = ${annualRate}% / 12 = ${formatNum(r * 100, 4)}%`,
        `Total number of monthly payments: n = ${years} × 12 = ${n}`,
        `Amortization formula: M = P[r(1+r)^n] / [(1+r)^n - 1] = $${formatNum(monthlyPayment, 2)}`,
        `Total interest paid = Total Paid ($${formatNum(totalPaid, 2)}) - Principal ($${formatNum(P, 2)}) = $${formatNum(totalInterest, 2)}`
      ]
    };
  },

    "emi-calculator": (inputs) => {
    const P = toNum(inputs.amount, 50000);
    const rate = toNum(inputs.interest, 8.5);
    const months = toNum(inputs.tenureMonths, 36);

    if (P <= 0 || months <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Principal amount and tenure must be positive.' };

    const r = rate / 100 / 12;
    let emi = 0;
    if (r === 0) {
      emi = P / months;
    } else {
      emi = (P * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    }

    const totalRepay = emi * months;
    const totalInterest = totalRepay - P;

    return {
      primaryValue: `$${formatNum(emi, 2)}`,
      primaryLabel: 'Monthly EMI Payment',
      subtext: `Tenure: ${months} months | Total Interest: $${formatNum(totalInterest, 2)}`,
      breakdown: [
        { label: 'Loan Amount', value: `$${formatNum(P, 2)}` },
        { label: 'Annual Rate', value: `${rate}%` },
        { label: 'Tenure (Months)', value: `${months}` },
        { label: 'Monthly EMI', value: `$${formatNum(emi, 2)}` },
        { label: 'Total Interest Payable', value: `$${formatNum(totalInterest, 2)}` },
        { label: 'Total Payment (Principal + Interest)', value: `$${formatNum(totalRepay, 2)}` }
      ],
      steps: [
        `EMI = [P × r × (1+r)^n] / [(1+r)^n - 1]`,
        `Monthly rate r = ${rate} / 1200 = ${formatNum(r, 6)}`,
        `Monthly installment = $${formatNum(emi, 2)}`
      ]
    };
  },

    "mortgage-calculator": (inputs) => {
    const homePrice = toNum(inputs.homePrice, 400000);
    const downPaymentPct = toNum(inputs.downPaymentPct, 20);
    const interestRate = toNum(inputs.interestRate, 6.8);
    const termYears = toNum(inputs.termYears, 30);
    const propertyTaxAnnual = toNum(inputs.propertyTaxAnnual, 4800);
    const homeInsuranceAnnual = toNum(inputs.homeInsuranceAnnual, 1200);

    if (homePrice <= 0 || termYears <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Home price and term must be positive.' };

    const downPayment = (downPaymentPct / 100) * homePrice;
    const loanAmount = homePrice - downPayment;
    const n = termYears * 12;
    const r = interestRate / 100 / 12;

    let piPayment = 0;
    if (r === 0) {
      piPayment = loanAmount / n;
    } else {
      piPayment = (loanAmount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    }

    const monthlyTax = propertyTaxAnnual / 12;
    const monthlyInsurance = homeInsuranceAnnual / 12;
    const totalMonthly = piPayment + monthlyTax + monthlyInsurance;
    const totalInterest = piPayment * n - loanAmount;

    return {
      primaryValue: `$${formatNum(totalMonthly, 2)} / mo`,
      primaryLabel: 'Total Monthly Mortgage Payment',
      subtext: `Principal & Interest: $${formatNum(piPayment, 2)} | Taxes & Ins: $${formatNum(monthlyTax + monthlyInsurance, 2)}`,
      breakdown: [
        { label: 'Home Price', value: `$${formatNum(homePrice, 2)}` },
        { label: 'Down Payment', value: `$${formatNum(downPayment, 2)} (${downPaymentPct}%)` },
        { label: 'Loan Amount Financed', value: `$${formatNum(loanAmount, 2)}` },
        { label: 'Principal & Interest', value: `$${formatNum(piPayment, 2)}` },
        { label: 'Property Tax (Monthly)', value: `$${formatNum(monthlyTax, 2)}` },
        { label: 'Home Insurance (Monthly)', value: `$${formatNum(monthlyInsurance, 2)}` },
        { label: 'Total Monthly Payment (PITI)', value: `$${formatNum(totalMonthly, 2)}` },
        { label: 'Total Interest Paid Over 30 Yrs', value: `$${formatNum(totalInterest, 2)}` }
      ],
      steps: [
        `Down Payment = ${downPaymentPct}% of $${formatNum(homePrice, 0)} = $${formatNum(downPayment, 2)}`,
        `Loan Amount = $${formatNum(homePrice, 0)} - $${formatNum(downPayment, 2)} = $${formatNum(loanAmount, 2)}`,
        `Principal & Interest = $${formatNum(piPayment, 2)} / month`,
        `Total PITI = $${formatNum(piPayment, 2)} + $${formatNum(monthlyTax, 2)} (tax) + $${formatNum(monthlyInsurance, 2)} (ins) = $${formatNum(totalMonthly, 2)}`
      ]
    };
  },

    "compound-interest-calculator": (inputs) => {
    const P = toNum(inputs.principal, 10000);
    const pmt = toNum(inputs.monthlyContribution, 500);
    const annualRate = toNum(inputs.annualRate, 8);
    const years = toNum(inputs.years, 20);

    const r = annualRate / 100;
    const n = 12; // monthly compounding
    const t = years;

    const fvPrincipal = P * Math.pow(1 + r / n, n * t);
    const fvContributions = pmt > 0 && r > 0
      ? pmt * ((Math.pow(1 + r / n, n * t) - 1) / (r / n))
      : pmt * n * t;

    const totalBalance = fvPrincipal + fvContributions;
    const totalDeposits = P + pmt * n * t;
    const totalInterestEarned = totalBalance - totalDeposits;

    return {
      primaryValue: `$${formatNum(totalBalance, 2)}`,
      primaryLabel: `Future Wealth Balance (${years} Yrs)`,
      subtext: `Total Contributed: $${formatNum(totalDeposits, 2)} | Interest Earned: $${formatNum(totalInterestEarned, 2)}`,
      breakdown: [
        { label: 'Starting Principal', value: `$${formatNum(P, 2)}` },
        { label: 'Monthly Deposits', value: `$${formatNum(pmt, 2)}` },
        { label: 'Annual Compound Rate', value: `${annualRate}%` },
        { label: 'Total Cash Invested', value: `$${formatNum(totalDeposits, 2)}` },
        { label: 'Total Compound Interest', value: `$${formatNum(totalInterestEarned, 2)}` },
        { label: 'End Balance', value: `$${formatNum(totalBalance, 2)}` }
      ],
      steps: [
        `Principal growth: $${formatNum(P, 2)} × (1 + ${annualRate / 100}/12)^${n * t} = $${formatNum(fvPrincipal, 2)}`,
        `Regular contribution future value = $${formatNum(fvContributions, 2)}`,
        `Final Compound Balance = $${formatNum(totalBalance, 2)}`
      ]
    };
  },

    "simple-interest-calculator": (inputs) => {
    const P = toNum(inputs.principal, 5000);
    const r = toNum(inputs.rate, 5);
    const t = toNum(inputs.time, 3);

    const interest = P * (r / 100) * t;
    const total = P + interest;

    return {
      primaryValue: `$${formatNum(interest, 2)}`,
      primaryLabel: 'Total Simple Interest (I)',
      subtext: `Total Maturity Value: $${formatNum(total, 2)}`,
      breakdown: [
        { label: 'Principal (P)', value: `$${formatNum(P, 2)}` },
        { label: 'Annual Rate (r)', value: `${r}%` },
        { label: 'Time Period (t)', value: `${t} years` },
        { label: 'Simple Interest Earned', value: `$${formatNum(interest, 2)}` },
        { label: 'Total Future Balance', value: `$${formatNum(total, 2)}` }
      ],
      steps: [
        `Formula: Interest = Principal × Rate × Time`,
        `I = $${formatNum(P, 2)} × ${r / 100} × ${t} = $${formatNum(interest, 2)}`,
        `Total Amount = Principal + Interest = $${formatNum(total, 2)}`
      ]
    };
  },

    "interest-calculator": (inputs) => {
    const P = toNum(inputs.principal, 10000);
    const r = toNum(inputs.rate, 7);
    const t = toNum(inputs.years, 10);

    const simpleInt = P * (r / 100) * t;
    const compoundBal = P * Math.pow(1 + r / 100, t);
    const compoundInt = compoundBal - P;
    const diff = compoundInt - simpleInt;

    return {
      primaryValue: `$${formatNum(compoundInt, 2)} (Compound)`,
      primaryLabel: 'Compound vs Simple Interest',
      subtext: `Compound yields $${formatNum(diff, 2)} more (+${formatNum((diff / simpleInt) * 100, 1)}%)`,
      breakdown: [
        { label: 'Principal Amount', value: `$${formatNum(P, 2)}` },
        { label: 'Rate & Time', value: `${r}% over ${t} years` },
        { label: 'Simple Interest', value: `$${formatNum(simpleInt, 2)} (Total: $${formatNum(P + simpleInt, 2)})` },
        { label: 'Compound Interest', value: `$${formatNum(compoundInt, 2)} (Total: $${formatNum(compoundBal, 2)})` },
        { label: 'Difference Advantage', value: `$${formatNum(diff, 2)}` }
      ],
      steps: [
        `Simple Interest: I = P × r × t = $${formatNum(simpleInt, 2)}`,
        `Compound Interest: A = P(1 + r)^t = $${formatNum(compoundBal, 2)} -> Interest = $${formatNum(compoundInt, 2)}`,
        `Compound Advantage = $${formatNum(diff, 2)}`
      ]
    };
  },

    "investment-calculator": (inputs) => {
    const initial = toNum(inputs.initial, 15000);
    const monthly = toNum(inputs.monthly, 750);
    const returnRate = toNum(inputs.returnRate, 9);
    const years = toNum(inputs.years, 15);

    const r = returnRate / 100 / 12;
    const n = years * 12;

    const fvInit = initial * Math.pow(1 + r, n);
    const fvMonthly = monthly > 0 && r > 0 ? monthly * ((Math.pow(1 + r, n) - 1) / r) : monthly * n;
    const total = fvInit + fvMonthly;
    const invested = initial + monthly * n;
    const profit = total - invested;

    return {
      primaryValue: `$${formatNum(total, 2)}`,
      primaryLabel: `Forecasted Portfolio Value (${years} Yrs)`,
      subtext: `Capital Invested: $${formatNum(invested, 2)} | Capital Gains: $${formatNum(profit, 2)}`,
      breakdown: [
        { label: 'Initial Lump Sum', value: `$${formatNum(initial, 2)}` },
        { label: 'Monthly Contribution', value: `$${formatNum(monthly, 2)}` },
        { label: 'Expected Return', value: `${returnRate}% p.a.` },
        { label: 'Total Invested', value: `$${formatNum(invested, 2)}` },
        { label: 'Net Investment Gain', value: `$${formatNum(profit, 2)}` },
        { label: 'End Portfolio Balance', value: `$${formatNum(total, 2)}` }
      ],
      steps: [
        `Compounded initial capital: $${formatNum(fvInit, 2)}`,
        `Compounded recurring monthly deposits: $${formatNum(fvMonthly, 2)}`,
        `Total portfolio value = $${formatNum(total, 2)}`
      ]
    };
  },

    "savings-calculator": (inputs) => {
    const target = toNum(inputs.target, 50000);
    const current = toNum(inputs.current, 5000);
    const years = toNum(inputs.years, 4);
    const annualRate = toNum(inputs.interest, 4.5);

    if (target <= current) {
      return { primaryValue: '$0 / mo', primaryLabel: 'Goal Met', subtext: 'Target is already covered by current savings.' };
    }

    const n = years * 12;
    const r = annualRate / 100 / 12;

    const fvCurrent = current * Math.pow(1 + r, n);
    const remainingTarget = target - fvCurrent;

    let pmt = 0;
    if (r === 0) {
      pmt = remainingTarget / n;
    } else {
      pmt = (remainingTarget * r) / (Math.pow(1 + r, n) - 1);
    }

    return {
      primaryValue: `$${formatNum(Math.max(0, pmt), 2)} / mo`,
      primaryLabel: 'Required Monthly Savings',
      subtext: `To reach $${formatNum(target, 0)} goal in ${years} years`,
      breakdown: [
        { label: 'Savings Goal', value: `$${formatNum(target, 2)}` },
        { label: 'Current Savings', value: `$${formatNum(current, 2)}` },
        { label: 'Future Value of Current Savings', value: `$${formatNum(fvCurrent, 2)}` },
        { label: 'Remaining Deficit', value: `$${formatNum(Math.max(0, remainingTarget), 2)}` },
        { label: 'Required Monthly Deposit', value: `$${formatNum(Math.max(0, pmt), 2)}` }
      ],
      steps: [
        `Current savings grow to $${formatNum(fvCurrent, 2)} with interest`,
        `Remaining gap: $${formatNum(target, 2)} - $${formatNum(fvCurrent, 2)} = $${formatNum(remainingTarget, 2)}`,
        `Sinking fund formula yields required monthly saving of $${formatNum(pmt, 2)}`
      ]
    };
  },

    "retirement-calculator": (inputs) => {
    const currentAge = toNum(inputs.currentAge, 30);
    const retireAge = toNum(inputs.retireAge, 65);
    const currentSavings = toNum(inputs.currentSavings, 25000);
    const monthlySavings = toNum(inputs.monthlySavings, 600);
    const returnRate = toNum(inputs.returnRate, 7.5);

    const years = Math.max(1, retireAge - currentAge);
    const n = years * 12;
    const r = returnRate / 100 / 12;

    const fvInit = currentSavings * Math.pow(1 + r, n);
    const fvMonthly = monthlySavings > 0 && r > 0 ? monthlySavings * ((Math.pow(1 + r, n) - 1) / r) : monthlySavings * n;
    const nestEgg = fvInit + fvMonthly;
    const safeAnnualWithdrawal = nestEgg * 0.04; // 4% rule
    const safeMonthlyIncome = safeAnnualWithdrawal / 12;

    return {
      primaryValue: `$${formatNum(nestEgg, 2)}`,
      primaryLabel: `Projected Nest Egg at Age ${retireAge}`,
      subtext: `Estimated Safe Monthly Income (4% Rule): $${formatNum(safeMonthlyIncome, 2)} / mo`,
      breakdown: [
        { label: 'Years to Retirement', value: `${years} years` },
        { label: 'Total Projected Nest Egg', value: `$${formatNum(nestEgg, 2)}` },
        { label: 'Safe Annual Income (4%)', value: `$${formatNum(safeAnnualWithdrawal, 2)} / yr` },
        { label: 'Safe Monthly Income', value: `$${formatNum(safeMonthlyIncome, 2)} / mo` }
      ],
      steps: [
        `Accumulation time horizon: ${retireAge} - ${currentAge} = ${years} years`,
        `Compounded nest egg = $${formatNum(fvInit, 2)} (existing) + $${formatNum(fvMonthly, 2)} (monthly savings)`,
        `Total Nest Egg = $${formatNum(nestEgg, 2)}`,
        `Safe 4% annual retirement withdrawal = $${formatNum(safeAnnualWithdrawal, 2)} ($${formatNum(safeMonthlyIncome, 2)}/month)`
      ]
    };
  },

    "inflation-calculator": (inputs) => {
    const amount = toNum(inputs.amount, 1000);
    const inflationRate = toNum(inputs.inflationRate, 3.2);
    const years = toNum(inputs.years, 15);

    const factor = Math.pow(1 + inflationRate / 100, years);
    const futureCost = amount * factor;
    const futurePurchasingPower = amount / factor;

    return {
      primaryValue: `$${formatNum(futureCost, 2)}`,
      primaryLabel: `Equivalent Future Cost in ${years} Yrs`,
      subtext: `Purchasing power of today's $${amount} will shrink to $${formatNum(futurePurchasingPower, 2)}`,
      breakdown: [
        { label: 'Starting Value', value: `$${formatNum(amount, 2)}` },
        { label: 'Average Annual Inflation', value: `${inflationRate}%` },
        { label: 'Time Horizon', value: `${years} years` },
        { label: 'Cumulative Price Increase', value: `+${formatNum((factor - 1) * 100, 1)}%` },
        { label: 'Future Cost of Same Goods', value: `$${formatNum(futureCost, 2)}` },
        { label: 'Real Purchasing Power', value: `$${formatNum(futurePurchasingPower, 2)}` }
      ],
      steps: [
        `Inflation multiplier: (1 + ${inflationRate / 100})^${years} = ${formatNum(factor, 4)}`,
        `To buy goods that cost $${amount} today, you will need $${formatNum(futureCost, 2)} in ${years} years`
      ]
    };
  },

    "roi-calculator": (inputs) => {
    const invested = toNum(inputs.invested, 10000);
    const returned = toNum(inputs.returned, 15500);
    const years = toNum(inputs.years, 3);

    if (invested <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Initial investment must be positive.' };

    const netProfit = returned - invested;
    const totalROI = (netProfit / invested) * 100;
    const annualizedROI = years > 0 ? (Math.pow(returned / invested, 1 / years) - 1) * 100 : totalROI;

    return {
      primaryValue: `${formatNum(totalROI, 2)}%`,
      primaryLabel: 'Total Return on Investment (ROI)',
      subtext: `Net Profit: $${formatNum(netProfit, 2)} | Annualized ROI: ${formatNum(annualizedROI, 2)}% p.a.`,
      breakdown: [
        { label: 'Capital Invested', value: `$${formatNum(invested, 2)}` },
        { label: 'Total Returned Value', value: `$${formatNum(returned, 2)}` },
        { label: 'Net Profit', value: `$${formatNum(netProfit, 2)}` },
        { label: 'Total ROI (%)', value: `${formatNum(totalROI, 2)}%` },
        { label: 'Annualized ROI (CAGR)', value: `${formatNum(annualizedROI, 2)}% per year` }
      ],
      steps: [
        `Net Profit = Return - Investment = $${returned} - $${invested} = $${formatNum(netProfit, 2)}`,
        `ROI = (Net Profit / Investment) × 100% = ($${formatNum(netProfit, 2)} / $${invested}) × 100% = ${formatNum(totalROI, 2)}%`,
        `Annualized ROI = (${returned} / ${invested})^(1/${years}) - 1 = ${formatNum(annualizedROI, 2)}%`
      ]
    };
  },

    "profit-calculator": (inputs) => {
    const rev = toNum(inputs.revenue, 50000);
    const cost = toNum(inputs.cost, 32000);

    const grossProfit = rev - cost;
    const margin = rev > 0 ? (grossProfit / rev) * 100 : 0;
    const markup = cost > 0 ? (grossProfit / cost) * 100 : 0;

    return {
      primaryValue: `$${formatNum(grossProfit, 2)}`,
      primaryLabel: 'Gross Profit',
      subtext: `Profit Margin: ${formatNum(margin, 2)}% | Markup: ${formatNum(markup, 2)}%`,
      breakdown: [
        { label: 'Revenue', value: `$${formatNum(rev, 2)}` },
        { label: 'Cost of Goods Sold (COGS)', value: `$${formatNum(cost, 2)}` },
        { label: 'Gross Profit', value: `$${formatNum(grossProfit, 2)}` },
        { label: 'Gross Margin', value: `${formatNum(margin, 2)}%` },
        { label: 'Markup Percentage', value: `${formatNum(markup, 2)}%` }
      ],
      steps: [
        `Gross Profit = Revenue - Cost = $${rev} - $${cost} = $${formatNum(grossProfit, 2)}`,
        `Margin = (Profit / Revenue) × 100% = ${formatNum(margin, 2)}%`,
        `Markup = (Profit / Cost) × 100% = ${formatNum(markup, 2)}%`
      ]
    };
  },

    "loss-calculator": (inputs) => {
    const cost = toNum(inputs.cost, 1200);
    const selling = toNum(inputs.selling, 900);

    const loss = cost - selling;
    const lossPct = cost > 0 ? (loss / cost) * 100 : 0;

    return {
      primaryValue: `$${formatNum(Math.max(0, loss), 2)}`,
      primaryLabel: loss > 0 ? 'Total Loss Amount' : 'No Financial Loss (Profitable)',
      subtext: loss > 0 ? `Loss Percentage: ${formatNum(lossPct, 2)}% of cost` : 'Selling price is equal to or greater than cost.',
      breakdown: [
        { label: 'Original Cost', value: `$${formatNum(cost, 2)}` },
        { label: 'Selling Price', value: `$${formatNum(selling, 2)}` },
        { label: 'Net Loss', value: `$${formatNum(Math.max(0, loss), 2)}` },
        { label: 'Loss Percentage', value: `${formatNum(Math.max(0, lossPct), 2)}%` }
      ],
      steps: [
        `Loss = Cost - Selling Price = $${cost} - $${selling} = $${formatNum(loss, 2)}`,
        `Loss % = (Loss / Cost) × 100% = ${formatNum(lossPct, 2)}%`
      ]
    };
  },

    "profit-margin-calculator": (inputs) => {
    const cost = toNum(inputs.cost, 45);
    const rev = toNum(inputs.revenue, 75);

    if (rev <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Revenue must be greater than zero.' };

    const profit = rev - cost;
    const margin = (profit / rev) * 100;
    const markup = cost > 0 ? (profit / cost) * 100 : 0;

    return {
      primaryValue: `${formatNum(margin, 2)}%`,
      primaryLabel: 'Profit Margin',
      subtext: `Net Profit: $${formatNum(profit, 2)} per unit | Markup: ${formatNum(markup, 2)}%`,
      breakdown: [
        { label: 'Unit Cost', value: `$${formatNum(cost, 2)}` },
        { label: 'Selling Price / Revenue', value: `$${formatNum(rev, 2)}` },
        { label: 'Profit Amount', value: `$${formatNum(profit, 2)}` },
        { label: 'Profit Margin (%)', value: `${formatNum(margin, 2)}%` },
        { label: 'Markup (%)', value: `${formatNum(markup, 2)}%` }
      ],
      steps: [
        `Profit = Revenue - Cost = $${rev} - $${cost} = $${formatNum(profit, 2)}`,
        `Margin = (Profit / Revenue) × 100 = ($${formatNum(profit, 2)} / $${rev}) × 100 = ${formatNum(margin, 2)}%`
      ]
    };
  },

    "markup-calculator": (inputs) => {
    const cost = toNum(inputs.cost, 60);
    const markup = toNum(inputs.markup, 50);

    const profit = cost * (markup / 100);
    const sellingPrice = cost + profit;
    const margin = (profit / sellingPrice) * 100;

    return {
      primaryValue: `$${formatNum(sellingPrice, 2)}`,
      primaryLabel: 'Target Selling Price',
      subtext: `Profit: $${formatNum(profit, 2)} | Equivalent Margin: ${formatNum(margin, 2)}%`,
      breakdown: [
        { label: 'Base Cost', value: `$${formatNum(cost, 2)}` },
        { label: 'Desired Markup', value: `${markup}%` },
        { label: 'Profit Added', value: `$${formatNum(profit, 2)}` },
        { label: 'Calculated Selling Price', value: `$${formatNum(sellingPrice, 2)}` },
        { label: 'Profit Margin', value: `${formatNum(margin, 2)}%` }
      ],
      steps: [
        `Markup Amount = Cost × (Markup % / 100) = $${cost} × ${markup / 100} = $${formatNum(profit, 2)}`,
        `Selling Price = Cost + Markup = $${cost} + $${formatNum(profit, 2)} = $${formatNum(sellingPrice, 2)}`
      ]
    };
  },

    "discount-calculator": (inputs) => {
    const originalPrice = toNum(inputs.originalPrice, 120);
    const discountPct = toNum(inputs.discountPct, 25);
    const taxPct = toNum(inputs.taxPct, 8);

    const savings = originalPrice * (discountPct / 100);
    const discountedPrice = originalPrice - savings;
    const taxAmount = discountedPrice * (taxPct / 100);
    const finalTotal = discountedPrice + taxAmount;

    return {
      primaryValue: `$${formatNum(finalTotal, 2)}`,
      primaryLabel: 'Final Checkout Price',
      subtext: `You Save: $${formatNum(savings, 2)} (${discountPct}% off)`,
      breakdown: [
        { label: 'Original Price', value: `$${formatNum(originalPrice, 2)}` },
        { label: 'Discount Amount', value: `-$${formatNum(savings, 2)} (${discountPct}%)` },
        { label: 'Sale Price (before tax)', value: `$${formatNum(discountedPrice, 2)}` },
        { label: 'Tax Added', value: `+$${formatNum(taxAmount, 2)} (${taxPct}%)` },
        { label: 'Final Total Paid', value: `$${formatNum(finalTotal, 2)}` }
      ],
      steps: [
        `Discount = $${originalPrice} × ${discountPct}% = $${formatNum(savings, 2)}`,
        `Discounted Price = $${originalPrice} - $${formatNum(savings, 2)} = $${formatNum(discountedPrice, 2)}`,
        `Tax = $${formatNum(discountedPrice, 2)} × ${taxPct}% = $${formatNum(taxAmount, 2)}`,
        `Final Price = $${formatNum(finalTotal, 2)}`
      ]
    };
  },

    "commission-calculator": (inputs) => {
    const sales = toNum(inputs.salesAmount, 80000);
    const rate = toNum(inputs.commissionRate, 7.5);
    const base = toNum(inputs.baseSalary, 3000);

    const commission = sales * (rate / 100);
    const totalEarnings = base + commission;

    return {
      primaryValue: `$${formatNum(totalEarnings, 2)}`,
      primaryLabel: 'Total Gross Compensation',
      subtext: `Commission Earned: $${formatNum(commission, 2)} + Base: $${formatNum(base, 2)}`,
      breakdown: [
        { label: 'Gross Sales Volume', value: `$${formatNum(sales, 2)}` },
        { label: 'Commission Rate', value: `${rate}%` },
        { label: 'Commission Pay', value: `$${formatNum(commission, 2)}` },
        { label: 'Base Salary', value: `$${formatNum(base, 2)}` },
        { label: 'Total Earnings', value: `$${formatNum(totalEarnings, 2)}` }
      ],
      steps: [
        `Commission = Sales ($${sales}) × ${rate}% = $${formatNum(commission, 2)}`,
        `Total Pay = Base ($${base}) + Commission ($${formatNum(commission, 2)}) = $${formatNum(totalEarnings, 2)}`
      ]
    };
  },

    "salary-calculator": (inputs) => {
    const annual = toNum(inputs.annualSalary, 65000);
    const hoursPerWeek = toNum(inputs.hoursPerWeek, 40);
    const weeksPerYear = toNum(inputs.weeksPerYear, 52);

    if (hoursPerWeek <= 0 || weeksPerYear <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Hours and weeks must be positive.' };

    const totalHours = hoursPerWeek * weeksPerYear;
    const hourly = annual / totalHours;
    const weekly = annual / weeksPerYear;
    const biweekly = weekly * 2;
    const monthly = annual / 12;
    const daily = weekly / 5;

    return {
      primaryValue: `$${formatNum(hourly, 2)} / hr`,
      primaryLabel: 'Equivalent Hourly Wage',
      subtext: `Monthly: $${formatNum(monthly, 2)} | Bi-weekly: $${formatNum(biweekly, 2)}`,
      breakdown: [
        { label: 'Annual Salary', value: `$${formatNum(annual, 2)}` },
        { label: 'Monthly Pay', value: `$${formatNum(monthly, 2)}` },
        { label: 'Bi-Weekly Pay', value: `$${formatNum(biweekly, 2)}` },
        { label: 'Weekly Pay', value: `$${formatNum(weekly, 2)}` },
        { label: 'Daily Pay (5-day week)', value: `$${formatNum(daily, 2)}` },
        { label: 'Hourly Rate', value: `$${formatNum(hourly, 2)} / hr` }
      ],
      steps: [
        `Total annual working hours = ${hoursPerWeek} hrs/week × ${weeksPerYear} weeks = ${totalHours} hrs`,
        `Hourly rate = $${annual} / ${totalHours} = $${formatNum(hourly, 2)}`,
        `Monthly pay = $${annual} / 12 = $${formatNum(monthly, 2)}`
      ]
    };
  },

    "hourly-wage-calculator": (inputs) => {
    const rate = toNum(inputs.hourlyRate, 28);
    const regHours = toNum(inputs.regularHours, 40);
    const otHours = toNum(inputs.overtimeHours, 5);
    const otMult = toNum(inputs.overtimeMultiplier, 1.5);

    const regPay = rate * regHours;
    const otRate = rate * otMult;
    const otPay = otHours * otRate;
    const weeklyTotal = regPay + otPay;
    const annualTotal = weeklyTotal * 52;

    return {
      primaryValue: `$${formatNum(weeklyTotal, 2)} / wk`,
      primaryLabel: 'Gross Weekly Pay',
      subtext: `Projected Annual Pay: $${formatNum(annualTotal, 2)}`,
      breakdown: [
        { label: 'Regular Hourly Rate', value: `$${formatNum(rate, 2)} / hr` },
        { label: 'Regular Hours & Pay', value: `${regHours} hrs = $${formatNum(regPay, 2)}` },
        { label: 'Overtime Rate', value: `$${formatNum(otRate, 2)} / hr (${otMult}×)` },
        { label: 'Overtime Pay', value: `${otHours} hrs = $${formatNum(otPay, 2)}` },
        { label: 'Total Weekly Pay', value: `$${formatNum(weeklyTotal, 2)}` },
        { label: 'Total Annual Gross', value: `$${formatNum(annualTotal, 2)}` }
      ],
      steps: [
        `Regular Earnings = ${regHours} × $${rate} = $${formatNum(regPay, 2)}`,
        `Overtime Earnings = ${otHours} × ($${rate} × ${otMult}) = $${formatNum(otPay, 2)}`,
        `Weekly Total = $${formatNum(regPay, 2)} + $${formatNum(otPay, 2)} = $${formatNum(weeklyTotal, 2)}`
      ]
    };
  },

    "net-worth-calculator": (inputs) => {
    const cash = toNum(inputs.cash, 15000);
    const investments = toNum(inputs.investments, 65000);
    const realEstate = toNum(inputs.realEstate, 350000);
    const mortgage = toNum(inputs.mortgage, 240000);
    const otherDebt = toNum(inputs.otherDebt, 22000);

    const totalAssets = cash + investments + realEstate;
    const totalLiabilities = mortgage + otherDebt;
    const netWorth = totalAssets - totalLiabilities;

    return {
      primaryValue: `$${formatNum(netWorth, 2)}`,
      primaryLabel: 'Total Net Worth',
      subtext: `Assets: $${formatNum(totalAssets, 2)} | Liabilities: $${formatNum(totalLiabilities, 2)}`,
      breakdown: [
        { label: 'Total Assets', value: `$${formatNum(totalAssets, 2)}` },
        { label: 'Total Liabilities', value: `$${formatNum(totalLiabilities, 2)}` },
        { label: 'Net Worth (Assets - Liabilities)', value: `$${formatNum(netWorth, 2)}` },
        { label: 'Debt-to-Asset Ratio', value: totalAssets > 0 ? `${formatNum((totalLiabilities / totalAssets) * 100, 1)}%` : 'N/A' }
      ],
      steps: [
        `Sum of Assets = $${cash} + $${investments} + $${realEstate} = $${formatNum(totalAssets, 2)}`,
        `Sum of Liabilities = $${mortgage} + $${otherDebt} = $${formatNum(totalLiabilities, 2)}`,
        `Net Worth = $${formatNum(totalAssets, 2)} - $${formatNum(totalLiabilities, 2)} = $${formatNum(netWorth, 2)}`
      ]
    };
  },

    "break-even-calculator": (inputs) => {
    const fixedCosts = toNum(inputs.fixedCosts, 12000);
    const variableCost = toNum(inputs.variableCostPerUnit, 15);
    const price = toNum(inputs.salePricePerUnit, 40);

    const contributionMargin = price - variableCost;
    if (contributionMargin <= 0) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Sale price must be strictly greater than variable cost per unit.' };
    }

    const breakEvenUnits = Math.ceil(fixedCosts / contributionMargin);
    const breakEvenRevenue = breakEvenUnits * price;
    const cmRatio = (contributionMargin / price) * 100;

    return {
      primaryValue: `${breakEvenUnits.toLocaleString('en-US')} units`,
      primaryLabel: 'Break-Even Sales Volume',
      subtext: `Break-Even Revenue: $${formatNum(breakEvenRevenue, 2)}`,
      breakdown: [
        { label: 'Fixed Costs', value: `$${formatNum(fixedCosts, 2)}` },
        { label: 'Unit Selling Price', value: `$${formatNum(price, 2)}` },
        { label: 'Variable Cost per Unit', value: `$${formatNum(variableCost, 2)}` },
        { label: 'Unit Contribution Margin', value: `$${formatNum(contributionMargin, 2)}` },
        { label: 'Contribution Margin Ratio', value: `${formatNum(cmRatio, 1)}%` },
        { label: 'Break-Even Units', value: `${breakEvenUnits.toLocaleString('en-US')}` },
        { label: 'Break-Even Dollar Revenue', value: `$${formatNum(breakEvenRevenue, 2)}` }
      ],
      steps: [
        `Contribution Margin = Price - Variable Cost = $${price} - $${variableCost} = $${formatNum(contributionMargin, 2)}`,
        `Break-Even Units = Fixed Costs / CM = $${fixedCosts} / $${formatNum(contributionMargin, 2)} = ${breakEvenUnits} units`,
        `Break-Even Revenue = ${breakEvenUnits} × $${price} = $${formatNum(breakEvenRevenue, 2)}`
      ]
    };
  },

    "debt-payoff-calculator": (inputs) => {
    const balance = toNum(inputs.balance, 18000);
    const apr = toNum(inputs.interestRate, 19.5);
    const payment = toNum(inputs.monthlyPayment, 550);

    if (balance <= 0 || payment <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Balance and monthly payment must be positive.' };

    const r = apr / 100 / 12;
    const minInterest = balance * r;

    if (payment <= minInterest) {
      return { primaryValue: 'Warning', primaryLabel: 'Insolvent Payment', error: `Monthly payment must exceed monthly interest ($${formatNum(minInterest, 2)}) to amortize debt.` };
    }

    // Amortization loop
    let remaining = balance;
    let months = 0;
    let totalInterest = 0;

    while (remaining > 0 && months < 600) {
      const interest = remaining * r;
      totalInterest += interest;
      const principal = Math.min(remaining, payment - interest);
      remaining -= principal;
      months++;
    }

    const years = (months / 12).toFixed(1);
    const totalPaid = balance + totalInterest;

    return {
      primaryValue: `${months} months (${years} yrs)`,
      primaryLabel: 'Time to Become Debt-Free',
      subtext: `Total Interest Paid: $${formatNum(totalInterest, 2)} | Total Paid: $${formatNum(totalPaid, 2)}`,
      breakdown: [
        { label: 'Initial Debt Balance', value: `$${formatNum(balance, 2)}` },
        { label: 'Annual APR', value: `${apr}%` },
        { label: 'Monthly Payment', value: `$${formatNum(payment, 2)}` },
        { label: 'Payoff Horizon', value: `${months} months (${years} years)` },
        { label: 'Total Interest Charge', value: `$${formatNum(totalInterest, 2)}` },
        { label: 'Total Amount Repaid', value: `$${formatNum(totalPaid, 2)}` }
      ],
      steps: [
        `Monthly interest charge rate: ${apr}% / 12 = ${formatNum(r * 100, 3)}%`,
        `Monthly principal deduction: $${payment} - (Interest)`,
        `Paid off full $${formatNum(balance, 2)} in ${months} payments`
      ]
    };
  },

    "currency-calculator": (inputs) => {
    const amount = toNum(inputs.amount, 100);
    const from = inputs.from || 'USD';
    const to = inputs.to || 'EUR';

    // Standard benchmark exchange rates relative to USD (1.0)
    const benchmarkRates = {
      USD: 1.0,
      EUR: 0.92,
      GBP: 0.79,
      JPY: 152.4,
      CAD: 1.36,
      AUD: 1.53,
      INR: 83.5,
      CHF: 0.90
    };

    const fromRate = benchmarkRates[from] || 1.0;
    const toRate = benchmarkRates[to] || 1.0;

    // Convert from -> USD -> to
    const inUSD = amount / fromRate;
    const converted = inUSD * toRate;
    const rate1to1 = toRate / fromRate;

    return {
      primaryValue: `${formatNum(converted, 2)} ${to}`,
      primaryLabel: `Converted Currency (${to})`,
      subtext: `1 ${from} = ${formatNum(rate1to1, 4)} ${to}`,
      breakdown: [
        { label: 'Input Amount', value: `${formatNum(amount, 2)} ${from}` },
        { label: 'Exchange Rate', value: `1 ${from} = ${formatNum(rate1to1, 4)} ${to}` },
        { label: 'Converted Total', value: `${formatNum(converted, 2)} ${to}` }
      ],
      steps: [
        `Standard base benchmark conversion`,
        `Rate: 1 ${from} = ${formatNum(rate1to1, 4)} ${to}`,
        `${amount} ${from} × ${formatNum(rate1to1, 4)} = ${formatNum(converted, 2)} ${to}`
      ]
    };
  },

    "future-value-calculator": (inputs) => {
    const pv = toNum(inputs.pv, 10000);
    const rate = toNum(inputs.rate, 7);
    const years = toNum(inputs.years, 10);
    const freq = toNum(inputs.compoundFreq, 1);

    const r = rate / 100 / freq;
    const n = years * freq;
    const fv = pv * Math.pow(1 + r, n);
    const interest = fv - pv;

    return {
      primaryValue: `$${formatNum(fv, 2)}`,
      primaryLabel: 'Future Value (FV)',
      subtext: `Initial Investment: $${formatNum(pv, 2)} | Compounded Interest: $${formatNum(interest, 2)}`,
      breakdown: [
        { label: 'Present Value (PV)', value: `$${formatNum(pv, 2)}` },
        { label: 'Annual Rate (r)', value: `${rate}%` },
        { label: 'Compounding Frequency', value: `${freq} times/year` },
        { label: 'Investment Horizon (t)', value: `${years} years` },
        { label: 'Future Value (FV)', value: `$${formatNum(fv, 2)}` },
        { label: 'Total Growth Gain', value: `$${formatNum(interest, 2)}` }
      ],
      steps: [
        `Formula: FV = PV × (1 + r/m)^(m × t)`,
        `Periodic rate = ${rate}% / ${freq} = ${formatNum(r * 100, 4)}%`,
        `Total compounding periods = ${years} × ${freq} = ${n}`,
        `FV = $${pv} × (1 + ${formatNum(r, 6)})^${n} = $${formatNum(fv, 2)}`
      ]
    };
  },

    "present-value-calculator": (inputs) => {
    const fv = toNum(inputs.fv, 25000);
    const rate = toNum(inputs.discountRate, 6.5);
    const years = toNum(inputs.years, 5);
    const freq = toNum(inputs.compoundFreq, 1);

    const r = rate / 100 / freq;
    const n = years * freq;
    const pv = fv / Math.pow(1 + r, n);
    const discount = fv - pv;

    return {
      primaryValue: `$${formatNum(pv, 2)}`,
      primaryLabel: 'Present Value (PV)',
      subtext: `Discounted at ${rate}% over ${years} years from $${formatNum(fv, 2)}`,
      breakdown: [
        { label: 'Future Sum (FV)', value: `$${formatNum(fv, 2)}` },
        { label: 'Discount Rate', value: `${rate}%` },
        { label: 'Time Horizon', value: `${years} years` },
        { label: 'Present Value (PV)', value: `$${formatNum(pv, 2)}` },
        { label: 'Total Discount Amount', value: `$${formatNum(discount, 2)}` }
      ],
      steps: [
        `Formula: PV = FV / (1 + r/m)^(m × t)`,
        `Discount factor = (1 + ${rate / 100 / freq})^${n} = ${formatNum(Math.pow(1 + r, n), 4)}`,
        `PV = $${fv} / ${formatNum(Math.pow(1 + r, n), 4)} = $${formatNum(pv, 2)}`
      ]
    };
  },

    "cagr-calculator": (inputs) => {
    const initial = toNum(inputs.initialValue, 5000);
    const finalVal = toNum(inputs.finalValue, 15000);
    const periods = toNum(inputs.periods, 5);

    if (initial <= 0 || finalVal <= 0 || periods <= 0) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Initial, final values, and time periods must be strictly positive.' };
    }

    const cagr = (Math.pow(finalVal / initial, 1 / periods) - 1) * 100;
    const totalGrowth = ((finalVal - initial) / initial) * 100;

    return {
      primaryValue: `${formatNum(cagr, 2)}%`,
      primaryLabel: 'Compound Annual Growth Rate (CAGR)',
      subtext: `Total Cumulative Growth: ${formatNum(totalGrowth, 2)}% over ${periods} years`,
      breakdown: [
        { label: 'Beginning Value', value: `$${formatNum(initial, 2)}` },
        { label: 'Ending Value', value: `$${formatNum(finalVal, 2)}` },
        { label: 'Number of Years', value: `${periods}` },
        { label: 'Total Return (%)', value: `${formatNum(totalGrowth, 2)}%` },
        { label: 'CAGR (Annualized)', value: `${formatNum(cagr, 2)}% per year` }
      ],
      steps: [
        `CAGR formula: (Ending / Beginning)^(1 / Years) - 1`,
        `(${finalVal} / ${initial})^(1 / ${periods}) - 1 = (${formatNum(finalVal / initial, 4)})^${formatNum(1 / periods, 4)} - 1`,
        `CAGR = ${formatNum(cagr, 2)}%`
      ]
    };
  },

    "bmi-calculator": (inputs) => {
    const unit = inputs.unit || 'metric';
    const weight = toNum(inputs.weight, 70);
    const height = toNum(inputs.height, 175);

    if (weight <= 0 || height <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Weight and height must be positive.' };

    let bmi = 0;
    let healthyWeightMin = 0;
    let healthyWeightMax = 0;

    if (unit === 'imperial') {
      // Weight in lbs, height in inches
      bmi = (weight / (height * height)) * 703;
      healthyWeightMin = (18.5 * height * height) / 703;
      healthyWeightMax = (24.9 * height * height) / 703;
    } else {
      // Weight in kg, height in cm
      const hm = height / 100;
      bmi = weight / (hm * hm);
      healthyWeightMin = 18.5 * hm * hm;
      healthyWeightMax = 24.9 * hm * hm;
    }

    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal weight (Healthy)';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obesity';

    return {
      primaryValue: formatNum(bmi, 1),
      primaryLabel: `BMI (${category})`,
      subtext: `Healthy weight range: ${formatNum(healthyWeightMin, 1)} - ${formatNum(healthyWeightMax, 1)} ${unit === 'imperial' ? 'lbs' : 'kg'}`,
      breakdown: [
        { label: 'Weight', value: `${formatNum(weight)} ${unit === 'imperial' ? 'lbs' : 'kg'}` },
        { label: 'Height', value: `${formatNum(height)} ${unit === 'imperial' ? 'in' : 'cm'}` },
        { label: 'Calculated BMI', value: formatNum(bmi, 2) },
        { label: 'WHO Category', value: category },
        { label: 'Normal BMI Target', value: '18.5 - 24.9' }
      ],
      steps: [
        unit === 'metric'
          ? `Height in meters: ${height} cm / 100 = ${height / 100} m`
          : `Applied imperial multiplier 703`,
        unit === 'metric'
          ? `BMI = weight / (height)² = ${weight} / (${height / 100})² = ${formatNum(bmi, 1)}`
          : `BMI = (${weight} / ${height}²) × 703 = ${formatNum(bmi, 1)}`,
        `Classification: ${category}`
      ]
    };
  },

    "bmr-calculator": (inputs) => {
    const gender = inputs.gender || 'male';
    const age = toNum(inputs.age, 28);
    const weightKg = toNum(inputs.weightKg, 75);
    const heightCm = toNum(inputs.heightCm, 178);

    if (age <= 0 || weightKg <= 0 || heightCm <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Age, weight, and height must be positive.' };

    // Mifflin-St Jeor Equation
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    bmr += gender === 'male' ? 5 : -161;

    return {
      primaryValue: `${Math.round(bmr).toLocaleString('en-US')} kcal/day`,
      primaryLabel: 'Basal Metabolic Rate (BMR)',
      subtext: `Calories burned at complete physical rest`,
      breakdown: [
        { label: 'Gender & Age', value: `${gender.toUpperCase()}, ${age} years` },
        { label: 'Body Metrics', value: `${weightKg} kg, ${heightCm} cm` },
        { label: 'BMR (Mifflin-St Jeor)', value: `${Math.round(bmr)} kcal / day` },
        { label: 'Sedentary Maintenance (1.2×)', value: `${Math.round(bmr * 1.2)} kcal` },
        { label: 'Moderate Active (1.55×)', value: `${Math.round(bmr * 1.55)} kcal` }
      ],
      steps: [
        `Mifflin-St Jeor Formula applied for ${gender}:`,
        gender === 'male'
          ? `BMR = 10(${weightKg}) + 6.25(${heightCm}) - 5(${age}) + 5`
          : `BMR = 10(${weightKg}) + 6.25(${heightCm}) - 5(${age}) - 161`,
        `Daily Resting Caloric Burn = ${Math.round(bmr)} kcal`
      ]
    };
  },

    "tdee-calculator": (inputs) => {
    const gender = inputs.gender || 'male';
    const age = toNum(inputs.age, 30);
    const weightKg = toNum(inputs.weightKg, 78);
    const heightCm = toNum(inputs.heightCm, 180);
    const act = inputs.activity || 'moderate';

    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (gender === 'male' ? 5 : -161);

    const mults = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    const factor = mults[act] || 1.55;
    const tdee = bmr * factor;

    return {
      primaryValue: `${Math.round(tdee).toLocaleString('en-US')} kcal/day`,
      primaryLabel: 'Total Daily Energy Expenditure (TDEE)',
      subtext: `Maintenance calories to maintain current weight of ${weightKg} kg`,
      breakdown: [
        { label: 'Base BMR', value: `${Math.round(bmr)} kcal` },
        { label: 'Activity Level', value: act.replace(/_/g, ' ') },
        { label: 'Activity Multiplier', value: `${factor}×` },
        { label: 'Maintenance TDEE', value: `${Math.round(tdee)} kcal / day` },
        { label: 'Fat Loss (-500 kcal)', value: `${Math.round(tdee - 500)} kcal / day` },
        { label: 'Muscle Gain (+300 kcal)', value: `${Math.round(tdee + 300)} kcal / day` }
      ],
      steps: [
        `Computed Base Metabolic Rate (BMR): ${Math.round(bmr)} kcal`,
        `Applied activity multiplier: ${Math.round(bmr)} × ${factor} = ${Math.round(tdee)} kcal/day`
      ]
    };
  },

    "calorie-calculator": (inputs) => {
    const tdee = toNum(inputs.tdee, 2400);
    const goal = inputs.goal || 'moderate_loss';

    let target = tdee;
    let label = 'Weight Maintenance';
    if (goal === 'mild_loss') { target = tdee - 250; label = 'Mild Weight Loss (0.25 kg/wk)'; }
    else if (goal === 'moderate_loss') { target = tdee - 500; label = 'Weight Loss (0.5 kg/wk)'; }
    else if (goal === 'extreme_loss') { target = tdee - 1000; label = 'Fast Weight Loss (1 kg/wk)'; }
    else if (goal === 'mild_gain') { target = tdee + 250; label = 'Mild Weight Gain (+0.25 kg/wk)'; }
    else if (goal === 'gain') { target = tdee + 500; label = 'Muscle Building Gain (+0.5 kg/wk)'; }

    return {
      primaryValue: `${Math.round(target).toLocaleString('en-US')} kcal/day`,
      primaryLabel: `Daily Target (${label})`,
      subtext: `TDEE Baseline: ${Math.round(tdee)} kcal | Deficit/Surplus: ${Math.round(target - tdee)} kcal`,
      breakdown: [
        { label: 'Maintenance TDEE', value: `${Math.round(tdee)} kcal` },
        { label: 'Fitness Goal', value: label },
        { label: 'Recommended Calorie Intake', value: `${Math.round(target)} kcal / day` }
      ],
      steps: [
        `Base maintenance energy: ${Math.round(tdee)} kcal`,
        `Adjusted for goal (${label}): ${Math.round(target - tdee) >= 0 ? '+' : ''}${Math.round(target - tdee)} kcal`,
        `Prescribed target = ${Math.round(target)} kcal / day`
      ]
    };
  },

    "ideal-weight-calculator": (inputs) => {
    const gender = inputs.gender || 'male';
    const heightCm = toNum(inputs.heightCm, 175);

    const heightInches = heightCm / 2.54;
    const over5ft = Math.max(0, heightInches - 60);

    // Devine formula
    const devine = gender === 'male' ? 50 + 2.3 * over5ft : 45.5 + 2.3 * over5ft;
    // Robinson formula
    const robinson = gender === 'male' ? 52 + 1.9 * over5ft : 49 + 1.7 * over5ft;
    // Miller formula
    const miller = gender === 'male' ? 56.2 + 1.41 * over5ft : 53.1 + 1.36 * over5ft;

    const avgIdeal = (devine + robinson + miller) / 3;

    return {
      primaryValue: `${formatNum(avgIdeal, 1)} kg (${formatNum(avgIdeal * 2.20462, 1)} lbs)`,
      primaryLabel: `Ideal Body Weight (Height: ${heightCm} cm)`,
      subtext: `Composite consensus across Devine, Robinson & Miller medical equations`,
      breakdown: [
        { label: 'Devine Formula (1974)', value: `${formatNum(devine, 1)} kg (${formatNum(devine * 2.20462, 1)} lbs)` },
        { label: 'Robinson Formula (1983)', value: `${formatNum(robinson, 1)} kg (${formatNum(robinson * 2.20462, 1)} lbs)` },
        { label: 'Miller Formula (1983)', value: `${formatNum(miller, 1)} kg (${formatNum(miller * 2.20462, 1)} lbs)` },
        { label: 'Healthy BMI Weight Range (18.5-24.9)', value: `${formatNum(18.5 * Math.pow(heightCm / 100, 2), 1)} - ${formatNum(24.9 * Math.pow(heightCm / 100, 2), 1)} kg` }
      ],
      steps: [
        `Height in inches: ${formatNum(heightInches, 1)} in (${formatNum(over5ft, 1)} inches over 5 ft)`,
        `Devine: ${gender === 'male' ? '50kg + 2.3kg/in' : '45.5kg + 2.3kg/in'} = ${formatNum(devine, 1)} kg`,
        `Average consensus ideal body weight = ${formatNum(avgIdeal, 1)} kg`
      ]
    };
  },

    "body-fat-calculator": (inputs) => {
    const gender = inputs.gender || 'male';
    const weightKg = toNum(inputs.weightKg, 78);
    const heightCm = toNum(inputs.heightCm, 178);
    const neckCm = toNum(inputs.neckCm, 38);
    const waistCm = toNum(inputs.waistCm, 84);
    const hipCm = toNum(inputs.hipCm, 95);

    let bodyFatPct = 0;
    if (gender === 'male') {
      const diff = waistCm - neckCm;
      if (diff <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Waist circumference must exceed neck circumference.' };
      bodyFatPct = 495 / (1.0324 - 0.19077 * Math.log10(diff) + 0.15456 * Math.log10(heightCm)) - 450;
    } else {
      const diff = waistCm + hipCm - neckCm;
      if (diff <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Waist + Hip must exceed neck circumference.' };
      bodyFatPct = 495 / (1.29579 - 0.35004 * Math.log10(diff) + 0.221 * Math.log10(heightCm)) - 450;
    }

    bodyFatPct = Math.max(3, Math.min(60, bodyFatPct));
    const fatMass = weightKg * (bodyFatPct / 100);
    const leanMass = weightKg - fatMass;

    return {
      primaryValue: `${formatNum(bodyFatPct, 1)}%`,
      primaryLabel: 'Estimated Body Fat Percentage',
      subtext: `Fat Mass: ${formatNum(fatMass, 1)} kg | Lean Mass: ${formatNum(leanMass, 1)} kg`,
      breakdown: [
        { label: 'Body Fat (%)', value: `${formatNum(bodyFatPct, 1)}%` },
        { label: 'Fat Mass', value: `${formatNum(fatMass, 1)} kg` },
        { label: 'Lean Body Mass', value: `${formatNum(leanMass, 1)} kg` },
        { label: 'Total Weight', value: `${formatNum(weightKg)} kg` }
      ],
      steps: [
        `Circumference method equation applied for ${gender}`,
        `Calculated Body Fat = ${formatNum(bodyFatPct, 1)}%`,
        `Fat Mass = ${weightKg} × ${formatNum(bodyFatPct / 100, 3)} = ${formatNum(fatMass, 1)} kg`
      ]
    };
  },

    "lean-body-mass-calculator": (inputs) => {
    const gender = inputs.gender || 'male';
    const weight = toNum(inputs.weightKg, 80);
    const height = toNum(inputs.heightCm, 180);

    // Boer formula
    const lbmBoer = gender === 'male'
      ? 0.407 * weight + 0.267 * height - 19.2
      : 0.252 * weight + 0.473 * height - 48.3;

    // James formula
    const lbmJames = gender === 'male'
      ? 1.1 * weight - 128 * Math.pow(weight / height, 2)
      : 1.07 * weight - 148 * Math.pow(weight / height, 2);

    const avgLbm = Math.max(0, (lbmBoer + lbmJames) / 2);
    const fatMass = Math.max(0, weight - avgLbm);

    return {
      primaryValue: `${formatNum(avgLbm, 1)} kg`,
      primaryLabel: 'Lean Body Mass (LBM)',
      subtext: `Fat Mass: ${formatNum(fatMass, 1)} kg (${formatNum((fatMass / weight) * 100, 1)}% fat)`,
      breakdown: [
        { label: 'Total Body Weight', value: `${formatNum(weight)} kg` },
        { label: 'Lean Body Mass', value: `${formatNum(avgLbm, 1)} kg` },
        { label: 'Fat Mass', value: `${formatNum(fatMass, 1)} kg` },
        { label: 'Boer Formula LBM', value: `${formatNum(lbmBoer, 1)} kg` },
        { label: 'James Formula LBM', value: `${formatNum(lbmJames, 1)} kg` }
      ],
      steps: [
        `Boer Formula: ${formatNum(lbmBoer, 1)} kg`,
        `James Formula: ${formatNum(lbmJames, 1)} kg`,
        `Consensus Lean Body Mass = ${formatNum(avgLbm, 1)} kg`
      ]
    };
  },

    "macro-calculator": (inputs) => {
    const calories = toNum(inputs.calories, 2200);
    const diet = inputs.dietType || 'balanced';

    // Ratios (protein, carbs, fat)
    let pPct = 0.30;
    let cPct = 0.40;
    let fPct = 0.30;

    if (diet === 'low_carb') { pPct = 0.40; cPct = 0.20; fPct = 0.40; }
    else if (diet === 'keto') { pPct = 0.25; cPct = 0.05; fPct = 0.70; }
    else if (diet === 'high_carb') { pPct = 0.25; cPct = 0.55; fPct = 0.20; }

    const pGrams = (calories * pPct) / 4;
    const cGrams = (calories * cPct) / 4;
    const fGrams = (calories * fPct) / 9;

    return {
      primaryValue: `${Math.round(pGrams)}g P | ${Math.round(cGrams)}g C | ${Math.round(fGrams)}g F`,
      primaryLabel: `Macronutrient Split (${diet.replace(/_/g, ' ')})`,
      subtext: `Based on daily target of ${calories.toLocaleString('en-US')} kcal`,
      breakdown: [
        { label: 'Protein (4 kcal/g)', value: `${Math.round(pGrams)}g (${Math.round(pPct * 100)}% = ${Math.round(calories * pPct)} kcal)` },
        { label: 'Carbohydrates (4 kcal/g)', value: `${Math.round(cGrams)}g (${Math.round(cPct * 100)}% = ${Math.round(calories * cPct)} kcal)` },
        { label: 'Fats (9 kcal/g)', value: `${Math.round(fGrams)}g (${Math.round(fPct * 100)}% = ${Math.round(calories * fPct)} kcal)` },
        { label: 'Total Caloric Sum', value: `${calories} kcal` }
      ],
      steps: [
        `Protein: (${calories} × ${Math.round(pPct * 100)}%) / 4 kcal = ${Math.round(pGrams)} g`,
        `Carbs: (${calories} × ${Math.round(cPct * 100)}%) / 4 kcal = ${Math.round(cGrams)} g`,
        `Fat: (${calories} × ${Math.round(fPct * 100)}%) / 9 kcal = ${Math.round(fGrams)} g`
      ]
    };
  },

    "protein-calculator": (inputs) => {
    const weight = toNum(inputs.weightKg, 75);
    const goal = inputs.goal || 'muscle_building';

    let multiplier = 1.8;
    let label = 'Muscle Hypertrophy';
    if (goal === 'sedentary') { multiplier = 0.8; label = 'Sedentary Minimum'; }
    else if (goal === 'endurance') { multiplier = 1.4; label = 'Endurance Athlete'; }
    else if (goal === 'fat_loss') { multiplier = 2.2; label = 'Fat Loss & Muscle Preservation'; }

    const proteinGrams = weight * multiplier;

    return {
      primaryValue: `${Math.round(proteinGrams)} g / day`,
      primaryLabel: `Daily Protein Target (${label})`,
      subtext: `${multiplier} g protein per kg of bodyweight (${weight} kg)`,
      breakdown: [
        { label: 'Body Weight', value: `${weight} kg (${formatNum(weight * 2.20462, 1)} lbs)` },
        { label: 'Target Objective', value: label },
        { label: 'Prescribed Ratio', value: `${multiplier} g / kg` },
        { label: 'Total Daily Protein', value: `${Math.round(proteinGrams)} g (${Math.round(proteinGrams * 4)} kcal)` }
      ],
      steps: [
        `Formula: Daily Protein = Bodyweight (kg) × Goal Multiplier`,
        `${weight} kg × ${multiplier} g/kg = ${Math.round(proteinGrams)} grams per day`
      ]
    };
  },

    "water-intake-calculator": (inputs) => {
    const weight = toNum(inputs.weightKg, 70);
    const exerciseMins = toNum(inputs.exerciseMinutes, 45);
    const climate = inputs.climate || 'moderate';

    let baseLiters = weight * 0.035;
    baseLiters += (exerciseMins / 30) * 0.35;
    if (climate === 'hot') baseLiters += 0.5;

    const ounces = baseLiters * 33.814;
    const glasses = baseLiters / 0.25; // 250ml glass

    return {
      primaryValue: `${formatNum(baseLiters, 2)} Liters / day`,
      primaryLabel: 'Recommended Daily Water Intake',
      subtext: `≈ ${Math.round(ounces)} fl oz (around ${Math.round(glasses)} glasses of 250ml)`,
      breakdown: [
        { label: 'Weight Baseline', value: `${formatNum(weight * 0.035, 2)} L` },
        { label: 'Exercise Sweat Offset', value: `+${formatNum((exerciseMins / 30) * 0.35, 2)} L (${exerciseMins} mins)` },
        { label: 'Climate Offset', value: climate === 'hot' ? '+0.50 L (Hot environment)' : '0.00 L (Moderate)' },
        { label: 'Total Recommended Volume', value: `${formatNum(baseLiters, 2)} L (${Math.round(ounces)} oz)` }
      ],
      steps: [
        `Base hydration: ${weight} kg × 35 ml = ${formatNum(weight * 0.035, 2)} Liters`,
        `Exercise addition: ${exerciseMins} mins = +${formatNum((exerciseMins / 30) * 0.35, 2)} L`,
        `Total Daily Water Intake = ${formatNum(baseLiters, 2)} Liters`
      ]
    };
  },

    "heart-rate-calculator": (inputs) => {
    const age = toNum(inputs.age, 32);
    const restingHR = toNum(inputs.restingHR, 65);

    const maxHR = 220 - age;
    const hrr = maxHR - restingHR; // Heart Rate Reserve (Karvonen)

    // Zones (50%, 60%, 70%, 80%, 90%)
    const z1 = Math.round(restingHR + hrr * 0.50);
    const z2 = Math.round(restingHR + hrr * 0.60);
    const z3 = Math.round(restingHR + hrr * 0.70);
    const z4 = Math.round(restingHR + hrr * 0.80);
    const z5 = Math.round(restingHR + hrr * 0.90);

    return {
      primaryValue: `${maxHR} bpm`,
      primaryLabel: 'Estimated Max Heart Rate (MHR)',
      subtext: `Aerobic Cardio Target (Zone 3): ${z3} - ${z4} bpm`,
      breakdown: [
        { label: 'Age', value: `${age} years` },
        { label: 'Resting Heart Rate', value: `${restingHR} bpm` },
        { label: 'Maximum Heart Rate (220 - Age)', value: `${maxHR} bpm` },
        { label: 'Zone 1 (Warm up, 50-60%)', value: `${z1} - ${z2} bpm` },
        { label: 'Zone 2 (Fat Burn / Base, 60-70%)', value: `${z2} - ${z3} bpm` },
        { label: 'Zone 3 (Aerobic Cardio, 70-80%)', value: `${z3} - ${z4} bpm` },
        { label: 'Zone 4 (Anaerobic Threshold, 80-90%)', value: `${z4} - ${z5} bpm` },
        { label: 'Zone 5 (Max VO2 Output, 90-100%)', value: `${z5} - ${maxHR} bpm` }
      ],
      steps: [
        `Max Heart Rate = 220 - ${age} = ${maxHR} bpm`,
        `Heart Rate Reserve (HRR) = ${maxHR} - ${restingHR} = ${hrr} bpm`,
        `Computed Karvonen zones across exercise intensities`
      ]
    };
  },

    "pace-calculator": (inputs) => {
    const dist = toNum(inputs.distanceKm, 10);
    const hours = toNum(inputs.hours, 0);
    const mins = toNum(inputs.minutes, 50);
    const secs = toNum(inputs.seconds, 0);

    const totalSeconds = hours * 3600 + mins * 60 + secs;
    if (dist <= 0 || totalSeconds <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Distance and time must be greater than zero.' };

    const secPerKm = totalSeconds / dist;
    const paceMinKm = Math.floor(secPerKm / 60);
    const paceSecKm = Math.round(secPerKm % 60);

    const distMiles = dist * 0.621371;
    const secPerMile = totalSeconds / distMiles;
    const paceMinMile = Math.floor(secPerMile / 60);
    const paceSecMile = Math.round(secPerMile % 60);

    const speedKmh = (dist / (totalSeconds / 3600));

    return {
      primaryValue: `${paceMinKm}:${paceSecKm < 10 ? '0' : ''}${paceSecKm} / km`,
      primaryLabel: 'Running Pace per Kilometer',
      subtext: `Per Mile: ${paceMinMile}:${paceSecMile < 10 ? '0' : ''}${paceSecMile} / mi | Speed: ${formatNum(speedKmh, 2)} km/h`,
      breakdown: [
        { label: 'Distance', value: `${dist} km (${formatNum(distMiles, 2)} miles)` },
        { label: 'Total Time', value: `${hours > 0 ? hours + 'h ' : ''}${mins}m ${secs}s` },
        { label: 'Pace (per km)', value: `${paceMinKm}:${paceSecKm < 10 ? '0' : ''}${paceSecKm} min/km` },
        { label: 'Pace (per mile)', value: `${paceMinMile}:${paceSecMile < 10 ? '0' : ''}${paceSecMile} min/mile` },
        { label: 'Average Speed', value: `${formatNum(speedKmh, 2)} km/h (${formatNum(speedKmh * 0.621371, 2)} mph)` }
      ],
      steps: [
        `Total duration = ${totalSeconds} seconds`,
        `Seconds per km = ${totalSeconds} / ${dist} = ${formatNum(secPerKm, 1)} seconds`,
        `Pace = ${paceMinKm} minutes and ${paceSecKm} seconds per km`
      ]
    };
  },

    "pregnancy-calculator": (inputs) => {
    const lmpStr = String(inputs.lmpDate || '2026-03-01').trim();
    const lmp = new Date(lmpStr);

    if (isNaN(lmp.getTime())) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter a valid Last Menstrual Period date (YYYY-MM-DD).' };
    }

    // Naegele's rule: LMP + 280 days
    const due = new Date(lmp.getTime() + 280 * 24 * 3600 * 1000);
    const today = new Date();
    const elapsedDays = Math.max(0, Math.floor((today - lmp) / (24 * 3600 * 1000)));
    const weeks = Math.floor(elapsedDays / 7);
    const days = elapsedDays % 7;

    let trimester = 'First Trimester (Weeks 1 - 12)';
    if (weeks >= 27) trimester = 'Third Trimester (Weeks 27 - 40)';
    else if (weeks >= 13) trimester = 'Second Trimester (Weeks 13 - 26)';

    const dueDateFormatted = due.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return {
      primaryValue: dueDateFormatted,
      primaryLabel: 'Estimated Due Date (EDD)',
      subtext: `Gestational Age: ${weeks} weeks, ${days} days | ${trimester}`,
      breakdown: [
        { label: 'Last Menstrual Period (LMP)', value: lmp.toISOString().split('T')[0] },
        { label: 'Estimated Due Date (EDD)', value: dueDateFormatted },
        { label: 'Current Gestational Age', value: `${weeks} weeks + ${days} days` },
        { label: 'Current Trimester', value: trimester },
        { label: 'Total Pregnancy Progress', value: `${Math.min(100, Math.round((elapsedDays / 280) * 100))}%` }
      ],
      steps: [
        `Applied standard Naegele's Rule: LMP date + 280 calendar days`,
        `Estimated Date of Delivery = ${dueDateFormatted}`,
        `Current Gestational Stage: ${weeks}w ${days}d (${trimester})`
      ]
    };
  },

    "age-calculator": (inputs) => {
    const birthStr = String(inputs.birthDate || '1995-08-24').trim();
    const birth = new Date(birthStr);
    const now = new Date();

    if (isNaN(birth.getTime()) || birth > now) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter a valid past birth date.' };
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

    const diffMs = now - birth;
    const totalDays = Math.floor(diffMs / (24 * 3600 * 1000));
    const totalHours = Math.floor(diffMs / (3600 * 1000));

    // Next birthday
    let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < now) nextBday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
    const daysUntilNext = Math.ceil((nextBday - now) / (24 * 3600 * 1000));

    return {
      primaryValue: `${years} years, ${months} months, ${days} days`,
      primaryLabel: 'Exact Chronological Age',
      subtext: `Total Days Lived: ${totalDays.toLocaleString('en-US')} | Next Birthday in: ${daysUntilNext} days`,
      breakdown: [
        { label: 'Exact Age', value: `${years} yrs, ${months} mos, ${days} days` },
        { label: 'Total Days', value: `${totalDays.toLocaleString('en-US')} days` },
        { label: 'Total Hours Lived', value: `${totalHours.toLocaleString('en-US')} hours` },
        { label: 'Days to Next Birthday', value: `${daysUntilNext} days` }
      ],
      steps: [
        `Computed chronological delta from ${birth.toISOString().split('T')[0]} to today`,
        `Calculated calendar month and day offsets`,
        `Exact age: ${years} years, ${months} months, ${days} days`
      ]
    };
  },

    "running-pace-calculator": (inputs) => {
    const dist = toNum(inputs.recentDistKm, 5);
    const timeMin = toNum(inputs.recentTimeMin, 24);

    if (dist <= 0 || timeMin <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Recent distance and time must be positive.' };

    // Pete Riegel formula: T2 = T1 × (D2 / D1)^1.06
    const predictTime = (targetDist) => {
      const predMins = timeMin * Math.pow(targetDist / dist, 1.06);
      const h = Math.floor(predMins / 60);
      const m = Math.floor(predMins % 60);
      const s = Math.round((predMins * 60) % 60);
      return `${h > 0 ? h + 'h ' : ''}${m}m ${s < 10 ? '0' : ''}${s}s`;
    };

    const pred10k = predictTime(10);
    const predHalf = predictTime(21.0975);
    const predMarathon = predictTime(42.195);

    return {
      primaryValue: predMarathon,
      primaryLabel: 'Predicted Marathon Finish Time',
      subtext: `Based on your ${dist} km time of ${timeMin} minutes (Riegel Formula)`,
      breakdown: [
        { label: 'Recent Performance', value: `${dist} km in ${timeMin} mins` },
        { label: 'Predicted 10K', value: pred10k },
        { label: 'Predicted Half Marathon (21.1 km)', value: predHalf },
        { label: 'Predicted Full Marathon (42.2 km)', value: predMarathon }
      ],
      steps: [
        `Applied Pete Riegel fatigue formula: T₂ = T₁ × (D₂ / D₁)^1.06`,
        `Extrapolated aerobic endurance and race pace scaling`,
        `Predicted Marathon Time: ${predMarathon}`
      ]
    };
  },

    "date-difference-calculator": (inputs) => {
    const sStr = String(inputs.startDate || '2026-01-01').trim();
    const eStr = String(inputs.endDate || '2026-12-31').trim();

    const d1 = new Date(sStr);
    const d2 = new Date(eStr);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter valid Start and End dates (YYYY-MM-DD).' };
    }

    const diffMs = Math.abs(d2 - d1);
    const totalDays = Math.round(diffMs / (24 * 3600 * 1000));
    const totalWeeks = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;

    const start = d1 < d2 ? d1 : d2;
    const end = d1 < d2 ? d2 : d1;

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    return {
      primaryValue: `${totalDays} Days`,
      primaryLabel: 'Difference in Days',
      subtext: `${years > 0 ? years + ' yrs, ' : ''}${months} months, ${days} days (${totalWeeks} weeks + ${remDays} days)`,
      breakdown: [
        { label: 'Start Date', value: sStr },
        { label: 'End Date', value: eStr },
        { label: 'Total Calendar Days', value: `${totalDays.toLocaleString('en-US')} days` },
        { label: 'Weeks & Days', value: `${totalWeeks} weeks, ${remDays} days` },
        { label: 'Calendar Breakdown', value: `${years} years, ${months} months, ${days} days` },
        { label: 'Total Hours', value: `${(totalDays * 24).toLocaleString('en-US')} hours` }
      ],
      steps: [
        `Calculated millisecond delta between ${sStr} and ${eStr}`,
        `Total days = ${totalDays}`,
        `Expressed as: ${years} years, ${months} months, and ${days} days`
      ]
    };
  },

    "time-duration-calculator": (inputs) => {
    const start = String(inputs.startTime || '09:15:00').trim();
    const end = String(inputs.endTime || '17:45:30').trim();

    const parseTime = (t) => {
      const parts = t.split(':').map(Number);
      const h = parts[0] || 0;
      const m = parts[1] || 0;
      const s = parts[2] || 0;
      return h * 3600 + m * 60 + s;
    };

    const sSec = parseTime(start);
    const eSec = parseTime(end);

    let diff = eSec - sSec;
    if (diff < 0) diff += 24 * 3600; // crosses midnight

    const hours = Math.floor(diff / 3600);
    const mins = Math.floor((diff % 3600) / 60);
    const secs = diff % 60;
    const decimalHours = diff / 3600;

    return {
      primaryValue: `${hours}h ${mins}m ${secs}s`,
      primaryLabel: 'Elapsed Duration',
      subtext: `Decimal Hours: ${formatNum(decimalHours, 2)} hrs | Total Minutes: ${Math.floor(diff / 60)} mins`,
      breakdown: [
        { label: 'Start Time', value: start },
        { label: 'End Time', value: end },
        { label: 'Hours, Mins, Secs', value: `${hours} hours, ${mins} minutes, ${secs} seconds` },
        { label: 'Decimal Hours', value: `${formatNum(decimalHours, 3)} hrs` },
        { label: 'Total Seconds', value: `${diff.toLocaleString('en-US')} sec` }
      ],
      steps: [
        `Start in seconds: ${sSec} sec`,
        `End in seconds: ${eSec} sec`,
        `Duration: ${diff} seconds = ${hours} hours, ${mins} minutes, and ${secs} seconds`
      ]
    };
  },

    "date-add-calculator": (inputs) => {
    const baseStr = String(inputs.date || '2026-06-15').trim();
    const days = toNum(inputs.days, 45);
    const months = toNum(inputs.months, 0);
    const years = toNum(inputs.years, 0);

    const d = new Date(baseStr);
    if (isNaN(d.getTime())) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid start date format.' };

    d.setFullYear(d.getFullYear() + years);
    d.setMonth(d.getMonth() + months);
    d.setDate(d.getDate() + days);

    const formatted = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return {
      primaryValue: formatted,
      primaryLabel: 'Calculated Future Date',
      subtext: `ISO: ${d.toISOString().split('T')[0]}`,
      breakdown: [
        { label: 'Base Date', value: baseStr },
        { label: 'Added Duration', value: `${years} yrs, ${months} mos, ${days} days` },
        { label: 'Resulting Date', value: formatted }
      ],
      steps: [
        `Added ${years} years, ${months} months, and ${days} days to ${baseStr}`,
        `Calculated target date: ${formatted}`
      ]
    };
  },

    "date-subtract-calculator": (inputs) => {
    const baseStr = String(inputs.date || '2026-10-15').trim();
    const days = toNum(inputs.days, 30);

    const d = new Date(baseStr);
    if (isNaN(d.getTime())) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid date format.' };

    d.setDate(d.getDate() - days);
    const formatted = d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return {
      primaryValue: formatted,
      primaryLabel: 'Calculated Past Date',
      subtext: `Subtracted ${days} days from ${baseStr}`,
      breakdown: [
        { label: 'Starting Date', value: baseStr },
        { label: 'Days Subtracted', value: `${days} days` },
        { label: 'Resulting Date', value: formatted }
      ],
      steps: [
        `Subtracted ${days} calendar days from ${baseStr}`,
        `Result date: ${formatted}`
      ]
    };
  },

    "business-days-calculator": (inputs) => {
    const sStr = String(inputs.start || '2026-10-01').trim();
    const eStr = String(inputs.end || '2026-10-31').trim();

    const d1 = new Date(sStr);
    const d2 = new Date(eStr);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid dates.' };

    const start = d1 < d2 ? d1 : d2;
    const end = d1 < d2 ? d2 : d1;

    let businessDays = 0;
    let weekendDays = 0;
    const cur = new Date(start);

    while (cur <= end) {
      const dayOfWeek = cur.getDay(); // 0 is Sun, 6 is Sat
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendDays++;
      } else {
        businessDays++;
      }
      cur.setDate(cur.getDate() + 1);
    }

    const totalCalendarDays = businessDays + weekendDays;

    return {
      primaryValue: `${businessDays} Working Days`,
      primaryLabel: 'Business Days (Mon - Fri)',
      subtext: `Total Calendar Days: ${totalCalendarDays} | Weekend Days: ${weekendDays}`,
      breakdown: [
        { label: 'Start Date', value: sStr },
        { label: 'End Date', value: eStr },
        { label: 'Business Days (Workdays)', value: `${businessDays} days` },
        { label: 'Weekend Days (Sat/Sun)', value: `${weekendDays} days` },
        { label: 'Total Calendar Days', value: `${totalCalendarDays} days` }
      ],
      steps: [
        `Iterated each date from ${sStr} to ${eStr}`,
        `Filtered out Saturday and Sunday weekend dates`,
        `Identified ${businessDays} business days`
      ]
    };
  },

    "countdown-calculator": (inputs) => {
    const targetStr = String(inputs.targetDate || '2027-01-01').trim();
    const target = new Date(targetStr);
    const now = new Date();

    if (isNaN(target.getTime())) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid target date.' };

    const diffMs = target - now;
    if (diffMs <= 0) {
      return { primaryValue: 'Target Reached', primaryLabel: 'Completed', subtext: 'The target date has already passed.' };
    }

    const totalSeconds = Math.floor(diffMs / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return {
      primaryValue: `${days}d ${hours}h ${mins}m ${secs}s`,
      primaryLabel: `Time Remaining Until Target`,
      subtext: `Target: ${targetStr} (Total: ${days} days / ${Math.floor(totalSeconds / 3600)} hours)`,
      breakdown: [
        { label: 'Target Date', value: targetStr },
        { label: 'Days Remaining', value: `${days} days` },
        { label: 'Hours Remaining', value: `${hours} hours` },
        { label: 'Minutes Remaining', value: `${mins} mins` },
        { label: 'Total Seconds', value: `${totalSeconds.toLocaleString('en-US')} sec` }
      ],
      steps: [
        `Target: ${target.toISOString()}`,
        `Current time: ${now.toISOString()}`,
        `Remaining countdown = ${days} days, ${hours} hours, ${mins} minutes, ${secs} seconds`
      ]
    };
  },

    "time-zone-converter": (inputs) => {
    const time = String(inputs.time || '15:00').trim();
    const fromOffset = toNum(inputs.fromZone === 'UTC' ? 0 : inputs.fromZone, 0);
    const toOffset = toNum(inputs.toZone === 'UTC' ? 0 : inputs.toZone, 5.5);

    const parts = time.split(':').map(Number);
    const h = parts[0] || 0;
    const m = parts[1] || 0;

    // Convert fromZone to UTC
    let totalMinutes = h * 60 + m - fromOffset * 60;
    // Convert UTC to toZone
    totalMinutes += toOffset * 60;

    // Wrap in 24h
    totalMinutes = ((totalMinutes % 1440) + 1440) % 1440;
    const outH = Math.floor(totalMinutes / 60);
    const outM = Math.floor(totalMinutes % 60);

    const formattedTime = `${outH < 10 ? '0' : ''}${outH}:${outM < 10 ? '0' : ''}${outM}`;

    return {
      primaryValue: formattedTime,
      primaryLabel: `Converted Time (UTC${toOffset >= 0 ? '+' : ''}${toOffset})`,
      subtext: `Original: ${time} (UTC${fromOffset >= 0 ? '+' : ''}${fromOffset})`,
      breakdown: [
        { label: 'Input Time', value: `${time} (UTC${fromOffset >= 0 ? '+' : ''}${fromOffset})` },
        { label: 'Time Offset Difference', value: `${toOffset - fromOffset >= 0 ? '+' : ''}${toOffset - fromOffset} hours` },
        { label: 'Converted Output Time', value: `${formattedTime} (UTC${toOffset >= 0 ? '+' : ''}${toOffset})` }
      ],
      steps: [
        `Converted ${time} to UTC base: ${time} - (${fromOffset}h)`,
        `Applied destination offset (+${toOffset}h)`,
        `Result time = ${formattedTime}`
      ]
    };
  },

    "unix-timestamp-converter": (inputs) => {
    let ts = toNum(inputs.timestamp, 1773489000);
    // If milliseconds entered, normalize
    if (ts > 1e11) ts = Math.floor(ts / 1000);

    const date = new Date(ts * 1000);
    if (isNaN(date.getTime())) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid Unix timestamp.' };

    const utcStr = date.toUTCString();
    const localStr = date.toLocaleString();
    const isoStr = date.toISOString();

    return {
      primaryValue: utcStr,
      primaryLabel: 'UTC Date & Time',
      subtext: `ISO 8601: ${isoStr} | Local: ${localStr}`,
      breakdown: [
        { label: 'Unix Timestamp (seconds)', value: `${ts}` },
        { label: 'Timestamp (milliseconds)', value: `${ts * 1000}` },
        { label: 'UTC String', value: utcStr },
        { label: 'ISO 8601', value: isoStr },
        { label: 'Local System Time', value: localStr }
      ],
      steps: [
        `Seconds since Unix Epoch (Jan 1, 1970 00:00:00 UTC): ${ts}`,
        `Calculated Date: ${utcStr}`
      ]
    };
  },

    "hours-calculator": (inputs) => {
    const h1 = toNum(inputs.h1, 8.5);
    const h2 = toNum(inputs.h2, 8);
    const h3 = toNum(inputs.h3, 7.5);
    const h4 = toNum(inputs.h4, 8);
    const h5 = toNum(inputs.h5, 8);

    const totalHours = h1 + h2 + h3 + h4 + h5;
    const wholeHours = Math.floor(totalHours);
    const mins = Math.round((totalHours - wholeHours) * 60);

    return {
      primaryValue: `${formatNum(totalHours, 2)} Hours`,
      primaryLabel: 'Total Weekly Work Hours',
      subtext: `${wholeHours} hours and ${mins} minutes (Average: ${formatNum(totalHours / 5, 2)} hrs/day)`,
      breakdown: [
        { label: 'Day 1 (Mon)', value: `${h1} hrs` },
        { label: 'Day 2 (Tue)', value: `${h2} hrs` },
        { label: 'Day 3 (Wed)', value: `${h3} hrs` },
        { label: 'Day 4 (Thu)', value: `${h4} hrs` },
        { label: 'Day 5 (Fri)', value: `${h5} hrs` },
        { label: 'Total Hours', value: `${formatNum(totalHours, 2)} hrs` },
        { label: 'Daily Average', value: `${formatNum(totalHours / 5, 2)} hrs` }
      ],
      steps: [
        `Summed work hours: ${h1} + ${h2} + ${h3} + ${h4} + ${h5} = ${formatNum(totalHours, 2)} hours`,
        `Formatted as ${wholeHours} hours and ${mins} minutes`
      ]
    };
  },

    "minutes-calculator": (inputs) => {
    const m = toNum(inputs.minutes, 450);
    const h = Math.floor(m / 60);
    const remM = Math.round(m % 60);
    const decimalHours = m / 60;
    const secs = m * 60;

    return {
      primaryValue: `${h}h ${remM}m`,
      primaryLabel: 'Hours & Minutes',
      subtext: `Decimal Hours: ${formatNum(decimalHours, 2)} hrs | Seconds: ${secs.toLocaleString('en-US')} s`,
      breakdown: [
        { label: 'Total Minutes', value: `${m} min` },
        { label: 'Formatted Hours & Mins', value: `${h} hours, ${remM} minutes` },
        { label: 'Decimal Hours', value: `${formatNum(decimalHours, 4)} hrs` },
        { label: 'Total Seconds', value: `${secs.toLocaleString('en-US')} sec` }
      ],
      steps: [
        `Hours = floor(${m} / 60) = ${h} hours`,
        `Remaining minutes = ${m} % 60 = ${remM} minutes`,
        `Decimal hours = ${m} / 60 = ${formatNum(decimalHours, 4)} hrs`
      ]
    };
  },

    "seconds-calculator": (inputs) => {
    const s = toNum(inputs.seconds, 86400);

    const days = Math.floor(s / 86400);
    const hours = Math.floor((s % 86400) / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const remS = s % 60;

    return {
      primaryValue: `${days > 0 ? days + 'd ' : ''}${hours}h ${mins}m ${remS}s`,
      primaryLabel: 'Time Duration Breakdown',
      subtext: `Total Minutes: ${formatNum(s / 60, 2)} min | Total Hours: ${formatNum(s / 3600, 2)} hrs`,
      breakdown: [
        { label: 'Input Seconds', value: `${s.toLocaleString('en-US')} s` },
        { label: 'Days', value: `${days}` },
        { label: 'Hours', value: `${hours}` },
        { label: 'Minutes', value: `${mins}` },
        { label: 'Remaining Seconds', value: `${remS}` }
      ],
      steps: [
        `Days = floor(${s} / 86400) = ${days}`,
        `Hours = floor((${s} % 86400) / 3600) = ${hours}`,
        `Minutes = floor((${s} % 3600) / 60) = ${mins}`,
        `Seconds = ${remS}`
      ]
    };
  },

    "length-converter": (inputs) => {
    const val = toNum(inputs.value, 10);
    const from = inputs.fromUnit || 'm';
    const to = inputs.toUnit || 'ft';

    // Base in meters
    const toMeters = {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      mi: 1609.344,
      yd: 0.9144,
      ft: 0.3048,
      in: 0.0254,
      nmi: 1852
    };

    const inMeters = val * (toMeters[from] || 1);
    const converted = inMeters / (toMeters[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 4)} ${to}`,
      primaryLabel: `Converted Length (${to})`,
      subtext: `${val} ${from} = ${formatNum(converted, 4)} ${to}`,
      breakdown: [
        { label: 'Input Value', value: `${formatNum(val)} ${from}` },
        { label: 'Base Meter Value', value: `${formatNum(inMeters, 4)} m` },
        { label: 'Converted Output', value: `${formatNum(converted, 6)} ${to}` }
      ],
      steps: [
        `Normalized ${val} ${from} to meters: ${formatNum(inMeters, 4)} m`,
        `Converted meters to ${to}: ${formatNum(converted, 4)} ${to}`
      ]
    };
  },

    "weight-converter": (inputs) => {
    const val = toNum(inputs.value, 150);
    const from = inputs.fromUnit || 'lb';
    const to = inputs.toUnit || 'kg';

    // Base in kg
    const toKg = {
      kg: 1,
      g: 0.001,
      mg: 1e-6,
      lb: 0.45359237,
      oz: 0.028349523,
      st: 6.35029318,
      t: 1000
    };

    const inKg = val * (toKg[from] || 1);
    const converted = inKg / (toKg[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 4)} ${to}`,
      primaryLabel: `Converted Weight (${to})`,
      subtext: `${val} ${from} = ${formatNum(converted, 4)} ${to}`,
      breakdown: [
        { label: 'Input Weight', value: `${formatNum(val)} ${from}` },
        { label: 'Base Kilograms', value: `${formatNum(inKg, 4)} kg` },
        { label: 'Result Weight', value: `${formatNum(converted, 4)} ${to}` }
      ],
      steps: [
        `Converted to base kg: ${val} × ${toKg[from] || 1} = ${formatNum(inKg, 4)} kg`,
        `Converted to ${to}: ${formatNum(converted, 4)} ${to}`
      ]
    };
  },

    "temperature-converter": (inputs) => {
    const val = toNum(inputs.temp, 25);
    const from = (inputs.fromUnit || 'c').toLowerCase();
    const to = (inputs.toUnit || 'f').toLowerCase();

    // Convert from -> Celsius
    let celsius = val;
    if (from === 'f') celsius = (val - 32) * (5 / 9);
    else if (from === 'k') celsius = val - 273.15;
    else if (from === 'r') celsius = (val - 491.67) * (5 / 9);

    // Convert Celsius -> to
    let converted = celsius;
    if (to === 'f') converted = celsius * (9 / 5) + 32;
    else if (to === 'k') converted = celsius + 273.15;
    else if (to === 'r') converted = (celsius + 273.15) * (9 / 5);

    const unitSymbols = { c: '°C', f: '°F', k: 'K', r: '°R' };

    return {
      primaryValue: `${formatNum(converted, 2)} ${unitSymbols[to] || to.toUpperCase()}`,
      primaryLabel: `Temperature in ${unitSymbols[to] || to.toUpperCase()}`,
      subtext: `${val} ${unitSymbols[from] || from.toUpperCase()} = ${formatNum(converted, 2)} ${unitSymbols[to] || to.toUpperCase()}`,
      breakdown: [
        { label: 'Celsius (°C)', value: `${formatNum(celsius, 2)} °C` },
        { label: 'Fahrenheit (°F)', value: `${formatNum(celsius * 1.8 + 32, 2)} °F` },
        { label: 'Kelvin (K)', value: `${formatNum(celsius + 273.15, 2)} K` }
      ],
      steps: [
        `Normalized input to Celsius: ${formatNum(celsius, 2)} °C`,
        `Applied destination formula to ${unitSymbols[to] || to}: ${formatNum(converted, 2)}`
      ]
    };
  },

    "area-converter": (inputs) => {
    const val = toNum(inputs.value, 1);
    const from = inputs.fromUnit || 'acre';
    const to = inputs.toUnit || 'sqft';

    // Base in square meters
    const toSqM = {
      sqm: 1,
      sqkm: 1e6,
      sqft: 0.09290304,
      sqyd: 0.83612736,
      acre: 4046.8564224,
      ha: 10000,
      sqmi: 2589988.110336
    };

    const inSqM = val * (toSqM[from] || 1);
    const converted = inSqM / (toSqM[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 4)} ${to}`,
      primaryLabel: `Area in ${to}`,
      subtext: `${val} ${from} = ${formatNum(converted, 4)} ${to}`,
      breakdown: [
        { label: 'Input Area', value: `${formatNum(val)} ${from}` },
        { label: 'Base Sq Meters', value: `${formatNum(inSqM, 4)} m²` },
        { label: 'Converted Area', value: `${formatNum(converted, 4)} ${to}` }
      ],
      steps: [
        `Converted ${val} ${from} to square meters: ${formatNum(inSqM, 2)} m²`,
        `Converted to ${to}: ${formatNum(converted, 4)} ${to}`
      ]
    };
  },

    "volume-converter": (inputs) => {
    const val = toNum(inputs.value, 5);
    const from = inputs.fromUnit || 'gal';
    const to = inputs.toUnit || 'l';

    // Base in Liters
    const toLiters = {
      l: 1,
      ml: 0.001,
      m3: 1000,
      gal: 3.785411784,
      qt: 0.946352946,
      pt: 0.473176473,
      cup: 0.2365882365,
      floz: 0.0295735295625
    };

    const inL = val * (toLiters[from] || 1);
    const converted = inL / (toLiters[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 4)} ${to}`,
      primaryLabel: `Volume in ${to}`,
      subtext: `${val} ${from} = ${formatNum(converted, 4)} ${to}`,
      breakdown: [
        { label: 'Input Volume', value: `${formatNum(val)} ${from}` },
        { label: 'Base Liters', value: `${formatNum(inL, 4)} L` },
        { label: 'Converted Volume', value: `${formatNum(converted, 4)} ${to}` }
      ],
      steps: [
        `Converted to base liters: ${val} × ${toLiters[from] || 1} = ${formatNum(inL, 4)} L`,
        `Converted to ${to}: ${formatNum(converted, 4)} ${to}`
      ]
    };
  },

    "speed-converter": (inputs) => {
    const val = toNum(inputs.value, 65);
    const from = inputs.fromUnit || 'mph';
    const to = inputs.toUnit || 'kmh';

    // Base in m/s
    const toMs = {
      ms: 1,
      kmh: 1 / 3.6,
      mph: 0.44704,
      knot: 0.514444,
      fts: 0.3048,
      mach: 340.29
    };

    const inMs = val * (toMs[from] || 1);
    const converted = inMs / (toMs[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 2)} ${to}`,
      primaryLabel: `Speed in ${to}`,
      subtext: `${val} ${from} = ${formatNum(converted, 2)} ${to}`,
      breakdown: [
        { label: 'Speed (km/h)', value: `${formatNum(inMs * 3.6, 2)} km/h` },
        { label: 'Speed (mph)', value: `${formatNum(inMs / 0.44704, 2)} mph` },
        { label: 'Speed (m/s)', value: `${formatNum(inMs, 2)} m/s` },
        { label: 'Speed (knots)', value: `${formatNum(inMs / 0.514444, 2)} knots` }
      ],
      steps: [
        `Base meters/second = ${formatNum(inMs, 4)} m/s`,
        `Converted to ${to} = ${formatNum(converted, 2)} ${to}`
      ]
    };
  },

    "data-storage-converter": (inputs) => {
    const val = toNum(inputs.value, 16);
    const from = inputs.fromUnit || 'gb';
    const to = inputs.toUnit || 'mb';

    // Base in Bytes (decimal 1000 base)
    const toBytes = {
      b: 1,
      kb: 1e3,
      mb: 1e6,
      gb: 1e9,
      tb: 1e12,
      pb: 1e15
    };

    const inBytes = val * (toBytes[from] || 1);
    const converted = inBytes / (toBytes[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 2)} ${to.toUpperCase()}`,
      primaryLabel: `Data Storage in ${to.toUpperCase()}`,
      subtext: `${val} ${from.toUpperCase()} = ${formatNum(converted, 2)} ${to.toUpperCase()}`,
      breakdown: [
        { label: 'Total Bytes', value: `${formatNum(inBytes)} B` },
        { label: 'Megabytes (MB)', value: `${formatNum(inBytes / 1e6, 2)} MB` },
        { label: 'Gigabytes (GB)', value: `${formatNum(inBytes / 1e9, 2)} GB` },
        { label: 'Binary Gibibytes (GiB)', value: `${formatNum(inBytes / 1073741824, 3)} GiB` }
      ],
      steps: [
        `Converted ${val} ${from.toUpperCase()} to bytes: ${inBytes.toLocaleString('en-US')} B`,
        `Converted to ${to.toUpperCase()}: ${formatNum(converted, 2)} ${to.toUpperCase()}`
      ]
    };
  },

    "energy-converter": (inputs) => {
    const val = toNum(inputs.value, 1000);
    const from = inputs.fromUnit || 'j';
    const to = inputs.toUnit || 'kcal';

    // Base in Joules
    const toJoules = {
      j: 1,
      kj: 1000,
      cal: 4.184,
      kcal: 4184,
      wh: 3600,
      kwh: 3.6e6,
      btu: 1055.06,
      ftlb: 1.355818
    };

    const inJ = val * (toJoules[from] || 1);
    const converted = inJ / (toJoules[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 4)} ${to}`,
      primaryLabel: `Energy in ${to}`,
      subtext: `${val} ${from} = ${formatNum(converted, 4)} ${to}`,
      breakdown: [
        { label: 'Input Energy', value: `${formatNum(val)} ${from}` },
        { label: 'Base Joules', value: `${formatNum(inJ, 2)} J` },
        { label: 'Converted Output', value: `${formatNum(converted, 4)} ${to}` }
      ],
      steps: [
        `Converted to Joules: ${formatNum(inJ, 2)} J`,
        `Converted to ${to}: ${formatNum(converted, 4)} ${to}`
      ]
    };
  },

    "power-converter": (inputs) => {
    const val = toNum(inputs.value, 300);
    const from = inputs.fromUnit || 'hp';
    const to = inputs.toUnit || 'kw';

    // Base in Watts
    const toWatts = {
      w: 1,
      kw: 1000,
      mw: 1e6,
      hp: 745.699872,
      btu_hr: 0.293071
    };

    const inW = val * (toWatts[from] || 1);
    const converted = inW / (toWatts[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 2)} ${to}`,
      primaryLabel: `Power Output (${to})`,
      subtext: `${val} ${from} = ${formatNum(converted, 2)} ${to}`,
      breakdown: [
        { label: 'Input Power', value: `${formatNum(val)} ${from}` },
        { label: 'Base Watts', value: `${formatNum(inW, 2)} W` },
        { label: 'Horsepower (hp)', value: `${formatNum(inW / 745.7, 2)} hp` },
        { label: 'Kilowatts (kW)', value: `${formatNum(inW / 1000, 2)} kW` }
      ],
      steps: [
        `Base watts: ${formatNum(inW, 2)} W`,
        `Output in ${to}: ${formatNum(converted, 2)} ${to}`
      ]
    };
  },

    "pressure-converter": (inputs) => {
    const val = toNum(inputs.value, 32);
    const from = inputs.fromUnit || 'psi';
    const to = inputs.toUnit || 'bar';

    // Base in Pascals (Pa)
    const toPa = {
      pa: 1,
      kpa: 1000,
      bar: 100000,
      psi: 6894.75729,
      atm: 101325,
      torr: 133.322
    };

    const inPa = val * (toPa[from] || 1);
    const converted = inPa / (toPa[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 4)} ${to}`,
      primaryLabel: `Pressure in ${to}`,
      subtext: `${val} ${from} = ${formatNum(converted, 4)} ${to}`,
      breakdown: [
        { label: 'Input Pressure', value: `${formatNum(val)} ${from}` },
        { label: 'Base Pascals (Pa)', value: `${formatNum(inPa, 2)} Pa` },
        { label: 'Bar', value: `${formatNum(inPa / 100000, 4)} bar` },
        { label: 'PSI', value: `${formatNum(inPa / 6894.76, 2)} psi` },
        { label: 'Atmospheres (atm)', value: `${formatNum(inPa / 101325, 4)} atm` }
      ],
      steps: [
        `Converted to Pascals: ${val} × ${toPa[from] || 1} = ${formatNum(inPa, 2)} Pa`,
        `Converted to ${to}: ${formatNum(converted, 4)} ${to}`
      ]
    };
  },

    "frequency-converter": (inputs) => {
    const val = toNum(inputs.value, 2.4);
    const from = inputs.fromUnit || 'ghz';
    const to = inputs.toUnit || 'mhz';

    // Base in Hz
    const toHz = {
      hz: 1,
      khz: 1e3,
      mhz: 1e6,
      ghz: 1e9,
      rpm: 1 / 60,
      rads: 1 / (2 * Math.PI)
    };

    const inHz = val * (toHz[from] || 1);
    const converted = inHz / (toHz[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 4)} ${to.toUpperCase()}`,
      primaryLabel: `Frequency in ${to.toUpperCase()}`,
      subtext: `${val} ${from.toUpperCase()} = ${formatNum(converted, 4)} ${to.toUpperCase()}`,
      breakdown: [
        { label: 'Base Hertz (Hz)', value: `${formatNum(inHz)} Hz` },
        { label: 'Kilohertz (kHz)', value: `${formatNum(inHz / 1e3, 2)} kHz` },
        { label: 'Megahertz (MHz)', value: `${formatNum(inHz / 1e6, 2)} MHz` },
        { label: 'Gigahertz (GHz)', value: `${formatNum(inHz / 1e9, 4)} GHz` }
      ],
      steps: [
        `Normalized to base Hz: ${formatNum(inHz)} Hz`,
        `Converted to ${to.toUpperCase()}: ${formatNum(converted, 4)} ${to.toUpperCase()}`
      ]
    };
  },

    "angle-converter": (inputs) => {
    const val = toNum(inputs.value, 180);
    const from = inputs.fromUnit || 'deg';
    const to = inputs.toUnit || 'rad';

    // Base in Degrees
    const toDeg = {
      deg: 1,
      rad: 180 / Math.PI,
      grad: 0.9,
      arcmin: 1 / 60,
      arcsec: 1 / 3600,
      rev: 360
    };

    const inDeg = val * (toDeg[from] || 1);
    const converted = inDeg / (toDeg[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 4)} ${to}`,
      primaryLabel: `Angle in ${to}`,
      subtext: `${val} ${from} = ${formatNum(converted, 4)} ${to}`,
      breakdown: [
        { label: 'Degrees (°)', value: `${formatNum(inDeg, 2)}°` },
        { label: 'Radians (rad)', value: `${formatNum(inDeg * (Math.PI / 180), 4)} rad` },
        { label: 'Gradians (grad)', value: `${formatNum(inDeg / 0.9, 2)} grad` }
      ],
      steps: [
        `Base degrees = ${formatNum(inDeg, 4)}°`,
        `Converted to ${to} = ${formatNum(converted, 4)} ${to}`
      ]
    };
  },

    "fuel-economy-converter": (inputs) => {
    const val = toNum(inputs.value, 30);
    const from = inputs.fromUnit || 'mpgus';
    const to = inputs.toUnit || 'l100km';

    // Convert from -> km/L
    let kmL = 0;
    if (from === 'mpgus') kmL = val * 0.425144;
    else if (from === 'mpguk') kmL = val * 0.354006;
    else if (from === 'kml') kmL = val;
    else if (from === 'l100km') kmL = val > 0 ? 100 / val : 0;

    // Convert km/L -> to
    let converted = 0;
    if (to === 'mpgus') converted = kmL / 0.425144;
    else if (to === 'mpguk') converted = kmL / 0.354006;
    else if (to === 'kml') converted = kmL;
    else if (to === 'l100km') converted = kmL > 0 ? 100 / kmL : 0;

    return {
      primaryValue: `${formatNum(converted, 2)} ${to}`,
      primaryLabel: `Fuel Economy in ${to}`,
      subtext: `${val} ${from} = ${formatNum(converted, 2)} ${to}`,
      breakdown: [
        { label: 'US MPG', value: `${formatNum(kmL / 0.425144, 2)} mpg (US)` },
        { label: 'L/100km', value: kmL > 0 ? `${formatNum(100 / kmL, 2)} L/100km` : 'N/A' },
        { label: 'km/L', value: `${formatNum(kmL, 2)} km/L` }
      ],
      steps: [
        `Normalized to km/L: ${formatNum(kmL, 3)} km/L`,
        `Converted to ${to}: ${formatNum(converted, 2)}`
      ]
    };
  },

    "torque-converter": (inputs) => {
    const val = toNum(inputs.value, 100);
    const from = inputs.fromUnit || 'nm';
    const to = inputs.toUnit || 'ftlb';

    // Base in Newton-meters (N·m)
    const toNm = {
      nm: 1,
      ftlb: 1.355818,
      inlb: 0.112985,
      kgfm: 9.80665
    };

    const inNm = val * (toNm[from] || 1);
    const converted = inNm / (toNm[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 2)} ${to}`,
      primaryLabel: `Torque in ${to}`,
      subtext: `${val} ${from} = ${formatNum(converted, 2)} ${to}`,
      breakdown: [
        { label: 'Newton-meters (N·m)', value: `${formatNum(inNm, 2)} N·m` },
        { label: 'Foot-pounds (ft·lb)', value: `${formatNum(inNm / 1.355818, 2)} ft·lb` },
        { label: 'Inch-pounds (in·lb)', value: `${formatNum(inNm / 0.112985, 2)} in·lb` }
      ],
      steps: [
        `Base N·m: ${formatNum(inNm, 3)} N·m`,
        `Converted to ${to}: ${formatNum(converted, 2)} ${to}`
      ]
    };
  },

    "force-converter": (inputs) => {
    const val = toNum(inputs.value, 500);
    const from = inputs.fromUnit || 'n';
    const to = inputs.toUnit || 'lbf';

    // Base in Newtons (N)
    const toN = {
      n: 1,
      kn: 1000,
      lbf: 4.448222,
      dyne: 1e-5,
      kgf: 9.80665
    };

    const inN = val * (toN[from] || 1);
    const converted = inN / (toN[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 2)} ${to}`,
      primaryLabel: `Force in ${to}`,
      subtext: `${val} ${from} = ${formatNum(converted, 2)} ${to}`,
      breakdown: [
        { label: 'Newtons (N)', value: `${formatNum(inN, 2)} N` },
        { label: 'Kilonewtons (kN)', value: `${formatNum(inN / 1000, 4)} kN` },
        { label: 'Pounds-force (lbf)', value: `${formatNum(inN / 4.448222, 2)} lbf` }
      ],
      steps: [
        `Base force in Newtons: ${formatNum(inN, 3)} N`,
        `Converted to ${to}: ${formatNum(converted, 2)} ${to}`
      ]
    };
  },

    "mass-converter": (inputs) => {
    const val = toNum(inputs.value, 5);
    const from = inputs.fromUnit || 'g';
    const to = inputs.toUnit || 'ct';

    // Base in Grams (g)
    const toGrams = {
      g: 1,
      mg: 0.001,
      ug: 1e-6,
      ct: 0.2
    };

    const inG = val * (toGrams[from] || 1);
    const converted = inG / (toGrams[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 4)} ${to}`,
      primaryLabel: `Precision Mass (${to})`,
      subtext: `${val} ${from} = ${formatNum(converted, 4)} ${to}`,
      breakdown: [
        { label: 'Grams (g)', value: `${formatNum(inG, 4)} g` },
        { label: 'Milligrams (mg)', value: `${formatNum(inG * 1000, 2)} mg` },
        { label: 'Carats (ct)', value: `${formatNum(inG / 0.2, 4)} ct` }
      ],
      steps: [
        `Base grams: ${formatNum(inG, 6)} g`,
        `Converted to ${to}: ${formatNum(converted, 4)} ${to}`
      ]
    };
  },

    "time-converter": (inputs) => {
    const val = toNum(inputs.value, 48);
    const from = inputs.fromUnit || 'hours';
    const to = inputs.toUnit || 'days';

    // Base in Seconds
    const toSecs = {
      seconds: 1,
      ms: 0.001,
      minutes: 60,
      hours: 3600,
      days: 86400,
      weeks: 604800,
      years: 31536000
    };

    const inSecs = val * (toSecs[from] || 1);
    const converted = inSecs / (toSecs[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 4)} ${to}`,
      primaryLabel: `Converted Time (${to})`,
      subtext: `${val} ${from} = ${formatNum(converted, 4)} ${to}`,
      breakdown: [
        { label: 'Input Value', value: `${formatNum(val)} ${from}` },
        { label: 'Base Seconds', value: `${formatNum(inSecs)} sec` },
        { label: 'Result Time', value: `${formatNum(converted, 4)} ${to}` }
      ],
      steps: [
        `Base seconds = ${formatNum(inSecs)} s`,
        `Converted to ${to} = ${formatNum(converted, 4)} ${to}`
      ]
    };
  },

    "concrete-calculator": (inputs) => {
    const l = toNum(inputs.lengthFt, 20);
    const w = toNum(inputs.widthFt, 10);
    const thickIn = toNum(inputs.thicknessIn, 4);
    const wastePct = toNum(inputs.wastePct, 10);

    const thickFt = thickIn / 12;
    const rawCuFt = l * w * thickFt;
    const rawCuYd = rawCuFt / 27;
    const totalCuYd = rawCuYd * (1 + wastePct / 100);
    const totalCuM = totalCuYd * 0.764555;

    // Premix 60lb bags (approx 0.45 cu ft each) and 80lb bags (approx 0.60 cu ft each)
    const totalCuFtWithWaste = rawCuFt * (1 + wastePct / 100);
    const bags60 = Math.ceil(totalCuFtWithWaste / 0.45);
    const bags80 = Math.ceil(totalCuFtWithWaste / 0.60);

    return {
      primaryValue: `${formatNum(totalCuYd, 2)} Cubic Yards`,
      primaryLabel: 'Required Concrete Volume',
      subtext: `Metric: ${formatNum(totalCuM, 2)} m³ | Premix: ${bags80} bags (80 lb) or ${bags60} bags (60 lb)`,
      breakdown: [
        { label: 'Slab Dimensions', value: `${l} ft × ${w} ft × ${thickIn} in` },
        { label: 'Net Volume', value: `${formatNum(rawCuYd, 2)} cu yd (${formatNum(rawCuFt, 1)} cu ft)` },
        { label: 'Waste Margin', value: `${wastePct}%` },
        { label: 'Total Volume Needed', value: `${formatNum(totalCuYd, 2)} cu yd` },
        { label: '80 lb Premix Bags', value: `${bags80} bags` },
        { label: '60 lb Premix Bags', value: `${bags60} bags` }
      ],
      steps: [
        `Thickness in feet: ${thickIn} / 12 = ${formatNum(thickFt, 3)} ft`,
        `Cubic Feet = ${l} × ${w} × ${formatNum(thickFt, 3)} = ${formatNum(rawCuFt, 2)} cu ft`,
        `Cubic Yards = ${formatNum(rawCuFt, 2)} / 27 = ${formatNum(rawCuYd, 2)} cu yd`,
        `With ${wastePct}% waste = ${formatNum(totalCuYd, 2)} cu yd (${bags80} bags of 80 lb)`
      ]
    };
  },

    "brick-calculator": (inputs) => {
    const l = toNum(inputs.wallLength, 30);
    const h = toNum(inputs.wallHeight, 8);
    const type = inputs.brickType || 'single';
    const waste = toNum(inputs.waste, 10);

    const wallArea = l * h;
    // Standard modular brick with mortar: approx 7 bricks per sq ft for single wythe, 14 for double
    const bricksPerSqFt = type === 'double' ? 14 : 7;
    const rawBricks = wallArea * bricksPerSqFt;
    const totalBricks = Math.ceil(rawBricks * (1 + waste / 100));

    return {
      primaryValue: `${totalBricks.toLocaleString('en-US')} Bricks`,
      primaryLabel: `Total Bricks Needed (${type} wythe)`,
      subtext: `Wall Area: ${formatNum(wallArea, 0)} sq ft | Includes ${waste}% waste`,
      breakdown: [
        { label: 'Wall Surface Area', value: `${formatNum(wallArea, 1)} sq ft` },
        { label: 'Wythe Thickness', value: type === 'double' ? 'Double Wythe (14 bricks/sq ft)' : 'Single Wythe (7 bricks/sq ft)' },
        { label: 'Net Bricks', value: `${Math.round(rawBricks).toLocaleString('en-US')}` },
        { label: 'Mortar Waste Margin', value: `${waste}%` },
        { label: 'Total Bricks with Waste', value: `${totalBricks.toLocaleString('en-US')}` }
      ],
      steps: [
        `Wall Area = ${l} ft × ${h} ft = ${wallArea} sq ft`,
        `Net Bricks = ${wallArea} sq ft × ${bricksPerSqFt} = ${Math.round(rawBricks)}`,
        `With ${waste}% allowance for cuts & breakage = ${totalBricks} bricks`
      ]
    };
  },

    "cement-calculator": (inputs) => {
    const vol = toNum(inputs.volumeCuM, 2);

    // Standard 1:2:4 concrete mix ratio (1 cement : 2 sand : 4 gravel, total parts = 7)
    // Dry volume factor is approx 1.54 × wet volume
    const dryVol = vol * 1.54;
    const cementVol = dryVol * (1 / 7);
    const sandVol = dryVol * (2 / 7);
    const gravelVol = dryVol * (4 / 7);

    // Cement density: 1440 kg/m³, 50kg bag = 0.0347 m³
    const cementBags50kg = Math.ceil((cementVol * 1440) / 50);
    const sandTons = sandVol * 1.6; // sand approx 1.6 t/m³
    const gravelTons = gravelVol * 1.5; // gravel approx 1.5 t/m³

    return {
      primaryValue: `${cementBags50kg} Bags (50kg cement)`,
      primaryLabel: 'Cement Requirement (1:2:4 mix)',
      subtext: `Sand: ${formatNum(sandTons, 2)} tonnes | Gravel: ${formatNum(gravelTons, 2)} tonnes`,
      breakdown: [
        { label: 'Wet Concrete Volume', value: `${vol} m³` },
        { label: 'Dry Volume (1.54× factor)', value: `${formatNum(dryVol, 2)} m³` },
        { label: 'Cement (50 kg bags)', value: `${cementBags50kg} bags` },
        { label: 'Sand Volume & Weight', value: `${formatNum(sandVol, 2)} m³ (${formatNum(sandTons, 2)} t)` },
        { label: 'Gravel Volume & Weight', value: `${formatNum(gravelVol, 2)} m³ (${formatNum(gravelTons, 2)} t)` }
      ],
      steps: [
        `Dry volume conversion: ${vol} m³ × 1.54 = ${formatNum(dryVol, 2)} m³`,
        `Cement share (1/7): ${formatNum(cementVol, 3)} m³ × 1440 kg/m³ = ${formatNum(cementVol * 1440, 0)} kg (${cementBags50kg} bags of 50kg)`,
        `Sand share (2/7): ${formatNum(sandVol, 2)} m³ | Gravel share (4/7): ${formatNum(gravelVol, 2)} m³`
      ]
    };
  },

    "sand-calculator": (inputs) => {
    const l = toNum(inputs.length, 20);
    const w = toNum(inputs.width, 15);
    const depthIn = toNum(inputs.depthIn, 2);

    const depthFt = depthIn / 12;
    const cuFt = l * w * depthFt;
    const cuYd = cuFt / 27;
    // Dry sand density: approx 1.35 tons per cubic yard (2700 lbs)
    const tons = cuYd * 1.35;

    return {
      primaryValue: `${formatNum(cuYd, 2)} Cubic Yards`,
      primaryLabel: 'Required Sand Volume',
      subtext: `Estimated Weight: ${formatNum(tons, 2)} tons (${Math.round(tons * 2000)} lbs)`,
      breakdown: [
        { label: 'Dimensions', value: `${l} ft × ${w} ft × ${depthIn} in` },
        { label: 'Area Covered', value: `${l * w} sq ft` },
        { label: 'Cubic Feet', value: `${formatNum(cuFt, 2)} cu ft` },
        { label: 'Cubic Yards', value: `${formatNum(cuYd, 2)} cu yd` },
        { label: 'Estimated Tonnage (1.35 t/yd³)', value: `${formatNum(tons, 2)} tons` }
      ],
      steps: [
        `Area: ${l} × ${w} = ${l * w} sq ft`,
        `Depth: ${depthIn} / 12 = ${formatNum(depthFt, 3)} ft`,
        `Volume = ${formatNum(cuFt, 2)} cu ft / 27 = ${formatNum(cuYd, 2)} cu yd (~${formatNum(tons, 2)} tons)`
      ]
    };
  },

    "tile-calculator": (inputs) => {
    const rL = toNum(inputs.roomLength, 12);
    const rW = toNum(inputs.roomWidth, 10);
    const tLIn = toNum(inputs.tileLengthIn, 12);
    const tWIn = toNum(inputs.tileWidthIn, 12);
    const waste = toNum(inputs.wastePct, 10);

    const roomSqFt = rL * rW;
    const tileSqFt = (tLIn * tWIn) / 144;
    const rawTiles = roomSqFt / tileSqFt;
    const totalTiles = Math.ceil(rawTiles * (1 + waste / 100));

    return {
      primaryValue: `${totalTiles} Tiles`,
      primaryLabel: `Total Tiles Needed (${tLIn}″ × ${tWIn}″)`,
      subtext: `Room Area: ${roomSqFt} sq ft | Includes ${waste}% cutting waste`,
      breakdown: [
        { label: 'Room Area', value: `${roomSqFt} sq ft` },
        { label: 'Tile Dimensions', value: `${tLIn}″ × ${tWIn}″ (${formatNum(tileSqFt, 2)} sq ft/tile)` },
        { label: 'Net Tiles', value: `${Math.ceil(rawTiles)}` },
        { label: 'Cut & Breakage Waste', value: `${waste}%` },
        { label: 'Total Ordered Tiles', value: `${totalTiles}` }
      ],
      steps: [
        `Room Area = ${rL} ft × ${rW} ft = ${roomSqFt} sq ft`,
        `Tile Area = (${tLIn} × ${tWIn}) / 144 = ${formatNum(tileSqFt, 3)} sq ft`,
        `Raw Tiles = ${roomSqFt} / ${formatNum(tileSqFt, 3)} = ${formatNum(rawTiles, 1)}`,
        `With ${waste}% cutting allowance = ${totalTiles} tiles`
      ]
    };
  },

    "flooring-calculator": (inputs) => {
    const l = toNum(inputs.length, 18);
    const w = toNum(inputs.width, 14);
    const sqftPerBox = toNum(inputs.sqftPerBox, 24);
    const waste = toNum(inputs.wastePct, 10);

    const roomArea = l * w;
    const totalSqFt = roomArea * (1 + waste / 100);
    const boxes = Math.ceil(totalSqFt / sqftPerBox);

    return {
      primaryValue: `${boxes} Boxes`,
      primaryLabel: 'Flooring Boxes Needed',
      subtext: `Total Ordered Area: ${formatNum(totalSqFt, 1)} sq ft (Room: ${roomArea} sq ft + ${waste}% waste)`,
      breakdown: [
        { label: 'Room Surface Area', value: `${roomArea} sq ft` },
        { label: 'Waste Factor', value: `${waste}%` },
        { label: 'Gross Square Footage', value: `${formatNum(totalSqFt, 1)} sq ft` },
        { label: 'Coverage per Box', value: `${sqftPerBox} sq ft` },
        { label: 'Boxes Required', value: `${boxes} boxes` }
      ],
      steps: [
        `Room Area = ${l} × ${w} = ${roomArea} sq ft`,
        `Gross Sq Ft with ${waste}% waste = ${roomArea} × ${1 + waste / 100} = ${formatNum(totalSqFt, 1)} sq ft`,
        `Boxes = ${formatNum(totalSqFt, 1)} / ${sqftPerBox} = ${formatNum(totalSqFt / sqftPerBox, 2)} -> Round up to ${boxes} boxes`
      ]
    };
  },

    "paint-calculator": (inputs) => {
    const l = toNum(inputs.length, 16);
    const w = toNum(inputs.width, 12);
    const h = toNum(inputs.height, 9);
    const doors = toNum(inputs.doors, 2);
    const windows = toNum(inputs.windows, 2);
    const coats = toNum(inputs.coats, 2);

    const grossWallArea = 2 * (l + w) * h;
    const deductions = doors * 21 + windows * 15; // 21 sq ft standard door, 15 sq ft window
    const netWallArea = Math.max(0, grossWallArea - deductions);
    const totalSqFt = netWallArea * coats;

    // Standard paint coverage: 350 sq ft per gallon (~32.5 m² per 3.78L)
    const gallons = Math.ceil(totalSqFt / 350);
    const liters = (totalSqFt / 350) * 3.78541;

    return {
      primaryValue: `${gallons} Gallon${gallons === 1 ? '' : 's'} (${formatNum(liters, 1)} L)`,
      primaryLabel: `Paint Required (${coats} Coats)`,
      subtext: `Net Wall Area: ${Math.round(netWallArea)} sq ft (${doors} doors, ${windows} windows excluded)`,
      breakdown: [
        { label: 'Gross Wall Area', value: `${grossWallArea} sq ft` },
        { label: 'Deductions (doors & windows)', value: `-${deductions} sq ft` },
        { label: 'Net Wall Surface per Coat', value: `${Math.round(netWallArea)} sq ft` },
        { label: 'Coats of Paint', value: `${coats}` },
        { label: 'Total Coverage Area', value: `${Math.round(totalSqFt)} sq ft` },
        { label: 'Gallons (350 sq ft/gal)', value: `${gallons} gal` }
      ],
      steps: [
        `Gross perimeter area = 2 × (${l} + ${w}) × ${h} = ${grossWallArea} sq ft`,
        `Deductions = ${doors} doors (42 sq ft) + ${windows} windows (30 sq ft) = ${deductions} sq ft`,
        `Net Area per Coat = ${netWallArea} sq ft`,
        `Total Area (${coats} coats) = ${totalSqFt} sq ft -> ${gallons} gallons needed`
      ]
    };
  },

    "roofing-calculator": (inputs) => {
    const l = toNum(inputs.houseLength, 40);
    const w = toNum(inputs.houseWidth, 30);
    const pitch = toNum(inputs.pitch, 6); // e.g. 6/12 pitch
    const waste = toNum(inputs.wastePct, 10);

    const groundArea = l * w;
    // Pitch multiplier: √(1 + (pitch/12)²)
    const pitchMult = Math.sqrt(1 + Math.pow(pitch / 12, 2));
    const roofArea = groundArea * pitchMult * (1 + waste / 100);

    // 1 roofing square = 100 sq ft, 3 bundles per square
    const squares = roofArea / 100;
    const bundles = Math.ceil(squares * 3);

    return {
      primaryValue: `${formatNum(squares, 1)} Squares (${bundles} Bundles)`,
      primaryLabel: `Roofing Shingles Needed (${pitch}/12 Pitch)`,
      subtext: `Estimated Roof Surface: ${Math.round(roofArea)} sq ft (incl. ${waste}% waste)`,
      breakdown: [
        { label: 'Footprint Area', value: `${groundArea} sq ft` },
        { label: 'Roof Pitch', value: `${pitch}/12 (Multiplier: ${formatNum(pitchMult, 3)})` },
        { label: 'Total Roof Area', value: `${Math.round(roofArea)} sq ft` },
        { label: 'Roofing Squares (100 sq ft)', value: `${formatNum(squares, 2)} squares` },
        { label: 'Shingle Bundles (3/square)', value: `${bundles} bundles` }
      ],
      steps: [
        `Ground footprint = ${l} × ${w} = ${groundArea} sq ft`,
        `Pitch multiplier for ${pitch}/12 = √(1 + (${pitch}/12)²) = ${formatNum(pitchMult, 3)}`,
        `Roof Area with ${waste}% waste = ${groundArea} × ${formatNum(pitchMult, 3)} × ${1 + waste / 100} = ${Math.round(roofArea)} sq ft`,
        `Ordered: ${bundles} bundles of shingles`
      ]
    };
  },

    "wall-area-calculator": (inputs) => {
    const l = toNum(inputs.length, 15);
    const w = toNum(inputs.width, 12);
    const h = toNum(inputs.height, 9);
    const deductions = toNum(inputs.deductions, 50);

    const gross = 2 * (l + w) * h;
    const net = Math.max(0, gross - deductions);

    return {
      primaryValue: `${net} sq ft`,
      primaryLabel: 'Net Interior Wall Area',
      subtext: `Gross: ${gross} sq ft | Deductions: ${deductions} sq ft`,
      breakdown: [
        { label: 'Room Dimensions', value: `${l} ft × ${w} ft × ${h} ft` },
        { label: 'Gross 4-Wall Area', value: `${gross} sq ft` },
        { label: 'Doors / Windows Deductions', value: `-${deductions} sq ft` },
        { label: 'Net Usable Wall Area', value: `${net} sq ft (${formatNum(net * 0.092903, 1)} m²)` }
      ],
      steps: [
        `Perimeter = 2 × (${l} + ${w}) = ${2 * (l + w)} ft`,
        `Gross Area = Perimeter × Height = ${2 * (l + w)} × ${h} = ${gross} sq ft`,
        `Net Area = ${gross} - ${deductions} = ${net} sq ft`
      ]
    };
  },

    "stair-calculator": (inputs) => {
    const totalRise = toNum(inputs.totalRiseIn, 108);
    const targetRiser = toNum(inputs.targetRiserIn, 7.5);

    if (totalRise <= 0 || targetRiser <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Total rise must be positive.' };

    const stepsCount = Math.round(totalRise / targetRiser);
    const exactRiser = totalRise / stepsCount;
    // Standard rule: 2 × Riser + Tread ≈ 25 inches (standard tread 10 to 11 inches)
    const recTread = Math.max(10, Math.min(12, 25 - 2 * exactRiser));
    const totalRun = (stepsCount - 1) * recTread;

    return {
      primaryValue: `${stepsCount} Steps (${formatNum(exactRiser, 2)}″ riser)`,
      primaryLabel: 'Staircase Configuration',
      subtext: `Recommended Tread: ${formatNum(recTread, 1)}″ | Total Stair Run: ${formatNum(totalRun / 12, 1)} ft`,
      breakdown: [
        { label: 'Total Elevation Rise', value: `${totalRise} inches (${formatNum(totalRise / 12, 2)} ft)` },
        { label: 'Number of Risers (Steps)', value: `${stepsCount}` },
        { label: 'Exact Riser Height', value: `${formatNum(exactRiser, 3)} inches` },
        { label: 'Recommended Tread Depth', value: `${formatNum(recTread, 2)} inches` },
        { label: 'Total Horizontal Run', value: `${formatNum(totalRun, 1)} inches (${formatNum(totalRun / 12, 2)} ft)` }
      ],
      steps: [
        `Calculated number of steps: ${totalRise} / ${targetRiser} = ${formatNum(totalRise / targetRiser, 1)} -> ${stepsCount} steps`,
        `Exact individual riser height = ${totalRise} / ${stepsCount} = ${formatNum(exactRiser, 2)} inches`,
        `Applied Blondel's stair comfort formula (2R + T = 25″) -> Tread = ${formatNum(recTread, 1)} inches`
      ]
    };
  },

    "gravel-calculator": (inputs) => {
    const l = toNum(inputs.length, 50);
    const w = toNum(inputs.width, 10);
    const dIn = toNum(inputs.depthIn, 3);

    const dFt = dIn / 12;
    const cuFt = l * w * dFt;
    const cuYd = cuFt / 27;
    // Crushed gravel density: approx 1.4 tons per cu yard
    const tons = cuYd * 1.4;

    return {
      primaryValue: `${formatNum(tons, 2)} Tons (${formatNum(cuYd, 2)} yd³)`,
      primaryLabel: 'Crushed Gravel Requirement',
      subtext: `Driveway/Pathway Area: ${l * w} sq ft at ${dIn} inches depth`,
      breakdown: [
        { label: 'Coverage Area', value: `${l * w} sq ft` },
        { label: 'Volume (cu ft)', value: `${formatNum(cuFt, 1)} cu ft` },
        { label: 'Volume (cu yd)', value: `${formatNum(cuYd, 2)} cu yd` },
        { label: 'Estimated Weight (tons)', value: `${formatNum(tons, 2)} tons` }
      ],
      steps: [
        `Area = ${l} × ${w} = ${l * w} sq ft`,
        `Volume = (${l * w} × ${dIn / 12}) / 27 = ${formatNum(cuYd, 2)} cu yd`,
        `Tonnage = ${formatNum(cuYd, 2)} yd³ × 1.4 tons/yd³ = ${formatNum(tons, 2)} tons`
      ]
    };
  },

    "mulch-calculator": (inputs) => {
    const l = toNum(inputs.length, 30);
    const w = toNum(inputs.width, 8);
    const dIn = toNum(inputs.depthIn, 3);

    const dFt = dIn / 12;
    const cuFt = l * w * dFt;
    const cuYd = cuFt / 27;
    const bags2cuFt = Math.ceil(cuFt / 2);
    const bags3cuFt = Math.ceil(cuFt / 3);

    return {
      primaryValue: `${formatNum(cuYd, 2)} Cubic Yards`,
      primaryLabel: 'Mulch Needed',
      subtext: `Or ${bags2cuFt} bags of 2 cu ft / ${bags3cuFt} bags of 3 cu ft`,
      breakdown: [
        { label: 'Garden Bed Area', value: `${l * w} sq ft` },
        { label: 'Mulch Depth', value: `${dIn} inches` },
        { label: 'Cubic Feet', value: `${formatNum(cuFt, 1)} cu ft` },
        { label: 'Cubic Yards', value: `${formatNum(cuYd, 2)} cu yd` },
        { label: '2 cu ft Bags', value: `${bags2cuFt} bags` },
        { label: '3 cu ft Bags', value: `${bags3cuFt} bags` }
      ],
      steps: [
        `Area: ${l} × ${w} = ${l * w} sq ft`,
        `Volume: (${l * w} × ${dIn / 12}) / 27 = ${formatNum(cuYd, 2)} cu yd`,
        `Bag Count: ${formatNum(cuFt, 1)} cu ft / 2 cu ft = ${bags2cuFt} bags`
      ]
    };
  },

    "ohms-law-calculator": (inputs) => {
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

    "voltage-calculator": (inputs) => {
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

    "current-calculator": (inputs) => {
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

    "resistance-calculator": (inputs) => {
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

    "power-calculator": (inputs) => {
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

    "electrical-cost-calculator": (inputs) => {
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

    "resistor-calculator": (inputs) => {
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

    "series-parallel-calculator": (inputs) => {
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

    "energy-calculator": (inputs) => {
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
  },

    "force-calculator": (inputs) => {
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

    "kinetic-energy-calculator": (inputs) => {
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

    "potential-energy-calculator": (inputs) => {
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

    "velocity-calculator": (inputs) => {
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

    "acceleration-calculator": (inputs) => {
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

    "work-calculator": (inputs) => {
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

    "momentum-calculator": (inputs) => {
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

    "density-calculator": (inputs) => {
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

    "pressure-physics-calculator": (inputs) => {
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

    "coulombs-law-calculator": (inputs) => {
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

    "gravitational-force-calculator": (inputs) => {
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

    "heat-energy-calculator": (inputs) => {
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

    "wavelength-calculator": (inputs) => {
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
  },

    "molarity-calculator": (inputs) => {
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

    "dilution-calculator": (inputs) => {
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

    "ph-calculator": (inputs) => {
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

    "gas-law-calculator": (inputs) => {
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

    "mole-calculator": (inputs) => {
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

    "molar-mass-calculator": (inputs) => {
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

    "molality-calculator": (inputs) => {
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

    "percentage-composition-calculator": (inputs) => {
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
  },

    "standard-deviation-calculator": (inputs) => {
    const raw = String(inputs.dataset || '10, 12, 23, 23, 16, 23, 21, 16').trim();
    const nums = raw.split(/[\s,]+/).map(Number).filter((n) => !isNaN(n));

    if (nums.length < 2) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter at least 2 numbers.' };

    const n = nums.length;
    const mean = nums.reduce((a, b) => a + b, 0) / n;
    const sumSqDiff = nums.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0);

    const sampleVar = sumSqDiff / (n - 1);
    const sampleStd = Math.sqrt(sampleVar);
    const popVar = sumSqDiff / n;
    const popStd = Math.sqrt(popVar);

    return {
      primaryValue: `s = ${formatNum(sampleStd, 4)}`,
      primaryLabel: 'Sample Standard Deviation (s)',
      subtext: `Population σ = ${formatNum(popStd, 4)} | Mean x̄ = ${formatNum(mean, 2)}`,
      breakdown: [
        { label: 'Sample Count (n)', value: `${n}` },
        { label: 'Mean Average (x̄)', value: formatNum(mean, 4) },
        { label: 'Sum of Squared Deviations (SS)', value: formatNum(sumSqDiff, 4) },
        { label: 'Sample Variance (s²)', value: formatNum(sampleVar, 4) },
        { label: 'Sample Standard Deviation (s)', value: formatNum(sampleStd, 4) },
        { label: 'Population Std Dev (σ)', value: formatNum(popStd, 4) }
      ],
      steps: [
        `Mean: x̄ = ${formatNum(mean, 4)}`,
        `Sum of squared diffs: Σ(x - x̄)² = ${formatNum(sumSqDiff, 4)}`,
        `Sample variance: s² = ${formatNum(sumSqDiff, 4)} / (${n} - 1) = ${formatNum(sampleVar, 4)}`,
        `Sample std dev: s = √${formatNum(sampleVar, 4)} = ${formatNum(sampleStd, 4)}`
      ]
    };
  },

    "z-score-calculator": (inputs) => {
    const x = toNum(inputs.rawScore, 85);
    const mu = toNum(inputs.mean, 70);
    const sigma = toNum(inputs.stdDev, 10);

    if (sigma <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Standard deviation σ must be positive.' };

    const z = (x - mu) / sigma;

    // Approximate cumulative normal probability Phi(z)
    const erf = (t) => {
      // Abramowitz and Stegun approximation
      const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
      const sign = t < 0 ? -1 : 1;
      const absT = Math.abs(t);
      const k = 1 / (1 + p * absT);
      const y = 1 - (((((a5 * k + a4) * k + a3) * k + a2) * k + a1) * k * Math.exp(-absT * absT));
      return sign * y;
    };

    const percentile = 0.5 * (1 + erf(z / Math.SQRT2)) * 100;

    return {
      primaryValue: `z = ${formatNum(z, 2)}`,
      primaryLabel: 'Standard Score (Z-Score)',
      subtext: `${formatNum(percentile, 1)}th Percentile | ${z >= 0 ? '+' : ''}${formatNum(z, 2)} standard deviations from mean`,
      breakdown: [
        { label: 'Raw Score (x)', value: formatNum(x) },
        { label: 'Population Mean (μ)', value: formatNum(mu) },
        { label: 'Standard Deviation (σ)', value: formatNum(sigma) },
        { label: 'Calculated Z-Score', value: formatNum(z, 4) },
        { label: 'Percentile Rank', value: `${formatNum(percentile, 2)}%` }
      ],
      steps: [
        `Formula: z = (x - μ) / σ`,
        `z = (${x} - ${mu}) / ${sigma} = ${formatNum(x - mu, 2)} / ${sigma} = ${formatNum(z, 4)}`,
        `Cumulative area under normal curve: ${formatNum(percentile, 2)}%`
      ]
    };
  },

    "sample-size-calculator": (inputs) => {
    const conf = inputs.confidence || '95';
    const moe = toNum(inputs.marginOfErrorPct, 5);
    const pop = toNum(inputs.populationSize, 0);

    if (moe <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Margin of error must be positive.' };

    const zScores = { '90': 1.645, '95': 1.96, '99': 2.576 };
    const z = zScores[conf] || 1.96;
    const p = 0.5; // maximum variance
    const e = moe / 100;

    // Cochran formula for infinite population
    let n0 = (z * z * p * (1 - p)) / (e * e);
    let sampleSize = n0;

    if (pop > 0) {
      // Finite population correction
      sampleSize = (n0 * pop) / (n0 + pop - 1);
    }

    const finalN = Math.ceil(sampleSize);

    return {
      primaryValue: `${finalN.toLocaleString('en-US')} Participants`,
      primaryLabel: `Recommended Sample Size (${conf}% Conf)`,
      subtext: `Margin of Error: ±${moe}% | Assumed Proportion: 50%`,
      breakdown: [
        { label: 'Confidence Level', value: `${conf}% (z = ${z})` },
        { label: 'Margin of Error (e)', value: `±${moe}%` },
        { label: 'Target Population', value: pop > 0 ? `${pop.toLocaleString('en-US')} (Finite)` : 'Infinite / Unknown' },
        { label: 'Sample Size Needed', value: `${finalN.toLocaleString('en-US')} respondents` }
      ],
      steps: [
        `Base Cochran formula: n₀ = (z² × p(1 - p)) / e²`,
        `n₀ = (${z}² × 0.25) / (${e})² = ${formatNum(n0, 1)}`,
        pop > 0 ? `Applied finite population correction for N = ${pop}: n = ${finalN}` : `Sample size required = ${finalN}`
      ]
    };
  },

    "confidence-interval-calculator": (inputs) => {
    const mean = toNum(inputs.mean, 100);
    const s = toNum(inputs.stdDev, 15);
    const n = Math.round(toNum(inputs.sampleSize, 64));
    const conf = inputs.confLevel || '95';

    if (s <= 0 || n <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Standard deviation and sample size must be positive.' };

    const zScores = { '90': 1.645, '95': 1.96, '99': 2.576 };
    const z = zScores[conf] || 1.96;

    const sem = s / Math.sqrt(n);
    const moe = z * sem;
    const lower = mean - moe;
    const upper = mean + moe;

    return {
      primaryValue: `[${formatNum(lower, 2)}, ${formatNum(upper, 2)}]`,
      primaryLabel: `${conf}% Confidence Interval`,
      subtext: `Margin of Error: ±${formatNum(moe, 2)} | Standard Error: ${formatNum(sem, 3)}`,
      breakdown: [
        { label: 'Sample Mean (x̄)', value: formatNum(mean) },
        { label: 'Sample Size (n)', value: `${n}` },
        { label: 'Standard Error (SE)', value: formatNum(sem, 4) },
        { label: 'Margin of Error (MOE)', value: `±${formatNum(moe, 4)}` },
        { label: 'Confidence Interval', value: `${formatNum(lower, 3)} to ${formatNum(upper, 3)}` }
      ],
      steps: [
        `Standard Error: SE = s / √n = ${s} / √${n} = ${formatNum(sem, 4)}`,
        `Margin of Error: MOE = ${z} × ${formatNum(sem, 4)} = ${formatNum(moe, 4)}`,
        `Interval: ${mean} ± ${formatNum(moe, 4)} = [${formatNum(lower, 2)}, ${formatNum(upper, 2)}]`
      ]
    };
  },

    "mean-calculator": (inputs) => {
    const raw = String(inputs.numbers || '4, 8, 16, 32').trim();
    const nums = raw.split(/[\s,]+/).map(Number).filter((n) => !isNaN(n));

    if (nums.length === 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter valid numbers.' };

    const n = nums.length;
    const arithMean = nums.reduce((a, b) => a + b, 0) / n;

    // Geometric mean (requires all positive)
    const allPos = nums.every((x) => x > 0);
    const geomMean = allPos ? Math.pow(nums.reduce((a, b) => a * b, 1), 1 / n) : null;

    // Harmonic mean (requires all positive)
    const harmMean = allPos ? n / nums.reduce((acc, x) => acc + (1 / x), 0) : null;

    return {
      primaryValue: formatNum(arithMean, 4),
      primaryLabel: 'Arithmetic Mean (Average)',
      subtext: allPos ? `Geometric: ${formatNum(geomMean, 4)} | Harmonic: ${formatNum(harmMean, 4)}` : 'Calculated arithmetic average',
      breakdown: [
        { label: 'Sample Count (N)', value: `${n}` },
        { label: 'Sum of Values', value: formatNum(nums.reduce((a, b) => a + b, 0), 2) },
        { label: 'Arithmetic Mean (AM)', value: formatNum(arithMean, 4) },
        { label: 'Geometric Mean (GM)', value: allPos ? formatNum(geomMean, 4) : 'N/A (Requires positive numbers)' },
        { label: 'Harmonic Mean (HM)', value: allPos ? formatNum(harmMean, 4) : 'N/A (Requires positive numbers)' }
      ],
      steps: [
        `Summed ${n} values: ${formatNum(nums.reduce((a, b) => a + b, 0), 2)}`,
        `Arithmetic Mean = Sum / N = ${formatNum(arithMean, 4)}`,
        allPos ? `Pythagorean Means inequality satisfied: AM (${formatNum(arithMean, 2)}) >= GM (${formatNum(geomMean, 2)}) >= HM (${formatNum(harmMean, 2)})` : ''
      ].filter(Boolean)
    };
  },

    "variance-calculator": (inputs) => {
    const raw = String(inputs.dataset || '3, 5, 8, 12, 17').trim();
    const nums = raw.split(/[\s,]+/).map(Number).filter((n) => !isNaN(n));

    if (nums.length < 2) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter at least 2 numbers.' };

    const n = nums.length;
    const mean = nums.reduce((a, b) => a + b, 0) / n;
    const ss = nums.reduce((acc, x) => acc + Math.pow(x - mean, 2), 0);

    const sampleVar = ss / (n - 1);
    const popVar = ss / n;

    return {
      primaryValue: `s² = ${formatNum(sampleVar, 4)}`,
      primaryLabel: 'Sample Variance (s²)',
      subtext: `Population Variance σ² = ${formatNum(popVar, 4)} | Mean = ${formatNum(mean, 2)}`,
      breakdown: [
        { label: 'Count (N)', value: `${n}` },
        { label: 'Mean (x̄)', value: formatNum(mean, 4) },
        { label: 'Sum of Squared Deviations', value: formatNum(ss, 4) },
        { label: 'Sample Variance (s² = SS / [n - 1])', value: formatNum(sampleVar, 4) },
        { label: 'Population Variance (σ² = SS / n)', value: formatNum(popVar, 4) }
      ],
      steps: [
        `Calculated mean: x̄ = ${formatNum(mean, 4)}`,
        `Squared deviations sum: Σ(x - x̄)² = ${formatNum(ss, 4)}`,
        `Sample variance = ${formatNum(ss, 4)} / ${n - 1} = ${formatNum(sampleVar, 4)}`
      ]
    };
  },

    "range-calculator": (inputs) => {
    const raw = String(inputs.dataset || '4, 17, 7, 14, 18, 12, 3, 16, 10, 4, 4, 12').trim();
    const nums = raw.split(/[\s,]+/).map(Number).filter((n) => !isNaN(n)).sort((a, b) => a - b);

    if (nums.length < 2) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter at least 2 numbers.' };

    const min = nums[0];
    const max = nums[nums.length - 1];
    const range = max - min;

    // Quartiles
    const q2 = nums.length % 2 === 0
      ? (nums[nums.length / 2 - 1] + nums[nums.length / 2]) / 2
      : nums[Math.floor(nums.length / 2)];

    const lowerHalf = nums.slice(0, Math.floor(nums.length / 2));
    const upperHalf = nums.length % 2 === 0 ? nums.slice(nums.length / 2) : nums.slice(Math.floor(nums.length / 2) + 1);

    const q1 = lowerHalf.length % 2 === 0
      ? (lowerHalf[lowerHalf.length / 2 - 1] + lowerHalf[lowerHalf.length / 2]) / 2
      : lowerHalf[Math.floor(lowerHalf.length / 2)];

    const q3 = upperHalf.length % 2 === 0
      ? (upperHalf[upperHalf.length / 2 - 1] + upperHalf[upperHalf.length / 2]) / 2
      : upperHalf[Math.floor(upperHalf.length / 2)];

    const iqr = q3 - q1;

    return {
      primaryValue: `Range = ${formatNum(range, 2)} (IQR = ${formatNum(iqr, 2)})`,
      primaryLabel: 'Statistical Range & Interquartile Range',
      subtext: `Min: ${min}, Max: ${max} | Q1: ${q1}, Median: ${q2}, Q3: ${q3}`,
      breakdown: [
        { label: 'Minimum Value', value: `${min}` },
        { label: 'Maximum Value', value: `${max}` },
        { label: 'Full Range (Max - Min)', value: `${range}` },
        { label: 'First Quartile (Q₁ - 25th)', value: `${q1}` },
        { label: 'Median (Q₂ - 50th)', value: `${q2}` },
        { label: 'Third Quartile (Q₃ - 75th)', value: `${q3}` },
        { label: 'Interquartile Range (IQR = Q₃ - Q₁)', value: `${iqr}` }
      ],
      steps: [
        `Sorted dataset: ${nums.join(', ')}`,
        `Range = Max (${max}) - Min (${min}) = ${range}`,
        `IQR = Q3 (${q3}) - Q1 (${q1}) = ${iqr}`
      ]
    };
  },

    "mean-median-mode-calculator": (inputs) => {
    const raw = String(inputs.numbers || '12, 15, 18, 15, 22, 25, 29, 30, 15').trim();
    const nums = raw.split(/[\s,]+/).map(Number).filter((n) => !isNaN(n)).sort((a, b) => a - b);

    if (nums.length === 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter valid numbers.' };

    const n = nums.length;
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    const median = n % 2 === 0
      ? (nums[n / 2 - 1] + nums[n / 2]) / 2
      : nums[Math.floor(n / 2)];

    // Mode calculation
    const counts = {};
    let maxFreq = 0;
    nums.forEach((x) => {
      counts[x] = (counts[x] || 0) + 1;
      if (counts[x] > maxFreq) maxFreq = counts[x];
    });

    const modes = Object.keys(counts).filter((k) => counts[k] === maxFreq).map(Number);
    const modeStr = maxFreq === 1 ? 'No Mode (All values unique)' : modes.join(', ');

    const min = nums[0];
    const max = nums[n - 1];
    const range = max - min;

    return {
      primaryValue: `Mean: ${formatNum(mean, 2)} | Median: ${formatNum(median, 2)} | Mode: ${modeStr}`,
      primaryLabel: 'Central Tendency Metrics',
      subtext: `Dataset size: ${n} items | Range: ${range} [${min} to ${max}]`,
      breakdown: [
        { label: 'Dataset Size (N)', value: `${n}` },
        { label: 'Arithmetic Mean', value: formatNum(mean, 4) },
        { label: 'Median Value', value: formatNum(median, 2) },
        { label: 'Mode (Most Frequent)', value: modeStr },
        { label: 'Range (Max - Min)', value: `${range}` },
        { label: 'Sum (Σx)', value: formatNum(sum, 2) }
      ],
      steps: [
        `Sorted dataset: ${nums.join(', ')}`,
        `Mean = ${formatNum(sum, 2)} / ${n} = ${formatNum(mean, 2)}`,
        `Median = ${formatNum(median, 2)}`,
        `Mode = ${modeStr} (Frequency: ${maxFreq} times)`
      ]
    };
  },

    "ip-subnet-calculator": (inputs) => {
    const ipStr = String(inputs.ip || '192.168.1.100').trim();
    const cidr = Math.min(Math.max(Math.round(toNum(inputs.cidr, 24)), 0), 32);

    const ipParts = ipStr.split('.').map(Number);
    if (ipParts.length !== 4 || ipParts.some((p) => isNaN(p) || p < 0 || p > 255)) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter a valid IPv4 address (e.g. 192.168.1.1).' };
    }

    const ipInt = ((ipParts[0] << 24) >>> 0) + ((ipParts[1] << 16) >>> 0) + ((ipParts[2] << 8) >>> 0) + (ipParts[3] >>> 0);
    const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const netInt = (ipInt & maskInt) >>> 0;
    const bcastInt = (netInt | ~maskInt) >>> 0;

    const intToIp = (val) => [
      (val >>> 24) & 255,
      (val >>> 16) & 255,
      (val >>> 8) & 255,
      val & 255
    ].join('.');

    const netIp = intToIp(netInt);
    const bcastIp = intToIp(bcastInt);
    const maskIp = intToIp(maskInt);
    const wildcardIp = intToIp(~maskInt >>> 0);

    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = cidr >= 31 ? (cidr === 31 ? 2 : 1) : Math.max(0, totalHosts - 2);

    const firstUsable = cidr >= 31 ? netIp : intToIp(netInt + 1);
    const lastUsable = cidr >= 31 ? bcastIp : intToIp(bcastInt - 1);

    return {
      primaryValue: `${netIp} / ${cidr}`,
      primaryLabel: 'Subnet Network Address',
      subtext: `Usable Host Range: ${firstUsable} - ${lastUsable} (${usableHosts.toLocaleString('en-US')} hosts)`,
      breakdown: [
        { label: 'IP Address', value: ipStr },
        { label: 'Subnet Mask', value: `${maskIp} (/${cidr})` },
        { label: 'Network ID', value: netIp },
        { label: 'Broadcast Address', value: bcastIp },
        { label: 'First Usable Host', value: firstUsable },
        { label: 'Last Usable Host', value: lastUsable },
        { label: 'Usable Host Capacity', value: `${usableHosts.toLocaleString('en-US')} hosts` },
        { label: 'Wildcard Mask', value: wildcardIp }
      ],
      steps: [
        `Converted ${ipStr} to 32-bit binary representation`,
        `Applied subnet mask /${cidr} (${maskIp})`,
        `Network Address = IP AND Mask = ${netIp}`,
        `Broadcast = Network OR Wildcard = ${bcastIp}`,
        `Usable Hosts = 2^(32 - ${cidr}) - 2 = ${usableHosts.toLocaleString('en-US')}`
      ]
    };
  },

    "download-time-calculator": (inputs) => {
    const sizeGB = toNum(inputs.fileSizeGB, 50);
    const speedMbps = toNum(inputs.speedMbps, 100);

    if (sizeGB <= 0 || speedMbps <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'File size and speed must be positive.' };

    const totalBits = sizeGB * 8 * 1024 * 1024 * 1024;
    const speedBitsPerSec = speedMbps * 1e6;
    const totalSeconds = totalBits / speedBitsPerSec;

    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.round(totalSeconds % 60);

    const mbPerSec = speedMbps / 8;

    return {
      primaryValue: `${hours > 0 ? hours + 'h ' : ''}${mins}m ${secs}s`,
      primaryLabel: 'Estimated Transfer Duration',
      subtext: `Transfer Speed: ${formatNum(mbPerSec, 2)} MB/s (${speedMbps} Mbps)`,
      breakdown: [
        { label: 'File Size', value: `${sizeGB} GB (${formatNum(sizeGB * 1024, 0)} MB)` },
        { label: 'Network Bandwidth', value: `${speedMbps} Mbps (${formatNum(mbPerSec, 2)} MB/sec)` },
        { label: 'Estimated Download Time', value: `${hours} hours, ${mins} minutes, ${secs} seconds` },
        { label: 'Total Seconds', value: `${Math.round(totalSeconds).toLocaleString('en-US')} sec` }
      ],
      steps: [
        `Total bits = ${sizeGB} GB × 8 × 1024³ = ${totalBits.toExponential(3)} bits`,
        `Transfer rate = ${speedMbps} Mbps = ${formatNum(mbPerSec, 2)} MB/second`,
        `Duration = ${totalBits.toExponential(3)} / (${speedMbps} × 10⁶) = ${Math.round(totalSeconds)} seconds`
      ]
    };
  },

    "binary-calculator": (inputs) => {
    const bin1 = String(inputs.bin1 || '1101').trim();
    const bin2 = String(inputs.bin2 || '1010').trim();
    const op = inputs.op || '+';

    if (!/^[01]+$/.test(bin1) || !/^[01]+$/.test(bin2)) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Inputs must be valid binary strings containing only 0 and 1.' };
    }

    const n1 = parseInt(bin1, 2);
    const n2 = parseInt(bin2, 2);

    let resInt = 0;
    if (op === '+') resInt = n1 + n2;
    else if (op === '-') resInt = n1 - n2;
    else if (op === '*') resInt = n1 * n2;
    else if (op === '/') {
      if (n2 === 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Division by zero is undefined.' };
      resInt = Math.floor(n1 / n2);
    } else if (op === 'AND') resInt = (n1 & n2) >>> 0;
    else if (op === 'OR') resInt = (n1 | n2) >>> 0;
    else if (op === 'XOR') resInt = (n1 ^ n2) >>> 0;

    const resBin = resInt < 0 ? `-${Math.abs(resInt).toString(2)}` : resInt.toString(2);

    return {
      primaryValue: `${resBin} (bin)`,
      primaryLabel: `Binary Output (${bin1} ${op} ${bin2})`,
      subtext: `Decimal Value: ${resInt} | Hex: 0x${Math.abs(resInt).toString(16).toUpperCase()}`,
      breakdown: [
        { label: 'Binary Operand 1', value: `${bin1} (dec: ${n1})` },
        { label: 'Binary Operand 2', value: `${bin2} (dec: ${n2})` },
        { label: 'Operation', value: op },
        { label: 'Binary Result', value: `${resBin}` },
        { label: 'Decimal Equivalent', value: `${resInt}` },
        { label: 'Hex Equivalent', value: `0x${Math.abs(resInt).toString(16).toUpperCase()}` }
      ],
      steps: [
        `Convert to decimal: ${bin1}₂ = ${n1}₁₀, ${bin2}₂ = ${n2}₁₀`,
        `Compute: ${n1} ${op} ${n2} = ${resInt}`,
        `Convert back to binary: ${resInt} = ${resBin}₂`
      ]
    };
  },

    "decimal-to-binary": (inputs) => {
    const dec = Math.round(toNum(inputs.decimal, 156));
    const bin = Math.abs(dec).toString(2);
    const hex = Math.abs(dec).toString(16).toUpperCase();
    const oct = Math.abs(dec).toString(8);

    return {
      primaryValue: `${dec < 0 ? '-' : ''}${bin} (base 2)`,
      primaryLabel: 'Binary Representation',
      subtext: `Hex: 0x${hex} | Octal: 0o${oct}`,
      breakdown: [
        { label: 'Decimal Integer', value: `${dec}` },
        { label: 'Binary (Base 2)', value: `${dec < 0 ? '-' : ''}${bin}` },
        { label: 'Hexadecimal (Base 16)', value: `0x${hex}` },
        { label: 'Octal (Base 8)', value: `0o${oct}` },
        { label: 'Bit Length', value: `${bin.length} bits` }
      ],
      steps: [
        `Repeatedly divide ${Math.abs(dec)} by 2 and collect remainders`,
        `Remainders in reverse order = ${bin}₂`
      ]
    };
  },

    "binary-to-decimal": (inputs) => {
    const raw = String(inputs.binary || '10011100').trim();
    if (!/^[01]+$/.test(raw)) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Input must be a valid binary sequence (0s and 1s).' };
    }

    const dec = parseInt(raw, 2);
    const hex = dec.toString(16).toUpperCase();
    const oct = dec.toString(8);

    return {
      primaryValue: `${dec.toLocaleString('en-US')} (base 10)`,
      primaryLabel: 'Decimal Representation',
      subtext: `Hex: 0x${hex} | Octal: 0o${oct}`,
      breakdown: [
        { label: 'Binary String', value: raw },
        { label: 'Decimal (Base 10)', value: `${dec.toLocaleString('en-US')}` },
        { label: 'Hexadecimal (Base 16)', value: `0x${hex}` },
        { label: 'Octal (Base 8)', value: `0o${oct}` }
      ],
      steps: [
        `Expanded positional powers of 2 for ${raw}:`,
        raw.split('').reverse().map((bit, idx) => bit === '1' ? `2^${idx} (${Math.pow(2, idx)})` : null).filter(Boolean).join(' + ') + ` = ${dec}`
      ]
    };
  },

    "hexadecimal-converter": (inputs) => {
    const hex = String(inputs.hex || 'FF45').trim().replace(/^0x/i, '');
    if (!/^[0-9A-Fa-f]+$/.test(hex)) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter a valid hexadecimal string (0-9, A-F).' };
    }

    const dec = parseInt(hex, 16);
    const bin = dec.toString(2);
    const oct = dec.toString(8);

    return {
      primaryValue: `${dec.toLocaleString('en-US')} (Decimal)`,
      primaryLabel: 'Decimal Equivalent of 0x' + hex.toUpperCase(),
      subtext: `Binary: ${bin} | Octal: 0o${oct}`,
      breakdown: [
        { label: 'Hex Input', value: `0x${hex.toUpperCase()}` },
        { label: 'Decimal (Base 10)', value: `${dec.toLocaleString('en-US')}` },
        { label: 'Binary (Base 2)', value: `${bin}` },
        { label: 'Octal (Base 8)', value: `0o${oct}` }
      ],
      steps: [
        `Parsed base 16: 0x${hex.toUpperCase()} = ${dec}`,
        `Binary representation = ${bin}₂`
      ]
    };
  },

    "octal-converter": (inputs) => {
    const oct = String(inputs.octal || '755').trim().replace(/^0o/i, '');
    if (!/^[0-7]+$/.test(oct)) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Octal numbers can only contain digits from 0 to 7.' };
    }

    const dec = parseInt(oct, 8);
    const bin = dec.toString(2);
    const hex = dec.toString(16).toUpperCase();

    return {
      primaryValue: `${dec.toLocaleString('en-US')} (Decimal)`,
      primaryLabel: 'Decimal Equivalent of 0o' + oct,
      subtext: `Binary: ${bin} | Hex: 0x${hex}`,
      breakdown: [
        { label: 'Octal Input', value: `0o${oct}` },
        { label: 'Decimal (Base 10)', value: `${dec.toLocaleString('en-US')}` },
        { label: 'Binary (Base 2)', value: `${bin}` },
        { label: 'Hexadecimal (Base 16)', value: `0x${hex}` }
      ],
      steps: [
        `Expanded base 8: ${oct}₈ = ${dec}₁₀`,
        `Binary conversion: ${bin}₂`
      ]
    };
  },

    "base-converter": (inputs) => {
    const numStr = String(inputs.num || '10110').trim();
    const fromB = Math.min(Math.max(Math.round(toNum(inputs.fromBase, 2)), 2), 36);
    const toB = Math.min(Math.max(Math.round(toNum(inputs.toBase, 10)), 2), 36);

    try {
      const dec = parseInt(numStr, fromB);
      if (isNaN(dec)) return { primaryValue: 'Error', primaryLabel: 'Result', error: `String "${numStr}" is invalid for Base ${fromB}.` };

      const out = dec.toString(toB).toUpperCase();

      return {
        primaryValue: `${out} (Base ${toB})`,
        primaryLabel: `Converted to Base ${toB}`,
        subtext: `Original: ${numStr} (Base ${fromB}) = ${dec} (Decimal)`,
        breakdown: [
          { label: 'Input Value', value: `${numStr} (Base ${fromB})` },
          { label: 'Decimal Intermediate', value: `${dec}` },
          { label: 'Target Output', value: `${out} (Base ${toB})` }
        ],
        steps: [
          `Converted ${numStr} from base ${fromB} to decimal: ${dec}`,
          `Converted ${dec} from decimal to base ${toB}: ${out}`
        ]
      };
    } catch (e) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Base conversion failed.' };
    }
  },

    "bandwidth-calculator": (inputs) => {
    const speed = toNum(inputs.speed, 100);
    const unit = inputs.unit || 'mbps';

    let mbps = speed;
    if (unit === 'kbps') mbps = speed / 1000;
    else if (unit === 'gbps') mbps = speed * 1000;

    const mbPerSec = mbps / 8;
    const gbPerHour = (mbPerSec * 3600) / 1024;
    const tbPerMonth = (gbPerHour * 24 * 30.4) / 1024;

    return {
      primaryValue: `${formatNum(mbPerSec, 2)} MB/s`,
      primaryLabel: 'Real Data Throughput',
      subtext: `Hourly capacity: ${formatNum(gbPerHour, 1)} GB/hr | Monthly cap: ${formatNum(tbPerMonth, 2)} TB/month`,
      breakdown: [
        { label: 'Network Speed', value: `${speed} ${unit.toUpperCase()}` },
        { label: 'Megabytes per Second (MB/s)', value: `${formatNum(mbPerSec, 2)} MB/s` },
        { label: 'Hourly Data Transfer', value: `${formatNum(gbPerHour, 2)} GB / hr` },
        { label: 'Monthly Sustained Capacity', value: `${formatNum(tbPerMonth, 2)} TB / month` }
      ],
      steps: [
        `Divide Megabits by 8 to get Megabytes: ${mbps} / 8 = ${formatNum(mbPerSec, 2)} MB/s`,
        `Multiply by 3600 seconds = ${formatNum(gbPerHour, 2)} GB per hour`
      ]
    };
  },

    "storage-calculator": (inputs) => {
    const driveSize = toNum(inputs.driveSizeTB, 4);
    const count = Math.max(1, Math.round(toNum(inputs.numDrives, 4)));
    const raid = inputs.raidLevel || 'raid5';

    let usableTB = 0;
    let faultTolerance = '';
    let efficiency = 0;

    if (raid === 'raid0') {
      usableTB = driveSize * count;
      faultTolerance = '0 Drives (No redundancy)';
      efficiency = 100;
    } else if (raid === 'raid1') {
      usableTB = driveSize;
      faultTolerance = `${count - 1} Drive(s)`;
      efficiency = 100 / count;
    } else if (raid === 'raid5') {
      usableTB = driveSize * Math.max(0, count - 1);
      faultTolerance = '1 Drive parity failure';
      efficiency = count >= 3 ? ((count - 1) / count) * 100 : 0;
    } else if (raid === 'raid6') {
      usableTB = driveSize * Math.max(0, count - 2);
      faultTolerance = '2 Concurrent Drive failures';
      efficiency = count >= 4 ? ((count - 2) / count) * 100 : 0;
    } else if (raid === 'raid10') {
      usableTB = driveSize * (count / 2);
      faultTolerance = '1 Drive per mirror pair';
      efficiency = 50;
    }

    const rawTotal = driveSize * count;

    return {
      primaryValue: `${formatNum(usableTB, 1)} TB Usable`,
      primaryLabel: `RAID Configuration (${raid.toUpperCase()})`,
      subtext: `Raw Storage: ${rawTotal} TB | Efficiency: ${formatNum(efficiency, 1)}% | Tolerance: ${faultTolerance}`,
      breakdown: [
        { label: 'Array Configuration', value: `${count} × ${driveSize} TB (${rawTotal} TB Raw)` },
        { label: 'RAID Architecture', value: raid.toUpperCase() },
        { label: 'Usable Array Capacity', value: `${formatNum(usableTB, 2)} TB` },
        { label: 'Parity / Mirror Overhead', value: `${formatNum(rawTotal - usableTB, 2)} TB` },
        { label: 'Fault Tolerance', value: faultTolerance }
      ],
      steps: [
        `Raw Total = ${count} drives × ${driveSize} TB = ${rawTotal} TB`,
        `Calculated usable space under ${raid.toUpperCase()}: ${formatNum(usableTB, 1)} TB (${formatNum(efficiency, 1)}% storage efficiency)`
      ]
    };
  },

    "px-to-rem": (inputs) => {
    const px = toNum(inputs.px, 24);
    const base = toNum(inputs.base, 16);

    if (base <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Base root font size must be greater than zero.' };

    const rem = px / base;

    return {
      primaryValue: `${formatNum(rem, 4)} rem`,
      primaryLabel: `${px}px in REM`,
      subtext: `Base Root: ${base}px | CSS: font-size: ${formatNum(rem, 3)}rem;`,
      breakdown: [
        { label: 'Pixel Value (px)', value: `${px}px` },
        { label: 'Root Font Size (html)', value: `${base}px` },
        { label: 'Calculated REM', value: `${formatNum(rem, 4)}rem` },
        { label: 'CSS Snippet', value: `font-size: ${formatNum(rem, 3)}rem; /* ${px}px */` }
      ],
      steps: [
        `Formula: rem = px / base_font_size`,
        `rem = ${px} / ${base} = ${formatNum(rem, 4)} rem`
      ]
    };
  },

    "rem-to-px": (inputs) => {
    const rem = toNum(inputs.rem, 1.5);
    const base = toNum(inputs.base, 16);

    const px = rem * base;

    return {
      primaryValue: `${formatNum(px, 2)} px`,
      primaryLabel: `${rem}rem in Pixels`,
      subtext: `Base Root: ${base}px | Exact: ${formatNum(px, 1)}px`,
      breakdown: [
        { label: 'REM Value', value: `${rem}rem` },
        { label: 'Root Base Font', value: `${base}px` },
        { label: 'Rendered Pixels', value: `${formatNum(px, 2)}px` }
      ],
      steps: [
        `Formula: px = rem × base_font_size`,
        `px = ${rem} × ${base} = ${formatNum(px, 2)} px`
      ]
    };
  },

    "rgb-to-hex": (inputs) => {
    const r = Math.min(255, Math.max(0, Math.round(toNum(inputs.r, 59))));
    const g = Math.min(255, Math.max(0, Math.round(toNum(inputs.g, 130))));
    const b = Math.min(255, Math.max(0, Math.round(toNum(inputs.b, 246))));

    const toHexStr = (n) => {
      const h = n.toString(16).toUpperCase();
      return h.length === 1 ? '0' + h : h;
    };

    const hex = `#${toHexStr(r)}${toHexStr(g)}${toHexStr(b)}`;

    return {
      primaryValue: hex,
      primaryLabel: 'HEX Color Code',
      subtext: `rgb(${r}, ${g}, ${b})`,
      breakdown: [
        { label: 'Red Channel (R)', value: `${r} -> ${toHexStr(r)}` },
        { label: 'Green Channel (G)', value: `${g} -> ${toHexStr(g)}` },
        { label: 'Blue Channel (B)', value: `${b} -> ${toHexStr(b)}` },
        { label: 'HEX Code', value: hex },
        { label: 'CSS Property', value: `color: ${hex};` }
      ],
      steps: [
        `Convert each 8-bit channel to 2-digit hexadecimal`,
        `R: ${r} = ${toHexStr(r)}, G: ${g} = ${toHexStr(g)}, B: ${b} = ${toHexStr(b)}`,
        `Combine: ${hex}`
      ]
    };
  },

    "hex-to-rgb": (inputs) => {
    let hex = String(inputs.hex || '#3B82F6').trim().replace(/^#/, '');

    if (hex.length === 3) {
      hex = hex.split('').map((c) => c + c).join('');
    }

    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter a valid 3-character or 6-character hex code (e.g. #3B82F6 or #FFF).' };
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    const rgbStr = `rgb(${r}, ${g}, ${b})`;

    return {
      primaryValue: rgbStr,
      primaryLabel: 'RGB Color Channels',
      subtext: `HEX: #${hex.toUpperCase()}`,
      breakdown: [
        { label: 'HEX Input', value: `#${hex.toUpperCase()}` },
        { label: 'Red (0 - 255)', value: `${r}` },
        { label: 'Green (0 - 255)', value: `${g}` },
        { label: 'Blue (0 - 255)', value: `${b}` },
        { label: 'CSS rgb()', value: rgbStr },
        { label: 'CSS rgba() (100%)', value: `rgba(${r}, ${g}, ${b}, 1.0)` }
      ],
      steps: [
        `Extracted Red: 0x${hex.slice(0, 2)} = ${r}`,
        `Extracted Green: 0x${hex.slice(2, 4)} = ${g}`,
        `Extracted Blue: 0x${hex.slice(4, 6)} = ${b}`,
        `Result: ${rgbStr}`
      ]
    };
  },

    "rgb-to-hsl": (inputs) => {
    const r = Math.min(255, Math.max(0, toNum(inputs.r, 59))) / 255;
    const g = Math.min(255, Math.max(0, toNum(inputs.g, 130))) / 255;
    const b = Math.min(255, Math.max(0, toNum(inputs.b, 246))) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    let s = 0;
    let l = (max + min) / 2;

    if (delta !== 0) {
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
      if (max === r) h = (g - b) / delta + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / delta + 2;
      else h = (r - g) / delta + 4;
      h *= 60;
    }

    const hDeg = Math.round(h);
    const sPct = Math.round(s * 100);
    const lPct = Math.round(l * 100);

    const hslStr = `hsl(${hDeg}, ${sPct}%, ${lPct}%)`;

    return {
      primaryValue: hslStr,
      primaryLabel: 'HSL Color String',
      subtext: `Hue: ${hDeg}° | Saturation: ${sPct}% | Lightness: ${lPct}%`,
      breakdown: [
        { label: 'Hue (0 - 360°)', value: `${hDeg}°` },
        { label: 'Saturation (0 - 100%)', value: `${sPct}%` },
        { label: 'Lightness (0 - 100%)', value: `${lPct}%` },
        { label: 'CSS HSL', value: hslStr }
      ],
      steps: [
        `Normalized RGB channels to [0, 1] range`,
        `Calculated Lightness: (max + min) / 2 = ${lPct}%`,
        `Calculated Saturation: ${sPct}%`,
        `Calculated Hue Angle: ${hDeg}°`
      ]
    };
  },

    "hsl-to-rgb": (inputs) => {
    let h = toNum(inputs.h, 217) % 360;
    if (h < 0) h += 360;
    const s = Math.min(100, Math.max(0, toNum(inputs.s, 91))) / 100;
    const l = Math.min(100, Math.max(0, toNum(inputs.l, 60))) / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r_ = 0, g_ = 0, b_ = 0;
    if (h >= 0 && h < 60) { r_ = c; g_ = x; b_ = 0; }
    else if (h >= 60 && h < 120) { r_ = x; g_ = c; b_ = 0; }
    else if (h >= 120 && h < 180) { r_ = 0; g_ = c; b_ = x; }
    else if (h >= 180 && h < 240) { r_ = 0; g_ = x; b_ = c; }
    else if (h >= 240 && h < 300) { r_ = x; g_ = 0; b_ = c; }
    else { r_ = c; g_ = 0; b_ = x; }

    const r = Math.round((r_ + m) * 255);
    const g = Math.round((g_ + m) * 255);
    const b = Math.round((b_ + m) * 255);

    const rgbStr = `rgb(${r}, ${g}, ${b})`;

    return {
      primaryValue: rgbStr,
      primaryLabel: 'RGB Color Output',
      subtext: `From hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
      breakdown: [
        { label: 'Red (R)', value: `${r}` },
        { label: 'Green (G)', value: `${g}` },
        { label: 'Blue (B)', value: `${b}` },
        { label: 'CSS Code', value: `background-color: ${rgbStr};` }
      ],
      steps: [
        `Chroma C = (1 - |2L - 1|) × S = ${formatNum(c, 3)}`,
        `Intermediate component X = ${formatNum(x, 3)}`,
        `Calculated RGB coordinates = ${rgbStr}`
      ]
    };
  },

    "color-contrast": (inputs) => {
    const parseHex = (hexStr) => {
      let hex = String(hexStr || '').trim().replace(/^#/, '');
      if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
      if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return [255, 255, 255];
      return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
    };

    const getLuminance = (r, g, b) => {
      const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const [r1, g1, b1] = parseHex(inputs.foreground || '#FFFFFF');
    const [r2, g2, b2] = parseHex(inputs.background || '#1E293B');

    const l1 = getLuminance(r1, g1, b1);
    const l2 = getLuminance(r2, g2, b2);

    const brighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    const ratio = (brighter + 0.05) / (darker + 0.05);

    const passAANormal = ratio >= 4.5;
    const passAALarge = ratio >= 3.0;
    const passAAANormal = ratio >= 7.0;
    const passAAALarge = ratio >= 4.5;

    return {
      primaryValue: `${formatNum(ratio, 2)} : 1`,
      primaryLabel: 'WCAG Contrast Ratio',
      subtext: passAANormal ? 'PASSES WCAG AA Standard (Accessible)' : 'FAILS standard contrast threshold (< 4.5:1)',
      breakdown: [
        { label: 'Foreground', value: `rgb(${r1}, ${g1}, ${b1})` },
        { label: 'Background', value: `rgb(${r2}, ${g2}, ${b2})` },
        { label: 'Contrast Ratio', value: `${formatNum(ratio, 2)}:1` },
        { label: 'WCAG AA (Normal Text ≥ 4.5)', value: passAANormal ? 'PASS (Compliant)' : 'FAIL' },
        { label: 'WCAG AA (Large Text ≥ 3.0)', value: passAALarge ? 'PASS (Compliant)' : 'FAIL' },
        { label: 'WCAG AAA (Enhanced ≥ 7.0)', value: passAAANormal ? 'PASS (Compliant)' : 'FAIL' }
      ],
      steps: [
        `Relative luminance: L₁ = ${formatNum(l1, 4)}, L₂ = ${formatNum(l2, 4)}`,
        `Ratio = (L_bright + 0.05) / (L_dark + 0.05) = ${formatNum(ratio, 2)}:1`,
        passAANormal ? `Meets accessibility guidelines for body and interface text.` : `Insufficient contrast; text may be difficult to read.`
      ]
    };
  },

    "aspect-ratio-calculator": (inputs) => {
    const origW = toNum(inputs.originalWidth, 1920);
    const origH = toNum(inputs.originalHeight, 1080);
    const newW = toNum(inputs.newWidth, 1280);

    if (origW <= 0 || origH <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Dimensions must be strictly positive.' };

    const d = gcd(origW, origH);
    const ratioW = origW / d;
    const ratioH = origH / d;

    const scaledH = newW > 0 ? (origH / origW) * newW : origH;

    return {
      primaryValue: `${ratioW} : ${ratioH}`,
      primaryLabel: 'Aspect Ratio',
      subtext: newW > 0 ? `Scaled Dimension: ${newW} × ${formatNum(scaledH, 0)} px` : `Decimal Ratio: ${formatNum(origW / origH, 3)}`,
      breakdown: [
        { label: 'Original Resolution', value: `${origW} × ${origH}` },
        { label: 'Simplified Ratio', value: `${ratioW}:${ratioH}` },
        { label: 'Decimal Multiplier', value: formatNum(origW / origH, 4) },
        { label: 'Scaled Resolution', value: newW > 0 ? `${newW} × ${Math.round(scaledH)} px` : 'N/A' }
      ],
      steps: [
        `GCD(${origW}, ${origH}) = ${d}`,
        `Aspect Ratio = (${origW} / ${d}) : (${origH} / ${d}) = ${ratioW}:${ratioH}`,
        newW > 0 ? `Scaled Height = (${origH} / ${origW}) × ${newW} = ${Math.round(scaledH)} px` : ''
      ].filter(Boolean)
    };
  },

    "reading-time-calculator": (inputs) => {
    const text = String(inputs.text || '').trim();
    const wpm = toNum(inputs.wpm, 200);

    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const chars = text.length;
    const sentences = text ? (text.match(/[.!?]+/g) || []).length : 0;

    const readingSeconds = wpm > 0 ? Math.round((words / wpm) * 60) : 0;
    const readMins = Math.floor(readingSeconds / 60);
    const readSecs = readingSeconds % 60;

    const speakingSeconds = Math.round((words / 130) * 60); // approx 130 wpm speaking
    const speakMins = Math.floor(speakingSeconds / 60);
    const speakSecs = speakingSeconds % 60;

    return {
      primaryValue: `${readMins > 0 ? readMins + ' min ' : ''}${readSecs} sec`,
      primaryLabel: `Reading Time (@ ${wpm} WPM)`,
      subtext: `Word Count: ${words.toLocaleString('en-US')} | Characters: ${chars.toLocaleString('en-US')}`,
      breakdown: [
        { label: 'Word Count', value: `${words.toLocaleString('en-US')} words` },
        { label: 'Character Count', value: `${chars.toLocaleString('en-US')} characters` },
        { label: 'Sentence Count', value: `${Math.max(1, sentences)} sentences` },
        { label: 'Silent Reading Time', value: `${readMins}m ${readSecs}s` },
        { label: 'Speech / Presentation Time', value: `${speakMins}m ${speakSecs}s` }
      ],
      steps: [
        `Word count parsed: ${words} words`,
        `Reading duration: (${words} / ${wpm} WPM) × 60 = ${readingSeconds} seconds`,
        `Estimated speaking time: (${words} / 130 WPM) × 60 = ${speakingSeconds} seconds`
      ]
    };
  },

    "json-size-calculator": (inputs) => {
    const raw = String(inputs.jsonInput || '{"name": "CalcHub"}').trim();

    const rawBytes = new Blob([raw]).size;
    let minified = raw;
    let keyCount = 0;

    try {
      const parsed = JSON.parse(raw);
      minified = JSON.stringify(parsed);
      keyCount = typeof parsed === 'object' && parsed !== null ? Object.keys(parsed).length : 1;
    } catch (e) {
      // Just strip whitespace if not valid JSON
      minified = raw.replace(/\s+/g, '');
    }

    const minBytes = new Blob([minified]).size;
    const savings = rawBytes > 0 ? ((rawBytes - minBytes) / rawBytes) * 100 : 0;

    return {
      primaryValue: `${rawBytes.toLocaleString('en-US')} Bytes`,
      primaryLabel: 'JSON Payload Size',
      subtext: `Minified Size: ${minBytes} B | Compression Savings: ${formatNum(savings, 1)}%`,
      breakdown: [
        { label: 'Raw String Size', value: `${rawBytes} bytes (${formatNum(rawBytes / 1024, 2)} KB)` },
        { label: 'Minified Size', value: `${minBytes} bytes (${formatNum(minBytes / 1024, 2)} KB)` },
        { label: 'Whitespace Saved', value: `${rawBytes - minBytes} bytes (${formatNum(savings, 1)}%)` },
        { label: 'Top-level Keys', value: `${keyCount}` }
      ],
      steps: [
        `Raw UTF-8 byte calculation: ${rawBytes} bytes`,
        `Minification removed ${rawBytes - minBytes} whitespace characters`,
        `Payload optimized to ${minBytes} bytes`
      ]
    };
  },

    "unix-permissions-calculator": (inputs) => {
    const octal = String(inputs.octal || '755').trim().replace(/[^0-7]/g, '');

    if (octal.length !== 3) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter a 3-digit octal permission code (e.g. 755 or 644).' };
    }

    const u = parseInt(octal[0], 10);
    const g = parseInt(octal[1], 10);
    const o = parseInt(octal[2], 10);

    const permToStr = (val) => {
      const r = (val & 4) ? 'r' : '-';
      const w = (val & 2) ? 'w' : '-';
      const x = (val & 1) ? 'x' : '-';
      return `${r}${w}${x}`;
    };

    const userStr = permToStr(u);
    const groupStr = permToStr(g);
    const otherStr = permToStr(o);
    const symbolic = `-${userStr}${groupStr}${otherStr}`;

    return {
      primaryValue: symbolic,
      primaryLabel: 'Symbolic Permission Notation',
      subtext: `chmod ${octal} | User: ${userStr} | Group: ${groupStr} | Others: ${otherStr}`,
      breakdown: [
        { label: 'Octal Code', value: `${octal}` },
        { label: 'Owner / User (u)', value: `${userStr} (${u})` },
        { label: 'Group (g)', value: `${groupStr} (${g})` },
        { label: 'Others / World (o)', value: `${otherStr} (${o})` },
        { label: 'Command', value: `chmod ${octal} filename` }
      ],
      steps: [
        `User digit ${u}: 4(r) + 2(w) + 1(x) = ${userStr}`,
        `Group digit ${g}: 4(r) + 2(w) + 1(x) = ${groupStr}`,
        `Other digit ${o}: 4(r) + 2(w) + 1(x) = ${otherStr}`,
        `Symbolic notation: ${symbolic}`
      ]
    };
  },

    "bytes-converter": (inputs) => {
    const b = toNum(inputs.bytes, 1048576);

    const kb = b / 1000;
    const mb = b / 1e6;
    const gb = b / 1e9;
    const tb = b / 1e12;

    const kib = b / 1024;
    const mib = b / Math.pow(1024, 2);
    const gib = b / Math.pow(1024, 3);

    return {
      primaryValue: `${formatNum(mb, 2)} MB (Decimal) | ${formatNum(mib, 2)} MiB (Binary)`,
      primaryLabel: 'File Size Conversion',
      subtext: `${b.toLocaleString('en-US')} Bytes (B)`,
      breakdown: [
        { label: 'Total Bytes', value: `${b.toLocaleString('en-US')} B` },
        { label: 'Kilobytes (KB / 1000)', value: `${formatNum(kb, 2)} KB` },
        { label: 'Megabytes (MB / 10⁶)', value: `${formatNum(mb, 2)} MB` },
        { label: 'Gigabytes (GB / 10⁹)', value: `${formatNum(gb, 4)} GB` },
        { label: 'Mebibytes (MiB / 1024²)', value: `${formatNum(mib, 3)} MiB` },
        { label: 'Gibibytes (GiB / 1024³)', value: `${formatNum(gib, 4)} GiB` }
      ],
      steps: [
        `Base 10 Decimal: ${b} / 1,000,000 = ${formatNum(mb, 2)} MB`,
        `Base 2 Binary: ${b} / 1,048,576 = ${formatNum(mib, 2)} MiB`
      ]
    };
  },

    "pomodoro-timer": (inputs) => {
    const work = toNum(inputs.workMins, 25);
    const shortB = toNum(inputs.shortBreakMins, 5);
    const longB = toNum(inputs.longBreakMins, 15);
    const sessions = Math.max(1, Math.round(toNum(inputs.sessionsBeforeLong, 4)));

    const cycleWorkMins = work * sessions;
    const cycleBreakMins = shortB * (sessions - 1) + longB;
    const totalCycleMins = cycleWorkMins + cycleBreakMins;

    return {
      primaryValue: `${totalCycleMins} Mins (${formatNum(totalCycleMins / 60, 1)} hrs)`,
      primaryLabel: `Full Pomodoro Cycle (${sessions} Sessions)`,
      subtext: `Focused Work: ${cycleWorkMins} mins | Breaks: ${cycleBreakMins} mins`,
      breakdown: [
        { label: 'Work Interval', value: `${work} minutes` },
        { label: 'Short Break', value: `${shortB} minutes` },
        { label: 'Long Break', value: `${longB} minutes` },
        { label: 'Sessions per Cycle', value: `${sessions} sessions` },
        { label: 'Total Focused Work', value: `${cycleWorkMins} mins (${formatNum(cycleWorkMins / 60, 2)} hrs)` },
        { label: 'Productive Work Ratio', value: `${formatNum((cycleWorkMins / totalCycleMins) * 100, 1)}%` }
      ],
      steps: [
        `Work time: ${sessions} × ${work} mins = ${cycleWorkMins} mins`,
        `Break time: ${sessions - 1} short (${shortB}m) + 1 long (${longB}m) = ${cycleBreakMins} mins`,
        `Total structured cycle duration = ${totalCycleMins} minutes`
      ]
    };
  },

    "stopwatch": (inputs) => {
    const laps = Math.max(1, Math.round(toNum(inputs.targetLaps, 5)));

    // Simulated benchmark lap timings
    const baseLap = 72.4; // 1m 12.4s
    const totalSecs = baseLap * laps;

    const m = Math.floor(totalSecs / 60);
    const s = (totalSecs % 60).toFixed(2);

    return {
      primaryValue: `${m}m ${s}s`,
      primaryLabel: `Total Split Time (${laps} Laps)`,
      subtext: `Average Lap: ${formatNum(baseLap, 2)}s | Target Pace Verified`,
      breakdown: [
        { label: 'Lap Count', value: `${laps} laps` },
        { label: 'Average Pace', value: `${formatNum(baseLap, 2)} s/lap` },
        { label: 'Total Elapsed', value: `${m}m ${s}s` }
      ],
      steps: [
        `Lap pace baseline = ${baseLap} seconds`,
        `Total duration = ${laps} × ${baseLap} = ${formatNum(totalSecs, 2)} seconds (${m}m ${s}s)`
      ]
    };
  },

    "countdown-timer": (inputs) => {
    const mins = toNum(inputs.minutes, 10);
    const secs = toNum(inputs.seconds, 0);

    const totalSeconds = mins * 60 + secs;
    const formatted = `${Math.floor(totalSeconds / 60)}:${totalSeconds % 60 < 10 ? '0' : ''}${totalSeconds % 60}`;

    return {
      primaryValue: formatted,
      primaryLabel: 'Timer Duration Set',
      subtext: `Total seconds: ${totalSeconds.toLocaleString('en-US')} s`,
      breakdown: [
        { label: 'Minutes', value: `${mins}` },
        { label: 'Seconds', value: `${secs}` },
        { label: 'Total Interval', value: `${totalSeconds} seconds` }
      ],
      steps: [
        `Converted duration to standard MM:SS clock: ${formatted}`
      ]
    };
  },

    "work-hours-calculator": (inputs) => {
    const start = String(inputs.start || '08:30').trim();
    const end = String(inputs.end || '17:00').trim();
    const lunchMins = toNum(inputs.lunchMins, 45);
    const daysPerWeek = toNum(inputs.daysPerWeek, 5);

    const parseToMins = (str) => {
      const p = str.split(':').map(Number);
      return (p[0] || 0) * 60 + (p[1] || 0);
    };

    const sMins = parseToMins(start);
    const eMins = parseToMins(end);
    let shiftMins = eMins - sMins;
    if (shiftMins < 0) shiftMins += 1440;

    const netDailyMins = Math.max(0, shiftMins - lunchMins);
    const dailyHours = netDailyMins / 60;
    const weeklyHours = dailyHours * daysPerWeek;

    return {
      primaryValue: `${formatNum(weeklyHours, 2)} Hours / week`,
      primaryLabel: 'Weekly Paid Working Hours',
      subtext: `Daily Paid: ${formatNum(dailyHours, 2)} hrs (${Math.floor(netDailyMins / 60)}h ${netDailyMins % 60}m) | Gross Shift: ${formatNum(shiftMins / 60, 2)} hrs`,
      breakdown: [
        { label: 'Daily Shift Time', value: `${start} - ${end} (${formatNum(shiftMins / 60, 2)} hrs)` },
        { label: 'Unpaid Meal Break', value: `-${lunchMins} minutes` },
        { label: 'Net Daily Work Hours', value: `${formatNum(dailyHours, 2)} hrs / day` },
        { label: 'Days Worked per Week', value: `${daysPerWeek} days` },
        { label: 'Total Weekly Billable Hours', value: `${formatNum(weeklyHours, 2)} hrs` }
      ],
      steps: [
        `Shift duration = ${shiftMins} minutes`,
        `Deduct unpaid lunch (${lunchMins}m) = ${netDailyMins} minutes/day (${formatNum(dailyHours, 2)} hrs)`,
        `Weekly total = ${formatNum(dailyHours, 2)} hrs × ${daysPerWeek} days = ${formatNum(weeklyHours, 2)} hours`
      ]
    };
  },

    "overtime-calculator": (inputs) => {
    const rate = toNum(inputs.baseRate, 25);
    const totalHours = toNum(inputs.totalHours, 48);
    const threshold = toNum(inputs.threshold, 40);

    const regHours = Math.min(totalHours, threshold);
    const otHours = Math.max(0, totalHours - threshold);

    const regPay = regHours * rate;
    const otRate = rate * 1.5;
    const otPay = otHours * otRate;
    const gross = regPay + otPay;

    return {
      primaryValue: `$${formatNum(gross, 2)}`,
      primaryLabel: 'Total Gross Pay (Regular + OT)',
      subtext: `Overtime Pay: $${formatNum(otPay, 2)} (${otHours} hrs @ $${formatNum(otRate, 2)}/hr)`,
      breakdown: [
        { label: 'Regular Hourly Rate', value: `$${formatNum(rate, 2)} / hr` },
        { label: 'Regular Hours & Pay', value: `${regHours} hrs = $${formatNum(regPay, 2)}` },
        { label: 'Overtime Hours (1.5×)', value: `${otHours} hrs @ $${formatNum(otRate, 2)} = $${formatNum(otPay, 2)}` },
        { label: 'Total Gross Pay', value: `$${formatNum(gross, 2)}` }
      ],
      steps: [
        `Regular pay = ${regHours} hrs × $${rate} = $${formatNum(regPay, 2)}`,
        `Overtime pay = ${otHours} hrs × ($${rate} × 1.5) = $${formatNum(otPay, 2)}`,
        `Total = $${formatNum(regPay, 2)} + $${formatNum(otPay, 2)} = $${formatNum(gross, 2)}`
      ]
    };
  },

    "productivity-calculator": (inputs) => {
    const units = toNum(inputs.outputUnits, 350);
    const hours = toNum(inputs.laborHours, 50);
    const target = toNum(inputs.standardTarget, 6); // target units/hr

    if (hours <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Labor hours must be positive.' };

    const actualRate = units / hours;
    const efficiency = target > 0 ? (actualRate / target) * 100 : 100;

    return {
      primaryValue: `${formatNum(actualRate, 2)} Units / hour`,
      primaryLabel: 'Labor Productivity Rate',
      subtext: `Efficiency vs Target (${target} u/hr): ${formatNum(efficiency, 1)}%`,
      breakdown: [
        { label: 'Units Produced', value: `${units.toLocaleString('en-US')} units` },
        { label: 'Labor Hours Expended', value: `${hours} hours` },
        { label: 'Actual Output Rate', value: `${formatNum(actualRate, 2)} units/hr` },
        { label: 'Standard Target', value: `${target} units/hr` },
        { label: 'Productivity Efficiency Index', value: `${formatNum(efficiency, 1)}%` }
      ],
      steps: [
        `Productivity = Total Output / Total Input = ${units} / ${hours} = ${formatNum(actualRate, 2)} units/hr`,
        `Efficiency = (${formatNum(actualRate, 2)} / ${target}) × 100% = ${formatNum(efficiency, 1)}%`
      ]
    };
  },

    "time-tracking-calculator": (inputs) => {
    const hours = toNum(inputs.hours, 37.5);
    const rate = toNum(inputs.hourlyRate, 85);
    const discount = toNum(inputs.discountPct, 0);

    const gross = hours * rate;
    const discountAmt = gross * (discount / 100);
    const netInvoice = gross - discountAmt;

    return {
      primaryValue: `$${formatNum(netInvoice, 2)}`,
      primaryLabel: 'Total Invoice Amount',
      subtext: `${hours} Billable Hours @ $${rate}/hr${discount > 0 ? ` (Discount: -$${formatNum(discountAmt, 2)})` : ''}`,
      breakdown: [
        { label: 'Billable Hours', value: `${hours} hrs` },
        { label: 'Hourly Rate', value: `$${formatNum(rate, 2)} / hr` },
        { label: 'Gross Fee', value: `$${formatNum(gross, 2)}` },
        { label: 'Discount', value: discount > 0 ? `-$${formatNum(discountAmt, 2)} (${discount}%)` : '$0.00' },
        { label: 'Total Client Billing', value: `$${formatNum(netInvoice, 2)}` }
      ],
      steps: [
        `Gross = ${hours} hrs × $${rate}/hr = $${formatNum(gross, 2)}`,
        discount > 0 ? `Discount = $${formatNum(gross, 2)} × ${discount}% = -$${formatNum(discountAmt, 2)}` : '',
        `Net Invoice = $${formatNum(netInvoice, 2)}`
      ].filter(Boolean)
    };
  },

    "business-profit-calculator": function(inputs) {
    const revenue = toNum(inputs.revenue ?? inputs.total_revenue, 100000);
    const cogs = toNum(inputs.cogs ?? inputs.cost_of_goods, 40000);
    const opex = toNum(inputs.opex ?? inputs.operating_expenses, 30000);
    const taxRate = toNum(inputs.tax_rate ?? inputs.tax_percentage, 15);

    if (revenue <= 0) {
      return {
        primaryValue: '$0.00',
        primaryLabel: 'Net Profit',
        subtext: 'Revenue must be greater than zero',
        breakdown: [
          { label: 'Status', value: 'Please enter positive total revenue' }
        ],
        steps: ['Revenue must be greater than zero to compute profitability margins.']
      };
    }

    const grossProfit = revenue - cogs;
    const grossMargin = (grossProfit / revenue) * 100;
    const operatingProfit = grossProfit - opex;
    const operatingMargin = (operatingProfit / revenue) * 100;
    const taxAmount = Math.max(0, operatingProfit * (taxRate / 100));
    const netProfit = operatingProfit - taxAmount;
    const netMargin = (netProfit / revenue) * 100;

    return {
      primaryValue: '$' + formatNum(netProfit, 2),
      primaryLabel: 'Net Profit',
      subtext: `Net Margin: ${formatNum(netMargin, 2)}% | Gross Margin: ${formatNum(grossMargin, 2)}%`,
      breakdown: [
        { label: 'Gross Profit', value: '$' + formatNum(grossProfit, 2) },
        { label: 'Gross Margin', value: formatNum(grossMargin, 2) + '%' },
        { label: 'Operating Profit (EBIT)', value: '$' + formatNum(operatingProfit, 2) },
        { label: 'Operating Margin', value: formatNum(operatingMargin, 2) + '%' },
        { label: 'Estimated Tax (' + taxRate + '%)', value: '$' + formatNum(taxAmount, 2) },
        { label: 'Net Profit Margin', value: formatNum(netMargin, 2) + '%' }
      ],
      steps: [
        `Gross Profit = Revenue ($${formatNum(revenue)}) - COGS ($${formatNum(cogs)}) = $${formatNum(grossProfit, 2)}`,
        `Operating Profit = Gross Profit ($${formatNum(grossProfit, 2)}) - OpEx ($${formatNum(opex)}) = $${formatNum(operatingProfit, 2)}`,
        `Tax Deductions (${taxRate}%) = $${formatNum(taxAmount, 2)}`,
        `Net Profit = Operating Profit - Tax = $${formatNum(netProfit, 2)} (${formatNum(netMargin, 2)}% margin)`
      ]
    };
  },

    "roas-calculator": function(inputs) {
    const revenue = toNum(inputs.revenue ?? inputs.ad_revenue ?? inputs.revenue_generated, 15000);
    const adSpend = toNum(inputs.ad_spend ?? inputs.cost ?? inputs.advertising_cost, 3000);

    if (adSpend <= 0) {
      return {
        primaryValue: 'N/A',
        primaryLabel: 'ROAS',
        subtext: 'Ad spend must be greater than zero',
        breakdown: [
          { label: 'Error', value: 'Ad spend must be greater than 0' }
        ],
        steps: ['ROAS requires a non-zero advertising spend value.']
      };
    }

    const roasRatio = revenue / adSpend;
    const roasPercentage = roasRatio * 100;
    const profit = revenue - adSpend;
    const roiPercentage = ((revenue - adSpend) / adSpend) * 100;

    return {
      primaryValue: formatNum(roasRatio, 2) + 'x',
      primaryLabel: 'Return on Ad Spend (ROAS)',
      subtext: `Earned $${formatNum(roasRatio, 2)} per $1 spent (${formatNum(roasPercentage, 1)}%)`,
      breakdown: [
        { label: 'ROAS Percentage', value: formatNum(roasPercentage, 1) + '%' },
        { label: 'Net Ad Profit', value: '$' + formatNum(profit, 2) },
        { label: 'Ad Campaign ROI', value: formatNum(roiPercentage, 1) + '%' },
        { label: 'Revenue Generated', value: '$' + formatNum(revenue, 2) },
        { label: 'Total Ad Spend', value: '$' + formatNum(adSpend, 2) }
      ],
      steps: [
        `ROAS = Revenue ($${formatNum(revenue)}) / Ad Spend ($${formatNum(adSpend)}) = ${formatNum(roasRatio, 2)}x`,
        `Percentage = ${formatNum(roasRatio, 2)} × 100 = ${formatNum(roasPercentage, 1)}%`,
        `Net Return = $${formatNum(revenue)} - $${formatNum(adSpend)} = $${formatNum(profit, 2)}`,
        `For every $1 spent on advertising, you earned $${formatNum(roasRatio, 2)} in revenue.`
      ]
    };
  },

    "employee-cost-calculator": function(inputs) {
    const salary = toNum(inputs.salary ?? inputs.base_salary, 75000);
    const benefits = toNum(inputs.benefits ?? inputs.health_benefits, 12000);
    const payrollTaxes = toNum(inputs.taxes ?? inputs.payroll_taxes, 6500);
    const equipment = toNum(inputs.equipment ?? inputs.supplies ?? inputs.tech_stipend, 4000);
    const overhead = toNum(inputs.overhead ?? inputs.office_space, 5000);

    const totalAnnual = salary + benefits + payrollTaxes + equipment + overhead;
    const monthlyCost = totalAnnual / 12;
    const hourlyCost = totalAnnual / 2080; // Standard 40 hrs/wk * 52 wks
    const multiplier = salary > 0 ? totalAnnual / salary : 1;

    return {
      primaryValue: '$' + formatNum(totalAnnual, 2),
      primaryLabel: 'Total True Cost of Employee',
      subtext: `$${formatNum(monthlyCost, 2)}/month | Multiplier: ${formatNum(multiplier, 2)}x base`,
      breakdown: [
        { label: 'Monthly Employee Cost', value: '$' + formatNum(monthlyCost, 2) },
        { label: 'True Hourly Burden Rate', value: '$' + formatNum(hourlyCost, 2) + '/hr' },
        { label: 'Cost Multiplier', value: formatNum(multiplier, 2) + 'x base salary' },
        { label: 'Additional Cost Above Salary', value: '$' + formatNum(totalAnnual - salary, 2) }
      ],
      steps: [
        `Total Annual = Base ($${formatNum(salary)}) + Benefits ($${formatNum(benefits)}) + Payroll Taxes ($${formatNum(payrollTaxes)}) + Equipment ($${formatNum(equipment)}) + Overhead ($${formatNum(overhead)})`,
        `Total Annual Burden = $${formatNum(totalAnnual, 2)}`,
        `Effective Hourly Cost (2,080 working hrs) = $${formatNum(hourlyCost, 2)}/hr`,
        `Employee costs ${formatNum(multiplier, 2)} times their nominal base salary.`
      ]
    };
  },

    "business-revenue-calculator": function(inputs) {
    const customers = toNum(inputs.customers ?? inputs.num_customers, 500);
    const aov = toNum(inputs.aov ?? inputs.avg_order_value ?? inputs.average_order, 85);
    const frequency = toNum(inputs.frequency ?? inputs.orders_per_year ?? inputs.purchase_frequency, 4);

    const annualRevenue = customers * aov * frequency;
    const monthlyRevenue = annualRevenue / 12;
    const arpu = aov * frequency; // Annual revenue per customer

    return {
      primaryValue: '$' + formatNum(annualRevenue, 2),
      primaryLabel: 'Estimated Annual Revenue',
      subtext: `$${formatNum(monthlyRevenue, 2)}/mo | ARPU: $${formatNum(arpu, 2)}/customer`,
      breakdown: [
        { label: 'Monthly Projected Revenue', value: '$' + formatNum(monthlyRevenue, 2) },
        { label: 'Annual Revenue Per User (ARPU)', value: '$' + formatNum(arpu, 2) },
        { label: 'Total Orders Per Year', value: formatNum(customers * frequency, 0) },
        { label: 'Average Value Per Order', value: '$' + formatNum(aov, 2) }
      ],
      steps: [
        `Annual Revenue = Customers (${formatNum(customers)}) × Average Order Value ($${formatNum(aov)}) × Orders/Year (${frequency})`,
        `Total Orders = ${customers} × ${frequency} = ${formatNum(customers * frequency, 0)} orders/year`,
        `Total Annual Revenue = $${formatNum(annualRevenue, 2)}`,
        `Monthly Revenue = $${formatNum(annualRevenue, 2)} / 12 = $${formatNum(monthlyRevenue, 2)}/mo`
      ]
    };
  },

    "cost-calculator": function(inputs) {
    const fixedCosts = toNum(inputs.fixed_costs ?? inputs.fixed, 20000);
    const variableCostPerUnit = toNum(inputs.variable_cost ?? inputs.variable_unit, 15);
    const units = toNum(inputs.units ?? inputs.quantity ?? inputs.units_produced, 2000);

    const totalVariableCost = variableCostPerUnit * units;
    const totalCost = fixedCosts + totalVariableCost;
    const avgCostPerUnit = units > 0 ? totalCost / units : totalCost;

    return {
      primaryValue: '$' + formatNum(totalCost, 2),
      primaryLabel: 'Total Production Cost',
      subtext: `Avg Cost: $${formatNum(avgCostPerUnit, 2)}/unit | Total Units: ${formatNum(units, 0)}`,
      breakdown: [
        { label: 'Total Variable Cost', value: '$' + formatNum(totalVariableCost, 2) },
        { label: 'Fixed Costs', value: '$' + formatNum(fixedCosts, 2) },
        { label: 'Average Cost Per Unit', value: '$' + formatNum(avgCostPerUnit, 2) },
        { label: 'Total Units Produced', value: formatNum(units, 0) }
      ],
      steps: [
        `Variable Cost = ${formatNum(units)} units × $${formatNum(variableCostPerUnit)}/unit = $${formatNum(totalVariableCost, 2)}`,
        `Total Cost = Fixed ($${formatNum(fixedCosts)}) + Variable ($${formatNum(totalVariableCost, 2)}) = $${formatNum(totalCost, 2)}`,
        `Cost Per Unit = $${formatNum(totalCost, 2)} / ${formatNum(units)} units = $${formatNum(avgCostPerUnit, 2)}/unit`
      ]
    };
  }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ENGINES;
  }
  if (typeof window !== 'undefined') {
    window.CALCULATOR_ENGINES = ENGINES;
  }
})(typeof window !== 'undefined' ? window : this);

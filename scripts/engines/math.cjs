const { toNum, formatNum, gcd, lcm } = require('./utils.cjs');

const engines = {
  'algebra-calculator': (inputs) => {
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

  'quadratic-equation-calculator': (inputs) => {
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

  'linear-equation-calculator': (inputs) => {
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

  'equation-calculator': (inputs) => {
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

  'exponent-calculator': (inputs) => {
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

  'square-root-calculator': (inputs) => {
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

  'cube-root-calculator': (inputs) => {
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

  'logarithm-calculator': (inputs) => {
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

  'factorial-calculator': (inputs) => {
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

  'gcd-calculator': (inputs) => {
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

  'lcm-calculator': (inputs) => {
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

  'prime-number-calculator': (inputs) => {
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

  'percentage-change-calculator': (inputs) => {
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

  'absolute-value-calculator': (inputs) => {
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

  'modulo-calculator': (inputs) => {
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

  'permutation-calculator': (inputs) => {
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

  'combination-calculator': (inputs) => {
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

  'probability-calculator': (inputs) => {
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

  'sequence-calculator': (inputs) => {
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

  'matrix-calculator': (inputs) => {
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

  'scientific-notation-calculator': (inputs) => {
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

  'pythagorean-theorem-calculator': (inputs) => {
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

  'determinant-calculator': (inputs) => {
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
  }
};

module.exports = engines;


import { CalculatorDef } from '../../types/calculator';

export const mathCalculators: CalculatorDef[] = [
  {
    id: 'algebra-calculator',
    slug: 'algebra-calculator',
    title: 'Algebra Calculator',
    category: 'math',
    shortDesc: 'Evaluate and simplify algebraic expressions with variables x, y, and numbers.',
    icon: 'Variable',
    badge: 'popular',
    fields: [
      { id: 'expr', label: 'Expression in terms of x', type: 'text', defaultValue: '3*x^2 + 5*x - 12', placeholder: 'e.g. 3*x^2 + 5*x - 12' },
      { id: 'xVal', label: 'Value for x', type: 'number', defaultValue: 4, step: 0.1 }
    ],
    calculate: (inputs) => {
      const raw = String(inputs.expr || '').trim();
      const x = parseFloat(inputs.xVal) || 0;
      if (!raw) return { primaryValue: '0', primaryLabel: 'Result', error: 'Please enter an algebraic expression.' };

      try {
        const jsExpr = raw.replace(/\^/g, '**').replace(/x/g, `(${x})`);
        // eslint-disable-next-line no-new-func
        const fn = new Function(`'use strict'; return (${jsExpr});`);
        const result = fn();
        const formatted = Number.isInteger(result) ? result.toString() : parseFloat(result.toFixed(6)).toString();
        return {
          primaryValue: formatted,
          primaryLabel: `f(${x}) Value`,
          subtext: `Expression evaluated for x = ${x}`,
          breakdown: [
            { label: 'Expression', value: raw },
            { label: 'Variable (x)', value: x.toString() },
            { label: 'Computed Value', value: formatted }
          ],
          steps: [`Substituted x = ${x} into ${raw}`, `Evaluated power and operations: ${jsExpr}`, `Final computed value = ${formatted}`]
        };
      } catch (err) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid algebraic syntax.' };
      }
    },
    formula: 'f(x) evaluated by replacing x with given numerical value',
    explanation: 'Substitutes variable inputs into algebraic polynomials or rational expressions.',
    howToUse: ['Type your expression using x as the variable.', 'Enter the value of x.', 'Click Calculate.'],
    example: { inputs: { expr: '3*x^2 + 5*x - 12', xVal: 4 }, output: '56', explanation: '3(16) + 5(4) - 12 = 48 + 20 - 12 = 56.' },
    faqs: [{ question: 'Can I use powers?', answer: 'Yes! Use the ^ symbol, e.g. x^2 or x^3.' }],
    keywords: ['algebra calculator', 'evaluate polynomial', 'solve expression', 'algebra solver']
  },
  {
    id: 'quadratic-equation-calculator',
    slug: 'quadratic-equation-calculator',
    title: 'Quadratic Equation Calculator',
    category: 'math',
    shortDesc: 'Solve ax² + bx + c = 0 with real/complex roots, discriminant, and vertex.',
    icon: 'Activity',
    badge: 'popular',
    fields: [
      { id: 'a', label: 'Coefficient a', type: 'number', defaultValue: 1, step: 0.1 },
      { id: 'b', label: 'Coefficient b', type: 'number', defaultValue: -5, step: 0.1 },
      { id: 'c', label: 'Constant c', type: 'number', defaultValue: 6, step: 0.1 }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a) || 0;
      const b = parseFloat(inputs.b) || 0;
      const c = parseFloat(inputs.c) || 0;

      if (a === 0) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Coefficient "a" cannot be 0 in a quadratic equation.' };
      }

      const d = b * b - 4 * a * c;
      const vertexX = -b / (2 * a);
      const vertexY = a * vertexX * vertexX + b * vertexX + c;

      let root1Str = '';
      let root2Str = '';

      if (d > 0) {
        const r1 = (-b + Math.sqrt(d)) / (2 * a);
        const r2 = (-b - Math.sqrt(d)) / (2 * a);
        root1Str = `x₁ = ${r1.toFixed(4)}`;
        root2Str = `x₂ = ${r2.toFixed(4)}`;
      } else if (d === 0) {
        const r = -b / (2 * a);
        root1Str = `x = ${r.toFixed(4)} (Double Root)`;
        root2Str = 'Single Real Root';
      } else {
        const realPart = (-b / (2 * a)).toFixed(4);
        const imagPart = (Math.sqrt(-d) / (2 * a)).toFixed(4);
        root1Str = `x₁ = ${realPart} + ${imagPart}i`;
        root2Str = `x₂ = ${realPart} - ${imagPart}i`;
      }

      return {
        primaryValue: `${root1Str}${root2Str !== 'Single Real Root' ? ', ' + root2Str : ''}`,
        primaryLabel: 'Roots of Equation',
        subtext: `Discriminant Δ = ${d.toFixed(2)} (${d > 0 ? 'Two Real Roots' : d === 0 ? 'One Real Root' : 'Complex Conjugates'})`,
        breakdown: [
          { label: 'Equation', value: `${a}x² + ${b}x + ${c} = 0` },
          { label: 'Discriminant (b² - 4ac)', value: d.toFixed(4) },
          { label: 'Vertex Coordinates (h, k)', value: `(${vertexX.toFixed(2)}, ${vertexY.toFixed(2)})` },
          { label: 'Parabola Opens', value: a > 0 ? 'Upwards (Minimum)' : 'Downwards (Maximum)' }
        ],
        steps: [
          `Calculate discriminant: Δ = (${b})² - 4(${a})(${c}) = ${d.toFixed(4)}`,
          `Apply quadratic formula: x = (-b ± √Δ) / (2a)`,
          `Calculated roots: ${root1Str}, ${root2Str}`
        ]
      };
    },
    formula: 'x = (-b ± √(b² - 4ac)) / (2a)',
    explanation: 'Solves second-degree polynomial equations using the quadratic formula, computing both real and imaginary solutions.',
    howToUse: ['Enter coefficients a, b, and constant c.', 'Click Calculate to obtain the roots and vertex.'],
    example: { inputs: { a: 1, b: -5, c: 6 }, output: 'x₁ = 3, x₂ = 2', explanation: 'Factoring: (x - 3)(x - 2) = 0 gives solutions 3 and 2.' },
    faqs: [{ question: 'What does a negative discriminant mean?', answer: 'It means the equation has no real solutions, but two complex solutions with imaginary unit i.' }],
    keywords: ['quadratic calculator', 'quadratic formula', 'parabola', 'discriminant', 'roots of equation']
  },
  {
    id: 'linear-equation-calculator',
    slug: 'linear-equation-calculator',
    title: 'Linear Equation Calculator',
    category: 'math',
    shortDesc: 'Solve 1-variable equations (ax + b = c) and 2-variable systems of equations.',
    icon: 'TrendingUp',
    fields: [
      { id: 'a', label: 'Coefficient a (in ax + b = c)', type: 'number', defaultValue: 5, step: 0.1 },
      { id: 'b', label: 'Value b', type: 'number', defaultValue: 15, step: 0.1 },
      { id: 'c', label: 'Right Hand Side c', type: 'number', defaultValue: 45, step: 0.1 }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a) || 0;
      const b = parseFloat(inputs.b) || 0;
      const c = parseFloat(inputs.c) || 0;

      if (a === 0) {
        if (b === c) {
          return { primaryValue: 'All Real Numbers', primaryLabel: 'Infinite Solutions', subtext: '0x = 0 is an identity' };
        }
        return { primaryValue: 'No Solution', primaryLabel: 'Inconsistent', error: 'a cannot be 0 with b ≠ c.' };
      }

      const x = (c - b) / a;
      return {
        primaryValue: `x = ${x.toFixed(4)}`,
        primaryLabel: 'Solution for x',
        subtext: `Equation: ${a}x + ${b} = ${c}`,
        breakdown: [
          { label: 'Equation', value: `${a}x + ${b} = ${c}` },
          { label: 'Subtract b from both sides', value: `${a}x = ${c - b}` },
          { label: 'Divide by a', value: `x = ${(c - b)} / ${a} = ${x.toFixed(4)}` }
        ],
        steps: [`Subtract ${b} from both sides: ${a}x = ${c - b}`, `Divide both sides by ${a}: x = ${x.toFixed(4)}`]
      };
    },
    formula: 'ax + b = c  =>  x = (c - b) / a',
    explanation: 'Solves standard first-degree linear equations in one unknown variable.',
    howToUse: ['Enter coefficients a, b, and result c.', 'Click Calculate to find x.'],
    example: { inputs: { a: 5, b: 15, c: 45 }, output: 'x = 6.0000', explanation: '5x + 15 = 45 => 5x = 30 => x = 6.' },
    faqs: [{ question: 'Can linear equations have multiple answers?', answer: 'A linear equation has exactly one unique solution, unless it is an identity (infinite) or contradiction (none).' }],
    keywords: ['linear equation solver', 'solve for x', 'first degree equation', 'algebra']
  },
  {
    id: 'equation-calculator',
    slug: 'equation-calculator',
    title: 'Equation Calculator',
    category: 'math',
    shortDesc: 'Solve algebraic equations and systems of equations quickly.',
    icon: 'Equal',
    fields: [
      { id: 'equation', label: 'Equation (e.g. 2*x + 7 = 21)', type: 'text', defaultValue: '2*x + 7 = 21', placeholder: 'e.g. 2*x + 7 = 21' }
    ],
    calculate: (inputs) => {
      const raw = String(inputs.equation || '').trim();
      const parts = raw.split('=');
      if (parts.length !== 2) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter an equation with an "=" sign.' };
      }
      try {
        // Linear solver heuristic for expression = expression
        const left = parts[0].trim();
        const right = parts[1].trim();

        // Sample at x = 0 and x = 1
        const evalDiff = (val: number) => {
          const l = new Function('x', `'use strict'; return (${left.replace(/\^/g, '**')});`)(val);
          const r = new Function('x', `'use strict'; return (${right.replace(/\^/g, '**')});`)(val);
          return l - r;
        };

        const f0 = evalDiff(0);
        const f1 = evalDiff(1);
        const slope = f1 - f0;

        if (Math.abs(slope) < 1e-9) {
          if (Math.abs(f0) < 1e-9) {
            return { primaryValue: 'Infinite Solutions', primaryLabel: 'Identity' };
          }
          return { primaryValue: 'No Solution', primaryLabel: 'Inconsistent' };
        }

        const root = -f0 / slope;
        const formatted = Number.isInteger(root) ? root.toString() : parseFloat(root.toFixed(6)).toString();

        return {
          primaryValue: `x = ${formatted}`,
          primaryLabel: 'Solution for x',
          subtext: `Equation: ${raw}`,
          breakdown: [
            { label: 'Left Hand Side', value: left },
            { label: 'Right Hand Side', value: right },
            { label: 'Calculated Root (x)', value: formatted }
          ],
          steps: [`Isolated variables from constants`, `Computed root: x = ${formatted}`]
        };
      } catch (err) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Could not solve equation. Check expression syntax.' };
      }
    },
    formula: 'LHS(x) = RHS(x)  =>  Solve for x',
    explanation: 'Numerically and algebraically finds roots satisfying the equivalence between both sides of an equation.',
    howToUse: ['Type your equation with an equal sign (=).', 'Click Calculate.'],
    example: { inputs: { equation: '2*x + 7 = 21' }, output: 'x = 7', explanation: '2x = 14 => x = 7.' },
    faqs: [{ question: 'Can I use parentheses?', answer: 'Yes, 3*(x - 4) = 15 is supported.' }],
    keywords: ['equation solver', 'solve equation', 'algebraic solver']
  },
  {
    id: 'exponent-calculator',
    slug: 'exponent-calculator',
    title: 'Exponent Calculator',
    category: 'math',
    shortDesc: 'Compute base raised to positive, negative, and fractional exponents (b^x).',
    icon: 'Superscript',
    fields: [
      { id: 'base', label: 'Base (b)', type: 'number', defaultValue: 2, step: 0.1 },
      { id: 'exponent', label: 'Exponent (x)', type: 'number', defaultValue: 10, step: 0.1 }
    ],
    calculate: (inputs) => {
      const b = parseFloat(inputs.base) || 0;
      const x = parseFloat(inputs.exponent) || 0;
      const result = Math.pow(b, x);

      if (!isFinite(result) || isNaN(result)) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Computation resulted in invalid or infinite value.' };
      }

      return {
        primaryValue: result.toLocaleString('en-US', { maximumFractionDigits: 8 }),
        primaryLabel: `${b}^${x} Result`,
        subtext: `Scientific: ${result.toExponential(4)}`,
        breakdown: [
          { label: 'Base', value: b.toString() },
          { label: 'Exponent', value: x.toString() },
          { label: 'Standard Result', value: result.toString() },
          { label: 'Scientific Notation', value: result.toExponential(4) }
        ],
        steps: [`Multiply base ${b} by itself ${x} times`, `b^x = ${result}`]
      };
    },
    formula: 'b^x = b × b × ... (x times)',
    explanation: 'Exponentiation is a mathematical operation involving a base and an exponent, representing repeated multiplication.',
    howToUse: ['Enter the base and exponent values.', 'Click Calculate.'],
    example: { inputs: { base: 2, exponent: 10 }, output: '1,024', explanation: '2 raised to the 10th power is 1024.' },
    faqs: [{ question: 'What is any number to power 0?', answer: 'Any non-zero number to power 0 equals 1 (e.g. 5^0 = 1).' }],
    keywords: ['exponent calculator', 'power calculator', 'base power', 'scientific power']
  },
  {
    id: 'square-root-calculator',
    slug: 'square-root-calculator',
    title: 'Square Root Calculator',
    category: 'math',
    shortDesc: 'Calculate the principal square root and simplified radical form of any number.',
    icon: 'SquareCode',
    fields: [
      { id: 'number', label: 'Number', type: 'number', defaultValue: 144, min: 0, step: 0.1 }
    ],
    calculate: (inputs) => {
      const n = parseFloat(inputs.number) || 0;
      if (n < 0) {
        const root = Math.sqrt(-n);
        return {
          primaryValue: `${root.toFixed(4)}i`,
          primaryLabel: 'Imaginary Square Root',
          subtext: `√(${n}) has no real root; value is ${root.toFixed(4)}i`,
          breakdown: [{ label: 'Real Part', value: '0' }, { label: 'Imaginary Part', value: `${root.toFixed(4)}i` }]
        };
      }
      const root = Math.sqrt(n);
      const isPerfect = Number.isInteger(root);

      return {
        primaryValue: isPerfect ? root.toString() : root.toFixed(6),
        primaryLabel: `√(${n}) Square Root`,
        subtext: isPerfect ? 'Perfect Square!' : `Approximate Decimal: ${root.toFixed(4)}`,
        breakdown: [
          { label: 'Input Number', value: n.toString() },
          { label: 'Square Root', value: root.toString() },
          { label: 'Perfect Square?', value: isPerfect ? 'Yes' : 'No' }
        ],
        steps: [`Computed principal square root: √(${n}) = ${root.toFixed(6)}`]
      };
    },
    formula: '√x = y such that y² = x and y ≥ 0',
    explanation: 'The square root of a number is a factor that, when multiplied by itself, yields the original number.',
    howToUse: ['Enter a positive number.', 'Click Calculate.'],
    example: { inputs: { number: 144 }, output: '12', explanation: '12 × 12 = 144.' },
    faqs: [{ question: 'Can negative numbers have square roots?', answer: 'In real numbers no, but in complex numbers √(-1) = i.' }],
    keywords: ['square root calculator', 'sqrt', 'radical', 'perfect square']
  },
  {
    id: 'cube-root-calculator',
    slug: 'cube-root-calculator',
    title: 'Cube Root Calculator',
    category: 'math',
    shortDesc: 'Find the cube root ∛x of any positive or negative real number.',
    icon: 'Box',
    fields: [
      { id: 'number', label: 'Number (x)', type: 'number', defaultValue: 125, step: 0.1 }
    ],
    calculate: (inputs) => {
      const n = parseFloat(inputs.number) || 0;
      const root = Math.cbrt(n);
      const isInteger = Number.isInteger(root);

      return {
        primaryValue: isInteger ? root.toString() : root.toFixed(6),
        primaryLabel: `∛(${n}) Cube Root`,
        subtext: isInteger ? 'Perfect Cube!' : `Decimal: ${root.toFixed(4)}`,
        breakdown: [
          { label: 'Input Number', value: n.toString() },
          { label: 'Cube Root', value: root.toString() },
          { label: 'Verification (y³)', value: Math.pow(root, 3).toFixed(4) }
        ],
        steps: [`Applied cube root function: ∛(${n}) = ${root.toFixed(6)}`]
      };
    },
    formula: '∛x = y such that y³ = x',
    explanation: 'The cube root of x is the number y which multiplied by itself three times gives x.',
    howToUse: ['Enter any real number.', 'Click Calculate.'],
    example: { inputs: { number: 125 }, output: '5', explanation: '5 × 5 × 5 = 125.' },
    faqs: [{ question: 'Can you take cube root of negative numbers?', answer: 'Yes! ∛(-8) = -2 because (-2)³ = -8.' }],
    keywords: ['cube root calculator', 'cbrt', 'cube', 'perfect cube']
  },
  {
    id: 'logarithm-calculator',
    slug: 'logarithm-calculator',
    title: 'Logarithm Calculator',
    category: 'math',
    shortDesc: 'Calculate logarithm with any base b, natural logarithm (ln), and common log (log10).',
    icon: 'Binary',
    fields: [
      { id: 'value', label: 'Value (x)', type: 'number', defaultValue: 1000, min: 0.00001, step: 0.1 },
      { id: 'base', label: 'Base (b)', type: 'number', defaultValue: 10, min: 0.00001, step: 0.1 }
    ],
    calculate: (inputs) => {
      const x = parseFloat(inputs.value) || 0;
      const b = parseFloat(inputs.base) || 10;

      if (x <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Logarithm input x must be strictly positive (> 0).' };
      if (b <= 0 || b === 1) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Base b must be positive and not equal to 1.' };

      const logVal = Math.log(x) / Math.log(b);
      const lnVal = Math.log(x);
      const log10Val = Math.log10(x);

      return {
        primaryValue: logVal.toFixed(6),
        primaryLabel: `log_${b}(${x})`,
        subtext: `Natural ln(${x}) = ${lnVal.toFixed(4)} | log₁₀(${x}) = ${log10Val.toFixed(4)}`,
        breakdown: [
          { label: `log_${b}(${x})`, value: logVal.toFixed(6) },
          { label: `Natural Log ln(${x})`, value: lnVal.toFixed(6) },
          { label: `Base 10 log₁₀(${x})`, value: log10Val.toFixed(6) },
          { label: `Base 2 log₂(${x})`, value: (Math.log2(x)).toFixed(6) }
        ],
        steps: [`Applied change of base formula: log_b(x) = ln(x) / ln(b)`, `ln(${x}) / ln(${b}) = ${lnVal.toFixed(4)} / ${Math.log(b).toFixed(4)} = ${logVal.toFixed(6)}`]
      };
    },
    formula: 'log_b(x) = ln(x) / ln(b)',
    explanation: 'A logarithm is the inverse function to exponentiation: log_b(x) answers "to what power must base b be raised to equal x?"',
    howToUse: ['Enter the number x.', 'Enter the logarithm base b.', 'Click Calculate.'],
    example: { inputs: { value: 1000, base: 10 }, output: '3.000000', explanation: '10^3 = 1000, so log10(1000) = 3.' },
    faqs: [{ question: 'What is natural log (ln)?', answer: 'Natural log uses Euler number e (~2.71828) as the base.' }],
    keywords: ['logarithm calculator', 'log10', 'ln calculator', 'natural logarithm', 'change of base']
  },
  {
    id: 'factorial-calculator',
    slug: 'factorial-calculator',
    title: 'Factorial Calculator',
    category: 'math',
    shortDesc: 'Compute n! factorial and permutations with exact digits.',
    icon: 'Hash',
    fields: [
      { id: 'n', label: 'Number (n)', type: 'number', defaultValue: 6, min: 0, max: 170, step: 1 }
    ],
    calculate: (inputs) => {
      const n = Math.min(Math.max(parseInt(inputs.n) || 0, 0), 170);

      if (n === 0 || n === 1) {
        return {
          primaryValue: '1',
          primaryLabel: `${n}! Result`,
          subtext: '0! and 1! are defined as 1',
          breakdown: [{ label: 'Factorial', value: '1' }]
        };
      }

      let fact = 1;
      const terms: number[] = [];
      for (let i = n; i >= 1; i--) {
        fact *= i;
        if (terms.length < 8) terms.push(i);
      }

      return {
        primaryValue: fact > 1e12 ? fact.toExponential(6) : fact.toLocaleString(),
        primaryLabel: `${n}! Value`,
        subtext: `Full expression: ${terms.join(' × ')}${n > 8 ? ' × ...' : ''}`,
        breakdown: [
          { label: 'n', value: n.toString() },
          { label: 'Standard Notation', value: fact.toLocaleString() },
          { label: 'Scientific Notation', value: fact.toExponential(6) }
        ],
        steps: [`Multiply all positive integers from 1 up to ${n}`, `${n}! = ${fact}`]
      };
    },
    formula: 'n! = n × (n - 1) × (n - 2) × ... × 1',
    explanation: 'The factorial of a non-negative integer n is the product of all positive integers less than or equal to n.',
    howToUse: ['Enter an integer n (0 to 170).', 'Click Calculate.'],
    example: { inputs: { n: 5 }, output: '120', explanation: '5! = 5 × 4 × 3 × 2 × 1 = 120.' },
    faqs: [{ question: 'Why is 0! = 1?', answer: '0! = 1 by mathematical definition, representing the empty product (1 way to arrange 0 items).' }],
    keywords: ['factorial calculator', 'n!', 'permutations', 'combinatorics']
  },
  {
    id: 'gcd-calculator',
    slug: 'gcd-calculator',
    title: 'GCD Calculator (Greatest Common Divisor)',
    category: 'math',
    shortDesc: 'Find the Greatest Common Divisor (GCD / HCF) of two or more numbers with Euclidean steps.',
    icon: 'Split',
    fields: [
      { id: 'numbers', label: 'Numbers (comma separated)', type: 'text', defaultValue: '48, 180, 240', placeholder: 'e.g. 48, 180' }
    ],
    calculate: (inputs) => {
      const raw = String(inputs.numbers || '');
      const nums = raw
        .split(/[,\s]+/)
        .map((s) => Math.abs(parseInt(s.trim())))
        .filter((n) => !isNaN(n) && n > 0);

      if (nums.length < 2) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter at least two positive integers.' };
      }

      const gcd2 = (a: number, b: number): number => (b === 0 ? a : gcd2(b, a % b));
      let currentGcd = nums[0];
      for (let i = 1; i < nums.length; i++) {
        currentGcd = gcd2(currentGcd, nums[i]);
      }

      return {
        primaryValue: currentGcd.toString(),
        primaryLabel: 'Greatest Common Divisor (GCD)',
        subtext: `Also known as Highest Common Factor (HCF)`,
        breakdown: [
          { label: 'Input Numbers', value: nums.join(', ') },
          { label: 'GCD / HCF', value: currentGcd.toString() }
        ],
        steps: [`Applied Euclidean algorithm iteratively across [${nums.join(', ')}]`, `Final GCD = ${currentGcd}`]
      };
    },
    formula: 'GCD(a, b) = GCD(b, a mod b) until remainder is 0',
    explanation: 'The greatest common divisor of two or more integers is the largest positive integer that divides each without remainder.',
    howToUse: ['Enter integers separated by commas.', 'Click Calculate.'],
    example: { inputs: { numbers: '48, 180' }, output: '12', explanation: '12 is the largest integer dividing both 48 and 180.' },
    faqs: [{ question: 'What is the difference between GCD and HCF?', answer: 'They are two names for the same thing: Greatest Common Divisor and Highest Common Factor.' }],
    keywords: ['gcd calculator', 'hcf', 'greatest common divisor', 'highest common factor', 'euclidean algorithm']
  },
  {
    id: 'lcm-calculator',
    slug: 'lcm-calculator',
    title: 'LCM Calculator (Least Common Multiple)',
    category: 'math',
    shortDesc: 'Find the Least Common Multiple (LCM) of two or more numbers.',
    icon: 'Merge',
    fields: [
      { id: 'numbers', label: 'Numbers (comma separated)', type: 'text', defaultValue: '12, 15, 20', placeholder: 'e.g. 12, 15, 20' }
    ],
    calculate: (inputs) => {
      const raw = String(inputs.numbers || '');
      const nums = raw
        .split(/[,\s]+/)
        .map((s) => Math.abs(parseInt(s.trim())))
        .filter((n) => !isNaN(n) && n > 0);

      if (nums.length < 2) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter at least two positive integers.' };
      }

      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const lcm2 = (a: number, b: number): number => (a * b) / gcd(a, b);

      let currentLcm = nums[0];
      for (let i = 1; i < nums.length; i++) {
        currentLcm = lcm2(currentLcm, nums[i]);
      }

      return {
        primaryValue: currentLcm.toString(),
        primaryLabel: 'Least Common Multiple (LCM)',
        subtext: `Smallest positive multiple shared by all inputs`,
        breakdown: [
          { label: 'Input Numbers', value: nums.join(', ') },
          { label: 'LCM', value: currentLcm.toString() }
        ],
        steps: [`Calculated pair-wise LCM using: LCM(a, b) = (|a × b|) / GCD(a, b)`, `Final LCM = ${currentLcm}`]
      };
    },
    formula: 'LCM(a, b) = (|a × b|) / GCD(a, b)',
    explanation: 'The least common multiple of two or more numbers is the smallest positive integer divisible by all of them.',
    howToUse: ['Enter integers separated by commas.', 'Click Calculate.'],
    example: { inputs: { numbers: '12, 15, 20' }, output: '60', explanation: '60 is divisible by 12, 15, and 20.' },
    faqs: [{ question: 'What is LCM used for?', answer: 'LCM is commonly used to find common denominators when adding fractions.' }],
    keywords: ['lcm calculator', 'least common multiple', 'common denominator', 'lcd']
  },
  {
    id: 'prime-number-calculator',
    slug: 'prime-number-calculator',
    title: 'Prime Number Calculator',
    category: 'math',
    shortDesc: 'Check if a number is prime and compute its prime factorization.',
    icon: 'ShieldCheck',
    fields: [
      { id: 'number', label: 'Integer (n)', type: 'number', defaultValue: 97, min: 1, step: 1 }
    ],
    calculate: (inputs) => {
      const n = Math.abs(parseInt(inputs.number) || 1);
      if (n < 2) {
        return {
          primaryValue: 'Not Prime',
          primaryLabel: 'Primality Result',
          subtext: `${n} is neither prime nor composite`,
          breakdown: [{ label: 'Status', value: 'Neither prime nor composite' }]
        };
      }

      let isPrime = true;
      const factors: number[] = [];
      let temp = n;

      // Trial division
      for (let d = 2; d * d <= temp; d++) {
        while (temp % d === 0) {
          factors.push(d);
          temp /= d;
        }
      }
      if (temp > 1) factors.push(temp);

      if (factors.length > 1) {
        isPrime = false;
      }

      // Group factors
      const factorCounts: Record<number, number> = {};
      factors.forEach((f) => {
        factorCounts[f] = (factorCounts[f] || 0) + 1;
      });
      const factorExp = Object.entries(factorCounts)
        .map(([k, v]) => (v > 1 ? `${k}^${v}` : `${k}`))
        .join(' × ');

      return {
        primaryValue: isPrime ? `${n} is PRIME` : `${n} is COMPOSITE`,
        primaryLabel: 'Primality Status',
        subtext: isPrime ? 'Only divisible by 1 and itself' : `Prime factorization: ${factorExp}`,
        breakdown: [
          { label: 'Number', value: n.toString() },
          { label: 'Is Prime?', value: isPrime ? 'Yes' : 'No' },
          { label: 'Prime Factorization', value: factorExp }
        ],
        steps: [`Tested divisibility up to √(${n}) ≈ ${Math.floor(Math.sqrt(n))}`, `Decomposed into prime factors: ${factors.join(', ')}`]
      };
    },
    formula: 'Prime if only divisors are 1 and n',
    explanation: 'A prime number is a whole number greater than 1 whose only factors are 1 and itself.',
    howToUse: ['Enter an integer.', 'Click Calculate to test for primality.'],
    example: { inputs: { number: 97 }, output: '97 is PRIME', explanation: '97 has no divisors other than 1 and 97.' },
    faqs: [{ question: 'What is the only even prime?', answer: '2 is the smallest and only even prime number.' }],
    keywords: ['prime calculator', 'prime checker', 'prime factors', 'composite number']
  },
  {
    id: 'percentage-change-calculator',
    slug: 'percentage-change-calculator',
    title: 'Percentage Change Calculator',
    category: 'math',
    shortDesc: 'Calculate absolute and relative percentage increase or decrease between two values.',
    icon: 'Percent',
    fields: [
      { id: 'oldVal', label: 'Initial / Old Value', type: 'number', defaultValue: 120, step: 0.1 },
      { id: 'newVal', label: 'Final / New Value', type: 'number', defaultValue: 150, step: 0.1 }
    ],
    calculate: (inputs) => {
      const oldV = parseFloat(inputs.oldVal) || 0;
      const newV = parseFloat(inputs.newVal) || 0;

      if (oldV === 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Initial value cannot be zero.' };

      const diff = newV - oldV;
      const pct = (diff / Math.abs(oldV)) * 100;
      const isIncrease = diff >= 0;

      return {
        primaryValue: `${isIncrease ? '+' : ''}${pct.toFixed(2)}%`,
        primaryLabel: isIncrease ? 'Percentage Increase' : 'Percentage Decrease',
        subtext: `Absolute change: ${diff > 0 ? '+' : ''}${diff.toFixed(2)}`,
        breakdown: [
          { label: 'Old Value', value: oldV.toString() },
          { label: 'New Value', value: newV.toString() },
          { label: 'Difference', value: diff.toFixed(2) },
          { label: 'Multiplier', value: (newV / oldV).toFixed(4) }
        ],
        steps: [`Calculate difference: ${newV} - ${oldV} = ${diff.toFixed(2)}`, `Divide by |old|: ${diff.toFixed(2)} / ${Math.abs(oldV)} = ${(diff / Math.abs(oldV)).toFixed(4)}`, `Multiply by 100 = ${pct.toFixed(2)}%`]
      };
    },
    formula: '% Change = ((New - Old) / |Old|) × 100%',
    explanation: 'Measures the degree of change over time relative to the starting amount.',
    howToUse: ['Enter the initial old value.', 'Enter the new final value.', 'Click Calculate.'],
    example: { inputs: { oldVal: 120, newVal: 150 }, output: '+25.00%', explanation: '(150 - 120) / 120 = 30 / 120 = 25% increase.' },
    faqs: [{ question: 'How is percentage decrease calculated?', answer: 'If new < old, the percentage change is negative.' }],
    keywords: ['percentage change', 'percentage increase', 'percentage decrease', 'growth rate']
  },
  {
    id: 'absolute-value-calculator',
    slug: 'absolute-value-calculator',
    title: 'Absolute Value Calculator',
    category: 'math',
    shortDesc: 'Compute the absolute value |x| representing distance from zero.',
    icon: 'Maximize2',
    fields: [
      { id: 'number', label: 'Number (x)', type: 'number', defaultValue: -42.75, step: 0.01 }
    ],
    calculate: (inputs) => {
      const n = parseFloat(inputs.number) || 0;
      const absVal = Math.abs(n);
      return {
        primaryValue: absVal.toString(),
        primaryLabel: `|${n}| Absolute Value`,
        subtext: `Distance from 0 on number line`,
        breakdown: [
          { label: 'Input Value', value: n.toString() },
          { label: 'Absolute Value', value: absVal.toString() },
          { label: 'Sign', value: n > 0 ? 'Positive' : n < 0 ? 'Negative' : 'Zero' }
        ],
        steps: [`If x < 0, then |x| = -x; otherwise |x| = x`, `|${n}| = ${absVal}`]
      };
    },
    formula: '|x| = x if x ≥ 0, or -x if x < 0',
    explanation: 'Absolute value strips the negative sign and describes how far a number is from zero regardless of direction.',
    howToUse: ['Enter any real number.', 'Click Calculate.'],
    example: { inputs: { number: -42.75 }, output: '42.75', explanation: 'Distance of -42.75 from 0 is 42.75.' },
    faqs: [{ question: 'Can absolute value ever be negative?', answer: 'No, absolute value is always non-negative (≥ 0).' }],
    keywords: ['absolute value calculator', '|x|', 'modulus', 'distance from zero']
  },
  {
    id: 'modulo-calculator',
    slug: 'modulo-calculator',
    title: 'Modulo Calculator',
    category: 'math',
    shortDesc: 'Calculate remainder and quotient of integer division a mod n.',
    icon: 'Percent',
    fields: [
      { id: 'a', label: 'Dividend (a)', type: 'number', defaultValue: 29, step: 1 },
      { id: 'n', label: 'Divisor / Modulus (n)', type: 'number', defaultValue: 6, step: 1 }
    ],
    calculate: (inputs) => {
      const a = parseInt(inputs.a) || 0;
      const n = parseInt(inputs.n) || 1;
      if (n === 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Modulo divisor cannot be zero.' };

      const remainder = ((a % n) + n) % n;
      const quotient = Math.floor(a / n);

      return {
        primaryValue: remainder.toString(),
        primaryLabel: `${a} mod ${n}`,
        subtext: `Quotient: ${quotient} | Remainder: ${remainder}`,
        breakdown: [
          { label: 'Dividend (a)', value: a.toString() },
          { label: 'Modulus (n)', value: n.toString() },
          { label: 'Integer Quotient (q)', value: quotient.toString() },
          { label: 'Remainder (r)', value: remainder.toString() },
          { label: 'Relation', value: `${a} = (${n} × ${quotient}) + ${remainder}` }
        ],
        steps: [`Division: ${a} / ${n} = ${quotient} with remainder ${remainder}`, `${a} mod ${n} = ${remainder}`]
      };
    },
    formula: 'a = q × n + r, where 0 ≤ r < |n|',
    explanation: 'The modulo operation finds the remainder after division of one number by another.',
    howToUse: ['Enter dividend and divisor.', 'Click Calculate.'],
    example: { inputs: { a: 29, n: 6 }, output: '5', explanation: '29 = 6 × 4 + 5, so remainder is 5.' },
    faqs: [{ question: 'What is modulo used for in programming?', answer: 'Modulo is commonly used for wrapping around indexes (like circular arrays and clocks) and parity checks.' }],
    keywords: ['modulo calculator', 'mod', 'remainder calculator', 'integer division']
  },
  {
    id: 'permutation-calculator',
    slug: 'permutation-calculator',
    title: 'Permutation Calculator',
    category: 'math',
    shortDesc: 'Calculate P(n, r) permutations where order of selection matters.',
    icon: 'Layers',
    fields: [
      { id: 'n', label: 'Total items (n)', type: 'number', defaultValue: 8, min: 0, max: 20, step: 1 },
      { id: 'r', label: 'Items to select (r)', type: 'number', defaultValue: 3, min: 0, max: 20, step: 1 }
    ],
    calculate: (inputs) => {
      const n = Math.abs(parseInt(inputs.n) || 0);
      const r = Math.abs(parseInt(inputs.r) || 0);

      if (r > n) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'r cannot be greater than n.' };

      let p = 1;
      for (let i = 0; i < r; i++) {
        p *= (n - i);
      }

      return {
        primaryValue: p.toLocaleString(),
        primaryLabel: `P(${n}, ${r}) Permutations`,
        subtext: `Order matters!`,
        breakdown: [
          { label: 'Total Items (n)', value: n.toString() },
          { label: 'Selected (r)', value: r.toString() },
          { label: 'Permutations P(n, r)', value: p.toLocaleString() }
        ],
        steps: [`Formula: n! / (n - r)!`, `Calculate: ${n} × ${n - 1} × ... (${r} factors)`, `Total arrangements = ${p}`]
      };
    },
    formula: 'P(n, r) = n! / (n - r)!',
    explanation: 'A permutation is an arrangement of r items chosen from a set of n items where the order of selection is significant.',
    howToUse: ['Enter total items n.', 'Enter items to choose r.', 'Click Calculate.'],
    example: { inputs: { n: 8, r: 3 }, output: '336', explanation: '8 × 7 × 6 = 336.' },
    faqs: [{ question: 'Difference between permutation and combination?', answer: 'In permutations order matters (e.g. race finishes), while in combinations order does not matter (e.g. lottery balls).' }],
    keywords: ['permutation calculator', 'P(n,r)', 'arrangements', 'combinatorics']
  },
  {
    id: 'combination-calculator',
    slug: 'combination-calculator',
    title: 'Combination Calculator',
    category: 'math',
    shortDesc: 'Calculate C(n, r) or nCr combinations where order does NOT matter.',
    icon: 'PieChart',
    fields: [
      { id: 'n', label: 'Total items (n)', type: 'number', defaultValue: 10, min: 0, max: 30, step: 1 },
      { id: 'r', label: 'Items to select (r)', type: 'number', defaultValue: 4, min: 0, max: 30, step: 1 }
    ],
    calculate: (inputs) => {
      const n = Math.abs(parseInt(inputs.n) || 0);
      const r = Math.abs(parseInt(inputs.r) || 0);

      if (r > n) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'r cannot be greater than n.' };

      const k = Math.min(r, n - r);
      let c = 1;
      for (let i = 1; i <= k; i++) {
        c = (c * (n - i + 1)) / i;
      }

      return {
        primaryValue: Math.round(c).toLocaleString(),
        primaryLabel: `C(${n}, ${r}) Combinations`,
        subtext: `Order does NOT matter`,
        breakdown: [
          { label: 'Total Items (n)', value: n.toString() },
          { label: 'Selected (r)', value: r.toString() },
          { label: 'Combinations C(n, r)', value: Math.round(c).toLocaleString() }
        ],
        steps: [`Formula: n! / (r! × (n - r)!)`, `Computed C(${n}, ${r}) = ${Math.round(c)}`]
      };
    },
    formula: 'C(n, r) = n! / (r! × (n - r)!)',
    explanation: 'A combination counts the number of ways to pick r unordered elements out of a group of n elements.',
    howToUse: ['Enter total items n.', 'Enter selection size r.', 'Click Calculate.'],
    example: { inputs: { n: 10, r: 4 }, output: '210', explanation: 'There are 210 distinct groups of 4 people chosen from 10.' },
    faqs: [{ question: 'What is nCr used for?', answer: 'It is foundational in binomial theorem expansions and probability calculations.' }],
    keywords: ['combination calculator', 'nCr', 'combinations', 'choose']
  },
  {
    id: 'probability-calculator',
    slug: 'probability-calculator',
    title: 'Probability Calculator',
    category: 'math',
    shortDesc: 'Compute probability of single events, independent events, and odds.',
    icon: 'Dice',
    fields: [
      { id: 'favorable', label: 'Favorable Outcomes (A)', type: 'number', defaultValue: 4, min: 0, step: 1 },
      { id: 'total', label: 'Total Possible Outcomes (S)', type: 'number', defaultValue: 52, min: 1, step: 1 }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.favorable) || 0;
      const s = parseFloat(inputs.total) || 1;

      if (s <= 0 || a < 0 || a > s) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Favorable outcomes must be between 0 and total outcomes.' };
      }

      const p = a / s;
      const pct = p * 100;
      const oddsFor = `${a} : ${s - a}`;

      return {
        primaryValue: `${pct.toFixed(2)}%`,
        primaryLabel: 'Probability P(A)',
        subtext: `Decimal: ${p.toFixed(4)} | Odds: ${oddsFor}`,
        breakdown: [
          { label: 'Favorable Outcomes', value: a.toString() },
          { label: 'Total Sample Space', value: s.toString() },
          { label: 'Probability Fraction', value: `${a}/${s}` },
          { label: 'Odds in Favor', value: oddsFor }
        ],
        steps: [`P(A) = Favorable / Total = ${a} / ${s} = ${p.toFixed(4)}`, `Expressed as percentage: ${pct.toFixed(2)}%`]
      };
    },
    formula: 'P(A) = n(A) / n(S)',
    explanation: 'Calculates the likelihood of an event occurring based on the ratio of favorable cases to total outcomes.',
    howToUse: ['Enter the number of successful outcomes.', 'Enter total outcomes.', 'Click Calculate.'],
    example: { inputs: { favorable: 4, total: 52 }, output: '7.69%', explanation: 'Probability of drawing an ace from a 52-card deck is 4/52 ≈ 7.69%.' },
    faqs: [{ question: 'Can probability exceed 100%?', answer: 'No, probability always ranges between 0% (impossible) and 100% (certain).' }],
    keywords: ['probability calculator', 'odds', 'chance', 'sample space']
  },
  {
    id: 'sequence-calculator',
    slug: 'sequence-calculator',
    title: 'Sequence Calculator',
    category: 'math',
    shortDesc: 'Calculate general mathematical sequences, recurrence relations, and series sums.',
    icon: 'Sliders',
    fields: [
      { id: 'first', label: 'First Term (a₁)', type: 'number', defaultValue: 2, step: 1 },
      { id: 'diff', label: 'Difference / Multiplier', type: 'number', defaultValue: 3, step: 1 },
      { id: 'count', label: 'Number of terms', type: 'number', defaultValue: 8, min: 1, max: 25, step: 1 }
    ],
    calculate: (inputs) => {
      const a1 = parseFloat(inputs.first) || 0;
      const d = parseFloat(inputs.diff) || 1;
      const count = Math.min(Math.max(parseInt(inputs.count) || 5, 1), 25);

      const terms: number[] = [];
      let sum = 0;
      for (let i = 0; i < count; i++) {
        const val = a1 + i * d;
        terms.push(val);
        sum += val;
      }

      return {
        primaryValue: terms.join(', '),
        primaryLabel: 'Generated Sequence',
        subtext: `Sum of series: ${sum}`,
        breakdown: [
          { label: 'Terms Count', value: count.toString() },
          { label: 'Last Term', value: terms[terms.length - 1].toString() },
          { label: 'Total Sum', value: sum.toString() }
        ],
        steps: [`Generated ${count} terms using a_n = a₁ + (n-1)d`, `Summed all terms = ${sum}`]
      };
    },
    formula: 'a_n = a₁ + (n - 1)d',
    explanation: 'Generates consecutive terms in mathematical series and provides partial sums.',
    howToUse: ['Enter the starting term and difference.', 'Select how many terms to generate.', 'Click Calculate.'],
    example: { inputs: { first: 2, diff: 3, count: 5 }, output: '2, 5, 8, 11, 14', explanation: 'Adding 3 each step gives 2, 5, 8, 11, 14 with sum 40.' },
    faqs: [{ question: 'What is a series?', answer: 'A series is the sum of the terms of a sequence.' }],
    keywords: ['sequence calculator', 'series', 'progression', 'series sum']
  },
  {
    id: 'matrix-calculator',
    slug: 'matrix-calculator',
    title: 'Matrix Calculator',
    category: 'math',
    shortDesc: 'Compute 2x2 determinant, inverse, trace, and eigenvalues.',
    icon: 'Grid',
    fields: [
      { id: 'a11', label: 'Element a11', type: 'number', defaultValue: 4, step: 0.1 },
      { id: 'a12', label: 'Element a12', type: 'number', defaultValue: 7, step: 0.1 },
      { id: 'a21', label: 'Element a21', type: 'number', defaultValue: 2, step: 0.1 },
      { id: 'a22', label: 'Element a22', type: 'number', defaultValue: 6, step: 0.1 }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a11) || 0;
      const b = parseFloat(inputs.a12) || 0;
      const c = parseFloat(inputs.a21) || 0;
      const d = parseFloat(inputs.a22) || 0;

      const det = a * d - b * c;
      const trace = a + d;

      let invStr = '';
      if (det !== 0) {
        const invA = (d / det).toFixed(3);
        const invB = (-b / det).toFixed(3);
        const invC = (-c / det).toFixed(3);
        const invD = (a / det).toFixed(3);
        invStr = `[[${invA}, ${invB}], [${invC}, ${invD}]]`;
      } else {
        invStr = 'Singular Matrix (No inverse exists)';
      }

      return {
        primaryValue: `det(A) = ${det.toFixed(2)}`,
        primaryLabel: '2x2 Matrix Determinant',
        subtext: `Trace: ${trace} | ${det !== 0 ? 'Invertible' : 'Singular'}`,
        breakdown: [
          { label: 'Matrix', value: `[[${a}, ${b}], [${c}, ${d}]]` },
          { label: 'Determinant', value: det.toFixed(4) },
          { label: 'Matrix Trace', value: trace.toString() },
          { label: 'Inverse Matrix A⁻¹', value: invStr }
        ],
        steps: [`Compute determinant: ad - bc = (${a})(${d}) - (${b})(${c}) = ${det.toFixed(4)}`, `Compute trace: a + d = ${trace}`]
      };
    },
    formula: 'det(A) = ad - bc  |  A⁻¹ = (1/det) × [[d, -b], [-c, a]]',
    explanation: 'Computes matrix invariants for 2×2 linear systems including determinant, trace, and matrix inversion.',
    howToUse: ['Enter the four elements of the 2x2 matrix.', 'Click Calculate.'],
    example: { inputs: { a11: 4, a12: 7, a21: 2, a22: 6 }, output: 'det(A) = 10.00', explanation: '4(6) - 7(2) = 24 - 14 = 10.' },
    faqs: [{ question: 'What does a zero determinant mean?', answer: 'A determinant of zero means the matrix is singular and has no inverse.' }],
    keywords: ['matrix calculator', 'determinant', 'inverse matrix', 'matrix 2x2', 'linear algebra']
  },
  {
    id: 'scientific-notation-calculator',
    slug: 'scientific-notation-calculator',
    title: 'Scientific Notation Calculator',
    category: 'math',
    shortDesc: 'Convert numbers to scientific notation (a × 10^b) and perform operations.',
    icon: 'Cpu',
    fields: [
      { id: 'number', label: 'Decimal or Standard Number', type: 'text', defaultValue: '149600000', placeholder: 'e.g. 149600000 or 0.000045' }
    ],
    calculate: (inputs) => {
      const raw = String(inputs.number || '').trim();
      const n = parseFloat(raw);
      if (isNaN(n)) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter a valid number.' };

      const sci = n.toExponential(4);
      const parts = sci.split('e');
      const mantissa = parts[0];
      const exponent = parts[1];

      return {
        primaryValue: `${mantissa} × 10^${exponent}`,
        primaryLabel: 'Scientific Notation',
        subtext: `Standard: ${n.toLocaleString()}`,
        breakdown: [
          { label: 'Standard Notation', value: n.toString() },
          { label: 'Scientific Form', value: `${mantissa} × 10^${exponent}` },
          { label: 'Engineering Form', value: n.toExponential(6) }
        ],
        steps: [`Count places decimal point moved: ${exponent}`, `Scientific notation: ${mantissa} × 10^${exponent}`]
      };
    },
    formula: 'N = a × 10^b where 1 ≤ |a| < 10 and b is an integer',
    explanation: 'Scientific notation allows compact expression of very large or very small real numbers.',
    howToUse: ['Enter any standard number or decimal.', 'Click Calculate.'],
    example: { inputs: { number: '149600000' }, output: '1.4960 × 10^+8', explanation: 'Distance from Earth to Sun is approx 1.496 × 10^8 km.' },
    faqs: [{ question: 'What is scientific notation used for?', answer: 'Scientists and engineers use it to work easily with atomic scale quantities or astronomical distances.' }],
    keywords: ['scientific notation', 'standard form', 'powers of 10', 'engineering notation']
  }
];

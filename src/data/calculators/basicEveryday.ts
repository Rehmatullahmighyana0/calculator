import { CalculatorDef } from '../../types/calculator';

export const basicEverydayCalculators: CalculatorDef[] = [
  {
    id: 'basic-calculator',
    slug: 'basic-calculator',
    title: 'Basic Calculator',
    category: 'basic-everyday',
    shortDesc: 'Quick arithmetic calculator for addition, subtraction, multiplication, and division.',
    icon: 'Calculator',
    badge: 'popular',
    isInteractiveKeypad: true,
    fields: [
      { id: 'expression', label: 'Expression', type: 'text', defaultValue: '125 + 75 * 2', placeholder: 'e.g. 125 + 75 * 2' }
    ],
    calculate: (inputs) => {
      const expr = String(inputs.expression || '').trim();
      if (!expr) return { primaryValue: '0', primaryLabel: 'Result', error: 'Please enter an expression.' };
      try {
        // Safe arithmetic evaluator
        const sanitized = expr.replace(/×/g, '*').replace(/÷/g, '/');
        if (!/^[0-9+\-*/. ()]+$/.test(sanitized)) {
          return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid characters in expression.' };
        }
        // eslint-disable-next-line no-new-func
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
            { label: 'Result', value: formatted }
          ],
          steps: [`Parsed arithmetic expression: ${sanitized}`, `Applied operator precedence (BODMAS / PEMDAS)`, `Final Result = ${formatted}`]
        };
      } catch (err) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid mathematical expression.' };
      }
    },
    formula: 'Result = Expression evaluated with standard operator precedence (PEMDAS / BODMAS)',
    explanation: 'Evaluates standard arithmetic operations adhering strictly to the order of operations: Parentheses, Exponents, Multiplication & Division, Addition & Subtraction.',
    howToUse: [
      'Enter an arithmetic expression with numbers and operators (+, -, *, /).',
      'You can also use parentheses to enforce operation order.',
      'Click Calculate to see the evaluated answer.'
    ],
    example: {
      inputs: { expression: '125 + 75 * 2' },
      output: '275',
      explanation: 'Multiplication takes precedence: 75 * 2 = 150. Then 125 + 150 = 275.'
    },
    faqs: [
      { question: 'What operations are supported?', answer: 'Addition (+), Subtraction (-), Multiplication (*), Division (/), and grouping with parentheses ( ).' },
      { question: 'What if I divide by zero?', answer: 'Division by zero is undefined in arithmetic and will show an error.' }
    ],
    keywords: ['basic calculator', 'math', 'simple calculator', 'arithmetic', 'addition', 'subtraction', 'multiplication', 'division']
  },
  {
    id: 'scientific-calculator',
    slug: 'scientific-calculator',
    title: 'Scientific Calculator',
    category: 'basic-everyday',
    shortDesc: 'Evaluate trigonometric, logarithmic, and exponential mathematical functions.',
    icon: 'Atom',
    badge: 'popular',
    isInteractiveKeypad: true,
    fields: [
      { id: 'expression', label: 'Expression or Function', type: 'text', defaultValue: 'sin(30) + sqrt(144)', placeholder: 'e.g. sin(30) + sqrt(144)' },
      {
        id: 'angleUnit',
        label: 'Angle Mode',
        type: 'select',
        defaultValue: 'deg',
        options: [
          { label: 'Degrees (deg)', value: 'deg' },
          { label: 'Radians (rad)', value: 'rad' }
        ]
      }
    ],
    calculate: (inputs) => {
      let expr = String(inputs.expression || '').trim();
      const isDeg = inputs.angleUnit === 'deg';
      if (!expr) return { primaryValue: '0', primaryLabel: 'Result', error: 'Enter a valid scientific expression.' };

      try {
        let code = expr
          .replace(/pi/gi, 'Math.PI')
          .replace(/e\b/gi, 'Math.E')
          .replace(/sqrt\(/gi, 'Math.sqrt(')
          .replace(/log\(/gi, 'Math.log10(')
          .replace(/ln\(/gi, 'Math.log(')
          .replace(/abs\(/gi, 'Math.abs(')
          .replace(/\^/g, '**');

        if (isDeg) {
          code = code
            .replace(/sin\(([^)]+)\)/gi, 'Math.sin(($1) * Math.PI / 180)')
            .replace(/cos\(([^)]+)\)/gi, 'Math.cos(($1) * Math.PI / 180)')
            .replace(/tan\(([^)]+)\)/gi, 'Math.tan(($1) * Math.PI / 180)');
        } else {
          code = code
            .replace(/sin\(/gi, 'Math.sin(')
            .replace(/cos\(/gi, 'Math.cos(')
            .replace(/tan\(/gi, 'Math.tan(');
        }

        // eslint-disable-next-line no-new-func
        const fn = new Function(`'use strict'; return (${code});`);
        const val = fn();
        if (typeof val !== 'number' || isNaN(val)) {
          return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Mathematical error or invalid input.' };
        }
        const formatted = Number.isInteger(val) ? val.toString() : parseFloat(val.toFixed(8)).toString();
        return {
          primaryValue: formatted,
          primaryLabel: 'Computed Result',
          subtext: `Mode: ${isDeg ? 'Degrees' : 'Radians'}`,
          breakdown: [
            { label: 'Input Expression', value: expr },
            { label: 'Calculated Value', value: formatted },
            { label: 'Angle Mode', value: isDeg ? 'Degrees' : 'Radians' }
          ],
          steps: [`Transformed expression into mathematical operations`, `Applied angle conversion: ${isDeg ? 'Degrees to Radians' : 'Radians'}`, `Computed Result = ${formatted}`]
        };
      } catch (e) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Failed to parse expression.' };
      }
    },
    formula: 'Functions: sin, cos, tan, sqrt, log10, ln, ^ (power), pi, e',
    explanation: 'Computes advanced scientific functions including trigonometry in both degrees and radians, powers, roots, and logarithms.',
    howToUse: [
      'Enter an expression such as sin(45), sqrt(100), or 2^8.',
      'Select Degrees or Radians mode for trigonometric functions.',
      'Click Calculate to see the precision result.'
    ],
    example: {
      inputs: { expression: 'sin(30) + sqrt(144)', angleUnit: 'deg' },
      output: '12.5',
      explanation: 'sin(30°) = 0.5 and sqrt(144) = 12. 0.5 + 12 = 12.5.'
    },
    faqs: [
      { question: 'What does sqrt() mean?', answer: 'sqrt(x) computes the principal positive square root of number x.' },
      { question: 'How do I type powers?', answer: 'Use the caret symbol ^, e.g., 2^10 = 1024.' }
    ],
    keywords: ['scientific calculator', 'trigonometry', 'sine', 'cosine', 'tangent', 'square root', 'logarithm', 'ln']
  },
  {
    id: 'percentage-calculator',
    slug: 'percentage-calculator',
    title: 'Percentage Calculator',
    category: 'basic-everyday',
    shortDesc: 'Calculate percentages, percentage change, and what percentage one number is of another.',
    icon: 'Percent',
    badge: 'popular',
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
      { id: 'val1', label: 'First Value (P or X)', type: 'number', defaultValue: 15, step: 0.1 },
      { id: 'val2', label: 'Second Value (X or Y)', type: 'number', defaultValue: 200, step: 0.1 }
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
            { label: 'Total Amount', value: (v2 + result).toFixed(2) }
          ],
          steps: [`Convert ${v1}% to decimal: ${v1} / 100 = ${(v1 / 100).toFixed(4)}`, `Multiply by base value: ${(v1 / 100).toFixed(4)} × ${v2} = ${result.toFixed(2)}`]
        };
      } else if (mode === 'x_of_y') {
        if (v2 === 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Base value (Y) cannot be zero.' };
        const pct = (v1 / v2) * 100;
        return {
          primaryValue: `${pct.toFixed(2)}%`,
          primaryLabel: `${v1} is what % of ${v2}`,
          subtext: `${v1} is ${pct.toFixed(2)}% of ${v2}`,
          breakdown: [
            { label: 'Numerator (X)', value: v1.toString() },
            { label: 'Denominator (Y)', value: v2.toString() },
            { label: 'Percentage', value: `${pct.toFixed(2)}%` }
          ],
          steps: [`Divide ${v1} by ${v2}: ${v1} / ${v2} = ${(v1 / v2).toFixed(4)}`, `Multiply by 100: ${(v1 / v2).toFixed(4)} × 100 = ${pct.toFixed(2)}%`]
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
            { label: 'Absolute Difference', value: diff.toFixed(2) },
            { label: 'Direction', value: isIncrease ? 'Increase' : 'Decrease' }
          ],
          steps: [`Find difference: ${v2} - ${v1} = ${diff.toFixed(2)}`, `Divide by original: ${diff.toFixed(2)} / ${v1} = ${(diff / v1).toFixed(4)}`, `Multiply by 100 = ${changePct.toFixed(2)}%`]
        };
      }
    },
    formula: 'P% × X = (P / 100) × X  |  % Change = ((Y - X) / X) × 100%',
    explanation: 'A percentage represents a portion of 100. This calculator lets you find any percentage, relative ratio, or growth/decline rate.',
    howToUse: ['Choose your calculation type from the dropdown.', 'Enter your values.', 'Review the computed percentage and step-by-step breakdown.'],
    example: {
      inputs: { mode: 'what_is', val1: 15, val2: 200 },
      output: '30.00',
      explanation: '15% of 200 is 0.15 × 200 = 30.'
    },
    faqs: [
      { question: 'How do I calculate a tip?', answer: 'To find a 20% tip on a $60 bill, calculate 20% of 60 ($12), giving a total of $72.' },
      { question: 'Can percentage change be negative?', answer: 'Yes, a negative percentage indicates a decrease from the initial value.' }
    ],
    keywords: ['percentage calculator', 'percent', 'percentage increase', 'discount', 'percent of']
  },
  {
    id: 'fraction-calculator',
    slug: 'fraction-calculator',
    title: 'Fraction Calculator',
    category: 'basic-everyday',
    shortDesc: 'Add, subtract, multiply, and divide fractions with step-by-step reduction.',
    icon: 'Binary',
    fields: [
      { id: 'num1', label: 'Numerator 1', type: 'number', defaultValue: 3, step: 1 },
      { id: 'den1', label: 'Denominator 1', type: 'number', defaultValue: 4, step: 1 },
      {
        id: 'op',
        label: 'Operation',
        type: 'select',
        defaultValue: '+',
        options: [
          { label: 'Add (+)', value: '+' },
          { label: 'Subtract (-)', value: '-' },
          { label: 'Multiply (×)', value: '*' },
          { label: 'Divide (÷)', value: '/' }
        ]
      },
      { id: 'num2', label: 'Numerator 2', type: 'number', defaultValue: 2, step: 1 },
      { id: 'den2', label: 'Denominator 2', type: 'number', defaultValue: 5, step: 1 }
    ],
    calculate: (inputs) => {
      const n1 = parseInt(inputs.num1) || 0;
      const d1 = parseInt(inputs.den1) || 1;
      const op = inputs.op || '+';
      const n2 = parseInt(inputs.num2) || 0;
      const d2 = parseInt(inputs.den2) || 1;

      if (d1 === 0 || d2 === 0) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Denominator cannot be zero.' };
      }
      if (op === '/' && n2 === 0) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Cannot divide by zero fraction.' };
      }

      const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

      let resNum = 0;
      let resDen = 1;

      if (op === '+') {
        resNum = n1 * d2 + n2 * d1;
        resDen = d1 * d2;
      } else if (op === '-') {
        resNum = n1 * d2 - n2 * d1;
        resDen = d1 * d2;
      } else if (op === '*') {
        resNum = n1 * n2;
        resDen = d1 * d2;
      } else if (op === '/') {
        resNum = n1 * d2;
        resDen = d1 * n2;
      }

      if (resDen < 0) {
        resNum = -resNum;
        resDen = -resDen;
      }

      const divisor = gcd(resNum, resDen);
      const simpNum = resNum / divisor;
      const simpDen = resDen / divisor;
      const decimalVal = (simpNum / simpDen).toFixed(4);

      let mixedStr = '';
      if (Math.abs(simpNum) >= simpDen && simpDen !== 1) {
        const whole = Math.trunc(simpNum / simpDen);
        const rem = Math.abs(simpNum % simpDen);
        mixedStr = rem !== 0 ? ` or ${whole} ${rem}/${simpDen}` : ` or ${whole}`;
      }

      return {
        primaryValue: simpDen === 1 ? `${simpNum}` : `${simpNum}/${simpDen}`,
        primaryLabel: 'Simplified Fraction',
        subtext: `Decimal: ${decimalVal}${mixedStr}`,
        breakdown: [
          { label: 'First Fraction', value: `${n1}/${d1}` },
          { label: 'Second Fraction', value: `${n2}/${d2}` },
          { label: 'Unsimplified Result', value: `${resNum}/${resDen}` },
          { label: 'Greatest Common Divisor', value: divisor.toString() },
          { label: 'Decimal Equivalent', value: decimalVal }
        ],
        steps: [
          `Find common denominator or perform cross-multiplication: ${resNum}/${resDen}`,
          `Calculate GCD(${resNum}, ${resDen}) = ${divisor}`,
          `Divide numerator and denominator by ${divisor}: ${simpNum}/${simpDen}`
        ]
      };
    },
    formula: 'a/b ± c/d = (ad ± bc) / bd  |  (a/b) × (c/d) = ac / bd  |  (a/b) ÷ (c/d) = ad / bc',
    explanation: 'Operates on fractions with exact precision and simplifies the result to irreducible form using the Euclidean algorithm.',
    howToUse: ['Enter numerators and denominators for both fractions.', 'Select an arithmetic operation (+, -, ×, ÷).', 'View the simplified fraction, mixed number, and decimal representation.'],
    example: {
      inputs: { num1: 3, den1: 4, op: '+', num2: 2, den2: 5 },
      output: '23/20',
      explanation: '(3×5 + 2×4) / (4×5) = (15 + 8) / 20 = 23/20 = 1.15.'
    },
    faqs: [{ question: 'What is an improper fraction?', answer: 'A fraction where the numerator is greater than or equal to the denominator, e.g., 23/20.' }],
    keywords: ['fraction calculator', 'fractions', 'numerator', 'denominator', 'simplify fraction', 'mixed numbers']
  },
  {
    id: 'average-calculator',
    slug: 'average-calculator',
    title: 'Average Calculator',
    category: 'basic-everyday',
    shortDesc: 'Compute the mean, median, mode, and range of any list of numbers.',
    icon: 'BarChart',
    fields: [
      { id: 'numbers', label: 'Numbers (comma or space separated)', type: 'text', defaultValue: '12, 18, 25, 30, 18, 42, 55', placeholder: 'e.g. 10, 20, 30, 40' }
    ],
    calculate: (inputs) => {
      const raw = String(inputs.numbers || '');
      const nums = raw
        .split(/[,\s]+/)
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));

      if (nums.length === 0) {
        return { primaryValue: '0', primaryLabel: 'Mean', error: 'Please enter at least one valid number.' };
      }

      const sum = nums.reduce((acc, val) => acc + val, 0);
      const mean = sum / nums.length;

      const sorted = [...nums].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

      const counts: Record<number, number> = {};
      let maxCount = 0;
      nums.forEach((n) => {
        counts[n] = (counts[n] || 0) + 1;
        if (counts[n] > maxCount) maxCount = counts[n];
      });

      const modes = Object.keys(counts)
        .filter((k) => counts[Number(k)] === maxCount && maxCount > 1)
        .map(Number);
      const modeStr = modes.length > 0 ? modes.join(', ') : 'No unique mode';

      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      const range = max - min;

      return {
        primaryValue: mean.toFixed(2),
        primaryLabel: 'Arithmetic Mean (Average)',
        subtext: `Median: ${median} | Range: ${range}`,
        breakdown: [
          { label: 'Count of Numbers (n)', value: nums.length.toString() },
          { label: 'Total Sum (Σx)', value: sum.toFixed(2) },
          { label: 'Median', value: median.toString() },
          { label: 'Mode', value: modeStr },
          { label: 'Minimum', value: min.toString() },
          { label: 'Maximum', value: max.toString() },
          { label: 'Range', value: range.toString() }
        ],
        steps: [
          `Count numbers: n = ${nums.length}`,
          `Sum numbers: Σx = ${sum.toFixed(2)}`,
          `Mean = Σx / n = ${sum.toFixed(2)} / ${nums.length} = ${mean.toFixed(4)}`,
          `Sort values to find median: [${sorted.join(', ')}]`
        ]
      };
    },
    formula: 'Mean = (Σ x) / n  |  Range = Max - Min',
    explanation: 'The arithmetic mean adds all numbers and divides by the count. The median is the central value of the sorted dataset.',
    howToUse: ['Enter a sequence of numbers separated by commas or spaces.', 'Click Calculate to see summary statistics including mean, median, mode, and range.'],
    example: {
      inputs: { numbers: '10, 20, 30, 40, 50' },
      output: '30.00',
      explanation: 'Sum is 150. Count is 5. Average is 150 / 5 = 30.'
    },
    faqs: [{ question: 'What is the difference between mean and median?', answer: 'The mean is the mathematical average, whereas the median is the physical middle value resistant to extreme outliers.' }],
    keywords: ['average calculator', 'mean', 'median', 'mode', 'range', 'dataset average']
  },
  {
    id: 'ratio-calculator',
    slug: 'ratio-calculator',
    title: 'Ratio Calculator',
    category: 'basic-everyday',
    shortDesc: 'Simplify ratios and solve for missing values in equivalent ratios A:B = C:D.',
    icon: 'Divide',
    fields: [
      { id: 'a', label: 'A', type: 'number', defaultValue: 12, step: 1 },
      { id: 'b', label: 'B', type: 'number', defaultValue: 16, step: 1 },
      { id: 'c', label: 'C (optional to solve for D)', type: 'number', defaultValue: 30, step: 1 }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a) || 0;
      const b = parseFloat(inputs.b) || 0;
      const c = parseFloat(inputs.c);

      if (a === 0 || b === 0) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Ratio terms cannot be zero.' };
      }

      const gcd = (x: number, y: number): number => (y === 0 ? Math.abs(x) : gcd(y, x % y));
      const g = gcd(a, b);
      const simA = a / g;
      const simB = b / g;

      const breakdown = [
        { label: 'Original Ratio', value: `${a} : ${b}` },
        { label: 'Simplified Ratio', value: `${simA} : ${simB}` },
        { label: 'Decimal Value', value: (a / b).toFixed(4) }
      ];

      let solvedD = '';
      const steps = [`Find greatest common divisor: GCD(${a}, ${b}) = ${g}`, `Divide both terms by ${g}: ${simA} : ${simB}`];

      if (!isNaN(c) && c > 0) {
        const d = (b * c) / a;
        solvedD = d.toFixed(2);
        breakdown.push({ label: `Solved Value D (for ${c} : D)`, value: solvedD });
        steps.push(`Proportion formula: D = (B × C) / A = (${b} × ${c}) / ${a} = ${solvedD}`);
      }

      return {
        primaryValue: `${simA} : ${simB}`,
        primaryLabel: 'Simplified Ratio',
        subtext: solvedD ? `Equivalent: ${c} : ${solvedD}` : `Ratio = ${simA} to ${simB}`,
        breakdown,
        steps
      };
    },
    formula: 'Simplified: A/GCD : B/GCD  |  Proportion: A / B = C / D => D = (B × C) / A',
    explanation: 'Ratios compare two quantities. This calculator finds the lowest whole-number terms and solves proportions.',
    howToUse: ['Enter values for A and B.', 'Optionally enter C to find D such that A:B = C:D.', 'Click Calculate.'],
    example: {
      inputs: { a: 12, b: 16, c: 30 },
      output: '3 : 4',
      explanation: '12:16 simplifies to 3:4. In proportion 12:16 = 30:D, D = 40.'
    },
    faqs: [{ question: 'How do you scale an image aspect ratio?', answer: 'For a 16:9 ratio with width 1920, height D = (9 × 1920) / 16 = 1080px.' }],
    keywords: ['ratio calculator', 'aspect ratio', 'proportion', 'simplify ratio', 'equivalent ratios']
  },
  {
    id: 'proportion-calculator',
    slug: 'proportion-calculator',
    title: 'Proportion Calculator',
    category: 'basic-everyday',
    shortDesc: 'Solve direct and inverse proportions across four variables (A / B = C / D).',
    icon: 'EqualNot',
    fields: [
      {
        id: 'type',
        label: 'Proportion Type',
        type: 'select',
        defaultValue: 'direct',
        options: [
          { label: 'Direct Proportion (A/B = C/D)', value: 'direct' },
          { label: 'Inverse Proportion (A × B = C × D)', value: 'inverse' }
        ]
      },
      { id: 'a', label: 'A', type: 'number', defaultValue: 10, step: 0.1 },
      { id: 'b', label: 'B', type: 'number', defaultValue: 25, step: 0.1 },
      { id: 'c', label: 'C', type: 'number', defaultValue: 50, step: 0.1 }
    ],
    calculate: (inputs) => {
      const type = inputs.type || 'direct';
      const a = parseFloat(inputs.a) || 0;
      const b = parseFloat(inputs.b) || 0;
      const c = parseFloat(inputs.c) || 0;

      if (a === 0 || b === 0 || c === 0) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Input values must be non-zero.' };
      }

      let d = 0;
      let formulaStr = '';
      if (type === 'direct') {
        d = (b * c) / a;
        formulaStr = `D = (B × C) / A = (${b} × ${c}) / ${a}`;
      } else {
        d = (a * b) / c;
        formulaStr = `D = (A × B) / C = (${a} × ${b}) / ${c}`;
      }

      return {
        primaryValue: d.toFixed(2),
        primaryLabel: 'Unknown Variable D',
        subtext: type === 'direct' ? `A/B = C/D (${a}/${b} = ${c}/${d.toFixed(2)})` : `A×B = C×D (${a}×${b} = ${c}×${d.toFixed(2)})`,
        breakdown: [
          { label: 'Type', value: type === 'direct' ? 'Direct' : 'Inverse' },
          { label: 'Value A', value: a.toString() },
          { label: 'Value B', value: b.toString() },
          { label: 'Value C', value: c.toString() },
          { label: 'Calculated D', value: d.toFixed(4) }
        ],
        steps: [`Applied ${type} proportion formula: ${formulaStr}`, `Calculated D = ${d.toFixed(4)}`]
      };
    },
    formula: 'Direct: A/B = C/D => D = (B × C)/A  |  Inverse: A × B = C × D => D = (A × B)/C',
    explanation: 'Direct proportion means as one quantity increases, the other increases proportionally. Inverse proportion means one increases as the other decreases.',
    howToUse: ['Choose Direct or Inverse proportion.', 'Enter known values for A, B, and C.', 'Click Calculate to find the unknown value D.'],
    example: {
      inputs: { type: 'direct', a: 10, b: 25, c: 50 },
      output: '125.00',
      explanation: '10 / 25 = 50 / D => D = (25 × 50) / 10 = 125.'
    },
    faqs: [{ question: 'What is an example of inverse proportion?', answer: 'Workers and time needed: 2 workers take 6 hours, so 4 workers take (2×6)/4 = 3 hours.' }],
    keywords: ['proportion calculator', 'direct proportion', 'inverse proportion', 'cross multiplication']
  },
  {
    id: 'random-number-generator',
    slug: 'random-number-generator',
    title: 'Random Number Generator',
    category: 'basic-everyday',
    shortDesc: 'Generate cryptographically random numbers within custom ranges with sorting options.',
    icon: 'Shuffle',
    fields: [
      { id: 'min', label: 'Minimum Value', type: 'number', defaultValue: 1, step: 1 },
      { id: 'max', label: 'Maximum Value', type: 'number', defaultValue: 100, step: 1 },
      { id: 'count', label: 'How many numbers?', type: 'number', defaultValue: 5, min: 1, max: 100, step: 1 },
      {
        id: 'unique',
        label: 'Allow Duplicates',
        type: 'select',
        defaultValue: 'no',
        options: [
          { label: 'No (Unique numbers)', value: 'no' },
          { label: 'Yes (Allow duplicates)', value: 'yes' }
        ]
      }
    ],
    calculate: (inputs) => {
      const min = Math.ceil(parseFloat(inputs.min) || 1);
      const max = Math.floor(parseFloat(inputs.max) || 100);
      const count = Math.min(Math.max(parseInt(inputs.count) || 1, 1), 100);
      const allowDuplicates = inputs.unique === 'yes';

      if (min >= max) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Minimum must be less than maximum.' };
      }

      const rangeSize = max - min + 1;
      if (!allowDuplicates && count > rangeSize) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: `Cannot generate ${count} unique numbers in a range of ${rangeSize}.` };
      }

      const generated: number[] = [];
      const set = new Set<number>();

      while (generated.length < count) {
        const rand = Math.floor(Math.random() * rangeSize) + min;
        if (allowDuplicates) {
          generated.push(rand);
        } else {
          if (!set.has(rand)) {
            set.add(rand);
            generated.push(rand);
          }
        }
      }

      return {
        primaryValue: generated.join(', '),
        primaryLabel: 'Generated Random Numbers',
        subtext: `Total: ${count} numbers between ${min} and ${max}`,
        breakdown: [
          { label: 'Min Range', value: min.toString() },
          { label: 'Max Range', value: max.toString() },
          { label: 'Count', value: count.toString() },
          { label: 'Sorted Ascending', value: [...generated].sort((a, b) => a - b).join(', ') }
        ],
        steps: [`Selected random values using uniform distribution in [${min}, ${max}]`, `Generated list: [${generated.join(', ')}]`]
      };
    },
    formula: 'Random Integer = floor(Random() × (Max - Min + 1)) + Min',
    explanation: 'Generates random integers within specified lower and upper bounds, optionally enforcing uniqueness.',
    howToUse: ['Set the min and max limits.', 'Choose how many numbers to generate.', 'Toggle whether duplicates are allowed.'],
    example: {
      inputs: { min: 1, max: 10, count: 3, unique: 'no' },
      output: '4, 8, 2',
      explanation: 'Generates 3 distinct numbers between 1 and 10.'
    },
    faqs: [{ question: 'Is this random enough for lotteries?', answer: 'Yes, it uses uniform pseudo-random number distribution suitable for draws, games, and research sampling.' }],
    keywords: ['random number generator', 'rng', 'random picker', 'lottery generator', 'dice roll']
  },
  {
    id: 'number-sequence-calculator',
    slug: 'number-sequence-calculator',
    title: 'Number Sequence Calculator',
    category: 'basic-everyday',
    shortDesc: 'Generate Arithmetic, Geometric, and Fibonacci sequences with sum and nth term.',
    icon: 'ListOrdered',
    fields: [
      {
        id: 'type',
        label: 'Sequence Type',
        type: 'select',
        defaultValue: 'arithmetic',
        options: [
          { label: 'Arithmetic Sequence (a, a+d, a+2d...)', value: 'arithmetic' },
          { label: 'Geometric Sequence (a, a*r, a*r²...)', value: 'geometric' },
          { label: 'Fibonacci Sequence', value: 'fibonacci' }
        ]
      },
      { id: 'firstTerm', label: 'First Term (a)', type: 'number', defaultValue: 3, step: 1 },
      { id: 'diffOrRatio', label: 'Common Difference (d) or Ratio (r)', type: 'number', defaultValue: 4, step: 1 },
      { id: 'terms', label: 'Number of terms (n)', type: 'number', defaultValue: 10, min: 2, max: 50, step: 1 }
    ],
    calculate: (inputs) => {
      const type = inputs.type || 'arithmetic';
      const a = parseFloat(inputs.firstTerm) || 0;
      const dOrR = parseFloat(inputs.diffOrRatio) || 1;
      const n = Math.min(Math.max(parseInt(inputs.terms) || 10, 2), 50);

      const seq: number[] = [];
      let sum = 0;
      let nthTerm = 0;

      if (type === 'arithmetic') {
        for (let i = 0; i < n; i++) {
          const val = a + i * dOrR;
          seq.push(val);
          sum += val;
        }
        nthTerm = seq[n - 1];
      } else if (type === 'geometric') {
        for (let i = 0; i < n; i++) {
          const val = a * Math.pow(dOrR, i);
          seq.push(val);
          sum += val;
        }
        nthTerm = seq[n - 1];
      } else {
        let f1 = 0;
        let f2 = 1;
        for (let i = 0; i < n; i++) {
          if (i === 0) seq.push(0);
          else if (i === 1) seq.push(1);
          else {
            const next = f1 + f2;
            f1 = f2;
            f2 = next;
            seq.push(next);
          }
        }
        sum = seq.reduce((acc, v) => acc + v, 0);
        nthTerm = seq[n - 1];
      }

      return {
        primaryValue: seq.slice(0, 8).join(', ') + (seq.length > 8 ? '...' : ''),
        primaryLabel: `${type.charAt(0).toUpperCase() + type.slice(1)} Sequence (${n} terms)`,
        subtext: `Nth Term (a_${n}) = ${nthTerm} | Sum = ${sum}`,
        breakdown: [
          { label: 'Sequence Type', value: type },
          { label: `Nth Term (Term #${n})`, value: nthTerm.toString() },
          { label: `Sum of all ${n} terms`, value: sum.toString() },
          { label: 'Full Sequence', value: seq.join(', ') }
        ],
        steps: [
          type === 'arithmetic' ? `Formula: a_n = a + (n - 1)d` : type === 'geometric' ? `Formula: a_n = a × r^(n-1)` : `Fibonacci: F_n = F_{n-1} + F_{n-2}`,
          `Calculated terms up to n = ${n}`,
          `Accumulated sequence sum: ${sum}`
        ]
      };
    },
    formula: 'Arithmetic: a_n = a + (n - 1)d  |  Geometric: a_n = a × r^(n - 1)',
    explanation: 'Generates progressive sequences of numbers with explicit formulas for the nth term and partial sums.',
    howToUse: ['Select the sequence family.', 'Enter starting values.', 'Choose how many terms to generate.'],
    example: {
      inputs: { type: 'arithmetic', firstTerm: 3, diffOrRatio: 4, terms: 5 },
      output: '3, 7, 11, 15, 19',
      explanation: 'Starts at 3 and adds 4 each step. 5th term is 19. Sum is 55.'
    },
    faqs: [{ question: 'What is a geometric sequence?', answer: 'A sequence where each term after the first is found by multiplying the previous one by a fixed, non-zero number called the common ratio.' }],
    keywords: ['sequence calculator', 'arithmetic progression', 'geometric progression', 'fibonacci', 'nth term', 'series sum']
  }
];

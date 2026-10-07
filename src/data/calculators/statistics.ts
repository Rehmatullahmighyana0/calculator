import { CalculatorDef } from '../../types/calculator';

export const statisticsCalculators: CalculatorDef[] = [
  {
    id: 'standard-deviation-calculator',
    slug: 'standard-deviation-calculator',
    title: 'Standard Deviation & Variance Calculator',
    category: 'statistics',
    shortDesc: 'Calculate sample and population standard deviation, variance, and mean for any dataset.',
    icon: 'BarChart2',
    badge: 'popular',
    fields: [
      { id: 'dataset', label: 'Dataset (comma or space separated numbers)', type: 'text', defaultValue: '10, 12, 23, 23, 16, 23, 21, 16', placeholder: '10, 12, 23, 23, 16' }
    ],
    calculate: (inputs) => {
      const raw = String(inputs.dataset || '');
      const nums = raw
        .split(/[,\s]+/)
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));

      if (nums.length < 2) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter at least two numbers.' };
      }

      const n = nums.length;
      const mean = nums.reduce((sum, v) => sum + v, 0) / n;
      const squaredDiffs = nums.map((v) => Math.pow(v - mean, 2));
      const sumSqDiffs = squaredDiffs.reduce((sum, v) => sum + v, 0);

      // Sample (n-1) vs Population (n)
      const sampleVar = sumSqDiffs / (n - 1);
      const sampleSd = Math.sqrt(sampleVar);

      const popVar = sumSqDiffs / n;
      const popSd = Math.sqrt(popVar);

      return {
        primaryValue: `s = ${sampleSd.toFixed(4)}`,
        primaryLabel: 'Sample Standard Deviation (s)',
        subtext: `Population SD (σ): ${popSd.toFixed(4)} | Mean (x̄): ${mean.toFixed(2)}`,
        breakdown: [
          { label: 'Count of values (n)', value: n.toString() },
          { label: 'Arithmetic Mean (x̄)', value: mean.toFixed(4) },
          { label: 'Sum of Squared Deviations (SS)', value: sumSqDiffs.toFixed(4) },
          { label: 'Sample Variance (s²)', value: sampleVar.toFixed(4) },
          { label: 'Sample Std Dev (s)', value: sampleSd.toFixed(4) },
          { label: 'Population Variance (σ²)', value: popVar.toFixed(4) },
          { label: 'Population Std Dev (σ)', value: popSd.toFixed(4) }
        ],
        steps: [
          `Calculate Mean = Σx / n = ${mean.toFixed(4)}`,
          `Calculate squared differences from mean: Σ(x - x̄)² = ${sumSqDiffs.toFixed(4)}`,
          `Divide by (n - 1) for sample variance = ${sampleVar.toFixed(4)}`,
          `Take square root: s = √(${sampleVar.toFixed(4)}) = ${sampleSd.toFixed(4)}`
        ]
      };
    },
    formula: 'Sample: s = √(Σ(x - x̄)² / (n - 1))  |  Population: σ = √(Σ(x - μ)² / N)',
    explanation: 'Standard deviation measures the dispersion or spread of data values around their arithmetic mean.',
    howToUse: ['Enter numeric dataset separated by commas.', 'Click Calculate to view both sample and population dispersion.'],
    example: { inputs: { dataset: '10, 12, 23, 23, 16, 23, 21, 16' }, output: 's = 5.2372', explanation: 'Mean is 18.0. Sample variance is 27.43, giving s = 5.24.' },
    faqs: [{ question: 'Why divide by (n - 1) for sample SD?', answer: 'Bessel’s correction (n - 1) corrects bias in estimating population variance from a finite sample.' }],
    keywords: ['standard deviation calculator', 'variance', 'sample sd', 'population sd', 'dataset dispersion']
  },
  {
    id: 'z-score-calculator',
    slug: 'z-score-calculator',
    title: 'Z-Score & Normal Distribution Calculator',
    category: 'statistics',
    shortDesc: 'Compute standard score z and percentile probability under the normal distribution.',
    icon: 'TrendingUp',
    fields: [
      { id: 'rawScore', label: 'Raw Score (x)', type: 'number', defaultValue: 85, step: 0.1 },
      { id: 'mean', label: 'Population Mean (μ)', type: 'number', defaultValue: 70, step: 0.1 },
      { id: 'stdDev', label: 'Standard Deviation (σ)', type: 'number', defaultValue: 10, min: 0.001, step: 0.1 }
    ],
    calculate: (inputs) => {
      const x = parseFloat(inputs.rawScore) || 0;
      const mu = parseFloat(inputs.mean) || 0;
      const sigma = parseFloat(inputs.stdDev) || 1;

      if (sigma <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Standard deviation must be strictly positive (> 0).' };

      const z = (x - mu) / sigma;

      // Numerical approximation for cumulative standard normal distribution P(Z < z)
      const erf = (t: number) => {
        const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
        const sign = t < 0 ? -1 : 1;
        const absT = Math.abs(t);
        const k = 1 / (1 + p * absT);
        const y = 1 - (((((a5 * k + a4) * k + a3) * k + a2) * k + a1) * k * Math.exp(-absT * absT));
        return sign * y;
      };

      const percentile = 0.5 * (1 + erf(z / Math.SQRT2)) * 100;

      return {
        primaryValue: `z = ${z.toFixed(2)}`,
        primaryLabel: 'Calculated Z-Score',
        subtext: `${percentile.toFixed(2)}th Percentile (${z >= 0 ? '+' : ''}${z.toFixed(2)} standard deviations from mean)`,
        breakdown: [
          { label: 'Raw Score (x)', value: x.toString() },
          { label: 'Population Mean (μ)', value: mu.toString() },
          { label: 'Standard Deviation (σ)', value: sigma.toString() },
          { label: 'Z-Score ((x - μ) / σ)', value: z.toFixed(4) },
          { label: 'Cumulative Probability P(X < x)', value: `${percentile.toFixed(2)}%` },
          { label: 'Upper Tail Probability P(X > x)', value: `${(100 - percentile).toFixed(2)}%` }
        ],
        steps: [`Z = (x - μ) / σ = (${x} - ${mu}) / ${sigma} = ${z.toFixed(4)}`, `Found cumulative normal distribution percentile = ${percentile.toFixed(2)}%`]
      };
    },
    formula: 'z = (x - μ) / σ',
    explanation: 'A Z-score indicates how many standard deviations an individual raw score falls above or below the population mean.',
    howToUse: ['Enter your raw score, population mean, and standard deviation.', 'Click Calculate.'],
    example: { inputs: { rawScore: 85, mean: 70, stdDev: 10 }, output: 'z = 1.50', explanation: 'A score of 85 is 1.5 standard deviations above the mean (93.32nd percentile).' },
    faqs: [{ question: 'What does a z-score of 0 mean?', answer: 'A z-score of 0 means the score is exactly equal to the mean.' }],
    keywords: ['z score calculator', 'standard score', 'normal distribution', 'percentile calculator']
  },
  {
    id: 'sample-size-calculator',
    slug: 'sample-size-calculator',
    title: 'Sample Size Calculator',
    category: 'statistics',
    shortDesc: 'Determine required survey sample size based on margin of error and confidence level.',
    icon: 'Users',
    badge: 'popular',
    fields: [
      {
        id: 'confidence',
        label: 'Confidence Level',
        type: 'select',
        defaultValue: '95',
        options: [
          { label: '90% (Z = 1.645)', value: '90' },
          { label: '95% (Z = 1.960)', value: '95' },
          { label: '99% (Z = 2.576)', value: '99' }
        ]
      },
      { id: 'marginOfErrorPct', label: 'Margin of Error (%)', type: 'number', defaultValue: 5, min: 0.5, max: 20, step: 0.5 },
      { id: 'populationSize', label: 'Population Size (leave empty or 0 for infinite)', type: 'number', defaultValue: 0, min: 0, step: 1000 }
    ],
    calculate: (inputs) => {
      const conf = inputs.confidence || '95';
      const e = (parseFloat(inputs.marginOfErrorPct) || 5) / 100;
      const pop = parseInt(inputs.populationSize) || 0;

      const zMap: Record<string, number> = { '90': 1.645, '95': 1.96, '99': 2.576 };
      const z = zMap[conf] || 1.96;
      const p = 0.5; // Maximum variability assumption

      // Cochran formula: n0 = (z^2 * p * (1-p)) / e^2
      const n0 = (z * z * p * (1 - p)) / (e * e);
      let n = n0;

      // Finite population correction if pop > 0
      if (pop > 0) {
        n = n0 / (1 + (n0 - 1) / pop);
      }

      const sampleNeeded = Math.ceil(n);

      return {
        primaryValue: `${sampleNeeded.toLocaleString()} Respondents`,
        primaryLabel: 'Required Sample Size',
        subtext: `${conf}% Confidence Level with ±${inputs.marginOfErrorPct}% Margin of Error`,
        breakdown: [
          { label: 'Confidence Level', value: `${conf}% (Z = ${z})` },
          { label: 'Margin of Error', value: `±${inputs.marginOfErrorPct}%` },
          { label: 'Population Type', value: pop > 0 ? `${pop.toLocaleString()} (Finite)` : 'Infinite / Unknown' },
          { label: 'Required Responses', value: `${sampleNeeded.toLocaleString()} completed surveys` }
        ],
        steps: [
          `Apply Cochran formula: n₀ = (${z}² × 0.5 × 0.5) / (${e})² = ${Math.ceil(n0)}`,
          pop > 0 ? `Apply finite population correction: n = ${sampleNeeded}` : `Sample size required = ${sampleNeeded}`
        ]
      };
    },
    formula: 'n = (Z² × p(1 - p)) / e²  (with Finite Population Correction when applicable)',
    explanation: 'Calculates the minimum statistically valid sample size needed to represent a population accurately within a chosen margin of error.',
    howToUse: ['Select desired confidence level (95% is standard).', 'Enter margin of error (e.g. 5%).', 'Click Calculate.'],
    example: { inputs: { confidence: '95', marginOfErrorPct: 5, populationSize: 0 }, output: '385 Respondents', explanation: 'A sample of 385 people is statistically sufficient for any large population at a 95% confidence level and 5% margin of error.' },
    faqs: [{ question: 'Why does sample size level off around 385?', answer: 'For large or infinite populations, the marginal precision gain of surveying extra people diminishes rapidly.' }],
    keywords: ['sample size calculator', 'survey sample size', 'margin of error', 'confidence level']
  },
  {
    id: 'confidence-interval-calculator',
    slug: 'confidence-interval-calculator',
    title: 'Confidence Interval Calculator',
    category: 'statistics',
    shortDesc: 'Compute lower and upper confidence bounds for sample mean and proportion.',
    icon: 'GitCommit',
    fields: [
      { id: 'mean', label: 'Sample Mean (x̄)', type: 'number', defaultValue: 100, step: 0.5 },
      { id: 'stdDev', label: 'Standard Deviation (s)', type: 'number', defaultValue: 15, min: 0.1, step: 0.5 },
      { id: 'sampleSize', label: 'Sample Size (n)', type: 'number', defaultValue: 64, min: 2, step: 1 },
      {
        id: 'confLevel',
        label: 'Confidence Level',
        type: 'select',
        defaultValue: '95',
        options: [
          { label: '90% (Z = 1.645)', value: '90' },
          { label: '95% (Z = 1.960)', value: '95' },
          { label: '99% (Z = 2.576)', value: '99' }
        ]
      }
    ],
    calculate: (inputs) => {
      const mean = parseFloat(inputs.mean) || 0;
      const s = parseFloat(inputs.stdDev) || 1;
      const n = parseInt(inputs.sampleSize) || 30;
      const conf = inputs.confLevel || '95';

      const zMap: Record<string, number> = { '90': 1.645, '95': 1.96, '99': 2.576 };
      const z = zMap[conf] || 1.96;

      const standardError = s / Math.sqrt(n);
      const marginOfError = z * standardError;
      const lowerBound = mean - marginOfError;
      const upperBound = mean + marginOfError;

      return {
        primaryValue: `[${lowerBound.toFixed(2)}, ${upperBound.toFixed(2)}]`,
        primaryLabel: `${conf}% Confidence Interval`,
        subtext: `Margin of Error: ±${marginOfError.toFixed(2)} (x̄ = ${mean})`,
        breakdown: [
          { label: 'Sample Mean', value: mean.toString() },
          { label: 'Standard Error (SE)', value: standardError.toFixed(4) },
          { label: 'Critical Value (Z)', value: z.toString() },
          { label: 'Margin of Error (MOE)', value: `±${marginOfError.toFixed(4)}` },
          { label: 'Confidence Interval', value: `${lowerBound.toFixed(2)} to ${upperBound.toFixed(2)}` }
        ],
        steps: [
          `Compute Standard Error: SE = ${s} / √(${n}) = ${standardError.toFixed(4)}`,
          `Compute Margin of Error: MOE = ${z} × ${standardError.toFixed(4)} = ${marginOfError.toFixed(4)}`,
          `Confidence Interval = ${mean} ± ${marginOfError.toFixed(4)} = [${lowerBound.toFixed(2)}, ${upperBound.toFixed(2)}]`
        ]
      };
    },
    formula: 'CI = x̄ ± Z × (s / √n)',
    explanation: 'A confidence interval gives an estimated range of values likely to contain the true population mean.',
    howToUse: ['Enter sample mean, standard deviation, and sample size.', 'Select confidence level.', 'Click Calculate.'],
    example: { inputs: { mean: 100, stdDev: 15, sampleSize: 64, confLevel: '95' }, output: '[96.33, 103.68]', explanation: 'With 95% confidence, the true population mean is between 96.33 and 103.68.' },
    faqs: [{ question: 'How can you narrow a confidence interval?', answer: 'Increase the sample size n to reduce standard error, or accept a lower confidence level.' }],
    keywords: ['confidence interval', 'margin of error', 'standard error', 'statistics']
  },
  {
    id: 'mean-calculator',
    slug: 'mean-calculator',
    title: 'Arithmetic, Geometric & Harmonic Mean Calculator',
    category: 'statistics',
    shortDesc: 'Compute arithmetic mean, geometric mean, and harmonic mean of a dataset.',
    icon: 'Sliders',
    fields: [
      { id: 'numbers', label: 'Numbers (comma separated)', type: 'text', defaultValue: '4, 8, 16, 32', placeholder: '4, 8, 16, 32' }
    ],
    calculate: (inputs) => {
      const raw = String(inputs.numbers || '');
      const nums = raw
        .split(/[,\s]+/)
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n) && n > 0);

      if (nums.length === 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter positive numbers.' };

      const n = nums.length;
      const arithmetic = nums.reduce((sum, v) => sum + v, 0) / n;
      const product = nums.reduce((prod, v) => prod * v, 1);
      const geometric = Math.pow(product, 1 / n);
      const harmonic = n / nums.reduce((sum, v) => sum + 1 / v, 0);

      return {
        primaryValue: `AM: ${arithmetic.toFixed(2)} | GM: ${geometric.toFixed(2)} | HM: ${harmonic.toFixed(2)}`,
        primaryLabel: 'Calculated Means (Pythagorean Means)',
        subtext: `AM (${arithmetic.toFixed(2)}) ≥ GM (${geometric.toFixed(2)}) ≥ HM (${harmonic.toFixed(2)})`,
        breakdown: [
          { label: 'Arithmetic Mean (Average)', value: arithmetic.toFixed(4) },
          { label: 'Geometric Mean', value: geometric.toFixed(4) },
          { label: 'Harmonic Mean', value: harmonic.toFixed(4) }
        ],
        steps: [`Arithmetic = Σx / n = ${arithmetic.toFixed(4)}`, `Geometric = (Πx)^(1/n) = ${geometric.toFixed(4)}`, `Harmonic = n / Σ(1/x) = ${harmonic.toFixed(4)}`]
      };
    },
    formula: 'AM = Σx / n  |  GM = (x₁ · x₂ · ... · xₙ)^(1/n)  |  HM = n / Σ(1/x)',
    explanation: 'Computes the three classical Pythagorean means used in finance, physics, and rates analysis.',
    howToUse: ['Enter positive numbers separated by commas.', 'Click Calculate.'],
    example: { inputs: { numbers: '4, 8, 16, 32' }, output: 'AM: 15.00 | GM: 11.31 | HM: 8.53', explanation: 'Geometric mean is 11.31; arithmetic is 15.0.' },
    faqs: [{ question: 'When is geometric mean used?', answer: 'For compounding growth rates, financial returns, and ratios.' }],
    keywords: ['geometric mean', 'harmonic mean', 'pythagorean means', 'mean calculator']
  },
  {
    id: 'variance-calculator',
    slug: 'variance-calculator',
    title: 'Variance Calculator',
    category: 'statistics',
    shortDesc: 'Compute sample and population variance with step-by-step deviations.',
    icon: 'BarChart',
    fields: [
      { id: 'dataset', label: 'Dataset (comma separated)', type: 'text', defaultValue: '3, 5, 8, 12, 17', placeholder: '3, 5, 8, 12, 17' }
    ],
    calculate: (inputs) => {
      const raw = String(inputs.dataset || '');
      const nums = raw
        .split(/[,\s]+/)
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));

      if (nums.length < 2) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter at least two numbers.' };

      const n = nums.length;
      const mean = nums.reduce((sum, v) => sum + v, 0) / n;
      const ss = nums.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0);

      const sVar = ss / (n - 1);
      const pVar = ss / n;

      return {
        primaryValue: `s² = ${sVar.toFixed(2)}`,
        primaryLabel: 'Sample Variance (s²)',
        subtext: `Population Variance (σ²): ${pVar.toFixed(2)} | Mean: ${mean.toFixed(2)}`,
        breakdown: [
          { label: 'Sample Variance (s²)', value: sVar.toFixed(4) },
          { label: 'Population Variance (σ²)', value: pVar.toFixed(4) },
          { label: 'Standard Deviation (s)', value: Math.sqrt(sVar).toFixed(4) }
        ],
        steps: [`Mean = ${mean.toFixed(2)}`, `Sum of squared diffs = ${ss.toFixed(2)}`, `Sample Variance = ${ss.toFixed(2)} / (${n} - 1) = ${sVar.toFixed(4)}`]
      };
    },
    formula: 's² = Σ(x - x̄)² / (n - 1)',
    explanation: 'Variance measures the expectation of the squared deviation of a random variable from its mean.',
    howToUse: ['Enter dataset numbers.', 'Click Calculate.'],
    example: { inputs: { dataset: '3, 5, 8, 12, 17' }, output: 's² = 32.50', explanation: 'Sample variance is 32.50 with sample std dev 5.70.' },
    faqs: [{ question: 'What is the unit of variance?', answer: 'Variance units are squared (e.g. dollars squared or meters squared).' }],
    keywords: ['variance calculator', 'sample variance', 'population variance']
  },
  {
    id: 'range-calculator',
    slug: 'range-calculator',
    title: 'Range & Interquartile Range (IQR) Calculator',
    category: 'statistics',
    shortDesc: 'Compute minimum, maximum, statistical range, quartiles (Q1, Q3), and IQR.',
    icon: 'Maximize2',
    fields: [
      { id: 'dataset', label: 'Dataset', type: 'text', defaultValue: '4, 17, 7, 14, 18, 12, 3, 16, 10, 4, 4, 12', placeholder: '4, 17, 7, 14, 18' }
    ],
    calculate: (inputs) => {
      const raw = String(inputs.dataset || '');
      const nums = raw
        .split(/[,\s]+/)
        .map((s) => parseFloat(s.trim()))
        .filter((n) => !isNaN(n));

      if (nums.length < 2) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter at least 2 numbers.' };

      const sorted = [...nums].sort((a, b) => a - b);
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      const range = max - min;

      const q1Idx = Math.floor(sorted.length * 0.25);
      const q3Idx = Math.floor(sorted.length * 0.75);
      const q1 = sorted[q1Idx];
      const q3 = sorted[q3Idx];
      const iqr = q3 - q1;

      return {
        primaryValue: `Range = ${range} | IQR = ${iqr}`,
        primaryLabel: 'Statistical Spread',
        subtext: `Min: ${min} | Max: ${max} | Q1: ${q1} | Q3: ${q3}`,
        breakdown: [
          { label: 'Minimum', value: min.toString() },
          { label: 'Maximum', value: max.toString() },
          { label: 'Statistical Range (Max - Min)', value: range.toString() },
          { label: 'First Quartile (Q1)', value: q1.toString() },
          { label: 'Third Quartile (Q3)', value: q3.toString() },
          { label: 'Interquartile Range (IQR)', value: iqr.toString() }
        ],
        steps: [`Sorted dataset: [${sorted.join(', ')}]`, `Range = ${max} - ${min} = ${range}`, `IQR = Q3 (${q3}) - Q1 (${q1}) = ${iqr}`]
      };
    },
    formula: 'Range = Max - Min  |  IQR = Q3 - Q1',
    explanation: 'The range measures total data spread, while the interquartile range (IQR) measures the spread of the middle 50% of values.',
    howToUse: ['Enter dataset numbers.', 'Click Calculate.'],
    example: { inputs: { dataset: '3, 4, 4, 4, 7, 10, 12, 12, 14, 16, 17, 18' }, output: 'Range = 15 | IQR = 10', explanation: 'Max 18 - Min 3 = 15 range.' },
    faqs: [{ question: 'Why is IQR useful?', answer: 'IQR is resistant to extreme outliers, making it an excellent measure of dispersion for skewed distributions.' }],
    keywords: ['range calculator', 'interquartile range', 'iqr', 'quartiles']
  }
];

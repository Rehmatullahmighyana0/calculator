const { toNum, formatNum } = require('./utils.cjs');

const engines = {
  'standard-deviation-calculator': (inputs) => {
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

  'z-score-calculator': (inputs) => {
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

  'sample-size-calculator': (inputs) => {
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

  'confidence-interval-calculator': (inputs) => {
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

  'mean-calculator': (inputs) => {
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

  'variance-calculator': (inputs) => {
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

  'range-calculator': (inputs) => {
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

  'mean-median-mode-calculator': (inputs) => {
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
  }
};

module.exports = engines;


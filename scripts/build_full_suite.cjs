const fs = require('fs');
const path = require('path');

// 1. Load all 15 category engines
const engineFiles = [
  'basic_everyday.cjs',
  'math.cjs',
  'geometry.cjs',
  'finance.cjs',
  'health_fitness.cjs',
  'date_time.cjs',
  'unit_converters.cjs',
  'construction.cjs',
  'electrical.cjs',
  'physics.cjs',
  'chemistry.cjs',
  'statistics.cjs',
  'computer_data.cjs',
  'productivity.cjs',
  'business.cjs'
];

const allEngines = {};
for (const f of engineFiles) {
  const mod = require(path.join(__dirname, 'engines', f));
  Object.assign(allEngines, mod);
}

const totalEnginesCount = Object.keys(allEngines).length;
console.log(`Loaded ${totalEnginesCount} calculation engines.`);
if (totalEnginesCount !== 200) {
  throw new Error(`Expected exactly 200 engines, found ${totalEnginesCount}`);
}

// 2. Load existing 183 calculators data
const oldDataFile = path.join(__dirname, '..', 'js', 'calculators-data.js');
const oldContent = fs.readFileSync(oldDataFile, 'utf8');
const match = oldContent.match(/var ALL_CALCULATORS_DATA = (\[[\s\S]*\]);/);
if (!match) throw new Error('Could not parse ALL_CALCULATORS_DATA from calculators-data.js');
const rawOldData = JSON.parse(match[1]);

// 3. Filter out country-specific & duplicates (5 total)
const removedIds = new Set([
  'tax-calculator',
  'vat-calculator',
  'sales-tax-calculator',
  'due-date-calculator',
  'days-between-dates'
]);

const cleanOldData = rawOldData.filter(d => !removedIds.has(d.id));

// Fix title if regional
const bodyFatCalc = cleanOldData.find(d => d.id === 'body-fat-calculator-navy');
if (bodyFatCalc) {
  bodyFatCalc.title = 'Body Fat Calculator (Circumference Method)';
  bodyFatCalc.shortDesc = 'Calculate estimated body fat percentage using standard body circumference measurements.';
  bodyFatCalc.keywords = bodyFatCalc.keywords.filter(k => !k.includes('navy') && !k.includes('us'));
  bodyFatCalc.keywords.push('body fat percentage', 'circumference formula', 'fitness index');
}

// Normalize categories across all calculators
cleanOldData.forEach(c => {
  if (c.category === 'data-computer') c.category = 'computer-data';
  if (c.category === 'business') c.category = 'business-marketing';
});


// 4. Define the 22 new calculators with professional metadata & fields
const newCalculators = [
  // Mathematics (2 new)
  {
    id: 'pythagorean-theorem-calculator',
    title: 'Pythagorean Theorem Calculator',
    slug: 'pythagorean-theorem-calculator',
    category: 'math',
    shortDesc: 'Solve right-triangle sides (a² + b² = c²) for hypotenuse or either leg.',
    badge: 'popular',
    formula: 'c² = a² + b² (or a = √(c² - b²))',
    example: 'Inputs: Side a = 3, Side b = 4 => Hypotenuse c = 5',
    keywords: ['pythagorean theorem', 'hypotenuse', 'right triangle', 'triangle solver', 'geometry math'],
    fields: [
      {
        id: 'solveFor',
        label: 'Solve For',
        type: 'select',
        defaultValue: 'c',
        options: [
          { label: 'Hypotenuse (c)', value: 'c' },
          { label: 'Side leg (a)', value: 'a' },
          { label: 'Side leg (b)', value: 'b' }
        ],
        unit: ''
      },
      { id: 'a', label: 'Side a', type: 'number', defaultValue: 3, placeholder: '3', min: 0, step: 'any', unit: '' },
      { id: 'b', label: 'Side b', type: 'number', defaultValue: 4, placeholder: '4', min: 0, step: 'any', unit: '' },
      { id: 'c', label: 'Hypotenuse c (when solving for leg)', type: 'number', defaultValue: 5, placeholder: '5', min: 0, step: 'any', unit: '' }
    ]
  },
  {
    id: 'determinant-calculator',
    title: 'Matrix Determinant Calculator',
    slug: 'determinant-calculator',
    category: 'math',
    shortDesc: 'Calculate the determinant of any square matrix (2x2, 3x3, 4x4, up to 6x6) with step-by-step row reduction and cofactor expansion.',
    badge: 'featured',
    formula: 'det(A) = Σ (-1)^(i+j) a_ij det(M_ij)  |  Row reduction to triangular form',
    example: 'Matrix [[1, 2, 3], [4, 5, 6], [7, 8, 9]] => det(A) = 0',
    keywords: ['determinant', 'matrix determinant', 'linear algebra', '2x2 matrix', '3x3 matrix', '4x4 matrix', 'gaussian elimination', 'cofactor expansion'],
    fields: [
      {
        id: 'matrixSize',
        label: 'Size of the matrix',
        type: 'select',
        defaultValue: '3',
        options: [
          { label: '2 × 2 Matrix', value: '2' },
          { label: '3 × 3 Matrix', value: '3' },
          { label: '4 × 4 Matrix', value: '4' },
          { label: '5 × 5 Matrix', value: '5' },
          { label: '6 × 6 Matrix', value: '6' }
        ],
        unit: ''
      },
      {
        id: 'method',
        label: 'Method',
        type: 'select',
        defaultValue: 'auto',
        options: [
          { label: 'Row Operations & Expansion (eMathHelp)', value: 'auto' },
          { label: 'Cofactor Expansion (Laplace)', value: 'cofactor' },
          { label: 'Gaussian Elimination (Triangular Form)', value: 'gaussian' },
          { label: 'Rule of Sarrus (3×3 only)', value: 'sarrus' }
        ],
        unit: ''
      },
      {
        id: 'matrixInput',
        label: 'Matrix Elements',
        type: 'text',
        defaultValue: '[[1,2,3],[4,5,6],[7,8,9]]',
        placeholder: '[[1,2,3],[4,5,6],[7,8,9]]',
        unit: ''
      }
    ]
  },

  // Finance (3 new)
  {
    id: 'future-value-calculator',
    title: 'Future Value (FV) Calculator',
    slug: 'future-value-calculator',
    category: 'finance',
    shortDesc: 'Compute the future value of an investment or lump sum cash flow with compounding interest.',
    badge: 'popular',
    formula: 'FV = PV × (1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]',
    example: '$10,000 invested at 7% for 10 years with $1,200/yr additions => $36,256.36',
    keywords: ['future value', 'fv calculator', 'compound interest', 'investment growth', 'time value of money'],
    fields: [
      { id: 'presentValue', label: 'Present Principal ($)', type: 'number', defaultValue: 10000, min: 0, step: 'any', unit: '$' },
      { id: 'interestRate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 7, min: 0, max: 100, step: 'any', unit: '%' },
      { id: 'years', label: 'Investment Horizon (Years)', type: 'number', defaultValue: 10, min: 0.1, max: 100, step: 'any', unit: 'yrs' },
      { id: 'annualAddition', label: 'Periodic Contribution ($)', type: 'number', defaultValue: 1200, min: 0, step: 'any', unit: '$' },
      {
        id: 'compoundsPerYear',
        label: 'Compounding Frequency',
        type: 'select',
        defaultValue: 12,
        options: [
          { label: 'Annually (1/yr)', value: 1 },
          { label: 'Semi-Annually (2/yr)', value: 2 },
          { label: 'Quarterly (4/yr)', value: 4 },
          { label: 'Monthly (12/yr)', value: 12 },
          { label: 'Daily (365/yr)', value: 365 }
        ],
        unit: ''
      }
    ]
  },
  {
    id: 'present-value-calculator',
    title: 'Present Value (PV) Calculator',
    slug: 'present-value-calculator',
    category: 'finance',
    shortDesc: 'Discount future cash flows to determine their present purchasing value today.',
    badge: 'featured',
    formula: 'PV = FV / (1 + r/n)^(nt)',
    example: '$50,000 received in 8 years discounted at 6% => $31,370.62 today',
    keywords: ['present value', 'pv calculator', 'discounted cash flow', 'dcf', 'time value of money'],
    fields: [
      { id: 'futureValue', label: 'Expected Future Amount ($)', type: 'number', defaultValue: 50000, min: 0, step: 'any', unit: '$' },
      { id: 'discountRate', label: 'Annual Discount Rate (%)', type: 'number', defaultValue: 6, min: 0, max: 100, step: 'any', unit: '%' },
      { id: 'years', label: 'Time Until Receipt (Years)', type: 'number', defaultValue: 8, min: 0.1, max: 100, step: 'any', unit: 'yrs' },
      {
        id: 'compoundsPerYear',
        label: 'Discounting Frequency',
        type: 'select',
        defaultValue: 1,
        options: [
          { label: 'Annually (1/yr)', value: 1 },
          { label: 'Quarterly (4/yr)', value: 4 },
          { label: 'Monthly (12/yr)', value: 12 }
        ],
        unit: ''
      }
    ]
  },
  {
    id: 'cagr-calculator',
    title: 'CAGR Calculator (Compound Annual Growth Rate)',
    slug: 'cagr-calculator',
    category: 'finance',
    shortDesc: 'Calculate the accurate smoothed annual growth rate of any investment over multiple years.',
    badge: 'popular',
    formula: 'CAGR = (Ending Value / Beginning Value)^(1 / Years) - 1',
    example: '$10,000 growing to $25,000 over 5 years => 20.11% CAGR',
    keywords: ['cagr', 'compound annual growth rate', 'annual return', 'investment return', 'portfolio growth'],
    fields: [
      { id: 'beginningValue', label: 'Initial Value ($)', type: 'number', defaultValue: 10000, min: 0.01, step: 'any', unit: '$' },
      { id: 'endingValue', label: 'Final Value ($)', type: 'number', defaultValue: 25000, min: 0, step: 'any', unit: '$' },
      { id: 'years', label: 'Holding Period (Years)', type: 'number', defaultValue: 5, min: 0.1, max: 100, step: 'any', unit: 'yrs' }
    ]
  },

  // Physics (4 new)
  {
    id: 'coulombs-law-calculator',
    title: "Coulomb's Law Calculator",
    slug: 'coulombs-law-calculator',
    category: 'physics',
    shortDesc: 'Compute the electrostatic force between two electrical charges separated by distance r.',
    badge: 'featured',
    formula: 'F = k_e × |q₁ × q₂| / r²',
    example: 'q₁ = 1 µC, q₂ = 2 µC, r = 0.05 m => 7.19 N repulsion',
    keywords: ['coulombs law', 'electrostatic force', 'electric charge', 'physics', 'coulomb constant'],
    fields: [
      { id: 'q1', label: 'Point Charge q₁ (Coulombs)', type: 'number', defaultValue: 0.000001, step: 'any', unit: 'C' },
      { id: 'q2', label: 'Point Charge q₂ (Coulombs)', type: 'number', defaultValue: 0.000002, step: 'any', unit: 'C' },
      { id: 'r', label: 'Separation Distance (meters)', type: 'number', defaultValue: 0.05, min: 0.0001, step: 'any', unit: 'm' }
    ]
  },
  {
    id: 'gravitational-force-calculator',
    title: 'Gravitational Force Calculator',
    slug: 'gravitational-force-calculator',
    category: 'physics',
    shortDesc: "Compute the universal attractive gravitational force between two masses using Newton's Law.",
    badge: 'featured',
    formula: 'F = G × (m₁ × m₂) / r²',
    example: 'Earth (5.972e24 kg) & Person (70 kg) at 6,371 km radius => 686.29 N',
    keywords: ['gravitational force', 'gravity calculator', 'newtons law of gravitation', 'mass attraction', 'physics'],
    fields: [
      { id: 'm1', label: 'Mass 1 (kg)', type: 'number', defaultValue: 5.972e24, min: 0.0001, step: 'any', unit: 'kg' },
      { id: 'm2', label: 'Mass 2 (kg)', type: 'number', defaultValue: 70, min: 0.0001, step: 'any', unit: 'kg' },
      { id: 'r', label: 'Distance between centers (meters)', type: 'number', defaultValue: 6371000, min: 0.0001, step: 'any', unit: 'm' }
    ]
  },
  {
    id: 'heat-energy-calculator',
    title: 'Heat Energy Calculator (Q = mcΔT)',
    slug: 'heat-energy-calculator',
    category: 'physics',
    shortDesc: 'Determine the thermal heat energy transferred during temperature changes based on specific heat capacity.',
    badge: 'popular',
    formula: 'Q = m × c × ΔT',
    example: '2.5 kg water (c = 4184 J/kg°C) heated from 20°C to 80°C => 627.60 kJ',
    keywords: ['heat energy', 'specific heat', 'thermal energy', 'calorimetry', 'temperature change'],
    fields: [
      { id: 'mass', label: 'Substance Mass (kg)', type: 'number', defaultValue: 2.5, min: 0.001, step: 'any', unit: 'kg' },
      { id: 'specificHeat', label: 'Specific Heat Capacity c (J/kg·°C)', type: 'number', defaultValue: 4184, min: 1, step: 'any', unit: 'J/kg·°C' },
      { id: 'tempInitial', label: 'Initial Temperature T₁ (°C)', type: 'number', defaultValue: 20, step: 'any', unit: '°C' },
      { id: 'tempFinal', label: 'Final Temperature T₂ (°C)', type: 'number', defaultValue: 80, step: 'any', unit: '°C' }
    ]
  },
  {
    id: 'wavelength-calculator',
    title: 'Wavelength & Wave Speed Calculator',
    slug: 'wavelength-calculator',
    category: 'physics',
    shortDesc: 'Calculate wavelength, frequency, and period for light, radio, and acoustic waves.',
    badge: 'featured',
    formula: 'λ = v / f | Period T = 1 / f',
    example: '100 MHz FM radio wave in air => λ = 2.998 meters',
    keywords: ['wavelength', 'frequency', 'wave speed', 'light wave', 'sound frequency'],
    fields: [
      {
        id: 'waveType',
        label: 'Propagation Medium / Wave Type',
        type: 'select',
        defaultValue: 'light',
        options: [
          { label: 'Electromagnetic / Light (c ≈ 3×10⁸ m/s)', value: 'light' },
          { label: 'Sound in Air at 20°C (343 m/s)', value: 'sound' },
          { label: 'Custom Medium Speed', value: 'custom' }
        ],
        unit: ''
      },
      { id: 'frequency', label: 'Wave Frequency (Hz)', type: 'number', defaultValue: 100000000, min: 0.001, step: 'any', unit: 'Hz' },
      { id: 'customSpeed', label: 'Custom Velocity (m/s, if selected)', type: 'number', defaultValue: 300, min: 0.1, step: 'any', unit: 'm/s' }
    ]
  },

  // Statistics (1 new)
  {
    id: 'mean-median-mode-calculator',
    title: 'Mean, Median, Mode & Range Calculator',
    slug: 'mean-median-mode-calculator',
    category: 'statistics',
    shortDesc: 'Instantly compute measures of central tendency: arithmetic mean, median, mode, and range.',
    badge: 'popular',
    formula: 'Mean = Σx / N | Median = middle sorted element | Mode = highest frequency',
    example: 'Dataset "12, 15, 18, 15, 22, 25, 29, 30, 15" => Mean: 20.11, Median: 18, Mode: 15',
    keywords: ['mean median mode', 'central tendency', 'average', 'statistics calculator', 'data distribution'],
    fields: [
      { id: 'numbers', label: 'Numbers (comma or space separated)', type: 'text', defaultValue: '12, 15, 18, 15, 22, 25, 29, 30, 15', placeholder: 'e.g. 12, 15, 18, 15, 22', unit: '' }
    ]
  },

  // Web Development & Computer Data (12 new)
  {
    id: 'px-to-rem',
    title: 'PX to REM Converter',
    slug: 'px-to-rem',
    category: 'computer-data',
    shortDesc: 'Convert pixel font sizes and spacing to scalable CSS rem units based on root font size.',
    badge: 'popular',
    formula: 'rem = px / base_root_px',
    example: '24px with 16px base font size => 1.5 rem',
    keywords: ['px to rem', 'pixel to rem', 'css unit converter', 'responsive typography', 'web development'],
    fields: [
      { id: 'px', label: 'Pixel Value (px)', type: 'number', defaultValue: 24, min: 0, step: 'any', unit: 'px' },
      { id: 'base', label: 'Root Base Font Size (px)', type: 'number', defaultValue: 16, min: 1, step: 'any', unit: 'px' }
    ]
  },
  {
    id: 'rem-to-px',
    title: 'REM to PX Converter',
    slug: 'rem-to-px',
    category: 'computer-data',
    shortDesc: 'Convert CSS rem units back to computed pixel dimensions for inspect and design verification.',
    badge: 'popular',
    formula: 'px = rem × base_root_px',
    example: '1.5rem with 16px base font => 24 px',
    keywords: ['rem to px', 'rem to pixel', 'css typography', 'web design unit', 'front-end tools'],
    fields: [
      { id: 'rem', label: 'REM Value (rem)', type: 'number', defaultValue: 1.5, min: 0, step: 'any', unit: 'rem' },
      { id: 'base', label: 'Root Base Font Size (px)', type: 'number', defaultValue: 16, min: 1, step: 'any', unit: 'px' }
    ]
  },
  {
    id: 'rgb-to-hex',
    title: 'RGB to HEX Color Converter',
    slug: 'rgb-to-hex',
    category: 'computer-data',
    shortDesc: 'Convert Red-Green-Blue color coordinates to 6-digit hexadecimal web color codes.',
    badge: 'popular',
    formula: 'HEX = # + toHex(R) + toHex(G) + toHex(B)',
    example: 'RGB(59, 130, 246) => #3B82F6',
    keywords: ['rgb to hex', 'color converter', 'hex code', 'css color', 'web colors'],
    fields: [
      { id: 'r', label: 'Red (0-255)', type: 'number', defaultValue: 59, min: 0, max: 255, step: 1, unit: '' },
      { id: 'g', label: 'Green (0-255)', type: 'number', defaultValue: 130, min: 0, max: 255, step: 1, unit: '' },
      { id: 'b', label: 'Blue (0-255)', type: 'number', defaultValue: 246, min: 0, max: 255, step: 1, unit: '' }
    ]
  },
  {
    id: 'hex-to-rgb',
    title: 'HEX to RGB Color Converter',
    slug: 'hex-to-rgb',
    category: 'computer-data',
    shortDesc: 'Convert 3 or 6-character hexadecimal color strings into decimal RGB component values.',
    badge: 'popular',
    formula: 'RGB = (parseInt(hex[0..1]), parseInt(hex[2..3]), parseInt(hex[4..5]))',
    example: '#3B82F6 => rgb(59, 130, 246)',
    keywords: ['hex to rgb', 'hex color', 'color conversion', 'web designer tool', 'frontend code'],
    fields: [
      { id: 'hex', label: 'HEX Color Code', type: 'text', defaultValue: '#3B82F6', placeholder: '#3B82F6', unit: '' }
    ]
  },
  {
    id: 'rgb-to-hsl',
    title: 'RGB to HSL Color Converter',
    slug: 'rgb-to-hsl',
    category: 'computer-data',
    shortDesc: 'Transform RGB color values into cylindrical Hue, Saturation, and Lightness coordinates.',
    badge: 'featured',
    formula: 'Hue [0-360°], Saturation [0-100%], Lightness [0-100%]',
    example: 'RGB(59, 130, 246) => hsl(217°, 91%, 60%)',
    keywords: ['rgb to hsl', 'color coordinates', 'hue saturation lightness', 'color space', 'web styling'],
    fields: [
      { id: 'r', label: 'Red Channel (0-255)', type: 'number', defaultValue: 59, min: 0, max: 255, step: 1, unit: '' },
      { id: 'g', label: 'Green Channel (0-255)', type: 'number', defaultValue: 130, min: 0, max: 255, step: 1, unit: '' },
      { id: 'b', label: 'Blue Channel (0-255)', type: 'number', defaultValue: 246, min: 0, max: 255, step: 1, unit: '' }
    ]
  },
  {
    id: 'hsl-to-rgb',
    title: 'HSL to RGB Color Converter',
    slug: 'hsl-to-rgb',
    category: 'computer-data',
    shortDesc: 'Convert Hue, Saturation, and Lightness values into standard RGB color space.',
    badge: 'featured',
    formula: 'Chroma C = (1 - |2L - 1|) × S, compute intermediate coordinates',
    example: 'hsl(217°, 91%, 60%) => rgb(60, 131, 246)',
    keywords: ['hsl to rgb', 'hsl color', 'color conversion', 'css hsl', 'color wheel'],
    fields: [
      { id: 'h', label: 'Hue (0 - 360°)', type: 'number', defaultValue: 217, min: 0, max: 360, step: 1, unit: '°' },
      { id: 's', label: 'Saturation (0 - 100%)', type: 'number', defaultValue: 91, min: 0, max: 100, step: 1, unit: '%' },
      { id: 'l', label: 'Lightness (0 - 100%)', type: 'number', defaultValue: 60, min: 0, max: 100, step: 1, unit: '%' }
    ]
  },
  {
    id: 'color-contrast',
    title: 'Color Contrast & WCAG Accessibility Checker',
    slug: 'color-contrast',
    category: 'computer-data',
    shortDesc: 'Evaluate color contrast ratio between text and background for WCAG AA and AAA accessibility compliance.',
    badge: 'popular',
    formula: 'Contrast Ratio = (L₁ + 0.05) / (L₂ + 0.05)',
    example: 'White (#FFFFFF) on Dark Slate (#1E293B) => 14.63:1 (Passes AAA)',
    keywords: ['color contrast', 'wcag contrast', 'accessibility checker', 'web accessibility', 'contrast ratio'],
    fields: [
      { id: 'foreground', label: 'Foreground / Text Color (HEX)', type: 'text', defaultValue: '#FFFFFF', placeholder: '#FFFFFF', unit: '' },
      { id: 'background', label: 'Background Color (HEX)', type: 'text', defaultValue: '#1E293B', placeholder: '#1E293B', unit: '' }
    ]
  },
  {
    id: 'aspect-ratio-calculator',
    title: 'Aspect Ratio & Resolution Calculator',
    slug: 'aspect-ratio-calculator',
    category: 'computer-data',
    shortDesc: 'Calculate simplified aspect ratios and scale dimensions proportionally for responsive video and imagery.',
    badge: 'popular',
    formula: 'Ratio = (W / GCD) : (H / GCD) | New Height = (H / W) × New Width',
    example: '1920 × 1080 scaled to 1280 width => 720 height (16:9 ratio)',
    keywords: ['aspect ratio', 'image resolution', 'screen ratio', '16:9 calculator', 'video aspect ratio'],
    fields: [
      { id: 'w1', label: 'Original Width (px)', type: 'number', defaultValue: 1920, min: 1, step: 1, unit: 'px' },
      { id: 'h1', label: 'Original Height (px)', type: 'number', defaultValue: 1080, min: 1, step: 1, unit: 'px' },
      { id: 'targetW', label: 'Scale to New Width (px, optional)', type: 'number', defaultValue: 1280, min: 1, step: 1, unit: 'px' }
    ]
  },
  {
    id: 'reading-time-calculator',
    title: 'Reading Time & Word Count Estimator',
    slug: 'reading-time-calculator',
    category: 'computer-data',
    shortDesc: 'Estimate silent reading time, presentation speech duration, word count, and character statistics.',
    badge: 'featured',
    formula: 'Reading Time = Word Count / Words Per Minute (standard 200 WPM)',
    example: '1,000 words at 200 WPM => 5 minutes silent reading',
    keywords: ['reading time', 'word count', 'speech duration', 'reading speed', 'article time estimator'],
    fields: [
      {
        id: 'text',
        label: 'Paste Article or Document Text',
        type: 'text',
        defaultValue: 'Fast, accurate, and completely free online calculators for mathematics, science, engineering, and everyday business applications.',
        placeholder: 'Paste your text here...',
        unit: ''
      },
      { id: 'wpm', label: 'Reading Speed (WPM)', type: 'number', defaultValue: 200, min: 50, max: 800, step: 10, unit: 'wpm' }
    ]
  },
  {
    id: 'json-size-calculator',
    title: 'JSON Payload Size & Minification Analyzer',
    slug: 'json-size-calculator',
    category: 'computer-data',
    shortDesc: 'Measure UTF-8 byte payload size, minified size, compression savings, and key counts for JSON data.',
    badge: 'featured',
    formula: 'Byte Size = UTF-8 encoded byte length | Savings = (Raw - Minified) / Raw × 100%',
    example: 'Raw JSON payload analyzer with whitespace removal metrics',
    keywords: ['json size', 'payload size', 'json minifier', 'api payload analyzer', 'byte size calculator'],
    fields: [
      {
        id: 'json',
        label: 'JSON Data',
        type: 'text',
        defaultValue: '{\n  "status": "success",\n  "code": 200,\n  "data": [1, 2, 3]\n}',
        placeholder: '{"key": "value"}',
        unit: ''
      }
    ]
  },
  {
    id: 'unix-permissions-calculator',
    title: 'Unix File Permissions (chmod) Calculator',
    slug: 'unix-permissions-calculator',
    category: 'computer-data',
    shortDesc: 'Convert octal permission numbers (e.g. 755, 644) to symbolic rwxr-xr-x notation and command syntax.',
    badge: 'popular',
    formula: 'Read(4) + Write(2) + Execute(1) per User, Group, and Other digits',
    example: 'chmod 755 => Owner: rwx (7), Group: r-x (5), Others: r-x (5)',
    keywords: ['chmod calculator', 'unix permissions', 'file permissions', 'octal permissions', 'linux chmod'],
    fields: [
      { id: 'octal', label: 'Octal Permission Code (3 digits, e.g. 755 or 644)', type: 'text', defaultValue: '755', placeholder: '755', unit: '' }
    ]
  },
  {
    id: 'bytes-converter',
    title: 'Data Storage Units & Bytes Converter',
    slug: 'bytes-converter',
    category: 'computer-data',
    shortDesc: 'Convert between Bytes, Kilobytes, Megabytes, Gigabytes, and binary mebibytes (MiB / GiB).',
    badge: 'popular',
    formula: 'Decimal: 1 KB = 1,000 B | Binary: 1 KiB = 1,024 B',
    example: '1,048,576 Bytes => 1.05 MB (Decimal) or 1 MiB (Binary)',
    keywords: ['bytes converter', 'kb to mb', 'gb converter', 'data storage calculator', 'file size converter'],
    fields: [
      { id: 'bytes', label: 'Input Data Amount', type: 'number', defaultValue: 1048576, min: 0, step: 'any', unit: '' },
      {
        id: 'unit',
        label: 'Selected Input Unit',
        type: 'select',
        defaultValue: 'b',
        options: [
          { label: 'Bytes (B)', value: 'b' },
          { label: 'Kilobytes (KB - 10³)', value: 'kb' },
          { label: 'Megabytes (MB - 10⁶)', value: 'mb' },
          { label: 'Gigabytes (GB - 10⁹)', value: 'gb' },
          { label: 'Mebibytes (MiB - 2²⁰)', value: 'mib' },
          { label: 'Gibibytes (GiB - 2³⁰)', value: 'gib' }
        ],
        unit: ''
      }
    ]
  }
];

// Combine uniquely by ID
const newCalcMap = new Map();
newCalculators.forEach(c => newCalcMap.set(c.id, c));

const baseList = cleanOldData.filter(d => !newCalcMap.has(d.id));
const combinedList = [...baseList, ...newCalculators];

console.log(`Combined calculators count: ${combinedList.length}`);
if (combinedList.length !== 200) {
  throw new Error(`Expected exactly 200 combined calculators, got ${combinedList.length}`);
}

// 5. Build intelligent, genuinely related calculators mapping
// Create category pools for fallback, but assign specific related IDs first
const catMap = {};
combinedList.forEach(c => {
  if (!catMap[c.category]) catMap[c.category] = [];
  catMap[c.category].push(c.id);
});

// Explicit related maps for top tools (using exact confirmed IDs)
const explicitRelated = {
  'basic-calculator': ['scientific-calculator', 'percentage-calculator', 'fraction-calculator', 'ratio-calculator'],
  'scientific-calculator': ['basic-calculator', 'pythagorean-theorem-calculator', 'exponent-calculator', 'logarithm-calculator'],
  'percentage-calculator': ['fraction-calculator', 'discount-calculator', 'percentage-change-calculator', 'profit-margin-calculator'],
  'fraction-calculator': ['percentage-calculator', 'ratio-calculator', 'percentage-change-calculator', 'proportion-calculator'],
  'bmi-calculator': ['body-fat-calculator-navy', 'bmr-calculator', 'ideal-weight-calculator', 'calorie-calculator'],
  'age-calculator': ['date-difference-calculator', 'time-duration-calculator', 'business-days-calculator', 'countdown-timer'],
  'mortgage-calculator': ['loan-calculator', 'compound-interest-calculator', 'future-value-calculator', 'amortization-calculator'],
  'compound-interest-calculator': ['simple-interest-calculator', 'future-value-calculator', 'present-value-calculator', 'cagr-calculator'],
  'future-value-calculator': ['present-value-calculator', 'compound-interest-calculator', 'cagr-calculator', 'roi-calculator'],
  'present-value-calculator': ['future-value-calculator', 'compound-interest-calculator', 'discount-calculator', 'roi-calculator'],
  'cagr-calculator': ['roi-calculator', 'future-value-calculator', 'investment-calculator', 'compound-interest-calculator'],
  'speed-calculator': ['velocity-calculator', 'acceleration-calculator', 'force-calculator', 'kinetic-energy-calculator'],
  'velocity-calculator': ['speed-calculator', 'acceleration-calculator', 'momentum-calculator', 'wavelength-calculator'],
  'acceleration-calculator': ['speed-calculator', 'velocity-calculator', 'force-calculator', 'work-calculator'],
  'force-calculator': ['gravitational-force-calculator', 'coulombs-law-calculator', 'work-calculator', 'pressure-calculator'],
  'coulombs-law-calculator': ['gravitational-force-calculator', 'ohms-law-calculator', 'force-calculator', 'electrical-power-calculator'],
  'gravitational-force-calculator': ['force-calculator', 'coulombs-law-calculator', 'potential-energy-calculator', 'momentum-calculator'],
  'heat-energy-calculator': ['temperature-converter', 'work-calculator', 'kinetic-energy-calculator', 'power-calculator'],
  'wavelength-calculator': ['speed-calculator', 'velocity-calculator', 'frequency-converter', 'speed-converter'],
  'pythagorean-theorem-calculator': ['triangle-calculator', 'area-calculator', 'scientific-calculator', 'basic-calculator'],
  'determinant-calculator': ['linear-equation-calculator', 'quadratic-equation-calculator', 'scientific-calculator', 'matrix-calculator'],
  'mean-median-mode-calculator': ['variance-calculator', 'standard-deviation-calculator', 'range-calculator', 'probability-calculator'],
  'standard-deviation-calculator': ['variance-calculator', 'mean-median-mode-calculator', 'z-score-calculator', 'range-calculator'],
  'px-to-rem': ['rem-to-px', 'aspect-ratio-calculator', 'color-contrast', 'bytes-converter'],
  'rem-to-px': ['px-to-rem', 'aspect-ratio-calculator', 'color-contrast', 'bytes-converter'],
  'rgb-to-hex': ['hex-to-rgb', 'rgb-to-hsl', 'hsl-to-rgb', 'color-contrast'],
  'hex-to-rgb': ['rgb-to-hex', 'rgb-to-hsl', 'hsl-to-rgb', 'color-contrast'],
  'rgb-to-hsl': ['hsl-to-rgb', 'rgb-to-hex', 'hex-to-rgb', 'color-contrast'],
  'hsl-to-rgb': ['rgb-to-hsl', 'hex-to-rgb', 'rgb-to-hex', 'color-contrast'],
  'color-contrast': ['rgb-to-hex', 'hex-to-rgb', 'rgb-to-hsl', 'hsl-to-rgb'],
  'aspect-ratio-calculator': ['px-to-rem', 'rem-to-px', 'color-contrast', 'download-time-calculator'],
  'reading-time-calculator': ['pomodoro-timer', 'json-size-calculator', 'bytes-converter', 'countdown-timer'],
  'json-size-calculator': ['bytes-converter', 'reading-time-calculator', 'unix-permissions-calculator', 'hex-to-decimal-converter'],
  'unix-permissions-calculator': ['bytes-converter', 'binary-calculator', 'hex-to-decimal-converter', 'json-size-calculator'],
  'bytes-converter': ['download-time-calculator', 'json-size-calculator', 'binary-calculator', 'unix-permissions-calculator'],
  'business-profit-calculator': ['business-revenue-calculator', 'cost-calculator', 'roas-calculator', 'break-even-calculator'],
  'roas-calculator': ['roi-calculator', 'business-profit-calculator', 'business-revenue-calculator', 'cost-calculator'],
  'employee-cost-calculator': ['work-hours-calculator', 'overtime-calculator', 'time-tracking-calculator', 'business-profit-calculator'],
  'business-revenue-calculator': ['business-profit-calculator', 'cost-calculator', 'roas-calculator', 'cagr-calculator'],
  'cost-calculator': ['business-profit-calculator', 'break-even-calculator', 'business-revenue-calculator', 'employee-cost-calculator']
};

// Assign related to every calculator
const allIdsSet = new Set(combinedList.map(c => c.id));

combinedList.forEach(calc => {
  let list = (explicitRelated[calc.id] || []).filter(id => allIdsSet.has(id) && id !== calc.id);

  // Replenish from same category if fewer than 4
  const peers = (catMap[calc.category] || []).filter(id => id !== calc.id && !list.includes(id));
  for (const p of peers) {
    if (list.length >= 4) break;
    list.push(p);
  }

  // Replenish from global pool if still fewer than 4
  if (list.length < 4) {
    for (const anyId of allIdsSet) {
      if (anyId !== calc.id && !list.includes(anyId)) {
        list.push(anyId);
        if (list.length >= 4) break;
      }
    }
  }

  calc.related = list.slice(0, 4);
  calc.slug = calc.id; // Guarantee slug strictly matches id
});

// 6. Test all 200 calculators with their default inputs
console.log('Testing all 200 calculators against engine implementations...');
let testErrors = 0;
combinedList.forEach(calc => {
  const engine = allEngines[calc.id];
  if (!engine) {
    console.error(`Missing calculation engine for: ${calc.id}`);
    testErrors++;
    return;
  }
  const defaultInputs = {};
  (calc.fields || []).forEach(f => {
    defaultInputs[f.id] = f.defaultValue;
  });
  try {
    const res = engine(defaultInputs);
    if (!res || !res.primaryValue || typeof res.primaryValue !== 'string') {
      console.error(`Invalid engine response for ${calc.id}:`, res);
      testErrors++;
    }
  } catch (err) {
    console.error(`Engine crashed on defaults for ${calc.id}:`, err);
    testErrors++;
  }
});

if (testErrors > 0) {
  throw new Error(`Test suite failed with ${testErrors} errors.`);
}
console.log('ALL 200 CALCULATORS PASSED EXECUTION VERIFICATION!');

// 7. Write js/calculator-engines.js
console.log('Bundling js/calculator-engines.js...');
const engineCodeParts = [];
engineCodeParts.push(`// Standalone Verified Calculation Engines for All 200 Calculators
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

  var ENGINES = {`);

const engineEntries = [];
for (const [id, fn] of Object.entries(allEngines)) {
  engineEntries.push(`    ${JSON.stringify(id)}: ${fn.toString()}`);
}

engineCodeParts.push(engineEntries.join(',\n\n'));
engineCodeParts.push(`  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ENGINES;
  }
  if (typeof window !== 'undefined') {
    window.CALCULATOR_ENGINES = ENGINES;
  }
})(typeof window !== 'undefined' ? window : this);
`);

const finalEnginesJs = engineCodeParts.join('\n');

// Write to js/, public/js/, dist/js/
const pathsToEngines = [
  path.join(__dirname, '..', 'js', 'calculator-engines.js'),
  path.join(__dirname, '..', 'public', 'js', 'calculator-engines.js'),
  path.join(__dirname, '..', 'dist', 'js', 'calculator-engines.js')
];

pathsToEngines.forEach(p => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, finalEnginesJs, 'utf8');
  console.log(`Wrote engines bundle to: ${p}`);
});

// 8. Write js/calculators-data.js and public/js/calculators-data.js
const finalDataJs = `var ALL_CALCULATORS_DATA = ${JSON.stringify(combinedList, null, 2)};\n`;

const pathsToData = [
  path.join(__dirname, '..', 'js', 'calculators-data.js'),
  path.join(__dirname, '..', 'public', 'js', 'calculators-data.js'),
  path.join(__dirname, '..', 'dist', 'js', 'calculators-data.js')
];

pathsToData.forEach(p => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, finalDataJs, 'utf8');
  console.log(`Wrote calculator data to: ${p}`);
});

// Also write all_calcs_data.json
fs.writeFileSync(path.join(__dirname, '..', 'all_calcs_data.json'), JSON.stringify(combinedList, null, 2), 'utf8');
console.log('Wrote all_calcs_data.json');

// Category breakdown summary
const catCounts = {};
combinedList.forEach(c => {
  catCounts[c.category] = (catCounts[c.category] || 0) + 1;
});

console.log('\n--- CATEGORY BREAKDOWN ---');
for (const [cat, cnt] of Object.entries(catCounts)) {
  console.log(`${cat.padEnd(25)}: ${cnt}`);
}
console.log('TOTAL:', combinedList.length);

import { CalculatorDef } from '../../types/calculator';

export const geometryCalculators: CalculatorDef[] = [
  {
    id: 'area-calculator',
    slug: 'area-calculator',
    title: 'Area Calculator',
    category: 'geometry',
    shortDesc: 'Compute area for circle, rectangle, triangle, and trapezoid shapes.',
    icon: 'Shapes',
    badge: 'popular',
    fields: [
      {
        id: 'shape',
        label: 'Select Shape',
        type: 'select',
        defaultValue: 'rectangle',
        options: [
          { label: 'Rectangle (Length × Width)', value: 'rectangle' },
          { label: 'Circle (π × r²)', value: 'circle' },
          { label: 'Triangle (0.5 × Base × Height)', value: 'triangle' },
          { label: 'Trapezoid (0.5 × (a + b) × Height)', value: 'trapezoid' }
        ]
      },
      { id: 'd1', label: 'Dimension 1 (Length / Radius / Base / Base a)', type: 'number', defaultValue: 10, min: 0.01, step: 0.1 },
      { id: 'd2', label: 'Dimension 2 (Width / Height / Base b)', type: 'number', defaultValue: 6, min: 0.01, step: 0.1 },
      { id: 'd3', label: 'Dimension 3 (Trapezoid Height)', type: 'number', defaultValue: 4, min: 0.01, step: 0.1 }
    ],
    calculate: (inputs) => {
      const shape = inputs.shape || 'rectangle';
      const d1 = parseFloat(inputs.d1) || 0;
      const d2 = parseFloat(inputs.d2) || 0;
      const d3 = parseFloat(inputs.d3) || 0;

      let area = 0;
      let formulaStr = '';

      if (shape === 'rectangle') {
        area = d1 * d2;
        formulaStr = `Area = Length × Width = ${d1} × ${d2}`;
      } else if (shape === 'circle') {
        area = Math.PI * d1 * d1;
        formulaStr = `Area = π × r² = π × ${d1}²`;
      } else if (shape === 'triangle') {
        area = 0.5 * d1 * d2;
        formulaStr = `Area = 0.5 × Base × Height = 0.5 × ${d1} × ${d2}`;
      } else if (shape === 'trapezoid') {
        area = 0.5 * (d1 + d2) * d3;
        formulaStr = `Area = 0.5 × (a + b) × h = 0.5 × (${d1} + ${d2}) × ${d3}`;
      }

      return {
        primaryValue: `${area.toFixed(2)} sq units`,
        primaryLabel: 'Total Calculated Area',
        subtext: `Shape: ${shape.toUpperCase()}`,
        breakdown: [
          { label: 'Selected Shape', value: shape },
          { label: 'Formula Used', value: formulaStr },
          { label: 'Area in square units', value: area.toFixed(4) }
        ],
        steps: [`Applied formula: ${formulaStr}`, `Calculated area = ${area.toFixed(4)}`]
      };
    },
    formula: 'Area formulas: Rectangle = l×w | Circle = πr² | Triangle = ½bh',
    explanation: 'Calculates the 2D surface enclosed within boundaries of various geometric figures.',
    howToUse: ['Select the shape.', 'Enter corresponding dimensions.', 'Click Calculate.'],
    example: { inputs: { shape: 'rectangle', d1: 10, d2: 6, d3: 4 }, output: '60.00 sq units', explanation: '10 × 6 = 60.' },
    faqs: [{ question: 'What units does this use?', answer: 'It is unit-agnostic; if you enter inches, the area will be in square inches.' }],
    keywords: ['area calculator', 'surface area', 'circle area', 'triangle area', 'rectangle area']
  },
  {
    id: 'perimeter-calculator',
    slug: 'perimeter-calculator',
    title: 'Perimeter Calculator',
    category: 'geometry',
    shortDesc: 'Compute the perimeter and circumference of 2D geometric shapes.',
    icon: 'Maximize',
    fields: [
      {
        id: 'shape',
        label: 'Select Shape',
        type: 'select',
        defaultValue: 'rectangle',
        options: [
          { label: 'Rectangle (2 × (l + w))', value: 'rectangle' },
          { label: 'Circle (2 × π × r)', value: 'circle' },
          { label: 'Square (4 × s)', value: 'square' },
          { label: 'Triangle (a + b + c)', value: 'triangle' }
        ]
      },
      { id: 'side1', label: 'Side 1 / Radius / Length', type: 'number', defaultValue: 12, min: 0.01, step: 0.1 },
      { id: 'side2', label: 'Side 2 / Width', type: 'number', defaultValue: 8, min: 0.01, step: 0.1 },
      { id: 'side3', label: 'Side 3 (Triangle)', type: 'number', defaultValue: 10, min: 0.01, step: 0.1 }
    ],
    calculate: (inputs) => {
      const shape = inputs.shape || 'rectangle';
      const s1 = parseFloat(inputs.side1) || 0;
      const s2 = parseFloat(inputs.side2) || 0;
      const s3 = parseFloat(inputs.side3) || 0;

      let perim = 0;
      if (shape === 'rectangle') perim = 2 * (s1 + s2);
      else if (shape === 'circle') perim = 2 * Math.PI * s1;
      else if (shape === 'square') perim = 4 * s1;
      else if (shape === 'triangle') perim = s1 + s2 + s3;

      return {
        primaryValue: `${perim.toFixed(2)} units`,
        primaryLabel: 'Perimeter / Circumference',
        subtext: `Shape: ${shape}`,
        breakdown: [
          { label: 'Shape', value: shape },
          { label: 'Total Boundary Length', value: perim.toFixed(4) }
        ],
        steps: [`Calculated boundary length for ${shape}`, `Perimeter = ${perim.toFixed(4)}`]
      };
    },
    formula: 'Rectangle: 2(l + w) | Circle: 2πr | Square: 4s | Triangle: a + b + c',
    explanation: 'The perimeter is the continuous line forming the boundary of a closed geometric figure.',
    howToUse: ['Choose shape.', 'Enter side lengths.', 'Click Calculate.'],
    example: { inputs: { shape: 'rectangle', side1: 12, side2: 8, side3: 10 }, output: '40.00 units', explanation: '2 × (12 + 8) = 40.' },
    faqs: [{ question: 'What is the perimeter of a circle called?', answer: 'The perimeter of a circle is known as its circumference.' }],
    keywords: ['perimeter calculator', 'circumference', 'boundary', 'perimeter of rectangle']
  },
  {
    id: 'circle-calculator',
    slug: 'circle-calculator',
    title: 'Circle Calculator',
    category: 'geometry',
    shortDesc: 'Compute circle radius, diameter, circumference, and area from any single dimension.',
    icon: 'Circle',
    badge: 'popular',
    fields: [
      { id: 'radius', label: 'Circle Radius (r)', type: 'number', defaultValue: 7, min: 0.001, step: 0.1 }
    ],
    calculate: (inputs) => {
      const r = parseFloat(inputs.radius) || 0;
      if (r <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Radius must be greater than zero.' };

      const diameter = 2 * r;
      const circumference = 2 * Math.PI * r;
      const area = Math.PI * r * r;

      return {
        primaryValue: `${area.toFixed(2)} sq units`,
        primaryLabel: 'Circle Area',
        subtext: `Circumference: ${circumference.toFixed(2)} units`,
        breakdown: [
          { label: 'Radius (r)', value: r.toString() },
          { label: 'Diameter (d = 2r)', value: diameter.toFixed(4) },
          { label: 'Circumference (C = 2πr)', value: circumference.toFixed(4) },
          { label: 'Area (A = πr²)', value: area.toFixed(4) }
        ],
        steps: [
          `Diameter d = 2 × ${r} = ${diameter.toFixed(2)}`,
          `Circumference C = 2 × π × ${r} = ${circumference.toFixed(4)}`,
          `Area A = π × (${r})² = ${area.toFixed(4)}`
        ]
      };
    },
    formula: 'A = πr²  |  C = 2πr  |  d = 2r',
    explanation: 'Comprehensive properties of a circle defined entirely by its radius r.',
    howToUse: ['Enter the radius.', 'Click Calculate to see diameter, circumference, and area.'],
    example: { inputs: { radius: 7 }, output: '153.94 sq units', explanation: 'π × 7² ≈ 153.94, Circumference ≈ 43.98.' },
    faqs: [{ question: 'What is pi (π)?', answer: 'Pi is approximately 3.14159265, the ratio of a circle’s circumference to its diameter.' }],
    keywords: ['circle calculator', 'circle area', 'circumference', 'diameter', 'radius']
  },
  {
    id: 'triangle-calculator',
    slug: 'triangle-calculator',
    title: 'Triangle Calculator',
    category: 'geometry',
    shortDesc: 'Calculate area, perimeter, semiperimeter, and angles using Heron formula.',
    icon: 'Triangle',
    fields: [
      { id: 'a', label: 'Side a', type: 'number', defaultValue: 5, min: 0.1, step: 0.1 },
      { id: 'b', label: 'Side b', type: 'number', defaultValue: 6, min: 0.1, step: 0.1 },
      { id: 'c', label: 'Side c', type: 'number', defaultValue: 7, min: 0.1, step: 0.1 }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a) || 0;
      const b = parseFloat(inputs.b) || 0;
      const c = parseFloat(inputs.c) || 0;

      if (a + b <= c || a + c <= b || b + c <= a) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Triangle Inequality Violated: The sum of any two sides must exceed the third.' };
      }

      const perimeter = a + b + c;
      const s = perimeter / 2;
      const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));

      // Angles via law of cosines
      const angleA = Math.acos((b * b + c * c - a * a) / (2 * b * c)) * (180 / Math.PI);
      const angleB = Math.acos((a * a + c * c - b * b) / (2 * a * c)) * (180 / Math.PI);
      const angleC = 180 - angleA - angleB;

      return {
        primaryValue: `${area.toFixed(2)} sq units`,
        primaryLabel: 'Triangle Area',
        subtext: `Perimeter: ${perimeter.toFixed(2)} units`,
        breakdown: [
          { label: 'Semiperimeter (s)', value: s.toFixed(2) },
          { label: 'Perimeter', value: perimeter.toFixed(2) },
          { label: 'Angle A', value: `${angleA.toFixed(1)}°` },
          { label: 'Angle B', value: `${angleB.toFixed(1)}°` },
          { label: 'Angle C', value: `${angleC.toFixed(1)}°` }
        ],
        steps: [
          `Calculate semiperimeter: s = (${a} + ${b} + ${c}) / 2 = ${s}`,
          `Apply Heron formula: Area = √(s(s-a)(s-b)(s-c))`,
          `Area = √(${s} × ${s - a} × ${s - b} × ${s - c}) = ${area.toFixed(4)}`
        ]
      };
    },
    formula: 'Area = √(s(s-a)(s-b)(s-c)) where s = (a+b+c)/2',
    explanation: 'Uses Heron formula to calculate triangle area and the law of cosines to find interior angles.',
    howToUse: ['Enter the lengths of all three sides.', 'Click Calculate.'],
    example: { inputs: { a: 5, b: 6, c: 7 }, output: '14.70 sq units', explanation: 's = 9. Area = √(9 × 4 × 3 × 2) = √216 ≈ 14.70.' },
    faqs: [{ question: 'What is the triangle inequality theorem?', answer: 'It states that any side of a triangle must be strictly shorter than the sum of the other two sides.' }],
    keywords: ['triangle calculator', 'heron formula', 'triangle area', 'law of cosines']
  },
  {
    id: 'rectangle-calculator',
    slug: 'rectangle-calculator',
    title: 'Rectangle Calculator',
    category: 'geometry',
    shortDesc: 'Compute rectangle area, perimeter, and diagonal length.',
    icon: 'Square',
    fields: [
      { id: 'length', label: 'Length', type: 'number', defaultValue: 15, min: 0.01, step: 0.1 },
      { id: 'width', label: 'Width', type: 'number', defaultValue: 8, min: 0.01, step: 0.1 }
    ],
    calculate: (inputs) => {
      const l = parseFloat(inputs.length) || 0;
      const w = parseFloat(inputs.width) || 0;
      if (l <= 0 || w <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Dimensions must be greater than zero.' };

      const area = l * w;
      const perimeter = 2 * (l + w);
      const diagonal = Math.sqrt(l * l + w * w);

      return {
        primaryValue: `${area.toFixed(2)} sq units`,
        primaryLabel: 'Rectangle Area',
        subtext: `Diagonal: ${diagonal.toFixed(2)} | Perimeter: ${perimeter.toFixed(2)}`,
        breakdown: [
          { label: 'Area (l × w)', value: area.toFixed(2) },
          { label: 'Perimeter (2(l + w))', value: perimeter.toFixed(2) },
          { label: 'Diagonal (√(l² + w²))', value: diagonal.toFixed(4) }
        ],
        steps: [`Area = ${l} × ${w} = ${area.toFixed(2)}`, `Diagonal = √(${l}² + ${w}²) = ${diagonal.toFixed(4)}`]
      };
    },
    formula: 'Area = l × w  |  Perimeter = 2(l + w)  |  Diagonal = √(l² + w²)',
    explanation: 'Computes geometric properties of a four-sided quadrilateral with four right angles.',
    howToUse: ['Enter length and width.', 'Click Calculate.'],
    example: { inputs: { length: 15, width: 8 }, output: '120.00 sq units', explanation: 'Area = 15 × 8 = 120. Diagonal = √(225 + 64) = 17.' },
    faqs: [{ question: 'How to find the diagonal?', answer: 'Using the Pythagorean theorem: d = √(length² + width²).' }],
    keywords: ['rectangle calculator', 'rectangle area', 'diagonal of rectangle', 'perimeter']
  },
  {
    id: 'square-calculator',
    slug: 'square-calculator',
    title: 'Square Calculator',
    category: 'geometry',
    shortDesc: 'Compute square area, perimeter, and diagonal from side length.',
    icon: 'Square',
    fields: [
      { id: 'side', label: 'Side Length (s)', type: 'number', defaultValue: 10, min: 0.01, step: 0.1 }
    ],
    calculate: (inputs) => {
      const s = parseFloat(inputs.side) || 0;
      if (s <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Side must be greater than zero.' };

      const area = s * s;
      const perimeter = 4 * s;
      const diagonal = s * Math.SQRT2;

      return {
        primaryValue: `${area.toFixed(2)} sq units`,
        primaryLabel: 'Square Area',
        subtext: `Diagonal: ${diagonal.toFixed(2)} | Perimeter: ${perimeter.toFixed(2)}`,
        breakdown: [
          { label: 'Side (s)', value: s.toString() },
          { label: 'Area (s²)', value: area.toFixed(2) },
          { label: 'Perimeter (4s)', value: perimeter.toFixed(2) },
          { label: 'Diagonal (s√2)', value: diagonal.toFixed(4) }
        ],
        steps: [`Area = ${s}² = ${area.toFixed(2)}`, `Diagonal = ${s} × √2 = ${diagonal.toFixed(4)}`]
      };
    },
    formula: 'Area = s²  |  Perimeter = 4s  |  Diagonal = s√2',
    explanation: 'A regular quadrilateral with four equal sides and four right angles.',
    howToUse: ['Enter the side length.', 'Click Calculate.'],
    example: { inputs: { side: 10 }, output: '100.00 sq units', explanation: 'Area = 10² = 100. Perimeter = 40.' },
    faqs: [{ question: 'Is every square a rectangle?', answer: 'Yes, a square is a special type of rectangle with equal sides.' }],
    keywords: ['square calculator', 'square area', 'diagonal of square', 'perimeter']
  },
  {
    id: 'trapezoid-calculator',
    slug: 'trapezoid-calculator',
    title: 'Trapezoid Calculator',
    category: 'geometry',
    shortDesc: 'Calculate the area and perimeter of a trapezoid from bases and height.',
    icon: 'Shield',
    fields: [
      { id: 'a', label: 'Base a', type: 'number', defaultValue: 8, min: 0.01, step: 0.1 },
      { id: 'b', label: 'Base b', type: 'number', defaultValue: 14, min: 0.01, step: 0.1 },
      { id: 'h', label: 'Height (h)', type: 'number', defaultValue: 6, min: 0.01, step: 0.1 }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.a) || 0;
      const b = parseFloat(inputs.b) || 0;
      const h = parseFloat(inputs.h) || 0;

      if (a <= 0 || b <= 0 || h <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'All inputs must be positive numbers.' };

      const area = 0.5 * (a + b) * h;
      const midsegment = (a + b) / 2;

      return {
        primaryValue: `${area.toFixed(2)} sq units`,
        primaryLabel: 'Trapezoid Area',
        subtext: `Midsegment: ${midsegment.toFixed(2)} units`,
        breakdown: [
          { label: 'Base a', value: a.toString() },
          { label: 'Base b', value: b.toString() },
          { label: 'Height (h)', value: h.toString() },
          { label: 'Midsegment (Median)', value: midsegment.toFixed(2) }
        ],
        steps: [`Add bases: (${a} + ${b}) = ${a + b}`, `Multiply by half height: 0.5 × ${h} × ${a + b} = ${area.toFixed(2)}`]
      };
    },
    formula: 'Area = ((a + b) / 2) × h',
    explanation: 'A trapezoid is a quadrilateral with at least one pair of parallel sides.',
    howToUse: ['Enter bases a and b.', 'Enter perpendicular height h.', 'Click Calculate.'],
    example: { inputs: { a: 8, b: 14, h: 6 }, output: '66.00 sq units', explanation: '((8 + 14) / 2) × 6 = 11 × 6 = 66.' },
    faqs: [{ question: 'What is the median of a trapezoid?', answer: 'The line segment connecting the midpoints of the legs; its length is (a + b) / 2.' }],
    keywords: ['trapezoid calculator', 'trapezoid area', 'trapezium', 'quadrilateral']
  },
  {
    id: 'parallelogram-calculator',
    slug: 'parallelogram-calculator',
    title: 'Parallelogram Calculator',
    category: 'geometry',
    shortDesc: 'Compute parallelogram area and perimeter from base, height, and side.',
    icon: 'Layers',
    fields: [
      { id: 'base', label: 'Base (b)', type: 'number', defaultValue: 12, min: 0.01, step: 0.1 },
      { id: 'height', label: 'Height (h)', type: 'number', defaultValue: 7, min: 0.01, step: 0.1 },
      { id: 'side', label: 'Side length (a)', type: 'number', defaultValue: 9, min: 0.01, step: 0.1 }
    ],
    calculate: (inputs) => {
      const b = parseFloat(inputs.base) || 0;
      const h = parseFloat(inputs.height) || 0;
      const a = parseFloat(inputs.side) || 0;

      if (b <= 0 || h <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Base and height must be positive.' };

      const area = b * h;
      const perimeter = a > 0 ? 2 * (a + b) : 0;

      return {
        primaryValue: `${area.toFixed(2)} sq units`,
        primaryLabel: 'Parallelogram Area',
        subtext: perimeter > 0 ? `Perimeter: ${perimeter.toFixed(2)} units` : 'Area calculated',
        breakdown: [
          { label: 'Base (b)', value: b.toString() },
          { label: 'Height (h)', value: h.toString() },
          { label: 'Area (b × h)', value: area.toFixed(2) },
          { label: 'Perimeter (2(a + b))', value: perimeter > 0 ? perimeter.toFixed(2) : 'N/A' }
        ],
        steps: [`Multiply base by perpendicular height: ${b} × ${h} = ${area.toFixed(2)}`]
      };
    },
    formula: 'Area = base × height  |  Perimeter = 2(base + side)',
    explanation: 'A parallelogram is a quadrilateral with opposite sides parallel and equal in length.',
    howToUse: ['Enter base and height.', 'Optionally enter side length for perimeter.', 'Click Calculate.'],
    example: { inputs: { base: 12, height: 7, side: 9 }, output: '84.00 sq units', explanation: '12 × 7 = 84.' },
    faqs: [{ question: 'Is a rhombus a parallelogram?', answer: 'Yes, a rhombus is an equilateral parallelogram.' }],
    keywords: ['parallelogram calculator', 'parallelogram area', 'perimeter of parallelogram']
  },
  {
    id: 'polygon-calculator',
    slug: 'polygon-calculator',
    title: 'Regular Polygon Calculator',
    category: 'geometry',
    shortDesc: 'Calculate area, perimeter, and apothem of any regular n-sided polygon.',
    icon: 'Hexagon',
    fields: [
      { id: 'n', label: 'Number of sides (n)', type: 'number', defaultValue: 6, min: 3, max: 100, step: 1 },
      { id: 's', label: 'Side Length (s)', type: 'number', defaultValue: 8, min: 0.01, step: 0.1 }
    ],
    calculate: (inputs) => {
      const n = Math.abs(parseInt(inputs.n) || 3);
      const s = parseFloat(inputs.s) || 0;

      if (n < 3) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'A polygon must have at least 3 sides.' };
      if (s <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Side length must be greater than zero.' };

      const perimeter = n * s;
      const apothem = s / (2 * Math.tan(Math.PI / n));
      const area = (perimeter * apothem) / 2;
      const interiorAngle = ((n - 2) * 180) / n;

      return {
        primaryValue: `${area.toFixed(2)} sq units`,
        primaryLabel: `Regular ${n}-gon Area`,
        subtext: `Perimeter: ${perimeter.toFixed(2)} | Apothem: ${apothem.toFixed(2)}`,
        breakdown: [
          { label: 'Number of Sides (n)', value: n.toString() },
          { label: 'Side Length (s)', value: s.toString() },
          { label: 'Apothem (a)', value: apothem.toFixed(4) },
          { label: 'Perimeter', value: perimeter.toFixed(2) },
          { label: 'Interior Angle', value: `${interiorAngle.toFixed(2)}°` }
        ],
        steps: [
          `Compute apothem: a = s / (2 × tan(π/n)) = ${apothem.toFixed(4)}`,
          `Compute area: (Perimeter × Apothem) / 2 = ${area.toFixed(4)}`
        ]
      };
    },
    formula: 'Area = (n × s × a) / 2 where a = s / (2 tan(π / n))',
    explanation: 'A regular polygon is equiangular (all angles equal) and equilateral (all sides equal).',
    howToUse: ['Enter number of sides n.', 'Enter side length s.', 'Click Calculate.'],
    example: { inputs: { n: 6, s: 8 }, output: '166.28 sq units', explanation: 'A regular hexagon with side 8 has area ≈ 166.28.' },
    faqs: [{ question: 'What is an apothem?', answer: 'The line segment from the center to the midpoint of any side of a regular polygon.' }],
    keywords: ['polygon calculator', 'hexagon area', 'pentagon area', 'regular polygon', 'apothem']
  },
  {
    id: 'cube-calculator',
    slug: 'cube-calculator',
    title: 'Cube Calculator',
    category: 'geometry',
    shortDesc: 'Compute volume, total surface area, and space diagonal of a cube.',
    icon: 'Box',
    fields: [
      { id: 'side', label: 'Side Length (a)', type: 'number', defaultValue: 5, min: 0.01, step: 0.1 }
    ],
    calculate: (inputs) => {
      const a = parseFloat(inputs.side) || 0;
      if (a <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Side must be greater than zero.' };

      const volume = Math.pow(a, 3);
      const surfaceArea = 6 * a * a;
      const diagonal = a * Math.sqrt(3);

      return {
        primaryValue: `${volume.toFixed(2)} cubic units`,
        primaryLabel: 'Cube Volume',
        subtext: `Surface Area: ${surfaceArea.toFixed(2)} sq units`,
        breakdown: [
          { label: 'Side Length (a)', value: a.toString() },
          { label: 'Volume (a³)', value: volume.toFixed(2) },
          { label: 'Surface Area (6a²)', value: surfaceArea.toFixed(2) },
          { label: 'Space Diagonal (a√3)', value: diagonal.toFixed(4) }
        ],
        steps: [`Volume = ${a}³ = ${volume.toFixed(2)}`, `Surface Area = 6 × (${a})² = ${surfaceArea.toFixed(2)}`]
      };
    },
    formula: 'Volume = a³  |  Surface Area = 6a²  |  Space Diagonal = a√3',
    explanation: 'A cube is a three-dimensional solid object bounded by six square faces.',
    howToUse: ['Enter the edge length a.', 'Click Calculate.'],
    example: { inputs: { side: 5 }, output: '125.00 cubic units', explanation: 'Volume = 5³ = 125. Surface area = 6 × 25 = 150.' },
    faqs: [{ question: 'How many vertices does a cube have?', answer: 'A cube has 8 vertices, 12 edges, and 6 faces.' }],
    keywords: ['cube calculator', 'cube volume', 'cube surface area', 'space diagonal']
  },
  {
    id: 'cuboid-calculator',
    slug: 'cuboid-calculator',
    title: 'Cuboid Calculator',
    category: 'geometry',
    shortDesc: 'Compute volume and surface area of a rectangular prism / cuboid.',
    icon: 'Package',
    fields: [
      { id: 'length', label: 'Length (l)', type: 'number', defaultValue: 8, min: 0.01, step: 0.1 },
      { id: 'width', label: 'Width (w)', type: 'number', defaultValue: 5, min: 0.01, step: 0.1 },
      { id: 'height', label: 'Height (h)', type: 'number', defaultValue: 3, min: 0.01, step: 0.1 }
    ],
    calculate: (inputs) => {
      const l = parseFloat(inputs.length) || 0;
      const w = parseFloat(inputs.width) || 0;
      const h = parseFloat(inputs.height) || 0;

      if (l <= 0 || w <= 0 || h <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'All dimensions must be positive.' };

      const volume = l * w * h;
      const surfaceArea = 2 * (l * w + l * h + w * h);
      const diagonal = Math.sqrt(l * l + w * w + h * h);

      return {
        primaryValue: `${volume.toFixed(2)} cubic units`,
        primaryLabel: 'Cuboid Volume',
        subtext: `Surface Area: ${surfaceArea.toFixed(2)} sq units`,
        breakdown: [
          { label: 'Volume (l × w × h)', value: volume.toFixed(2) },
          { label: 'Surface Area', value: surfaceArea.toFixed(2) },
          { label: 'Space Diagonal', value: diagonal.toFixed(4) }
        ],
        steps: [`Volume = ${l} × ${w} × ${h} = ${volume.toFixed(2)}`, `Surface Area = 2(${l}×${w} + ${l}×${h} + ${w}×${h}) = ${surfaceArea.toFixed(2)}`]
      };
    },
    formula: 'V = l × w × h  |  SA = 2(lw + lh + wh)',
    explanation: 'A cuboid is a convex polyhedron bounded by six rectangular faces.',
    howToUse: ['Enter length, width, and height.', 'Click Calculate.'],
    example: { inputs: { length: 8, width: 5, height: 3 }, output: '120.00 cubic units', explanation: '8 × 5 × 3 = 120.' },
    faqs: [{ question: 'What is the difference between cuboid and rectangle?', answer: 'A rectangle is 2D, whereas a cuboid is 3D.' }],
    keywords: ['cuboid calculator', 'rectangular prism', 'box volume', 'surface area']
  },
  {
    id: 'sphere-calculator',
    slug: 'sphere-calculator',
    title: 'Sphere Calculator',
    category: 'geometry',
    shortDesc: 'Calculate sphere volume, surface area, and circumference from radius.',
    icon: 'Globe',
    fields: [
      { id: 'radius', label: 'Radius (r)', type: 'number', defaultValue: 6, min: 0.01, step: 0.1 }
    ],
    calculate: (inputs) => {
      const r = parseFloat(inputs.radius) || 0;
      if (r <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Radius must be greater than zero.' };

      const volume = (4 / 3) * Math.PI * Math.pow(r, 3);
      const surfaceArea = 4 * Math.PI * r * r;
      const circumference = 2 * Math.PI * r;

      return {
        primaryValue: `${volume.toFixed(2)} cubic units`,
        primaryLabel: 'Sphere Volume',
        subtext: `Surface Area: ${surfaceArea.toFixed(2)} sq units`,
        breakdown: [
          { label: 'Radius (r)', value: r.toString() },
          { label: 'Volume ((4/3)πr³)', value: volume.toFixed(4) },
          { label: 'Surface Area (4πr²)', value: surfaceArea.toFixed(4) },
          { label: 'Great Circle Circumference', value: circumference.toFixed(4) }
        ],
        steps: [`V = (4/3) × π × (${r})³ = ${volume.toFixed(4)}`, `SA = 4 × π × (${r})² = ${surfaceArea.toFixed(4)}`]
      };
    },
    formula: 'Volume = (4/3)πr³  |  Surface Area = 4πr²',
    explanation: 'A sphere is a perfectly round geometrical 3D object in space.',
    howToUse: ['Enter radius r.', 'Click Calculate.'],
    example: { inputs: { radius: 6 }, output: '904.78 cubic units', explanation: '(4/3) × π × 216 ≈ 904.78.' },
    faqs: [{ question: 'What is a hemisphere?', answer: 'A hemisphere is exactly half of a sphere.' }],
    keywords: ['sphere calculator', 'sphere volume', 'surface area of sphere', 'ball volume']
  },
  {
    id: 'cylinder-calculator',
    slug: 'cylinder-calculator',
    title: 'Cylinder Calculator',
    category: 'geometry',
    shortDesc: 'Compute cylinder volume, lateral area, and total surface area.',
    icon: 'Cylinder',
    fields: [
      { id: 'radius', label: 'Base Radius (r)', type: 'number', defaultValue: 4, min: 0.01, step: 0.1 },
      { id: 'height', label: 'Height (h)', type: 'number', defaultValue: 10, min: 0.01, step: 0.1 }
    ],
    calculate: (inputs) => {
      const r = parseFloat(inputs.radius) || 0;
      const h = parseFloat(inputs.height) || 0;
      if (r <= 0 || h <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Radius and height must be positive.' };

      const volume = Math.PI * r * r * h;
      const lateralArea = 2 * Math.PI * r * h;
      const baseArea = Math.PI * r * r;
      const totalSurfaceArea = lateralArea + 2 * baseArea;

      return {
        primaryValue: `${volume.toFixed(2)} cubic units`,
        primaryLabel: 'Cylinder Volume',
        subtext: `Total Surface Area: ${totalSurfaceArea.toFixed(2)} sq units`,
        breakdown: [
          { label: 'Volume (πr²h)', value: volume.toFixed(4) },
          { label: 'Lateral Area (2πrh)', value: lateralArea.toFixed(4) },
          { label: 'Base Area (πr²)', value: baseArea.toFixed(4) },
          { label: 'Total Surface Area', value: totalSurfaceArea.toFixed(4) }
        ],
        steps: [`Volume = π × (${r})² × ${h} = ${volume.toFixed(4)}`, `Lateral Area = 2 × π × ${r} × ${h} = ${lateralArea.toFixed(4)}`]
      };
    },
    formula: 'V = πr²h  |  Lateral SA = 2πrh  |  Total SA = 2πrh + 2πr²',
    explanation: 'A cylinder has two parallel circular bases of equal size and a curved surface.',
    howToUse: ['Enter base radius and height.', 'Click Calculate.'],
    example: { inputs: { radius: 4, height: 10 }, output: '502.65 cubic units', explanation: 'π × 16 × 10 ≈ 502.65.' },
    faqs: [{ question: 'How much water does a cylinder tank hold?', answer: '1 cubic meter = 1,000 liters. Convert volume to find tank capacity.' }],
    keywords: ['cylinder calculator', 'cylinder volume', 'cylinder surface area', 'tank capacity']
  },
  {
    id: 'cone-calculator',
    slug: 'cone-calculator',
    title: 'Cone Calculator',
    category: 'geometry',
    shortDesc: 'Compute cone volume, slant height, and surface area from radius and height.',
    icon: 'Cone',
    fields: [
      { id: 'radius', label: 'Base Radius (r)', type: 'number', defaultValue: 5, min: 0.01, step: 0.1 },
      { id: 'height', label: 'Height (h)', type: 'number', defaultValue: 12, min: 0.01, step: 0.1 }
    ],
    calculate: (inputs) => {
      const r = parseFloat(inputs.radius) || 0;
      const h = parseFloat(inputs.height) || 0;
      if (r <= 0 || h <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Radius and height must be positive.' };

      const slantHeight = Math.sqrt(r * r + h * h);
      const volume = (1 / 3) * Math.PI * r * r * h;
      const lateralArea = Math.PI * r * slantHeight;
      const totalArea = lateralArea + Math.PI * r * r;

      return {
        primaryValue: `${volume.toFixed(2)} cubic units`,
        primaryLabel: 'Cone Volume',
        subtext: `Slant Height: ${slantHeight.toFixed(2)} units`,
        breakdown: [
          { label: 'Volume ((1/3)πr²h)', value: volume.toFixed(4) },
          { label: 'Slant Height (s = √(r² + h²))', value: slantHeight.toFixed(4) },
          { label: 'Lateral Area (πrs)', value: lateralArea.toFixed(4) },
          { label: 'Total Surface Area', value: totalArea.toFixed(4) }
        ],
        steps: [
          `Calculate slant height: s = √(${r}² + ${h}²) = ${slantHeight.toFixed(4)}`,
          `Calculate volume: (1/3) × π × (${r})² × ${h} = ${volume.toFixed(4)}`
        ]
      };
    },
    formula: 'V = (1/3)πr²h  |  s = √(r² + h²)  |  Total SA = πr(r + s)',
    explanation: 'A cone tapers smoothly from a circular base to a point called the apex.',
    howToUse: ['Enter base radius and perpendicular height.', 'Click Calculate.'],
    example: { inputs: { radius: 5, height: 12 }, output: '314.16 cubic units', explanation: 'Slant height is 13. Volume = (1/3) × π × 25 × 12 = 100π ≈ 314.16.' },
    faqs: [{ question: 'What is slant height?', answer: 'The distance from any point on the circle edge directly to the cone apex along the surface.' }],
    keywords: ['cone calculator', 'cone volume', 'slant height', 'cone surface area']
  },
  {
    id: 'pyramid-calculator',
    slug: 'pyramid-calculator',
    title: 'Pyramid Calculator',
    category: 'geometry',
    shortDesc: 'Calculate right rectangular pyramid volume and surface area.',
    icon: 'Layers',
    fields: [
      { id: 'length', label: 'Base Length (l)', type: 'number', defaultValue: 10, min: 0.01, step: 0.1 },
      { id: 'width', label: 'Base Width (w)', type: 'number', defaultValue: 10, min: 0.01, step: 0.1 },
      { id: 'height', label: 'Height (h)', type: 'number', defaultValue: 12, min: 0.01, step: 0.1 }
    ],
    calculate: (inputs) => {
      const l = parseFloat(inputs.length) || 0;
      const w = parseFloat(inputs.width) || 0;
      const h = parseFloat(inputs.height) || 0;

      if (l <= 0 || w <= 0 || h <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'All dimensions must be positive.' };

      const baseArea = l * w;
      const volume = (baseArea * h) / 3;

      const slantL = Math.sqrt(Math.pow(w / 2, 2) + h * h);
      const slantW = Math.sqrt(Math.pow(l / 2, 2) + h * h);
      const lateralArea = l * slantL + w * slantW;
      const totalArea = baseArea + lateralArea;

      return {
        primaryValue: `${volume.toFixed(2)} cubic units`,
        primaryLabel: 'Pyramid Volume',
        subtext: `Total Surface Area: ${totalArea.toFixed(2)} sq units`,
        breakdown: [
          { label: 'Base Area (l × w)', value: baseArea.toFixed(2) },
          { label: 'Volume ((Base × h) / 3)', value: volume.toFixed(4) },
          { label: 'Lateral Surface Area', value: lateralArea.toFixed(4) },
          { label: 'Total Surface Area', value: totalArea.toFixed(4) }
        ],
        steps: [`Base Area = ${l} × ${w} = ${baseArea}`, `Volume = (${baseArea} × ${h}) / 3 = ${volume.toFixed(2)}`]
      };
    },
    formula: 'V = (Base Area × h) / 3',
    explanation: 'A pyramid is a polyhedron formed by connecting a polygonal base and a point called the apex.',
    howToUse: ['Enter base dimensions and height.', 'Click Calculate.'],
    example: { inputs: { length: 10, width: 10, height: 12 }, output: '400.00 cubic units', explanation: '(100 × 12) / 3 = 400.' },
    faqs: [{ question: 'What is a square pyramid?', answer: 'A pyramid whose base is a square, like the Great Pyramid of Giza.' }],
    keywords: ['pyramid calculator', 'pyramid volume', 'pyramid surface area']
  }
];

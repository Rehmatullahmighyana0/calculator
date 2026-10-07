const { toNum, formatNum } = require('./utils.cjs');

const engines = {
  'area-calculator': (inputs) => {
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

  'perimeter-calculator': (inputs) => {
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

  'circle-calculator': (inputs) => {
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

  'triangle-calculator': (inputs) => {
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

  'rectangle-calculator': (inputs) => {
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

  'square-calculator': (inputs) => {
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

  'trapezoid-calculator': (inputs) => {
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

  'parallelogram-calculator': (inputs) => {
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

  'polygon-calculator': (inputs) => {
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

  'cube-calculator': (inputs) => {
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

  'cuboid-calculator': (inputs) => {
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

  'sphere-calculator': (inputs) => {
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

  'cylinder-calculator': (inputs) => {
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

  'cone-calculator': (inputs) => {
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

  'pyramid-calculator': (inputs) => {
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
  }
};

module.exports = engines;


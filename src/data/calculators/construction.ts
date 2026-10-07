import { CalculatorDef } from '../../types/calculator';

export const constructionCalculators: CalculatorDef[] = [
  {
    id: 'concrete-calculator',
    slug: 'concrete-calculator',
    title: 'Concrete Slab & Footing Calculator',
    category: 'construction',
    shortDesc: 'Compute cubic yards or meters of concrete and count 60lb/80lb bags needed.',
    icon: 'Hammer',
    badge: 'popular',
    fields: [
      { id: 'lengthFt', label: 'Slab Length (Feet)', type: 'number', defaultValue: 20, min: 0.1, step: 0.5 },
      { id: 'widthFt', label: 'Slab Width (Feet)', type: 'number', defaultValue: 10, min: 0.1, step: 0.5 },
      { id: 'thicknessIn', label: 'Thickness (Inches)', type: 'number', defaultValue: 4, min: 1, step: 0.5 },
      { id: 'wastePct', label: 'Waste Allowance (%)', type: 'number', defaultValue: 10, min: 0, max: 30, step: 1 }
    ],
    calculate: (inputs) => {
      const l = parseFloat(inputs.lengthFt) || 0;
      const w = parseFloat(inputs.widthFt) || 0;
      const tIn = parseFloat(inputs.thicknessIn) || 4;
      const waste = (parseFloat(inputs.wastePct) || 0) / 100;

      const tFt = tIn / 12;
      const volumeCuFt = l * w * tFt * (1 + waste);
      const volumeCuYds = volumeCuFt / 27;
      const volumeCuM = volumeCuFt * 0.0283168;

      // 60lb bag yields ~0.45 cu ft; 80lb bag yields ~0.60 cu ft
      const bags60 = Math.ceil(volumeCuFt / 0.45);
      const bags80 = Math.ceil(volumeCuFt / 0.6);

      return {
        primaryValue: `${volumeCuYds.toFixed(2)} Cubic Yards`,
        primaryLabel: 'Concrete Volume Required',
        subtext: `Or ${bags80} bags (80 lb) / ${bags60} bags (60 lb) with ${inputs.wastePct}% waste`,
        breakdown: [
          { label: 'Surface Area', value: `${(l * w).toFixed(1)} sq ft` },
          { label: 'Cubic Feet', value: `${volumeCuFt.toFixed(1)} cu ft` },
          { label: 'Cubic Yards', value: `${volumeCuYds.toFixed(2)} yd³` },
          { label: 'Cubic Meters', value: `${volumeCuM.toFixed(2)} m³` },
          { label: '80-lb Pre-Mix Bags', value: `${bags80} bags` },
          { label: '60-lb Pre-Mix Bags', value: `${bags60} bags` }
        ],
        steps: [
          `Convert thickness to feet: ${tIn} in / 12 = ${tFt.toFixed(3)} ft`,
          `Calculate volume: ${l} × ${w} × ${tFt.toFixed(3)} = ${(l * w * tFt).toFixed(2)} cu ft`,
          `Add ${inputs.wastePct}% waste margin = ${volumeCuFt.toFixed(2)} cu ft (${volumeCuYds.toFixed(2)} yd³)`
        ]
      };
    },
    formula: 'Cubic Yards = (Length ft × Width ft × (Thickness in / 12)) / 27 × (1 + Waste)',
    explanation: 'Estimates ready-mix concrete volume or bagged pre-mix bags required for driveways, patios, and slabs.',
    howToUse: ['Enter slab dimensions in feet and thickness in inches.', 'Set waste buffer (10% recommended).', 'Click Calculate.'],
    example: { inputs: { lengthFt: 20, widthFt: 10, thicknessIn: 4, wastePct: 10 }, output: '2.72 Cubic Yards', explanation: 'A 20x10 ft slab at 4" thickness requires ~2.7 cu yds (123 eighty-pound bags).' },
    faqs: [{ question: 'Why add a 10% waste buffer?', answer: 'Excavation unevenness, spillage, and form deflection typically consume 5-10% extra concrete.' }],
    keywords: ['concrete calculator', 'cement bags', 'slab volume', 'cubic yards of concrete']
  },
  {
    id: 'brick-calculator',
    slug: 'brick-calculator',
    title: 'Brick Wall Calculator',
    category: 'construction',
    shortDesc: 'Calculate total standard bricks and mortar bags needed for a wall.',
    icon: 'Grid',
    fields: [
      { id: 'wallLength', label: 'Wall Length (Feet)', type: 'number', defaultValue: 30, min: 1, step: 1 },
      { id: 'wallHeight', label: 'Wall Height (Feet)', type: 'number', defaultValue: 8, min: 1, step: 0.5 },
      {
        id: 'brickType',
        label: 'Brick Course Type',
        type: 'select',
        defaultValue: 'single',
        options: [
          { label: 'Single Wythe (Standard 7 bricks / sq ft)', value: 'single' },
          { label: 'Double Wythe (Double wall 14 bricks / sq ft)', value: 'double' }
        ]
      },
      { id: 'waste', label: 'Waste Factor (%)', type: 'number', defaultValue: 10, min: 0, max: 25, step: 1 }
    ],
    calculate: (inputs) => {
      const l = parseFloat(inputs.wallLength) || 0;
      const h = parseFloat(inputs.wallHeight) || 0;
      const isDouble = inputs.brickType === 'double';
      const waste = (parseFloat(inputs.waste) || 10) / 100;

      const area = l * h;
      const bricksPerSqFt = isDouble ? 14 : 7;
      const rawBricks = area * bricksPerSqFt;
      const totalBricks = Math.ceil(rawBricks * (1 + waste));
      const mortarBags = Math.ceil((totalBricks / 1000) * 8.5); // ~8.5 bags 80lb mortar per 1,000 bricks

      return {
        primaryValue: `${totalBricks.toLocaleString()} Bricks`,
        primaryLabel: 'Total Bricks Required',
        subtext: `Wall Area: ${area.toFixed(0)} sq ft (${mortarBags} bags of mortar)`,
        breakdown: [
          { label: 'Wall Area', value: `${area.toFixed(1)} sq ft` },
          { label: 'Brick Multiplier', value: `${bricksPerSqFt} bricks/sq ft` },
          { label: 'Bricks (Without Waste)', value: `${Math.round(rawBricks).toLocaleString()}` },
          { label: 'Bricks (With Waste)', value: `${totalBricks.toLocaleString()}` },
          { label: 'Mortar Bags (80 lb)', value: `${mortarBags} bags` }
        ],
        steps: [`Wall Area = ${l} × ${h} = ${area} sq ft`, `Multiplied by standard brick density: ${area} × ${bricksPerSqFt} = ${rawBricks}`, `Added ${inputs.waste}% waste = ${totalBricks} bricks`]
      };
    },
    formula: 'Bricks = Length × Height × Bricks_per_sqft × (1 + Waste)',
    explanation: 'Estimates standard modular brick counts for single or double masonry walls.',
    howToUse: ['Enter wall length and height.', 'Select single or double wythe.', 'Click Calculate.'],
    example: { inputs: { wallLength: 30, wallHeight: 8, brickType: 'single', waste: 10 }, output: '1,848 Bricks', explanation: '240 sq ft × 7 bricks/sq ft + 10% waste = 1,848 bricks.' },
    faqs: [{ question: 'What is a wythe?', answer: 'A continuous vertical section of masonry one unit in thickness.' }],
    keywords: ['brick calculator', 'masonry estimator', 'how many bricks', 'mortar bags']
  },
  {
    id: 'cement-calculator',
    slug: 'cement-calculator',
    title: 'Cement, Sand & Gravel Mix Calculator',
    category: 'construction',
    shortDesc: 'Compute component quantities for 1:2:4 standard concrete mix proportions.',
    icon: 'Layers',
    fields: [
      { id: 'volumeCuM', label: 'Desired Concrete Volume (m³)', type: 'number', defaultValue: 2, min: 0.1, step: 0.25 }
    ],
    calculate: (inputs) => {
      const vol = parseFloat(inputs.volumeCuM) || 1;
      // Dry volume factor ~1.54
      const dryVol = vol * 1.54;
      // Ratio 1:2:4 (Sum = 7)
      const cementCuM = (1 / 7) * dryVol;
      const sandCuM = (2 / 7) * dryVol;
      const gravelCuM = (4 / 7) * dryVol;

      // Density of cement = 1440 kg/m³, 50kg per bag
      const cementKg = cementCuM * 1440;
      const cementBags50kg = Math.ceil(cementKg / 50);

      // Sand density ~1600 kg/m³, Gravel ~1500 kg/m³
      const sandTons = (sandCuM * 1600) / 1000;
      const gravelTons = (gravelCuM * 1500) / 1000;

      return {
        primaryValue: `${cementBags50kg} Bags of Cement (50kg)`,
        primaryLabel: 'Cement Requirement (1:2:4 Mix)',
        subtext: `Sand: ${sandTons.toFixed(2)} tons | Gravel: ${gravelTons.toFixed(2)} tons`,
        breakdown: [
          { label: 'Wet Volume', value: `${vol} m³` },
          { label: 'Dry Volume (1.54x)', value: `${dryVol.toFixed(2)} m³` },
          { label: 'Cement Bags (50kg)', value: `${cementBags50kg} bags (${Math.round(cementKg)} kg)` },
          { label: 'Sand Needed', value: `${sandTons.toFixed(2)} metric tons (${sandCuM.toFixed(2)} m³)` },
          { label: 'Gravel / Aggregate Needed', value: `${gravelTons.toFixed(2)} metric tons (${gravelCuM.toFixed(2)} m³)` }
        ],
        steps: [`Multiply wet volume by 1.54 dry factor: ${vol} × 1.54 = ${dryVol.toFixed(2)} m³`, `Decompose ratio 1:2:4 across cement, sand, and stone`]
      };
    },
    formula: 'Dry Volume = Wet Volume × 1.54  |  Cement = (1/7) × Dry Vol × 1440 kg/m³',
    explanation: 'Calculates the raw batch components for standard M15 grade structural concrete mix.',
    howToUse: ['Enter total concrete volume in cubic meters.', 'Click Calculate to view cement, sand, and gravel quantities.'],
    example: { inputs: { volumeCuM: 2 }, output: '13 Bags of Cement (50kg)', explanation: '2 m³ concrete requires 13 bags of cement, 1.41 tons of sand, and 2.64 tons of gravel.' },
    faqs: [{ question: 'What is a 1:2:4 mix?', answer: '1 part cement, 2 parts sand, and 4 parts coarse aggregate by volume.' }],
    keywords: ['cement calculator', 'concrete mix ratio', 'sand and gravel mix', '50kg cement bags']
  },
  {
    id: 'sand-calculator',
    slug: 'sand-calculator',
    title: 'Sand Volume & Weight Calculator',
    category: 'construction',
    shortDesc: 'Compute cubic yards and tons of sand needed for paving, landscaping, or masonry.',
    icon: 'CircleDot',
    fields: [
      { id: 'length', label: 'Area Length (Feet)', type: 'number', defaultValue: 20, min: 1, step: 1 },
      { id: 'width', label: 'Area Width (Feet)', type: 'number', defaultValue: 15, min: 1, step: 1 },
      { id: 'depthIn', label: 'Depth (Inches)', type: 'number', defaultValue: 2, min: 0.5, step: 0.5 }
    ],
    calculate: (inputs) => {
      const l = parseFloat(inputs.length) || 0;
      const w = parseFloat(inputs.width) || 0;
      const d = (parseFloat(inputs.depthIn) || 1) / 12;

      const cuFt = l * w * d;
      const cuYds = cuFt / 27;
      // Average dry sand density ~2,700 lbs per cu yd (~1.35 tons)
      const tons = cuYds * 1.35;

      return {
        primaryValue: `${tons.toFixed(2)} Tons of Sand`,
        primaryLabel: 'Total Sand Weight',
        subtext: `Volume: ${cuYds.toFixed(2)} cubic yards (${cuFt.toFixed(1)} cu ft)`,
        breakdown: [
          { label: 'Surface Area', value: `${l * w} sq ft` },
          { label: 'Cubic Yards', value: `${cuYds.toFixed(2)} yd³` },
          { label: 'Cubic Feet', value: `${cuFt.toFixed(1)} ft³` },
          { label: 'Estimated Tons', value: `${tons.toFixed(2)} tons` },
          { label: '50-lb Sand Bags', value: `${Math.ceil(cuFt * 100 / 50)} bags` }
        ],
        steps: [`Multiply Area (${l * w} sq ft) by depth (${inputs.depthIn}/12 ft) = ${cuFt.toFixed(1)} cu ft`, `Convert to tons: ${cuYds.toFixed(2)} yd³ × 1.35 = ${tons.toFixed(2)} tons`]
      };
    },
    formula: 'Tons = (Length ft × Width ft × Depth ft / 27) × 1.35 tons/yd³',
    explanation: 'Estimates sand requirements for pavers, sandboxes, and construction bases.',
    howToUse: ['Enter length, width, and depth in inches.', 'Click Calculate.'],
    example: { inputs: { length: 20, width: 15, depthIn: 2 }, output: '2.50 Tons of Sand', explanation: 'A 20x15 ft area at 2 inches depth requires 1.85 cubic yards (~2.5 tons).' },
    faqs: [{ question: 'How much does a cubic yard of sand weigh?', answer: 'Dry sand typically weighs approximately 2,600 to 2,800 pounds (1.3 to 1.4 tons).' }],
    keywords: ['sand calculator', 'paver sand', 'cubic yards of sand', 'tons of sand']
  },
  {
    id: 'tile-calculator',
    slug: 'tile-calculator',
    title: 'Tile Calculator',
    category: 'construction',
    shortDesc: 'Compute total floor or wall tiles and boxes required including cut waste.',
    icon: 'Grid',
    badge: 'popular',
    fields: [
      { id: 'roomLength', label: 'Room Length (Feet)', type: 'number', defaultValue: 12, min: 1, step: 0.5 },
      { id: 'roomWidth', label: 'Room Width (Feet)', type: 'number', defaultValue: 10, min: 1, step: 0.5 },
      { id: 'tileLengthIn', label: 'Tile Length (Inches)', type: 'number', defaultValue: 12, min: 1, step: 1 },
      { id: 'tileWidthIn', label: 'Tile Width (Inches)', type: 'number', defaultValue: 12, min: 1, step: 1 },
      { id: 'wastePct', label: 'Waste Buffer (%)', type: 'number', defaultValue: 10, min: 5, max: 25, step: 1 }
    ],
    calculate: (inputs) => {
      const rL = parseFloat(inputs.roomLength) || 0;
      const rW = parseFloat(inputs.roomWidth) || 0;
      const tL = parseFloat(inputs.tileLengthIn) || 12;
      const tW = parseFloat(inputs.tileWidthIn) || 12;
      const waste = (parseFloat(inputs.wastePct) || 10) / 100;

      const roomSqFt = rL * rW;
      const tileSqFt = (tL * tW) / 144;
      const rawTiles = roomSqFt / tileSqFt;
      const totalTiles = Math.ceil(rawTiles * (1 + waste));
      const totalSqFtWithWaste = roomSqFt * (1 + waste);

      return {
        primaryValue: `${totalTiles} Tiles`,
        primaryLabel: 'Total Tiles Needed',
        subtext: `Total Coverage: ${totalSqFtWithWaste.toFixed(1)} sq ft (Room: ${roomSqFt.toFixed(1)} sq ft)`,
        breakdown: [
          { label: 'Room Floor Area', value: `${roomSqFt.toFixed(1)} sq ft` },
          { label: 'Single Tile Area', value: `${tileSqFt.toFixed(2)} sq ft` },
          { label: 'Exact Tiles (No Waste)', value: Math.ceil(rawTiles).toString() },
          { label: 'Total with Waste Margin', value: totalTiles.toString() },
          { label: 'Estimated Boxes (10 tiles/box)', value: `${Math.ceil(totalTiles / 10)} boxes` }
        ],
        steps: [`Calculate area: ${rL} × ${rW} = ${roomSqFt} sq ft`, `Divide by tile area: ${roomSqFt} / ${tileSqFt.toFixed(2)} = ${Math.ceil(rawTiles)} tiles`, `Add ${inputs.wastePct}% waste = ${totalTiles} tiles`]
      };
    },
    formula: 'Total Tiles = (Room Sq Ft / Tile Sq Ft) × (1 + Waste Factor)',
    explanation: 'Estimates tile counts for bathroom, kitchen, or patio installations.',
    howToUse: ['Enter room dimensions in feet.', 'Enter individual tile size in inches.', 'Set cutting waste (10-15%).', 'Click Calculate.'],
    example: { inputs: { roomLength: 12, roomWidth: 10, tileLengthIn: 12, tileWidthIn: 12, wastePct: 10 }, output: '132 Tiles', explanation: '120 sq ft room with 12"x12" tiles + 10% waste requires 132 tiles.' },
    faqs: [{ question: 'Why is tile waste higher for diagonal patterns?', answer: 'Diagonal patterns create triangular edge cuts requiring 15% to 20% waste buffer.' }],
    keywords: ['tile calculator', 'flooring tiles', 'bathroom tile estimator', 'ceramic tile']
  },
  {
    id: 'flooring-calculator',
    slug: 'flooring-calculator',
    title: 'Flooring Calculator (Hardwood / Laminate)',
    category: 'construction',
    shortDesc: 'Compute square footage and number of flooring boxes required.',
    icon: 'Layers',
    fields: [
      { id: 'length', label: 'Room Length (Feet)', type: 'number', defaultValue: 18, min: 1, step: 0.5 },
      { id: 'width', label: 'Room Width (Feet)', type: 'number', defaultValue: 14, min: 1, step: 0.5 },
      { id: 'sqftPerBox', label: 'Coverage per Box (Sq Ft)', type: 'number', defaultValue: 24, min: 5, step: 1 },
      { id: 'wastePct', label: 'Wastage Margin (%)', type: 'number', defaultValue: 10, min: 0, step: 1 }
    ],
    calculate: (inputs) => {
      const l = parseFloat(inputs.length) || 0;
      const w = parseFloat(inputs.width) || 0;
      const boxCoverage = parseFloat(inputs.sqftPerBox) || 20;
      const waste = (parseFloat(inputs.wastePct) || 10) / 100;

      const roomSqFt = l * w;
      const totalSqFt = roomSqFt * (1 + waste);
      const boxes = Math.ceil(totalSqFt / boxCoverage);

      return {
        primaryValue: `${boxes} Boxes (${totalSqFt.toFixed(1)} sq ft)`,
        primaryLabel: 'Flooring Boxes Required',
        subtext: `Room Area: ${roomSqFt.toFixed(1)} sq ft + ${inputs.wastePct}% waste`,
        breakdown: [
          { label: 'Room Area', value: `${roomSqFt.toFixed(1)} sq ft` },
          { label: 'Total Ordered Area', value: `${totalSqFt.toFixed(1)} sq ft` },
          { label: 'Coverage per Box', value: `${boxCoverage} sq ft` },
          { label: 'Boxes to Purchase', value: `${boxes} boxes` }
        ],
        steps: [`Room area = ${l} × ${w} = ${roomSqFt} sq ft`, `Add waste: ${roomSqFt} × 1.${inputs.wastePct} = ${totalSqFt.toFixed(1)} sq ft`, `Boxes = ceil(${totalSqFt.toFixed(1)} / ${boxCoverage}) = ${boxes}`]
      };
    },
    formula: 'Boxes = ceil((Room Length × Width × (1 + Waste)) / Box Coverage)',
    explanation: 'Estimates hardwood, laminate, vinyl plank (LVP), and bamboo flooring material.',
    howToUse: ['Enter room dimensions.', 'Enter box square footage.', 'Click Calculate.'],
    example: { inputs: { length: 18, width: 14, sqftPerBox: 24, wastePct: 10 }, output: '12 Boxes (277.2 sq ft)', explanation: '252 sq ft + 10% waste is 277.2 sq ft, requiring 12 boxes of 24 sq ft each.' },
    faqs: [{ question: 'What is LVP flooring?', answer: 'Luxury Vinyl Plank, a durable, waterproof flooring material.' }],
    keywords: ['flooring calculator', 'hardwood calculator', 'laminate flooring', 'lvp flooring']
  },
  {
    id: 'paint-calculator',
    slug: 'paint-calculator',
    title: 'Paint Calculator',
    category: 'construction',
    shortDesc: 'Calculate gallons or liters of wall paint required for any room.',
    icon: 'Paintbrush',
    badge: 'popular',
    fields: [
      { id: 'length', label: 'Room Length (Feet)', type: 'number', defaultValue: 16, min: 1, step: 0.5 },
      { id: 'width', label: 'Room Width (Feet)', type: 'number', defaultValue: 12, min: 1, step: 0.5 },
      { id: 'height', label: 'Ceiling Height (Feet)', type: 'number', defaultValue: 9, min: 6, step: 0.5 },
      { id: 'doors', label: 'Number of Doors', type: 'number', defaultValue: 2, min: 0, step: 1 },
      { id: 'windows', label: 'Number of Windows', type: 'number', defaultValue: 2, min: 0, step: 1 },
      { id: 'coats', label: 'Number of Coats', type: 'number', defaultValue: 2, min: 1, max: 4, step: 1 }
    ],
    calculate: (inputs) => {
      const l = parseFloat(inputs.length) || 0;
      const w = parseFloat(inputs.width) || 0;
      const h = parseFloat(inputs.height) || 8;
      const doors = parseInt(inputs.doors) || 0;
      const windows = parseInt(inputs.windows) || 0;
      const coats = parseInt(inputs.coats) || 2;

      // Perimeter × height
      const grossWallArea = 2 * (l + w) * h;
      // Deduct ~21 sq ft per door, ~15 sq ft per window
      const deductions = doors * 21 + windows * 15;
      const netWallArea = Math.max(0, grossWallArea - deductions);
      const totalPaintedArea = netWallArea * coats;

      // 1 gallon covers approx 350 sq ft
      const gallons = totalPaintedArea / 350;
      const liters = gallons * 3.78541;

      return {
        primaryValue: `${Math.ceil(gallons)} Gallons (${liters.toFixed(1)} L)`,
        primaryLabel: `Paint Required (${coats} Coats)`,
        subtext: `Total Surface: ${totalPaintedArea.toFixed(0)} sq ft (Net Wall: ${netWallArea.toFixed(0)} sq ft)`,
        breakdown: [
          { label: 'Gross Wall Area', value: `${grossWallArea.toFixed(0)} sq ft` },
          { label: 'Deductions (Doors & Windows)', value: `-${deductions} sq ft` },
          { label: 'Net Wall Area per Coat', value: `${netWallArea.toFixed(0)} sq ft` },
          { label: 'Total Painted Surface Area', value: `${totalPaintedArea.toFixed(0)} sq ft` },
          { label: 'Gallons to Purchase', value: `${Math.ceil(gallons)} gallons` }
        ],
        steps: [
          `Perimeter = 2 × (${l} + ${w}) = ${2 * (l + w)} ft`,
          `Gross wall area = ${2 * (l + w)} × ${h} = ${grossWallArea} sq ft`,
          `Net area after doors & windows = ${netWallArea} sq ft`,
          `Multiplied by ${coats} coats / 350 sq ft per gal = ${gallons.toFixed(2)} gal`
        ]
      };
    },
    formula: 'Gallons = ((2(L + W) × H - Doors×21 - Windows×15) × Coats) / 350',
    explanation: 'Estimates interior or exterior paint gallons needed assuming typical 350 sq ft per gallon coverage.',
    howToUse: ['Enter room dimensions.', 'Enter counts of doors and windows.', 'Choose 1 or 2 coats.', 'Click Calculate.'],
    example: { inputs: { length: 16, width: 12, height: 9, doors: 2, windows: 2, coats: 2 }, output: '3 Gallons (10.1 L)', explanation: '432 sq ft net wall area × 2 coats = 864 sq ft, requiring 3 gallons.' },
    faqs: [{ question: 'How much does 1 gallon of paint cover?', answer: 'One gallon covers approximately 350 to 400 square feet on primed, smooth walls.' }],
    keywords: ['paint calculator', 'gallons of paint', 'wall paint estimator', 'interior paint']
  },
  {
    id: 'roofing-calculator',
    slug: 'roofing-calculator',
    title: 'Roofing Shingles Calculator',
    category: 'construction',
    shortDesc: 'Compute roof pitch multiplier, roof squares, and bundles of shingles needed.',
    icon: 'Home',
    fields: [
      { id: 'houseLength', label: 'Base Building Length (Feet)', type: 'number', defaultValue: 40, min: 1, step: 1 },
      { id: 'houseWidth', label: 'Base Building Width (Feet)', type: 'number', defaultValue: 30, min: 1, step: 1 },
      {
        id: 'pitch',
        label: 'Roof Pitch (Rise/12)',
        type: 'select',
        defaultValue: '6',
        options: [
          { label: 'Flat (0/12) [× 1.00]', value: '0' },
          { label: 'Low Pitch (4/12) [× 1.054]', value: '4' },
          { label: 'Medium Pitch (6/12) [× 1.118]', value: '6' },
          { label: 'Standard Pitch (8/12) [× 1.202]', value: '8' },
          { label: 'Steep Pitch (10/12) [× 1.302]', value: '10' },
          { label: 'Mansard (12/12) [× 1.414]', value: '12' }
        ]
      },
      { id: 'wastePct', label: 'Waste Buffer (%)', type: 'number', defaultValue: 10, min: 5, max: 25, step: 1 }
    ],
    calculate: (inputs) => {
      const l = parseFloat(inputs.houseLength) || 0;
      const w = parseFloat(inputs.houseWidth) || 0;
      const pitchRise = parseFloat(inputs.pitch) || 6;
      const waste = (parseFloat(inputs.wastePct) || 10) / 100;

      // Pitch multiplier = sqrt(1 + (rise/12)^2)
      const pitchMultiplier = Math.sqrt(1 + Math.pow(pitchRise / 12, 2));
      const flatArea = l * w;
      const actualRoofArea = flatArea * pitchMultiplier * (1 + waste);

      // 1 roofing square = 100 sq ft; 3 bundles per square
      const squares = actualRoofArea / 100;
      const bundles = Math.ceil(squares * 3);

      return {
        primaryValue: `${squares.toFixed(1)} Squares (${bundles} Bundles)`,
        primaryLabel: 'Total Roofing Shingles',
        subtext: `Actual Roof Area: ${actualRoofArea.toFixed(0)} sq ft (Pitch Multiplier: ${pitchMultiplier.toFixed(3)})`,
        breakdown: [
          { label: 'Footprint Area', value: `${flatArea.toFixed(0)} sq ft` },
          { label: 'Pitch Slope Multiplier', value: `${pitchMultiplier.toFixed(3)}x` },
          { label: 'Roofing Squares (100 sq ft)', value: `${squares.toFixed(2)} squares` },
          { label: 'Shingle Bundles (3/sq)', value: `${bundles} bundles` }
        ],
        steps: [`Calculated slope factor: √(1 + (${pitchRise}/12)²) = ${pitchMultiplier.toFixed(3)}`, `Actual Roof Area = ${flatArea} × ${pitchMultiplier.toFixed(3)} = ${actualRoofArea.toFixed(0)} sq ft`]
      };
    },
    formula: 'Squares = (Footprint Area × Pitch Multiplier × (1 + Waste)) / 100',
    explanation: 'Converts base home footprint and pitch angle into actual surface area and roofing squares.',
    howToUse: ['Enter building base length and width.', 'Select roof pitch slope.', 'Click Calculate.'],
    example: { inputs: { houseLength: 40, houseWidth: 30, pitch: '6', wastePct: 10 }, output: '14.8 Squares (45 Bundles)', explanation: '1,200 sq ft footprint × 1.118 pitch factor + 10% waste = ~14.8 squares.' },
    faqs: [{ question: 'What is a roofing square?', answer: 'In the construction industry, one "square" of roofing equals exactly 100 square feet.' }],
    keywords: ['roofing calculator', 'roof squares', 'shingle bundles', 'roof pitch multiplier']
  },
  {
    id: 'wall-area-calculator',
    slug: 'wall-area-calculator',
    title: 'Wall Area Calculator',
    category: 'construction',
    shortDesc: 'Compute total wall surface area deducting windows and doorways.',
    icon: 'Maximize',
    fields: [
      { id: 'length', label: 'Room Length (Feet)', type: 'number', defaultValue: 15, min: 1, step: 0.5 },
      { id: 'width', label: 'Room Width (Feet)', type: 'number', defaultValue: 12, min: 1, step: 0.5 },
      { id: 'height', label: 'Wall Height (Feet)', type: 'number', defaultValue: 9, min: 6, step: 0.5 },
      { id: 'deductions', label: 'Total Deductions (Doors/Windows in Sq Ft)', type: 'number', defaultValue: 50, min: 0, step: 5 }
    ],
    calculate: (inputs) => {
      const l = parseFloat(inputs.length) || 0;
      const w = parseFloat(inputs.width) || 0;
      const h = parseFloat(inputs.height) || 0;
      const ded = parseFloat(inputs.deductions) || 0;

      const perimeter = 2 * (l + w);
      const grossArea = perimeter * h;
      const netArea = Math.max(0, grossArea - ded);

      return {
        primaryValue: `${netArea.toFixed(1)} sq ft`,
        primaryLabel: 'Net Wall Surface Area',
        subtext: `Gross: ${grossArea.toFixed(1)} sq ft - ${ded} sq ft deductions`,
        breakdown: [
          { label: 'Room Perimeter', value: `${perimeter.toFixed(1)} ft` },
          { label: 'Wall Height', value: `${h} ft` },
          { label: 'Gross Wall Area', value: `${grossArea.toFixed(1)} sq ft` },
          { label: 'Deductions Area', value: `${ded} sq ft` },
          { label: 'Net Wall Area', value: `${netArea.toFixed(1)} sq ft` }
        ],
        steps: [`Perimeter = 2 × (${l} + ${w}) = ${perimeter} ft`, `Gross = ${perimeter} × ${h} = ${grossArea} sq ft`, `Net = ${grossArea} - ${ded} = ${netArea} sq ft`]
      };
    },
    formula: 'Net Area = (2 × (Length + Width) × Height) - Deductions',
    explanation: 'Finds true net square footage for drywall, wallpaper, or plaster installation.',
    howToUse: ['Enter room dimensions.', 'Enter square feet of windows and doors to subtract.', 'Click Calculate.'],
    example: { inputs: { length: 15, width: 12, height: 9, deductions: 50 }, output: '436.0 sq ft', explanation: '2(27) × 9 = 486 sq ft gross - 50 sq ft = 436 net sq ft.' },
    faqs: [{ question: 'How big is a standard drywall sheet?', answer: 'A standard 4x8 drywall sheet covers 32 square feet.' }],
    keywords: ['wall area calculator', 'drywall estimator', 'square feet of walls']
  },
  {
    id: 'stair-calculator',
    slug: 'stair-calculator',
    title: 'Stair Calculator',
    category: 'construction',
    shortDesc: 'Compute number of risers, tread depth, stair run, stringer length, and incline angle.',
    icon: 'TrendingUp',
    fields: [
      { id: 'totalRiseIn', label: 'Total Rise / Height (Inches)', type: 'number', defaultValue: 108, min: 12, step: 0.5 },
      { id: 'targetRiserIn', label: 'Target Riser Height (Inches)', type: 'number', defaultValue: 7.5, min: 5, max: 9, step: 0.25 }
    ],
    calculate: (inputs) => {
      const totalRise = parseFloat(inputs.totalRiseIn) || 0;
      const targetRiser = parseFloat(inputs.targetRiserIn) || 7.5;

      const numRisers = Math.round(totalRise / targetRiser);
      const exactRiser = totalRise / numRisers;
      const numTreads = numRisers - 1;
      const treadDepth = 10; // Standard IBC 10" tread
      const totalRun = numTreads * treadDepth;

      // Stringer length using Pythagorean theorem
      const stringerLength = Math.sqrt(totalRise * totalRise + totalRun * totalRun);
      const angle = Math.atan(totalRise / totalRun) * (180 / Math.PI);

      return {
        primaryValue: `${numRisers} Steps (${exactRiser.toFixed(2)}" riser)`,
        primaryLabel: 'Risers Configuration',
        subtext: `Total Run: ${(totalRun / 12).toFixed(2)} ft | Incline: ${angle.toFixed(1)}°`,
        breakdown: [
          { label: 'Number of Risers', value: numRisers.toString() },
          { label: 'Exact Riser Height', value: `${exactRiser.toFixed(2)} inches` },
          { label: 'Number of Treads', value: numTreads.toString() },
          { label: 'Tread Depth', value: `${treadDepth} inches` },
          { label: 'Total Horizontal Run', value: `${(totalRun / 12).toFixed(2)} ft (${totalRun} in)` },
          { label: 'Stringer Length', value: `${(stringerLength / 12).toFixed(2)} ft (${stringerLength.toFixed(1)} in)` },
          { label: 'Stair Incline Angle', value: `${angle.toFixed(1)}°` }
        ],
        steps: [
          `Number of risers = round(${totalRise} / ${targetRiser}) = ${numRisers}`,
          `Exact riser height = ${totalRise} / ${numRisers} = ${exactRiser.toFixed(2)} in`,
          `Total horizontal run = ${numTreads} treads × ${treadDepth} in = ${totalRun} in`
        ]
      };
    },
    formula: 'Risers = Total Rise / Target Riser  |  Stringer = √(Rise² + Run²)',
    explanation: 'Designs code-compliant staircases adhering to standard building code (IBC) rise and run limits.',
    howToUse: ['Enter total floor-to-floor vertical rise in inches.', 'Set target riser (default 7.5").', 'Click Calculate.'],
    example: { inputs: { totalRiseIn: 108, targetRiserIn: 7.5 }, output: '14 Steps (7.71" riser)', explanation: '108" floor height requires 14 risers at ~7.71" each, 13 treads, and ~10.8 ft horizontal run.' },
    faqs: [{ question: 'What is the 7-11 rule for stairs?', answer: 'A common rule of thumb: max 7.75" rise and minimum 10-11" tread depth.' }],
    keywords: ['stair calculator', 'stair stringer', 'riser and tread', 'staircase builder']
  },
  {
    id: 'gravel-calculator',
    slug: 'gravel-calculator',
    title: 'Gravel Calculator',
    category: 'construction',
    shortDesc: 'Compute tons and cubic yards of crushed stone or gravel for driveways and paths.',
    icon: 'Layers',
    fields: [
      { id: 'length', label: 'Length (Feet)', type: 'number', defaultValue: 50, min: 1, step: 1 },
      { id: 'width', label: 'Width (Feet)', type: 'number', defaultValue: 10, min: 1, step: 1 },
      { id: 'depthIn', label: 'Depth (Inches)', type: 'number', defaultValue: 3, min: 1, step: 0.5 }
    ],
    calculate: (inputs) => {
      const l = parseFloat(inputs.length) || 0;
      const w = parseFloat(inputs.width) || 0;
      const d = (parseFloat(inputs.depthIn) || 1) / 12;

      const cuFt = l * w * d;
      const cuYds = cuFt / 27;
      // Standard crushed stone / gravel density ~1.4 tons per cu yd
      const tons = cuYds * 1.4;

      return {
        primaryValue: `${tons.toFixed(2)} Tons of Gravel`,
        primaryLabel: 'Gravel Weight Required',
        subtext: `Volume: ${cuYds.toFixed(2)} cubic yards (${cuFt.toFixed(0)} cu ft)`,
        breakdown: [
          { label: 'Surface Area', value: `${l * w} sq ft` },
          { label: 'Cubic Yards', value: `${cuYds.toFixed(2)} yd³` },
          { label: 'Tons (at 1.4 tons/yd³)', value: `${tons.toFixed(2)} tons` }
        ],
        steps: [`Multiply Area (${l * w} sq ft) by depth (${inputs.depthIn}/12 ft) = ${cuFt.toFixed(1)} cu ft`, `Volume = ${cuYds.toFixed(2)} yd³ × 1.4 = ${tons.toFixed(2)} tons`]
      };
    },
    formula: 'Tons = (Length ft × Width ft × Depth ft / 27) × 1.4',
    explanation: 'Estimates gravel or crushed rock for road base, driveways, and drainage French drains.',
    howToUse: ['Enter length and width in feet.', 'Enter depth in inches.', 'Click Calculate.'],
    example: { inputs: { length: 50, width: 10, depthIn: 3 }, output: '6.48 Tons of Gravel', explanation: 'A 50x10 ft driveway at 3" thickness needs ~4.63 cu yds (~6.5 tons).' },
    faqs: [{ question: 'How deep should a gravel driveway be?', answer: 'Typically 3 to 4 inches of surface gravel over a 4 to 6-inch compacted sub-base.' }],
    keywords: ['gravel calculator', 'crushed stone', 'gravel driveway', 'tons of rock']
  },
  {
    id: 'mulch-calculator',
    slug: 'mulch-calculator',
    title: 'Mulch Calculator',
    category: 'construction',
    shortDesc: 'Calculate garden mulch in bulk cubic yards or 2 cu ft / 3 cu ft bags.',
    icon: 'Trees',
    fields: [
      { id: 'length', label: 'Bed Length (Feet)', type: 'number', defaultValue: 30, min: 1, step: 1 },
      { id: 'width', label: 'Bed Width (Feet)', type: 'number', defaultValue: 8, min: 1, step: 1 },
      { id: 'depthIn', label: 'Mulch Depth (Inches)', type: 'number', defaultValue: 3, min: 1, max: 6, step: 0.5 }
    ],
    calculate: (inputs) => {
      const l = parseFloat(inputs.length) || 0;
      const w = parseFloat(inputs.width) || 0;
      const d = (parseFloat(inputs.depthIn) || 3) / 12;

      const cuFt = l * w * d;
      const cuYds = cuFt / 27;
      const bags2cuFt = Math.ceil(cuFt / 2);
      const bags3cuFt = Math.ceil(cuFt / 3);

      return {
        primaryValue: `${cuYds.toFixed(2)} Cubic Yards`,
        primaryLabel: 'Bulk Mulch Volume',
        subtext: `Or ${bags2cuFt} bags (2 cu ft) / ${bags3cuFt} bags (3 cu ft)`,
        breakdown: [
          { label: 'Garden Bed Area', value: `${l * w} sq ft` },
          { label: 'Cubic Feet Needed', value: `${cuFt.toFixed(1)} cu ft` },
          { label: 'Bulk Cubic Yards', value: `${cuYds.toFixed(2)} yd³` },
          { label: 'Standard 2 cu ft Bags', value: `${bags2cuFt} bags` },
          { label: 'Large 3 cu ft Bags', value: `${bags3cuFt} bags` }
        ],
        steps: [`Multiply Area (${l * w} sq ft) by depth (${inputs.depthIn}/12 ft) = ${cuFt.toFixed(1)} cu ft`, `Cubic yards = ${cuFt.toFixed(1)} / 27 = ${cuYds.toFixed(2)} yd³`]
      };
    },
    formula: 'Cubic Yards = (Length ft × Width ft × Depth ft) / 27',
    explanation: 'Estimates landscape bark, wood chips, or shredded mulch for flower beds and weed suppression.',
    howToUse: ['Enter garden bed dimensions.', 'Enter depth in inches (2-3" is standard).', 'Click Calculate.'],
    example: { inputs: { length: 30, width: 8, depthIn: 3 }, output: '2.22 Cubic Yards', explanation: '240 sq ft bed at 3" depth requires 2.22 cu yds or thirty 2-cubic-foot bags.' },
    faqs: [{ question: 'How deep should mulch be laid?', answer: 'A depth of 2 to 3 inches is ideal for weed suppression and soil moisture retention.' }],
    keywords: ['mulch calculator', 'landscape mulch', 'cubic yards of mulch', 'mulch bags']
  }
];

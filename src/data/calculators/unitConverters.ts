import { CalculatorDef } from '../../types/calculator';

export const unitConverters: CalculatorDef[] = [
  {
    id: 'length-converter',
    slug: 'length-converter',
    title: 'Length & Distance Converter',
    category: 'unit-converters',
    shortDesc: 'Convert between meters, kilometers, feet, inches, yards, miles, and centimeters.',
    icon: 'Ruler',
    badge: 'popular',
    fields: [
      { id: 'value', label: 'Value to Convert', type: 'number', defaultValue: 10, step: 0.1 },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        defaultValue: 'm',
        options: [
          { label: 'Meters (m)', value: 'm' },
          { label: 'Kilometers (km)', value: 'km' },
          { label: 'Centimeters (cm)', value: 'cm' },
          { label: 'Millimeters (mm)', value: 'mm' },
          { label: 'Inches (in)', value: 'in' },
          { label: 'Feet (ft)', value: 'ft' },
          { label: 'Yards (yd)', value: 'yd' },
          { label: 'Miles (mi)', value: 'mi' }
        ]
      },
      {
        id: 'toUnit',
        label: 'To Unit',
        type: 'select',
        defaultValue: 'ft',
        options: [
          { label: 'Feet (ft)', value: 'ft' },
          { label: 'Meters (m)', value: 'm' },
          { label: 'Kilometers (km)', value: 'km' },
          { label: 'Centimeters (cm)', value: 'cm' },
          { label: 'Inches (in)', value: 'in' },
          { label: 'Yards (yd)', value: 'yd' },
          { label: 'Miles (mi)', value: 'mi' }
        ]
      }
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.value) || 0;
      const from = inputs.fromUnit || 'm';
      const to = inputs.toUnit || 'ft';

      // Base: meters
      const toMeters: Record<string, number> = {
        m: 1,
        km: 1000,
        cm: 0.01,
        mm: 0.001,
        in: 0.0254,
        ft: 0.3048,
        yd: 0.9144,
        mi: 1609.344
      };

      const inMeters = val * (toMeters[from] || 1);
      const converted = inMeters / (toMeters[to] || 1);

      return {
        primaryValue: `${converted.toFixed(4)} ${to}`,
        primaryLabel: 'Converted Length',
        subtext: `${val} ${from} = ${converted.toFixed(4)} ${to}`,
        breakdown: [
          { label: 'Meters (SI Base)', value: `${inMeters.toFixed(4)} m` },
          { label: 'Kilometers', value: `${(inMeters / 1000).toFixed(6)} km` },
          { label: 'Feet', value: `${(inMeters / 0.3048).toFixed(4)} ft` },
          { label: 'Inches', value: `${(inMeters / 0.0254).toFixed(2)} in` },
          { label: 'Miles', value: `${(inMeters / 1609.344).toFixed(6)} mi` }
        ],
        steps: [`Converted ${val} ${from} to baseline meters = ${inMeters.toFixed(4)} m`, `Converted meters to ${to} = ${converted.toFixed(4)} ${to}`]
      };
    },
    formula: 'Value_to = Value_from × (Factor_from / Factor_to)',
    explanation: 'Converts length across metric and imperial systems with high floating-point accuracy.',
    howToUse: ['Enter value.', 'Select source unit.', 'Select target unit.', 'Click Calculate.'],
    example: { inputs: { value: 10, fromUnit: 'm', toUnit: 'ft' }, output: '32.8084 ft', explanation: '10 meters equals approx 32.81 feet.' },
    faqs: [{ question: 'How many feet in a mile?', answer: 'There are exactly 5,280 feet in 1 statute mile.' }],
    keywords: ['length converter', 'meters to feet', 'inches to cm', 'distance conversion', 'miles to km']
  },
  {
    id: 'weight-converter',
    slug: 'weight-converter',
    title: 'Weight & Mass Converter',
    category: 'unit-converters',
    shortDesc: 'Convert between kilograms, pounds (lbs), grams, ounces, stones, and metric tons.',
    icon: 'Scale',
    badge: 'popular',
    fields: [
      { id: 'value', label: 'Weight Value', type: 'number', defaultValue: 150, step: 0.1 },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        defaultValue: 'lb',
        options: [
          { label: 'Pounds (lbs)', value: 'lb' },
          { label: 'Kilograms (kg)', value: 'kg' },
          { label: 'Grams (g)', value: 'g' },
          { label: 'Ounces (oz)', value: 'oz' },
          { label: 'Stones (st)', value: 'st' },
          { label: 'Metric Tons (t)', value: 't' }
        ]
      },
      {
        id: 'toUnit',
        label: 'To Unit',
        type: 'select',
        defaultValue: 'kg',
        options: [
          { label: 'Kilograms (kg)', value: 'kg' },
          { label: 'Pounds (lbs)', value: 'lb' },
          { label: 'Grams (g)', value: 'g' },
          { label: 'Ounces (oz)', value: 'oz' },
          { label: 'Stones (st)', value: 'st' }
        ]
      }
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.value) || 0;
      const from = inputs.fromUnit || 'lb';
      const to = inputs.toUnit || 'kg';

      // Base: kg
      const toKg: Record<string, number> = {
        kg: 1,
        g: 0.001,
        lb: 0.45359237,
        oz: 0.028349523125,
        st: 6.35029318,
        t: 1000
      };

      const inKg = val * (toKg[from] || 1);
      const converted = inKg / (toKg[to] || 1);

      return {
        primaryValue: `${converted.toFixed(3)} ${to}`,
        primaryLabel: 'Converted Weight',
        subtext: `${val} ${from} = ${converted.toFixed(3)} ${to}`,
        breakdown: [
          { label: 'Kilograms (kg)', value: `${inKg.toFixed(3)} kg` },
          { label: 'Pounds (lbs)', value: `${(inKg / 0.45359237).toFixed(2)} lbs` },
          { label: 'Grams (g)', value: `${(inKg * 1000).toLocaleString()} g` },
          { label: 'Ounces (oz)', value: `${(inKg / 0.028349523125).toFixed(2)} oz` },
          { label: 'Stones (st)', value: `${(inKg / 6.35029318).toFixed(2)} st` }
        ],
        steps: [`Converted ${val} ${from} to baseline kg = ${inKg.toFixed(4)} kg`, `Converted to ${to} = ${converted.toFixed(4)} ${to}`]
      };
    },
    formula: 'kg = lbs × 0.45359237  |  lbs = kg × 2.20462',
    explanation: 'Converts mass across international avoirdupois, metric, and British imperial systems.',
    howToUse: ['Enter weight.', 'Select source and target units.', 'Click Calculate.'],
    example: { inputs: { value: 150, fromUnit: 'lb', toUnit: 'kg' }, output: '68.039 kg', explanation: '150 pounds is approx 68.04 kilograms.' },
    faqs: [{ question: 'How many ounces in a pound?', answer: 'There are exactly 16 ounces in 1 pound.' }],
    keywords: ['weight converter', 'lbs to kg', 'kg to lbs', 'grams to ounces', 'stone to kg']
  },
  {
    id: 'temperature-converter',
    slug: 'temperature-converter',
    title: 'Temperature Converter',
    category: 'unit-converters',
    shortDesc: 'Convert between Celsius (°C), Fahrenheit (°F), Kelvin (K), and Rankine (°R).',
    icon: 'Thermometer',
    badge: 'popular',
    fields: [
      { id: 'temp', label: 'Temperature Value', type: 'number', defaultValue: 25, step: 0.1 },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        defaultValue: 'c',
        options: [
          { label: 'Celsius (°C)', value: 'c' },
          { label: 'Fahrenheit (°F)', value: 'f' },
          { label: 'Kelvin (K)', value: 'k' },
          { label: 'Rankine (°R)', value: 'r' }
        ]
      },
      {
        id: 'toUnit',
        label: 'To Unit',
        type: 'select',
        defaultValue: 'f',
        options: [
          { label: 'Fahrenheit (°F)', value: 'f' },
          { label: 'Celsius (°C)', value: 'c' },
          { label: 'Kelvin (K)', value: 'k' },
          { label: 'Rankine (°R)', value: 'r' }
        ]
      }
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.temp) || 0;
      const from = inputs.fromUnit || 'c';
      const to = inputs.toUnit || 'f';

      // Convert to Celsius first
      let c = 0;
      if (from === 'c') c = val;
      else if (from === 'f') c = (val - 32) * (5 / 9);
      else if (from === 'k') c = val - 273.15;
      else if (from === 'r') c = (val - 491.67) * (5 / 9);

      // Convert from Celsius to Target
      let res = 0;
      if (to === 'c') res = c;
      else if (to === 'f') res = c * (9 / 5) + 32;
      else if (to === 'k') res = c + 273.15;
      else if (to === 'r') res = (c + 273.15) * 1.8;

      return {
        primaryValue: `${res.toFixed(2)} °${to.toUpperCase()}`,
        primaryLabel: 'Converted Temperature',
        subtext: `${val} °${from.toUpperCase()} = ${res.toFixed(2)} °${to.toUpperCase()}`,
        breakdown: [
          { label: 'Celsius', value: `${c.toFixed(2)} °C` },
          { label: 'Fahrenheit', value: `${(c * 1.8 + 32).toFixed(2)} °F` },
          { label: 'Kelvin', value: `${(c + 273.15).toFixed(2)} K` },
          { label: 'Rankine', value: `${((c + 273.15) * 1.8).toFixed(2)} °R` }
        ],
        steps: [`Converted to baseline Celsius = ${c.toFixed(2)} °C`, `Converted to ${to.toUpperCase()} = ${res.toFixed(2)}`]
      };
    },
    formula: '°F = (°C × 9/5) + 32  |  °C = (°F - 32) × 5/9  |  K = °C + 273.15',
    explanation: 'Converts thermal temperature scales across metric (Celsius/Kelvin) and imperial (Fahrenheit/Rankine).',
    howToUse: ['Enter temperature value.', 'Select starting scale and target scale.', 'Click Calculate.'],
    example: { inputs: { temp: 25, fromUnit: 'c', toUnit: 'f' }, output: '77.00 °F', explanation: '25°C room temperature is 77°F.' },
    faqs: [{ question: 'At what temperature are Celsius and Fahrenheit equal?', answer: 'At -40°: -40°C equals -40°F.' }],
    keywords: ['temperature converter', 'celsius to fahrenheit', 'f to c', 'kelvin converter']
  },
  {
    id: 'area-converter',
    slug: 'area-converter',
    title: 'Area Unit Converter',
    category: 'unit-converters',
    shortDesc: 'Convert between square meters, square feet, acres, hectares, and square kilometers.',
    icon: 'Layers',
    fields: [
      { id: 'value', label: 'Area Value', type: 'number', defaultValue: 1, step: 0.1 },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        defaultValue: 'acre',
        options: [
          { label: 'Acres (ac)', value: 'acre' },
          { label: 'Hectares (ha)', value: 'ha' },
          { label: 'Square Feet (sq ft)', value: 'sqft' },
          { label: 'Square Meters (sq m)', value: 'sqm' },
          { label: 'Square Kilometers (sq km)', value: 'sqkm' },
          { label: 'Square Miles (sq mi)', value: 'sqmi' }
        ]
      },
      {
        id: 'toUnit',
        label: 'To Unit',
        type: 'select',
        defaultValue: 'sqft',
        options: [
          { label: 'Square Feet (sq ft)', value: 'sqft' },
          { label: 'Square Meters (sq m)', value: 'sqm' },
          { label: 'Acres (ac)', value: 'acre' },
          { label: 'Hectares (ha)', value: 'ha' }
        ]
      }
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.value) || 0;
      const from = inputs.fromUnit || 'acre';
      const to = inputs.toUnit || 'sqft';

      // Base: sq meters
      const toSqm: Record<string, number> = {
        sqm: 1,
        sqft: 0.092903,
        acre: 4046.85642,
        ha: 10000,
        sqkm: 1000000,
        sqmi: 2589988.11
      };

      const inSqm = val * (toSqm[from] || 1);
      const converted = inSqm / (toSqm[to] || 1);

      return {
        primaryValue: `${converted.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${to}`,
        primaryLabel: 'Converted Area',
        subtext: `${val} ${from} = ${converted.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${to}`,
        breakdown: [
          { label: 'Square Meters', value: `${inSqm.toFixed(2)} m²` },
          { label: 'Square Feet', value: `${(inSqm / 0.092903).toFixed(2)} sq ft` },
          { label: 'Acres', value: `${(inSqm / 4046.85642).toFixed(4)} acres` },
          { label: 'Hectares', value: `${(inSqm / 10000).toFixed(4)} ha` }
        ],
        steps: [`Converted ${val} ${from} to square meters = ${inSqm.toFixed(2)} m²`]
      };
    },
    formula: '1 Acre = 43,560 sq ft = 4,046.86 m²  |  1 Hectare = 10,000 m²',
    explanation: 'Converts land and floor area units between agricultural, architectural, and geographic standards.',
    howToUse: ['Enter area value.', 'Select source and target units.', 'Click Calculate.'],
    example: { inputs: { value: 1, fromUnit: 'acre', toUnit: 'sqft' }, output: '43,560 sqft', explanation: 'One acre contains exactly 43,560 square feet.' },
    faqs: [{ question: 'How big is an acre visually?', answer: 'Roughly the size of an American football field without the end zones.' }],
    keywords: ['area converter', 'acres to square feet', 'hectares to acres', 'sq ft to sq meters']
  },
  {
    id: 'volume-converter',
    slug: 'volume-converter',
    title: 'Volume & Capacity Converter',
    category: 'unit-converters',
    shortDesc: 'Convert between liters, gallons (US/UK), milliliters, fluid ounces, and cubic meters.',
    icon: 'Package',
    fields: [
      { id: 'value', label: 'Volume Value', type: 'number', defaultValue: 5, step: 0.1 },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        defaultValue: 'gal',
        options: [
          { label: 'US Gallons (gal)', value: 'gal' },
          { label: 'Liters (L)', value: 'l' },
          { label: 'Milliliters (ml)', value: 'ml' },
          { label: 'Fluid Ounces (fl oz)', value: 'floz' },
          { label: 'Cubic Meters (m³)', value: 'm3' },
          { label: 'Cubic Feet (ft³)', value: 'ft3' },
          { label: 'Imperial Gallons (UK)', value: 'ukgal' }
        ]
      },
      {
        id: 'toUnit',
        label: 'To Unit',
        type: 'select',
        defaultValue: 'l',
        options: [
          { label: 'Liters (L)', value: 'l' },
          { label: 'US Gallons (gal)', value: 'gal' },
          { label: 'Milliliters (ml)', value: 'ml' },
          { label: 'Fluid Ounces (fl oz)', value: 'floz' }
        ]
      }
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.value) || 0;
      const from = inputs.fromUnit || 'gal';
      const to = inputs.toUnit || 'l';

      // Base: liters
      const toLiters: Record<string, number> = {
        l: 1,
        ml: 0.001,
        gal: 3.785411784,
        ukgal: 4.54609,
        floz: 0.0295735,
        m3: 1000,
        ft3: 28.3168
      };

      const inLiters = val * (toLiters[from] || 1);
      const converted = inLiters / (toLiters[to] || 1);

      return {
        primaryValue: `${converted.toFixed(3)} ${to}`,
        primaryLabel: 'Converted Volume',
        subtext: `${val} ${from} = ${converted.toFixed(3)} ${to}`,
        breakdown: [
          { label: 'Liters', value: `${inLiters.toFixed(3)} L` },
          { label: 'US Gallons', value: `${(inLiters / 3.78541).toFixed(3)} gal` },
          { label: 'Milliliters', value: `${(inLiters * 1000).toLocaleString()} ml` },
          { label: 'Fluid Ounces', value: `${(inLiters / 0.0295735).toFixed(2)} fl oz` }
        ],
        steps: [`Converted ${val} ${from} to liters = ${inLiters.toFixed(3)} L`]
      };
    },
    formula: '1 US Gallon = 3.7854 Liters = 128 fl oz',
    explanation: 'Converts liquid capacity and geometric dry volume units.',
    howToUse: ['Enter volume value.', 'Choose source and target units.', 'Click Calculate.'],
    example: { inputs: { value: 5, fromUnit: 'gal', toUnit: 'l' }, output: '18.927 l', explanation: '5 US gallons equals 18.93 liters.' },
    faqs: [{ question: 'Difference between US and UK gallons?', answer: 'A UK Imperial Gallon is ~4.546 L, which is ~20% larger than a US Gallon (~3.785 L).' }],
    keywords: ['volume converter', 'gallons to liters', 'liters to gallons', 'fluid ounces to ml']
  },
  {
    id: 'speed-converter',
    slug: 'speed-converter',
    title: 'Speed Converter',
    category: 'unit-converters',
    shortDesc: 'Convert between mph, km/h, m/s, knots, and feet per second.',
    icon: 'Gauge',
    fields: [
      { id: 'value', label: 'Speed Value', type: 'number', defaultValue: 65, step: 1 },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        defaultValue: 'mph',
        options: [
          { label: 'Miles per Hour (mph)', value: 'mph' },
          { label: 'Kilometers per Hour (km/h)', value: 'kmh' },
          { label: 'Meters per Second (m/s)', value: 'ms' },
          { label: 'Knots (nautical)', value: 'knot' },
          { label: 'Feet per Second (ft/s)', value: 'fts' }
        ]
      },
      {
        id: 'toUnit',
        label: 'To Unit',
        type: 'select',
        defaultValue: 'kmh',
        options: [
          { label: 'Kilometers per Hour (km/h)', value: 'kmh' },
          { label: 'Miles per Hour (mph)', value: 'mph' },
          { label: 'Meters per Second (m/s)', value: 'ms' },
          { label: 'Knots (nautical)', value: 'knot' }
        ]
      }
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.value) || 0;
      const from = inputs.fromUnit || 'mph';
      const to = inputs.toUnit || 'kmh';

      // Base: m/s
      const toMs: Record<string, number> = {
        ms: 1,
        kmh: 1 / 3.6,
        mph: 0.44704,
        knot: 0.514444,
        fts: 0.3048
      };

      const inMs = val * (toMs[from] || 1);
      const converted = inMs / (toMs[to] || 1);

      return {
        primaryValue: `${converted.toFixed(2)} ${to}`,
        primaryLabel: 'Converted Velocity',
        subtext: `${val} ${from} = ${converted.toFixed(2)} ${to}`,
        breakdown: [
          { label: 'Meters per Second (m/s)', value: `${inMs.toFixed(2)} m/s` },
          { label: 'Kilometers per Hour (km/h)', value: `${(inMs * 3.6).toFixed(2)} km/h` },
          { label: 'Miles per Hour (mph)', value: `${(inMs / 0.44704).toFixed(2)} mph` },
          { label: 'Knots', value: `${(inMs / 0.514444).toFixed(2)} knots` }
        ],
        steps: [`Converted ${val} ${from} to m/s = ${inMs.toFixed(2)} m/s`]
      };
    },
    formula: '1 mph = 1.60934 km/h  |  1 m/s = 3.6 km/h  |  1 knot = 1.852 km/h',
    explanation: 'Converts vehicle speed, wind velocity, and nautical navigation rates.',
    howToUse: ['Enter speed value.', 'Select source and destination units.', 'Click Calculate.'],
    example: { inputs: { value: 65, fromUnit: 'mph', toUnit: 'kmh' }, output: '104.61 kmh', explanation: '65 mph highway speed is ~104.6 km/h.' },
    faqs: [{ question: 'What is a knot in nautical terms?', answer: 'One knot equals one nautical mile (1.852 km) per hour.' }],
    keywords: ['speed converter', 'mph to kmh', 'kmh to mph', 'knots to mph', 'meters per second']
  },
  {
    id: 'data-storage-converter',
    slug: 'data-storage-converter',
    title: 'Data Storage Converter',
    category: 'unit-converters',
    shortDesc: 'Convert between Bytes, KB, MB, GB, TB, and PB in both decimal and binary systems.',
    icon: 'HardDrive',
    badge: 'popular',
    fields: [
      { id: 'value', label: 'Data Size', type: 'number', defaultValue: 16, step: 0.1 },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        defaultValue: 'gb',
        options: [
          { label: 'Gigabytes (GB)', value: 'gb' },
          { label: 'Megabytes (MB)', value: 'mb' },
          { label: 'Terabytes (TB)', value: 'tb' },
          { label: 'Kilobytes (KB)', value: 'kb' },
          { label: 'Bytes (B)', value: 'b' },
          { label: 'Petabytes (PB)', value: 'pb' }
        ]
      },
      {
        id: 'toUnit',
        label: 'To Unit',
        type: 'select',
        defaultValue: 'mb',
        options: [
          { label: 'Megabytes (MB)', value: 'mb' },
          { label: 'Gigabytes (GB)', value: 'gb' },
          { label: 'Kilobytes (KB)', value: 'kb' },
          { label: 'Terabytes (TB)', value: 'tb' }
        ]
      }
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.value) || 0;
      const from = inputs.fromUnit || 'gb';
      const to = inputs.toUnit || 'mb';

      const expMap: Record<string, number> = { b: 0, kb: 1, mb: 2, gb: 3, tb: 4, pb: 5 };
      const fromExp = expMap[from] || 0;
      const toExp = expMap[to] || 0;

      // Binary (1024) and Decimal (1000)
      const convertedBinary = val * Math.pow(1024, fromExp - toExp);
      const convertedDecimal = val * Math.pow(1000, fromExp - toExp);

      return {
        primaryValue: `${convertedBinary.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${to.toUpperCase()}`,
        primaryLabel: 'Binary Standard (Base 1024 / GiB)',
        subtext: `Decimal Standard (Base 1000): ${convertedDecimal.toLocaleString('en-US', { maximumFractionDigits: 2 })} ${to.toUpperCase()}`,
        breakdown: [
          { label: 'Binary Value (1024 basis)', value: `${convertedBinary.toLocaleString()} ${to.toUpperCase()}` },
          { label: 'Decimal Value (1000 basis)', value: `${convertedDecimal.toLocaleString()} ${to.toUpperCase()}` },
          { label: 'Total Bytes', value: `${(val * Math.pow(1024, fromExp)).toLocaleString()} Bytes` }
        ],
        steps: [`Multiply by 1024^(${fromExp} - ${toExp}) = ${convertedBinary.toFixed(2)} ${to.toUpperCase()}`]
      };
    },
    formula: '1 GB = 1,024 MB = 1,048,576 KB = 1,073,741,824 Bytes',
    explanation: 'Converts digital file sizes across computer architecture powers of 2 (1024) and storage manufacturer standards (1000).',
    howToUse: ['Enter number.', 'Select source size and target unit.', 'Click Calculate.'],
    example: { inputs: { value: 16, fromUnit: 'gb', toUnit: 'mb' }, output: '16,384 MB', explanation: '16 GB equals 16,384 Megabytes (binary).' },
    faqs: [{ question: 'Why does my 1TB hard drive show 931 GB in Windows?', answer: 'Drive manufacturers use decimal (1,000,000,000,000 bytes = 1TB), but Windows measures in binary GiB (1024^3), yielding ~931.3 GiB.' }],
    keywords: ['data storage converter', 'gb to mb', 'tb to gb', 'bytes converter', 'gib vs gb']
  },
  {
    id: 'energy-converter',
    slug: 'energy-converter',
    title: 'Energy Converter',
    category: 'unit-converters',
    shortDesc: 'Convert between Joules, Kilojoules, Calories, Kilocalories (kcal), Watt-hours, and BTU.',
    icon: 'Zap',
    fields: [
      { id: 'value', label: 'Energy Value', type: 'number', defaultValue: 1000, step: 10 },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        defaultValue: 'j',
        options: [
          { label: 'Joules (J)', value: 'j' },
          { label: 'Kilojoules (kJ)', value: 'kj' },
          { label: 'Kilocalories (kcal / food cal)', value: 'kcal' },
          { label: 'Watt-hours (Wh)', value: 'wh' },
          { label: 'Kilowatt-hours (kWh)', value: 'kwh' },
          { label: 'BTU', value: 'btu' }
        ]
      },
      {
        id: 'toUnit',
        label: 'To Unit',
        type: 'select',
        defaultValue: 'kcal',
        options: [
          { label: 'Kilocalories (kcal)', value: 'kcal' },
          { label: 'Joules (J)', value: 'j' },
          { label: 'Kilojoules (kJ)', value: 'kj' },
          { label: 'Watt-hours (Wh)', value: 'wh' },
          { label: 'BTU', value: 'btu' }
        ]
      }
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.value) || 0;
      const from = inputs.fromUnit || 'j';
      const to = inputs.toUnit || 'kcal';

      // Base: Joules
      const toJoules: Record<string, number> = {
        j: 1,
        kj: 1000,
        kcal: 4184,
        wh: 3600,
        kwh: 3600000,
        btu: 1055.056
      };

      const inJoules = val * (toJoules[from] || 1);
      const converted = inJoules / (toJoules[to] || 1);

      return {
        primaryValue: `${converted.toFixed(4)} ${to}`,
        primaryLabel: 'Converted Energy',
        subtext: `${val} ${from} = ${converted.toFixed(4)} ${to}`,
        breakdown: [
          { label: 'Joules (J)', value: `${inJoules.toFixed(2)} J` },
          { label: 'Kilocalories (food calories)', value: `${(inJoules / 4184).toFixed(2)} kcal` },
          { label: 'Kilowatt-hours (kWh)', value: `${(inJoules / 3600000).toFixed(6)} kWh` },
          { label: 'BTU', value: `${(inJoules / 1055.056).toFixed(2)} BTU` }
        ],
        steps: [`Converted ${val} ${from} to baseline Joules = ${inJoules.toFixed(2)} J`]
      };
    },
    formula: '1 kcal = 4,184 Joules  |  1 kWh = 3.6 × 10⁶ Joules',
    explanation: 'Converts work and energy across mechanical, electrical, thermal, and nutritional units.',
    howToUse: ['Enter energy amount.', 'Select units.', 'Click Calculate.'],
    example: { inputs: { value: 1000, fromUnit: 'j', toUnit: 'kcal' }, output: '0.2390 kcal', explanation: '1,000 Joules is approx 0.239 kilocalories.' },
    faqs: [{ question: 'What is a food Calorie?', answer: 'A food calorie with a capital C is actually a kilocalorie (1,000 small chemistry calories or 4,184 Joules).' }],
    keywords: ['energy converter', 'joules to calories', 'kwh to joules', 'btu converter']
  },
  {
    id: 'power-converter',
    slug: 'power-converter',
    title: 'Power Converter',
    category: 'unit-converters',
    shortDesc: 'Convert between Watts (W), Kilowatts (kW), Horsepower (hp), and BTU/hr.',
    icon: 'Zap',
    fields: [
      { id: 'value', label: 'Power Value', type: 'number', defaultValue: 300, step: 5 },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        defaultValue: 'hp',
        options: [
          { label: 'Horsepower (hp)', value: 'hp' },
          { label: 'Kilowatts (kW)', value: 'kw' },
          { label: 'Watts (W)', value: 'w' },
          { label: 'Megawatts (MW)', value: 'mw' },
          { label: 'BTU/hr', value: 'btuh' }
        ]
      },
      {
        id: 'toUnit',
        label: 'To Unit',
        type: 'select',
        defaultValue: 'kw',
        options: [
          { label: 'Kilowatts (kW)', value: 'kw' },
          { label: 'Horsepower (hp)', value: 'hp' },
          { label: 'Watts (W)', value: 'w' },
          { label: 'BTU/hr', value: 'btuh' }
        ]
      }
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.value) || 0;
      const from = inputs.fromUnit || 'hp';
      const to = inputs.toUnit || 'kw';

      // Base: Watts
      const toWatts: Record<string, number> = {
        w: 1,
        kw: 1000,
        mw: 1000000,
        hp: 745.699872,
        btuh: 0.293071
      };

      const inWatts = val * (toWatts[from] || 1);
      const converted = inWatts / (toWatts[to] || 1);

      return {
        primaryValue: `${converted.toFixed(2)} ${to}`,
        primaryLabel: 'Converted Power',
        subtext: `${val} ${from} = ${converted.toFixed(2)} ${to}`,
        breakdown: [
          { label: 'Watts', value: `${inWatts.toFixed(2)} W` },
          { label: 'Kilowatts', value: `${(inWatts / 1000).toFixed(2)} kW` },
          { label: 'Horsepower', value: `${(inWatts / 745.7).toFixed(2)} hp` },
          { label: 'BTU/hr', value: `${(inWatts / 0.293071).toFixed(0)} BTU/hr` }
        ],
        steps: [`Converted to baseline Watts = ${inWatts.toFixed(2)} W`]
      };
    },
    formula: '1 Horsepower (mechanical) ≈ 745.7 Watts',
    explanation: 'Power is the rate at which work is performed or energy is converted over time.',
    howToUse: ['Enter power number.', 'Select source and target units.', 'Click Calculate.'],
    example: { inputs: { value: 300, fromUnit: 'hp', toUnit: 'kw' }, output: '223.71 kw', explanation: 'A 300 horsepower engine generates approx 223.7 kW of power.' },
    faqs: [{ question: 'How was horsepower originally defined?', answer: 'James Watt defined 1 horsepower as 33,000 foot-pounds of work per minute based on draft horses.' }],
    keywords: ['power converter', 'hp to kw', 'horsepower to watts', 'electrical power']
  },
  {
    id: 'pressure-converter',
    slug: 'pressure-converter',
    title: 'Pressure Converter',
    category: 'unit-converters',
    shortDesc: 'Convert between PSI, Bar, Pascal (Pa), Atmosphere (atm), and mmHg/Torr.',
    icon: 'Gauge',
    fields: [
      { id: 'value', label: 'Pressure Value', type: 'number', defaultValue: 32, step: 0.5 },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        defaultValue: 'psi',
        options: [
          { label: 'Pounds per Sq Inch (psi)', value: 'psi' },
          { label: 'Bar', value: 'bar' },
          { label: 'Atmospheres (atm)', value: 'atm' },
          { label: 'Kilopascals (kPa)', value: 'kpa' },
          { label: 'Pascals (Pa)', value: 'pa' },
          { label: 'mmHg / Torr', value: 'mmhg' }
        ]
      },
      {
        id: 'toUnit',
        label: 'To Unit',
        type: 'select',
        defaultValue: 'bar',
        options: [
          { label: 'Bar', value: 'bar' },
          { label: 'Pounds per Sq Inch (psi)', value: 'psi' },
          { label: 'Kilopascals (kPa)', value: 'kpa' },
          { label: 'Atmospheres (atm)', value: 'atm' }
        ]
      }
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.value) || 0;
      const from = inputs.fromUnit || 'psi';
      const to = inputs.toUnit || 'bar';

      // Base: Pascals
      const toPa: Record<string, number> = {
        pa: 1,
        kpa: 1000,
        bar: 100000,
        psi: 6894.757,
        atm: 101325,
        mmhg: 133.322
      };

      const inPa = val * (toPa[from] || 1);
      const converted = inPa / (toPa[to] || 1);

      return {
        primaryValue: `${converted.toFixed(3)} ${to}`,
        primaryLabel: 'Converted Pressure',
        subtext: `${val} ${from} = ${converted.toFixed(3)} ${to}`,
        breakdown: [
          { label: 'Pascals (Pa)', value: `${inPa.toLocaleString()} Pa` },
          { label: 'Kilopascals (kPa)', value: `${(inPa / 1000).toFixed(2)} kPa` },
          { label: 'Bar', value: `${(inPa / 100000).toFixed(3)} bar` },
          { label: 'PSI', value: `${(inPa / 6894.757).toFixed(2)} psi` },
          { label: 'Atmospheres (atm)', value: `${(inPa / 101325).toFixed(4)} atm` }
        ],
        steps: [`Converted ${val} ${from} to Pascals = ${inPa.toFixed(2)} Pa`]
      };
    },
    formula: '1 atm = 101,325 Pa = 1.01325 bar = 14.696 psi',
    explanation: 'Converts tire pressure, atmospheric conditions, and hydraulic system values.',
    howToUse: ['Enter pressure.', 'Select units.', 'Click Calculate.'],
    example: { inputs: { value: 32, fromUnit: 'psi', toUnit: 'bar' }, output: '2.206 bar', explanation: '32 PSI car tire pressure equals 2.21 Bar.' },
    faqs: [{ question: 'What is standard atmospheric pressure at sea level?', answer: '1 atmosphere (1.013 bar or 14.7 psi).' }],
    keywords: ['pressure converter', 'psi to bar', 'bar to psi', 'atm to kpa', 'tire pressure']
  },
  {
    id: 'frequency-converter',
    slug: 'frequency-converter',
    title: 'Frequency Converter',
    category: 'unit-converters',
    shortDesc: 'Convert between Hertz (Hz), Kilohertz (kHz), Megahertz (MHz), Gigahertz (GHz), and RPM.',
    icon: 'Radio',
    fields: [
      { id: 'value', label: 'Frequency Value', type: 'number', defaultValue: 2.4, step: 0.1 },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        defaultValue: 'ghz',
        options: [
          { label: 'Gigahertz (GHz)', value: 'ghz' },
          { label: 'Megahertz (MHz)', value: 'mhz' },
          { label: 'Kilohertz (kHz)', value: 'khz' },
          { label: 'Hertz (Hz)', value: 'hz' },
          { label: 'Revolutions per min (RPM)', value: 'rpm' }
        ]
      },
      {
        id: 'toUnit',
        label: 'To Unit',
        type: 'select',
        defaultValue: 'mhz',
        options: [
          { label: 'Megahertz (MHz)', value: 'mhz' },
          { label: 'Gigahertz (GHz)', value: 'ghz' },
          { label: 'Hertz (Hz)', value: 'hz' },
          { label: 'Revolutions per min (RPM)', value: 'rpm' }
        ]
      }
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.value) || 0;
      const from = inputs.fromUnit || 'ghz';
      const to = inputs.toUnit || 'mhz';

      // Base: Hz
      const toHz: Record<string, number> = {
        hz: 1,
        khz: 1e3,
        mhz: 1e6,
        ghz: 1e9,
        rpm: 1 / 60
      };

      const inHz = val * (toHz[from] || 1);
      const converted = inHz / (toHz[to] || 1);

      return {
        primaryValue: `${converted.toLocaleString()} ${to.toUpperCase()}`,
        primaryLabel: 'Converted Frequency',
        subtext: `${val} ${from.toUpperCase()} = ${converted.toLocaleString()} ${to.toUpperCase()}`,
        breakdown: [
          { label: 'Hertz (Hz)', value: `${inHz.toLocaleString()} Hz` },
          { label: 'Megahertz (MHz)', value: `${(inHz / 1e6).toFixed(2)} MHz` },
          { label: 'Gigahertz (GHz)', value: `${(inHz / 1e9).toFixed(4)} GHz` },
          { label: 'RPM (Revolutions/min)', value: `${(inHz * 60).toLocaleString()} RPM` }
        ],
        steps: [`Converted to baseline Hertz = ${inHz} Hz`]
      };
    },
    formula: '1 GHz = 1,000 MHz = 1,000,000 kHz = 1,000,000,000 Hz',
    explanation: 'Converts cyclical oscillations per second across CPU clock speeds, radio bands, and mechanical rotations.',
    howToUse: ['Enter frequency.', 'Select units.', 'Click Calculate.'],
    example: { inputs: { value: 2.4, fromUnit: 'ghz', toUnit: 'mhz' }, output: '2,400 MHz', explanation: '2.4 GHz Wi-Fi spectrum equals 2,400 MHz.' },
    faqs: [{ question: 'How is RPM related to Hertz?', answer: '1 Hz equals 60 RPM (rotations per minute).' }],
    keywords: ['frequency converter', 'ghz to mhz', 'hz converter', 'rpm to hz']
  },
  {
    id: 'angle-converter',
    slug: 'angle-converter',
    title: 'Angle Converter',
    category: 'unit-converters',
    shortDesc: 'Convert between Degrees (°), Radians (rad), Gradians (grad), and Arcminutes.',
    icon: 'Compass',
    fields: [
      { id: 'value', label: 'Angle Value', type: 'number', defaultValue: 180, step: 1 },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        defaultValue: 'deg',
        options: [
          { label: 'Degrees (°)', value: 'deg' },
          { label: 'Radians (rad)', value: 'rad' },
          { label: 'Gradians (grad)', value: 'grad' },
          { label: 'Arcminutes (arcmin)', value: 'arcmin' }
        ]
      },
      {
        id: 'toUnit',
        label: 'To Unit',
        type: 'select',
        defaultValue: 'rad',
        options: [
          { label: 'Radians (rad)', value: 'rad' },
          { label: 'Degrees (°)', value: 'deg' },
          { label: 'Gradians (grad)', value: 'grad' }
        ]
      }
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.value) || 0;
      const from = inputs.fromUnit || 'deg';
      const to = inputs.toUnit || 'rad';

      // Base: Degrees
      const toDeg: Record<string, number> = {
        deg: 1,
        rad: 180 / Math.PI,
        grad: 0.9,
        arcmin: 1 / 60
      };

      const inDeg = val * (toDeg[from] || 1);
      const converted = inDeg / (toDeg[to] || 1);

      return {
        primaryValue: `${converted.toFixed(4)} ${to}`,
        primaryLabel: 'Converted Angle',
        subtext: `${val} ${from} = ${converted.toFixed(4)} ${to}`,
        breakdown: [
          { label: 'Degrees', value: `${inDeg.toFixed(2)}°` },
          { label: 'Radians', value: `${(inDeg * (Math.PI / 180)).toFixed(4)} rad` },
          { label: 'Pi Fraction', value: `${(inDeg / 180).toFixed(4)}π rad` },
          { label: 'Gradians', value: `${(inDeg / 0.9).toFixed(2)} grad` }
        ],
        steps: [`Converted ${val} ${from} to degrees = ${inDeg.toFixed(2)}°`]
      };
    },
    formula: 'Radians = Degrees × (π / 180)  |  Degrees = Radians × (180 / π)',
    explanation: 'Converts geometric and trigonometric angular measurements.',
    howToUse: ['Enter angle value.', 'Select source and target units.', 'Click Calculate.'],
    example: { inputs: { value: 180, fromUnit: 'deg', toUnit: 'rad' }, output: '3.1416 rad', explanation: '180° is equal to exactly π radians (~3.1416).' },
    faqs: [{ question: 'How many radians in a circle?', answer: 'A full 360° circle equals 2π radians (~6.283).' }],
    keywords: ['angle converter', 'degrees to radians', 'radians to degrees', 'arcmin']
  },
  {
    id: 'fuel-economy-converter',
    slug: 'fuel-economy-converter',
    title: 'Fuel Economy Converter',
    category: 'unit-converters',
    shortDesc: 'Convert between MPG (US), MPG (Imperial), L/100km, and km/L.',
    icon: 'Fuel',
    fields: [
      { id: 'value', label: 'Fuel Economy Value', type: 'number', defaultValue: 30, step: 0.5 },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        defaultValue: 'mpgus',
        options: [
          { label: 'MPG (US)', value: 'mpgus' },
          { label: 'Liters per 100km (L/100km)', value: 'l100km' },
          { label: 'Kilometers per Liter (km/L)', value: 'kml' },
          { label: 'MPG (Imperial / UK)', value: 'mpguk' }
        ]
      },
      {
        id: 'toUnit',
        label: 'To Unit',
        type: 'select',
        defaultValue: 'l100km',
        options: [
          { label: 'Liters per 100km (L/100km)', value: 'l100km' },
          { label: 'MPG (US)', value: 'mpgus' },
          { label: 'Kilometers per Liter (km/L)', value: 'kml' }
        ]
      }
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.value) || 0;
      const from = inputs.fromUnit || 'mpgus';
      const to = inputs.toUnit || 'l100km';

      if (val <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Fuel economy must be positive.' };

      // Convert to MPG US baseline
      let mpgUs = 0;
      if (from === 'mpgus') mpgUs = val;
      else if (from === 'l100km') mpgUs = 235.214583 / val;
      else if (from === 'kml') mpgUs = val * 2.35214583;
      else if (from === 'mpguk') mpgUs = val * 0.832674;

      let result = 0;
      if (to === 'mpgus') result = mpgUs;
      else if (to === 'l100km') result = 235.214583 / mpgUs;
      else if (to === 'kml') result = mpgUs / 2.35214583;

      return {
        primaryValue: `${result.toFixed(2)} ${to}`,
        primaryLabel: 'Converted Fuel Economy',
        subtext: `${val} ${from} = ${result.toFixed(2)} ${to}`,
        breakdown: [
          { label: 'MPG (US)', value: `${mpgUs.toFixed(1)} mpg` },
          { label: 'L/100km', value: `${(235.215 / mpgUs).toFixed(2)} L/100km` },
          { label: 'Kilometers / Liter', value: `${(mpgUs / 2.35215).toFixed(2)} km/L` },
          { label: 'MPG (UK)', value: `${(mpgUs * 1.20095).toFixed(1)} mpg` }
        ],
        steps: [`Used inverse conversion relationship: L/100km = 235.215 / MPG (US)`]
      };
    },
    formula: 'L/100km = 235.215 / MPG (US)  |  km/L = MPG (US) / 2.352',
    explanation: 'Converts vehicle fuel consumption rates between distance-per-volume and volume-per-distance standards.',
    howToUse: ['Enter consumption rate.', 'Choose units.', 'Click Calculate.'],
    example: { inputs: { value: 30, fromUnit: 'mpgus', toUnit: 'l100km' }, output: '7.84 l100km', explanation: '30 US MPG equals ~7.84 Liters per 100 kilometers.' },
    faqs: [{ question: 'Is a lower or higher L/100km better?', answer: 'Lower is better for L/100km (uses less fuel), while higher is better for MPG.' }],
    keywords: ['fuel economy converter', 'mpg to l 100km', 'gas mileage converter', 'km l to mpg']
  },
  {
    id: 'torque-converter',
    slug: 'torque-converter',
    title: 'Torque Converter',
    category: 'unit-converters',
    shortDesc: 'Convert between Newton-meters (N·m), Foot-pounds (ft·lb), and Inch-pounds (in·lb).',
    icon: 'Wrench',
    fields: [
      { id: 'value', label: 'Torque Value', type: 'number', defaultValue: 100, step: 5 },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        defaultValue: 'nm',
        options: [
          { label: 'Newton-meters (N·m)', value: 'nm' },
          { label: 'Foot-pounds (ft·lb)', value: 'ftlb' },
          { label: 'Inch-pounds (in·lb)', value: 'inlb' },
          { label: 'Kilogram-force meters (kgf·m)', value: 'kgfm' }
        ]
      },
      {
        id: 'toUnit',
        label: 'To Unit',
        type: 'select',
        defaultValue: 'ftlb',
        options: [
          { label: 'Foot-pounds (ft·lb)', value: 'ftlb' },
          { label: 'Newton-meters (N·m)', value: 'nm' },
          { label: 'Inch-pounds (in·lb)', value: 'inlb' }
        ]
      }
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.value) || 0;
      const from = inputs.fromUnit || 'nm';
      const to = inputs.toUnit || 'ftlb';

      // Base: N·m
      const toNm: Record<string, number> = {
        nm: 1,
        ftlb: 1.355818,
        inlb: 0.112985,
        kgfm: 9.80665
      };

      const inNm = val * (toNm[from] || 1);
      const converted = inNm / (toNm[to] || 1);

      return {
        primaryValue: `${converted.toFixed(2)} ${to}`,
        primaryLabel: 'Converted Torque',
        subtext: `${val} ${from} = ${converted.toFixed(2)} ${to}`,
        breakdown: [
          { label: 'Newton-meters (N·m)', value: `${inNm.toFixed(2)} N·m` },
          { label: 'Foot-pounds (ft·lb)', value: `${(inNm / 1.355818).toFixed(2)} ft·lb` },
          { label: 'Inch-pounds (in·lb)', value: `${(inNm / 0.112985).toFixed(1)} in·lb` }
        ],
        steps: [`Converted to baseline N·m = ${inNm.toFixed(2)} N·m`]
      };
    },
    formula: '1 ft·lb = 1.35582 N·m  |  1 N·m = 0.73756 ft·lb',
    explanation: 'Converts rotational force across automotive, mechanical wrench, and engineering specs.',
    howToUse: ['Enter torque.', 'Select units.', 'Click Calculate.'],
    example: { inputs: { value: 100, fromUnit: 'nm', toUnit: 'ftlb' }, output: '73.76 ftlb', explanation: '100 N·m equals 73.76 foot-pounds of torque.' },
    faqs: [{ question: 'What is torque in cars?', answer: 'Torque represents the engine’s rotational pulling power, providing low-end acceleration.' }],
    keywords: ['torque converter', 'nm to ft lb', 'foot pounds to newton meters', 'wrench torque']
  },
  {
    id: 'force-converter',
    slug: 'force-converter',
    title: 'Force Converter',
    category: 'unit-converters',
    shortDesc: 'Convert between Newtons (N), Kilonewtons (kN), Pounds-force (lbf), and Dynes.',
    icon: 'Activity',
    fields: [
      { id: 'value', label: 'Force Value', type: 'number', defaultValue: 500, step: 10 },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        defaultValue: 'n',
        options: [
          { label: 'Newtons (N)', value: 'n' },
          { label: 'Kilonewtons (kN)', value: 'kn' },
          { label: 'Pound-force (lbf)', value: 'lbf' },
          { label: 'Kilogram-force (kgf)', value: 'kgf' },
          { label: 'Dynes', value: 'dyne' }
        ]
      },
      {
        id: 'toUnit',
        label: 'To Unit',
        type: 'select',
        defaultValue: 'lbf',
        options: [
          { label: 'Pound-force (lbf)', value: 'lbf' },
          { label: 'Newtons (N)', value: 'n' },
          { label: 'Kilonewtons (kN)', value: 'kn' }
        ]
      }
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.value) || 0;
      const from = inputs.fromUnit || 'n';
      const to = inputs.toUnit || 'lbf';

      // Base: Newtons
      const toN: Record<string, number> = {
        n: 1,
        kn: 1000,
        lbf: 4.448222,
        kgf: 9.80665,
        dyne: 1e-5
      };

      const inN = val * (toN[from] || 1);
      const converted = inN / (toN[to] || 1);

      return {
        primaryValue: `${converted.toFixed(2)} ${to}`,
        primaryLabel: 'Converted Force',
        subtext: `${val} ${from} = ${converted.toFixed(2)} ${to}`,
        breakdown: [
          { label: 'Newtons (N)', value: `${inN.toFixed(2)} N` },
          { label: 'Pound-force (lbf)', value: `${(inN / 4.448222).toFixed(2)} lbf` },
          { label: 'Kilonewtons (kN)', value: `${(inN / 1000).toFixed(4)} kN` }
        ],
        steps: [`Converted ${val} ${from} to Newtons = ${inN.toFixed(2)} N`]
      };
    },
    formula: '1 lbf ≈ 4.44822 Newtons  |  1 N = 10⁵ Dynes',
    explanation: 'Converts units of physical force in mechanics and structural load calculations.',
    howToUse: ['Enter force.', 'Select units.', 'Click Calculate.'],
    example: { inputs: { value: 500, fromUnit: 'n', toUnit: 'lbf' }, output: '112.40 lbf', explanation: '500 Newtons equals ~112.4 pounds-force.' },
    faqs: [{ question: 'What is a Newton physically?', answer: 'One Newton is the force needed to accelerate 1 kilogram of mass at the rate of 1 m/s².' }],
    keywords: ['force converter', 'newtons to lbf', 'kn to newtons', 'force units']
  },
  {
    id: 'mass-converter',
    slug: 'mass-converter',
    title: 'Atomic & Metric Mass Converter',
    category: 'unit-converters',
    shortDesc: 'Convert mass between Metric grams, Micrograms, Atomic Mass Units (u), and Carats.',
    icon: 'Layers',
    fields: [
      { id: 'value', label: 'Mass Value', type: 'number', defaultValue: 5, step: 0.1 },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        defaultValue: 'g',
        options: [
          { label: 'Grams (g)', value: 'g' },
          { label: 'Milligrams (mg)', value: 'mg' },
          { label: 'Micrograms (µg)', value: 'ug' },
          { label: 'Carats (ct)', value: 'ct' }
        ]
      },
      {
        id: 'toUnit',
        label: 'To Unit',
        type: 'select',
        defaultValue: 'ct',
        options: [
          { label: 'Carats (ct)', value: 'ct' },
          { label: 'Milligrams (mg)', value: 'mg' },
          { label: 'Grams (g)', value: 'g' }
        ]
      }
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.value) || 0;
      const from = inputs.fromUnit || 'g';
      const to = inputs.toUnit || 'ct';

      const toG: Record<string, number> = {
        g: 1,
        mg: 0.001,
        ug: 1e-6,
        ct: 0.2
      };

      const inG = val * (toG[from] || 1);
      const converted = inG / (toG[to] || 1);

      return {
        primaryValue: `${converted.toFixed(3)} ${to}`,
        primaryLabel: 'Converted Fine Mass',
        subtext: `${val} ${from} = ${converted.toFixed(3)} ${to}`,
        breakdown: [
          { label: 'Grams', value: `${inG.toFixed(4)} g` },
          { label: 'Carats', value: `${(inG / 0.2).toFixed(2)} ct` },
          { label: 'Milligrams', value: `${(inG * 1000).toLocaleString()} mg` }
        ],
        steps: [`Converted ${val} ${from} to grams = ${inG} g`]
      };
    },
    formula: '1 Carat = 0.2 grams = 200 mg',
    explanation: 'Converts precision fine mass used in chemistry, jewelry gemstones, and pharmacology.',
    howToUse: ['Enter mass.', 'Select units.', 'Click Calculate.'],
    example: { inputs: { value: 5, fromUnit: 'g', toUnit: 'ct' }, output: '25.000 ct', explanation: '5 grams equals 25 carats.' },
    faqs: [{ question: 'What is a gemstone carat?', answer: 'A unit of weight equal to 200 milligrams (0.2 grams).' }],
    keywords: ['mass converter', 'carats to grams', 'milligrams to grams', 'precision mass']
  },
  {
    id: 'time-converter',
    slug: 'time-converter',
    title: 'Time Unit Converter',
    category: 'unit-converters',
    shortDesc: 'Convert between milliseconds, seconds, minutes, hours, days, weeks, and years.',
    icon: 'Clock',
    fields: [
      { id: 'value', label: 'Time Value', type: 'number', defaultValue: 48, step: 1 },
      {
        id: 'fromUnit',
        label: 'From Unit',
        type: 'select',
        defaultValue: 'hours',
        options: [
          { label: 'Hours', value: 'hours' },
          { label: 'Days', value: 'days' },
          { label: 'Minutes', value: 'minutes' },
          { label: 'Seconds', value: 'seconds' },
          { label: 'Weeks', value: 'weeks' }
        ]
      },
      {
        id: 'toUnit',
        label: 'To Unit',
        type: 'select',
        defaultValue: 'days',
        options: [
          { label: 'Days', value: 'days' },
          { label: 'Hours', value: 'hours' },
          { label: 'Minutes', value: 'minutes' },
          { label: 'Seconds', value: 'seconds' }
        ]
      }
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.value) || 0;
      const from = inputs.fromUnit || 'hours';
      const to = inputs.toUnit || 'days';

      // Base: seconds
      const toSec: Record<string, number> = {
        seconds: 1,
        minutes: 60,
        hours: 3600,
        days: 86400,
        weeks: 604800
      };

      const inSec = val * (toSec[from] || 1);
      const converted = inSec / (toSec[to] || 1);

      return {
        primaryValue: `${converted.toFixed(2)} ${to}`,
        primaryLabel: 'Converted Time',
        subtext: `${val} ${from} = ${converted.toFixed(2)} ${to}`,
        breakdown: [
          { label: 'Seconds', value: `${inSec.toLocaleString()} s` },
          { label: 'Minutes', value: `${(inSec / 60).toFixed(1)} mins` },
          { label: 'Hours', value: `${(inSec / 3600).toFixed(2)} hrs` },
          { label: 'Days', value: `${(inSec / 86400).toFixed(2)} days` }
        ],
        steps: [`Converted ${val} ${from} to seconds = ${inSec.toLocaleString()} s`]
      };
    },
    formula: 'Time_to = Time_from × (Factor_from / Factor_to)',
    explanation: 'Converts intervals between astronomical and digital units of duration.',
    howToUse: ['Enter duration.', 'Select units.', 'Click Calculate.'],
    example: { inputs: { value: 48, fromUnit: 'hours', toUnit: 'days' }, output: '2.00 days', explanation: '48 hours equals 2 days.' },
    faqs: [{ question: 'How many seconds in a year?', answer: 'Approximately 31,536,000 seconds in a 365-day year.' }],
    keywords: ['time converter', 'hours to days', 'minutes to seconds', 'weeks to hours']
  }
];

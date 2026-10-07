const { toNum, formatNum } = require('./utils.cjs');

const engines = {
  'length-converter': (inputs) => {
    const val = toNum(inputs.value, 10);
    const from = inputs.fromUnit || 'm';
    const to = inputs.toUnit || 'ft';

    // Base in meters
    const toMeters = {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      mi: 1609.344,
      yd: 0.9144,
      ft: 0.3048,
      in: 0.0254,
      nmi: 1852
    };

    const inMeters = val * (toMeters[from] || 1);
    const converted = inMeters / (toMeters[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 4)} ${to}`,
      primaryLabel: `Converted Length (${to})`,
      subtext: `${val} ${from} = ${formatNum(converted, 4)} ${to}`,
      breakdown: [
        { label: 'Input Value', value: `${formatNum(val)} ${from}` },
        { label: 'Base Meter Value', value: `${formatNum(inMeters, 4)} m` },
        { label: 'Converted Output', value: `${formatNum(converted, 6)} ${to}` }
      ],
      steps: [
        `Normalized ${val} ${from} to meters: ${formatNum(inMeters, 4)} m`,
        `Converted meters to ${to}: ${formatNum(converted, 4)} ${to}`
      ]
    };
  },

  'weight-converter': (inputs) => {
    const val = toNum(inputs.value, 150);
    const from = inputs.fromUnit || 'lb';
    const to = inputs.toUnit || 'kg';

    // Base in kg
    const toKg = {
      kg: 1,
      g: 0.001,
      mg: 1e-6,
      lb: 0.45359237,
      oz: 0.028349523,
      st: 6.35029318,
      t: 1000
    };

    const inKg = val * (toKg[from] || 1);
    const converted = inKg / (toKg[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 4)} ${to}`,
      primaryLabel: `Converted Weight (${to})`,
      subtext: `${val} ${from} = ${formatNum(converted, 4)} ${to}`,
      breakdown: [
        { label: 'Input Weight', value: `${formatNum(val)} ${from}` },
        { label: 'Base Kilograms', value: `${formatNum(inKg, 4)} kg` },
        { label: 'Result Weight', value: `${formatNum(converted, 4)} ${to}` }
      ],
      steps: [
        `Converted to base kg: ${val} × ${toKg[from] || 1} = ${formatNum(inKg, 4)} kg`,
        `Converted to ${to}: ${formatNum(converted, 4)} ${to}`
      ]
    };
  },

  'temperature-converter': (inputs) => {
    const val = toNum(inputs.temp, 25);
    const from = (inputs.fromUnit || 'c').toLowerCase();
    const to = (inputs.toUnit || 'f').toLowerCase();

    // Convert from -> Celsius
    let celsius = val;
    if (from === 'f') celsius = (val - 32) * (5 / 9);
    else if (from === 'k') celsius = val - 273.15;
    else if (from === 'r') celsius = (val - 491.67) * (5 / 9);

    // Convert Celsius -> to
    let converted = celsius;
    if (to === 'f') converted = celsius * (9 / 5) + 32;
    else if (to === 'k') converted = celsius + 273.15;
    else if (to === 'r') converted = (celsius + 273.15) * (9 / 5);

    const unitSymbols = { c: '°C', f: '°F', k: 'K', r: '°R' };

    return {
      primaryValue: `${formatNum(converted, 2)} ${unitSymbols[to] || to.toUpperCase()}`,
      primaryLabel: `Temperature in ${unitSymbols[to] || to.toUpperCase()}`,
      subtext: `${val} ${unitSymbols[from] || from.toUpperCase()} = ${formatNum(converted, 2)} ${unitSymbols[to] || to.toUpperCase()}`,
      breakdown: [
        { label: 'Celsius (°C)', value: `${formatNum(celsius, 2)} °C` },
        { label: 'Fahrenheit (°F)', value: `${formatNum(celsius * 1.8 + 32, 2)} °F` },
        { label: 'Kelvin (K)', value: `${formatNum(celsius + 273.15, 2)} K` }
      ],
      steps: [
        `Normalized input to Celsius: ${formatNum(celsius, 2)} °C`,
        `Applied destination formula to ${unitSymbols[to] || to}: ${formatNum(converted, 2)}`
      ]
    };
  },

  'area-converter': (inputs) => {
    const val = toNum(inputs.value, 1);
    const from = inputs.fromUnit || 'acre';
    const to = inputs.toUnit || 'sqft';

    // Base in square meters
    const toSqM = {
      sqm: 1,
      sqkm: 1e6,
      sqft: 0.09290304,
      sqyd: 0.83612736,
      acre: 4046.8564224,
      ha: 10000,
      sqmi: 2589988.110336
    };

    const inSqM = val * (toSqM[from] || 1);
    const converted = inSqM / (toSqM[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 4)} ${to}`,
      primaryLabel: `Area in ${to}`,
      subtext: `${val} ${from} = ${formatNum(converted, 4)} ${to}`,
      breakdown: [
        { label: 'Input Area', value: `${formatNum(val)} ${from}` },
        { label: 'Base Sq Meters', value: `${formatNum(inSqM, 4)} m²` },
        { label: 'Converted Area', value: `${formatNum(converted, 4)} ${to}` }
      ],
      steps: [
        `Converted ${val} ${from} to square meters: ${formatNum(inSqM, 2)} m²`,
        `Converted to ${to}: ${formatNum(converted, 4)} ${to}`
      ]
    };
  },

  'volume-converter': (inputs) => {
    const val = toNum(inputs.value, 5);
    const from = inputs.fromUnit || 'gal';
    const to = inputs.toUnit || 'l';

    // Base in Liters
    const toLiters = {
      l: 1,
      ml: 0.001,
      m3: 1000,
      gal: 3.785411784,
      qt: 0.946352946,
      pt: 0.473176473,
      cup: 0.2365882365,
      floz: 0.0295735295625
    };

    const inL = val * (toLiters[from] || 1);
    const converted = inL / (toLiters[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 4)} ${to}`,
      primaryLabel: `Volume in ${to}`,
      subtext: `${val} ${from} = ${formatNum(converted, 4)} ${to}`,
      breakdown: [
        { label: 'Input Volume', value: `${formatNum(val)} ${from}` },
        { label: 'Base Liters', value: `${formatNum(inL, 4)} L` },
        { label: 'Converted Volume', value: `${formatNum(converted, 4)} ${to}` }
      ],
      steps: [
        `Converted to base liters: ${val} × ${toLiters[from] || 1} = ${formatNum(inL, 4)} L`,
        `Converted to ${to}: ${formatNum(converted, 4)} ${to}`
      ]
    };
  },

  'speed-converter': (inputs) => {
    const val = toNum(inputs.value, 65);
    const from = inputs.fromUnit || 'mph';
    const to = inputs.toUnit || 'kmh';

    // Base in m/s
    const toMs = {
      ms: 1,
      kmh: 1 / 3.6,
      mph: 0.44704,
      knot: 0.514444,
      fts: 0.3048,
      mach: 340.29
    };

    const inMs = val * (toMs[from] || 1);
    const converted = inMs / (toMs[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 2)} ${to}`,
      primaryLabel: `Speed in ${to}`,
      subtext: `${val} ${from} = ${formatNum(converted, 2)} ${to}`,
      breakdown: [
        { label: 'Speed (km/h)', value: `${formatNum(inMs * 3.6, 2)} km/h` },
        { label: 'Speed (mph)', value: `${formatNum(inMs / 0.44704, 2)} mph` },
        { label: 'Speed (m/s)', value: `${formatNum(inMs, 2)} m/s` },
        { label: 'Speed (knots)', value: `${formatNum(inMs / 0.514444, 2)} knots` }
      ],
      steps: [
        `Base meters/second = ${formatNum(inMs, 4)} m/s`,
        `Converted to ${to} = ${formatNum(converted, 2)} ${to}`
      ]
    };
  },

  'data-storage-converter': (inputs) => {
    const val = toNum(inputs.value, 16);
    const from = inputs.fromUnit || 'gb';
    const to = inputs.toUnit || 'mb';

    // Base in Bytes (decimal 1000 base)
    const toBytes = {
      b: 1,
      kb: 1e3,
      mb: 1e6,
      gb: 1e9,
      tb: 1e12,
      pb: 1e15
    };

    const inBytes = val * (toBytes[from] || 1);
    const converted = inBytes / (toBytes[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 2)} ${to.toUpperCase()}`,
      primaryLabel: `Data Storage in ${to.toUpperCase()}`,
      subtext: `${val} ${from.toUpperCase()} = ${formatNum(converted, 2)} ${to.toUpperCase()}`,
      breakdown: [
        { label: 'Total Bytes', value: `${formatNum(inBytes)} B` },
        { label: 'Megabytes (MB)', value: `${formatNum(inBytes / 1e6, 2)} MB` },
        { label: 'Gigabytes (GB)', value: `${formatNum(inBytes / 1e9, 2)} GB` },
        { label: 'Binary Gibibytes (GiB)', value: `${formatNum(inBytes / 1073741824, 3)} GiB` }
      ],
      steps: [
        `Converted ${val} ${from.toUpperCase()} to bytes: ${inBytes.toLocaleString('en-US')} B`,
        `Converted to ${to.toUpperCase()}: ${formatNum(converted, 2)} ${to.toUpperCase()}`
      ]
    };
  },

  'energy-converter': (inputs) => {
    const val = toNum(inputs.value, 1000);
    const from = inputs.fromUnit || 'j';
    const to = inputs.toUnit || 'kcal';

    // Base in Joules
    const toJoules = {
      j: 1,
      kj: 1000,
      cal: 4.184,
      kcal: 4184,
      wh: 3600,
      kwh: 3.6e6,
      btu: 1055.06,
      ftlb: 1.355818
    };

    const inJ = val * (toJoules[from] || 1);
    const converted = inJ / (toJoules[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 4)} ${to}`,
      primaryLabel: `Energy in ${to}`,
      subtext: `${val} ${from} = ${formatNum(converted, 4)} ${to}`,
      breakdown: [
        { label: 'Input Energy', value: `${formatNum(val)} ${from}` },
        { label: 'Base Joules', value: `${formatNum(inJ, 2)} J` },
        { label: 'Converted Output', value: `${formatNum(converted, 4)} ${to}` }
      ],
      steps: [
        `Converted to Joules: ${formatNum(inJ, 2)} J`,
        `Converted to ${to}: ${formatNum(converted, 4)} ${to}`
      ]
    };
  },

  'power-converter': (inputs) => {
    const val = toNum(inputs.value, 300);
    const from = inputs.fromUnit || 'hp';
    const to = inputs.toUnit || 'kw';

    // Base in Watts
    const toWatts = {
      w: 1,
      kw: 1000,
      mw: 1e6,
      hp: 745.699872,
      btu_hr: 0.293071
    };

    const inW = val * (toWatts[from] || 1);
    const converted = inW / (toWatts[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 2)} ${to}`,
      primaryLabel: `Power Output (${to})`,
      subtext: `${val} ${from} = ${formatNum(converted, 2)} ${to}`,
      breakdown: [
        { label: 'Input Power', value: `${formatNum(val)} ${from}` },
        { label: 'Base Watts', value: `${formatNum(inW, 2)} W` },
        { label: 'Horsepower (hp)', value: `${formatNum(inW / 745.7, 2)} hp` },
        { label: 'Kilowatts (kW)', value: `${formatNum(inW / 1000, 2)} kW` }
      ],
      steps: [
        `Base watts: ${formatNum(inW, 2)} W`,
        `Output in ${to}: ${formatNum(converted, 2)} ${to}`
      ]
    };
  },

  'pressure-converter': (inputs) => {
    const val = toNum(inputs.value, 32);
    const from = inputs.fromUnit || 'psi';
    const to = inputs.toUnit || 'bar';

    // Base in Pascals (Pa)
    const toPa = {
      pa: 1,
      kpa: 1000,
      bar: 100000,
      psi: 6894.75729,
      atm: 101325,
      torr: 133.322
    };

    const inPa = val * (toPa[from] || 1);
    const converted = inPa / (toPa[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 4)} ${to}`,
      primaryLabel: `Pressure in ${to}`,
      subtext: `${val} ${from} = ${formatNum(converted, 4)} ${to}`,
      breakdown: [
        { label: 'Input Pressure', value: `${formatNum(val)} ${from}` },
        { label: 'Base Pascals (Pa)', value: `${formatNum(inPa, 2)} Pa` },
        { label: 'Bar', value: `${formatNum(inPa / 100000, 4)} bar` },
        { label: 'PSI', value: `${formatNum(inPa / 6894.76, 2)} psi` },
        { label: 'Atmospheres (atm)', value: `${formatNum(inPa / 101325, 4)} atm` }
      ],
      steps: [
        `Converted to Pascals: ${val} × ${toPa[from] || 1} = ${formatNum(inPa, 2)} Pa`,
        `Converted to ${to}: ${formatNum(converted, 4)} ${to}`
      ]
    };
  },

  'frequency-converter': (inputs) => {
    const val = toNum(inputs.value, 2.4);
    const from = inputs.fromUnit || 'ghz';
    const to = inputs.toUnit || 'mhz';

    // Base in Hz
    const toHz = {
      hz: 1,
      khz: 1e3,
      mhz: 1e6,
      ghz: 1e9,
      rpm: 1 / 60,
      rads: 1 / (2 * Math.PI)
    };

    const inHz = val * (toHz[from] || 1);
    const converted = inHz / (toHz[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 4)} ${to.toUpperCase()}`,
      primaryLabel: `Frequency in ${to.toUpperCase()}`,
      subtext: `${val} ${from.toUpperCase()} = ${formatNum(converted, 4)} ${to.toUpperCase()}`,
      breakdown: [
        { label: 'Base Hertz (Hz)', value: `${formatNum(inHz)} Hz` },
        { label: 'Kilohertz (kHz)', value: `${formatNum(inHz / 1e3, 2)} kHz` },
        { label: 'Megahertz (MHz)', value: `${formatNum(inHz / 1e6, 2)} MHz` },
        { label: 'Gigahertz (GHz)', value: `${formatNum(inHz / 1e9, 4)} GHz` }
      ],
      steps: [
        `Normalized to base Hz: ${formatNum(inHz)} Hz`,
        `Converted to ${to.toUpperCase()}: ${formatNum(converted, 4)} ${to.toUpperCase()}`
      ]
    };
  },

  'angle-converter': (inputs) => {
    const val = toNum(inputs.value, 180);
    const from = inputs.fromUnit || 'deg';
    const to = inputs.toUnit || 'rad';

    // Base in Degrees
    const toDeg = {
      deg: 1,
      rad: 180 / Math.PI,
      grad: 0.9,
      arcmin: 1 / 60,
      arcsec: 1 / 3600,
      rev: 360
    };

    const inDeg = val * (toDeg[from] || 1);
    const converted = inDeg / (toDeg[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 4)} ${to}`,
      primaryLabel: `Angle in ${to}`,
      subtext: `${val} ${from} = ${formatNum(converted, 4)} ${to}`,
      breakdown: [
        { label: 'Degrees (°)', value: `${formatNum(inDeg, 2)}°` },
        { label: 'Radians (rad)', value: `${formatNum(inDeg * (Math.PI / 180), 4)} rad` },
        { label: 'Gradians (grad)', value: `${formatNum(inDeg / 0.9, 2)} grad` }
      ],
      steps: [
        `Base degrees = ${formatNum(inDeg, 4)}°`,
        `Converted to ${to} = ${formatNum(converted, 4)} ${to}`
      ]
    };
  },

  'fuel-economy-converter': (inputs) => {
    const val = toNum(inputs.value, 30);
    const from = inputs.fromUnit || 'mpgus';
    const to = inputs.toUnit || 'l100km';

    // Convert from -> km/L
    let kmL = 0;
    if (from === 'mpgus') kmL = val * 0.425144;
    else if (from === 'mpguk') kmL = val * 0.354006;
    else if (from === 'kml') kmL = val;
    else if (from === 'l100km') kmL = val > 0 ? 100 / val : 0;

    // Convert km/L -> to
    let converted = 0;
    if (to === 'mpgus') converted = kmL / 0.425144;
    else if (to === 'mpguk') converted = kmL / 0.354006;
    else if (to === 'kml') converted = kmL;
    else if (to === 'l100km') converted = kmL > 0 ? 100 / kmL : 0;

    return {
      primaryValue: `${formatNum(converted, 2)} ${to}`,
      primaryLabel: `Fuel Economy in ${to}`,
      subtext: `${val} ${from} = ${formatNum(converted, 2)} ${to}`,
      breakdown: [
        { label: 'US MPG', value: `${formatNum(kmL / 0.425144, 2)} mpg (US)` },
        { label: 'L/100km', value: kmL > 0 ? `${formatNum(100 / kmL, 2)} L/100km` : 'N/A' },
        { label: 'km/L', value: `${formatNum(kmL, 2)} km/L` }
      ],
      steps: [
        `Normalized to km/L: ${formatNum(kmL, 3)} km/L`,
        `Converted to ${to}: ${formatNum(converted, 2)}`
      ]
    };
  },

  'torque-converter': (inputs) => {
    const val = toNum(inputs.value, 100);
    const from = inputs.fromUnit || 'nm';
    const to = inputs.toUnit || 'ftlb';

    // Base in Newton-meters (N·m)
    const toNm = {
      nm: 1,
      ftlb: 1.355818,
      inlb: 0.112985,
      kgfm: 9.80665
    };

    const inNm = val * (toNm[from] || 1);
    const converted = inNm / (toNm[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 2)} ${to}`,
      primaryLabel: `Torque in ${to}`,
      subtext: `${val} ${from} = ${formatNum(converted, 2)} ${to}`,
      breakdown: [
        { label: 'Newton-meters (N·m)', value: `${formatNum(inNm, 2)} N·m` },
        { label: 'Foot-pounds (ft·lb)', value: `${formatNum(inNm / 1.355818, 2)} ft·lb` },
        { label: 'Inch-pounds (in·lb)', value: `${formatNum(inNm / 0.112985, 2)} in·lb` }
      ],
      steps: [
        `Base N·m: ${formatNum(inNm, 3)} N·m`,
        `Converted to ${to}: ${formatNum(converted, 2)} ${to}`
      ]
    };
  },

  'force-converter': (inputs) => {
    const val = toNum(inputs.value, 500);
    const from = inputs.fromUnit || 'n';
    const to = inputs.toUnit || 'lbf';

    // Base in Newtons (N)
    const toN = {
      n: 1,
      kn: 1000,
      lbf: 4.448222,
      dyne: 1e-5,
      kgf: 9.80665
    };

    const inN = val * (toN[from] || 1);
    const converted = inN / (toN[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 2)} ${to}`,
      primaryLabel: `Force in ${to}`,
      subtext: `${val} ${from} = ${formatNum(converted, 2)} ${to}`,
      breakdown: [
        { label: 'Newtons (N)', value: `${formatNum(inN, 2)} N` },
        { label: 'Kilonewtons (kN)', value: `${formatNum(inN / 1000, 4)} kN` },
        { label: 'Pounds-force (lbf)', value: `${formatNum(inN / 4.448222, 2)} lbf` }
      ],
      steps: [
        `Base force in Newtons: ${formatNum(inN, 3)} N`,
        `Converted to ${to}: ${formatNum(converted, 2)} ${to}`
      ]
    };
  },

  'mass-converter': (inputs) => {
    const val = toNum(inputs.value, 5);
    const from = inputs.fromUnit || 'g';
    const to = inputs.toUnit || 'ct';

    // Base in Grams (g)
    const toGrams = {
      g: 1,
      mg: 0.001,
      ug: 1e-6,
      ct: 0.2
    };

    const inG = val * (toGrams[from] || 1);
    const converted = inG / (toGrams[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 4)} ${to}`,
      primaryLabel: `Precision Mass (${to})`,
      subtext: `${val} ${from} = ${formatNum(converted, 4)} ${to}`,
      breakdown: [
        { label: 'Grams (g)', value: `${formatNum(inG, 4)} g` },
        { label: 'Milligrams (mg)', value: `${formatNum(inG * 1000, 2)} mg` },
        { label: 'Carats (ct)', value: `${formatNum(inG / 0.2, 4)} ct` }
      ],
      steps: [
        `Base grams: ${formatNum(inG, 6)} g`,
        `Converted to ${to}: ${formatNum(converted, 4)} ${to}`
      ]
    };
  },

  'time-converter': (inputs) => {
    const val = toNum(inputs.value, 48);
    const from = inputs.fromUnit || 'hours';
    const to = inputs.toUnit || 'days';

    // Base in Seconds
    const toSecs = {
      seconds: 1,
      ms: 0.001,
      minutes: 60,
      hours: 3600,
      days: 86400,
      weeks: 604800,
      years: 31536000
    };

    const inSecs = val * (toSecs[from] || 1);
    const converted = inSecs / (toSecs[to] || 1);

    return {
      primaryValue: `${formatNum(converted, 4)} ${to}`,
      primaryLabel: `Converted Time (${to})`,
      subtext: `${val} ${from} = ${formatNum(converted, 4)} ${to}`,
      breakdown: [
        { label: 'Input Value', value: `${formatNum(val)} ${from}` },
        { label: 'Base Seconds', value: `${formatNum(inSecs)} sec` },
        { label: 'Result Time', value: `${formatNum(converted, 4)} ${to}` }
      ],
      steps: [
        `Base seconds = ${formatNum(inSecs)} s`,
        `Converted to ${to} = ${formatNum(converted, 4)} ${to}`
      ]
    };
  }
};

module.exports = engines;


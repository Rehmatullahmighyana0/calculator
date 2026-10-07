const { toNum, formatNum, gcd } = require('./utils.cjs');

const engines = {
  'ip-subnet-calculator': (inputs) => {
    const ipStr = String(inputs.ip || '192.168.1.100').trim();
    const cidr = Math.min(Math.max(Math.round(toNum(inputs.cidr, 24)), 0), 32);

    const ipParts = ipStr.split('.').map(Number);
    if (ipParts.length !== 4 || ipParts.some((p) => isNaN(p) || p < 0 || p > 255)) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter a valid IPv4 address (e.g. 192.168.1.1).' };
    }

    const ipInt = ((ipParts[0] << 24) >>> 0) + ((ipParts[1] << 16) >>> 0) + ((ipParts[2] << 8) >>> 0) + (ipParts[3] >>> 0);
    const maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    const netInt = (ipInt & maskInt) >>> 0;
    const bcastInt = (netInt | ~maskInt) >>> 0;

    const intToIp = (val) => [
      (val >>> 24) & 255,
      (val >>> 16) & 255,
      (val >>> 8) & 255,
      val & 255
    ].join('.');

    const netIp = intToIp(netInt);
    const bcastIp = intToIp(bcastInt);
    const maskIp = intToIp(maskInt);
    const wildcardIp = intToIp(~maskInt >>> 0);

    const totalHosts = Math.pow(2, 32 - cidr);
    const usableHosts = cidr >= 31 ? (cidr === 31 ? 2 : 1) : Math.max(0, totalHosts - 2);

    const firstUsable = cidr >= 31 ? netIp : intToIp(netInt + 1);
    const lastUsable = cidr >= 31 ? bcastIp : intToIp(bcastInt - 1);

    return {
      primaryValue: `${netIp} / ${cidr}`,
      primaryLabel: 'Subnet Network Address',
      subtext: `Usable Host Range: ${firstUsable} - ${lastUsable} (${usableHosts.toLocaleString('en-US')} hosts)`,
      breakdown: [
        { label: 'IP Address', value: ipStr },
        { label: 'Subnet Mask', value: `${maskIp} (/${cidr})` },
        { label: 'Network ID', value: netIp },
        { label: 'Broadcast Address', value: bcastIp },
        { label: 'First Usable Host', value: firstUsable },
        { label: 'Last Usable Host', value: lastUsable },
        { label: 'Usable Host Capacity', value: `${usableHosts.toLocaleString('en-US')} hosts` },
        { label: 'Wildcard Mask', value: wildcardIp }
      ],
      steps: [
        `Converted ${ipStr} to 32-bit binary representation`,
        `Applied subnet mask /${cidr} (${maskIp})`,
        `Network Address = IP AND Mask = ${netIp}`,
        `Broadcast = Network OR Wildcard = ${bcastIp}`,
        `Usable Hosts = 2^(32 - ${cidr}) - 2 = ${usableHosts.toLocaleString('en-US')}`
      ]
    };
  },

  'download-time-calculator': (inputs) => {
    const sizeGB = toNum(inputs.fileSizeGB, 50);
    const speedMbps = toNum(inputs.speedMbps, 100);

    if (sizeGB <= 0 || speedMbps <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'File size and speed must be positive.' };

    const totalBits = sizeGB * 8 * 1024 * 1024 * 1024;
    const speedBitsPerSec = speedMbps * 1e6;
    const totalSeconds = totalBits / speedBitsPerSec;

    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.round(totalSeconds % 60);

    const mbPerSec = speedMbps / 8;

    return {
      primaryValue: `${hours > 0 ? hours + 'h ' : ''}${mins}m ${secs}s`,
      primaryLabel: 'Estimated Transfer Duration',
      subtext: `Transfer Speed: ${formatNum(mbPerSec, 2)} MB/s (${speedMbps} Mbps)`,
      breakdown: [
        { label: 'File Size', value: `${sizeGB} GB (${formatNum(sizeGB * 1024, 0)} MB)` },
        { label: 'Network Bandwidth', value: `${speedMbps} Mbps (${formatNum(mbPerSec, 2)} MB/sec)` },
        { label: 'Estimated Download Time', value: `${hours} hours, ${mins} minutes, ${secs} seconds` },
        { label: 'Total Seconds', value: `${Math.round(totalSeconds).toLocaleString('en-US')} sec` }
      ],
      steps: [
        `Total bits = ${sizeGB} GB × 8 × 1024³ = ${totalBits.toExponential(3)} bits`,
        `Transfer rate = ${speedMbps} Mbps = ${formatNum(mbPerSec, 2)} MB/second`,
        `Duration = ${totalBits.toExponential(3)} / (${speedMbps} × 10⁶) = ${Math.round(totalSeconds)} seconds`
      ]
    };
  },

  'binary-calculator': (inputs) => {
    const bin1 = String(inputs.bin1 || '1101').trim();
    const bin2 = String(inputs.bin2 || '1010').trim();
    const op = inputs.op || '+';

    if (!/^[01]+$/.test(bin1) || !/^[01]+$/.test(bin2)) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Inputs must be valid binary strings containing only 0 and 1.' };
    }

    const n1 = parseInt(bin1, 2);
    const n2 = parseInt(bin2, 2);

    let resInt = 0;
    if (op === '+') resInt = n1 + n2;
    else if (op === '-') resInt = n1 - n2;
    else if (op === '*') resInt = n1 * n2;
    else if (op === '/') {
      if (n2 === 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Division by zero is undefined.' };
      resInt = Math.floor(n1 / n2);
    } else if (op === 'AND') resInt = (n1 & n2) >>> 0;
    else if (op === 'OR') resInt = (n1 | n2) >>> 0;
    else if (op === 'XOR') resInt = (n1 ^ n2) >>> 0;

    const resBin = resInt < 0 ? `-${Math.abs(resInt).toString(2)}` : resInt.toString(2);

    return {
      primaryValue: `${resBin} (bin)`,
      primaryLabel: `Binary Output (${bin1} ${op} ${bin2})`,
      subtext: `Decimal Value: ${resInt} | Hex: 0x${Math.abs(resInt).toString(16).toUpperCase()}`,
      breakdown: [
        { label: 'Binary Operand 1', value: `${bin1} (dec: ${n1})` },
        { label: 'Binary Operand 2', value: `${bin2} (dec: ${n2})` },
        { label: 'Operation', value: op },
        { label: 'Binary Result', value: `${resBin}` },
        { label: 'Decimal Equivalent', value: `${resInt}` },
        { label: 'Hex Equivalent', value: `0x${Math.abs(resInt).toString(16).toUpperCase()}` }
      ],
      steps: [
        `Convert to decimal: ${bin1}₂ = ${n1}₁₀, ${bin2}₂ = ${n2}₁₀`,
        `Compute: ${n1} ${op} ${n2} = ${resInt}`,
        `Convert back to binary: ${resInt} = ${resBin}₂`
      ]
    };
  },

  'decimal-to-binary': (inputs) => {
    const dec = Math.round(toNum(inputs.decimal, 156));
    const bin = Math.abs(dec).toString(2);
    const hex = Math.abs(dec).toString(16).toUpperCase();
    const oct = Math.abs(dec).toString(8);

    return {
      primaryValue: `${dec < 0 ? '-' : ''}${bin} (base 2)`,
      primaryLabel: 'Binary Representation',
      subtext: `Hex: 0x${hex} | Octal: 0o${oct}`,
      breakdown: [
        { label: 'Decimal Integer', value: `${dec}` },
        { label: 'Binary (Base 2)', value: `${dec < 0 ? '-' : ''}${bin}` },
        { label: 'Hexadecimal (Base 16)', value: `0x${hex}` },
        { label: 'Octal (Base 8)', value: `0o${oct}` },
        { label: 'Bit Length', value: `${bin.length} bits` }
      ],
      steps: [
        `Repeatedly divide ${Math.abs(dec)} by 2 and collect remainders`,
        `Remainders in reverse order = ${bin}₂`
      ]
    };
  },

  'binary-to-decimal': (inputs) => {
    const raw = String(inputs.binary || '10011100').trim();
    if (!/^[01]+$/.test(raw)) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Input must be a valid binary sequence (0s and 1s).' };
    }

    const dec = parseInt(raw, 2);
    const hex = dec.toString(16).toUpperCase();
    const oct = dec.toString(8);

    return {
      primaryValue: `${dec.toLocaleString('en-US')} (base 10)`,
      primaryLabel: 'Decimal Representation',
      subtext: `Hex: 0x${hex} | Octal: 0o${oct}`,
      breakdown: [
        { label: 'Binary String', value: raw },
        { label: 'Decimal (Base 10)', value: `${dec.toLocaleString('en-US')}` },
        { label: 'Hexadecimal (Base 16)', value: `0x${hex}` },
        { label: 'Octal (Base 8)', value: `0o${oct}` }
      ],
      steps: [
        `Expanded positional powers of 2 for ${raw}:`,
        raw.split('').reverse().map((bit, idx) => bit === '1' ? `2^${idx} (${Math.pow(2, idx)})` : null).filter(Boolean).join(' + ') + ` = ${dec}`
      ]
    };
  },

  'hexadecimal-converter': (inputs) => {
    const hex = String(inputs.hex || 'FF45').trim().replace(/^0x/i, '');
    if (!/^[0-9A-Fa-f]+$/.test(hex)) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter a valid hexadecimal string (0-9, A-F).' };
    }

    const dec = parseInt(hex, 16);
    const bin = dec.toString(2);
    const oct = dec.toString(8);

    return {
      primaryValue: `${dec.toLocaleString('en-US')} (Decimal)`,
      primaryLabel: 'Decimal Equivalent of 0x' + hex.toUpperCase(),
      subtext: `Binary: ${bin} | Octal: 0o${oct}`,
      breakdown: [
        { label: 'Hex Input', value: `0x${hex.toUpperCase()}` },
        { label: 'Decimal (Base 10)', value: `${dec.toLocaleString('en-US')}` },
        { label: 'Binary (Base 2)', value: `${bin}` },
        { label: 'Octal (Base 8)', value: `0o${oct}` }
      ],
      steps: [
        `Parsed base 16: 0x${hex.toUpperCase()} = ${dec}`,
        `Binary representation = ${bin}₂`
      ]
    };
  },

  'octal-converter': (inputs) => {
    const oct = String(inputs.octal || '755').trim().replace(/^0o/i, '');
    if (!/^[0-7]+$/.test(oct)) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Octal numbers can only contain digits from 0 to 7.' };
    }

    const dec = parseInt(oct, 8);
    const bin = dec.toString(2);
    const hex = dec.toString(16).toUpperCase();

    return {
      primaryValue: `${dec.toLocaleString('en-US')} (Decimal)`,
      primaryLabel: 'Decimal Equivalent of 0o' + oct,
      subtext: `Binary: ${bin} | Hex: 0x${hex}`,
      breakdown: [
        { label: 'Octal Input', value: `0o${oct}` },
        { label: 'Decimal (Base 10)', value: `${dec.toLocaleString('en-US')}` },
        { label: 'Binary (Base 2)', value: `${bin}` },
        { label: 'Hexadecimal (Base 16)', value: `0x${hex}` }
      ],
      steps: [
        `Expanded base 8: ${oct}₈ = ${dec}₁₀`,
        `Binary conversion: ${bin}₂`
      ]
    };
  },

  'base-converter': (inputs) => {
    const numStr = String(inputs.num || '10110').trim();
    const fromB = Math.min(Math.max(Math.round(toNum(inputs.fromBase, 2)), 2), 36);
    const toB = Math.min(Math.max(Math.round(toNum(inputs.toBase, 10)), 2), 36);

    try {
      const dec = parseInt(numStr, fromB);
      if (isNaN(dec)) return { primaryValue: 'Error', primaryLabel: 'Result', error: `String "${numStr}" is invalid for Base ${fromB}.` };

      const out = dec.toString(toB).toUpperCase();

      return {
        primaryValue: `${out} (Base ${toB})`,
        primaryLabel: `Converted to Base ${toB}`,
        subtext: `Original: ${numStr} (Base ${fromB}) = ${dec} (Decimal)`,
        breakdown: [
          { label: 'Input Value', value: `${numStr} (Base ${fromB})` },
          { label: 'Decimal Intermediate', value: `${dec}` },
          { label: 'Target Output', value: `${out} (Base ${toB})` }
        ],
        steps: [
          `Converted ${numStr} from base ${fromB} to decimal: ${dec}`,
          `Converted ${dec} from decimal to base ${toB}: ${out}`
        ]
      };
    } catch (e) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Base conversion failed.' };
    }
  },

  'bandwidth-calculator': (inputs) => {
    const speed = toNum(inputs.speed, 100);
    const unit = inputs.unit || 'mbps';

    let mbps = speed;
    if (unit === 'kbps') mbps = speed / 1000;
    else if (unit === 'gbps') mbps = speed * 1000;

    const mbPerSec = mbps / 8;
    const gbPerHour = (mbPerSec * 3600) / 1024;
    const tbPerMonth = (gbPerHour * 24 * 30.4) / 1024;

    return {
      primaryValue: `${formatNum(mbPerSec, 2)} MB/s`,
      primaryLabel: 'Real Data Throughput',
      subtext: `Hourly capacity: ${formatNum(gbPerHour, 1)} GB/hr | Monthly cap: ${formatNum(tbPerMonth, 2)} TB/month`,
      breakdown: [
        { label: 'Network Speed', value: `${speed} ${unit.toUpperCase()}` },
        { label: 'Megabytes per Second (MB/s)', value: `${formatNum(mbPerSec, 2)} MB/s` },
        { label: 'Hourly Data Transfer', value: `${formatNum(gbPerHour, 2)} GB / hr` },
        { label: 'Monthly Sustained Capacity', value: `${formatNum(tbPerMonth, 2)} TB / month` }
      ],
      steps: [
        `Divide Megabits by 8 to get Megabytes: ${mbps} / 8 = ${formatNum(mbPerSec, 2)} MB/s`,
        `Multiply by 3600 seconds = ${formatNum(gbPerHour, 2)} GB per hour`
      ]
    };
  },

  'storage-calculator': (inputs) => {
    const driveSize = toNum(inputs.driveSizeTB, 4);
    const count = Math.max(1, Math.round(toNum(inputs.numDrives, 4)));
    const raid = inputs.raidLevel || 'raid5';

    let usableTB = 0;
    let faultTolerance = '';
    let efficiency = 0;

    if (raid === 'raid0') {
      usableTB = driveSize * count;
      faultTolerance = '0 Drives (No redundancy)';
      efficiency = 100;
    } else if (raid === 'raid1') {
      usableTB = driveSize;
      faultTolerance = `${count - 1} Drive(s)`;
      efficiency = 100 / count;
    } else if (raid === 'raid5') {
      usableTB = driveSize * Math.max(0, count - 1);
      faultTolerance = '1 Drive parity failure';
      efficiency = count >= 3 ? ((count - 1) / count) * 100 : 0;
    } else if (raid === 'raid6') {
      usableTB = driveSize * Math.max(0, count - 2);
      faultTolerance = '2 Concurrent Drive failures';
      efficiency = count >= 4 ? ((count - 2) / count) * 100 : 0;
    } else if (raid === 'raid10') {
      usableTB = driveSize * (count / 2);
      faultTolerance = '1 Drive per mirror pair';
      efficiency = 50;
    }

    const rawTotal = driveSize * count;

    return {
      primaryValue: `${formatNum(usableTB, 1)} TB Usable`,
      primaryLabel: `RAID Configuration (${raid.toUpperCase()})`,
      subtext: `Raw Storage: ${rawTotal} TB | Efficiency: ${formatNum(efficiency, 1)}% | Tolerance: ${faultTolerance}`,
      breakdown: [
        { label: 'Array Configuration', value: `${count} × ${driveSize} TB (${rawTotal} TB Raw)` },
        { label: 'RAID Architecture', value: raid.toUpperCase() },
        { label: 'Usable Array Capacity', value: `${formatNum(usableTB, 2)} TB` },
        { label: 'Parity / Mirror Overhead', value: `${formatNum(rawTotal - usableTB, 2)} TB` },
        { label: 'Fault Tolerance', value: faultTolerance }
      ],
      steps: [
        `Raw Total = ${count} drives × ${driveSize} TB = ${rawTotal} TB`,
        `Calculated usable space under ${raid.toUpperCase()}: ${formatNum(usableTB, 1)} TB (${formatNum(efficiency, 1)}% storage efficiency)`
      ]
    };
  },

  'px-to-rem': (inputs) => {
    const px = toNum(inputs.px, 24);
    const base = toNum(inputs.base, 16);

    if (base <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Base root font size must be greater than zero.' };

    const rem = px / base;

    return {
      primaryValue: `${formatNum(rem, 4)} rem`,
      primaryLabel: `${px}px in REM`,
      subtext: `Base Root: ${base}px | CSS: font-size: ${formatNum(rem, 3)}rem;`,
      breakdown: [
        { label: 'Pixel Value (px)', value: `${px}px` },
        { label: 'Root Font Size (html)', value: `${base}px` },
        { label: 'Calculated REM', value: `${formatNum(rem, 4)}rem` },
        { label: 'CSS Snippet', value: `font-size: ${formatNum(rem, 3)}rem; /* ${px}px */` }
      ],
      steps: [
        `Formula: rem = px / base_font_size`,
        `rem = ${px} / ${base} = ${formatNum(rem, 4)} rem`
      ]
    };
  },

  'rem-to-px': (inputs) => {
    const rem = toNum(inputs.rem, 1.5);
    const base = toNum(inputs.base, 16);

    const px = rem * base;

    return {
      primaryValue: `${formatNum(px, 2)} px`,
      primaryLabel: `${rem}rem in Pixels`,
      subtext: `Base Root: ${base}px | Exact: ${formatNum(px, 1)}px`,
      breakdown: [
        { label: 'REM Value', value: `${rem}rem` },
        { label: 'Root Base Font', value: `${base}px` },
        { label: 'Rendered Pixels', value: `${formatNum(px, 2)}px` }
      ],
      steps: [
        `Formula: px = rem × base_font_size`,
        `px = ${rem} × ${base} = ${formatNum(px, 2)} px`
      ]
    };
  },

  'rgb-to-hex': (inputs) => {
    const r = Math.min(255, Math.max(0, Math.round(toNum(inputs.r, 59))));
    const g = Math.min(255, Math.max(0, Math.round(toNum(inputs.g, 130))));
    const b = Math.min(255, Math.max(0, Math.round(toNum(inputs.b, 246))));

    const toHexStr = (n) => {
      const h = n.toString(16).toUpperCase();
      return h.length === 1 ? '0' + h : h;
    };

    const hex = `#${toHexStr(r)}${toHexStr(g)}${toHexStr(b)}`;

    return {
      primaryValue: hex,
      primaryLabel: 'HEX Color Code',
      subtext: `rgb(${r}, ${g}, ${b})`,
      breakdown: [
        { label: 'Red Channel (R)', value: `${r} -> ${toHexStr(r)}` },
        { label: 'Green Channel (G)', value: `${g} -> ${toHexStr(g)}` },
        { label: 'Blue Channel (B)', value: `${b} -> ${toHexStr(b)}` },
        { label: 'HEX Code', value: hex },
        { label: 'CSS Property', value: `color: ${hex};` }
      ],
      steps: [
        `Convert each 8-bit channel to 2-digit hexadecimal`,
        `R: ${r} = ${toHexStr(r)}, G: ${g} = ${toHexStr(g)}, B: ${b} = ${toHexStr(b)}`,
        `Combine: ${hex}`
      ]
    };
  },

  'hex-to-rgb': (inputs) => {
    let hex = String(inputs.hex || '#3B82F6').trim().replace(/^#/, '');

    if (hex.length === 3) {
      hex = hex.split('').map((c) => c + c).join('');
    }

    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter a valid 3-character or 6-character hex code (e.g. #3B82F6 or #FFF).' };
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);

    const rgbStr = `rgb(${r}, ${g}, ${b})`;

    return {
      primaryValue: rgbStr,
      primaryLabel: 'RGB Color Channels',
      subtext: `HEX: #${hex.toUpperCase()}`,
      breakdown: [
        { label: 'HEX Input', value: `#${hex.toUpperCase()}` },
        { label: 'Red (0 - 255)', value: `${r}` },
        { label: 'Green (0 - 255)', value: `${g}` },
        { label: 'Blue (0 - 255)', value: `${b}` },
        { label: 'CSS rgb()', value: rgbStr },
        { label: 'CSS rgba() (100%)', value: `rgba(${r}, ${g}, ${b}, 1.0)` }
      ],
      steps: [
        `Extracted Red: 0x${hex.slice(0, 2)} = ${r}`,
        `Extracted Green: 0x${hex.slice(2, 4)} = ${g}`,
        `Extracted Blue: 0x${hex.slice(4, 6)} = ${b}`,
        `Result: ${rgbStr}`
      ]
    };
  },

  'rgb-to-hsl': (inputs) => {
    const r = Math.min(255, Math.max(0, toNum(inputs.r, 59))) / 255;
    const g = Math.min(255, Math.max(0, toNum(inputs.g, 130))) / 255;
    const b = Math.min(255, Math.max(0, toNum(inputs.b, 246))) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let h = 0;
    let s = 0;
    let l = (max + min) / 2;

    if (delta !== 0) {
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
      if (max === r) h = (g - b) / delta + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / delta + 2;
      else h = (r - g) / delta + 4;
      h *= 60;
    }

    const hDeg = Math.round(h);
    const sPct = Math.round(s * 100);
    const lPct = Math.round(l * 100);

    const hslStr = `hsl(${hDeg}, ${sPct}%, ${lPct}%)`;

    return {
      primaryValue: hslStr,
      primaryLabel: 'HSL Color String',
      subtext: `Hue: ${hDeg}° | Saturation: ${sPct}% | Lightness: ${lPct}%`,
      breakdown: [
        { label: 'Hue (0 - 360°)', value: `${hDeg}°` },
        { label: 'Saturation (0 - 100%)', value: `${sPct}%` },
        { label: 'Lightness (0 - 100%)', value: `${lPct}%` },
        { label: 'CSS HSL', value: hslStr }
      ],
      steps: [
        `Normalized RGB channels to [0, 1] range`,
        `Calculated Lightness: (max + min) / 2 = ${lPct}%`,
        `Calculated Saturation: ${sPct}%`,
        `Calculated Hue Angle: ${hDeg}°`
      ]
    };
  },

  'hsl-to-rgb': (inputs) => {
    let h = toNum(inputs.h, 217) % 360;
    if (h < 0) h += 360;
    const s = Math.min(100, Math.max(0, toNum(inputs.s, 91))) / 100;
    const l = Math.min(100, Math.max(0, toNum(inputs.l, 60))) / 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let r_ = 0, g_ = 0, b_ = 0;
    if (h >= 0 && h < 60) { r_ = c; g_ = x; b_ = 0; }
    else if (h >= 60 && h < 120) { r_ = x; g_ = c; b_ = 0; }
    else if (h >= 120 && h < 180) { r_ = 0; g_ = c; b_ = x; }
    else if (h >= 180 && h < 240) { r_ = 0; g_ = x; b_ = c; }
    else if (h >= 240 && h < 300) { r_ = x; g_ = 0; b_ = c; }
    else { r_ = c; g_ = 0; b_ = x; }

    const r = Math.round((r_ + m) * 255);
    const g = Math.round((g_ + m) * 255);
    const b = Math.round((b_ + m) * 255);

    const rgbStr = `rgb(${r}, ${g}, ${b})`;

    return {
      primaryValue: rgbStr,
      primaryLabel: 'RGB Color Output',
      subtext: `From hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
      breakdown: [
        { label: 'Red (R)', value: `${r}` },
        { label: 'Green (G)', value: `${g}` },
        { label: 'Blue (B)', value: `${b}` },
        { label: 'CSS Code', value: `background-color: ${rgbStr};` }
      ],
      steps: [
        `Chroma C = (1 - |2L - 1|) × S = ${formatNum(c, 3)}`,
        `Intermediate component X = ${formatNum(x, 3)}`,
        `Calculated RGB coordinates = ${rgbStr}`
      ]
    };
  },

  'color-contrast': (inputs) => {
    const parseHex = (hexStr) => {
      let hex = String(hexStr || '').trim().replace(/^#/, '');
      if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
      if (!/^[0-9A-Fa-f]{6}$/.test(hex)) return [255, 255, 255];
      return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
    };

    const getLuminance = (r, g, b) => {
      const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const [r1, g1, b1] = parseHex(inputs.foreground || '#FFFFFF');
    const [r2, g2, b2] = parseHex(inputs.background || '#1E293B');

    const l1 = getLuminance(r1, g1, b1);
    const l2 = getLuminance(r2, g2, b2);

    const brighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    const ratio = (brighter + 0.05) / (darker + 0.05);

    const passAANormal = ratio >= 4.5;
    const passAALarge = ratio >= 3.0;
    const passAAANormal = ratio >= 7.0;
    const passAAALarge = ratio >= 4.5;

    return {
      primaryValue: `${formatNum(ratio, 2)} : 1`,
      primaryLabel: 'WCAG Contrast Ratio',
      subtext: passAANormal ? 'PASSES WCAG AA Standard (Accessible)' : 'FAILS standard contrast threshold (< 4.5:1)',
      breakdown: [
        { label: 'Foreground', value: `rgb(${r1}, ${g1}, ${b1})` },
        { label: 'Background', value: `rgb(${r2}, ${g2}, ${b2})` },
        { label: 'Contrast Ratio', value: `${formatNum(ratio, 2)}:1` },
        { label: 'WCAG AA (Normal Text ≥ 4.5)', value: passAANormal ? 'PASS (Compliant)' : 'FAIL' },
        { label: 'WCAG AA (Large Text ≥ 3.0)', value: passAALarge ? 'PASS (Compliant)' : 'FAIL' },
        { label: 'WCAG AAA (Enhanced ≥ 7.0)', value: passAAANormal ? 'PASS (Compliant)' : 'FAIL' }
      ],
      steps: [
        `Relative luminance: L₁ = ${formatNum(l1, 4)}, L₂ = ${formatNum(l2, 4)}`,
        `Ratio = (L_bright + 0.05) / (L_dark + 0.05) = ${formatNum(ratio, 2)}:1`,
        passAANormal ? `Meets accessibility guidelines for body and interface text.` : `Insufficient contrast; text may be difficult to read.`
      ]
    };
  },

  'aspect-ratio-calculator': (inputs) => {
    const origW = toNum(inputs.originalWidth, 1920);
    const origH = toNum(inputs.originalHeight, 1080);
    const newW = toNum(inputs.newWidth, 1280);

    if (origW <= 0 || origH <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Dimensions must be strictly positive.' };

    const d = gcd(origW, origH);
    const ratioW = origW / d;
    const ratioH = origH / d;

    const scaledH = newW > 0 ? (origH / origW) * newW : origH;

    return {
      primaryValue: `${ratioW} : ${ratioH}`,
      primaryLabel: 'Aspect Ratio',
      subtext: newW > 0 ? `Scaled Dimension: ${newW} × ${formatNum(scaledH, 0)} px` : `Decimal Ratio: ${formatNum(origW / origH, 3)}`,
      breakdown: [
        { label: 'Original Resolution', value: `${origW} × ${origH}` },
        { label: 'Simplified Ratio', value: `${ratioW}:${ratioH}` },
        { label: 'Decimal Multiplier', value: formatNum(origW / origH, 4) },
        { label: 'Scaled Resolution', value: newW > 0 ? `${newW} × ${Math.round(scaledH)} px` : 'N/A' }
      ],
      steps: [
        `GCD(${origW}, ${origH}) = ${d}`,
        `Aspect Ratio = (${origW} / ${d}) : (${origH} / ${d}) = ${ratioW}:${ratioH}`,
        newW > 0 ? `Scaled Height = (${origH} / ${origW}) × ${newW} = ${Math.round(scaledH)} px` : ''
      ].filter(Boolean)
    };
  },

  'reading-time-calculator': (inputs) => {
    const text = String(inputs.text || '').trim();
    const wpm = toNum(inputs.wpm, 200);

    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const chars = text.length;
    const sentences = text ? (text.match(/[.!?]+/g) || []).length : 0;

    const readingSeconds = wpm > 0 ? Math.round((words / wpm) * 60) : 0;
    const readMins = Math.floor(readingSeconds / 60);
    const readSecs = readingSeconds % 60;

    const speakingSeconds = Math.round((words / 130) * 60); // approx 130 wpm speaking
    const speakMins = Math.floor(speakingSeconds / 60);
    const speakSecs = speakingSeconds % 60;

    return {
      primaryValue: `${readMins > 0 ? readMins + ' min ' : ''}${readSecs} sec`,
      primaryLabel: `Reading Time (@ ${wpm} WPM)`,
      subtext: `Word Count: ${words.toLocaleString('en-US')} | Characters: ${chars.toLocaleString('en-US')}`,
      breakdown: [
        { label: 'Word Count', value: `${words.toLocaleString('en-US')} words` },
        { label: 'Character Count', value: `${chars.toLocaleString('en-US')} characters` },
        { label: 'Sentence Count', value: `${Math.max(1, sentences)} sentences` },
        { label: 'Silent Reading Time', value: `${readMins}m ${readSecs}s` },
        { label: 'Speech / Presentation Time', value: `${speakMins}m ${speakSecs}s` }
      ],
      steps: [
        `Word count parsed: ${words} words`,
        `Reading duration: (${words} / ${wpm} WPM) × 60 = ${readingSeconds} seconds`,
        `Estimated speaking time: (${words} / 130 WPM) × 60 = ${speakingSeconds} seconds`
      ]
    };
  },

  'json-size-calculator': (inputs) => {
    const raw = String(inputs.jsonInput || '{"name": "CalcHub"}').trim();

    const rawBytes = new Blob([raw]).size;
    let minified = raw;
    let keyCount = 0;

    try {
      const parsed = JSON.parse(raw);
      minified = JSON.stringify(parsed);
      keyCount = typeof parsed === 'object' && parsed !== null ? Object.keys(parsed).length : 1;
    } catch (e) {
      // Just strip whitespace if not valid JSON
      minified = raw.replace(/\s+/g, '');
    }

    const minBytes = new Blob([minified]).size;
    const savings = rawBytes > 0 ? ((rawBytes - minBytes) / rawBytes) * 100 : 0;

    return {
      primaryValue: `${rawBytes.toLocaleString('en-US')} Bytes`,
      primaryLabel: 'JSON Payload Size',
      subtext: `Minified Size: ${minBytes} B | Compression Savings: ${formatNum(savings, 1)}%`,
      breakdown: [
        { label: 'Raw String Size', value: `${rawBytes} bytes (${formatNum(rawBytes / 1024, 2)} KB)` },
        { label: 'Minified Size', value: `${minBytes} bytes (${formatNum(minBytes / 1024, 2)} KB)` },
        { label: 'Whitespace Saved', value: `${rawBytes - minBytes} bytes (${formatNum(savings, 1)}%)` },
        { label: 'Top-level Keys', value: `${keyCount}` }
      ],
      steps: [
        `Raw UTF-8 byte calculation: ${rawBytes} bytes`,
        `Minification removed ${rawBytes - minBytes} whitespace characters`,
        `Payload optimized to ${minBytes} bytes`
      ]
    };
  },

  'unix-permissions-calculator': (inputs) => {
    const octal = String(inputs.octal || '755').trim().replace(/[^0-7]/g, '');

    if (octal.length !== 3) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter a 3-digit octal permission code (e.g. 755 or 644).' };
    }

    const u = parseInt(octal[0], 10);
    const g = parseInt(octal[1], 10);
    const o = parseInt(octal[2], 10);

    const permToStr = (val) => {
      const r = (val & 4) ? 'r' : '-';
      const w = (val & 2) ? 'w' : '-';
      const x = (val & 1) ? 'x' : '-';
      return `${r}${w}${x}`;
    };

    const userStr = permToStr(u);
    const groupStr = permToStr(g);
    const otherStr = permToStr(o);
    const symbolic = `-${userStr}${groupStr}${otherStr}`;

    return {
      primaryValue: symbolic,
      primaryLabel: 'Symbolic Permission Notation',
      subtext: `chmod ${octal} | User: ${userStr} | Group: ${groupStr} | Others: ${otherStr}`,
      breakdown: [
        { label: 'Octal Code', value: `${octal}` },
        { label: 'Owner / User (u)', value: `${userStr} (${u})` },
        { label: 'Group (g)', value: `${groupStr} (${g})` },
        { label: 'Others / World (o)', value: `${otherStr} (${o})` },
        { label: 'Command', value: `chmod ${octal} filename` }
      ],
      steps: [
        `User digit ${u}: 4(r) + 2(w) + 1(x) = ${userStr}`,
        `Group digit ${g}: 4(r) + 2(w) + 1(x) = ${groupStr}`,
        `Other digit ${o}: 4(r) + 2(w) + 1(x) = ${otherStr}`,
        `Symbolic notation: ${symbolic}`
      ]
    };
  },

  'bytes-converter': (inputs) => {
    const b = toNum(inputs.bytes, 1048576);

    const kb = b / 1000;
    const mb = b / 1e6;
    const gb = b / 1e9;
    const tb = b / 1e12;

    const kib = b / 1024;
    const mib = b / Math.pow(1024, 2);
    const gib = b / Math.pow(1024, 3);

    return {
      primaryValue: `${formatNum(mb, 2)} MB (Decimal) | ${formatNum(mib, 2)} MiB (Binary)`,
      primaryLabel: 'File Size Conversion',
      subtext: `${b.toLocaleString('en-US')} Bytes (B)`,
      breakdown: [
        { label: 'Total Bytes', value: `${b.toLocaleString('en-US')} B` },
        { label: 'Kilobytes (KB / 1000)', value: `${formatNum(kb, 2)} KB` },
        { label: 'Megabytes (MB / 10⁶)', value: `${formatNum(mb, 2)} MB` },
        { label: 'Gigabytes (GB / 10⁹)', value: `${formatNum(gb, 4)} GB` },
        { label: 'Mebibytes (MiB / 1024²)', value: `${formatNum(mib, 3)} MiB` },
        { label: 'Gibibytes (GiB / 1024³)', value: `${formatNum(gib, 4)} GiB` }
      ],
      steps: [
        `Base 10 Decimal: ${b} / 1,000,000 = ${formatNum(mb, 2)} MB`,
        `Base 2 Binary: ${b} / 1,048,576 = ${formatNum(mib, 2)} MiB`
      ]
    };
  }
};

module.exports = engines;


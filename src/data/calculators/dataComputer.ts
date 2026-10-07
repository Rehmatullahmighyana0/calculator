import { CalculatorDef } from '../../types/calculator';

export const dataComputerCalculators: CalculatorDef[] = [
  {
    id: 'ip-subnet-calculator',
    slug: 'ip-subnet-calculator',
    title: 'IPv4 Subnet Calculator',
    category: 'data-computer',
    shortDesc: 'Compute network address, broadcast address, netmask, wildcard, and usable host range from IP and CIDR.',
    icon: 'Network',
    badge: 'popular',
    fields: [
      { id: 'ip', label: 'IPv4 Address', type: 'text', defaultValue: '192.168.1.100', placeholder: '192.168.1.100' },
      { id: 'cidr', label: 'CIDR Prefix (/xx)', type: 'number', defaultValue: 24, min: 1, max: 32, step: 1 }
    ],
    calculate: (inputs) => {
      const ipStr = String(inputs.ip || '').trim();
      const cidr = Math.min(Math.max(parseInt(inputs.cidr) || 24, 1), 32);

      const octets = ipStr.split('.').map((p) => parseInt(p.trim()));
      if (octets.length !== 4 || octets.some((o) => isNaN(o) || o < 0 || o > 255)) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Please enter a valid IPv4 address (e.g. 192.168.1.1).' };
      }

      // 32-bit unsigned integer representation
      const ipNum = ((octets[0] << 24) >>> 0) + ((octets[1] << 16) >>> 0) + ((octets[2] << 8) >>> 0) + (octets[3] >>> 0);
      const maskNum = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
      const netNum = (ipNum & maskNum) >>> 0;
      const wildcardNum = (~maskNum) >>> 0;
      const broadcastNum = (netNum | wildcardNum) >>> 0;

      const numToIp = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');

      const netIp = numToIp(netNum);
      const maskIp = numToIp(maskNum);
      const wildcardIp = numToIp(wildcardNum);
      const broadcastIp = numToIp(broadcastNum);

      const totalHosts = Math.pow(2, 32 - cidr);
      const usableHosts = cidr >= 31 ? (cidr === 31 ? 2 : 1) : totalHosts - 2;

      const firstHost = cidr >= 31 ? netIp : numToIp(netNum + 1);
      const lastHost = cidr >= 31 ? broadcastIp : numToIp(broadcastNum - 1);

      return {
        primaryValue: `${netIp}/${cidr}`,
        primaryLabel: 'Network Address / CIDR',
        subtext: `Usable Hosts: ${usableHosts.toLocaleString()} (${firstHost} to ${lastHost})`,
        breakdown: [
          { label: 'Subnet Mask', value: maskIp },
          { label: 'Wildcard Mask', value: wildcardIp },
          { label: 'Network Address', value: netIp },
          { label: 'Broadcast Address', value: broadcastIp },
          { label: 'First Usable Host', value: firstHost },
          { label: 'Last Usable Host', value: lastHost },
          { label: 'Total Host Addresses', value: totalHosts.toLocaleString() },
          { label: 'Usable Hosts', value: usableHosts.toLocaleString() }
        ],
        steps: [
          `Subnet mask: ${maskIp} (32-bit: ${cidr} network bits, ${32 - cidr} host bits)`,
          `Network: IP & Mask = ${netIp}`,
          `Broadcast: Network | Wildcard = ${broadcastIp}`,
          `Usable range: ${firstHost} - ${lastHost}`
        ]
      };
    },
    formula: 'Network = IP AND Subnet_Mask  |  Broadcast = Network OR Wildcard_Mask',
    explanation: 'IPv4 subnetting divides a network into smaller, distinct broadcast domains to optimize routing and IP conservation.',
    howToUse: ['Enter an IPv4 address.', 'Select CIDR prefix (/1 to /32).', 'Click Calculate.'],
    example: { inputs: { ip: '192.168.1.100', cidr: 24 }, output: '192.168.1.0/24', explanation: 'Subnet 255.255.255.0 yields 254 usable hosts (192.168.1.1 to 192.168.1.254).' },
    faqs: [{ question: 'What is CIDR notation?', answer: 'Classless Inter-Domain Routing (e.g. /24) represents the count of leading 1-bits in the subnet mask.' }],
    keywords: ['ip subnet calculator', 'cidr calculator', 'subnet mask', 'network address', 'broadcast ip']
  },
  {
    id: 'download-time-calculator',
    slug: 'download-time-calculator',
    title: 'Download & Upload Time Calculator',
    category: 'data-computer',
    shortDesc: 'Calculate file transfer time based on file size and internet connection speed.',
    icon: 'DownloadCloud',
    badge: 'popular',
    fields: [
      { id: 'fileSizeGB', label: 'File Size (GB)', type: 'number', defaultValue: 50, min: 0.01, step: 1 },
      { id: 'speedMbps', label: 'Internet Speed (Mbps)', type: 'number', defaultValue: 100, min: 0.1, step: 10 }
    ],
    calculate: (inputs) => {
      const sizeGB = parseFloat(inputs.fileSizeGB) || 0;
      const speedMbps = parseFloat(inputs.speedMbps) || 1;

      if (sizeGB <= 0 || speedMbps <= 0) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Size and speed must be positive.' };
      }

      // Convert GB to Megabits: sizeGB * 1024 MB * 8 bits
      const totalMbits = sizeGB * 1024 * 8;
      // Real-world protocol TCP/IP overhead factor ~10%
      const effectiveSec = (totalMbits / speedMbps) * 1.1;

      const h = Math.floor(effectiveSec / 3600);
      const m = Math.floor((effectiveSec % 3600) / 60);
      const s = Math.round(effectiveSec % 60);

      const timeStr = h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;

      return {
        primaryValue: timeStr,
        primaryLabel: 'Estimated Download Time',
        subtext: `Transferring ${sizeGB} GB @ ${speedMbps} Mbps (with 10% TCP/IP overhead)`,
        breakdown: [
          { label: 'File Size', value: `${sizeGB} GB (${(sizeGB * 1024).toLocaleString()} MB)` },
          { label: 'Download Bandwidth', value: `${speedMbps} Mbps (${(speedMbps / 8).toFixed(1)} MB/s)` },
          { label: 'Theoretical Min Time', value: `${Math.round(totalMbits / speedMbps)} seconds` },
          { label: 'Real-World Estimated Time', value: timeStr }
        ],
        steps: [
          `Convert ${sizeGB} GB to Megabits: ${sizeGB} × 1024 × 8 = ${totalMbits.toLocaleString()} Mbits`,
          `Effective transfer time: (${totalMbits} / ${speedMbps}) × 1.1 overhead = ${Math.round(effectiveSec)} seconds = ${timeStr}`
        ]
      };
    },
    formula: 'Time (s) = (File Size in Bytes × 8) / (Speed in bps) × 1.10 (overhead)',
    explanation: 'Estimates real-world file download or backup durations taking bit-to-byte conversion and network protocol overhead into account.',
    howToUse: ['Enter file size in GB.', 'Enter broadband speed in Mbps (Megabits per second).', 'Click Calculate.'],
    example: { inputs: { fileSizeGB: 50, speedMbps: 100 }, output: '1h 15m 12s', explanation: 'A 50 GB modern game downloads in ~1 hr 15 mins on a 100 Mbps broadband connection.' },
    faqs: [{ question: 'Difference between Mbps and MB/s?', answer: 'Mbps = Megabits per second; MB/s = Megabytes per second. There are 8 bits in a byte (100 Mbps = 12.5 MB/s).' }],
    keywords: ['download time calculator', 'file transfer speed', 'bandwidth time', 'mbps to download time']
  },
  {
    id: 'binary-calculator',
    slug: 'binary-calculator',
    title: 'Binary Math Calculator',
    category: 'data-computer',
    shortDesc: 'Perform binary arithmetic (Add, Subtract, Multiply, Divide) and bitwise logic (AND, OR, XOR).',
    icon: 'Binary',
    fields: [
      { id: 'bin1', label: 'First Binary Number', type: 'text', defaultValue: '1101', placeholder: 'e.g. 1101' },
      {
        id: 'op',
        label: 'Operation',
        type: 'select',
        defaultValue: '+',
        options: [
          { label: 'Add (+)', value: '+' },
          { label: 'Subtract (-)', value: '-' },
          { label: 'Multiply (×)', value: '*' },
          { label: 'Divide (÷)', value: '/' },
          { label: 'Bitwise AND (&)', value: '&' },
          { label: 'Bitwise OR (|)', value: '|' },
          { label: 'Bitwise XOR (^)', value: '^' }
        ]
      },
      { id: 'bin2', label: 'Second Binary Number', type: 'text', defaultValue: '1010', placeholder: 'e.g. 1010' }
    ],
    calculate: (inputs) => {
      const b1 = String(inputs.bin1 || '').trim();
      const b2 = String(inputs.bin2 || '').trim();
      const op = inputs.op || '+';

      if (!/^[01]+$/.test(b1) || !/^[01]+$/.test(b2)) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Inputs must contain only binary digits 0 and 1.' };
      }

      const d1 = parseInt(b1, 2);
      const d2 = parseInt(b2, 2);

      let resDec = 0;
      if (op === '+') resDec = d1 + d2;
      else if (op === '-') resDec = d1 - d2;
      else if (op === '*') resDec = d1 * d2;
      else if (op === '/') {
        if (d2 === 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Cannot divide by zero.' };
        resDec = Math.floor(d1 / d2);
      } else if (op === '&') resDec = d1 & d2;
      else if (op === '|') resDec = d1 | d2;
      else if (op === '^') resDec = d1 ^ d2;

      const isNeg = resDec < 0;
      const resBin = isNeg ? `-${Math.abs(resDec).toString(2)}` : resDec.toString(2);
      const resHex = isNeg ? `-${Math.abs(resDec).toString(16).toUpperCase()}` : resDec.toString(16).toUpperCase();

      return {
        primaryValue: resBin,
        primaryLabel: 'Binary Result',
        subtext: `Decimal: ${resDec} | Hex: 0x${resHex}`,
        breakdown: [
          { label: 'Binary Operand 1', value: `${b1} (${d1})` },
          { label: 'Binary Operand 2', value: `${b2} (${d2})` },
          { label: 'Operation', value: op },
          { label: 'Binary Output', value: resBin },
          { label: 'Decimal Equivalent', value: resDec.toString() },
          { label: 'Hexadecimal Output', value: `0x${resHex}` }
        ],
        steps: [`Converted ${b1} to ${d1} and ${b2} to ${d2}`, `Applied operation: ${d1} ${op} ${d2} = ${resDec}`, `Converted ${resDec} to binary = ${resBin}`]
      };
    },
    formula: 'Binary operations evaluated via Boolean logic and base-2 arithmetic',
    explanation: 'Performs base-2 binary arithmetic and bitwise digital operations.',
    howToUse: ['Enter two binary numbers.', 'Select an arithmetic or bitwise operator.', 'Click Calculate.'],
    example: { inputs: { bin1: '1101', op: '+', bin2: '1010' }, output: '10111', explanation: '13 + 10 = 23 in decimal, which is 10111 in binary.' },
    faqs: [{ question: 'What is XOR?', answer: 'Exclusive OR (XOR) outputs 1 only when the two input bits differ (1^0=1, 1^1=0, 0^0=0).' }],
    keywords: ['binary calculator', 'binary addition', 'binary bitwise', 'base 2 math']
  },
  {
    id: 'decimal-to-binary',
    slug: 'decimal-to-binary',
    title: 'Decimal to Binary Converter',
    category: 'data-computer',
    shortDesc: 'Convert base-10 decimal integers to base-2 binary with step-by-step division.',
    icon: 'Binary',
    fields: [
      { id: 'decimal', label: 'Decimal Integer', type: 'number', defaultValue: 156, min: 0, step: 1 }
    ],
    calculate: (inputs) => {
      const dec = Math.abs(parseInt(inputs.decimal) || 0);
      const bin = dec.toString(2);
      const hex = dec.toString(16).toUpperCase();
      const oct = dec.toString(8);

      // Division steps
      const steps: string[] = [];
      let temp = dec;
      while (temp > 0) {
        const rem = temp % 2;
        const q = Math.floor(temp / 2);
        steps.push(`${temp} / 2 = ${q} with remainder ${rem}`);
        temp = q;
      }

      return {
        primaryValue: bin,
        primaryLabel: 'Binary (Base 2)',
        subtext: `Hex: 0x${hex} | Octal: ${oct}`,
        breakdown: [
          { label: 'Decimal Input', value: dec.toString() },
          { label: 'Binary (Base 2)', value: bin },
          { label: 'Hexadecimal (Base 16)', value: `0x${hex}` },
          { label: 'Octal (Base 8)', value: oct },
          { label: 'Bit Length', value: `${bin.length} bits` }
        ],
        steps: steps.length > 0 ? steps.slice(0, 6) : ['0 / 2 = 0 remainder 0']
      };
    },
    formula: 'Repeated division by 2 recording remainders from bottom to top',
    explanation: 'Converts base-10 integer numbers into binary positional notation.',
    howToUse: ['Enter a non-negative decimal integer.', 'Click Calculate.'],
    example: { inputs: { decimal: 156 }, output: '10011100', explanation: '156 in binary is 10011100.' },
    faqs: [{ question: 'How many bits in a byte?', answer: 'There are exactly 8 bits in 1 byte.' }],
    keywords: ['decimal to binary', 'base 10 to base 2', 'convert to binary']
  },
  {
    id: 'binary-to-decimal',
    slug: 'binary-to-decimal',
    title: 'Binary to Decimal Converter',
    category: 'data-computer',
    shortDesc: 'Convert binary strings into decimal with powers of 2 expansion.',
    icon: 'Binary',
    fields: [
      { id: 'binary', label: 'Binary String (0s and 1s)', type: 'text', defaultValue: '10011100', placeholder: '10011100' }
    ],
    calculate: (inputs) => {
      const bin = String(inputs.binary || '').trim();
      if (!/^[01]+$/.test(bin)) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Input must be only binary digits 0 and 1.' };
      }

      const dec = parseInt(bin, 2);
      const hex = dec.toString(16).toUpperCase();

      return {
        primaryValue: dec.toLocaleString(),
        primaryLabel: 'Decimal (Base 10)',
        subtext: `Hex: 0x${hex} | Octal: ${dec.toString(8)}`,
        breakdown: [
          { label: 'Binary Input', value: bin },
          { label: 'Decimal Output', value: dec.toString() },
          { label: 'Hexadecimal', value: `0x${hex}` }
        ],
        steps: [`Expanded binary polynomial in powers of 2 = ${dec}`]
      };
    },
    formula: 'Decimal = Sum(d_i × 2^i)',
    explanation: 'Expands binary bit positions weighted by successive ascending powers of 2.',
    howToUse: ['Enter binary string.', 'Click Calculate.'],
    example: { inputs: { binary: '10011100' }, output: '156', explanation: '128 + 16 + 8 + 4 = 156.' },
    faqs: [{ question: 'What is MSB vs LSB?', answer: 'MSB is Most Significant Bit (leftmost); LSB is Least Significant Bit (rightmost).' }],
    keywords: ['binary to decimal', 'base 2 to base 10', 'binary converter']
  },
  {
    id: 'hexadecimal-converter',
    slug: 'hexadecimal-converter',
    title: 'Hexadecimal Converter',
    category: 'data-computer',
    shortDesc: 'Convert between Hexadecimal (0-9, A-F), Decimal, Binary, and ASCII.',
    icon: 'Hash',
    fields: [
      { id: 'hex', label: 'Hexadecimal Value', type: 'text', defaultValue: 'FF45', placeholder: 'e.g. FF45' }
    ],
    calculate: (inputs) => {
      const hex = String(inputs.hex || '').trim().replace(/^0x/i, '');
      if (!/^[0-9a-fA-F]+$/.test(hex)) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invalid Hex characters (use 0-9 and A-F).' };
      }

      const dec = parseInt(hex, 16);
      const bin = dec.toString(2);
      const oct = dec.toString(8);

      return {
        primaryValue: dec.toLocaleString(),
        primaryLabel: 'Decimal Equivalent',
        subtext: `Binary: ${bin} | Octal: ${oct}`,
        breakdown: [
          { label: 'Hexadecimal', value: `0x${hex.toUpperCase()}` },
          { label: 'Decimal', value: dec.toString() },
          { label: 'Binary', value: bin },
          { label: 'Octal', value: oct }
        ],
        steps: [`Converted Hex digits to base-10 value = ${dec}`]
      };
    },
    formula: 'Hex (Base 16): 0-9 and A=10, B=11, C=12, D=13, E=14, F=15',
    explanation: 'Hexadecimal simplifies representation of large binary numbers in computer science and memory addressing.',
    howToUse: ['Enter hex string without or with 0x prefix.', 'Click Calculate.'],
    example: { inputs: { hex: 'FF45' }, output: '65,349', explanation: '0xFF45 in decimal is 65,349.' },
    faqs: [{ question: 'Why is hex used in web color codes?', answer: 'Hex colors (#RRGGBB) represent red, green, and blue intensities each with 8 bits (0-255).' }],
    keywords: ['hex converter', 'hexadecimal to decimal', 'hex to binary', 'base 16']
  },
  {
    id: 'octal-converter',
    slug: 'octal-converter',
    title: 'Octal Converter (Base 8)',
    category: 'data-computer',
    shortDesc: 'Convert between Octal (0-7), Decimal, Binary, and Hexadecimal.',
    icon: 'Sliders',
    fields: [
      { id: 'octal', label: 'Octal String (digits 0-7)', type: 'text', defaultValue: '755', placeholder: '755' }
    ],
    calculate: (inputs) => {
      const oct = String(inputs.octal || '').trim();
      if (!/^[0-7]+$/.test(oct)) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Octal digits must be between 0 and 7.' };
      }

      const dec = parseInt(oct, 8);
      const bin = dec.toString(2);
      const hex = dec.toString(16).toUpperCase();

      return {
        primaryValue: dec.toString(),
        primaryLabel: 'Decimal Equivalent',
        subtext: `Binary: ${bin} | Hex: 0x${hex}`,
        breakdown: [
          { label: 'Octal Input', value: oct },
          { label: 'Decimal Output', value: dec.toString() },
          { label: 'Binary Output', value: bin },
          { label: 'Hex Output', value: `0x${hex}` }
        ],
        steps: [`Converted Octal ${oct} to decimal = ${dec}`]
      };
    },
    formula: 'Octal = Base 8 using digits 0 through 7',
    explanation: 'Octal is commonly used in UNIX and Linux file system permissions (e.g. chmod 755).',
    howToUse: ['Enter octal digits.', 'Click Calculate.'],
    example: { inputs: { octal: '755' }, output: '493', explanation: '755 octal represents 493 in decimal (rwxr-xr-x in chmod).' },
    faqs: [{ question: 'What does chmod 777 mean in octal?', answer: 'Read, write, and execute permissions for user, group, and all.' }],
    keywords: ['octal converter', 'base 8', 'chmod permissions', 'octal to decimal']
  },
  {
    id: 'base-converter',
    slug: 'base-converter',
    title: 'Arbitrary Base Converter (Base 2 to 36)',
    category: 'data-computer',
    shortDesc: 'Convert numbers between any radix base from 2 to 36.',
    icon: 'Repeat',
    fields: [
      { id: 'num', label: 'Number String', type: 'text', defaultValue: '10110', placeholder: '10110' },
      { id: 'fromBase', label: 'From Base (2 to 36)', type: 'number', defaultValue: 2, min: 2, max: 36, step: 1 },
      { id: 'toBase', label: 'To Base (2 to 36)', type: 'number', defaultValue: 10, min: 2, max: 36, step: 1 }
    ],
    calculate: (inputs) => {
      const raw = String(inputs.num || '').trim();
      const fromB = parseInt(inputs.fromBase) || 10;
      const toB = parseInt(inputs.toBase) || 2;

      try {
        const dec = parseInt(raw, fromB);
        if (isNaN(dec)) return { primaryValue: 'Error', primaryLabel: 'Result', error: `Invalid number for base ${fromB}.` };

        const converted = dec.toString(toB).toUpperCase();

        return {
          primaryValue: converted,
          primaryLabel: `Base ${toB} Output`,
          subtext: `Decimal Value = ${dec}`,
          breakdown: [
            { label: `Source (Base ${fromB})`, value: raw },
            { label: 'Decimal Intermediate', value: dec.toString() },
            { label: `Result (Base ${toB})`, value: converted }
          ],
          steps: [`Parsed as Base ${fromB} to decimal: ${dec}`, `Converted decimal to Base ${toB}: ${converted}`]
        };
      } catch (e) {
        return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Conversion failed.' };
      }
    },
    formula: 'Number_target = (Number_source)_dec converted to Base_target',
    explanation: 'Converts alphanumeric representation across arbitrary positional number systems.',
    howToUse: ['Enter number.', 'Select source base and target base.', 'Click Calculate.'],
    example: { inputs: { num: '10110', fromBase: 2, toBase: 10 }, output: '22', explanation: 'Binary 10110 equals decimal 22.' },
    faqs: [{ question: 'Why does base 36 use letters A-Z?', answer: '10 numerical digits (0-9) + 26 English letters (A-Z) equals 36 unique digits.' }],
    keywords: ['base converter', 'radix converter', 'base 2 to 36', 'number system']
  },
  {
    id: 'bandwidth-calculator',
    slug: 'bandwidth-calculator',
    title: 'Bandwidth & Data Rate Calculator',
    category: 'data-computer',
    shortDesc: 'Convert data transfer bandwidth across bps, Kbps, Mbps, Gbps, and MB/s.',
    icon: 'Wifi',
    fields: [
      { id: 'speed', label: 'Bandwidth Value', type: 'number', defaultValue: 100, step: 5 },
      {
        id: 'unit',
        label: 'Bandwidth Unit',
        type: 'select',
        defaultValue: 'mbps',
        options: [
          { label: 'Mbps (Megabits per second)', value: 'mbps' },
          { label: 'MB/s (Megabytes per second)', value: 'mbs' },
          { label: 'Gbps (Gigabits per second)', value: 'gbps' },
          { label: 'Kbps (Kilobits per second)', value: 'kbps' }
        ]
      }
    ],
    calculate: (inputs) => {
      const val = parseFloat(inputs.speed) || 0;
      const unit = inputs.unit || 'mbps';

      // Base: Mbps
      let mbps = 0;
      if (unit === 'mbps') mbps = val;
      else if (unit === 'mbs') mbps = val * 8;
      else if (unit === 'gbps') mbps = val * 1000;
      else if (unit === 'kbps') mbps = val / 1000;

      const mbs = mbps / 8;
      const gbps = mbps / 1000;
      const kbps = mbps * 1000;
      const hourTransferGB = (mbs * 3600) / 1024;

      return {
        primaryValue: `${mbs.toFixed(2)} MB/s`,
        primaryLabel: 'Real Transfer Rate (Megabytes/sec)',
        subtext: `${gbps.toFixed(3)} Gbps | ${mbps.toFixed(0)} Mbps (Max: ${hourTransferGB.toFixed(1)} GB/hour)`,
        breakdown: [
          { label: 'Megabits / sec (Mbps)', value: `${mbps.toFixed(1)} Mbps` },
          { label: 'Megabytes / sec (MB/s)', value: `${mbs.toFixed(2)} MB/s` },
          { label: 'Gigabits / sec (Gbps)', value: `${gbps.toFixed(3)} Gbps` },
          { label: 'Max Data per Hour', value: `${hourTransferGB.toFixed(2)} GB` }
        ],
        steps: [`Divide Megabits by 8 bits per byte: ${mbps} / 8 = ${mbs.toFixed(2)} MB/s`]
      };
    },
    formula: 'MB/s = Mbps / 8  |  Data per hour (GB) = (MB/s × 3600) / 1024',
    explanation: 'Converts internet throughput rates into real-world transfer throughput and hourly data capacity.',
    howToUse: ['Enter network bandwidth.', 'Select unit.', 'Click Calculate.'],
    example: { inputs: { speed: 100, unit: 'mbps' }, output: '12.50 MB/s', explanation: 'A 100 Mbps internet connection downloads at a theoretical maximum of 12.5 MB/s (~43.9 GB/hour).' },
    faqs: [{ question: 'Why don’t I get full advertised speed?', answer: 'Wi-Fi interference, ISP contention ratios, server throttling, and TCP/IP protocol overhead reduce real-world speed.' }],
    keywords: ['bandwidth calculator', 'mbps to mb s', 'internet speed conversion', 'data rate']
  },
  {
    id: 'storage-calculator',
    slug: 'storage-calculator',
    title: 'Storage & Usable RAID Capacity Calculator',
    category: 'data-computer',
    shortDesc: 'Compute usable disk capacity and fault tolerance for RAID 0, RAID 1, RAID 5, and RAID 10.',
    icon: 'HardDrive',
    fields: [
      { id: 'driveSizeTB', label: 'Single Drive Capacity (TB)', type: 'number', defaultValue: 4, min: 0.5, step: 0.5 },
      { id: 'numDrives', label: 'Number of Drives', type: 'number', defaultValue: 4, min: 2, max: 24, step: 1 },
      {
        id: 'raidLevel',
        label: 'RAID Configuration',
        type: 'select',
        defaultValue: 'raid5',
        options: [
          { label: 'RAID 0 (Striping - No Redundancy)', value: 'raid0' },
          { label: 'RAID 1 (Mirroring - 1 Drive Fault Tolerance)', value: 'raid1' },
          { label: 'RAID 5 (Single Parity - 1 Drive Fault Tolerance)', value: 'raid5' },
          { label: 'RAID 10 (Striped Mirrors - 50% Storage)', value: 'raid10' }
        ]
      }
    ],
    calculate: (inputs) => {
      const driveTB = parseFloat(inputs.driveSizeTB) || 1;
      const n = parseInt(inputs.numDrives) || 2;
      const raid = inputs.raidLevel || 'raid5';

      let usableTB = 0;
      let faultTolerance = '';

      if (raid === 'raid0') {
        usableTB = n * driveTB;
        faultTolerance = '0 drives (No fault tolerance; loss of 1 drive destroys all data)';
      } else if (raid === 'raid1') {
        usableTB = driveTB;
        faultTolerance = `${n - 1} drives can fail safely`;
      } else if (raid === 'raid5') {
        usableTB = (n - 1) * driveTB;
        faultTolerance = '1 drive can fail safely with full parity reconstruction';
      } else if (raid === 'raid10') {
        usableTB = (n / 2) * driveTB;
        faultTolerance = '1 drive per mirror pair can fail safely';
      }

      // Format overhead: Drive manufacturers use 1TB = 10^12 bytes, OS uses 2^40 bytes (~9.09% difference)
      const osUsableTiB = usableTB * 0.9095;

      return {
        primaryValue: `${usableTB.toFixed(1)} TB Usable Capacity`,
        primaryLabel: 'Storage Capacity',
        subtext: `Operating System Usable: ~${osUsableTiB.toFixed(1)} TiB (${faultTolerance})`,
        breakdown: [
          { label: 'Raw Total Capacity', value: `${(n * driveTB).toFixed(1)} TB` },
          { label: 'Usable RAID Storage', value: `${usableTB.toFixed(1)} TB` },
          { label: 'OS Usable (Binary TiB)', value: `${osUsableTiB.toFixed(1)} TiB` },
          { label: 'Parity / Mirror Overhead', value: `${((n * driveTB) - usableTB).toFixed(1)} TB` },
          { label: 'Fault Tolerance', value: faultTolerance }
        ],
        steps: [`Calculated usable storage formula for ${raid}`, `Subtracted binary formatting loss (~9.1%) = ${osUsableTiB.toFixed(1)} TiB`]
      };
    },
    formula: 'RAID 5 Usable = (N - 1) × Drive Size  |  RAID 10 Usable = (N / 2) × Drive Size',
    explanation: 'Calculates true usable data volume and redundancy overhead for redundant arrays of independent disks (RAID).',
    howToUse: ['Enter drive size in TB.', 'Enter total drive count.', 'Select RAID level.', 'Click Calculate.'],
    example: { inputs: { driveSizeTB: 4, numDrives: 4, raidLevel: 'raid5' }, output: '12.0 TB Usable Capacity', explanation: 'Four 4TB drives in RAID 5 provide 12TB usable storage with 1-drive failure protection.' },
    faqs: [{ question: 'Is RAID a backup?', answer: 'No! RAID provides continuous uptime and hardware redundancy, but does not protect against malware, accidental deletion, or file corruption.' }],
    keywords: ['raid calculator', 'usable storage', 'raid 5 capacity', 'raid 10 calculator', 'nas storage']
  }
];

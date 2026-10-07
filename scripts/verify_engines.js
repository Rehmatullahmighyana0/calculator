import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const engineFiles = [
  'basic_everyday.js',
  'math.js',
  'geometry.js',
  'finance.js',
  'health_fitness.js',
  'date_time.js',
  'unit_converters.js',
  'construction.js',
  'electrical.js',
  'physics.js',
  'chemistry.js',
  'statistics.js',
  'computer_data.js',
  'productivity.js',
  'business.js'
];

let totalEngines = 0;
const allEngineKeys = new Set();
const duplicateKeys = [];

for (const f of engineFiles) {
  const filePath = path.join(__dirname, 'engines', f);
  const mod = require(filePath);
  const keys = Object.keys(mod);
  console.log(`${f.padEnd(20)}: ${keys.length} calculators`);
  for (const k of keys) {
    if (allEngineKeys.has(k)) {
      duplicateKeys.push(k);
    }
    allEngineKeys.add(k);
  }
  totalEngines += keys.length;
}

console.log('-------------------------------------------');
console.log(`Total calculators implemented in engines: ${totalEngines}`);
if (duplicateKeys.length > 0) {
  console.error(`DUPLICATE ENGINE KEYS: ${duplicateKeys.join(', ')}`);
} else {
  console.log('Zero duplicate engine keys!');
}

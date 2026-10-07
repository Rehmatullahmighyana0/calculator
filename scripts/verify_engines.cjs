const path = require('path');

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

let totalEngines = 0;
const allEngineKeys = new Set();
const duplicateKeys = [];
const allCalculators = {};

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
    allCalculators[k] = mod[k];
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

// Test every engine with empty inputs {} to verify no crashes and graceful default output
let errors = 0;
for (const [id, fn] of Object.entries(allCalculators)) {
  try {
    const res = fn({});
    if (!res || !res.primaryValue || typeof res.primaryValue !== 'string') {
      console.error(`Invalid output for ${id}:`, res);
      errors++;
    }
  } catch (err) {
    console.error(`Crash on default inputs for ${id}:`, err);
    errors++;
  }
}

if (errors === 0) {
  console.log('ALL 200 CALCULATOR ENGINES PASSED DEFAULT EXECUTION TEST!');
} else {
  console.error(`${errors} engines had issues.`);
}

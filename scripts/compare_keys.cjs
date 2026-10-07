const fs = require('fs');
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

const engineKeys = new Set();
for (const f of engineFiles) {
  const mod = require(path.join(__dirname, 'engines', f));
  Object.keys(mod).forEach(k => engineKeys.add(k));
}

const content = fs.readFileSync(path.join(__dirname, '..', 'js', 'calculators-data.js'), 'utf8');
const match = content.match(/var ALL_CALCULATORS_DATA = (\[[\s\S]*\]);/);
const oldData = JSON.parse(match[1]);
const oldKeys = new Set(oldData.map(d => d.id));

const removed = [...oldKeys].filter(k => !engineKeys.has(k));
const added = [...engineKeys].filter(k => !oldKeys.has(k));

console.log('Total in old data:', oldKeys.size);
console.log('Total in engines:', engineKeys.size);
console.log('Removed from old data (' + removed.length + '):', removed);
console.log('Added new (' + added.length + '):', added);

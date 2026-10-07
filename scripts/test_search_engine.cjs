const fs = require('fs');
const path = require('path');
const vm = require('vm');

const calcsData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'all_calcs_data.json'), 'utf8'));
const appJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');

const domSandbox = {
  console: console,
  ALL_CALCULATORS_DATA: calcsData,
  document: {
    addEventListener: () => {},
    getElementById: () => null,
    querySelectorAll: () => [],
    createElement: () => ({ setAttribute: () => {}, classList: { add: () => {}, remove: () => {} } })
  },
  window: {
    addEventListener: () => {},
    location: { hash: '' }
  },
  localStorage: {
    getItem: () => null,
    setItem: () => {}
  },
  navigator: {
    clipboard: { writeText: () => Promise.resolve() }
  }
};
domSandbox.window.document = domSandbox.document;
domSandbox.window.ALL_CALCULATORS_DATA = calcsData;
vm.createContext(domSandbox);

vm.runInContext(appJs, domSandbox);

const searchCalculators = domSandbox.window.searchCalculators;
const ALL_CALCULATORS = calcsData;

console.log("=== COMPREHENSIVE SEARCH VERIFICATION ===");
console.log(`Total calculators registered: ${ALL_CALCULATORS.length}`);

if (typeof searchCalculators !== 'function') {
  console.error("searchCalculators is not exposed on window!");
  process.exit(1);
}

// Test 1: 'loan'
const loanResults = searchCalculators('loan', 'all');
console.log(`\nQuery: 'loan' -> ${loanResults.length} matches`);
console.log(`Top 3:`, loanResults.slice(0, 3).map(c => c.title));
if (!loanResults.some(c => c.title.toLowerCase().includes('loan') || c.title.toLowerCase().includes('emi'))) {
  throw new Error("Failed: 'loan' should include Loan Calculator / EMI");
}

// Test 2: 'age'
const ageResults = searchCalculators('age', 'all');
console.log(`\nQuery: 'age' -> ${ageResults.length} matches`);
console.log(`Top 3:`, ageResults.slice(0, 3).map(c => c.title));
if (ageResults[0].title !== 'Age Calculator') {
  throw new Error(`Failed: 'age' top result should be 'Age Calculator', got '${ageResults[0].title}'`);
}

// Test 3: 'percentage'
const pctResults = searchCalculators('percentage', 'all');
console.log(`\nQuery: 'percentage' -> ${pctResults.length} matches`);
console.log(`Top 3:`, pctResults.slice(0, 3).map(c => c.title));
if (pctResults[0].title !== 'Percentage Calculator') {
  throw new Error(`Failed: 'percentage' top result should be 'Percentage Calculator'`);
}

// Test 4: 'currency'
const currResults = searchCalculators('currency', 'all');
console.log(`\nQuery: 'currency' -> ${currResults.length} matches`);
console.log(`Top 3:`, currResults.slice(0, 3).map(c => c.title));
if (currResults.length === 0) {
  throw new Error("Failed: 'currency' should return matches");
}

// Test 5: Partial word 'percen'
const partialResults = searchCalculators('percen', 'all');
console.log(`\nPartial query: 'percen' -> ${partialResults.length} matches`);
console.log(`Top 2:`, partialResults.slice(0, 2).map(c => c.title));
if (partialResults.length === 0 || partialResults[0].title !== 'Percentage Calculator') {
  throw new Error("Failed: partial query 'percen' should match Percentage Calculator");
}

// Test 6: Zero matches query
const zeroResults = searchCalculators('xyzqwerty999', 'all');
console.log(`\nNonsense query: 'xyzqwerty999' -> ${zeroResults.length} matches`);
if (zeroResults.length !== 0) {
  throw new Error("Failed: nonsense query should return 0 results");
}

// Test 7: Verify all returned IDs exist in the 200 calculators list
const allIds = new Set(ALL_CALCULATORS.map(c => c.id));
for (const res of [...loanResults, ...ageResults, ...pctResults, ...currResults]) {
  if (!allIds.has(res.id)) {
    throw new Error(`Failed: Result id ${res.id} does not exist in master calculator registry`);
  }
}

console.log("\n✓ All search ranking and partial matching tests PASSED!");

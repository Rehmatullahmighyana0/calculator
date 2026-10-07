const fs = require('fs');
const path = require('path');

console.log('=== RUNNING COMPREHENSIVE HOME NAVIGATION & STATE RESET TEST ===');

// 1. Static HTML Inspection
const htmlContent = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

// Ensure #quick-calc-section has display: none initially
if (!htmlContent.includes('id="quick-calc-section"') || !htmlContent.includes('style="display: none;"')) {
  throw new Error('FAIL: #quick-calc-section must have style="display: none;" by default in index.html');
}
console.log('✓ Verified: #quick-calc-section is hidden (display: none) by default in index.html');

// Ensure Home navigation button exists with proper ID and link
if (!htmlContent.includes('id="nav-home-btn"')) {
  throw new Error('FAIL: #nav-home-btn navigation element missing in header');
}
if (!htmlContent.includes('id="brand-home-link"')) {
  throw new Error('FAIL: #brand-home-link missing in header');
}
if (!htmlContent.includes('id="bc-home"')) {
  throw new Error('FAIL: #bc-home breadcrumb link missing');
}
console.log('✓ Verified: Header Home button (#nav-home-btn), Brand link (#brand-home-link), and Breadcrumb (#bc-home) present');

// Ensure default primary-result-value is clean
if (htmlContent.includes('id="primary-result-value" class="primary-result-value">275<')) {
  throw new Error('FAIL: Stale hardcoded 275 found in #primary-result-value HTML');
}
console.log('✓ Verified: No stale hardcoded 275 in HTML template');

// 2. Build Lightweight Pure Node DOM Mock to run app.js natively
class MockElement {
  constructor(tagName = 'div', id = '') {
    this.tagName = tagName.toUpperCase();
    this.id = id;
    this.className = '';
    this.classList = {
      _classes: new Set(),
      add: (c) => this.classList._classes.add(c),
      remove: (c) => this.classList._classes.delete(c),
      contains: (c) => this.classList._classes.has(c)
    };
    this.style = {};
    this.attributes = {};
    this.children = [];
    this._textContent = '';
    this._innerHTML = '';
    this.value = '';
    this.listeners = {};
  }

  get textContent() { return this._textContent; }
  set textContent(val) { this._textContent = String(val); }

  get innerHTML() { return this._innerHTML; }
  set innerHTML(val) { this._innerHTML = String(val); }

  setAttribute(k, v) { this.attributes[k] = String(v); }
  getAttribute(k) { return this.attributes[k] || null; }
  removeAttribute(k) { delete this.attributes[k]; }

  addEventListener(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }

  dispatchEvent(event) {
    const list = this.listeners[event.type || event] || [];
    list.forEach(fn => fn(event));
  }

  click() {
    this.dispatchEvent({ type: 'click', preventDefault: () => {}, stopPropagation: () => {} });
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  querySelector(sel) { return null; }
  querySelectorAll(sel) { return []; }
  closest(sel) { return null; }
  scrollIntoView() {}
  remove() {}
}

const elementStore = {};
function getOrCreate(id, tag = 'div') {
  if (!elementStore[id]) {
    elementStore[id] = new MockElement(tag, id);
  }
  return elementStore[id];
}

// Pre-create required DOM elements
const requiredIds = [
  'quick-calc-section',
  'active-calc-title',
  'active-calc-desc',
  'active-calc-formula',
  'active-calc-example',
  'active-calc-badge',
  'calculator-fields-container',
  'calc-error-message',
  'btn-calculate',
  'btn-reset',
  'btn-copy-result',
  'primary-result-box',
  'primary-result-label',
  'primary-result-value',
  'primary-result-subtext',
  'result-breakdown',
  'result-steps',
  'calculator-explanation-card',
  'active-related-section',
  'active-related-grid',
  'category-companion-section',
  'companion-cat-title',
  'companion-cat-subtitle',
  'companion-calculators-list',
  'btn-view-all-category',
  'btn-prev-calc',
  'btn-next-calc',
  'prev-calc-name',
  'next-calc-name',
  'calc-jump-select',
  'bc-home',
  'bc-category',
  'bc-cat-name',
  'bc-cat-count',
  'bc-current-title',
  'nav-home-btn',
  'nav-categories-btn',
  'nav-popular-btn',
  'brand-home-link',
  'hero-search-input',
  'hero-category-pills',
  'category-browser-section',
  'cat-browser-title',
  'cat-browser-desc',
  'cat-browser-badge',
  'cat-browser-count-badge',
  'cat-browser-search-input',
  'cat-browser-select',
  'category-calculators-grid',
  'popular-cards-grid',
  'categories-grid',
  'search-modal',
  'modal-search-input',
  'search-results-list',
  'favorites-drawer',
  'history-drawer',
  'fav-count-badge',
  'hist-count-badge',
  'theme-toggle-btn'
];

requiredIds.forEach(id => getOrCreate(id));

// Set initial style on #quick-calc-section
getOrCreate('quick-calc-section').style.display = 'none';

// Mock document & window
const mockDocument = {
  documentElement: new MockElement('html'),
  head: new MockElement('head'),
  body: new MockElement('body'),
  title: 'CalcHub | 200 Free & Accurate Online Calculators',
  getElementById: (id) => elementStore[id] || null,
  querySelector: (sel) => {
    if (sel.startsWith('#')) return elementStore[sel.slice(1)] || null;
    return new MockElement();
  },
  querySelectorAll: (sel) => {
    if (sel.includes('.calc-tab-btn')) {
      return ['basic-calculator', 'percentage-calculator', 'bmi-calculator'].map(id => {
        const el = new MockElement('button');
        el.setAttribute('data-calc-id', id);
        return el;
      });
    }
    if (sel.includes('.hero-pill-btn')) {
      return ['all', 'basic-everyday', 'math', 'finance'].map(id => {
        const el = new MockElement('button');
        el.setAttribute('data-cat-id', id);
        if (id === 'all') el.classList.add('active');
        return el;
      });
    }
    if (sel.includes('.nav-link')) {
      return [getOrCreate('nav-home-btn'), getOrCreate('nav-categories-btn'), getOrCreate('nav-popular-btn')];
    }
    return [];
  },
  createElement: (tag) => new MockElement(tag),
  addEventListener: (event, fn) => {
    mockDocument.listeners = mockDocument.listeners || {};
    if (!mockDocument.listeners[event]) mockDocument.listeners[event] = [];
    mockDocument.listeners[event].push(fn);
  }
};

const mockHistory = {
  stack: ['/'],
  pushState: (state, title, url) => {
    mockHistory.stack.push(url);
    if (url.startsWith('#')) mockWindow.location.hash = url;
    else mockWindow.location.hash = '';
  },
  replaceState: (state, title, url) => {
    if (url.startsWith('#')) mockWindow.location.hash = url;
    else mockWindow.location.hash = '';
  }
};

const mockWindow = {
  location: {
    hash: '',
    pathname: '/',
    search: ''
  },
  history: mockHistory,
  scrollTo: () => {},
  addEventListener: (event, fn) => {
    mockWindow.listeners = mockWindow.listeners || {};
    if (!mockWindow.listeners[event]) mockWindow.listeners[event] = [];
    mockWindow.listeners[event].push(fn);
  },
  dispatchEvent: (event) => {
    const list = mockWindow.listeners?.[event.type || event] || [];
    list.forEach(fn => fn(event));
  }
};

// Mock localStorage
const storage = {};
const mockLocalStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; }
};

// Load and evaluate JS scripts in this mock environment
const dataJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'calculators-data.js'), 'utf8');
const enginesJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'calculator-engines.js'), 'utf8');
const appJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'app.js'), 'utf8');

const context = {
  window: mockWindow,
  document: mockDocument,
  history: mockHistory,
  localStorage: mockLocalStorage,
  navigator: { clipboard: { writeText: async () => {} } },
  console,
  setTimeout: (fn) => fn(),
  clearTimeout: () => {},
  setInterval: () => {},
  clearInterval: () => {}
};

// Run scripts
const vm = require('vm');
vm.createContext(context);
vm.runInContext(dataJs, context);
vm.runInContext(enginesJs, context);
vm.runInContext(appJs, context);

// Trigger DOMContentLoaded
const domLoadedFns = mockDocument.listeners?.['DOMContentLoaded'] || [];
domLoadedFns.forEach(fn => fn());

console.log('\n--- Step 1: Initial Page Load (Home State) ---');
const calcSection = getOrCreate('quick-calc-section');
if (calcSection.style.display !== 'none') {
  throw new Error(`FAIL: Calculator workspace should be display: none on Home, got: "${calcSection.style.display}"`);
}
console.log('✓ Calculator workspace #quick-calc-section is completely hidden (display: none)');
console.log(`✓ Active calculator state: ${mockWindow.getCurrentCalcId()} (null on clean Home page)`);
console.log(`✓ Nav Home button active class: ${getOrCreate('nav-home-btn').classList.contains('active')}`);

console.log('\n--- Step 2: Open "Percentage Calculator" ---');
mockWindow.renderActiveCalculator('percentage-calculator');

if (calcSection.style.display !== 'block') {
  throw new Error(`FAIL: Calculator workspace did not show (got: "${calcSection.style.display}")`);
}
const activeTitle = getOrCreate('active-calc-title').textContent;
if (!activeTitle.includes('Percentage')) {
  throw new Error(`FAIL: Expected Percentage Calculator, got: "${activeTitle}"`);
}
console.log(`✓ Active calculator displayed: "${activeTitle}"`);
console.log(`✓ URL hash updated to: "${mockWindow.location.hash}"`);

console.log('\n--- Step 3 & 4: Enter Values & Calculate Result "25" ---');
// Set inputs for Percentage Calculator: 25% of 100 = 25
const formVals = mockWindow.getCurrentFormValues();
formVals['mode'] = 'what_is';
formVals['val1'] = 25;
formVals['val2'] = 100;
mockWindow.executeCalculation(true);

const calcResult = getOrCreate('primary-result-value').textContent;
console.log(`✓ Calculated output: "${calcResult}"`);
if (!calcResult.includes('25')) {
  throw new Error(`FAIL: Expected result to contain 25, got: "${calcResult}"`);
}

console.log('\n--- Step 5: Click "Home" Navigation Button ---');
getOrCreate('nav-home-btn').click();

console.log('\n--- Step 6 & 7: Verify ONLY Home Page Content Is Visible & Result 25 is GONE ---');
if (calcSection.style.display !== 'none') {
  throw new Error(`FAIL: Calculator workspace must be hidden after clicking Home, got: "${calcSection.style.display}"`);
}
console.log('✓ Calculator workspace #quick-calc-section is completely hidden (display: none).');

const resultAfterHome = getOrCreate('primary-result-value').textContent;
if (resultAfterHome === '25' || resultAfterHome.includes('25')) {
  throw new Error(`FAIL: Stale result "${resultAfterHome}" leaked into Home page!`);
}
console.log(`✓ Primary result reset to: "${resultAfterHome}" (old 25 result completely erased)`);

if (mockWindow.getCurrentCalcId() !== null) {
  throw new Error(`FAIL: currentCalcId should be null on Home, found: "${mockWindow.getCurrentCalcId()}"`);
}
console.log('✓ currentCalcId reset to null');

if (mockWindow.location.hash !== '') {
  throw new Error(`FAIL: URL hash should be empty on Home, found: "${mockWindow.location.hash}"`);
}
console.log('✓ URL hash cleanly cleared back to home "/"');

console.log('\n--- Step 8 & 9: Open Another Calculator ("BMI Calculator") & Confirm Clean Inputs ---');
mockWindow.renderActiveCalculator('bmi-calculator');

if (calcSection.style.display !== 'block') {
  throw new Error('FAIL: Calculator workspace did not show for BMI calculator');
}
const bmiResult = getOrCreate('primary-result-value').textContent;
console.log(`✓ BMI calculator opened fresh with result: "${bmiResult}"`);
if (bmiResult === '25' || bmiResult.includes('25')) {
  throw new Error('FAIL: Previous Percentage result (25) leaked into BMI Calculator!');
}
console.log('✓ Confirmed: BMI calculator starts fresh with zero leakage from percentage calculator.');

console.log('\n--- Step 10: Test Browser Back/Forward Navigation (Home -> Calc -> Back to Home) ---');
// User is on BMI Calculator (#bmi-calculator).
// Browser Back button is clicked: hash becomes '' and 'popstate'/'hashchange' fires.
mockWindow.location.hash = '';
mockWindow.dispatchEvent({ type: 'popstate' });

if (calcSection.style.display !== 'none') {
  throw new Error('FAIL: Browser Back button did not return to clean Home page');
}
const backResult = getOrCreate('primary-result-value').textContent;
if (backResult !== '0') {
  throw new Error(`FAIL: Browser Back did not reset primary result to 0, found: "${backResult}"`);
}
console.log('✓ Browser Back navigation cleanly returned to Home with zero leftover calculator output.');

console.log('\n======================================================');
console.log('🎉 ALL HOME NAVIGATION & STATE RESET TESTS PASSED! 🎉');
console.log('======================================================\n');

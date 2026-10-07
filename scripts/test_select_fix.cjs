const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const pubHtml = fs.readFileSync('public/index.html', 'utf8');
const css = fs.readFileSync('css/styles.css', 'utf8');
const pubCss = fs.readFileSync('public/css/styles.css', 'utf8');

console.log('--- TEST: Select Box & Category Dropdown Styling ---');

const check1 = !html.includes('id="cat-browser-select" class="form-select" style=');
console.log('1. Inline conflict removed in index.html:', check1);

const check2 = !pubHtml.includes('id="cat-browser-select" class="form-select" style=');
console.log('2. Inline conflict removed in public/index.html:', check2);

const check3 = html.includes('class="form-select cat-browser-select"') && pubHtml.includes('class="form-select cat-browser-select"');
console.log('3. cat-browser-select class present in both:', check3);

const check4 = css.includes('.cat-browser-select') && pubCss.includes('.cat-browser-select');
console.log('4. .cat-browser-select rule present in both CSS:', check4);

const check5 = css.includes('appearance: none;') && css.includes('background-image: url(');
console.log('5. Custom SVG dropdown chevron and appearance reset present:', check5);

const check6 = css.includes('height: 42px;') && css.includes('padding: 0.45rem 2.35rem 0.45rem 0.95rem;');
console.log('6. Form-select balanced height & padding present:', check6);

if (check1 && check2 && check3 && check4 && check5 && check6) {
  console.log('ALL SELECT STYLING CHECKS PASSED!');
  process.exit(0);
} else {
  console.error('CHECKS FAILED');
  process.exit(1);
}

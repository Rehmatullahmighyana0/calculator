const fs = require('fs');

const css = fs.readFileSync('css/styles.css', 'utf8');
const pubCss = fs.readFileSync('public/css/styles.css', 'utf8');

console.log('--- TEST: Input Field Non-White Focus & Data Entry Fix ---');

// 1. Ensure hardcoded white focus background is completely gone
const checkNoWhiteFocus = !css.includes('.form-input:focus, .form-select:focus {\n  border-color: var(--primary);\n  background-color: #FFFFFF;') &&
                          !pubCss.includes('.form-input:focus, .form-select:focus {\n  border-color: var(--primary);\n  background-color: #FFFFFF;');
console.log('1. Hardcoded #FFFFFF on focus removed:', checkNoWhiteFocus);

// 2. Form input focus has non-white background
const checkNonWhiteFocus = css.includes('.form-input:focus {\n  background-color: #EEF2F6;') &&
                           pubCss.includes('.form-input:focus {\n  background-color: #EEF2F6;');
console.log('2. Light theme input focus is soft-tinted (#EEF2F6):', checkNonWhiteFocus);

// 3. Dark theme input focus is dark (#162035)
const checkDarkFocus = css.includes('[data-theme="dark"] .form-input:focus {\n  background-color: #162035;') &&
                       pubCss.includes('[data-theme="dark"] .form-input:focus {\n  background-color: #162035;');
console.log('3. Dark theme input focus is dark (#162035):', checkDarkFocus);

// 4. Autofill protection present
const checkAutofill = css.includes('.form-input:-webkit-autofill') && pubCss.includes('.form-input:-webkit-autofill');
console.log('4. Autofill background override present:', checkAutofill);

if (checkNoWhiteFocus && checkNonWhiteFocus && checkDarkFocus && checkAutofill) {
  console.log('ALL INPUT FOCUS CHECKS PASSED SUCCESSFULLY!');
  process.exit(0);
} else {
  console.error('CHECKS FAILED');
  process.exit(1);
}

// Common mathematical and formatting utilities for all 200 calculator engines

function toNum(val, fallback = 0) {
  if (val === undefined || val === null || val === '') return fallback;
  const n = parseFloat(val);
  return isNaN(n) ? fallback : n;
}

function formatNum(num, maxDecimals = 4) {
  if (typeof num !== 'number' || !isFinite(num)) return '0';
  if (Number.isInteger(num)) return num.toLocaleString('en-US');
  const rounded = parseFloat(num.toFixed(maxDecimals));
  return rounded.toLocaleString('en-US', { maximumFractionDigits: maxDecimals });
}

function gcd(a, b) {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

function lcm(a, b) {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  return (a * b) / gcd(a, b);
}

module.exports = {
  toNum,
  formatNum,
  gcd,
  lcm
};


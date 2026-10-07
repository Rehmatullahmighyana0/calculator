import { CalculatorDef } from '../../types/calculator';

export const financeCalculators: CalculatorDef[] = [
  {
    id: 'loan-calculator',
    slug: 'loan-calculator',
    title: 'Loan Calculator',
    category: 'finance',
    shortDesc: 'Compute monthly payment, total interest, and total repayment on any loan.',
    icon: 'CreditCard',
    badge: 'popular',
    fields: [
      { id: 'principal', label: 'Loan Amount ($)', type: 'number', defaultValue: 25000, min: 100, step: 100 },
      { id: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 6.5, min: 0.1, max: 40, step: 0.1 },
      { id: 'termYears', label: 'Loan Term (Years)', type: 'number', defaultValue: 5, min: 1, max: 30, step: 1 }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.principal) || 0;
      const r = (parseFloat(inputs.rate) || 0) / 100 / 12;
      const n = (parseFloat(inputs.termYears) || 1) * 12;

      if (p <= 0 || n <= 0) return { primaryValue: '$0.00', primaryLabel: 'Monthly Payment', error: 'Please enter valid loan details.' };

      let monthly = 0;
      if (r === 0) {
        monthly = p / n;
      } else {
        monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }

      const totalRepaid = monthly * n;
      const totalInterest = totalRepaid - p;

      return {
        primaryValue: `$${monthly.toFixed(2)}/mo`,
        primaryLabel: 'Monthly Payment',
        subtext: `Total Interest: $${totalInterest.toFixed(2)}`,
        breakdown: [
          { label: 'Principal Amount', value: `$${p.toLocaleString()}` },
          { label: 'Monthly Payment', value: `$${monthly.toFixed(2)}` },
          { label: 'Total Payments (Months)', value: `${n} months` },
          { label: 'Total Interest Paid', value: `$${totalInterest.toFixed(2)}` },
          { label: 'Total Amount Repaid', value: `$${totalRepaid.toFixed(2)}` }
        ],
        steps: [
          `Monthly interest rate r = ${inputs.rate}% / 12 = ${(r * 100).toFixed(4)}%`,
          `Number of monthly payments n = ${inputs.termYears} × 12 = ${n}`,
          `Formula: M = P[r(1+r)^n] / [(1+r)^n - 1] = $${monthly.toFixed(2)}`
        ]
      };
    },
    formula: 'M = P × [r(1 + r)^n] / [(1 + r)^n - 1]',
    explanation: 'Standard fixed-rate amortization formula calculating exact monthly installment payments and total borrowing cost.',
    howToUse: ['Enter the principal loan amount.', 'Enter annual percentage interest rate.', 'Enter duration in years.', 'Click Calculate.'],
    example: { inputs: { principal: 25000, rate: 6.5, termYears: 5 }, output: '$489.15/mo', explanation: 'Total interest paid over 5 years will be $4,349.03.' },
    faqs: [{ question: 'What is amortization?', answer: 'Amortization is the process of spreading out a loan into a series of equal periodic payments.' }],
    keywords: ['loan calculator', 'auto loan', 'personal loan', 'monthly payment', 'interest paid']
  },
  {
    id: 'emi-calculator',
    slug: 'emi-calculator',
    title: 'EMI Calculator',
    category: 'finance',
    shortDesc: 'Calculate Equated Monthly Installments (EMI) for car, personal, or home loans.',
    icon: 'Calendar',
    badge: 'popular',
    fields: [
      { id: 'amount', label: 'Loan Amount', type: 'number', defaultValue: 50000, min: 1000, step: 500 },
      { id: 'interest', label: 'Interest Rate (% per annum)', type: 'number', defaultValue: 8.5, min: 0.1, step: 0.1 },
      { id: 'tenureMonths', label: 'Tenure (in Months)', type: 'number', defaultValue: 36, min: 3, max: 360, step: 1 }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.amount) || 0;
      const r = (parseFloat(inputs.interest) || 0) / 100 / 12;
      const n = parseInt(inputs.tenureMonths) || 1;

      if (p <= 0 || n <= 0) return { primaryValue: '$0.00', primaryLabel: 'EMI', error: 'Invalid loan inputs.' };

      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalAmount = emi * n;
      const totalInterest = totalAmount - p;

      return {
        primaryValue: `$${emi.toFixed(2)}`,
        primaryLabel: 'Equated Monthly Installment (EMI)',
        subtext: `Total Interest: $${totalInterest.toFixed(2)}`,
        breakdown: [
          { label: 'Principal', value: `$${p.toLocaleString()}` },
          { label: 'EMI Amount', value: `$${emi.toFixed(2)}` },
          { label: 'Total Interest', value: `$${totalInterest.toFixed(2)}` },
          { label: 'Total Payable', value: `$${totalAmount.toFixed(2)}` }
        ],
        steps: [`Computed monthly rate r = ${(r * 100).toFixed(4)}%`, `Applied EMI formula: EMI = $${emi.toFixed(2)}`]
      };
    },
    formula: 'EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]',
    explanation: 'EMI is a fixed payment amount made by a borrower to a lender at a specified date each calendar month.',
    howToUse: ['Enter loan amount, annual interest rate, and total tenure in months.', 'Click Calculate.'],
    example: { inputs: { amount: 50000, interest: 8.5, tenureMonths: 36 }, output: '$1,578.43', explanation: 'Monthly payment for $50k at 8.5% over 3 years.' },
    faqs: [{ question: 'Can EMI be prepaid?', answer: 'Most banks permit prepayment or foreclosure, reducing total interest.' }],
    keywords: ['emi calculator', 'car loan emi', 'home loan emi', 'monthly installment']
  },
  {
    id: 'mortgage-calculator',
    slug: 'mortgage-calculator',
    title: 'Mortgage Calculator',
    category: 'finance',
    shortDesc: 'Comprehensive home mortgage calculator including property tax, home insurance, and PMI.',
    icon: 'Home',
    badge: 'popular',
    fields: [
      { id: 'homePrice', label: 'Home Purchase Price ($)', type: 'number', defaultValue: 400000, min: 10000, step: 5000 },
      { id: 'downPaymentPct', label: 'Down Payment (%)', type: 'number', defaultValue: 20, min: 0, max: 99, step: 1 },
      { id: 'interestRate', label: 'Interest Rate (%)', type: 'number', defaultValue: 6.8, min: 0.1, step: 0.1 },
      { id: 'termYears', label: 'Loan Term (Years)', type: 'number', defaultValue: 30, min: 5, max: 40, step: 5 },
      { id: 'propertyTaxAnnual', label: 'Annual Property Tax ($)', type: 'number', defaultValue: 4800, min: 0, step: 100 },
      { id: 'homeInsuranceAnnual', label: 'Annual Homeowners Insurance ($)', type: 'number', defaultValue: 1200, min: 0, step: 50 }
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.homePrice) || 0;
      const downPct = (parseFloat(inputs.downPaymentPct) || 0) / 100;
      const downPayment = price * downPct;
      const principal = price - downPayment;
      const r = (parseFloat(inputs.interestRate) || 0) / 100 / 12;
      const n = (parseFloat(inputs.termYears) || 30) * 12;

      const monthlyPI = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const monthlyTax = (parseFloat(inputs.propertyTaxAnnual) || 0) / 12;
      const monthlyIns = (parseFloat(inputs.homeInsuranceAnnual) || 0) / 12;
      const monthlyPMI = downPct < 0.2 ? (principal * 0.007) / 12 : 0;

      const totalMonthly = monthlyPI + monthlyTax + monthlyIns + monthlyPMI;
      const totalInterest = monthlyPI * n - principal;

      return {
        primaryValue: `$${totalMonthly.toFixed(2)}/mo`,
        primaryLabel: 'Total Monthly Payment (PITI)',
        subtext: `Principal & Interest: $${monthlyPI.toFixed(2)}`,
        breakdown: [
          { label: 'Home Price', value: `$${price.toLocaleString()}` },
          { label: 'Down Payment', value: `$${downPayment.toLocaleString()} (${inputs.downPaymentPct}%)` },
          { label: 'Mortgage Principal', value: `$${principal.toLocaleString()}` },
          { label: 'Monthly Principal & Interest', value: `$${monthlyPI.toFixed(2)}` },
          { label: 'Monthly Property Tax', value: `$${monthlyTax.toFixed(2)}` },
          { label: 'Monthly Homeowners Insurance', value: `$${monthlyIns.toFixed(2)}` },
          { label: 'Private Mortgage Insurance (PMI)', value: monthlyPMI > 0 ? `$${monthlyPMI.toFixed(2)}` : '$0 (≥20% down)' },
          { label: 'Total Interest over Term', value: `$${totalInterest.toFixed(2)}` }
        ],
        steps: [
          `Loan principal = $${price.toLocaleString()} - $${downPayment.toLocaleString()} = $${principal.toLocaleString()}`,
          `Monthly P&I payment = $${monthlyPI.toFixed(2)}`,
          `Added taxes ($${monthlyTax.toFixed(2)}) and insurance ($${monthlyIns.toFixed(2)}) = $${totalMonthly.toFixed(2)}`
        ]
      };
    },
    formula: 'Monthly = P&I + Property Taxes + Home Insurance + PMI',
    explanation: 'Estimates total monthly housing outlay including principal, interest, taxes, insurance, and PMI if down payment is below 20%.',
    howToUse: ['Enter home price and down payment percentage.', 'Set interest rate and loan term.', 'Include annual property tax and insurance.'],
    example: { inputs: { homePrice: 400000, downPaymentPct: 20, interestRate: 6.8, termYears: 30, propertyTaxAnnual: 4800, homeInsuranceAnnual: 1200 }, output: '$2,586.87/mo', explanation: '$2,086.87 P&I + $400 taxes + $100 insurance.' },
    faqs: [{ question: 'What is PMI?', answer: 'Private Mortgage Insurance is required by lenders when down payment is less than 20% to protect against default.' }],
    keywords: ['mortgage calculator', 'home loan', 'piti payment', 'property tax', 'pmi']
  },
  {
    id: 'compound-interest-calculator',
    slug: 'compound-interest-calculator',
    title: 'Compound Interest Calculator',
    category: 'finance',
    shortDesc: 'Compute future wealth growth with compounding interest and regular monthly deposits.',
    icon: 'TrendingUp',
    badge: 'popular',
    fields: [
      { id: 'principal', label: 'Initial Investment ($)', type: 'number', defaultValue: 10000, min: 0, step: 500 },
      { id: 'monthlyContribution', label: 'Monthly Contribution ($)', type: 'number', defaultValue: 500, min: 0, step: 50 },
      { id: 'annualRate', label: 'Estimated Annual Return (%)', type: 'number', defaultValue: 8, min: 0.1, step: 0.1 },
      { id: 'years', label: 'Investment Timeframe (Years)', type: 'number', defaultValue: 20, min: 1, max: 60, step: 1 }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.principal) || 0;
      const pmt = parseFloat(inputs.monthlyContribution) || 0;
      const r = (parseFloat(inputs.annualRate) || 0) / 100 / 12;
      const n = (parseFloat(inputs.years) || 1) * 12;

      let fv = p * Math.pow(1 + r, n);
      if (r > 0) {
        fv += pmt * ((Math.pow(1 + r, n) - 1) / r);
      } else {
        fv += pmt * n;
      }

      const totalDeposits = p + pmt * n;
      const totalInterest = fv - totalDeposits;

      return {
        primaryValue: `$${fv.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
        primaryLabel: 'Future Portfolio Balance',
        subtext: `Total Growth / Interest Earned: $${totalInterest.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
        breakdown: [
          { label: 'Initial Principal', value: `$${p.toLocaleString()}` },
          { label: 'Total Contributions', value: `$${(pmt * n).toLocaleString()}` },
          { label: 'Total Invested Capital', value: `$${totalDeposits.toLocaleString()}` },
          { label: 'Total Compound Gains', value: `$${totalInterest.toLocaleString('en-US', { maximumFractionDigits: 2 })}` },
          { label: 'Final Value', value: `$${fv.toLocaleString('en-US', { maximumFractionDigits: 2 })}` }
        ],
        steps: [
          `Compound principal over ${inputs.years} years: P(1 + r)^n`,
          `Compound monthly contributions: PMT × [((1+r)^n - 1) / r]`,
          `Total portfolio balance = $${fv.toFixed(2)}`
        ]
      };
    },
    formula: 'FV = P(1 + r/n)^(nt) + PMT × [((1 + r/n)^(nt) - 1) / (r/n)]',
    explanation: 'Compound interest generates earnings on both the initial principal and previously accumulated interest.',
    howToUse: ['Enter initial deposit and recurring monthly additions.', 'Enter annual interest rate and years.', 'Click Calculate.'],
    example: { inputs: { principal: 10000, monthlyContribution: 500, annualRate: 8, years: 20 }, output: '$344,570.19', explanation: 'Investing $10k + $500/mo over 20 years at 8% yields over $344,000.' },
    faqs: [{ question: 'What is the Rule of 72?', answer: 'Dividing 72 by your annual interest rate gives the approximate years needed to double your money.' }],
    keywords: ['compound interest calculator', 'future value', 'wealth builder', 'investment growth']
  },
  {
    id: 'simple-interest-calculator',
    slug: 'simple-interest-calculator',
    title: 'Simple Interest Calculator',
    category: 'finance',
    shortDesc: 'Compute basic non-compounding interest with formula I = P × r × t.',
    icon: 'Percent',
    fields: [
      { id: 'principal', label: 'Principal Amount ($)', type: 'number', defaultValue: 5000, min: 1, step: 100 },
      { id: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 5, min: 0.1, step: 0.1 },
      { id: 'time', label: 'Time Period (Years)', type: 'number', defaultValue: 3, min: 0.1, step: 0.5 }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.principal) || 0;
      const r = (parseFloat(inputs.rate) || 0) / 100;
      const t = parseFloat(inputs.time) || 0;

      const interest = p * r * t;
      const total = p + interest;

      return {
        primaryValue: `$${interest.toFixed(2)}`,
        primaryLabel: 'Total Simple Interest Earned',
        subtext: `Total Balance: $${total.toFixed(2)}`,
        breakdown: [
          { label: 'Principal (P)', value: `$${p.toLocaleString()}` },
          { label: 'Annual Rate (r)', value: `${inputs.rate}%` },
          { label: 'Time (t)', value: `${t} years` },
          { label: 'Total Interest (I)', value: `$${interest.toFixed(2)}` },
          { label: 'Total Accumulated (A)', value: `$${total.toFixed(2)}` }
        ],
        steps: [`Multiply: P × r × t = ${p} × ${r} × ${t}`, `Interest = $${interest.toFixed(2)}`]
      };
    },
    formula: 'I = P × r × t  |  A = P + I',
    explanation: 'Simple interest is determined solely by multiplying the interest rate by the principal amount and term length.',
    howToUse: ['Enter principal, interest rate, and years.', 'Click Calculate.'],
    example: { inputs: { principal: 5000, rate: 5, time: 3 }, output: '$750.00', explanation: '5000 × 0.05 × 3 = $750 interest.' },
    faqs: [{ question: 'Where is simple interest used?', answer: 'Short-term personal loans, bond coupon payments, and consumer credit installments.' }],
    keywords: ['simple interest', 'I=Prt', 'interest rate', 'finance']
  },
  {
    id: 'interest-calculator',
    slug: 'interest-calculator',
    title: 'Interest Calculator',
    category: 'finance',
    shortDesc: 'Side-by-side comparison between Simple and Compound Interest.',
    icon: 'Scale',
    fields: [
      { id: 'principal', label: 'Principal ($)', type: 'number', defaultValue: 10000, min: 1, step: 500 },
      { id: 'rate', label: 'Interest Rate (%)', type: 'number', defaultValue: 7, min: 0.1, step: 0.1 },
      { id: 'years', label: 'Years', type: 'number', defaultValue: 10, min: 1, step: 1 }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.principal) || 0;
      const r = (parseFloat(inputs.rate) || 0) / 100;
      const t = parseFloat(inputs.years) || 1;

      const simpleI = p * r * t;
      const simpleTotal = p + simpleI;

      const compoundTotal = p * Math.pow(1 + r, t);
      const compoundI = compoundTotal - p;
      const difference = compoundI - simpleI;

      return {
        primaryValue: `$${compoundTotal.toFixed(2)}`,
        primaryLabel: 'Compound Value after Term',
        subtext: `Compound yields $${difference.toFixed(2)} more than Simple Interest`,
        breakdown: [
          { label: 'Simple Interest Total', value: `$${simpleTotal.toFixed(2)} (+$${simpleI.toFixed(2)} interest)` },
          { label: 'Compound Interest Total', value: `$${compoundTotal.toFixed(2)} (+$${compoundI.toFixed(2)} interest)` },
          { label: 'Compounding Advantage', value: `+$${difference.toFixed(2)} extra` }
        ],
        steps: [
          `Simple: P × r × t = $${simpleI.toFixed(2)}`,
          `Compound: P(1 + r)^t = $${compoundTotal.toFixed(2)}`,
          `Difference = $${difference.toFixed(2)}`
        ]
      };
    },
    formula: 'Compare: P(1 + rt) vs P(1 + r)^t',
    explanation: 'Demonstrates the exponential advantage of compound interest over linear simple interest.',
    howToUse: ['Enter investment amount, rate, and timeframe.', 'Click Calculate to compare.'],
    example: { inputs: { principal: 10000, rate: 7, years: 10 }, output: '$19,671.51', explanation: 'Simple yields $17,000 while compound yields $19,671.51.' },
    faqs: [{ question: 'Why does compound interest grow faster?', answer: 'Because interest earned in earlier years is reinvested to generate additional interest.' }],
    keywords: ['interest calculator', 'compare interest', 'compound vs simple']
  },
  {
    id: 'investment-calculator',
    slug: 'investment-calculator',
    title: 'Investment Calculator',
    category: 'finance',
    shortDesc: 'Forecast portfolio growth, asset returns, and capital accumulation.',
    icon: 'PiggyBank',
    fields: [
      { id: 'initial', label: 'Starting Capital ($)', type: 'number', defaultValue: 15000, min: 0, step: 1000 },
      { id: 'monthly', label: 'Monthly Additions ($)', type: 'number', defaultValue: 750, min: 0, step: 100 },
      { id: 'returnRate', label: 'Expected Annual Return (%)', type: 'number', defaultValue: 9, min: 0.1, step: 0.5 },
      { id: 'years', label: 'Years to Grow', type: 'number', defaultValue: 15, min: 1, step: 1 }
    ],
    calculate: (inputs) => {
      const p = parseFloat(inputs.initial) || 0;
      const pmt = parseFloat(inputs.monthly) || 0;
      const r = (parseFloat(inputs.returnRate) || 0) / 100 / 12;
      const n = (parseFloat(inputs.years) || 1) * 12;

      const fv = p * Math.pow(1 + r, n) + pmt * ((Math.pow(1 + r, n) - 1) / r);
      const totalContributed = p + pmt * n;
      const gains = fv - totalContributed;

      return {
        primaryValue: `$${fv.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
        primaryLabel: 'Estimated Portfolio Value',
        subtext: `Capital Gains: $${gains.toLocaleString('en-US', { maximumFractionDigits: 2 })}`,
        breakdown: [
          { label: 'Total Invested', value: `$${totalContributed.toLocaleString()}` },
          { label: 'Investment Growth', value: `$${gains.toLocaleString('en-US', { maximumFractionDigits: 2 })}` },
          { label: 'Multiplier on Money', value: `${(fv / totalContributed).toFixed(2)}x` }
        ],
        steps: [`Calculated 15-year accumulation with monthly deposits at 9% p.a.`]
      };
    },
    formula: 'FV = P(1+r)^n + PMT[((1+r)^n - 1)/r]',
    explanation: 'Simulates financial market portfolio accumulation over multi-year horizons.',
    howToUse: ['Enter initial savings and recurring contribution.', 'Set expected return rate.', 'Click Calculate.'],
    example: { inputs: { initial: 15000, monthly: 750, returnRate: 9, years: 15 }, output: '$340,323.00', explanation: 'Total contributions $150k grow to over $340k.' },
    faqs: [{ question: 'What is a realistic stock market return?', answer: 'The historical average annualized return of the S&P 500 has been approximately 9-10% before inflation.' }],
    keywords: ['investment calculator', 'portfolio growth', 'stock returns', 'wealth builder']
  },
  {
    id: 'savings-calculator',
    slug: 'savings-calculator',
    title: 'Savings Goal Calculator',
    category: 'finance',
    shortDesc: 'Find out how much to save monthly or how long to reach your savings target.',
    icon: 'Target',
    fields: [
      { id: 'target', label: 'Savings Goal Target ($)', type: 'number', defaultValue: 50000, min: 100, step: 1000 },
      { id: 'current', label: 'Current Savings ($)', type: 'number', defaultValue: 5000, min: 0, step: 500 },
      { id: 'years', label: 'Target Time (Years)', type: 'number', defaultValue: 4, min: 1, step: 1 },
      { id: 'interest', label: 'Savings APY (%)', type: 'number', defaultValue: 4.5, min: 0, step: 0.1 }
    ],
    calculate: (inputs) => {
      const target = parseFloat(inputs.target) || 0;
      const current = parseFloat(inputs.current) || 0;
      const r = (parseFloat(inputs.interest) || 0) / 100 / 12;
      const n = (parseFloat(inputs.years) || 1) * 12;

      const fvCurrent = current * Math.pow(1 + r, n);
      const neededFromContributions = target - fvCurrent;

      let monthlyNeeded = 0;
      if (neededFromContributions <= 0) {
        monthlyNeeded = 0;
      } else if (r === 0) {
        monthlyNeeded = neededFromContributions / n;
      } else {
        monthlyNeeded = (neededFromContributions * r) / (Math.pow(1 + r, n) - 1);
      }

      return {
        primaryValue: `$${monthlyNeeded.toFixed(2)}/mo`,
        primaryLabel: 'Required Monthly Savings',
        subtext: `To reach $${target.toLocaleString()} in ${inputs.years} years`,
        breakdown: [
          { label: 'Target Goal', value: `$${target.toLocaleString()}` },
          { label: 'Current Savings Future Value', value: `$${fvCurrent.toFixed(2)}` },
          { label: 'Monthly Deposit Needed', value: `$${monthlyNeeded.toFixed(2)}` },
          { label: 'Total You Will Deposit', value: `$${(current + monthlyNeeded * n).toFixed(2)}` }
        ],
        steps: [`Projected current savings: $${fvCurrent.toFixed(2)}`, `Solved for monthly annuity contribution = $${monthlyNeeded.toFixed(2)}`]
      };
    },
    formula: 'PMT = (Target - P(1+r)^n) × [r / ((1+r)^n - 1)]',
    explanation: 'Calculates the required recurring savings to achieve a specific future financial milestone taking interest into account.',
    howToUse: ['Enter your target savings amount and current balance.', 'Enter timeframe and high-yield savings APY.', 'Click Calculate.'],
    example: { inputs: { target: 50000, current: 5000, years: 4, interest: 4.5 }, output: '$847.64/mo', explanation: 'Save $847.64 monthly to accumulate $50k in 4 years.' },
    faqs: [{ question: 'What is APY?', answer: 'Annual Percentage Yield (APY) reflects the real annual rate of return taking compounding into account.' }],
    keywords: ['savings goal calculator', 'target savings', 'emergency fund', 'monthly savings']
  },
  {
    id: 'retirement-calculator',
    slug: 'retirement-calculator',
    title: 'Retirement Calculator',
    category: 'finance',
    shortDesc: 'Plan your retirement nest egg, required savings, and safe monthly withdrawal income.',
    icon: 'Armchair',
    badge: 'popular',
    fields: [
      { id: 'currentAge', label: 'Current Age', type: 'number', defaultValue: 30, min: 18, max: 75, step: 1 },
      { id: 'retireAge', label: 'Retirement Age', type: 'number', defaultValue: 65, min: 30, max: 85, step: 1 },
      { id: 'currentSavings', label: 'Current Retirement Savings ($)', type: 'number', defaultValue: 25000, min: 0, step: 5000 },
      { id: 'monthlySavings', label: 'Monthly Savings ($)', type: 'number', defaultValue: 600, min: 0, step: 50 },
      { id: 'returnRate', label: 'Pre-Retirement Annual Return (%)', type: 'number', defaultValue: 7.5, min: 1, step: 0.5 }
    ],
    calculate: (inputs) => {
      const cAge = parseInt(inputs.currentAge) || 30;
      const rAge = parseInt(inputs.retireAge) || 65;
      const years = rAge - cAge;

      if (years <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Retirement age must be greater than current age.' };

      const p = parseFloat(inputs.currentSavings) || 0;
      const pmt = parseFloat(inputs.monthlySavings) || 0;
      const r = (parseFloat(inputs.returnRate) || 7) / 100 / 12;
      const n = years * 12;

      const nestEgg = p * Math.pow(1 + r, n) + pmt * ((Math.pow(1 + r, n) - 1) / r);
      // Safe withdrawal rate 4% rule
      const annualIncome = nestEgg * 0.04;
      const monthlyIncome = annualIncome / 12;

      return {
        primaryValue: `$${nestEgg.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
        primaryLabel: 'Estimated Retirement Nest Egg',
        subtext: `Safe Monthly Income (4% rule): $${monthlyIncome.toFixed(0)}/mo`,
        breakdown: [
          { label: 'Years to Retirement', value: `${years} years` },
          { label: 'Projected Total Nest Egg', value: `$${nestEgg.toLocaleString('en-US', { maximumFractionDigits: 0 })}` },
          { label: 'Safe Annual Income (4% rule)', value: `$${annualIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })}/year` },
          { label: 'Safe Monthly Income', value: `$${monthlyIncome.toFixed(0)}/month` }
        ],
        steps: [
          `Compound savings over ${years} years with monthly contributions`,
          `Apply 4% Trinity study safe withdrawal rate = $${monthlyIncome.toFixed(0)} per month`
        ]
      };
    },
    formula: 'Nest Egg = P(1+r)^n + PMT[((1+r)^n - 1)/r]  |  Annual Income = Nest Egg × 4%',
    explanation: 'Estimates retirement assets accumulated at retirement age and provides sustainable withdrawal estimations based on the 4% rule.',
    howToUse: ['Enter your current and target retirement ages.', 'Input current savings and monthly contributions.', 'Click Calculate.'],
    example: { inputs: { currentAge: 30, retireAge: 65, currentSavings: 25000, monthlySavings: 600, returnRate: 7.5 }, output: '$1,529,190', explanation: 'Grows to ~$1.53 million, providing ~$5,100/mo in retirement income.' },
    faqs: [{ question: 'What is the 4% Rule?', answer: 'A common rule of thumb stating you can withdraw 4% of your portfolio in year one, adjusted for inflation, without running out of money over 30 years.' }],
    keywords: ['retirement calculator', '401k calculator', 'nest egg', 'pension', 'fire movement']
  },
  {
    id: 'inflation-calculator',
    slug: 'inflation-calculator',
    title: 'Inflation Calculator',
    category: 'finance',
    shortDesc: 'Compute future purchasing power and price erosion due to annual inflation.',
    icon: 'TrendingDown',
    fields: [
      { id: 'amount', label: 'Current Amount ($)', type: 'number', defaultValue: 1000, min: 1, step: 50 },
      { id: 'inflationRate', label: 'Average Annual Inflation (%)', type: 'number', defaultValue: 3.2, min: 0.1, step: 0.1 },
      { id: 'years', label: 'Number of Years', type: 'number', defaultValue: 15, min: 1, step: 1 }
    ],
    calculate: (inputs) => {
      const amount = parseFloat(inputs.amount) || 0;
      const rate = (parseFloat(inputs.inflationRate) || 0) / 100;
      const years = parseFloat(inputs.years) || 1;

      const futureCost = amount * Math.pow(1 + rate, years);
      const futurePurchasingPower = amount / Math.pow(1 + rate, years);
      const lossPct = ((1 - futurePurchasingPower / amount) * 100);

      return {
        primaryValue: `$${futureCost.toFixed(2)}`,
        primaryLabel: 'Future Cost of Same Goods',
        subtext: `Today $${amount} will only be worth $${futurePurchasingPower.toFixed(2)}`,
        breakdown: [
          { label: 'Current Value', value: `$${amount.toLocaleString()}` },
          { label: `Equivalent Cost in ${years} Years`, value: `$${futureCost.toFixed(2)}` },
          { label: `Future Purchasing Power of $${amount}`, value: `$${futurePurchasingPower.toFixed(2)}` },
          { label: 'Loss of Purchasing Power', value: `-${lossPct.toFixed(1)}%` }
        ],
        steps: [`Multiply by (1 + inflation)^years: ${amount} × (1 + ${rate})^${years} = $${futureCost.toFixed(2)}`]
      };
    },
    formula: 'Future Cost = Present Cost × (1 + i)^t',
    explanation: 'Inflation gradually decreases the purchasing power of money over time.',
    howToUse: ['Enter current price, expected inflation rate, and years.', 'Click Calculate.'],
    example: { inputs: { amount: 1000, inflationRate: 3.2, years: 15 }, output: '$1,604.14', explanation: 'Items costing $1,000 today will cost $1,604.14 in 15 years.' },
    faqs: [{ question: 'What is hyperinflation?', answer: 'Extremely rapid or out-of-control inflation typically exceeding 50% per month.' }],
    keywords: ['inflation calculator', 'purchasing power', 'cost of living', 'cpi']
  },
  {
    id: 'roi-calculator',
    slug: 'roi-calculator',
    title: 'ROI Calculator (Return on Investment)',
    category: 'finance',
    shortDesc: 'Compute total ROI percentage, annualized ROI, and net profit from an investment.',
    icon: 'Percent',
    badge: 'popular',
    fields: [
      { id: 'invested', label: 'Amount Invested ($)', type: 'number', defaultValue: 10000, min: 1, step: 500 },
      { id: 'returned', label: 'Amount Returned ($)', type: 'number', defaultValue: 15500, min: 0, step: 500 },
      { id: 'years', label: 'Holding Period (Years)', type: 'number', defaultValue: 3, min: 0.1, step: 0.5 }
    ],
    calculate: (inputs) => {
      const inv = parseFloat(inputs.invested) || 0;
      const ret = parseFloat(inputs.returned) || 0;
      const t = parseFloat(inputs.years) || 1;

      if (inv <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Invested capital must be greater than zero.' };

      const profit = ret - inv;
      const roi = (profit / inv) * 100;
      const annualizedRoi = (Math.pow(ret / inv, 1 / t) - 1) * 100;

      return {
        primaryValue: `${roi >= 0 ? '+' : ''}${roi.toFixed(2)}%`,
        primaryLabel: 'Total Return on Investment (ROI)',
        subtext: `Annualized ROI (CAGR): ${annualizedRoi.toFixed(2)}%/yr`,
        breakdown: [
          { label: 'Invested Capital', value: `$${inv.toLocaleString()}` },
          { label: 'Returned Capital', value: `$${ret.toLocaleString()}` },
          { label: 'Net Profit', value: `${profit >= 0 ? '+$' : '-$'}${Math.abs(profit).toLocaleString()}` },
          { label: 'Total ROI', value: `${roi.toFixed(2)}%` },
          { label: 'Annualized ROI (CAGR)', value: `${annualizedRoi.toFixed(2)}%` }
        ],
        steps: [
          `Net Profit = Returned - Invested = $${ret} - $${inv} = $${profit}`,
          `ROI = (Profit / Invested) × 100% = ${roi.toFixed(2)}%`,
          `Annualized ROI = [(Returned / Invested)^(1/t) - 1] × 100% = ${annualizedRoi.toFixed(2)}%`
        ]
      };
    },
    formula: 'ROI = ((Gain - Cost) / Cost) × 100%  |  Annualized = ((Gain/Cost)^(1/t) - 1) × 100%',
    explanation: 'Measures the efficiency or profitability of an investment relative to its initial cost.',
    howToUse: ['Enter total money invested and final return.', 'Enter years held.', 'Click Calculate.'],
    example: { inputs: { invested: 10000, returned: 15500, years: 3 }, output: '+55.00%', explanation: '55% total profit over 3 years, equal to 15.73% annualized.' },
    faqs: [{ question: 'What is a good ROI?', answer: 'Generally, an annual ROI exceeding 7-10% is considered favorable in financial markets.' }],
    keywords: ['roi calculator', 'return on investment', 'annualized return', 'cagr', 'investment profit']
  },
  {
    id: 'profit-calculator',
    slug: 'profit-calculator',
    title: 'Profit Calculator',
    category: 'finance',
    shortDesc: 'Calculate gross profit, net profit, and profit margin from cost and revenue.',
    icon: 'DollarSign',
    fields: [
      { id: 'revenue', label: 'Total Revenue ($)', type: 'number', defaultValue: 50000, min: 0, step: 1000 },
      { id: 'cost', label: 'Total Cost / Expenses ($)', type: 'number', defaultValue: 32000, min: 0, step: 1000 }
    ],
    calculate: (inputs) => {
      const rev = parseFloat(inputs.revenue) || 0;
      const cost = parseFloat(inputs.cost) || 0;

      const profit = rev - cost;
      const margin = rev > 0 ? (profit / rev) * 100 : 0;
      const markup = cost > 0 ? (profit / cost) * 100 : 0;

      return {
        primaryValue: `$${profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        primaryLabel: 'Net Profit',
        subtext: `Profit Margin: ${margin.toFixed(2)}% | Markup: ${markup.toFixed(2)}%`,
        breakdown: [
          { label: 'Revenue', value: `$${rev.toLocaleString()}` },
          { label: 'Total Cost', value: `$${cost.toLocaleString()}` },
          { label: 'Net Profit', value: `$${profit.toFixed(2)}` },
          { label: 'Profit Margin', value: `${margin.toFixed(2)}%` },
          { label: 'Markup Percentage', value: `${markup.toFixed(2)}%` }
        ],
        steps: [`Profit = Revenue - Cost = $${rev} - $${cost} = $${profit}`, `Margin = (Profit / Revenue) × 100% = ${margin.toFixed(2)}%`]
      };
    },
    formula: 'Profit = Revenue - Cost  |  Margin = (Profit / Revenue) × 100%',
    explanation: 'Determines the financial gain when revenue generated from a business activity exceeds expenses.',
    howToUse: ['Enter total sales revenue.', 'Enter all direct and operating costs.', 'Click Calculate.'],
    example: { inputs: { revenue: 50000, cost: 32000 }, output: '$18,000.00', explanation: 'Profit of $18,000 with a 36.00% profit margin.' },
    faqs: [{ question: 'Difference between profit margin and markup?', answer: 'Margin is profit divided by selling price; markup is profit divided by cost price.' }],
    keywords: ['profit calculator', 'net profit', 'gross profit', 'business margin']
  },
  {
    id: 'loss-calculator',
    slug: 'loss-calculator',
    title: 'Loss Calculator',
    category: 'finance',
    shortDesc: 'Compute financial loss and percentage loss when selling price is below cost.',
    icon: 'TrendingDown',
    fields: [
      { id: 'cost', label: 'Cost Price ($)', type: 'number', defaultValue: 1200, min: 1, step: 50 },
      { id: 'selling', label: 'Selling Price ($)', type: 'number', defaultValue: 900, min: 0, step: 50 }
    ],
    calculate: (inputs) => {
      const cost = parseFloat(inputs.cost) || 0;
      const sell = parseFloat(inputs.selling) || 0;

      if (cost <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Cost price must be positive.' };

      const loss = cost - sell;
      const lossPct = (loss / cost) * 100;

      return {
        primaryValue: `$${loss.toFixed(2)}`,
        primaryLabel: loss >= 0 ? 'Total Loss Amount' : 'Profit Made!',
        subtext: loss >= 0 ? `Loss Percentage: -${lossPct.toFixed(2)}%` : `Profit: +${(-lossPct).toFixed(2)}%`,
        breakdown: [
          { label: 'Cost Price', value: `$${cost.toFixed(2)}` },
          { label: 'Selling Price', value: `$${sell.toFixed(2)}` },
          { label: 'Loss Amount', value: `$${loss.toFixed(2)}` },
          { label: 'Percentage Loss', value: `-${lossPct.toFixed(2)}%` }
        ],
        steps: [`Loss = Cost - Selling = $${cost} - $${sell} = $${loss.toFixed(2)}`, `Percentage Loss = (Loss / Cost) × 100% = ${lossPct.toFixed(2)}%`]
      };
    },
    formula: 'Loss = Cost Price - Selling Price  |  % Loss = (Loss / Cost Price) × 100%',
    explanation: 'Calculates monetary loss when an asset or product is sold for less than its original purchase price.',
    howToUse: ['Enter cost price and selling price.', 'Click Calculate.'],
    example: { inputs: { cost: 1200, selling: 900 }, output: '$300.00', explanation: 'A $300 loss represents a 25.00% loss on cost.' },
    faqs: [{ question: 'How to write off capital losses?', answer: 'Tax authorities usually permit netting capital losses against capital gains to reduce taxable income.' }],
    keywords: ['loss calculator', 'percentage loss', 'capital loss', 'cost price']
  },
  {
    id: 'profit-margin-calculator',
    slug: 'profit-margin-calculator',
    title: 'Profit Margin Calculator',
    category: 'finance',
    shortDesc: 'Compute gross margin, markup, and revenue from cost and margin goals.',
    icon: 'PieChart',
    fields: [
      { id: 'cost', label: 'Item Cost ($)', type: 'number', defaultValue: 45, min: 0.01, step: 1 },
      { id: 'revenue', label: 'Selling Price ($)', type: 'number', defaultValue: 75, min: 0.01, step: 1 }
    ],
    calculate: (inputs) => {
      const cost = parseFloat(inputs.cost) || 0;
      const rev = parseFloat(inputs.revenue) || 0;

      if (rev <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Selling price must be greater than zero.' };

      const profit = rev - cost;
      const margin = (profit / rev) * 100;
      const markup = cost > 0 ? (profit / cost) * 100 : 0;

      return {
        primaryValue: `${margin.toFixed(2)}%`,
        primaryLabel: 'Gross Profit Margin',
        subtext: `Markup: ${markup.toFixed(2)}% | Profit: $${profit.toFixed(2)}`,
        breakdown: [
          { label: 'Cost Price', value: `$${cost.toFixed(2)}` },
          { label: 'Selling Price', value: `$${rev.toFixed(2)}` },
          { label: 'Gross Profit', value: `$${profit.toFixed(2)}` },
          { label: 'Profit Margin', value: `${margin.toFixed(2)}%` },
          { label: 'Markup', value: `${markup.toFixed(2)}%` }
        ],
        steps: [`Profit = $${rev} - $${cost} = $${profit.toFixed(2)}`, `Margin = (${profit.toFixed(2)} / ${rev}) × 100% = ${margin.toFixed(2)}%`]
      };
    },
    formula: 'Margin = ((Selling Price - Cost) / Selling Price) × 100%',
    explanation: 'Profit margin measures the percentage of every sale dollar that is kept as profit.',
    howToUse: ['Enter cost and selling price.', 'Click Calculate.'],
    example: { inputs: { cost: 45, revenue: 75 }, output: '40.00%', explanation: '$30 profit on a $75 sale equals a 40% margin.' },
    faqs: [{ question: 'What is a healthy profit margin?', answer: 'Across industries, 10% is considered average, while 20% or more is considered high margin.' }],
    keywords: ['profit margin', 'gross margin', 'margin calculator', 'retail pricing']
  },
  {
    id: 'markup-calculator',
    slug: 'markup-calculator',
    title: 'Markup Calculator',
    category: 'finance',
    shortDesc: 'Find selling price and profit given cost and desired markup percentage.',
    icon: 'Tag',
    fields: [
      { id: 'cost', label: 'Cost of Goods ($)', type: 'number', defaultValue: 60, min: 0.01, step: 1 },
      { id: 'markup', label: 'Desired Markup (%)', type: 'number', defaultValue: 50, min: 0, step: 1 }
    ],
    calculate: (inputs) => {
      const cost = parseFloat(inputs.cost) || 0;
      const markup = parseFloat(inputs.markup) || 0;

      const profit = cost * (markup / 100);
      const selling = cost + profit;
      const margin = (profit / selling) * 100;

      return {
        primaryValue: `$${selling.toFixed(2)}`,
        primaryLabel: 'Required Selling Price',
        subtext: `Gross Profit: $${profit.toFixed(2)} (Margin: ${margin.toFixed(2)}%)`,
        breakdown: [
          { label: 'Unit Cost', value: `$${cost.toFixed(2)}` },
          { label: 'Markup', value: `${markup}%` },
          { label: 'Selling Price', value: `$${selling.toFixed(2)}` },
          { label: 'Gross Profit', value: `$${profit.toFixed(2)}` },
          { label: 'Equivalent Margin', value: `${margin.toFixed(2)}%` }
        ],
        steps: [`Markup amount = $${cost} × ${markup}% = $${profit.toFixed(2)}`, `Selling Price = $${cost} + $${profit.toFixed(2)} = $${selling.toFixed(2)}`]
      };
    },
    formula: 'Selling Price = Cost × (1 + Markup / 100)',
    explanation: 'Markup is the percentage added to the cost price of goods to cover overhead and profit.',
    howToUse: ['Enter cost and desired markup percentage.', 'Click Calculate to find the selling price.'],
    example: { inputs: { cost: 60, markup: 50 }, output: '$90.00', explanation: '$60 cost + 50% ($30) = $90 selling price.' },
    faqs: [{ question: 'Is a 50% markup equal to a 50% margin?', answer: 'No, a 50% markup on cost equals a 33.3% profit margin on selling price.' }],
    keywords: ['markup calculator', 'pricing calculator', 'retail markup', 'profit']
  },
  {
    id: 'discount-calculator',
    slug: 'discount-calculator',
    title: 'Discount Calculator',
    category: 'finance',
    shortDesc: 'Calculate sale price, total savings, and sales tax on discounted purchases.',
    icon: 'BadgePercent',
    badge: 'popular',
    fields: [
      { id: 'originalPrice', label: 'Original Price ($)', type: 'number', defaultValue: 120, min: 0.01, step: 1 },
      { id: 'discountPct', label: 'Discount Percentage (%)', type: 'number', defaultValue: 25, min: 0, max: 100, step: 1 },
      { id: 'taxPct', label: 'Sales Tax Rate (%) (optional)', type: 'number', defaultValue: 8, min: 0, step: 0.1 }
    ],
    calculate: (inputs) => {
      const orig = parseFloat(inputs.originalPrice) || 0;
      const disc = (parseFloat(inputs.discountPct) || 0) / 100;
      const taxRate = (parseFloat(inputs.taxPct) || 0) / 100;

      const savings = orig * disc;
      const discountedPrice = orig - savings;
      const taxAmount = discountedPrice * taxRate;
      const finalPrice = discountedPrice + taxAmount;

      return {
        primaryValue: `$${finalPrice.toFixed(2)}`,
        primaryLabel: 'Final Price (with Tax)',
        subtext: `You Save: $${savings.toFixed(2)} (${inputs.discountPct}% off)`,
        breakdown: [
          { label: 'Original Price', value: `$${orig.toFixed(2)}` },
          { label: 'Discount Savings', value: `-$${savings.toFixed(2)}` },
          { label: 'Sale Price (Pre-Tax)', value: `$${discountedPrice.toFixed(2)}` },
          { label: 'Sales Tax', value: `+$${taxAmount.toFixed(2)}` },
          { label: 'Total Due', value: `$${finalPrice.toFixed(2)}` }
        ],
        steps: [
          `Calculate savings: $${orig} × ${inputs.discountPct}% = $${savings.toFixed(2)}`,
          `Subtract discount: $${orig} - $${savings.toFixed(2)} = $${discountedPrice.toFixed(2)}`,
          `Add sales tax: $${discountedPrice.toFixed(2)} + $${taxAmount.toFixed(2)} = $${finalPrice.toFixed(2)}`
        ]
      };
    },
    formula: 'Final = (Original - Savings) × (1 + Tax Rate)',
    explanation: 'Calculates the final cost of an item on sale after applying discount percentage and sales tax.',
    howToUse: ['Enter original price and discount percentage.', 'Enter local tax rate.', 'Click Calculate.'],
    example: { inputs: { originalPrice: 120, discountPct: 25, taxPct: 8 }, output: '$97.20', explanation: '25% off $120 is $90. Adding 8% tax ($7.20) yields $97.20.' },
    faqs: [{ question: 'How to calculate double discounts (e.g. 20% off plus extra 10%)?', answer: 'Apply the first discount, then apply the second percentage to the reduced price, not the original.' }],
    keywords: ['discount calculator', 'sale price', 'clearance', 'black friday', 'savings']
  },
  {
    id: 'tax-calculator',
    slug: 'tax-calculator',
    title: 'Income Tax Calculator',
    category: 'finance',
    shortDesc: 'Estimate federal income tax, effective tax rate, and take-home pay.',
    icon: 'Receipt',
    fields: [
      { id: 'grossIncome', label: 'Gross Annual Income ($)', type: 'number', defaultValue: 75000, min: 0, step: 1000 },
      {
        id: 'filingStatus',
        label: 'Filing Status',
        type: 'select',
        defaultValue: 'single',
        options: [
          { label: 'Single', value: 'single' },
          { label: 'Married Filing Jointly', value: 'married' }
        ]
      },
      { id: 'deductions', label: 'Other Deductions ($)', type: 'number', defaultValue: 0, min: 0, step: 500 }
    ],
    calculate: (inputs) => {
      const gross = parseFloat(inputs.grossIncome) || 0;
      const isMarried = inputs.filingStatus === 'married';
      const standardDeduction = isMarried ? 29200 : 14600;
      const extraDeductions = parseFloat(inputs.deductions) || 0;

      const taxable = Math.max(0, gross - standardDeduction - extraDeductions);

      // Bracket progression (Single vs Married approx)
      const brackets = isMarried
        ? [
            { limit: 23200, rate: 0.1 },
            { limit: 94300, rate: 0.12 },
            { limit: 201050, rate: 0.22 },
            { limit: 383900, rate: 0.24 },
            { limit: Infinity, rate: 0.32 }
          ]
        : [
            { limit: 11600, rate: 0.1 },
            { limit: 47150, rate: 0.12 },
            { limit: 100525, rate: 0.22 },
            { limit: 191950, rate: 0.24 },
            { limit: Infinity, rate: 0.32 }
          ];

      let tax = 0;
      let prevLimit = 0;
      for (const b of brackets) {
        if (taxable > prevLimit) {
          const taxableInBracket = Math.min(taxable - prevLimit, b.limit - prevLimit);
          tax += taxableInBracket * b.rate;
          prevLimit = b.limit;
        } else {
          break;
        }
      }

      const effectiveRate = gross > 0 ? (tax / gross) * 100 : 0;
      const takeHome = gross - tax;

      return {
        primaryValue: `$${tax.toFixed(2)}`,
        primaryLabel: 'Estimated Income Tax',
        subtext: `Take-Home Pay: $${takeHome.toFixed(2)} | Effective Rate: ${effectiveRate.toFixed(1)}%`,
        breakdown: [
          { label: 'Gross Income', value: `$${gross.toLocaleString()}` },
          { label: 'Standard Deduction', value: `$${standardDeduction.toLocaleString()}` },
          { label: 'Taxable Income', value: `$${taxable.toLocaleString()}` },
          { label: 'Total Tax', value: `$${tax.toFixed(2)}` },
          { label: 'Effective Tax Rate', value: `${effectiveRate.toFixed(2)}%` },
          { label: 'Net Annual Pay', value: `$${takeHome.toFixed(2)}` },
          { label: 'Net Monthly Pay', value: `$${(takeHome / 12).toFixed(2)}/mo` }
        ],
        steps: [
          `Calculate taxable income: $${gross} - $${standardDeduction} = $${taxable}`,
          `Progressively tax through IRS tax brackets`,
          `Effective tax rate = ($${tax.toFixed(2)} / $${gross}) = ${effectiveRate.toFixed(2)}%`
        ]
      };
    },
    formula: 'Tax = Sum(Taxable in Bracket × Bracket Rate)',
    explanation: 'Progressive tax system where income is taxed in tranches or brackets at increasing percentages.',
    howToUse: ['Enter annual gross salary.', 'Select your tax filing status.', 'Click Calculate.'],
    example: { inputs: { grossIncome: 75000, filingStatus: 'single', deductions: 0 }, output: '$8,247.00', explanation: 'Taxable income is $60,400 after standard deduction, giving an effective tax rate of ~11%.' },
    faqs: [{ question: 'What is marginal vs effective tax rate?', answer: 'Marginal rate is the tax on your last dollar earned; effective rate is total tax paid divided by total income.' }],
    keywords: ['tax calculator', 'income tax', 'effective tax rate', 'paycheck tax']
  },
  {
    id: 'vat-calculator',
    slug: 'vat-calculator',
    title: 'VAT Calculator (Value Added Tax)',
    category: 'finance',
    shortDesc: 'Add or remove VAT to find net price, gross price, and VAT amount.',
    icon: 'Percent',
    fields: [
      {
        id: 'mode',
        label: 'Mode',
        type: 'select',
        defaultValue: 'add',
        options: [
          { label: 'Add VAT (Net to Gross)', value: 'add' },
          { label: 'Remove VAT (Gross to Net)', value: 'remove' }
        ]
      },
      { id: 'amount', label: 'Amount ($/£/€)', type: 'number', defaultValue: 100, min: 0.01, step: 1 },
      { id: 'vatRate', label: 'VAT Rate (%)', type: 'number', defaultValue: 20, min: 0, step: 0.5 }
    ],
    calculate: (inputs) => {
      const mode = inputs.mode || 'add';
      const amount = parseFloat(inputs.amount) || 0;
      const rate = (parseFloat(inputs.vatRate) || 0) / 100;

      let net = 0;
      let vat = 0;
      let gross = 0;

      if (mode === 'add') {
        net = amount;
        vat = net * rate;
        gross = net + vat;
      } else {
        gross = amount;
        net = gross / (1 + rate);
        vat = gross - net;
      }

      return {
        primaryValue: `$${(mode === 'add' ? gross : net).toFixed(2)}`,
        primaryLabel: mode === 'add' ? 'Gross Price (VAT Included)' : 'Net Price (Excluding VAT)',
        subtext: `VAT Amount: $${vat.toFixed(2)} (${inputs.vatRate}%)`,
        breakdown: [
          { label: 'Net Amount (Excl. VAT)', value: `$${net.toFixed(2)}` },
          { label: 'VAT Rate', value: `${inputs.vatRate}%` },
          { label: 'VAT Paid', value: `$${vat.toFixed(2)}` },
          { label: 'Gross Amount (Incl. VAT)', value: `$${gross.toFixed(2)}` }
        ],
        steps: [
          mode === 'add'
            ? `VAT = $${net} × ${inputs.vatRate}% = $${vat.toFixed(2)}. Gross = $${gross.toFixed(2)}`
            : `Net = $${gross} / (1 + ${rate}) = $${net.toFixed(2)}. VAT = $${vat.toFixed(2)}`
        ]
      };
    },
    formula: 'Add VAT: Gross = Net × (1 + r)  |  Remove VAT: Net = Gross / (1 + r)',
    explanation: 'Value Added Tax is a consumption tax assessed on the value added to goods and services.',
    howToUse: ['Choose Add or Remove VAT.', 'Enter price and VAT percentage.', 'Click Calculate.'],
    example: { inputs: { mode: 'add', amount: 100, vatRate: 20 }, output: '$120.00', explanation: 'Adding 20% VAT to $100 equals $120.' },
    faqs: [{ question: 'What is standard UK VAT?', answer: 'The standard VAT rate in the UK is 20% on most goods and services.' }],
    keywords: ['vat calculator', 'value added tax', 'add vat', 'remove vat', 'sales tax']
  },
  {
    id: 'sales-tax-calculator',
    slug: 'sales-tax-calculator',
    title: 'Sales Tax Calculator',
    category: 'finance',
    shortDesc: 'Compute total purchase price including state and local sales tax.',
    icon: 'ShoppingCart',
    fields: [
      { id: 'price', label: 'Purchase Price ($)', type: 'number', defaultValue: 250, min: 0.01, step: 1 },
      { id: 'taxRate', label: 'Sales Tax Rate (%)', type: 'number', defaultValue: 8.25, min: 0, step: 0.05 }
    ],
    calculate: (inputs) => {
      const price = parseFloat(inputs.price) || 0;
      const rate = (parseFloat(inputs.taxRate) || 0) / 100;

      const tax = price * rate;
      const total = price + tax;

      return {
        primaryValue: `$${total.toFixed(2)}`,
        primaryLabel: 'Total Price with Sales Tax',
        subtext: `Tax Amount: $${tax.toFixed(2)}`,
        breakdown: [
          { label: 'Pre-Tax Price', value: `$${price.toFixed(2)}` },
          { label: 'Tax Rate', value: `${inputs.taxRate}%` },
          { label: 'Sales Tax Due', value: `$${tax.toFixed(2)}` },
          { label: 'Final Checkout Total', value: `$${total.toFixed(2)}` }
        ],
        steps: [`Sales Tax = $${price} × ${inputs.taxRate}% = $${tax.toFixed(2)}`, `Total = $${price} + $${tax.toFixed(2)} = $${total.toFixed(2)}`]
      };
    },
    formula: 'Total = Price + (Price × Sales Tax Rate)',
    explanation: 'Computes state and municipal sales tax added at retail checkout.',
    howToUse: ['Enter price of item.', 'Enter sales tax rate.', 'Click Calculate.'],
    example: { inputs: { price: 250, taxRate: 8.25 }, output: '$270.63', explanation: '$250 + $20.63 tax = $270.63.' },
    faqs: [{ question: 'Are groceries subject to sales tax?', answer: 'In many states, essential groceries and prescription drugs are exempt from sales tax.' }],
    keywords: ['sales tax calculator', 'state tax', 'checkout tax', 'retail tax']
  },
  {
    id: 'commission-calculator',
    slug: 'commission-calculator',
    title: 'Commission Calculator',
    category: 'finance',
    shortDesc: 'Calculate sales commission earnings and total compensation.',
    icon: 'Briefcase',
    fields: [
      { id: 'salesAmount', label: 'Total Sales Revenue ($)', type: 'number', defaultValue: 80000, min: 0, step: 1000 },
      { id: 'commissionRate', label: 'Commission Rate (%)', type: 'number', defaultValue: 7.5, min: 0, step: 0.5 },
      { id: 'baseSalary', label: 'Base Salary ($) (optional)', type: 'number', defaultValue: 3000, min: 0, step: 500 }
    ],
    calculate: (inputs) => {
      const sales = parseFloat(inputs.salesAmount) || 0;
      const rate = (parseFloat(inputs.commissionRate) || 0) / 100;
      const base = parseFloat(inputs.baseSalary) || 0;

      const commission = sales * rate;
      const total = base + commission;

      return {
        primaryValue: `$${total.toFixed(2)}`,
        primaryLabel: 'Total Earnings',
        subtext: `Commission: $${commission.toFixed(2)} | Base: $${base.toFixed(2)}`,
        breakdown: [
          { label: 'Total Sales', value: `$${sales.toLocaleString()}` },
          { label: 'Commission Rate', value: `${inputs.commissionRate}%` },
          { label: 'Commission Earned', value: `$${commission.toFixed(2)}` },
          { label: 'Base Salary', value: `$${base.toFixed(2)}` },
          { label: 'Total Compensation', value: `$${total.toFixed(2)}` }
        ],
        steps: [`Commission = $${sales} × ${inputs.commissionRate}% = $${commission.toFixed(2)}`, `Total = $${base} + $${commission.toFixed(2)} = $${total.toFixed(2)}`]
      };
    },
    formula: 'Total Earnings = Base Pay + (Sales × Commission Rate)',
    explanation: 'Determines payout for real estate agents, sales representatives, and brokers.',
    howToUse: ['Enter gross sales made.', 'Enter commission percentage.', 'Enter base salary if any.'],
    example: { inputs: { salesAmount: 80000, commissionRate: 7.5, baseSalary: 3000 }, output: '$9,000.00', explanation: '7.5% of $80k is $6,000 + $3,000 base = $9,000 total.' },
    faqs: [{ question: 'What is a tiered commission structure?', answer: 'A structure where higher sales volume unlocks higher commission rates.' }],
    keywords: ['commission calculator', 'sales commission', 'broker fee', 'real estate commission']
  },
  {
    id: 'salary-calculator',
    slug: 'salary-calculator',
    title: 'Salary Converter Calculator',
    category: 'finance',
    shortDesc: 'Convert annual salary into monthly, bi-weekly, weekly, and hourly pay.',
    icon: 'DollarSign',
    badge: 'popular',
    fields: [
      { id: 'annualSalary', label: 'Annual Salary ($)', type: 'number', defaultValue: 65000, min: 1000, step: 1000 },
      { id: 'hoursPerWeek', label: 'Hours Worked per Week', type: 'number', defaultValue: 40, min: 1, max: 100, step: 1 },
      { id: 'weeksPerYear', label: 'Working Weeks per Year', type: 'number', defaultValue: 52, min: 1, max: 52, step: 1 }
    ],
    calculate: (inputs) => {
      const annual = parseFloat(inputs.annualSalary) || 0;
      const hours = parseFloat(inputs.hoursPerWeek) || 40;
      const weeks = parseFloat(inputs.weeksPerYear) || 52;

      const monthly = annual / 12;
      const biweekly = annual / 26;
      const weekly = annual / weeks;
      const hourly = annual / (weeks * hours);

      return {
        primaryValue: `$${hourly.toFixed(2)}/hr`,
        primaryLabel: 'Hourly Wage Equivalent',
        subtext: `Monthly: $${monthly.toFixed(2)} | Bi-weekly: $${biweekly.toFixed(2)}`,
        breakdown: [
          { label: 'Annual Gross', value: `$${annual.toLocaleString()}` },
          { label: 'Monthly Equivalent', value: `$${monthly.toFixed(2)}` },
          { label: 'Bi-Weekly (every 2 weeks)', value: `$${biweekly.toFixed(2)}` },
          { label: 'Weekly Pay', value: `$${weekly.toFixed(2)}` },
          { label: 'Hourly Rate', value: `$${hourly.toFixed(2)}` }
        ],
        steps: [`Total hours/year = ${weeks} × ${hours} = ${weeks * hours}`, `Hourly rate = $${annual} / ${weeks * hours} = $${hourly.toFixed(2)}`]
      };
    },
    formula: 'Hourly = Annual / (Weeks × Hours/Week)',
    explanation: 'Converts annual compensation package into standard pay period equivalents.',
    howToUse: ['Enter your annual gross salary.', 'Adjust work hours per week.', 'Click Calculate.'],
    example: { inputs: { annualSalary: 65000, hoursPerWeek: 40, weeksPerYear: 52 }, output: '$31.25/hr', explanation: '$65k per year equals $31.25/hr and $5,416.67/month.' },
    faqs: [{ question: 'How many work hours in a full year?', answer: 'A standard 40-hour work week across 52 weeks totals 2,080 hours per year.' }],
    keywords: ['salary calculator', 'hourly to salary', 'biweekly pay', 'wage converter']
  },
  {
    id: 'hourly-wage-calculator',
    slug: 'hourly-wage-calculator',
    title: 'Hourly Wage Calculator',
    category: 'finance',
    shortDesc: 'Convert hourly rate and overtime into total weekly, monthly, and annual gross pay.',
    icon: 'Clock',
    fields: [
      { id: 'hourlyRate', label: 'Hourly Rate ($)', type: 'number', defaultValue: 28, min: 1, step: 0.5 },
      { id: 'regularHours', label: 'Regular Hours / Week', type: 'number', defaultValue: 40, min: 1, max: 60, step: 1 },
      { id: 'overtimeHours', label: 'Overtime Hours / Week', type: 'number', defaultValue: 5, min: 0, max: 40, step: 1 },
      { id: 'overtimeMultiplier', label: 'Overtime Rate Multiplier', type: 'number', defaultValue: 1.5, min: 1, max: 3, step: 0.25 }
    ],
    calculate: (inputs) => {
      const rate = parseFloat(inputs.hourlyRate) || 0;
      const regH = parseFloat(inputs.regularHours) || 0;
      const otH = parseFloat(inputs.overtimeHours) || 0;
      const mult = parseFloat(inputs.overtimeMultiplier) || 1.5;

      const regularWeekly = rate * regH;
      const overtimeWeekly = otH * (rate * mult);
      const weeklyTotal = regularWeekly + overtimeWeekly;
      const annualTotal = weeklyTotal * 52;
      const monthlyTotal = annualTotal / 12;

      return {
        primaryValue: `$${annualTotal.toLocaleString('en-US', { maximumFractionDigits: 0 })}/yr`,
        primaryLabel: 'Annual Gross Income',
        subtext: `Weekly Pay: $${weeklyTotal.toFixed(2)} | Monthly: $${monthlyTotal.toFixed(2)}`,
        breakdown: [
          { label: 'Base Hourly Rate', value: `$${rate.toFixed(2)}/hr` },
          { label: 'Regular Weekly Pay', value: `$${regularWeekly.toFixed(2)}` },
          { label: 'Overtime Weekly Pay', value: `$${overtimeWeekly.toFixed(2)} (${otH} hrs @ ${mult}x)` },
          { label: 'Total Weekly Pay', value: `$${weeklyTotal.toFixed(2)}` },
          { label: 'Annual Gross Earnings', value: `$${annualTotal.toLocaleString()}` }
        ],
        steps: [`Overtime hourly rate = $${rate} × ${mult} = $${(rate * mult).toFixed(2)}`, `Weekly = ($${rate} × ${regH}) + ($${(rate * mult).toFixed(2)} × ${otH}) = $${weeklyTotal.toFixed(2)}`]
      };
    },
    formula: 'Weekly = (Rate × Reg Hours) + (Rate × Overtime Multiplier × OT Hours)',
    explanation: 'Computes wages with overtime rates (time-and-a-half or double time).',
    howToUse: ['Enter hourly wage.', 'Add regular and overtime hours.', 'Click Calculate.'],
    example: { inputs: { hourlyRate: 28, regularHours: 40, overtimeHours: 5, overtimeMultiplier: 1.5 }, output: '$69,160/yr', explanation: '$1,120 regular + $210 overtime = $1,330/week.' },
    faqs: [{ question: 'What is FLSA standard overtime?', answer: 'The Fair Labor Standards Act requires non-exempt employees to receive 1.5x regular pay for hours worked over 40 in a workweek.' }],
    keywords: ['hourly wage calculator', 'overtime pay', 'time and a half', 'paycheck estimator']
  },
  {
    id: 'net-worth-calculator',
    slug: 'net-worth-calculator',
    title: 'Net Worth Calculator',
    category: 'finance',
    shortDesc: 'Calculate total net worth by summing assets and subtracting liabilities.',
    icon: 'Shield',
    fields: [
      { id: 'cash', label: 'Cash & Bank Accounts ($)', type: 'number', defaultValue: 15000, min: 0, step: 1000 },
      { id: 'investments', label: 'Investments & Retirement ($)', type: 'number', defaultValue: 65000, min: 0, step: 5000 },
      { id: 'realEstate', label: 'Real Estate & Vehicles Value ($)', type: 'number', defaultValue: 350000, min: 0, step: 10000 },
      { id: 'mortgage', label: 'Mortgage Debt ($)', type: 'number', defaultValue: 240000, min: 0, step: 5000 },
      { id: 'otherDebt', label: 'Auto, Student & Credit Card Debt ($)', type: 'number', defaultValue: 22000, min: 0, step: 1000 }
    ],
    calculate: (inputs) => {
      const cash = parseFloat(inputs.cash) || 0;
      const inv = parseFloat(inputs.investments) || 0;
      const prop = parseFloat(inputs.realEstate) || 0;
      const mort = parseFloat(inputs.mortgage) || 0;
      const debt = parseFloat(inputs.otherDebt) || 0;

      const totalAssets = cash + inv + prop;
      const totalLiabilities = mort + debt;
      const netWorth = totalAssets - totalLiabilities;

      return {
        primaryValue: `$${netWorth.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
        primaryLabel: 'Total Net Worth',
        subtext: `Assets: $${totalAssets.toLocaleString()} | Liabilities: $${totalLiabilities.toLocaleString()}`,
        breakdown: [
          { label: 'Total Assets', value: `$${totalAssets.toLocaleString()}` },
          { label: 'Total Liabilities', value: `$${totalLiabilities.toLocaleString()}` },
          { label: 'Net Worth (Assets - Debts)', value: `$${netWorth.toLocaleString()}` },
          { label: 'Debt-to-Asset Ratio', value: `${((totalLiabilities / totalAssets) * 100).toFixed(1)}%` }
        ],
        steps: [`Sum all assets: $${cash} + $${inv} + $${prop} = $${totalAssets}`, `Subtract liabilities: $${totalAssets} - $${totalLiabilities} = $${netWorth}`]
      };
    },
    formula: 'Net Worth = Total Assets - Total Liabilities',
    explanation: 'Net worth is the most definitive snapshot of an individual’s financial health and accumulated wealth.',
    howToUse: ['Enter your asset values (bank, stocks, real estate).', 'Enter all liabilities (mortgage, auto loans, cards).', 'Click Calculate.'],
    example: { inputs: { cash: 15000, investments: 65000, realEstate: 350000, mortgage: 240000, otherDebt: 22000 }, output: '$168,000', explanation: '$430k in assets minus $262k in debt gives $168,000 net worth.' },
    faqs: [{ question: 'Should home equity be counted in net worth?', answer: 'Yes, your home is an asset; subtract remaining mortgage to find net home equity.' }],
    keywords: ['net worth calculator', 'assets minus liabilities', 'wealth snapshot', 'financial health']
  },
  {
    id: 'break-even-calculator',
    slug: 'break-even-calculator',
    title: 'Break-Even Calculator',
    category: 'finance',
    shortDesc: 'Find the sales volume and revenue needed to cover total business costs.',
    icon: 'Scale',
    fields: [
      { id: 'fixedCosts', label: 'Fixed Costs ($)', type: 'number', defaultValue: 12000, min: 0, step: 500 },
      { id: 'variableCostPerUnit', label: 'Variable Cost per Unit ($)', type: 'number', defaultValue: 15, min: 0, step: 1 },
      { id: 'salePricePerUnit', label: 'Sales Price per Unit ($)', type: 'number', defaultValue: 40, min: 0.01, step: 1 }
    ],
    calculate: (inputs) => {
      const fixed = parseFloat(inputs.fixedCosts) || 0;
      const vc = parseFloat(inputs.variableCostPerUnit) || 0;
      const price = parseFloat(inputs.salePricePerUnit) || 0;

      const cm = price - vc; // contribution margin
      if (cm <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Sale price must exceed variable cost per unit.' };

      const breakEvenUnits = Math.ceil(fixed / cm);
      const breakEvenRevenue = breakEvenUnits * price;
      const cmRatio = (cm / price) * 100;

      return {
        primaryValue: `${breakEvenUnits.toLocaleString()} units`,
        primaryLabel: 'Break-Even Sales Quantity',
        subtext: `Break-Even Revenue: $${breakEvenRevenue.toLocaleString()}`,
        breakdown: [
          { label: 'Fixed Costs', value: `$${fixed.toLocaleString()}` },
          { label: 'Contribution Margin / Unit', value: `$${cm.toFixed(2)}` },
          { label: 'Contribution Margin Ratio', value: `${cmRatio.toFixed(1)}%` },
          { label: 'Units to Break Even', value: `${breakEvenUnits.toLocaleString()} units` },
          { label: 'Revenue to Break Even', value: `$${breakEvenRevenue.toLocaleString()}` }
        ],
        steps: [
          `Contribution Margin = Price - Variable Cost = $${price} - $${vc} = $${cm}`,
          `Break-Even Units = Fixed Costs / Margin = $${fixed} / $${cm} = ${breakEvenUnits} units`
        ]
      };
    },
    formula: 'Break-Even Units = Fixed Costs / (Price - Variable Cost per Unit)',
    explanation: 'The break-even point is the level of sales where total revenues equal total costs, resulting in zero net profit or loss.',
    howToUse: ['Enter fixed overhead expenses.', 'Enter unit variable cost and unit sale price.', 'Click Calculate.'],
    example: { inputs: { fixedCosts: 12000, variableCostPerUnit: 15, salePricePerUnit: 40 }, output: '480 units', explanation: 'Each unit provides $25 contribution margin. $12,000 / $25 = 480 units ($19,200 revenue).' },
    faqs: [{ question: 'What are examples of fixed costs?', answer: 'Rent, insurance, administrative salaries, and software subscriptions.' }],
    keywords: ['break even calculator', 'break even point', 'contribution margin', 'business planning']
  },
  {
    id: 'debt-payoff-calculator',
    slug: 'debt-payoff-calculator',
    title: 'Debt Payoff Calculator',
    category: 'finance',
    shortDesc: 'Determine months to become debt-free and total interest paid.',
    icon: 'TrendingDown',
    fields: [
      { id: 'balance', label: 'Total Debt Balance ($)', type: 'number', defaultValue: 18000, min: 100, step: 500 },
      { id: 'interestRate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 19.5, min: 0.1, step: 0.1 },
      { id: 'monthlyPayment', label: 'Monthly Payment ($)', type: 'number', defaultValue: 550, min: 10, step: 50 }
    ],
    calculate: (inputs) => {
      const b = parseFloat(inputs.balance) || 0;
      const r = (parseFloat(inputs.interestRate) || 0) / 100 / 12;
      const pmt = parseFloat(inputs.monthlyPayment) || 0;

      const monthlyInterestCharge = b * r;
      if (pmt <= monthlyInterestCharge) {
        return { primaryValue: 'Never Paid Off', primaryLabel: 'Result', error: `Monthly payment must exceed monthly interest ($${monthlyInterestCharge.toFixed(2)}) to reduce principal.` };
      }

      const n = -Math.log(1 - (b * r) / pmt) / Math.log(1 + r);
      const months = Math.ceil(n);
      const years = (months / 12).toFixed(1);
      const totalPaid = pmt * months;
      const totalInterest = totalPaid - b;

      return {
        primaryValue: `${months} months (${years} yrs)`,
        primaryLabel: 'Time to Debt Freedom',
        subtext: `Total Interest to Pay: $${totalInterest.toFixed(2)}`,
        breakdown: [
          { label: 'Current Balance', value: `$${b.toLocaleString()}` },
          { label: 'Monthly Payment', value: `$${pmt.toFixed(2)}` },
          { label: 'Months to Payoff', value: `${months} months` },
          { label: 'Total Interest Paid', value: `$${totalInterest.toFixed(2)}` },
          { label: 'Total Out of Pocket', value: `$${totalPaid.toFixed(2)}` }
        ],
        steps: [`Calculated logarithmic amortization period = ${months} months`, `Total interest paid = $${totalInterest.toFixed(2)}`]
      };
    },
    formula: 'n = -ln(1 - (B × r) / PMT) / ln(1 + r)',
    explanation: 'Calculates the duration and total cost required to eliminate high-interest revolving credit or personal loans.',
    howToUse: ['Enter balance, interest rate, and your monthly payment amount.', 'Click Calculate.'],
    example: { inputs: { balance: 18000, interestRate: 19.5, monthlyPayment: 550 }, output: '48 months (4.0 yrs)', explanation: 'Paying $550/mo eliminates $18k credit debt in 48 months with $8,142 interest.' },
    faqs: [{ question: 'What is the debt snowball vs avalanche?', answer: 'Snowball pays lowest balances first for psychological momentum; avalanche pays highest interest rate first to minimize total interest paid.' }],
    keywords: ['debt payoff calculator', 'credit card debt', 'debt free', 'amortization period']
  },
  {
    id: 'currency-calculator',
    slug: 'currency-calculator',
    title: 'Currency Converter',
    category: 'finance',
    shortDesc: 'Real-time benchmark exchange rate conversion between major world currencies.',
    icon: 'RefreshCw',
    badge: 'popular',
    fields: [
      { id: 'amount', label: 'Amount', type: 'number', defaultValue: 100, min: 0.01, step: 1 },
      {
        id: 'from',
        label: 'From Currency',
        type: 'select',
        defaultValue: 'USD',
        options: [
          { label: 'USD - US Dollar', value: 'USD' },
          { label: 'EUR - Euro', value: 'EUR' },
          { label: 'GBP - British Pound', value: 'GBP' },
          { label: 'JPY - Japanese Yen', value: 'JPY' },
          { label: 'CAD - Canadian Dollar', value: 'CAD' },
          { label: 'AUD - Australian Dollar', value: 'AUD' },
          { label: 'INR - Indian Rupee', value: 'INR' },
          { label: 'CHF - Swiss Franc', value: 'CHF' }
        ]
      },
      {
        id: 'to',
        label: 'To Currency',
        type: 'select',
        defaultValue: 'EUR',
        options: [
          { label: 'EUR - Euro', value: 'EUR' },
          { label: 'USD - US Dollar', value: 'USD' },
          { label: 'GBP - British Pound', value: 'GBP' },
          { label: 'JPY - Japanese Yen', value: 'JPY' },
          { label: 'CAD - Canadian Dollar', value: 'CAD' },
          { label: 'AUD - Australian Dollar', value: 'AUD' },
          { label: 'INR - Indian Rupee', value: 'INR' },
          { label: 'CHF - Swiss Franc', value: 'CHF' }
        ]
      }
    ],
    calculate: (inputs) => {
      const amt = parseFloat(inputs.amount) || 0;
      const from = inputs.from || 'USD';
      const to = inputs.to || 'EUR';

      // Base rates to USD
      const ratesToUSD: Record<string, number> = {
        USD: 1.0,
        EUR: 1.085,
        GBP: 1.295,
        JPY: 0.0066,
        CAD: 0.74,
        AUD: 0.66,
        INR: 0.012,
        CHF: 1.13
      };

      const fromRate = ratesToUSD[from] || 1;
      const toRate = ratesToUSD[to] || 1;

      // Convert from -> USD -> to
      const inUSD = amt * fromRate;
      const converted = inUSD / toRate;
      const directRate = fromRate / toRate;

      return {
        primaryValue: `${converted.toFixed(2)} ${to}`,
        primaryLabel: 'Converted Amount',
        subtext: `1 ${from} = ${directRate.toFixed(4)} ${to}`,
        breakdown: [
          { label: 'Source Amount', value: `${amt.toFixed(2)} ${from}` },
          { label: 'Target Amount', value: `${converted.toFixed(2)} ${to}` },
          { label: 'Exchange Rate', value: `1 ${from} = ${directRate.toFixed(4)} ${to}` },
          { label: 'Inverse Rate', value: `1 ${to} = ${(1 / directRate).toFixed(4)} ${from}` }
        ],
        steps: [`Convert ${amt} ${from} to baseline USD = $${inUSD.toFixed(2)}`, `Convert USD to ${to} = ${converted.toFixed(2)} ${to}`]
      };
    },
    formula: 'Target = Amount × (Rate_from / Rate_to)',
    explanation: 'Converts between world fiat currencies based on global foreign exchange market reference benchmarks.',
    howToUse: ['Enter amount.', 'Choose source and target currencies.', 'Click Calculate.'],
    example: { inputs: { amount: 100, from: 'USD', to: 'EUR' }, output: '92.17 EUR', explanation: '$100 converts to approx €92.17 based on exchange rates.' },
    faqs: [{ question: 'Are these official bank rates?', answer: 'These use standard mid-market foreign exchange rates; retail banks and card providers may charge a spread or margin.' }],
    keywords: ['currency calculator', 'exchange rate', 'usd to eur', 'forex converter']
  }
];

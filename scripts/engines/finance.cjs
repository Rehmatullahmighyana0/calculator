const { toNum, formatNum } = require('./utils.cjs');

const engines = {
  'loan-calculator': (inputs) => {
    const P = toNum(inputs.principal, 25000);
    const annualRate = toNum(inputs.rate, 6.5);
    const years = toNum(inputs.termYears, 5);

    if (P <= 0 || years <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Principal and term must be positive.' };

    const n = years * 12;
    const r = annualRate / 100 / 12;

    let monthlyPayment = 0;
    if (r === 0) {
      monthlyPayment = P / n;
    } else {
      monthlyPayment = (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    }

    const totalPaid = monthlyPayment * n;
    const totalInterest = totalPaid - P;

    return {
      primaryValue: `$${formatNum(monthlyPayment, 2)} / mo`,
      primaryLabel: 'Monthly Payment',
      subtext: `Total Paid: $${formatNum(totalPaid, 2)} | Interest: $${formatNum(totalInterest, 2)}`,
      breakdown: [
        { label: 'Loan Principal', value: `$${formatNum(P, 2)}` },
        { label: 'Annual Interest Rate', value: `${annualRate}%` },
        { label: 'Loan Term', value: `${years} years (${n} payments)` },
        { label: 'Monthly Payment', value: `$${formatNum(monthlyPayment, 2)}` },
        { label: 'Total Interest', value: `$${formatNum(totalInterest, 2)}` },
        { label: 'Total Cost of Loan', value: `$${formatNum(totalPaid, 2)}` }
      ],
      steps: [
        `Monthly interest rate: r = ${annualRate}% / 12 = ${formatNum(r * 100, 4)}%`,
        `Total number of monthly payments: n = ${years} × 12 = ${n}`,
        `Amortization formula: M = P[r(1+r)^n] / [(1+r)^n - 1] = $${formatNum(monthlyPayment, 2)}`,
        `Total interest paid = Total Paid ($${formatNum(totalPaid, 2)}) - Principal ($${formatNum(P, 2)}) = $${formatNum(totalInterest, 2)}`
      ]
    };
  },

  'emi-calculator': (inputs) => {
    const P = toNum(inputs.amount, 50000);
    const rate = toNum(inputs.interest, 8.5);
    const months = toNum(inputs.tenureMonths, 36);

    if (P <= 0 || months <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Principal amount and tenure must be positive.' };

    const r = rate / 100 / 12;
    let emi = 0;
    if (r === 0) {
      emi = P / months;
    } else {
      emi = (P * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    }

    const totalRepay = emi * months;
    const totalInterest = totalRepay - P;

    return {
      primaryValue: `$${formatNum(emi, 2)}`,
      primaryLabel: 'Monthly EMI Payment',
      subtext: `Tenure: ${months} months | Total Interest: $${formatNum(totalInterest, 2)}`,
      breakdown: [
        { label: 'Loan Amount', value: `$${formatNum(P, 2)}` },
        { label: 'Annual Rate', value: `${rate}%` },
        { label: 'Tenure (Months)', value: `${months}` },
        { label: 'Monthly EMI', value: `$${formatNum(emi, 2)}` },
        { label: 'Total Interest Payable', value: `$${formatNum(totalInterest, 2)}` },
        { label: 'Total Payment (Principal + Interest)', value: `$${formatNum(totalRepay, 2)}` }
      ],
      steps: [
        `EMI = [P × r × (1+r)^n] / [(1+r)^n - 1]`,
        `Monthly rate r = ${rate} / 1200 = ${formatNum(r, 6)}`,
        `Monthly installment = $${formatNum(emi, 2)}`
      ]
    };
  },

  'mortgage-calculator': (inputs) => {
    const homePrice = toNum(inputs.homePrice, 400000);
    const downPaymentPct = toNum(inputs.downPaymentPct, 20);
    const interestRate = toNum(inputs.interestRate, 6.8);
    const termYears = toNum(inputs.termYears, 30);
    const propertyTaxAnnual = toNum(inputs.propertyTaxAnnual, 4800);
    const homeInsuranceAnnual = toNum(inputs.homeInsuranceAnnual, 1200);

    if (homePrice <= 0 || termYears <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Home price and term must be positive.' };

    const downPayment = (downPaymentPct / 100) * homePrice;
    const loanAmount = homePrice - downPayment;
    const n = termYears * 12;
    const r = interestRate / 100 / 12;

    let piPayment = 0;
    if (r === 0) {
      piPayment = loanAmount / n;
    } else {
      piPayment = (loanAmount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    }

    const monthlyTax = propertyTaxAnnual / 12;
    const monthlyInsurance = homeInsuranceAnnual / 12;
    const totalMonthly = piPayment + monthlyTax + monthlyInsurance;
    const totalInterest = piPayment * n - loanAmount;

    return {
      primaryValue: `$${formatNum(totalMonthly, 2)} / mo`,
      primaryLabel: 'Total Monthly Mortgage Payment',
      subtext: `Principal & Interest: $${formatNum(piPayment, 2)} | Taxes & Ins: $${formatNum(monthlyTax + monthlyInsurance, 2)}`,
      breakdown: [
        { label: 'Home Price', value: `$${formatNum(homePrice, 2)}` },
        { label: 'Down Payment', value: `$${formatNum(downPayment, 2)} (${downPaymentPct}%)` },
        { label: 'Loan Amount Financed', value: `$${formatNum(loanAmount, 2)}` },
        { label: 'Principal & Interest', value: `$${formatNum(piPayment, 2)}` },
        { label: 'Property Tax (Monthly)', value: `$${formatNum(monthlyTax, 2)}` },
        { label: 'Home Insurance (Monthly)', value: `$${formatNum(monthlyInsurance, 2)}` },
        { label: 'Total Monthly Payment (PITI)', value: `$${formatNum(totalMonthly, 2)}` },
        { label: 'Total Interest Paid Over 30 Yrs', value: `$${formatNum(totalInterest, 2)}` }
      ],
      steps: [
        `Down Payment = ${downPaymentPct}% of $${formatNum(homePrice, 0)} = $${formatNum(downPayment, 2)}`,
        `Loan Amount = $${formatNum(homePrice, 0)} - $${formatNum(downPayment, 2)} = $${formatNum(loanAmount, 2)}`,
        `Principal & Interest = $${formatNum(piPayment, 2)} / month`,
        `Total PITI = $${formatNum(piPayment, 2)} + $${formatNum(monthlyTax, 2)} (tax) + $${formatNum(monthlyInsurance, 2)} (ins) = $${formatNum(totalMonthly, 2)}`
      ]
    };
  },

  'compound-interest-calculator': (inputs) => {
    const P = toNum(inputs.principal, 10000);
    const pmt = toNum(inputs.monthlyContribution, 500);
    const annualRate = toNum(inputs.annualRate, 8);
    const years = toNum(inputs.years, 20);

    const r = annualRate / 100;
    const n = 12; // monthly compounding
    const t = years;

    const fvPrincipal = P * Math.pow(1 + r / n, n * t);
    const fvContributions = pmt > 0 && r > 0
      ? pmt * ((Math.pow(1 + r / n, n * t) - 1) / (r / n))
      : pmt * n * t;

    const totalBalance = fvPrincipal + fvContributions;
    const totalDeposits = P + pmt * n * t;
    const totalInterestEarned = totalBalance - totalDeposits;

    return {
      primaryValue: `$${formatNum(totalBalance, 2)}`,
      primaryLabel: `Future Wealth Balance (${years} Yrs)`,
      subtext: `Total Contributed: $${formatNum(totalDeposits, 2)} | Interest Earned: $${formatNum(totalInterestEarned, 2)}`,
      breakdown: [
        { label: 'Starting Principal', value: `$${formatNum(P, 2)}` },
        { label: 'Monthly Deposits', value: `$${formatNum(pmt, 2)}` },
        { label: 'Annual Compound Rate', value: `${annualRate}%` },
        { label: 'Total Cash Invested', value: `$${formatNum(totalDeposits, 2)}` },
        { label: 'Total Compound Interest', value: `$${formatNum(totalInterestEarned, 2)}` },
        { label: 'End Balance', value: `$${formatNum(totalBalance, 2)}` }
      ],
      steps: [
        `Principal growth: $${formatNum(P, 2)} × (1 + ${annualRate / 100}/12)^${n * t} = $${formatNum(fvPrincipal, 2)}`,
        `Regular contribution future value = $${formatNum(fvContributions, 2)}`,
        `Final Compound Balance = $${formatNum(totalBalance, 2)}`
      ]
    };
  },

  'simple-interest-calculator': (inputs) => {
    const P = toNum(inputs.principal, 5000);
    const r = toNum(inputs.rate, 5);
    const t = toNum(inputs.time, 3);

    const interest = P * (r / 100) * t;
    const total = P + interest;

    return {
      primaryValue: `$${formatNum(interest, 2)}`,
      primaryLabel: 'Total Simple Interest (I)',
      subtext: `Total Maturity Value: $${formatNum(total, 2)}`,
      breakdown: [
        { label: 'Principal (P)', value: `$${formatNum(P, 2)}` },
        { label: 'Annual Rate (r)', value: `${r}%` },
        { label: 'Time Period (t)', value: `${t} years` },
        { label: 'Simple Interest Earned', value: `$${formatNum(interest, 2)}` },
        { label: 'Total Future Balance', value: `$${formatNum(total, 2)}` }
      ],
      steps: [
        `Formula: Interest = Principal × Rate × Time`,
        `I = $${formatNum(P, 2)} × ${r / 100} × ${t} = $${formatNum(interest, 2)}`,
        `Total Amount = Principal + Interest = $${formatNum(total, 2)}`
      ]
    };
  },

  'interest-calculator': (inputs) => {
    const P = toNum(inputs.principal, 10000);
    const r = toNum(inputs.rate, 7);
    const t = toNum(inputs.years, 10);

    const simpleInt = P * (r / 100) * t;
    const compoundBal = P * Math.pow(1 + r / 100, t);
    const compoundInt = compoundBal - P;
    const diff = compoundInt - simpleInt;

    return {
      primaryValue: `$${formatNum(compoundInt, 2)} (Compound)`,
      primaryLabel: 'Compound vs Simple Interest',
      subtext: `Compound yields $${formatNum(diff, 2)} more (+${formatNum((diff / simpleInt) * 100, 1)}%)`,
      breakdown: [
        { label: 'Principal Amount', value: `$${formatNum(P, 2)}` },
        { label: 'Rate & Time', value: `${r}% over ${t} years` },
        { label: 'Simple Interest', value: `$${formatNum(simpleInt, 2)} (Total: $${formatNum(P + simpleInt, 2)})` },
        { label: 'Compound Interest', value: `$${formatNum(compoundInt, 2)} (Total: $${formatNum(compoundBal, 2)})` },
        { label: 'Difference Advantage', value: `$${formatNum(diff, 2)}` }
      ],
      steps: [
        `Simple Interest: I = P × r × t = $${formatNum(simpleInt, 2)}`,
        `Compound Interest: A = P(1 + r)^t = $${formatNum(compoundBal, 2)} -> Interest = $${formatNum(compoundInt, 2)}`,
        `Compound Advantage = $${formatNum(diff, 2)}`
      ]
    };
  },

  'investment-calculator': (inputs) => {
    const initial = toNum(inputs.initial, 15000);
    const monthly = toNum(inputs.monthly, 750);
    const returnRate = toNum(inputs.returnRate, 9);
    const years = toNum(inputs.years, 15);

    const r = returnRate / 100 / 12;
    const n = years * 12;

    const fvInit = initial * Math.pow(1 + r, n);
    const fvMonthly = monthly > 0 && r > 0 ? monthly * ((Math.pow(1 + r, n) - 1) / r) : monthly * n;
    const total = fvInit + fvMonthly;
    const invested = initial + monthly * n;
    const profit = total - invested;

    return {
      primaryValue: `$${formatNum(total, 2)}`,
      primaryLabel: `Forecasted Portfolio Value (${years} Yrs)`,
      subtext: `Capital Invested: $${formatNum(invested, 2)} | Capital Gains: $${formatNum(profit, 2)}`,
      breakdown: [
        { label: 'Initial Lump Sum', value: `$${formatNum(initial, 2)}` },
        { label: 'Monthly Contribution', value: `$${formatNum(monthly, 2)}` },
        { label: 'Expected Return', value: `${returnRate}% p.a.` },
        { label: 'Total Invested', value: `$${formatNum(invested, 2)}` },
        { label: 'Net Investment Gain', value: `$${formatNum(profit, 2)}` },
        { label: 'End Portfolio Balance', value: `$${formatNum(total, 2)}` }
      ],
      steps: [
        `Compounded initial capital: $${formatNum(fvInit, 2)}`,
        `Compounded recurring monthly deposits: $${formatNum(fvMonthly, 2)}`,
        `Total portfolio value = $${formatNum(total, 2)}`
      ]
    };
  },

  'savings-calculator': (inputs) => {
    const target = toNum(inputs.target, 50000);
    const current = toNum(inputs.current, 5000);
    const years = toNum(inputs.years, 4);
    const annualRate = toNum(inputs.interest, 4.5);

    if (target <= current) {
      return { primaryValue: '$0 / mo', primaryLabel: 'Goal Met', subtext: 'Target is already covered by current savings.' };
    }

    const n = years * 12;
    const r = annualRate / 100 / 12;

    const fvCurrent = current * Math.pow(1 + r, n);
    const remainingTarget = target - fvCurrent;

    let pmt = 0;
    if (r === 0) {
      pmt = remainingTarget / n;
    } else {
      pmt = (remainingTarget * r) / (Math.pow(1 + r, n) - 1);
    }

    return {
      primaryValue: `$${formatNum(Math.max(0, pmt), 2)} / mo`,
      primaryLabel: 'Required Monthly Savings',
      subtext: `To reach $${formatNum(target, 0)} goal in ${years} years`,
      breakdown: [
        { label: 'Savings Goal', value: `$${formatNum(target, 2)}` },
        { label: 'Current Savings', value: `$${formatNum(current, 2)}` },
        { label: 'Future Value of Current Savings', value: `$${formatNum(fvCurrent, 2)}` },
        { label: 'Remaining Deficit', value: `$${formatNum(Math.max(0, remainingTarget), 2)}` },
        { label: 'Required Monthly Deposit', value: `$${formatNum(Math.max(0, pmt), 2)}` }
      ],
      steps: [
        `Current savings grow to $${formatNum(fvCurrent, 2)} with interest`,
        `Remaining gap: $${formatNum(target, 2)} - $${formatNum(fvCurrent, 2)} = $${formatNum(remainingTarget, 2)}`,
        `Sinking fund formula yields required monthly saving of $${formatNum(pmt, 2)}`
      ]
    };
  },

  'retirement-calculator': (inputs) => {
    const currentAge = toNum(inputs.currentAge, 30);
    const retireAge = toNum(inputs.retireAge, 65);
    const currentSavings = toNum(inputs.currentSavings, 25000);
    const monthlySavings = toNum(inputs.monthlySavings, 600);
    const returnRate = toNum(inputs.returnRate, 7.5);

    const years = Math.max(1, retireAge - currentAge);
    const n = years * 12;
    const r = returnRate / 100 / 12;

    const fvInit = currentSavings * Math.pow(1 + r, n);
    const fvMonthly = monthlySavings > 0 && r > 0 ? monthlySavings * ((Math.pow(1 + r, n) - 1) / r) : monthlySavings * n;
    const nestEgg = fvInit + fvMonthly;
    const safeAnnualWithdrawal = nestEgg * 0.04; // 4% rule
    const safeMonthlyIncome = safeAnnualWithdrawal / 12;

    return {
      primaryValue: `$${formatNum(nestEgg, 2)}`,
      primaryLabel: `Projected Nest Egg at Age ${retireAge}`,
      subtext: `Estimated Safe Monthly Income (4% Rule): $${formatNum(safeMonthlyIncome, 2)} / mo`,
      breakdown: [
        { label: 'Years to Retirement', value: `${years} years` },
        { label: 'Total Projected Nest Egg', value: `$${formatNum(nestEgg, 2)}` },
        { label: 'Safe Annual Income (4%)', value: `$${formatNum(safeAnnualWithdrawal, 2)} / yr` },
        { label: 'Safe Monthly Income', value: `$${formatNum(safeMonthlyIncome, 2)} / mo` }
      ],
      steps: [
        `Accumulation time horizon: ${retireAge} - ${currentAge} = ${years} years`,
        `Compounded nest egg = $${formatNum(fvInit, 2)} (existing) + $${formatNum(fvMonthly, 2)} (monthly savings)`,
        `Total Nest Egg = $${formatNum(nestEgg, 2)}`,
        `Safe 4% annual retirement withdrawal = $${formatNum(safeAnnualWithdrawal, 2)} ($${formatNum(safeMonthlyIncome, 2)}/month)`
      ]
    };
  },

  'inflation-calculator': (inputs) => {
    const amount = toNum(inputs.amount, 1000);
    const inflationRate = toNum(inputs.inflationRate, 3.2);
    const years = toNum(inputs.years, 15);

    const factor = Math.pow(1 + inflationRate / 100, years);
    const futureCost = amount * factor;
    const futurePurchasingPower = amount / factor;

    return {
      primaryValue: `$${formatNum(futureCost, 2)}`,
      primaryLabel: `Equivalent Future Cost in ${years} Yrs`,
      subtext: `Purchasing power of today's $${amount} will shrink to $${formatNum(futurePurchasingPower, 2)}`,
      breakdown: [
        { label: 'Starting Value', value: `$${formatNum(amount, 2)}` },
        { label: 'Average Annual Inflation', value: `${inflationRate}%` },
        { label: 'Time Horizon', value: `${years} years` },
        { label: 'Cumulative Price Increase', value: `+${formatNum((factor - 1) * 100, 1)}%` },
        { label: 'Future Cost of Same Goods', value: `$${formatNum(futureCost, 2)}` },
        { label: 'Real Purchasing Power', value: `$${formatNum(futurePurchasingPower, 2)}` }
      ],
      steps: [
        `Inflation multiplier: (1 + ${inflationRate / 100})^${years} = ${formatNum(factor, 4)}`,
        `To buy goods that cost $${amount} today, you will need $${formatNum(futureCost, 2)} in ${years} years`
      ]
    };
  },

  'roi-calculator': (inputs) => {
    const invested = toNum(inputs.invested, 10000);
    const returned = toNum(inputs.returned, 15500);
    const years = toNum(inputs.years, 3);

    if (invested <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Initial investment must be positive.' };

    const netProfit = returned - invested;
    const totalROI = (netProfit / invested) * 100;
    const annualizedROI = years > 0 ? (Math.pow(returned / invested, 1 / years) - 1) * 100 : totalROI;

    return {
      primaryValue: `${formatNum(totalROI, 2)}%`,
      primaryLabel: 'Total Return on Investment (ROI)',
      subtext: `Net Profit: $${formatNum(netProfit, 2)} | Annualized ROI: ${formatNum(annualizedROI, 2)}% p.a.`,
      breakdown: [
        { label: 'Capital Invested', value: `$${formatNum(invested, 2)}` },
        { label: 'Total Returned Value', value: `$${formatNum(returned, 2)}` },
        { label: 'Net Profit', value: `$${formatNum(netProfit, 2)}` },
        { label: 'Total ROI (%)', value: `${formatNum(totalROI, 2)}%` },
        { label: 'Annualized ROI (CAGR)', value: `${formatNum(annualizedROI, 2)}% per year` }
      ],
      steps: [
        `Net Profit = Return - Investment = $${returned} - $${invested} = $${formatNum(netProfit, 2)}`,
        `ROI = (Net Profit / Investment) × 100% = ($${formatNum(netProfit, 2)} / $${invested}) × 100% = ${formatNum(totalROI, 2)}%`,
        `Annualized ROI = (${returned} / ${invested})^(1/${years}) - 1 = ${formatNum(annualizedROI, 2)}%`
      ]
    };
  },

  'profit-calculator': (inputs) => {
    const rev = toNum(inputs.revenue, 50000);
    const cost = toNum(inputs.cost, 32000);

    const grossProfit = rev - cost;
    const margin = rev > 0 ? (grossProfit / rev) * 100 : 0;
    const markup = cost > 0 ? (grossProfit / cost) * 100 : 0;

    return {
      primaryValue: `$${formatNum(grossProfit, 2)}`,
      primaryLabel: 'Gross Profit',
      subtext: `Profit Margin: ${formatNum(margin, 2)}% | Markup: ${formatNum(markup, 2)}%`,
      breakdown: [
        { label: 'Revenue', value: `$${formatNum(rev, 2)}` },
        { label: 'Cost of Goods Sold (COGS)', value: `$${formatNum(cost, 2)}` },
        { label: 'Gross Profit', value: `$${formatNum(grossProfit, 2)}` },
        { label: 'Gross Margin', value: `${formatNum(margin, 2)}%` },
        { label: 'Markup Percentage', value: `${formatNum(markup, 2)}%` }
      ],
      steps: [
        `Gross Profit = Revenue - Cost = $${rev} - $${cost} = $${formatNum(grossProfit, 2)}`,
        `Margin = (Profit / Revenue) × 100% = ${formatNum(margin, 2)}%`,
        `Markup = (Profit / Cost) × 100% = ${formatNum(markup, 2)}%`
      ]
    };
  },

  'loss-calculator': (inputs) => {
    const cost = toNum(inputs.cost, 1200);
    const selling = toNum(inputs.selling, 900);

    const loss = cost - selling;
    const lossPct = cost > 0 ? (loss / cost) * 100 : 0;

    return {
      primaryValue: `$${formatNum(Math.max(0, loss), 2)}`,
      primaryLabel: loss > 0 ? 'Total Loss Amount' : 'No Financial Loss (Profitable)',
      subtext: loss > 0 ? `Loss Percentage: ${formatNum(lossPct, 2)}% of cost` : 'Selling price is equal to or greater than cost.',
      breakdown: [
        { label: 'Original Cost', value: `$${formatNum(cost, 2)}` },
        { label: 'Selling Price', value: `$${formatNum(selling, 2)}` },
        { label: 'Net Loss', value: `$${formatNum(Math.max(0, loss), 2)}` },
        { label: 'Loss Percentage', value: `${formatNum(Math.max(0, lossPct), 2)}%` }
      ],
      steps: [
        `Loss = Cost - Selling Price = $${cost} - $${selling} = $${formatNum(loss, 2)}`,
        `Loss % = (Loss / Cost) × 100% = ${formatNum(lossPct, 2)}%`
      ]
    };
  },

  'profit-margin-calculator': (inputs) => {
    const cost = toNum(inputs.cost, 45);
    const rev = toNum(inputs.revenue, 75);

    if (rev <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Revenue must be greater than zero.' };

    const profit = rev - cost;
    const margin = (profit / rev) * 100;
    const markup = cost > 0 ? (profit / cost) * 100 : 0;

    return {
      primaryValue: `${formatNum(margin, 2)}%`,
      primaryLabel: 'Profit Margin',
      subtext: `Net Profit: $${formatNum(profit, 2)} per unit | Markup: ${formatNum(markup, 2)}%`,
      breakdown: [
        { label: 'Unit Cost', value: `$${formatNum(cost, 2)}` },
        { label: 'Selling Price / Revenue', value: `$${formatNum(rev, 2)}` },
        { label: 'Profit Amount', value: `$${formatNum(profit, 2)}` },
        { label: 'Profit Margin (%)', value: `${formatNum(margin, 2)}%` },
        { label: 'Markup (%)', value: `${formatNum(markup, 2)}%` }
      ],
      steps: [
        `Profit = Revenue - Cost = $${rev} - $${cost} = $${formatNum(profit, 2)}`,
        `Margin = (Profit / Revenue) × 100 = ($${formatNum(profit, 2)} / $${rev}) × 100 = ${formatNum(margin, 2)}%`
      ]
    };
  },

  'markup-calculator': (inputs) => {
    const cost = toNum(inputs.cost, 60);
    const markup = toNum(inputs.markup, 50);

    const profit = cost * (markup / 100);
    const sellingPrice = cost + profit;
    const margin = (profit / sellingPrice) * 100;

    return {
      primaryValue: `$${formatNum(sellingPrice, 2)}`,
      primaryLabel: 'Target Selling Price',
      subtext: `Profit: $${formatNum(profit, 2)} | Equivalent Margin: ${formatNum(margin, 2)}%`,
      breakdown: [
        { label: 'Base Cost', value: `$${formatNum(cost, 2)}` },
        { label: 'Desired Markup', value: `${markup}%` },
        { label: 'Profit Added', value: `$${formatNum(profit, 2)}` },
        { label: 'Calculated Selling Price', value: `$${formatNum(sellingPrice, 2)}` },
        { label: 'Profit Margin', value: `${formatNum(margin, 2)}%` }
      ],
      steps: [
        `Markup Amount = Cost × (Markup % / 100) = $${cost} × ${markup / 100} = $${formatNum(profit, 2)}`,
        `Selling Price = Cost + Markup = $${cost} + $${formatNum(profit, 2)} = $${formatNum(sellingPrice, 2)}`
      ]
    };
  },

  'discount-calculator': (inputs) => {
    const originalPrice = toNum(inputs.originalPrice, 120);
    const discountPct = toNum(inputs.discountPct, 25);
    const taxPct = toNum(inputs.taxPct, 8);

    const savings = originalPrice * (discountPct / 100);
    const discountedPrice = originalPrice - savings;
    const taxAmount = discountedPrice * (taxPct / 100);
    const finalTotal = discountedPrice + taxAmount;

    return {
      primaryValue: `$${formatNum(finalTotal, 2)}`,
      primaryLabel: 'Final Checkout Price',
      subtext: `You Save: $${formatNum(savings, 2)} (${discountPct}% off)`,
      breakdown: [
        { label: 'Original Price', value: `$${formatNum(originalPrice, 2)}` },
        { label: 'Discount Amount', value: `-$${formatNum(savings, 2)} (${discountPct}%)` },
        { label: 'Sale Price (before tax)', value: `$${formatNum(discountedPrice, 2)}` },
        { label: 'Tax Added', value: `+$${formatNum(taxAmount, 2)} (${taxPct}%)` },
        { label: 'Final Total Paid', value: `$${formatNum(finalTotal, 2)}` }
      ],
      steps: [
        `Discount = $${originalPrice} × ${discountPct}% = $${formatNum(savings, 2)}`,
        `Discounted Price = $${originalPrice} - $${formatNum(savings, 2)} = $${formatNum(discountedPrice, 2)}`,
        `Tax = $${formatNum(discountedPrice, 2)} × ${taxPct}% = $${formatNum(taxAmount, 2)}`,
        `Final Price = $${formatNum(finalTotal, 2)}`
      ]
    };
  },

  'commission-calculator': (inputs) => {
    const sales = toNum(inputs.salesAmount, 80000);
    const rate = toNum(inputs.commissionRate, 7.5);
    const base = toNum(inputs.baseSalary, 3000);

    const commission = sales * (rate / 100);
    const totalEarnings = base + commission;

    return {
      primaryValue: `$${formatNum(totalEarnings, 2)}`,
      primaryLabel: 'Total Gross Compensation',
      subtext: `Commission Earned: $${formatNum(commission, 2)} + Base: $${formatNum(base, 2)}`,
      breakdown: [
        { label: 'Gross Sales Volume', value: `$${formatNum(sales, 2)}` },
        { label: 'Commission Rate', value: `${rate}%` },
        { label: 'Commission Pay', value: `$${formatNum(commission, 2)}` },
        { label: 'Base Salary', value: `$${formatNum(base, 2)}` },
        { label: 'Total Earnings', value: `$${formatNum(totalEarnings, 2)}` }
      ],
      steps: [
        `Commission = Sales ($${sales}) × ${rate}% = $${formatNum(commission, 2)}`,
        `Total Pay = Base ($${base}) + Commission ($${formatNum(commission, 2)}) = $${formatNum(totalEarnings, 2)}`
      ]
    };
  },

  'salary-calculator': (inputs) => {
    const annual = toNum(inputs.annualSalary, 65000);
    const hoursPerWeek = toNum(inputs.hoursPerWeek, 40);
    const weeksPerYear = toNum(inputs.weeksPerYear, 52);

    if (hoursPerWeek <= 0 || weeksPerYear <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Hours and weeks must be positive.' };

    const totalHours = hoursPerWeek * weeksPerYear;
    const hourly = annual / totalHours;
    const weekly = annual / weeksPerYear;
    const biweekly = weekly * 2;
    const monthly = annual / 12;
    const daily = weekly / 5;

    return {
      primaryValue: `$${formatNum(hourly, 2)} / hr`,
      primaryLabel: 'Equivalent Hourly Wage',
      subtext: `Monthly: $${formatNum(monthly, 2)} | Bi-weekly: $${formatNum(biweekly, 2)}`,
      breakdown: [
        { label: 'Annual Salary', value: `$${formatNum(annual, 2)}` },
        { label: 'Monthly Pay', value: `$${formatNum(monthly, 2)}` },
        { label: 'Bi-Weekly Pay', value: `$${formatNum(biweekly, 2)}` },
        { label: 'Weekly Pay', value: `$${formatNum(weekly, 2)}` },
        { label: 'Daily Pay (5-day week)', value: `$${formatNum(daily, 2)}` },
        { label: 'Hourly Rate', value: `$${formatNum(hourly, 2)} / hr` }
      ],
      steps: [
        `Total annual working hours = ${hoursPerWeek} hrs/week × ${weeksPerYear} weeks = ${totalHours} hrs`,
        `Hourly rate = $${annual} / ${totalHours} = $${formatNum(hourly, 2)}`,
        `Monthly pay = $${annual} / 12 = $${formatNum(monthly, 2)}`
      ]
    };
  },

  'hourly-wage-calculator': (inputs) => {
    const rate = toNum(inputs.hourlyRate, 28);
    const regHours = toNum(inputs.regularHours, 40);
    const otHours = toNum(inputs.overtimeHours, 5);
    const otMult = toNum(inputs.overtimeMultiplier, 1.5);

    const regPay = rate * regHours;
    const otRate = rate * otMult;
    const otPay = otHours * otRate;
    const weeklyTotal = regPay + otPay;
    const annualTotal = weeklyTotal * 52;

    return {
      primaryValue: `$${formatNum(weeklyTotal, 2)} / wk`,
      primaryLabel: 'Gross Weekly Pay',
      subtext: `Projected Annual Pay: $${formatNum(annualTotal, 2)}`,
      breakdown: [
        { label: 'Regular Hourly Rate', value: `$${formatNum(rate, 2)} / hr` },
        { label: 'Regular Hours & Pay', value: `${regHours} hrs = $${formatNum(regPay, 2)}` },
        { label: 'Overtime Rate', value: `$${formatNum(otRate, 2)} / hr (${otMult}×)` },
        { label: 'Overtime Pay', value: `${otHours} hrs = $${formatNum(otPay, 2)}` },
        { label: 'Total Weekly Pay', value: `$${formatNum(weeklyTotal, 2)}` },
        { label: 'Total Annual Gross', value: `$${formatNum(annualTotal, 2)}` }
      ],
      steps: [
        `Regular Earnings = ${regHours} × $${rate} = $${formatNum(regPay, 2)}`,
        `Overtime Earnings = ${otHours} × ($${rate} × ${otMult}) = $${formatNum(otPay, 2)}`,
        `Weekly Total = $${formatNum(regPay, 2)} + $${formatNum(otPay, 2)} = $${formatNum(weeklyTotal, 2)}`
      ]
    };
  },

  'net-worth-calculator': (inputs) => {
    const cash = toNum(inputs.cash, 15000);
    const investments = toNum(inputs.investments, 65000);
    const realEstate = toNum(inputs.realEstate, 350000);
    const mortgage = toNum(inputs.mortgage, 240000);
    const otherDebt = toNum(inputs.otherDebt, 22000);

    const totalAssets = cash + investments + realEstate;
    const totalLiabilities = mortgage + otherDebt;
    const netWorth = totalAssets - totalLiabilities;

    return {
      primaryValue: `$${formatNum(netWorth, 2)}`,
      primaryLabel: 'Total Net Worth',
      subtext: `Assets: $${formatNum(totalAssets, 2)} | Liabilities: $${formatNum(totalLiabilities, 2)}`,
      breakdown: [
        { label: 'Total Assets', value: `$${formatNum(totalAssets, 2)}` },
        { label: 'Total Liabilities', value: `$${formatNum(totalLiabilities, 2)}` },
        { label: 'Net Worth (Assets - Liabilities)', value: `$${formatNum(netWorth, 2)}` },
        { label: 'Debt-to-Asset Ratio', value: totalAssets > 0 ? `${formatNum((totalLiabilities / totalAssets) * 100, 1)}%` : 'N/A' }
      ],
      steps: [
        `Sum of Assets = $${cash} + $${investments} + $${realEstate} = $${formatNum(totalAssets, 2)}`,
        `Sum of Liabilities = $${mortgage} + $${otherDebt} = $${formatNum(totalLiabilities, 2)}`,
        `Net Worth = $${formatNum(totalAssets, 2)} - $${formatNum(totalLiabilities, 2)} = $${formatNum(netWorth, 2)}`
      ]
    };
  },

  'break-even-calculator': (inputs) => {
    const fixedCosts = toNum(inputs.fixedCosts, 12000);
    const variableCost = toNum(inputs.variableCostPerUnit, 15);
    const price = toNum(inputs.salePricePerUnit, 40);

    const contributionMargin = price - variableCost;
    if (contributionMargin <= 0) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Sale price must be strictly greater than variable cost per unit.' };
    }

    const breakEvenUnits = Math.ceil(fixedCosts / contributionMargin);
    const breakEvenRevenue = breakEvenUnits * price;
    const cmRatio = (contributionMargin / price) * 100;

    return {
      primaryValue: `${breakEvenUnits.toLocaleString('en-US')} units`,
      primaryLabel: 'Break-Even Sales Volume',
      subtext: `Break-Even Revenue: $${formatNum(breakEvenRevenue, 2)}`,
      breakdown: [
        { label: 'Fixed Costs', value: `$${formatNum(fixedCosts, 2)}` },
        { label: 'Unit Selling Price', value: `$${formatNum(price, 2)}` },
        { label: 'Variable Cost per Unit', value: `$${formatNum(variableCost, 2)}` },
        { label: 'Unit Contribution Margin', value: `$${formatNum(contributionMargin, 2)}` },
        { label: 'Contribution Margin Ratio', value: `${formatNum(cmRatio, 1)}%` },
        { label: 'Break-Even Units', value: `${breakEvenUnits.toLocaleString('en-US')}` },
        { label: 'Break-Even Dollar Revenue', value: `$${formatNum(breakEvenRevenue, 2)}` }
      ],
      steps: [
        `Contribution Margin = Price - Variable Cost = $${price} - $${variableCost} = $${formatNum(contributionMargin, 2)}`,
        `Break-Even Units = Fixed Costs / CM = $${fixedCosts} / $${formatNum(contributionMargin, 2)} = ${breakEvenUnits} units`,
        `Break-Even Revenue = ${breakEvenUnits} × $${price} = $${formatNum(breakEvenRevenue, 2)}`
      ]
    };
  },

  'debt-payoff-calculator': (inputs) => {
    const balance = toNum(inputs.balance, 18000);
    const apr = toNum(inputs.interestRate, 19.5);
    const payment = toNum(inputs.monthlyPayment, 550);

    if (balance <= 0 || payment <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Balance and monthly payment must be positive.' };

    const r = apr / 100 / 12;
    const minInterest = balance * r;

    if (payment <= minInterest) {
      return { primaryValue: 'Warning', primaryLabel: 'Insolvent Payment', error: `Monthly payment must exceed monthly interest ($${formatNum(minInterest, 2)}) to amortize debt.` };
    }

    // Amortization loop
    let remaining = balance;
    let months = 0;
    let totalInterest = 0;

    while (remaining > 0 && months < 600) {
      const interest = remaining * r;
      totalInterest += interest;
      const principal = Math.min(remaining, payment - interest);
      remaining -= principal;
      months++;
    }

    const years = (months / 12).toFixed(1);
    const totalPaid = balance + totalInterest;

    return {
      primaryValue: `${months} months (${years} yrs)`,
      primaryLabel: 'Time to Become Debt-Free',
      subtext: `Total Interest Paid: $${formatNum(totalInterest, 2)} | Total Paid: $${formatNum(totalPaid, 2)}`,
      breakdown: [
        { label: 'Initial Debt Balance', value: `$${formatNum(balance, 2)}` },
        { label: 'Annual APR', value: `${apr}%` },
        { label: 'Monthly Payment', value: `$${formatNum(payment, 2)}` },
        { label: 'Payoff Horizon', value: `${months} months (${years} years)` },
        { label: 'Total Interest Charge', value: `$${formatNum(totalInterest, 2)}` },
        { label: 'Total Amount Repaid', value: `$${formatNum(totalPaid, 2)}` }
      ],
      steps: [
        `Monthly interest charge rate: ${apr}% / 12 = ${formatNum(r * 100, 3)}%`,
        `Monthly principal deduction: $${payment} - (Interest)`,
        `Paid off full $${formatNum(balance, 2)} in ${months} payments`
      ]
    };
  },

  'currency-calculator': (inputs) => {
    const amount = toNum(inputs.amount, 100);
    const from = inputs.from || 'USD';
    const to = inputs.to || 'EUR';

    // Standard benchmark exchange rates relative to USD (1.0)
    const benchmarkRates = {
      USD: 1.0,
      EUR: 0.92,
      GBP: 0.79,
      JPY: 152.4,
      CAD: 1.36,
      AUD: 1.53,
      INR: 83.5,
      CHF: 0.90
    };

    const fromRate = benchmarkRates[from] || 1.0;
    const toRate = benchmarkRates[to] || 1.0;

    // Convert from -> USD -> to
    const inUSD = amount / fromRate;
    const converted = inUSD * toRate;
    const rate1to1 = toRate / fromRate;

    return {
      primaryValue: `${formatNum(converted, 2)} ${to}`,
      primaryLabel: `Converted Currency (${to})`,
      subtext: `1 ${from} = ${formatNum(rate1to1, 4)} ${to}`,
      breakdown: [
        { label: 'Input Amount', value: `${formatNum(amount, 2)} ${from}` },
        { label: 'Exchange Rate', value: `1 ${from} = ${formatNum(rate1to1, 4)} ${to}` },
        { label: 'Converted Total', value: `${formatNum(converted, 2)} ${to}` }
      ],
      steps: [
        `Standard base benchmark conversion`,
        `Rate: 1 ${from} = ${formatNum(rate1to1, 4)} ${to}`,
        `${amount} ${from} × ${formatNum(rate1to1, 4)} = ${formatNum(converted, 2)} ${to}`
      ]
    };
  },

  'future-value-calculator': (inputs) => {
    const pv = toNum(inputs.pv, 10000);
    const rate = toNum(inputs.rate, 7);
    const years = toNum(inputs.years, 10);
    const freq = toNum(inputs.compoundFreq, 1);

    const r = rate / 100 / freq;
    const n = years * freq;
    const fv = pv * Math.pow(1 + r, n);
    const interest = fv - pv;

    return {
      primaryValue: `$${formatNum(fv, 2)}`,
      primaryLabel: 'Future Value (FV)',
      subtext: `Initial Investment: $${formatNum(pv, 2)} | Compounded Interest: $${formatNum(interest, 2)}`,
      breakdown: [
        { label: 'Present Value (PV)', value: `$${formatNum(pv, 2)}` },
        { label: 'Annual Rate (r)', value: `${rate}%` },
        { label: 'Compounding Frequency', value: `${freq} times/year` },
        { label: 'Investment Horizon (t)', value: `${years} years` },
        { label: 'Future Value (FV)', value: `$${formatNum(fv, 2)}` },
        { label: 'Total Growth Gain', value: `$${formatNum(interest, 2)}` }
      ],
      steps: [
        `Formula: FV = PV × (1 + r/m)^(m × t)`,
        `Periodic rate = ${rate}% / ${freq} = ${formatNum(r * 100, 4)}%`,
        `Total compounding periods = ${years} × ${freq} = ${n}`,
        `FV = $${pv} × (1 + ${formatNum(r, 6)})^${n} = $${formatNum(fv, 2)}`
      ]
    };
  },

  'present-value-calculator': (inputs) => {
    const fv = toNum(inputs.fv, 25000);
    const rate = toNum(inputs.discountRate, 6.5);
    const years = toNum(inputs.years, 5);
    const freq = toNum(inputs.compoundFreq, 1);

    const r = rate / 100 / freq;
    const n = years * freq;
    const pv = fv / Math.pow(1 + r, n);
    const discount = fv - pv;

    return {
      primaryValue: `$${formatNum(pv, 2)}`,
      primaryLabel: 'Present Value (PV)',
      subtext: `Discounted at ${rate}% over ${years} years from $${formatNum(fv, 2)}`,
      breakdown: [
        { label: 'Future Sum (FV)', value: `$${formatNum(fv, 2)}` },
        { label: 'Discount Rate', value: `${rate}%` },
        { label: 'Time Horizon', value: `${years} years` },
        { label: 'Present Value (PV)', value: `$${formatNum(pv, 2)}` },
        { label: 'Total Discount Amount', value: `$${formatNum(discount, 2)}` }
      ],
      steps: [
        `Formula: PV = FV / (1 + r/m)^(m × t)`,
        `Discount factor = (1 + ${rate / 100 / freq})^${n} = ${formatNum(Math.pow(1 + r, n), 4)}`,
        `PV = $${fv} / ${formatNum(Math.pow(1 + r, n), 4)} = $${formatNum(pv, 2)}`
      ]
    };
  },

  'cagr-calculator': (inputs) => {
    const initial = toNum(inputs.initialValue, 5000);
    const finalVal = toNum(inputs.finalValue, 15000);
    const periods = toNum(inputs.periods, 5);

    if (initial <= 0 || finalVal <= 0 || periods <= 0) {
      return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Initial, final values, and time periods must be strictly positive.' };
    }

    const cagr = (Math.pow(finalVal / initial, 1 / periods) - 1) * 100;
    const totalGrowth = ((finalVal - initial) / initial) * 100;

    return {
      primaryValue: `${formatNum(cagr, 2)}%`,
      primaryLabel: 'Compound Annual Growth Rate (CAGR)',
      subtext: `Total Cumulative Growth: ${formatNum(totalGrowth, 2)}% over ${periods} years`,
      breakdown: [
        { label: 'Beginning Value', value: `$${formatNum(initial, 2)}` },
        { label: 'Ending Value', value: `$${formatNum(finalVal, 2)}` },
        { label: 'Number of Years', value: `${periods}` },
        { label: 'Total Return (%)', value: `${formatNum(totalGrowth, 2)}%` },
        { label: 'CAGR (Annualized)', value: `${formatNum(cagr, 2)}% per year` }
      ],
      steps: [
        `CAGR formula: (Ending / Beginning)^(1 / Years) - 1`,
        `(${finalVal} / ${initial})^(1 / ${periods}) - 1 = (${formatNum(finalVal / initial, 4)})^${formatNum(1 / periods, 4)} - 1`,
        `CAGR = ${formatNum(cagr, 2)}%`
      ]
    };
  }
};

module.exports = engines;


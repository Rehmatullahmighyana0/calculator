import { CalculatorDef } from '../../types/calculator';

export const businessCalculators: CalculatorDef[] = [
  {
    id: 'business-profit-calculator',
    slug: 'business-profit-calculator',
    title: 'Business Profit & EBITDA Calculator',
    category: 'business',
    shortDesc: 'Compute Gross Profit, Operating Income, and Net Profit Margin from P&L revenues and expenses.',
    icon: 'Briefcase',
    badge: 'popular',
    fields: [
      { id: 'revenue', label: 'Total Sales Revenue ($)', type: 'number', defaultValue: 250000, min: 0, step: 5000 },
      { id: 'cogs', label: 'Cost of Goods Sold (COGS) ($)', type: 'number', defaultValue: 100000, min: 0, step: 5000 },
      { id: 'operatingExpenses', label: 'Operating Expenses (OPEX) ($)', type: 'number', defaultValue: 65000, min: 0, step: 2500 },
      { id: 'taxesAndInterest', label: 'Taxes & Interest ($)', type: 'number', defaultValue: 18000, min: 0, step: 1000 }
    ],
    calculate: (inputs) => {
      const rev = parseFloat(inputs.revenue) || 0;
      const cogs = parseFloat(inputs.cogs) || 0;
      const opex = parseFloat(inputs.operatingExpenses) || 0;
      const taxInt = parseFloat(inputs.taxesAndInterest) || 0;

      const grossProfit = rev - cogs;
      const operatingIncome = grossProfit - opex; // Operating profit / EBIT
      const netProfit = operatingIncome - taxInt;

      const grossMargin = rev > 0 ? (grossProfit / rev) * 100 : 0;
      const netMargin = rev > 0 ? (netProfit / rev) * 100 : 0;

      return {
        primaryValue: `$${netProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        primaryLabel: 'Net Business Profit',
        subtext: `Net Profit Margin: ${netMargin.toFixed(1)}% | Operating Profit: $${operatingIncome.toLocaleString()}`,
        breakdown: [
          { label: 'Gross Revenue', value: `$${rev.toLocaleString()}` },
          { label: 'COGS', value: `-$${cogs.toLocaleString()}` },
          { label: 'Gross Profit', value: `$${grossProfit.toLocaleString()} (${grossMargin.toFixed(1)}% margin)` },
          { label: 'Operating Expenses (OPEX)', value: `-$${opex.toLocaleString()}` },
          { label: 'Operating Income (EBIT)', value: `$${operatingIncome.toLocaleString()}` },
          { label: 'Taxes & Interest', value: `-$${taxInt.toLocaleString()}` },
          { label: 'Bottom-Line Net Profit', value: `$${netProfit.toLocaleString()}` }
        ],
        steps: [
          `Gross Profit = Revenue - COGS = $${rev.toLocaleString()} - $${cogs.toLocaleString()} = $${grossProfit.toLocaleString()}`,
          `Operating Income = Gross Profit - OPEX = $${grossProfit.toLocaleString()} - $${opex.toLocaleString()} = $${operatingIncome.toLocaleString()}`,
          `Net Profit = Operating Income - Taxes = $${operatingIncome.toLocaleString()} - $${taxInt.toLocaleString()} = $${netProfit.toLocaleString()}`
        ]
      };
    },
    formula: 'Net Profit = Revenue - COGS - OPEX - Taxes & Interest',
    explanation: 'Comprehensive income statement (P&L) breakdown determining gross, operating, and net profitability.',
    howToUse: ['Enter total revenue.', 'Enter cost of goods sold, overhead operating expenses, and taxes.', 'Click Calculate.'],
    example: { inputs: { revenue: 250000, cogs: 100000, operatingExpenses: 65000, taxesAndInterest: 18000 }, output: '$67,000.00', explanation: '$250k revenue yields $67k bottom-line net profit (26.8% net margin).' },
    faqs: [{ question: 'What is EBIT?', answer: 'Earnings Before Interest and Taxes, representing operating profit from core business operations.' }],
    keywords: ['business profit calculator', 'p&l calculator', 'gross margin', 'operating income', 'net profit']
  },
  {
    id: 'roas-calculator',
    slug: 'roas-calculator',
    title: 'ROAS Calculator (Return on Ad Spend)',
    category: 'business',
    shortDesc: 'Calculate Return on Ad Spend (ROAS) ratio, percentage return, and ad campaign profit.',
    icon: 'Target',
    badge: 'popular',
    fields: [
      { id: 'adSpend', label: 'Total Advertising Spend ($)', type: 'number', defaultValue: 5000, min: 1, step: 250 },
      { id: 'adRevenue', label: 'Revenue Generated from Ads ($)', type: 'number', defaultValue: 22500, min: 0, step: 500 }
    ],
    calculate: (inputs) => {
      const spend = parseFloat(inputs.adSpend) || 0;
      const rev = parseFloat(inputs.adRevenue) || 0;

      if (spend <= 0) return { primaryValue: 'Error', primaryLabel: 'Result', error: 'Ad spend must be greater than zero.' };

      const roasRatio = rev / spend;
      const roasPct = roasRatio * 100;
      const netProfit = rev - spend;
      const profitMarginOnAds = rev > 0 ? (netProfit / rev) * 100 : 0;

      return {
        primaryValue: `${roasRatio.toFixed(2)}x (${roasPct.toFixed(0)}%)`,
        primaryLabel: 'Return on Ad Spend (ROAS)',
        subtext: `Campaign Net Profit: $${netProfit.toLocaleString()} ($${roasRatio.toFixed(2)} return for every $1 spent)`,
        breakdown: [
          { label: 'Advertising Spend', value: `$${spend.toLocaleString()}` },
          { label: 'Attributed Revenue', value: `$${rev.toLocaleString()}` },
          { label: 'ROAS Multiplier', value: `${roasRatio.toFixed(2)}x` },
          { label: 'Net Profit from Ads', value: `$${netProfit.toLocaleString()}` },
          { label: 'Ad Margin %', value: `${profitMarginOnAds.toFixed(1)}%` }
        ],
        steps: [`ROAS = Revenue / Spend = $${rev} / $${spend} = ${roasRatio.toFixed(2)}x (${roasPct.toFixed(0)}%)`]
      };
    },
    formula: 'ROAS = Revenue from Advertising / Advertising Spend',
    explanation: 'Measures the monetary efficiency and direct sales yield of digital marketing and pay-per-click (PPC) campaigns.',
    howToUse: ['Enter total ad spend (Google, Meta, TikTok ads).', 'Enter gross revenue tracked from ads.', 'Click Calculate.'],
    example: { inputs: { adSpend: 5000, adRevenue: 22500 }, output: '4.50x (450%)', explanation: '$4.50 generated for every dollar spent on ads ($17,500 net profit).' },
    faqs: [{ question: 'What is a good ROAS for eCommerce?', answer: 'Typically 3x to 4x (300%-400%) is needed to cover product cost, fulfillment, and shipping while maintaining profitability.' }],
    keywords: ['roas calculator', 'return on ad spend', 'ppc roi', 'meta ads roas', 'google ads roas']
  },
  {
    id: 'employee-cost-calculator',
    slug: 'employee-cost-calculator',
    title: 'True Cost of an Employee Calculator',
    category: 'business',
    shortDesc: 'Compute the full burden cost of an employee including taxes, benefits, bonuses, and equipment.',
    icon: 'Users',
    badge: 'popular',
    fields: [
      { id: 'baseSalary', label: 'Base Annual Salary ($)', type: 'number', defaultValue: 75000, min: 1000, step: 1000 },
      { id: 'healthInsurance', label: 'Annual Health Insurance ($)', type: 'number', defaultValue: 7200, min: 0, step: 200 },
      { id: 'retirementMatch', label: '401(k) / Pension Match (%)', type: 'number', defaultValue: 4, min: 0, max: 15, step: 0.5 },
      { id: 'payrollTaxesPct', label: 'Employer Payroll Taxes (FICA, FUTA, SUTA) (%)', type: 'number', defaultValue: 8.5, min: 0, max: 20, step: 0.5 },
      { id: 'equipmentSoftware', label: 'Hardware, Software & Overhead ($/yr)', type: 'number', defaultValue: 4500, min: 0, step: 500 }
    ],
    calculate: (inputs) => {
      const salary = parseFloat(inputs.baseSalary) || 0;
      const health = parseFloat(inputs.healthInsurance) || 0;
      const retPct = (parseFloat(inputs.retirementMatch) || 0) / 100;
      const taxPct = (parseFloat(inputs.payrollTaxesPct) || 0) / 100;
      const overhead = parseFloat(inputs.equipmentSoftware) || 0;

      const retirement = salary * retPct;
      const payrollTax = salary * taxPct;
      const totalCost = salary + health + retirement + payrollTax + overhead;
      const burdenMultiplier = salary > 0 ? totalCost / salary : 1;

      return {
        primaryValue: `$${totalCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}/year`,
        primaryLabel: 'True Total Employee Cost',
        subtext: `Burden Multiplier: ${burdenMultiplier.toFixed(2)}x base salary ($${(totalCost / 12).toFixed(0)}/month)`,
        breakdown: [
          { label: 'Base Salary', value: `$${salary.toLocaleString()}` },
          { label: 'Health Insurance', value: `+$${health.toLocaleString()}` },
          { label: 'Retirement Match', value: `+$${retirement.toLocaleString()}` },
          { label: 'Employer Payroll Taxes', value: `+$${payrollTax.toLocaleString()}` },
          { label: 'Overhead & Tooling', value: `+$${overhead.toLocaleString()}` },
          { label: 'Total Fully Burdened Cost', value: `$${totalCost.toLocaleString()}` },
          { label: 'True Hourly Cost (2,080 hrs)', value: `$${(totalCost / 2080).toFixed(2)}/hr` }
        ],
        steps: [
          `Base Salary: $${salary.toLocaleString()}`,
          `Add Benefits & Taxes: $${health} + $${retirement} + $${payrollTax} + $${overhead} = $${(totalCost - salary).toLocaleString()}`,
          `Total Burdened Cost = $${totalCost.toLocaleString()} (${burdenMultiplier.toFixed(2)}x salary)`
        ]
      };
    },
    formula: 'Total Cost = Base Salary + Health + Retirement Match + Payroll Taxes + Overhead',
    explanation: 'A fully burdened employee typically costs 1.25x to 1.40x their nominal base salary once employer taxes, healthcare, and software are included.',
    howToUse: ['Enter base salary.', 'Enter benefits, employer taxes, and overhead.', 'Click Calculate to find the true hiring cost.'],
    example: { inputs: { baseSalary: 75000, healthInsurance: 7200, retirementMatch: 4, payrollTaxesPct: 8.5, equipmentSoftware: 4500 }, output: '$96,075/year', explanation: 'A $75,000 employee truly costs the business $96,075 per year (1.28x burden).' },
    faqs: [{ question: 'What is the standard labor burden multiplier?', answer: 'The US average labor burden is between 1.25 and 1.40 times base salary depending on industry.' }],
    keywords: ['employee cost calculator', 'true cost of employee', 'labor burden rate', 'hiring cost calculator']
  },
  {
    id: 'business-revenue-calculator',
    slug: 'business-revenue-calculator',
    title: 'SaaS & Recurring Revenue Calculator (MRR / ARR)',
    category: 'business',
    shortDesc: 'Compute Monthly Recurring Revenue (MRR), Annual Recurring Revenue (ARR), and Churn impact.',
    icon: 'TrendingUp',
    fields: [
      { id: 'customers', label: 'Active Paying Customers', type: 'number', defaultValue: 450, min: 1, step: 10 },
      { id: 'arpu', label: 'Average Revenue per User ($ / month)', type: 'number', defaultValue: 79, min: 1, step: 5 },
      { id: 'growthRatePct', label: 'Monthly Growth Rate (%)', type: 'number', defaultValue: 5, min: -20, max: 100, step: 0.5 }
    ],
    calculate: (inputs) => {
      const customers = parseInt(inputs.customers) || 1;
      const arpu = parseFloat(inputs.arpu) || 0;
      const growth = (parseFloat(inputs.growthRatePct) || 0) / 100;

      const mrr = customers * arpu;
      const arr = mrr * 12;
      const nextMonthMrr = mrr * (1 + growth);
      const projectedArr12Mo = mrr * Math.pow(1 + growth, 12) * 12;

      return {
        primaryValue: `$${mrr.toLocaleString('en-US', { maximumFractionDigits: 0 })}/mo MRR`,
        primaryLabel: 'Monthly Recurring Revenue',
        subtext: `Annual Recurring Revenue (ARR): $${arr.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
        breakdown: [
          { label: 'Active Subscribers', value: customers.toLocaleString() },
          { label: 'ARPU (Monthly)', value: `$${arpu.toFixed(2)}` },
          { label: 'Current MRR', value: `$${mrr.toLocaleString()}` },
          { label: 'Current ARR (MRR × 12)', value: `$${arr.toLocaleString()}` },
          { label: 'Next Month Forecasted MRR', value: `$${nextMonthMrr.toLocaleString()}` },
          { label: '12-Month Projected Run Rate', value: `$${projectedArr12Mo.toLocaleString('en-US', { maximumFractionDigits: 0 })}` }
        ],
        steps: [`MRR = ${customers} customers × $${arpu}/mo = $${mrr.toLocaleString()}`, `ARR = MRR × 12 = $${arr.toLocaleString()}`]
      };
    },
    formula: 'MRR = Active Customers × ARPU  |  ARR = MRR × 12',
    explanation: 'Tracks predictable subscription revenue streams for SaaS, memberships, and digital platforms.',
    howToUse: ['Enter active user count.', 'Enter monthly subscription price (ARPU).', 'Click Calculate.'],
    example: { inputs: { customers: 450, arpu: 79, growthRatePct: 5 }, output: '$35,550/mo MRR', explanation: '450 subscribers @ $79/mo yields $35,550 monthly recurring revenue ($426,600 ARR).' },
    faqs: [{ question: 'What is ARPU?', answer: 'Average Revenue Per User, calculated as total revenue divided by the number of active subscribers.' }],
    keywords: ['mrr calculator', 'arr calculator', 'saas revenue', 'subscription business metrics']
  },
  {
    id: 'cost-calculator',
    slug: 'cost-calculator',
    title: 'Total & Unit Production Cost Calculator',
    category: 'business',
    shortDesc: 'Compute total production cost and average cost per unit across volume scales.',
    icon: 'Layers',
    fields: [
      { id: 'fixedCosts', label: 'Total Fixed Costs ($)', type: 'number', defaultValue: 25000, min: 0, step: 1000 },
      { id: 'variablePerUnit', label: 'Variable Cost per Unit ($)', type: 'number', defaultValue: 18.5, min: 0.1, step: 0.5 },
      { id: 'quantity', label: 'Production Volume (Units)', type: 'number', defaultValue: 5000, min: 1, step: 100 }
    ],
    calculate: (inputs) => {
      const fc = parseFloat(inputs.fixedCosts) || 0;
      const vc = parseFloat(inputs.variablePerUnit) || 0;
      const q = parseInt(inputs.quantity) || 1;

      const totalVariable = vc * q;
      const totalCost = fc + totalVariable;
      const avgCostPerUnit = totalCost / q;

      return {
        primaryValue: `$${avgCostPerUnit.toFixed(2)}/unit`,
        primaryLabel: 'Average Cost per Unit',
        subtext: `Total Production Outlay: $${totalCost.toLocaleString()}`,
        breakdown: [
          { label: 'Fixed Costs', value: `$${fc.toLocaleString()}` },
          { label: 'Variable Cost per Unit', value: `$${vc.toFixed(2)}` },
          { label: 'Production Units', value: q.toLocaleString() },
          { label: 'Total Variable Costs', value: `$${totalVariable.toLocaleString()}` },
          { label: 'Total Cost of Production', value: `$${totalCost.toLocaleString()}` },
          { label: 'Cost per Finished Unit', value: `$${avgCostPerUnit.toFixed(2)}` }
        ],
        steps: [
          `Total Cost = Fixed ($${fc}) + (${vc} × ${q}) = $${totalCost.toLocaleString()}`,
          `Unit Cost = $${totalCost.toLocaleString()} / ${q} = $${avgCostPerUnit.toFixed(2)} per unit`
        ]
      };
    },
    formula: 'Total Cost = Fixed Costs + (Variable Cost/Unit × Quantity)  |  Unit Cost = Total / Q',
    explanation: 'Demonstrates economies of scale: as production volume increases, fixed overhead is spread across more units, lowering per-unit manufacturing cost.',
    howToUse: ['Enter fixed overhead expenses.', 'Enter unit variable cost.', 'Enter batch production quantity.', 'Click Calculate.'],
    example: { inputs: { fixedCosts: 25000, variablePerUnit: 18.5, quantity: 5000 }, output: '$23.50/unit', explanation: 'Total cost of $117,500 divided by 5,000 units is $23.50 per unit.' },
    faqs: [{ question: 'What are economies of scale?', answer: 'The cost advantages that enterprises obtain due to their scale of operation, reducing unit costs as output expands.' }],
    keywords: ['cost calculator', 'unit cost', 'production cost', 'economies of scale']
  }
];

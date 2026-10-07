// Business & Marketing Calculators (5 calculators)
const { toNum, formatNum } = require('./utils.cjs');

const engines = {
  'business-profit-calculator': function(inputs) {
    const revenue = toNum(inputs.revenue ?? inputs.total_revenue, 100000);
    const cogs = toNum(inputs.cogs ?? inputs.cost_of_goods, 40000);
    const opex = toNum(inputs.opex ?? inputs.operating_expenses, 30000);
    const taxRate = toNum(inputs.tax_rate ?? inputs.tax_percentage, 15);

    if (revenue <= 0) {
      return {
        primaryValue: '$0.00',
        primaryLabel: 'Net Profit',
        subtext: 'Revenue must be greater than zero',
        breakdown: [
          { label: 'Status', value: 'Please enter positive total revenue' }
        ],
        steps: ['Revenue must be greater than zero to compute profitability margins.']
      };
    }

    const grossProfit = revenue - cogs;
    const grossMargin = (grossProfit / revenue) * 100;
    const operatingProfit = grossProfit - opex;
    const operatingMargin = (operatingProfit / revenue) * 100;
    const taxAmount = Math.max(0, operatingProfit * (taxRate / 100));
    const netProfit = operatingProfit - taxAmount;
    const netMargin = (netProfit / revenue) * 100;

    return {
      primaryValue: '$' + formatNum(netProfit, 2),
      primaryLabel: 'Net Profit',
      subtext: `Net Margin: ${formatNum(netMargin, 2)}% | Gross Margin: ${formatNum(grossMargin, 2)}%`,
      breakdown: [
        { label: 'Gross Profit', value: '$' + formatNum(grossProfit, 2) },
        { label: 'Gross Margin', value: formatNum(grossMargin, 2) + '%' },
        { label: 'Operating Profit (EBIT)', value: '$' + formatNum(operatingProfit, 2) },
        { label: 'Operating Margin', value: formatNum(operatingMargin, 2) + '%' },
        { label: 'Estimated Tax (' + taxRate + '%)', value: '$' + formatNum(taxAmount, 2) },
        { label: 'Net Profit Margin', value: formatNum(netMargin, 2) + '%' }
      ],
      steps: [
        `Gross Profit = Revenue ($${formatNum(revenue)}) - COGS ($${formatNum(cogs)}) = $${formatNum(grossProfit, 2)}`,
        `Operating Profit = Gross Profit ($${formatNum(grossProfit, 2)}) - OpEx ($${formatNum(opex)}) = $${formatNum(operatingProfit, 2)}`,
        `Tax Deductions (${taxRate}%) = $${formatNum(taxAmount, 2)}`,
        `Net Profit = Operating Profit - Tax = $${formatNum(netProfit, 2)} (${formatNum(netMargin, 2)}% margin)`
      ]
    };
  },

  'roas-calculator': function(inputs) {
    const revenue = toNum(inputs.revenue ?? inputs.ad_revenue ?? inputs.revenue_generated, 15000);
    const adSpend = toNum(inputs.ad_spend ?? inputs.cost ?? inputs.advertising_cost, 3000);

    if (adSpend <= 0) {
      return {
        primaryValue: 'N/A',
        primaryLabel: 'ROAS',
        subtext: 'Ad spend must be greater than zero',
        breakdown: [
          { label: 'Error', value: 'Ad spend must be greater than 0' }
        ],
        steps: ['ROAS requires a non-zero advertising spend value.']
      };
    }

    const roasRatio = revenue / adSpend;
    const roasPercentage = roasRatio * 100;
    const profit = revenue - adSpend;
    const roiPercentage = ((revenue - adSpend) / adSpend) * 100;

    return {
      primaryValue: formatNum(roasRatio, 2) + 'x',
      primaryLabel: 'Return on Ad Spend (ROAS)',
      subtext: `Earned $${formatNum(roasRatio, 2)} per $1 spent (${formatNum(roasPercentage, 1)}%)`,
      breakdown: [
        { label: 'ROAS Percentage', value: formatNum(roasPercentage, 1) + '%' },
        { label: 'Net Ad Profit', value: '$' + formatNum(profit, 2) },
        { label: 'Ad Campaign ROI', value: formatNum(roiPercentage, 1) + '%' },
        { label: 'Revenue Generated', value: '$' + formatNum(revenue, 2) },
        { label: 'Total Ad Spend', value: '$' + formatNum(adSpend, 2) }
      ],
      steps: [
        `ROAS = Revenue ($${formatNum(revenue)}) / Ad Spend ($${formatNum(adSpend)}) = ${formatNum(roasRatio, 2)}x`,
        `Percentage = ${formatNum(roasRatio, 2)} × 100 = ${formatNum(roasPercentage, 1)}%`,
        `Net Return = $${formatNum(revenue)} - $${formatNum(adSpend)} = $${formatNum(profit, 2)}`,
        `For every $1 spent on advertising, you earned $${formatNum(roasRatio, 2)} in revenue.`
      ]
    };
  },

  'employee-cost-calculator': function(inputs) {
    const salary = toNum(inputs.salary ?? inputs.base_salary, 75000);
    const benefits = toNum(inputs.benefits ?? inputs.health_benefits, 12000);
    const payrollTaxes = toNum(inputs.taxes ?? inputs.payroll_taxes, 6500);
    const equipment = toNum(inputs.equipment ?? inputs.supplies ?? inputs.tech_stipend, 4000);
    const overhead = toNum(inputs.overhead ?? inputs.office_space, 5000);

    const totalAnnual = salary + benefits + payrollTaxes + equipment + overhead;
    const monthlyCost = totalAnnual / 12;
    const hourlyCost = totalAnnual / 2080; // Standard 40 hrs/wk * 52 wks
    const multiplier = salary > 0 ? totalAnnual / salary : 1;

    return {
      primaryValue: '$' + formatNum(totalAnnual, 2),
      primaryLabel: 'Total True Cost of Employee',
      subtext: `$${formatNum(monthlyCost, 2)}/month | Multiplier: ${formatNum(multiplier, 2)}x base`,
      breakdown: [
        { label: 'Monthly Employee Cost', value: '$' + formatNum(monthlyCost, 2) },
        { label: 'True Hourly Burden Rate', value: '$' + formatNum(hourlyCost, 2) + '/hr' },
        { label: 'Cost Multiplier', value: formatNum(multiplier, 2) + 'x base salary' },
        { label: 'Additional Cost Above Salary', value: '$' + formatNum(totalAnnual - salary, 2) }
      ],
      steps: [
        `Total Annual = Base ($${formatNum(salary)}) + Benefits ($${formatNum(benefits)}) + Payroll Taxes ($${formatNum(payrollTaxes)}) + Equipment ($${formatNum(equipment)}) + Overhead ($${formatNum(overhead)})`,
        `Total Annual Burden = $${formatNum(totalAnnual, 2)}`,
        `Effective Hourly Cost (2,080 working hrs) = $${formatNum(hourlyCost, 2)}/hr`,
        `Employee costs ${formatNum(multiplier, 2)} times their nominal base salary.`
      ]
    };
  },

  'business-revenue-calculator': function(inputs) {
    const customers = toNum(inputs.customers ?? inputs.num_customers, 500);
    const aov = toNum(inputs.aov ?? inputs.avg_order_value ?? inputs.average_order, 85);
    const frequency = toNum(inputs.frequency ?? inputs.orders_per_year ?? inputs.purchase_frequency, 4);

    const annualRevenue = customers * aov * frequency;
    const monthlyRevenue = annualRevenue / 12;
    const arpu = aov * frequency; // Annual revenue per customer

    return {
      primaryValue: '$' + formatNum(annualRevenue, 2),
      primaryLabel: 'Estimated Annual Revenue',
      subtext: `$${formatNum(monthlyRevenue, 2)}/mo | ARPU: $${formatNum(arpu, 2)}/customer`,
      breakdown: [
        { label: 'Monthly Projected Revenue', value: '$' + formatNum(monthlyRevenue, 2) },
        { label: 'Annual Revenue Per User (ARPU)', value: '$' + formatNum(arpu, 2) },
        { label: 'Total Orders Per Year', value: formatNum(customers * frequency, 0) },
        { label: 'Average Value Per Order', value: '$' + formatNum(aov, 2) }
      ],
      steps: [
        `Annual Revenue = Customers (${formatNum(customers)}) × Average Order Value ($${formatNum(aov)}) × Orders/Year (${frequency})`,
        `Total Orders = ${customers} × ${frequency} = ${formatNum(customers * frequency, 0)} orders/year`,
        `Total Annual Revenue = $${formatNum(annualRevenue, 2)}`,
        `Monthly Revenue = $${formatNum(annualRevenue, 2)} / 12 = $${formatNum(monthlyRevenue, 2)}/mo`
      ]
    };
  },

  'cost-calculator': function(inputs) {
    const fixedCosts = toNum(inputs.fixed_costs ?? inputs.fixed, 20000);
    const variableCostPerUnit = toNum(inputs.variable_cost ?? inputs.variable_unit, 15);
    const units = toNum(inputs.units ?? inputs.quantity ?? inputs.units_produced, 2000);

    const totalVariableCost = variableCostPerUnit * units;
    const totalCost = fixedCosts + totalVariableCost;
    const avgCostPerUnit = units > 0 ? totalCost / units : totalCost;

    return {
      primaryValue: '$' + formatNum(totalCost, 2),
      primaryLabel: 'Total Production Cost',
      subtext: `Avg Cost: $${formatNum(avgCostPerUnit, 2)}/unit | Total Units: ${formatNum(units, 0)}`,
      breakdown: [
        { label: 'Total Variable Cost', value: '$' + formatNum(totalVariableCost, 2) },
        { label: 'Fixed Costs', value: '$' + formatNum(fixedCosts, 2) },
        { label: 'Average Cost Per Unit', value: '$' + formatNum(avgCostPerUnit, 2) },
        { label: 'Total Units Produced', value: formatNum(units, 0) }
      ],
      steps: [
        `Variable Cost = ${formatNum(units)} units × $${formatNum(variableCostPerUnit)}/unit = $${formatNum(totalVariableCost, 2)}`,
        `Total Cost = Fixed ($${formatNum(fixedCosts)}) + Variable ($${formatNum(totalVariableCost, 2)}) = $${formatNum(totalCost, 2)}`,
        `Cost Per Unit = $${formatNum(totalCost, 2)} / ${formatNum(units)} units = $${formatNum(avgCostPerUnit, 2)}/unit`
      ]
    };
  }
};

module.exports = engines;

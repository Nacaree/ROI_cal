function clampPercent(value) {
  if (!Number.isFinite(value)) return 0
  return Math.min(Math.max(value, 0), 100)
}

// Converts formatted input strings like "50,000" into numbers for the formulas.
export function normalizeInputs(values) {
  return Object.fromEntries(
    Object.entries(values).map(([key, value]) => {
      const number = Number(String(value).replaceAll(',', ''))
      return [key, Number.isFinite(number) ? number : 0]
    }),
  )
}

// Main calculator engine. UI components should read from this result object
// instead of duplicating formulas in the view layer.
export function calculateDeal(values) {
  const inputs = normalizeInputs(values)

  // Normalize user inputs that can break formulas if they are outside bounds.
  const unitCount = Math.max(Math.round(inputs.unitCount), 1)
  const vacancyRate = clampPercent(inputs.vacancyRate) / 100
  const rentalTaxRate = clampPercent(inputs.rentalTaxRate) / 100

  // Income after vacancy is the expected collected rent before rental tax.
  const grossMonthlyRent = inputs.monthlyRent * unitCount
  const effectiveMonthlyIncome = grossMonthlyRent * (1 - vacancyRate)
  const vacancyLoss = grossMonthlyRent - effectiveMonthlyIncome
  const monthlyRentalTax = effectiveMonthlyIncome * rentalTaxRate

  // Current app has no loan payment, so cash flow equals NOI.
  const monthlyMaintenance = Math.max(inputs.monthlyMaintenance, 0)
  const monthlyUtilities = Math.max(inputs.monthlyUtilities, 0)
  const baseMonthlyExpenses = monthlyMaintenance + monthlyUtilities
  const monthlyOperatingExpenses = monthlyRentalTax + baseMonthlyExpenses
  const monthlyNoi = effectiveMonthlyIncome - monthlyOperatingExpenses
  const annualNoi = monthlyNoi * 12
  const monthlyCashFlow = monthlyNoi
  const annualCashFlow = monthlyCashFlow * 12
  const legacyCashInvested =
    (inputs.downPayment || 0) + (inputs.closingCosts || 0) + (inputs.repairBudget || 0)
  const cashInvested = inputs.initialInvestment > 0 ? inputs.initialInvestment : legacyCashInvested
  const cashOnCash = cashInvested > 0 ? annualCashFlow / cashInvested : Number.NaN
  const paybackYears =
    cashInvested > 0 && annualCashFlow > 0 ? cashInvested / annualCashFlow : Number.NaN

  // Required revenue can be based on a fixed monthly profit or an ROI target.
  const requiredRevenueMode = values.requiredRevenueMode === 'profit' ? 'profit' : 'roi'
  const targetCashOnCashReturn = clampPercent(inputs.targetCashOnCashReturn) / 100
  const roiTargetMonthlyProfit = (cashInvested * targetCashOnCashReturn) / 12
  const targetMonthlyProfit =
    requiredRevenueMode === 'profit'
      ? Math.max(inputs.targetMonthlyProfit, 0)
      : roiTargetMonthlyProfit

  // Convert the net revenue target into gross rent needed before vacancy and tax.
  const revenueRetentionRate = (1 - vacancyRate) * (1 - rentalTaxRate)
  const breakEvenNetRevenue = baseMonthlyExpenses
  const netRequiredRevenue = baseMonthlyExpenses + targetMonthlyProfit
  const breakEvenGrossRevenue =
    revenueRetentionRate > 0
      ? breakEvenNetRevenue / revenueRetentionRate
      : Number.NaN
  const grossRequiredRevenue =
    revenueRetentionRate > 0
      ? netRequiredRevenue / revenueRetentionRate
      : Number.NaN
  const breakEvenRent = breakEvenGrossRevenue / unitCount
  const requiredMonthlyRent = grossRequiredRevenue / unitCount

  return {
    unitCount,
    grossMonthlyRent,
    vacancyRate,
    vacancyLoss,
    effectiveMonthlyIncome,
    monthlyRentalTax,
    monthlyMaintenance,
    monthlyUtilities,
    monthlyOperatingExpenses,
    monthlyNoi,
    annualNoi,
    monthlyCashFlow,
    annualCashFlow,
    cashInvested,
    cashOnCash,
    paybackYears,
    requiredRevenueMode,
    targetCashOnCashReturn,
    roiTargetMonthlyProfit,
    targetMonthlyProfit,
    breakEvenRevenue: breakEvenNetRevenue,
    requiredRevenue: netRequiredRevenue,
    breakEvenNetRevenue,
    netRequiredRevenue,
    breakEvenGrossRevenue,
    grossRequiredRevenue,
    breakEvenRent,
    breakEvenMonthlyRevenue: breakEvenGrossRevenue,
    requiredMonthlyRent,
    requiredMonthlyRevenue: grossRequiredRevenue,
  }
}

// Shape the current monthly results for the waterfall chart.
export function buildMonthlyData(values, results) {
  return [
    { name: 'Gross rent', value: results.grossMonthlyRent, type: 'income' },
    { name: 'Vacancy loss', value: -results.vacancyLoss, type: 'loss' },
    { name: 'Rental tax', value: -results.monthlyRentalTax, type: 'loss' },
    { name: 'Maintenance', value: -results.monthlyMaintenance, type: 'expense' },
    { name: 'Utilities', value: -results.monthlyUtilities, type: 'expense' },
    {
      name: 'Cash flow',
      value: results.monthlyCashFlow,
      type: results.monthlyCashFlow >= 0 ? 'positive' : 'negative',
      isTotal: true,
    },
  ]
}

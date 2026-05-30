import { CircleDollarSign, Clock3, Percent, WalletCards } from 'lucide-react'
import MetricCard from './MetricCard.jsx'
import { toCurrency, toPercent } from '../utils/formatters.js'

function toYears(value) {
  if (!Number.isFinite(value)) return 'N/A'
  return `${value.toFixed(2)} years`
}

function MetricsGrid({ results }) {
  const requiredRentDetail =
    results.requiredRevenueMode === 'profit'
      ? `${toCurrency(results.targetMonthlyProfit)} target profit`
      : `${toPercent(results.targetCashOnCashReturn)} target ROI`

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        icon={CircleDollarSign}
        label="Monthly cash flow"
        value={toCurrency(results.monthlyCashFlow)}
        detail={`${toCurrency(results.annualCashFlow)} per year`}
        tone={results.monthlyCashFlow >= 0 ? 'green' : 'amber'}
      />
      <MetricCard
        icon={Percent}
        label="Cash-on-cash return"
        value={toPercent(results.cashOnCash)}
        detail={`${toCurrency(results.cashInvested)} cash invested`}
        tone="blue"
      />
      <MetricCard
        icon={Clock3}
        label="Payback period"
        value={toYears(results.paybackYears)}
        detail="Time to recover initial investment"
        tone="neutral"
      />
      <MetricCard
        icon={WalletCards}
        label="Gross required revenue"
        value={toCurrency(results.grossRequiredRevenue)}
        details={[
          `${toCurrency(results.requiredMonthlyRent)} minimum rent/unit`,
          requiredRentDetail,
        ]}
        tone="amber"
      />
    </section>
  )
}

export default MetricsGrid

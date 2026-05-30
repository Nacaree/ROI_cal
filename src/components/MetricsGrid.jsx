import { CircleDollarSign, Clock3, Landmark, Percent, TrendingUp, WalletCards } from 'lucide-react'
import MetricCard from './MetricCard.jsx'
import { toCurrency, toPercent } from '../utils/formatters.js'

function toYears(value) {
  if (!Number.isFinite(value)) return 'N/A'
  return `${value.toFixed(2)} years`
}

function MetricsGrid({ results }) {
  const requiredRentDetail =
    results.requiredRevenueMode === 'profit'
      ? `Target: ${toCurrency(results.targetMonthlyProfit)}`
      : `Target: ${toPercent(results.targetCashOnCashReturn)} ROI`
  const isRevenueGapPositive = results.revenueGap >= 0

  return (
    <section className="rounded-2xl border border-white/80 bg-white/35 p-3 shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5 backdrop-blur-2xl sm:p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        icon={CircleDollarSign}
        label="Monthly cash flow"
        value={toCurrency(results.monthlyCashFlow)}
        detail={`${toCurrency(results.annualCashFlow)} per year`}
        tone={results.monthlyCashFlow >= 0 ? 'green' : 'rose'}
      />
      <MetricCard
        icon={Percent}
        label="ROI"
        value={toPercent(results.cashOnCash)}
        detail={`${toCurrency(results.cashInvested)} cash invested`}
        tone="indigo"
      />
      <MetricCard
        icon={Clock3}
        label="Payback period"
        value={toYears(results.paybackYears)}
        detail="Time to recover initial investment"
        tone="violet"
      />
      <MetricCard
        icon={Landmark}
        label="Break-even rent"
        value={toCurrency(results.breakEvenRent)}
        detail="Rent needed to avoid loss"
        tone="teal"
      />
      <MetricCard
        icon={TrendingUp}
        label="Revenue gap"
        value={toCurrency(Math.abs(results.revenueGap))}
        detail={isRevenueGapPositive ? 'Above target profit' : 'Below target profit'}
        tone={isRevenueGapPositive ? 'green' : 'rose'}
      />
      <MetricCard
        icon={WalletCards}
        label="Minimum rent per unit"
        value={toCurrency(results.requiredMonthlyRent)}
        details={[
          `Gross required: ${toCurrency(results.grossRequiredRevenue)}`,
          requiredRentDetail,
        ]}
        tone="amber"
      />
      </div>
    </section>
  )
}

export default MetricsGrid

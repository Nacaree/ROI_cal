import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Gauge, ListTree, WalletCards } from 'lucide-react'
import { toCurrency } from '../utils/formatters.js'

const tabs = [
  {
    value: 'summary',
    label: 'Cash Flow Summary',
    shortLabel: 'Summary',
    icon: WalletCards,
    description: 'Shows your net monthly cash flow first, then the main income and expense totals behind it.',
  },
  {
    value: 'table',
    label: 'Profit & Loss',
    shortLabel: 'P&L',
    icon: ListTree,
    description: 'Shows income, losses, and expenses as line items so you can audit the monthly math.',
  },
  {
    value: 'gauge',
    label: 'Target Variance',
    shortLabel: 'Variance',
    icon: Gauge,
    description: 'Compares current monthly cash flow against your target profit and shows the gap.',
  },
]

// Show negatives in accounting style while leaving positive values plain.
function signedCurrency(value) {
  if (value < 0) return `-${toCurrency(Math.abs(value))}`
  return toCurrency(value)
}

// Text for whether current cash flow is beating or missing the chosen target.
function comparisonText(difference) {
  if (difference > 0) return `${toCurrency(difference)} above target`
  if (difference < 0) return `${toCurrency(Math.abs(difference))} below target`
  return 'On target'
}

// Overview tab: puts net cash flow first, then summarizes the math behind it.
function CashFlowFirst({ results, targetDifference }) {
  const summaryRows = [
    ['Gross rent', results.grossMonthlyRent],
    ['Net rent after vacancy', results.effectiveMonthlyIncome],
    ['Operating expenses', -results.monthlyOperatingExpenses],
    ['Net monthly cash flow', results.monthlyCashFlow],
  ]

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="rounded-2xl border border-white/70 bg-white/35 p-4 ring-1 ring-slate-900/5 backdrop-blur-xl sm:p-5">
        <div className="text-sm font-semibold text-slate-500">Net monthly cash flow</div>
        <div className="mt-3 text-3xl font-bold leading-none text-purple-700 sm:text-4xl">
          {toCurrency(results.monthlyCashFlow)}
        </div>
        <div className="mt-3 text-sm font-semibold text-slate-600">
          {comparisonText(targetDifference)}
        </div>
      </div>

      <div className="grid gap-2">
        {summaryRows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/60 bg-white/30 px-3 py-2.5 sm:px-4 sm:py-3"
          >
            <span className="text-sm font-semibold text-slate-600">{label}</span>
            <span
              className={`text-sm font-bold ${
                value < 0 ? 'text-rose-700' : label === 'Net monthly cash flow' ? 'text-purple-700' : 'text-slate-900'
              }`}
            >
              {signedCurrency(value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Accounting-style statement tab for auditing monthly income and expenses.
function ProfitLossTable({ results }) {
  const sections = [
    {
      title: 'Income',
      accent: 'bg-emerald-500',
      highlight: 'bg-emerald-50/45',
      rows: [
        { label: 'Gross rent', value: results.grossMonthlyRent, tone: 'positive' },
        { label: 'Vacancy loss', value: -results.vacancyLoss, tone: 'negative' },
      ],
      subtotal: { label: 'Net rent', value: results.effectiveMonthlyIncome },
    },
    {
      title: 'Operating expenses',
      accent: 'bg-amber-500',
      highlight: 'bg-amber-50/45',
      rows: [
        { label: 'Rental tax', value: -results.monthlyRentalTax, tone: 'negative' },
        { label: 'Maintenance', value: -results.monthlyMaintenance, tone: 'negative' },
        { label: 'Utilities', value: -results.monthlyUtilities, tone: 'negative' },
      ],
      subtotal: { label: 'Total operating expenses', value: -results.monthlyOperatingExpenses },
    },
  ]

  return (
    <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/30 ring-1 ring-slate-900/5 backdrop-blur-xl">
      <div className="grid">
        {sections.map((section) => (
          <div
            key={section.title}
            className={`border-b border-white/55 last:border-b-0 ${
              section.title === 'Operating expenses' ? 'border-t border-t-slate-300/50' : ''
            }`}
          >
            <div className={`flex items-center gap-2 px-4 py-3 ${section.highlight}`}>
              <span className={`h-2.5 w-2.5 rounded-full ${section.accent}`} />
              <span className="text-xs font-bold uppercase text-slate-500">
                {section.title}
              </span>
            </div>
            <div>
              {section.rows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-3 border-t border-white/35 px-4 py-3 sm:gap-4 sm:px-5"
                >
                  <span className="pl-1 text-sm font-semibold text-slate-600 sm:pl-3">
                    {row.label}
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      row.tone === 'negative' ? 'text-rose-700' : 'text-slate-900'
                    }`}
                  >
                    {signedCurrency(row.value)}
                  </span>
                </div>
              ))}
              {section.subtotal && (
                <div className="flex items-center justify-between gap-3 border-t border-slate-300/50 bg-white/25 px-4 py-3 sm:gap-4 sm:px-5">
                  <span className="text-sm font-bold text-slate-700">
                    {section.subtotal.label}
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      section.subtotal.value < 0 ? 'text-rose-700' : 'text-slate-950'
                    }`}
                  >
                    {signedCurrency(section.subtotal.value)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-purple-200/70 bg-purple-100/35 p-3.5 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase text-purple-600">
              Net cash flow
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-600">
              Monthly profit after deductions and operating expenses
            </div>
          </div>
          <div className="text-xl font-bold text-purple-700 sm:text-2xl">
            {toCurrency(results.monthlyCashFlow)}
          </div>
        </div>
      </div>
    </div>
  )
}

// Target tab: compares actual monthly cash flow against the selected target.
function TargetGauge({ results, targetDifference }) {
  const target = Math.max(results.targetMonthlyProfit, 0)
  const current = results.monthlyCashFlow
  const progress = target > 0 ? Math.min(Math.max((current / target) * 100, 0), 100) : 100
  const isOnTarget = current >= target

  return (
    <div className="rounded-2xl border border-white/70 bg-white/35 p-4 ring-1 ring-slate-900/5 backdrop-blur-xl sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-500">Target progress</div>
          <div className="mt-2 text-2xl font-bold text-purple-700 sm:text-3xl">
            {toCurrency(current)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-slate-500">Target</div>
          <div className="mt-2 text-xl font-bold text-slate-900">{toCurrency(target)}</div>
        </div>
      </div>

      <div className="mt-5 h-4 overflow-hidden rounded-full border border-white/70 bg-white/45 shadow-inner shadow-slate-900/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-purple-200/95 via-purple-400/85 to-purple-700/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        className={`mt-4 text-sm font-bold ${
          isOnTarget ? 'text-emerald-700' : 'text-rose-700'
        }`}
      >
        {comparisonText(targetDifference)}
      </div>
    </div>
  )
}

function CashFlowInsights({ results }) {
  const [activeTab, setActiveTab] = useState('summary')
  const [contentHeight, setContentHeight] = useState(null)
  const contentRef = useRef(null)
  const targetDifference = results.monthlyCashFlow - results.targetMonthlyProfit
  const activeTabInfo = tabs.find((tab) => tab.value === activeTab) ?? tabs[0]

  // Mobile stays in normal flow; desktop gets measured height for the smooth P&L expansion.
  const activeView = useMemo(() => {
    if (activeTab === 'table') return <ProfitLossTable results={results} />
    if (activeTab === 'gauge') {
      return <TargetGauge results={results} targetDifference={targetDifference} />
    }
    return <CashFlowFirst results={results} targetDifference={targetDifference} />
  }, [activeTab, results, targetDifference])
  const desktopHeightStyle =
    contentHeight === null ? undefined : { '--cash-flow-content-height': `${contentHeight}px` }

  useLayoutEffect(() => {
    const element = contentRef.current
    if (!element || typeof ResizeObserver === 'undefined') return undefined

    function syncHeight() {
      setContentHeight(element.scrollHeight)
    }

    syncHeight()

    const observer = new ResizeObserver(syncHeight)
    observer.observe(element)

    return () => observer.disconnect()
  }, [activeTab, activeView])

  return (
    <section
      className="rounded-2xl border border-white/80 bg-white/35 p-3.5 shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5 backdrop-blur-2xl animate-[panelFadeIn_260ms_ease-out] sm:p-5"
    >
      <div className="mb-5 grid gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Cash Flow Views</h2>
          <p className="max-w-2xl text-sm text-slate-500">{activeTabInfo.description}</p>
        </div>
        <div className="grid w-full grid-cols-3 rounded-full border border-white/70 bg-white/30 p-1 shadow-inner shadow-slate-900/5 ring-1 ring-white/50 backdrop-blur-2xl">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isSelected = activeTab === tab.value

            return (
              <button
                key={tab.value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setActiveTab(tab.value)}
                className={`flex h-9 items-center justify-center gap-1 rounded-full px-2 text-xs transition sm:gap-1.5 sm:px-3 sm:text-sm ${
                  isSelected
                    ? 'bg-white/70 text-purple-800 shadow-sm shadow-purple-900/5 ring-1 ring-white/80'
                    : 'text-slate-500 hover:bg-white/35 hover:text-slate-800'
                }`}
              >
                <Icon size={14} aria-hidden="true" />
                <span className={isSelected ? 'font-bold' : 'font-semibold'}>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div
        className="overflow-visible sm:h-[var(--cash-flow-content-height)] sm:overflow-hidden sm:transition-[height] sm:duration-300 sm:ease-out"
        style={desktopHeightStyle}
      >
        <div ref={contentRef} key={activeTab} className="animate-[fadeSlideIn_240ms_ease-out]">
          {activeView}
        </div>
      </div>
    </section>
  )
}

export default CashFlowInsights

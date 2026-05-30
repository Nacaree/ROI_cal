import { ArrowDownRight, ArrowRight, BarChart3 } from 'lucide-react'
import { toPreciseCurrency } from '../utils/formatters.js'

const toneClass = {
  income: {
    dot: 'bg-emerald-500',
    bar: 'from-emerald-200/95 via-emerald-400/85 to-emerald-700/75',
    text: 'text-emerald-700',
  },
  loss: {
    dot: 'bg-rose-500',
    bar: 'from-rose-200/95 via-rose-400/85 to-rose-600/75',
    text: 'text-rose-700',
  },
  expense: {
    dot: 'bg-amber-500',
    bar: 'from-amber-200/95 via-amber-400/85 to-amber-600/75',
    text: 'text-amber-700',
  },
  positive: {
    dot: 'bg-purple-500',
    bar: 'from-purple-200/95 via-purple-400/85 to-purple-700/75',
    text: 'text-purple-700',
  },
  negative: {
    dot: 'bg-purple-500',
    bar: 'from-purple-200/95 via-purple-400/85 to-purple-700/75',
    text: 'text-purple-700',
  },
}

function signedCurrency(value) {
  if (value < 0) return `-${toPreciseCurrency(Math.abs(value))}`
  return toPreciseCurrency(value)
}

function MonthlySnapshotChart({ data }) {
  const maxValue = Math.max(...data.map((item) => Math.abs(item.value)), 1)

  return (
    <section className="rounded-2xl border border-white/80 bg-white/35 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5 backdrop-blur-2xl sm:p-5">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Monthly Snapshot</h2>
          <p className="text-sm text-slate-500">Gross rent to cash flow</p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/70 bg-white/55 text-slate-700 shadow-sm backdrop-blur-md">
          <BarChart3 size={19} aria-hidden="true" />
        </span>
      </div>

      <div className="grid gap-3">
        {data.map((item, index) => {
          const tone = toneClass[item.type]
          const width = `${Math.max((Math.abs(item.value) / maxValue) * 100, 3)}%`
          const FlowIcon = item.value < 0 ? ArrowDownRight : ArrowRight

          return (
            <div
              key={item.name}
              className={`rounded-xl border border-white/70 bg-white/35 p-3 ring-1 ring-slate-900/5 backdrop-blur-xl ${
                item.isTotal ? 'mt-1 bg-white/50' : ''
              }`}
            >
              <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${tone.dot}`} />
                  <span className="truncate text-sm font-semibold text-slate-700">
                    {item.name}
                  </span>
                </div>
                <div className={`shrink-0 text-sm font-bold ${tone.text}`}>
                  {signedCurrency(item.value)}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative h-4 flex-1 overflow-hidden rounded-full border border-white/70 bg-white/45 shadow-inner shadow-slate-900/5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${tone.bar} shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]`}
                    style={{ width }}
                  />
                </div>
                {index < data.length - 1 && (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/45 text-slate-500 backdrop-blur-md">
                    <FlowIcon size={15} aria-hidden="true" />
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default MonthlySnapshotChart

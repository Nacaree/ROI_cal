import { toCurrency } from '../utils/formatters.js'

const detailStats = [
  { key: 'grossMonthlyRent', label: 'Gross monthly rent' },
  {
    key: 'effectiveMonthlyIncome',
    label: 'Effective gross income',
    description: 'Actual rent collected after vacancy',
  },
  { key: 'monthlyOperatingExpenses', label: 'Operating expenses' },
  {
    key: 'monthlyNoi',
    label: 'Net monthly income',
    description: 'Profit after all expenses',
  },
  { 
    key: 'targetMonthlyProfit', 
    label: 'Target monthly profit',
    description: 'Your desired profit goal'
  },
]

function DetailStats({ results }) {
  const isMeetingTarget = results.monthlyNoi >= results.targetMonthlyProfit;

  return (
    <section className="rounded-2xl border border-white/80 bg-white/35 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5 backdrop-blur-2xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-950">Monthly Profit & Loss</h2>
        <p className="text-sm text-slate-500">How your actual performance stacks up against your goal</p>
      </div>

      <div className="grid gap-1">
        {detailStats.map((stat) => {
          const isActualProfit = stat.key === 'monthlyNoi';
          const isTarget = stat.key === 'targetMonthlyProfit';
          const isExpenses = stat.key === 'monthlyOperatingExpenses';

          return (
            <div
              key={stat.key}
              className={`flex items-center justify-between rounded-xl px-4 py-3 transition ${
                isActualProfit 
                  ? (isMeetingTarget ? 'bg-emerald-500/10' : 'bg-rose-500/10') 
                  : isExpenses
                  ? 'bg-rose-500/5'
                  : 'hover:bg-white/40'
              } ${isTarget ? 'mt-4 border-t border-slate-200/60 pt-6' : ''}`}
            >
              <div>
                <div className={`text-sm font-semibold ${isActualProfit ? 'text-slate-950' : 'text-slate-600'}`}>
                  {stat.label}
                </div>
                {stat.description && (
                  <div className="text-xs text-slate-400">{stat.description}</div>
                )}
              </div>
              <div className={`text-base font-bold ${
                isActualProfit 
                  ? (isMeetingTarget ? 'text-emerald-700' : 'text-rose-700') 
                  : isExpenses
                  ? 'text-rose-700'
                  : 'text-slate-900'
              }`}>
                {toCurrency(results[stat.key])}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  )
}

export default DetailStats

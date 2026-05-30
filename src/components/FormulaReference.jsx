import { Calculator } from 'lucide-react'
import { calculationFormulas } from '../config/formulas.js'

function FormulaReference({ requiredRevenueMode }) {
  const formulas = calculationFormulas.map((item) => {
    if (item.label !== 'Target monthly profit') return item

    return {
      ...item,
      formula:
        requiredRevenueMode === 'profit'
          ? 'Manual target monthly profit input'
          : 'Initial investment x Target ROI / 12',
    }
  })

  return (
    <section className="rounded-2xl border border-white/80 bg-white/35 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5 backdrop-blur-2xl sm:p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Formula Reference</h2>
          <p className="text-sm text-slate-500">Calculated outputs and the formulas behind them</p>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/70 bg-blue-50/80 text-blue-700 shadow-sm backdrop-blur-md">
          <Calculator size={19} aria-hidden="true" />
        </span>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase text-slate-500">
          Calculation Formulas
        </h3>
        <div className="grid gap-2 md:grid-cols-2">
          {formulas.map((item) => (
            <div key={item.label} className="rounded-xl border border-white/80 bg-white/45 p-3 ring-1 ring-slate-900/5 backdrop-blur-md">
              <div className="text-sm font-semibold text-slate-950">{item.label}</div>
              <code className="mt-2 block whitespace-normal rounded-lg border border-white/70 bg-white/65 px-2 py-1.5 text-sm text-slate-700">
                {item.formula}
              </code>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FormulaReference

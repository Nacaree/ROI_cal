import { useMemo, useState } from 'react'
import { Calculator, ChevronDown } from 'lucide-react'
import { calculationFormulas } from '../config/formulas.js'

// Mobile starts collapsed to reduce scroll; unsupported browsers fall back open.
function shouldShowFormulasByDefault() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return true
  }

  return window.matchMedia('(min-width: 640px)').matches
}

function FormulaReference({ requiredRevenueMode }) {
  const [isOpen, setIsOpen] = useState(shouldShowFormulasByDefault)
  // The target profit formula depends on whether the user selected profit or ROI mode.
  const formulas = useMemo(() => calculationFormulas.map((item) => {
    if (item.label !== 'Target monthly profit') return item

    return {
      ...item,
      formula:
        requiredRevenueMode === 'profit'
          ? 'Manual target monthly profit input'
          : 'Initial investment x Target ROI / 12',
    }
  }), [requiredRevenueMode])

  return (
    <section className="rounded-2xl border border-white/80 bg-white/35 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5 backdrop-blur-2xl sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Formula Reference</h2>
          <p className="text-sm text-slate-500">Calculated outputs and the formulas behind them</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden h-9 w-9 items-center justify-center rounded-xl border border-white/70 bg-blue-50/80 text-blue-700 shadow-sm backdrop-blur-md sm:flex">
            <Calculator size={19} aria-hidden="true" />
          </span>
          <button
            type="button"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((current) => !current)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/70 bg-white/50 text-slate-600 shadow-sm ring-1 ring-slate-900/5 backdrop-blur-md transition hover:bg-white/70 hover:text-slate-900 sm:hidden"
          >
            <ChevronDown
              size={18}
              aria-hidden="true"
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      <div className={isOpen ? 'block sm:block' : 'hidden sm:block'}>
        <div className="pt-5 animate-[fadeSlideIn_180ms_ease-out]">
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
      </div>
    </section>
  )
}

export default FormulaReference

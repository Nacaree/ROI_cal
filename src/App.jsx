import { useMemo, useState } from 'react'
import AppHeader from './components/AppHeader.jsx'
import CashFlowInsights from './components/CashFlowInsights.jsx'
import FormulaReference from './components/FormulaReference.jsx'
import InputPanel from './components/InputPanel.jsx'
import MetricsGrid from './components/MetricsGrid.jsx'
import MonthlySnapshotChart from './components/MonthlySnapshotChart.jsx'
import { defaultInputs, inputSections } from './config/calculatorFields.js'
import {
  buildMonthlyData,
  calculateDeal,
} from './utils/calculations.js'

const STORAGE_KEY = 'rental-roi-calculator:v1'

// Load the last calculator state from this browser, then merge it with
// defaults so newly added fields still get a valid starting value.
function loadSavedInputs() {
  try {
    const savedInputs = window.localStorage.getItem(STORAGE_KEY)
    if (!savedInputs) return defaultInputs

    const parsedInputs = JSON.parse(savedInputs)
    if (!parsedInputs || typeof parsedInputs !== 'object' || Array.isArray(parsedInputs)) {
      return defaultInputs
    }

    return {
      ...defaultInputs,
      ...parsedInputs,
    }
  } catch {
    return defaultInputs
  }
}

function App() {
  const [values, setValues] = useState(loadSavedInputs)
  const [lastSavedAt, setLastSavedAt] = useState(null)
  const [hasSaveFailed, setHasSaveFailed] = useState(false)

  // Recalculate results only when the user changes an input.
  const results = useMemo(() => calculateDeal(values), [values])
  const monthlyData = useMemo(() => buildMonthlyData(values, results), [values, results])

  const dealStatus = useMemo(() => {
    const isPositive = results.monthlyCashFlow > 0
    return {
      label: isPositive ? 'Good' : 'Risky',
      className: isPositive
        ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
        : 'bg-amber-50 border-amber-100 text-amber-700',
    }
  }, [results.monthlyCashFlow])

  function updateValue(key, value) {
    const nextValues = {
      ...values,
      [key]: value,
    }

    setValues(nextValues)

    // Auto-save after every input change so refreshes do not wipe user data.
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextValues))
      setLastSavedAt(Date.now())
      setHasSaveFailed(false)
    } catch {
      setHasSaveFailed(true)
    }
  }

  function handleReset() {
    if (window.confirm('Are you sure you want to reset all inputs to defaults?')) {
      setValues(defaultInputs)
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.72),transparent_28rem),radial-gradient(circle_at_85%_10%,rgba(125,211,252,0.22),transparent_24rem)]" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        {/* Header shows the app title and browser auto-save status. */}
        <AppHeader
          hasSaveFailed={hasSaveFailed}
          lastSavedAt={lastSavedAt}
          dealStatus={dealStatus}
          onReset={handleReset}
        />
        <MetricsGrid results={results} />

        {/* Left side is editable inputs; right side is calculated outputs. */}
        <div className="grid items-start gap-5 lg:grid-cols-[360px_1fr]">
          <InputPanel sections={inputSections} values={values} onChange={updateValue} />

          <div className="grid gap-5">
            <MonthlySnapshotChart data={monthlyData} />
            <CashFlowInsights results={results} />
            <FormulaReference requiredRevenueMode={results.requiredRevenueMode} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default App

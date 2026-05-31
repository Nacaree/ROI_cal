import { useMemo, useState } from 'react'
import AppHeader from './components/AppHeader.jsx'
import CashFlowInsights from './components/CashFlowInsights.jsx'
import FormulaReference from './components/FormulaReference.jsx'
import InputPanel from './components/InputPanel.jsx'
import MetricsGrid from './components/MetricsGrid.jsx'
import MonthlySnapshotChart from './components/MonthlySnapshotChart.jsx'
import PanelErrorBoundary from './components/PanelErrorBoundary.jsx'
import { defaultInputs, inputSections } from './config/calculatorFields.js'
import { buildMonthlyData, calculateDeal } from './utils/calculations.js'

const STORAGE_KEY = 'rental-roi-calculator:v1'

// Saved input data is user-editable browser state, so only trusted keys and
// valid numeric strings are restored into the calculator.
function sanitizeSavedInputs(parsedInputs) {
  return Object.fromEntries(
    Object.entries(defaultInputs).map(([key, defaultValue]) => {
      const savedValue = parsedInputs[key]

      if (key === 'requiredRevenueMode') {
        const isValidMode = savedValue === 'profit' || savedValue === 'roi'
        return [key, isValidMode ? savedValue : defaultValue]
      }

      if (typeof defaultValue === 'number') {
        if (typeof savedValue === 'number') {
          return [key, Number.isFinite(savedValue) ? savedValue : defaultValue]
        }

        if (typeof savedValue === 'string') {
          const cleanedValue = savedValue.trim().replaceAll(',', '')
          return [
            key,
            cleanedValue !== '' && Number.isFinite(Number(cleanedValue))
              ? savedValue
              : defaultValue,
          ]
        }

        return [key, defaultValue]
      }

      return [
        key,
        typeof savedValue === 'number' || typeof savedValue === 'string'
          ? savedValue
          : defaultValue,
      ]
    }),
  )
}

// Load browser autosave once on startup and repair invalid saved values.
function loadSavedInputs() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return defaultInputs

    const savedInputs = window.localStorage.getItem(STORAGE_KEY)
    if (!savedInputs) return defaultInputs

    const parsedInputs = JSON.parse(savedInputs)
    if (!parsedInputs || typeof parsedInputs !== 'object' || Array.isArray(parsedInputs)) {
      return defaultInputs
    }

    const sanitizedInputs = {
      ...defaultInputs,
      ...sanitizeSavedInputs(parsedInputs),
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizedInputs))

    return sanitizedInputs
  } catch {
    return defaultInputs
  }
}

function App() {
  const [values, setValues] = useState(loadSavedInputs)
  const [lastSavedAt, setLastSavedAt] = useState(null)
  const [hasSaveFailed, setHasSaveFailed] = useState(false)

  // Derived calculator data feeds every dashboard panel.
  const results = useMemo(() => calculateDeal(values), [values])
  const monthlyData = useMemo(() => buildMonthlyData(values, results), [values, results])

  // Error boundaries reset automatically when their underlying panel data changes.
  const monthlySnapshotResetKey = useMemo(
    () => monthlyData.map((item) => `${item.name}:${item.value}:${item.type}`).join('|'),
    [monthlyData],
  )
  const cashFlowResetKey = `${results.monthlyCashFlow}:${results.targetMonthlyProfit}:${results.requiredRevenueMode}`

  // All field changes update React state and browser autosave together.
  function updateValue(key, value) {
    const nextValues = {
      ...values,
      [key]: value,
    }

    setValues(nextValues)

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextValues))
      setLastSavedAt(Date.now())
      setHasSaveFailed(false)
    } catch {
      setHasSaveFailed(true)
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.72),transparent_28rem),radial-gradient(circle_at_85%_10%,rgba(125,211,252,0.22),transparent_24rem)]" />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <AppHeader hasSaveFailed={hasSaveFailed} lastSavedAt={lastSavedAt} />
        <MetricsGrid results={results} />

        {/* Left side is editable inputs; right side is calculated outputs. */}
        <div className="grid items-start gap-5 lg:grid-cols-[360px_1fr]">
          <InputPanel sections={inputSections} values={values} onChange={updateValue} />

          <div className="grid gap-5">
            <PanelErrorBoundary name="Monthly Snapshot" resetKey={monthlySnapshotResetKey}>
              <MonthlySnapshotChart data={monthlyData} />
            </PanelErrorBoundary>
            <PanelErrorBoundary name="Cash Flow Views" resetKey={cashFlowResetKey}>
              <CashFlowInsights results={results} />
            </PanelErrorBoundary>
            <PanelErrorBoundary
              name="Formula Reference"
              resetKey={results.requiredRevenueMode}
            >
              <FormulaReference requiredRevenueMode={results.requiredRevenueMode} />
            </PanelErrorBoundary>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App

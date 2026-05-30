import { useEffect, useMemo, useState } from 'react'
import { Calculator } from 'lucide-react'

// Save status counts briefly after a change, then settles back to "Saved".
function formatSaveStatus(lastSavedAt, hasSaveFailed, currentTime) {
  if (hasSaveFailed) return 'Not saved'
  if (!lastSavedAt) return 'Saved'

  const secondsAgo = Math.max(Math.floor((currentTime - lastSavedAt) / 1000), 0)

  if (secondsAgo < 1) return 'Saved just now'
  if (secondsAgo === 1) return 'Saved 1 second ago'
  if (secondsAgo <= 2) return `Saved ${secondsAgo} seconds ago`
  return 'Saved'
}

function AppHeader({ hasSaveFailed, lastSavedAt }) {
  const [currentTime, setCurrentTime] = useState(0)
  const saveStatus = useMemo(
    () => formatSaveStatus(lastSavedAt, hasSaveFailed, currentTime),
    [lastSavedAt, hasSaveFailed, currentTime],
  )
  const saveStatusClass = hasSaveFailed
    ? 'border-rose-200/80 bg-rose-100/25 text-rose-700 ring-rose-900/5'
    : 'border-emerald-200/80 bg-emerald-100/20 text-emerald-700 ring-emerald-900/5'

  useEffect(() => {
    if (!lastSavedAt) return undefined

    // Keep the timer local to the header so charts do not re-render every second.
    const intervalId = window.setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    const timeoutId = window.setTimeout(() => {
      window.clearInterval(intervalId)
      setCurrentTime(0)
    }, 3000)

    return () => {
      window.clearInterval(intervalId)
      window.clearTimeout(timeoutId)
    }
  }, [lastSavedAt])

  return (
    <header className="rounded-2xl border border-white/80 bg-white/40 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5 backdrop-blur-2xl">
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/90 text-white shadow-sm shadow-blue-900/10">
            <Calculator size={22} aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold uppercase text-blue-700">Rental analysis</span>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ring-1 backdrop-blur-xl ${saveStatusClass}`}
          >
            {saveStatus}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">
          Rental ROI Calculator
        </h1>
      </div>
    </header>
  )
}

export default AppHeader

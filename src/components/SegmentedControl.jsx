function SegmentedControl({ label, options, value, onChange }) {
  return (
    <div className="grid gap-2">
      <div className="text-sm font-semibold text-slate-800">{label}</div>
      <div className="grid grid-cols-2 rounded-full border border-white/70 bg-white/30 p-1 shadow-inner shadow-slate-900/5 ring-1 ring-white/50 backdrop-blur-2xl">
        {options.map((option) => {
          const isSelected = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
              className={`h-9 rounded-full px-3 text-sm transition ${
                isSelected
                  ? 'bg-white/70 text-purple-800 shadow-sm shadow-purple-900/5 ring-1 ring-white/80'
                  : 'text-slate-500 hover:bg-white/35 hover:text-slate-800'
              }`}
            >
              <span className={isSelected ? 'font-bold' : 'font-semibold'}>
                {option.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SegmentedControl

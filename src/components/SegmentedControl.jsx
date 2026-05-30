function SegmentedControl({ label, options, value, onChange }) {
  return (
    <div className="grid gap-2">
      <div className="text-sm font-semibold text-slate-800">{label}</div>
      <div className="grid grid-cols-2 rounded-xl border border-white/80 bg-white/50 p-1 shadow-inner shadow-slate-900/5 ring-1 ring-slate-900/5 backdrop-blur-xl">
        {options.map((option) => {
          const isSelected = value === option.value

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
              className={`h-9 rounded-lg px-2 text-sm transition ${
                isSelected
                  ? 'bg-white/85 text-pink-900 shadow-sm ring-1 ring-slate-900/5'
                  : 'text-slate-600 hover:bg-white/65 hover:text-slate-900'
              }`}
            >
              <span className={isSelected ? 'font-bold' : 'font-medium'}>
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

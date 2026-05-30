function ToggleField({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl border border-white/80 bg-white/50 px-3 py-2 shadow-sm ring-1 ring-slate-900/5 backdrop-blur-xl">
      <span className="text-sm font-semibold text-slate-800">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span className="relative h-6 w-11 rounded-full bg-slate-300/80 transition after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow-sm after:transition peer-checked:bg-blue-600 peer-checked:after:translate-x-5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-500" />
    </label>
  )
}

export default ToggleField

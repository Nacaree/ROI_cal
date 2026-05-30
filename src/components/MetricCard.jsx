function MetricCard({ icon: Icon, label, value, detail, details, tone = 'neutral' }) {
  // Tone controls the icon chip color while the card shell stays consistent.
  const toneClass = {
    neutral: 'bg-slate-200 text-slate-700',
    green: 'bg-emerald-200/40 text-emerald-700',
    blue: 'bg-blue-100/50 text-blue-800',
    amber: 'bg-amber-200/40 text-amber-700',
  }[tone]

  return (
    <article className="flex min-h-40 flex-col rounded-2xl border border-white/80 bg-white/35 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5 backdrop-blur-2xl">
      <div className="flex items-start justify-between gap-3">
        <span className="max-w-[11rem] text-sm font-semibold leading-5 text-slate-600">
          {label}
        </span>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toneClass}`}
        >
          <Icon size={18} aria-hidden="true" />
        </span>
      </div>
      <div className="mt-[-3.5px]">
        <div className="text-3xl font-bold leading-none text-slate-950">{value}</div>
        {/* Some cards need multiple detail rows so wrapped text stays clean. */}
        {details ? (
          <div className="mt-3.5 grid gap-1.5 text-sm leading-5 text-slate-500">
            {details.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
        ) : (
          <div className="mt-4 max-w-[18rem] text-sm leading-6 text-slate-500">{detail}</div>
        )}
      </div>
    </article>
  )
}

export default MetricCard

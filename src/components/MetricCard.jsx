function MetricCard({ icon: Icon, label, value, detail, details, tone = 'neutral' }) {
  // Tone controls the icon chip color while the card shell stays consistent.
  const toneClass = {
    neutral: 'border-slate-200/70 bg-gradient-to-br from-slate-100/90 to-slate-300/60 text-slate-700',
    green:
      'border-emerald-200/80 bg-gradient-to-br from-emerald-100/95 via-emerald-200/70 to-emerald-400/55 text-emerald-800',
    indigo:
      'border-indigo-200/80 bg-gradient-to-br from-blue-100/95 via-indigo-200/75 to-indigo-500/55 text-indigo-800',
    violet:
      'border-violet-200/80 bg-gradient-to-br from-violet-100/95 via-violet-200/75 to-violet-500/55 text-violet-800',
    teal:
      'border-teal-200/80 bg-gradient-to-br from-teal-100/95 via-teal-200/75 to-teal-500/55 text-teal-800',
    rose:
      'border-rose-200/80 bg-gradient-to-br from-rose-100/95 via-rose-200/75 to-rose-500/55 text-rose-800',
    amber:
      'border-amber-200/80 bg-gradient-to-br from-amber-100/95 via-amber-200/75 to-orange-400/60 text-orange-800',
  }[tone]

  return (
    <article className="grid min-h-[108px] w-full grid-rows-[30px_auto_1fr] rounded-xl border border-white/65 bg-white/30 p-3 ring-1 ring-slate-900/5 backdrop-blur-xl sm:min-h-[118px] sm:grid-rows-[32px_auto_1fr] sm:p-3.5">
      <div className="flex items-start justify-between gap-2">
        <span className="max-w-[11rem] text-[13px] font-bold leading-6 text-slate-600 sm:max-w-[9rem] sm:leading-7">
          {label}
        </span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border shadow-sm shadow-slate-900/5 ring-1 ring-white/60 backdrop-blur-md ${toneClass}`}
        >
          <Icon size={15} aria-hidden="true" />
        </span>
      </div>
      <div>
        <div className="min-h-7 text-[1.5rem] font-bold leading-none text-slate-950 sm:text-[1.65rem]">
          {value}
        </div>
      </div>
      <div className="mt-1.5 self-start sm:mt-2">
        {/* Some cards need multiple detail rows so wrapped text stays clean. */}
        {details ? (
          <div className="grid gap-1 text-xs leading-4 text-slate-500">
            {details.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
        ) : (
          <div className="text-xs leading-4 text-slate-500">{detail}</div>
        )}
      </div>
    </article>
  )
}

export default MetricCard

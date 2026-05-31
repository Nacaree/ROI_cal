import NumberField from './NumberField.jsx'
import SegmentedControl from './SegmentedControl.jsx'

function InputSection({ section, values, onChange }) {
  const Icon = section.icon
  // showWhen lets a field appear only for the selected mode, like Profit vs ROI.
  const visibleFields = section.fields.filter(
    (field) => !field.showWhen || values[field.showWhen.key] === field.showWhen.value,
  )
  const visibleFieldKey = visibleFields.map((field) => field.key).join(':')

  return (
    <section className="rounded-2xl border border-white/80 bg-white/35 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/5 backdrop-blur-2xl">
      <div className="mb-4 flex items-center gap-2 border-b border-white/70 pb-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/70 bg-white/55 text-slate-700 shadow-sm backdrop-blur-md">
          <Icon size={18} aria-hidden="true" />
        </span>
        <h2 className="text-base font-semibold text-slate-950">{section.title}</h2>
      </div>
      {section.choice && (
        <div className="mb-4">
          <SegmentedControl
            label={section.choice.label}
            options={section.choice.options}
            value={values[section.choice.key]}
            onChange={(value) => onChange(section.choice.key, value)}
          />
        </div>
      )}
      <div
        key={section.choice ? visibleFieldKey : undefined}
        className={section.choice ? 'grid gap-4 animate-[fadeSlideIn_220ms_ease-out]' : 'grid gap-4'}
      >
        {visibleFields.map((field) => (
          <NumberField
            key={field.key}
            field={field}
            value={values[field.key]}
            onChange={(value) => onChange(field.key, value)}
          />
        ))}
      </div>
    </section>
  )
}

export default InputSection

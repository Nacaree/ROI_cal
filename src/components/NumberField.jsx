import { useState } from 'react'

// Display large currency values with commas when the input is not being edited.
function addThousandsSeparators(value) {
  const text = String(value)
  if (text === '') return ''

  const [whole, decimal] = text.split('.')
  const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return decimal === undefined ? formattedWhole : `${formattedWhole}.${decimal}`
}

// Keep user input numeric while still allowing decimals and blank values.
function cleanNumberInput(value) {
  const withoutCommas = value.replaceAll(',', '')
  const digitsAndDecimals = withoutCommas.replace(/[^\d.]/g, '')
  const [whole, ...decimalParts] = digitsAndDecimals.split('.')

  if (decimalParts.length === 0) return whole
  return `${whole || '0'}.${decimalParts.join('')}`
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function getNumericValue(value) {
  const number = Number(String(value).replaceAll(',', ''))
  return Number.isFinite(number) ? number : 0
}

function formatSliderLimit(value, field) {
  const formattedValue = field.prefix
    ? addThousandsSeparators(value)
    : String(value)

  return `${field.prefix || ''}${formattedValue}${field.suffix || ''}`
}

function NumberField({ field, value, onChange, disabled = false }) {
  const [isFocused, setIsFocused] = useState(false)
  const hasPrefix = Boolean(field.prefix)
  const hasSuffix = Boolean(field.suffix)
  const hasSlider = Boolean(field.slider)
  const numericValue = getNumericValue(value)
  // While focused, show raw digits so typing/editing does not fight commas.
  const displayValue = !isFocused ? addThousandsSeparators(value) : String(value ?? '')
  const sliderValue = hasSlider
    ? clamp(numericValue, field.slider.min, field.slider.max)
    : numericValue

  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-slate-700">{field.label}</span>
      <span className="relative">
        <input
          type="text"
          inputMode="decimal"
          step={field.step || '1'}
          value={displayValue}
          disabled={disabled}
          onBlur={() => setIsFocused(false)}
          onChange={(event) => onChange(cleanNumberInput(event.target.value))}
          onFocus={() => setIsFocused(true)}
          className={`h-10 w-full rounded-xl border border-white/80 bg-white/75 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-900/5 outline-none backdrop-blur-xl transition duration-200 ease-out disabled:cursor-not-allowed disabled:bg-white/45 disabled:text-slate-400 focus:-translate-y-px focus:border-blue-300/80 focus:bg-white/90 focus:shadow-[0_12px_28px_rgba(37,99,235,0.12)] focus:ring-2 focus:ring-blue-200/70 ${
            hasPrefix ? 'pl-7' : 'pl-3'
          } ${hasSuffix ? 'pr-10' : 'pr-3'}`}
        />
        {hasPrefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-sm font-semibold text-slate-700">
            {field.prefix}
          </span>
        )}
        {hasSuffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2 text-sm font-bold text-slate-800">
            {field.suffix}
          </span>
        )}
      </span>
      {hasSlider && (
        <span className="grid gap-1">
          <input
            type="range"
            min={field.slider.min}
            max={field.slider.max}
            step={field.slider.step}
            value={sliderValue}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
            className="h-5 w-full cursor-pointer disabled:cursor-not-allowed"
          />
          <span className="flex justify-between text-xs font-medium text-slate-400">
            <span>{formatSliderLimit(field.slider.min, field)}</span>
            <span>{formatSliderLimit(field.slider.max, field)}</span>
          </span>
        </span>
      )}
    </label>
  )
}

export default NumberField

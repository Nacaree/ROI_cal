const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const percent = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function toCurrency(value) {
  if (!Number.isFinite(value)) return '$0.00'
  return money.format(value)
}

export function toPreciseCurrency(value) {
  return toCurrency(value)
}

export function toPercent(value) {
  if (!Number.isFinite(value)) return 'N/A'
  return percent.format(value)
}

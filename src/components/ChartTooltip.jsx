import { toCurrency } from '../utils/formatters.js'

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-lg">
      <div className="font-semibold text-gray-950">{label}</div>
      {payload.map((item) => (
        <div key={item.dataKey} className="text-gray-600">
          {item.name}: {toCurrency(item.value)}
        </div>
      ))}
    </div>
  )
}

export default ChartTooltip

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { compactNumber } from '../../constants/analytics'

const AXIS = '#64748b'
const GRID = 'rgba(255,255,255,0.06)'

function ChartTooltip({ active, payload, label, name }) {
  if (!active || !payload?.length) return null
  const point = payload[0]
  return (
    <div className="rounded-xl border border-white/12 bg-surface-850/95 px-3 py-2 shadow-2xl shadow-black/50 backdrop-blur-xl">
      <p className="text-[11px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-0.5 flex items-center gap-2 text-sm font-semibold text-white">
        <span
          className="size-2 rounded-full"
          style={{ backgroundColor: point.color || point.stroke }}
          aria-hidden="true"
        />
        {Number(point.value).toLocaleString()}
        <span className="font-normal text-slate-400">{name}</span>
      </p>
    </div>
  )
}

/**
 * Single-series time series. `variant` picks the mark:
 * 'line' for trend, 'area' for volume.
 * One series per chart, so no legend box — the panel header names it.
 */
export default function TimeSeriesChart({
  data,
  dataKey,
  name,
  color,
  variant = 'line',
  gradientId,
}) {
  const isArea = variant === 'area'
  const Chart = isArea ? AreaChart : LineChart

  const shared = (
    <>
      <CartesianGrid stroke={GRID} vertical={false} />
      <XAxis
        dataKey="label"
        stroke={AXIS}
        tick={{ fill: AXIS, fontSize: 11 }}
        tickLine={false}
        axisLine={{ stroke: GRID }}
        minTickGap={24}
        dy={4}
      />
      <YAxis
        stroke={AXIS}
        tick={{ fill: AXIS, fontSize: 11 }}
        tickLine={false}
        axisLine={false}
        width={44}
        tickFormatter={(value) => compactNumber.format(value)}
      />
      <Tooltip
        content={<ChartTooltip name={name} />}
        cursor={{ stroke: 'rgba(255,255,255,0.22)', strokeWidth: 1 }}
      />
    </>
  )

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Chart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        {isArea ? (
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
        ) : null}

        {shared}

        {isArea ? (
          <Area
            type="monotone"
            dataKey={dataKey}
            name={name}
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: '#141c33', strokeWidth: 2 }}
            isAnimationActive={false}
          />
        ) : (
          <Line
            type="monotone"
            dataKey={dataKey}
            name={name}
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: '#141c33', strokeWidth: 2 }}
            isAnimationActive={false}
          />
        )}
      </Chart>
    </ResponsiveContainer>
  )
}

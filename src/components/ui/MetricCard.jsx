import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'

const TONES = {
  accent: 'from-accent-500/20 to-glow-500/10 text-accent-300',
  info: 'from-glow-500/20 to-glow-500/5 text-glow-400',
  neutral: 'from-white/10 to-white/5 text-slate-300',
}

/** Reusable KPI tile: label, headline value, optional period-over-period delta. */
export default function MetricCard({ label, value, delta, hint, icon: Icon, tone = 'accent' }) {
  const hasDelta = typeof delta === 'number' && Number.isFinite(delta)
  const direction = !hasDelta ? 'flat' : delta > 0.5 ? 'up' : delta < -0.5 ? 'down' : 'flat'

  const deltaStyles = {
    up: 'text-accent-300',
    down: 'text-amber-300',
    flat: 'text-slate-500',
  }[direction]

  const DeltaIcon = { up: ArrowUpRight, down: ArrowDownRight, flat: Minus }[direction]

  return (
    <div className="card sheen flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
        {Icon ? (
          <span
            className={`flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br ${TONES[tone]}`}
          >
            <Icon className="size-4" aria-hidden="true" />
          </span>
        ) : null}
      </div>

      <p className="text-2xl font-bold tabular-nums tracking-tight text-white sm:text-3xl">
        {value}
      </p>

      <div className="mt-auto flex items-center gap-2 text-xs">
        {hasDelta ? (
          <span className={`inline-flex items-center gap-1 font-semibold ${deltaStyles}`}>
            <DeltaIcon className="size-3.5" aria-hidden="true" />
            {Math.abs(delta).toFixed(1)}%
          </span>
        ) : null}
        {hint ? <span className="truncate text-slate-500">{hint}</span> : null}
      </div>
    </div>
  )
}

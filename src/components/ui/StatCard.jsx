const TONES = {
  accent: 'from-accent-500/20 to-glow-500/10 text-accent-300',
  success: 'from-accent-500/20 to-accent-500/5 text-accent-300',
  danger: 'from-red-500/20 to-red-500/5 text-red-300',
  info: 'from-glow-500/20 to-glow-500/5 text-glow-400',
  neutral: 'from-white/10 to-white/5 text-slate-300',
}

export default function StatCard({ label, value, hint, icon: Icon, tone = 'accent' }) {
  return (
    <div className="card sheen flex items-center gap-4 p-5">
      {Icon ? (
        <span
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br ${TONES[tone]}`}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
      ) : null}
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
        <p className="text-2xl font-bold tabular-nums text-white">{value}</p>
        {hint ? <p className="mt-0.5 truncate text-xs text-slate-500">{hint}</p> : null}
      </div>
    </div>
  )
}

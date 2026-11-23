const TONES = {
  success: 'border-accent-500/30 bg-accent-500/10 text-accent-300',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  danger: 'border-red-500/30 bg-red-500/10 text-red-300',
  info: 'border-glow-400/30 bg-glow-500/10 text-glow-400',
  violet: 'border-violet-400/30 bg-violet-500/10 text-violet-300',
  neutral: 'border-white/10 bg-white/5 text-slate-300',
}

export default function Badge({ tone = 'neutral', dot = false, icon: Icon, children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {dot ? <span className="size-1.5 rounded-full bg-current" aria-hidden="true" /> : null}
      {Icon ? <Icon className="size-3.5" aria-hidden="true" /> : null}
      {children}
    </span>
  )
}

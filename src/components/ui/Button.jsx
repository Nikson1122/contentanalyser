const VARIANTS = {
  primary:
    'bg-gradient-to-b from-accent-400 to-accent-600 text-surface-950 font-semibold shadow-lg shadow-accent-500/25 ring-1 ring-inset ring-white/20 hover:from-accent-300 hover:to-accent-500 hover:shadow-accent-500/40 active:translate-y-px',
  secondary:
    'bg-white/5 text-slate-100 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 active:translate-y-px',
  ghost: 'text-slate-300 hover:text-white hover:bg-white/5',
  danger:
    'bg-red-500/10 text-red-300 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 active:translate-y-px',
}

const SIZES = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
}

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  icon: Icon,
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      className={`inline-flex items-center justify-center rounded-xl transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
      {children}
    </Component>
  )
}

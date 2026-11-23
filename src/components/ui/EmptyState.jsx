export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/12 bg-white/[0.02] px-6 py-16 text-center backdrop-blur-sm ${className}`}
    >
      {/* soft radial wash behind the icon */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 size-72 -translate-x-1/2 -translate-y-1/3 rounded-full bg-accent-500/10 blur-3xl"
        aria-hidden="true"
      />
      {Icon ? (
        <span className="relative mb-5 flex size-14 items-center justify-center rounded-2xl border border-accent-500/25 bg-gradient-to-br from-accent-500/20 to-glow-500/10 text-accent-300 shadow-lg shadow-accent-500/10">
          <Icon className="size-6" aria-hidden="true" />
        </span>
      ) : null}
      <h3 className="relative text-base font-semibold text-white">{title}</h3>
      {description ? (
        <p className="relative mt-2 max-w-md text-sm leading-relaxed text-slate-400">
          {description}
        </p>
      ) : null}
      {action ? <div className="relative mt-6">{action}</div> : null}
    </div>
  )
}

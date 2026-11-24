/**
 * Card shell for one settings group.
 * `columns` controls the responsive grid the fields lay out in.
 */
export default function SettingsSection({
  icon: Icon,
  title,
  description,
  footer,
  columns = 2,
  children,
}) {
  const grid = columns === 1 ? 'sm:grid-cols-1' : 'sm:grid-cols-2'

  return (
    <section className="card sheen p-5 sm:p-6">
      <div className="flex items-start gap-3">
        {Icon ? (
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-accent-500/25 bg-gradient-to-br from-accent-500/20 to-glow-500/10 text-accent-300">
            <Icon className="size-5" aria-hidden="true" />
          </span>
        ) : null}
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm leading-relaxed text-slate-400">{description}</p>
          ) : null}
        </div>
      </div>

      <div className={`mt-6 grid grid-cols-1 gap-5 ${grid}`}>{children}</div>

      {footer ? (
        <div className="mt-6 border-t border-white/10 pt-4 text-xs leading-relaxed text-slate-500">
          {footer}
        </div>
      ) : null}
    </section>
  )
}

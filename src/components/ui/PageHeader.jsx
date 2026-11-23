export default function PageHeader({ title, description, actions, eyebrow }) {
  return (
    <header className="relative flex flex-col gap-4 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-accent-500/20 bg-accent-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-accent-300">
            <span className="size-1.5 rounded-full bg-accent-400" aria-hidden="true" />
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-gradient text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-white/15 via-white/5 to-transparent"
        aria-hidden="true"
      />
    </header>
  )
}

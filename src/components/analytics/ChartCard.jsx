/** Panel wrapper for a chart: title, subtitle, optional series key and actions. */
export default function ChartCard({ title, subtitle, seriesLabel, seriesColor, actions, children }) {
  return (
    <section className="card sheen flex flex-col p-5">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
        </div>
        <div className="flex items-center gap-3">
          {seriesLabel ? (
            <span className="inline-flex items-center gap-2 text-xs text-slate-400">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: seriesColor }}
                aria-hidden="true"
              />
              {seriesLabel}
            </span>
          ) : null}
          {actions}
        </div>
      </header>
      <div className="h-64 w-full sm:h-72">{children}</div>
    </section>
  )
}

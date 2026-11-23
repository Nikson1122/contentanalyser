/**
 * Scrollable tab bar. `tabs` is [{ key, label, count? }].
 * Panels are rendered by the parent so each can own its own state.
 */
export default function Tabs({ tabs, active, onChange, label = 'Sections' }) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex gap-1 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.03] p-1"
    >
      {tabs.map(({ key, label: tabLabel, count }) => {
        const selected = key === active
        return (
          <button
            key={key}
            type="button"
            role="tab"
            id={`tab-${key}`}
            aria-selected={selected}
            aria-controls={`panel-${key}`}
            onClick={() => onChange(key)}
            className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              selected
                ? 'bg-accent-500/20 text-accent-200 ring-1 ring-accent-500/30'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
            }`}
          >
            {tabLabel}
            {typeof count === 'number' ? (
              <span
                className={`rounded-md px-1.5 py-0.5 text-[11px] tabular-nums ${
                  selected ? 'bg-accent-500/25 text-accent-100' : 'bg-white/5 text-slate-500'
                }`}
              >
                {count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

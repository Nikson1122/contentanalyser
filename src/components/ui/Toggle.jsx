/** Accessible switch. Label and hint sit beside the control. */
export default function Toggle({ checked, onChange, label, hint, id }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm font-medium text-slate-200">
          {label}
        </label>
        {hint ? <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{hint}</p> : null}
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors ${
          checked
            ? 'border-accent-500/40 bg-accent-500/80'
            : 'border-white/10 bg-white/10 hover:bg-white/15'
        }`}
      >
        <span
          className={`absolute top-0.5 size-4.5 rounded-full bg-white shadow-sm transition-transform duration-150 ${
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
          aria-hidden="true"
        />
      </button>
    </div>
  )
}

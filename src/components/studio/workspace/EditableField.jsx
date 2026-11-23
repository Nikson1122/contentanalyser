import CopyButton from '../../ui/CopyButton'

/**
 * Labelled, always-editable textarea.
 * Editable surfaces are visually distinct from generated previews: an inset
 * well with a focus ring, versus the flat panels used for read-only output.
 */
export default function EditableField({
  id,
  label,
  hint,
  value,
  rows = 3,
  mono = false,
  onChange,
  copyable = false,
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </label>
        {copyable ? <CopyButton text={value} iconOnly /> : null}
      </div>
      <textarea
        id={id}
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`w-full resize-y rounded-xl border border-white/10 bg-black/25 px-3.5 py-2.5 text-sm leading-relaxed text-slate-100 shadow-inner shadow-black/20 transition-colors placeholder:text-slate-600 hover:border-white/20 focus:border-accent-500/60 ${
          mono ? 'font-mono text-xs' : ''
        }`}
        placeholder={`Write the ${label.toLowerCase()}…`}
      />
      {hint ? <p className="mt-1 text-[11px] text-slate-500">{hint}</p> : null}
    </div>
  )
}

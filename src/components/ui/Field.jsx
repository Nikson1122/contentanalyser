const BASE =
  'w-full rounded-xl border bg-black/20 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 shadow-inner shadow-black/20 transition-colors'

export function Field({ label, htmlFor, error, hint, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
        {required ? <span className="ml-1 text-accent-400">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-red-400">{error}</p>
      ) : hint ? (
        <p className="text-xs text-slate-500">{hint}</p>
      ) : null}
    </div>
  )
}

export function TextInput({ error, className = '', ...props }) {
  return (
    <input
      className={`${BASE} ${error ? 'border-red-500/60' : 'border-white/10 hover:border-white/20 focus:border-accent-500/60'} ${className}`}
      {...props}
    />
  )
}

export function TextArea({ error, className = '', ...props }) {
  return (
    <textarea
      className={`${BASE} resize-y ${error ? 'border-red-500/60' : 'border-white/10 hover:border-white/20 focus:border-accent-500/60'} ${className}`}
      {...props}
    />
  )
}

export function Select({ error, placeholder, options = [], className = '', ...props }) {
  return (
    <select
      className={`${BASE} ${error ? 'border-red-500/60' : 'border-white/10 hover:border-white/20 focus:border-accent-500/60'} ${className}`}
      {...props}
    >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {options.map((option) => {
        // Accepts plain strings or { value, label } objects.
        const value = typeof option === 'string' ? option : option.value
        const label = typeof option === 'string' ? option : option.label
        return (
          <option key={value} value={value}>
            {label}
          </option>
        )
      })}
    </select>
  )
}

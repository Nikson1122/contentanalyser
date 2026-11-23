import { SlidersHorizontal } from 'lucide-react'
import Toggle from '../ui/Toggle'
import { Field, Select, TextInput } from '../ui/Field'
import {
  CREATIVITY_LEVELS,
  DURATIONS,
  OUTPUT_TOGGLES,
  TONES,
} from '../../constants/studio'

/** Section 2 of the workspace: how it should be generated. */
export default function GenerationSettings({ settings, errors, onChange }) {
  const setField = (key) => (event) => onChange(key, event.target.value)

  return (
    <section className="card sheen p-5">
      <header className="mb-5 flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-glow-500/20 to-accent-500/10 text-glow-400">
          <SlidersHorizontal className="size-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-white">Generation settings</h2>
          <p className="text-xs text-slate-500">Shape the tone, length and what gets produced.</p>
        </div>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Tone" htmlFor="studio-tone">
          <Select
            id="studio-tone"
            value={settings.tone}
            onChange={setField('tone')}
            options={TONES}
          />
        </Field>

        {settings.tone === 'Custom' ? (
          <Field label="Custom tone" htmlFor="studio-custom-tone" error={errors.customTone}>
            <TextInput
              id="studio-custom-tone"
              value={settings.customTone}
              onChange={setField('customTone')}
              placeholder="Describe the tone"
              error={errors.customTone}
            />
          </Field>
        ) : null}

        <Field label="Video duration" htmlFor="studio-duration">
          <Select
            id="studio-duration"
            value={settings.duration}
            onChange={setField('duration')}
            options={DURATIONS}
          />
        </Field>

        {settings.duration === 'Custom' ? (
          <Field
            label="Custom duration"
            htmlFor="studio-custom-duration"
            error={errors.customDuration}
            hint="In seconds."
          >
            <TextInput
              id="studio-custom-duration"
              type="number"
              min="1"
              value={settings.customDuration}
              onChange={setField('customDuration')}
              placeholder="e.g. 45"
              error={errors.customDuration}
            />
          </Field>
        ) : null}

        {/* Creativity level — segmented so all three options are visible */}
        <div className="sm:col-span-2">
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">
            Creativity level
          </p>
          <div
            role="group"
            aria-label="Creativity level"
            className="grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-1"
          >
            {CREATIVITY_LEVELS.map(({ value, label, hint }) => {
              const active = settings.creativity === value
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onChange('creativity', value)}
                  className={`rounded-lg px-3 py-2 text-center transition-colors ${
                    active
                      ? 'bg-accent-500/20 ring-1 ring-accent-500/30'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <span
                    className={`block text-sm font-semibold ${
                      active ? 'text-accent-200' : 'text-slate-300'
                    }`}
                  >
                    {label}
                  </span>
                  <span className="mt-0.5 block text-[11px] leading-tight text-slate-500">
                    {hint}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Output sections */}
      <div className="mt-5 border-t border-white/5 pt-2">
        <p className="mb-1 pt-3 text-xs font-medium uppercase tracking-wide text-slate-400">
          Include in output
        </p>
        <div className="divide-y divide-white/5">
          {OUTPUT_TOGGLES.map(({ key, label, hint }) => (
            <Toggle
              key={key}
              id={`toggle-${key}`}
              label={label}
              hint={hint}
              checked={settings[key]}
              onChange={(value) => onChange(key, value)}
            />
          ))}
        </div>
        {errors.outputs ? <p className="mt-2 text-xs text-red-400">{errors.outputs}</p> : null}
      </div>
    </section>
  )
}

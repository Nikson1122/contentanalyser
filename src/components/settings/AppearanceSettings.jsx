import { Palette } from 'lucide-react'
import SettingsSection from './SettingsSection'
import { Field, Select } from '../ui/Field'
import Badge from '../ui/Badge'
import { THEME_OPTIONS } from '../../constants/settings'

export default function AppearanceSettings({ values, onChange }) {
  const pending = values.theme !== 'dark'

  return (
    <SettingsSection
      icon={Palette}
      title="Appearance"
      description="Choose the theme the interface renders in."
      footer="Only the dark navy theme is implemented today. A light or system-matched theme applies once those palettes ship."
    >
      <Field label="Theme preference" htmlFor="settings-theme">
        <Select
          id="settings-theme"
          value={values.theme}
          options={THEME_OPTIONS}
          onChange={(event) => onChange('theme', event.target.value)}
        />
      </Field>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Currently applied
        </span>
        <div className="flex h-[42px] items-center gap-2">
          <span
            className="size-5 shrink-0 rounded-md border border-white/15 bg-surface-900 shadow-inner shadow-black/40"
            aria-hidden="true"
          />
          <span className="text-sm text-slate-300">Dark navy</span>
          {pending ? (
            <Badge tone="warning" dot>
              Not applied yet
            </Badge>
          ) : (
            <Badge tone="success" dot>
              Active
            </Badge>
          )}
        </div>
      </div>
    </SettingsSection>
  )
}

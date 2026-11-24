import { UserCog } from 'lucide-react'
import SettingsSection from './SettingsSection'
import { Field, Select, TextInput } from '../ui/Field'
import { LANDING_OPTIONS, LANGUAGES, TIME_ZONES } from '../../constants/settings'

export default function GeneralSettings({ values, onChange }) {
  return (
    <SettingsSection
      icon={UserCog}
      title="General preferences"
      description="How the workspace addresses you and where it opens."
    >
      <Field
        label="Display name"
        htmlFor="settings-display-name"
        hint="Shown in the workspace header. Leave blank to stay anonymous."
      >
        <TextInput
          id="settings-display-name"
          value={values.displayName}
          onChange={(event) => onChange('displayName', event.target.value)}
          placeholder="e.g. Alex"
          autoComplete="off"
        />
      </Field>

      <Field label="Interface language" htmlFor="settings-language">
        <Select
          id="settings-language"
          value={values.language}
          options={LANGUAGES}
          onChange={(event) => onChange('language', event.target.value)}
        />
      </Field>

      <Field label="Time zone" htmlFor="settings-timezone" hint="Used when dates are displayed.">
        <Select
          id="settings-timezone"
          value={values.timeZone}
          options={TIME_ZONES}
          onChange={(event) => onChange('timeZone', event.target.value)}
        />
      </Field>

      <Field
        label="Dashboard landing page"
        htmlFor="settings-landing"
        hint="The module the app opens on."
      >
        <Select
          id="settings-landing"
          value={values.landingRoute}
          options={LANDING_OPTIONS}
          onChange={(event) => onChange('landingRoute', event.target.value)}
        />
      </Field>
    </SettingsSection>
  )
}

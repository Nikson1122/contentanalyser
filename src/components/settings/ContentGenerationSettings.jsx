import { Sparkles } from 'lucide-react'
import SettingsSection from './SettingsSection'
import { Field, Select } from '../ui/Field'
import {
  CAPTION_STYLE_OPTIONS,
  FORMAT_OPTIONS,
  LANGUAGES,
  SCRIPT_LENGTH_OPTIONS,
  TONE_OPTIONS,
} from '../../constants/settings'

export default function ContentGenerationSettings({ values, onChange }) {
  return (
    <SettingsSection
      icon={Sparkles}
      title="Content generation"
      description="Defaults the AI Content Studio starts a new brief with."
      footer="These are starting values only — any brief can override them before generating."
    >
      <Field label="Default content language" htmlFor="settings-content-language">
        <Select
          id="settings-content-language"
          value={values.contentLanguage}
          options={LANGUAGES}
          onChange={(event) => onChange('contentLanguage', event.target.value)}
        />
      </Field>

      <Field label="Content tone" htmlFor="settings-tone">
        <Select
          id="settings-tone"
          value={values.tone}
          options={TONE_OPTIONS}
          onChange={(event) => onChange('tone', event.target.value)}
        />
      </Field>

      <Field label="Preferred format" htmlFor="settings-format">
        <Select
          id="settings-format"
          value={values.format}
          options={FORMAT_OPTIONS}
          onChange={(event) => onChange('format', event.target.value)}
        />
      </Field>

      <Field label="Script length" htmlFor="settings-script-length">
        <Select
          id="settings-script-length"
          value={values.scriptLength}
          options={SCRIPT_LENGTH_OPTIONS}
          onChange={(event) => onChange('scriptLength', event.target.value)}
        />
      </Field>

      <Field
        label="Caption style"
        htmlFor="settings-caption-style"
        hint="Shapes generated captions and hashtags."
      >
        <Select
          id="settings-caption-style"
          value={values.captionStyle}
          options={CAPTION_STYLE_OPTIONS}
          onChange={(event) => onChange('captionStyle', event.target.value)}
        />
      </Field>
    </SettingsSection>
  )
}

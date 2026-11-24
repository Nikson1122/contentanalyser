import { GitBranch } from 'lucide-react'
import SettingsSection from './SettingsSection'
import { Field, Select } from '../ui/Field'
import { APPROVAL_OPTIONS, CATEGORY_OPTIONS, PLATFORMS } from '../../constants/settings'

export default function ContentWorkflowSettings({ values, onChange }) {
  return (
    <SettingsSection
      icon={GitBranch}
      title="Content workflow"
      description="Defaults applied to newly created calendar and studio items."
    >
      <Field label="Target platform" htmlFor="settings-platform">
        <Select
          id="settings-platform"
          value={values.targetPlatform}
          options={PLATFORMS}
          onChange={(event) => onChange('targetPlatform', event.target.value)}
        />
      </Field>

      <Field
        label="Default approval status"
        htmlFor="settings-approval"
        hint="The state new content enters the calendar in."
      >
        <Select
          id="settings-approval"
          value={values.approvalStatus}
          options={APPROVAL_OPTIONS}
          onChange={(event) => onChange('approvalStatus', event.target.value)}
        />
      </Field>

      <Field label="Default category" htmlFor="settings-category">
        <Select
          id="settings-category"
          value={values.defaultCategory}
          options={CATEGORY_OPTIONS}
          onChange={(event) => onChange('defaultCategory', event.target.value)}
        />
      </Field>
    </SettingsSection>
  )
}

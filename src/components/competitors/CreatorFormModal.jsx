import { useEffect, useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { Field, Select, TextArea, TextInput } from '../ui/Field'
import {
  COMPETITOR_PLATFORMS,
  EMPTY_CREATOR_FORM,
  isValidUrl,
  normalizeUrl,
} from '../../constants/competitors'

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Creator name is required.'
  if (!values.platform) errors.platform = 'Select a platform.'
  if (!values.profileUrl.trim()) errors.profileUrl = 'Profile URL is required.'
  else if (!isValidUrl(values.profileUrl)) errors.profileUrl = 'Enter a valid URL.'
  if (!values.niche.trim()) errors.niche = 'Niche or category is required.'
  return errors
}

export default function CreatorFormModal({ open, creator, onClose, onSubmit }) {
  const isEditing = Boolean(creator)
  const [values, setValues] = useState(EMPTY_CREATOR_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return
    setValues(
      creator
        ? {
            name: creator.name ?? '',
            platform: creator.platform ?? '',
            profileUrl: creator.profileUrl ?? '',
            niche: creator.niche ?? '',
            description: creator.description ?? '',
            notes: creator.notes ?? '',
          }
        : EMPTY_CREATOR_FORM,
    )
    setErrors({})
  }, [open, creator])

  const setField = (key) => (event) => {
    const { value } = event.target
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const nextErrors = validate(values)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    onSubmit({
      ...values,
      name: values.name.trim(),
      profileUrl: normalizeUrl(values.profileUrl),
      niche: values.niche.trim(),
      description: values.description.trim(),
      notes: values.notes.trim(),
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit creator' : 'Add creator'}
      description={
        isEditing
          ? 'Update the details you track for this creator.'
          : 'Track a creator whose content you want to research.'
      }
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="creator-form">
            {isEditing ? 'Save changes' : 'Add creator'}
          </Button>
        </>
      }
    >
      <form
        id="creator-form"
        onSubmit={handleSubmit}
        noValidate
        className="grid gap-5 sm:grid-cols-2"
      >
        <Field label="Creator name" htmlFor="creator-name" required error={errors.name}>
          <TextInput
            id="creator-name"
            value={values.name}
            onChange={setField('name')}
            placeholder="Name or handle"
            error={errors.name}
            autoFocus
          />
        </Field>

        <Field label="Platform" htmlFor="creator-platform" required error={errors.platform}>
          <Select
            id="creator-platform"
            value={values.platform}
            onChange={setField('platform')}
            placeholder="Select a platform"
            options={COMPETITOR_PLATFORMS}
            error={errors.platform}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field
            label="Profile URL"
            htmlFor="creator-url"
            required
            error={errors.profileUrl}
            hint="The link to their profile or channel."
          >
            <TextInput
              id="creator-url"
              type="url"
              inputMode="url"
              value={values.profileUrl}
              onChange={setField('profileUrl')}
              placeholder="https://…"
              error={errors.profileUrl}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field
            label="Niche / category"
            htmlFor="creator-niche"
            required
            error={errors.niche}
            hint="Free text — any category you define."
          >
            <TextInput
              id="creator-niche"
              value={values.niche}
              onChange={setField('niche')}
              placeholder="The topic area they cover"
              error={errors.niche}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Description" htmlFor="creator-description" hint="Optional.">
            <TextArea
              id="creator-description"
              rows={3}
              value={values.description}
              onChange={setField('description')}
              placeholder="What kind of content do they publish?"
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field
            label="Notes"
            htmlFor="creator-notes"
            hint="Optional. Your own observations about their strategy."
          >
            <TextArea
              id="creator-notes"
              rows={3}
              value={values.notes}
              onChange={setField('notes')}
              placeholder="Posting cadence, hooks, formats that work…"
            />
          </Field>
        </div>
      </form>
    </Modal>
  )
}

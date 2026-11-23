import { useEffect, useState } from 'react'
import Modal from './Modal'
import Button from './Button'
import { Field, Select, TextArea, TextInput } from './Field'
import { EMPTY_PAGE_FORM, LANGUAGES, PLATFORMS } from '../../constants/pageOptions'

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Page name is required.'
  if (!values.platform) errors.platform = 'Select a platform.'
  if (!values.niche.trim()) errors.niche = 'Niche or category is required.'
  if (!values.language) errors.language = 'Select a primary language.'
  return errors
}

export default function PageFormModal({ open, page, onClose, onSubmit }) {
  const isEditing = Boolean(page)
  const [values, setValues] = useState(EMPTY_PAGE_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return
    setValues(
      page
        ? {
            name: page.name ?? '',
            platform: page.platform ?? '',
            niche: page.niche ?? '',
            description: page.description ?? '',
            language: page.language ?? '',
          }
        : EMPTY_PAGE_FORM,
    )
    setErrors({})
  }, [open, page])

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
      niche: values.niche.trim(),
      description: values.description.trim(),
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit page' : 'Add new page'}
      description={
        isEditing
          ? 'Update how this page is described across the workspace.'
          : 'Describe the page you manage. These details drive research and content suggestions.'
      }
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="page-form">
            {isEditing ? 'Save changes' : 'Create page'}
          </Button>
        </>
      }
    >
      <form id="page-form" onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Page name" htmlFor="page-name" required error={errors.name}>
            <TextInput
              id="page-name"
              value={values.name}
              onChange={setField('name')}
              placeholder="e.g. the handle or display name of your page"
              error={errors.name}
              autoFocus
            />
          </Field>
        </div>

        <Field label="Platform" htmlFor="page-platform" required error={errors.platform}>
          <Select
            id="page-platform"
            value={values.platform}
            onChange={setField('platform')}
            placeholder="Select a platform"
            options={PLATFORMS}
            error={errors.platform}
          />
        </Field>

        <Field label="Primary language" htmlFor="page-language" required error={errors.language}>
          <Select
            id="page-language"
            value={values.language}
            onChange={setField('language')}
            placeholder="Select a language"
            options={LANGUAGES}
            error={errors.language}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field
            label="Niche / category"
            htmlFor="page-niche"
            required
            error={errors.niche}
            hint="Free text — any niche you create is supported."
          >
            <TextInput
              id="page-niche"
              value={values.niche}
              onChange={setField('niche')}
              placeholder="e.g. the topic area this page covers"
              error={errors.niche}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field
            label="Description"
            htmlFor="page-description"
            hint="Optional. Audience, tone, content format — anything that defines the page."
          >
            <TextArea
              id="page-description"
              rows={4}
              value={values.description}
              onChange={setField('description')}
              placeholder="What is this page about?"
            />
          </Field>
        </div>
      </form>
    </Modal>
  )
}

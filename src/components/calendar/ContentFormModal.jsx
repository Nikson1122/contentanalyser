import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Layers } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { Field, Select, TextArea, TextInput } from '../ui/Field'
import {
  CONTENT_FORMATS,
  EMPTY_CALENDAR_FORM,
  STATUSES,
  toISODate,
} from '../../constants/calendar'

function validate(values) {
  const errors = {}
  if (!values.title.trim()) errors.title = 'Give this content a title.'
  if (!values.pageId) errors.pageId = 'Select a page.'
  if (!values.format) errors.format = 'Select a format.'
  if (!values.date) errors.date = 'Pick a scheduled date.'
  return errors
}

export default function ContentFormModal({
  open,
  item,
  defaultDate,
  pages,
  categories,
  onClose,
  onSubmit,
}) {
  const isEditing = Boolean(item)
  const [values, setValues] = useState(EMPTY_CALENDAR_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return
    setValues(
      item
        ? {
            title: item.title ?? '',
            pageId: item.pageId ?? '',
            category: item.category ?? '',
            format: item.format ?? '',
            date: item.date ?? '',
            time: item.time ?? '09:00',
            status: item.status ?? 'Idea',
            notes: item.notes ?? '',
          }
        : {
            ...EMPTY_CALENDAR_FORM,
            date: defaultDate || toISODate(new Date()),
          },
    )
    setErrors({})
  }, [open, item, defaultDate])

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
    const page = pages.find((item_) => item_.id === values.pageId)
    onSubmit({
      ...values,
      title: values.title.trim(),
      notes: values.notes.trim(),
      // Denormalized for display; the id stays the source of truth.
      pageName: page?.name ?? '',
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit content' : 'Add content'}
      description={
        isEditing
          ? 'Update this planned item.'
          : 'Plan a piece of content. Nothing is published automatically.'
      }
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="calendar-form">
            {isEditing ? 'Save changes' : 'Add to calendar'}
          </Button>
        </>
      }
    >
      <form
        id="calendar-form"
        onSubmit={handleSubmit}
        noValidate
        className="grid gap-5 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <Field label="Content title" htmlFor="cal-title" required error={errors.title}>
            <TextInput
              id="cal-title"
              value={values.title}
              onChange={setField('title')}
              placeholder="What are you making?"
              error={errors.title}
              autoFocus
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Page" htmlFor="cal-page" required error={errors.pageId}>
            {pages.length ? (
              <Select
                id="cal-page"
                value={values.pageId}
                onChange={setField('pageId')}
                placeholder="Select a page"
                options={pages.map((page) => ({
                  value: page.id,
                  label: page.platform ? `${page.name} · ${page.platform}` : page.name,
                }))}
                error={errors.pageId}
              />
            ) : (
              <div className="flex flex-col items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.07] p-3.5">
                <p className="flex items-center gap-2 text-xs font-semibold text-amber-200">
                  <Layers className="size-4" aria-hidden="true" />
                  No pages available yet
                </p>
                <Button as={Link} to="/pages" size="sm" variant="secondary" onClick={onClose}>
                  Go to My Pages
                </Button>
              </div>
            )}
          </Field>
        </div>

        <Field
          label="Category"
          htmlFor="cal-category"
          hint={categories.length ? 'From your pages.' : 'Free text.'}
        >
          {categories.length ? (
            <Select
              id="cal-category"
              value={values.category}
              onChange={setField('category')}
              placeholder="Select a category"
              options={categories}
            />
          ) : (
            <TextInput
              id="cal-category"
              value={values.category}
              onChange={setField('category')}
              placeholder="Category"
            />
          )}
        </Field>

        <Field label="Content format" htmlFor="cal-format" required error={errors.format}>
          <Select
            id="cal-format"
            value={values.format}
            onChange={setField('format')}
            placeholder="Select a format"
            options={CONTENT_FORMATS}
            error={errors.format}
          />
        </Field>

        <Field label="Scheduled date" htmlFor="cal-date" required error={errors.date}>
          <TextInput
            id="cal-date"
            type="date"
            value={values.date}
            onChange={setField('date')}
            error={errors.date}
          />
        </Field>

        <Field label="Scheduled time" htmlFor="cal-time">
          <TextInput id="cal-time" type="time" value={values.time} onChange={setField('time')} />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Status" htmlFor="cal-status">
            <Select
              id="cal-status"
              value={values.status}
              onChange={setField('status')}
              options={STATUSES.map(({ key }) => key)}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Notes" htmlFor="cal-notes" hint="Optional.">
            <TextArea
              id="cal-notes"
              rows={3}
              value={values.notes}
              onChange={setField('notes')}
              placeholder="Anything to remember about this piece?"
            />
          </Field>
        </div>
      </form>
    </Modal>
  )
}

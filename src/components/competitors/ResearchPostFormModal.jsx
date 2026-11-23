import { useEffect, useState } from 'react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { Field, Select, TextArea, TextInput } from '../ui/Field'
import {
  CONTENT_FORMATS,
  EMPTY_RESEARCH_POST_FORM,
  isValidUrl,
  normalizeUrl,
} from '../../constants/competitors'

function validate(values) {
  const errors = {}
  if (!values.postUrl.trim()) errors.postUrl = 'Post URL is required.'
  else if (!isValidUrl(values.postUrl)) errors.postUrl = 'Enter a valid URL.'
  if (!values.format) errors.format = 'Select a content format.'
  if (values.views !== '' && Number(values.views) < 0) errors.views = 'Must be zero or more.'
  if (values.engagement !== '' && Number(values.engagement) < 0) {
    errors.engagement = 'Must be zero or more.'
  }
  return errors
}

export default function ResearchPostFormModal({ open, post, creatorName, onClose, onSubmit }) {
  const isEditing = Boolean(post)
  const [values, setValues] = useState(EMPTY_RESEARCH_POST_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!open) return
    setValues(
      post
        ? {
            postUrl: post.postUrl ?? '',
            caption: post.caption ?? '',
            format: post.format ?? '',
            topic: post.topic ?? '',
            views: post.views ?? '',
            engagement: post.engagement ?? '',
            observedAt: post.observedAt ?? '',
            notes: post.notes ?? '',
          }
        : {
            ...EMPTY_RESEARCH_POST_FORM,
            // Default the observation date to today for a new entry.
            observedAt: new Date().toISOString().slice(0, 10),
          },
    )
    setErrors({})
  }, [open, post])

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
      postUrl: normalizeUrl(values.postUrl),
      caption: values.caption.trim(),
      topic: values.topic.trim(),
      notes: values.notes.trim(),
    })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Edit research post' : 'Add research post'}
      description={
        creatorName
          ? `Manually recorded observation for ${creatorName}.`
          : 'Manually recorded observation.'
      }
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="research-post-form">
            {isEditing ? 'Save changes' : 'Add post'}
          </Button>
        </>
      }
    >
      <form
        id="research-post-form"
        onSubmit={handleSubmit}
        noValidate
        className="grid gap-5 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <Field label="Post URL" htmlFor="post-url" required error={errors.postUrl}>
            <TextInput
              id="post-url"
              type="url"
              inputMode="url"
              value={values.postUrl}
              onChange={setField('postUrl')}
              placeholder="https://…"
              error={errors.postUrl}
              autoFocus
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Caption / title" htmlFor="post-caption" hint="Optional.">
            <TextArea
              id="post-caption"
              rows={2}
              value={values.caption}
              onChange={setField('caption')}
              placeholder="The hook or headline used"
            />
          </Field>
        </div>

        <Field label="Content format" htmlFor="post-format" required error={errors.format}>
          <Select
            id="post-format"
            value={values.format}
            onChange={setField('format')}
            placeholder="Select a format"
            options={CONTENT_FORMATS}
            error={errors.format}
          />
        </Field>

        <Field label="Topic" htmlFor="post-topic" hint="Optional. Free text.">
          <TextInput
            id="post-topic"
            value={values.topic}
            onChange={setField('topic')}
            placeholder="What the post is about"
          />
        </Field>

        <Field
          label="Observed views"
          htmlFor="post-views"
          error={errors.views}
          hint="Optional. As you saw it."
        >
          <TextInput
            id="post-views"
            type="number"
            min="0"
            value={values.views}
            onChange={setField('views')}
            placeholder="Leave blank if unknown"
            error={errors.views}
          />
        </Field>

        <Field
          label="Observed engagement"
          htmlFor="post-engagement"
          error={errors.engagement}
          hint="Optional. Likes, comments and shares combined."
        >
          <TextInput
            id="post-engagement"
            type="number"
            min="0"
            value={values.engagement}
            onChange={setField('engagement')}
            placeholder="Leave blank if unknown"
            error={errors.engagement}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Observation date" htmlFor="post-observed" hint="When you recorded this.">
            <TextInput
              id="post-observed"
              type="date"
              value={values.observedAt}
              onChange={setField('observedAt')}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Research notes" htmlFor="post-notes" hint="Optional.">
            <TextArea
              id="post-notes"
              rows={3}
              value={values.notes}
              onChange={setField('notes')}
              placeholder="Why did this post work? What would you borrow?"
            />
          </Field>
        </div>
      </form>
    </Modal>
  )
}

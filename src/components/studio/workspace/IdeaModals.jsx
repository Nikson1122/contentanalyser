import { useEffect, useState } from 'react'
import { Clapperboard, Clock, Megaphone, Tag } from 'lucide-react'
import Modal from '../../ui/Modal'
import Button from '../../ui/Button'
import Badge from '../../ui/Badge'
import { Field, Select, TextArea, TextInput } from '../../ui/Field'
import { CONTENT_FORMATS } from '../../../constants/studio'

export function IdeaDetailModal({ open, idea, selected, onClose, onEdit, onSelect }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={idea?.title ?? 'Idea'}
      description="Demonstration idea — placeholder text built from your brief."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="secondary" onClick={() => onEdit(idea)}>
            Edit
          </Button>
          <Button onClick={() => onSelect(idea.id)} disabled={selected}>
            {selected ? 'In development' : 'Develop script'}
          </Button>
        </>
      }
    >
      {idea ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge tone="neutral" icon={Tag}>
              {idea.category}
            </Badge>
            <Badge tone="info" icon={Clapperboard}>
              {idea.format}
            </Badge>
            <Badge tone="neutral" icon={Clock}>
              {idea.duration}
            </Badge>
            {idea.saved ? <Badge tone="success">Saved</Badge> : null}
          </div>

          <p className="text-sm leading-relaxed text-slate-300">{idea.description}</p>

          <div className="rounded-xl border border-white/10 bg-black/20 p-3.5">
            <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <Megaphone className="size-3" aria-hidden="true" />
              Hook preview
            </p>
            <p className="text-sm leading-relaxed text-slate-300">{idea.hook}</p>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}

const EMPTY = { title: '', description: '', category: '', format: '', duration: '', hook: '' }

export function IdeaEditModal({ open, idea, onClose, onSubmit }) {
  const [values, setValues] = useState(EMPTY)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setValues(
      idea
        ? {
            title: idea.title ?? '',
            description: idea.description ?? '',
            category: idea.category ?? '',
            format: idea.format ?? '',
            duration: idea.duration ?? '',
            hook: idea.hook ?? '',
          }
        : EMPTY,
    )
    setError('')
  }, [open, idea])

  const setField = (key) => (event) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }))
    setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!values.title.trim()) {
      setError('Give the idea a title.')
      return
    }
    onSubmit(idea.id, { ...values, title: values.title.trim() })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit idea"
      description="Adjust any field. Changes stay in this session."
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="idea-edit-form">
            Save changes
          </Button>
        </>
      }
    >
      <form
        id="idea-edit-form"
        onSubmit={handleSubmit}
        noValidate
        className="grid gap-5 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <Field label="Idea title" htmlFor="idea-title" required error={error}>
            <TextInput
              id="idea-title"
              value={values.title}
              onChange={setField('title')}
              error={error}
              autoFocus
            />
          </Field>
        </div>

        <Field label="Content category" htmlFor="idea-category">
          <TextInput id="idea-category" value={values.category} onChange={setField('category')} />
        </Field>

        <Field label="Suggested format" htmlFor="idea-format">
          <Select
            id="idea-format"
            value={values.format}
            onChange={setField('format')}
            placeholder="Select a format"
            options={CONTENT_FORMATS}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Suggested duration" htmlFor="idea-duration">
            <TextInput
              id="idea-duration"
              value={values.duration}
              onChange={setField('duration')}
              placeholder="e.g. 30 sec"
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Short description" htmlFor="idea-description">
            <TextArea
              id="idea-description"
              rows={3}
              value={values.description}
              onChange={setField('description')}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Hook preview" htmlFor="idea-hook">
            <TextArea id="idea-hook" rows={3} value={values.hook} onChange={setField('hook')} />
          </Field>
        </div>
      </form>
    </Modal>
  )
}

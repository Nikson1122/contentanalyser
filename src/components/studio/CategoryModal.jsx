import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { Field, TextInput } from '../ui/Field'

/** Manage content categories: add a new one, remove ones you added. */
export default function CategoryModal({ open, categories, onClose, onAdd, onRemove }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setName('')
    setError('')
  }, [open])

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Enter a category name.')
      return
    }
    if (categories.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
      setError('That category already exists.')
      return
    }
    onAdd(trimmed)
    setName('')
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      title="Content categories"
      description="Categories come from your pages' niches. Add your own as needed."
      footer={
        <Button variant="secondary" onClick={onClose}>
          Done
        </Button>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field label="New category" htmlFor="new-category" error={error}>
          <div className="flex gap-2">
            <TextInput
              id="new-category"
              value={name}
              onChange={(event) => {
                setName(event.target.value)
                setError('')
              }}
              placeholder="Category name"
              error={error}
              autoFocus
            />
            <Button type="submit" className="shrink-0">
              Add
            </Button>
          </div>
        </Field>

        {categories.length > 0 ? (
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
              Existing ({categories.length})
            </p>
            <ul className="divide-y divide-white/5 overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
              {categories.map((category) => (
                <li
                  key={category}
                  className="group flex items-center justify-between gap-3 px-3 py-2.5"
                >
                  <span className="truncate text-sm text-slate-200">{category}</span>
                  <button
                    type="button"
                    onClick={() => onRemove(category)}
                    aria-label={`Remove ${category}`}
                    title="Removes it from your custom list only"
                    className="rounded-lg p-1.5 text-slate-500 opacity-0 transition-opacity hover:bg-red-500/10 hover:text-red-300 focus-visible:opacity-100 group-hover:opacity-100"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            No categories yet. Add one above, or give a page a niche in My Pages.
          </p>
        )}
      </form>
    </Modal>
  )
}

import { useState } from 'react'
import { AlertTriangle, Download, Trash2 } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { Field, TextInput } from '../ui/Field'

/**
 * Permanent deletion, deliberately slow.
 * The user must archive first (enforced by the repository), read what
 * references the page, type its name, and may take a backup on the way out.
 */
export default function PurgePageModal({ page, references, onClose, onConfirm, onBackup }) {
  const [typed, setTyped] = useState('')
  const matches = page ? typed.trim() === page.name.trim() : false

  const close = () => {
    setTyped('')
    onClose()
  }

  return (
    <Modal
      open={Boolean(page)}
      onClose={close}
      size="sm"
      title="Delete page permanently?"
      description="This cannot be undone."
      footer={
        <>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button
            variant="danger"
            icon={Trash2}
            disabled={!matches}
            onClick={() => {
              onConfirm(page)
              setTyped('')
            }}
          >
            Delete permanently
          </Button>
        </>
      }
    >
      {page ? (
        <div className="flex flex-col gap-4 text-sm">
          <div className="flex gap-3 rounded-xl border border-red-500/25 bg-red-500/[0.06] p-4">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-300" aria-hidden="true" />
            <div className="leading-relaxed text-slate-300">
              <p>
                <span className="font-semibold text-white">{page.name}</span> and its page record
                will be erased from this browser.
              </p>
              {references.known ? (
                references.total > 0 ? (
                  <p className="mt-2 text-slate-400">
                    It is referenced by{' '}
                    <span className="font-medium text-amber-300">{references.lines.join(', ')}</span>
                    . Those records are <span className="font-medium text-slate-200">kept</span>,
                    but they will show “Deleted page” instead of a name.
                  </p>
                ) : (
                  <p className="mt-2 text-slate-400">Nothing else references this page.</p>
                )
              ) : (
                <p className="mt-2 text-slate-400">
                  Related records in other modules are kept. Any that reference this page will show
                  “Deleted page” instead of a name.
                </p>
              )}
              <p className="mt-2 text-slate-400">
                Restoring it instead keeps every reference intact.
              </p>
            </div>
          </div>

          {onBackup ? (
            <Button variant="secondary" size="sm" icon={Download} onClick={onBackup}>
              Download a backup of my pages first
            </Button>
          ) : null}

          <Field
            label={`Type “${page.name}” to confirm`}
            htmlFor="purge-confirm"
            hint="Case and spacing must match."
          >
            <TextInput
              id="purge-confirm"
              value={typed}
              onChange={(event) => setTyped(event.target.value)}
              placeholder={page.name}
              autoComplete="off"
            />
          </Field>
        </div>
      ) : null}
    </Modal>
  )
}

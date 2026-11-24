import { useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, Download, FileJson, Upload } from 'lucide-react'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import Badge from '../ui/Badge'
import {
  buildExportFilename,
  downloadSettings,
  parseImportPayload,
  readFileAsText,
} from '../../lib/settingsStorage'

/**
 * Export the current settings to a JSON file, or import one back.
 * Entirely local: a Blob download and a file input, no network, no dependency.
 */
export default function SettingsTransfer({ settings, onImport }) {
  const inputRef = useRef(null)
  const [error, setError] = useState(null)
  const [pending, setPending] = useState(null) // validated import awaiting confirmation
  const [notice, setNotice] = useState(null)

  const exportNow = () => {
    setError(null)
    const fileName = buildExportFilename()
    if (downloadSettings(settings)) {
      setNotice(`Downloaded ${fileName}`)
    } else {
      setNotice(null)
      setError('The download could not be started.')
    }
  }

  const pickFile = () => {
    setError(null)
    setNotice(null)
    inputRef.current?.click()
  }

  const onFileChange = async (event) => {
    const file = event.target.files?.[0]
    // Reset the input so re-picking the same file fires another change event.
    event.target.value = ''
    if (!file) return

    setError(null)
    setNotice(null)

    let text
    try {
      text = await readFileAsText(file)
    } catch (readError) {
      setError(readError.message)
      return
    }

    const result = parseImportPayload(text)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setPending({ ...result, fileName: file.name })
  }

  const applyImport = () => {
    if (!pending) return
    onImport?.(pending.values)
    setNotice(
      `Imported ${pending.applied.length} preference${pending.applied.length === 1 ? '' : 's'} from ${pending.fileName}`,
    )
    setPending(null)
  }

  return (
    <>
      <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-slate-200">Export / import settings</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Save your preferences to a JSON file, or restore them from one. Only settings are
              included — no pages, imports, research or calendar data.
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="secondary" size="sm" icon={Download} onClick={exportNow}>
              Export
            </Button>
            <Button variant="secondary" size="sm" icon={Upload} onClick={pickFile}>
              Import
            </Button>
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          onChange={onFileChange}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />

        {error ? (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs leading-relaxed text-red-300"
          >
            <AlertTriangle className="mt-px size-3.5 shrink-0" aria-hidden="true" />
            <span>
              Import failed: {error} Nothing was changed.
            </span>
          </p>
        ) : null}

        {notice ? (
          <p
            role="status"
            className="flex items-start gap-2 rounded-lg border border-accent-500/30 bg-accent-500/10 px-3 py-2 text-xs leading-relaxed text-accent-200"
          >
            <CheckCircle2 className="mt-px size-3.5 shrink-0" aria-hidden="true" />
            <span>{notice}</span>
          </p>
        ) : null}
      </div>

      <Modal
        open={!!pending}
        onClose={() => setPending(null)}
        title="Apply imported settings?"
        description={pending?.fileName}
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setPending(null)}>
              Cancel
            </Button>
            <Button icon={Upload} onClick={applyImport}>
              Apply settings
            </Button>
          </>
        }
      >
        {pending ? (
          <div className="flex flex-col gap-4 text-sm">
            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <FileJson className="mt-0.5 size-4 shrink-0 text-accent-300" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-slate-200">
                  {pending.applied.length} preference
                  {pending.applied.length === 1 ? '' : 's'} will be applied.
                </p>
                {pending.meta.exportedAt ? (
                  <p className="mt-1 text-xs text-slate-500">
                    Exported {new Date(pending.meta.exportedAt).toLocaleString()}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {pending.applied.map((key) => (
                <Badge key={key} tone="success">
                  {key}
                </Badge>
              ))}
            </div>

            {pending.ignored.length > 0 ? (
              <div>
                <p className="text-xs text-slate-500">
                  Ignored as unknown or invalid: {pending.ignored.join(', ')}
                </p>
              </div>
            ) : null}

            <p className="text-xs leading-relaxed text-slate-500">
              Anything missing from the file falls back to its default. Your pages, imports,
              research and calendar data are untouched.
            </p>
          </div>
        ) : null}
      </Modal>
    </>
  )
}

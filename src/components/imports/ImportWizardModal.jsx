import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Info, Layers, UploadCloud } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import { Field, Select, TextInput } from '../ui/Field'
import CsvDropzone from './CsvDropzone'
import CsvPreview from './CsvPreview'
import { usePages } from '../../context/PagesContext'
import {
  CANONICAL_FIELDS,
  IGNORE_FIELD,
  IMPORT_INSTRUCTIONS,
  SAMPLE_PREVIEW,
  buildSuggestedMapping,
} from '../../constants/csvImport'

const INITIAL = { pageId: '', periodStart: '', periodEnd: '' }

export default function ImportWizardModal({ open, onClose, onComplete }) {
  const { pages } = usePages()
  const [step, setStep] = useState('configure')
  const [values, setValues] = useState(INITIAL)
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [mapping, setMapping] = useState({})

  // Suggested mapping is derived once per detected header set.
  const suggested = useMemo(() => buildSuggestedMapping(SAMPLE_PREVIEW.headers), [])

  useEffect(() => {
    if (!open) return
    setStep('configure')
    setValues(INITIAL)
    setFile(null)
    setErrors({})
    setMapping(suggested)
  }, [open, suggested])

  const pageOptions = pages.map((page) => ({
    value: page.id,
    label: page.platform ? `${page.name} · ${page.platform}` : page.name,
  }))

  const setField = (key) => (event) => {
    const { value } = event.target
    setValues((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  const goToPreview = () => {
    const next = {}
    if (!values.pageId) next.pageId = 'Select the page this report belongs to.'
    if (!file) next.file = 'Choose a CSV file to continue.'
    if (values.periodStart && values.periodEnd && values.periodEnd < values.periodStart) {
      next.periodEnd = 'End date cannot be before the start date.'
    }
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }
    setStep('preview')
  }

  const missingRequired = CANONICAL_FIELDS.filter(
    (field) => field.required && !Object.values(mapping).includes(field.key),
  )

  const handleComplete = () => {
    const page = pages.find((item) => item.id === values.pageId)
    const total = SAMPLE_PREVIEW.detectedRows
    // Mock outcome: a few rows fail validation so the status UI is exercised.
    const invalidRows = Math.round(total * 0.05)

    onComplete({
      filename: file?.name ?? 'import.csv',
      fileSize: file?.size ?? 0,
      pageId: page?.id ?? null,
      pageName: page?.name ?? 'Unknown page',
      platform: page?.platform ?? '',
      periodStart: values.periodStart,
      periodEnd: values.periodEnd,
      totalRows: total,
      validRows: total - invalidRows,
      invalidRows,
      status: invalidRows > 0 ? 'partial' : 'completed',
      mapping,
      mappedColumns: Object.values(mapping).filter((value) => value !== IGNORE_FIELD).length,
    })
  }

  const hasPages = pages.length > 0

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={step === 'configure' ? 'Import CSV' : 'Review and map columns'}
      description={
        step === 'configure'
          ? 'Attach a Facebook analytics export to one of your pages.'
          : 'Confirm how the detected columns map onto CreatorPulse fields.'
      }
      footer={
        step === 'configure' ? (
          <>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={goToPreview} icon={ArrowRight} disabled={!hasPages}>
              Continue to preview
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" icon={ArrowLeft} onClick={() => setStep('configure')}>
              Back
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              icon={UploadCloud}
              onClick={handleComplete}
              disabled={missingRequired.length > 0}
            >
              Upload import
            </Button>
          </>
        )
      }
    >
      {step === 'configure' ? (
        <div className="space-y-5">
          {!hasPages ? (
            <div className="flex flex-col items-start gap-3 rounded-2xl border border-amber-500/25 bg-amber-500/[0.07] p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-amber-200">
                <Layers className="size-4" aria-hidden="true" />
                No pages available yet
              </p>
              <p className="text-xs leading-relaxed text-amber-200/80">
                An import is always attached to a page. Create a page first, then come back.
              </p>
              <Button as={Link} to="/pages" size="sm" variant="secondary" onClick={onClose}>
                Go to My Pages
              </Button>
            </div>
          ) : (
            <Field label="Destination page" htmlFor="import-page" required error={errors.pageId}>
              <Select
                id="import-page"
                value={values.pageId}
                onChange={setField('pageId')}
                placeholder="Select a page"
                options={pageOptions}
                error={errors.pageId}
              />
            </Field>
          )}

          <Field label="CSV file" required error={undefined}>
            <CsvDropzone
              file={file}
              error={errors.file}
              onSelect={(next) => {
                setFile(next)
                setErrors((prev) => ({ ...prev, file: undefined }))
              }}
              onClear={() => setFile(null)}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Report period start" htmlFor="period-start" hint="Optional">
              <TextInput
                id="period-start"
                type="date"
                value={values.periodStart}
                onChange={setField('periodStart')}
              />
            </Field>
            <Field
              label="Report period end"
              htmlFor="period-end"
              hint="Optional"
              error={errors.periodEnd}
            >
              <TextInput
                id="period-end"
                type="date"
                value={values.periodEnd}
                onChange={setField('periodEnd')}
                error={errors.periodEnd}
              />
            </Field>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="mb-2.5 flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Info className="size-4 text-glow-400" aria-hidden="true" />
              Before you import
            </p>
            <ul className="space-y-1.5 text-xs leading-relaxed text-slate-400">
              {IMPORT_INSTRUCTIONS.map((instruction) => (
                <li key={instruction} className="flex gap-2">
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent-400" aria-hidden="true" />
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <CsvPreview
          preview={SAMPLE_PREVIEW}
          mapping={mapping}
          suggested={suggested}
          onMappingChange={(header, value) =>
            setMapping((prev) => ({ ...prev, [header]: value }))
          }
        />
      )}
    </Modal>
  )
}

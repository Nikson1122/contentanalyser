import { useState } from 'react'
import {
  CheckCircle2,
  Database,
  FileSpreadsheet,
  Upload,
  XCircle,
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import StatCard from '../components/ui/StatCard'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import ImportWizardModal from '../components/imports/ImportWizardModal'
import ImportHistoryTable from '../components/imports/ImportHistoryTable'
import { useImports } from '../context/ImportsContext'
import { IMPORT_STATUS, formatFileSize } from '../constants/csvImport'

export default function CsvImports() {
  const { imports, stats, addImport, updateImport, removeImport } = useImports()
  const [wizardOpen, setWizardOpen] = useState(false)
  const [viewing, setViewing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)

  const handleComplete = (record) => {
    addImport(record)
    setWizardOpen(false)
  }

  // Mock status transition: processing, then settles back to its outcome.
  const handleReprocess = (record) => {
    const previous = record.status
    updateImport(record.id, { status: 'processing' })
    setTimeout(() => updateImport(record.id, { status: previous }), 1600)
  }

  const confirmDelete = () => {
    if (pendingDelete) removeImport(pendingDelete.id)
    setPendingDelete(null)
  }

  const hasImports = imports.length > 0
  const viewingStatus = viewing ? IMPORT_STATUS[viewing.status] ?? IMPORT_STATUS.processing : null

  return (
    <>
      <PageHeader
        eyebrow="CSV Imports"
        title="CSV Imports"
        description="Bring your Facebook page analytics exports into CreatorPulse. Each import is attached to one of your pages and its detected columns are mapped onto canonical fields before the data lands."
        actions={
          <Button icon={Upload} onClick={() => setWizardOpen(true)}>
            Import CSV
          </Button>
        }
      />

      {/* Summaries */}
      <section aria-labelledby="import-summary">
        <h2 id="import-summary" className="mb-4 text-sm font-semibold tracking-wide text-slate-300">
          Summary
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total imports" value={stats.total} icon={FileSpreadsheet} tone="accent" />
          <StatCard
            label="Successful"
            value={stats.successful}
            icon={CheckCircle2}
            tone="success"
            hint="Completed without errors"
          />
          <StatCard
            label="Failed"
            value={stats.failed}
            icon={XCircle}
            tone="danger"
            hint="Needs attention"
          />
          <StatCard
            label="Rows imported"
            value={stats.rows.toLocaleString()}
            icon={Database}
            tone="info"
            hint="Valid rows across imports"
          />
        </div>
      </section>

      {/* History */}
      <section aria-labelledby="import-history">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2
            id="import-history"
            className="text-sm font-semibold tracking-wide text-slate-300"
          >
            Recent import history
          </h2>
          {hasImports ? (
            <p className="text-xs text-slate-500">
              {imports.length} {imports.length === 1 ? 'import' : 'imports'}
            </p>
          ) : null}
        </div>

        {hasImports ? (
          <ImportHistoryTable
            records={imports}
            onView={setViewing}
            onReprocess={handleReprocess}
            onDelete={setPendingDelete}
          />
        ) : (
          <EmptyState
            icon={FileSpreadsheet}
            title="No imports yet"
            description="Upload a Facebook analytics export to get started. You'll be able to review the detected columns and adjust the mapping before anything is imported."
            action={
              <Button icon={Upload} onClick={() => setWizardOpen(true)}>
                Import CSV
              </Button>
            }
          />
        )}
      </section>

      <ImportWizardModal
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onComplete={handleComplete}
      />

      {/* Detail drawer */}
      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title="Import details"
        description={viewing?.filename}
        footer={
          <Button variant="secondary" onClick={() => setViewing(null)}>
            Close
          </Button>
        }
      >
        {viewing ? (
          <dl className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            {[
              ['Page', viewing.pageName],
              ['Platform', viewing.platform || '—'],
              ['File size', formatFileSize(viewing.fileSize)],
              ['Total rows', viewing.totalRows?.toLocaleString()],
              ['Valid rows', viewing.validRows?.toLocaleString()],
              ['Invalid rows', viewing.invalidRows?.toLocaleString()],
              ['Mapped columns', viewing.mappedColumns],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4 px-4 py-3">
                <dt className="text-xs uppercase tracking-wider text-slate-500">{label}</dt>
                <dd className="text-sm font-medium text-slate-200">{value ?? '—'}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 px-4 py-3">
              <dt className="text-xs uppercase tracking-wider text-slate-500">Status</dt>
              <dd>
                <Badge tone={viewingStatus.tone} dot>
                  {viewingStatus.label}
                </Badge>
              </dd>
            </div>
          </dl>
        ) : null}
      </Modal>

      {/* Delete confirm */}
      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        size="sm"
        title="Delete import"
        description="This removes the import record from your history."
        footer={
          <>
            <Button variant="secondary" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-300">
          Delete <span className="font-semibold text-white">{pendingDelete?.filename}</span>? You
          can import the file again at any time.
        </p>
      </Modal>
    </>
  )
}

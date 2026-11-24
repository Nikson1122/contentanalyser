import { CloudOff, Database, HardDrive, Laptop, RotateCcw, ShieldCheck } from 'lucide-react'
import SettingsSection from './SettingsSection'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import SettingsTransfer from './SettingsTransfer'
import { SETTINGS_STORAGE_KEY } from '../../lib/settingsStorage'

const FACTS = [
  {
    icon: Laptop,
    title: 'Local-first by design',
    body: 'Your preferences are written to this browser only. Nothing is uploaded.',
  },
  {
    icon: CloudOff,
    title: 'No backend or sync',
    body: 'There is no server, database, account or external API behind this workspace.',
  },
  {
    icon: ShieldCheck,
    title: 'Settings are isolated',
    body: 'Settings own a single storage key. Pages, imports, research and calendar data are never read or written by it.',
  },
  {
    icon: Database,
    title: 'Module data is session-only',
    body: 'Pages, CSV imports, competitors, generated content and calendar items still live in memory and clear on reload.',
  },
]

function formatSavedAt(iso) {
  if (!iso) return 'Not saved yet'
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return 'Unknown'
  }
}

export default function DataSettings({
  settings,
  savedAt,
  storageAvailable = true,
  atDefaults,
  onReset,
  onImport,
}) {
  return (
    <>
      <SettingsSection
        icon={HardDrive}
        title="Data management"
        description="Where your workspace data lives."
      >
        {FACTS.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4"
          >
            <Icon className="mt-0.5 size-4 shrink-0 text-accent-300" aria-hidden="true" />
            <div className="min-w-0">
              <h3 className="text-sm font-medium text-slate-200">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{body}</p>
            </div>
          </div>
        ))}
      </SettingsSection>

      <SettingsSection
        icon={Database}
        title="Settings storage"
        description="The single browser entry your preferences are kept in."
        columns={1}
      >
        <dl className="divide-y divide-white/5">
          <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400 sm:w-40 sm:shrink-0">
              Storage key
            </dt>
            <dd className="break-all font-mono text-sm text-slate-200">{SETTINGS_STORAGE_KEY}</dd>
          </div>
          <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400 sm:w-40 sm:shrink-0">
              Mechanism
            </dt>
            <dd className="text-sm text-slate-200">Browser localStorage</dd>
          </div>
          <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400 sm:w-40 sm:shrink-0">
              Status
            </dt>
            <dd className="text-sm">
              {storageAvailable ? (
                <Badge tone="success" dot>
                  Available
                </Badge>
              ) : (
                <Badge tone="danger" dot>
                  Unavailable — changes apply this session only
                </Badge>
              )}
            </dd>
          </div>
          <div className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400 sm:w-40 sm:shrink-0">
              Last saved
            </dt>
            <dd className="text-sm text-slate-200">{formatSavedAt(savedAt)}</dd>
          </div>
        </dl>

        <SettingsTransfer settings={settings} onImport={onImport} />

        <div className="flex flex-col gap-3 rounded-xl border border-red-500/25 bg-red-500/[0.04] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h3 className="text-sm font-medium text-slate-200">Reset settings</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Restores every preference to its default and removes the stored entry above. No other
              application data is affected.
            </p>
          </div>
          <Button
            variant="danger"
            icon={RotateCcw}
            onClick={onReset}
            disabled={atDefaults}
            className="shrink-0"
          >
            Reset settings
          </Button>
        </div>
      </SettingsSection>
    </>
  )
}

import { Info } from 'lucide-react'
import SettingsSection from './SettingsSection'
import Badge from '../ui/Badge'
import { APP_NAME, APP_VERSION } from '../../constants/settings'

const ROWS = [
  { label: 'Application', value: APP_NAME },
  { label: 'Version', value: APP_VERSION },
  { label: 'Stack', value: 'React 19 · Vite 7 · Tailwind CSS 4 · React Router 7' },
  { label: 'Architecture', value: 'Local-first — no backend, database or auth' },
]

export default function AboutSettings() {
  return (
    <SettingsSection
      icon={Info}
      title="About"
      description="Build details for this workspace."
      columns={1}
    >
      <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br from-accent-400/25 to-glow-500/15 text-sm font-bold text-accent-200">
          CP
        </span>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">{APP_NAME}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            Content research and intelligence workspace
          </p>
        </div>
        <Badge tone="info" className="ml-auto shrink-0">
          v{APP_VERSION}
        </Badge>
      </div>

      <dl className="divide-y divide-white/5">
        {ROWS.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400 sm:w-40 sm:shrink-0">
              {label}
            </dt>
            <dd className="text-sm text-slate-200">{value}</dd>
          </div>
        ))}
      </dl>
    </SettingsSection>
  )
}

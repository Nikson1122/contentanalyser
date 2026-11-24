import { ArchiveRestore, Trash2 } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'

/** One archived page: original name preserved, clearly marked, restorable. */
export default function ArchivedPageRow({ page, onRestore, onPurge }) {
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-bold text-slate-400">
          {page.name?.trim().charAt(0).toUpperCase() || '?'}
        </span>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-300">
            <span className="truncate">{page.name}</span>
            <Badge tone="neutral">Archived</Badge>
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {[page.platform, page.niche].filter(Boolean).join(' · ') || 'No details'}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <Button variant="secondary" size="sm" icon={ArchiveRestore} onClick={() => onRestore(page)}>
          Restore
        </Button>
        <Button variant="danger" size="sm" icon={Trash2} onClick={() => onPurge(page)}>
          Delete permanently
        </Button>
      </div>
    </li>
  )
}

import { CalendarDays, Clock, Eye, Film, Layers, Link2, Trash2, Upload } from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import {
  ANALYSIS_STATUSES,
  formatDate,
  formatDuration,
  formatFileSize,
} from '../../constants/videoLab'

/** Thumbnail stand-in: a local preview when we have one, else a gradient tile. */
function Thumbnail({ video }) {
  if (video.previewUrl) {
    return (
      <video
        src={video.previewUrl}
        preload="metadata"
        muted
        className="aspect-video w-full rounded-xl bg-black object-cover"
      />
    )
  }
  return (
    <div className="flex aspect-video w-full items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-surface-800 to-surface-950">
      <Film className="size-6 text-slate-600" aria-hidden="true" />
    </div>
  )
}

function Meta({ icon: Icon, children }) {
  if (!children) return null
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-[11px] text-slate-400">
      <Icon className="size-3 shrink-0" aria-hidden="true" />
      <span className="truncate">{children}</span>
    </span>
  )
}

export default function RecentVideosList({ videos, onViewAnalysis, onDelete }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {videos.map((video) => {
        const status = ANALYSIS_STATUSES[video.status] ?? ANALYSIS_STATUSES.pending
        const canView = video.status === 'analyzed' && video.analysis

        return (
          <article key={video.id} className="card sheen flex flex-col gap-3 p-4">
            <div className="relative">
              <Thumbnail video={video} />
              <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-slate-200 backdrop-blur-sm">
                {formatDuration(video.duration)}
              </span>
              <span className="absolute left-2 top-2 flex items-center gap-1 rounded-md bg-black/70 px-1.5 py-0.5 text-[10px] text-slate-300 backdrop-blur-sm">
                {video.source === 'url' ? (
                  <Link2 className="size-2.5" aria-hidden="true" />
                ) : (
                  <Upload className="size-2.5" aria-hidden="true" />
                )}
                {video.source === 'url' ? 'Source URL' : 'Upload'}
              </span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <h3 className="min-w-0 flex-1 truncate text-sm font-semibold text-white" title={video.title}>
                {video.title}
              </h3>
              <Badge tone={status.tone} dot className="shrink-0">
                {status.label}
              </Badge>
            </div>

            <div className="flex flex-col gap-1.5">
              <Meta icon={Layers}>
                {video.niche ? `${video.pageName} · ${video.niche}` : video.pageName}
              </Meta>
              <Meta icon={CalendarDays}>Added {formatDate(video.addedAt)}</Meta>
              {video.fileSize ? <Meta icon={Clock}>{formatFileSize(video.fileSize)}</Meta> : null}
            </div>

            <div className="mt-auto flex items-center gap-2 border-t border-white/5 pt-3">
              <Button
                size="sm"
                variant="secondary"
                icon={Eye}
                onClick={() => onViewAnalysis(video)}
                disabled={!canView}
                title={canView ? undefined : 'No analysis stored for this video'}
              >
                View Analysis
              </Button>
              <button
                type="button"
                onClick={() => onDelete(video)}
                aria-label={`Remove ${video.title}`}
                className="ml-auto rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-300"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>
          </article>
        )
      })}
    </div>
  )
}

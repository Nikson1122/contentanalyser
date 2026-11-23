import {
  CalendarDays,
  ExternalLink,
  Eye,
  Heart,
  Pencil,
  StickyNote,
  Tag,
  Trash2,
} from 'lucide-react'
import Badge from '../ui/Badge'
import { formatDate, formatMetric, normalizeUrl } from '../../constants/competitors'

function Meta({ icon: Icon, children, title }) {
  return (
    <span
      title={title}
      className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-xs text-slate-300"
    >
      <Icon className="size-3.5 text-slate-400" aria-hidden="true" />
      {children}
    </span>
  )
}

export default function ResearchPostList({ posts, onEdit, onDelete }) {
  return (
    <ul className="space-y-3">
      {posts.map((post) => (
        <li
          key={post.id}
          className="group rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              {post.caption ? (
                <p className="text-sm font-medium leading-relaxed text-white">{post.caption}</p>
              ) : (
                <p className="text-sm italic text-slate-500">No caption recorded.</p>
              )}
              <a
                href={normalizeUrl(post.postUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-flex max-w-full items-center gap-1.5 text-xs text-glow-400 transition-colors hover:text-glow-400/80"
              >
                <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{post.postUrl}</span>
              </a>
            </div>

            <div className="flex shrink-0 gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => onEdit?.(post)}
                aria-label="Edit research post"
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <Pencil className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(post)}
                aria-label="Delete research post"
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge tone="info">{post.format}</Badge>
            {post.topic ? <Meta icon={Tag}>{post.topic}</Meta> : null}
            <Meta icon={Eye} title="Observed views">
              {formatMetric(post.views)} views
            </Meta>
            <Meta icon={Heart} title="Observed engagement">
              {formatMetric(post.engagement)} engagement
            </Meta>
            <Meta icon={CalendarDays} title="Observation date">
              {formatDate(post.observedAt)}
            </Meta>
          </div>

          {post.notes ? (
            <p className="mt-3 flex gap-2 rounded-xl border border-white/5 bg-black/20 p-3 text-xs leading-relaxed text-slate-400">
              <StickyNote className="mt-0.5 size-3.5 shrink-0 text-slate-500" aria-hidden="true" />
              {post.notes}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  )
}

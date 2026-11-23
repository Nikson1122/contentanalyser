import { CalendarDays, ExternalLink, FileStack, Pencil, Plus, Tag, Trash2 } from 'lucide-react'
import Badge from '../ui/Badge'
import ActionMenu from '../ui/ActionMenu'
import {
  PLATFORM_TONES,
  displayUrl,
  formatDate,
  normalizeUrl,
} from '../../constants/competitors'

export default function CreatorCard({
  creator,
  postCount = 0,
  onOpen,
  onEdit,
  onDelete,
  onAddPost,
}) {
  const initial = creator.name?.trim().charAt(0).toUpperCase() || '?'
  const href = normalizeUrl(creator.profileUrl)

  const menuItems = [
    { label: 'View profile', icon: ExternalLink, onClick: () => onOpen?.(creator) },
    { label: 'Add research post', icon: Plus, onClick: () => onAddPost?.(creator) },
    { label: 'Edit creator', icon: Pencil, onClick: () => onEdit?.(creator) },
    { label: 'Delete creator', icon: Trash2, onClick: () => onDelete?.(creator), danger: true },
  ]

  return (
    <article className="card sheen group flex flex-col gap-4 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-500/35 hover:shadow-2xl hover:shadow-accent-500/10">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br from-accent-400/25 to-glow-500/15 text-sm font-bold text-accent-200">
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => onOpen?.(creator)}
            className="block max-w-full truncate text-left text-sm font-semibold text-white transition-colors hover:text-accent-300"
          >
            {creator.name}
          </button>
          <p className="mt-0.5 truncate text-xs text-slate-500">{creator.platform}</p>
        </div>
        <ActionMenu items={menuItems} label={`Actions for ${creator.name}`} />
      </div>

      {creator.description ? (
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-400">{creator.description}</p>
      ) : (
        <p className="text-sm italic text-slate-600">No description added.</p>
      )}

      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 truncate text-xs text-glow-400 transition-colors hover:text-glow-400/80"
        >
          <ExternalLink className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{displayUrl(creator.profileUrl)}</span>
        </a>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center gap-2">
        <Badge tone={PLATFORM_TONES[creator.platform] ?? 'neutral'} dot>
          {creator.platform}
        </Badge>
        {creator.niche ? (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-xs text-slate-300">
            <Tag className="size-3.5 text-slate-400" aria-hidden="true" />
            {creator.niche}
          </span>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/5 pt-3 text-xs text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays className="size-3.5" aria-hidden="true" />
          Added {formatDate(creator.addedAt)}
        </span>
        <button
          type="button"
          onClick={() => onOpen?.(creator)}
          className="inline-flex items-center gap-1.5 font-medium text-slate-400 transition-colors hover:text-accent-300"
        >
          <FileStack className="size-3.5" aria-hidden="true" />
          {postCount} {postCount === 1 ? 'post' : 'posts'}
        </button>
      </div>
    </article>
  )
}

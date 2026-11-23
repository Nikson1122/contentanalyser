import { Globe2, Languages, Pencil, Tag, Trash2 } from 'lucide-react'

function Meta({ icon: Icon, children }) {
  if (!children) return null
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-xs text-slate-300">
      <Icon className="size-3.5 text-slate-400" aria-hidden="true" />
      {children}
    </span>
  )
}

export default function PageCard({ page, onEdit, onDelete }) {
  const initial = page.name?.trim().charAt(0).toUpperCase() || '?'

  return (
    <article className="card sheen group flex flex-col gap-4 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-500/35 hover:shadow-2xl hover:shadow-accent-500/10">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br from-accent-400/25 to-glow-500/15 text-sm font-bold text-accent-200 shadow-lg shadow-accent-500/10">
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-white">{page.name}</h3>
          <p className="mt-0.5 truncate text-xs text-slate-500">{page.platform}</p>
        </div>
        <div className="flex gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
          <button
            type="button"
            onClick={() => onEdit?.(page)}
            aria-label={`Edit ${page.name}`}
            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <Pencil className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => onDelete?.(page)}
            aria-label={`Remove ${page.name}`}
            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {page.description ? (
        <p className="line-clamp-3 text-sm leading-relaxed text-slate-400">{page.description}</p>
      ) : (
        <p className="text-sm italic text-slate-600">No description added yet.</p>
      )}

      <div className="mt-auto flex flex-wrap gap-2">
        <Meta icon={Tag}>{page.niche}</Meta>
        <Meta icon={Languages}>{page.language}</Meta>
        <Meta icon={Globe2}>{page.platform}</Meta>
      </div>
    </article>
  )
}

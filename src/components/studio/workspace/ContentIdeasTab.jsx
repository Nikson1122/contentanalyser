import { Bookmark, BookmarkCheck, Clapperboard, Clock, Eye, Megaphone, Pencil, Tag, Wand2 } from 'lucide-react'
import Badge from '../../ui/Badge'
import Button from '../../ui/Button'
import EmptyState from '../../ui/EmptyState'

function Meta({ icon: Icon, children }) {
  if (!children) return null
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-xs text-slate-300">
      <Icon className="size-3.5 text-slate-400" aria-hidden="true" />
      {children}
    </span>
  )
}

export default function ContentIdeasTab({
  ideas,
  selectedIdeaId,
  onView,
  onEdit,
  onToggleSave,
  onSelect,
}) {
  if (!ideas.length) {
    return (
      <EmptyState
        icon={Wand2}
        title="No ideas in this set"
        description="Regenerate the demonstration to produce a fresh set of content ideas."
      />
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {ideas.map((idea) => {
        const selected = idea.id === selectedIdeaId
        return (
          <article
            key={idea.id}
            className={`flex flex-col gap-3 rounded-2xl border p-4 transition-colors ${
              selected
                ? 'border-accent-500/40 bg-accent-500/[0.06]'
                : 'border-white/10 bg-white/[0.02] hover:border-white/20'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-sm font-semibold leading-snug text-white">{idea.title}</h4>
              <div className="flex shrink-0 items-center gap-1.5">
                {selected ? <Badge tone="success">Selected</Badge> : null}
                <button
                  type="button"
                  onClick={() => onToggleSave(idea.id)}
                  aria-label={idea.saved ? `Unsave ${idea.title}` : `Save ${idea.title}`}
                  title={idea.saved ? 'Saved' : 'Save idea'}
                  className={`rounded-lg p-1.5 transition-colors ${
                    idea.saved
                      ? 'text-accent-300 hover:bg-accent-500/10'
                      : 'text-slate-500 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {idea.saved ? (
                    <BookmarkCheck className="size-4" aria-hidden="true" />
                  ) : (
                    <Bookmark className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-400">{idea.description}</p>

            <div className="flex flex-wrap gap-2">
              <Meta icon={Tag}>{idea.category}</Meta>
              <Meta icon={Clapperboard}>{idea.format}</Meta>
              <Meta icon={Clock}>{idea.duration}</Meta>
            </div>

            {/* Hook preview — read-only generated text, flat panel */}
            <div className="rounded-xl border border-white/5 bg-black/20 p-3">
              <p className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <Megaphone className="size-3" aria-hidden="true" />
                Hook preview
              </p>
              <p className="text-xs leading-relaxed text-slate-300">{idea.hook}</p>
            </div>

            <div className="mt-auto flex flex-wrap gap-2 border-t border-white/5 pt-3">
              <Button size="sm" variant="ghost" icon={Eye} onClick={() => onView(idea)}>
                View details
              </Button>
              <Button size="sm" variant="ghost" icon={Pencil} onClick={() => onEdit(idea)}>
                Edit
              </Button>
              <Button
                size="sm"
                variant={selected ? 'secondary' : 'primary'}
                onClick={() => onSelect(idea.id)}
                className="ml-auto"
                disabled={selected}
              >
                {selected ? 'In development' : 'Develop script'}
              </Button>
            </div>
          </article>
        )
      })}
    </div>
  )
}

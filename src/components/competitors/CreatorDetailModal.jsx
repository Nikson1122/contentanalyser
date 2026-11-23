import { ExternalLink, FileStack, Pencil, Plus, StickyNote } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import EmptyState from '../ui/EmptyState'
import ResearchPostList from './ResearchPostList'
import {
  PLATFORM_TONES,
  displayUrl,
  formatDate,
  normalizeUrl,
} from '../../constants/competitors'

/** Creator detail view: profile summary plus their saved research posts. */
export default function CreatorDetailModal({
  open,
  creator,
  posts = [],
  onClose,
  onEdit,
  onAddPost,
  onEditPost,
  onDeletePost,
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={creator?.name ?? 'Creator'}
      description={creator ? `${creator.platform} · Added ${formatDate(creator.addedAt)}` : null}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="secondary" icon={Pencil} onClick={() => onEdit?.(creator)}>
            Edit creator
          </Button>
          <Button icon={Plus} onClick={() => onAddPost?.(creator)}>
            Add research post
          </Button>
        </>
      }
    >
      {creator ? (
        <div className="space-y-6">
          {/* Profile summary */}
          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={PLATFORM_TONES[creator.platform] ?? 'neutral'} dot>
                {creator.platform}
              </Badge>
              {creator.niche ? <Badge tone="neutral">{creator.niche}</Badge> : null}
              <Badge tone="neutral" icon={FileStack}>
                {posts.length} researched {posts.length === 1 ? 'post' : 'posts'}
              </Badge>
            </div>

            <a
              href={normalizeUrl(creator.profileUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full items-center gap-1.5 text-sm text-glow-400 transition-colors hover:text-glow-400/80"
            >
              <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{displayUrl(creator.profileUrl)}</span>
            </a>

            {creator.description ? (
              <p className="text-sm leading-relaxed text-slate-300">{creator.description}</p>
            ) : null}

            {creator.notes ? (
              <p className="flex gap-2 rounded-xl border border-white/5 bg-black/20 p-3 text-xs leading-relaxed text-slate-400">
                <StickyNote
                  className="mt-0.5 size-3.5 shrink-0 text-slate-500"
                  aria-hidden="true"
                />
                {creator.notes}
              </p>
            ) : null}
          </div>

          {/* Research posts */}
          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-200">Research posts</h3>
              {posts.length > 0 ? (
                <Button size="sm" variant="secondary" icon={Plus} onClick={() => onAddPost?.(creator)}>
                  Add post
                </Button>
              ) : null}
            </div>

            {posts.length > 0 ? (
              <ResearchPostList posts={posts} onEdit={onEditPost} onDelete={onDeletePost} />
            ) : (
              <EmptyState
                icon={FileStack}
                title="No research posts yet"
                description="Record a post you want to learn from — its format, topic, the numbers you observed and your own notes."
                action={
                  <Button icon={Plus} onClick={() => onAddPost?.(creator)}>
                    Add research post
                  </Button>
                }
              />
            )}
          </section>
        </div>
      ) : null}
    </Modal>
  )
}

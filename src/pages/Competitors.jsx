import { useMemo, useState } from 'react'
import { Plus, Search, Telescope, UserPlus } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { Select } from '../components/ui/Field'
import CreatorCard from '../components/competitors/CreatorCard'
import CreatorFormModal from '../components/competitors/CreatorFormModal'
import CreatorDetailModal from '../components/competitors/CreatorDetailModal'
import ResearchPostFormModal from '../components/competitors/ResearchPostFormModal'
import { useCompetitors } from '../context/CompetitorsContext'
import { COMPETITOR_PLATFORMS } from '../constants/competitors'

const ALL = '__all__'

export default function Competitors() {
  const {
    creators,
    niches,
    postCounts,
    getPosts,
    addCreator,
    updateCreator,
    removeCreator,
    addPost,
    updatePost,
    removePost,
  } = useCompetitors()

  const [query, setQuery] = useState('')
  const [platform, setPlatform] = useState(ALL)
  const [niche, setNiche] = useState(ALL)

  const [creatorForm, setCreatorForm] = useState({ open: false, creator: null })
  const [detailId, setDetailId] = useState(null)
  const [postForm, setPostForm] = useState({ open: false, creatorId: null, post: null })
  const [pendingCreatorDelete, setPendingCreatorDelete] = useState(null)
  const [pendingPostDelete, setPendingPostDelete] = useState(null)

  // Detail reads live from state so edits show immediately.
  const detailCreator = creators.find((creator) => creator.id === detailId) ?? null
  const detailPosts = detailId ? getPosts(detailId) : []

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    return creators.filter((creator) => {
      if (platform !== ALL && creator.platform !== platform) return false
      if (niche !== ALL && creator.niche !== niche) return false
      if (!term) return true
      return [creator.name, creator.platform, creator.niche, creator.description, creator.profileUrl]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term))
    })
  }, [creators, query, platform, niche])

  const handleCreatorSubmit = (values) => {
    if (creatorForm.creator) updateCreator(creatorForm.creator.id, values)
    else addCreator(values)
    setCreatorForm({ open: false, creator: null })
  }

  const handlePostSubmit = (values) => {
    const { creatorId, post } = postForm
    if (post) updatePost(creatorId, post.id, values)
    else addPost(creatorId, values)
    setPostForm({ open: false, creatorId: null, post: null })
  }

  const confirmCreatorDelete = () => {
    if (pendingCreatorDelete) {
      if (detailId === pendingCreatorDelete.id) setDetailId(null)
      removeCreator(pendingCreatorDelete.id)
    }
    setPendingCreatorDelete(null)
  }

  const confirmPostDelete = () => {
    if (pendingPostDelete) removePost(pendingPostDelete.creatorId, pendingPostDelete.post.id)
    setPendingPostDelete(null)
  }

  const hasCreators = creators.length > 0
  const filtersActive = platform !== ALL || niche !== ALL || query.trim() !== ''

  return (
    <>
      <PageHeader
        eyebrow="Competitor Research"
        title="Competitor Research"
        description="Track creators in your categories and keep a manual research library of the posts worth learning from."
        actions={
          <Button icon={UserPlus} onClick={() => setCreatorForm({ open: true, creator: null })}>
            Add Creator
          </Button>
        }
      />

      {hasCreators ? (
        <>
          {/* Search + filters */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-72">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search creators"
                  aria-label="Search creators"
                  className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 transition-colors hover:border-white/20 focus:border-accent-500/60 focus:bg-white/[0.07]"
                />
              </div>

              <Select
                aria-label="Filter by platform"
                value={platform}
                onChange={(event) => setPlatform(event.target.value)}
                options={[
                  { value: ALL, label: 'All platforms' },
                  ...COMPETITOR_PLATFORMS.map((item) => ({ value: item, label: item })),
                ]}
                className="sm:w-44"
              />

              <Select
                aria-label="Filter by niche"
                value={niche}
                onChange={(event) => setNiche(event.target.value)}
                options={[
                  { value: ALL, label: 'All niches' },
                  ...niches.map((item) => ({ value: item, label: item })),
                ]}
                className="sm:w-44"
              />
            </div>

            <p className="text-xs text-slate-500">
              {filtered.length} of {creators.length}{' '}
              {creators.length === 1 ? 'creator' : 'creators'}
            </p>
          </div>

          {filtered.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((creator) => (
                <CreatorCard
                  key={creator.id}
                  creator={creator}
                  postCount={postCounts[creator.id] ?? 0}
                  onOpen={() => setDetailId(creator.id)}
                  onEdit={() => setCreatorForm({ open: true, creator })}
                  onDelete={() => setPendingCreatorDelete(creator)}
                  onAddPost={() =>
                    setPostForm({ open: true, creatorId: creator.id, post: null })
                  }
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Search}
              title="No creators match"
              description="Nothing matches the current search and filters."
              action={
                filtersActive ? (
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setQuery('')
                      setPlatform(ALL)
                      setNiche(ALL)
                    }}
                  >
                    Clear filters
                  </Button>
                ) : null
              }
            />
          )}
        </>
      ) : (
        <EmptyState
          icon={Telescope}
          title="No creators tracked yet"
          description="Add the creators you want to study. For each one you can keep a library of research posts with the formats, topics and numbers you observed."
          action={
            <Button icon={Plus} onClick={() => setCreatorForm({ open: true, creator: null })}>
              Add Creator
            </Button>
          }
        />
      )}

      <CreatorFormModal
        open={creatorForm.open}
        creator={creatorForm.creator}
        onClose={() => setCreatorForm({ open: false, creator: null })}
        onSubmit={handleCreatorSubmit}
      />

      <CreatorDetailModal
        open={Boolean(detailCreator)}
        creator={detailCreator}
        posts={detailPosts}
        onClose={() => setDetailId(null)}
        onEdit={(creator) => setCreatorForm({ open: true, creator })}
        onAddPost={(creator) => setPostForm({ open: true, creatorId: creator.id, post: null })}
        onEditPost={(post) => setPostForm({ open: true, creatorId: detailId, post })}
        onDeletePost={(post) => setPendingPostDelete({ creatorId: detailId, post })}
      />

      <ResearchPostFormModal
        open={postForm.open}
        post={postForm.post}
        creatorName={creators.find((creator) => creator.id === postForm.creatorId)?.name}
        onClose={() => setPostForm({ open: false, creatorId: null, post: null })}
        onSubmit={handlePostSubmit}
      />

      <Modal
        open={Boolean(pendingCreatorDelete)}
        onClose={() => setPendingCreatorDelete(null)}
        size="sm"
        title="Delete creator"
        description="This also removes their research posts."
        footer={
          <>
            <Button variant="secondary" onClick={() => setPendingCreatorDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmCreatorDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-300">
          Delete <span className="font-semibold text-white">{pendingCreatorDelete?.name}</span> and
          their {postCounts[pendingCreatorDelete?.id] ?? 0} research{' '}
          {(postCounts[pendingCreatorDelete?.id] ?? 0) === 1 ? 'post' : 'posts'}?
        </p>
      </Modal>

      <Modal
        open={Boolean(pendingPostDelete)}
        onClose={() => setPendingPostDelete(null)}
        size="sm"
        title="Delete research post"
        description="This removes the observation from your library."
        footer={
          <>
            <Button variant="secondary" onClick={() => setPendingPostDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmPostDelete}>
              Delete
            </Button>
          </>
        }
      >
        <p className="truncate text-sm text-slate-300">
          Delete this {pendingPostDelete?.post?.format?.toLowerCase() ?? ''} observation?
        </p>
      </Modal>
    </>
  )
}

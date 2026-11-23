import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, Flame, Search } from 'lucide-react'
import Badge from '../ui/Badge'
import EmptyState from '../ui/EmptyState'
import Button from '../ui/Button'
import { Select } from '../ui/Field'
import { CONTENT_TYPES, POST_SORT_FIELDS, formatDate } from '../../constants/analytics'

const ALL = '__all__'

const TYPE_TONES = {
  Reel: 'accent',
  Image: 'info',
  Video: 'warning',
  Text: 'neutral',
}

/** Sortable metric header. */
function SortHeader({ field, label, sortBy, order, onSort }) {
  const active = sortBy === field
  const Icon = !active ? ArrowUpDown : order === 'desc' ? ArrowDown : ArrowUp

  return (
    <th scope="col" className="whitespace-nowrap px-4 py-3.5 text-right font-semibold">
      <button
        type="button"
        onClick={() => onSort(field)}
        aria-label={`Sort by ${label}`}
        className={`inline-flex items-center gap-1.5 transition-colors ${
          active ? 'text-accent-300' : 'hover:text-slate-200'
        }`}
      >
        {label}
        <Icon className="size-3.5" aria-hidden="true" />
      </button>
    </th>
  )
}

/**
 * Top-performing posts table.
 * `posts` follows the shape a mapped CSV import would produce, so this
 * component needs no change when real data replaces the demo generator.
 */
export default function TopPostsTable({ posts }) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState(ALL)
  const [sortBy, setSortBy] = useState('views')
  const [order, setOrder] = useState('desc')

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase()
    const filtered = posts.filter((post) => {
      if (type !== ALL && post.type !== type) return false
      return !term || post.caption.toLowerCase().includes(term)
    })
    const direction = order === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => (a[sortBy] - b[sortBy]) * direction)
  }, [posts, query, type, sortBy, order])

  // Highest value on the active metric — used for the subtle "Top" marker.
  const peak = useMemo(
    () => visible.reduce((max, post) => Math.max(max, post[sortBy]), 0),
    [visible, sortBy],
  )

  const handleSort = (field) => {
    if (field === sortBy) setOrder((value) => (value === 'desc' ? 'asc' : 'desc'))
    else {
      setSortBy(field)
      setOrder('desc')
    }
  }

  const filtersActive = query.trim() !== '' || type !== ALL

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full sm:w-72">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search captions"
            aria-label="Search post captions"
            className="h-10 w-full rounded-xl border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 transition-colors hover:border-white/20 focus:border-accent-500/60 focus:bg-white/[0.07]"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select
            aria-label="Filter by content type"
            value={type}
            onChange={(event) => setType(event.target.value)}
            options={[
              { value: ALL, label: 'All content types' },
              ...CONTENT_TYPES.map((item) => ({ value: item, label: item })),
            ]}
            className="sm:w-44"
          />
          <Select
            aria-label="Sort by"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            options={POST_SORT_FIELDS.map((field) => ({
              value: field.key,
              label: `Sort by ${field.label}`,
            }))}
            className="sm:w-48"
          />
          <Select
            aria-label="Sort order"
            value={order}
            onChange={(event) => setOrder(event.target.value)}
            options={[
              { value: 'desc', label: 'Highest first' },
              { value: 'asc', label: 'Lowest first' },
            ]}
            className="sm:w-40"
          />
        </div>
      </div>

      {visible.length > 0 ? (
        <>
          <div className="card sheen">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[52rem] text-left text-sm">
                <thead className="border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th scope="col" className="px-4 py-3.5 font-semibold">
                      Post content
                    </th>
                    <th scope="col" className="whitespace-nowrap px-4 py-3.5 font-semibold">
                      Post date
                    </th>
                    <th scope="col" className="whitespace-nowrap px-4 py-3.5 font-semibold">
                      Content type
                    </th>
                    {POST_SORT_FIELDS.map((field) => (
                      <SortHeader
                        key={field.key}
                        field={field.key}
                        label={field.label}
                        sortBy={sortBy}
                        order={order}
                        onSort={handleSort}
                      />
                    ))}
                    <th scope="col" className="whitespace-nowrap px-4 py-3.5 text-right font-semibold">
                      Shares
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {visible.map((post) => {
                    const isPeak = peak > 0 && post[sortBy] === peak
                    return (
                      <tr key={post.id} className="transition-colors hover:bg-white/[0.03]">
                        <td className="px-4 py-3.5">
                          <div className="flex items-start gap-2">
                            <p
                              className="max-w-[22rem] truncate font-medium text-slate-100"
                              title={post.caption}
                            >
                              {post.caption}
                            </p>
                            {isPeak ? (
                              <Badge tone="success" icon={Flame} className="shrink-0">
                                Top
                              </Badge>
                            ) : null}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-slate-400">
                          {formatDate(post.date)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5">
                          <Badge tone={TYPE_TONES[post.type] ?? 'neutral'}>{post.type}</Badge>
                        </td>
                        <td
                          className={`px-4 py-3.5 text-right tabular-nums ${
                            sortBy === 'views' ? 'font-semibold text-white' : 'text-slate-200'
                          }`}
                        >
                          {post.views.toLocaleString()}
                        </td>
                        <td
                          className={`px-4 py-3.5 text-right tabular-nums ${
                            sortBy === 'reach' ? 'font-semibold text-white' : 'text-slate-200'
                          }`}
                        >
                          {post.reach.toLocaleString()}
                        </td>
                        <td
                          className={`px-4 py-3.5 text-right tabular-nums ${
                            sortBy === 'engagement' ? 'font-semibold text-white' : 'text-slate-200'
                          }`}
                        >
                          {post.engagement.toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 text-right tabular-nums text-slate-400">
                          {post.shares.toLocaleString()}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <p className="px-1 text-xs text-slate-500">
            Showing {visible.length} of {posts.length} posts · sorted by{' '}
            {POST_SORT_FIELDS.find((field) => field.key === sortBy)?.label.toLowerCase()},{' '}
            {order === 'desc' ? 'highest first' : 'lowest first'}
          </p>
        </>
      ) : (
        <EmptyState
          icon={Search}
          title={posts.length === 0 ? 'No posts to rank' : 'No posts match'}
          description={
            posts.length === 0
              ? 'Once posts are available for this page and period, the best performers will be ranked here.'
              : 'Nothing matches the current caption search and content-type filter.'
          }
          action={
            filtersActive ? (
              <Button
                variant="secondary"
                onClick={() => {
                  setQuery('')
                  setType(ALL)
                }}
              >
                Clear filters
              </Button>
            ) : null
          }
        />
      )}
    </div>
  )
}

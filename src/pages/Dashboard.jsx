import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Circle,
  FileSpreadsheet,
  History,
  Layers,
  Plus,
  Sparkles,
  Telescope,
} from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import { usePages } from '../context/PagesContext'

const QUICK_ACTIONS = [
  {
    title: 'Add a page',
    description: 'Register a social page and describe its niche.',
    to: '/pages',
    icon: Layers,
  },
  {
    title: 'Import data',
    description: 'Bring in historical performance exports.',
    to: '/imports',
    icon: FileSpreadsheet,
  },
  {
    title: 'Research competitors',
    description: 'Track what works in your categories.',
    to: '/competitors',
    icon: Telescope,
  },
  {
    title: 'Open Content Studio',
    description: 'Draft and refine content ideas.',
    to: '/studio',
    icon: Sparkles,
  },
]

export default function Dashboard() {
  const { pages } = usePages()
  const hasPages = pages.length > 0

  const checklist = [
    { label: 'Create your first page', done: hasPages, to: '/pages' },
    { label: 'Import performance data', done: false, to: '/imports' },
    { label: 'Add competitors to watch', done: false, to: '/competitors' },
    { label: 'Generate your first draft', done: false, to: '/studio' },
  ]

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Welcome to CreatorPulse AI"
        description="Your content research workspace. Start by adding the pages you manage — everything else builds on top of them."
        actions={
          <Button as={Link} to="/pages" icon={Plus}>
            Add new page
          </Button>
        }
      />

      {/* Page overview */}
      <section aria-labelledby="pages-overview">
        <h2 id="pages-overview" className="mb-4 text-sm font-semibold text-white">
          Your pages
        </h2>
        {hasPages ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">Pages managed</p>
              <p className="mt-2 text-2xl font-semibold text-white">{pages.length}</p>
            </div>
            <div className="card p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">Platforms</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {new Set(pages.map((page) => page.platform).filter(Boolean)).size}
              </p>
            </div>
            <div className="card p-5">
              <p className="text-xs uppercase tracking-wide text-slate-500">Niches</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {new Set(pages.map((page) => page.niche).filter(Boolean)).size}
              </p>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Layers}
            title="No pages yet"
            description="Once you add a page, its niche, platform and language will shape the research and insights you see here."
            action={
              <Button as={Link} to="/pages" icon={Plus}>
                Add your first page
              </Button>
            }
          />
        )}
      </section>

      {/* Quick actions */}
      <section aria-labelledby="quick-actions">
        <h2 id="quick-actions" className="mb-4 text-sm font-semibold text-white">
          Quick actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {QUICK_ACTIONS.map(({ title, description, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="card group flex flex-col gap-3 p-5 transition-colors hover:border-accent-500/30"
            >
              <span className="flex size-10 items-center justify-center rounded-lg border border-accent-500/20 bg-accent-500/10 text-accent-400">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{description}</p>
              </div>
              <span className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-accent-400 opacity-0 transition-opacity group-hover:opacity-100">
                Open
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent activity */}
        <section aria-labelledby="recent-activity" className="lg:col-span-3">
          <h2 id="recent-activity" className="mb-4 text-sm font-semibold text-white">
            Recent activity
          </h2>
          <EmptyState
            icon={History}
            title="Nothing to show yet"
            description="Imports, research runs and generated drafts will appear here as you work."
          />
        </section>

        {/* Getting started */}
        <section aria-labelledby="getting-started" className="lg:col-span-2">
          <h2 id="getting-started" className="mb-4 text-sm font-semibold text-white">
            Getting started
          </h2>
          <ol className="card divide-y divide-white/5">
            {checklist.map(({ label, done, to }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="flex items-center gap-3 px-5 py-4 text-sm transition-colors hover:bg-white/5"
                >
                  {done ? (
                    <CheckCircle2 className="size-4 shrink-0 text-accent-400" aria-hidden="true" />
                  ) : (
                    <Circle className="size-4 shrink-0 text-slate-600" aria-hidden="true" />
                  )}
                  <span className={done ? 'text-slate-500 line-through' : 'text-slate-200'}>
                    {label}
                  </span>
                  <ArrowRight className="ml-auto size-3.5 text-slate-600" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ol>
          <p className="mt-3 flex items-center gap-2 px-1 text-xs text-slate-500">
            <BarChart3 className="size-3.5" aria-hidden="true" />
            Analytics unlock once a page has data.
          </p>
        </section>
      </div>
    </>
  )
}

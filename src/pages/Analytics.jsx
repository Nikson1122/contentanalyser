import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart3, FlaskConical, Layers, MousePointerClick } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import MetricCard from '../components/ui/MetricCard'
import AnalyticsToolbar from '../components/analytics/AnalyticsToolbar'
import ChartCard from '../components/analytics/ChartCard'
import TimeSeriesChart from '../components/analytics/TimeSeriesChart'
import TopPostsTable from '../components/analytics/TopPostsTable'
import { usePages } from '../context/PagesContext'
import {
  DATE_RANGES,
  METRICS,
  SERIES,
  buildDemoAnalytics,
  buildDemoTopPosts,
} from '../constants/analytics'

/** Day count for the active range; custom ranges derive from the chosen dates. */
function resolveDays(range, customRange) {
  if (range !== 'custom') {
    return DATE_RANGES.find((item) => item.key === range)?.days ?? 28
  }
  const { start, end } = customRange
  if (!start || !end) return 28
  const span = Math.round((new Date(end) - new Date(start)) / 86400000) + 1
  return Number.isFinite(span) && span > 1 ? Math.min(span, 365) : 28
}

export default function Analytics() {
  const { pages } = usePages()
  const [pageId, setPageId] = useState('')
  const [range, setRange] = useState('28d')
  const [customRange, setCustomRange] = useState({ start: '', end: '' })
  const [nonce, setNonce] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  const selectedPage = pages.find((page) => page.id === pageId) ?? null
  const days = resolveDays(range, customRange)

  // Demonstration data, keyed to the selected page so each page has its own shape.
  const analytics = useMemo(
    () => (selectedPage ? buildDemoAnalytics({ days, seed: selectedPage.id, nonce }) : null),
    [selectedPage, days, nonce],
  )

  // Same demonstration source, shaped like mapped CSV import rows.
  const topPosts = useMemo(
    () => (selectedPage ? buildDemoTopPosts({ days, seed: selectedPage.id, nonce }) : []),
    [selectedPage, days, nonce],
  )

  const handleRefresh = () => {
    setRefreshing(true)
    setNonce((value) => value + 1)
    setTimeout(() => setRefreshing(false), 700)
  }

  const rangeLabel =
    range === 'custom' && customRange.start && customRange.end
      ? `${customRange.start} → ${customRange.end}`
      : `Last ${days} days`

  return (
    <>
      <PageHeader
        eyebrow="Analytics"
        title="Analytics"
        description="Understand your content performance."
        actions={
          <Badge tone="warning" icon={FlaskConical}>
            Demonstration data
          </Badge>
        }
      />

      <AnalyticsToolbar
        pages={pages}
        pageId={pageId}
        onPageChange={setPageId}
        range={range}
        onRangeChange={setRange}
        customRange={customRange}
        onCustomRangeChange={setCustomRange}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {!pages.length ? (
        <EmptyState
          icon={Layers}
          title="No pages to analyse"
          description="Analytics are scoped to a page. Create a page first, then come back to see its performance."
          action={
            <Button as={Link} to="/pages">
              Go to My Pages
            </Button>
          }
        />
      ) : !selectedPage ? (
        <EmptyState
          icon={MousePointerClick}
          title="Select a page to continue"
          description="Choose one of your pages from the selector above to load its performance overview."
        />
      ) : (
        <>
          {/* Metric cards */}
          <section aria-labelledby="analytics-metrics">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2
                id="analytics-metrics"
                className="text-sm font-semibold tracking-wide text-slate-300"
              >
                Performance metrics
              </h2>
              <p className="text-xs text-slate-500">
                {rangeLabel} · {analytics.summary.posts} posts
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {METRICS.map(({ key, label, icon, tone }) => (
                <MetricCard
                  key={key}
                  label={label}
                  value={analytics.summary[key].toLocaleString()}
                  delta={analytics.deltas[key]}
                  hint="vs. previous period"
                  icon={icon}
                  tone={tone}
                />
              ))}
            </div>
          </section>

          {/* Charts */}
          <section aria-labelledby="analytics-overview">
            <h2
              id="analytics-overview"
              className="mb-4 text-sm font-semibold tracking-wide text-slate-300"
            >
              Performance overview
            </h2>
            <div className="grid gap-4 xl:grid-cols-2">
              <ChartCard
                title="Views over time"
                subtitle={
                  analytics.bucketDays > 1
                    ? `${rangeLabel} · ${analytics.bucketDays}-day buckets`
                    : rangeLabel
                }
                seriesLabel="Views"
                seriesColor={SERIES.views}
              >
                <TimeSeriesChart
                  data={analytics.series}
                  dataKey="views"
                  name="views"
                  color={SERIES.views}
                  variant="line"
                />
              </ChartCard>

              <ChartCard
                title="Engagement over time"
                subtitle="Reactions, comments and shares combined"
                seriesLabel="Engagement"
                seriesColor={SERIES.engagement}
              >
                <TimeSeriesChart
                  data={analytics.series}
                  dataKey="engagement"
                  name="engagements"
                  color={SERIES.engagement}
                  variant="area"
                  gradientId="engagement-gradient"
                />
              </ChartCard>
            </div>
            <p className="mt-3 flex items-center gap-2 px-1 text-xs text-slate-500">
              <BarChart3 className="size-3.5" aria-hidden="true" />
              Figures shown are demonstration data for{' '}
              <span className="font-medium text-slate-400">{selectedPage.name}</span>, not derived
              from imported reports.
            </p>
          </section>

          {/* Top performing posts */}
          <section aria-labelledby="top-posts">
            <div className="mb-4">
              <h2 id="top-posts" className="text-sm font-semibold tracking-wide text-slate-300">
                Top Performing Posts
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Discover which posts are getting the best results.
              </p>
            </div>
            <TopPostsTable posts={topPosts} />
          </section>
        </>
      )}
    </>
  )
}

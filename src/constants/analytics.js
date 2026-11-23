import {
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Users,
} from 'lucide-react'

/**
 * Analytics demonstration data — UI only.
 * Nothing here is computed from a real import; the series are generated from a
 * deterministic seed so the charts are stable across renders.
 */

export const DATE_RANGES = [
  { key: '7d', label: '7 days', days: 7 },
  { key: '28d', label: '28 days', days: 28 },
  { key: '90d', label: '90 days', days: 90 },
  { key: 'custom', label: 'Custom', days: null },
]

/**
 * Series colors validated against the dark chart surface
 * (lightness band, chroma floor and >=3:1 contrast).
 */
export const SERIES = {
  views: '#0bae79',
  engagement: '#0a9fc0',
}

/** Metric card definitions — value keys resolve against the generated summary. */
export const METRICS = [
  { key: 'views', label: 'Total Views', icon: Eye, tone: 'accent' },
  { key: 'reach', label: 'Total Reach', icon: Users, tone: 'info' },
  { key: 'engagement', label: 'Total Engagement', icon: Heart, tone: 'accent' },
  { key: 'shares', label: 'Total Shares', icon: Share2, tone: 'info' },
  { key: 'comments', label: 'Total Comments', icon: MessageCircle, tone: 'neutral' },
  {
    key: 'avgViewsPerPost',
    label: 'Avg. Views Per Post',
    icon: TrendingUp,
    tone: 'accent',
  },
]

/** Small deterministic PRNG so a given seed always yields the same series. */
function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Hash a string into a seed, so each page gets its own stable shape. */
function hashSeed(value = '') {
  let hash = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

const dayLabel = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' })

/**
 * Build a demonstration time series plus its summary totals.
 * Longer ranges are bucketed so the x-axis never gets crowded.
 */
export function buildDemoAnalytics({ days = 28, seed = '', nonce = 0 } = {}) {
  const random = mulberry32(hashSeed(seed) + nonce * 7919)
  const bucketDays = days > 60 ? 7 : days > 28 ? 2 : 1
  const points = Math.max(2, Math.round(days / bucketDays))

  // Gentle upward drift with noise, so the shape reads like real growth.
  let base = 4200 + random() * 2600
  const series = []
  const today = new Date()

  for (let i = points - 1; i >= 0; i -= 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - i * bucketDays)

    base *= 0.97 + random() * 0.08
    const views = Math.round(base * bucketDays * (0.85 + random() * 0.3))
    const reach = Math.round(views * (0.68 + random() * 0.14))
    const reactions = Math.round(views * (0.045 + random() * 0.025))
    const comments = Math.round(views * (0.006 + random() * 0.005))
    const shares = Math.round(views * (0.009 + random() * 0.007))

    series.push({
      date: date.toISOString().slice(0, 10),
      label: dayLabel.format(date),
      views,
      reach,
      reactions,
      comments,
      shares,
      engagement: reactions + comments + shares,
    })
  }

  const sum = (key) => series.reduce((total, point) => total + point[key], 0)
  const posts = Math.max(1, Math.round(days * (0.6 + random() * 0.5)))
  const views = sum('views')

  // Demonstration period-over-period deltas.
  const half = Math.floor(series.length / 2)
  const delta = (key) => {
    if (half < 1) return null
    const previous = series.slice(0, half).reduce((t, p) => t + p[key], 0)
    const current = series.slice(half).reduce((t, p) => t + p[key], 0)
    if (!previous) return null
    return ((current - previous) / previous) * 100
  }

  return {
    series,
    bucketDays,
    summary: {
      views,
      reach: sum('reach'),
      engagement: sum('engagement'),
      shares: sum('shares'),
      comments: sum('comments'),
      avgViewsPerPost: Math.round(views / posts),
      posts,
    },
    deltas: {
      views: delta('views'),
      reach: delta('reach'),
      engagement: delta('engagement'),
      shares: delta('shares'),
      comments: delta('comments'),
      avgViewsPerPost: delta('views'),
    },
  }
}

export const compactNumber = new Intl.NumberFormat(undefined, {
  notation: 'compact',
  maximumFractionDigits: 1,
})

/* ------------------------------------------------------------------ *
 * Top-performing posts
 * ------------------------------------------------------------------ */

export const CONTENT_TYPES = ['Reel', 'Image', 'Video', 'Text']

/** Sortable metric columns. */
export const POST_SORT_FIELDS = [
  { key: 'views', label: 'Views' },
  { key: 'reach', label: 'Reach' },
  { key: 'engagement', label: 'Engagement' },
]

/**
 * Neutral placeholder captions of varying length, so the preview column's
 * truncation is visible. Deliberately generic — no invented brand content.
 */
const DEMO_CAPTIONS = [
  'Short demonstration caption',
  'A medium-length demonstration caption used to fill this row',
  'A deliberately long demonstration caption that runs past the column width so the preview truncation and tooltip behaviour are both visible in the table',
  'Demonstration caption with a question?',
  'Another demonstration caption for layout',
  'Placeholder caption text, medium length again',
]

/**
 * Demonstration post rows.
 *
 * Shape is the contract a real CSV import would fill, so this generator can be
 * swapped for mapped import rows without touching the table:
 *   { id, caption, date, type, views, reach, engagement, shares }
 */
export function buildDemoTopPosts({ days = 28, seed = '', nonce = 0, count = 12 } = {}) {
  const random = mulberry32(hashSeed(`posts:${seed}`) + nonce * 104729)
  const today = new Date()

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - Math.floor(random() * days))

    const views = Math.round(2400 + random() * 46000)
    const reach = Math.round(views * (0.62 + random() * 0.2))
    const reactions = Math.round(views * (0.035 + random() * 0.03))
    const comments = Math.round(views * (0.004 + random() * 0.006))
    const shares = Math.round(views * (0.006 + random() * 0.009))

    return {
      id: `demo-post-${index + 1}`,
      caption: DEMO_CAPTIONS[index % DEMO_CAPTIONS.length],
      date: date.toISOString().slice(0, 10),
      type: CONTENT_TYPES[Math.floor(random() * CONTENT_TYPES.length)],
      views,
      reach,
      engagement: reactions + comments + shares,
      shares,
    }
  })
}

const postDateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : postDateFormatter.format(date)
}

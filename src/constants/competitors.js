/**
 * Competitor research domain constants — UI only.
 * No creators, niches or statistics are seeded; everything is user-entered.
 */

export const COMPETITOR_PLATFORMS = ['Facebook', 'Instagram', 'YouTube', 'TikTok']

/** Generic content formats — not tied to any niche. */
export const CONTENT_FORMATS = [
  'Reel',
  'Short',
  'Long-form video',
  'Photo',
  'Carousel',
  'Story',
  'Text post',
  'Live',
  'Other',
]

export const EMPTY_CREATOR_FORM = {
  name: '',
  platform: '',
  profileUrl: '',
  niche: '',
  description: '',
  notes: '',
}

export const EMPTY_RESEARCH_POST_FORM = {
  postUrl: '',
  caption: '',
  format: '',
  topic: '',
  views: '',
  engagement: '',
  observedAt: '',
  notes: '',
}

/** Tint per platform so cards are scannable without hardcoding creators. */
export const PLATFORM_TONES = {
  Facebook: 'info',
  Instagram: 'warning',
  YouTube: 'danger',
  TikTok: 'neutral',
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

export function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

/** Format a user-entered metric; blank stays blank rather than becoming zero. */
export function formatMetric(value) {
  if (value === '' || value === null || value === undefined) return '—'
  const numeric = Number(value)
  return Number.isFinite(numeric) ? numeric.toLocaleString() : String(value)
}

/** Shorten a profile URL for display without losing what it points at. */
export function displayUrl(url) {
  if (!url) return '—'
  try {
    const parsed = new URL(url)
    const path = parsed.pathname.replace(/\/$/, '')
    return `${parsed.hostname.replace(/^www\./, '')}${path}`
  } catch {
    return url
  }
}

/** Accept a bare handle or domain by normalizing it to an https URL. */
export function normalizeUrl(url) {
  const trimmed = url.trim()
  if (!trimmed) return ''
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export function isValidUrl(url) {
  try {
    const parsed = new URL(normalizeUrl(url))
    return Boolean(parsed.hostname.includes('.'))
  } catch {
    return false
  }
}

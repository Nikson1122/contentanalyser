/**
 * CSV import domain constants — UI only.
 * No parsing happens anywhere; the preview below is a static fixture used to
 * demonstrate the mapping interface.
 */

/** Canonical fields the platform maps incoming columns onto. */
export const CANONICAL_FIELDS = [
  { key: 'postId', label: 'Post ID', required: true },
  { key: 'postUrl', label: 'Post URL' },
  { key: 'postDate', label: 'Post Date', required: true },
  { key: 'caption', label: 'Caption' },
  { key: 'postType', label: 'Post Type' },
  { key: 'views', label: 'Views' },
  { key: 'reach', label: 'Reach' },
  { key: 'impressions', label: 'Impressions' },
  { key: 'reactions', label: 'Reactions' },
  { key: 'comments', label: 'Comments' },
  { key: 'shares', label: 'Shares' },
  { key: 'watchTime', label: 'Watch Time' },
]

export const IGNORE_FIELD = '__ignore__'

/** Keyword hints used to auto-suggest a mapping for a detected column. */
const FIELD_HINTS = {
  postId: ['postid', 'id', 'permalinkid', 'postidentifier'],
  postUrl: ['url', 'permalink', 'link'],
  postDate: ['date', 'publishtime', 'publishedtime', 'created', 'time'],
  caption: ['caption', 'title', 'description', 'message', 'text'],
  postType: ['type', 'format', 'mediatype'],
  views: ['views', 'videoviews', 'plays'],
  reach: ['reach', 'peoplereached', 'uniqueusers'],
  impressions: ['impressions'],
  reactions: ['reactions', 'likes', 'likesandreactions'],
  comments: ['comments'],
  shares: ['shares', 'reshares'],
  watchTime: ['watchtime', 'minutesviewed', 'viewtime', 'secondsviewed'],
}

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '')

/**
 * Suggest a canonical field for a detected column header.
 * Exact normalized match wins, then longest keyword hint contained in the header.
 */
export function suggestField(header) {
  const normalized = normalize(header)
  if (!normalized) return IGNORE_FIELD

  for (const field of CANONICAL_FIELDS) {
    if (normalize(field.label) === normalized) return field.key
  }

  let best = { key: IGNORE_FIELD, score: 0 }
  for (const [key, hints] of Object.entries(FIELD_HINTS)) {
    for (const hint of hints) {
      if (normalized.includes(hint) && hint.length > best.score) {
        best = { key, score: hint.length }
      }
    }
  }
  return best.key
}

/** Build the initial header -> field mapping for a set of detected columns. */
export function buildSuggestedMapping(headers) {
  const used = new Set()
  return headers.reduce((mapping, header) => {
    const suggestion = suggestField(header)
    // Never auto-assign the same canonical field twice.
    const key = suggestion !== IGNORE_FIELD && !used.has(suggestion) ? suggestion : IGNORE_FIELD
    if (key !== IGNORE_FIELD) used.add(key)
    mapping[header] = key
    return mapping
  }, {})
}

export const IMPORT_STATUS = {
  completed: { label: 'Completed', tone: 'success' },
  partial: { label: 'Partial', tone: 'warning' },
  failed: { label: 'Failed', tone: 'danger' },
  processing: { label: 'Processing', tone: 'info' },
}

/**
 * Static stand-in for what a parsed Facebook export would look like.
 * Lets the mapping and preview UI be exercised without any file reading.
 */
export const SAMPLE_PREVIEW = {
  detectedRows: 248,
  headers: [
    'Post ID',
    'Permalink',
    'Publish time',
    'Description',
    'Post type',
    'Video views',
    'Reach',
    'Impressions',
    'Likes and reactions',
    'Comments',
    'Shares',
    'Minutes viewed',
  ],
  rows: [
    [
      '—',
      'https://facebook.com/…/posts/1',
      '2026-10-02 09:14',
      'Sample caption text from the export',
      'Reel',
      '18,204',
      '14,882',
      '21,330',
      '1,204',
      '86',
      '142',
      '3,980',
    ],
    [
      '—',
      'https://facebook.com/…/posts/2',
      '2026-10-04 18:40',
      'Second sample caption row',
      'Photo',
      '—',
      '9,415',
      '12,004',
      '742',
      '38',
      '55',
      '—',
    ],
    [
      '—',
      'https://facebook.com/…/posts/3',
      '2026-10-07 12:05',
      'Third sample caption row',
      'Video',
      '7,860',
      '6,233',
      '8,117',
      '389',
      '21',
      '27',
      '1,415',
    ],
    [
      '—',
      'https://facebook.com/…/posts/4',
      '2026-10-11 07:52',
      'Fourth sample caption row',
      'Reel',
      '31,002',
      '25,470',
      '33,918',
      '2,118',
      '164',
      '301',
      '6,742',
    ],
    [
      '—',
      'https://facebook.com/…/posts/5',
      '2026-10-15 20:18',
      'Fifth sample caption row',
      'Link',
      '—',
      '3,106',
      '4,002',
      '118',
      '9',
      '12',
      '—',
    ],
  ],
}

export const IMPORT_INSTRUCTIONS = [
  'Export your Facebook page analytics as CSV from Meta Business Suite.',
  'Keep the original column headers — they are matched automatically.',
  'One file per page, per reporting period.',
  'Maximum file size 20 MB.',
]

/** Human-readable file size from a byte count. */
export function formatFileSize(bytes) {
  if (!bytes && bytes !== 0) return '—'
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let size = bytes / 1024
  let unit = 0
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024
    unit += 1
  }
  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unit]}`
}

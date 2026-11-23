/**
 * Video Learning Lab constants — UI only.
 *
 * No video is uploaded, downloaded, fetched or processed anywhere. Previews are
 * rendered locally from the file the user picked; `buildDemoAnalysis` assembles
 * placeholder text from the configuration they chose.
 *
 * Video record shape, kept flat for a future API:
 *   { id, title, source: 'upload'|'url', url, fileSize, duration, pageId,
 *     pageName, niche, analysisType, language, status, addedAt, analysis }
 */

export const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm']
export const ACCEPTED_VIDEO_EXTENSIONS = ['.mp4', '.mov', '.webm']
export const MAX_VIDEO_MB = 200

export const INPUT_MODES = [
  { key: 'upload', label: 'Upload video' },
  { key: 'url', label: 'Video source' },
]

export const ANALYSIS_TYPES = [
  {
    key: 'full',
    label: 'Full Video Analysis',
    hint: 'Hook, story, scenes and visual style together',
  },
  { key: 'hook', label: 'Hook Analysis', hint: 'The opening seconds only' },
  { key: 'story', label: 'Storytelling Analysis', hint: 'Narrative structure and pacing' },
  { key: 'scene', label: 'Scene Analysis', hint: 'Shot-by-shot breakdown' },
  { key: 'visual', label: 'Visual Style Analysis', hint: 'Framing, color and motion' },
]

export const ANALYSIS_LANGUAGES = ['English', 'Nepali', 'Hindi', 'Spanish', 'Other']

export const ANALYSIS_STATUSES = {
  pending: { label: 'Not analyzed', tone: 'neutral' },
  processing: { label: 'Processing', tone: 'info' },
  analyzed: { label: 'Analyzed', tone: 'success' },
  failed: { label: 'Failed', tone: 'danger' },
}

export const EMPTY_LAB_CONFIG = {
  pageId: '',
  analysisType: 'full',
  language: 'English',
  notes: '',
}

/** Which result sections an analysis type produces. */
const SECTIONS_BY_TYPE = {
  full: ['hook', 'story', 'scene', 'visual', 'patterns'],
  hook: ['hook', 'patterns'],
  story: ['story', 'patterns'],
  scene: ['scene', 'patterns'],
  visual: ['visual', 'patterns'],
}

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

/** Seconds to m:ss, or h:mm:ss past an hour. */
export function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '—'
  const total = Math.round(seconds)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = total % 60
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`
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

/** Only http(s) URLs are accepted; nothing is ever fetched from them. */
export function isValidVideoUrl(value) {
  try {
    const parsed = new URL(value.trim())
    return (
      (parsed.protocol === 'http:' || parsed.protocol === 'https:') &&
      parsed.hostname.includes('.')
    )
  } catch {
    return false
  }
}

export function isAcceptedVideoFile(file) {
  if (!file) return false
  if (ACCEPTED_VIDEO_TYPES.includes(file.type)) return true
  const name = file.name?.toLowerCase() ?? ''
  return ACCEPTED_VIDEO_EXTENSIONS.some((extension) => name.endsWith(extension))
}

/**
 * Assemble a demonstration analysis from the chosen configuration.
 * Template text — NOT model output. Every surface labels it as a demonstration.
 */
export function buildDemoAnalysis({ config, videoTitle, niche }) {
  const type = ANALYSIS_TYPES.find((item) => item.key === config.analysisType)
  const subject = videoTitle || 'the selected video'
  const topicArea = niche || 'this niche'
  const keys = SECTIONS_BY_TYPE[config.analysisType] ?? SECTIONS_BY_TYPE.full

  const library = {
    hook: {
      key: 'hook',
      title: 'Hook breakdown',
      kind: 'timeline',
      items: [
        { at: '0:00 – 0:02', label: 'Cold open', text: `Placeholder observation about how ${subject} opens.` },
        { at: '0:02 – 0:05', label: 'Tension set', text: 'Placeholder note on what keeps the viewer watching.' },
        { at: '0:05 – 0:08', label: 'Promise', text: 'Placeholder note on the payoff being promised.' },
      ],
    },
    story: {
      key: 'story',
      title: 'Storytelling structure',
      kind: 'beats',
      items: [
        { label: 'Setup', text: 'Placeholder description of the setup beat.' },
        { label: 'Escalation', text: 'Placeholder description of how tension builds.' },
        { label: 'Turn', text: 'Placeholder description of the turning point.' },
        { label: 'Resolution', text: 'Placeholder description of the resolution.' },
      ],
    },
    scene: {
      key: 'scene',
      title: 'Scene breakdown',
      kind: 'scenes',
      items: Array.from({ length: 4 }, (_, index) => ({
        number: index + 1,
        at: `${index * 4}:00`.replace(/^(\d+):/, (_m, n) => `0:${String(Number(n) * 4).padStart(2, '0')}`),
        shot: index % 2 === 0 ? 'Placeholder: mid shot' : 'Placeholder: close up',
        text: `Placeholder description of what happens in scene ${index + 1}.`,
      })),
    },
    visual: {
      key: 'visual',
      title: 'Visual style',
      kind: 'attributes',
      items: [
        { label: 'Framing', text: 'Placeholder framing observation.' },
        { label: 'Color', text: 'Placeholder color and grade observation.' },
        { label: 'Motion', text: 'Placeholder camera motion observation.' },
        { label: 'Pacing', text: 'Placeholder cut-rate observation.' },
        { label: 'Text on screen', text: 'Placeholder caption-style observation.' },
        { label: 'Audio cues', text: 'Placeholder sound design observation.' },
      ],
    },
    patterns: {
      key: 'patterns',
      title: 'Patterns to reuse',
      kind: 'lines',
      items: [
        `Placeholder pattern 1 — a structural habit worth testing in ${topicArea}.`,
        'Placeholder pattern 2 — a pacing habit worth testing.',
        'Placeholder pattern 3 — a framing habit worth testing.',
      ],
    },
  }

  return {
    id: `demo-analysis-${Date.now()}`,
    createdAt: new Date().toISOString(),
    demo: true,
    config: {
      analysisType: type?.label ?? 'Full Video Analysis',
      language: config.language,
      notes: config.notes?.trim() ?? '',
      niche: niche || '',
    },
    sections: keys.map((key) => library[key]).filter(Boolean),
  }
}

/**
 * Demonstration video records, attached to the user's own pages.
 * Returns an empty list when there are no pages — no page names are invented.
 */
export function buildDemoVideos(pages) {
  if (!pages.length) return []
  const now = Date.now()
  const plan = [
    { seconds: 34, status: 'analyzed', daysAgo: 1, type: 'hook' },
    { seconds: 128, status: 'analyzed', daysAgo: 4, type: 'full' },
    { seconds: 57, status: 'processing', daysAgo: 6, type: 'scene' },
    { seconds: 212, status: 'pending', daysAgo: 9, type: 'story' },
  ]

  return plan.map((entry, index) => {
    const page = pages[index % pages.length]
    return {
      id: `demo-video-${index + 1}`,
      title: `Demonstration video ${index + 1}`,
      source: index % 2 === 0 ? 'upload' : 'url',
      url: '',
      fileSize: index % 2 === 0 ? 18_400_000 + index * 4_200_000 : null,
      duration: entry.seconds,
      pageId: page.id,
      pageName: page.name,
      niche: page.niche || '',
      analysisType: entry.type,
      language: 'English',
      status: entry.status,
      demo: true,
      addedAt: new Date(now - entry.daysAgo * 86400000).toISOString(),
      analysis: null,
    }
  })
}

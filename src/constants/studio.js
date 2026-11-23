/**
 * AI Content Studio constants — UI only.
 * No model is called anywhere; `buildDemoResult` assembles a clearly labelled
 * placeholder from the brief the user filled in.
 */

export const CONTENT_FORMATS = ['Reel', 'Short Video', 'Long Video', 'Image', 'Text']

export const LANGUAGES = ['English', 'Nepali', 'Other']

export const OBJECTIVES = ['Views', 'Engagement', 'Shares', 'Followers', 'Awareness']

export const TONES = [
  'Emotional',
  'Funny',
  'Educational',
  'Inspirational',
  'Storytelling',
  'Custom',
]

export const DURATIONS = ['15 sec', '30 sec', '60 sec', '90 sec', 'Custom']

export const CREATIVITY_LEVELS = [
  { value: 'Low', label: 'Low', hint: 'Stays close to the brief' },
  { value: 'Medium', label: 'Medium', hint: 'Balanced' },
  { value: 'High', label: 'High', hint: 'More experimental' },
]

/** Output sections, each gated by its own toggle. */
export const OUTPUT_TOGGLES = [
  {
    key: 'includeHook',
    label: 'Include hook',
    hint: 'An opening line to stop the scroll',
  },
  {
    key: 'includeScript',
    label: 'Include scene-by-scene script',
    hint: 'Shot list with narration per scene',
  },
  {
    key: 'includeVideoPrompts',
    label: 'Include AI video prompts',
    hint: 'Prompts to pass to a video generator',
  },
  {
    key: 'includeCaption',
    label: 'Include caption and hashtags',
    hint: 'Post copy plus tags',
  },
]

export const EMPTY_BRIEF = {
  pageId: '',
  category: '',
  format: '',
  language: '',
  objective: '',
  topic: '',
  instructions: '',
}

export const DEFAULT_SETTINGS = {
  tone: 'Educational',
  customTone: '',
  duration: '30 sec',
  customDuration: '',
  creativity: 'Medium',
  includeHook: true,
  includeScript: true,
  includeVideoPrompts: false,
  includeCaption: true,
}

/** Scene count scales with the requested duration. */
function sceneCountFor(duration) {
  const seconds = parseInt(duration, 10)
  if (!Number.isFinite(seconds)) return 4
  if (seconds <= 15) return 3
  if (seconds <= 30) return 4
  if (seconds <= 60) return 5
  return 6
}

/**
 * Assemble a demonstration result from the brief.
 *
 * This is template text built from the user's own inputs — it is NOT model
 * output, and every consumer labels it as a demonstration.
 */
export function buildDemoResult({ brief, settings, pageName }) {
  const topic = brief.topic.trim() || 'your chosen topic'
  const tone = settings.tone === 'Custom' ? settings.customTone.trim() || 'custom' : settings.tone
  const duration =
    settings.duration === 'Custom'
      ? settings.customDuration.trim()
        ? `${settings.customDuration.trim()} sec`
        : 'custom length'
      : settings.duration

  const scenes = Array.from({ length: sceneCountFor(duration) }, (_, index) => ({
    number: index + 1,
    beat:
      index === 0
        ? 'Open on the problem'
        : index === 1
          ? 'Introduce the turn'
          : index === 2
            ? 'Show the method'
            : 'Build toward the payoff',
    direction: `Placeholder shot direction for scene ${index + 1} — describes framing and on-screen action for "${topic}".`,
    narration: `Placeholder narration line ${index + 1}, written in a ${tone.toLowerCase()} tone.`,
  }))

  const sections = []

  if (settings.includeHook) {
    sections.push({
      key: 'hook',
      title: 'Hook',
      kind: 'lines',
      items: [
        `Placeholder hook option 1 for "${topic}" — ${tone.toLowerCase()} opening.`,
        `Placeholder hook option 2 for "${topic}" — question-led opening.`,
        `Placeholder hook option 3 for "${topic}" — contrast-led opening.`,
      ],
    })
  }

  if (settings.includeScript) {
    sections.push({ key: 'script', title: 'Scene-by-scene script', kind: 'scenes', scenes })
  }

  if (settings.includeVideoPrompts) {
    sections.push({
      key: 'prompts',
      title: 'AI video prompts',
      kind: 'prompts',
      items: scenes.map((scene) => ({
        label: `Scene ${scene.number}`,
        text: `Placeholder video prompt for scene ${scene.number}: subject, setting, camera move and lighting for "${topic}". Replace with a real prompt before use.`,
      })),
    })
  }

  if (settings.includeCaption) {
    sections.push({
      key: 'caption',
      title: 'Caption and hashtags',
      kind: 'caption',
      caption: `Placeholder caption for "${topic}", written for ${brief.objective.toLowerCase() || 'your objective'} in ${brief.language || 'your language'}.`,
      hashtags: ['#placeholder', '#demo', '#sample', '#example', '#notrealoutput'],
    })
  }

  return {
    id: `demo-${Date.now()}`,
    createdAt: new Date().toISOString(),
    demo: true,
    summary: {
      page: pageName,
      category: brief.category,
      format: brief.format,
      language: brief.language,
      objective: brief.objective,
      tone,
      duration,
      creativity: settings.creativity,
      topic: brief.topic.trim(),
    },
    sections,
  }
}

/* ------------------------------------------------------------------ *
 * Generated Content Workspace (Part 2)
 * ------------------------------------------------------------------ */

export const WORKSPACE_TABS = [
  { key: 'ideas', label: 'Content Ideas' },
  { key: 'script', label: 'Video Script' },
  { key: 'scenes', label: 'Scene Breakdown' },
  { key: 'prompts', label: 'AI Video Prompts' },
  { key: 'caption', label: 'Caption & Hashtags' },
]

/** Editable script sections, in running order. */
export const SCRIPT_SECTIONS = [
  { key: 'title', label: 'Video title', rows: 2, hint: 'The working title for this video.' },
  { key: 'hook', label: 'Opening hook', rows: 3, hint: 'The first line. Earns the next five seconds.' },
  { key: 'introduction', label: 'Introduction', rows: 3, hint: 'Set up what the viewer is about to get.' },
  { key: 'story', label: 'Main storytelling section', rows: 6, hint: 'The substance of the video.' },
  { key: 'emotionalMoment', label: 'Emotional / engagement moment', rows: 4, hint: 'The beat that earns a reaction.' },
  { key: 'closing', label: 'Closing section', rows: 3, hint: 'Land the point.' },
  { key: 'cta', label: 'Call to action', rows: 2, hint: 'What should the viewer do next?' },
]

/** Editable fields on a single scene. */
export const SCENE_FIELDS = [
  { key: 'visual', label: 'Visual description', rows: 3 },
  { key: 'narration', label: 'Narration / dialogue', rows: 3 },
  { key: 'camera', label: 'Camera direction', rows: 2 },
  { key: 'transition', label: 'Transition suggestion', rows: 2 },
]

/** Editable fields on a single AI video prompt card. */
export const PROMPT_FIELDS = [
  { key: 'visual', label: 'Visual generation prompt', rows: 4, mono: true },
  { key: 'camera', label: 'Camera movement', rows: 2, mono: true },
  { key: 'lighting', label: 'Lighting and atmosphere', rows: 2, mono: true },
  { key: 'style', label: 'Style instructions', rows: 2, mono: true },
]

const DEMO_IDEA_ANGLES = [
  { angle: 'Problem-first', description: 'Opens on the obstacle, then resolves it step by step.' },
  { angle: 'Myth-versus-fact', description: 'Names a common assumption, then corrects it.' },
  { angle: 'Before-and-after', description: 'Shows the contrast, then explains the gap.' },
  { angle: 'Walkthrough', description: 'Takes the viewer through the process in order.' },
]

const DURATION_BY_FORMAT = {
  Reel: '30 sec',
  'Short Video': '45 sec',
  'Long Video': '3-5 min',
  Image: 'n/a',
  Text: 'n/a',
}

function makeId(prefix) {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? `${prefix}-${crypto.randomUUID()}`
    : `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

/** An empty scene, ready for the user to fill in. */
export function createEmptyScene(number) {
  return {
    id: makeId('scene'),
    number,
    duration: '5 sec',
    visual: '',
    narration: '',
    camera: '',
    transition: '',
  }
}

/** A prompt card seeded from a scene. */
export function createPromptForScene(scene, topic = 'the topic') {
  return {
    id: makeId('prompt'),
    sceneId: scene.id,
    sceneNumber: scene.number,
    visual: `Placeholder visual prompt for scene ${scene.number}: describe the subject, setting and action for "${topic}". Replace before use.`,
    camera: 'Placeholder camera movement — e.g. slow push in, handheld follow.',
    lighting: 'Placeholder lighting and atmosphere — e.g. soft daylight, warm practical lights.',
    style: 'Placeholder style instructions — e.g. documentary realism, 35mm, shallow depth of field.',
  }
}

/**
 * Assemble the demonstration workspace from the brief.
 *
 * Template text built from the user's own inputs — NOT model output.
 * Every surface that renders this labels it as a demonstration.
 */
export function buildDemoWorkspace({ brief, settings }) {
  const topic = brief.topic.trim() || 'your chosen topic'
  const category = brief.category || 'your category'
  const format = brief.format || 'Reel'
  const tone =
    settings.tone === 'Custom' ? settings.customTone.trim() || 'custom' : settings.tone
  const duration =
    settings.duration === 'Custom'
      ? settings.customDuration.trim()
        ? `${settings.customDuration.trim()} sec`
        : DURATION_BY_FORMAT[format] || '30 sec'
      : settings.duration

  const totalSeconds = parseInt(duration, 10)
  const sceneCount = !Number.isFinite(totalSeconds)
    ? 4
    : totalSeconds <= 15
      ? 3
      : totalSeconds <= 30
        ? 4
        : totalSeconds <= 60
          ? 5
          : 6
  const perScene = Number.isFinite(totalSeconds)
    ? `${Math.max(3, Math.round(totalSeconds / sceneCount))} sec`
    : '8 sec'

  const ideas = DEMO_IDEA_ANGLES.map(({ angle, description }, index) => ({
    id: makeId('idea'),
    title: `${angle} take on "${topic}"`,
    description: `${description} Placeholder description for a ${format.toLowerCase()} in a ${tone.toLowerCase()} tone.`,
    category,
    format,
    duration: index === 0 ? duration : DURATION_BY_FORMAT[format] || duration,
    hook: `Placeholder hook — a ${angle.toLowerCase()} opening line about ${topic}.`,
    saved: false,
  }))

  const sceneBeats = [
    'Open on the problem',
    'Introduce the turn',
    'Show the method',
    'Build the payoff',
    'Land the result',
    'Close and redirect',
  ]

  const scenes = Array.from({ length: sceneCount }, (_, index) => ({
    id: makeId('scene'),
    number: index + 1,
    duration: perScene,
    visual: `Placeholder visual description for scene ${index + 1} — ${sceneBeats[index] ?? 'continue the sequence'}, framed for "${topic}".`,
    narration: `Placeholder narration for scene ${index + 1}, written in a ${tone.toLowerCase()} tone.`,
    camera: index % 2 === 0 ? 'Placeholder: static mid shot' : 'Placeholder: slow push in',
    transition: index === sceneCount - 1 ? 'Hold on final frame' : 'Placeholder: hard cut',
  }))

  return {
    id: makeId('workspace'),
    createdAt: new Date().toISOString(),
    demo: true,
    meta: { topic, category, format, duration, tone, creativity: settings.creativity },
    ideas,
    selectedIdeaId: ideas[0]?.id ?? null,
    script: {
      title: `Working title: "${topic}"`,
      hook: `Placeholder opening hook for "${topic}" — one line, ${tone.toLowerCase()} tone.`,
      introduction: `Placeholder introduction. Sets up what the viewer gets from this ${format.toLowerCase()} about ${topic}.`,
      story: `Placeholder main storytelling section. This is where the substance of "${topic}" goes — the steps, the evidence or the narrative, paced for ${duration}.`,
      emotionalMoment: `Placeholder engagement moment, aimed at ${(brief.objective || 'your objective').toLowerCase()}.`,
      closing: 'Placeholder closing section that lands the point.',
      cta: 'Placeholder call to action.',
    },
    scenes,
    prompts: scenes.map((scene) => createPromptForScene(scene, topic)),
    caption: {
      text: `Placeholder caption for "${topic}", written for ${(brief.objective || 'your objective').toLowerCase()} in ${brief.language || 'your language'}.`,
      hashtags: ['#placeholder', '#demo', '#sample', '#example', '#notrealoutput'],
    },
  }
}

import { useMemo, useRef, useState } from 'react'
import { FlaskConical, RotateCcw, Sparkles, Wand2 } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import ContentBriefForm from '../components/studio/ContentBriefForm'
import GenerationSettings from '../components/studio/GenerationSettings'
import GeneratedContentPanel from '../components/studio/GeneratedContentPanel'
import GeneratedWorkspace from '../components/studio/GeneratedWorkspace'
import CategoryModal from '../components/studio/CategoryModal'
import { usePages } from '../context/PagesContext'
import { useStudio } from '../context/StudioContext'
import {
  DEFAULT_SETTINGS,
  EMPTY_BRIEF,
  OUTPUT_TOGGLES,
  buildDemoResult,
  buildDemoWorkspace,
} from '../constants/studio'

function validate(brief, settings) {
  const errors = {}
  if (!brief.pageId) errors.pageId = 'Select a page.'
  if (!brief.category) errors.category = 'Select a category.'
  if (!brief.format) errors.format = 'Select a format.'
  if (!brief.language) errors.language = 'Select a language.'
  if (!brief.objective) errors.objective = 'Select an objective.'
  if (!brief.topic.trim()) errors.topic = 'Describe the topic.'
  if (settings.tone === 'Custom' && !settings.customTone.trim()) {
    errors.customTone = 'Describe the custom tone.'
  }
  if (settings.duration === 'Custom' && !settings.customDuration.trim()) {
    errors.customDuration = 'Enter a duration in seconds.'
  }
  if (!OUTPUT_TOGGLES.some(({ key }) => settings[key])) {
    errors.outputs = 'Enable at least one output section.'
  }
  return errors
}

export default function ContentStudio() {
  const { pages } = usePages()
  const { categories, addCategory, removeCategory, addResult } = useStudio()

  const [brief, setBrief] = useState(EMPTY_BRIEF)
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [errors, setErrors] = useState({})
  const [result, setResult] = useState(null)
  const [workspace, setWorkspace] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [categoryModalOpen, setCategoryModalOpen] = useState(false)

  const workspaceRef = useRef(null)

  const selectedPage = useMemo(
    () => pages.find((page) => page.id === brief.pageId) ?? null,
    [pages, brief.pageId],
  )

  const updateBrief = (key, value) => {
    setBrief((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  const updateSettings = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      if (!prev[key] && !prev.outputs) return prev
      return { ...prev, [key]: undefined, outputs: undefined }
    })
  }

  // Mock generation: assembles placeholder text from the brief. No model call.
  const generate = () => {
    const nextErrors = validate(brief, settings)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    setGenerating(true)
    setTimeout(() => {
      const demo = buildDemoResult({
        brief,
        settings,
        pageName: selectedPage?.name ?? '',
      })
      setResult(demo)
      setWorkspace(buildDemoWorkspace({ brief, settings }))
      addResult(demo)
      setGenerating(false)
    }, 900)
  }

  const startNew = () => {
    setBrief(EMPTY_BRIEF)
    setSettings(DEFAULT_SETTINGS)
    setErrors({})
    setResult(null)
    setWorkspace(null)
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleAddCategory = (name) => {
    const added = addCategory(name)
    if (added) updateBrief('category', added)
  }

  return (
    <>
      <PageHeader
        eyebrow="AI Content Studio"
        title="AI Content Studio"
        description="Turn content research and creative ideas into original videos."
        actions={
          <>
            <Badge tone="warning" icon={FlaskConical}>
              Demonstration only
            </Badge>
            <Button icon={Sparkles} onClick={startNew}>
              Create New Content
            </Button>
          </>
        }
      />

      <div ref={workspaceRef} className="grid gap-5 xl:grid-cols-5">
        {/* Inputs */}
        <div className="space-y-5 xl:col-span-3">
          <ContentBriefForm
            brief={brief}
            errors={errors}
            pages={pages}
            categories={categories}
            onChange={updateBrief}
            onAddCategory={() => setCategoryModalOpen(true)}
          />

          <GenerationSettings settings={settings} errors={errors} onChange={updateSettings} />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Output is placeholder text built from your brief — no model is connected.
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" icon={RotateCcw} onClick={startNew}>
                Reset
              </Button>
              <Button icon={Wand2} onClick={generate} disabled={generating}>
                {generating ? 'Generating…' : 'Generate Content'}
              </Button>
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="xl:col-span-2">
          <div className="xl:sticky xl:top-20">
            <GeneratedContentPanel
              result={result}
              generating={generating}
              onRegenerate={generate}
              showSections={false}
            />
          </div>
        </div>
      </div>

      {workspace && !generating ? (
        <GeneratedWorkspace workspace={workspace} onRegenerate={generate} />
      ) : null}

      <CategoryModal
        open={categoryModalOpen}
        categories={categories}
        onClose={() => setCategoryModalOpen(false)}
        onAdd={handleAddCategory}
        onRemove={removeCategory}
      />
    </>
  )
}

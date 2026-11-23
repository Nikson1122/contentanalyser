import { useEffect, useMemo, useState } from 'react'
import { BookmarkCheck, FlaskConical, Sparkles } from 'lucide-react'
import Tabs from '../ui/Tabs'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import ContentIdeasTab from './workspace/ContentIdeasTab'
import VideoScriptTab from './workspace/VideoScriptTab'
import SceneBreakdownTab from './workspace/SceneBreakdownTab'
import AiVideoPromptsTab from './workspace/AiVideoPromptsTab'
import CaptionHashtagsTab from './workspace/CaptionHashtagsTab'
import { IdeaDetailModal, IdeaEditModal } from './workspace/IdeaModals'
import {
  WORKSPACE_TABS,
  createEmptyScene,
  createPromptForScene,
} from '../../constants/studio'

/**
 * Generated Content Workspace.
 *
 * Owns an editable working copy of the demonstration output. `workspace` is the
 * generated starting point; everything the user changes lives here in local
 * state. No model is involved at any point.
 */
export default function GeneratedWorkspace({ workspace, onRegenerate }) {
  const [tab, setTab] = useState('ideas')
  const [draft, setDraft] = useState(workspace)
  const [viewingIdea, setViewingIdea] = useState(null)
  const [editingIdea, setEditingIdea] = useState(null)

  // A fresh generation replaces the working copy.
  useEffect(() => {
    setDraft(workspace)
    setTab('ideas')
  }, [workspace])

  const selectedIdea = useMemo(
    () => draft.ideas.find((idea) => idea.id === draft.selectedIdeaId) ?? null,
    [draft.ideas, draft.selectedIdeaId],
  )
  const savedCount = draft.ideas.filter((idea) => idea.saved).length

  /* ---------- ideas ---------- */

  const toggleSave = (id) =>
    setDraft((prev) => ({
      ...prev,
      ideas: prev.ideas.map((idea) =>
        idea.id === id ? { ...idea, saved: !idea.saved } : idea,
      ),
    }))

  const selectIdea = (id) => {
    setDraft((prev) => ({ ...prev, selectedIdeaId: id }))
    setViewingIdea(null)
    setTab('script')
  }

  const saveIdeaEdits = (id, values) => {
    setDraft((prev) => ({
      ...prev,
      ideas: prev.ideas.map((idea) => (idea.id === id ? { ...idea, ...values } : idea)),
    }))
    setEditingIdea(null)
  }

  /* ---------- script ---------- */

  const updateScript = (key, value) =>
    setDraft((prev) => ({ ...prev, script: { ...prev.script, [key]: value } }))

  /* ---------- scenes (and their paired prompt cards) ---------- */

  const addScene = () =>
    setDraft((prev) => {
      const scene = createEmptyScene(prev.scenes.length + 1)
      return {
        ...prev,
        scenes: [...prev.scenes, scene],
        prompts: [...prev.prompts, createPromptForScene(scene, prev.meta.topic)],
      }
    })

  const updateScene = (id, key, value) =>
    setDraft((prev) => ({
      ...prev,
      scenes: prev.scenes.map((scene) =>
        scene.id === id ? { ...scene, [key]: value } : scene,
      ),
    }))

  const deleteScene = (id) =>
    setDraft((prev) => ({
      ...prev,
      // Renumber so scene numbers stay contiguous.
      scenes: prev.scenes
        .filter((scene) => scene.id !== id)
        .map((scene, index) => ({ ...scene, number: index + 1 })),
      prompts: prev.prompts
        .filter((prompt) => prompt.sceneId !== id)
        .map((prompt, index) => ({ ...prompt, sceneNumber: index + 1 })),
    }))

  /* ---------- prompts ---------- */

  const updatePrompt = (id, key, value) =>
    setDraft((prev) => ({
      ...prev,
      prompts: prev.prompts.map((prompt) =>
        prompt.id === id ? { ...prompt, [key]: value } : prompt,
      ),
    }))

  /* ---------- caption ---------- */

  const updateCaptionText = (value) =>
    setDraft((prev) => ({ ...prev, caption: { ...prev.caption, text: value } }))

  const updateHashtags = (hashtags) =>
    setDraft((prev) => ({ ...prev, caption: { ...prev.caption, hashtags } }))

  const tabs = WORKSPACE_TABS.map((item) =>
    item.key === 'ideas'
      ? { ...item, count: draft.ideas.length }
      : item.key === 'scenes'
        ? { ...item, count: draft.scenes.length }
        : item.key === 'prompts'
          ? { ...item, count: draft.prompts.length }
          : item,
  )

  return (
    <section className="card sheen p-5" aria-label="Generated content workspace">
      <header className="mb-5 flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-white">Generated Content Workspace</h2>
            <p className="mt-1 text-xs text-slate-500">
              {draft.meta.topic} · {draft.meta.format} · {draft.meta.duration} ·{' '}
              {draft.meta.tone} tone
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {savedCount > 0 ? (
              <Badge tone="success" icon={BookmarkCheck}>
                {savedCount} saved
              </Badge>
            ) : null}
            <Button size="sm" variant="secondary" icon={Sparkles} onClick={onRegenerate}>
              Regenerate
            </Button>
          </div>
        </div>

        {/* Provenance — restated here because this panel is the main surface */}
        <p className="flex items-start gap-2.5 rounded-xl border border-amber-500/25 bg-amber-500/[0.07] p-3 text-xs leading-relaxed text-amber-200">
          <FlaskConical className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
          <span>
            <span className="font-semibold">Demonstration content.</span> Placeholder text
            assembled from your brief to show the workspace. No AI model produced it and none is
            connected. Your edits are kept in this session only.
          </span>
        </p>

        <Tabs tabs={tabs} active={tab} onChange={setTab} label="Workspace sections" />
      </header>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'ideas' ? (
          <ContentIdeasTab
            ideas={draft.ideas}
            selectedIdeaId={draft.selectedIdeaId}
            onView={setViewingIdea}
            onEdit={setEditingIdea}
            onToggleSave={toggleSave}
            onSelect={selectIdea}
          />
        ) : null}

        {tab === 'script' ? (
          <VideoScriptTab
            script={draft.script}
            selectedIdeaTitle={selectedIdea?.title}
            onChange={updateScript}
          />
        ) : null}

        {tab === 'scenes' ? (
          <SceneBreakdownTab
            scenes={draft.scenes}
            onAdd={addScene}
            onUpdate={updateScene}
            onDelete={deleteScene}
          />
        ) : null}

        {tab === 'prompts' ? (
          <AiVideoPromptsTab
            prompts={draft.prompts}
            scenes={draft.scenes}
            onUpdate={updatePrompt}
          />
        ) : null}

        {tab === 'caption' ? (
          <CaptionHashtagsTab
            caption={draft.caption}
            onCaptionChange={updateCaptionText}
            onHashtagsChange={updateHashtags}
          />
        ) : null}
      </div>

      <IdeaDetailModal
        open={Boolean(viewingIdea)}
        idea={viewingIdea}
        selected={viewingIdea?.id === draft.selectedIdeaId}
        onClose={() => setViewingIdea(null)}
        onEdit={(idea) => {
          setViewingIdea(null)
          setEditingIdea(idea)
        }}
        onSelect={selectIdea}
      />

      <IdeaEditModal
        open={Boolean(editingIdea)}
        idea={editingIdea}
        onClose={() => setEditingIdea(null)}
        onSubmit={saveIdeaEdits}
      />
    </section>
  )
}

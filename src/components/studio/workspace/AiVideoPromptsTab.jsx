import { Wand2 } from 'lucide-react'
import Badge from '../../ui/Badge'
import CopyButton from '../../ui/CopyButton'
import EmptyState from '../../ui/EmptyState'
import EditableField from './EditableField'
import { PROMPT_FIELDS } from '../../../constants/studio'

/** One prompt card as plain text, for the copy-all button. */
function promptToText(prompt) {
  return PROMPT_FIELDS.map(({ key, label }) => `${label}: ${prompt[key] ?? ''}`).join('\n')
}

export default function AiVideoPromptsTab({ prompts, scenes, onUpdate }) {
  if (!prompts.length) {
    return (
      <EmptyState
        icon={Wand2}
        title="No prompts yet"
        description="Prompt cards are created alongside scenes. Add a scene in Scene Breakdown and its prompt card appears here."
      />
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-500">
        One card per scene · {prompts.length} {prompts.length === 1 ? 'prompt' : 'prompts'} · every
        field is editable
      </p>

      {prompts.map((prompt) => {
        const scene = scenes.find((item) => item.id === prompt.sceneId)
        return (
          <section
            key={prompt.id}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
          >
            <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <Badge tone="info" icon={Wand2}>
                  Scene {scene?.number ?? prompt.sceneNumber}
                </Badge>
                {scene?.duration ? (
                  <span className="text-xs text-slate-500">{scene.duration}</span>
                ) : null}
                {scene?.visual ? (
                  <span className="truncate text-xs text-slate-600" title={scene.visual}>
                    · {scene.visual}
                  </span>
                ) : null}
              </div>
              <CopyButton text={promptToText(prompt)} label="Copy prompt" />
            </header>

            <div className="space-y-4">
              {PROMPT_FIELDS.map(({ key, label, rows, mono }) => (
                <EditableField
                  key={key}
                  id={`prompt-${prompt.id}-${key}`}
                  label={label}
                  rows={rows}
                  mono={mono}
                  value={prompt[key] ?? ''}
                  onChange={(value) => onUpdate(prompt.id, key, value)}
                  copyable
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

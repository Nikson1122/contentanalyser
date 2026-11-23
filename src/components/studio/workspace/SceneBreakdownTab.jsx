import { Clapperboard, Clock, Plus, Trash2 } from 'lucide-react'
import Button from '../../ui/Button'
import EmptyState from '../../ui/EmptyState'
import EditableField from './EditableField'
import { SCENE_FIELDS } from '../../../constants/studio'

export default function SceneBreakdownTab({ scenes, onAdd, onUpdate, onDelete }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          {scenes.length} {scenes.length === 1 ? 'scene' : 'scenes'} · every field is editable
        </p>
        <Button size="sm" icon={Plus} onClick={onAdd}>
          Add scene
        </Button>
      </div>

      {scenes.length === 0 ? (
        <EmptyState
          icon={Clapperboard}
          title="No scenes yet"
          description="Add a scene to start building the breakdown."
          action={
            <Button icon={Plus} onClick={onAdd}>
              Add scene
            </Button>
          }
        />
      ) : (
        /* Vertical timeline: a rail with a node per scene */
        <ol className="relative space-y-4 before:absolute before:bottom-6 before:left-[19px] before:top-6 before:w-px before:bg-white/10">
          {scenes.map((scene) => (
            <li key={scene.id} className="relative pl-12">
              <span
                className="absolute left-0 top-4 flex size-10 items-center justify-center rounded-xl border border-accent-500/25 bg-gradient-to-br from-accent-500/20 to-glow-500/10 text-sm font-bold text-accent-200"
                aria-hidden="true"
              >
                {scene.number}
              </span>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white">Scene {scene.number}</h4>
                    <label
                      htmlFor={`scene-duration-${scene.id}`}
                      className="flex items-center gap-1.5 text-xs text-slate-500"
                    >
                      <Clock className="size-3.5" aria-hidden="true" />
                      <span className="sr-only">Scene duration</span>
                    </label>
                    <input
                      id={`scene-duration-${scene.id}`}
                      value={scene.duration}
                      onChange={(event) => onUpdate(scene.id, 'duration', event.target.value)}
                      aria-label={`Duration for scene ${scene.number}`}
                      className="h-7 w-24 rounded-lg border border-white/10 bg-black/25 px-2 text-xs text-slate-200 transition-colors hover:border-white/20 focus:border-accent-500/60"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onDelete(scene.id)}
                    aria-label={`Delete scene ${scene.number}`}
                    className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </header>

                <div className="grid gap-4 sm:grid-cols-2">
                  {SCENE_FIELDS.map(({ key, label, rows }) => (
                    <EditableField
                      key={key}
                      id={`scene-${scene.id}-${key}`}
                      label={label}
                      rows={rows}
                      value={scene[key] ?? ''}
                      onChange={(value) => onUpdate(scene.id, key, value)}
                    />
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

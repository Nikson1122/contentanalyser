import { FileText } from 'lucide-react'
import CopyButton from '../../ui/CopyButton'
import EditableField from './EditableField'
import { SCRIPT_SECTIONS } from '../../../constants/studio'

/** Full script as plain text, for the copy-all button. */
function scriptToText(script) {
  return SCRIPT_SECTIONS.map(({ key, label }) => `${label.toUpperCase()}\n${script[key] ?? ''}`).join(
    '\n\n',
  )
}

export default function VideoScriptTab({ script, selectedIdeaTitle, onChange }) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-semibold text-white">
            <FileText className="size-4 text-accent-400" aria-hidden="true" />
            Script workspace
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-500">
            {selectedIdeaTitle
              ? `Developing: ${selectedIdeaTitle}`
              : 'Every section below is editable.'}
          </p>
        </div>
        <CopyButton text={scriptToText(script)} label="Copy full script" />
      </div>

      <div className="space-y-5">
        {SCRIPT_SECTIONS.map(({ key, label, rows, hint }) => (
          <EditableField
            key={key}
            id={`script-${key}`}
            label={label}
            hint={hint}
            rows={rows}
            value={script[key] ?? ''}
            onChange={(value) => onChange(key, value)}
            copyable
          />
        ))}
      </div>
    </div>
  )
}

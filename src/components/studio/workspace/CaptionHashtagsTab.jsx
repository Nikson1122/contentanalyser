import { useState } from 'react'
import { Hash, Plus, X } from 'lucide-react'
import Button from '../../ui/Button'
import CopyButton from '../../ui/CopyButton'
import EditableField from './EditableField'

/** Normalize user input into a single `#tag`. */
function normalizeTag(value) {
  const cleaned = value.trim().replace(/^#+/, '').replace(/\s+/g, '')
  return cleaned ? `#${cleaned}` : ''
}

export default function CaptionHashtagsTab({ caption, onCaptionChange, onHashtagsChange }) {
  const [draft, setDraft] = useState('')
  const [error, setError] = useState('')

  const addTag = (event) => {
    event.preventDefault()
    const tag = normalizeTag(draft)
    if (!tag) {
      setError('Enter a hashtag.')
      return
    }
    if (caption.hashtags.some((item) => item.toLowerCase() === tag.toLowerCase())) {
      setError('That hashtag is already in the list.')
      return
    }
    onHashtagsChange([...caption.hashtags, tag])
    setDraft('')
    setError('')
  }

  const removeTag = (tag) => {
    onHashtagsChange(caption.hashtags.filter((item) => item !== tag))
  }

  const hashtagText = caption.hashtags.join(' ')

  return (
    <div className="space-y-5">
      {/* Caption — editable */}
      <div>
        <EditableField
          id="caption-text"
          label="Caption"
          rows={6}
          value={caption.text}
          onChange={onCaptionChange}
        />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[11px] text-slate-500">
            {caption.text.length} characters · {caption.text.trim() ? caption.text.trim().split(/\s+/).length : 0}{' '}
            words
          </p>
          <CopyButton text={caption.text} label="Copy caption" />
        </div>
      </div>

      {/* Hashtags */}
      <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <header className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-white">
            <Hash className="size-4 text-accent-400" aria-hidden="true" />
            Hashtags
            <span className="text-xs font-normal text-slate-500">({caption.hashtags.length})</span>
          </h4>
          <CopyButton text={hashtagText} label="Copy hashtags" />
        </header>

        {caption.hashtags.length > 0 ? (
          <ul className="mb-3 flex flex-wrap gap-2">
            {caption.hashtags.map((tag) => (
              <li
                key={tag}
                className="group inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-1 pl-2.5 pr-1.5 text-xs font-medium text-glow-400"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  aria-label={`Remove ${tag}`}
                  className="rounded p-0.5 text-slate-500 transition-colors hover:bg-red-500/15 hover:text-red-300"
                >
                  <X className="size-3" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-3 text-xs italic text-slate-500">No hashtags yet.</p>
        )}

        <form onSubmit={addTag} className="flex gap-2">
          <input
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value)
              setError('')
            }}
            placeholder="Add a hashtag"
            aria-label="Add a hashtag"
            className="h-10 flex-1 rounded-xl border border-white/10 bg-black/25 px-3.5 text-sm text-slate-100 placeholder:text-slate-600 transition-colors hover:border-white/20 focus:border-accent-500/60"
          />
          <Button type="submit" icon={Plus} className="shrink-0">
            Add
          </Button>
        </form>
        {error ? <p className="mt-1.5 text-xs text-red-400">{error}</p> : null}
      </section>

      {/* Combined copy */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
        <p className="text-xs text-slate-400">Copy the caption and hashtags together.</p>
        <CopyButton
          text={`${caption.text}\n\n${hashtagText}`.trim()}
          label="Copy caption + hashtags"
        />
      </div>
    </div>
  )
}

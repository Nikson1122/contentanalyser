import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

/** Copies `text` to the clipboard and confirms inline. */
export default function CopyButton({ text, label = 'Copy', iconOnly = false, className = '' }) {
  const [copied, setCopied] = useState(false)
  const [failed, setFailed] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text ?? '')
      setCopied(true)
      setFailed(false)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard needs a secure context and permission; surface the failure.
      setFailed(true)
      setTimeout(() => setFailed(false), 2000)
    }
  }

  const title = failed ? 'Copy unavailable' : copied ? 'Copied' : label
  const Icon = copied ? Check : Copy

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={handleCopy}
        aria-label={title}
        title={title}
        className={`rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/10 hover:text-white ${className}`}
      >
        <Icon
          className={`size-3.5 ${copied ? 'text-accent-400' : failed ? 'text-amber-400' : ''}`}
          aria-hidden="true"
        />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10 hover:border-white/20 ${className}`}
    >
      <Icon
        className={`size-3.5 ${copied ? 'text-accent-400' : failed ? 'text-amber-400' : ''}`}
        aria-hidden="true"
      />
      {failed ? 'Copy unavailable' : copied ? 'Copied' : label}
    </button>
  )
}

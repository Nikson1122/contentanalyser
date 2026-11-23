import { useState } from 'react'
import {
  Check,
  Clapperboard,
  Copy,
  FlaskConical,
  Hash,
  Loader2,
  Megaphone,
  Sparkles,
  Wand2,
} from 'lucide-react'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import EmptyState from '../ui/EmptyState'

const SECTION_ICONS = {
  hook: Megaphone,
  script: Clapperboard,
  prompts: Wand2,
  caption: Hash,
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard unavailable (insecure context or denied) — leave state alone.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
      className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white/10 hover:text-white"
    >
      {copied ? (
        <Check className="size-3.5 text-accent-400" aria-hidden="true" />
      ) : (
        <Copy className="size-3.5" aria-hidden="true" />
      )}
    </button>
  )
}

function SectionShell({ sectionKey, title, children, copyText }) {
  const Icon = SECTION_ICONS[sectionKey] ?? Sparkles
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <header className="mb-3 flex items-center justify-between gap-2">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-white">
          <Icon className="size-4 text-accent-400" aria-hidden="true" />
          {title}
        </h4>
        {copyText ? <CopyButton text={copyText} /> : null}
      </header>
      {children}
    </section>
  )
}

function SectionBody({ section }) {
  if (section.kind === 'lines') {
    return (
      <ol className="space-y-2">
        {section.items.map((item, index) => (
          <li key={index} className="flex gap-2.5 text-sm leading-relaxed text-slate-300">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-white/5 text-[11px] font-semibold text-slate-400">
              {index + 1}
            </span>
            {item}
          </li>
        ))}
      </ol>
    )
  }

  if (section.kind === 'scenes') {
    return (
      <ol className="space-y-3">
        {section.scenes.map((scene) => (
          <li key={scene.number} className="rounded-xl border border-white/5 bg-black/20 p-3">
            <div className="mb-1.5 flex items-center gap-2">
              <Badge tone="neutral">Scene {scene.number}</Badge>
              <span className="text-xs font-medium text-slate-400">{scene.beat}</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">{scene.direction}</p>
            <p className="mt-1.5 text-xs italic leading-relaxed text-slate-500">
              Narration: {scene.narration}
            </p>
          </li>
        ))}
      </ol>
    )
  }

  if (section.kind === 'prompts') {
    return (
      <ul className="space-y-2">
        {section.items.map((item) => (
          <li key={item.label} className="rounded-xl border border-white/5 bg-black/20 p-3">
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {item.label}
            </p>
            <p className="font-mono text-xs leading-relaxed text-slate-300">{item.text}</p>
          </li>
        ))}
      </ul>
    )
  }

  if (section.kind === 'caption') {
    return (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-slate-300">{section.caption}</p>
        <div className="flex flex-wrap gap-1.5">
          {section.hashtags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-white/5 px-2 py-1 text-xs font-medium text-glow-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    )
  }

  return null
}

/** Plain-text version of a section, for the copy button. */
function sectionToText(section) {
  if (section.kind === 'lines') return section.items.join('\n')
  if (section.kind === 'scenes') {
    return section.scenes
      .map((s) => `Scene ${s.number} — ${s.beat}\n${s.direction}\nNarration: ${s.narration}`)
      .join('\n\n')
  }
  if (section.kind === 'prompts') {
    return section.items.map((i) => `${i.label}: ${i.text}`).join('\n\n')
  }
  if (section.kind === 'caption') return `${section.caption}\n\n${section.hashtags.join(' ')}`
  return ''
}

export default function GeneratedContentPanel({
  result,
  generating,
  onRegenerate,
  showSections = true,
}) {
  return (
    <div className="card sheen flex flex-col p-5">
      <header className="mb-5">
        <h2 className="text-sm font-semibold text-white">Your Generated Content</h2>
        <p className="mt-1 text-xs leading-relaxed text-slate-500">
          Your generated ideas, scripts and creative assets will appear here.
        </p>
      </header>

      {generating ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/12 bg-white/[0.02] px-6 py-16 text-center">
          <Loader2 className="size-6 animate-spin text-accent-400" aria-hidden="true" />
          <p className="text-sm font-medium text-slate-200">Assembling demonstration output…</p>
          <p className="text-xs text-slate-500">No model is being called.</p>
        </div>
      ) : !result ? (
        <EmptyState
          icon={Sparkles}
          title="Nothing generated yet"
          description="Fill in the brief and generation settings, then press Generate Content to see a demonstration of how results will be laid out."
        />
      ) : (
        <div className="space-y-4">
          {/* Explicit provenance notice — this is not model output */}
          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/25 bg-amber-500/[0.07] p-3.5">
            <FlaskConical className="mt-0.5 size-4 shrink-0 text-amber-300" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-amber-200">
              <span className="font-semibold">Demonstration output.</span> This is placeholder text
              assembled from your brief to show the layout. No AI model produced it, and no model is
              connected.
            </p>
          </div>

          {/* Brief recap */}
          <dl className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-xs">
            {[
              ['Page', result.summary.page],
              ['Category', result.summary.category],
              ['Format', result.summary.format],
              ['Language', result.summary.language],
              ['Objective', result.summary.objective],
              ['Tone', result.summary.tone],
              ['Duration', result.summary.duration],
              ['Creativity', result.summary.creativity],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0">
                <dt className="uppercase tracking-wider text-slate-500">{label}</dt>
                <dd className="truncate font-medium text-slate-200" title={value}>
                  {value || '—'}
                </dd>
              </div>
            ))}
          </dl>

          {!showSections ? null : result.sections.length > 0 ? (
            result.sections.map((section) => (
              <SectionShell
                key={section.key}
                sectionKey={section.key}
                title={section.title}
                copyText={sectionToText(section)}
              >
                <SectionBody section={section} />
              </SectionShell>
            ))
          ) : (
            <p className="rounded-2xl border border-dashed border-white/12 bg-white/[0.02] p-4 text-center text-xs text-slate-500">
              Every output section is switched off. Enable at least one in Generation settings.
            </p>
          )}

          <Button variant="secondary" icon={Sparkles} onClick={onRegenerate} className="w-full">
            Regenerate demonstration
          </Button>
        </div>
      )}
    </div>
  )
}

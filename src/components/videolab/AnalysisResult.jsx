import { Clapperboard, FlaskConical, Lightbulb, Loader2, Megaphone, Palette, Route, Sparkles } from 'lucide-react'
import Badge from '../ui/Badge'
import EmptyState from '../ui/EmptyState'
import CopyButton from '../ui/CopyButton'

const SECTION_ICONS = {
  hook: Megaphone,
  story: Route,
  scene: Clapperboard,
  visual: Palette,
  patterns: Lightbulb,
}

function Body({ section }) {
  if (section.kind === 'timeline') {
    return (
      <ol className="space-y-2.5">
        {section.items.map((item) => (
          <li key={item.at} className="flex gap-3">
            <span className="mt-0.5 shrink-0 rounded-md bg-white/5 px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-slate-400">
              {item.at}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-200">{item.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
    )
  }

  if (section.kind === 'beats') {
    return (
      <ol className="space-y-2.5">
        {section.items.map((item, index) => (
          <li key={item.label} className="flex gap-3">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-white/5 text-[11px] font-semibold text-slate-400">
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-200">{item.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
    )
  }

  if (section.kind === 'scenes') {
    return (
      <ol className="space-y-2">
        {section.items.map((item) => (
          <li key={item.number} className="rounded-xl border border-white/5 bg-black/20 p-3">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <Badge tone="neutral">Scene {item.number}</Badge>
              <span className="text-[11px] tabular-nums text-slate-500">{item.at}</span>
              <span className="text-[11px] text-slate-500">· {item.shot}</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-300">{item.text}</p>
          </li>
        ))}
      </ol>
    )
  }

  if (section.kind === 'attributes') {
    return (
      <dl className="grid gap-2 sm:grid-cols-2">
        {section.items.map((item) => (
          <div key={item.label} className="rounded-xl border border-white/5 bg-black/20 p-3">
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {item.label}
            </dt>
            <dd className="mt-1 text-xs leading-relaxed text-slate-300">{item.text}</dd>
          </div>
        ))}
      </dl>
    )
  }

  if (section.kind === 'lines') {
    return (
      <ul className="space-y-2">
        {section.items.map((item, index) => (
          <li key={index} className="flex gap-2.5 text-sm leading-relaxed text-slate-300">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent-400" aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
    )
  }

  return null
}

function sectionToText(section) {
  if (section.kind === 'lines') return section.items.join('\n')
  if (section.kind === 'scenes') {
    return section.items.map((i) => `Scene ${i.number} (${i.at}, ${i.shot}): ${i.text}`).join('\n')
  }
  if (section.kind === 'timeline') {
    return section.items.map((i) => `${i.at} — ${i.label}: ${i.text}`).join('\n')
  }
  return section.items.map((i) => `${i.label}: ${i.text}`).join('\n')
}

export default function AnalysisResult({ result, processing, progressLabel }) {
  if (processing) {
    return (
      <div className="card sheen flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <Loader2 className="size-6 animate-spin text-accent-400" aria-hidden="true" />
        <p className="text-sm font-medium text-slate-200">{progressLabel}</p>
        <p className="text-xs text-slate-500">
          Simulated locally. No video is being processed and no model is being called.
        </p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="card sheen p-5">
        <header className="mb-5">
          <h2 className="text-sm font-semibold text-white">Analysis result</h2>
          <p className="mt-1 text-xs text-slate-500">
            Patterns, structure and style notes will appear here.
          </p>
        </header>
        <EmptyState
          icon={Sparkles}
          title="No analysis yet"
          description="Add a video, choose an analysis type, then press Start Analysis to see a demonstration of how results are laid out."
        />
      </div>
    )
  }

  return (
    <div className="card sheen p-5">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white">Analysis result</h2>
          <p className="mt-1 text-xs text-slate-500">
            {result.config.analysisType} · {result.config.language}
            {result.config.niche ? ` · ${result.config.niche}` : ''}
          </p>
        </div>
        <Badge tone="warning" icon={FlaskConical}>
          Demonstration
        </Badge>
      </header>

      {/* Provenance — this is not model output */}
      <p className="mb-4 flex items-start gap-2.5 rounded-xl border border-amber-500/25 bg-amber-500/[0.07] p-3 text-xs leading-relaxed text-amber-200">
        <FlaskConical className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        <span>
          <span className="font-semibold">Demonstration result.</span> Placeholder text assembled
          from your configuration to show the layout. The video was not watched or processed, no AI
          model produced this, and none is connected.
        </span>
      </p>

      {result.config.notes ? (
        <p className="mb-4 rounded-xl border border-white/10 bg-black/20 p-3 text-xs leading-relaxed text-slate-400">
          <span className="font-semibold text-slate-300">Your instructions: </span>
          {result.config.notes}
        </p>
      ) : null}

      <div className="space-y-4">
        {result.sections.map((section) => {
          const Icon = SECTION_ICONS[section.key] ?? Sparkles
          return (
            <section
              key={section.key}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-4"
            >
              <header className="mb-3 flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Icon className="size-4 text-accent-400" aria-hidden="true" />
                  {section.title}
                </h3>
                <CopyButton text={sectionToText(section)} iconOnly />
              </header>
              <Body section={section} />
            </section>
          )
        })}
      </div>
    </div>
  )
}

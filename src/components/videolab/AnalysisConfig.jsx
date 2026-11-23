import { Link } from 'react-router-dom'
import { Layers, SlidersHorizontal } from 'lucide-react'
import Button from '../ui/Button'
import { Field, Select, TextArea } from '../ui/Field'
import { ANALYSIS_LANGUAGES, ANALYSIS_TYPES } from '../../constants/videoLab'

export default function AnalysisConfig({ config, errors, pages, onChange }) {
  const setField = (key) => (event) => onChange(key, event.target.value)
  const selectedPage = pages.find((page) => page.id === config.pageId)
  const activeType = ANALYSIS_TYPES.find((type) => type.key === config.analysisType)

  return (
    <section className="card sheen p-5">
      <header className="mb-5 flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-glow-500/20 to-accent-500/10 text-glow-400">
          <SlidersHorizontal className="size-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-white">Analysis configuration</h2>
          <p className="text-xs text-slate-500">What should the lab look for?</p>
        </div>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field
            label="Page / niche"
            htmlFor="lab-page"
            required
            error={errors.pageId}
            hint={selectedPage?.niche ? `Niche: ${selectedPage.niche}` : undefined}
          >
            {pages.length ? (
              <Select
                id="lab-page"
                value={config.pageId}
                onChange={setField('pageId')}
                placeholder="Select a page"
                options={pages.map((page) => ({
                  value: page.id,
                  label: page.niche ? `${page.name} · ${page.niche}` : page.name,
                }))}
                error={errors.pageId}
              />
            ) : (
              <div className="flex flex-col items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.07] p-3.5">
                <p className="flex items-center gap-2 text-xs font-semibold text-amber-200">
                  <Layers className="size-4" aria-hidden="true" />
                  No pages available yet
                </p>
                <Button as={Link} to="/pages" size="sm" variant="secondary">
                  Go to My Pages
                </Button>
              </div>
            )}
          </Field>
        </div>

        <Field
          label="Analysis type"
          htmlFor="lab-type"
          required
          hint={activeType?.hint}
        >
          <Select
            id="lab-type"
            value={config.analysisType}
            onChange={setField('analysisType')}
            options={ANALYSIS_TYPES.map((type) => ({ value: type.key, label: type.label }))}
          />
        </Field>

        <Field label="Analysis language" htmlFor="lab-language" required>
          <Select
            id="lab-language"
            value={config.language}
            onChange={setField('language')}
            options={ANALYSIS_LANGUAGES}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field
            label="Notes or research instructions"
            htmlFor="lab-notes"
            hint="Optional. What are you trying to learn from this video?"
          >
            <TextArea
              id="lab-notes"
              rows={4}
              value={config.notes}
              onChange={setField('notes')}
              placeholder="e.g. focus on how the first three seconds are structured"
            />
          </Field>
        </div>
      </div>
    </section>
  )
}

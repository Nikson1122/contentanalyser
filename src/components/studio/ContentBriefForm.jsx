import { Link } from 'react-router-dom'
import { FileText, Layers, Plus } from 'lucide-react'
import Button from '../ui/Button'
import { Field, Select, TextArea, TextInput } from '../ui/Field'
import { CONTENT_FORMATS, LANGUAGES, OBJECTIVES } from '../../constants/studio'

/** Section 1 of the workspace: what to make. */
export default function ContentBriefForm({
  brief,
  errors,
  pages,
  categories,
  onChange,
  onAddCategory,
}) {
  const setField = (key) => (event) => onChange(key, event.target.value)

  const pageOptions = pages.map((page) => ({
    value: page.id,
    label: page.platform ? `${page.name} · ${page.platform}` : page.name,
  }))

  return (
    <section className="card sheen p-5">
      <header className="mb-5 flex items-center gap-2.5">
        <span className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-accent-500/20 to-glow-500/10 text-accent-300">
          <FileText className="size-4" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-sm font-semibold text-white">Content brief</h2>
          <p className="text-xs text-slate-500">What should this piece of content do?</p>
        </div>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Field label="Page" htmlFor="studio-page" required error={errors.pageId}>
            {pages.length ? (
              <Select
                id="studio-page"
                value={brief.pageId}
                onChange={setField('pageId')}
                placeholder="Select a page"
                options={pageOptions}
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
          label="Content category"
          htmlFor="studio-category"
          required
          error={errors.category}
          hint="Drawn from your pages. Add more as you need them."
        >
          <div className="flex gap-2">
            <Select
              id="studio-category"
              value={brief.category}
              onChange={setField('category')}
              placeholder={categories.length ? 'Select a category' : 'No categories yet'}
              options={categories}
              error={errors.category}
              disabled={!categories.length}
              className="flex-1"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={onAddCategory}
              aria-label="Add a content category"
              className="shrink-0 px-3"
            >
              <Plus className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </Field>

        <Field label="Content format" htmlFor="studio-format" required error={errors.format}>
          <Select
            id="studio-format"
            value={brief.format}
            onChange={setField('format')}
            placeholder="Select a format"
            options={CONTENT_FORMATS}
            error={errors.format}
          />
        </Field>

        <Field label="Language" htmlFor="studio-language" required error={errors.language}>
          <Select
            id="studio-language"
            value={brief.language}
            onChange={setField('language')}
            placeholder="Select a language"
            options={LANGUAGES}
            error={errors.language}
          />
        </Field>

        <Field
          label="Content objective"
          htmlFor="studio-objective"
          required
          error={errors.objective}
        >
          <Select
            id="studio-objective"
            value={brief.objective}
            onChange={setField('objective')}
            placeholder="Select an objective"
            options={OBJECTIVES}
            error={errors.objective}
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Topic / subject" htmlFor="studio-topic" required error={errors.topic}>
            <TextInput
              id="studio-topic"
              value={brief.topic}
              onChange={setField('topic')}
              placeholder="What is this piece of content about?"
              error={errors.topic}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field
            label="Additional instructions"
            htmlFor="studio-instructions"
            hint="Optional. Angle, references, things to avoid."
          >
            <TextArea
              id="studio-instructions"
              rows={4}
              value={brief.instructions}
              onChange={setField('instructions')}
              placeholder="Anything else that should shape the output?"
            />
          </Field>
        </div>
      </div>
    </section>
  )
}

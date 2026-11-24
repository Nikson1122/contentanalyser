import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, RotateCcw, Save } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Tabs from '../components/ui/Tabs'
import Modal from '../components/ui/Modal'
import GeneralSettings from '../components/settings/GeneralSettings'
import AppearanceSettings from '../components/settings/AppearanceSettings'
import ContentGenerationSettings from '../components/settings/ContentGenerationSettings'
import ContentWorkflowSettings from '../components/settings/ContentWorkflowSettings'
import DataSettings from '../components/settings/DataSettings'
import AboutSettings from '../components/settings/AboutSettings'
import { useSettings } from '../context/SettingsContext'
import { DEFAULT_SETTINGS, SETTINGS_TABS } from '../constants/settings'

/**
 * Settings screen. Draft edits are local to this page; "Save changes" commits
 * them to the persisted store. Opening the page always reflects stored values.
 */
export default function Settings() {
  const { settings, savedAt, storageAvailable, updateSettings, resetSettings } = useSettings()

  const [draft, setDraft] = useState(settings)
  const [activeTab, setActiveTab] = useState(SETTINGS_TABS[0].key)
  const [justSaved, setJustSaved] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)

  // Re-sync the draft when the stored settings change from outside this page
  // (hydration, a reset, or another browser tab writing the same key).
  useEffect(() => {
    setDraft(settings)
  }, [settings])

  const dirty = useMemo(
    () => Object.keys(DEFAULT_SETTINGS).some((key) => draft[key] !== settings[key]),
    [draft, settings],
  )

  const atDefaults = useMemo(
    () => Object.keys(DEFAULT_SETTINGS).every((key) => settings[key] === DEFAULT_SETTINGS[key]),
    [settings],
  )

  const update = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setJustSaved(false)
  }

  const save = () => {
    updateSettings(draft)
    setJustSaved(true)
  }

  const discard = () => {
    setDraft(settings)
    setJustSaved(false)
  }

  const importSettings = (values) => {
    updateSettings(values)
    setJustSaved(true)
  }

  const confirmReset = () => {
    resetSettings()
    setResetOpen(false)
    setJustSaved(false)
  }

  const panels = {
    general: <GeneralSettings values={draft} onChange={update} />,
    appearance: <AppearanceSettings values={draft} onChange={update} />,
    generation: <ContentGenerationSettings values={draft} onChange={update} />,
    workflow: <ContentWorkflowSettings values={draft} onChange={update} />,
    data: (
      <DataSettings
        settings={settings}
        savedAt={savedAt}
        storageAvailable={storageAvailable}
        atDefaults={atDefaults}
        onReset={() => setResetOpen(true)}
        onImport={importSettings}
      />
    ),
    about: <AboutSettings />,
  }

  return (
    <>
      <PageHeader
        eyebrow="Settings"
        title="Workspace settings"
        description="Preferences and defaults for your pages, generated content and calendar. Saved in this browser."
        actions={
          <>
            {!storageAvailable ? (
              <Badge tone="danger" dot className="self-center">
                Storage unavailable
              </Badge>
            ) : dirty ? (
              <Badge tone="warning" dot className="self-center">
                Unsaved changes
              </Badge>
            ) : justSaved ? (
              <Badge tone="success" dot className="self-center">
                Saved
              </Badge>
            ) : null}
            <Button
              variant="ghost"
              icon={RotateCcw}
              onClick={dirty ? discard : () => setResetOpen(true)}
              disabled={!dirty && atDefaults}
            >
              {dirty ? 'Discard' : 'Reset settings'}
            </Button>
            <Button icon={Save} onClick={save} disabled={!dirty}>
              Save changes
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-6">
        <Tabs
          tabs={SETTINGS_TABS}
          active={activeTab}
          onChange={setActiveTab}
          label="Settings sections"
        />

        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          className="flex flex-col gap-6"
        >
          {panels[activeTab]}
        </div>
      </div>

      <Modal
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="Reset settings to defaults?"
        description="This affects your preferences only."
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setResetOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" icon={RotateCcw} onClick={confirmReset}>
              Reset settings
            </Button>
          </>
        }
      >
        <div className="flex gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-300" aria-hidden="true" />
          <div className="text-sm leading-relaxed text-slate-300">
            <p>Every preference returns to its default and the stored settings entry is removed.</p>
            <p className="mt-2 text-slate-400">
              Your pages, CSV import records, competitor research, generated content and calendar
              items are <span className="font-medium text-slate-200">not</span> touched.
            </p>
          </div>
        </div>
      </Modal>
    </>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FlaskConical, Layers, Play, RotateCcw, Trash2, Video } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader'
import EmptyState from '../components/ui/EmptyState'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import Tabs from '../components/ui/Tabs'
import VideoDropzone from '../components/videolab/VideoDropzone'
import VideoSourceInput from '../components/videolab/VideoSourceInput'
import AnalysisConfig from '../components/videolab/AnalysisConfig'
import AnalysisResult from '../components/videolab/AnalysisResult'
import RecentVideosList from '../components/videolab/RecentVideosList'
import { usePages } from '../context/PagesContext'
import { useVideoLab } from '../context/VideoLabContext'
import {
  EMPTY_LAB_CONFIG,
  INPUT_MODES,
  buildDemoAnalysis,
  buildDemoVideos,
  isValidVideoUrl,
} from '../constants/videoLab'

const STAGES = [
  'Reading video metadata…',
  'Sampling frames…',
  'Assembling demonstration analysis…',
]

export default function VideoLearningLab() {
  const { pages } = usePages()
  const { videos, addVideo, removeVideo, replaceVideos, clearVideos } = useVideoLab()

  const [mode, setMode] = useState('upload')
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [duration, setDuration] = useState(null)
  const [sourceUrl, setSourceUrl] = useState('')
  const [config, setConfig] = useState(EMPTY_LAB_CONFIG)
  const [errors, setErrors] = useState({})

  const [processing, setProcessing] = useState(false)
  const [stage, setStage] = useState(STAGES[0])
  const [result, setResult] = useState(null)
  const [viewingAnalysis, setViewingAnalysis] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)

  const timers = useRef([])
  const inputRef = useRef(null)

  // Object URLs must be revoked, or the blob leaks for the page's lifetime.
  useEffect(() => {
    if (!file) {
      setPreviewUrl('')
      return undefined
    }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  // Clear any pending mock-processing timers on unmount.
  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const selectedPage = useMemo(
    () => pages.find((page) => page.id === config.pageId) ?? null,
    [pages, config.pageId],
  )

  const videoTitle = file?.name || (sourceUrl ? sourceUrl.split('/').pop() || sourceUrl : '')

  const updateConfig = (key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev))
  }

  const resetInput = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setFile(null)
    setDuration(null)
    setSourceUrl('')
    setConfig(EMPTY_LAB_CONFIG)
    setErrors({})
    setResult(null)
    setProcessing(false)
    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const validate = () => {
    const next = {}
    if (mode === 'upload' && !file) next.file = 'Choose a video file.'
    if (mode === 'url') {
      if (!sourceUrl.trim()) next.sourceUrl = 'Enter a video URL.'
      else if (!isValidVideoUrl(sourceUrl)) next.sourceUrl = 'Enter a valid http(s) URL.'
    }
    if (!config.pageId) next.pageId = 'Select a page.'
    return next
  }

  // Mock processing: staged labels, then a demonstration result. No model call.
  const startAnalysis = () => {
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setProcessing(true)
    setResult(null)
    setStage(STAGES[0])
    timers.current.forEach(clearTimeout)

    timers.current = [
      setTimeout(() => setStage(STAGES[1]), 700),
      setTimeout(() => setStage(STAGES[2]), 1400),
      setTimeout(() => {
        const analysis = buildDemoAnalysis({
          config,
          videoTitle,
          niche: selectedPage?.niche ?? '',
        })
        setResult(analysis)
        setProcessing(false)
        addVideo({
          title: videoTitle || 'Untitled video',
          source: mode,
          url: mode === 'url' ? sourceUrl.trim() : '',
          fileSize: file?.size ?? null,
          // Own object URL: the input preview's is revoked when `file` changes.
          previewUrl: mode === 'upload' && file ? URL.createObjectURL(file) : '',
          duration,
          pageId: selectedPage?.id ?? null,
          pageName: selectedPage?.name ?? '',
          niche: selectedPage?.niche ?? '',
          analysisType: config.analysisType,
          language: config.language,
          status: 'analyzed',
          demo: true,
          analysis,
        })
      }, 2100),
    ]
  }

  const loadDemoVideos = () => replaceVideos(buildDemoVideos(pages))

  const confirmDelete = () => {
    if (pendingDelete) removeVideo(pendingDelete.id)
    setPendingDelete(null)
  }

  const hasDemoVideos = videos.some((video) => video.demo)

  return (
    <>
      <PageHeader
        eyebrow="Video Learning Lab"
        title="Video Learning Lab"
        description="Teach CreatorPulse AI to understand videos and discover content patterns."
        actions={
          <>
            <Badge tone="warning" icon={FlaskConical}>
              Demonstration only
            </Badge>
            <Button icon={Video} onClick={resetInput}>
              Analyze New Video
            </Button>
          </>
        }
      />

      {!pages.length ? (
        <EmptyState
          icon={Layers}
          title="No pages to analyze for"
          description="An analysis is scoped to a page and its niche. Create a page first, then come back."
          action={
            <Button as={Link} to="/pages">
              Go to My Pages
            </Button>
          }
        />
      ) : (
        <>
          <div ref={inputRef} className="grid gap-5 xl:grid-cols-5">
            {/* Input + configuration */}
            <div className="space-y-5 xl:col-span-3">
              <section className="card sheen p-5">
                <header className="mb-4">
                  <h2 className="text-sm font-semibold text-white">Video input</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Upload a local file, or reference a video source you are authorized to use.
                  </p>
                </header>

                <Tabs
                  tabs={INPUT_MODES}
                  active={mode}
                  onChange={setMode}
                  label="Video input method"
                />

                <div className="mt-4">
                  {mode === 'upload' ? (
                    <VideoDropzone
                      file={file}
                      previewUrl={previewUrl}
                      duration={duration}
                      error={errors.file}
                      onSelect={(next) => {
                        setFile(next)
                        setErrors((prev) => ({ ...prev, file: undefined }))
                      }}
                      onClear={() => {
                        setFile(null)
                        setDuration(null)
                      }}
                      onDurationChange={setDuration}
                    />
                  ) : (
                    <VideoSourceInput
                      value={sourceUrl}
                      error={errors.sourceUrl}
                      onChange={(value) => {
                        setSourceUrl(value)
                        setErrors((prev) => ({ ...prev, sourceUrl: undefined }))
                      }}
                    />
                  )}
                </div>
              </section>

              <AnalysisConfig
                config={config}
                errors={errors}
                pages={pages}
                onChange={updateConfig}
              />

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Nothing is uploaded or processed — results are a local demonstration.
                </p>
                <div className="flex gap-2">
                  <Button variant="ghost" icon={RotateCcw} onClick={resetInput}>
                    Reset
                  </Button>
                  <Button icon={Play} onClick={startAnalysis} disabled={processing}>
                    {processing ? 'Analyzing…' : 'Start Analysis'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Result */}
            <div className="xl:col-span-2">
              <div className="xl:sticky xl:top-20">
                <AnalysisResult result={result} processing={processing} progressLabel={stage} />
              </div>
            </div>
          </div>

          {/* Recent videos */}
          <section aria-labelledby="recent-videos">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 id="recent-videos" className="text-sm font-semibold tracking-wide text-slate-300">
                Recent videos
              </h2>
              {videos.length > 0 ? (
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-500">
                    {videos.length} {videos.length === 1 ? 'video' : 'videos'}
                  </p>
                  {hasDemoVideos ? (
                    <Button variant="ghost" size="sm" icon={Trash2} onClick={clearVideos}>
                      Clear
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>

            {videos.length > 0 ? (
              <RecentVideosList
                videos={videos}
                onViewAnalysis={setViewingAnalysis}
                onDelete={setPendingDelete}
              />
            ) : (
              <EmptyState
                icon={Video}
                title="No videos yet"
                description="Analyzed videos appear here. Run an analysis above, or load a set of demonstration records."
                action={
                  <Button variant="secondary" icon={FlaskConical} onClick={loadDemoVideos}>
                    Load demonstration data
                  </Button>
                }
              />
            )}
          </section>
        </>
      )}

      {/* Stored analysis */}
      <Modal
        open={Boolean(viewingAnalysis)}
        onClose={() => setViewingAnalysis(null)}
        size="lg"
        title={viewingAnalysis?.title ?? 'Analysis'}
        description={
          viewingAnalysis
            ? `${viewingAnalysis.pageName}${viewingAnalysis.niche ? ` · ${viewingAnalysis.niche}` : ''}`
            : null
        }
        footer={
          <Button variant="secondary" onClick={() => setViewingAnalysis(null)}>
            Close
          </Button>
        }
      >
        {viewingAnalysis?.analysis ? (
          <AnalysisResult result={viewingAnalysis.analysis} processing={false} />
        ) : null}
      </Modal>

      <Modal
        open={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(null)}
        size="sm"
        title="Remove video"
        description="This removes the record and its stored analysis."
        footer={
          <>
            <Button variant="secondary" onClick={() => setPendingDelete(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Remove
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-300">
          Remove <span className="font-semibold text-white">{pendingDelete?.title}</span>?
        </p>
      </Modal>
    </>
  )
}

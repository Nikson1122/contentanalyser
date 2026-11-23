import { useEffect, useRef, useState } from 'react'
import { FileVideo, UploadCloud, X } from 'lucide-react'
import {
  ACCEPTED_VIDEO_EXTENSIONS,
  MAX_VIDEO_MB,
  formatDuration,
  formatFileSize,
  isAcceptedVideoFile,
} from '../../constants/videoLab'

/**
 * Local video picker with preview.
 *
 * The file never leaves the browser: the preview is an object URL played by a
 * local <video> element, and only name, size and duration are reported upward.
 */
export default function VideoDropzone({ file, previewUrl, duration, error, onSelect, onClear, onDurationChange }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    setLocalError('')
  }, [file])

  const handleFiles = (files) => {
    const next = files?.[0]
    if (!next) return
    if (!isAcceptedVideoFile(next)) {
      setLocalError(`Unsupported file. Accepted formats: ${ACCEPTED_VIDEO_EXTENSIONS.join(', ')}`)
      return
    }
    if (next.size > MAX_VIDEO_MB * 1024 * 1024) {
      setLocalError(`File is larger than ${MAX_VIDEO_MB} MB.`)
      return
    }
    setLocalError('')
    onSelect(next)
  }

  const shownError = localError || error

  if (file) {
    return (
      <div className="space-y-3">
        {/* Local preview */}
        {previewUrl ? (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
            <video
              src={previewUrl}
              controls
              preload="metadata"
              className="aspect-video w-full bg-black"
              onLoadedMetadata={(event) => onDurationChange?.(event.currentTarget.duration)}
            />
          </div>
        ) : null}

        <div className="flex items-center gap-4 rounded-2xl border border-accent-500/25 bg-accent-500/[0.06] p-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-accent-500/25 bg-gradient-to-br from-accent-500/20 to-glow-500/10 text-accent-300">
            <FileVideo className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{file.name}</p>
            <p className="mt-0.5 text-xs text-slate-400">
              {formatFileSize(file.size)}
              {duration ? ` · ${formatDuration(duration)}` : ''}
              {file.type ? ` · ${file.type}` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={onClear}
            aria-label="Remove selected video"
            className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>

        <p className="px-1 text-[11px] text-slate-500">
          Previewed locally in your browser. Nothing is uploaded.
        </p>
      </div>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault()
          setDragging(false)
          handleFiles(event.dataTransfer?.files)
        }}
        className={`flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-12 text-center transition-colors ${
          dragging
            ? 'border-accent-400/60 bg-accent-500/10'
            : shownError
              ? 'border-red-500/50 bg-red-500/[0.04]'
              : 'border-white/15 bg-white/[0.02] hover:border-accent-500/40 hover:bg-white/[0.04]'
        }`}
      >
        <span className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-accent-500/20 to-glow-500/10 text-accent-300">
          <UploadCloud className="size-6" aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold text-white">
          {dragging ? 'Drop the video to continue' : 'Drag and drop a video here'}
        </span>
        <span className="text-xs text-slate-400">
          or <span className="font-medium text-accent-400">browse your files</span> ·{' '}
          {ACCEPTED_VIDEO_EXTENSIONS.join(', ')} up to {MAX_VIDEO_MB} MB
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_VIDEO_EXTENSIONS.join(',')}
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
      {shownError ? <p className="mt-1.5 text-xs text-red-400">{shownError}</p> : null}
    </div>
  )
}

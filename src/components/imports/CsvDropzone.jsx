import { useRef, useState } from 'react'
import { FileSpreadsheet, UploadCloud, X } from 'lucide-react'
import { formatFileSize } from '../../constants/csvImport'

/**
 * Drag-and-drop CSV picker.
 * Reports the selected File's name and size only — the file is never read.
 */
export default function CsvDropzone({ file, onSelect, onClear, error }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = (files) => {
    const next = files?.[0]
    if (next) onSelect?.(next)
  }

  const onDrop = (event) => {
    event.preventDefault()
    setDragging(false)
    handleFiles(event.dataTransfer?.files)
  }

  if (file) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-accent-500/25 bg-accent-500/[0.06] p-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-accent-500/25 bg-gradient-to-br from-accent-500/20 to-glow-500/10 text-accent-300">
          <FileSpreadsheet className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">{file.name}</p>
          <p className="mt-0.5 text-xs text-slate-400">
            {formatFileSize(file.size)}
            {file.type ? ` · ${file.type}` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          aria-label="Remove selected file"
          className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
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
        onDrop={onDrop}
        className={`flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-10 text-center transition-colors ${
          dragging
            ? 'border-accent-400/60 bg-accent-500/10'
            : error
              ? 'border-red-500/50 bg-red-500/[0.04]'
              : 'border-white/15 bg-white/[0.02] hover:border-accent-500/40 hover:bg-white/[0.04]'
        }`}
      >
        <span className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-accent-500/20 to-glow-500/10 text-accent-300">
          <UploadCloud className="size-6" aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold text-white">
          {dragging ? 'Drop the file to continue' : 'Drag and drop your CSV here'}
        </span>
        <span className="text-xs text-slate-400">
          or <span className="font-medium text-accent-400">browse your files</span> · .csv up to 20 MB
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
      {error ? <p className="mt-1.5 text-xs text-red-400">{error}</p> : null}
    </div>
  )
}

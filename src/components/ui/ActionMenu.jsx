import { useEffect, useRef, useState } from 'react'
import { MoreHorizontal } from 'lucide-react'

/**
 * Reusable overflow menu. `items` is a list of
 * { label, icon, onClick, danger?, divider? }.
 */
export default function ActionMenu({ items, label = 'Actions', align = 'right' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDocumentClick = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocumentClick)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onDocumentClick)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={label}
        aria-expanded={open}
        className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
      >
        <MoreHorizontal className="size-4" aria-hidden="true" />
      </button>

      {open ? (
        <div
          role="menu"
          className={`absolute top-full z-30 mt-1 w-48 overflow-hidden rounded-xl border border-white/12 bg-surface-850/95 p-1 shadow-2xl shadow-black/50 backdrop-blur-xl ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {items.map(({ label: itemLabel, icon: Icon, onClick, danger, divider }) => (
            <div key={itemLabel}>
              {divider ? <div className="my-1 h-px bg-white/10" aria-hidden="true" /> : null}
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false)
                  onClick?.()
                }}
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  danger
                    ? 'text-red-300 hover:bg-red-500/10'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {Icon ? <Icon className="size-4 shrink-0" aria-hidden="true" /> : null}
                {itemLabel}
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

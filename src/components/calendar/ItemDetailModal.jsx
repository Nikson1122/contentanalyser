import { CalendarDays, Clock, FileText, Layers, Pencil, StickyNote, Tag, Trash2 } from 'lucide-react'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { STATUS_TONES, formatFullDate, formatTime } from '../../constants/calendar'

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <dt className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500">
        <Icon className="size-3.5" aria-hidden="true" />
        {label}
      </dt>
      <dd className="min-w-0 truncate text-sm font-medium text-slate-200">{value || '—'}</dd>
    </div>
  )
}

export default function ItemDetailModal({ open, item, onClose, onEdit, onDelete }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={item?.title ?? 'Planned content'}
      description={item ? formatFullDate(item.date) : null}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="danger" icon={Trash2} onClick={() => onDelete(item)}>
            Delete
          </Button>
          <Button icon={Pencil} onClick={() => onEdit(item)}>
            Edit
          </Button>
        </>
      }
    >
      {item ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={STATUS_TONES[item.status] ?? 'neutral'} dot>
              {item.status}
            </Badge>
            {item.demo ? <Badge tone="warning">Demonstration item</Badge> : null}
          </div>

          <dl className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            <Row icon={Layers} label="Page" value={item.pageName} />
            <Row icon={Tag} label="Category" value={item.category} />
            <Row icon={FileText} label="Format" value={item.format} />
            <Row icon={CalendarDays} label="Date" value={formatFullDate(item.date)} />
            <Row icon={Clock} label="Time" value={formatTime(item.time)} />
          </dl>

          {item.notes ? (
            <p className="flex gap-2 rounded-xl border border-white/10 bg-black/20 p-3.5 text-xs leading-relaxed text-slate-400">
              <StickyNote className="mt-0.5 size-3.5 shrink-0 text-slate-500" aria-hidden="true" />
              {item.notes}
            </p>
          ) : null}
        </div>
      ) : null}
    </Modal>
  )
}

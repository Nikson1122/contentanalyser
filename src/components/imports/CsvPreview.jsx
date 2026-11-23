import { AlertTriangle, CheckCircle2, Rows3, Table2, Wand2 } from 'lucide-react'
import Badge from '../ui/Badge'
import { Select } from '../ui/Field'
import { CANONICAL_FIELDS, IGNORE_FIELD } from '../../constants/csvImport'

const IGNORE_OPTION = { value: IGNORE_FIELD, label: "Don't import" }

/**
 * UI-only preview of a detected CSV: headers, sample rows, row count and the
 * suggested-vs-manual column mapping. Nothing is parsed.
 */
export default function CsvPreview({ preview, mapping, suggested, onMappingChange }) {
  const mappedCount = Object.values(mapping).filter((value) => value !== IGNORE_FIELD).length
  const missingRequired = CANONICAL_FIELDS.filter(
    (field) => field.required && !Object.values(mapping).includes(field.key),
  )

  const fieldOptions = [
    IGNORE_OPTION,
    ...CANONICAL_FIELDS.map((field) => ({
      value: field.key,
      label: field.required ? `${field.label} (required)` : field.label,
    })),
  ]

  return (
    <div className="space-y-6">
      {/* Detection summary */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: 'Rows detected', value: preview.detectedRows.toLocaleString(), icon: Rows3 },
          { label: 'Columns detected', value: preview.headers.length, icon: Table2 },
          { label: 'Columns mapped', value: `${mappedCount}/${preview.headers.length}`, icon: Wand2 },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3.5"
          >
            <Icon className="size-4 shrink-0 text-accent-400" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">{label}</p>
              <p className="text-sm font-semibold tabular-nums text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {missingRequired.length > 0 ? (
        <p className="flex items-start gap-2 rounded-xl border border-amber-500/25 bg-amber-500/[0.07] px-3.5 py-3 text-xs text-amber-200">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          Map the required fields before importing:{' '}
          <span className="font-semibold">
            {missingRequired.map((field) => field.label).join(', ')}
          </span>
        </p>
      ) : (
        <p className="flex items-center gap-2 rounded-xl border border-accent-500/25 bg-accent-500/[0.07] px-3.5 py-3 text-xs text-accent-200">
          <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
          All required fields are mapped.
        </p>
      )}

      {/* Column mapping */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-200">Column mapping</h3>
        <div className="divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          {preview.headers.map((header) => {
            const value = mapping[header] ?? IGNORE_FIELD
            const isSuggested = suggested[header] === value && value !== IGNORE_FIELD
            return (
              <div
                key={header}
                className="flex flex-col gap-2 p-3.5 sm:flex-row sm:items-center sm:gap-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">{header}</p>
                  <p className="truncate text-xs text-slate-500">
                    e.g. {preview.rows[0]?.[preview.headers.indexOf(header)] ?? '—'}
                  </p>
                </div>
                {isSuggested ? (
                  <Badge tone="info" icon={Wand2} className="self-start sm:self-center">
                    Suggested
                  </Badge>
                ) : null}
                <Select
                  aria-label={`Map column ${header}`}
                  value={value}
                  options={fieldOptions}
                  onChange={(event) => onMappingChange(header, event.target.value)}
                  className="sm:w-56"
                />
              </div>
            )
          })}
        </div>
      </section>

      {/* Sample rows */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-slate-200">
          Sample rows{' '}
          <span className="font-normal text-slate-500">
            (first {preview.rows.length} of {preview.detectedRows.toLocaleString()})
          </span>
        </h3>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-max text-left text-xs">
            <thead className="bg-white/5 text-[11px] uppercase tracking-wider text-slate-400">
              <tr>
                {preview.headers.map((header) => (
                  <th key={header} className="whitespace-nowrap px-3.5 py-2.5 font-semibold">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {preview.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="transition-colors hover:bg-white/[0.03]">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="max-w-[16rem] truncate whitespace-nowrap px-3.5 py-2.5 text-slate-300"
                      title={String(cell)}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

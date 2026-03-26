import { useMemo, useState } from 'react'

function formatDate(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString()
}

function variantStyle(variant: number) {
  // 0: blue, 1: green, 2: amber, 3: pink
  if (variant === 1) return { bg: '#DCFCE7', accent: '#16A34A' }
  if (variant === 2) return { bg: '#FEF3C7', accent: '#F59E0B' }
  if (variant === 3) return { bg: '#FCE7F3', accent: '#EC4899' }
  return { bg: '#DBEAFE', accent: '#2563EB' }
}

export function NoteCard({ note, onOpen, onSummarize, variant = 0 }: { note: any, onOpen: any, onSummarize: any, variant?: number, key?: any }) {
  const [error, setError] = useState('')

  const createdLabel = useMemo(() => formatDate(note.created_at), [note.created_at])
  const v = useMemo(() => variantStyle(variant), [variant])

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
      className="sb-note-card sb-hover-lift sb-animate-fade-up cursor-pointer p-4 text-left"
      style={{ background: v.bg, borderLeft: `6px solid ${v.accent}` }}
      aria-label={`Open note ${note.title}`}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold tracking-tight text-[#111827]">
            {note.title}
          </div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-[#6B7280]">
            <span className="inline-flex items-center gap-1">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#64748B]"
              >
                <path
                  d="M7 3v3M17 3v3M4.5 9h15"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M6.5 6h11A2 2 0 0 1 19.5 8v11a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{createdLabel}</span>
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onSummarize()
          }}
          className="shrink-0 sb-btn-gradient rounded-full px-4 py-2"
        >
          <>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="opacity-90"
            >
              <path
                d="M12 2l1.6 5.1c.2.6.7 1.1 1.3 1.3L20 10l-5.1 1.6c-.6.2-1.1.7-1.3 1.3L12 18l-1.6-5.1c-.2-.6-.7-1.1-1.3-1.3L4 10l5.1-1.6c.6-.2 1.1-.7 1.3-1.3L12 2Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M19 16l.8 2.4c.1.4.4.7.8.8L23 20l-2.4.8c-.4.1-.7.4-.8.8L19 24l-.8-2.4c-.1-.4-.4-.7-.8-.8L15 20l2.4-.8c.4-.1.7-.4.8-.8L19 16Z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
                opacity="0.6"
              />
            </svg>
            AI Summary
          </>
        </button>
      </header>

      <div className="mt-4 rounded-2xl border border-dashed bg-white/90 p-4"
        style={{ borderColor: 'var(--sb-summary-border)' }}>
        <div className="flex items-center gap-2 text-[11px] font-semibold text-[#111827]">
          <span
            className="inline-flex h-5 w-5 items-center justify-center rounded-lg text-white"
            style={{ background: v.accent }}
          >
            AI
          </span>
          Summary
        </div>
        <div
          className="mt-2 min-h-20 whitespace-pre-wrap text-sm text-[#111827]"
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 4,
            overflow: 'hidden',
          }}
        >
          {note.summary || 'No summary yet. Generate one with AI.'}
        </div>
      </div>

      {error ? (
        <div className="mt-3 rounded-xl border border-red-200/70 bg-red-50/80 p-3 text-xs text-red-900">
          {error}
        </div>
      ) : null}
    </article>
  )
}

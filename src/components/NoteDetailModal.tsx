import { useEffect, useMemo, useState } from 'react'

function formatDate(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString()
}

export function NoteDetailModal({ note, onClose, onSave, onDelete }: { note: any, onClose: any, onSave: any, onDelete: any, key?: any }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftTitle, setDraftTitle] = useState(note?.title || '')
  const [draftContent, setDraftContent] = useState(note?.content || '')

  const createdLabel = useMemo(() => formatDate(note?.created_at), [note?.created_at])

  useEffect(() => {
    if (!note) return undefined

    function handleKeyDown(event: any) {
      if (event.key === 'Escape') onClose()
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [note, onClose])

  if (!note) return null

  function handleSave() {
    const nextTitle = draftTitle.trim()
    const nextContent = draftContent.trim()
    if (!nextTitle || !nextContent) return

    onSave({
      ...note,
      title: nextTitle,
      content: nextContent,
    })
    setIsEditing(false)
  }

  function handleCancel() {
    setDraftTitle(note.title || '')
    setDraftContent(note.content || '')
    setIsEditing(false)
  }

  function handleDelete() {
    const confirmed = window.confirm(`Delete "${note.title}"? This cannot be undone.`)
    if (!confirmed) return
    onDelete(note.id)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="sb-modal sb-animate-fade-up sb-scrollbar max-h-[90vh] w-full max-w-3xl overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-[28px] border-b border-[#E5E7EB] bg-white/95 px-5 py-4 backdrop-blur md:px-6">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2563EB]">
              Note details
            </div>
            <div className="mt-1 text-lg font-bold tracking-tight text-[#111827] md:text-xl">
              {isEditing ? 'Edit note' : note.title}
            </div>
          </div>
          <button onClick={onClose} className="sb-btn-ghost rounded-full px-3 py-2" aria-label="Close note details">
            Close
          </button>
        </div>

        <div className="space-y-5 px-5 py-5 md:px-6 md:py-6">
          <div className="flex flex-wrap gap-2">
            <span className="sb-pill">{createdLabel || 'Unknown date'}</span>
            <span className="sb-pill capitalize">{note.category || 'general'}</span>
          </div>

          <section className="space-y-3 rounded-3xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">Title</div>
            {isEditing ? (
              <input
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                className="sb-input-white"
                placeholder="Note title"
              />
            ) : (
              <div className="text-lg font-semibold text-[#111827]">{note.title}</div>
            )}
          </section>

          <section className="space-y-3 rounded-3xl border border-[#E5E7EB] bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748B]">Content</div>
            {isEditing ? (
              <textarea
                value={draftContent}
                onChange={(event) => setDraftContent(event.target.value)}
                className="sb-textarea-white min-h-40"
                placeholder="Write your note content"
              />
            ) : (
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-[#374151]">
                {note.content}
              </div>
            )}
          </section>

          <section className="space-y-3 rounded-3xl border border-dashed bg-[#EFF6FF] p-4"
            style={{ borderColor: 'var(--sb-summary-border)' }}>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#1E3A8A]">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-[#2563EB] text-[10px] font-bold text-white">
                AI
              </span>
              AI Summary
            </div>
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-[#111827]">
              {note.summary || 'No summary yet. Generate one from the note card.'}
            </div>
          </section>

          <div className="flex flex-col gap-3 border-t border-[#E5E7EB] pt-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => onDelete(note.id)}
              className="sb-btn rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 transition hover:bg-red-100"
            >
              Delete note
            </button>

            <div className="flex flex-col gap-3 sm:flex-row">
              {isEditing ? (
                <>
                  <button onClick={handleCancel} className="sb-btn-ghost px-4 py-3">
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!draftTitle.trim() || !draftContent.trim()}
                    className="sb-btn-gradient px-4 py-3"
                  >
                    Save changes
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="sb-btn-gradient px-4 py-3">
                  Edit note
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

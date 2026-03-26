import { useMemo, useState } from 'react'

export function AddNoteForm({ onCreate }: { onCreate: any }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const canSubmit = useMemo(() => {
    return title.trim().length > 0 && content.trim().length > 0 && !isSaving
  }, [title, content, isSaving])

  async function handleSubmit(e: any) {
    e.preventDefault()
    
    const payload = { 
      title: title.trim(), 
      content: content.trim(),
      category: 'general',
      keywords: ''
    }
    
    console.log('FORM SUBMIT', payload)
    
    setError('')
    setIsSaving(true)
    try {
      await onCreate(payload)
      setTitle('')
      setContent('')
    } catch (err: any) {
      setError(err?.message || 'Failed to create note')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="sb-add-card p-6 sb-animate-fade-up"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl border border-zinc-200/60 bg-white/60">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#64748B]"
              >
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <div className="text-sm font-semibold text-[#111827]">New note</div>
              <div className="mt-0.5 text-xs text-[#6B7280]">
                Capture ideas fast. AI summary is generated automatically.
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          className="sb-btn-gradient rounded-full px-5 py-3"
        >
          {isSaving ? (
            <>
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Saving
            </>
          ) : (
            'Add note'
          )}
        </button>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label className="text-xs font-medium text-[#6B7280]">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Sprint planning recap"
            className="mt-2 sb-input-white"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-[#6B7280]">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            placeholder="Write your note… (bullets, links, quick thoughts)"
            className="mt-2 sb-textarea-white"
          />
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-200/70 bg-red-50/80 p-3 text-xs text-red-900">
          {error}
        </div>
      ) : null}
    </form>
  )
}

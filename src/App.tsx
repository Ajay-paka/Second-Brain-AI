import { useEffect, useMemo, useState } from 'react'
import { AddNoteForm } from './components/AddNoteForm'
import { EmptyState } from './components/EmptyState'
import { NoteCard } from './components/NoteCard'
import { NoteDetailModal } from './components/NoteDetailModal'
import { TopBar } from './components/TopBar'
import { loadNotes, addNote, editNote, deleteNote } from './services/webhookService'

function normalizeStoredNote(note: any) {
  return {
    id: String(note.id || note.ID || Date.now()),
    title: String(note.title || note.notetitle || 'Untitled note').trim(),
    content: String(note.user_input || note.content || '').trim(),
    summary: String(note.ai_response || note.ai_summary || note.summary || '').trim(),
    created_at: note.timestamp || note.created_at || note.createdAt || new Date().toISOString(),
    category: String(note.category || 'general').trim(),
    priority: String(note.priority || 'normal').trim(),
    keywords: String(note.keywords || '').trim(),
  }
}

function sortNotes(notes: any[]) {
  return [...notes].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

function App() {
  const [notes, setNotes] = useState<any[]>([])
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      setIsLoading(true)
      try {
        const res = await loadNotes()
        if (res.success) {
          const fetchedNotes = Array.isArray(res.notes) ? res.notes : []
          setNotes(sortNotes(fetchedNotes.map(normalizeStoredNote)))
        }
      } catch (e: any) {
        setError(e.message || 'Failed to load notes')
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return notes
    return notes.filter(n => 
      [n.title, n.content, n.summary, n.category, n.keywords].some(v => String(v).toLowerCase().includes(q))
    )
  }, [notes, query])

  const selectedNote = useMemo(
    () => notes.find(n => n.id === selectedNoteId) || null,
    [notes, selectedNoteId]
  )

  const countLabel = useMemo(() => {
    if (isLoading) return 'Loading...'
    return `${filteredNotes.length} note${filteredNotes.length === 1 ? '' : 's'}`
  }, [filteredNotes.length, isLoading])

  async function handleCreate(payload: any) {
    setIsLoading(true)
    setError('')
    try {
      const fullPayload = {
        ...payload,
        id: crypto.randomUUID()
      }
      const res = await addNote(fullPayload)
      if (res.success) {
        const refreshRes = await loadNotes()
        if (refreshRes.success) {
          const fetchedNotes = Array.isArray(refreshRes.notes) ? refreshRes.notes : []
          setNotes(sortNotes(fetchedNotes.map(normalizeStoredNote)))
        }
      }
    } catch (e: any) {
      setError(e.message || 'Failed to add note')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSummarize(note: any) {
    setIsLoading(true)
    setError('')
    try {
      const res = await editNote({ 
        id: note.id, 
        title: note.title, 
        content: note.content,
        category: note.category,
        keywords: note.keywords
      })
      if (res.success) {
        const refreshRes = await loadNotes()
        if (refreshRes.success) {
          const fetchedNotes = Array.isArray(refreshRes.notes) ? refreshRes.notes : []
          setNotes(sortNotes(fetchedNotes.map(normalizeStoredNote)))
        }
      }
    } catch (e: any) {
      setError(e.message || 'Failed to summarize note')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSaveNote(updated: any) {
    setIsLoading(true)
    setError('')
    try {
      const res = await editNote({ 
        id: updated.id, 
        title: updated.title, 
        content: updated.content,
        category: updated.category,
        keywords: updated.keywords
      })
      if (res.success) {
        const refreshRes = await loadNotes()
        if (refreshRes.success) {
          const fetchedNotes = Array.isArray(refreshRes.notes) ? refreshRes.notes : []
          setNotes(sortNotes(fetchedNotes.map(normalizeStoredNote)))
        }
        setSelectedNoteId(null)
      }
    } catch (e: any) {
      setError(e.message || 'Failed to save note')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeleteNote(id: string) {
    const originalNotes = [...notes]
    
    // Optimistic update: remove note from UI immediately
    setNotes(prev => prev.filter(n => n.id !== id))
    setSelectedNoteId(null)
    
    setIsLoading(true)
    setError('')
    
    try {
      const res = await deleteNote(id)
      if (res) {
        // Small delay to allow backend (n8n/Sheets) to settle before refresh
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const refreshRes = await loadNotes()
        if (refreshRes.success) {
          const fetchedNotes = Array.isArray(refreshRes.notes) ? refreshRes.notes : []
          setNotes(sortNotes(fetchedNotes.map(normalizeStoredNote)))
        }
      } else {
        // Rollback if response is explicitly falsy
        setNotes(originalNotes)
      }
    } catch (e: any) {
      // Rollback on error
      setNotes(originalNotes)
      setError(e.message || 'Failed to delete note')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="sb-bg min-h-full">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 md:px-6">
        <aside className="hidden w-80 shrink-0 md:block">
          <div className="sticky top-6">
            <div className="sb-sidebar p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-[#1E3A8A] text-white shadow-sm">
                  <span className="text-sm font-bold tracking-tight">SB</span>
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold leading-tight text-[#111827]">
                    Second Brain AI
                  </div>
                  <div className="truncate text-xs text-[#6B7280]">Premium notes dashboard</div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3">
                <div className="sb-sidebar-card sb-hover-lift p-4" style={{ background: '#E0E7FF' }}>
                  <div className="text-xs font-semibold text-[#1E3A8A]">Notes</div>
                  <div className="mt-2 text-3xl font-extrabold tracking-tight text-[#1E3A8A]">
                    {isLoading ? '-' : notes.length}
                  </div>
                  <div className="mt-1 text-xs text-[#1E3A8A]/80">Your knowledge base</div>
                </div>

                <div className="sb-sidebar-card sb-hover-lift p-4" style={{ background: '#DCFCE7' }}>
                  <div className="text-xs font-semibold text-[#166534]">Status</div>
                  <div className="mt-2 text-lg font-semibold tracking-tight text-[#166534]">
                    {isLoading ? 'Syncing...' : 'Ready'}
                  </div>
                  <div className="mt-1 text-xs text-[#166534]/80">Webhook connected</div>
                </div>

                <div className="sb-sidebar-card sb-hover-lift p-4" style={{ background: '#FEF3C7' }}>
                  <div className="text-xs font-semibold text-[#92400E]">Workspace</div>
                  <div className="mt-2 space-y-1 text-xs text-[#92400E]">
                    <div className="flex items-center justify-between">
                      <span className="opacity-80">Storage</span>
                      <span className="font-semibold">Google Sheets</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="opacity-80">Flow</span>
                      <span className="font-semibold">n8n</span>
                    </div>
                  </div>
                </div>

                <div className="sb-sidebar-card sb-hover-lift p-4" style={{ background: '#FCE7F3' }}>
                  <div className="text-xs font-semibold text-[#9D174D]">AI Engine</div>
                  <div className="mt-2 text-sm font-semibold text-[#9D174D]">Gemini Summaries</div>
                  <div className="mt-1 text-xs text-[#9D174D]/80">
                    Summaries generated automatically
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-4 text-xs text-[#6B7280]">
                <span className="font-semibold text-[#111827]">Tip:</span> write messy notes,
                summarize later for a clean second brain.
              </div>
            </div>
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <TopBar query={query} onQueryChange={setQuery} subtitle={countLabel} />

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-200/70 bg-red-50/80 p-4 text-sm text-red-900 sb-animate-fade-up">
              {error}
            </div>
          ) : null}

          <div className="mt-4 grid grid-cols-1 gap-6 xl:grid-cols-12">
            <section className="xl:col-span-5">
              <AddNoteForm onCreate={handleCreate} />
            </section>

            <section className="xl:col-span-7">
              {isLoading && notes.length === 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-44 animate-pulse rounded-2xl border border-zinc-200/70 bg-white/70"
                    />
                  ))}
                </div>
              ) : filteredNotes.length === 0 ? (
                <EmptyState query={query} />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {filteredNotes.map((n, idx) => (
                    <NoteCard
                      key={n.id}
                      note={n}
                      variant={idx % 4}
                      onOpen={() => setSelectedNoteId(n.id)}
                      onSummarize={() => handleSummarize(n)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>

          {selectedNote ? (
            <NoteDetailModal
              key={selectedNote.id}
              note={selectedNote}
              onClose={() => setSelectedNoteId(null)}
              onSave={handleSaveNote}
              onDelete={handleDeleteNote}
            />
          ) : null}

          <footer className="mt-10 pb-6 text-xs text-zinc-500">
            Built for an internship-ready MVP. No auth yet.
          </footer>
        </main>
      </div>
    </div>
  )
}

export default App

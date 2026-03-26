export function EmptyState({ query }: { query: string }) {
  const isSearching = Boolean(query?.trim())

  return (
    <div
      className="sb-note-card p-6 text-left sb-animate-fade-up"
      style={{ background: 'rgba(255,255,255,0.78)' }}
    >
      <div className="flex items-start gap-4">
        <div className="grid h-11 w-11 place-items-center rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#64748B]"
          >
            <path
              d="M7 3.5h10a2 2 0 0 1 2 2V20a.5.5 0 0 1-.8.4l-3.1-2.3a2 2 0 0 0-1.2-.4H7a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 8h7M8.5 11h7M8.5 14h4.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="min-w-0">
          <div className="text-sm font-semibold text-[#111827]">
            {isSearching ? 'No results found' : 'Your workspace is empty'}
          </div>
          <div className="mt-2 text-sm leading-relaxed text-[#6B7280]">
            {isSearching
              ? 'Try a different keyword (title, content, or summary).'
              : 'Add your first note on the left. When you’re ready, generate an AI summary to keep it crisp and searchable.'}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {['Project ideas', 'Learning roadmap', 'Meeting recap', 'Job prep'].map((x) => (
              <span key={x} className="sb-pill">
                {x}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


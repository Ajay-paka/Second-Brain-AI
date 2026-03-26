export function TopBar({ query, onQueryChange, subtitle }: { query: string, onQueryChange: any, subtitle: string }) {
  return (
    <div className="sb-header p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-zinc-200/60 bg-white/60">
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
              <div className="truncate text-2xl font-bold tracking-tight text-[#111827]">
                Second Brain AI
              </div>
              <div className="mt-1 text-sm text-[#6B7280]">{subtitle}</div>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-[420px]">
          <label className="sr-only" htmlFor="search">
            Search notes
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path
                  d="M16.2 16.2 21 21"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <input
              id="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search notes, ideas, summaries…"
              className="sb-input pl-10"
            />

            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden sm:block">
              <span className="rounded-lg border border-zinc-200/70 bg-white/70 px-2 py-1 text-[10px] font-medium text-zinc-500">
                Ctrl K
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


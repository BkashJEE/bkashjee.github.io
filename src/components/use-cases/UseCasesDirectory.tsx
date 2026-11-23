import { Eyebrow } from '../Eyebrow'
import { startTransition, useMemo, useRef, useState, ViewTransition } from 'react'
import { MostViewed } from './MostViewed'
import { PlaybookNetwork } from './PlaybookNetwork'
import { UseCaseCard } from './UseCaseCard'
import { categoryLabel, useCaseCategories, useCases, newestUseCases, type UseCaseCategory } from '../../content/useCases'

type SortMode = 'newest' | 'featured' | 'alphabetical'

function Filters({ selected, setSelected }: { selected: UseCaseCategory | 'all'; setSelected: (value: UseCaseCategory | 'all') => void }) {
  const counts = useMemo(() => Object.fromEntries(useCaseCategories.map((category) => [category.id, useCases.filter((entry) => entry.category === category.id).length])), [])
  const options: Array<{ id: UseCaseCategory | 'all'; label: string; count: number }> = [
    { id: 'all', label: 'All use cases', count: useCases.length },
    ...useCaseCategories.map((category) => ({ ...category, count: counts[category.id] })),
  ]

  return (
    <div className="space-y-1" aria-label="Filter by category">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={selected === option.id}
          onClick={() => setSelected(option.id)}
          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${selected === option.id ? 'bg-raised text-fg' : 'text-fg-dim hover:bg-surface hover:text-fg'}`}
        >
          <span>{option.label}</span>
          <span className={`font-mono text-xs ${selected === option.id ? 'text-accent' : 'text-fg-dim'}`}>{option.count}</span>
        </button>
      ))}
    </div>
  )
}

export function UseCasesDirectory() {
  const search = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [filterQuery, setFilterQuery] = useState('')
  const [category, setCategory] = useState<UseCaseCategory | 'all'>('all')
  const [sort, setSort] = useState<SortMode>('newest')

  const visible = useMemo(() => {
    const term = filterQuery.trim().toLocaleLowerCase()
    const filtered = newestUseCases.filter((entry) => {
      const haystack = [entry.title, entry.description, categoryLabel(entry.category), ...entry.tools, ...entry.keywords].join(' ').toLocaleLowerCase()
      return (category === 'all' || entry.category === category) && (!term || haystack.includes(term))
    })
    return filtered.sort((a, b) => {
      if (sort === 'alphabetical') return a.title.localeCompare(b.title)
      if (sort === 'featured') return Number(b.featured) - Number(a.featured) || b.date.localeCompare(a.date)
      return 0
    })
  }, [category, filterQuery, sort])

  function updateResults(update: () => void) {
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) startTransition(update)
    else update()
  }

  const reset = () => {
    setQuery('')
    updateResults(() => {
      setFilterQuery('')
      setCategory('all')
    })
    search.current?.focus()
  }

  return (
    <main id="main" tabIndex={-1} className="scroll-mt-16 pb-24">
      <section className="relative isolate overflow-hidden border-b border-line">
        <PlaybookNetwork />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <Eyebrow>New Entries as I Build Them</Eyebrow>
          <div className="mt-6 grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <div className="max-w-4xl">
              <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.9] text-fg">Playbook<span className="text-accent">.</span></h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-fg-dim sm:text-xl">
                What I built, how it works, and where it still falls short.
              </p>
            </div>
            <div className="border-l-2 border-accent pl-5 lg:mb-2">
              <strong className="block font-display text-4xl text-fg">{useCases.length}</strong>
              <span className="mt-1 block font-mono text-xs text-fg-dim">Written up in full</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16" aria-label="Use-case directory">
        <h2 className="mb-7 font-display text-4xl text-fg">Browse the playbook</h2>
        <div className="grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h2 className="mb-4 font-mono text-xs text-fg-dim">Categories</h2>
              <Filters selected={category} setSelected={(value) => updateResults(() => setCategory(value))} />
            </div>
          </aside>

          <div>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
              <label className="relative block">
                <span className="sr-only">Search use cases</span>
                {/* Search icon from Lucide (ISC). */}
                <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-dim" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  ref={search}
                  type="search"
                  value={query}
                  onChange={(event) => {
                    const value = event.target.value
                    setQuery(value)
                    updateResults(() => setFilterQuery(value))
                  }}
                  placeholder="Search"
                  className="h-11 w-full rounded-lg border border-fg-faint bg-surface pl-11 pr-4 text-base sm:text-sm text-fg placeholder:text-fg-dim transition-colors hover:border-fg-faint focus:border-accent"
                />
              </label>
              <label>
                <span className="sr-only">Sort use cases</span>
                <select
                  value={sort}
                  onChange={(event) => {
                    const value = event.target.value as SortMode
                    updateResults(() => setSort(value))
                  }}
                  className="h-11 w-full rounded-lg border border-line bg-surface px-4 font-mono text-base sm:text-sm text-fg transition-colors hover:border-fg-faint focus:border-accent"
                >
                  <option value="newest">Newest first</option>
                  <option value="featured">Featured first</option>
                  <option value="alphabetical">A–Z</option>
                </select>
              </label>
            </div>

            <details className="mt-3 rounded-xl border border-line bg-surface lg:hidden">
              <summary className="cursor-pointer px-4 py-3 font-mono text-xs text-fg">Filter categories</summary>
              <div className="border-t border-line p-2"><Filters selected={category} setSelected={(value) => updateResults(() => setCategory(value))} /></div>
            </details>

            <div className="my-7 flex items-center justify-between gap-4 border-b border-line pb-4">
              <p aria-live="polite" className="font-mono text-xs text-fg-dim">
                {visible.length} {visible.length === 1 ? 'result' : 'results'}{category !== 'all' ? ` in ${categoryLabel(category)}` : ''}
              </p>
              {(query || category !== 'all') && (
                <button type="button" onClick={reset} className="min-h-6 font-mono text-xs text-accent hover:text-fg">Clear filters</button>
              )}
            </div>

            {visible.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:gap-6">
                {visible.map((entry) => (
                  <ViewTransition key={entry.slug} default="none" enter="all-work-enter" exit="all-work-exit" update="all-work-move">
                    <UseCaseCard entry={entry} />
                  </ViewTransition>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-line px-6 py-20 text-center">
                <p className="font-display text-2xl text-fg">No use cases match.</p>
                <p className="mt-2 text-sm text-fg-dim">Try a different term or clear the category filter.</p>
                <button type="button" onClick={reset} className="mt-6 rounded-full border border-line px-5 py-2.5 font-mono text-xs text-fg transition-colors hover:border-accent hover:text-accent">Clear filters</button>
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="scroll-mt-20 border-b border-line bg-surface/30 py-12 sm:py-20" aria-label="Related posts on X">
        <div className="mx-auto max-w-6xl px-6">
          <Eyebrow>X Posts</Eyebrow>
          <h2 className="mt-3 font-display text-4xl leading-tight">
            Related posts on X
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-fg-dim">
            Browse posts from my X analytics export. Each links to the original post.
          </p>
        </div>
        <div className="mt-10">
          <MostViewed />
        </div>
      </section>

    </main>
  )
}

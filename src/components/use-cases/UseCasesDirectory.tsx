import { useMemo, useState } from 'react'
import { UseCaseCard } from './UseCaseCard'
import { categoryLabel, useCaseCategories, useCases, type UseCaseCategory } from '../../content/useCases'

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
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<UseCaseCategory | 'all'>('all')
  const [sort, setSort] = useState<SortMode>('newest')

  const visible = useMemo(() => {
    const term = query.trim().toLocaleLowerCase()
    const filtered = useCases.filter((entry) => {
      const haystack = [entry.title, entry.description, categoryLabel(entry.category), ...entry.tools, ...entry.keywords].join(' ').toLocaleLowerCase()
      return (category === 'all' || entry.category === category) && (!term || haystack.includes(term))
    })
    return [...filtered].sort((a, b) => {
      if (sort === 'alphabetical') return a.title.localeCompare(b.title)
      if (sort === 'featured') return Number(b.featured) - Number(a.featured) || b.date.localeCompare(a.date)
      return b.date.localeCompare(a.date)
    })
  }, [category, query, sort])

  const reset = () => {
    setQuery('')
    setCategory('all')
  }

  return (
    <main id="main" className="pb-24 pt-20">
      <section className="relative overflow-hidden border-b border-line">
        <div className="ambient absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Built, tested, documented</p>
          <div className="mt-6 grid items-end gap-10 lg:grid-cols-[1fr_auto]">
            <div className="max-w-4xl">
              <h1 className="font-display text-[clamp(3.2rem,9vw,7.5rem)] leading-[0.9] text-fg">Use Cases<span className="text-accent">.</span></h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-fg-dim sm:text-xl">
                Working software, agent workflows, automations, and experiments—documented with implementation details, measurable outcomes, and honest limitations.
              </p>
            </div>
            <div className="border-l-2 border-accent pl-5 lg:mb-2">
              <strong className="block font-display text-5xl text-fg">{useCases.length}</strong>
              <span className="mt-1 block font-mono text-xs uppercase tracking-[0.18em] text-fg-dim">Published cases</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16" aria-label="Use-case directory">
        <div className="grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h2 className="mb-4 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-fg-dim">Categories</h2>
              <Filters selected={category} setSelected={setCategory} />
            </div>
          </aside>

          <div>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
              <label className="relative block">
                <span className="sr-only">Search use cases</span>
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-fg-dim" aria-hidden="true">⌕</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search titles, tools, keywords…"
                  className="h-12 w-full rounded-xl border border-line bg-surface pl-11 pr-4 text-sm text-fg placeholder:text-fg-dim transition-colors hover:border-fg-faint focus:border-accent focus:outline-none"
                />
              </label>
              <label>
                <span className="sr-only">Sort use cases</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortMode)}
                  className="h-12 w-full rounded-xl border border-line bg-surface px-4 font-mono text-xs text-fg transition-colors hover:border-fg-faint focus:border-accent focus:outline-none"
                >
                  <option value="newest">Newest first</option>
                  <option value="featured">Featured first</option>
                  <option value="alphabetical">A–Z</option>
                </select>
              </label>
            </div>

            <details className="mt-3 rounded-xl border border-line bg-surface lg:hidden">
              <summary className="cursor-pointer px-4 py-3 font-mono text-xs text-fg">Filter categories</summary>
              <div className="border-t border-line p-2"><Filters selected={category} setSelected={setCategory} /></div>
            </details>

            <div className="my-7 flex items-center justify-between gap-4 border-b border-line pb-4">
              <p aria-live="polite" className="font-mono text-xs text-fg-dim">
                {visible.length} {visible.length === 1 ? 'result' : 'results'}{category !== 'all' ? ` in ${categoryLabel(category)}` : ''}
              </p>
              {(query || category !== 'all') && (
                <button type="button" onClick={reset} className="font-mono text-xs text-accent hover:text-fg">Clear filters</button>
              )}
            </div>

            {visible.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:gap-6">
                {visible.map((entry) => <UseCaseCard key={entry.slug} entry={entry} />)}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-line px-6 py-20 text-center">
                <p className="font-display text-2xl text-fg">No use cases match.</p>
                <p className="mt-2 text-sm text-fg-dim">Try a different term or clear the category filter.</p>
                <button type="button" onClick={reset} className="mt-6 rounded-full border border-line px-5 py-2.5 font-mono text-xs text-fg transition-colors hover:border-accent hover:text-accent">Clear filters</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}

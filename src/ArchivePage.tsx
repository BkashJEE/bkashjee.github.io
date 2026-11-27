import { startTransition, useEffect, useRef, useState, ViewTransition } from 'react'
import { SiteNav } from './components/SiteNav'
import { SiteFooter } from './components/SiteFooter'
import { workCount, workGroups, workStars, workStatuses, type WorkItem } from './content/allWork'
import { identity } from './content/projects'
import { ArchiveBlueprint } from './components/ArchiveBlueprint'

const filters = [
  { id: 'all', label: 'All', count: workCount },
  ...workGroups.map(({ id, label, items }) => ({ id, label, count: items.length })),
]

const allDates = workGroups.flatMap(({ items }) => items.flatMap(({ date }) => (date ? [date] : []))).sort()
const blueprintGroups = workGroups.map(({ id, label, items }) => ({
  id,
  label,
  count: items.length,
  newest: items.filter(({ date }) => date).sort((a, b) => b.date!.localeCompare(a.date!))[0]?.name,
}))

const monthFormat = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' })
const dateFormat = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
const numberFormat = new Intl.NumberFormat('en-US')

function legacyFilters() {
  return /^#(?:group|q)=/.test(location.hash)
}

function readFilters() {
  const params = new URLSearchParams(location.search)
  const group = params.get('group')
  return {
    group: filters.find(({ id }) => id === group)?.id ?? 'all',
    query: params.get('q') ?? '',
  }
}

function monthName(date: string) {
  return monthFormat.format(new Date(`${date.slice(0, 7)}-01T00:00:00Z`))
}

function WorkRow({ item }: { item: WorkItem }) {
  const external = item.href?.startsWith('https://')
  const stars = item.repo ? workStars.get(item.repo) : undefined
  const live = item.status === 'Live'

  return (
    <li className="all-work-row">
      <div className="all-work-date font-mono text-xs text-fg-dim">
        {item.date && (
          <time dateTime={item.date}>
            {item.date.slice(0, 4)} {monthName(item.date)}
            {item.date.length === 10 && ` ${item.date.slice(8)}`}
          </time>
        )}
      </div>
      <div className="all-work-name min-w-0">
        <h3 className="font-semibold text-fg">
          {item.href ? (
            <a href={item.href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}
              className="inline-block min-h-6 rounded-sm hover:text-accent hover:underline">
              {item.name}{external && <span aria-hidden="true" className="ml-1">↗</span>}
            </a>
          ) : item.name}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-fg-dim">{item.description}</p>
        {item.impressions !== undefined && (
          <p className="mt-2 font-mono text-xs text-fg-dim">
            {numberFormat.format(item.impressions)} impressions · X export · <time dateTime="2026-10-06">Oct 6, 2026</time>
          </p>
        )}
        {item.views !== undefined && item.viewsAsOf && (
          <p className="mt-2 font-mono text-xs text-fg-dim">
            {numberFormat.format(item.views)} views · as of{' '}
            <time dateTime={item.viewsAsOf}>{dateFormat.format(new Date(item.viewsAsOf))}</time>
          </p>
        )}
      </div>
      <p className="all-work-stack font-mono text-xs leading-relaxed text-fg-dim">{item.stack}</p>
      <div className="all-work-status">
        <span className={`inline-block rounded-md border border-line px-2 py-1 font-mono text-xs ${live ? 'text-teal' : 'text-fg-dim'}`}>
          {item.status}
        </span>
      </div>
      {stars !== undefined && (
        <p className="all-work-stars whitespace-nowrap font-mono text-xs text-fg-dim">
          <span aria-hidden="true">★ </span>{numberFormat.format(stars)}<span className="sr-only"> GitHub stars</span>
        </p>
      )}
    </li>
  )
}

export default function ArchivePage() {
  const [query, setQuery] = useState('')
  const [selection, setSelection] = useState({ group: 'all', query: '' })
  const search = useRef<HTMLInputElement>(null)
  const searchTimer = useRef<number>(undefined)

  useEffect(() => {
    const syncFilters = () => {
      window.clearTimeout(searchTimer.current)
      if (legacyFilters()) {
        const url = new URL(location.href)
        const legacy = new URLSearchParams(url.hash.slice(1))
        for (const key of ['group', 'q']) {
          const value = legacy.get(key)
          if (value !== null && !url.searchParams.has(key)) url.searchParams.set(key, value)
        }
        url.hash = ''
        history.replaceState(history.state, '', url)
      }
      const next = readFilters()
      setQuery(next.query)
      setSelection(next)
    }
    syncFilters()
    window.addEventListener('popstate', syncFilters)
    return () => {
      window.clearTimeout(searchTimer.current)
      window.removeEventListener('popstate', syncFilters)
    }
  }, [])

  function applyFilters(group: string, text: string, push = false) {
    window.clearTimeout(searchTimer.current)
    const url = new URL(location.href)
    const params = url.searchParams
    if (group !== 'all') params.set('group', group)
    else params.delete('group')
    if (text) params.set('q', text)
    else params.delete('q')
    if (url.href !== location.href) {
      if (push) history.pushState(history.state, '', url)
      else history.replaceState(history.state, '', url)
    }

    const update = () => setSelection({ group, query: text })
    if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) startTransition(update)
    else update()
  }

  function searchFor(text: string) {
    setQuery(text)
    window.clearTimeout(searchTimer.current)
    // Wait for a pause in typing before animating the results.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) applyFilters(selection.group, text)
    else searchTimer.current = window.setTimeout(() => applyFilters(readFilters().group, text), 200)
  }

  const term = selection.query.trim().toLowerCase()
  const groups = workGroups
    .filter(({ id }) => selection.group === 'all' || id === selection.group)
    .map((group) => ({
      ...group,
      items: group.items.filter(({ name, description, stack, status, repo }) =>
        [name, description, stack, status, repo].join(' ').toLowerCase().includes(term)),
    }))
    .filter(({ items }) => items.length > 0)
  const shown = groups.reduce((count, { items }) => count + items.length, 0)
  const active = query !== '' || selection.group !== 'all'

  return (
    <div className="all-work min-h-svh">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-md focus:bg-white focus:px-4 focus:text-zinc-900 focus:outline-2 focus:outline-offset-2 focus:outline-zinc-900">Skip to content</a>
      <SiteNav page="archive" />

      <main id="main" tabIndex={-1} className="mx-auto max-w-6xl scroll-mt-16 px-6 py-10 sm:py-20">
        <div className="archive-hero grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div>
            <p className="all-work-eyebrow text-accent">{identity.name}</p>
            <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-tight">All work</h1>
            <p className="mt-4 text-fg-dim">{workCount} projects, films, partnerships, contributions, and posts.</p>
            <p className="mt-4 font-mono text-[13px] leading-relaxed text-fg-dim">
              <span aria-hidden="true" className="mr-2 inline-block size-2 rounded-full bg-accent" />
              <span className="sr-only">Available for. </span>
              {identity.available} ·{' '}
              <time dateTime={identity.availableUpdated} className="whitespace-nowrap">
                Updated {monthName(identity.availableUpdated)} {identity.availableUpdated.slice(0, 4)}
              </time>
            </p>
          </div>
          <div className="hidden md:block">
            <ArchiveBlueprint groups={blueprintGroups} total={workCount}
              firstYear={allDates[0]?.slice(0, 4) ?? ''} lastYear={allDates.at(-1)?.slice(0, 4) ?? ''}
              drawn={`${monthName(identity.availableUpdated).toUpperCase()} ${identity.availableUpdated.slice(0, 4)}`}
              selected={selection.group} onPick={(id) => applyFilters(id, query, true)} />
          </div>
        </div>

        <div className="mt-8">
          <div className="relative max-w-md">
            <label htmlFor="archive-search" className="sr-only">Search work</label>
            <svg aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-fg-dim"
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input ref={search} id="archive-search" type="search" value={query}
              onChange={(event) => searchFor(event.target.value)} placeholder="Search work"
              className="h-11 w-full rounded-lg border border-fg-faint bg-surface pl-10 pr-8 text-base text-fg placeholder:text-fg-dim" />
          </div>

          <div className="all-work-filters mt-4 flex flex-wrap gap-1 rounded-xl border border-line bg-surface p-1" role="group" aria-label="Filter by group">
            {filters.map(({ id, label, count }) => (
              <button key={id} type="button" className="all-work-filter" aria-pressed={selection.group === id}
                onClick={() => applyFilters(id, query, true)}>
                {label}<span className="font-mono text-xs text-fg-dim">{count}</span>
              </button>
            ))}
          </div>

          <div className="mt-3 flex min-h-8 flex-wrap items-center gap-x-4 gap-y-1">
            <p role="status" className="font-mono text-xs text-fg-dim">{shown} of {workCount} shown</p>
            <button type="button" className="min-h-8 rounded-sm text-sm text-accent hover:underline"
              style={{ visibility: active ? 'visible' : 'hidden' }}
              onClick={() => {
                setQuery('')
                applyFilters('all', '', true)
                search.current?.focus()
              }}>
              Clear filters
            </button>
          </div>
        </div>

        {groups.length === 0 && (
          <p className="mt-8 rounded-xl border border-line bg-surface p-6 text-fg-dim">No work matches these filters.</p>
        )}

        {groups.map(({ id, label, items }) => (
          <ViewTransition key={id} default="none" enter="all-work-enter" exit="all-work-exit">
            <section aria-labelledby={`work-${id}`} className="mt-9">
              <h2 id={`work-${id}`} className="all-work-eyebrow">
                {label}<span className="tracking-normal text-fg-dim">{items.length}</span>
              </h2>
              <div className="mt-3 rounded-xl border border-line bg-surface">
                <div aria-hidden="true" className="all-work-columns font-mono text-xs text-fg-dim">
                  <span>Year</span><span>Name</span><span>Built with</span><span>Status</span><span>Stars</span>
                </div>
                <ul role="list">
                  {items.map((item) => (
                    <ViewTransition key={item.name} default="none" enter="all-work-enter" exit="all-work-exit" update="all-work-move">
                      <WorkRow item={item} />
                    </ViewTransition>
                  ))}
                </ul>
              </div>
              {id === 'paid' && <p className="mt-3 text-sm text-fg-dim"><strong className="text-fg">Disclosures.</strong> Paid posts are labelled on X.</p>}
            </section>
          </ViewTransition>
        ))}

        <section className="mt-10" aria-labelledby="work-statuses">
          <h2 id="work-statuses" className="all-work-eyebrow">What the statuses mean</h2>
          <dl className="mt-3 grid gap-x-6 gap-y-3 rounded-xl border border-line bg-surface p-5 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(workStatuses).map(([status, definition]) => (
              <div key={status}>
                <dt className="font-mono text-xs text-fg">{status}</dt>
                <dd className="mt-1 text-sm text-fg-dim">{definition}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

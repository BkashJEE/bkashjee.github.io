import { useEffect, useMemo, useState } from 'react'
import { BrandMark } from './components/BrandMark'
import github from './content/github.json'
import { archiveExtras, identity } from './content/projects'

interface Entry {
  name: string
  description: string
  language: string
  topics: string[]
  stars: number | null
  created: string
  pushed: string | null
  href: string
  /** Private projects link to their case study instead of a repo. */
  external: boolean
}

// Public repos come from github.json, refreshed at every build; private
// projects are listed by hand and point at their case study.
const entries: Entry[] = [
  ...github.repos.map((r) => ({
    name: r.name,
    description: r.description ?? '',
    language: r.language ?? 'Other',
    topics: r.topics ?? [],
    stars: r.stars,
    created: r.created,
    pushed: r.pushed,
    href: r.url,
    external: true,
  })),
  ...archiveExtras.map((p) => ({
    name: p.name,
    description: p.description,
    language: p.language,
    topics: [],
    stars: null,
    created: p.created,
    pushed: null,
    href: p.href,
    external: false,
  })),
]

const totalStars = entries.reduce((sum, e) => sum + (e.stars ?? 0), 0)

const languages = [...new Set(entries.map((e) => e.language))]
  .map((lang) => ({ lang, count: entries.filter((e) => e.language === lang).length }))
  .sort((a, b) => b.count - a.count || a.lang.localeCompare(b.lang))

/** GitHub's own language hues, so the dot means the same thing it does there. */
const langDot: Record<string, string> = {
  Python: 'bg-[#3572A5]',
  TypeScript: 'bg-[#3178c6]',
  JavaScript: 'bg-[#f1e05a]',
  QML: 'bg-[#44a51c]',
  HTML: 'bg-[#e34c26]',
  Shell: 'bg-[#89e051]',
}

const sorts = [
  { id: 'stars', label: 'Most stars', by: (a: Entry, b: Entry) => (b.stars ?? -1) - (a.stars ?? -1) },
  { id: 'pushed', label: 'Recently pushed', by: (a: Entry, b: Entry) => (b.pushed ?? '').localeCompare(a.pushed ?? '') },
  { id: 'newest', label: 'Newest', by: (a: Entry, b: Entry) => b.created.localeCompare(a.created) },
] as const

type SortId = (typeof sorts)[number]['id']

/** "pushed 5 days ago" is the clearest signal that work is still alive. */
function ago(iso: string | null) {
  if (!iso) return null
  const days = Math.max(0, Math.round((Date.now() - new Date(`${iso}T12:00:00Z`).getTime()) / 86_400_000))
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days} days ago`
  const months = Math.round(days / 30)
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`
  const years = Math.round(days / 365)
  return `${years} year${years === 1 ? '' : 's'} ago`
}

function Card({ entry }: { entry: Entry }) {
  const pushed = ago(entry.pushed)
  return (
    <article className="flex h-full flex-col rounded-xl border border-line bg-surface/60 p-5 transition-[border-color,background-color,transform] duration-300 hover:border-fg-faint hover:bg-surface motion-safe:hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <h2 className="min-w-0 font-display text-[1.05rem] font-semibold leading-tight">
          <a
            href={entry.href}
            {...(entry.external ? { target: '_blank', rel: 'noreferrer' } : {})}
            className="text-fg transition-colors hover:text-accent"
          >
            {entry.name}
            <span aria-hidden="true" className="text-fg-faint"> {entry.external ? '↗' : '→'}</span>
          </a>
        </h2>
        {entry.stars == null ? (
          <span className="shrink-0 rounded-full border border-line px-2 py-0.5 font-mono text-[0.72rem] uppercase tracking-wider text-fg-faint">
            Private
          </span>
        ) : (
          <span className="shrink-0 font-mono text-[0.72rem] text-fg-dim" title={`${entry.stars} GitHub stars`}>
            <span className="text-accent" aria-hidden="true">★</span> {entry.stars}
            <span className="sr-only"> GitHub stars</span>
          </span>
        )}
      </div>

      {entry.description && <p className="mt-2 flex-1 text-[0.88rem] leading-6 text-fg-dim">{entry.description}</p>}

      {entry.topics.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`${entry.name} topics`}>
          {entry.topics.slice(0, 4).map((topic) => (
            <li key={topic} className="rounded-full border border-line px-2 py-0.5 font-mono text-[0.72rem] text-fg-faint">
              {topic}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-3 font-mono text-[0.72rem] text-fg-faint">
        <span className="flex items-center gap-1.5">
          <span className={`size-2 rounded-full ${langDot[entry.language] ?? 'bg-fg-faint'}`} aria-hidden="true" />
          {entry.language}
        </span>
        {pushed ? <span>pushed {pushed}</span> : <span>{entry.created.slice(0, 4)}</span>}
      </div>
    </article>
  )
}

export default function ArchivePage() {
  const [query, setQuery] = useState('')
  const [lang, setLang] = useState('All')
  const [sort, setSort] = useState<SortId>('stars')

  // Filters live in the URL hash, so a filtered view is a shareable link.
  useEffect(() => {
    const p = new URLSearchParams(location.hash.slice(1))
    if (p.get('q')) setQuery(p.get('q')!)
    if (p.get('lang')) setLang(p.get('lang')!)
    const s = p.get('sort')
    if (s && sorts.some((x) => x.id === s)) setSort(s as SortId)
  }, [])

  useEffect(() => {
    const p = new URLSearchParams()
    if (query) p.set('q', query)
    if (lang !== 'All') p.set('lang', lang)
    if (sort !== 'stars') p.set('sort', sort)
    const hash = p.toString()
    history.replaceState(null, '', hash ? `#${hash}` : location.pathname)
  }, [query, lang, sort])

  // "/" focuses the search box, as long as you are not already typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement
      if (e.key !== '/' || el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return
      e.preventDefault()
      document.getElementById('archive-search')?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return entries
      .filter((e) => lang === 'All' || e.language === lang)
      .filter((e) =>
        !q ||
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.topics.some((t) => t.toLowerCase().includes(q)),
      )
      .sort(sorts.find((s) => s.id === sort)!.by)
  }, [query, lang, sort])

  return (
    <div className="min-h-svh">
      <header className="border-b border-line">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4" aria-label="Main">
          <BrandMark />
          <a href="/" className="font-mono text-[0.8rem] text-fg-dim transition-colors hover:text-fg">
            ← Back to portfolio
          </a>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <p className="flex items-center gap-2.5 font-mono text-[0.8rem] uppercase tracking-[0.25em] text-accent">
          <span className="size-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
          {identity.name}
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-tight">Project archive</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-fg-dim">
          Every public project I’ve published, plus the private ones featured on the portfolio. Search it, filter it by
          language, or sort by what is moving.
        </p>

        <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
          {[
            [String(github.repos.length), 'public repos'],
            [String(totalStars), 'stars'],
            [String(languages.length), 'languages'],
            [github.fetched ?? '—', 'last refreshed'],
          ].map(([value, label]) => (
            <div key={label}>
              <dd className="font-display text-[1.4rem] leading-none text-fg">{value}</dd>
              <dt className="mt-1 font-mono text-[0.72rem] uppercase tracking-wider text-fg-faint">{label}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <label htmlFor="archive-search" className="sr-only">
              Search projects
            </label>
            <input
              id="archive-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, description, topic"
              className="w-full rounded-full border border-line bg-surface/70 px-4 py-2.5 pr-10 font-mono text-[0.78rem] text-fg placeholder:text-fg-faint focus-visible:border-accent focus-visible:outline-none"
            />
            <kbd
              aria-hidden="true"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-line px-1.5 font-mono text-[0.72rem] text-fg-faint"
            >
              /
            </kbd>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="archive-sort" className="font-mono text-[0.72rem] uppercase tracking-wider text-fg-faint">
              Sort
            </label>
            <select
              id="archive-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortId)}
              className="rounded-full border border-line bg-surface/70 px-3 py-2 font-mono text-[0.75rem] text-fg focus-visible:border-accent focus-visible:outline-none"
            >
              {sorts.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by language">
          {[{ lang: 'All', count: entries.length }, ...languages].map((l) => {
            const on = l.lang === lang
            return (
              <button
                key={l.lang}
                type="button"
                aria-pressed={on}
                onClick={() => setLang(l.lang)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[0.72rem] transition-colors ${
                  on ? 'border-accent bg-accent/10 text-accent' : 'border-line text-fg-dim hover:border-fg-faint hover:text-fg'
                }`}
              >
                {l.lang !== 'All' && (
                  <span className={`size-2 rounded-full ${langDot[l.lang] ?? 'bg-fg-faint'}`} aria-hidden="true" />
                )}
                {l.lang}
                <span className="text-fg-faint">{l.count}</span>
              </button>
            )
          })}
        </div>

        <p aria-live="polite" className="mt-6 font-mono text-[0.72rem] uppercase tracking-wider text-fg-faint">
          {shown.length} of {entries.length} shown
          {lang !== 'All' ? ` · ${lang}` : ''}
          {query ? ` · “${query}”` : ''}
        </p>

        {shown.length === 0 ? (
          <p className="mt-10 rounded-xl border border-dashed border-line px-6 py-10 text-center text-fg-dim">
            Nothing matches that.{' '}
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setLang('All')
              }}
              className="link-sweep text-accent"
            >
              Clear the filters
            </button>
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((entry) => (
              <Card key={entry.name} entry={entry} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

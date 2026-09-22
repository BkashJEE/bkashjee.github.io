import { useState } from 'react'
import { mostViewedTabs, viewedProvenance, viewedUseCases, type MostViewedTab, type ViewedUseCase } from '../../content/mostViewed'

const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : String(n))
const prettyDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

const tabAccent: Record<MostViewedTab, string> = {
  hermes: 'from-violet/25',
  omarchy: 'from-accent/25',
  'jev-hermes': 'from-teal/25',
}

/**
 * One use case as a flashcard: media or a typographic panel, the real view
 * count, and a hover preview that slides the post's own summary up over it.
 * The whole card links to the original post.
 */
function Card({ entry, rank }: { entry: ViewedUseCase; rank: number }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface/70 transition-[border-color,transform,box-shadow] duration-300 hover:border-fg-faint hover:shadow-2xl hover:shadow-black/40 motion-safe:hover:-translate-y-1.5">
      <a href={entry.postUrl} target="_blank" rel="noreferrer" className="flex h-full flex-col focus-visible:outline-none">
        <div className="relative aspect-[16/9] overflow-hidden border-b border-line bg-ink">
          {entry.image ? (
            <img
              src={entry.image.src}
              width={entry.image.width}
              height={entry.image.height}
              alt={entry.image.alt}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
            />
          ) : (
            <div className={`flex size-full items-end bg-gradient-to-br ${tabAccent[entry.tab]} via-transparent to-transparent p-5`}>
              <span aria-hidden="true" className="font-display text-[3.5rem] leading-none text-fg/80">
                {compact(entry.impressions)}
              </span>
              <span className="mb-2 ml-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-fg-faint">views</span>
            </div>
          )}
          <span className="absolute left-4 top-4 rounded-full border border-line bg-ink/85 px-2.5 py-1 font-mono text-[0.68rem] text-fg-dim">
            #{rank} most viewed
          </span>
          {/* Hover preview: the post's own summary slides up over the media. */}
          <div className="absolute inset-0 flex translate-y-full flex-col justify-end bg-ink/94 p-5 transition-transform duration-300 ease-out group-hover:translate-y-0 motion-reduce:hidden">
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-fg-faint">From the post</p>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-fg">“{entry.postText}”</p>
            <p className="mt-3 font-mono text-[0.72rem] text-accent">Read it on X ↗</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-[1.15rem] leading-snug text-fg">{entry.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-dim motion-safe:group-hover:text-fg-dim/90">
            {entry.summary}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.72rem] text-fg-faint">
            <span className="text-fg">{entry.impressions.toLocaleString('en-GB')} views</span>
            <span>{entry.likes} likes</span>
            <span>{entry.bookmarks} saves</span>
            <span className="ml-auto">{prettyDate(entry.date)}</span>
          </div>
        </div>
      </a>
      {(entry.projectHref || entry.repoUrl) && (
        <div className="flex gap-4 border-t border-line px-5 py-3 font-mono text-[0.72rem]">
          {entry.projectHref && (
            <a href={entry.projectHref} className="link-sweep text-accent">
              See the project
            </a>
          )}
          {entry.repoUrl && (
            <a href={entry.repoUrl} target="_blank" rel="noreferrer" className="link-sweep text-fg-dim hover:text-fg">
              Source ↗
            </a>
          )}
        </div>
      )}
    </article>
  )
}

export function MostViewed() {
  const [tab, setTab] = useState<MostViewedTab>('jev-hermes')
  const entries = viewedUseCases.filter((e) => e.tab === tab).sort((a, b) => b.impressions - a.impressions)
  const active = mostViewedTabs.find((t) => t.id === tab)!
  const total = entries.reduce((sum, e) => sum + e.impressions, 0)

  return (
    <section className="mx-auto max-w-6xl px-6 pb-8">
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Use case topics">
        {mostViewedTabs.map((t) => {
          const selected = t.id === tab
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setTab(t.id)}
              className={`rounded-full border px-4 py-2 font-mono text-[0.78rem] transition-colors ${
                selected ? 'border-accent bg-accent/10 text-accent' : 'border-line text-fg-dim hover:border-fg-faint hover:text-fg'
              }`}
            >
              {t.label}
              <span className="ml-2 text-fg-faint">{viewedUseCases.filter((e) => e.tab === t.id).length}</span>
            </button>
          )
        })}
      </div>

      <p className="mt-5 max-w-2xl leading-relaxed text-fg-dim">{active.blurb}</p>
      <p className="mt-2 font-mono text-[0.72rem] uppercase tracking-wider text-fg-faint">
        Ranked by X impressions · {compact(total)} views across these {entries.length} · {viewedProvenance.source}, exported{' '}
        {prettyDate(viewedProvenance.exported)}
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry, i) => (
          <Card key={entry.id} entry={entry} rank={i + 1} />
        ))}
      </div>
    </section>
  )
}

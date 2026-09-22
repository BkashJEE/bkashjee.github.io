import { useState } from 'react'
import { audience, mostViewedTabs, viewedProvenance, viewedUseCases, type MostViewedTab, type ViewedUseCase } from '../../content/mostViewed'

const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : String(n))
const prettyDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

const tabAccent: Record<MostViewedTab, string> = {
  hermes: 'from-violet/25',
  omarchy: 'from-accent/25',
  'jev-hermes': 'from-teal/25',
}


// One line icon per topic, same 24px grid and 1.5px stroke as the plugin icons.
const tabIcon: Record<MostViewedTab, React.ReactNode> = {
  hermes: (
    <>
      <path d="M12 3.5c3 2.2 5.2 3 7.5 3.2-.4 6-3 10-7.5 13.8C7.5 16.7 4.9 12.7 4.5 6.7 6.8 6.5 9 5.7 12 3.5Z" />
      <path d="M9.2 12.1l2 2.1 3.6-4" />
    </>
  ),
  omarchy: (
    <>
      <rect x="3" y="4.5" width="18" height="13" rx="2" />
      <path d="M3 9h18M8 21h8M12 17.5V21" />
      <circle cx="6.4" cy="6.7" r="0.7" fill="currentColor" stroke="none" />
    </>
  ),
  'jev-hermes': (
    <>
      <path d="M13.4 2.8 5.8 13.2h4.6l-1.2 8 7.6-10.4h-4.6z" />
    </>
  ),
}

const tabIconColor: Record<MostViewedTab, string> = {
  hermes: 'text-violet',
  omarchy: 'text-accent',
  'jev-hermes': 'text-teal',
}

function TopicIcon({ tab, className = 'size-5' }: { tab: MostViewedTab; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${className} ${tabIconColor[tab]}`}
      aria-hidden="true"
    >
      {tabIcon[tab]}
    </svg>
  )
}

/**
 * A flashcard that leads with its topic icon and title. Media (or a quiet
 * gradient panel) sits above; the reach numbers stay small in the footer.
 * Hovering slides the post's own words up over the media.
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
            <div className={`flex size-full items-center justify-center bg-gradient-to-br ${tabAccent[entry.tab]} via-transparent to-transparent`}>
              <TopicIcon tab={entry.tab} className="size-14 opacity-45" />
            </div>
          )}
          <span className="absolute left-4 top-4 rounded-full border border-line bg-ink/85 px-2.5 py-1 font-mono text-[0.66rem] text-fg-faint">
            #{rank}
          </span>
          {/* Hover preview: the post's own opening words slide up over the media. */}
          <div className="absolute inset-0 flex translate-y-full flex-col justify-end bg-ink/94 p-5 transition-transform duration-300 ease-out group-hover:translate-y-0 motion-reduce:hidden">
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-fg-faint">From the post</p>
            <p className="mt-2 text-[0.92rem] leading-relaxed text-fg">“{entry.postText}”</p>
            <p className="mt-3 font-mono text-[0.72rem] text-accent">Read it on X ↗</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-ink">
              <TopicIcon tab={entry.tab} />
            </span>
            <h3 className="font-display text-[1.3rem] leading-tight text-fg transition-colors group-hover:text-accent">
              {entry.title}
            </h3>
          </div>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-dim">{entry.summary}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line/70 pt-3 font-mono text-[0.68rem] text-fg-faint">
            <span>{compact(entry.impressions)} views</span>
            <span aria-hidden="true">·</span>
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

/** Closing tile: the next entry is the reason to follow. */
function FollowCard() {
  return (
    <a
      href={audience.profileUrl}
      target="_blank"
      rel="noreferrer"
      className="group flex h-full flex-col justify-between rounded-2xl border border-accent/40 bg-gradient-to-br from-accent/12 via-transparent to-transparent p-6 transition-[border-color,transform] duration-300 hover:border-accent motion-safe:hover:-translate-y-1.5"
    >
      <div>
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-accent">Next entry</p>
        <h3 className="mt-3 font-display text-[1.3rem] leading-tight text-fg">
          I post each one as I build it. {audience.posts} went out in the last {audience.days} days.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-fg-dim">
          Follow {audience.handle} and the next recipe — agents, desktop, or Jev — shows up in your feed before it lands here.
        </p>
      </div>
      <p className="mt-6 inline-flex items-center gap-2 font-mono text-[0.8rem] text-accent">
        Follow on X
        <span aria-hidden="true" className="transition-transform duration-300 motion-safe:group-hover:translate-x-1">→</span>
      </p>
    </a>
  )
}

const sortModes = [
  { id: 'views', label: 'Most viewed', by: (a: ViewedUseCase, b: ViewedUseCase) => b.impressions - a.impressions },
  { id: 'saves', label: 'Most saved', by: (a: ViewedUseCase, b: ViewedUseCase) => b.bookmarks - a.bookmarks },
  { id: 'newest', label: 'Newest', by: (a: ViewedUseCase, b: ViewedUseCase) => b.date.localeCompare(a.date) },
] as const

export function MostViewed() {
  const [tab, setTab] = useState<MostViewedTab>('jev-hermes')
  const [sort, setSort] = useState<(typeof sortModes)[number]['id']>('views')
  const entries = viewedUseCases
    .filter((e) => e.tab === tab)
    .sort(sortModes.find((m) => m.id === sort)!.by)
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
              <span className="flex items-center gap-2">
                <TopicIcon tab={t.id} className="size-4" />
                {t.label}
                <span className="text-fg-faint">{viewedUseCases.filter((e) => e.tab === t.id).length}</span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-2xl leading-relaxed text-fg-dim">{active.blurb}</p>
        <div className="flex items-center gap-1 rounded-full border border-line p-1" role="group" aria-label="Sort entries">
          {sortModes.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={sort === m.id}
              onClick={() => setSort(m.id)}
              className={`rounded-full px-3 py-1.5 font-mono text-[0.7rem] transition-colors ${
                sort === m.id ? 'bg-raised text-fg' : 'text-fg-faint hover:text-fg'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-line bg-ink/60 px-5 py-4">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          {[
            [compact(audience.impressions), 'views'],
            [audience.bookmarks.toLocaleString('en-GB'), 'saves'],
            [audience.newFollows.toLocaleString('en-GB'), 'new followers'],
          ].map(([value, label]) => (
            <span key={label} className="flex items-baseline gap-1.5">
              <strong className="font-display text-[1.4rem] leading-none text-fg">{value}</strong>
              <span className="font-mono text-[0.72rem] uppercase tracking-wider text-fg-faint">{label}</span>
            </span>
          ))}
          <span className="font-mono text-[0.7rem] text-fg-faint">
            in {audience.days} days, to {prettyDate(audience.to)}
          </span>
        </div>
        <a
          href={audience.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="ml-auto rounded-full bg-accent px-5 py-2.5 font-mono text-[0.8rem] font-medium text-ink transition-opacity hover:opacity-90"
        >
          Follow {audience.handle}
        </a>
      </div>
      <p className="mt-2 font-mono text-[0.72rem] uppercase tracking-wider text-fg-faint">
        {sortModes.find((m) => m.id === sort)!.label} · {compact(total)} views across these {entries.length} ·{' '}
        {viewedProvenance.source}, exported {prettyDate(viewedProvenance.exported)}
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((entry, i) => (
          <Card key={entry.id} entry={entry} rank={i + 1} />
        ))}
        <FollowCard />
      </div>
    </section>
  )
}

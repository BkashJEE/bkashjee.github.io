import { useState } from 'react'
import { audience, mostViewedTabs, viewedProvenance, viewedUseCases, type MostViewedTab, type ViewedUseCase } from '../../content/mostViewed'

const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : String(n))
const prettyDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })


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

const tabDot: Record<MostViewedTab, string> = {
  hermes: 'bg-violet',
  omarchy: 'bg-accent',
  'jev-hermes': 'bg-teal',
}

const tabTopEdge: Record<MostViewedTab, string> = {
  hermes: 'border-t-violet/70',
  omarchy: 'border-t-accent/70',
  'jev-hermes': 'border-t-teal/70',
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

/** Eye and bookmark glyphs, same 24px grid and 1.5px stroke as the topic icons. */
const metricIcon = {
  views: (
    <>
      <path d="M2.5 12S5.8 5.8 12 5.8 21.5 12 21.5 12 18.2 18.2 12 18.2 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  saves: <path d="M6.5 3.8h11a1 1 0 0 1 1 1v15.4l-6.5-4-6.5 4V4.8a1 1 0 0 1 1-1Z" />,
} as const

function MetricIcon({ kind }: { kind: keyof typeof metricIcon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-3.5 shrink-0"
      aria-hidden="true"
    >
      {metricIcon[kind]}
    </svg>
  )
}

/**
 * A flashcard that leads with its topic icon and title. Media (or a quiet
 * gradient panel) sits above; the reach numbers stay small in the footer.
 * Hovering slides the post's own words up over the media.
 */
function Card({ entry, rank }: { entry: ViewedUseCase; rank: number }) {
  const label = mostViewedTabs.find((t) => t.id === entry.tab)!.label
  return (
    <article
      id={entry.id}
      className={`group relative flex h-full scroll-mt-24 flex-col overflow-hidden rounded-xl border border-t-2 border-line ${tabTopEdge[entry.tab]} bg-surface/70 transition-[border-color,transform,box-shadow] duration-300 [&:target]:border-accent hover:shadow-2xl hover:shadow-black/40 motion-safe:hover:-translate-y-1`}
    >
      {entry.image && (
        <a href={entry.postUrl} target="_blank" rel="noreferrer" className="relative block aspect-[16/9] overflow-hidden border-b border-line bg-ink">
          <img
            src={entry.image.src}
            width={entry.image.width}
            height={entry.image.height}
            alt={entry.image.alt}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.04]"
          />
          {/* Hover preview: the post's own opening words slide up over the media. */}
          <div className="absolute inset-0 flex translate-y-full flex-col justify-end bg-ink/94 p-5 transition-transform duration-300 ease-out group-hover:translate-y-0 motion-reduce:hidden">
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-fg-faint">From the post</p>
            <p className="mt-2 text-[0.9rem] leading-relaxed text-fg">“{entry.postText}”</p>
          </div>
        </a>
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Rank left, topic right — the header split from the reference card. */}
        <div className={`flex items-center justify-between gap-3 font-mono text-[0.68rem] ${tabIconColor[entry.tab]}`}>
          <span>#{rank}</span>
          <span className="uppercase tracking-[0.14em]">{label}</span>
        </div>

        <h3 className="mt-3 flex items-start gap-3 font-display text-[1.45rem] leading-[1.12] tracking-[-0.02em] text-fg sm:text-[1.6rem]">
          <TopicIcon tab={entry.tab} className="mt-1 size-5 shrink-0" />
          <a href={entry.postUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-accent focus-visible:outline-offset-4">
            {entry.title}
          </a>
        </h3>

        <div className="mt-3 flex flex-1 gap-2.5 text-[0.95rem] leading-relaxed text-fg-dim">
          <span className={`${tabIconColor[entry.tab]} select-none leading-relaxed`} aria-hidden="true">
            •
          </span>
          <p>{entry.summary}</p>
        </div>

        {!entry.image && (
          <p className="mt-4 line-clamp-3 border-l-2 border-line pl-3 text-[0.85rem] leading-relaxed text-fg-faint transition-colors group-hover:border-accent/60 group-hover:text-fg-dim">
            “{entry.postText}”
          </p>
        )}

        {/* Figures, labelled and in full — no rounding to hide behind. */}
        <dl className="mt-5 flex gap-8 border-t border-line pt-4">
          {([
            ['views', 'Views', entry.impressions],
            ['saves', 'Saves', entry.bookmarks],
          ] as const).map(([kind, label, value]) => (
            <div key={kind}>
              <dt className="flex items-center gap-1.5 font-mono text-[0.68rem] text-fg-faint">
                <MetricIcon kind={kind} />
                {label}
              </dt>
              <dd className="mt-1 font-display text-[1.3rem] leading-none tracking-tight text-fg">
                {value.toLocaleString('en-GB')}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 font-mono text-[0.68rem] text-fg-faint">X post · {prettyDate(entry.date)}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[0.72rem]">
          <a href={entry.postUrl} target="_blank" rel="noreferrer" className="link-sweep text-accent">
            Read on X
          </a>
          {entry.projectHref && (
            <a href={entry.projectHref} className="link-sweep text-fg-dim hover:text-fg">
              See the project
            </a>
          )}
          {entry.repoUrl && (
            <a href={entry.repoUrl} target="_blank" rel="noreferrer" className="link-sweep text-fg-dim hover:text-fg">
              Source
            </a>
          )}
          <a
            href={entry.postUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open the post: ${entry.title}`}
            className="ml-auto text-accent transition-transform duration-300 motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5"
          >
            ↗
          </a>
        </div>
      </div>
    </article>
  )
}

/**
 * First tile of every tab: what the topic is, and the two entries to read
 * before the rest. The picks jump to the cards further down the same grid.
 */
function StartHereCard({ tab }: { tab: MostViewedTab }) {
  const topic = mostViewedTabs.find((t) => t.id === tab)!
  const picks = topic.startHere.picks
    .map((id) => viewedUseCases.find((e) => e.id === id))
    .filter((e): e is ViewedUseCase => Boolean(e))
  return (
    <article className="flex h-full flex-col rounded-xl border border-dashed border-line bg-ink/40 p-5 sm:p-6">
      <p className="flex items-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.18em] text-fg-faint">
        <span className={`size-2 shrink-0 rounded-full ${tabDot[tab]}`} aria-hidden="true" />
        Start here
      </p>
      <h3 className="mt-3 flex items-start gap-3 font-display text-[1.45rem] leading-[1.12] tracking-[-0.02em] text-fg sm:text-[1.6rem]">
        <TopicIcon tab={tab} className="mt-1 size-5 shrink-0" />
        <span>New to {topic.label}? Read these {picks.length} first</span>
      </h3>
      <p className="mt-3 text-[0.95rem] leading-relaxed text-fg-dim">{topic.startHere.lede}</p>
      <ol className="mt-4 flex-1 space-y-2.5">
        {picks.map((pick, i) => (
          <li key={pick.id}>
            <a href={`#${pick.id}`} className="group/pick flex gap-3 text-[0.9rem] leading-snug text-fg-dim transition-colors hover:text-fg">
              <span className="font-mono text-[0.7rem] leading-5 text-fg-faint">{i + 1}</span>
              <span className="underline decoration-line underline-offset-4 transition-colors group-hover/pick:decoration-accent">
                {pick.title}
              </span>
            </a>
          </li>
        ))}
      </ol>
      <a
        href={topic.startHere.docs.href}
        target="_blank"
        rel="noreferrer"
        className="link-sweep mt-5 border-t border-line pt-3 font-mono text-[0.7rem] text-fg-faint transition-colors hover:text-fg"
      >
        {topic.startHere.docs.label} ↗
      </a>
    </article>
  )
}

/** Closing question for the active tab: a reply is the cheapest way in. */
function AskStrip({ tab }: { tab: MostViewedTab }) {
  const topic = mostViewedTabs.find((t) => t.id === tab)!
  const href = `https://x.com/intent/post?text=${encodeURIComponent(`${topic.ask.prompt} ${audience.handle}`)}`
  return (
    <div className="mt-6 flex flex-col gap-4 rounded-xl border border-line bg-surface/50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div>
        <h3 className="font-display text-[1.2rem] leading-tight text-fg">{topic.ask.question}</h3>
        <p className="mt-1.5 text-[0.9rem] leading-relaxed text-fg-dim">Post it at me — I read every reply.</p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="shrink-0 rounded-full border border-accent/50 px-5 py-2.5 text-center font-mono text-[0.78rem] text-accent transition-colors hover:bg-accent/10"
      >
        Reply on X ↗
      </a>
    </div>
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
      <div className="-mx-6 flex snap-x gap-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0" role="tablist" aria-label="Use case topics">
        {mostViewedTabs.map((t) => {
          const selected = t.id === tab
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setTab(t.id)}
              className={`shrink-0 snap-start rounded-full border px-4 py-2 font-mono text-[0.78rem] transition-colors ${
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

      <div className="mt-6 flex flex-col gap-4 rounded-xl border border-line bg-ink/60 px-5 py-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6">
        <div className="grid grid-cols-3 gap-3 sm:flex sm:flex-wrap sm:items-baseline sm:gap-x-5 sm:gap-y-2">
          {[
            [compact(audience.impressions), 'views'],
            [audience.bookmarks.toLocaleString('en-GB'), 'saves'],
            [audience.newFollows.toLocaleString('en-GB'), 'new followers'],
          ].map(([value, label]) => (
            <span key={label} className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-1.5">
              <strong className="font-display text-[1.25rem] leading-none text-fg sm:text-[1.4rem]">{value}</strong>
              <span className="font-mono text-[0.64rem] uppercase tracking-wider text-fg-faint sm:text-[0.72rem]">{label}</span>
            </span>
          ))}
          <span className="col-span-3 font-mono text-[0.7rem] text-fg-faint sm:col-span-1">
            in {audience.days} days, to {prettyDate(audience.to)}
          </span>
        </div>
        <a
          href={audience.profileUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-accent px-5 py-3 text-center font-mono text-[0.8rem] font-medium text-ink transition-opacity hover:opacity-90 sm:ml-auto sm:py-2.5"
        >
          Follow {audience.handle}
        </a>
      </div>
      <p className="mt-2 font-mono text-[0.72rem] uppercase tracking-wider text-fg-faint">
        {sortModes.find((m) => m.id === sort)!.label} · {compact(total)} views across these {entries.length} ·{' '}
        {viewedProvenance.source}, exported {prettyDate(viewedProvenance.exported)}
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StartHereCard tab={tab} />
        {entries.map((entry, i) => (
          <Card key={entry.id} entry={entry} rank={i + 1} />
        ))}
        <FollowCard />
      </div>

      <AskStrip tab={tab} />
    </section>
  )
}

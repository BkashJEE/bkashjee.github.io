import { useState } from 'react'
import { identity } from '../content/projects'
import { viewedUseCases } from '../content/mostViewed'

const top = [...viewedUseCases].sort((a, b) => b.impressions - a.impressions).slice(0, 10)
const handle = `@${identity.x.split('/').pop()}`

/** Counts the way X prints them: 139, 4.2K, 116K, 2.3M. */
function count(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 10_000) return `${Math.round(n / 1000)}K`
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return String(n)
}

const day = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

/** X's own action-row glyphs, redrawn on a 24px, 1.75px-stroke grid. */
const glyph = {
  reply: <path d="M4.5 11.5a7 7 0 0 1 7-7h1a7 7 0 0 1 0 14H9l-4 3v-4.6a7 7 0 0 1-.5-2.4Z" />,
  reposts: <path d="M4 10V8a3 3 0 0 1 3-3h12m-3-3 3 3-3 3M20 14v2a3 3 0 0 1-3 3H5m3 3-3-3 3-3" />,
  likes: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20Z" />,
  impressions: <path d="M5 20v-6M10 20V9M15 20v-7M20 20V4" />,
} as const

const Glyph = ({ k }: { k: keyof typeof glyph }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-3.5" aria-hidden="true">
    {glyph[k]}
  </svg>
)

type Post = (typeof top)[number]

/**
 * An embedded-tweet card in the site's own dark surface and amber, so it
 * reads as a post without outshining the hero. The whole card opens the
 * post.
 */
function PostCard({ post, copy }: { post: Post; copy: boolean }) {
  const tab = copy ? -1 : undefined
  return (
    <article className="relative flex w-[16.5rem] flex-col rounded-xl border border-line bg-surface/75 p-3 text-left text-fg transition-colors hover:border-accent/60 hover:bg-surface">
      <div className="flex items-center gap-2.5">
        <img src="/assets/avatar.webp" alt="" width={32} height={32} loading="lazy" decoding="async" className="size-8 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[0.82rem] font-semibold">{identity.name}</p>
          <p className="text-[0.78rem] text-fg-faint">{handle}</p>
        </div>
      </div>
      <p className="mt-2 line-clamp-2 whitespace-normal text-[0.82rem] leading-snug text-fg-dim">{post.title}</p>
      <a
        href={post.postUrl}
        target="_blank"
        rel="noreferrer"
        tabIndex={tab}
        aria-label={`${post.title}, ${count(post.impressions)} views. Open the post on X`}
        className="mt-1 inline-flex min-h-6 items-center self-start text-[0.78rem] text-fg-faint after:absolute after:inset-0 after:rounded-xl hover:underline"
      >
        {day(post.date)}
      </a>
      <div className="mt-auto flex items-center gap-4 pt-2 text-[0.78rem] tabular-nums text-fg-faint">
        <Glyph k="reply" />
        {(['reposts', 'likes', 'impressions'] as const).map((k) => (
          <span key={k} className={`flex items-center gap-1.5 ${k === 'impressions' ? 'font-medium text-accent' : ''}`}>
            <Glyph k={k} />
            {count(post[k])}
            {k === 'impressions' && <span className="font-normal text-fg-faint">views</span>}
          </span>
        ))}
      </div>
    </article>
  )
}

/**
 * The ten most-viewed posts as embedded-tweet cards, drifting along the hero's
 * bottom edge. Only transform moves (no scale, no blur); it stops on hover or
 * focus, has its own pause button, and stands still as a swipeable row under
 * reduced motion.
 */
export function HeroTicker() {
  const [paused, setPaused] = useState(false)
  // The list is drawn twice so the loop is seamless; the copy is hidden from
  // screen readers and the keyboard.
  const row = (copy: boolean) => (
    <ul className="flex shrink-0 items-stretch gap-3 pr-3" aria-hidden={copy || undefined}>
      {top.map((p) => (
        <li key={p.id} className="flex">
          <PostCard post={p} copy={copy} />
        </li>
      ))}
    </ul>
  )
  return (
    <div className="hero-rise relative z-10 border-t border-line bg-bg" style={{ '--d': '0.45s' } as React.CSSProperties}>
      <div className="mx-auto max-w-6xl px-6 pt-2 pb-3">
        <div className="mb-1 flex flex-wrap items-center gap-x-4 gap-y-1">
          <p className="font-mono text-[0.8rem] uppercase tracking-[0.25em] text-fg-faint">Most viewed on X</p>
          <a href={identity.x} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center text-[0.8rem] text-accent transition-colors hover:text-fg">
            View {handle} on X ↗
          </a>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            aria-label={paused ? 'Play the most-viewed posts' : 'Pause the most-viewed posts'}
            className="ml-auto hidden size-11 shrink-0 items-center justify-center rounded-full border border-line text-fg-dim transition-colors hover:border-accent hover:text-fg motion-safe:flex"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              {paused ? <path d="M3 1.5v9l7.5-4.5z" /> : <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" />}
            </svg>
          </button>
        </div>
        <div className="ticker-mask overflow-x-auto py-1 [contain:paint] motion-safe:overflow-hidden" aria-label="My most-viewed posts on X" role="region">
          <div className={`ticker-track flex w-max ${paused ? 'is-paused' : ''}`}>
            {row(false)}
            {row(true)}
          </div>
        </div>
      </div>
    </div>
  )
}

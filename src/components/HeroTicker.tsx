import { useState } from 'react'
import { viewedUseCases } from '../content/mostViewed'

const top = [...viewedUseCases].sort((a, b) => b.impressions - a.impressions).slice(0, 10)
const views = (n: number) => `${Math.round(n / 1000)}K`

/**
 * The ten most-viewed posts, drifting along the hero's bottom edge. Only
 * transform moves (no scale, no blur), it stops on hover or focus, has its own
 * pause button, and stands still as a swipeable row under reduced motion.
 */
export function HeroTicker() {
  const [paused, setPaused] = useState(false)
  // The list is drawn twice so the loop is seamless; the copy is hidden from
  // screen readers and the keyboard.
  const row = (copy: boolean) => (
    <ul className="flex shrink-0 items-center gap-3 pr-3" aria-hidden={copy || undefined}>
      {top.map((p) => (
        <li key={p.id}>
          <a
            href={p.postUrl}
            target="_blank"
            rel="noreferrer"
            tabIndex={copy ? -1 : undefined}
            className="flex min-h-11 items-center gap-2.5 whitespace-nowrap rounded-full border border-line bg-surface px-4 text-[0.88rem] text-fg-dim transition-colors hover:border-accent hover:text-fg"
          >
            <span className="font-mono text-[0.8rem] font-medium tabular-nums text-accent">{views(p.impressions)}</span>
            {p.title}
            <span aria-hidden="true" className="text-fg-faint">↗</span>
          </a>
        </li>
      ))}
    </ul>
  )
  return (
    <div className="hero-rise relative z-10 border-t border-line bg-bg" style={{ '--d': '0.45s' } as React.CSSProperties}>
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-3">
        <p className="hidden shrink-0 font-mono text-[0.8rem] uppercase tracking-[0.25em] text-fg-faint sm:block">
          Most viewed on X
        </p>
        <div className="ticker-mask min-w-0 flex-1 overflow-x-auto [contain:paint] motion-safe:overflow-hidden" aria-label="My most-viewed posts on X" role="region">
          <div className={`ticker-track flex w-max ${paused ? 'is-paused' : ''}`}>
            {row(false)}
            {row(true)}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? 'Play the most-viewed posts' : 'Pause the most-viewed posts'}
          className="hidden size-11 shrink-0 items-center justify-center rounded-full border border-line text-fg-dim transition-colors hover:border-accent hover:text-fg motion-safe:flex"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            {paused ? <path d="M3 1.5v9l7.5-4.5z" /> : <path d="M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z" />}
          </svg>
        </button>
      </div>
    </div>
  )
}

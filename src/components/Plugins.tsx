import { useEffect, useRef, useState } from 'react'
import { plugins, upstreamPRs, upstreamPRsUrl, type Plugin } from '../content/projects'
import { useStars } from '../hooks/useStars'
import github from '../content/github.json'
import { Reveal } from '../motion/Reveal'
import { SectionHeading } from './SectionHeading'

// Hand-drawn line icons, one per tool — same 24px grid, 1.5px stroke.
const icons: Record<string, React.ReactNode> = {
  'Hermes Agent Dock': (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="3" y1="15" x2="21" y2="15" />
      <rect x="6.5" y="16.8" width="4" height="1.6" rx="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  'Repo Shelf': (
    <>
      <path d="M4 20V6l3-2v16" />
      <path d="M10 20V4h4v16" />
      <path d="M17 20 15 5l4-.5L21 19z" />
      <line x1="3" y1="20" x2="21" y2="20" />
    </>
  ),
  'Hermes Bot Forge': (
    <>
      <path d="M4 15h9l4 5H6z" />
      <path d="M9 15 15 4l4 2-5 9" />
      <circle cx="18" cy="17.5" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  'Codex Usage Meter': (
    <>
      <path d="M4 18a8 8 0 0 1 16 0" />
      <line x1="12" y1="18" x2="16.5" y2="11.5" />
      <circle cx="12" cy="18" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  'Hermes Skills Library': (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <path d="M17 13.5v7M13.5 17h7" />
    </>
  ),
  'Hermes Agent Archive': (
    <>
      <rect x="3" y="4" width="18" height="5" rx="1.5" />
      <path d="M4.5 9v9.5a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V9" />
      <path d="M9.5 13h5" />
    </>
  ),
  'Hermes Newsroom': (
    <>
      <path d="M4 5.5h13a1.5 1.5 0 0 1 1.5 1.5v11.5a1.5 1.5 0 0 0 1.5-1.5V9" />
      <path d="M4 5.5v13h14.5" />
      <path d="M7 9h7M7 12h7M7 15h4" />
    </>
  ),
  'Hermes Newsroom Plugin': (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M14 4.5v15" />
      <path d="M6.5 9h4M6.5 12.5h4" />
    </>
  ),
  'Hermes Rehearsal': (
    <>
      <path d="M12 4v4" />
      <path d="M6 20v-4.5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2V20" />
      <path d="M12 13.5V8M7 8h10" />
      <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  'Hermes Skills Hub': (
    <>
      <path d="M12 3v6" />
      <path d="M5 9h14l-2 4H7z" />
      <path d="M9 13v5a3 3 0 0 0 6 0v-5" />
    </>
  ),
}

function PluginIcon({ name, ink }: { name: string; ink: string }) {
  const icon = icons[name]
  if (!icon) return null
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={ink}
      aria-hidden="true"
    >
      {icon}
    </svg>
  )
}

/**
 * What each tool is, derived from its install command so the label can't
 * drift from the data. Drives the subtitle and the card's top edge.
 */
function kindOf(plugin: Plugin) {
  if (plugin.install?.startsWith('hermes plugins install')) {
    return { label: 'Hermes plugin', edge: 'border-t-accent/70', tile: 'border-accent/25 bg-accent/10', ink: 'text-accent' }
  }
  if (plugin.install?.startsWith('hermes skills tap add')) {
    return { label: 'Hermes skills tap', edge: 'border-t-teal/70', tile: 'border-teal/25 bg-teal/10', ink: 'text-teal' }
  }
  return { label: 'Open source', edge: 'border-t-violet/70', tile: 'border-violet/25 bg-violet/10', ink: 'text-violet' }
}

/** The one-liner as the reference card's bullets: one per sentence. */
const bulletsOf = (line: string) =>
  line
    .split('. ')
    .map((part) => part.trim().replace(/\.$/, ''))
    .filter(Boolean)

const prStatus: Record<string, { opened: string; state: string }> = github.prs

const stateStyle: Record<string, string> = {
  merged: 'border-violet/50 text-violet',
  open: 'border-teal/50 text-teal',
  draft: 'border-line text-fg-faint',
  closed: 'border-line text-fg-faint',
}

/** Opened date and current state, refreshed from GitHub at every build. */
function PrMeta({ number }: { number: number }) {
  const pr = prStatus[number]
  if (!pr) return null
  const date = new Date(pr.opened + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
  return (
    <span className="ml-auto hidden shrink-0 items-center gap-3 font-mono text-[0.72rem] text-fg-faint sm:flex">
      <span>{date}</span>
      <span className={`rounded-full border px-2 py-0.5 ${stateStyle[pr.state] ?? stateStyle.open}`}>{pr.state}</span>
    </span>
  )
}

function StarCount({ plugin }: { plugin: Plugin }) {
  const stars = useStars(plugin.repo, plugin.stars)
  return (
    <span className="inline-flex shrink-0 items-baseline gap-1.5 font-mono text-[0.72rem] text-fg-faint" title={`${stars} GitHub stars (live)`}>
      <span className="text-accent" aria-hidden="true">★</span>
      <span className="text-fg-dim tabular-nums">{stars}</span>
      <span aria-hidden="true">GitHub stars</span>
      <span className="sr-only">{stars} GitHub stars</span>
    </span>
  )
}

function InstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy install command: ${command}`}
      title={command}
      className="group/cmd mt-4 flex w-full min-w-0 items-center gap-2 rounded-lg border border-line bg-surface/70 px-3 py-2 text-left font-mono text-[0.68rem] text-fg-dim transition-colors hover:border-accent/60 hover:bg-raised focus-visible:border-accent"
    >
      <span className="shrink-0 select-none text-accent" aria-hidden="true">$</span>
      <span className="min-w-0 flex-1 truncate">{command}</span>
      <span className="shrink-0 border-l border-line pl-2 font-medium text-accent" aria-live="polite">
        {copied ? 'Copied' : 'Copy'}
      </span>
    </button>
  )
}

/**
 * Horizontal rail for the tool cards.
 *
 * Ten tools in a three-column grid is four rows of wall; as a rail the
 * section stays one screen tall and keeps its shape as more ship. Scrolling
 * is manual on purpose - an auto-advancing marquee moves content under the
 * reader and repaints continuously, which is what made the hero flicker.
 */
function Rail({ children, count }: { children: React.ReactNode; count: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [at, setAt] = useState({ start: true, end: false })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const read = () => {
      const max = el.scrollWidth - el.clientWidth
      // Snapping settles the last card a few pixels short of max, so the end
      // check needs more slack than the start one or the button never
      // disables.
      setAt({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 16 })
    }
    read()
    el.addEventListener('scroll', read, { passive: true })
    const observer = new ResizeObserver(read)
    observer.observe(el)
    return () => {
      el.removeEventListener('scroll', read)
      observer.disconnect()
    }
  }, [])

  /** One card plus its gap, so a press lands the next card at the same edge. */
  const page = (dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    const card = el.querySelector('article')
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  const arrow =
    'flex size-9 items-center justify-center rounded-full border border-line bg-ink font-mono text-sm text-fg-dim transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-line disabled:hover:text-fg-dim'

  return (
    <div className="mx-auto mt-10 max-w-6xl px-6">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[0.72rem] uppercase tracking-wider text-fg-faint">
          {count} published · <span className="sm:hidden">swipe →</span>
          <span className="hidden sm:inline">most stars first</span>
        </p>
        <div className="hidden gap-2 sm:flex">
          <button type="button" onClick={() => page(-1)} disabled={at.start} aria-label="Previous tools" className={arrow}>
            ←
          </button>
          <button type="button" onClick={() => page(1)} disabled={at.end} aria-label="More tools" className={arrow}>
            →
          </button>
        </div>
      </div>
      {/*
        The rail bleeds to the viewport edge so a partly visible card shows
        there is more; the inner padding keeps the first card aligned with
        every other section. Focusable, so arrow keys scroll it.
      */}
      <div
        ref={ref}
        tabIndex={0}
        role="group"
        aria-label={`${count} published tools, scrolls horizontally`}
        className="flow-scroll mt-4 flex snap-x gap-5 overflow-x-auto pt-1 pb-4 [contain:paint]"
      >
        {children}
      </div>
    </div>
  )
}

export function Plugins() {
  return (
    <section id="plugins" className="overflow-x-clip border-y border-line bg-surface/40 py-20 sm:py-28">
      <SectionHeading eyebrow="Plugins & open source" title="Install something I made" ghost="Tools" />
      <Reveal className="mx-auto max-w-6xl px-6">
        <p className="mt-4 max-w-2xl leading-relaxed text-fg-dim">
          Published tools and plugins, live on GitHub. The private case studies above show what I build; these show how
          I build it.
        </p>
        <p className="mt-2 font-mono text-[0.72rem] uppercase tracking-wider text-fg-faint">
          ★ counts fetched live from GitHub · fallback checked Sep 2026
        </p>
      </Reveal>
      <Rail count={plugins.length}>
        {[...plugins].sort((a, b) => b.stars - a.stars).map((plugin, i) => (
          <Reveal key={plugin.name} delay={0.04 * Math.min(i, 3)} className="w-[min(20rem,80vw)] shrink-0 snap-start">
            <article className={`group/card flex h-full min-w-0 flex-col rounded-xl border border-t-2 border-line ${kindOf(plugin).edge} bg-ink p-5 transition-[border-color,background-color,transform,box-shadow] duration-300 hover:bg-surface/70 hover:shadow-lg hover:shadow-black/20 focus-within:border-accent/35 motion-safe:hover:-translate-y-1`}>
              <div className="flex items-start gap-3">
                <span className={`flex size-10 shrink-0 items-center justify-center rounded-lg border ${kindOf(plugin).tile}`}>
                  <PluginIcon name={plugin.name} ink={kindOf(plugin).ink} />
                </span>
                <div className="min-w-0">
                  <h3 className="font-display text-[1.05rem] font-semibold leading-tight text-fg">{plugin.name}</h3>
                  <p className="mt-1 font-mono text-[0.66rem] text-fg-faint">
                    <span className={kindOf(plugin).ink}>{kindOf(plugin).label}</span> · {plugin.lang}
                  </p>
                </div>
              </div>

              <p className="mt-4 font-mono text-[0.64rem] uppercase tracking-[0.16em] text-fg-faint">What it does</p>
              <ul className="mt-2 flex-1 space-y-1.5">
                {bulletsOf(plugin.line).map((bullet) => (
                  <li key={bullet} className="flex gap-2 text-[0.88rem] leading-6 text-fg-dim">
                    <span className={`${kindOf(plugin).ink} select-none`} aria-hidden="true">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              {plugin.install && <InstallCommand command={plugin.install} />}

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3 font-mono text-[0.72rem]">
                <StarCount plugin={plugin} />
                <a href={plugin.repo} target="_blank" rel="noreferrer" className="inline-flex min-h-8 items-center gap-1.5 font-medium text-accent transition-colors hover:text-fg">
                  View source <span aria-hidden="true" className="transition-transform group-hover/card:translate-x-0.5">↗</span>
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </Rail>

      <Reveal className="mx-auto mt-16 max-w-6xl px-6">
        <h3 className="font-mono text-[0.8rem] uppercase tracking-[0.2em] text-fg-dim">
          Upstream · NousResearch/hermes-agent
        </h3>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {upstreamPRs.map((pr) => (
            <li key={pr.number}>
              <a
                href={`https://github.com/NousResearch/hermes-agent/pull/${pr.number}`}
                target="_blank"
                rel="noreferrer"
                className="group flex items-baseline gap-4 py-3 transition-colors hover:bg-surface/60"
              >
                <span className="shrink-0 font-mono text-[0.78rem] text-accent">#{pr.number}</span>
                <span className="text-sm text-fg-dim transition-colors group-hover:text-fg">{pr.title}</span>
                <PrMeta number={pr.number} />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-mono text-[0.8rem]">
          <a href={upstreamPRsUrl} target="_blank" rel="noreferrer" className="link-sweep text-fg-dim hover:text-fg">
            All pull requests by @BkashJEE ↗
          </a>
        </p>
      </Reveal>
    </section>
  )
}

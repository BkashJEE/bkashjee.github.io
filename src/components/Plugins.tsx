import { useState } from 'react'
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

export function Plugins() {
  return (
    <section id="plugins" className="overflow-clip border-y border-line bg-surface/40 py-20 sm:py-28">
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
      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-5 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {plugins.map((plugin, i) => (
          <Reveal key={plugin.name} delay={0.05 * (i % 3)}>
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
      </div>

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

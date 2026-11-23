import { startTransition, useState, ViewTransition } from 'react'
import { plugins, upstreamPRs, upstreamPRsUrl, type Plugin } from '../content/projects'
import github from '../content/github.json'
import { useMotionPref } from '../motion/useMotionPref'
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
  'Hermes Achievements Profile Scope': (
    <>
      <path d="M8 4h8v5a4 4 0 0 1-8 0z" />
      <path d="M8 6H5.5a2 2 0 0 0 2.5 3M16 6h2.5a2 2 0 0 1-2.5 3" />
      <path d="M12 13v3M9 20h6M10 16h4v4h-4z" />
    </>
  ),
  'Omarchy Workspace Tabs': (
    <>
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M3 7.5 5 4h5l1.5 3.5M11.5 7.5 13 4h4l1.5 3.5" />
      <path d="M7 12h10" />
    </>
  ),
  'Hermes Agent Inbox': (
    <>
      <path d="M3.5 13.5 6 5.5h12l2.5 8V18a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18z" />
      <path d="M3.5 13.5H8l1.5 2.5h5l1.5-2.5h4.5" />
    </>
  ),
  'Hermes Footprint': (
    <>
      <rect x="3.5" y="4" width="17" height="16" rx="1.5" />
      <path d="M12 4v16M12 12h8.5M16 12v8" />
    </>
  ),
  'Hermes Key Doctor': (
    <>
      <circle cx="8" cy="15" r="3.5" />
      <path d="m10.5 12.5 7-7M15 8l2 2M17.5 5.5 19 7" />
    </>
  ),
  'Hermes Vitals': <path d="M3 12h4l2-5 3.5 10 2.5-7 1.5 2H21" />,
  'Hermes Night Shift': (
    <>
      <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5Z" />
      <path d="M16 4.5v3M14.5 6h3" />
    </>
  ),
  'Hermes Eyes': (
    <>
      <circle cx="8" cy="12" r="4" />
      <circle cx="16" cy="12" r="4" />
      <circle cx="9" cy="12.5" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="17" cy="12.5" r="1.2" fill="currentColor" stroke="none" />
    </>
  ),
  'Forward to Hermes': (
    <>
      <rect x="3" y="6" width="13" height="11" rx="1.5" />
      <path d="m3.5 7 6 5 6-5M17 12h4M19 10l2 2-2 2" />
    </>
  ),
  'ScreenPolish for Omarchy': (
    <>
      <rect x="3" y="5" width="18" height="5" rx="1.5" />
      <circle cx="7" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <rect x="6" y="13" width="12" height="7" rx="1.5" />
      <circle cx="12" cy="16.5" r="1.4" />
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
      {icon ?? <path d="m5 7 5 5-5 5m7 0h7" />}
    </svg>
  )
}

const platforms = ['All', 'Hermes Agent', 'Hermes Desktop', 'Omarchy', 'Other'] as const
type PlatformFilter = typeof platforms[number]

const sortedPlugins = [...plugins].sort((a, b) => b.stars - a.stars)
const pluginsByPlatform = new Map(
  platforms.map((platform) => [
    platform,
    platform === 'All' ? sortedPlugins : sortedPlugins.filter((plugin) => plugin.platform === platform),
  ]),
)
const previewCount = 6

const prStatus: Record<string, { opened: string; state: string }> = github.prs

const stateStyle: Record<string, string> = {
  merged: 'border-line text-fg-dim',
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
    <span className="flex w-full shrink-0 flex-wrap items-center gap-3 font-mono text-xs text-fg-faint sm:ml-auto sm:w-auto">
      <span className="hidden sm:inline">{date}</span>
      <span className={`rounded-full border px-2 py-0.5 ${stateStyle[pr.state] ?? stateStyle.open}`}>{pr.state}</span>
    </span>
  )
}

function StarCount({ plugin }: { plugin: Plugin }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-fg-dim tabular-nums" title={`${plugin.stars} GitHub stars`}>
      <span className="text-accent" aria-hidden="true">★</span>
      {plugin.stars}<span className="sr-only"> GitHub stars</span>
    </span>
  )
}

function InstallCommand({ command, name }: { command: string; name: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'failed'>('idle')
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
  }
  return (
    <div className="relative flex min-h-12 min-w-0 items-start gap-2 rounded-lg border border-line bg-ink pl-3">
      <span className="pt-3 font-mono text-xs text-accent" aria-hidden="true">$</span>
      <code className="min-w-0 flex-1 whitespace-pre-wrap break-all py-3 font-mono text-xs text-fg-dim">{command}</code>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy install command for ${name}`}
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-fg-dim hover:bg-raised hover:text-accent"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {status === 'copied' ? <path d="m20 6-11 11-5-5" /> : (
            <>
              <rect width="14" height="14" x="8" y="8" rx="2" />
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </>
          )}
        </svg>
      </button>
      <p role="status" className={status === 'failed' ? 'absolute inset-x-0 top-full z-10 mt-1 rounded-lg border border-line bg-ink px-3 py-2 font-mono text-xs text-fg' : 'sr-only'}>
        {status === 'failed' ? "Couldn't copy. Select the command above." : status === 'copied' ? 'Copied' : ''}
      </p>
    </div>
  )
}

function PluginCard({ plugin }: { plugin: Plugin }) {
  const sentence = plugin.line.split(/(?<=[.!?])\s+/, 1)[0]

  return (
    <article className="row-span-3 grid min-w-0 grid-rows-subgrid gap-0 rounded-xl border border-line bg-surface p-5 hover:border-fg-faint/60 hover:bg-raised">
      <div className="pb-4">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-line bg-raised">
            <PluginIcon name={plugin.name} ink="text-fg-dim" />
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-base font-extrabold leading-tight">
              <a href={plugin.repo} target="_blank" rel="noreferrer" className="inline-flex min-h-6 items-center hover:text-accent">{plugin.name}</a>
            </h3>
            <p className="mt-1 font-mono text-xs text-fg-dim">{plugin.platform} · {plugin.lang}</p>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-fg-dim">{sentence}</p>
      </div>

      {plugin.install ? <InstallCommand command={plugin.install} name={plugin.name} /> : (
        <a href={plugin.repo} target="_blank" rel="noreferrer" className="flex min-h-12 items-center rounded-lg border border-line bg-ink px-3 font-mono text-xs text-accent hover:text-fg">
          Setup on GitHub <span className="ml-1.5" aria-hidden="true">↗</span>
          <span className="sr-only"> for {plugin.name}</span>
        </a>
      )}

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-2 font-mono text-xs">
        <StarCount plugin={plugin} />
        <a href={plugin.repo} target="_blank" rel="noreferrer" className="inline-flex min-h-8 items-center gap-1.5 font-medium text-accent hover:text-fg">
          Source <span aria-hidden="true">↗</span><span className="sr-only"> for {plugin.name}</span>
        </a>
      </div>
    </article>
  )
}

// The date the build read star counts from GitHub (the site rebuilds daily).
const starsChecked = new Date(github.fetched).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })

export function Plugins() {
  const reduced = useMotionPref()
  const [platform, setPlatform] = useState<PlatformFilter>('All')
  const [expanded, setExpanded] = useState(false)
  const matching = pluginsByPlatform.get(platform) ?? []
  const visible = expanded ? matching : matching.slice(0, previewCount)
  const updateGrid = (update: () => void) => {
    if (reduced) update()
    else startTransition(update)
  }

  return (
    <section id="plugins" className="border-y border-line bg-surface/40 py-20 sm:py-28">
      <SectionHeading eyebrow="Plugins & open source" title="Install something I made" />
      <div className="mx-auto max-w-6xl px-6">
        <p className="mt-4 max-w-2xl leading-relaxed text-fg-dim">
          {plugins.length} tools for Hermes Agent, Hermes Desktop and Omarchy. Most install with one command.
        </p>
        <p className="mt-2 font-mono text-xs text-fg-dim">GitHub stars checked {starsChecked}</p>

        <div role="group" aria-label="Filter tools by platform" className="mt-6 inline-flex max-w-full flex-wrap gap-1 rounded-xl border border-line bg-ink p-1">
          {platforms.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={platform === option}
              aria-controls="plugin-grid"
              onClick={() => updateGrid(() => {
                if (platform === option) return
                setPlatform(option)
                setExpanded(false)
              })}
              className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg border border-transparent px-3 font-mono text-xs text-fg-dim hover:bg-surface aria-pressed:border-fg-faint/60 aria-pressed:bg-raised aria-pressed:text-accent"
            >
              {option} <span className="tabular-nums">{pluginsByPlatform.get(option)?.length ?? 0}</span>
            </button>
          ))}
        </div>

        <div id="plugin-grid" className="mt-4 grid grid-cols-1 gap-x-4 gap-y-5 min-[640px]:grid-cols-2 min-[1024px]:grid-cols-3">
          {visible.map((plugin) => (
            <ViewTransition
              key={plugin.repo}
              default="none"
              enter={reduced ? 'none' : 'plugin-enter'}
              exit={reduced ? 'none' : 'plugin-exit'}
              update={reduced ? 'none' : 'plugin-move'}
            >
              <PluginCard plugin={plugin} />
            </ViewTransition>
          ))}
        </div>

        {matching.length > previewCount && (
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls="plugin-grid"
            onClick={() => updateGrid(() => setExpanded((value) => !value))}
            className="mt-5 inline-flex min-h-11 items-center rounded-lg border border-line bg-surface px-4 text-sm font-medium text-accent hover:border-fg-faint/60 hover:bg-raised"
          >
            {expanded ? 'Show fewer' : `Show all ${matching.length}`}
          </button>
        )}
      </div>

      <Reveal className="mx-auto mt-16 max-w-6xl px-6">
        <h3 className="font-mono text-[13px] text-fg-dim">
          Upstream · NousResearch/hermes-agent
        </h3>
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {upstreamPRs.map((pr) => (
            <li key={pr.number}>
              <a
                href={`https://github.com/NousResearch/hermes-agent/pull/${pr.number}`}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-wrap items-baseline gap-x-4 gap-y-2 py-3 transition-colors hover:bg-surface/60 sm:flex-nowrap"
              >
                <span className="shrink-0 font-mono text-xs text-accent">#{pr.number}</span>
                <span className="text-sm text-fg-dim transition-colors group-hover:text-fg">{pr.title}</span>
                <PrMeta number={pr.number} />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-mono text-[13px]">
          <a href={upstreamPRsUrl} target="_blank" rel="noreferrer" className="link-sweep inline-flex min-h-6 items-center text-fg-dim hover:text-fg">
            All pull requests by @BkashJEE ↗
          </a>
        </p>
      </Reveal>
    </section>
  )
}

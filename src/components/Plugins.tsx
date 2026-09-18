import { useState } from 'react'
import { plugins, upstreamPRs, upstreamPRsUrl, type Plugin } from '../content/projects'
import { useStars } from '../hooks/useStars'
import { Reveal } from '../motion/Reveal'
import { SectionHeading } from './SectionHeading'

function StarCount({ plugin }: { plugin: Plugin }) {
  const stars = useStars(plugin.repo, plugin.stars)
  return (
    <span className="shrink-0 font-mono text-[0.75rem] text-fg-faint" title={`${stars} GitHub stars (live)`}>
      ★ {stars}
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
      title="Copy install command"
      className="group/cmd mt-4 flex w-full items-center gap-2 overflow-x-auto rounded-md border border-line bg-ink px-3 py-2 text-left font-mono text-[0.72rem] text-fg-dim transition-colors hover:border-accent/60"
    >
      <span className="select-none text-accent">$</span>
      <span className="whitespace-nowrap">{command}</span>
      <span className="ml-auto shrink-0 select-none text-fg-faint group-hover/cmd:text-accent">
        {copied ? '✓ copied' : 'copy'}
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
      <div className="mx-auto mt-12 grid max-w-6xl gap-5 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {plugins.map((plugin, i) => (
          <Reveal key={plugin.name} delay={0.05 * (i % 3)}>
            <article className="flex h-full flex-col rounded-xl border border-line bg-ink p-5 transition-[border-color,transform] duration-300 hover:border-fg-faint motion-safe:hover:-translate-y-1">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-display text-xl">{plugin.name}</h3>
                <StarCount plugin={plugin} />
              </div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-dim">{plugin.line}</p>
              {plugin.install && <InstallCommand command={plugin.install} />}
              <div className="mt-4 flex items-center justify-between font-mono text-[0.72rem]">
                <a href={plugin.repo} target="_blank" rel="noreferrer" className="link-sweep text-accent">
                  View source ↗
                </a>
                <span className="uppercase tracking-wider text-fg-faint">{plugin.lang}</span>
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
                <span className="ml-auto hidden shrink-0 font-mono text-[0.72rem] text-fg-faint group-hover:text-accent sm:block">
                  ↗
                </span>
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

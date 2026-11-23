import { HomeDivider } from './HomeDivider'
import { useState } from 'react'
import { identity } from '../content/projects'
import { Eyebrow } from './Eyebrow'
import { Reveal } from '../motion/Reveal'

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(identity.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard unavailable; the mailto link still works */
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="min-h-11 rounded-full border border-line bg-surface px-4 py-1.5 font-mono text-xs text-fg-dim transition-colors hover:border-accent hover:text-accent"
    >
      {copied ? 'Copied ✓' : 'Copy email'}
    </button>
  )
}

export function ClosingBlock() {
  return (
    <section id="contact" className="relative overflow-clip py-14 sm:py-32">
      <HomeDivider />
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <Eyebrow>Contact</Eyebrow>
          {/* The closing line from the site fly-over film, then one clear action. */}
          <h2 className="mt-4 max-w-4xl font-display text-[clamp(2.2rem,6vw,4.5rem)] leading-[1.02] text-fg">
            I build what I wish existed, <span className="text-accent">so you don’t have to.</span>
          </h2>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href={`mailto:${identity.email}`}
              className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 py-2.5 font-mono text-sm font-medium text-ink transition-colors hover:bg-fg"
            >
              Email me →
            </a>
            <a href={`mailto:${identity.email}`} className="link-sweep inline-flex min-h-11 items-center break-all font-mono text-sm text-fg-dim hover:text-fg">
              {identity.email}
            </a>
            <CopyEmail />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

import { useState } from 'react'
import { factCheck, identity, siteSourceUrl } from '../content/projects'
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
      className="rounded-full border border-line bg-surface px-4 py-1.5 font-mono text-[0.78rem] text-fg-dim transition-colors hover:border-accent hover:text-accent"
    >
      {copied ? 'Copied ✓' : 'Copy email'}
    </button>
  )
}

export function Footer() {
  return (
    <footer id="contact" className="relative overflow-clip py-24 sm:py-32">
      <div className="ambient absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="font-mono text-[0.8rem] uppercase tracking-[0.25em] text-accent">Contact</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={`mailto:${identity.email}`}
              className="inline-block break-all font-display text-[clamp(1.9rem,6vw,5rem)] leading-tight text-fg transition-colors hover:text-accent"
            >
              {identity.email}
            </a>
            <CopyEmail />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center gap-6 font-mono text-[0.85rem] text-fg-dim">
            <a href="#top" className="link-sweep hover:text-fg">
              ↑ Back to top
            </a>
            <a href={identity.github} target="_blank" rel="noreferrer" className="link-sweep hover:text-fg">
              GitHub
            </a>
            <a href={identity.x} target="_blank" rel="noreferrer" className="link-sweep hover:text-fg">
              X / Twitter
            </a>
            <a href="/resume/" className="link-sweep hover:text-fg">
              Resume
            </a>
          </div>
          <div className="mt-12 space-y-2 border-t border-line pt-6 font-mono text-[0.75rem] text-fg-faint">
            <p>
              <span className="mr-2 inline-block size-1.5 rounded-full bg-teal align-middle" aria-hidden="true" />
              All {factCheck.claims} factual claims on this site are checked against each project’s own docs with
              TypeSafe {factCheck.model} — last run {factCheck.date}.{' '}
              <a href={factCheck.claimsUrl} target="_blank" rel="noreferrer" className="link-sweep text-fg-dim hover:text-fg">
                See the claims ↗
              </a>
            </p>
            <p>
              © {new Date().getFullYear()} Bikash Joshi · Built with React, Tailwind, and Motion ·{' '}
              <a href={siteSourceUrl} target="_blank" rel="noreferrer" className="link-sweep text-fg-dim hover:text-fg">
                Site source on GitHub ↗
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </footer>
  )
}

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
          {/* The closing line from the site fly-over film, then one clear action. */}
          <h2 className="mt-4 max-w-4xl font-display text-[clamp(2.2rem,6vw,5rem)] leading-[1.02] text-fg">
            I build what I wish existed, <span className="text-accent">so you don’t have to.</span>
          </h2>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href={`mailto:${identity.email}`}
              className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 py-2.5 font-mono text-[0.85rem] font-medium text-ink transition-colors hover:bg-fg"
            >
              Email me →
            </a>
            <a href={`mailto:${identity.email}`} className="link-sweep inline-flex min-h-11 items-center break-all font-mono text-[0.85rem] text-fg-dim hover:text-fg">
              {identity.email}
            </a>
            <CopyEmail />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-[0.85rem] text-fg-dim">
            <a href="#top" className="link-sweep inline-flex min-h-11 items-center hover:text-fg">
              ↑ Back to top
            </a>
            <a href={identity.github} target="_blank" rel="noreferrer" className="link-sweep inline-flex min-h-11 items-center hover:text-fg">
              GitHub
            </a>
            <a href={identity.x} target="_blank" rel="noreferrer" className="link-sweep inline-flex min-h-11 items-center hover:text-fg">
              X / Twitter
            </a>
            <a href="/resume/" className="link-sweep inline-flex min-h-11 items-center hover:text-fg">
              Resume
            </a>
            <a href="/partners/" className="link-sweep inline-flex min-h-11 items-center hover:text-fg">
              Partners
            </a>
            <a href="/use-cases/" className="link-sweep inline-flex min-h-11 items-center hover:text-fg">
              Playbook
            </a>
          </div>
          <div className="mt-12 space-y-2 border-t border-line pt-6 font-mono text-[0.75rem] text-fg-faint">
            <p>
              <span className="mr-2 inline-block size-1.5 rounded-full bg-teal align-middle" aria-hidden="true" />
              Last recorded fact check: {factCheck.claims} claims · {new Date(`${factCheck.date}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}.{' '}
              <a href={factCheck.claimsUrl} target="_blank" rel="noreferrer" className="link-sweep text-fg-dim hover:text-fg">
                View checked claims ↗
              </a>
            </p>
            <p>
              © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Bikash Joshi · Built with React, Tailwind, and Motion ·{' '}
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

import { identity } from '../content/projects'
import { Reveal } from '../motion/Reveal'

export function Footer() {
  return (
    <footer id="contact" className="relative overflow-clip py-24 sm:py-32">
      <div className="ambient absolute inset-0 -z-10 opacity-60" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="font-mono text-[0.8rem] uppercase tracking-[0.25em] text-accent">Contact</p>
          <a
            href={`mailto:${identity.email}`}
            className="mt-4 inline-block font-display text-[clamp(1.75rem,5vw,4rem)] leading-tight text-fg transition-colors hover:text-accent"
          >
            {identity.email}
          </a>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap items-center gap-6 font-mono text-[0.85rem] text-fg-dim">
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
          <p className="mt-12 border-t border-line pt-6 font-mono text-[0.75rem] text-fg-faint">
            © {new Date().getFullYear()} Bikash Joshi · Designed and built by hand with React, Tailwind, and Motion ·
            Everything shown here is real work.
          </p>
        </Reveal>
      </div>
    </footer>
  )
}

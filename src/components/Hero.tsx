import { motion } from 'motion/react'
import { identity } from '../content/projects'
import { RevealLines, Reveal } from '../motion/Reveal'
import { useMotionPref } from '../motion/useMotionPref'
import { HeroPortrait } from './HeroPortrait'

export function Hero() {
  const reduced = useMotionPref()
  return (
    <section id="top" className="relative flex min-h-svh flex-col justify-center overflow-clip">
      <div className="ambient absolute inset-0 -z-10" aria-hidden="true" />
      <HeroPortrait />
      {/* pointer-events-none so the full-width text block doesn't swallow the
          portrait's hover; interactive children re-enable themselves. */}
      <div className="pointer-events-none relative mx-auto w-full max-w-6xl px-6 pt-24 pb-16">
        <Reveal delay={0.05}>
          <p className="mb-6 flex items-center gap-2.5 font-mono text-[0.8rem] uppercase tracking-[0.25em] text-fg-dim">
            <span className="size-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {identity.role} · desktop apps · web · AI agent systems
          </p>
        </Reveal>
        <h1 className="font-display text-[clamp(3.25rem,10vw,8rem)] leading-[0.95]">
          <RevealLines text="Bikash" />
          <br />
          <span className="text-accent">
            <RevealLines text="Joshi" />
          </span>
        </h1>
        <Reveal delay={0.35} className="mt-8 max-w-xl">
          <p className="text-lg leading-relaxed text-fg-dim">{identity.bio}</p>
        </Reveal>
        {/* Phones never see the interactive portrait — give them a still. */}
        <Reveal delay={0.5} className="relative mt-10 lg:hidden">
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-1/2 h-3/4 w-[120%] -translate-x-1/2"
            style={{
              background:
                'radial-gradient(50% 60% at 50% 75%, color-mix(in oklab, var(--color-accent) 16%, transparent), transparent 75%)',
            }}
          />
          <img
            src="/assets/portrait-cut-duo.webp"
            width={1000}
            height={1080}
            alt="Portrait of Bikash Joshi"
            className="relative mx-auto w-56"
            style={{
              maskImage: 'linear-gradient(to bottom, black 80%, transparent 99%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 99%)',
            }}
          />
        </Reveal>
        <Reveal delay={0.45} className="mt-10 lg:mt-10">
          <div className="pointer-events-auto flex flex-wrap items-center gap-6 font-mono text-[0.85rem]">
            <a href="#work" className="rounded-full border border-line bg-surface px-5 py-2.5 text-fg transition-colors hover:border-accent hover:text-accent">
              Selected work ↓
            </a>
            <a href={identity.github} target="_blank" rel="noreferrer" className="link-sweep text-fg-dim hover:text-fg">
              GitHub
            </a>
            <a href={identity.x} target="_blank" rel="noreferrer" className="link-sweep text-fg-dim hover:text-fg">
              X
            </a>
            <a href={`mailto:${identity.email}`} className="link-sweep text-fg-dim hover:text-fg">
              {identity.email}
            </a>
          </div>
        </Reveal>
      </div>
      {!reduced && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-fg-faint"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <svg width="18" height="26" viewBox="0 0 18 26" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="1" width="16" height="24" rx="8" />
            <line x1="9" y1="7" x2="9" y2="12" strokeLinecap="round" />
          </svg>
        </motion.div>
      )}
    </section>
  )
}

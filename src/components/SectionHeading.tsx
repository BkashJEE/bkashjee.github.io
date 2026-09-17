import { Reveal, RevealLines } from '../motion/Reveal'

export function SectionHeading({ eyebrow, title, ghost }: { eyebrow: string; title: string; ghost?: string }) {
  return (
    <Reveal className="relative mx-auto max-w-6xl px-6">
      {ghost && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-[0.55em] left-2 select-none font-display text-[clamp(5rem,16vw,13rem)] leading-none text-transparent"
          style={{ WebkitTextStroke: '1px color-mix(in oklab, var(--color-fg) 14%, transparent)' }}
        >
          {ghost}
        </span>
      )}
      <p className="relative font-mono text-[0.8rem] uppercase tracking-[0.25em] text-accent">{eyebrow}</p>
      <h2 className="relative mt-3 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-tight">
        <RevealLines text={title} />
      </h2>
    </Reveal>
  )
}

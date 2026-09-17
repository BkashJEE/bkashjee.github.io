import { Reveal } from '../motion/Reveal'

export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal className="mx-auto max-w-6xl px-6">
      <p className="font-mono text-[0.8rem] uppercase tracking-[0.25em] text-accent">{eyebrow}</p>
      <h2 className="mt-3 font-display text-[clamp(2.25rem,5vw,3.75rem)] leading-tight">{title}</h2>
    </Reveal>
  )
}

import { Reveal } from '../motion/Reveal'
import { Eyebrow } from './Eyebrow'

export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <Reveal className="mx-auto max-w-6xl px-6">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 font-display text-4xl leading-tight lg:text-6xl">{title}</h2>
    </Reveal>
  )
}

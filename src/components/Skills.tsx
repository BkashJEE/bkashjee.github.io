import { skillGroups } from '../content/projects'
import { Reveal } from '../motion/Reveal'
import { SectionHeading } from './SectionHeading'

export function Skills() {
  return (
    <section id="skills" className="border-y border-line bg-surface/40 py-20 sm:py-28">
      <SectionHeading eyebrow="Skills" title="What I work with" />
      <div className="mx-auto mt-12 grid max-w-6xl gap-x-10 gap-y-10 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => (
          <Reveal key={group.title} delay={0.05 * (i % 3)}>
            <h3 className="font-mono text-[0.8rem] uppercase tracking-[0.2em] text-fg-dim">{group.title}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li key={item} className="rounded-full border border-line bg-ink px-3 py-1 font-mono text-[0.78rem] text-fg">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

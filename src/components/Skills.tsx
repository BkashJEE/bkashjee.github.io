import { skillGroups } from '../content/projects'
import { Reveal } from '../motion/Reveal'
import { SectionHeading } from './SectionHeading'

export function Skills() {
  return (
    <section id="skills" className="overflow-clip py-20 sm:py-28">
      <SectionHeading eyebrow="Skills" title="What I work with" ghost="Stack" />
      <div className="mx-auto mt-14 max-w-6xl px-6">
        <dl className="border-t border-line">
          {skillGroups.map((group, i) => (
            <Reveal key={group.title} delay={0.04 * i}>
              <div className="grid gap-2 border-b border-line py-6 sm:grid-cols-12 sm:items-baseline sm:gap-8">
                <dt className="font-mono text-[0.78rem] uppercase tracking-[0.2em] text-fg-dim sm:col-span-3">
                  {group.title}
                </dt>
                <dd className="font-display text-[clamp(1.15rem,2vw,1.5rem)] leading-relaxed text-fg sm:col-span-9">
                  {group.items.map((item, j) => (
                    <span key={item}>
                      {item}
                      {j < group.items.length - 1 && <span className="mx-2 text-accent" aria-hidden="true">·</span>}
                    </span>
                  ))}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}

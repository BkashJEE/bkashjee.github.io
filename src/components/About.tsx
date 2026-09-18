import { aboutParagraphs, identity } from '../content/projects'
import { Reveal } from '../motion/Reveal'
import { SectionHeading } from './SectionHeading'

export function About() {
  return (
    <section id="about" className="overflow-clip py-20 sm:py-28">
      <SectionHeading eyebrow="About" title="Behind the work" ghost="Me" />
      <div className="mx-auto mt-12 grid max-w-6xl items-start gap-10 px-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-3">
          <img
            src="/assets/profile.webp"
            width={600}
            height={600}
            alt="Portrait of Bikash Joshi"
            loading="lazy"
            className="w-40 rounded-xl border border-line lg:w-full lg:max-w-[220px]"
          />
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-7">
          <div className="space-y-6">
            {aboutParagraphs.map((p, i) =>
              i === 0 ? (
                <p key={i} className="font-display text-[clamp(1.4rem,2.6vw,1.9rem)] leading-snug text-fg">
                  {p}
                </p>
              ) : (
                <p key={i} className="text-lg leading-relaxed text-fg-dim">
                  {p}
                </p>
              ),
            )}
          </div>
          <p className="mt-8 font-mono text-[0.85rem]">
            <a href={identity.github} target="_blank" rel="noreferrer" className="link-sweep text-accent">
              github.com/BkashJEE ↗
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}

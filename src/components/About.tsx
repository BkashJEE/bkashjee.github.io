import { HomeDivider } from './HomeDivider'
import { Eyebrow } from './Eyebrow'
import { aboutParagraphs, identity } from '../content/projects'
import { Reveal } from '../motion/Reveal'
import { SectionHeading } from './SectionHeading'

export function About() {
  return (
    <section id="about" className="relative overflow-clip py-14 sm:py-28">
      <HomeDivider />
      <SectionHeading eyebrow="About" title="Behind the work" />
      <div className="mx-auto mt-7 sm:mt-12 grid max-w-6xl items-start gap-10 px-6 lg:grid-cols-12">
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
                <p key={i} className="font-display text-2xl leading-snug text-fg">
                  {p}
                </p>
              ) : (
                <p key={i} className="text-lg leading-relaxed text-fg-dim">
                  {p}
                </p>
              ),
            )}
          </div>
          <div className="mt-8">
            <Eyebrow>Available for</Eyebrow>
            <p className="mt-2 text-fg-dim">
              {identity.available} · Updated{' '}
              {new Date(`${identity.availableUpdated}-01T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })}
            </p>
          </div>
          <p className="mt-4 font-mono text-sm">
            <a href={identity.github} target="_blank" rel="noreferrer" className="link-sweep inline-flex min-h-11 sm:min-h-6 items-center text-accent">
              github.com/BkashJEE ↗
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}

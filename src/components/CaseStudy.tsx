import type { CaseStudy as CaseStudyData } from '../content/projects'
import { Reveal } from '../motion/Reveal'
import { Parallax } from '../motion/Parallax'

export function CaseStudy({ study, flip }: { study: CaseStudyData; flip: boolean }) {
  const [primary, secondary] = study.images
  return (
    <article id={study.id} className="relative py-20 sm:py-28">
      <div
        className={`mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-12 lg:gap-14 ${
          flip ? '' : ''
        }`}
      >
        <div className={`lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
          <Parallax className="relative">
            <div className={`glow-${study.glow} absolute -inset-12 -z-10`} aria-hidden="true" />
            <figure className="shine overflow-hidden rounded-xl border border-line bg-surface shadow-2xl shadow-black/50">
              <img
                src={primary.src}
                width={primary.width}
                height={primary.height}
                alt={primary.alt}
                loading="lazy"
                className="block w-full"
              />
            </figure>
            {secondary && (
              <figure className="absolute -bottom-10 -right-2 hidden w-[46%] overflow-hidden rounded-lg border border-line bg-surface shadow-xl shadow-black/60 sm:block lg:-right-8">
                <img
                  src={secondary.src}
                  width={secondary.width}
                  height={secondary.height}
                  alt={secondary.alt}
                  loading="lazy"
                  className="block w-full"
                />
              </figure>
            )}
          </Parallax>
        </div>
        <div className={`lg:col-span-5 ${flip ? 'lg:order-1' : ''} ${secondary ? 'mt-8 lg:mt-0' : ''}`}>
          <Reveal>
            <h3 className="font-display text-[clamp(2rem,4vw,3rem)] leading-tight">{study.name}</h3>
            <p className="mt-2 text-lg italic text-fg-dim">{study.tagline}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-6 space-y-4 leading-relaxed text-fg-dim">
              {study.description.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
              {study.tech.map((t) => (
                <li key={t} className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-[0.75rem] text-fg-dim">
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-[0.85rem]">
              {study.link && (
                <a href={study.link.href} target="_blank" rel="noreferrer" className="link-sweep text-accent">
                  {study.link.label} ↗
                </a>
              )}
              {study.sourceNote && <span className="text-fg-faint">{study.sourceNote}</span>}
              {study.platforms && <span className="text-fg-faint">{study.platforms}</span>}
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  )
}

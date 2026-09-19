import { plugins, type CaseStudy as CaseStudyData } from '../content/projects'
import { useStars } from '../hooks/useStars'
import { useMotionPref } from '../motion/useMotionPref'
import { Reveal } from '../motion/Reveal'
import { Parallax } from '../motion/Parallax'

/** Live GitHub star count for a case study's public repo. */
function StarBadge({ href }: { href: string }) {
  const fallback = plugins.find((p) => p.repo === href)?.stars ?? 0
  const stars = useStars(href, fallback)
  if (!stars) return null
  return (
    <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[0.75rem] text-accent" title="GitHub stars (live)">
      ★ {stars} on GitHub
    </span>
  )
}

/** Muted demo loop; with reduced motion it waits for the viewer to press play. */
function DemoVideo({ video }: { video: NonNullable<CaseStudyData['video']> }) {
  const reduced = useMotionPref()
  return (
    <figure>
      <video
        width={video.width}
        height={video.height}
        poster={video.poster}
        muted
        loop
        playsInline
        autoPlay={!reduced}
        controls={reduced}
        preload={reduced ? 'none' : 'metadata'}
        aria-label={video.caption}
        className="block w-full"
      >
        <source src={video.webm} type="video/webm" />
        <source src={video.mp4} type="video/mp4" />
      </video>
    </figure>
  )
}

const arrowColor = { amber: 'text-accent', teal: 'text-teal', violet: 'text-violet' } as const

/** "How it works": the project's real pipeline as a compact flow strip. */
function FlowStrip({ flow, glow }: { flow: NonNullable<CaseStudyData['flow']>; glow: CaseStudyData['glow'] }) {
  return (
    <div className="mt-6 rounded-lg border border-line bg-surface/60 p-4">
      <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-fg-faint">How it works</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2">
        {flow.steps.map((step, i) => (
          <span key={step} className="contents">
            {i > 0 && (
              <span className={`${arrowColor[glow]} select-none font-mono text-sm`} aria-hidden="true">
                →
              </span>
            )}
            <span className="rounded-md border border-line bg-ink px-2.5 py-1.5 font-mono text-[0.72rem] leading-snug text-fg-dim">
              {step}
            </span>
          </span>
        ))}
      </div>
      {flow.note && <p className="mt-3 text-[0.8rem] italic leading-snug text-fg-faint">{flow.note}</p>}
    </div>
  )
}

export function CaseStudy({ study, flip }: { study: CaseStudyData; flip: boolean }) {
  // With a demo video, the video leads and the first screenshot becomes the inset.
  const [primary, secondary] = study.video ? [null, study.images[0]] : study.images
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
            <div className="shine overflow-hidden rounded-xl border border-line bg-surface shadow-2xl shadow-black/50">
              {study.video ? (
                <DemoVideo video={study.video} />
              ) : primary && (
                <figure>
              {primary.chrome && (
                <div className="flex items-center gap-1.5 border-b border-line bg-raised px-3.5 py-2.5" aria-hidden="true">
                  <span className="size-2.5 rounded-full bg-[#ff5f57] opacity-80" />
                  <span className="size-2.5 rounded-full bg-[#febc2e] opacity-80" />
                  <span className="size-2.5 rounded-full bg-[#28c840] opacity-80" />
                  <span className="ml-3 font-mono text-[0.68rem] tracking-wide text-fg-faint">{study.name}</span>
                </div>
              )}
              <img
                src={primary.src}
                width={primary.width}
                height={primary.height}
                alt={primary.alt}
                loading="lazy"
                className="block w-full"
              />
                </figure>
              )}
            </div>
            {study.video && (
              <p className="mt-3 font-mono text-[0.7rem] text-fg-faint">{study.video.caption}</p>
            )}
            {secondary && (
              <figure
                className={
                  study.video
                    ? 'ml-auto mt-5 hidden w-[58%] overflow-hidden rounded-lg border border-line bg-surface shadow-xl shadow-black/60 sm:block'
                    : 'absolute -bottom-10 -right-2 hidden w-[46%] overflow-hidden rounded-lg border border-line bg-surface shadow-xl shadow-black/60 sm:block lg:-right-8'
                }
              >
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
          {study.flow && (
            <Reveal delay={0.12}>
              <FlowStrip flow={study.flow} glow={study.glow} />
            </Reveal>
          )}
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
              {study.link?.href.startsWith('https://github.com/') && <StarBadge href={study.link.href} />}
              {study.sourceNote && <span className="text-fg-faint">{study.sourceNote}</span>}
              {study.platforms && <span className="text-fg-faint">{study.platforms}</span>}
              {study.stat && <span className="text-teal">{study.stat}</span>}
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  )
}

import { plugins, type CaseStudy as CaseStudyData } from '../content/projects'
import { useStars } from '../hooks/useStars'

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

/** A visible poster and native controls keep playback in the viewer's hands. */
function DemoVideo({ video }: { video: NonNullable<CaseStudyData['video']> }) {
  return (
    <figure>
      <video
        width={video.width}
        height={video.height}
        poster={video.poster}
        muted
        playsInline
        controls
        preload="none"
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
      <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-fg-dim">How it works</p>
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
      {flow.note && <p className="mt-3 text-[0.85rem] leading-relaxed text-fg-dim">{flow.note}</p>}
    </div>
  )
}

export function CaseStudy({ study, flip }: { study: CaseStudyData; flip: boolean }) {
  const [primary, secondary] = study.video ? [null, study.images[0]] : study.images
  return (
    <article id={study.id} aria-labelledby={`${study.id}-title`} className="relative py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <header className="mb-7 flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-2xl">
            <h3 id={`${study.id}-title`} className="font-display text-[clamp(2rem,4vw,3rem)] leading-tight">{study.name}</h3>
            <p className="mt-3 text-lg leading-relaxed text-fg-dim">{study.tagline}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 font-mono text-[0.8rem]">
            {study.link?.href.startsWith('https://github.com/') && <StarBadge href={study.link.href} />}
            {study.sourceNote && <span className="rounded-full border border-line px-3 py-1 text-fg-dim">{study.sourceNote}</span>}
            {study.stat && <span className="text-teal">{study.stat}</span>}
          </div>
        </header>

        <div className="grid items-start gap-7 lg:grid-cols-12 lg:gap-10">
          <div className={`min-w-0 lg:col-span-7 ${flip ? 'lg:order-2' : ''}`}>
            <div className="relative isolate">
              <div className={`glow-${study.glow} pointer-events-none absolute -inset-8 -z-10`} aria-hidden="true" />
              <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-xl shadow-black/30">
                {study.video ? (
                  <DemoVideo video={study.video} />
                ) : primary && (
                  <a
                    href={primary.src}
                    aria-label={`Open ${study.name} screenshot at full size`}
                    className="block focus-visible:outline-offset-[-4px]"
                  >
                    {primary.chrome && (
                      <div className="flex items-center gap-1.5 border-b border-line bg-raised px-3.5 py-2.5" aria-hidden="true">
                        <span className="size-2.5 rounded-full bg-[#ff5f57] opacity-80" />
                        <span className="size-2.5 rounded-full bg-[#febc2e] opacity-80" />
                        <span className="size-2.5 rounded-full bg-[#28c840] opacity-80" />
                        <span className="ml-3 font-mono text-[0.72rem] text-fg-dim">{study.name}</span>
                      </div>
                    )}
                    <img src={primary.src} width={primary.width} height={primary.height} alt={primary.alt} loading="lazy" className="block w-full" />
                  </a>
                )}
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-start justify-between gap-3 text-sm leading-relaxed text-fg-dim">
              {study.video ? (
                <>
                  <p className="max-w-md">{study.video.caption}</p>
                  <a href={study.video.mp4} className="link-sweep shrink-0 text-accent">Open video ↗</a>
                </>
              ) : primary && (
                <a href={primary.src} className="link-sweep text-accent">View full-size screenshot ↗</a>
              )}
            </div>
            {secondary && (
              <a
                href={secondary.src}
                aria-label={`Open additional ${study.name} screenshot at full size`}
                className="mt-5 flex items-center gap-4 rounded-lg border border-line bg-surface p-3 text-sm text-fg-dim transition-colors hover:border-accent/50 hover:text-fg"
              >
                <img src={secondary.src} width={secondary.width} height={secondary.height} alt={secondary.alt} loading="lazy" className="h-16 w-24 shrink-0 rounded object-contain" />
                <span>View another screenshot <span aria-hidden="true">↗</span></span>
              </a>
            )}
          </div>

          <div className={`min-w-0 lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}>
            {study.link && (
              <a
                href={study.link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 py-2.5 font-mono text-[0.8rem] font-medium text-ink transition-colors hover:bg-fg"
              >
                {study.link.label} ↗
              </a>
            )}
            {study.platforms && <p className="text-sm leading-relaxed text-fg-dim">{study.platforms}</p>}
            {study.flow && <FlowStrip flow={study.flow} glow={study.glow} />}
            <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${study.name} technologies`}>
              {study.tech.map((t) => (
                <li key={t} className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-[0.72rem] text-fg-dim">{t}</li>
              ))}
            </ul>
            <details className="mt-6 border-y border-line">
              <summary className="cursor-pointer py-4 font-medium text-fg marker:text-accent hover:text-accent">
                Read case study<span className="sr-only">: {study.name}</span>
              </summary>
              <div className="space-y-4 pb-5 text-[0.95rem] leading-relaxed text-fg-dim">
                {study.description.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
              </div>
            </details>
          </div>
        </div>
      </div>
    </article>
  )
}

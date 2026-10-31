import { useEffect, useRef, useState } from 'react'
import { plugins, type CaseStudy as CaseStudyData } from '../content/projects'
import { CountUp } from '../motion/CountUp'
import { useMotionPref } from '../motion/useMotionPref'

/** GitHub star count for a case study's public repo, as of the last build. */
function StarBadge({ href }: { href: string }) {
  const stars = plugins.find((p) => p.repo === href)?.stars ?? 0
  if (!stars) return null
  return (
    <span className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[0.75rem] text-accent" title="GitHub stars">
      ★ <CountUp value={stars} className="tabular-nums" /> on GitHub
    </span>
  )
}

/**
 * A visible poster and native controls keep playback in the viewer's hands.
 * The poster is attached only as the video nears the viewport: poster images
 * ignore lazy loading, so this one was a 114 KB download on every first visit
 * for a frame thousands of pixels below the fold.
 */
function DemoVideo({ video }: { video: NonNullable<CaseStudyData['video']> }) {
  const ref = useRef<HTMLElement>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: '900px 0px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <figure ref={ref}>
      <video
        width={video.width}
        height={video.height}
        poster={near ? video.poster : undefined}
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
const stepBorderColor = { amber: 'border-l-accent', teal: 'border-l-teal', violet: 'border-l-violet' } as const
const fullCaseSlugs: Record<string, string> = {
  screenpolish: 'screenpolish',
  'bot-forge': 'hermes-bot-forge',
  'agent-dock': 'hermes-agent-dock',
  'mission-control': 'hermes-x-mission-control',
}

/**
 * How far the strip has travelled up the screen, as a count of lit steps:
 * the first step is lit as it enters, the last by the time it reaches the
 * middle. It follows the scroll both ways and never moves on its own. The
 * pre-rendered HTML, and reduced motion, show every step lit.
 */
function useLitSteps(ref: React.RefObject<HTMLOListElement | null>, count: number) {
  const reduced = useMotionPref()
  const [lit, setLit] = useState(count)
  useEffect(() => {
    const el = ref.current
    if (reduced || !el) {
      setLit(count)
      return
    }
    let frame = 0
    const update = () => {
      frame = 0
      const box = el.getBoundingClientRect()
      if (!box.height) return // folded away on phones
      const progress = (window.innerHeight * 0.9 - box.top) / (window.innerHeight * 0.45)
      setLit(Math.max(1, Math.min(count, Math.ceil(progress * count))))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // Opening the phone fold gives the strip a size without any scroll.
    const resize = new ResizeObserver(schedule)
    resize.observe(el)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      resize.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [ref, count, reduced])
  return lit
}

/** "How it works": the project's real pipeline as a compact flow strip. */
function FlowStrip({ flow, glow }: { flow: NonNullable<CaseStudyData['flow']>; glow: CaseStudyData['glow'] }) {
  const list = useRef<HTMLOListElement>(null)
  const lit = useLitSteps(list, flow.steps.length)
  return (
    <div className="mt-6 rounded-lg border border-line bg-surface/60 p-4">
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[0.75rem] uppercase tracking-[0.2em] text-fg-dim">How it works</p>
      </div>
      <ol
        ref={list}
        className="mt-3 flex flex-wrap items-stretch gap-2"
        aria-label="Project workflow steps"
      >
        {flow.steps.map((step, i) => {
          const on = i < lit
          return (
            <li key={step} className="flex min-w-0 max-w-full items-center gap-2">
              {i > 0 && (
                <span className={`${on ? arrowColor[glow] : 'text-fg-faint'} select-none font-mono text-sm transition-colors duration-300`} aria-hidden="true">
                  →
                </span>
              )}
              <span
                // Unlit steps keep readable contrast: faint text and a plain edge, no fading.
                className={`min-w-0 max-w-full break-words rounded-md border border-line border-l-2 bg-ink px-3 py-2 font-mono text-[0.75rem] leading-snug transition-colors duration-300 ${
                  on ? stepBorderColor[glow] : 'border-l-line'
                } ${!on ? 'text-fg-faint' : i === lit - 1 && lit < flow.steps.length ? 'text-fg' : 'text-fg-dim'}`}
              >
                {step}
              </span>
            </li>
          )
        })}
      </ol>
      {flow.note && <p className="mt-3 text-[0.85rem] leading-relaxed text-fg-dim">{flow.note}</p>}
    </div>
  )
}

export function CaseStudy({ study, flip }: { study: CaseStudyData; flip: boolean }) {
  const [primary, secondary] = study.video ? [null, study.images[0]] : study.images
  const [detailsOpen, setDetailsOpen] = useState(false)
  const techChips = (tech: string[]) => (
    <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${study.name} technologies`}>
      {tech.map((t) => (
        <li key={t} className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-[0.75rem] text-fg-dim">{t}</li>
      ))}
    </ul>
  )
  const details = (
    <>
      {study.flow && <FlowStrip flow={study.flow} glow={study.glow} />}
    </>
  )
  const fullCaseSlug = fullCaseSlugs[study.id]
  return (
    <article id={study.id} aria-labelledby={`${study.id}-title`} className="relative py-10 sm:py-16">
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
                        <span className="ml-3 font-mono text-[0.75rem] text-fg-dim">{study.name}</span>
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
                  <a href={study.video.mp4} className="link-sweep inline-flex min-h-11 items-center shrink-0 text-accent">Open video ↗</a>
                </>
              ) : primary && (
                <a href={primary.src} className="link-sweep inline-flex min-h-11 items-center text-accent">View full-size screenshot ↗</a>
              )}
            </div>
            {secondary && (
              <a
                href={secondary.src}
                aria-label={`Open additional ${study.name} screenshot at full size`}
                className="mt-5 flex items-center gap-4 rounded-lg border border-line bg-surface p-3 text-sm text-fg-dim transition-colors hover:border-accent/50 hover:text-fg"
              >
                {/* A 192px thumbnail for a 96px slot; the link opens the full-size image. */}
                <img src={secondary.src.replace(/\.webp$/, '-thumb.webp')} width={secondary.width} height={secondary.height} alt={secondary.alt} loading="lazy" className="h-16 w-24 shrink-0 rounded object-contain" />
                <span>View another screenshot <span aria-hidden="true">↗</span></span>
              </a>
            )}
          </div>

          <div className={`min-w-0 lg:col-span-5 ${flip ? 'lg:order-1' : ''}`}>
            <div className="flex flex-wrap items-center gap-3">
              {fullCaseSlug && (
                <a
                  href={`/use-cases/${fullCaseSlug}/`}
                  className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 py-2.5 font-mono text-[0.8rem] font-medium text-ink transition-colors hover:bg-fg"
                >
                  View full case study →
                </a>
              )}
              {study.link && (
                <a
                  href={study.link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center rounded-full border border-line px-5 py-2.5 font-mono text-[0.8rem] text-fg transition-colors hover:border-accent hover:text-accent"
                >
                  {study.link.label} ↗
                </a>
              )}
            </div>
            {study.platforms && <p className="text-sm leading-relaxed text-fg-dim">{study.platforms}</p>}
            {/* On phones the pipeline and tech list move inside the fold, so
                each project opens on its title, picture and buttons. */}
            <div className="hidden sm:block">{details}{!detailsOpen && techChips(study.tech.slice(0, 4))}</div>
            <details className="mt-6 border-y border-line" onToggle={(event) => setDetailsOpen(event.currentTarget.open)}>
              <summary className="cursor-pointer py-4 font-medium text-fg marker:text-accent hover:text-accent">
                Build details<span className="sr-only">: {study.name}</span>
              </summary>
              <div className="sm:hidden">{details}</div>
              {detailsOpen && techChips(study.tech)}
              <div className="space-y-4 pt-5 pb-5 text-[0.95rem] leading-relaxed text-fg-dim sm:pt-0">
                {study.description.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
              </div>
            </details>
          </div>
        </div>
      </div>
    </article>
  )
}

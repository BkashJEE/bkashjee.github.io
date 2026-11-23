import { Eyebrow } from './Eyebrow'
import { identity, plugins } from '../content/projects'
import github from '../content/github.json'
import { HeroPortrait } from './HeroPortrait'
import { HeroTicker } from './HeroTicker'

const BOT_FORGE = 'https://github.com/BkashJEE/hermes-bot-forge'
// X Analytics, read 23 Nov 2026
const X_IMPRESSIONS = '5.3M'

/**
 * The strongest facts on the site, at first sight, each linking to its
 * evidence. Stars are GitHub's count at the last build.
 */
function HeroProof() {
  const stars = plugins.find((p) => p.repo === BOT_FORGE)?.stars
  // Spaced like the link row below rather than dot-separated, so a wrap can
  // never leave a separator dangling. Each fact says what its number counts.
  const item = 'inline-flex min-h-11 items-center gap-1.5 transition-colors hover:text-fg'
  const figure = 'font-medium text-fg tabular-nums'
  return (
    <div className="pointer-events-auto flex max-w-xl flex-wrap gap-x-6 font-mono text-[13px] text-fg-dim">
      <a href="#bot-forge" className={item}>
        <span>
          Bot Forge · {typeof stars === 'number' && (
            <><span className="text-accent" aria-hidden="true">★</span> <span className={figure}>{stars}</span> GitHub stars · </>
          )}in the official Hermes plugin catalog
        </span>
      </a>
      <a href="/archive/" className={item}>
        <span className="whitespace-nowrap">
          <span className={figure}>{github.repos.length}</span> public repos
        </span>
      </a>
      <a href="/use-cases/" className={item}>
        <span className="whitespace-nowrap">
          <span className={figure}>{X_IMPRESSIONS}</span> X impressions · last 12 months
        </span>
      </a>
    </div>
  )
}

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh flex-col overflow-clip">
      <div className="ambient absolute inset-0 -z-10" aria-hidden="true" />
      {/* The portrait stands on the post strip rather than behind it. */}
      <div className="relative flex flex-1 flex-col">
        <HeroPortrait />
        {/* pointer-events-none so the full-width text block doesn't swallow the
            portrait's hover; interactive children re-enable themselves. */}
        <div className="pointer-events-none relative mx-auto my-auto w-full max-w-6xl px-6 pt-8 pb-6">
          <div className="hero-rise">
            <Eyebrow className="mb-6">{identity.role}</Eyebrow>
          </div>
          <h1 className="font-display text-[clamp(3.25rem,10vw,8rem)] leading-[0.95]">
            {/* Each word slides up out of its own clip; the right padding keeps
                the last glyph's overhang from being cut off. */}
            <span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] pr-[0.14em] -mr-[0.14em] align-bottom">
              <span className="hero-word" style={{ '--d': '0.05s' } as React.CSSProperties}>
                Bikash
              </span>
            </span>
            <br />
            <span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] pr-[0.14em] -mr-[0.14em] align-bottom text-accent">
              <span className="hero-word" style={{ '--d': '0.13s' } as React.CSSProperties}>
                Joshi
              </span>
            </span>
          </h1>
          <div className="hero-rise mt-8 max-w-xl" style={{ '--d': '0.25s' } as React.CSSProperties}>
            {/* identity.bio in plain text; here ScreenPolish links to its project. */}
            <p className="text-base leading-relaxed text-fg-dim sm:text-lg">
              I build desktop tools and AI agent plugins. I made{' '}
              <a href="#screenpolish" className="link-sweep pointer-events-auto text-fg hover:text-accent">
                ScreenPolish
              </a>
              , a screen recorder that polishes your recordings for you, and I maintain Hermes Agent Archive, a
              source-attributed collection of Hermes Agent workflows and skills.
            </p>
          </div>
          <div className="hero-rise mt-5" style={{ '--d': '0.3s' } as React.CSSProperties}>
            <HeroProof />
          </div>
          <div className="hero-rise mt-8 lg:mt-10" style={{ '--d': '0.35s' } as React.CSSProperties}>
            <div className="pointer-events-auto flex flex-col items-start gap-2 font-mono text-[13px]">
              <a href="#work" className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 py-2.5 font-medium text-ink transition-colors hover:bg-fg">
                Selected work ↓
              </a>
              <div className="flex flex-wrap items-center gap-x-6">
                <a href={identity.github} target="_blank" rel="noreferrer" className="link-sweep inline-flex min-h-11 items-center text-fg-dim hover:text-fg">
                  GitHub
                </a>
                <a href={identity.x} target="_blank" rel="noreferrer" className="link-sweep inline-flex min-h-11 items-center text-fg-dim hover:text-fg">
                  X
                </a>
                <a href={`mailto:${identity.email}`} className="link-sweep inline-flex min-h-11 items-center text-fg-dim hover:text-fg">
                  {identity.email}
                </a>
              </div>
            </div>
          </div>
          {/* Phones never see the interactive portrait — give them a still, below
              the buttons so the main action stays above the fold. */}
          <div className="hero-lift relative mt-6 sm:mt-10 lg:hidden">
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-1/2 h-3/4 w-[120%] -translate-x-1/2"
              style={{
                background:
                  'radial-gradient(50% 60% at 50% 75%, color-mix(in oklab, var(--color-accent) 16%, transparent), transparent 75%)',
              }}
            />
            <img
              src="/assets/portrait-cut-duo.webp"
              srcSet="/assets/portrait-cut-duo-480.webp 480w, /assets/portrait-cut-duo.webp 1000w"
              sizes="(min-width: 640px) 224px, 160px"
              width={1000}
              height={1080}
              alt="Portrait of Bikash Joshi"
              className="relative mx-auto w-40 sm:w-56"
              style={{
                maskImage: 'linear-gradient(to bottom, black 80%, transparent 99%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 99%)',
              }}
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
      <HeroTicker />
    </section>
  )
}

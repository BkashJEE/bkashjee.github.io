import { identity, plugins } from '../content/projects'
import github from '../content/github.json'
import { audience } from '../content/mostViewed'
import { useStars } from '../hooks/useStars'
import { HeroPortrait } from './HeroPortrait'

const BOT_FORGE = 'https://github.com/BkashJEE/hermes-bot-forge'
const views = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : `${Math.round(n / 1000)}K`)

/**
 * The strongest facts on the site, at first sight, each linking to its
 * evidence. Live where it can be: stars refresh from GitHub after load.
 */
function HeroProof() {
  const stars = useStars(BOT_FORGE, plugins.find((p) => p.repo === BOT_FORGE)?.stars ?? 0)
  // Spaced like the link row below rather than dot-separated, so a wrap can
  // never leave a separator dangling; each fact stays on one line.
  const item = 'inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap transition-colors hover:text-fg'
  const figure = 'font-medium text-fg tabular-nums'
  return (
    <div className="pointer-events-auto flex flex-wrap gap-x-6 font-mono text-[0.8rem] text-fg-dim">
      <a href="#bot-forge" className={item}>
        <span className="text-accent" aria-hidden="true">★</span>
        <span className={figure}>{stars}</span> · Bot Forge, official Hermes catalog
      </a>
      <a href="/archive/" className={item}>
        <span className={figure}>{github.repos.length}</span> public repos
      </a>
      <a href="/use-cases/" className={item}>
        <span className={figure}>{views(audience.impressions)}</span> views on X
      </a>
    </div>
  )
}

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-svh flex-col justify-center overflow-clip">
      <div className="ambient absolute inset-0 -z-10" aria-hidden="true" />
      <HeroPortrait />
      {/* pointer-events-none so the full-width text block doesn't swallow the
          portrait's hover; interactive children re-enable themselves. */}
      <div className="pointer-events-none relative mx-auto w-full max-w-6xl px-6 pt-24 pb-16">
        <div className="hero-rise">
          <p className="mb-6 flex items-center gap-2.5 font-mono text-[0.8rem] uppercase tracking-[0.25em] text-fg-dim">
            <span className="size-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {identity.role}
            {/* On a phone the full list wraps mid-phrase; the bio below already says it. */}
            <span className="hidden sm:inline"> · desktop apps · web · AI agent systems</span>
          </p>
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
          <p className="text-base leading-relaxed text-fg-dim sm:text-lg">{identity.bio}</p>
        </div>
        <div className="hero-rise mt-5" style={{ '--d': '0.3s' } as React.CSSProperties}>
          <HeroProof />
        </div>
        <div className="hero-rise mt-8 lg:mt-10" style={{ '--d': '0.35s' } as React.CSSProperties}>
          <div className="pointer-events-auto flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-[0.8rem]">
            <a href="#work" className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 py-2.5 font-medium text-ink transition-colors hover:bg-fg">
              Selected work ↓
            </a>
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
        {/* Phones never see the interactive portrait — give them a still, below
            the buttons so the main action stays above the fold. */}
        <div className="hero-lift relative mt-10 lg:hidden">
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
            sizes="224px"
            width={1000}
            height={1080}
            alt="Portrait of Bikash Joshi"
            className="relative mx-auto w-56"
            style={{
              maskImage: 'linear-gradient(to bottom, black 80%, transparent 99%)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 99%)',
            }}
            fetchPriority="high"
          />
        </div>
      </div>
      <div className="hero-cue absolute bottom-8 left-1/2 -translate-x-1/2 text-fg-faint" aria-hidden="true">
        <svg width="18" height="26" viewBox="0 0 18 26" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="1" y="1" width="16" height="24" rx="8" />
            <line x1="9" y1="7" x2="9" y2="12" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  )
}

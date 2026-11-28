import { HomeDivider } from './HomeDivider'
import { Eyebrow } from './Eyebrow'
import { identity, plugins } from '../content/projects'
import github from '../content/github.json'
import { HeroTicker } from './HeroTicker'

const BOT_FORGE = 'https://github.com/BkashJEE/hermes-bot-forge'
// X Analytics, read 23 Nov 2026
const X_IMPRESSIONS = '5.3M'
const X_IMPRESSIONS_PERIOD = 'last 12 months'

/**
 * The strongest facts on the site, at first sight, each linking to its
 * evidence. Stars are GitHub's count at the last build.
 */
function HeroProof() {
  const stars = plugins.find((p) => p.repo === BOT_FORGE)?.stars
  // Spaced like the link row below rather than dot-separated, so a wrap can
  // never leave a separator dangling. Each fact says what its number counts.
  const item = 'inline-flex min-h-11 items-center gap-1.5 transition-colors hover:text-fg hover:underline'
  const figure = 'font-medium text-fg tabular-nums'
  return (
    <div className="flex max-w-xl flex-wrap gap-x-6 font-mono text-[13px] text-fg-dim">
      {typeof stars === 'number' && (
        <a href={BOT_FORGE} aria-label={`Bot Forge: ${stars} stars. Source: Bot Forge on GitHub`} className={item}>
          <span className="text-accent" aria-hidden="true">★</span> <span className={figure}>{stars}</span> Bot Forge stars
        </a>
      )}
      <a href="https://github.com/BkashJEE?tab=repositories" aria-label={`${github.repos.length} public repos. Source: Bikash Joshi’s GitHub repositories`} className={item}>
        <span className={figure}>{github.repos.length}</span> public repos
      </a>
      <a href={identity.x} aria-label={`${X_IMPRESSIONS} X impressions, ${X_IMPRESSIONS_PERIOD}. X Analytics, read 23 Nov 2026`} className={item}>
        <span className={figure}>{X_IMPRESSIONS}</span> X impressions · {X_IMPRESSIONS_PERIOD}
      </a>
      <a href="https://github.com/NousResearch/hermes-agent/pull/114057" aria-label="Bot Forge in the Hermes plugin catalog. Source: Nous Research catalog pull request on GitHub" className={item}>
        Bot Forge in the Hermes plugin catalog
      </a>
    </div>
  )
}

const heroLinks = [
  { href: '#work', label: 'Work' },
  // Dropped on phones so the pill fits a 375 px screen.
  { href: '#plugins', label: 'Plugins', wide: true },
  { href: '#writing', label: 'Writing' },
  { href: '#about', label: 'About' },
]

/**
 * A full-screen studio portrait: the cutout stands on a deep red that
 * matches the sweater, the name runs across it, and a glass pill of section
 * links floats at the bottom. The bio, proof and contact links sit in the
 * strip right under it, so the first screen stays one picture.
 */
export function Hero() {
  return (
    <>
      <section id="top" className="portrait-hero relative isolate flex min-h-[calc(100svh-4rem)] flex-col overflow-clip">
        <div className="portrait-hero-bg absolute inset-0 -z-20" aria-hidden="true" />
        <img
          src="/assets/portrait-cut-color.webp"
          width={1000}
          height={1080}
          alt="Portrait of Bikash Joshi in a red sweater and sunglasses"
          className="portrait-hero-photo hero-lift absolute bottom-0 left-1/2 -z-10 h-[min(94%,64rem)] w-auto max-w-none -translate-x-1/2"
          fetchPriority="high"
        />
        <div className="portrait-hero-shade absolute inset-0 -z-10" aria-hidden="true" />

        <div className="relative mx-auto mt-auto w-full max-w-6xl px-6 pb-28 text-center sm:pb-36">
          <h1 className="portrait-hero-name font-display text-[clamp(3.5rem,13vw,10.5rem)] leading-[0.9]">
            {/* Each word slides up out of its own clip; the right padding keeps
                the last glyph's overhang from being cut off. */}
            <span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] pr-[0.06em] -mr-[0.06em] align-bottom">
              <span className="hero-word" style={{ '--d': '0.1s' } as React.CSSProperties}>Bikash</span>
            </span>{' '}
            <span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] pr-[0.06em] -mr-[0.06em] align-bottom">
              <span className="hero-word" style={{ '--d': '0.18s' } as React.CSSProperties}>Joshi</span>
            </span>
          </h1>
          <p className="hero-rise portrait-hero-tagline mx-auto mt-4 max-w-xl text-base text-white/85 sm:mt-6 sm:text-xl"
            style={{ '--d': '0.3s' } as React.CSSProperties}>
            Desktop tools, Hermes Agent plugins and launch films.
          </p>
        </div>

        <nav aria-label="Sections" className="hero-rise absolute inset-x-0 bottom-6 flex justify-center px-4 sm:bottom-8"
          style={{ '--d': '0.4s' } as React.CSSProperties}>
          <ul role="list" className="portrait-hero-pill flex items-center gap-1 rounded-full p-1.5">
            {heroLinks.map(({ href, label, wide }) => (
              <li key={href} className={wide ? 'hidden sm:block' : undefined}>
                <a href={href} className="inline-flex min-h-11 items-center rounded-full px-3.5 text-sm text-white/85 transition-colors hover:bg-white/15 hover:text-white sm:px-5 sm:text-[15px]">
                  {label}
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" className="inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-white/90 px-3.5 text-sm font-medium text-ink transition-colors hover:bg-white sm:px-5 sm:text-[15px]">
                Get in touch
              </a>
            </li>
          </ul>
        </nav>
      </section>

      <section aria-label="About in brief" className="relative">
        <HomeDivider />
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 sm:py-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
          <div>
            <Eyebrow className="mb-4">{identity.role}</Eyebrow>
            {/* identity.bio in plain text; here ScreenPolish links to its project. */}
            <p className="text-base leading-relaxed text-fg-dim sm:text-lg">
              I build desktop tools and AI agent plugins. I made{' '}
              <a href="#screenpolish" className="link-sweep inline-flex min-h-11 items-center text-fg hover:text-accent sm:min-h-6">
                ScreenPolish
              </a>
              , a screen recorder that polishes your recordings for you, and I maintain Hermes Agent Archive, a
              source-attributed collection of Hermes Agent workflows and skills.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <HeroProof />
            <div className="flex flex-wrap items-center gap-x-6 font-mono text-[13px]">
              <a href="#work" className="inline-flex min-h-11 items-center rounded-full bg-accent px-5 py-2.5 font-medium text-ink transition-colors hover:bg-fg">
                Selected work ↓
              </a>
              <a href={identity.github} target="_blank" rel="noreferrer" className="link-sweep inline-flex min-h-11 items-center text-fg-dim hover:text-fg">
                GitHub
              </a>
              <a href={identity.x} target="_blank" rel="noreferrer" className="link-sweep inline-flex min-h-11 min-w-11 items-center text-fg-dim hover:text-fg sm:min-w-0">
                X
              </a>
              <a href={`mailto:${identity.email}`} className="link-sweep inline-flex min-h-11 items-center text-fg-dim hover:text-fg">
                {identity.email}
              </a>
            </div>
          </div>
        </div>
        <HeroTicker />
      </section>
    </>
  )
}

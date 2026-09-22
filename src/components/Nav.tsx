import { useEffect, useState } from 'react'
import { identity } from '../content/projects'
import { Magnetic } from '../motion/Magnetic'

const anchors = [
  { id: 'work', label: 'Work' },
  { id: 'plugins', label: 'Plugins' },
  { id: 'lab', label: 'Lab' },
  { id: 'writing', label: 'Writing', mobileHidden: true },
  { id: 'about', label: 'About', mobileHidden: true },
  { id: 'resume', label: 'Resume' },
]

export function Nav() {
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    for (const a of anchors) {
      const el = document.getElementById(a.id)
      if (el) observer.observe(el)
    }
    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  return (
    <header
      // No backdrop-filter here: it re-blurs on every scroll frame and
      // flickers on GPUs without proper compositing (common on Linux).
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'border-b border-line/70 bg-ink/95' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:px-6 sm:py-4" aria-label="Main">
        <a href="#top" className="shrink-0 font-display text-lg tracking-wide text-fg sm:text-xl">
          BJ<span className="text-accent">.</span>
        </a>
        <div className="flex min-w-0 items-center justify-end gap-0 sm:gap-2">
          {anchors.map((a) => (
            <Magnetic key={a.id} strength={4}>
              <a
                href={`#${a.id}`}
                className={`relative rounded px-1.5 py-1 font-mono text-[0.68rem] tracking-normal transition-colors sm:px-3 sm:text-[0.8rem] sm:tracking-wide ${a.mobileHidden ? 'hidden sm:block' : ''} ${
                  active === a.id ? 'text-accent' : 'text-fg-dim hover:text-fg'
                }`}
              >
                {a.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-1.5 -bottom-0.5 h-px bg-accent transition-transform duration-300 sm:inset-x-3 ${
                    active === a.id ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </a>
            </Magnetic>
          ))}
          <a
            href="/use-cases/"
            className="rounded px-1.5 py-1 font-mono text-[0.68rem] tracking-normal text-fg-dim transition-colors hover:text-fg sm:px-3 sm:text-[0.8rem] sm:tracking-wide"
          >
            Cases
          </a>
          <a
            href="/archive/"
            className="hidden rounded px-2 py-1 font-mono text-[0.8rem] tracking-wide text-fg-dim transition-colors hover:text-fg md:block sm:px-3"
          >
            Archive
          </a>
          <span className="mx-1 hidden h-4 w-px bg-line sm:block" aria-hidden="true" />
          <a
            href={identity.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="hidden rounded p-2 text-fg-dim transition-colors hover:text-fg sm:block"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.17c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.35.96.11-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.12v3.14c0 .3.21.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
          </a>
          <a
            href={identity.x}
            target="_blank"
            rel="noreferrer"
            aria-label="X (Twitter)"
            className="hidden rounded p-2 text-fg-dim transition-colors hover:text-fg sm:block"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93ZM17.61 20.64h2.04L6.49 3.24H4.3Z" />
            </svg>
          </a>
        </div>
      </nav>
    </header>
  )
}

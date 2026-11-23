import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { identity } from '../content/projects'
import { BrandMark } from './BrandMark'

const links = [
  { id: 'work', href: '/#work', label: 'Work' },
  { id: 'playbook', href: '/use-cases/', label: 'Playbook' },
  { id: 'archive', href: '/archive/', label: 'All work' },
  { id: 'partners', href: '/partners/', label: 'Partners' },
  { id: 'about', href: '/#about', label: 'About' },
] as const

type NavItem = typeof links[number]['id']

function SocialLinks({ onClose }: { onClose?: () => void }) {
  return (
    <>
      <a
        onClick={onClose}
        href={identity.github}
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
        className="inline-flex size-11 items-center justify-center rounded text-fg-dim transition-colors hover:text-fg"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.17c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.35.96.11-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.12v3.14c0 .3.21.66.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
        </svg>
      </a>
      <a
        onClick={onClose}
        href={identity.x}
        target="_blank"
        rel="noreferrer"
        aria-label="X (Twitter)"
        className="inline-flex size-11 items-center justify-center rounded text-fg-dim transition-colors hover:text-fg"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93ZM17.61 20.64h2.04L6.49 3.24H4.3Z" />
        </svg>
      </a>
    </>
  )
}

export function SiteNav({ page }: { page?: NavItem }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [section, setSection] = useState<NavItem>()
  const menuButton = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDialogElement>(null)
  const closeMenu = () => menu.current?.close()

  const followMenuLink = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const { pathname, hash } = event.currentTarget
    const target = pathname === window.location.pathname && hash
      ? document.getElementById(hash.slice(1))
      : null
    closeMenu()
    const heading = target?.querySelector('h2')
    if (!target || !heading) return
    event.preventDefault()
    if (window.location.hash !== hash) window.history.pushState(null, '', hash)
    heading.tabIndex = -1
    heading.focus({ preventScroll: true })
    target.scrollIntoView()
  }

  useEffect(() => {
    if (page) return
    const work = document.getElementById('work')
    const about = document.getElementById('about')
    const onScroll = () => {
      const marker = window.innerHeight * 0.45
      setSection(about && about.getBoundingClientRect().top <= marker ? 'about'
        : work && work.getBoundingClientRect().top <= marker ? 'work' : undefined)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [page])

  useEffect(() => {
    const media = window.matchMedia('(min-width: 640px)')
    const onResize = () => { if (media.matches) menu.current?.close() }
    media.addEventListener('change', onResize)
    return () => media.removeEventListener('change', onResize)
  }, [])

  const navLinks = (onClick?: (event: MouseEvent<HTMLAnchorElement>) => void) => links.map(({ id, href, label }) => (
    <a key={id} href={href} onClick={onClick} className="nav-link inline-flex"
      aria-current={page === id ? 'page' : section === id ? 'location' : undefined}>
      {label}
    </a>
  ))

  return (
    <header id="site-header" className="site-nav sticky top-0 z-50 h-16 border-b border-line bg-ink/95">
      <nav className="mx-auto flex h-full max-w-6xl items-center justify-between gap-2 px-6" aria-label="Main">
        <BrandMark />
        <div className="hidden items-center sm:flex">
          {navLinks()}
          <SocialLinks />
        </div>
        <button ref={menuButton} type="button" aria-expanded={menuOpen} aria-controls="phone-navigation"
          aria-haspopup="dialog" onClick={() => {
            menu.current?.showModal()
            setMenuOpen(true)
          }} className="nav-link inline-flex min-w-11 justify-center sm:hidden">
          Menu
        </button>
      </nav>
      <dialog ref={menu} id="phone-navigation" aria-label="Phone menu"
        onClose={() => setMenuOpen(false)}
        onCancel={(event) => {
          event.preventDefault()
          closeMenu()
          menuButton.current?.focus({ preventScroll: true })
        }}
        onKeyDown={(event) => {
          if (event.key !== 'Tab') return
          const controls = event.currentTarget.querySelectorAll<HTMLElement>('button, a[href]')
          const first = controls[0]
          const last = controls[controls.length - 1]
          const edge = event.shiftKey ? first : last
          if (document.activeElement === edge) {
            event.preventDefault()
            const next = event.shiftKey ? last : first
            next.focus()
          }
        }}
        className="fixed inset-x-0 top-0 m-0 max-h-dvh w-full max-w-none overflow-y-auto border-b border-line bg-ink px-6 py-3 text-fg backdrop:bg-ink/70 sm:hidden">
        <div className="flex justify-end">
          <button type="button" className="nav-link inline-flex" onClick={() => {
            closeMenu()
            menuButton.current?.focus({ preventScroll: true })
          }}>Close</button>
        </div>
        <nav aria-label="Phone navigation" className="grid grid-cols-2 gap-2">
          {navLinks(followMenuLink)}
          <div className="flex"><SocialLinks onClose={closeMenu} /></div>
        </nav>
      </dialog>
    </header>
  )
}

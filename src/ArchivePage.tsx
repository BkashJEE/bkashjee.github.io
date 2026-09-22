import { BrandMark } from './components/BrandMark'
import github from './content/github.json'
import { archiveExtras, identity } from './content/projects'

interface Row {
  name: string
  description: string
  year: string
  built: string
  stars: number | null
  href: string
  linkLabel: string
  external: boolean
  created: string
}

// Public repos come from github.json (refreshed at every build); private
// projects are listed by hand and link to their case study instead.
const rows: Row[] = [
  ...github.repos.map((r) => ({
    name: r.name,
    description: r.description,
    year: r.created.slice(0, 4),
    built: [r.language, ...r.topics.slice(0, 3)].filter(Boolean).join(' · ') || '—',
    stars: r.stars,
    href: r.url,
    linkLabel: r.url.replace('https://', ''),
    external: true,
    created: r.created,
  })),
  ...archiveExtras.map((p) => ({
    name: p.name,
    description: p.description,
    year: p.created.slice(0, 4),
    built: [p.language, p.built].join(' · '),
    stars: null,
    href: p.href,
    linkLabel: 'Case study (source private)',
    external: false,
    created: p.created,
  })),
].sort((a, b) => b.created.localeCompare(a.created))

export default function ArchivePage() {
  return (
    <div className="min-h-svh">
      <header className="border-b border-line">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4" aria-label="Main">
          <BrandMark />
          <a href="/" className="font-mono text-[0.8rem] text-fg-dim transition-colors hover:text-fg">
            ← Back to portfolio
          </a>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <p className="flex items-center gap-2.5 font-mono text-[0.8rem] uppercase tracking-[0.25em] text-accent">
          <span className="size-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
          {identity.name}
        </p>
        <h1 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-tight">Project archive</h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-fg-dim">
          Every public project I’ve published, plus the private ones featured on the portfolio. Public repos, star
          counts, and dates come straight from GitHub{github.fetched ? `, last refreshed ${github.fetched}` : ''}.
        </p>

        <div className="mt-12 overflow-x-auto">
          <table className="w-full text-left md:min-w-[640px]">
            <thead>
              <tr className="border-b border-line font-mono text-[0.72rem] uppercase tracking-wider text-fg-faint">
                <th scope="col" className="py-3 pr-4 font-normal">Year</th>
                <th scope="col" className="py-3 pr-4 font-normal">Project</th>
                <th scope="col" className="hidden py-3 pr-4 font-normal md:table-cell">Built with</th>
                <th scope="col" className="py-3 pr-4 text-right font-normal">Stars</th>
                <th scope="col" className="hidden py-3 font-normal lg:table-cell">Link</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name} className="border-b border-line/70 align-top">
                  <td className="py-4 pr-4 font-mono text-[0.8rem] text-fg-faint">{row.year}</td>
                  <td className="py-4 pr-4">
                    <a
                      href={row.href}
                      {...(row.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className="font-semibold text-fg transition-colors hover:text-accent"
                    >
                      {row.name}
                      <span className="text-fg-faint lg:hidden"> ↗</span>
                    </a>
                    {row.description && <p className="mt-1 max-w-md text-sm leading-relaxed text-fg-dim">{row.description}</p>}
                  </td>
                  <td className="hidden py-4 pr-4 font-mono text-[0.75rem] text-fg-dim md:table-cell">{row.built}</td>
                  <td className="py-4 pr-4 text-right font-mono text-[0.8rem] text-fg-dim">
                    {row.stars == null ? '—' : `★ ${row.stars}`}
                  </td>
                  <td className="hidden py-4 font-mono text-[0.75rem] lg:table-cell">
                    <a
                      href={row.href}
                      {...(row.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                      className="link-sweep text-fg-dim hover:text-accent"
                    >
                      {row.linkLabel}
                      {row.external ? ' ↗' : ''}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

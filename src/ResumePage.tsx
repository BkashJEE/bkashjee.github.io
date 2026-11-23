import { resume } from './content/resume'
import { viewedUseCases } from './content/mostViewed'

const compact = (n: number) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(n >= 10_000_000 ? 0 : 1)}M`
    : n >= 1000
      ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`
      : String(n)
const shortDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' })

const picks = resume.writingPicks
  .map((id) => viewedUseCases.find((e) => e.id === id))
  .filter((e): e is NonNullable<typeof e> => Boolean(e))

/**
 * Most-read posts stack on phones and scroll on wider screens. Print uses
 * the summary above the cards.
 */
function WritingRail() {
  return (
    <div
      tabIndex={0}
      role="group"
      aria-label="Most-read posts"
      // contain:paint keeps the off-screen cards from widening the page.
      className="mt-3 grid gap-3 pb-2 sm:flex sm:snap-x sm:overflow-x-auto sm:[contain:paint] print:hidden"
    >
      {picks.map((post) => (
        <a
          key={post.id}
          href={post.postUrl}
          target="_blank"
          rel="noreferrer"
          className="group flex sm:w-[17rem] sm:shrink-0 sm:snap-start flex-col rounded-lg border border-[var(--resume-border)] bg-[var(--resume-card)] p-3 motion-safe:transition-colors hover:border-[var(--resume-hover)]"
        >
          <p className="font-mono text-[0.75rem] print:text-[0.72rem] uppercase tracking-wider text-[var(--resume-meta)]">
            {shortDate(post.date)}
          </p>
          <h3 className="mt-1 flex-1 text-[0.84rem] font-semibold leading-snug text-[var(--resume-fg)] group-hover:underline">
            {post.title}
          </h3>
          {(post.projectHref || post.repoUrl) && (
            <p className="mt-1.5 font-mono text-[0.75rem] print:text-[0.72rem] text-[var(--resume-meta)]">
              about {post.repoUrl ? post.repoUrl.split('/').pop() : 'my desktop work'}
            </p>
          )}
          <p className="mt-2 border-t border-[var(--resume-line)] pt-2 font-mono text-[0.75rem] print:text-[0.72rem] text-[var(--resume-muted)]">
            <span className="font-semibold text-[var(--resume-fg)]">{compact(post.impressions)}</span> impressions ·{' '}
            <span className="font-semibold text-[var(--resume-fg)]">{post.bookmarks.toLocaleString('en-GB')}</span> saves
          </p>
        </a>
      ))}
    </div>
  )
}

// The resume uses a dark screen theme and fits on one light printed page.
export default function ResumePage() {
  return (
    <>
      <a href="#main" className="sr-only print:hidden focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-md focus:bg-[var(--resume-card)] focus:px-4 focus:text-[var(--resume-fg)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--resume-fg)]">Skip to content</a>
      <main id="main" tabIndex={-1} className="resume-page">
        <p className="-mt-2 mb-2 flex justify-end print:hidden">
          <a
            href="/resume/bikash-joshi-resume.pdf"
            download
            className="inline-flex min-h-8 items-center rounded-md border border-[var(--resume-border)] px-3 font-mono text-[0.75rem] text-[var(--resume-copy)] hover:border-[var(--resume-rule)] hover:text-[var(--resume-fg)]"
          >
            Download PDF
          </a>
        </p>
        <header className="flex flex-wrap items-baseline justify-between gap-x-6 border-b-2 border-[var(--resume-rule)] pb-3">
          <div>
            <h1 className="text-[1.9rem] font-semibold leading-none tracking-tight">{resume.name}</h1>
            <p className="mt-1.5 text-[0.95rem] text-[var(--resume-muted)]">
              <span className="font-medium text-[var(--resume-title)]">{resume.title}</span> · {resume.subtitle}
            </p>
          </div>
          <ul className="sm:text-right print:text-right text-[0.8rem] leading-relaxed text-[var(--resume-muted)]">
            <li>
              <a href={`mailto:${resume.contact.email}`} className="resume-link hover:underline">{resume.contact.email}</a>
            </li>
            <li>
              <a href={`https://${resume.contact.github}`} className="resume-link hover:underline">{resume.contact.github}</a>
              {' · '}
              <a href={`https://${resume.contact.x}`} className="resume-link hover:underline">{resume.contact.x}</a>
            </li>
            <li>
              <a href={`https://${resume.contact.site}`} className="resume-link hover:underline">{resume.contact.site}</a>
            </li>
          </ul>
        </header>

        <p className="mt-4 text-[0.86rem] leading-relaxed text-[var(--resume-copy)]">{resume.summary}</p>

        <h2 className="resume-h2">Selected projects</h2>
        {resume.projects.map((p) => (
          <section key={p.name} className="mt-3 first-of-type:mt-2">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="text-[1rem] font-semibold text-[var(--resume-fg)]">
                {p.name}
                <span className="ml-2 text-[0.78rem] font-normal text-[var(--resume-meta)]">{p.role}</span>
              </h3>
              <span className="font-mono text-[0.75rem] print:text-[0.72rem] text-[var(--resume-meta)]">
                {'link' in p && p.link ? <a href={`https://${p.link}`} className="resume-link hover:underline">{p.link}</a> : p.note}
              </span>
            </div>
            <p className="mt-0.5 text-[0.75rem] print:text-[0.72rem] text-[var(--resume-meta)]">{p.dates}</p>
            <ul className="mt-1.5 space-y-1 pl-4 text-[0.82rem] leading-snug text-[var(--resume-copy)] [&>li]:list-disc">
              {p.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
            <p className="mt-1 pl-4 font-mono text-[0.75rem] print:text-[0.7rem] text-[var(--resume-meta)]">{p.tech}</p>
          </section>
        ))}

        <h2 className="resume-h2">Published tools</h2>
        <ul className="mt-2 space-y-0.5 text-[0.82rem] leading-snug text-[var(--resume-copy)]">
          {resume.published.map((t) => (
            <li key={t.name}>
              <span className="font-medium text-[var(--resume-fg)]">{t.name}</span>
              {'dates' in t && <span className="text-[var(--resume-meta)]"> · {t.dates}</span>}
              <span className="text-[var(--resume-meta)]"> ({t.stars}★ on GitHub)</span> — {t.note}
            </li>
          ))}
          <li className="text-[var(--resume-copy)]">{resume.recent}</li>
        </ul>

        <h2 className="resume-h2">Open source & experiments</h2>
        <p className="mt-2 text-[0.82rem] leading-snug text-[var(--resume-copy)]">{resume.openSource}</p>

        <h2 className="resume-h2">Writing</h2>
        <p className="mt-2 text-[0.82rem] leading-snug text-[var(--resume-copy)]">
          {resume.writing}
        </p>
        <WritingRail />

        <h2 className="resume-h2">Skills</h2>
        <table className="resume-skills mt-2 w-full text-[0.82rem] leading-snug">
          <tbody>
            {resume.skills.map((s) => (
              <tr key={s.label}>
                <td className="w-36 py-0.5 pr-4 align-top font-medium text-[var(--resume-fg)]">{s.label}</td>
                <td className="py-0.5 text-[var(--resume-copy)]">{s.value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-5 border-t border-[var(--resume-line)] pt-2 text-center font-mono text-[0.75rem] print:text-[0.72rem] text-[var(--resume-muted)] print:hidden">
          Web version with case studies at {resume.contact.site} · PDF generated from this page
        </p>
      </main>
    </>
  )
}

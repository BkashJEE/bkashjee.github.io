import { categoryLabel, statusLabel, useCases, type UseCaseEntry } from '../../content/useCases'
import { UseCaseCard } from './UseCaseCard'

const formatDate = (date: string) => new Intl.DateTimeFormat('en-US', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
}).format(new Date(`${date}T00:00:00Z`))

function ExternalLink({ href, children }: { href: string; children: string }) {
  const external = href.startsWith('http')
  return <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className="rounded-full border border-line px-4 py-2.5 font-mono text-xs text-fg transition-colors hover:border-accent hover:text-accent">{children} ↗</a>
}

export function UseCaseDetail({ entry }: { entry: UseCaseEntry }) {
  const related = entry.related.map((slug) => useCases.find((item) => item.slug === slug)).filter((item): item is UseCaseEntry => Boolean(item))

  return (
    <main className="pb-24 pt-20">
      <article>
        <header className="border-b border-line">
          <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
            <a href="/use-cases/" className="font-mono text-xs text-fg-dim transition-colors hover:text-accent">← Back to the playbook</a>
            <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-end">
              <div>
                <div className="flex flex-wrap items-center gap-3 font-mono text-[0.7rem] uppercase tracking-[0.16em]">
                  <span className="text-accent">{categoryLabel(entry.category)}</span>
                  <span className="text-fg-faint">·</span>
                  <span className="text-fg-dim">{statusLabel(entry.status)}</span>
                  {entry.sourcePrivate && <><span className="text-fg-faint">·</span><span className="text-fg-dim">Source private</span></>}
                </div>
                <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.8rem,7vw,6rem)] leading-[0.96] text-fg">{entry.title}</h1>
                <p className="mt-7 max-w-3xl text-lg leading-8 text-fg-dim sm:text-xl">{entry.description}</p>
              </div>
              <dl className="space-y-4 border-l border-line pl-5 font-mono text-xs">
                <div><dt className="uppercase tracking-[0.16em] text-fg-dim">Published</dt><dd className="mt-1.5 text-fg">{formatDate(entry.date)}</dd></div>
                <div><dt className="uppercase tracking-[0.16em] text-fg-dim">Tools</dt><dd className="mt-1.5 leading-5 text-fg">{entry.tools.join(', ')}</dd></div>
              </dl>
            </div>
            {entry.links && (
              <div className="mt-9 flex flex-wrap gap-3">
                {entry.links.demo && <ExternalLink href={entry.links.demo}>Live demo</ExternalLink>}
                {entry.links.source && <ExternalLink href={entry.links.source}>Source code</ExternalLink>}
                {entry.links.post && <ExternalLink href={entry.links.post}>Original post</ExternalLink>}
              </div>
            )}
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <figure className="overflow-hidden rounded-2xl border border-line bg-surface p-4 sm:p-8">
            <img src={entry.image.src} width={entry.image.width} height={entry.image.height} alt={entry.image.alt} fetchPriority="high" className="mx-auto max-h-[42rem] w-full rounded-lg object-contain" />
          </figure>

          <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
            <div className="space-y-16">
              <section aria-labelledby="problem-heading">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">01 · Problem</p>
                <h2 id="problem-heading" className="mt-4 font-display text-3xl text-fg sm:text-4xl">What needed to change</h2>
                <p className="mt-5 text-lg leading-8 text-fg-dim">{entry.problem}</p>
              </section>
              <section aria-labelledby="solution-heading">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">02 · Solution</p>
                <h2 id="solution-heading" className="mt-4 font-display text-3xl text-fg sm:text-4xl">The working approach</h2>
                <p className="mt-5 text-lg leading-8 text-fg-dim">{entry.solution}</p>
              </section>
              <section aria-labelledby="workflow-heading">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">03 · Workflow</p>
                <h2 id="workflow-heading" className="mt-4 font-display text-3xl text-fg sm:text-4xl">How it works</h2>
                <ol className="mt-7 space-y-3">
                  {entry.workflow.map((step, index) => (
                    <li key={step} className="grid grid-cols-[2.5rem_1fr] gap-4 rounded-xl border border-line bg-surface p-5">
                      <span className="font-mono text-sm text-accent">{String(index + 1).padStart(2, '0')}</span>
                      <span className="leading-7 text-fg-dim">{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
              <section aria-labelledby="lessons-heading">
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">04 · Lessons</p>
                <h2 id="lessons-heading" className="mt-4 font-display text-3xl text-fg sm:text-4xl">Limits and tradeoffs</h2>
                <ul className="mt-6 space-y-4 text-base leading-7 text-fg-dim">
                  {entry.limitations.map((item) => <li key={item} className="border-l border-line pl-5">{item}</li>)}
                </ul>
              </section>
            </div>

            <aside>
              <div className="sticky top-24 rounded-2xl border border-line bg-surface p-5">
                <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-fg-dim">Measured outcomes</h2>
                <dl className="mt-5 divide-y divide-line">
                  {entry.outcomes.map((outcome) => (
                    <div key={outcome.label} className="py-5 first:pt-0 last:pb-0">
                      <dt className="font-display text-3xl text-fg">{outcome.value}</dt>
                      <dd className="mt-1.5 text-sm leading-5 text-fg-dim">{outcome.label}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>
          </div>

          {entry.screenshots.length > 0 && (
            <section className="mt-20 border-t border-line pt-16" aria-labelledby="screenshots-heading">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">Screenshots</p>
              <h2 id="screenshots-heading" className="mt-4 font-display text-3xl text-fg sm:text-4xl">Inside the workflow</h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {entry.screenshots.map((image) => (
                  <figure key={image.src} className="overflow-hidden rounded-2xl border border-line bg-surface p-3">
                    <img src={image.src} width={image.width} height={image.height} alt={image.alt} loading="lazy" decoding="async" className="h-full max-h-[34rem] w-full rounded-lg object-contain" />
                  </figure>
                ))}
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section className="mt-20 border-t border-line pt-16" aria-labelledby="related-heading">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">Keep exploring</p>
              <h2 id="related-heading" className="mt-4 font-display text-3xl text-fg sm:text-4xl">Related use cases</h2>
              <div className="mt-8 grid gap-5 md:grid-cols-2">{related.map((item) => <UseCaseCard key={item.slug} entry={item} />)}</div>
            </section>
          )}
        </div>
      </article>
    </main>
  )
}

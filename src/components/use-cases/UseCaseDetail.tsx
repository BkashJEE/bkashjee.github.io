import { ScrollProgress } from '../../motion/ScrollProgress'
import { Eyebrow } from '../Eyebrow'
import { categoryLabel, statusLabel, useCases, newestUseCases, type UseCaseEntry } from '../../content/useCases'
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

  const next = newestUseCases[newestUseCases.findIndex(({ slug }) => slug === entry.slug) + 1]
  const screenshots = entry.screenshots.filter((image) => image.src !== entry.image.src)

  return (
    <main id="main" tabIndex={-1} className="scroll-mt-16 pb-24">
      <ScrollProgress />
      <article>
        <header className="border-b border-line">
          <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
            <a href="/use-cases/" className="inline-flex min-h-6 items-center font-mono text-xs text-fg-dim transition-colors hover:text-accent">← Back to the playbook</a>
            <div className="mt-6">
              <div>
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                  <Eyebrow>{categoryLabel(entry.category)}</Eyebrow>
                  <span className="text-fg-faint">·</span>
                  <span className="text-fg-dim">{statusLabel(entry.status)}</span>
                  {entry.sourcePrivate && <><span className="text-fg-faint">·</span><span className="text-fg-dim">Source private</span></>}
                </div>
                <h1 className="mt-5 max-w-4xl font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.96] text-fg">{entry.title}</h1>
                <p className="mt-7 max-w-3xl text-lg leading-8 text-fg-dim sm:text-xl">{entry.description}</p>
              </div>
              <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs">
                <div><dt className="text-fg-dim">Published</dt><dd className="mt-1.5 text-fg">{formatDate(entry.date)}</dd></div>
                <div><dt className="text-fg-dim">Tools</dt><dd className="mt-1.5 leading-5 text-fg">{entry.tools.join(', ')}</dd></div>
              </dl>
            </div>
            {entry.links && (
              <div className="mt-9 flex flex-wrap items-center gap-3">
                {entry.links.demo && <ExternalLink href={entry.links.demo}>{/\.(mp4|webm|mov)(?:[?#]|$)/i.test(entry.links.demo) ? 'Watch demo video' : 'Live demo'}</ExternalLink>}
                {entry.links.source && <ExternalLink href={entry.links.source}>Source code</ExternalLink>}
                {entry.links.source && entry.slug === 'screenpolish' && (
                  <span className="font-mono text-xs text-fg-dim">Public source · MIT license</span>
                )}
                {entry.links.post && <ExternalLink href={entry.links.post}>Original post</ExternalLink>}
              </div>
            )}
            <figure className="mt-8 overflow-hidden rounded-xl border border-line bg-surface p-2">
              <img src={entry.image.src} width={entry.image.width} height={entry.image.height} alt={entry.image.alt} fetchPriority="high" className="mx-auto max-h-[42rem] w-full rounded-lg object-contain" />
            </figure>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-6">
          <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-20">
            <div className="space-y-16">
              <section aria-labelledby="problem-heading">
                <Eyebrow>Problem</Eyebrow>
                <h2 id="problem-heading" className="mt-4 font-display text-4xl text-fg">What needed to change</h2>
                <p className="mt-5 text-lg leading-8 text-fg-dim">{entry.problem}</p>
              </section>
              <section aria-labelledby="solution-heading">
                <Eyebrow>Solution</Eyebrow>
                <h2 id="solution-heading" className="mt-4 font-display text-4xl text-fg">The working approach</h2>
                <p className="mt-5 text-lg leading-8 text-fg-dim">{entry.solution}</p>
              </section>
              <section aria-labelledby="workflow-heading">
                <Eyebrow>Workflow</Eyebrow>
                <h2 id="workflow-heading" className="mt-4 font-display text-4xl text-fg">How it works</h2>
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
                <Eyebrow>Lessons</Eyebrow>
                <h2 id="lessons-heading" className="mt-4 font-display text-4xl text-fg">Limits and tradeoffs</h2>
                <ul className="mt-6 space-y-4 text-base leading-7 text-fg-dim">
                  {entry.limitations.map((item) => <li key={item} className="border-l border-line pl-5">{item}</li>)}
                </ul>
              </section>
            </div>

            <aside>
              <div className="sticky top-24 rounded-xl border border-line bg-surface p-5">
                <h2 className="font-mono text-xs text-fg-dim">Measured outcomes</h2>
                <dl className="mt-5 divide-y divide-line">
                  {entry.outcomes.map((outcome) => (
                    <div key={outcome.label} className="py-5 first:pt-0 last:pb-0">
                      <dt className="font-display text-4xl text-fg">{outcome.value}</dt>
                      <dd className="mt-1.5 text-sm leading-5 text-fg-dim">{outcome.label}</dd>
                    </div>
                  ))}
                  {entry.stars !== undefined && (
                    <div className="py-5 last:pb-0">
                      <dt className="font-display text-4xl text-fg">{entry.stars.toLocaleString('en-US')}</dt>
                      <dd className="mt-1.5 text-sm leading-5 text-fg-dim">GitHub stars</dd>
                    </div>
                  )}
                </dl>
              </div>
            </aside>
          </div>

          {screenshots.length > 0 && (
            <section className="mt-20 border-t border-line pt-16" aria-labelledby="screenshots-heading">
              <Eyebrow>Screenshots</Eyebrow>
              <h2 id="screenshots-heading" className="mt-4 font-display text-4xl text-fg">Inside the workflow</h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {screenshots.map((image) => (
                  <figure key={image.src} className="overflow-hidden rounded-xl border border-line bg-surface p-3">
                    <img src={image.src} width={image.width} height={image.height} alt={image.alt} loading="lazy" decoding="async" className="h-full max-h-[34rem] w-full rounded-lg object-contain" />
                  </figure>
                ))}
              </div>
            </section>
          )}

          {related.length > 0 && (
            <section className="mt-20 border-t border-line pt-16" aria-labelledby="related-heading">
              <Eyebrow>Keep Exploring</Eyebrow>
              <h2 id="related-heading" className="mt-4 font-display text-4xl text-fg">Related use cases</h2>
              <div className="mt-8 grid gap-5 md:grid-cols-2">{related.map((item) => <UseCaseCard key={item.slug} entry={item} />)}</div>
            </section>
          )}
          <nav aria-label="Case study navigation" className="mt-16 flex flex-wrap justify-between gap-4 border-t border-line pt-6 font-mono text-sm">
            <a href="/use-cases/" className="inline-flex min-h-11 items-center text-fg-dim transition-colors hover:text-accent">← All case studies</a>
            {next && <a href={`/use-cases/${next.slug}/`} className="inline-flex min-h-11 items-center text-fg-dim transition-colors hover:text-accent">Next: {next.title} →</a>}
          </nav>
        </div>
      </article>
    </main>
  )
}

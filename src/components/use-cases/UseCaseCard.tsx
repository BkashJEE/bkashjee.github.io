import { categoryLabel, statusLabel, type UseCaseEntry } from '../../content/useCases'

const formatDate = (date: string) => new Intl.DateTimeFormat('en-US', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
}).format(new Date(`${date}T00:00:00Z`))

export function UseCaseCard({ entry }: { entry: UseCaseEntry }) {
  return (
    <article className="group flex min-h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition duration-300 hover:-translate-y-1 hover:border-fg-faint/70">
      <a href={`/use-cases/${entry.slug}/`} className="shine block overflow-hidden border-b border-line bg-raised" aria-label={`Read use case: ${entry.title}`}>
        <div className="aspect-[16/10] p-5 sm:p-6">
          <img
            src={entry.image.src}
            width={entry.image.width}
            height={entry.image.height}
            alt={entry.image.alt}
            loading="lazy"
            decoding="async"
            className="h-full w-full rounded-lg object-contain transition-transform duration-500 group-hover:scale-[1.025]"
          />
        </div>
      </a>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[0.68rem] uppercase tracking-[0.14em]">
          <span className="text-accent">{categoryLabel(entry.category)}</span>
          <span className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-fg-dim">
            {entry.sourcePrivate && <span>Source private</span>}
            <span className="flex items-center gap-2">
              <span className={`size-1.5 rounded-full ${entry.status === 'working' ? 'bg-teal' : entry.status === 'testing' ? 'bg-accent' : 'bg-fg-faint'}`} aria-hidden="true" />
              {statusLabel(entry.status)}
            </span>
          </span>
        </div>
        <h2 className="mt-4 font-display text-2xl leading-tight text-fg">
          <a href={`/use-cases/${entry.slug}/`} className="transition-colors hover:text-accent">{entry.title}</a>
        </h2>
        <p className="mt-3 text-[0.95rem] leading-7 text-fg-dim">{entry.description}</p>
        <div className="mt-5 flex flex-wrap gap-2" aria-label="Tools">
          {entry.tools.slice(0, 3).map((tool) => (
            <span key={tool} className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.67rem] text-fg-dim">{tool}</span>
          ))}
          {entry.tools.length > 3 && <span className="px-1 py-1 font-mono text-[0.67rem] text-fg-dim">+{entry.tools.length - 3}</span>}
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-line pt-5 font-mono text-xs text-fg-dim">
          <time dateTime={entry.date}>{formatDate(entry.date)}</time>
          <span className="text-fg-dim transition-colors group-hover:text-accent">Read case study →</span>
        </div>
      </div>
    </article>
  )
}

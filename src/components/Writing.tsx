import { writingPosts } from '../content/writing'
import { Reveal } from '../motion/Reveal'
import { SectionHeading } from './SectionHeading'

const accentBorder = {
  amber: 'border-t-accent',
  teal: 'border-t-teal',
  violet: 'border-t-violet',
} as const

const accentText = {
  amber: 'text-accent',
  teal: 'text-teal',
  violet: 'text-violet',
} as const

export function Writing() {
  return (
    <section id="writing" className="overflow-clip py-20 sm:py-28">
      <SectionHeading eyebrow="Writing" title="Notes from the build" ghost="Notes" />
      <div className="mx-auto mt-10 max-w-6xl px-6 sm:mt-12">
        <Reveal>
          <div className="flex flex-col gap-4 border-y border-line py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-lg leading-relaxed text-fg-dim">
              I share real demos, benchmarks, and failure fixes from building with AI agents.
            </p>
            <a
              href="https://x.com/BkashJosi"
              target="_blank"
              rel="noreferrer"
              className="link-sweep w-fit shrink-0 font-mono text-[0.8rem] text-accent"
            >
              Follow @BkashJosi ↗
            </a>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {writingPosts.map((post, i) => (
            <Reveal key={post.href} delay={0.06 * i} className="h-full">
              <article className={`flex h-full flex-col rounded-xl border border-line border-t-2 ${accentBorder[post.accent]} bg-surface p-5 shadow-lg shadow-black/10 transition-colors hover:border-x-fg-faint hover:border-b-fg-faint sm:p-6`}>
                <div className="flex items-center justify-between gap-3 font-mono text-[0.68rem] uppercase tracking-wider">
                  <span className={accentText[post.accent]}>{post.label}</span>
                  <time className="text-fg-faint">{post.date}</time>
                </div>
                <h3 className="mt-5 font-display text-xl leading-tight text-fg sm:text-2xl">{post.title}</h3>
                <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-fg-dim">{post.summary}</p>
                <a
                  href={post.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex min-h-11 items-center border-t border-line pt-4 font-mono text-[0.78rem] text-fg transition-colors hover:text-accent"
                >
                  Read on X <span className="ml-auto text-accent" aria-hidden="true">↗</span>
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

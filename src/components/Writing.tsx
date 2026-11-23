import { writingPosts } from '../content/writing'
import { Reveal } from '../motion/Reveal'
import { SectionHeading } from './SectionHeading'
import { XGrowth } from './XGrowth'

export function Writing() {
  return (
    <section id="writing" className="overflow-clip py-20 sm:py-28">
      <SectionHeading eyebrow="Writing" title="Notes from the build" />
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
              className="link-sweep inline-flex min-h-11 w-fit shrink-0 items-center font-mono text-[13px] text-accent"
            >
              Follow @BkashJosi ↗
            </a>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {writingPosts.map((post, i) => (
            <Reveal key={post.href} delay={0.04 * i} y={8} className="h-full">
              <article className="card flex h-full flex-col p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3 font-mono text-xs">
                  <span className="flex items-center gap-2 text-fg-dim"><span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />{post.label}</span>
                  <time className="text-fg-faint">{post.date}</time>
                </div>
                <h3 className="mt-5 font-display text-xl leading-tight text-fg sm:text-2xl">{post.title}</h3>
                <p className="mt-4 flex-1 text-base leading-relaxed text-fg-dim">{post.summary}</p>
                <a
                  href={post.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex min-h-11 items-center border-t border-line pt-4 font-mono text-xs text-fg transition-colors hover:text-accent"
                >
                  Read on X <span className="ml-auto text-accent" aria-hidden="true">↗</span>
                </a>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <XGrowth />
        </Reveal>
      </div>
    </section>
  )
}

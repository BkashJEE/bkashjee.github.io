import { Reveal } from '../motion/Reveal'
import { Magnetic } from '../motion/Magnetic'

export function ResumeCard() {
  return (
    <section id="resume" className="border-y border-line bg-surface/40 py-20 sm:py-24">
      <Reveal className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
          <div className="flex items-center gap-8">
            <a
              href="/resume/"
              aria-label="View resume"
              className="hidden shrink-0 -rotate-2 overflow-hidden rounded-md border border-line shadow-xl shadow-black/50 transition-transform duration-300 hover:rotate-0 sm:block"
            >
              <img src="/assets/resume-thumb.webp" width={480} height={621} alt="" className="w-32 lg:w-36" />
            </a>
            <div>
              <p className="flex items-center gap-2.5 font-mono text-[0.8rem] uppercase tracking-[0.25em] text-accent">
                <span className="size-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                Resume
              </p>
              <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] leading-tight">
                The one-page version,
                <br />
                ready for applications.
              </h2>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Magnetic>
              <a
                href="/resume/"
                className="inline-block rounded-full bg-accent px-6 py-3 font-mono text-[0.85rem] font-medium text-ink transition-opacity hover:opacity-90"
              >
                View resume
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="/resume/bikash-joshi-resume.pdf"
                className="inline-block rounded-full border border-line bg-ink px-6 py-3 font-mono text-[0.85rem] text-fg transition-colors hover:border-accent hover:text-accent"
              >
                Download PDF
              </a>
            </Magnetic>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

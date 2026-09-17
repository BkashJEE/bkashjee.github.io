import { Reveal } from '../motion/Reveal'
import { Magnetic } from '../motion/Magnetic'

export function ResumeCard() {
  return (
    <section id="resume" className="border-y border-line bg-surface/40 py-20 sm:py-24">
      <Reveal className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <p className="font-mono text-[0.8rem] uppercase tracking-[0.25em] text-accent">Resume</p>
            <h2 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] leading-tight">
              The one-page version,
              <br />
              ready for applications.
            </h2>
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

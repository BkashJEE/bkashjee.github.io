import { labItems } from '../content/projects'
import { Reveal } from '../motion/Reveal'
import { SectionHeading } from './SectionHeading'

export function LabGrid() {
  return (
    <section id="lab" className="py-20 sm:py-28">
      <SectionHeading eyebrow="Lab" title="Desktop experiments" />
      <Reveal className="mx-auto max-w-6xl px-6">
        <p className="mt-4 max-w-2xl leading-relaxed text-fg-dim">
          Smaller builds for the Omarchy / Hyprland desktop I live in — shell plugins, widgets, and toys, mostly QML with
          Python bridges.
        </p>
      </Reveal>
      <div className="mx-auto mt-12 grid max-w-6xl gap-5 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {labItems.map((item, i) => (
          <Reveal key={item.name} delay={0.05 * (i % 3)}>
            <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-fg-faint">
              {item.image && (
                <div className="flex h-44 items-center justify-center overflow-hidden border-b border-line bg-raised p-4">
                  <img
                    src={item.image.src}
                    width={item.image.width}
                    height={item.image.height}
                    alt={item.image.alt}
                    loading="lazy"
                    className="max-h-full w-auto rounded-md object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-xl">{item.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-dim">{item.line}</p>
                <p className="mt-4 font-mono text-[0.72rem] uppercase tracking-wider text-fg-faint">{item.tech}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

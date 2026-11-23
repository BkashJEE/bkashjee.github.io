import { labItems, type LabItem } from '../content/projects'
import { Reveal } from '../motion/Reveal'
import { SectionHeading } from './SectionHeading'

function PetPerch({ item }: { item: LabItem }) {
  if (!item.image) return null
  return (
    <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-raised">
      <img src={item.image.src} width={item.image.width} height={item.image.height} alt={item.image.alt}
        loading="lazy" className="absolute bottom-0 left-1/2 h-3/4 w-auto -translate-x-1/2" />
    </div>
  )
}

export function LabGrid() {
  return (
    <section id="lab" className="overflow-clip py-16 sm:py-28">
      <SectionHeading eyebrow="Lab" title="Desktop experiments" />
      <Reveal className="mx-auto max-w-6xl px-6">
        <p className="mt-4 max-w-2xl leading-relaxed text-fg-dim">
          Smaller builds for the Omarchy / Hyprland desktop I live in — shell plugins, widgets, and toys, mostly QML with
          Python bridges.
        </p>
      </Reveal>
      <p className="mx-auto mt-6 max-w-6xl px-6 font-mono text-xs text-fg-dim sm:hidden">
        {labItems.length} experiments · swipe →
      </p>
      {/* A swipeable row on phones, where six stacked cards ran to three
          thousand pixels; the grid from sm up. contain:paint keeps the
          row from widening the page. */}
      <div tabIndex={0} role="group" aria-label="Desktop experiments" className="mx-auto mt-4 flex max-w-6xl snap-x snap-mandatory gap-4 overflow-x-auto px-6 pt-1 pb-4 [contain:paint] sm:mt-12 sm:grid sm:snap-none sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-6 sm:pb-0 lg:grid-cols-3">
        {labItems.map((item, i) => (
          <Reveal key={item.name} delay={0.04 * (i % 3)} y={8} className="w-[80vw] max-w-[21rem] shrink-0 snap-start scroll-ml-6 sm:w-auto sm:max-w-none">
            <article
              className="card group flex h-full flex-col overflow-hidden"
            >
              {item.image && (
                <div>
                  {item.pet ? (
                    <PetPerch item={item} />
                  ) : (
                    <div className="aspect-[16/10] overflow-hidden border-b border-line bg-raised">
                      <img
                        src={item.image.src}
                        width={item.image.width}
                        height={item.image.height}
                        alt={item.image.alt}
                        loading="lazy"
                        className="size-full object-cover object-top"
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="font-display text-lg text-fg sm:text-xl">{item.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-dim">{item.line}</p>
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-4 sm:mt-5 sm:gap-4">
                  <p className="font-mono text-xs text-fg-dim">{item.tech}</p>
                  {item.image && (
                    <a
                      href={item.image.src}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center shrink-0 text-xs font-semibold text-fg transition-colors hover:text-accent"
                    >
                      View image <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

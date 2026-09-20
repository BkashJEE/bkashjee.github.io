import { motion } from 'motion/react'
import { labItems, type LabItem } from '../content/projects'
import { Reveal } from '../motion/Reveal'
import { useMotionPref } from '../motion/useMotionPref'
import { SectionHeading } from './SectionHeading'

/**
 * The Window Pets card: its fox is a transparent cutout perched on the card's
 * divider — like it perches on window title bars — and hops when you hover.
 */
function PetPerch({ item }: { item: LabItem }) {
  const reduced = useMotionPref()
  if (!item.image) return null
  const img = { src: item.image.src, width: item.image.width, height: item.image.height, alt: item.image.alt }
  return (
    <div className="relative h-44 overflow-hidden border-b border-line bg-raised/70 min-[380px]:h-48 sm:h-52">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(60% 80% at 50% 100%, color-mix(in oklab, var(--color-accent) 10%, transparent), transparent 75%)' }}
      />
      {reduced ? (
        <img {...img} className="absolute bottom-0 left-1/2 h-32 w-auto -translate-x-1/2 drop-shadow-[0_16px_18px_rgb(0_0_0/0.35)] min-[380px]:h-36 sm:h-40" />
      ) : (
        <motion.img
          {...img}
          className="absolute bottom-0 left-1/2 h-32 w-auto -translate-x-1/2 drop-shadow-[0_16px_18px_rgb(0_0_0/0.35)] min-[380px]:h-36 sm:h-40"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          variants={{
            hop: { y: [0, -22, 0, -10, 0], scaleY: [1, 1.06, 0.94, 1.03, 1], transition: { duration: 0.7, ease: 'easeOut' } },
          }}
        />
      )}
    </div>
  )
}

export function LabGrid() {
  return (
    <section id="lab" className="overflow-clip py-16 sm:py-28">
      <SectionHeading eyebrow="Lab" title="Desktop experiments" ghost="Play" />
      <Reveal className="mx-auto max-w-6xl px-6">
        <p className="mt-4 max-w-2xl leading-relaxed text-fg-dim">
          Smaller builds for the Omarchy / Hyprland desktop I live in — shell plugins, widgets, and toys, mostly QML with
          Python bridges.
        </p>
      </Reveal>
      <div className="mx-auto mt-10 grid max-w-6xl gap-4 px-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 sm:px-6 lg:grid-cols-3">
        {labItems.map((item, i) => (
          <Reveal key={item.name} delay={0.05 * (i % 3)}>
            <motion.article
              whileHover={item.pet ? 'hop' : undefined}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_18px_50px_rgb(0_0_0/0.18)] transition-[border-color,box-shadow,transform] duration-300 hover:border-fg-faint hover:shadow-[0_22px_64px_rgb(0_0_0/0.3)] focus-within:border-accent motion-safe:hover:-translate-y-1"
            >
              {item.image && (
                <div>
                  {item.pet ? (
                    <PetPerch item={item} />
                  ) : (
                    <div className="relative flex h-44 items-center justify-center overflow-hidden border-b border-line bg-raised/70 p-3 min-[380px]:h-48 sm:h-52 sm:p-4">
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 opacity-70"
                        style={{ background: 'radial-gradient(75% 100% at 50% 45%, color-mix(in oklab, var(--color-fg) 4%, transparent), transparent 72%)' }}
                      />
                      <img
                        src={item.image.src}
                        width={item.image.width}
                        height={item.image.height}
                        alt={item.image.alt}
                        loading="lazy"
                        className="relative max-h-full max-w-full rounded-lg object-contain shadow-[0_14px_32px_rgb(0_0_0/0.32)] transition-transform duration-500 group-hover:scale-[1.035]"
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="flex flex-1 flex-col p-4 min-[380px]:p-5 sm:p-6">
                <h3 className="font-display text-lg text-fg sm:text-xl">{item.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-dim">{item.line}</p>
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-4 sm:mt-5 sm:gap-4">
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-fg-dim">{item.tech}</p>
                  {item.image && (
                    <a
                      href={item.image.src}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 text-xs font-semibold text-fg transition-colors hover:text-accent"
                    >
                      View image <span aria-hidden="true">↗</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

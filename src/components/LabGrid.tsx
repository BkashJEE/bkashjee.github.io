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
    <div className="relative h-44 border-b border-line bg-raised/60">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(60% 80% at 50% 100%, color-mix(in oklab, var(--color-accent) 10%, transparent), transparent 75%)' }}
      />
      {reduced ? (
        <img {...img} className="absolute bottom-0 left-1/2 h-36 w-auto -translate-x-1/2" />
      ) : (
        <motion.img
          {...img}
          className="absolute bottom-0 left-1/2 h-36 w-auto -translate-x-1/2"
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
            <motion.article
              whileHover={item.pet ? 'hop' : undefined}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-fg-faint"
            >
              {item.pet ? (
                <PetPerch item={item} />
              ) : (
                item.image && (
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
                )
              )}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-xl">{item.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-fg-dim">{item.line}</p>
                <p className="mt-4 font-mono text-[0.72rem] uppercase tracking-wider text-fg-faint">{item.tech}</p>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

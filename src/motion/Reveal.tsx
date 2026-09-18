import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { useMotionPref } from './useMotionPref'

const EASE = [0.22, 1, 0.36, 1] as const

interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}

/** Fade-and-rise once when the element scrolls into view. */
export function Reveal({ children, delay = 0, y = 28, className }: RevealProps) {
  const reduced = useMotionPref()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

/** Per-word staggered reveal for display headlines. */
export function RevealLines({ text, className }: { text: string; className?: string }) {
  const reduced = useMotionPref()
  const words = text.split(' ')
  if (reduced) return <span className={className}>{text}</span>
  return (
    // The stagger is driven from this parent: the clipped inner spans start
    // fully outside their overflow-hidden wrappers, so their own
    // IntersectionObserver would never see them intersect.
    <motion.span
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ staggerChildren: 0.07 }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] pr-[0.14em] -mr-[0.14em] align-bottom"
          aria-hidden="true"
        >
          <motion.span
            className="inline-block"
            variants={{ hidden: { y: '110%' }, visible: { y: 0 } }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </motion.span>
  )
}

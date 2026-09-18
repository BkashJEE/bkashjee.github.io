import { motion, useScroll, useSpring } from 'motion/react'
import { useMotionPref } from './useMotionPref'

/** Hairline reading-progress bar pinned above the nav. */
export function ScrollProgress() {
  const reduced = useMotionPref()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 })
  if (reduced) return null
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[70] h-px origin-left bg-accent/80"
      style={{ scaleX }}
    />
  )
}

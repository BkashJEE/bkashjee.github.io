import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'motion/react'
import { useMotionPref } from './useMotionPref'

interface ParallaxProps {
  children: ReactNode
  /** Total vertical drift in px across the element's scroll range. */
  drift?: number
  /** Perspective tilt in degrees, eased flat as the element centers. */
  tilt?: number
  className?: string
}

/**
 * Scroll-linked drift plus a subtle 3D tilt that settles flat as the
 * element reaches the viewport center.
 */
export function Parallax({ children, drift = 48, tilt = 4, className }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useMotionPref()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rawY = useTransform(scrollYProgress, [0, 1], [drift, -drift])
  const rawRx = useTransform(scrollYProgress, [0, 0.5, 1], [tilt, 0, -tilt])
  const y = useSpring(rawY, { stiffness: 120, damping: 26, mass: 0.6 })
  const rotateX = useSpring(rawRx, { stiffness: 120, damping: 26, mass: 0.6 })

  if (reduced) return <div className={className}>{children}</div>
  return (
    <div ref={ref} className={className} style={{ perspective: 1200 }}>
      <motion.div style={{ y, rotateX, transformStyle: 'preserve-3d' }}>{children}</motion.div>
    </div>
  )
}

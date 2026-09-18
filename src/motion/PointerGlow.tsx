import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useMotionPref } from './useMotionPref'

/**
 * A soft light that trails the pointer across the page. Purely ambient:
 * pointer-events none, skipped for reduced motion and touch devices.
 */
export function PointerGlow() {
  const reduced = useMotionPref()
  const mx = useMotionValue(-600)
  const my = useMotionValue(-600)
  const x = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.8 })
  const y = useSpring(my, { stiffness: 60, damping: 18, mass: 0.8 })

  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX)
      my.set(e.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [reduced, mx, my])

  if (reduced) return null
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
      style={{
        x,
        y,
        willChange: 'transform',
        background: 'radial-gradient(closest-side, color-mix(in oklab, var(--color-accent) 7%, transparent), transparent 70%)',
      }}
    />
  )
}

import { useRef, type ReactNode, type PointerEvent } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useMotionPref } from './useMotionPref'

/** Element that leans a few pixels toward the pointer and springs back. */
export function Magnetic({ children, strength = 8, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useMotionPref()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 300, damping: 20, mass: 0.4 })
  const y = useSpring(my, { stiffness: 300, damping: 20, mass: 0.4 })

  if (reduced) return <div className={className}>{children}</div>

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set(((e.clientX - r.left) / r.width - 0.5) * strength * 2)
    my.set(((e.clientY - r.top) / r.height - 0.5) * strength * 2)
  }
  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.div ref={ref} className={className} style={{ x, y }} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </motion.div>
  )
}

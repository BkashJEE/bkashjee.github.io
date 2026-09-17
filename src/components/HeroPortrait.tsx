import { useRef, type PointerEvent } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'motion/react'
import { useMotionPref } from '../motion/useMotionPref'

const DUO = '/assets/portrait-duo.webp'
const COLOR = '/assets/portrait-color.webp'

/**
 * Amber-duotone portrait that melts into the hero background through a soft
 * radial mask. Moving the pointer over it acts as a flashlight: a spotlight
 * clip reveals the full-color photo underneath, while the whole portrait
 * leans a few degrees toward the cursor. Static duotone under reduced motion.
 */
export function HeroPortrait() {
  const reduced = useMotionPref()
  const ref = useRef<HTMLDivElement>(null)

  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.45)
  const radius = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 90, damping: 20 })
  const y = useSpring(my, { stiffness: 90, damping: 20 })
  const r = useSpring(radius, { stiffness: 160, damping: 24 })

  const rotateY = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 })
  const rotateX = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 })

  const clipPath = useMotionTemplate`circle(calc(${r} * 1px) at calc(${x} * 100%) calc(${y} * 100%))`

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const nx = (e.clientX - rect.left) / rect.width
    const ny = (e.clientY - rect.top) / rect.height
    mx.set(nx)
    my.set(ny)
    radius.set(rect.width * 0.16)
    rotateY.set((nx - 0.5) * 7)
    rotateX.set((0.5 - ny) * 7)
  }
  const onLeave = () => {
    radius.set(0)
    rotateY.set(0)
    rotateX.set(0)
  }

  const mask = {
    maskImage: 'radial-gradient(60% 58% at 50% 46%, black 42%, transparent 88%)',
    WebkitMaskImage: 'radial-gradient(60% 58% at 50% 46%, black 42%, transparent 88%)',
  } as const

  if (reduced) {
    return (
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] items-center lg:flex" aria-hidden="false">
        <img src={DUO} width={1000} height={1000} alt="Portrait of Bikash Joshi" className="w-full" style={mask} />
      </div>
    )
  }

  return (
    <div className="absolute inset-y-0 right-0 hidden w-[46%] items-center lg:flex" style={{ perspective: 1400 }}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="relative w-full cursor-crosshair"
        style={{ rotateX, rotateY }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <img src={DUO} width={1000} height={1000} alt="Portrait of Bikash Joshi" className="block w-full" style={mask} fetchPriority="high" />
        <motion.img
          src={COLOR}
          width={1000}
          height={1000}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 block w-full"
          style={{ ...mask, clipPath }}
          draggable={false}
        />
        <p className="pointer-events-none absolute bottom-[6%] left-1/2 -translate-x-1/2 font-mono text-[0.7rem] uppercase tracking-[0.25em] text-fg-faint">
          hover · flashlight
        </p>
      </motion.div>
    </div>
  )
}

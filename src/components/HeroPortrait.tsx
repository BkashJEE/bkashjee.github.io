import { useRef, type PointerEvent } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'motion/react'
import { useMotionPref } from '../motion/useMotionPref'

const DUO = '/assets/portrait-cut-duo.webp'
const COLOR = '/assets/portrait-cut-color.webp'

/**
 * Background-free cutout portrait, standing at the hero's bottom edge over an
 * amber glow. The pointer is a flashlight: a spotlight clip reveals the
 * full-color photo, and the figure leans slightly toward the cursor. The
 * cutout's lower edge fades out so the figure melts into the section.
 * Static duotone under reduced motion.
 */
export function HeroPortrait() {
  const reduced = useMotionPref()
  const ref = useRef<HTMLDivElement>(null)

  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.4)
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
    radius.set(rect.width * 0.17)
    rotateY.set((nx - 0.5) * 6)
    rotateX.set((0.5 - ny) * 4)
  }
  const onLeave = () => {
    radius.set(0)
    rotateY.set(0)
    rotateX.set(0)
  }

  // Fade the cutout's cropped waistline into the section edge.
  const bottomFade = {
    maskImage: 'linear-gradient(to bottom, black 82%, transparent 99%)',
    WebkitMaskImage: 'linear-gradient(to bottom, black 82%, transparent 99%)',
  } as const

  const glow = (
    <div
      aria-hidden="true"
      className="absolute bottom-[-12%] left-1/2 h-[85%] w-[130%] -translate-x-1/2"
      style={{
        background:
          'radial-gradient(50% 60% at 50% 70%, color-mix(in oklab, var(--color-accent) 18%, transparent), transparent 75%)',
      }}
    />
  )

  if (reduced) {
    return (
      <div className="pointer-events-none absolute bottom-0 right-[2%] hidden w-[38%] max-w-[560px] lg:block">
        {glow}
        <img src={DUO} width={1000} height={1000} alt="Portrait of Bikash Joshi" className="relative w-full" style={bottomFade} />
      </div>
    )
  }

  return (
    <div className="absolute bottom-0 right-[2%] hidden w-[38%] max-w-[560px] lg:block" style={{ perspective: 1400 }}>
      {glow}
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="relative cursor-crosshair"
        style={{ rotateX, rotateY, transformOrigin: '50% 100%' }}
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={DUO}
          width={1000}
          height={1000}
          alt="Portrait of Bikash Joshi"
          className="block w-full"
          style={bottomFade}
          fetchPriority="high"
        />
        <motion.img
          src={COLOR}
          width={1000}
          height={1000}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 block w-full"
          style={{ ...bottomFade, clipPath }}
          draggable={false}
        />
        <p className="pointer-events-none absolute -left-8 top-[30%] -rotate-90 font-mono text-[0.68rem] uppercase tracking-[0.3em] text-fg-faint">
          hover · flashlight
        </p>
      </motion.div>
    </div>
  )
}

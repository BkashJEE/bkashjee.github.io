import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'motion/react'
import { useMotionPref } from '../motion/useMotionPref'

const DUO = '/assets/portrait-cut-duo.webp'
const COLOR = '/assets/portrait-cut-color.webp'
const DUO_SRCSET = '/assets/portrait-cut-duo-480.webp 480w, /assets/portrait-cut-duo.webp 1000w'
const DUO_SIZES = 'min(38vw, 560px)'

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
  // The colour layer only exists for the hover flashlight. Touch screens and
  // the first paint never need it, so it loads after mount on hover-capable
  // devices only — 108 KB that phones no longer download.
  const [canHover, setCanHover] = useState(false)
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  }, [])

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
    if (!armed) setArmed(true)
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
        <img src={DUO}
          srcSet={DUO_SRCSET}
          sizes={DUO_SIZES} width={1000} height={1000} alt="Portrait of Bikash Joshi" className="relative w-full" style={bottomFade} />
      </div>
    )
  }

  return (
    <div
      className="hero-lift absolute bottom-0 right-[2%] hidden w-[38%] max-w-[560px] lg:block"
      style={{ perspective: 1400 }}
    >
      {glow}
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="relative cursor-crosshair"
        style={{ rotateX, rotateY, transformOrigin: '50% 100%' }}
      >
        <img
          src={DUO}
          srcSet={DUO_SRCSET}
          sizes={DUO_SIZES}
          width={1000}
          height={1000}
          alt="Portrait of Bikash Joshi"
          className="block w-full"
          style={bottomFade}
          fetchPriority="high"
        />
        {canHover && (
          <>
            {armed && (
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
            )}
            <p className="pointer-events-none absolute -left-8 top-[30%] -rotate-90 font-mono text-[0.75rem] uppercase tracking-[0.3em] text-fg-faint">
              hover · flashlight
            </p>
          </>
        )}
      </motion.div>
    </div>
  )
}

import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'motion/react'
import { useMotionPref } from '../motion/useMotionPref'
import turn from '../content/portrait-turn.json'

const DUO = '/assets/portrait-cut-duo.webp'
const COLOR = '/assets/portrait-cut-color.webp'
const DUO_SRCSET = '/assets/portrait-cut-duo-480.webp 480w, /assets/portrait-cut-duo.webp 1000w'
const DUO_SIZES = 'min(38vw, 560px)'
const TURN = '/assets/portrait-turn/'

/**
 * The head-turn frames (scripts/make-portrait-turn.sh), decoded after the
 * page is idle so they never compete with first paint. Null until every frame
 * is ready, and always null when no clip has been made.
 */
function useTurnFrames(enabled: boolean) {
  const [frames, setFrames] = useState<HTMLImageElement[] | null>(null)
  useEffect(() => {
    if (!enabled || turn.frames < 2) return
    let cancelled = false
    const load = () => {
      const imgs = Array.from({ length: turn.frames }, (_, i) => {
        const img = new Image()
        img.src = `${TURN}${String(i).padStart(2, '0')}.webp`
        return img
      })
      Promise.all(imgs.map((img) => img.decode()))
        .then(() => !cancelled && setFrames(imgs))
        .catch(() => {})
    }
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1200))
    idle(load)
    return () => {
      cancelled = true
    }
  }, [enabled])
  return frames
}

/**
 * Draws the pose that matches the cursor's place across the window: far left
 * looks left, far right looks right. Between two poses it cross-fades, so a
 * handful of stills turns as smoothly as a clip. Eases toward the cursor and
 * only redraws while catching up, so a still cursor costs nothing.
 */
function HeadTurn({ frames, style }: { frames: HTMLImageElement[]; style: React.CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    canvas.width = frames[0].naturalWidth
    canvas.height = frames[0].naturalHeight
    const last = frames.length - 1
    let target = 0
    let current = 0
    let raf = 0
    const paint = () => {
      const i = Math.min(Math.floor(current), last)
      const t = current - i
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = 1
      ctx.drawImage(frames[i], 0, 0)
      if (t > 0.01 && i < last) {
        ctx.globalAlpha = t
        ctx.drawImage(frames[i + 1], 0, 0)
      }
    }
    const step = () => {
      current += (target - current) * 0.2
      if (Math.abs(target - current) < 0.005) current = target
      paint()
      raf = current === target ? 0 : requestAnimationFrame(step)
    }
    const onMove = (e: globalThis.PointerEvent) => {
      target = Math.min(1, Math.max(0, e.clientX / window.innerWidth)) * last
      if (!raf) raf = requestAnimationFrame(step)
    }
    paint()
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [frames])
  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 block h-full w-full" style={style} />
}

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
  const [wide, setWide] = useState(false)
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches)
    // This portrait only shows from lg up; narrower windows never need the frames.
    setWide(window.matchMedia('(min-width: 1024px)').matches)
  }, [])
  // With a head-turn clip, the head follows the cursor instead of the
  // flashlight; the colour layer would no longer line up with the face.
  const frames = useTurnFrames(canHover && wide && !reduced)

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
        {frames && <HeadTurn frames={frames} style={bottomFade} />}
        {canHover && !frames && turn.frames < 2 && (
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

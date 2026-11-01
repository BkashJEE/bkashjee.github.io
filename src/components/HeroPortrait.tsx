import { useEffect, useRef, useState, type PointerEvent, type RefObject } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useMotionPref } from '../motion/useMotionPref'

const DUO = '/assets/portrait-cut-duo.webp'
const DUO_SRCSET = '/assets/portrait-cut-duo-480.webp 480w, /assets/portrait-cut-duo.webp 1000w'
const DUO_SIZES = 'min(38vw, 560px)'

/**
 * The portrait as carved stone. Once the page has loaded, desktop visitors
 * with a mouse get a WebGL relief of the photo drawn over it (Three.js is
 * fetched only then): its first frame matches the photo, it rises once, and
 * afterwards the light follows the pointer. Nothing draws while the pointer
 * is still. Everyone else, and any failure, keeps the photo.
 */
function useTerrainPortrait(on: boolean, img: RefObject<HTMLImageElement | null>, canvas: RefObject<HTMLCanvasElement | null>) {
  useEffect(() => {
    const photo = img.current, cv = canvas.current
    if (!on || !photo || !cv) return
    let cleanup = () => {}
    let cancelled = false
    const start = async () => {
      try {
        await photo.decode()
        const { mountTerrain } = await import('./portraitTerrain')
        if (cancelled) return
        cleanup = mountTerrain(photo, cv, () => {
          cv.style.visibility = 'visible'
          photo.style.visibility = 'hidden'
        })
      } catch {
        /* no WebGL or the chunk failed: the photo stays */
      }
    }
    // After load, so the relief never competes with the first paint.
    const begin = () => {
      if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(() => start(), { timeout: 1500 })
      else setTimeout(start, 300)
    }
    if (document.readyState === 'complete') begin()
    else window.addEventListener('load', begin, { once: true })
    return () => {
      cancelled = true
      window.removeEventListener('load', begin)
      cleanup()
      photo.style.visibility = ''
      cv.style.visibility = 'hidden'
    }
  }, [on, img, canvas])
}

/**
 * Background-free cutout portrait, standing at the hero's bottom edge over an
 * amber glow. On desktop it rises into a stone relief once, the light
 * follows the cursor, and the figure leans slightly toward the cursor. The cutout's lower edge fades out so the figure melts into the
 * section. Static duotone under reduced motion.
 */
export function HeroPortrait() {
  const reduced = useMotionPref()
  const ref = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // The relief needs a mouse and room.
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    setDesktop(window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)').matches)
  }, [])
  useTerrainPortrait(desktop && !reduced, imgRef, canvasRef)

  const rotateY = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 })
  const rotateX = useSpring(useMotionValue(0), { stiffness: 60, damping: 18 })
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    rotateY.set(((e.clientX - rect.left) / rect.width - 0.5) * 6)
    rotateX.set((0.5 - (e.clientY - rect.top) / rect.height) * 4)
  }
  const onLeave = () => {
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
        className="relative"
        style={{ rotateX, rotateY, transformOrigin: '50% 100%' }}
      >
        <img
          ref={imgRef}
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
        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 block h-full w-full" style={{ ...bottomFade, visibility: 'hidden' }} />
      </motion.div>
    </div>
  )
}

import { useEffect, useRef, useState, type PointerEvent, type RefObject } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useMotionPref } from '../motion/useMotionPref'

const DUO = '/assets/portrait-cut-duo.webp'
const DUO_SRCSET = '/assets/portrait-cut-duo-480.webp 480w, /assets/portrait-cut-duo.webp 1000w'
const DUO_SIZES = 'min(38vw, 560px)'

const CELL = 5 // CSS px per pixel square
const RADIUS = 72 // how far the cursor scatters pixels
const ASSEMBLE = 0.9 // seconds each square takes to fly home

/**
 * The portrait as pixel squares on a canvas over the photo. On load it
 * assembles itself once (squares fly in from up and to the right and settle);
 * afterwards the cursor scatters the squares near it and they drift back. The
 * canvas draws the real photo and cuts out only the cells that are displaced,
 * so a still portrait stays sharp, and nothing runs while the pointer is still.
 * Desktop with a mouse only; the page head holds the photo (`pixel-in`) until
 * the canvas has drawn it in.
 */
function usePixelPortrait(on: boolean | null, img: RefObject<HTMLImageElement | null>, canvas: RefObject<HTMLCanvasElement | null>, area: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = document.documentElement
    const reveal = () => root.classList.remove('pixel-in')
    if (on === null) return // not measured yet: keep the photo held
    const photo = img.current, cv = canvas.current, box = area.current
    if (!on || !photo || !cv || !box) { reveal(); return }
    const ctx = cv.getContext('2d')
    if (!ctx) { reveal(); return }

    let w = 0, h = 0, dpr = 1, n = 0
    let hx = new Float32Array(0), hy = hx, ox = hx, oy = hx, sx = hx, sy = hx, delay = hx
    let colour: string[] = []
    const sheet = document.createElement('canvas')
    let mode: 'assemble' | 'idle' = 'assemble'
    let t0 = 0, raf = 0, cancelled = false
    let px = 0, py = 0, inside = false

    // Sample the photo into cells: one square per cell, its average colour.
    const build = () => {
      w = photo.offsetWidth; h = photo.offsetHeight; dpr = Math.min(window.devicePixelRatio || 1, 2)
      const cw = Math.round(w * dpr), ch = Math.round(h * dpr)
      cv.width = cw; cv.height = ch; sheet.width = cw; sheet.height = ch
      const sctx = sheet.getContext('2d', { willReadFrequently: true })!
      sctx.clearRect(0, 0, cw, ch); sctx.drawImage(photo, 0, 0, cw, ch)
      const data = sctx.getImageData(0, 0, cw, ch).data
      const cols = Math.ceil(w / CELL), rows = Math.ceil(h / CELL), step = CELL * dpr
      const cells: number[] = [], cs: string[] = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let R = 0, G = 0, B = 0, A = 0, k = 0
          for (let y = Math.floor(r * step); y < Math.min(ch, Math.floor((r + 1) * step)); y++) {
            for (let x = Math.floor(c * step); x < Math.min(cw, Math.floor((c + 1) * step)); x++) {
              const i = (y * cw + x) * 4, a = data[i + 3]
              R += data[i] * a; G += data[i + 1] * a; B += data[i + 2] * a; A += a; k++
            }
          }
          if (!k || A / k < 8) continue
          cells.push(c * CELL, r * CELL, r / rows)
          cs.push(`rgba(${Math.round(R / A)},${Math.round(G / A)},${Math.round(B / A)},${(A / k / 255).toFixed(3)})`)
        }
      }
      n = cs.length; colour = cs
      hx = new Float32Array(n); hy = new Float32Array(n); ox = new Float32Array(n); oy = new Float32Array(n)
      sx = new Float32Array(n); sy = new Float32Array(n); delay = new Float32Array(n)
      for (let i = 0; i < n; i++) {
        hx[i] = cells[i * 3]; hy[i] = cells[i * 3 + 1]
        const ang = -Math.PI * (0.05 + Math.random() * 0.45), dist = 60 + Math.random() * 240 // from up and to the right
        sx[i] = Math.cos(ang) * dist; sy[i] = Math.sin(ang) * dist
        delay[i] = cells[i * 3 + 2] * 0.45 + Math.random() * 0.3 // top first, with a little noise
      }
    }

    // The photo with the displaced cells cut out, and those cells as squares where they are now.
    const draw = (fade?: (i: number) => number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(sheet, 0, 0, w, h)
      for (let i = 0; i < n; i++) if (Math.abs(ox[i]) + Math.abs(oy[i]) > 0.25) ctx.clearRect(hx[i], hy[i], CELL, CELL)
      for (let i = 0; i < n; i++) {
        if (Math.abs(ox[i]) + Math.abs(oy[i]) <= 0.25) continue
        ctx.globalAlpha = fade ? fade(i) : 1
        ctx.fillStyle = colour[i]
        ctx.fillRect(hx[i] + ox[i] + 0.5, hy[i] + oy[i] + 0.5, CELL - 1, CELL - 1)
      }
      ctx.globalAlpha = 1
    }
    const clear = () => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height) }

    const assemble = () => {
      const t = (performance.now() - t0) / 1000
      const prog = new Float32Array(n)
      let done = true
      for (let i = 0; i < n; i++) {
        const p = Math.min(1, Math.max(0, (t - delay[i]) / ASSEMBLE)), e = 1 - (1 - p) ** 3
        prog[i] = e; ox[i] = sx[i] * (1 - e); oy[i] = sy[i] * (1 - e)
        if (p < 1) done = false
      }
      if (done) { ox.fill(0); oy.fill(0); clear(); reveal(); mode = 'idle'; raf = 0; return }
      draw((i) => prog[i])
      raf = requestAnimationFrame(assemble)
    }

    // Scatter near the cursor; everything eases home when it leaves.
    const scatter = () => {
      let moved = false
      const r2 = RADIUS * RADIUS
      for (let i = 0; i < n; i++) {
        if (inside) {
          const dx = hx[i] + CELL / 2 + ox[i] - px, dy = hy[i] + CELL / 2 + oy[i] - py, d2 = dx * dx + dy * dy
          if (d2 < r2) {
            const d = Math.sqrt(d2) || 1, f = (RADIUS - d) / RADIUS
            ox[i] += (dx / d) * f * 3.2; oy[i] += (dy / d) * f * 3.2 - f * 0.8 // a ripple, not a hole
          }
        }
        ox[i] *= 0.9; oy[i] *= 0.9
        if (Math.abs(ox[i]) + Math.abs(oy[i]) > 0.25) moved = true
        else { ox[i] = 0; oy[i] = 0 }
      }
      if (moved) { photo.style.visibility = 'hidden'; draw() }
      else { clear(); photo.style.visibility = '' }
      raf = moved || inside ? requestAnimationFrame(scatter) : 0
    }

    const onMove = (e: globalThis.PointerEvent) => {
      const r = photo.getBoundingClientRect()
      px = ((e.clientX - r.left) / r.width) * w; py = ((e.clientY - r.top) / r.height) * h
      inside = true
      if (mode === 'idle' && !raf) raf = requestAnimationFrame(scatter)
    }
    const onLeave = () => { inside = false }
    let resizeTimer = 0
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => { if (mode === 'idle' && !raf) { build(); clear() } }, 200)
    }

    ;(async () => {
      try { await photo.decode() } catch { reveal(); return }
      if (cancelled) return
      build()
      t0 = performance.now()
      raf = requestAnimationFrame(assemble)
    })()
    box.addEventListener('pointermove', onMove)
    box.addEventListener('pointerleave', onLeave)
    window.addEventListener('resize', onResize)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.clearTimeout(resizeTimer)
      box.removeEventListener('pointermove', onMove)
      box.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
      photo.style.visibility = ''
      reveal()
    }
  }, [on, img, canvas, area])
}

/**
 * Background-free cutout portrait, standing at the hero's bottom edge over an
 * amber glow. On desktop it assembles from pixel squares once, the cursor
 * scatters the squares near it, and the figure leans slightly toward the
 * cursor. The cutout's lower edge fades out so the figure melts into the
 * section. Static duotone under reduced motion.
 */
export function HeroPortrait() {
  const reduced = useMotionPref()
  const ref = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // Pixels need a mouse and room: the same test the page head uses for `pixel-in`.
  const [pixels, setPixels] = useState<boolean | null>(null)
  useEffect(() => {
    setPixels(window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)').matches)
  }, [])
  usePixelPortrait(pixels === null ? null : pixels && !reduced, imgRef, canvasRef, ref)

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
          className="pixel-photo block w-full"
          style={bottomFade}
          fetchPriority="high"
        />
        <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 block h-full w-full" style={bottomFade} />
      </motion.div>
    </div>
  )
}

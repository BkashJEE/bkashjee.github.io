import { useEffect, useRef, useState } from 'react'
import { useMotionPref } from './useMotionPref'

interface CountUpProps {
  value: number
  format?: (n: number) => string
  className?: string
}

/**
 * Counts up to a real number once, the first time it scrolls into view.
 *
 * The pre-rendered HTML always holds the real number. A figure that is
 * already on screen when the page loads, or any figure under reduced motion,
 * never moves. Screen readers only ever get the final value.
 */
export function CountUp({ value, format = (n) => String(n), className }: CountUpProps) {
  const reduced = useMotionPref()
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (reduced || !el) return
    const box = el.getBoundingClientRect()
    if (box.top < window.innerHeight && box.bottom > 0) return
    setShown(0)
    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1100)
          setShown(t === 1 ? value : Math.round(value * (1 - (1 - t) ** 3)))
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      setShown(value)
    }
  }, [value, reduced])

  return (
    <span ref={ref} className={className}>
      {/* Holds the final number's width so counting never nudges what sits beside it. */}
      <span aria-hidden="true" className="inline-block" style={{ minWidth: `${format(value).length}ch` }}>
        {format(shown)}
      </span>
      <span className="sr-only">{format(value)}</span>
    </span>
  )
}

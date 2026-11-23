import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}

export function Reveal({ children, delay = 0, y = 12, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || !window.matchMedia('(prefers-reduced-motion: no-preference)').matches ||
      !('IntersectionObserver' in window) || element.getBoundingClientRect().top < window.innerHeight) return

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      element.classList.add('reveal-in')
      observer.disconnect()
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className} data-reveal={y === 8 ? 'card' : 'section'}
      style={{ '--reveal-distance': `${y}px`, '--reveal-delay': `${Math.min(5, Math.max(0, Math.round(delay / 0.04))) * 40}ms` } as CSSProperties}>
      {children}
    </div>
  )
}

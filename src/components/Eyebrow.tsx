import type { ReactNode } from 'react'

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-center gap-2.5 font-mono text-[12.8px] tracking-[0.08em] text-accent ${className}`}>
      <span className="size-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}

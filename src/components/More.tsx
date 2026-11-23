import { useId, useState, type ReactNode } from 'react'

export function More({ label, children }: { label: string; children: ReactNode }) {
  const id = useId()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        className="inline-flex min-h-11 min-w-11 items-center font-mono text-[13px] text-accent sm:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? 'Less' : 'More'}<span className="sr-only">: {label}</span>
        <span aria-hidden="true" className="ml-2">{open ? '−' : '+'}</span>
      </button>
      <div id={id} className={open ? undefined : 'hidden sm:block'}>
        {children}
      </div>
    </>
  )
}

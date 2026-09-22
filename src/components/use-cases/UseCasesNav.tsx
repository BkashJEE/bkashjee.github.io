export function UseCasesNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/70 bg-ink/95">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8" aria-label="Use cases">
        <a href="/" className="font-display text-xl tracking-wide text-fg">
          BJ<span className="text-accent">.</span>
        </a>
        <div className="flex items-center gap-5 font-mono text-xs tracking-wide text-fg-dim sm:gap-7 sm:text-sm">
          <a href="/" className="transition-colors hover:text-fg">Home</a>
          <a href="/use-cases/" aria-current="page" className="text-accent">Use cases</a>
          <a href="/resume/" className="transition-colors hover:text-fg">Resume</a>
        </div>
      </nav>
    </header>
  )
}

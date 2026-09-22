import { UseCaseDetail } from './components/use-cases/UseCaseDetail'
import { UseCasesDirectory } from './components/use-cases/UseCasesDirectory'
import { UseCasesNav } from './components/use-cases/UseCasesNav'
import { useCases } from './content/useCases'

function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 pt-24">
      <p className="font-mono text-xs uppercase tracking-[0.24em] text-accent">404 · Use case not found</p>
      <h1 className="mt-5 font-display text-5xl text-fg">That case study is not in the collection.</h1>
      <a href="/use-cases/" className="mt-8 w-fit rounded-full border border-line px-5 py-2.5 font-mono text-sm text-fg transition-colors hover:border-accent hover:text-accent">
        Browse the playbook
      </a>
    </main>
  )
}

export function UseCasesApp() {
  const segments = window.location.pathname.split('/').filter(Boolean)
  const slug = segments[0] === 'use-cases' ? segments[1] : undefined
  const entry = slug ? useCases.find((item) => item.slug === slug) : undefined

  return (
    <div className="grain min-h-screen bg-ink text-fg">
      <UseCasesNav />
      {slug ? entry ? <UseCaseDetail entry={entry} /> : <NotFound /> : <UseCasesDirectory />}
    </div>
  )
}

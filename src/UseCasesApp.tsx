import { UseCaseDetail } from './components/use-cases/UseCaseDetail'
import { UseCasesDirectory } from './components/use-cases/UseCasesDirectory'
import { SiteNav } from './components/SiteNav'
import { SiteFooter } from './components/SiteFooter'
import { Eyebrow } from './components/Eyebrow'
import { useCases } from './content/useCases'

function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 pt-24">
      <Eyebrow>404 · Use Case Not Found</Eyebrow>
      <h1 className="mt-5 font-display text-[clamp(2.5rem,6vw,4.5rem)] text-fg">That case study is not in the collection.</h1>
      <a href="/use-cases/" className="mt-8 w-fit rounded-full border border-line px-5 py-2.5 font-mono text-sm text-fg transition-colors hover:border-accent hover:text-accent">
        Browse the playbook
      </a>
    </main>
  )
}

export function UseCasesApp({ slug }: { slug?: string }) {
  const entry = slug ? useCases.find((item) => item.slug === slug) : undefined

  return (
    <div className="min-h-screen bg-ink text-fg">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-md focus:bg-white focus:px-4 focus:text-zinc-900 focus:outline-2 focus:outline-offset-2 focus:outline-zinc-900">Skip to content</a>
      <SiteNav page="playbook" />
      {slug ? entry ? <UseCaseDetail entry={entry} /> : <NotFound /> : <UseCasesDirectory />}
      <SiteFooter />
    </div>
  )
}

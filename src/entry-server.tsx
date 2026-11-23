import { renderToString } from 'react-dom/server'
import App from './App'
import ArchivePage from './ArchivePage'
import ResumePage from './ResumePage'
import { UseCasesApp } from './UseCasesApp'
import { useCases } from './content/useCases'

/**
 * Pages pre-rendered into the built HTML by scripts/prerender.mjs, so the
 * first screen paints from the HTML instead of waiting for the JavaScript.
 */
export const pages: Record<string, () => string> = {
  '/': () => renderToString(<App />),
  '/archive/': () => renderToString(<ArchivePage />),
  '/resume/': () => renderToString(<ResumePage />),
  '/use-cases/': () => renderToString(<UseCasesApp />),
  ...Object.fromEntries(useCases.map(({ slug }) => [
    `/use-cases/${slug}/`,
    () => renderToString(<UseCasesApp slug={slug} />),
  ])),
}

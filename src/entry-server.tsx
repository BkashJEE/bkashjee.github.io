import { renderToString } from 'react-dom/server'
import App from './App'
import ResumePage from './ResumePage'

/**
 * Pages pre-rendered into the built HTML by scripts/prerender.mjs, so the
 * first screen paints from the HTML instead of waiting for the JavaScript.
 */
export const pages: Record<string, () => string> = {
  '/': () => renderToString(<App />),
  '/resume/': () => renderToString(<ResumePage />),
}

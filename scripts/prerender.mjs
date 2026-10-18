// Pre-renders the pages listed in src/entry-server.tsx into dist/. Without it
// each page ships an empty <div id="root"> and paints nothing until hundreds of
// KB of JavaScript have loaded and run; with it the first screen arrives in the
// HTML and React hydrates over it.
import { readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ssrDir = join(root, 'dist-ssr')
const { pages } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href)
const EMPTY_ROOT = '<div id="root"></div>'

// Only Inter is preloaded: it sets the name, the largest text on the first
// screen. JetBrains Mono sets small labels, where a late swap barely shows,
// and preloading it too made the two fonts split the connection.
const assets = readdirSync(join(root, 'dist', 'assets'))
const fontPreloads = [/^inter-latin-wght-normal-.*\.woff2$/]
  .map((re) => assets.find((f) => re.test(f)))
  .filter(Boolean)
  .map((f) => `<link rel="preload" as="font" type="font/woff2" href="/assets/${f}" crossorigin>`)
  .join('')

/**
 * Inline the page's stylesheets. As separate files they are render-blocking
 * requests that share the connection with the JavaScript, so on a slow phone
 * 11 KB of CSS arrived at ~820ms and held the first paint behind it. Inlined,
 * the styles arrive with the HTML.
 */
function inlineStyles(html) {
  return html.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/g, (_, href) => {
    const css = readFileSync(join(root, 'dist', href), 'utf8')
    return `<style>${css}</style>`
  })
}

for (const [route, render] of Object.entries(pages)) {
  const file = join(root, 'dist', route, 'index.html')
  const html = readFileSync(file, 'utf8')
  if (!html.includes(EMPTY_ROOT)) throw new Error(`${file}: no empty #root to fill`)
  const body = render()
  // Fonts straight after the charset: placed after the inlined styles, the
  // browser only found them once ~70 KB of CSS had arrived.
  // The page is drawn from HTML now, so its JavaScript is not needed for the
  // first paint. Fetched at low priority, it stops competing with the fonts
  // and the portrait on a slow connection; hydration simply follows them.
  const lowPriorityJs = (h) =>
    h.replace(/<script type="module"/g, '<script type="module" fetchpriority="low"').replace(/<link rel="modulepreload"/g, '<link rel="modulepreload" fetchpriority="low"')
  const out = lowPriorityJs(inlineStyles(html))
    .replace(/<meta charset="UTF-8" \/>/, (m) => `${m}${fontPreloads}`)
    .replace(EMPTY_ROOT, `<div id="root">${body}</div>`)
  if (/<link rel="stylesheet"/.test(out)) throw new Error(`${file}: a stylesheet was not inlined`)
  writeFileSync(file, out)
  console.log(`prerendered ${route} (${Math.round(out.length / 1024)} KB of HTML with styles inlined)`)
}
rmSync(ssrDir, { recursive: true, force: true })

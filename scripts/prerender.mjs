// Pre-renders the pages listed in src/entry-server.tsx into dist/. Without it
// each page ships an empty <div id="root"> and paints nothing until hundreds of
// KB of JavaScript have loaded and run; with it the first screen arrives in the
// HTML and React hydrates over it.
import { readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ssrDir = join(root, 'dist-ssr')
const { pages } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href)
const EMPTY_ROOT = '<div id="root"></div>'

for (const [route, render] of Object.entries(pages)) {
  const file = join(root, 'dist', route, 'index.html')
  const html = readFileSync(file, 'utf8')
  if (!html.includes(EMPTY_ROOT)) throw new Error(`${file}: no empty #root to fill`)
  const body = render()
  writeFileSync(file, html.replace(EMPTY_ROOT, `<div id="root">${body}</div>`))
  console.log(`prerendered ${route} (${Math.round(body.length / 1024)} KB of HTML)`)
}
rmSync(ssrDir, { recursive: true, force: true })

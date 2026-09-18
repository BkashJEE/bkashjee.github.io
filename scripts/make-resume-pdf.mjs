// Regenerates public/resume/bikash-joshi-resume.pdf from the built /resume/
// page. Run after editing src/content/resume.ts:
//   npm run build && npm run resume:pdf
// Uses Playwright's Chromium (never Electron; no headless Electron flags).
import { spawn } from 'node:child_process'
import { mkdirSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { homedir } from 'node:os'
import { chromium } from 'playwright'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const PORT = 4179

const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
  cwd: root,
  stdio: 'ignore',
})

async function waitForServer(url, tries = 40) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url)
      if (res.ok) return
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 250))
  }
  throw new Error(`preview server did not start on :${PORT}`)
}

try {
  await waitForServer(`http://localhost:${PORT}/resume/`)

  let browser
  try {
    browser = await chromium.launch()
  } catch {
    // Fall back to the browser revision already in the shared cache.
    const cached = join(homedir(), '.cache/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-linux64/chrome-headless-shell')
    if (!existsSync(cached)) throw new Error('No Playwright Chromium available; run: npx playwright install chromium')
    browser = await chromium.launch({ executablePath: cached })
  }

  const page = await browser.newPage()
  await page.goto(`http://localhost:${PORT}/resume/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)

  mkdirSync(join(root, 'public/resume'), { recursive: true })
  const path = join(root, 'public/resume/bikash-joshi-resume.pdf')
  await page.pdf({ path, format: 'Letter', printBackground: true, preferCSSPageSize: true })
  await browser.close()
  console.log(`wrote ${path}`)
} finally {
  preview.kill()
}

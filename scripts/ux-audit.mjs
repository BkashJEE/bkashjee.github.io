// UI/UX audit for bkashjee.github.io: the same measurable checks every run, so
// runs can be compared. Writes ux-audit/<stamp>.json and .md (gitignored) and
// diffs against the previous run.
//
//   node scripts/ux-audit.mjs                       audit the live site
//   node scripts/ux-audit.mjs --base http://localhost:4173
//   node scripts/ux-audit.mjs --benchmark https://a.com,https://b.com
//
// Measured, not judged: overflow, tap targets, type floor, text contrast, alt
// text, headings, page errors, failed requests, broken links, page weight,
// metadata, the resume PDF's page count, and resume figures against GitHub.
import { chromium } from 'playwright'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'ux-audit')
const args = process.argv.slice(2)
const flag = (name) => {
  const i = args.indexOf(name)
  return i === -1 ? null : args[i + 1]
}
const base = (flag('--base') ?? 'https://bkashjee.github.io').replace(/\/$/, '')
const benchmark = flag('--benchmark')?.split(',').map((u) => u.trim()).filter(Boolean) ?? []
const PAGES = ['/', '/use-cases/', '/archive/', '/resume/']
const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844, touch: true },
  { name: 'desktop', width: 1440, height: 900, touch: false },
]
// Requests that fail for reasons outside the site: GitHub's unauthenticated API
// rate limit (the site falls back to baked figures) and X, which blocks bots.
const IGNORE = /api\.github\.com|(^|\/\/)(x|twitter)\.com/

async function launch() {
  const cached = '/home/bkash86/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome'
  const executablePath = process.env.UX_AUDIT_CHROME ?? (existsSync(cached) ? cached : undefined)
  return chromium.launch(executablePath ? { executablePath } : {})
}

/** Everything measured inside one page at one viewport. */
async function measurePage(browser, url, vp) {
  const page = await browser.newPage({
    viewport: { width: vp.width, height: vp.height },
    hasTouch: vp.touch,
    reducedMotion: 'reduce', // reveals render immediately, so below-the-fold text is measurable
  })
  const errors = []
  const failed = []
  let bytes = 0
  let requests = 0
  page.on('pageerror', (e) => errors.push(e.message.slice(0, 160)))
  page.on('console', (m) => {
    if (m.type() !== 'error') return
    const loc = m.location()?.url ?? ''
    if (!IGNORE.test(loc) && !IGNORE.test(m.text())) errors.push(m.text().slice(0, 160))
  })
  // Aborted requests are cancelled prefetches and analytics beacons, not breakage.
  page.on('requestfailed', (r) => {
    if (IGNORE.test(r.url()) || /ERR_ABORTED/.test(r.failure()?.errorText ?? '')) return
    failed.push(`failed ${r.url().slice(0, 120)}`)
  })
  page.on('response', async (r) => {
    requests++
    if (r.status() >= 400 && !IGNORE.test(r.url())) failed.push(`${r.status()} ${r.url().slice(0, 120)}`)
    try {
      bytes += (await r.body()).length
    } catch {
      /* redirects and opaque bodies have none */
    }
  })

  const res = await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 }).catch((e) => ({ status: () => `ERR ${e.message}` }))
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 50))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(900)

  const m = await page.evaluate(() => {
    const parse = (c) => {
      const n = c.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 0]
      return { r: n[0], g: n[1], b: n[2], a: n.length > 3 ? n[3] : 1 }
    }
    const lum = ({ r, g, b }) => {
      const f = (v) => {
        v /= 255
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
      }
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
    }
    const over = (top, under) => ({
      r: top.r * top.a + under.r * (1 - top.a),
      g: top.g * top.a + under.g * (1 - top.a),
      b: top.b * top.a + under.b * (1 - top.a),
      a: 1,
    })
    const pageBg = (() => {
      for (const el of [document.body, document.documentElement]) {
        const c = parse(getComputedStyle(el).backgroundColor)
        if (c.a > 0) return c
      }
      return { r: 255, g: 255, b: 255, a: 1 }
    })()
    /** Composite background behind an element; null when an image or gradient is in the way. */
    const backgroundOf = (el) => {
      const layers = []
      for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
        const cs = getComputedStyle(n)
        if (cs.backgroundImage !== 'none') return null
        const c = parse(cs.backgroundColor)
        if (c.a > 0) layers.push(c)
        if (c.a >= 1) break
      }
      return layers.reverse().reduce((under, top) => over(top, under), pageBg)
    }
    const visible = (el) => {
      const cs = getComputedStyle(el)
      if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) return false
      const r = el.getBoundingClientRect()
      return r.width > 2 && r.height > 2 && !el.closest('[aria-hidden="true"]')
    }

    // Horizontal overflow, and whether the page can actually be dragged sideways.
    const de = document.documentElement
    window.scrollTo({ left: 9999, behavior: 'instant' })
    const dragged = Math.round(de.scrollLeft || window.scrollX)
    window.scrollTo({ left: 0, behavior: 'instant' })

    // Text: smallest size, distinct sizes, contrast failures.
    const sizes = new Set()
    let smallest = Infinity
    let textChecked = 0
    const lowContrast = []
    for (const el of document.querySelectorAll('body *')) {
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
      if (!own || !visible(el)) continue
      const cs = getComputedStyle(el)
      const size = parseFloat(cs.fontSize)
      sizes.add(size)
      smallest = Math.min(smallest, size)
      const bg = backgroundOf(el)
      if (!bg) continue
      const fg = over(parse(cs.color), bg)
      const ratio = (Math.max(lum(fg), lum(bg)) + 0.05) / (Math.min(lum(fg), lum(bg)) + 0.05)
      const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700)
      textChecked++
      if (ratio < (large ? 3 : 4.5)) {
        lowContrast.push(`${ratio.toFixed(2)}:1 "${el.textContent.trim().replace(/\s+/g, ' ').slice(0, 40)}"`)
      }
    }

    // Tap targets. Inline links inside prose are excluded: a fixed box would break the line.
    const tap = [...document.querySelectorAll('a[href], button, select, input, [role="tab"]')].filter(visible)
    const blockish = tap.filter((el) => getComputedStyle(el).display !== 'inline')
    const tiny = blockish.filter((el) => el.getBoundingClientRect().height < 24)

    const imgs = [...document.images].filter((i) => !i.closest('[aria-hidden="true"]'))
    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => Number(h.tagName[1]))
    const skips = headings.filter((lvl, i) => i > 0 && lvl > headings[i - 1] + 1).length
    const meta = (k) => document.querySelector(`meta[name="${k}"],meta[property="${k}"]`)?.content ?? null

    return {
      overflowPx: de.scrollWidth - de.clientWidth,
      draggablePx: dragged,
      smallestFontPx: Number.isFinite(smallest) ? smallest : null,
      distinctFontSizes: sizes.size,
      textChecked,
      lowContrast: lowContrast.slice(0, 12),
      lowContrastCount: lowContrast.length,
      tapTargets: tap.length,
      tapUnder24: tiny.length,
      tapUnder24Examples: tiny.slice(0, 6).map((el) => `${el.textContent.trim().slice(0, 30) || el.getAttribute('aria-label')} (${Math.round(el.getBoundingClientRect().height)}px)`),
      tapUnder44: blockish.filter((el) => el.getBoundingClientRect().height < 44).length,
      brokenImages: imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src.slice(0, 100)),
      missingAlt: imgs.filter((i) => !i.hasAttribute('alt')).map((i) => i.src.slice(0, 100)),
      h1Count: headings.filter((h) => h === 1).length,
      headingSkips: skips,
      title: document.title,
      description: meta('description'),
      ogImage: meta('og:image'),
      hasIcon: !!document.querySelector('link[rel~="icon"]'),
      links: [...document.querySelectorAll('a[href]')].map((a) => a.href).filter((h) => /^https?:/.test(h)),
    }
  })
  await page.close()
  return { status: typeof res?.status === 'function' ? res.status() : null, errors, failed: [...new Set(failed)], bytes, requests, ...m }
}

/**
 * First load on a phone over throttled 4G with a 4x slower CPU, median of
 * three cold loads: first paint, largest paint and layout shift. This is
 * what "at one sight" means in numbers, so the score protects it.
 */
async function firstLoad(browser, url) {
  const runs = []
  for (let i = 0; i < 3; i++) {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, deviceScaleFactor: 2 })
    const page = await ctx.newPage()
    const cdp = await ctx.newCDPSession(page)
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8 })
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true })
    await page.addInitScript(() => {
      window.__lcp = 0
      window.__cls = 0
      new PerformanceObserver((l) => {
        const e = l.getEntries().at(-1)
        window.__lcp = e.startTime
        window.__lcpEl = `${e.element?.tagName ?? ''} ${(e.url || e.element?.textContent || '').split('/').pop().slice(0, 30)}`
      }).observe({ type: 'largest-contentful-paint', buffered: true })
      new PerformanceObserver((l) => {
        for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value
      }).observe({ type: 'layout-shift', buffered: true })
    })
    await page.goto(url, { waitUntil: 'load', timeout: 90_000 })
    await page.waitForTimeout(5000)
    runs.push(
      await page.evaluate(() => ({
        fcp: Math.round(performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0),
        lcp: Math.round(window.__lcp),
        cls: Number(window.__cls.toFixed(3)),
        lcpElement: window.__lcpEl,
      })),
    )
    await ctx.close()
  }
  const median = (k) => runs.map((r) => r[k]).sort((a, b) => a - b)[1]
  return { fcp: median('fcp'), lcp: median('lcp'), cls: median('cls'), lcpElement: runs[1].lcpElement }
}

async function checkLinks(urls) {
  const bad = []
  const todo = [...new Set(urls.map((u) => u.split('#')[0]))].filter((u) => !IGNORE.test(u))
  await Promise.all(
    todo.map(async (u) => {
      try {
        let r = await fetch(u, { method: 'HEAD', redirect: 'follow' })
        if (r.status === 405 || r.status === 403) r = await fetch(u, { redirect: 'follow' })
        if (r.status >= 400) bad.push(`${r.status} ${u}`)
      } catch (e) {
        bad.push(`ERR ${u} (${e.cause?.code ?? e.message})`)
      }
    }),
  )
  return { checked: todo.length, broken: bad }
}

/** Resume PDF page count, via pdfinfo when present. */
async function pdfPages(url) {
  const res = await fetch(url)
  if (!res.ok) return { status: res.status, pages: null }
  const file = join(outDir, '.resume.pdf')
  writeFileSync(file, Buffer.from(await res.arrayBuffer()))
  try {
    const info = execFileSync('pdfinfo', [file]).toString()
    return { status: res.status, pages: Number(info.match(/^Pages:\s+(\d+)/m)?.[1]) }
  } catch {
    return { status: res.status, pages: null }
  }
}

/** Star counts and versions quoted in the resume prose, compared with GitHub now. */
async function resumeFigures(resumeText) {
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'ux-audit' }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  const gh = async (path) => {
    const r = await fetch(`https://api.github.com${path}`, { headers })
    return r.ok ? r.json() : null
  }
  const drift = []
  const checks = [
    { repo: 'hermes-bot-forge', re: /(\d+) GitHub stars/ },
    { repo: 'hermes-agent-dock', re: /Hermes Agent Dock[^(]*\((\d+)★/ },
    { repo: 'hermes-agent-archive', re: /Hermes Agent Archive[^(]*\((\d+)★/ },
    { repo: 'repo-shelf', re: /Repo Shelf[^(]*\((\d+)★/ },
  ]
  for (const c of checks) {
    const quoted = Number(resumeText.match(c.re)?.[1])
    const repo = await gh(`/repos/BkashJEE/${c.repo}`)
    if (!repo || !quoted) continue
    const live = repo.stargazers_count
    if (Math.abs(live - quoted) >= Math.max(3, quoted * 0.1)) drift.push(`${c.repo}: resume says ${quoted}★, GitHub has ${live}★`)
  }
  const release = await gh('/repos/BkashJEE/hermes-bot-forge/releases/latest')
  const quotedVersion = resumeText.match(/now at (v[\d.]+)/)?.[1]
  if (release && quotedVersion && release.tag_name !== quotedVersion) {
    drift.push(`hermes-bot-forge: resume says ${quotedVersion}, latest release is ${release.tag_name}`)
  }
  return drift
}

/**
 * 0–100. Weights are deliberate: anything that breaks a page or makes it
 * unreadable costs more than a missing nicety. Documented so the number means
 * the same thing on every run.
 */
function score(pages, site) {
  let s = 100
  const cut = (n, per, cap) => Math.min(cap, n * per)
  for (const p of pages) {
    if (p.status !== 200) s -= 25
    s -= cut(p.errors.length, 4, 12)
    s -= cut(p.failed.length, 3, 9)
    s -= p.draggablePx > 0 ? 10 : 0
    s -= cut(p.lowContrastCount, 1, 8)
    s -= cut(p.tapUnder24, 1, 6)
    s -= p.smallestFontPx != null && p.smallestFontPx < 11 ? 3 : 0
    s -= cut(p.brokenImages.length, 4, 8)
    s -= cut(p.missingAlt.length, 1, 4)
    s -= p.h1Count === 1 ? 0 : 2
  }
  if (site) {
    s -= cut(site.links.broken.length, 3, 12)
    s -= site.pdf && site.pdf.pages !== 1 ? 10 : 0
    s -= cut(site.figureDrift.length, 2, 8)
    s -= cut(site.missingMeta.length, 1, 6)
    const f = site.firstLoad
    if (f) {
      s -= f.lcp > 4000 ? 10 : f.lcp > 2500 ? 5 : 0
      s -= f.fcp > 1800 ? 3 : 0
      s -= f.cls > 0.1 ? 5 : 0
    }
  }
  return Math.max(0, Math.round(s))
}

function toMarkdown(run, previous) {
  const L = []
  L.push(`# UX audit — ${run.target}`, '', `${run.stamp} · score **${run.score}/100**${previous ? ` (previous ${previous.score}, ${run.score - previous.score >= 0 ? '+' : ''}${run.score - previous.score})` : ''}`, '')
  if (run.changes?.length) L.push('## Changed since last run', '', ...run.changes.map((c) => `- ${c}`), '')
  L.push('## Pages', '', '| page | vp | status | errors | failed | drag px | low contrast | tap <24 | smallest px | sizes | KB |', '|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|')
  for (const p of run.pages) {
    L.push(`| ${p.path} | ${p.viewport} | ${p.status} | ${p.errors.length} | ${p.failed.length} | ${p.draggablePx} | ${p.lowContrastCount} | ${p.tapUnder24} | ${p.smallestFontPx} | ${p.distinctFontSizes} | ${Math.round(p.bytes / 1024)} |`)
  }
  const details = run.pages.flatMap((p) => [
    ...p.errors.map((e) => `${p.path} ${p.viewport}: error — ${e}`),
    ...p.failed.map((f) => `${p.path} ${p.viewport}: request — ${f}`),
    ...p.lowContrast.map((c) => `${p.path} ${p.viewport}: contrast ${c}`),
    ...p.tapUnder24Examples.map((t) => `${p.path} ${p.viewport}: tap target ${t}`),
    ...p.brokenImages.map((i) => `${p.path} ${p.viewport}: broken image ${i}`),
    ...p.missingAlt.map((i) => `${p.path} ${p.viewport}: no alt ${i}`),
  ])
  if (details.length) L.push('', '## Findings', '', ...[...new Set(details)].map((d) => `- ${d}`))
  if (run.site) {
    L.push('', '## Site', '', `- Links: ${run.site.links.checked} checked, ${run.site.links.broken.length} broken${run.site.links.broken.map((b) => `\n  - ${b}`).join('')}`)
    if (run.site.pdf) L.push(`- Resume PDF: HTTP ${run.site.pdf.status}, ${run.site.pdf.pages ?? '?'} page(s)`)
    L.push(`- Resume figures vs GitHub: ${run.site.figureDrift.length ? run.site.figureDrift.map((d) => `\n  - ${d}`).join('') : 'in step'}`)
    L.push(`- Missing metadata: ${run.site.missingMeta.length ? run.site.missingMeta.join('; ') : 'none'}`)
    const f = run.site.firstLoad
    if (f) {
      const mark = (v, good) => (v <= good ? '✓' : '✗')
      L.push(`- First load, home, phone on 4G with 4× slower CPU (median of 3): first paint ${f.fcp}ms ${mark(f.fcp, 1800)} · largest paint ${f.lcp}ms ${mark(f.lcp, 2500)} (${f.lcpElement}) · layout shift ${f.cls} ${mark(f.cls, 0.1)}`)
    }
  }
  if (run.benchmark?.length) {
    L.push('', '## Benchmark (home page only, generic checks)', '', '| site | score | drag px m/d | low contrast m/d | tap <24 m/d | smallest px | KB |', '|---|---:|---|---|---|---:|---:|')
    for (const b of run.benchmark) {
      const [m, d] = b.pages
      L.push(`| ${b.target} | ${b.score} | ${m.draggablePx}/${d.draggablePx} | ${m.lowContrastCount}/${d.lowContrastCount} | ${m.tapUnder24}/${d.tapUnder24} | ${Math.min(m.smallestFontPx, d.smallestFontPx)} | ${Math.round(d.bytes / 1024)} |`)
    }
  }
  return L.join('\n') + '\n'
}

function diff(run, prev) {
  if (!prev) return []
  const out = []
  const key = (p) => `${p.path} ${p.viewport}`
  const before = new Map(prev.pages.map((p) => [key(p), p]))
  for (const p of run.pages) {
    const b = before.get(key(p))
    if (!b) continue
    for (const [field, label, worseIfUp] of [
      ['errors', 'page errors', true],
      ['failed', 'failed requests', true],
      ['lowContrastCount', 'low-contrast text', true],
      ['tapUnder24', 'tap targets under 24px', true],
      ['draggablePx', 'sideways drag', true],
      ['distinctFontSizes', 'distinct font sizes', true],
    ]) {
      const now = Array.isArray(p[field]) ? p[field].length : p[field]
      const was = Array.isArray(b[field]) ? b[field].length : b[field]
      if (now !== was) out.push(`${key(p)}: ${label} ${was} → ${now} ${(now > was) === worseIfUp ? '(worse)' : '(better)'}`)
    }
  }
  const now = run.site?.firstLoad
  const was = prev.site?.firstLoad
  if (now && was) {
    for (const [k, label, slack] of [['fcp', 'first paint', 250], ['lcp', 'largest paint', 300]]) {
      if (Math.abs(now[k] - was[k]) >= slack) out.push(`home first load: ${label} ${was[k]}ms → ${now[k]}ms ${now[k] > was[k] ? '(worse)' : '(better)'}`)
    }
  }
  return out
}

async function auditSite(browser, target, paths, withSiteChecks) {
  const pages = []
  for (const path of paths) {
    for (const vp of VIEWPORTS) {
      const m = await measurePage(browser, target + path, vp)
      pages.push({ path, viewport: vp.name, ...m })
    }
  }
  let site = null
  if (withSiteChecks) {
    const links = await checkLinks(pages.flatMap((p) => p.links))
    const pdf = await pdfPages(`${target}/resume/bikash-joshi-resume.pdf`)
    const resumePage = await browser.newPage()
    await resumePage.goto(`${target}/resume/`, { waitUntil: 'networkidle' })
    const resumeText = await resumePage.evaluate(() => document.body.innerText)
    await resumePage.close()
    const figureDrift = await resumeFigures(resumeText)
    const missingMeta = pages
      .filter((p) => p.viewport === 'desktop')
      .flatMap((p) => [!p.description && `${p.path} description`, !p.ogImage && `${p.path} og:image`, !p.hasIcon && `${p.path} icon`].filter(Boolean))
    site = { links, pdf, figureDrift, missingMeta, firstLoad: await firstLoad(browser, `${target}/`) }
  }
  for (const p of pages) delete p.links
  return { target, pages, site, score: score(pages, site) }
}

mkdirSync(outDir, { recursive: true })
const browser = await launch()
const stamp = new Date().toISOString().replace(/[:]/g, '-').slice(0, 16)
const run = { stamp, ...(await auditSite(browser, base, PAGES, true)) }
if (benchmark.length) {
  run.benchmark = []
  for (const url of benchmark) run.benchmark.push(await auditSite(browser, url.replace(/\/$/, ''), ['/'], false))
}
await browser.close()

const previousFile = readdirSync(outDir).filter((f) => /^\d{4}-.*\.json$/.test(f)).sort().pop()
const previous = previousFile ? JSON.parse(readFileSync(join(outDir, previousFile), 'utf8')) : null
run.changes = diff(run, previous)
writeFileSync(join(outDir, `${stamp}.json`), JSON.stringify(run, null, 1))
const md = toMarkdown(run, previous)
writeFileSync(join(outDir, `${stamp}.md`), md)
writeFileSync(join(outDir, 'latest.md'), md)
console.log(md)

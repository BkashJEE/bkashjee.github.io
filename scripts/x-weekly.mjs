// Turns an X analytics post export (account_analytics_content_*.csv) into
// src/content/xWeekly.json: views summed by the week each post was published.
// Run by hand after a new export; the CSV stays on my machine.
//
//   node scripts/x-weekly.mjs ~/Downloads/account_analytics_content_<from>_<to>.csv [first-week]
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const [csvPath, firstWeek = '2026-06-01'] = process.argv.slice(2)
if (!csvPath) throw new Error('usage: x-weekly.mjs <export.csv> [first-week YYYY-MM-DD]')
const out = join(dirname(fileURLToPath(import.meta.url)), '..', 'src/content/xWeekly.json')

// Minimal CSV parse: quoted fields may hold commas, quotes and newlines.
function parse(text) {
  const rows = [[]]
  let field = '', quoted = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++ } else if (c === '"') quoted = false
      else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') { rows.at(-1).push(field); field = '' }
    else if (c === '\n') { rows.at(-1).push(field.replace(/\r$/, '')); field = ''; rows.push([]) }
    else field += c
  }
  if (field || rows.at(-1).length) rows.at(-1).push(field)
  const [head, ...body] = rows.filter((r) => r.length > 1)
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.replace(/^﻿/, ''), r[i]])))
}

const iso = (d) => d.toISOString().slice(0, 10)
const monday = (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - ((d.getUTCDay() + 6) % 7)))

const posts = parse(readFileSync(csvPath, 'utf8')).map((r) => ({ date: new Date(`${r.Date} UTC`), views: Number(r.Impressions) }))
const last = new Date(Math.max(...posts.map((p) => p.date)))
// The export's final week is cut short, so the chart ends at the last full week.
const lastFullWeek = new Date(monday(last).getTime() - 7 * 86_400_000)
const weeks = []
for (let w = new Date(`${firstWeek}T00:00:00Z`); w <= lastFullWeek; w = new Date(w.getTime() + 7 * 86_400_000)) {
  const inWeek = posts.filter((p) => monday(p.date).getTime() === w.getTime())
  weeks.push({ week: iso(w), views: inWeek.reduce((s, p) => s + p.views, 0), posts: inWeek.length })
}
writeFileSync(out, JSON.stringify({ counted: iso(last), weeks }, null, 2) + '\n')
console.log(`xWeekly.json: ${weeks.length} weeks, ${weeks[0].week} to ${weeks.at(-1).week}, counted ${iso(last)}`)

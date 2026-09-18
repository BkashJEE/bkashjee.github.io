// Audits the portfolio's claims and copy with TypeSafe System One (Jev).
//
//   npm run typesafe:audit            # needs TYPESAFE_API_KEY for the model steps
//
// Runs on this machine only: the API key must never reach the static site.
// Without a key it still runs the code checks and reports what the model
// steps would do.
//
// 1. Code checks (no model): star counts, open upstream PR count, test count.
// 2. Evidence filter: each source doc is split into sections; one request per
//    section asks a Noul per claim "does this section address the claim?".
// 3. Claim check: per claim, a Choice over the relevant sections —
//    supports / contradicts / says_nothing (citation-check cookbook).
// 4. Copy scoring: per case study, atomic Scores a recruiter screen cares
//    about, combined with weights in code (composite-scoring pattern).
//
// Outputs typesafe/report.md and typesafe/judgments.json. Neither contains
// source-document text, because some sources are private repos.
import { execSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const MODEL = 'jev-1.13.0' // pinned: thresholds below were chosen for this version
const AUTO_ACCEPT = 0.8 // below this, a person confirms the verdict
const RELEVANT = 0.5 // Noul threshold for a section to count as evidence
const MAX_SECTIONS = 4 // most relevant sections sent with each claim
const WEIGHTS = { problem: 0.25, ownership: 0.2, technical: 0.2, evidence: 0.2, plain: 0.15 }

// The key lives outside the repo in ~/.config/typesafe/env (chmod 600).
const keyFile = join(homedir(), '.config/typesafe/env')
if (!process.env.TYPESAFE_API_KEY && existsSync(keyFile)) {
  const m = readFileSync(keyFile, 'utf8').replace(/\r/g, '').match(/^TYPESAFE_API_KEY=(.+)$/m)
  if (m) process.env.TYPESAFE_API_KEY = m[1].trim()
}

const claimsFile = JSON.parse(readFileSync(join(root, 'typesafe/claims.json'), 'utf8'))
const cachePath = join(root, 'typesafe/cache.json')
const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, 'utf8')) : {}
const hasKey = Boolean(process.env.TYPESAFE_API_KEY?.trim())

let client = null
if (hasKey) {
  const { TypeSafeClient } = await import('@typesafe-ai/sdk')
  client = new TypeSafeClient({ defaultModel: MODEL })
}

// ---- helpers ---------------------------------------------------------------

const sh = (cmd, opts = {}) => execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], ...opts }).trim()

async function loadSource(ref) {
  // git:<repo>:<ref>:<path> reads a file as published on a branch, not the working copy.
  if (ref.startsWith('git:')) {
    const [, repo, rev, path] = ref.split(':')
    return sh(`git -C ${repo.replace(/^~/, homedir())} show ${rev}:${path}`, { maxBuffer: 1 << 24 })
  }
  if (ref.startsWith('http')) {
    const res = await fetch(ref)
    if (!res.ok) throw new Error(`${ref}: HTTP ${res.status}`)
    return res.text()
  }
  return readFileSync(ref.replace(/^~/, homedir()), 'utf8')
}

/** Markdown split on #/##/### headings; each section keeps its heading path. */
function splitSections(doc, origin) {
  const out = []
  let current = { heading: '(intro)', lines: [] }
  let inFence = false
  for (const line of doc.split('\n')) {
    if (line.startsWith('```')) inFence = !inFence
    const m = !inFence && line.match(/^(#{1,3})\s+(.*)$/)
    if (m) {
      out.push(current)
      current = { heading: m[2].trim(), lines: [] }
    } else {
      current.lines.push(line)
    }
  }
  out.push(current)
  return out
    .map((s) => ({ origin, heading: s.heading, text: s.lines.join('\n').trim().slice(0, 6000) }))
    .filter((s) => s.text.length > 40)
}

/** One cached System One call. Cache values hold answers only, never state. */
async function ask(state, questions) {
  const key = createHash('sha256').update(JSON.stringify({ MODEL, state, questions })).digest('hex')
  if (cache[key]) return cache[key]
  if (!client) return null
  const res = await client.systemOne({ state, questions, model: MODEL })
  const entry = { model: res.model, answers: JSON.parse(JSON.stringify(res.answers)) }
  cache[key] = entry
  return entry
}

async function pool(items, limit, fn) {
  const results = new Array(items.length)
  let next = 0
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++
        results[i] = await fn(items[i], i)
      }
    }),
  )
  return results
}

// ---- 1. code checks --------------------------------------------------------

function codeChecks() {
  const results = []
  const projects = readFileSync(join(root, 'src/content/projects.ts'), 'utf8')

  for (const [, repo, stars] of projects.matchAll(/repo: 'https:\/\/github\.com\/([^']+)',\s*stars: (\d+)/g)) {
    try {
      const live = Number(sh(`gh api repos/${repo} --jq .stargazers_count`))
      results.push({
        check: `stars · ${repo}`,
        site: Number(stars),
        actual: live,
        ok: live === Number(stars),
        note: live === Number(stars) ? '' : 'Fallback count is stale; the site shows the live number when GitHub is reachable.',
      })
    } catch {
      results.push({ check: `stars · ${repo}`, site: Number(stars), actual: null, ok: null, note: 'gh unavailable' })
    }
  }

  try {
    const open = Number(sh(`gh pr list --repo NousResearch/hermes-agent --author BkashJEE --state open --limit 200 --json number --jq length`))
    const merged = Number(sh(`gh pr list --repo NousResearch/hermes-agent --author BkashJEE --state merged --limit 200 --json number --jq length`))
    results.push({ check: 'open upstream PRs (site: "fifteen")', site: 15, actual: open, ok: open >= 15, note: `${merged} merged` })
  } catch {
    results.push({ check: 'open upstream PRs', site: 10, actual: null, ok: null, note: 'gh unavailable' })
  }

  // Each case-study stat of the form "N tests passing" is re-measured.
  const suites = { screenpolish: 'screenpolish-linux-omarchy', 'mission-control': 'hermes-content-mission-control' }
  for (const [id, dir] of Object.entries(suites)) {
    const block = projects.slice(projects.indexOf(`id: '${id}'`))
    const claimed = Number(block.match(/stat: '(\d+) tests passing/)?.[1] ?? NaN)
    const path = join(homedir(), dir)
    if (!existsSync(path) || Number.isNaN(claimed)) continue
    try {
      const out = execSync('npx vitest run 2>&1', { cwd: path, encoding: 'utf8', timeout: 240_000 })
      const actual = Number(out.match(/Tests\s+(\d+) passed/)?.[1] ?? NaN)
      const failed = /Tests\s+.*\d+ failed/.test(out)
      results.push({ check: `${id} tests passing`, site: claimed, actual, ok: actual === claimed && !failed, note: failed ? 'some tests fail' : '' })
    } catch {
      results.push({ check: `${id} tests passing`, site: claimed, actual: null, ok: false, note: 'suite failed or timed out' })
    }
  }
  return results
}

// ---- 2 + 3. claim verification --------------------------------------------

const RELATION = {
  supports: 'The sections state the claim or directly imply that it is true',
  contradicts: 'The sections state the opposite of the claim, or say it is only partly true, unverified, or planned',
  says_nothing: 'The sections do not address what the claim asserts, either way',
}
const VERDICT = { supports: 'verified', contradicts: 'contradicted', says_nothing: 'unsupported' }

async function verifyClaims() {
  const byProject = {}
  for (const c of claimsFile.claims) (byProject[c.project] ??= []).push(c)

  const sections = []
  for (const [project, refs] of Object.entries(claimsFile.sources)) {
    for (const ref of refs) {
      try {
        const name = ref.startsWith('git:') ? ref.split(':').slice(-1)[0] : ref.split('/').slice(-2).join('/')
        for (const s of splitSections(await loadSource(ref), name)) sections.push({ project, ...s })
      } catch (err) {
        console.warn(`skipped source ${ref}: ${err.message}`)
      }
    }
  }

  // Step 2: relevance, one request per section, one Noul per claim in that project.
  const relevance = {} // claimId -> [{ section, p }]
  await pool(sections, 8, async (section) => {
    const claims = byProject[section.project] ?? []
    const questions = Object.fromEntries(
      claims.map((c, i) => [
        c.id,
        {
          type: 'noul',
          instructions: `Does \`section.text\` say anything about whether \`claims[${i}]\` is true or false?`,
          criteria: {
            true: 'The section describes the feature, behavior, or fact the claim is about, whether it agrees or disagrees',
            false: 'The section is about other things and says nothing about this claim',
          },
        },
      ]),
    )
    const res = await ask({ section: { heading: section.heading, text: section.text }, claims: claims.map((c) => c.claim) }, questions)
    if (!res) return
    for (const c of claims) (relevance[c.id] ??= []).push({ section, p: res.answers[c.id].noul })
  })

  // Step 3: one Choice per claim over its most relevant sections.
  return pool(claimsFile.claims, 8, async (c) => {
    if (!client && !Object.keys(cache).length) return { ...c, verdict: 'pending', confidence: null, sections: [] }
    const ranked = (relevance[c.id] ?? []).filter((r) => r.p >= RELEVANT).sort((a, b) => b.p - a.p).slice(0, MAX_SECTIONS)
    if (!ranked.length) return { ...c, verdict: 'no_evidence', confidence: null, sections: [], auto: false }
    const res = await ask(
      { claim: c.claim, sections: ranked.map((r) => ({ heading: r.section.heading, text: r.section.text })) },
      { relation: { type: 'choice', instructions: 'How do `sections` relate to `claim`?', criteria: RELATION } },
    )
    if (!res) return { ...c, verdict: 'pending', confidence: null, sections: [] }
    const a = res.answers.relation
    return {
      ...c,
      verdict: VERDICT[a.choice],
      confidence: a.confidence,
      auto: a.confidence >= AUTO_ACCEPT,
      sections: ranked.map((r) => `${r.section.origin} › ${r.section.heading}`),
    }
  })
}

// ---- 4. copy scoring --------------------------------------------------------

const COPY_QUESTIONS = {
  problem: {
    type: 'score',
    instructions: 'Does the case study say what problem the project solves and who has that problem?',
    criteria: [
      'Says what the project is built with or how it works, but not what problem it solves or for whom',
      'Implies a use, but the reader has to infer the problem or the audience',
      'Names the problem it solves, but not who has that problem',
      'Names both the problem and the kind of person who has it',
    ],
  },
  ownership: {
    type: 'score',
    instructions: 'How clear does the case study make which parts the author personally designed or built?',
    criteria: [
      'Describes the project only in the third person, with no sign of what the author did',
      'Suggests the author made it, but not which parts they handled',
      'States the author built it, without naming the hard parts they solved',
      'Names specific hard problems the author designed or solved themselves',
    ],
  },
  technical: {
    type: 'score',
    instructions: 'How much concrete technical detail does the case study give that an engineer could evaluate?',
    criteria: [
      'Only general claims such as fast, powerful, or modern',
      'Names technologies but not how they are used',
      'Explains at least one specific technical approach or decision',
      'Explains a specific technical problem, the approach taken, and why that approach was chosen',
    ],
  },
  evidence: {
    type: 'score',
    instructions: 'What evidence does the case study give that the project works and is used?',
    criteria: [
      'No evidence beyond the description of features',
      'Mentions that it is released or installable, without further evidence',
      'Gives one concrete, checkable piece of evidence such as a test count, public source, stars, or a verified release',
      'Gives several concrete, checkable pieces of evidence',
    ],
  },
  plain: {
    type: 'score',
    instructions: 'Could a recruiter without an engineering background understand what this project does from `tagline` and `description`?',
    criteria: [
      'Most sentences depend on technical terms a non-engineer would not know',
      'The main idea comes through, but key sentences depend on unexplained technical terms',
      'A non-engineer can follow almost all of it; technical terms appear only where they add detail',
    ],
  },
}

async function scoreCopy() {
  const { caseStudies } = await import(join(root, 'typesafe/.content.mjs'))
  return pool(caseStudies, 4, async (cs) => {
    const state = {
      name: cs.name,
      tagline: cs.tagline,
      description: cs.description,
      tech: cs.tech,
      evidence_on_page: [cs.stat, cs.link ? 'public source link' : cs.sourceNote].filter(Boolean),
    }
    const res = await ask(state, COPY_QUESTIONS)
    if (!res) return { id: cs.id, name: cs.name, pending: true }
    const dims = {}
    for (const [k, q] of Object.entries(COPY_QUESTIONS)) {
      const a = res.answers[k]
      dims[k] = { score: a.score / (q.criteria.length - 1), confidence: a.confidence }
    }
    const composite = Object.entries(WEIGHTS).reduce((sum, [k, w]) => sum + w * dims[k].score, 0)
    const weakest = Object.entries(dims).sort((a, b) => a[1].score - b[1].score)[0][0]
    return { id: cs.id, name: cs.name, composite, weakest, dims }
  })
}

// ---- run + report -----------------------------------------------------------

// projects.ts is TypeScript; strip the types into a throwaway module for Node.
{
  const ts = readFileSync(join(root, 'src/content/projects.ts'), 'utf8')
  const js = ts
    .replace(/export interface \w+ \{[\s\S]*?\n\}\n/g, '')
    .replace(/export const (\w+): [^=]+=/g, 'export const $1 =')
  writeFileSync(join(root, 'typesafe/.content.mjs'), js)
}

console.log(hasKey ? `Running with ${MODEL}` : 'No TYPESAFE_API_KEY: running code checks only (model steps pending)')
const checks = codeChecks()
const claims = await verifyClaims()
const copy = await scoreCopy()
writeFileSync(cachePath, JSON.stringify(cache, null, 1))

const pct = (v) => (v == null ? '–' : v.toFixed(2))
const lines = [
  '# Portfolio audit',
  '',
  `Generated ${new Date().toISOString().slice(0, 10)} · model ${hasKey ? MODEL : 'not run (no API key)'} · review threshold ${AUTO_ACCEPT}`,
  '',
  '## Code checks',
  '',
  '| Check | Site says | Actual | OK | Note |',
  '| --- | --- | --- | --- | --- |',
  ...checks.map((c) => `| ${c.check} | ${c.site} | ${c.actual ?? '–'} | ${c.ok == null ? '?' : c.ok ? 'yes' : '**no**'} | ${c.note} |`),
  '',
  '## Claims vs. source documents',
  '',
  '| Claim | Verdict | Confidence | Action | Evidence sections |',
  '| --- | --- | --- | --- | --- |',
  ...claims.map(
    (c) =>
      `| ${c.claim} | ${c.verdict} | ${pct(c.confidence)} | ${c.verdict === 'pending' ? '–' : c.auto ? 'auto' : '**review**'} | ${c.sections.join('<br>')} |`,
  ),
  '',
  '## Case-study copy (recruiter screen)',
  '',
  '| Case study | Composite | Weakest | Problem | Ownership | Technical | Evidence | Plain language |',
  '| --- | --- | --- | --- | --- | --- | --- | --- |',
  ...copy.map((c) =>
    c.pending
      ? `| ${c.name} | pending | | | | | | |`
      : `| ${c.name} | ${pct(c.composite)} | ${c.weakest} | ${['problem', 'ownership', 'technical', 'evidence', 'plain'].map((k) => pct(c.dims[k].score)).join(' | ')} |`,
  ),
  '',
]
writeFileSync(join(root, 'typesafe/report.md'), lines.join('\n'))
writeFileSync(join(root, 'typesafe/judgments.json'), JSON.stringify({ model: hasKey ? MODEL : null, checks, claims, copy }, null, 2))
console.log('wrote typesafe/report.md and typesafe/judgments.json')

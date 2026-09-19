// Audits the resume for what a recruiter screen would find missing.
//
//   npm run typesafe:resume
//
// Code checks which standard sections exist (a lookup, not a judgment).
// Jev (TypeSafe System One) judges meaning:
//   - one Score per bullet: does it state a concrete, checkable result?
//   - one Noul per common software-engineer expectation: does the resume
//     show evidence of it anywhere?
// Writes typesafe/resume-report.md (gitignored). Key: ~/.config/typesafe/env.
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const MODEL = 'jev-1.13.0'
const EVIDENCE_YES = 0.5 // Noul above this: the resume shows it
const IMPACT_WEAK = 1.5 // bullet impact below this (0–3 scale): no concrete result

const keyFile = join(homedir(), '.config/typesafe/env')
if (!process.env.TYPESAFE_API_KEY && existsSync(keyFile)) {
  const m = readFileSync(keyFile, 'utf8').replace(/\r/g, '').match(/^TYPESAFE_API_KEY=(.+)$/m)
  if (m) process.env.TYPESAFE_API_KEY = m[1].trim()
}
if (!process.env.TYPESAFE_API_KEY?.trim()) {
  console.error('No TypeSafe key: save it to ~/.config/typesafe/env first.')
  process.exit(1)
}
const { TypeSafeClient } = await import('@typesafe-ai/sdk')
const client = new TypeSafeClient({ defaultModel: MODEL })

const cachePath = join(root, 'typesafe/resume-cache.json')
const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, 'utf8')) : {}
async function ask(state, questions) {
  const key = createHash('sha256').update(JSON.stringify({ MODEL, state, questions })).digest('hex')
  if (!cache[key]) {
    const res = await client.systemOne({ state, questions, model: MODEL })
    cache[key] = { model: res.model, answers: JSON.parse(JSON.stringify(res.answers)) }
  }
  return cache[key].answers
}

// resume.ts is plain data with no types; load it as a module.
const tmp = join(root, 'typesafe/.resume.mjs')
writeFileSync(tmp, readFileSync(join(root, 'src/content/resume.ts'), 'utf8'))
const { resume } = await import(tmp)

// ---- code: section presence ------------------------------------------------

const has = (v) => v != null && (!Array.isArray(v) || v.length > 0)
const sections = [
  ['Work experience (employer, title, dates)', has(resume.experience)],
  ['Education or certifications', has(resume.education)],
  ['Dates on projects', resume.projects.every((p) => has(p.dates))],
  ['Location / time zone / remote preference', has(resume.contact.location)],
  ['LinkedIn', has(resume.contact.linkedin)],
  ['Portfolio link', has(resume.contact.site)],
  ['GitHub link', has(resume.contact.github)],
  ['Summary', has(resume.summary)],
  ['Skills', has(resume.skills)],
]

// ---- Jev: per-bullet impact --------------------------------------------------

const bullets = resume.projects.flatMap((p) => p.bullets.map((text) => ({ project: p.name, text })))
const impactQuestions = Object.fromEntries(
  bullets.map((_, i) => [
    `impact_${i}`,
    {
      type: 'score',
      instructions: `What result does \`bullets[${i}].text\` state for the work it describes?`,
      criteria: [
        'Only lists what the thing is or which technologies were used, with no result',
        'Says what was built, without saying what it achieved for anyone',
        'Says what it achieved, but only in general words',
        'States a concrete, checkable result such as a number, a user or install count, a speed-up, or adoption',
      ],
    },
  ]),
)
const impact = await ask({ bullets }, impactQuestions)

// ---- Jev: evidence of common expectations ---------------------------------

const EXPECTATIONS = {
  collaboration: ['Does the resume show the candidate working with other people, such as teammates, maintainers, code reviewers, or clients?', 'Names work done together with, reviewed by, or for other people', 'All work described is solo, with no other people involved'],
  users: ['Does the resume show that other people use the candidate’s software?', 'Gives users, installs, downloads, stars, or other adoption evidence', 'No sign that anyone besides the candidate uses the software'],
  production: ['Does the resume show software running in production for real users or real traffic?', 'Describes live, deployed software used for real work, with some sense of scale or reliability', 'Only describes projects, prototypes, or tools without saying they run in production'],
  testing: ['Does the resume show the candidate writing automated tests?', 'Mentions test suites, test counts, or testing frameworks used on the work', 'No mention of automated testing'],
  ci_cd: ['Does the resume show automated build, release, or deployment pipelines?', 'Mentions CI, CD, release automation, or packaging pipelines', 'No mention of build or deployment automation'],
  databases: ['Does the resume show hands-on work with databases?', 'Names databases used in the work, or database design such as schemas, security rules, or migrations', 'No database work mentioned'],
  apis: ['Does the resume show the candidate designing or building APIs or backend services?', 'Describes APIs, services, backends, or integrations the candidate built', 'No APIs or backend services described'],
  security: ['Does the resume show attention to security or privacy?', 'Describes concrete security or privacy measures such as access control, allowlists, or data staying local', 'No security or privacy work mentioned'],
  performance: ['Does the resume show the candidate improving performance?', 'Describes a performance problem fixed or a speed, memory, or CPU improvement', 'No performance work mentioned'],
  leadership: ['Does the resume show the candidate leading or mentoring others?', 'Describes leading a team, owning a project with others, or mentoring', 'No leadership or mentoring described'],
  communication: ['Does the resume show the candidate communicating technical ideas through writing, teaching, talks, or documentation?', 'Mentions writing, teaching, talks, content, or documentation work', 'No communication work mentioned'],
  ai_llm: ['Does the resume show hands-on work building with large language models or AI agents?', 'Describes building agents, LLM integrations, or AI tooling', 'No AI or LLM work described'],
}
const evidenceQuestions = Object.fromEntries(
  Object.entries(EXPECTATIONS).map(([id, [instructions, yes, no]]) => [id, { type: 'noul', instructions, criteria: { true: yes, false: no } }]),
)
const evidence = await ask({ resume }, evidenceQuestions)

writeFileSync(cachePath, JSON.stringify(cache, null, 1))

// ---- report -----------------------------------------------------------------

const lines = [
  '# Resume audit',
  '',
  `Generated ${new Date().toISOString().slice(0, 10)} · ${MODEL}`,
  '',
  '## Sections (code check)',
  '',
  ...sections.map(([name, ok]) => `- ${ok ? 'present' : '**missing**'}: ${name}`),
  '',
  '## Bullet impact (Jev Score, 0 = no result, 3 = concrete checkable result)',
  '',
  '| Project | Score | Confidence | Bullet |',
  '| --- | --- | --- | --- |',
  ...bullets.map((b, i) => {
    const a = impact[`impact_${i}`]
    const flag = a.score < IMPACT_WEAK ? '**' : ''
    return `| ${b.project} | ${flag}${a.score.toFixed(2)}${flag} | ${a.confidence.toFixed(2)} | ${b.text.slice(0, 90)}… |`
  }),
  '',
  '## Evidence of common expectations (Jev Noul, probability the resume shows it)',
  '',
  ...Object.keys(EXPECTATIONS)
    .sort((a, b) => evidence[a].noul - evidence[b].noul)
    .map((id) => `- ${evidence[id].noul >= EVIDENCE_YES ? 'shown' : '**not shown**'} (${evidence[id].noul.toFixed(2)}): ${id}`),
  '',
]
writeFileSync(join(root, 'typesafe/resume-report.md'), lines.join('\n'))
console.log(lines.join('\n'))

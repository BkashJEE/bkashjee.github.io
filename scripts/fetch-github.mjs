// Refreshes src/content/github.json from the public GitHub API: my public,
// non-fork repos for the archive page, and the status of the upstream PRs
// listed in projects.ts. Runs before every build; if the API is unreachable
// or rate-limited, the committed JSON is kept as is.
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const out = join(root, 'src/content/github.json')
const USER = 'BkashJEE'
// Repos the site deliberately leaves out.
const EXCLUDE = new Set(['hermex-app'])

const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'bkashjee.github.io' }
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

async function get(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers })
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`)
  return res.json()
}

try {
  const repos = (await get(`/users/${USER}/repos?type=owner&per_page=100&sort=created`))
    .filter((r) => !r.fork && !r.private && !r.archived && !EXCLUDE.has(r.name))
    .map((r) => ({
      name: r.name,
      description: r.description ?? '',
      url: r.html_url,
      homepage: r.homepage || null,
      language: r.language,
      topics: r.topics ?? [],
      stars: r.stargazers_count,
      created: r.created_at.slice(0, 10),
      pushed: r.pushed_at.slice(0, 10),
    }))
    .sort((a, b) => b.created.localeCompare(a.created))

  const projects = readFileSync(join(root, 'src/content/projects.ts'), 'utf8')
  const numbers = [...projects.matchAll(/\{ number: (\d+), title:/g)].map((m) => Number(m[1]))
  const prs = {}
  for (const n of numbers) {
    const pr = await get(`/repos/NousResearch/hermes-agent/pulls/${n}`)
    prs[n] = {
      opened: pr.created_at.slice(0, 10),
      state: pr.merged_at ? 'merged' : pr.state === 'closed' ? 'closed' : pr.draft ? 'draft' : 'open',
    }
  }

  writeFileSync(out, JSON.stringify({ fetched: new Date().toISOString().slice(0, 10), repos, prs }, null, 2) + '\n')
  console.log(`github.json: ${repos.length} repos, ${Object.keys(prs).length} PRs`)
} catch (err) {
  console.warn(`github.json not refreshed (${err.message}); keeping the committed copy`)
}

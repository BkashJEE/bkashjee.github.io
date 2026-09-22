import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const root = new URL('..', import.meta.url).pathname
const entries = JSON.parse(await readFile(join(root, 'src/content/use-cases.json'), 'utf8'))
const site = 'https://bkashjee.github.io'

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')

if (!Array.isArray(entries) || entries.length === 0) throw new Error('Use cases must be a non-empty array.')
const slugs = new Set()
for (const entry of entries) {
  for (const field of ['slug', 'title', 'description', 'date', 'image']) {
    if (!entry[field]) throw new Error(`Use case is missing ${field}.`)
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug) || slugs.has(entry.slug)) {
    throw new Error(`Invalid or duplicate use-case slug: ${entry.slug}`)
  }
  slugs.add(entry.slug)
}

function html({ title, description, canonical, image, structuredData, ogType = 'article' }) {
  const absoluteImage = image.startsWith('http') ? image : `${site}${image}`
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="color-scheme" content="dark" />
    <meta name="theme-color" content="#0a0a0f" />
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230a0a0f'/%3E%3Ctext x='32' y='45' font-family='system-ui,sans-serif' font-weight='800' font-size='36' fill='%23f5a524' text-anchor='middle'%3EB%3C/text%3E%3C/svg%3E" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="${ogType}" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${absoluteImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@BkashJosi" />
    <title>${escapeHtml(title)}</title>
    <script type="application/ld+json">${JSON.stringify(structuredData).replaceAll('<', '\\u003c')}</script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/use-cases-main.tsx"></script>
  </body>
</html>`
}

const collectionUrl = `${site}/use-cases/`
const collectionHtml = html({
  title: 'Use Cases — Bikash Joshi',
  description: 'Working software, agent workflows, automations, and experiments documented with tools, implementation details, outcomes, and limitations.',
  canonical: collectionUrl,
  image: '/assets/og.jpg',
  ogType: 'website',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Use Cases',
    url: collectionUrl,
    description: 'A directory of working software, agent workflows, automations, and experiments by Bikash Joshi.',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: entries.length,
      itemListElement: entries.map((entry, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${collectionUrl}${entry.slug}/`,
        name: entry.title,
      })),
    },
  },
})

await mkdir(join(root, 'use-cases'), { recursive: true })
await writeFile(join(root, 'use-cases/index.html'), collectionHtml)

for (const entry of entries) {
  const url = `${collectionUrl}${entry.slug}/`
  const page = html({
    title: `${entry.title} — Use Case`,
    description: entry.description,
    canonical: url,
    image: entry.image.src,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: entry.title,
      description: entry.description,
      datePublished: entry.date,
      image: `${site}${entry.image.src}`,
      author: { '@type': 'Person', name: 'Bikash Joshi', url: site },
      url,
      keywords: [...entry.tools, ...entry.keywords].join(', '),
    },
  })
  const directory = join(root, 'use-cases', entry.slug)
  await mkdir(directory, { recursive: true })
  await writeFile(join(directory, 'index.html'), page)
}

const routes = [
  { path: '/', frequency: 'monthly', priority: '1.0' },
  { path: '/resume/', frequency: 'monthly', priority: '0.8' },
  { path: '/archive/', frequency: 'weekly', priority: '0.6' },
  { path: '/use-cases/', frequency: 'weekly', priority: '0.9' },
  ...entries.map((entry) => ({ path: `/use-cases/${entry.slug}/`, frequency: 'monthly', priority: '0.7' })),
]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url>
    <loc>${site}${route.path}</loc>
    <changefreq>${route.frequency}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>\n`
await writeFile(join(root, 'public/sitemap.xml'), sitemap)

console.log(`Generated ${entries.length + 1} use-case pages and sitemap.xml`)

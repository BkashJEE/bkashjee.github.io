import { mostViewedTabs, viewedUseCases, type MostViewedTab } from './mostViewed'

export interface WritingPost {
  label: string
  title: string
  summary: string
  date: string
  href: string
  accent: 'amber' | 'teal' | 'violet'
}

const accentFor: Record<MostViewedTab, WritingPost['accent']> = { hermes: 'amber', 'jev-hermes': 'teal', omarchy: 'violet' }
const labelFor = Object.fromEntries(mostViewedTabs.map((t) => [t.id, t.label])) as Record<MostViewedTab, string>

const month = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' })

/** First sentence only: the cards sit in a row and should read at a glance. */
const lead = (text: string) => text.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? text

// The newest public post from each topic on x.com/BkashJosi, taken from the
// same analytics-backed list as the use-cases page, so this section moves on
// by itself whenever that list is refreshed, and keeps one card per topic.
export const writingPosts: WritingPost[] = mostViewedTabs
  .map((t) => viewedUseCases.filter((p) => p.tab === t.id).sort((a, b) => b.date.localeCompare(a.date))[0])
  .filter(Boolean)
  .sort((a, b) => b.date.localeCompare(a.date))
  .map((p) => ({
    label: labelFor[p.tab],
    title: p.title,
    summary: lead(p.summary),
    date: month(p.date),
    href: p.postUrl,
    accent: accentFor[p.tab],
  }))

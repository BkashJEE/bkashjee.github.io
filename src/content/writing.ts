export interface WritingPost {
  label: string
  title: string
  summary: string
  date: string
  href: string
  accent: 'amber' | 'teal' | 'violet'
}

// Public posts from x.com/BkashJosi, checked 2026-09-20.
export const writingPosts: WritingPost[] = [
  {
    label: 'Agent evaluation',
    title: 'Can a local model produce code that passes the tests?',
    summary: 'Testing an in-browser WebGPU model against the outcome that matters in practice: working, tested code.',
    date: 'Sep 2026',
    href: 'https://x.com/BkashJosi/status/2101577463918985682',
    accent: 'teal',
  },
  {
    label: 'Desktop systems',
    title: 'Shaping an Omarchy desktop around the way I work',
    summary: 'A video tour of custom widgets, embedded apps, and workspace tools built for a daily Linux setup.',
    date: 'Sep 2026',
    href: 'https://x.com/BkashJosi/status/2101418237087101007',
    accent: 'amber',
  },
  {
    label: 'Agent automation',
    title: 'A morning briefing prepared before the day begins',
    summary: 'A scheduled agent demo that brings together calendar, email, and a personal newspaper in one briefing.',
    date: 'Sep 2026',
    href: 'https://x.com/BkashJosi/status/2097555264803377456',
    accent: 'violet',
  },
]

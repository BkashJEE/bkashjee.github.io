// Single source of truth for everything shown on the site.
// Content rule: everything here is real and verifiable — no invented stats,
// clients, testimonials, or employment. "Source private" means exactly that.

export const identity = {
  name: 'Bikash Joshi',
  role: 'Software Engineer',
  roleLine: 'Software Engineer — desktop apps, web, and AI agent systems',
  bio: 'I design and ship local-first tools end to end — from Wayland internals and media pipelines to interfaces with real polish.',
  email: 'bkashjee@gmail.com',
  github: 'https://github.com/BkashJEE',
  x: 'https://x.com/BkashJosi',
  site: 'https://bkashjee.github.io',
}

export interface CaseStudy {
  id: string
  name: string
  tagline: string
  description: string[]
  tech: string[]
  glow: 'amber' | 'teal' | 'violet'
  images: { src: string; width: number; height: number; alt: string }[]
  link?: { href: string; label: string }
  sourceNote?: string
  platforms?: string
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'screenpolish',
    name: 'ScreenPolish',
    tagline: 'A screen recorder that polishes your recordings for you.',
    description: [
      'Record your screen and get a finished video: automatic zoom on click clusters, a smoothly redrawn cursor with click ripples, padded gradient frames, a webcam bubble, and MP4 or GIF export in landscape, square, or vertical. Think Screen Studio — but for Windows and Linux, and fully local. Recordings never leave your machine.',
      'The Linux port is the deep end: Wayland gives apps no global input hook, so ScreenPolish reconstructs the pointer path from Hyprland’s IPC socket and reads clicks from evdev — deliberately never opening keyboard devices. Capture runs through xdg-desktop-portal and PipeWire, and every effect is a pure function of (frame, events, settings), so preview and export share one renderer.',
    ],
    tech: ['Electron', 'React 19', 'TypeScript', 'Tailwind 4', 'WebCodecs', 'FFmpeg', 'Hyprland IPC', 'PipeWire'],
    glow: 'amber',
    images: [
      {
        src: '/assets/work/screenpolish-app.webp',
        width: 1600,
        height: 1254,
        alt: 'ScreenPolish capture workspace on Linux, showing the recording library, input sources, and PipeWire system audio',
      },
      {
        src: '/assets/work/screenpolish-output.webp',
        width: 1600,
        height: 900,
        alt: 'A polished ScreenPolish export: recorded app framed on a gradient background',
      },
    ],
    sourceNote: 'Source private',
    platforms: 'Windows · Linux',
  },
  {
    id: 'bot-forge',
    name: 'Hermes Bot Forge',
    tagline: 'One sentence in, a complete working bot out.',
    description: [
      'A plugin for Nous Research’s Hermes Agent. Describe the bot you want — “make me a bot that writes X posts and threads” — and Bot Forge spawns it whole: a generated name and avatar, a purpose-written SOUL.md, seeded memory, tools and skills, optional cron routines, and a gateway service that starts on login.',
      'Every step is verified as it runs, and if anything fails the entire bot is rolled back — no half-configured agents left behind. Installable with a single command from the Hermes plugin registry.',
    ],
    tech: ['Python', 'Hermes Agent', 'plugin.yaml', 'systemd', 'pytest'],
    glow: 'violet',
    images: [
      {
        src: '/assets/work/botforge-banner.webp',
        width: 1200,
        height: 600,
        alt: 'Hermes Bot Forge: a one-sentence prompt becoming a complete working bot named Inkwell',
      },
    ],
    link: { href: 'https://github.com/BkashJEE/hermes-bot-forge', label: 'View source on GitHub' },
  },
  {
    id: 'mission-control',
    name: 'Hermes X Mission Control',
    tagline: 'A local-first content operating system, run by agents, reviewed by you.',
    description: [
      'A private workspace for running an X account like a newsroom: thirteen destinations covering today’s plan, pipeline, calendar, published work, analytics, and a content graph. Named agent profiles hand work through a research → draft → verify pipeline with receipts at every step — and nothing ships without owner review.',
      'Built local-first with a Supabase backend and a SQLite fallback, row-level security, and guarded research intake: video URLs pass host allowlists and everything fails closed.',
    ],
    tech: ['Next.js', 'TypeScript', 'Supabase', 'RLS', 'SQLite', 'zod'],
    glow: 'teal',
    images: [
      {
        src: '/assets/work/missioncontrol.webp',
        width: 1600,
        height: 1000,
        alt: 'Hermes X Mission Control’s Today view: editorial team, work queues, and the daily content plan',
      },
    ],
    sourceNote: 'Source private',
  },
]

export interface LabItem {
  name: string
  line: string
  tech: string
  image?: { src: string; width: number; height: number; alt: string }
  href?: string
  /** Renders the image as a transparent pet perched on the card. */
  pet?: boolean
}

export const labItems: LabItem[] = [
  {
    name: 'Hermes Island',
    line: 'A Dynamic-Island-style bar for the Omarchy desktop: ask Hermes, watch your open PRs, shelve results — without leaving your workspace.',
    tech: 'QML · Python',
    image: { src: '/assets/lab/hermes-island.webp', width: 800, height: 744, alt: 'Hermes Island panel showing a git overview and open pull requests' },
  },
  {
    name: 'Hermes Studio',
    line: 'Studio bar and workspace plugins for the Omarchy shell — a desktop arranged around agent work.',
    tech: 'QML · Python',
    image: { src: '/assets/lab/hermes-studio.webp', width: 800, height: 544, alt: 'Hermes Studio desktop shell preview' },
  },
  {
    name: 'Window Pets',
    line: 'Tiny companions that live on top of your windows. A QML shell with a Python window tracker. This one lives here now — hover to say hi.',
    tech: 'QML · Python',
    image: { src: '/assets/lab/window-pets.webp', width: 320, height: 360, alt: 'A fox pet sitting on the edge of this card' },
    pet: true,
  },
  {
    name: 'Git Repo Widget',
    line: 'Local repositories at a glance — status, branches, and recent activity as a desktop widget.',
    tech: 'QML · Python',
    image: { src: '/assets/lab/git-repo-widget.webp', width: 525, height: 600, alt: 'Desktop widget listing local git repositories and their status' },
  },
  {
    name: 'GitHub Watch',
    line: 'A desktop panel that keeps an eye on GitHub activity and checks.',
    tech: 'QML',
    image: { src: '/assets/lab/github-watch.webp', width: 348, height: 425, alt: 'GitHub Watch desktop panel' },
  },
  {
    name: 'Hermes Cursor',
    line: 'A hand-built cursor theme — drawn bitmaps, Python build scripts, installable theme.',
    tech: 'Bitmaps · Python',
    image: { src: '/assets/lab/hermes-cursor.webp', width: 800, height: 419, alt: 'Hermes cursor theme shapes preview' },
  },
]

export interface Plugin {
  name: string
  repo: string
  stars: number
  line: string
  lang: string
  install?: string
}

// Live public repos under github.com/BkashJEE — star counts as of 2026-09-17.
export const plugins: Plugin[] = [
  {
    name: 'Hermes Agent Dock',
    repo: 'https://github.com/BkashJEE/hermes-agent-dock',
    stars: 42,
    line: 'Native Hermes Desktop dock: direct profile chat, concurrent jobs, cancellation, and explicit Kanban assignment.',
    lang: 'Python',
  },
  {
    name: 'Repo Shelf',
    repo: 'https://github.com/BkashJEE/repo-shelf',
    stars: 17,
    line: 'Your git repositories as books on a 3D bookshelf. Browse, search, move, rename, open.',
    lang: 'TypeScript',
  },
  {
    name: 'Hermes Bot Forge',
    repo: 'https://github.com/BkashJEE/hermes-bot-forge',
    stars: 11,
    line: 'One sentence in, a complete working bot out — verified end to end, rolled back on failure.',
    lang: 'Python',
    install: 'hermes plugins install BkashJEE/hermes-bot-forge',
  },
  {
    name: 'Codex Usage Meter',
    repo: 'https://github.com/BkashJEE/codex-usage-meter',
    stars: 4,
    line: 'Privacy-first Codex usage meter for Hermes Desktop with one-time install and verified updates.',
    lang: 'Python',
  },
  {
    name: 'Hermes Skills Hub',
    repo: 'https://github.com/BkashJEE/hermes-skills',
    stars: 1,
    line: 'A public tap of reusable skills for Hermes Agent.',
    lang: 'Skills',
    install: 'hermes skills tap add BkashJEE/hermes-skills',
  },
  {
    name: 'Hermex',
    repo: 'https://github.com/BkashJEE/hermex-app',
    stars: 1,
    line: 'Native iPhone app for your Hermes agent.',
    lang: 'Swift',
  },
]

// Real, open PRs to NousResearch/hermes-agent (verified 2026-09-17).
export const upstreamPRs: { number: number; title: string }[] = [
  { number: 113268, title: 'perf(desktop): stop the empty-pane HERMES decode from looping forever at idle' },
  { number: 113249, title: "fix(tui_gateway): don't print peer-less global broadcasts to stdout in WS backends" },
  { number: 114003, title: 'feat(desktop): compact skill and plugin flashcards with raised icons' },
  { number: 113209, title: 'fix(profiles): reject a directory or non-archive file on import instead of crashing' },
  { number: 101951, title: 'feat(desktop): summon the HUD globally and dismiss with Escape' },
]

export const upstreamPRsUrl = 'https://github.com/NousResearch/hermes-agent/pulls?q=is%3Apr+author%3ABkashJEE'

export const skillGroups: { title: string; items: string[] }[] = [
  { title: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'Swift', 'SQL', 'QML / Qt', 'Bash'] },
  { title: 'Web', items: ['React 19', 'Next.js', 'Tailwind CSS', 'Vite', 'Motion', 'Supabase'] },
  { title: 'Desktop & systems', items: ['Electron', 'WebCodecs', 'FFmpeg', 'Wayland / Hyprland', 'PipeWire', 'evdev', 'systemd', 'Arch Linux'] },
  { title: 'AI & agents', items: ['Hermes Agent plugins', 'Multi-agent orchestration', 'Claude Code', 'Agent-friendly CLI design', 'MCP tooling'] },
  { title: 'Practice', items: ['Vitest', 'pytest', 'Playwright', 'CI / GitHub Actions', 'PR-based workflow', 'Design docs'] },
]

export const aboutParagraphs: string[] = [
  'I’m an independent software engineer. I run Arch Linux with Hyprland as my daily driver, and I build the tools I wish existed: a screen recorder that polishes itself, agents that set up other agents, widgets that make the desktop feel alive.',
  'I care about local-first software and privacy by default — ScreenPolish deliberately never reads your keyboard — and about interfaces with real polish. I’m an active contributor to the Hermes Agent ecosystem, with ten-plus open pull requests to NousResearch/hermes-agent, and I share what I learn about building with AI agents.',
]

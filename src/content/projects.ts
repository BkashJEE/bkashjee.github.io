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
  images: { src: string; width: number; height: number; alt: string; chrome?: boolean }[]
  link?: { href: string; label: string }
  sourceNote?: string
  platforms?: string
  /** A verified, dated fact worth surfacing (e.g. a test-suite count). */
  stat?: string
  /** "How it works" strip: real pipeline steps plus an optional caveat. */
  flow?: { steps: string[]; note?: string }
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'screenpolish',
    name: 'ScreenPolish',
    tagline: 'A screen recorder that polishes your recordings for you.',
    description: [
      'Screen recordings of software usually need an editor before anyone wants to watch them: zooming into the right spot, smoothing a jittery cursor, framing the shot. ScreenPolish does that for you. You record as usual and get a finished video with automatic zoom on clusters of clicks, a smoothly redrawn cursor with click ripples, a padded gradient frame, an optional webcam bubble, and MP4 or GIF export in landscape, square, or vertical. It all happens on your own machine; recordings never leave it.',
      'I designed and built it end to end. The hardest part was the Linux port: Wayland gives apps no global input hook, so I rebuilt the input record from two sources — the pointer path from Hyprland’s IPC socket and clicks from evdev — and deliberately never open keyboard devices. Capture runs through xdg-desktop-portal and PipeWire. I made every effect a pure function of the frame, the recorded events, and the settings, so the preview you edit and the file you export come from one renderer.',
    ],
    tech: ['Electron', 'React 19', 'TypeScript', 'Tailwind 4', 'WebCodecs', 'FFmpeg', 'Hyprland IPC', 'PipeWire'],
    glow: 'amber',
    stat: '575 tests passing · verified Sep 2026',
    flow: {
      steps: ['Hyprland IPC · evdev · PipeWire', 'screen.mp4 + events.json', 'pure(frame, events, settings)', 'preview = export'],
      note: 'One renderer for both paths — what you preview is exactly what exports.',
    },
    images: [
      {
        src: '/assets/work/screenpolish-app.webp',
        width: 1600,
        height: 1254,
        alt: 'ScreenPolish capture workspace on Linux, showing the recording library, input sources, and PipeWire system audio',
        chrome: true,
      },
      {
        src: '/assets/work/screenpolish-output.webp',
        width: 1600,
        height: 900,
        alt: 'A polished ScreenPolish export: recorded app framed on a gradient background',
      },
    ],
    sourceNote: 'Source private',
    platforms: 'Windows · Linux · macOS (early)',
  },
  {
    id: 'bot-forge',
    name: 'Hermes Bot Forge',
    tagline: 'One sentence in, a complete working bot out.',
    description: [
      'Setting up a new AI agent bot by hand means writing its personality file, seeding its memory, choosing its tools, scheduling its routines, and running a background service for it. Bot Forge does all of that from one sentence. Say “make me a bot that writes X posts and threads” and you get a working bot: a generated name and avatar, a purpose-written SOUL.md, seeded memory, tools and skills, optional scheduled routines, and a gateway service that starts on login (on Linux and macOS).',
      'I built it as an open-source plugin for Nous Research’s Hermes Agent, and I designed it around failure: every step is checked as it runs, and if one fails I roll the whole bot back, so nobody is left with a half-configured agent. It installs with a single command.',
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
    flow: {
      steps: ['one sentence', 'name · face · SOUL.md · memory', 'tools · skills · routines', 'gateway service', 'working bot'],
      note: 'Every step verified as it runs; any failure rolls the whole bot back.',
    },
  },
  {
    id: 'agent-dock',
    name: 'Hermes Agent Dock',
    tagline: 'Reach any specialist agent without leaving your workspace.',
    description: [
      'When you run several AI agents in Hermes Desktop, the main one is often busy and your specialist agents are hard to reach. Agent Dock gives you a direct line to any specialist you’ve already set up, even while the main orchestrator is working. It floats as a card or docks into the workspace, and remembers which you chose.',
      'I designed and built it, and it’s my most-starred public tool. I kept chat and task tracking deliberately separate: a message becomes a tracked Kanban task only when you explicitly assign it. It ships as one local UI and backend pair that finds the profiles Hermes already knows, with an installer that uses only the Python standard library, a security policy, and documented release testing.',
    ],
    tech: ['Python', 'Hermes Desktop plugin', 'stdlib installer', 'Kanban lifecycle'],
    glow: 'violet',
    images: [
      {
        src: '/assets/work/agentdock-floating.webp',
        width: 1000,
        height: 760,
        alt: 'Agent Dock’s floating specialist chat card',
      },
      {
        src: '/assets/work/agentdock-docked.webp',
        width: 1600,
        height: 454,
        alt: 'Agent Dock docked into the bottom of the Hermes Desktop workspace',
      },
    ],
    link: { href: 'https://github.com/BkashJEE/hermes-agent-dock', label: 'View source on GitHub' },
    flow: {
      steps: ['you', 'dock — floating or docked', 'any specialist profile'],
      note: 'Chat stays chat. A message becomes a Kanban card only when you explicitly assign it.',
    },
  },
  {
    id: 'mission-control',
    name: 'Hermes X Mission Control',
    tagline: 'A local-first content operating system, run by agents, reviewed by you.',
    description: [
      'Running an X account well means researching, drafting, checking, and scheduling posts every day. Mission Control is my private workspace for doing that like a newsroom: thirteen screens cover today’s plan, the pipeline, the calendar, published posts, analytics, and a content graph. AI agents do the research, drafting, and checking, handing work along with a record of each step — and nothing is published until I review it.',
      'I built it end to end: a Supabase backend with row-level security, a local SQLite fallback so it runs with no setup, and guarded research intake that only accepts video links from an allowlist of hosts.',
    ],
    tech: ['Next.js', 'TypeScript', 'Supabase', 'RLS', 'SQLite', 'zod'],
    glow: 'teal',
    stat: '581 tests passing · verified Sep 2026',
    flow: {
      steps: ['research', 'draft', 'verify', 'owner review', 'publish'],
      note: 'Named agent profiles hand work forward with receipts at every step.',
    },
    images: [
      {
        src: '/assets/work/missioncontrol.webp',
        width: 1600,
        height: 1000,
        alt: 'Hermes X Mission Control’s Today view: editorial team, work queues, and the daily content plan',
        chrome: true,
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

// Live public repos under github.com/BkashJEE — fallback star counts as of 2026-09-18.
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
    stars: 24,
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
  'I care about local-first software and privacy by default — ScreenPolish deliberately never reads your keyboard — and about interfaces with real polish. I’m an active contributor to the Hermes Agent ecosystem, with fifteen open pull requests to NousResearch/hermes-agent, and I share what I learn about building with AI agents.',
]

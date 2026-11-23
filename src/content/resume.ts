// Resume data — single source for the /resume/ page and the generated PDF.
// Same content rule as the site: real, verifiable work only.

import github from './github.json'
import siteConfig from './site.json'

/** The site's address without https://, as printed on the resume. */
const siteHost = new URL(siteConfig.url).host

const upstream = github.upstream
const botForge = github.repos.find((r) => r.name === 'hermes-bot-forge')
/** GitHub stars at build time, never typed by hand. */
const stars = (name: string) => github.repos.find((r) => r.name === name)?.stars ?? 0

export const resume = {
  name: 'Bikash Joshi',
  title: 'AI Enthusiast',
  subtitle: 'Desktop apps · Web · AI agent systems',
  contact: {
    email: 'bkashjee@gmail.com',
    github: 'github.com/BkashJEE',
    x: 'x.com/BkashJosi',
    site: siteHost,
  },
  summary:
    'AI enthusiast and independent builder shipping desktop apps, AI agent plugins, and TypeScript websites; publishes open-source tools and contributes upstream to NousResearch’s Hermes Agent, whose official plugin catalog includes Bot Forge.',
  projects: [
    {
      name: 'ScreenPolish',
      role: 'Creator · open source (MIT)',
      link: 'github.com/BkashJEE/ScreenPolish',
      dates: 'Sep 2026 - present',
      note: 'open source (MIT)',
      bullets: [
        'Built a local screen recorder used for personal demos and videos; 41 recordings in the library, with auto-zoom and MP4/GIF export.',
        'Shipped 3 formats (Windows installer, AppImage, pacman); Wayland capture uses PipeWire/portals, Hyprland IPC, and evdev clicks.',
        'Shared one renderer for preview and export; 732 tests pass. Built a JSON-output CLI for agent workflows.',
      ],
      tech: 'Electron · React 19 · TypeScript · WebCodecs · FFmpeg · Vitest',
    },
    {
      name: 'Hermes Bot Forge',
      role: 'Creator · open source (MIT)',
      dates: 'Sep 2026 - present',
      link: 'github.com/BkashJEE/hermes-bot-forge',
      bullets: [
        `Published a Hermes Agent plugin (${botForge?.stars} GitHub stars, ${botForge?.forks} forks) that builds bots with identity, memory, tools, routines, and a gateway, rolling back on any failed step.`,
        'Accepted into NousResearch’s official Hermes plugin catalog (hermes-agent#114057) after a maintainer security review. 451 tests passing · verified 18 Oct 2026.',
      ],
      tech: 'Python · pytest · systemd',
    },
    {
      name: 'Nous Calendar',
      role: 'Creator · open source (MIT)',
      dates: 'Oct 2026 - present',
      link: 'github.com/BkashJEE/hermes-nous-calendar',
      bullets: [
        'Built a Hermes Desktop plugin that shows what Nous shipped for Hermes Agent, one card per day.',
        'Refreshes from GitHub every 6 hours; opt-in alerts reach every Hermes channel within 15 minutes.',
      ],
      tech: 'Python · GitHub API · hermes cron',
    },
    {
      name: 'Personal Portfolio',
      role: 'Creator · website',
      dates: 'Sep 2026 - present',
      link: siteHost,
      bullets: [
        'Published a multi-page portfolio with case studies, a GitHub-fed list of all work, and a resume/PDF sharing one content source; GitHub Actions builds and deploys each merge to main.',
      ],
      tech: 'React 19 · TypeScript · Vite · Tailwind CSS · Playwright · GitHub Actions',
    },
  ],
  published: [
    { name: 'Hermes Agent Dock', dates: 'Aug 2026 - present', stars: stars('hermes-agent-dock'), note: 'Desktop dock for direct profile chat and Kanban assignment (Python)' },
    { name: 'Hermes Agent Archive', stars: stars('hermes-agent-archive'), note: 'source-attributed archive of Hermes workflows, skills and community projects (JavaScript)' },
    { name: 'Hermes Skills Library', stars: stars('hermes-skills-library'), note: 'community Skills & Plugins library for Hermes Desktop, with CI (JavaScript)' },
    { name: 'Repo Shelf', stars: stars('repo-shelf'), note: 'git repositories as books on a 3D bookshelf (TypeScript)' },
  ],
  /** One line closing the published list: what shipped most recently. */
  recent: 'Oct 2026 — eight more tools on GitHub, including Hermes Agent Inbox, Footprint, Key Doctor, Vitals and Night Shift.',
  openSource:
    `${upstream.total} pull requests to NousResearch/hermes-agent: ${upstream.merged} merged (Bot Forge’s catalog entry, #114057, and its version bumps), ${upstream.open} open, including AI-isolated credential entry (#97482). Started Hermes Mobile, an open community project (early preview).`,
  writing:
    'Writes about building with AI agents on X as @BkashJosi.',
  /**
   * Entries from content/mostViewed.ts to show on the resume, by id — curated
   * for reach and for having an outcome, not purely by read count. The web
   * page renders them as cards; print falls back to the prose above plus the
   * headline figures, because a scrolling rail cannot exist on paper.
   */
  writingPicks: [
    'hermes-morning-briefing',
    'hermes-archive-launch',
    'jev-connect-skill',
    'hermes-bot-forge-catalog',
    'hermes-agent-dock-launch',
  ],
  skills: [
    { label: 'Languages', value: 'TypeScript, JavaScript, Python, Swift, SQL, QML/Qt, Bash' },
    { label: 'Web', value: 'React 19, Next.js, Tailwind CSS, Vite, Supabase' },
    { label: 'Desktop & systems', value: 'Electron, WebCodecs, FFmpeg, Wayland/Hyprland, PipeWire, evdev, systemd, Arch Linux' },
    { label: 'AI & agents', value: 'Hermes Agent plugins, multi-agent orchestration, Claude Code, agent-friendly CLI design' },
    { label: 'Practice', value: 'Vitest, pytest, Playwright, GitHub Actions, PR-based workflow' },
  ],
}

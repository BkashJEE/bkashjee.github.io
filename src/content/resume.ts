// Resume data — single source for the /resume/ page and the generated PDF.
// Same content rule as the site: real, verifiable work only.

export const resume = {
  name: 'Bikash Joshi',
  title: 'Software Engineer',
  subtitle: 'Desktop apps · Web · AI agent systems',
  contact: {
    email: 'bkashjee@gmail.com',
    github: 'github.com/BkashJEE',
    x: 'x.com/BkashJosi',
    site: 'bkashjee.github.io',
  },
  summary:
    'Independent software engineer shipping desktop apps, AI agent plugins, and TypeScript websites. Publish open-source tools, use my own apps for recording and content planning, and contribute upstream pull requests.',
  projects: [
    {
      name: 'ScreenPolish',
      role: 'Creator · desktop app',
      dates: 'Sep 2026 - present',
      note: 'source private',
      bullets: [
        'Built a local screen recorder for my demos and videos; 41 recordings in my library, with auto-zoom and MP4/GIF export.',
        'Shipped 3 formats (Windows installer, AppImage, pacman); Wayland capture uses PipeWire/portals, Hyprland IPC, and evdev clicks.',
        'Shared one renderer for preview and export; 575 tests pass. Built a JSON-output CLI for agent workflows.',
      ],
      tech: 'Electron · React 19 · TypeScript · WebCodecs · FFmpeg · Vitest',
    },
    {
      name: 'Hermes Bot Forge',
      role: 'Creator · open source (MIT)',
      dates: 'Sep 2026 - present',
      link: 'github.com/BkashJEE/hermes-bot-forge',
      bullets: [
        'Published a Hermes Agent plugin with 25 GitHub stars: creates bots with identity, memory, tools, routines, and a gateway.',
        'Verify every provisioning step and roll back the bot if a step fails; install directly from GitHub with 1 command.',
      ],
      tech: 'Python · pytest · systemd',
    },
    {
      name: 'Hermes X Mission Control',
      role: 'Creator · full-stack web app',
      dates: 'Sep 2026 - present',
      note: 'source private',
      bullets: [
        'Use my content planner for 1 X account (@BkashJosi), with a daily 8am audit and owner review; I am its sole user.',
        'Implemented Supabase row-level security, SQLite fallback, and video-host allowlists; 581 automated tests pass.',
      ],
      tech: 'Next.js · TypeScript · Supabase · SQLite · zod · Vitest',
    },
    {
      name: 'Personal Portfolio',
      role: 'Creator · website',
      dates: 'Sep 2026 - present',
      link: 'bkashjee.github.io',
      bullets: [
        'Published a 3-page portfolio with case studies, a GitHub-fed archive, and a resume/PDF sharing one content source; GitHub Actions builds and deploys each merge to main.',
      ],
      tech: 'React 19 · TypeScript · Vite · Tailwind CSS · Playwright · GitHub Actions',
    },
  ],
  published: [
    { name: 'Hermes Agent Dock', dates: 'Aug 2026 - present', stars: 42, note: 'native Hermes Desktop dock: profile chat, concurrent jobs, Kanban assignment (Python)' },
    { name: 'Repo Shelf', stars: 17, note: 'git repositories as books on a 3D bookshelf (TypeScript)' },
    { name: 'Codex Usage Meter', stars: 4, note: 'privacy-first usage meter with verified updates (Python)' },
  ],
  openSource:
    '14 open pull requests to NousResearch/hermes-agent; none merged yet. Proposed performance and reliability fixes for idle decode looping (#113268) and peer-less broadcasts to stdout (#113249), plus a global desktop HUD (#101951).',
  writing:
    'Post about building with AI agents on X as @BkashJosi (x.com/BkashJosi).',
  skills: [
    { label: 'Languages', value: 'TypeScript, JavaScript, Python, Swift, SQL, QML/Qt, Bash' },
    { label: 'Web', value: 'React 19, Next.js, Tailwind CSS, Vite, Supabase' },
    { label: 'Desktop & systems', value: 'Electron, WebCodecs, FFmpeg, Wayland/Hyprland, PipeWire, evdev, systemd, Arch Linux' },
    { label: 'AI & agents', value: 'Hermes Agent plugins, multi-agent orchestration, Claude Code, agent-friendly CLI design' },
    { label: 'Practice', value: 'Vitest, pytest, Playwright, GitHub Actions, PR-based workflow' },
  ],
}

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
    'Independent software engineer shipping desktop apps, AI agent plugins, and TypeScript websites; publishes open-source tools and contributes upstream to NousResearch’s Hermes Agent, whose official plugin catalog includes Bot Forge.',
  projects: [
    {
      name: 'ScreenPolish',
      role: 'Creator · desktop app',
      dates: 'Sep 2026 - present',
      note: 'source private',
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
        'Published a Hermes Agent plugin (29 GitHub stars, 3 releases in 3 days) that builds bots with identity, memory, tools, routines, and a gateway, rolling back on any failed step.',
        'Accepted into NousResearch’s official Hermes plugin catalog (hermes-agent#114057) after a maintainer security review; merged the maintainer’s 3 hardening fixes and shipped v0.4.1 with 44 tests passing.',
      ],
      tech: 'Python · pytest · systemd',
    },
    {
      name: 'Hermes X Mission Control',
      role: 'Creator · full-stack web app',
      dates: 'Sep 2026 - present',
      note: 'source private',
      bullets: [
        'Built 13 screens (Today, pipeline, calendar, analytics) used daily for the @BkashJosi X account, with an 8am audit and owner review.',
        'Implemented Supabase row-level security, SQLite fallback, and video-host allowlists; 592 automated tests.',
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
    { name: 'Hermes Agent Dock', dates: 'Aug 2026 - present', stars: 42, note: 'Hermes Desktop dock for direct profile chat and Kanban assignment; 3 forks (Python)' },
    { name: 'Hermes Skills Library', stars: 3, note: 'community Skills & Plugins library for Hermes Desktop, with CI (JavaScript)' },
    { name: 'Repo Shelf', stars: 17, note: 'git repositories as books on a 3D bookshelf (TypeScript)' },
  ],
  openSource:
    '1 merged and 13 open pull requests to NousResearch/hermes-agent: #114057 added Bot Forge to the official plugin catalog; open work includes an idle-CPU performance fix (#113268). Started Hermes Mobile, an open community project (early preview).',
  writing:
    'Writes about building with AI agents on X as @BkashJosi (x.com/BkashJosi).',
  skills: [
    { label: 'Languages', value: 'TypeScript, JavaScript, Python, Swift, SQL, QML/Qt, Bash' },
    { label: 'Web', value: 'React 19, Next.js, Tailwind CSS, Vite, Supabase' },
    { label: 'Desktop & systems', value: 'Electron, WebCodecs, FFmpeg, Wayland/Hyprland, PipeWire, evdev, systemd, Arch Linux' },
    { label: 'AI & agents', value: 'Hermes Agent plugins, multi-agent orchestration, Claude Code, agent-friendly CLI design' },
    { label: 'Practice', value: 'Vitest, pytest, Playwright, GitHub Actions, PR-based workflow' },
  ],
}

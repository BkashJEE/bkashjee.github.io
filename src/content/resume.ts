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
    'Independent software engineer building desktop apps, AI agent plugins, and full-stack TypeScript tools. Use my own screen recorder for demos and my content planner for X; publish open-source tools and contribute upstream pull requests in the Hermes Agent ecosystem.',
  projects: [
    {
      name: 'ScreenPolish',
      role: 'Creator · desktop app',
      dates: 'Sep 2026 - present',
      note: 'source private',
      bullets: [
        'Use this local screen recorder for my own demos and videos; my library holds 41 recordings. Built auto-zoom, cursor effects, webcam overlay, and MP4/GIF export with recordings kept on-device.',
        'Shipped 3 build formats: Windows installer, AppImage, and pacman. Enabled Wayland recording through PipeWire and portal capture, with Hyprland pointer tracking and evdev clicks that never read keyboard input.',
        'Share a pure-function renderer between preview and export so both use the same effects; the project has 575 tests passing. Added a JSON-output CLI for agent-driven workflows.',
      ],
      tech: 'Electron · React 19 · TypeScript · WebCodecs · FFmpeg · Vitest',
    },
    {
      name: 'Hermes Bot Forge',
      role: 'Creator · open source (MIT)',
      dates: 'Sep 2026 - present',
      link: 'github.com/BkashJEE/hermes-bot-forge',
      bullets: [
        'Published a Hermes Agent plugin with 24 GitHub stars that turns one sentence into a configured bot: identity, memory, tools, scheduled routines, and a gateway service.',
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
        'Run content planning and review for 1 X account, my own @BkashJosi, including a daily 8am audit. Agent profiles move research through drafting and verification with owner review; I am the sole user.',
        'Built a backend with Supabase row-level security, SQLite fallback, and video-host allowlists; the project has 581 automated tests passing.',
      ],
      tech: 'Next.js · TypeScript · Supabase · SQLite · zod · Vitest',
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

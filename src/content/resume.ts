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
    'Independent software engineer shipping local-first products end to end: an Electron screen recorder with deep Wayland/Linux systems work, agent-orchestration plugins in Python, and full-stack web apps in TypeScript. Published open-source tools and an active stream of upstream pull requests in the Hermes Agent ecosystem.',
  projects: [
    {
      name: 'ScreenPolish',
      role: 'Creator · Windows & Linux desktop app',
      note: 'source private',
      bullets: [
        'Built a cross-platform screen recorder that automatically polishes recordings: auto-zoom on click clusters, a redrawn smooth cursor with click ripples, gradient frames, webcam bubble, and MP4/GIF export — fully local, recordings never leave the machine.',
        'Engineered the Linux/Wayland port without a global input hook: pointer path reconstructed from Hyprland’s IPC socket, clicks from evdev (keyboard deliberately never read), capture via xdg-desktop-portal and PipeWire.',
        'Designed every effect as a pure function of (frame, events, settings) so preview and export share one renderer; packaged with electron-builder for NSIS, AppImage, and pacman, with a JSON-output CLI made for AI agents.',
      ],
      tech: 'Electron · React 19 · TypeScript · Tailwind 4 · WebCodecs · FFmpeg',
    },
    {
      name: 'Hermes Bot Forge',
      role: 'Creator · open source (MIT)',
      link: 'github.com/BkashJEE/hermes-bot-forge',
      bullets: [
        'Published a plugin for Nous Research’s Hermes Agent that turns one sentence into a complete working bot: generated identity, purpose-written SOUL.md, seeded memory, tools, cron routines, and a login gateway service.',
        'Every provisioning step is verified with full rollback on failure; installable in one command from the Hermes plugin registry.',
      ],
      tech: 'Python · pytest · systemd',
    },
    {
      name: 'Hermes X Mission Control',
      role: 'Creator · full-stack web app',
      note: 'source private',
      bullets: [
        'Built a local-first content operating system for X with thirteen destinations (pipeline, calendar, analytics, content graph) where named agent profiles hand work through a research → draft → verify pipeline with receipts, gated by owner review.',
        'Implemented a Supabase backend with row-level security and SQLite fallback, plus fail-closed research intake with host allowlists.',
      ],
      tech: 'Next.js · TypeScript · Supabase · SQLite · zod',
    },
  ],
  published: [
    { name: 'Hermes Agent Dock', stars: 42, note: 'native Hermes Desktop dock — profile chat, concurrent jobs, Kanban assignment (Python)' },
    { name: 'Repo Shelf', stars: 17, note: 'git repositories as books on a 3D bookshelf (TypeScript)' },
    { name: 'Codex Usage Meter', stars: 4, note: 'privacy-first usage meter with verified updates (Python)' },
  ],
  openSource:
    'Ten-plus open pull requests to NousResearch/hermes-agent — desktop features, performance, and reliability, e.g. #113268 perf(desktop): stop the empty-pane decode looping at idle; #113249 fix(tui_gateway): keep peer-less broadcasts out of stdout; #101951 feat(desktop): global HUD summon. Plus six desktop experiments for the Omarchy/Hyprland shell in QML and Python.',
  skills: [
    { label: 'Languages', value: 'TypeScript, JavaScript, Python, Swift, SQL, QML/Qt, Bash' },
    { label: 'Web', value: 'React 19, Next.js, Tailwind CSS, Vite, Supabase' },
    { label: 'Desktop & systems', value: 'Electron, WebCodecs, FFmpeg, Wayland/Hyprland, PipeWire, evdev, systemd, Arch Linux' },
    { label: 'AI & agents', value: 'Hermes Agent plugins, multi-agent orchestration, Claude Code, agent-friendly CLI design' },
    { label: 'Practice', value: 'Vitest, pytest, Playwright, GitHub Actions, PR-based workflow' },
  ],
}

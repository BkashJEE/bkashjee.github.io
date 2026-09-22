// Most-viewed use cases, ranked by real X impressions.
// Numbers come from my own X analytics exports (account_analytics_content*.csv,
// latest export 22 Sep 2026); each card links to the original post so anyone
// can check it. Titles and summaries describe what the post actually shows.

export const mostViewedTabs = [
  { id: 'hermes', label: 'Hermes', blurb: 'What I build on Nous Research’s Hermes Agent.' },
  { id: 'omarchy', label: 'Omarchy', blurb: 'Turning the Omarchy/Hyprland desktop into an agent workspace.' },
  { id: 'jev-hermes', label: 'Jev + Hermes', blurb: 'Giving Hermes a cheap, typed decision layer with TypeSafe’s Jev.' },
] as const

export type MostViewedTab = (typeof mostViewedTabs)[number]['id']

export interface ViewedUseCase {
  id: string
  tab: MostViewedTab
  title: string
  summary: string
  postUrl: string
  /** The post's own opening words, shown as the hover preview. */
  postText: string
  date: string
  impressions: number
  likes: number
  bookmarks: number
  reposts: number
  /** Existing project imagery, only where the post is about that project. */
  image?: { src: string; width: number; height: number; alt: string }
  /** Deep link into this site when the post is about one of my projects. */
  projectHref?: string
  /** Public repo, when the post's subject is open source. */
  repoUrl?: string
}

export const viewedUseCases: ViewedUseCase[] = [
  // ---- Hermes ----
  {
    id: 'hermes-mobile-codex-claude',
    tab: 'hermes',
    title: 'One mobile app that brings Codex and Claude together',
    summary:
      'Asked what a Hermes mobile app could be if it carried Codex and Claude side by side. The response pushed me to start Hermes Mobile as an open community project; it is an early phone web preview today.',
    postUrl: 'https://x.com/BkashJosi/status/2098522662268195175',
    postText: 'What if your Hermes Mobile App can bring Codex and Claude Agent together.🚀',
    date: '2026-09-11',
    impressions: 33104,
    likes: 138,
    bookmarks: 147,
    reposts: 6,
    repoUrl: 'https://github.com/BkashJEE/hermes-mobile',
  },
  {
    id: 'hermes-start-somewhere',
    tab: 'hermes',
    title: '“Installed Hermes Agent. Now what?”',
    summary:
      'The most common question from new Hermes users. I pointed at a page that collects what people are actually building, so a newcomer can copy a starting point instead of staring at an empty agent.',
    postUrl: 'https://x.com/BkashJosi/status/2100136800044163148',
    postText: 'Installed Hermes Agent. Now what?🚀 Not sure where to start—or what to build with it? There’s a page showcasing what people are building with Hermes Agent. Explore their projects, see what sp…',
    date: '2026-09-16',
    impressions: 15528,
    likes: 100,
    bookmarks: 147,
    reposts: 11,
  },
  {
    id: 'hermes-plugin-chooser',
    tab: 'hermes',
    title: 'Too many plugins: choosing by category instead of guessing',
    summary:
      'Hermes has more plugins than anyone can evaluate. Browsing them by category, with a plain description of each, turns plugin choice into a decision rather than a search.',
    postUrl: 'https://x.com/BkashJosi/status/2101607087541469491',
    postText: 'Hermes Agent has too many plugins. No idea which ones your agent needs?🥸 👉Hermes Agent makes choosing easier: explore plugins by category, understand what they do, and find the right fit for…',
    date: '2026-09-20',
    impressions: 14388,
    likes: 117,
    bookmarks: 118,
    reposts: 8,
    repoUrl: 'https://github.com/BkashJEE/hermes-skills-library',
  },
  {
    id: 'hermes-bot-that-builds-bots',
    tab: 'hermes',
    title: 'A bot that builds bots, open-sourced',
    summary:
      'One sentence to my orchestrator agent and it hires a new teammate: name and face, soul, memory, skills, tools, its own chat, routines and gateway — tested as it goes, rolled back if a step fails. This became Bot Forge, now in the official Hermes plugin catalog.',
    postUrl: 'https://x.com/BkashJosi/status/2100528442752323623',
    postText: 'Grok has a bot that builds bots. I built the same thing for @NousResearch Hermes Agent, and I\'m open-sourcing it. One sentence to my CEO agent → it hires a new teammate: • name + face • soul…',
    date: '2026-09-17',
    impressions: 10209,
    likes: 128,
    bookmarks: 197,
    reposts: 11,
    image: {
      src: '/assets/work/botforge-banner.webp',
      width: 1200,
      height: 600,
      alt: 'Hermes Bot Forge: one sentence becoming a complete working bot named Inkwell',
    },
    projectHref: '/#bot-forge',
    repoUrl: 'https://github.com/BkashJEE/hermes-bot-forge',
  },
  {
    id: 'hermes-library-of-books',
    tab: 'hermes',
    title: 'A library of Hermes guides, skills and plugins',
    summary:
      'Stuck? Pick a book. A shelf that holds the Hermes guide, skills you can install straight from the page, and plugins you can activate with a click. It grew into the Hermes Skills Library.',
    postUrl: 'https://x.com/BkashJosi/status/2099926011303625207',
    postText: 'What if your Hermes Agent has a complete Library of all the things related to Hermes Agent ? 🚀🪽 You got stuck need help. Pick a book. 📕. It has : 1. Complete Hermes Agent Guide 2. Skills Boo…',
    date: '2026-09-15',
    impressions: 9347,
    likes: 105,
    bookmarks: 154,
    reposts: 9,
    repoUrl: 'https://github.com/BkashJEE/hermes-skills-library',
  },

  // ---- Omarchy ----
  {
    id: 'omarchy-own-widgets',
    tab: 'omarchy',
    title: 'Shaping the whole desktop around how I work',
    summary:
      'Every “I wish my computer could do this” becomes another small project: my own widgets, apps brought inside them, tabs across the bar, the desktop arranged around my work. This is the thread that keeps pulling me back to Omarchy.',
    postUrl: 'https://x.com/BkashJosi/status/2101418237087101007',
    postText: 'Every time I think “I wish my computer could do this,” it turns into another little project 😂 This is why I love Omarchy.@dhh I can build my own widgets, bring apps into them, add tabs, and…',
    date: '2026-09-19',
    impressions: 37645,
    likes: 108,
    bookmarks: 163,
    reposts: 9,
    image: {
      src: '/assets/lab/hermes-studio.webp',
      width: 800,
      height: 544,
      alt: 'A custom Omarchy shell with studio tabs and panels',
    },
    projectHref: '/#lab',
  },
  {
    id: 'omarchy-assistant-in-desktop',
    tab: 'omarchy',
    title: 'A 24/7 agent living inside the desktop, not in a chat window',
    summary:
      'Instead of another AI chat box, I turned the desktop itself into the Hermes interface: a Dynamic-Island-style bar that answers, watches my pull requests and shelves results without taking over the screen.',
    postUrl: 'https://x.com/BkashJosi/status/2099557531396043079',
    postText: 'My Hermes Agent now has a 24/7 assistant living inside Omarchy. 🪽 And this is where using Hermes gets really fun. 🤏I didn’t want another boring AI chat window, so I started turning the deskt…',
    date: '2026-09-14',
    impressions: 4052,
    likes: 57,
    bookmarks: 46,
    reposts: 5,
    image: {
      src: '/assets/lab/hermes-island.webp',
      width: 800,
      height: 744,
      alt: 'Hermes Island panel showing a git overview and open pull requests',
    },
    projectHref: '/#lab',
  },
  {
    id: 'omarchy-password-recovery',
    tab: 'omarchy',
    title: 'Locked out of your desktop? Ask the agent',
    summary:
      'A forgotten Omarchy login used to mean a recovery session and a lot of searching. Switch to a TTY, start Hermes, and talk your way through the fix — an operating system you can debug by conversation.',
    postUrl: 'https://x.com/BkashJosi/status/2100265298670792787',
    postText: 'You forgot your Omarchy login password ⁉️Now what ? No worries - Hermes Can fix it👇 -Press Ctrl + Alt + F2 -enter your user then enter again -Type Hermes if you had installed - talk to herme…',
    date: '2026-09-16',
    impressions: 1778,
    likes: 12,
    bookmarks: 8,
    reposts: 1,
  },
  {
    id: 'omarchy-canvas-for-agents',
    tab: 'omarchy',
    title: 'The desktop as a canvas for agents',
    summary:
      'Omarchy is the surface, the agent paints the workflow: where sessions live, which panels they own, how work surfaces without interrupting. The question I put to other Hermes users — where do your agents actually run?',
    postUrl: 'https://x.com/BkashJosi/status/2098625501812449501',
    postText: '✋Omarchy is canvas for agents, Let Hermes Agent paint your imaginations workflow in it . 🚀🪽 Where are your Hermes Agent session running most on these days ?🚀🪽',
    date: '2026-09-12',
    impressions: 1060,
    likes: 7,
    bookmarks: 7,
    reposts: 1,
  },

  // ---- Jev + Hermes ----
  {
    id: 'jev-connect-skill',
    tab: 'jev-hermes',
    title: 'Connect the Jev skill and let Hermes decide faster',
    summary:
      'The setup, end to end: get a TypeSafe API key, put it in .env, add the skill with one npx command, then ask Hermes to use it. My most-viewed and most-saved post: 1,092 bookmarks.',
    postUrl: 'https://x.com/BkashJosi/status/2101057981861552342',
    postText: 'Your Hermes can get 100x faster if you connect it to the Jev skill. 🚀🪽 👉Login to Typesafe console get the api key. Set in the .env file. Then in terminal 👉npx skills add typesafe-ai/skills -…',
    date: '2026-09-18',
    impressions: 56553,
    likes: 576,
    bookmarks: 1092,
    reposts: 43,
  },
  {
    id: 'jev-setup-walkthrough',
    tab: 'jev-hermes',
    title: 'Setting up Jev with Hermes, start to finish',
    summary:
      'A walkthrough of wiring TypeSafe’s Jev into a running Hermes Agent, for people who had seen the idea and wanted the steps.',
    postUrl: 'https://x.com/BkashJosi/status/2101022269623701558',
    postText: '🚀Hermes Agent with Jev is a rocket landing to Mars!! Here is how you setup your Jev easily !!👇',
    date: '2026-09-18',
    impressions: 39672,
    likes: 252,
    bookmarks: 494,
    reposts: 17,
  },
  {
    id: 'jev-what-people-build',
    tab: 'jev-hermes',
    title: 'What people are actually building with Jev',
    summary:
      'Five projects and resources worth a look: browser agents, search tools, a driving simulation, and experiments bringing the same structured decisions to open models.',
    postUrl: 'https://x.com/BkashJosi/status/2101386077294805241',
    postText: 'What are people building with Jev? And what your Hermes Agent can do with Jev ?🚀🪽 Browser agents, search tools, driving simulations—and experiments that bring similar decision-making to open…',
    date: '2026-09-19',
    impressions: 12680,
    likes: 71,
    bookmarks: 143,
    reposts: 7,
  },
  {
    id: 'jev-prove-done',
    tab: 'jev-hermes',
    title: '“Hermes said done. I gave Jev the evidence.”',
    summary:
      'Agents declare success too easily. This is the prompt I use to have Jev judge the evidence behind a finished task instead of taking the agent’s word for it — the same idea I later used to fact-check my own portfolio.',
    postUrl: 'https://x.com/BkashJosi/status/2101254844506050596',
    postText: 'Hermes said ‘done.’ I gave Jev the evidence.🚀🪽 👉If you want to test your Hermes Agent with Jev then use the below prompt.',
    date: '2026-09-19',
    impressions: 10899,
    likes: 68,
    bookmarks: 130,
    reposts: 4,
  },
  {
    id: 'jev-decision-layer',
    tab: 'jev-hermes',
    title: 'Jev as the decision layer in an agent harness',
    summary:
      'TypeSafe’s founder sketched a leaner harness: rebuild context per task, route the cheap judgments to a fast typed model, keep the expensive model for real reasoning. My read on what that means for Hermes.',
    postUrl: 'https://x.com/BkashJosi/status/2102170466849063290',
    postText: 'Jev Could Rebuild your Hermes Agent’s Harness 🚀🪽 Jev isn’t replacing Hermes, Codex or Claude Code. It could become the decision layer that makes them leaner, cheaper and smarter. TypeSafe fo…',
    date: '2026-09-21',
    impressions: 5809,
    likes: 45,
    bookmarks: 66,
    reposts: 2,
  },
  {
    id: 'jev-hermes-newsroom',
    tab: 'jev-hermes',
    title: 'Hermes Newsroom: one place to follow the ecosystem',
    summary:
      'Omarchy plus Hermes plus Jev, pointed at my own work: a live wire that collects GitHub releases and Hacker News stories and turns them into a newspaper inside my desktop command center. In development.',
    postUrl: 'https://x.com/BkashJosi/status/2102354216144822581',
    postText: 'Omarchy + Hermes + Jev = AGI 😂🚀 👉I wanted one place to follow what’s happening around Hermes Agent—and turn my own work into a newspaper. So I’m building Hermes Newsroom inside my Hermes+Oma…',
    date: '2026-09-22',
    impressions: 3003,
    likes: 34,
    bookmarks: 42,
    reposts: 3,
  },
]

export const viewedProvenance = {
  source: 'my X analytics export',
  exported: '2026-09-22',
  note: 'Impressions, likes, bookmarks and reposts are the numbers X reported for each post; every card links to the post.',
}

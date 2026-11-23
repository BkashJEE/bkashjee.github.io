import { factCheck, identity, siteSourceUrl } from '../content/projects'

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-6xl px-6 pt-6 pb-12">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-sm text-fg-dim">
        <a href="#" className="link-sweep inline-flex min-h-11 items-center hover:text-fg">
          ↑ Back to top
        </a>
        <a href={identity.github} target="_blank" rel="noreferrer" className="link-sweep inline-flex min-h-11 items-center hover:text-fg">
          GitHub
        </a>
        <a href={identity.x} target="_blank" rel="noreferrer" className="link-sweep inline-flex min-h-11 items-center hover:text-fg">
          X / Twitter
        </a>
        <a href="/resume/" className="link-sweep inline-flex min-h-11 items-center hover:text-fg">
          Resume
        </a>
        <a href="/partners/" className="link-sweep inline-flex min-h-11 items-center hover:text-fg">
          Partners
        </a>
        <a href="/use-cases/" className="link-sweep inline-flex min-h-11 items-center hover:text-fg">
          Playbook
        </a>
        <a href={`mailto:${identity.email}`} className="link-sweep inline-flex min-h-11 items-center hover:text-fg">
          Email
        </a>
      </div>
      <div className="mt-6 space-y-2 border-t border-line pt-6 font-mono text-xs text-fg-faint">
        <p>
          <span className="mr-2 inline-block size-1.5 rounded-full bg-accent align-middle" aria-hidden="true" />
          Last recorded fact check: {factCheck.claims} claims · {new Date(`${factCheck.date}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}.{' '}
          <a href={factCheck.claimsUrl} target="_blank" rel="noreferrer" className="link-sweep inline-flex min-h-11 sm:min-h-6 items-center text-fg-dim hover:text-fg">
            View checked claims ↗
          </a>
        </p>
        <p>
          © <span suppressHydrationWarning>{new Date().getFullYear()}</span> Bikash Joshi ·{' '}
          <a href={siteSourceUrl} target="_blank" rel="noreferrer" className="link-sweep inline-flex min-h-11 sm:min-h-6 items-center text-fg-dim hover:text-fg">
            Site source on GitHub ↗
          </a>
        </p>
      </div>
    </footer>
  )
}

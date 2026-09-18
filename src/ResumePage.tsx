import { resume } from './content/resume'

// Print-first, light-background resume. @media print locks it to one page —
// keep bullets tight when editing content/resume.ts.
export default function ResumePage() {
  return (
    <div className="resume-page">
      <header className="flex flex-wrap items-baseline justify-between gap-x-6 border-b-2 border-zinc-900 pb-3">
        <div>
          <h1 className="text-[1.9rem] font-semibold leading-none tracking-tight">{resume.name}</h1>
          <p className="mt-1.5 text-[0.95rem] text-zinc-600">
            <span className="font-medium text-zinc-800">{resume.title}</span> · {resume.subtitle}
          </p>
        </div>
        <ul className="text-right text-[0.8rem] leading-relaxed text-zinc-600">
          <li>
            <a href={`mailto:${resume.contact.email}`} className="hover:underline">{resume.contact.email}</a>
          </li>
          <li>
            <a href={`https://${resume.contact.github}`} className="hover:underline">{resume.contact.github}</a>
            {' · '}
            <a href={`https://${resume.contact.x}`} className="hover:underline">{resume.contact.x}</a>
          </li>
          <li>
            <a href={`https://${resume.contact.site}`} className="hover:underline">{resume.contact.site}</a>
          </li>
        </ul>
      </header>

      <p className="mt-4 text-[0.86rem] leading-relaxed text-zinc-700">{resume.summary}</p>

      <h2 className="resume-h2">Selected projects</h2>
      {resume.projects.map((p) => (
        <section key={p.name} className="mt-3 first-of-type:mt-2">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4">
            <h3 className="text-[1rem] font-semibold text-zinc-900">
              {p.name}
              <span className="ml-2 text-[0.78rem] font-normal text-zinc-500">{p.role}</span>
            </h3>
            <span className="font-mono text-[0.72rem] text-zinc-500">
              {'link' in p && p.link ? <a href={`https://${p.link}`} className="hover:underline">{p.link}</a> : p.note}
            </span>
          </div>
          <ul className="mt-1.5 space-y-1 pl-4 text-[0.82rem] leading-snug text-zinc-700 [&>li]:list-disc">
            {p.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
          <p className="mt-1 pl-4 font-mono text-[0.7rem] text-zinc-500">{p.tech}</p>
        </section>
      ))}

      <h2 className="resume-h2">Published tools</h2>
      <ul className="mt-2 space-y-0.5 text-[0.82rem] leading-snug text-zinc-700">
        {resume.published.map((t) => (
          <li key={t.name}>
            <span className="font-medium text-zinc-900">{t.name}</span>
            <span className="text-zinc-500"> ({t.stars}★ on GitHub)</span> — {t.note}
          </li>
        ))}
      </ul>

      <h2 className="resume-h2">Open source & experiments</h2>
      <p className="mt-2 text-[0.82rem] leading-snug text-zinc-700">{resume.openSource}</p>

      <h2 className="resume-h2">Skills</h2>
      <table className="mt-2 w-full text-[0.82rem] leading-snug">
        <tbody>
          {resume.skills.map((s) => (
            <tr key={s.label}>
              <td className="w-36 py-0.5 pr-4 align-top font-medium text-zinc-900">{s.label}</td>
              <td className="py-0.5 text-zinc-700">{s.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="mt-5 border-t border-zinc-200 pt-2 text-center font-mono text-[0.68rem] text-zinc-400 print:hidden">
        Web version with case studies at {resume.contact.site} · PDF generated from this page
      </p>
    </div>
  )
}

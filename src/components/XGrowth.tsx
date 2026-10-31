import { useState } from 'react'
import weekly from '../content/xWeekly.json'
import { audience } from '../content/mostViewed'
import { CountUp } from '../motion/CountUp'

const compact = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 10_000 ? `${Math.round(n / 1000)}K` : n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)

const dayMonth = (iso: string, year = false) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...(year ? { year: 'numeric' } : {}), timeZone: 'UTC' })

const weeks = weekly.weeks
const peak = weeks.reduce((a, b) => (b.views > a.views ? b : a))
// Gridlines on round steps below the peak; the scale leaves headroom above
// the tallest bar so its direct label never touches the top.
const step = 10 ** Math.floor(Math.log10(peak.views)) / 2
const top = Math.ceil((peak.views * 1.15) / step) * step
const gridStep = step * Math.max(1, Math.floor(top / step / 2))
const grid = [gridStep, gridStep * 2].filter((v) => v < top)
const firstOfMonth = new Set(weeks.filter((w, i) => i === 0 || w.week.slice(5, 7) !== weeks[i - 1].week.slice(5, 7)).map((w) => w.week))

/**
 * Proof from my own X analytics: the headline totals as stat tiles, then views
 * on the posts published each week. One series, so no legend; the peak is
 * labelled directly, every bar has a hover/tap tooltip, and the same numbers
 * are available as a table.
 */
export function XGrowth() {
  const [active, setActive] = useState<string | null>(null)
  const shown = weeks.find((w) => w.week === active)
  const stats = [
    ['Views', audience.impressions],
    ['Bookmarks', audience.bookmarks],
    ['New follows', audience.newFollows],
  ] as const

  return (
    <figure className="mt-6 rounded-xl border border-line bg-surface p-5 sm:p-6">
      <h3 className="mb-5 font-display text-2xl text-fg">Reach of these build notes</h3>
      <dl className="grid grid-cols-3 gap-4 border-b border-line pb-5">
        {stats.map(([label, value]) => (
          <div key={label}>
            <dt className="font-mono text-[0.75rem] uppercase tracking-wider text-fg-faint">{label}</dt>
            <dd className="mt-1 font-display text-xl font-semibold tabular-nums text-fg sm:text-2xl">
              <CountUp value={value} format={compact} />
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-5 text-[0.95rem] font-medium text-fg">Views on my X posts, by the week I posted them</p>

      <div className="relative mt-4 h-44 sm:h-52" aria-hidden="true" onPointerLeave={() => setActive(null)}>
        {/* Recessive hairline grid. */}
        {grid.map((v) => (
          <div key={v} className="pointer-events-none absolute inset-x-0 border-t border-line" style={{ bottom: `${(v / top) * 100}%` }}>
            <span className="absolute -top-2.5 left-0 bg-surface pr-1.5 font-mono text-[0.75rem] tabular-nums text-fg-faint">{compact(v)}</span>
          </div>
        ))}
        <div className="absolute inset-0 flex items-end border-b border-fg-faint/60 pl-9">
          {weeks.map((w) => {
            const on = active === w.week
            return (
              <div
                key={w.week}
                className="relative flex h-full flex-1 items-end justify-center px-px"
                onPointerEnter={() => setActive(w.week)}
                onPointerDown={() => setActive(w.week)}
              >
                {w === peak && (
                  <span
                    className="pointer-events-none absolute whitespace-nowrap font-mono text-[0.75rem] font-medium tabular-nums text-fg"
                    style={{ bottom: `calc(${(w.views / top) * 100}% + 4px)` }}
                  >
                    {compact(w.views)}
                  </span>
                )}
                <div
                  className={`w-full max-w-6 rounded-t transition-colors ${on ? 'bg-fg' : 'bg-accent'}`}
                  style={{ height: w.views ? `max(${(w.views / top) * 100}%, 2px)` : 0 }}
                />
              </div>
            )
          })}
        </div>
        {shown && (
          <div
            className="pointer-events-none absolute top-0 left-11 rounded-lg border border-line bg-raised px-3 py-2 text-[0.8rem] leading-snug text-fg shadow-lg shadow-black/30"
          >
            <span className="block text-fg-faint">Week of {dayMonth(shown.week, true)}</span>
            <span className="block font-medium tabular-nums">{shown.views.toLocaleString('en-US')} views</span>
            <span className="block text-fg-dim tabular-nums">
              {shown.posts} post{shown.posts === 1 ? '' : 's'}
            </span>
          </div>
        )}
      </div>
      <div className="mt-2 flex pl-9 font-mono text-[0.75rem] text-fg-faint" aria-hidden="true">
        {weeks.map((w) => (
          <span key={w.week} className="flex-1 overflow-visible whitespace-nowrap">
            {firstOfMonth.has(w.week) ? dayMonth(w.week).split(' ')[0] : ''}
          </span>
        ))}
      </div>

      <figcaption className="mt-4 text-[0.85rem] leading-relaxed text-fg-dim">
        From my X analytics export, counted {dayMonth(weekly.counted, true)}. Totals cover {dayMonth(audience.from)} to{' '}
        {dayMonth(audience.to, true)}; the latest weeks keep growing as their posts gather views.
      </figcaption>

      <details className="mt-3">
        <summary className="inline-flex min-h-11 cursor-pointer items-center font-mono text-[0.8rem] text-fg-dim hover:text-fg">Show as a table</summary>
        <table className="mt-2 w-full max-w-md text-left text-[0.85rem] tabular-nums">
          <thead className="text-fg-faint">
            <tr>
              <th className="py-1 font-normal">Week of</th>
              <th className="py-1 text-right font-normal">Views</th>
              <th className="py-1 text-right font-normal">Posts</th>
            </tr>
          </thead>
          <tbody className="text-fg-dim">
            {weeks.map((w) => (
              <tr key={w.week} className="border-t border-line">
                <td className="py-1">{dayMonth(w.week, true)}</td>
                <td className="py-1 text-right">{w.views.toLocaleString('en-US')}</td>
                <td className="py-1 text-right">{w.posts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  )
}

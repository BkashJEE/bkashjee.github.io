import { useState } from 'react'

/*
 * The archive drawn as an engineering drawing of a filing cabinet: one
 * drawer per work group, each drawer's height set by how many items it holds.
 * Hover a drawer and it slides out with a callout; click it to filter the list.
 * The drawing repeats the filter bar, so it is hidden from screen readers and
 * the keyboard, which use the filter buttons instead.
 */

export interface BlueprintGroup {
  id: string
  label: string
  count: number
  newest?: string
}

interface Props {
  groups: BlueprintGroup[]
  total: number
  firstYear: string
  lastYear: string
  drawn: string
  selected: string
  onPick: (id: string) => void
}

// Cabinet geometry, in viewBox units.
const X0 = 110
const Y0 = 96
const W = 280
const H = 360
const DEPTH = { x: 80, y: -52 }
const PULL = 0.55
const PAD = 8
const GAP = 4
const MIN_DRAWER = 22
const BLOCK = 12

const pull = { x: -DEPTH.x * PULL, y: -DEPTH.y * PULL }

function points(list: [number, number][]) {
  return list.map(([x, y]) => `${x},${y}`).join(' ')
}

function clip(text: string, max: number) {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

// Same scatter every render, so the server and browser draw the same blocks.
function scatter(index: number) {
  return ((index * 2654435761) % 1000) / 1000
}

export function ArchiveBlueprint({ groups, total, firstYear, lastYear, drawn, selected, onPick }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)

  const inner = H - PAD * 2 - GAP * (groups.length - 1)
  const spare = inner - MIN_DRAWER * groups.length
  const sum = groups.reduce((count, group) => count + group.count, 0) || 1
  let cursor = Y0 + PAD
  const drawers = groups.map((group) => {
    const height = MIN_DRAWER + (spare * group.count) / sum
    const drawer = { ...group, x: X0 + PAD, y: cursor, w: W - PAD * 2, h: height }
    cursor += height + GAP
    return drawer
  })

  const largest = drawers.reduce((best, drawer) => (drawer.count > best.count ? drawer : best), drawers[0])
  const focus = drawers.find(({ id }) => id === hovered) ?? drawers.find(({ id }) => id === selected) ?? largest
  const isOpen = (id: string) => id === hovered || id === selected

  const calloutX = X0 + W + DEPTH.x + 14
  const focusOpen = isOpen(focus.id)
  const anchor = {
    x: focus.x + focus.w + (focusOpen ? pull.x : 0),
    y: focus.y + focus.h / 2 + (focusOpen ? pull.y : 0),
  }

  return (
    <svg viewBox="0 0 640 520" className="archive-blueprint h-auto w-full" aria-hidden="true" focusable="false"
      onPointerLeave={() => setHovered(null)}>
      {/* Cabinet shell: top, side, front. */}
      <polygon pathLength={1} className="bp-line bp-draw bp-fill-raised" style={{ '--d': '0ms' } as React.CSSProperties}
        points={points([[X0, Y0], [X0 + W, Y0], [X0 + W + DEPTH.x, Y0 + DEPTH.y], [X0 + DEPTH.x, Y0 + DEPTH.y]])} />
      <polygon pathLength={1} className="bp-line bp-draw bp-fill-surface" style={{ '--d': '120ms' } as React.CSSProperties}
        points={points([[X0 + W, Y0], [X0 + W + DEPTH.x, Y0 + DEPTH.y], [X0 + W + DEPTH.x, Y0 + H + DEPTH.y], [X0 + W, Y0 + H]])} />
      <rect pathLength={1} className="bp-line bp-draw bp-fill-ink" style={{ '--d': '240ms' } as React.CSSProperties}
        x={X0} y={Y0} width={W} height={H} />

      {/* Empty slots behind open drawers. */}
      {drawers.map((drawer) => (
        <rect key={`slot-${drawer.id}`} className="bp-slot" x={drawer.x} y={drawer.y} width={drawer.w} height={drawer.h}
          style={{ opacity: isOpen(drawer.id) ? 1 : 0 }} />
      ))}

      {/* Drawers, painted bottom to top so an open drawer sits over the one below it. */}
      {[...drawers].reverse().map((drawer) => {
        const index = drawers.indexOf(drawer)
        const open = isOpen(drawer.id)
        const picked = drawer.id === selected
        const cols = Math.ceil(drawer.w / BLOCK)
        const rows = Math.ceil(drawer.h / BLOCK)
        return (
          <g key={drawer.id} className="bp-drawer" data-open={open || undefined}
            style={{ transform: open ? `translate(${pull.x}px, ${pull.y}px)` : undefined }}
            onPointerEnter={() => setHovered(drawer.id)}
            onClick={() => onPick(picked ? 'all' : drawer.id)}>
            <polygon className="bp-line bp-fill-raised bp-face"
              points={points([[drawer.x, drawer.y], [drawer.x + drawer.w, drawer.y], [drawer.x + drawer.w - pull.x, drawer.y - pull.y], [drawer.x - pull.x, drawer.y - pull.y]])} />
            <polygon className="bp-line bp-fill-surface bp-face"
              points={points([[drawer.x + drawer.w, drawer.y], [drawer.x + drawer.w - pull.x, drawer.y - pull.y], [drawer.x + drawer.w - pull.x, drawer.y + drawer.h - pull.y], [drawer.x + drawer.w, drawer.y + drawer.h]])} />
            <rect pathLength={1} className="bp-line bp-draw bp-fill-ink" style={{ '--d': `${360 + index * 70}ms` } as React.CSSProperties}
              x={drawer.x} y={drawer.y} width={drawer.w} height={drawer.h} />
            {open && (
              <g className="bp-blocks">
                <clipPath id={`bp-clip-${drawer.id}`}>
                  <rect x={drawer.x} y={drawer.y} width={drawer.w} height={drawer.h} />
                </clipPath>
                <g clipPath={`url(#bp-clip-${drawer.id})`}>
                  {Array.from({ length: cols * rows }, (_, block) => (
                    <rect key={block} className="bp-block" x={drawer.x + (block % cols) * BLOCK} y={drawer.y + Math.floor(block / cols) * BLOCK}
                      width={BLOCK + 0.5} height={BLOCK + 0.5} style={{ animationDelay: `${Math.round(scatter(block + 1) * 260)}ms` }} />
                  ))}
                </g>
              </g>
            )}
            <rect className="bp-handle bp-fade" style={{ '--d': `${700 + index * 70}ms` } as React.CSSProperties}
              x={drawer.x + drawer.w - 74} y={drawer.y + drawer.h / 2 - 2.5} width={36} height={5} rx={2.5} />
            <text className="bp-label bp-fade font-mono" style={{ '--d': `${700 + index * 70}ms` } as React.CSSProperties}
              x={drawer.x + 10} y={drawer.y + drawer.h / 2} dominantBaseline="central">
              {clip(drawer.label.toUpperCase(), 26)}
            </text>
            <text className="bp-label bp-fade font-mono" style={{ '--d': `${700 + index * 70}ms` } as React.CSSProperties}
              x={drawer.x + drawer.w - 10} y={drawer.y + drawer.h / 2} dominantBaseline="central" textAnchor="end">
              {String(drawer.count).padStart(2, '0')}
            </text>
          </g>
        )
      })}

      {/* Height dimension: every item. */}
      <g className="bp-dim bp-fade" style={{ '--d': '1100ms' } as React.CSSProperties}>
        <line x1={X0 - 34} y1={Y0} x2={X0 - 34} y2={Y0 + H} markerStart="url(#bp-arrow)" markerEnd="url(#bp-arrow)" />
        <line x1={X0 - 42} y1={Y0} x2={X0 - 6} y2={Y0} />
        <line x1={X0 - 42} y1={Y0 + H} x2={X0 - 6} y2={Y0 + H} />
        <text className="font-mono" x={X0 - 44} y={Y0 + H / 2} textAnchor="middle"
          transform={`rotate(-90 ${X0 - 44} ${Y0 + H / 2})`}>{total} ITEMS</text>
      </g>

      {/* Width dimension: the years the archive covers. */}
      <g className="bp-dim bp-fade" style={{ '--d': '1200ms' } as React.CSSProperties}>
        <line x1={X0} y1={Y0 + H + 26} x2={X0 + W} y2={Y0 + H + 26} markerStart="url(#bp-arrow)" markerEnd="url(#bp-arrow)" />
        <line x1={X0} y1={Y0 + H + 6} x2={X0} y2={Y0 + H + 34} />
        <line x1={X0 + W} y1={Y0 + H + 6} x2={X0 + W} y2={Y0 + H + 34} />
        <text className="font-mono" x={X0 + W / 2} y={Y0 + H + 46} textAnchor="middle">
          {groups.length} DRAWERS · {firstYear === lastYear ? firstYear : `${firstYear}–${lastYear}`}
        </text>
      </g>

      {/* Callout for the drawer in focus. */}
      <g key={focus.id} className="bp-callout">
        <circle cx={anchor.x} cy={anchor.y} r={3} />
        <polyline className="bp-callout-line" points={points([[anchor.x, anchor.y], [calloutX - 8, anchor.y], [calloutX - 8, 150], [calloutX, 150]])} />
        <text className="bp-callout-title" x={calloutX} y={146}>{clip(focus.label, 18)}</text>
        <text className="bp-callout-text font-mono" x={calloutX} y={164}>{focus.count} {focus.count === 1 ? 'item' : 'items'}</text>
        {focus.newest && (
          <>
            <text className="bp-callout-text font-mono" x={calloutX} y={186}>NEWEST</text>
            <text className="bp-callout-text bp-callout-strong" x={calloutX} y={202}>{clip(focus.newest, 20)}</text>
          </>
        )}
        <text className="bp-callout-hint font-mono" x={calloutX} y={228}>
          {focus.id === selected ? 'click to clear' : 'click to open'}
        </text>
      </g>

      {/* Title block, as on a drawing sheet. */}
      <g className="bp-title bp-fade" style={{ '--d': '1300ms' } as React.CSSProperties}>
        <rect x={calloutX} y={404} width={124} height={64} />
        <line x1={calloutX} y1={426} x2={calloutX + 124} y2={426} />
        <line x1={calloutX} y1={447} x2={calloutX + 124} y2={447} />
        <text className="font-mono" x={calloutX + 8} y={419}>DWG ALL-WORK</text>
        <text className="font-mono" x={calloutX + 8} y={440}>DRAWN {drawn}</text>
        <text className="font-mono" x={calloutX + 8} y={461}>SHEET 1 / 1</text>
      </g>

      <defs>
        <marker id="bp-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 2 L 5 5 L 0 8" className="bp-arrow" />
        </marker>
      </defs>
    </svg>
  )
}

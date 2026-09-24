const branches = [
  { d: 'M0 262 C108 259 155 231 253 221', color: 'amber', delay: 0 },
  { d: 'M253 221 C335 206 363 110 469 87', color: 'amber', delay: 0.35 },
  { d: 'M469 87 C566 62 648 86 760 35', color: 'amber', delay: 0.95 },
  { d: 'M253 221 C356 207 425 181 532 190', color: 'teal', delay: 0.48 },
  { d: 'M532 190 C633 196 687 146 760 151', color: 'teal', delay: 1.12 },
  { d: 'M253 221 C349 259 433 321 550 328', color: 'amber', delay: 0.6 },
  { d: 'M550 328 C643 330 694 383 760 398', color: 'amber', delay: 1.3 },
  { d: 'M375 153 C426 111 471 147 543 120', color: 'teal', delay: 0.9, faint: true },
  { d: 'M416 281 C495 286 534 246 623 257', color: 'teal', delay: 1.08, faint: true },
] as const

const nodes = [
  { x: 253, y: 221, delay: 0.75, color: 'amber' },
  { x: 469, y: 87, delay: 1.35, color: 'amber' },
  { x: 532, y: 190, delay: 1.45, color: 'teal' },
  { x: 550, y: 328, delay: 1.65, color: 'amber' },
] as const

/** A short, decorative branching reveal for the Playbook introduction. */
export function PlaybookNetwork() {
  return (
    <svg className="playbook-network" viewBox="0 0 760 440" fill="none" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="playbook-amber" x1="0" y1="0" x2="760" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f5a524" stopOpacity="0" />
          <stop offset="0.38" stopColor="#f5a524" stopOpacity="0.58" />
          <stop offset="1" stopColor="#f5a524" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="playbook-teal" x1="0" y1="0" x2="760" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2dd4bf" stopOpacity="0" />
          <stop offset="0.55" stopColor="#2dd4bf" stopOpacity="0.46" />
          <stop offset="1" stopColor="#2dd4bf" stopOpacity="0.16" />
        </linearGradient>
      </defs>
      {branches.map((branch) => (
        <path
          key={branch.d}
          d={branch.d}
          pathLength="1"
          stroke={`url(#playbook-${branch.color})`}
          strokeWidth={'faint' in branch ? 0.8 : 1.7}
          strokeLinecap="round"
          className="playbook-network-path"
          style={{ animationDelay: `${branch.delay}s` }}
        />
      ))}
      {nodes.map((node) => (
        <g key={`${node.x}-${node.y}`} className="playbook-network-node" style={{ animationDelay: `${node.delay}s` }}>
          <circle cx={node.x} cy={node.y} r="10" fill={node.color === 'teal' ? '#2dd4bf' : '#f5a524'} opacity="0.07" />
          <circle cx={node.x} cy={node.y} r="2.5" fill={node.color === 'teal' ? '#2dd4bf' : '#f5a524'} opacity="0.8" />
        </g>
      ))}
    </svg>
  )
}

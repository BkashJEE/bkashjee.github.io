/**
 * Site mark: my face instead of initials. The avatar is a transparent
 * cutout, so the ring and dark ground show through around it.
 */
export function BrandMark({ href = '/', label = 'Bikash Joshi — home' }: { href?: string; label?: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="brand-mark flex shrink-0 items-center gap-2.5 rounded-full focus-visible:outline-offset-4"
    >
      <span className="brand-mark-avatar relative flex size-9 items-center justify-center overflow-hidden rounded-full border border-accent/50 bg-raised sm:size-10">
        <img
          src="/assets/avatar.webp"
          width={192}
          height={192}
          alt=""
          className="size-full scale-[1.08] object-cover object-top"
        />
      </span>
      <span className="brand-mark-name hidden font-display text-base tracking-tight text-fg sm:inline sm:text-lg">
        Bikash<span className="text-accent">.</span>
      </span>
    </a>
  )
}

import { useEffect, useState } from 'react'

// Live star counts from the public GitHub API, cached per session.
// Falls back to the baked-in count (checked at build time) on any failure.
export function useStars(repoUrl: string, fallback: number): number {
  const [stars, setStars] = useState(fallback)

  useEffect(() => {
    const path = repoUrl.replace('https://github.com/', '')
    const key = `stars:${path}`
    try {
      const cached = sessionStorage.getItem(key)
      if (cached !== null) {
        setStars(Number(cached))
        return
      }
    } catch {
      /* storage unavailable; fetch anyway */
    }
    let cancelled = false
    fetch(`https://api.github.com/repos/${path}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const count = data?.stargazers_count
        if (cancelled || typeof count !== 'number') return
        setStars(count)
        try {
          sessionStorage.setItem(key, String(count))
        } catch {
          /* ignore */
        }
      })
      .catch(() => {
        /* offline or rate limited: keep fallback */
      })
    return () => {
      cancelled = true
    }
  }, [repoUrl, fallback])

  return stars
}

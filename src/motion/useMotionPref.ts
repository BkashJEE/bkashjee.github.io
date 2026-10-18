import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

/**
 * Single gate for all animation: true means render everything static.
 *
 * The server snapshot is false, so the pre-rendered HTML and the first
 * browser render agree and hydration has nothing to correct; a visitor's
 * reduced-motion preference applies in the render straight after.
 */
export function useMotionPref(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false)
}

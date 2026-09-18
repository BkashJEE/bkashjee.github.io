import { useReducedMotion } from 'motion/react'

/** Single gate for all animation: true means render everything static. */
export function useMotionPref(): boolean {
  return useReducedMotion() ?? false
}

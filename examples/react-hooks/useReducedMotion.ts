'use client';
import { useMediaQuery } from './useMediaQuery';

/**
 * Detects if the user prefers reduced motion.
 * Use to disable animations, parallax, and auto-playing media.
 *
 * @example
 * const prefersReducedMotion = useReducedMotion();
 * const animationDuration = prefersReducedMotion ? 0 : 300;
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

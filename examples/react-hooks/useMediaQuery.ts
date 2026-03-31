"use client";
import { useState, useEffect } from "react";

/**
 * Reactively matches a CSS media query. SSR-safe with mounted pattern.
 *
 * @param query - CSS media query string
 * @param defaultValue - Value returned during SSR and before hydration (default: false)
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 * const isRetina = useMediaQuery('(min-resolution: 2dppx)');
 */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  if (!mounted) return defaultValue;
  return matches;
}

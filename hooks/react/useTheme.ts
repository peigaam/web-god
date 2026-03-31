'use client';
import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ResolvedTheme = 'light' | 'dark';

/**
 * Manages light/dark theme with system preference detection and persistence.
 *
 * @example
 * function ThemeToggle() {
 *   const { theme, resolvedTheme, setTheme, toggle } = useTheme();
 *   return (
 *     <button onClick={toggle}>
 *       Current: {resolvedTheme} (setting: {theme})
 *     </button>
 *   );
 * }
 */
export function useTheme(storageKey = 'theme') {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');

  // Resolve system preference
  const getSystemTheme = useCallback((): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // Initialize from storage
  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null;
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      setThemeState(stored);
    }
  }, [storageKey]);

  // Apply theme to DOM and resolve
  useEffect(() => {
    const resolved = theme === 'system' ? getSystemTheme() : theme;
    setResolvedTheme(resolved);
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }, [theme, getSystemTheme]);

  // Listen for system preference changes
  useEffect(() => {
    if (theme !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setResolvedTheme(getSystemTheme());
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [theme, getSystemTheme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem(storageKey, t);
  }, [storageKey]);

  const toggle = useCallback(() => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  }, [resolvedTheme, setTheme]);

  return { theme, resolvedTheme, setTheme, toggle };
}

"use client";
import { useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

/**
 * Manages light/dark theme with system preference detection and persistence.
 * SSR-safe — returns defaultTheme until mounted to prevent hydration mismatch.
 * Add suppressHydrationWarning to your <html> element when using this hook.
 *
 * @param storageKey - localStorage key for persistence (default: 'theme')
 * @param defaultTheme - Theme returned during SSR (default: 'light')
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
export function useTheme(
  storageKey = "theme",
  defaultTheme: ResolvedTheme = "light",
) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] =
    useState<ResolvedTheme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  const getSystemTheme = useCallback((): ResolvedTheme => {
    if (typeof window === "undefined") return defaultTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }, [defaultTheme]);

  // Initialize from storage and mark as mounted
  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(storageKey) as Theme | null;
    if (stored && ["light", "dark", "system"].includes(stored)) {
      setThemeState(stored);
    }
  }, [storageKey]);

  // Apply theme to DOM and resolve (only after mount)
  useEffect(() => {
    if (!mounted) return;
    const resolved = theme === "system" ? getSystemTheme() : theme;
    setResolvedTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
    document.documentElement.classList.toggle("dark", resolved === "dark");
  }, [theme, getSystemTheme, mounted]);

  // Listen for system preference changes
  useEffect(() => {
    if (!mounted || theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setResolvedTheme(getSystemTheme());
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [theme, getSystemTheme, mounted]);

  const setTheme = useCallback(
    (t: Theme) => {
      setThemeState(t);
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, t);
      }
    },
    [storageKey],
  );

  const toggle = useCallback(() => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  }, [resolvedTheme, setTheme]);

  return { theme, resolvedTheme, setTheme, toggle, mounted };
}

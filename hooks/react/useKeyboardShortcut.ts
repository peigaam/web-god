'use client';
import { useEffect, useCallback } from 'react';

interface ShortcutOptions {
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
  alt?: boolean;
  preventDefault?: boolean;
}

/**
 * Register a keyboard shortcut handler.
 *
 * @example
 * // Cmd+K (Mac) / Ctrl+K (Windows) to open search
 * useKeyboardShortcut('k', () => setSearchOpen(true), { meta: true });
 *
 * // Escape to close modal
 * useKeyboardShortcut('Escape', () => setOpen(false));
 *
 * // Ctrl+Shift+P for command palette
 * useKeyboardShortcut('p', handlePalette, { ctrl: true, shift: true });
 */
export function useKeyboardShortcut(
  key: string,
  callback: (e: KeyboardEvent) => void,
  options: ShortcutOptions = {}
): void {
  const { ctrl = false, meta = false, shift = false, alt = false, preventDefault = true } = options;

  const handler = useCallback(
    (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== key.toLowerCase()) return;
      if (ctrl && !e.ctrlKey) return;
      if (meta && !e.metaKey) return;
      if (shift && !e.shiftKey) return;
      if (alt && !e.altKey) return;

      // Don't fire in text inputs unless it's a modifier combo
      const target = e.target as HTMLElement;
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable;
      if (isInput && !ctrl && !meta) return;

      if (preventDefault) e.preventDefault();
      callback(e);
    },
    [key, callback, ctrl, meta, shift, alt, preventDefault]
  );

  useEffect(() => {
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handler]);
}

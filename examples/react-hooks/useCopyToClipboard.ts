"use client";
import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Copy text to clipboard with success/error feedback.
 *
 * @example
 * function CopyButton({ text }: { text: string }) {
 *   const { copy, copied, error } = useCopyToClipboard();
 *   return (
 *     <button onClick={() => copy(text)}>
 *       {copied ? 'Copied!' : 'Copy'}
 *     </button>
 *   );
 * }
 */
export function useCopyToClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setError(null);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), resetDelay);
      } catch (e) {
        setCopied(false);
        setError(e instanceof Error ? e : new Error("Copy failed"));
      }
    },
    [resetDelay],
  );

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return { copy, copied, error };
}

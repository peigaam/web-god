'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Tracks scroll progress within a container or the viewport.
 * Returns a 0-1 value representing how far the user has scrolled.
 * 
 * @param ref - Optional ref to a scrollable container. Uses window if omitted.
 * @param options.threshold - Minimum change to trigger update (default 0.001)
 * 
 * @example
 * function ScrollIndicator() {
 *   const progress = useScrollProgress();
 *   return <div style={{ width: `${progress * 100}%` }} className="h-1 bg-blue-500" />;
 * }
 * 
 * @example
 * function SectionProgress() {
 *   const ref = useRef<HTMLDivElement>(null);
 *   const progress = useScrollProgress(ref);
 *   return <div ref={ref} style={{ height: '200vh' }}>Progress: {(progress * 100).toFixed(0)}%</div>;
 * }
 */
export function useScrollProgress(
  ref?: React.RefObject<HTMLElement | null>,
  options: { threshold?: number } = {}
): number {
  const { threshold = 0.001 } = options;
  const [progress, setProgress] = useState(0);
  const lastProgress = useRef(0);

  const handleScroll = useCallback(() => {
    let newProgress: number;

    if (ref?.current) {
      const el = ref.current;
      const scrollable = el.scrollHeight - el.clientHeight;
      newProgress = scrollable > 0 ? el.scrollTop / scrollable : 0;
    } else {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      newProgress = scrollable > 0 ? window.scrollY / scrollable : 0;
    }

    newProgress = Math.max(0, Math.min(1, newProgress));

    if (Math.abs(newProgress - lastProgress.current) >= threshold) {
      lastProgress.current = newProgress;
      setProgress(newProgress);
    }
  }, [ref, threshold]);

  useEffect(() => {
    const target = ref?.current ?? window;
    target.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial measurement
    return () => target.removeEventListener('scroll', handleScroll);
  }, [handleScroll, ref]);

  return progress;
}

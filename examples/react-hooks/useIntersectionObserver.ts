"use client";
import { useState, useEffect, useRef, type RefObject } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

/**
 * Observe an element's intersection with the viewport or a parent.
 *
 * @example
 * function LazySection() {
 *   const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });
 *   return (
 *     <div ref={ref}>
 *       {isIntersecting ? <HeavyComponent /> : <Skeleton />}
 *     </div>
 *   );
 * }
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {},
): {
  ref: RefObject<HTMLElement | null>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
} {
  const {
    threshold = 0,
    root = null,
    rootMargin = "0px",
    freezeOnceVisible = false,
  } = options;
  const ref = useRef<HTMLElement | null>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const frozen = entry?.isIntersecting && freezeOnceVisible;

  useEffect(() => {
    const node = ref.current;
    if (!node || frozen) return;

    const observer = new IntersectionObserver(([entry]) => setEntry(entry), {
      threshold,
      root,
      rootMargin,
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, root, rootMargin, frozen]);

  return { ref, isIntersecting: !!entry?.isIntersecting, entry };
}

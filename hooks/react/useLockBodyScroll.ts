'use client';
import { useEffect } from 'react';

/**
 * Locks body scroll when active. Useful for modals and overlays.
 * Preserves scroll position and prevents background scrolling.
 *
 * @example
 * function Modal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
 *   useLockBodyScroll(isOpen);
 *   if (!isOpen) return null;
 *   return <div className="modal">...</div>;
 * }
 */
export function useLockBodyScroll(locked: boolean = true): void {
  useEffect(() => {
    if (!locked) return;

    const scrollY = window.scrollY;
    const body = document.body;
    const originalOverflow = body.style.overflow;
    const originalPosition = body.style.position;
    const originalTop = body.style.top;
    const originalWidth = body.style.width;

    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';

    return () => {
      body.style.overflow = originalOverflow;
      body.style.position = originalPosition;
      body.style.top = originalTop;
      body.style.width = originalWidth;
      window.scrollTo(0, scrollY);
    };
  }, [locked]);
}

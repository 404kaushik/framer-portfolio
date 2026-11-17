import Lenis from 'lenis';
import { useEffect } from 'react';

let lenis: Lenis | null = null;

/** Eased, momentum scrolling for the page. Off under reduced motion and on touch (native is better there). */
export function useSmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reduce) return;
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9, smoothWheel: true });
    let raf = 0;
    const loop = (t: number) => {
      lenis?.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      lenis = null;
    };
  }, []);
}

export function scrollToY(y: number, duration = 1.1) {
  if (lenis) lenis.scrollTo(y, { duration, easing: t => 1 - Math.pow(1 - t, 4) });
  else window.scrollTo({ top: y, behavior: 'smooth' });
}

/** Freeze page scroll while an overlay is open. */
export function lockScroll(on: boolean) {
  if (!lenis) return;
  if (on) lenis.stop();
  else lenis.start();
}

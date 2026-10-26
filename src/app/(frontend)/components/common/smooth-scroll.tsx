"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

const SmoothScroll = () => {
  const lenisRef = useRef<Lenis | null>(null);
  // Set by back/forward navigation, where the browser restores the old
  // scroll position and this component must stay out of its way.
  const isTraversalRef = useRef(false);
  const pathname = usePathname();

  useEffect(() => {
    // Touch devices use native scrolling - skip Lenis and its RAF loop
    // entirely to save main-thread work on mobile.
    const isFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (!isFinePointer) return;

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const onPopState = () => {
      isTraversalRef.current = true;
      // Cancel any smooth scroll still in flight: Lenis would otherwise
      // keep easing toward its old target and drag the restored page there.
      lenisRef.current?.stop();
      lenisRef.current?.start();
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (isTraversalRef.current) {
      // Back/forward: the browser restores the previous position. Forcing
      // the top here sent visitors back to the start of the page they were
      // reading; only resync Lenis with the new page height.
      isTraversalRef.current = false;
      lenisRef.current?.resize();
      return;
    }
    if (window.location.hash) return;
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default SmoothScroll;

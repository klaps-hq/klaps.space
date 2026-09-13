"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ICinema } from "@/interfaces/ICinema";
import SectionLoader from "@/components/ui/section-loader";

// Same box the loaded map occupies, so swapping one for the other costs no
// layout shift.
const MAP_BOX_CLASS = "relative w-full aspect-video max-h-[560px]";

const CinemaMap = dynamic(() => import("./cinema-map"), {
  ssr: false,
  loading: () => (
    <div className={MAP_BOX_CLASS}>
      <SectionLoader label="Ładowanie mapy" className="min-h-0 h-full" />
    </div>
  ),
});

interface CinemaMapLazyProps {
  cinema: ICinema;
}

/**
 * Holds the map back until it is close to the viewport.
 *
 * `next/dynamic` with `ssr: false` only skips server rendering; the chunk
 * still downloads and executes as soon as the component mounts. The map
 * pulls in maplibre-gl, around 286 kB, which was landing on every one of
 * the 500+ cinema pages during hydration and pushing total blocking time to
 * 660 ms. Gating the import on an intersection keeps it off the critical
 * path for readers who never scroll to the map.
 */
const CinemaMapLazy: React.FC<CinemaMapLazyProps> = ({ cinema }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || isNearViewport) return;

    // No IntersectionObserver (old browsers, some crawlers): load rather
    // than leave a permanent placeholder. Scheduled rather than set inline,
    // so the effect does not update state during its own synchronous run.
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setIsNearViewport(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      // Start fetching just before it scrolls in, so the map is usually
      // ready by the time it is actually on screen.
      { rootMargin: "300px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isNearViewport]);

  return (
    <div ref={containerRef}>
      {isNearViewport ? (
        <CinemaMap cinema={cinema} />
      ) : (
        <div className={`${MAP_BOX_CLASS} border border-white/10`} aria-hidden="true" />
      )}
    </div>
  );
};

export default CinemaMapLazy;

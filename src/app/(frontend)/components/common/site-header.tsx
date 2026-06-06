"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";
import MobileNav from "./mobile-nav";

const NAV_LINKS = [
  { href: "/seanse", label: "Seanse" },
  { href: "/gatunki", label: "Gatunki" },
  { href: "/kina", label: "Kina" },
  { href: "/miasta", label: "Miasta" },
  { href: "/mapa-kin", label: "Mapa" },
];

// Scroll distance (px) over which the header morphs from a transparent
// full-width bar into the floating glass capsule.
const MORPH_DISTANCE = 160;

// In overlay mode the header stays hidden until the user has scrolled
// past this depth - near the top the hero's own nav takes over.
const OVERLAY_REVEAL_MIN = 300;

interface SiteHeaderProps {
  /**
   * Homepage mode: fixed instead of sticky, hidden at the top (the hero
   * carries its own nav) and revealed only while scrolling up.
   */
  overlay?: boolean;
}

// Scroll-linked morph progress (0 = page top, 1 = fully morphed),
// smoothed with a spring so fast flicks still resolve fluidly.
const useMorphProgress = (
  scrollY: MotionValue<number>
): MotionValue<number> => {
  const reducedMotion = useReducedMotion();
  const raw = useTransform(scrollY, [0, MORPH_DISTANCE], [0, 1]);
  const sprung = useSpring(raw, { stiffness: 260, damping: 34, mass: 0.7 });
  return reducedMotion ? raw : sprung;
};

const SiteHeader: React.FC<SiteHeaderProps> = ({ overlay = false }) => {
  const reducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const progress = useMorphProgress(scrollY);

  // Overlay visibility: reveal on scroll-up past the threshold, hide on
  // scroll-down so it never fights the listing's own sticky filter bar.
  const [revealed, setRevealed] = useState(!overlay);
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!overlay) return;
    const previous = scrollY.getPrevious() ?? latest;
    if (latest <= OVERLAY_REVEAL_MIN) setRevealed(false);
    else if (latest < previous - 2) setRevealed(true);
    else if (latest > previous + 2) setRevealed(false);
  });

  // All morphing happens on an inner element via transforms and paint-only
  // properties - the sticky wrapper keeps a constant height, so the page
  // below never shifts mid-scroll.
  const y = useTransform(progress, [0, 1], [0, 10]);
  const marginX = useTransform(progress, [0, 1], [0, 14]);
  const borderRadius = useTransform(progress, [0, 1], [0, 16]);
  const backgroundColor = useTransform(
    progress,
    [0, 1],
    ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.78)"]
  );
  const borderColor = useTransform(
    progress,
    [0, 1],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.07)"]
  );
  const backdropFilter = useTransform(
    progress,
    (v) => `blur(${(v * 14).toFixed(2)}px)`
  );
  const boxShadow = useTransform(
    progress,
    (v) => `0 16px 48px -16px rgba(0, 0, 0, ${(v * 0.65).toFixed(3)})`
  );
  const logoScale = useTransform(progress, [0, 1], [1, 0.88]);

  return (
    <motion.header
      className={cn("z-40", overlay ? "fixed inset-x-0 top-0" : "sticky top-0")}
      initial={false}
      animate={
        overlay
          ? { y: revealed ? 0 : -96, opacity: revealed ? 1 : 0 }
          : undefined
      }
      transition={
        reducedMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 320, damping: 36 }
      }
      style={overlay ? { pointerEvents: revealed ? "auto" : "none" } : undefined}
    >
      <motion.div
        style={{
          y,
          marginLeft: marginX,
          marginRight: marginX,
          borderRadius,
          backgroundColor,
          borderColor,
          backdropFilter,
          WebkitBackdropFilter: backdropFilter,
          boxShadow,
        }}
        className="flex items-center justify-between gap-8 border px-6 md:px-10 lg:px-12 py-5"
      >
        <motion.div style={{ scale: logoScale }} className="origin-left shrink-0">
          <Link
            href="/"
            aria-label="Klaps, strona główna"
            className="flex items-center gap-2.5 text-white"
          >
            <svg
              viewBox="0 0 28 20"
              className="w-5 h-5"
              fill="currentColor"
              aria-hidden="true"
            >
              <polygon points="0,8 28,0 28,20 0,12" />
            </svg>
            <span className="text-xl font-medium lowercase tracking-tight">
              klaps
            </span>
          </Link>
        </motion.div>
        <nav
          aria-label="Główna nawigacja"
          className="hidden md:flex items-center gap-6 lg:gap-8 text-sm text-white/80"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <MobileNav links={NAV_LINKS} />
      </motion.div>
    </motion.header>
  );
};

export default SiteHeader;

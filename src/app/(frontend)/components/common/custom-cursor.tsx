"use client";

import { useEffect, useRef } from "react";
import { hasFinePointer, runWhenIdle } from "@/lib/idle";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], summary, [data-cursor="accent"]';

// Set on <html> once the custom cursor is live; globals.css hides the
// native cursor only under it, so nobody is left without a cursor while
// this waits for idle (or on touch devices, where it never starts).
const ACTIVE_ATTRIBUTE = "data-custom-cursor";

/**
 * Follows the mouse with plain DOM writes and a CSS transition for the
 * scale. It used framer-motion motion values and React state per
 * mousemove; now nothing re-renders, and the listeners attach on idle so
 * the cursor costs nothing during hydration.
 */
const CustomCursor = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // No custom cursor on touch devices - skip all listeners.
    if (!hasFinePointer()) return;

    const wrapper = wrapperRef.current;
    const dot = dotRef.current;
    if (!wrapper || !dot) return;

    let hovering = false;
    let pressed = false;

    const applyScale = () => {
      const scale = pressed ? 0.8 : hovering ? 3 : 1;
      dot.style.transform = `translate(-50%, -50%) scale(${scale})`;
    };
    const handleMouseMove = (event: MouseEvent) => {
      wrapper.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      wrapper.style.opacity = "1";

      const target = event.target as Element | null;
      const isInteractive = !!target?.closest?.(INTERACTIVE_SELECTOR);
      if (isInteractive !== hovering) {
        hovering = isInteractive;
        applyScale();
      }
    };
    const handleMouseLeave = () => {
      wrapper.style.opacity = "0";
    };
    const handleMouseEnter = () => {
      wrapper.style.opacity = "1";
    };
    const handleMouseDown = () => {
      pressed = true;
      applyScale();
    };
    const handleMouseUp = () => {
      pressed = false;
      applyScale();
    };

    let attached = false;
    const cancelIdle = runWhenIdle(() => {
      attached = true;
      document.documentElement.setAttribute(ACTIVE_ATTRIBUTE, "");
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
      document.documentElement.addEventListener("mouseleave", handleMouseLeave);
      document.documentElement.addEventListener("mouseenter", handleMouseEnter);
    });

    return () => {
      cancelIdle();
      if (!attached) return;
      document.documentElement.removeAttribute(ACTIVE_ATTRIBUTE);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
      document.documentElement.removeEventListener(
        "mouseenter",
        handleMouseEnter
      );
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block mix-blend-difference opacity-0 will-change-transform"
      style={{ transform: "translate3d(-100px, -100px, 0)" }}
    >
      <div
        ref={dotRef}
        className="w-[18px] h-[18px] rounded-full bg-white transition-transform duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ transform: "translate(-50%, -50%) scale(1)" }}
      />
    </div>
  );
};

export default CustomCursor;

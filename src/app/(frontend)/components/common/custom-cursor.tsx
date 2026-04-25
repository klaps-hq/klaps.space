"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label[for], summary';
const COMPACT_INTERACTIVE_SELECTOR =
  '.rdp-day_button, [data-cursor="compact"]';

const CustomCursor = () => {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [compact, setCompact] = useState(false);
  const [pressed, setPressed] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const ringX = useSpring(mouseX, { stiffness: 700, damping: 40, mass: 0.15 });
  const ringY = useSpring(mouseY, { stiffness: 700, damping: 40, mass: 0.15 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      setVisible(true);

      const target = event.target as Element | null;
      const isCompact = !!target?.closest?.(COMPACT_INTERACTIVE_SELECTOR);
      const isInteractive =
        !isCompact && !!target?.closest?.(INTERACTIVE_SELECTOR);
      setHovering(isInteractive);
      setCompact(isCompact);
    };
    const handleMouseLeave = () => setVisible(false);
    const handleMouseEnter = () => setVisible(true);
    const handleMouseDown = () => setPressed(true);
    const handleMouseUp = () => setPressed(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);

    return () => {
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
  }, [mouseX, mouseY]);

  const ringScale = pressed
    ? 0.75
    : compact
      ? 0
      : hovering
        ? 1.8
        : 1;
  const dotScale = pressed ? 0.5 : compact ? 1 : hovering ? 0 : 1;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block mix-blend-difference"
        style={{ x: ringX, y: ringY, opacity: visible ? 1 : 0 }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/80"
          animate={{
            scale: ringScale,
            backgroundColor: hovering
              ? "rgba(255,255,255,1)"
              : "rgba(255,255,255,0)",
          }}
          transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block mix-blend-difference"
        style={{ x: mouseX, y: mouseY, opacity: visible ? 1 : 0 }}
      >
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white"
          animate={{ scale: dotScale }}
          transition={{ duration: 0.08, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
    </>
  );
};

export default CustomCursor;

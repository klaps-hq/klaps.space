"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], summary, [data-cursor="accent"]';

const CustomCursor = () => {
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
      setVisible(true);

      const target = event.target as Element | null;
      const isInteractive = !!target?.closest?.(INTERACTIVE_SELECTOR);
      setHovering(isInteractive);
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

  const scale = pressed ? 0.8 : hovering ? 3 : 1;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block mix-blend-difference"
      style={{ x: mouseX, y: mouseY, opacity: visible ? 1 : 0 }}
    >
      <motion.div
        className="-translate-x-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-white"
        animate={{ scale }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  );
};

export default CustomCursor;

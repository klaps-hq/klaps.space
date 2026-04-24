"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";

const ScrollIndicator = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => {
    if (value > 80) {
      setHidden(true);
    }
  });

  return (
    <motion.div
      className="pointer-events-none fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: hidden ? 0 : 1, y: hidden ? 10 : 0 }}
      transition={{ duration: 0.6, delay: hidden ? 0 : 1.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex flex-col items-center gap-2 text-white/60 mix-blend-difference">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.svg
          width="12"
          height="16"
          viewBox="0 0 12 16"
          fill="none"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M6 1 L6 14 M1 9 L6 14 L11 9"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </div>
    </motion.div>
  );
};

export default ScrollIndicator;

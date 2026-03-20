"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const clipSlot: Variants = {
  hidden: {},
  visible: {},
};

const revealUp: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const reducedItem: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: "linear" },
  },
};

interface ClipRevealProps {
  children: React.ReactNode;
  className?: string;
  clipMargin?: number;
}

const ClipReveal: React.FC<ClipRevealProps> = ({
  children,
  className,
  clipMargin = 20,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn(className)}
      style={{
        clipPath: `inset(-${clipMargin}px -${clipMargin}px 0 -${clipMargin}px)`,
      }}
      variants={clipSlot}
    >
      <motion.div variants={prefersReducedMotion ? reducedItem : revealUp}>
        {children}
      </motion.div>
    </motion.div>
  );
};

export default ClipReveal;

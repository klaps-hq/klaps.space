"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type SectionDividerProps = {
  className?: string;
};

const SectionDivider: React.FC<SectionDividerProps> = ({ className }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="bg-black px-8">
      <motion.hr
        className={cn(
          "mx-auto max-w-[1400px] border-0 h-px bg-neutral-800",
          className
        )}
        aria-hidden="true"
        initial={prefersReducedMotion ? { opacity: 1, scaleX: 1 } : { opacity: 0.35, scaleX: 0.72 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, amount: 0.9 }}
        transition={
          prefersReducedMotion
            ? { duration: 0.2 }
            : { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
        }
        style={{ transformOrigin: "center" }}
      />
    </div>
  );
};

export default SectionDivider;

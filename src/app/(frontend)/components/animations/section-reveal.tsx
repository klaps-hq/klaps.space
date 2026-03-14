"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  defaultSectionTransition,
  reducedMotionSectionTransition,
  reducedMotionSectionVariants,
  SECTION_VIEWPORT,
  sectionRevealVariants,
} from "./motion-presets";

type SectionRevealTag = "section" | "div";

type SectionRevealProps = {
  as?: SectionRevealTag;
  children: React.ReactNode;
  className?: string;
  id?: string;
  delay?: number;
};

const SectionReveal: React.FC<SectionRevealProps> = ({
  as = "section",
  children,
  className,
  id,
  delay = 0,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = as === "section" ? motion.section : motion.div;

  const variants = prefersReducedMotion
    ? reducedMotionSectionVariants
    : sectionRevealVariants;

  const transition = prefersReducedMotion
    ? { ...reducedMotionSectionTransition, delay }
    : { ...defaultSectionTransition, delay };

  return (
    <MotionTag
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={SECTION_VIEWPORT}
      variants={variants}
      transition={transition}
    >
      {children}
    </MotionTag>
  );
};

export default SectionReveal;

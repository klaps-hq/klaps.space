"use client";

import { useReducedMotion } from "framer-motion";

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const TRANSITION = { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] };
const REDUCED_TRANSITION = { duration: 0.15 };

export function useMotion() {
  const reduced = !!useReducedMotion();
  return {
    reduced,
    t: reduced ? REDUCED_TRANSITION : TRANSITION,
    variant: reduced ? fadeIn : fadeUp,
  };
}

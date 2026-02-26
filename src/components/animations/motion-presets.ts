import type { Transition, Variants } from "framer-motion";

export const SECTION_VIEWPORT = { once: true, amount: 0.2 } as const;

export const SECTION_REVEAL_DURATION = 0.55;
export const STAGGER_CHILDREN = 0.08;
export const STAGGER_DELAY_CHILDREN = 0.06;

export const defaultSectionTransition: Transition = {
  duration: SECTION_REVEAL_DURATION,
  ease: "easeOut",
};

export const reducedMotionSectionTransition: Transition = {
  duration: 0.2,
  ease: "linear",
};

export const sectionRevealVariants: Variants = {
  hidden: { opacity: 1, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export const reducedMotionSectionVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER_CHILDREN,
      delayChildren: STAGGER_DELAY_CHILDREN,
    },
  },
};

export const reducedMotionStaggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultSectionTransition,
  },
};

export const reducedMotionStaggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: reducedMotionSectionTransition,
  },
};

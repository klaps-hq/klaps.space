"use client";

import React from "react";
import { LazyMotion, domAnimation } from "framer-motion";

interface MotionProviderProps {
  children: React.ReactNode;
}

/**
 * Loads only the DOM animation feature set (no drag or layout animations,
 * which nothing on the site uses) and lets every component render `m.*`
 * instead of the full `motion.*` bundle. `strict` throws if a `motion.*`
 * component slips back in and would pull the full bundle again.
 */
const MotionProvider: React.FC<MotionProviderProps> = ({ children }) => (
  <LazyMotion features={domAnimation} strict>
    {children}
  </LazyMotion>
);

export default MotionProvider;

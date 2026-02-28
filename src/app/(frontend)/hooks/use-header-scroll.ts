"use client";

import { useEffect, useState } from "react";

const DEFAULT_THRESHOLD = 50;

interface UseHeaderScrollOptions {
  threshold?: number;
}

export const useHeaderScroll = (options: UseHeaderScrollOptions = {}) => {
  const { threshold = DEFAULT_THRESHOLD } = options;
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > threshold);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return hasScrolled;
};

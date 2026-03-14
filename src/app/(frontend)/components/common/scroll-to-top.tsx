"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 400;

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex items-center justify-center size-10 md:size-12 bg-blood-red text-white transition-all duration-300 hover:bg-blood-red/80 cursor-pointer",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <ArrowUp className="size-5" />
    </button>
  );
};

export default ScrollToTop;

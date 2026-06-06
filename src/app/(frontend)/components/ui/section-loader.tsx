import React from "react";
import { cn } from "@/lib/utils";

interface SectionLoaderProps {
  label?: string;
  className?: string;
}

const SectionLoader: React.FC<SectionLoaderProps> = ({ label, className }) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-7 min-h-screen",
      className,
    )}
  >
    <svg
      className="size-7 animate-spin text-white"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="14"
        cy="14"
        r="13"
        stroke="currentColor"
        strokeOpacity="0.15"
        strokeWidth="1"
      />
      <path
        d="M27 14a13 13 0 0 1-13 13"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
    {label && (
      <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
        {label}
      </p>
    )}
  </div>
);

export default SectionLoader;

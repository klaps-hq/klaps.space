import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  className,
}) => (
  <div className={cn("w-full", className)}>
    {eyebrow && (
      <div className="mb-6 flex items-center gap-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/45">
        <span className="h-px w-12 bg-white/25" aria-hidden="true" />
        <span>{eyebrow}</span>
      </div>
    )}
    <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.15] -tracking-[0.01em]">
      <span className="block text-white font-medium">{title}</span>
      {subtitle && <span className="block text-white/45">{subtitle}</span>}
    </h2>
  </div>
);

export default SectionHeading;

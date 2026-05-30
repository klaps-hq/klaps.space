import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateCta {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface EmptyStateProps {
  description: React.ReactNode;
  cta?: EmptyStateCta;
  className?: string;
}

const ctaClassName =
  "group inline-flex items-center gap-3 text-xs md:text-sm uppercase tracking-[0.28em] text-white border border-white/25 hover:border-white hover:bg-white/[0.04] px-7 md:px-9 py-4 md:py-5 transition-colors";

const EmptyState: React.FC<EmptyStateProps> = ({
  description,
  cta,
  className,
}) => {
  const ctaContent = cta && (
    <>
      {cta.label}
      <span
        aria-hidden="true"
        className="transition-transform group-hover:translate-x-1"
      >
        →
      </span>
    </>
  );

  return (
    <div className={cn("flex flex-col items-start gap-6 py-4", className)}>
      <p className="max-w-[48ch] text-base md:text-lg text-white/55 leading-relaxed">
        {description}
      </p>
      {cta && cta.href && (
        <Link href={cta.href} className={ctaClassName}>
          {ctaContent}
        </Link>
      )}
      {cta && !cta.href && cta.onClick && (
        <button type="button" onClick={cta.onClick} className={ctaClassName}>
          {ctaContent}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

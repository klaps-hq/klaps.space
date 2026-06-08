import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateCta {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface EmptyStateProps {
  /** Big typographic statement above the description, e.g. "Nic tu nie gra." */
  title?: React.ReactNode;
  description: React.ReactNode;
  cta?: EmptyStateCta;
  className?: string;
}

const ctaClassName =
  "group inline-flex items-center gap-3 text-xs md:text-sm uppercase tracking-[0.28em] text-white border border-white/25 hover:border-white hover:bg-white/[0.04] px-7 md:px-9 py-4 md:py-5 transition-colors";

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  cta,
  className,
}) => {
  const ctaContent = cta && (
    <>
      {cta.label}
      <ArrowRight
        aria-hidden="true"
        className="size-4 shrink-0 transition-transform group-hover:translate-x-1"
      />
    </>
  );

  return (
    <div
      className={cn(
        "flex flex-col items-center text-center px-6 py-20 md:py-28",
        className
      )}
    >
      {title && (
        <p className="text-3xl md:text-5xl lg:text-6xl font-medium uppercase -tracking-[0.03em] leading-[1.05] text-white">
          {title}
        </p>
      )}
      <p
        className={cn(
          "max-w-[48ch] text-base md:text-lg text-white/55 leading-relaxed",
          title && "mt-5 md:mt-6"
        )}
      >
        {description}
      </p>
      {cta && (
        <div className="mt-10 md:mt-12">
          {cta.href ? (
            <Link href={cta.href} className={ctaClassName}>
              {ctaContent}
            </Link>
          ) : (
            cta.onClick && (
              <button
                type="button"
                onClick={cta.onClick}
                className={ctaClassName}
              >
                {ctaContent}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;

import React from "react";
import { cn } from "@/lib/utils";

export type PageHeadingVariant = "display" | "editorial" | "detail";

/**
 * Canonical h1 styles per page type. Exported separately so components
 * that need a custom h1 element (e.g. animated motion.h1 in movie hero)
 * can reuse the exact same classes.
 */
export const PAGE_HEADING_CLASSES: Record<PageHeadingVariant, string> = {
  // Content pages: FAQ, Kontakt, O projekcie, Regulamin, Polityka, Maintenance.
  display:
    "text-5xl md:text-8xl lg:text-9xl font-medium uppercase -tracking-[0.04em] leading-[0.9] text-white",
  // Listing pages: Seanse, Kina, Miasta, Gatunki, Mapa kin.
  editorial:
    "text-3xl md:text-5xl lg:text-6xl font-medium leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white",
  // Detail pages: miasta/[slug], gatunki/[slug], kina/[slug], filmy/[slug].
  detail:
    "text-4xl md:text-6xl lg:text-7xl font-medium uppercase -tracking-[0.03em] leading-[0.95] text-white",
};

interface PageHeadingProps {
  variant: PageHeadingVariant;
  className?: string;
  children: React.ReactNode;
}

const PageHeading: React.FC<PageHeadingProps> = ({
  variant,
  className,
  children,
}) => {
  return (
    <h1 className={cn(PAGE_HEADING_CLASSES[variant], className)}>{children}</h1>
  );
};

interface PageHeadingMutedProps {
  children: React.ReactNode;
}

/** Dimmed second title line, used with the editorial variant. */
export const PageHeadingMuted: React.FC<PageHeadingMutedProps> = ({
  children,
}) => {
  return <span className="block font-normal text-white/40">{children}</span>;
};

export default PageHeading;

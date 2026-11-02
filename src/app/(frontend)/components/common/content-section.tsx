import React from "react";
import { cn } from "@/lib/utils";

interface ContentSectionProps {
  /** Content of the section's H2. */
  heading: React.ReactNode;
  /** Short line under the heading (source note, scope of the data). */
  lead?: React.ReactNode;
  /** Extra content in the heading column (logo, a link to the hub). */
  aside?: React.ReactNode;
  id?: string;
  className?: string;
  children: React.ReactNode;
}

export const SECTION_META_CLASS =
  "text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-white/45";

/**
 * Shared frame for the secondary sections below the repertoire (history,
 * stats, venue facts, guides, FAQ): heading in a narrow sticky column on the
 * left, content on the right. Keeps the long SEO sections calm and
 * consistent, while the repertoire above stays the one big headline.
 */
const ContentSection = ({
  heading,
  lead,
  aside,
  id,
  className,
  children,
}: ContentSectionProps) => (
  <section
    id={id}
    className={cn(
      "border-t border-white/10 px-6 md:px-12 lg:px-16 py-12 md:py-16 scroll-mt-20",
      className
    )}
  >
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-8 lg:gap-x-12">
      <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start flex flex-col gap-3 md:gap-4">
        <h2 className="text-2xl md:text-3xl lg:text-[2rem] leading-[1.1] -tracking-[0.02em] text-white font-medium max-w-[22ch]">
          {heading}
        </h2>
        {lead && (
          <p className="max-w-[44ch] text-sm text-white/50 leading-relaxed">
            {lead}
          </p>
        )}
        {aside}
      </div>
      <div className="lg:col-span-8 min-w-0">{children}</div>
    </div>
  </section>
);

export default ContentSection;

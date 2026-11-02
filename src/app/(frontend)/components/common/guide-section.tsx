import React from "react";
import ContentSection from "@/components/common/content-section";

interface GuideSectionProps {
  heading: React.ReactNode;
  /** Plain paragraphs separated by blank lines. */
  guide: string | null | undefined;
}

// Paragraphs shown before "Czytaj dalej"; a short guide is never folded.
const VISIBLE_PARAGRAPHS = 2;

const PARAGRAPHS_CLASS =
  "flex flex-col gap-4 md:gap-5 max-w-[68ch] text-base md:text-[17px] text-white/70 leading-relaxed";

/**
 * Long researched guide (city cinemas, genre history) as plain paragraphs.
 * The tail folds into <details>: the whole text stays in the server HTML,
 * it just no longer pushes the FAQ a few screens down.
 */
const GuideSection = ({ heading, guide }: GuideSectionProps) => {
  const paragraphs = (guide ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  if (paragraphs.length === 0) return null;

  const fold = paragraphs.length > VISIBLE_PARAGRAPHS + 1;
  const shown = fold ? paragraphs.slice(0, VISIBLE_PARAGRAPHS) : paragraphs;
  const rest = fold ? paragraphs.slice(VISIBLE_PARAGRAPHS) : [];

  return (
    <ContentSection heading={heading}>
      <div className={PARAGRAPHS_CLASS}>
        {shown.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>
      {rest.length > 0 && (
        <details className="group">
          <summary className="mt-5 inline-flex cursor-pointer list-none items-center gap-2 text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-white/55 hover:text-white transition-colors group-open:hidden">
            Czytaj dalej
            <span aria-hidden="true" className="text-sm leading-none">
              +
            </span>
          </summary>
          <div className={`mt-4 md:mt-5 ${PARAGRAPHS_CLASS}`}>
            {rest.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>
        </details>
      )}
    </ContentSection>
  );
};

export default GuideSection;

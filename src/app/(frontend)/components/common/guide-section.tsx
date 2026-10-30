import React from "react";

interface GuideSectionProps {
  heading: React.ReactNode;
  /** Plain paragraphs separated by blank lines. */
  guide: string | null | undefined;
}

/** Long researched guide (city cinemas, genre history) as plain paragraphs. */
const GuideSection = ({ heading, guide }: GuideSectionProps) => {
  const paragraphs = (guide ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  if (paragraphs.length === 0) return null;

  return (
    <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-20 md:pb-28">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <h2 className="lg:col-span-4 text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] text-white font-medium">
          {heading}
        </h2>
        <div className="lg:col-span-8 flex flex-col gap-5 md:gap-6 max-w-[68ch] text-base md:text-lg text-white/70 leading-relaxed">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuideSection;

import React from "react";
import { pluralPl } from "@/lib/seo";
import { UpcomingCounts } from "@/lib/live-meta";

interface RepertoireSummaryProps {
  counts: UpcomingCounts;
  /** Id of the repertoire heading the jump link scrolls to. */
  targetId: string;
}

const seanse = (count: number): string =>
  `${count} ${pluralPl(count, "seans", "seanse", "seansów")}`;

// Compact answer to "what's on" above the long city intro, so the count and
// the way to the repertoire come before 2000+ words of guide text. Flat and
// typographic, like the date filters.
const RepertoireSummary: React.FC<RepertoireSummaryProps> = ({
  counts,
  targetId,
}) => {
  if (counts.total === 0) return null;

  const parts: { label: string; value: string }[] = [];
  if (counts.today > 0) parts.push({ label: "Dziś", value: seanse(counts.today) });
  if (counts.weekend > 0)
    parts.push({
      label: counts.isWeekend ? "W ten weekend" : "W weekend",
      value: seanse(counts.weekend),
    });
  if (parts.length === 0)
    parts.push({
      label: "Nadchodzące",
      value: seanse(counts.total),
    });

  return (
    <p className="mt-8 md:mt-10 flex flex-wrap items-baseline gap-x-6 md:gap-x-8 gap-y-2 text-xs md:text-sm uppercase tracking-[0.2em]">
      {parts.map((part) => (
        <span key={part.label} className="text-white/50">
          {part.label}{" "}
          <span className="text-white font-medium">{part.value}</span>
        </span>
      ))}
      <a
        href={`#${targetId}`}
        className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors"
      >
        Zobacz repertuar
      </a>
    </p>
  );
};

export default RepertoireSummary;

import React from "react";
import Link from "next/link";
import { IRecentScreening } from "@/interfaces/IScreenings";
import { RECENT_SCREENINGS_DAYS } from "@/lib/screenings";
import { formatPlDate, pluralPl } from "@/lib/seo";

interface RecentRepertoireProps {
  /** Content of the section's H2. */
  heading: React.ReactNode;
  items: IRecentScreening[];
}

// Same cell as the "Inne kina" grid on the cinema page, so the section reads
// as part of the page rather than a new component.
const CELL_CLASS =
  "border border-[#1a1a1a] -mt-px -ml-px px-4 md:px-5 py-5 md:py-6 flex flex-col gap-1";
const TITLE_CLASS =
  "text-sm md:text-base font-medium uppercase -tracking-[0.01em] text-white/65 transition-colors";
const META_CLASS =
  "text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/50";

/**
 * "Ostatnio w repertuarze": what a cinema or city has been screening lately.
 *
 * Most cinema pages have no upcoming screenings at any given moment and used
 * to render as a name, an address and boilerplate, which is why so many of
 * them sit in "crawled, not indexed". The recent programme is real content
 * that differs on every page.
 *
 * Hook-free on purpose, so it renders on the server and ships in the static
 * HTML like the repertoire grid.
 *
 * Only films scheduled again somewhere get a link. The others have
 * noindexed movie pages, and pointing crawlers at those spends crawl budget,
 * which is the constraint this site is actually up against.
 */
const RecentRepertoire = ({ heading, items }: RecentRepertoireProps) => {
  if (items.length === 0) return null;

  return (
    <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-20 md:pb-28">
      <h2 className="text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
        {heading}
      </h2>
      <p className="mt-4 md:mt-5 mb-8 md:mb-10 max-w-[64ch] text-sm md:text-base text-white/55 leading-relaxed">
        Filmy pokazywane w&nbsp;ostatnich {RECENT_SCREENINGS_DAYS} dniach, od
        najnowszego seansu.
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-px pl-px">
        {items.map((item) => {
          // Noon UTC keeps the calendar day stable in the Warsaw zone the
          // formatter uses; the API sends a bare wall-clock date.
          const lastDate = new Date(`${item.lastScreeningDate}T12:00:00Z`);
          const hasDate = !Number.isNaN(lastDate.getTime());
          const count = item.screeningsCount;

          const body = (
            <>
              <span
                className={`${TITLE_CLASS} ${item.hasUpcomingScreenings ? "group-hover:text-white" : ""}`}
              >
                {item.movie.title}
              </span>
              <span className={META_CLASS}>
                {item.movie.productionYear}
                {hasDate && <> · ostatnio {formatPlDate(lastDate)}</>}
              </span>
              <span className={META_CLASS}>
                {count} {pluralPl(count, "seans", "seanse", "seansów")}
              </span>
            </>
          );

          return (
            <li key={item.movie.id} className="flex">
              {item.hasUpcomingScreenings ? (
                <Link
                  href={`/filmy/${item.movie.slug}`}
                  className={`group w-full bg-black hover:bg-white/[0.04] transition-colors ${CELL_CLASS}`}
                >
                  {body}
                </Link>
              ) : (
                <div className={`w-full bg-black ${CELL_CLASS}`}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default RecentRepertoire;

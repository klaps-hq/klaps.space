import React from "react";
import Link from "next/link";
import UncrawledLink from "@/components/common/uncrawled-link";
import { IRecentScreening } from "@/interfaces/IScreenings";
import { RECENT_SCREENINGS_DAYS } from "@/lib/screenings";
import { formatPlDate, pluralPl } from "@/lib/seo";

interface RecentRepertoireProps {
  /** Content of the section's H2. */
  heading: React.ReactNode;
  items: IRecentScreening[];
  /** Line under the heading; defaults to the 90-day look-back note. */
  description?: React.ReactNode;
  /**
   * Movie slugs with an indexable page (IndexableSlugs.movies); the rest get
   * an uncrawled link. null links every film (the list could not be
   * fetched, and a missing link costs more than a crawl of a noindex page).
   */
  indexableMovies: ReadonlySet<string> | null;
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
 * Films with an indexable page get a real link: a film screened in an
 * independent cinema within 90 days keeps one (it lists where the film
 * played, see getRecentVenues), so those are crawl paths worth following.
 * The rest stay clickable through an uncrawled link: multiplex-only films,
 * and on the open-air pages, whose window is a whole season, films last
 * shown more than 90 days ago (/kino-plenerowe linked /filmy/barbie-2023,
 * a noindex page, KLA-59).
 */
const RecentRepertoire = ({
  heading,
  items,
  description,
  indexableMovies,
}: RecentRepertoireProps) => {
  if (items.length === 0) return null;

  return (
    <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-20 md:pb-28">
      <h2 className="text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
        {heading}
      </h2>
      <p className="mt-4 md:mt-5 mb-8 md:mb-10 max-w-[64ch] text-sm md:text-base text-white/55 leading-relaxed">
        {description ?? (
          <>
            Filmy pokazywane w&nbsp;ostatnich {RECENT_SCREENINGS_DAYS} dniach,
            od najnowszego seansu.
          </>
        )}
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
                className={`${TITLE_CLASS} group-hover:text-white`}
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

          const cellClass = `group w-full bg-black hover:bg-white/[0.04] transition-colors ${CELL_CLASS}`;
          const linkable =
            !indexableMovies || indexableMovies.has(item.movie.slug);

          return (
            <li key={item.movie.id} className="flex">
              {linkable ? (
                <Link href={`/filmy/${item.movie.slug}`} className={cellClass}>
                  {body}
                </Link>
              ) : (
                <UncrawledLink
                  basePath="/filmy"
                  slug={item.movie.slug}
                  className={`${cellClass} cursor-pointer`}
                >
                  {body}
                </UncrawledLink>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default RecentRepertoire;

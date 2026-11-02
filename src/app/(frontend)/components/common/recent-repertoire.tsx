import React from "react";
import Link from "next/link";
import UncrawledLink from "@/components/common/uncrawled-link";
import { IRecentScreening } from "@/interfaces/IScreenings";
import { RECENT_SCREENINGS_DAYS } from "@/lib/screenings";
import { formatPlDate, pluralPl } from "@/lib/seo";
import ContentSection, {
  SECTION_META_CLASS,
} from "@/components/common/content-section";
import CollapsibleList, {
  ROW_CLASS,
} from "@/components/common/collapsible-list";

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

  const rows = items.map((item) => {
    // Noon UTC keeps the calendar day stable in the Warsaw zone the
    // formatter uses; the API sends a bare wall-clock date.
    const lastDate = new Date(`${item.lastScreeningDate}T12:00:00Z`);
    const hasDate = !Number.isNaN(lastDate.getTime());
    const count = item.screeningsCount;

    const body = (
      <>
        <span className="flex min-w-0 flex-col gap-1">
          <span className="text-sm md:text-base text-white/80 group-hover:text-white transition-colors">
            {item.movie.title}
          </span>
          <span className={SECTION_META_CLASS}>
            {item.movie.productionYear}
            {hasDate && <> · ostatnio {formatPlDate(lastDate)}</>}
          </span>
        </span>
        <span className="shrink-0 text-xs text-white/45 tabular-nums">
          {count} {pluralPl(count, "seans", "seanse", "seansów")}
        </span>
      </>
    );

    const rowClass = `group ${ROW_CLASS}`;
    const linkable = !indexableMovies || indexableMovies.has(item.movie.slug);

    return (
      <li key={item.movie.id}>
        {linkable ? (
          <Link href={`/filmy/${item.movie.slug}`} className={rowClass}>
            {body}
          </Link>
        ) : (
          <UncrawledLink
            basePath="/filmy"
            slug={item.movie.slug}
            className={`${rowClass} cursor-pointer`}
          >
            {body}
          </UncrawledLink>
        )}
      </li>
    );
  });

  return (
    <ContentSection
      heading={heading}
      lead={
        description ?? (
          <>
            Filmy pokazywane w&nbsp;ostatnich {RECENT_SCREENINGS_DAYS} dniach,
            od najnowszego seansu.
          </>
        )
      }
    >
      <CollapsibleList
        items={rows}
        moreLabel={(hidden) => <>Pokaż kolejne {hidden}</>}
      />
    </ContentSection>
  );
};

export default RecentRepertoire;

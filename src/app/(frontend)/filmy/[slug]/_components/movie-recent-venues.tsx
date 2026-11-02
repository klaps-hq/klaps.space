import React from "react";
import Link from "next/link";
import { IRecentVenue } from "@/interfaces/IScreenings";
import { RECENT_SCREENINGS_DAYS } from "@/lib/screenings";
import { formatPlDate, pluralPl } from "@/lib/seo";
import UncrawledLink from "@/components/common/uncrawled-link";
import ContentSection, {
  SECTION_META_CLASS,
} from "@/components/common/content-section";
import CollapsibleList, {
  ROW_CLASS,
} from "@/components/common/collapsible-list";

interface MovieRecentVenuesProps {
  movieTitle: string;
  venues: IRecentVenue[];
  /** Cinema slugs with an indexable page; null links every cinema. */
  indexableCinemas: ReadonlySet<string> | null;
}

/**
 * "Ostatnio w kinach": where a film played lately, shown while it has no
 * upcoming screenings. Classics play in runs, and between them this list is
 * what keeps the page specific (and indexable) instead of a bare synopsis
 * shared with every other site using TMDB. Server-rendered, no hooks.
 * Same rows as RecentRepertoire on cinema and city pages.
 */
const MovieRecentVenues = ({
  movieTitle,
  venues,
  indexableCinemas,
}: MovieRecentVenuesProps) => {
  if (venues.length === 0) return null;

  const rows = venues.map((venue) => {
    // Noon UTC keeps the calendar day stable in the Warsaw zone the
    // formatter uses; the API sends a bare wall-clock date.
    const lastDate = new Date(`${venue.lastScreeningDate}T12:00:00Z`);
    const hasDate = !Number.isNaN(lastDate.getTime());
    const count = venue.screeningsCount;
    // Only indexable cinema pages get a link (see getIndexableSlugs).
    const linked = !indexableCinemas || indexableCinemas.has(venue.cinema.slug);

    const body = (
      <>
        <span className="flex min-w-0 flex-col gap-1">
          <span className="text-sm md:text-base text-white/80 group-hover:text-white transition-colors">
            {venue.cinema.name}
          </span>
          <span className={SECTION_META_CLASS}>
            {venue.cinema.city.name}
            {hasDate && <> · ostatnio {formatPlDate(lastDate)}</>}
          </span>
        </span>
        <span className="shrink-0 text-xs text-white/45 tabular-nums">
          {count} {pluralPl(count, "seans", "seanse", "seansów")}
        </span>
      </>
    );

    return (
      <li key={venue.cinema.slug}>
        {linked ? (
          <Link href={`/kina/${venue.cinema.slug}`} className={`group ${ROW_CLASS}`}>
            {body}
          </Link>
        ) : (
          <UncrawledLink
            basePath="/kina"
            slug={venue.cinema.slug}
            className={`group cursor-pointer ${ROW_CLASS}`}
          >
            {body}
          </UncrawledLink>
        )}
      </li>
    );
  });

  return (
    <ContentSection
      heading="Ostatnio w kinach"
      lead={
        <>
          Gdzie pokazywano „{movieTitle}” w&nbsp;ostatnich{" "}
          {RECENT_SCREENINGS_DAYS} dniach. Nowe seanse pojawią się wyżej, gdy
          tylko kina je ogłoszą.
        </>
      }
    >
      <CollapsibleList
        items={rows}
        moreLabel={(hidden) => <>Pokaż kolejne {hidden}</>}
      />
    </ContentSection>
  );
};

export default MovieRecentVenues;

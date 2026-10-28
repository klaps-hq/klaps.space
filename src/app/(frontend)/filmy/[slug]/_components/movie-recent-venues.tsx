import React from "react";
import Link from "next/link";
import { IRecentVenue } from "@/interfaces/IScreenings";
import { RECENT_SCREENINGS_DAYS } from "@/lib/screenings";
import { formatPlDate, pluralPl } from "@/lib/seo";

interface MovieRecentVenuesProps {
  movieTitle: string;
  venues: IRecentVenue[];
  /** Cinema slugs with an indexable page; null links every cinema. */
  indexableCinemas: ReadonlySet<string> | null;
}

// Same cells as RecentRepertoire on cinema and city pages.
const CELL_CLASS =
  "border border-[#1a1a1a] -mt-px -ml-px px-4 md:px-5 py-5 md:py-6 flex flex-col gap-1";
const TITLE_CLASS =
  "text-sm md:text-base font-medium uppercase -tracking-[0.01em] text-white/65 transition-colors";
const META_CLASS =
  "text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/50";

/**
 * "Ostatnio w kinach": where a film played lately, shown while it has no
 * upcoming screenings. Classics play in runs, and between them this list is
 * what keeps the page specific (and indexable) instead of a bare synopsis
 * shared with every other site using TMDB. Server-rendered, no hooks.
 */
const MovieRecentVenues = ({
  movieTitle,
  venues,
  indexableCinemas,
}: MovieRecentVenuesProps) => {
  if (venues.length === 0) return null;

  return (
    <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-16 md:pb-24">
      <h2 className="text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
        Ostatnio w kinach
      </h2>
      <p className="mt-4 md:mt-5 mb-8 md:mb-10 max-w-[64ch] text-sm md:text-base text-white/55 leading-relaxed">
        Gdzie pokazywano „{movieTitle}” w&nbsp;ostatnich{" "}
        {RECENT_SCREENINGS_DAYS} dniach. Nowe seanse pojawią się wyżej, gdy
        tylko kina je ogłoszą.
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-px pl-px">
        {venues.map((venue) => {
          // Noon UTC keeps the calendar day stable in the Warsaw zone the
          // formatter uses; the API sends a bare wall-clock date.
          const lastDate = new Date(`${venue.lastScreeningDate}T12:00:00Z`);
          const hasDate = !Number.isNaN(lastDate.getTime());
          const count = venue.screeningsCount;
          // Only indexable cinema pages get a link (see getIndexableSlugs).
          const linked =
            !indexableCinemas || indexableCinemas.has(venue.cinema.slug);

          const body = (
            <>
              <span
                className={`${TITLE_CLASS} ${linked ? "group-hover:text-white" : ""}`}
              >
                {venue.cinema.name}
              </span>
              <span className={META_CLASS}>{venue.cinema.city.name}</span>
              <span className={META_CLASS}>
                {count} {pluralPl(count, "seans", "seanse", "seansów")}
                {hasDate && <> · ostatnio {formatPlDate(lastDate)}</>}
              </span>
            </>
          );

          return (
            <li key={venue.cinema.slug} className="flex">
              {linked ? (
                <Link
                  href={`/kina/${venue.cinema.slug}`}
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

export default MovieRecentVenues;

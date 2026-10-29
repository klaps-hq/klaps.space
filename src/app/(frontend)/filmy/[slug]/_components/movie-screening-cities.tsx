import React from "react";
import Link from "next/link";
import { IScreening } from "@/interfaces/IScreenings";
import { isChainCinema } from "@/lib/cinema-chains";
import { pluralPl } from "@/lib/seo";

// Past this many the list stops being a scannable overview.
const MAX_CITIES = 12;
const MAX_CINEMA_NAMES = 3;
// Older than this reads as a return to the big screen, not a release.
const REVIVAL_AGE_YEARS = 3;

interface MovieScreeningCitiesProps {
  movieTitle: string;
  productionYear: number;
  screenings: IScreening[];
}

interface CityCount {
  slug: string;
  name: string;
  count: number;
}

const joinPl = (items: string[]): string =>
  items.length <= 1
    ? items.join("")
    : `${items.slice(0, -1).join(", ")} i ${items.at(-1)}`;

// "29 października": the API date is a Warsaw calendar date, read as UTC
// so no zone shift moves it to the neighbouring day.
const formatDayMonth = (isoDate: string): string =>
  new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });

// One sentence of page-specific context built from the screenings. The
// synopsis on this page comes from TMDB and is shared with every other
// site using it; this is the part only klaps.space has: where, in what
// kind of venue and over which dates the film is shown.
const buildContext = (
  movieTitle: string,
  productionYear: number,
  screenings: IScreening[],
  citiesCount: number
): string => {
  const sorted = [...screenings].sort((a, b) =>
    a.dateTime.localeCompare(b.dateTime)
  );
  const cinemas = [...new Map(sorted.map((s) => [s.cinema.id, s.cinema])).values()];
  const arthouse = cinemas.filter((c) => !isChainCinema(c.name));
  const named = (arthouse.length > 0 ? arthouse : cinemas)
    .slice(0, MAX_CINEMA_NAMES)
    .map((c) => c.name);
  const moreCinemas = cinemas.length - named.length;

  const isRevival =
    new Date().getFullYear() - productionYear >= REVIVAL_AGE_YEARS;
  const opening = isRevival
    ? `${movieTitle} z ${productionYear} roku wraca na duży ekran`
    : `${movieTitle} można zobaczyć w kinach`;
  const where =
    `${joinPl(named)}${moreCinemas > 0 ? ` i ${moreCinemas} ${pluralPl(moreCinemas, "inne kino", "inne kina", "innych kin")}` : ""}`;
  const venueKind =
    arthouse.length === cinemas.length
      ? "w kinach studyjnych"
      : arthouse.length > 0
        ? "w kinach studyjnych i sieciowych"
        : "w kinach sieciowych";

  const first = sorted[0].date;
  const last = sorted[sorted.length - 1].date;
  const dates =
    first === last
      ? `Seanse zapowiedziano na ${formatDayMonth(first)}.`
      : `Pierwszy seans ${formatDayMonth(first)}, ostatni zapowiedziany ${formatDayMonth(last)}.`;

  // No pronoun for the film: titles have every grammatical gender.
  const label = cinemas.length === 1 ? "Kino z seansami" : "Kina z seansami";
  return `${opening} ${venueKind} w ${citiesCount} ${pluralPl(citiesCount, "mieście", "miastach", "miastach")}. ${label}: ${where}. ${dates}`;
};

// Server-rendered overview of where the movie plays. The screenings list
// next to it is client-side and shows one day at a time, so without this
// the cached HTML would name only the first day's cinemas; it also links
// each city hub with the city name as anchor.
const MovieScreeningCities: React.FC<MovieScreeningCitiesProps> = ({
  movieTitle,
  productionYear,
  screenings,
}) => {
  const byCity = new Map<number, CityCount>();
  for (const { cinema } of screenings) {
    const entry = byCity.get(cinema.city.id) ?? {
      slug: cinema.city.slug,
      name: cinema.city.name,
      count: 0,
    };
    entry.count += 1;
    byCity.set(cinema.city.id, entry);
  }
  if (byCity.size === 0) return null;

  const cities = [...byCity.values()].sort(
    (a, b) => b.count - a.count || a.name.localeCompare(b.name, "pl")
  );
  const shown = cities.slice(0, MAX_CITIES);
  const hidden = cities.length - shown.length;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm md:text-base text-white/65 leading-relaxed">
        {buildContext(movieTitle, productionYear, screenings, cities.length)}
      </p>
      <h3 className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/50">
        {movieTitle} w kinach: {screenings.length}{" "}
        {pluralPl(screenings.length, "seans", "seanse", "seansów")} w{" "}
        {cities.length} {pluralPl(cities.length, "mieście", "miastach", "miastach")}
      </h3>
      <ul className="flex flex-col divide-y divide-white/10 border-y border-white/10">
        {shown.map((city) => (
          <li key={city.slug}>
            <Link
              href={`/miasta/${city.slug}`}
              className="group flex items-baseline justify-between gap-4 py-2.5 text-sm uppercase -tracking-[0.01em] text-white/70 hover:text-white transition-colors"
            >
              <span>{city.name}</span>
              <span className="text-[10px] tabular-nums tracking-[0.2em] text-white/45 group-hover:text-white/70 transition-colors">
                {city.count}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {hidden > 0 && (
        <p className="text-[10px] uppercase tracking-[0.2em] text-white/45">
          i {hidden} {pluralPl(hidden, "inne miasto", "inne miasta", "innych miast")}
        </p>
      )}
    </div>
  );
};

export default MovieScreeningCities;

import React from "react";
import Link from "next/link";
import { getScreenings } from "@/lib/screenings";
import { pluralPl } from "@/lib/seo";
import { isVoivodeship, voivodeshipLocative } from "@/lib/voivodeships";
import { isChainCinema } from "@/lib/cinema-chains";

const MAX_CINEMAS = 6;

interface NearbyRepertoireProps {
  /** Canonical lowercase voivodeship of the empty page; null renders nothing. */
  voivodeship: string | null;
  /** Cinemas in this city are listed first. */
  cityId: number;
  /** The page's own cinema, left out of the list. */
  excludeCinemaId?: number;
}

interface CinemaRepertoire {
  id: number;
  slug: string;
  name: string;
  cityId: number;
  cityName: string;
  movies: number;
}

// Shown under an empty repertoire so the page is not a dead end: venues in
// the same voivodeship that do have something coming up, own city first.
// The API lists cinemas without coordinates, so "nearby" is the region
// rather than a distance. Every cinema here has upcoming screenings, which
// also makes its page indexable and worth the link.
const NearbyRepertoire = async ({
  voivodeship,
  cityId,
  excludeCinemaId,
}: NearbyRepertoireProps) => {
  if (!voivodeship || !isVoivodeship(voivodeship)) return null;

  const groups = await getScreenings({ voivodeship });
  const byCinema = new Map<number, CinemaRepertoire>();
  for (const group of groups) {
    const seen = new Set<number>();
    for (const { cinema } of group.screenings) {
      if (cinema.id === excludeCinemaId || seen.has(cinema.id)) continue;
      seen.add(cinema.id);
      const entry = byCinema.get(cinema.id) ?? {
        id: cinema.id,
        slug: cinema.slug,
        name: cinema.name,
        cityId: cinema.city.id,
        cityName: cinema.city.name,
        movies: 0,
      };
      entry.movies += 1;
      byCinema.set(cinema.id, entry);
    }
  }

  // Independents rank above chain multiplexes: sorted by film count alone,
  // the block under an arthouse cinema led with Helios and Multikino, which
  // pulled the page's topic towards the chains. Chains still fill the slots
  // when a region has too few independents with screenings.
  const cinemas = [...byCinema.values()]
    .sort(
      (a, b) =>
        Number(b.cityId === cityId) - Number(a.cityId === cityId) ||
        Number(isChainCinema(a.name)) - Number(isChainCinema(b.name)) ||
        b.movies - a.movies
    )
    .slice(0, MAX_CINEMAS);
  if (cinemas.length === 0) return null;

  return (
    <div className="mt-4 md:mt-6">
      <h3 className="mb-6 md:mb-8 text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/50">
        Seanse w kinach w województwie {voivodeshipLocative(voivodeship)}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pt-px pl-px">
        {cinemas.map((cinema) => (
          <Link
            key={cinema.id}
            href={`/kina/${cinema.slug}`}
            className="group bg-black hover:bg-white/[0.04] transition-colors border border-[#1a1a1a] -mt-px -ml-px px-4 md:px-5 py-5 md:py-6 flex flex-col gap-1"
          >
            <span className="text-sm md:text-base font-medium uppercase -tracking-[0.01em] text-white/65 group-hover:text-white transition-colors">
              {cinema.name}
            </span>
            <span className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/50">
              {cinema.cityName} · {cinema.movies}{" "}
              {pluralPl(cinema.movies, "film", "filmy", "filmów")}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NearbyRepertoire;

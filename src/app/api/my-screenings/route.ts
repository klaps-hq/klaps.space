import { NextRequest, NextResponse } from "next/server";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { cinemaRepertoireDateTo } from "@/lib/cinemas";
import { fetchScreenings } from "@/lib/screenings";

// Proxy for the "Moje kina" view on /seanse: the visitor's starred cinemas
// live in localStorage, so their repertoire is fetched from the client. The
// upstream API filters by a single cinemaId, hence one call per cinema
// (each one cached like any other screenings fetch).
const MAX_CINEMAS = 20;

const parseCinemaIds = (raw: string): string[] => [
  ...new Set(
    raw
      .split(",")
      .map((v) => v.trim())
      .filter((v) => /^\d+$/.test(v))
  ),
].slice(0, MAX_CINEMAS);

// One group per movie with the screenings of every cinema, in start order.
const mergeByMovie = (lists: IScreeningGroup[][]): IScreeningGroup[] => {
  const byMovieId = new Map<number, IScreeningGroup>();
  for (const group of lists.flat()) {
    const existing = byMovieId.get(group.movie.id);
    byMovieId.set(
      group.movie.id,
      existing
        ? { ...existing, screenings: [...existing.screenings, ...group.screenings] }
        : group
    );
  }
  return [...byMovieId.values()]
    .map((group) => {
      const screenings = [...group.screenings].sort((a, b) =>
        a.dateTime.localeCompare(b.dateTime)
      );
      return {
        ...group,
        screenings,
        summary: {
          screeningsCount: screenings.length,
          cinemasCount: new Set(screenings.map((s) => s.cinema.id)).size,
          citiesCount: new Set(screenings.map((s) => s.cinema.city.id)).size,
          cities: [...new Set(screenings.map((s) => s.cinema.city.name))],
        },
      };
    })
    .sort((a, b) =>
      a.screenings[0].dateTime.localeCompare(b.screenings[0].dateTime)
    );
};

export async function GET(request: NextRequest) {
  const cinemaIds = parseCinemaIds(
    request.nextUrl.searchParams.get("cinemas") ?? ""
  );
  if (cinemaIds.length === 0) {
    return NextResponse.json({ screenings: [] });
  }

  // A failing cinema drops out instead of failing the whole view.
  const results = await Promise.allSettled(
    cinemaIds.map((cinemaId) =>
      fetchScreenings({ cinemaId, dateTo: cinemaRepertoireDateTo() })
    )
  );
  const screenings = mergeByMovie(
    results.flatMap((r) => (r.status === "fulfilled" ? [r.value] : []))
  );

  return NextResponse.json(
    { screenings },
    { headers: { "Cache-Control": "private, max-age=60" } }
  );
}

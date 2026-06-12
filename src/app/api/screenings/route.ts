import { NextRequest, NextResponse } from "next/server";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { PaginatedResponse } from "@/interfaces/IMovies";
import { getPaginatedScreenings } from "@/lib/screenings";
import { isVoivodeship } from "@/lib/voivodeships";

// Proxy for the homepage screenings section - the upstream URL and API key
// must stay server-side, while the section fetches from the client so the
// homepage HTML itself can be statically cached (ISR).
const HOMEPAGE_LIMIT = 30;
const MAX_GENRE_IDS = 10;
const MAX_SEARCH_LENGTH = 100;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

interface HomeScreeningsResponse {
  screenings: IScreeningGroup[];
  hasMore: boolean;
}

const parseGenreIds = (raw: string): string[] =>
  raw
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0 && /^\d+$/.test(v))
    .slice(0, MAX_GENRE_IDS);

const mergeScreeningGroups = (
  groups: IScreeningGroup[][]
): IScreeningGroup[] => {
  const byMovieId = new Map<number, IScreeningGroup>();
  for (const list of groups) {
    for (const group of list) {
      if (!byMovieId.has(group.movie.id)) {
        byMovieId.set(group.movie.id, group);
      }
    }
  }
  return Array.from(byMovieId.values());
};

const unwrapResponse = (
  response: IScreeningGroup[] | PaginatedResponse<IScreeningGroup>
): IScreeningGroup[] =>
  Array.isArray(response) ? response : [...response.data];

const validDate = (value: string | null): string | undefined =>
  value && DATE_PATTERN.test(value) ? value : undefined;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const cityParam = params.get("city") ?? "";
  const cityId = /^\d+$/.test(cityParam) ? cityParam : undefined;
  const voivodeshipParam = params.get("voivodeship") ?? "";
  // The API prioritizes city over voivodeship - send at most one of them.
  const voivodeship =
    !cityId && isVoivodeship(voivodeshipParam) ? voivodeshipParam : undefined;
  const genreIds = parseGenreIds(params.get("genres") ?? "");
  const search =
    params.get("search")?.trim().slice(0, MAX_SEARCH_LENGTH) || undefined;

  const sharedFilters = {
    cityId,
    voivodeship,
    dateFrom: validDate(params.get("dateFrom")),
    dateTo: validDate(params.get("dateTo")),
    search,
  };

  // Multi-genre selection: the upstream API accepts a single genreId, so
  // fetch per genre and dedupe by movie (mirrors the old server section).
  const allScreenings =
    genreIds.length > 1
      ? await Promise.all(
          genreIds.map((id) =>
            getPaginatedScreenings({ ...sharedFilters, genreId: id }).then(
              unwrapResponse
            )
          )
        ).then(mergeScreeningGroups)
      : await getPaginatedScreenings({
          ...sharedFilters,
          genreId: genreIds[0],
        }).then(unwrapResponse);

  const screenings = allScreenings.slice(0, HOMEPAGE_LIMIT);

  const body: HomeScreeningsResponse = {
    screenings,
    hasMore: allScreenings.length > screenings.length,
  };

  return NextResponse.json(body, {
    // Short shared cache: repertoire data upstream revalidates every 5
    // minutes anyway (apiFetch default), so repeat hits can be served
    // without re-rendering the route.
    headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
  });
}

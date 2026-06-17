import { NextRequest, NextResponse } from "next/server";
import {
  fetchHomeScreenings,
  HomeScreeningsResult,
} from "@/lib/screenings";
import { isVoivodeship } from "@/lib/voivodeships";

// Proxy for the homepage screenings section - the upstream URL and API key
// must stay server-side, while the section refetches from the client (for
// active filters / the preferred city) so the homepage HTML itself can be
// statically cached (ISR). The default, unfiltered set is server-rendered
// straight into that cached HTML and never hits this route.
const MAX_GENRE_IDS = 10;
const MAX_SEARCH_LENGTH = 100;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const parseGenreIds = (raw: string): string[] =>
  raw
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0 && /^\d+$/.test(v))
    .slice(0, MAX_GENRE_IDS);

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

  const body: HomeScreeningsResult = await fetchHomeScreenings({
    cityId,
    voivodeship,
    genreIds,
    dateFrom: validDate(params.get("dateFrom")),
    dateTo: validDate(params.get("dateTo")),
    search,
  });

  return NextResponse.json(body, {
    // Short shared cache: repertoire data upstream revalidates every 5
    // minutes anyway (apiFetch default), so repeat hits can be served
    // without re-rendering the route.
    headers: { "Cache-Control": "public, max-age=60, s-maxage=300" },
  });
}

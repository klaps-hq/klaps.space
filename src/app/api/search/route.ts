import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/client";
import { ISearchResults } from "@/interfaces/ISearch";

// Proxy for the internal search API - the upstream URL and API key
// must stay server-side, while the search dropdown queries from the client.
const MIN_QUERY_LENGTH = 2;
const MAX_QUERY_LENGTH = 100;

const EMPTY_RESULTS: ISearchResults = { cities: [], cinemas: [] };

export async function GET(request: NextRequest) {
  const query =
    request.nextUrl.searchParams.get("query")?.trim().slice(0, MAX_QUERY_LENGTH) ??
    "";

  if (query.length < MIN_QUERY_LENGTH) {
    return NextResponse.json(EMPTY_RESULTS);
  }

  try {
    const results = await apiFetch<ISearchResults>("/search", {
      params: { query },
      next: { revalidate: 60 },
    });
    return NextResponse.json(results);
  } catch (error) {
    console.warn("Search proxy falling back to empty results:", error);
    return NextResponse.json(EMPTY_RESULTS);
  }
}

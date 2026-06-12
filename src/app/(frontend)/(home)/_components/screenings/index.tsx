"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import JsonLd from "@/components/common/json-ld";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { IGenre } from "@/interfaces/IMovies";
import { usePreferredCity } from "@/contexts/city-context";
import { SITE_URL } from "@/lib/site-config";
import ScreeningsSection from "./screenings-section";

// Client-side data loading on purpose: reading searchParams or cookies in a
// server component would make the whole homepage dynamic, and the slow
// document TTFB was the main mobile LCP bottleneck. The static (ISR) shell
// ships instantly; this section then fetches /api/screenings in the browser.

interface HomeScreeningsData {
  screenings: IScreeningGroup[];
  hasMore: boolean;
}

interface ScreeningsProps {
  genres: IGenre[];
}

const parseGenreIds = (raw: string): number[] =>
  raw
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0 && /^\d+$/.test(v))
    .map(Number);

const Screenings: React.FC<ScreeningsProps> = ({ genres }) => {
  const searchParams = useSearchParams();
  const {
    cityId: preferredCityId,
    voivodeship: preferredVoivodeship,
    isHydrated,
  } = usePreferredCity();

  // URL params win over the stored preference, mirroring the resolution
  // order of the old server-side getPreferredLocation. The preference is
  // applied only after hydration so the first render matches the SSR HTML.
  const urlCity = searchParams.get("city");
  const urlVoivodeship = searchParams.get("voivodeship");
  const city =
    urlCity ??
    (isHydrated && preferredCityId !== null ? String(preferredCityId) : null);
  const voivodeship = city
    ? null
    : (urlVoivodeship ?? (isHydrated ? preferredVoivodeship : null));

  const genresParam = searchParams.get("genres") ?? "";
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const search = searchParams.get("search");

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    else if (voivodeship) params.set("voivodeship", voivodeship);
    if (genresParam) params.set("genres", genresParam);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    if (search) params.set("search", search);
    return params.toString();
  }, [city, voivodeship, genresParam, dateFrom, dateTo, search]);

  // Stored together with the query that produced it: "fetch in flight" is
  // then derived (loaded.query !== query) instead of a setState call at the
  // start of the effect, which the React Compiler lint rejects.
  const [loaded, setLoaded] = useState<{
    query: string;
    data: HomeScreeningsData;
  } | null>(null);

  useEffect(() => {
    // Wait for hydration so the first request already carries the stored
    // city preference instead of fetching twice.
    if (!isHydrated) return;

    const controller = new AbortController();

    fetch(query ? `/api/screenings?${query}` : "/api/screenings", {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<HomeScreeningsData>;
      })
      .then((result) => {
        setLoaded({ query, data: result });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.warn("Falling back to empty home screenings:", error);
        setLoaded({ query, data: { screenings: [], hasMore: false } });
      });

    return () => controller.abort();
  }, [isHydrated, query]);

  const data = loaded?.data ?? null;
  const isFetching = loaded === null || loaded.query !== query;
  const screenings = data?.screenings ?? [];

  return (
    <>
      {/* ItemList ties the homepage to the listed movie pages, so crawlers
          see the repertoire as structured data, not just a grid of links.
          Injected client-side; Google reads JSON-LD from rendered HTML. */}
      {screenings.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: screenings.map((group, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: group.movie.title,
              url: `${SITE_URL}/filmy/${group.movie.slug}`,
            })),
          }}
        />
      )}
      <ScreeningsSection
        screenings={screenings}
        genres={genres}
        seeAllHref={query ? `/seanse?${query}` : "/seanse"}
        hasMore={data?.hasMore ?? false}
        selectedGenreIds={parseGenreIds(genresParam)}
        dateFrom={dateFrom}
        dateTo={dateTo}
        search={search}
        isLoading={data === null}
        isUpdating={isFetching}
      />
    </>
  );
};

export default Screenings;

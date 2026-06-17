"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
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
  // Default, unfiltered screenings rendered on the server into the static
  // homepage HTML. They seed the grid so the common (no-filter, no stored
  // city) view needs no client fetch at all.
  initialScreenings: IScreeningGroup[];
  initialHasMore: boolean;
}

// The hero is exactly 100vh, so the section's top edge touches the fold and
// any non-negative rootMargin fires the observer already at page load,
// putting the work right back into the Lighthouse TBT window. The negative
// bottom margin requires the section to be 120px inside the viewport, which
// only happens after scrolling (or immediately in Googlebot's very tall
// rendering viewport). Real users get an earlier trigger from the first
// scroll event below.
const FETCH_ROOT_MARGIN = "0px 0px -120px 0px";

const parseGenreIds = (raw: string): number[] =>
  raw
    .split(",")
    .map((v) => v.trim())
    .filter((v) => v.length > 0 && /^\d+$/.test(v))
    .map(Number);

const Screenings: React.FC<ScreeningsProps> = ({
  genres,
  initialScreenings,
  initialHasMore,
}) => {
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
  // start of the effect, which the React Compiler lint rejects. Seeded with
  // the server-rendered default (empty query) so the unfiltered view never
  // refetches; a non-empty query (filters / stored city) supersedes it.
  const [loaded, setLoaded] = useState<{
    query: string;
    data: HomeScreeningsData;
  } | null>(() => ({
    query: "",
    data: { screenings: initialScreenings, hasMore: initialHasMore },
  }));

  // Defer the data fetch until the user scrolls near the section: the grid
  // sits below the 100vh hero, so loading it during the initial page load
  // only adds main-thread work (TBT) and poster downloads nobody sees yet.
  // Googlebot renders with a very tall viewport, so it still triggers this.
  const rootRef = useRef<HTMLDivElement>(null);
  // Lazy initializer doubles as the no-IntersectionObserver fallback:
  // without the API the fetch starts immediately.
  const [isNear, setIsNear] = useState(
    () => typeof IntersectionObserver === "undefined"
  );

  useEffect(() => {
    const node = rootRef.current;
    if (!node || isNear) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsNear(true);
        }
      },
      { rootMargin: FETCH_ROOT_MARGIN }
    );
    observer.observe(node);

    // First scroll = intent to reach the section right below the fold;
    // start fetching before the observer threshold is met.
    const onScroll = () => setIsNear(true);
    window.addEventListener("scroll", onScroll, { passive: true, once: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [isNear]);

  useEffect(() => {
    // Wait for hydration so the first request already carries the stored
    // city preference instead of fetching twice.
    if (!isHydrated || !isNear) return;
    // Already have the result for this exact query (e.g. the server-seeded
    // default), so there is nothing to fetch. Guards against the seeded
    // empty-query view and re-running after setLoaded resolves it.
    if (loaded?.query === query) return;

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
  }, [isHydrated, isNear, query, loaded]);

  const data = loaded?.data ?? null;
  const isFetching = loaded === null || loaded.query !== query;
  const screenings = data?.screenings ?? [];

  return (
    // Layout-neutral wrapper: the IntersectionObserver target for the
    // scroll-proximity fetch trigger.
    <div ref={rootRef}>
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
    </div>
  );
};

export default Screenings;

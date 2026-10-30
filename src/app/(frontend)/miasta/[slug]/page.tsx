import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { getCityBySlug } from "@/lib/cities";
import { fetchCinemas, getCinemas } from "@/lib/cinemas";
import { getGenres } from "@/lib/genres";
import {
  fetchRecentScreenings,
  getRecentScreenings,
  getScreenings,
  getScreeningsLastUpdated,
} from "@/lib/screenings";
import { SITE_URL } from "@/lib/site-config";
import { getIndexableSlugs, getSitemapEntries } from "@/lib/sitemap-entries";
import {
  BASE_OPEN_GRAPH,
  NOINDEX_FOLLOW,
  formatPlDate,
  inPlace,
  pluralPl,
  wPrep,
} from "@/lib/seo";
import { todayDigest, todayDigestPhrases } from "@/lib/live-meta";
import { cityFallbackIntro } from "@/lib/listing-copy";
import { splitByChain } from "@/lib/cinema-chains";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading from "@/components/ui/page-heading";
import SiteHeader from "@/components/common/site-header";
import EmptyState from "@/components/common/empty-state";
import RepertoireSection from "@/components/common/repertoire-section";
import RepertoireGrid from "@/components/common/repertoire-grid";
import RecentRepertoire from "@/components/common/recent-repertoire";
import { getProgrammeProfile } from "@/lib/programme-profile";
import ProgrammeProfile from "@/components/common/programme-profile";
import { LinkGrid } from "@/components/common/landing-page";
import { OPEN_AIR_PATH } from "@/lib/landing-pages";
import NearbyRepertoire from "@/components/common/nearby-repertoire";
import ListingFaq from "@/components/common/listing-faq";
import { buildCityFaq } from "@/lib/listing-faq";
import Footer from "../../(home)/_components/footer";
import { summarizeCityVenues } from "@/lib/city-venues";
import CityVenues from "./_components/city-venues";
import GuideSection from "@/components/common/guide-section";
import UncrawledLink from "@/components/common/uncrawled-link";

interface CinemaCardsProps {
  cinemas: { id: number; slug: string; name: string; street: string | null }[];
  /** Venues whose page is noindex render as plain cards, without a link. */
  isLinked: (slug: string) => boolean;
}

const CARD_CLASS =
  "bg-black border border-[#1a1a1a] -mt-px -ml-px px-4 md:px-5 py-5 md:py-6 flex flex-col gap-1";

// Borders live on the cards (not the container) so lines end with the last
// card instead of running across empty grid columns. Negative margins
// collapse the doubled inner borders; opaque #1a1a1a (white/10 on black)
// keeps overlaps from brightening.
const CinemaCards: React.FC<CinemaCardsProps> = ({ cinemas, isLinked }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-px pl-px">
    {cinemas.map((cinema) =>
      isLinked(cinema.slug) ? (
        <Link
          key={cinema.id}
          href={`/kina/${cinema.slug}`}
          className={`group hover:bg-white/[0.04] transition-colors ${CARD_CLASS}`}
        >
          <span className="text-sm md:text-base font-medium uppercase -tracking-[0.01em] text-white/65 group-hover:text-white transition-colors">
            {cinema.name}
          </span>
          {cinema.street && (
            <span className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/50">
              {cinema.street}
            </span>
          )}
        </Link>
      ) : (
        // Noindex venue: clickable for people, no crawlable link.
        <UncrawledLink
          key={cinema.id}
          basePath="/kina"
          slug={cinema.slug}
          className={`group cursor-pointer hover:bg-white/[0.04] transition-colors ${CARD_CLASS}`}
        >
          <span className="text-sm md:text-base font-medium uppercase -tracking-[0.01em] text-white/45 group-hover:text-white transition-colors">
            {cinema.name}
          </span>
          {cinema.street && (
            <span className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/40">
              {cinema.street}
            </span>
          )}
        </UncrawledLink>
      )
    )}
  </div>
);

// Freshness label cut-off for the "Repertuar zaktualizowano" note.
const FRESH_UPDATE_DAYS = 30;

const isRecentUpdate = (date: Date | null): date is Date =>
  date !== null &&
  Date.now() - date.getTime() <= FRESH_UPDATE_DAYS * 24 * 60 * 60 * 1000;

// Roughly what a SERP renders before truncating.
const MAX_TITLE_LENGTH = 60;
// Google truncates snippets past roughly this length.
const MAX_DESCRIPTION_LENGTH = 160;

// ISR: cached HTML revalidated every 5 minutes. The repertoire filters
// (genres, dates, search) are applied client-side in CityRepertoire,
// so this page never reads searchParams and stays statically cacheable.
export const revalidate = 300;

type CityPageProps = {
  params: Promise<{ slug: string }>;
};

// Prebuild the indexable cities (the ones in the sitemap) so crawlers never
// hit a cold render. The noindex rest renders on first request (dynamicParams
// defaults to true): prebuilding them doubled the build time for pages
// search engines do not index.
export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  try {
    const { cities } = await getSitemapEntries();
    return cities.map((city) => ({ slug: city.slug }));
  } catch {
    return [];
  }
};

export const generateMetadata = async ({
  params,
}: CityPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const { city } = await getCityBySlug(slug);

  // null means the call failed, which is not the same as "no cinemas": a
  // swallowed error used to noindex the page and ISR cached that verdict.
  const cinemasResponse = await fetchCinemas({
    cityId: city.id.toString(),
  }).catch(() => null);
  const cinemasCount =
    cinemasResponse?.data.flatMap((g) => g.cinemas).length ?? 0;
  // The body's own call (upcoming only, started showtimes dropped), so the
  // snippet counts what the page lists. The raw city payload still held
  // past showtimes: Toruń's meta said 97 upcoming, its FAQ 89 (audit #4).
  const screeningGroups = await getScreenings({ cityId: city.id.toString() });
  const screeningsCount = screeningGroups.reduce(
    (sum, group) => sum + group.screenings.length,
    0
  );

  // Leads with "Kina studyjne": that is the phrase with demand in GSC
  // ("kino studyjne [miasto]") and the one this site is actually about.
  // The listing also holds multiplexes hosting special screenings, so the
  // second half of the title covers them and the page body keeps them under
  // their own heading rather than under the "studyjne" one.
  // "we Wrocławiu", not "w Wrocławiu": the same locative preposition rule the
  // H1 already applies, now also in the title and description.
  const prep = wPrep(city.nameDeclinated ?? city.name);
  // Long city names ("Międzyrzeczu Podlaskim") push the full form past the
  // ~60 chars a SERP renders, so the suffix degrades instead of being
  // truncated mid-phrase. The target keyword stays first either way.
  const allVenues = cinemasResponse?.data.flatMap((g) => g.cinemas) ?? [];
  // A city with only chain multiplexes (Iława, content audit #4) has no
  // "kina studyjne"; the title says what the page actually lists.
  const hasIndependent = splitByChain(allVenues).independent.length > 0;
  const titleBase =
    hasIndependent || allVenues.length === 0
      ? `Kina studyjne ${prep} ${city.nameDeclinated}`
      : `Kina ${prep} ${city.nameDeclinated}`;
  // Colon form shared with the cinema titles ("[kino] [miasto]: repertuar
  // i seanse specjalne"), so the keyword phrase reads as one unit. No
  // "godziny seansów": many cities have nothing upcoming at a given time.
  const titleFull = `${titleBase}: repertuar i seanse specjalne`;
  const title =
    titleFull.length <= MAX_TITLE_LENGTH
      ? titleFull
      : `${titleBase}: repertuar`;
  const counts =
    screeningsCount > 0
      ? `${cinemasCount} ${pluralPl(cinemasCount, "kino", "kina", "kin")} i ${screeningsCount} ${pluralPl(screeningsCount, "nadchodzący seans", "nadchodzące seanse", "nadchodzących seansów")}`
      : `${cinemasCount} ${pluralPl(cinemasCount, "kino z seansami specjalnymi", "kina z seansami specjalnymi", "kin z seansami specjalnymi")}`;
  // Lead with what only this city has: its venue names (arthouse first) and
  // a current title. Starting with the counts made ~40% of city snippets
  // open with the same words ("1 kino z seansami specjalnymi..."), so they
  // read as clones on the results page (audit, October 2026).
  // Same degradation as the title: two-word city names ("Ostrowcu
  // Świętokrzyskim") pushed the full form past the snippet limit on ~45
  // pages (Ahrefs, October 2026), so Google cut it mid-sentence. The first
  // candidate that fits wins.
  const { independent, chain } = splitByChain(allVenues);
  // Year-round venues lead: a seasonal open-air series named first ("Kino
  // Letnie") misdescribed the city's arthouse scene in the snippet.
  const yearRound = independent.filter((c) => !c.isOpenAir);
  const openAir = independent.filter((c) => c.isOpenAir);
  const venueNames = [...yearRound, ...chain, ...openAir].map((c) => c.name);
  const venues =
    venueNames.length > 2
      ? `${venueNames.slice(0, 2).join(", ")} i inne kina`
      : venueNames.join(" i ");
  const firstTitle = screeningGroups[0]?.movie.title;
  const titlePart = firstTitle ? `, m.in. „${firstTitle}”` : "";
  const lead = `${venues} ${prep} ${city.nameDeclinated}`;
  // Today's screenings lead when there are any: a live, dated fact that
  // keeps the snippet unique and current (see live-meta).
  const digest = todayDigest(screeningGroups);
  const todayCandidates = digest
    ? todayDigestPhrases(digest).map(
        (phrase) => `${lead}: ${phrase}. Sprawdź repertuar.`
      )
    : [];
  // Without upcoming screenings the counts only repeat the venue names.
  const candidates =
    screeningsCount > 0
      ? [
          ...todayCandidates,
          `${lead}: ${counts}${titlePart}. Seanse specjalne, klasyka i retrospektywy, sprawdź repertuar.`,
          `${lead}: ${counts}${titlePart}. Sprawdź repertuar.`,
          `${lead}: ${counts}. Sprawdź repertuar.`,
          `${counts} ${prep} ${city.nameDeclinated}. Seanse specjalne i klasyka filmowa - sprawdź repertuar.`,
        ]
      : [
          `${lead}: seanse specjalne, klasyka filmowa i retrospektywy. Sprawdź aktualny repertuar.`,
          `${lead}: seanse specjalne i klasyka filmowa. Sprawdź repertuar.`,
          `${counts} ${prep} ${city.nameDeclinated}. Seanse specjalne i klasyka filmowa - sprawdź repertuar.`,
        ];
  const description =
    cinemasCount === 0
      ? `Kina i seanse specjalne ${prep} ${city.nameDeclinated}. Aktualna klasyka filmowa, retrospektywy i pokazy specjalne.`
      : (candidates.find((text) => text.length <= MAX_DESCRIPTION_LENGTH) ??
        candidates[candidates.length - 1]);
  const url = `${SITE_URL}/miasta/${city.slug}`;

  // A city without cinemas is thin content; keep it out of the index. So is
  // one whose cinemas have nothing upcoming and screened nothing in the last
  // RECENT_SCREENINGS_DAYS (same rule as cinema pages, and the API leaves
  // the same cities out of the sitemap). Same call as the page body, deduped
  // by the fetch cache; a failed call never counts as empty.
  // Query-param duplicates (filters) are handled by the canonical alone.
  const recentScreenings =
    screeningsCount === 0
      ? await fetchRecentScreenings({ cityId: city.id.toString() }).catch(
          () => null
        )
      : null;
  // A city with only chain multiplexes has no "kina studyjne" to describe;
  // the API leaves such cities out of the sitemap as well.
  const noindex =
    (cinemasResponse !== null && cinemasCount === 0) ||
    (cinemasResponse !== null && independent.length === 0) ||
    recentScreenings?.length === 0;

  return {
    title,
    description,
    // Self-canonical on noindex pages too: without it they inherited the
    // /miasta hub canonical from the parent layout, which reads as "this
    // page duplicates the hub" next to the noindex.
    alternates: { canonical: url },
    ...(noindex ? NOINDEX_FOLLOW : {}),
    openGraph: {
      ...BASE_OPEN_GRAPH,
      type: "website",
      title,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
};

const CityPage = async ({ params }: CityPageProps) => {
  const { slug } = await params;

  const cityData = await getCityBySlug(slug);
  const city = cityData.city;

  // Full unfiltered repertoire - CityRepertoire narrows it down
  // client-side based on the URL params.
  const [
    { data: cinemaGroups },
    allGenres,
    screenings,
    lastUpdated,
    recentScreenings,
    indexable,
    profile,
  ] = await Promise.all([
    getCinemas({ cityId: city.id.toString() }),
    getGenres(),
    getScreenings({ cityId: city.id.toString() }),
    getScreeningsLastUpdated({ cityId: city.id.toString() }),
    getRecentScreenings({ cityId: city.id.toString() }),
    getIndexableSlugs(),
    getProgrammeProfile({ citySlug: city.slug }),
  ]);
  const isCinemaLinked = (slug: string): boolean =>
    !indexable || indexable.cinemas.has(slug);

  const cinemas = cinemaGroups
    .flatMap((g) => g.cinemas)
    .sort((a, b) => a.name.localeCompare(b.name, "pl"));
  const cinemasCount = cinemas.length;
  const cityForCopy = city.nameDeclinated ?? city.name;
  const { independent: independentCinemas, chain: chainCinemas } =
    splitByChain(cinemas);
  // Seasonal open-air series get their own list: mixed in, ~19 summer
  // screening spots outnumbered Warsaw's year-round arthouse cinemas under
  // the "kina studyjne" heading (content audit, October 2026).
  const yearRoundCinemas = independentCinemas.filter((c) => !c.isOpenAir);
  const openAirCinemas = independentCinemas.filter((c) => c.isOpenAir);
  // Open-air series have no rooms; the comparison covers year-round venues.
  const venues = summarizeCityVenues(
    independentCinemas.filter((cinema) => !cinema.isOpenAir)
  );

  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-4">
        <Breadcrumbs
          items={[
            { name: "Miasta", href: "/miasta" },
            { name: city.name, href: `/miasta/${city.slug}` },
          ]}
        />
      </div>

      <header className="px-6 md:px-12 lg:px-16 pt-6 md:pt-8 pb-12 md:pb-16">
        {city.voivodeship && (
          // Canonical lowercase name reads correctly after "województwo"
          // (both nominative); CSS uppercases it visually.
          <p className="mb-4 md:mb-5 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50">
            Województwo {city.voivodeship}
          </p>
        )}
        {/* H1 carries the target keyword ("kina studyjne w [miasto]") with
            the correct w/we preposition. Multiplexes in the list below sit
            under their own heading, so this one stays accurate. */}
        <PageHeading variant="detail" className="max-w-[20ch]">
          {independentCinemas.length > 0 || cinemasCount === 0
            ? "Kina studyjne"
            : "Kina"}{" "}
          {wPrep(cityForCopy)}&nbsp;{cityForCopy}
        </PageHeading>
        {city.description ? (
          <p className="mt-8 md:mt-10 max-w-[64ch] text-base md:text-lg text-white/65 leading-relaxed">
            {city.description}
          </p>
        ) : (
          cinemasCount > 0 && (
            // Generated intro keeps description-less city pages from being
            // thin content - unique copy via the live cinema count and the
            // nearest upcoming titles.
            <p className="mt-8 md:mt-10 max-w-[64ch] text-base md:text-lg text-white/65 leading-relaxed">
              {cityFallbackIntro(
                wPrep(cityForCopy) === "we" ? "We" : "W",
                cityForCopy,
                cinemasCount,
                screenings
              )}
            </p>
          )
        )}
        {cinemasCount > 0 && isRecentUpdate(lastUpdated) && (
          // Visible freshness signal: newest screening updatedAt for this
          // city. Hidden when unknown or stale: the old fallback printed
          // today's date for a missing value, and a weeks-old date on a
          // repertoire page reads as abandoned (content audit #4).
          <p className="mt-5 text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/50">
            Repertuar zaktualizowano: {formatPlDate(lastUpdated)}
          </p>
        )}
      </header>

      {cinemas.length > 0 && (
        <section className="px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-12 md:pb-16 flex flex-col gap-12 md:gap-16">
          {/* Independent venues first, under the heading people actually
              search for ("kina studyjne w [miasto]"); chain venues keep
              their own heading so neither label misdescribes the rows
              underneath it. */}
          {yearRoundCinemas.length > 0 && (
            <div>
              <h2 className="mb-8 md:mb-10 text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
                Kina studyjne {wPrep(cityForCopy)}&nbsp;{cityForCopy}
              </h2>
              <CinemaCards
                cinemas={yearRoundCinemas}
                isLinked={isCinemaLinked}
              />
            </div>
          )}
          {openAirCinemas.length > 0 && (
            <div>
              <h2 className="mb-8 md:mb-10 text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
                Kino plenerowe i&nbsp;letnie {wPrep(cityForCopy)}&nbsp;
                {cityForCopy}
              </h2>
              <CinemaCards
                cinemas={openAirCinemas}
                isLinked={isCinemaLinked}
              />
            </div>
          )}
          {chainCinemas.length > 0 && (
            <div>
              <h2 className="mb-8 md:mb-10 text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
                Seanse specjalne w&nbsp;kinach sieciowych{" "}
                {wPrep(cityForCopy)}&nbsp;{cityForCopy}
              </h2>
              <CinemaCards cinemas={chainCinemas} isLinked={isCinemaLinked} />
            </div>
          )}
        </section>
      )}

      {/* The repertoire grid is rendered here on the server (passed as
          children) so it lives in the static HTML, crawlable without JS.
          Only the filter controls read useSearchParams, inside their own
          Suspense island in RepertoireSection. */}
      <RepertoireSection
        screenings={screenings}
        genres={allGenres}
        hideCity
        className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-20 md:pb-28"
        heading={
          <h2 className="mb-6 md:mb-8 text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
            Co gra {wPrep(cityForCopy)}&nbsp;{cityForCopy}
          </h2>
        }
        emptyState={
          <EmptyState
            description={
              <>
                Brak seansów pasujących do wybranych filtrów{" "}
                {wPrep(cityForCopy)}&nbsp;{cityForCopy}. Spróbuj zmienić zakres dat, gatunek lub frazę.
              </>
            }
            cta={{ href: "/miasta", label: "Inne miasta" }}
          />
        }
      >
        <RepertoireGrid
          screenings={screenings}
          emptyState={
            // A wrapper element, not a fragment: a multi-child fragment
            // crosses into the client RepertoireSection as an unkeyed array.
            <div>
              <EmptyState
                className="pb-12 md:pb-16"
                description={
                  <>
                    Kina {wPrep(cityForCopy)}&nbsp;{cityForCopy} nie mają teraz
                    zapowiedzianych seansów specjalnych. Repertuar uzupełniamy
                    na bieżąco, zajrzyj ponownie wkrótce.
                  </>
                }
                cta={{ href: "/miasta", label: "Inne miasta" }}
              />
              <NearbyRepertoire
                voivodeship={city.voivodeship}
                cityId={city.id}
              />
            </div>
          }
        />
      </RepertoireSection>

      <RecentRepertoire
        heading={
          <>
            Ostatnio grane {wPrep(cityForCopy)}&nbsp;{cityForCopy}
          </>
        }
        items={recentScreenings}
      />

      <ProgrammeProfile
        heading={
          <>
            Seanse specjalne {inPlace(cityForCopy)} w&nbsp;liczbach
          </>
        }
        profile={profile}
        subject={{ kind: "city", cityLocative: cityForCopy }}
        indexable={indexable}
      />

      <CityVenues
        heading={
          <>
            Sale i&nbsp;kina {inPlace(cityForCopy)}
          </>
        }
        summary={venues}
        isLinked={isCinemaLinked}
      />

      <GuideSection
        heading={
          <>
            Kina {inPlace(cityForCopy)}: przewodnik
          </>
        }
        guide={city.guide}
      />

      {cinemas.some((cinema) => cinema.isOpenAir) && (
        <LinkGrid
          heading={<>Kino plenerowe {inPlace(cityForCopy)}</>}
          description="Letnie pokazy pod gołym niebem: miejsca, repertuar i filmy z ostatniego sezonu."
          items={[
            {
              href: `${OPEN_AIR_PATH}/${city.slug}`,
              label: `Kino plenerowe ${inPlace(cityForCopy)}`,
            },
          ]}
        />
      )}

      <ListingFaq
        heading={<>Pytania o&nbsp;kina {inPlace(cityForCopy)}</>}
        questions={buildCityFaq({
          cityLocative: cityForCopy,
          independentNames: yearRoundCinemas.map((c) => c.name),
          chainNames: chainCinemas.map((c) => c.name),
          screenings,
          lastUpdated,
          profile,
          venues,
        })}
      />

      <Footer />
    </main>
  );
};

export default CityPage;

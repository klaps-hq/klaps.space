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
import { getIndexableSlugs } from "@/lib/sitemap-entries";
import {
  BASE_OPEN_GRAPH,
  NOINDEX_FOLLOW,
  formatPlDate,
  pluralPl,
  wPrep,
} from "@/lib/seo";
import { cityFallbackIntro } from "@/lib/listing-copy";
import { splitByChain } from "@/lib/cinema-chains";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading from "@/components/ui/page-heading";
import SiteHeader from "@/components/common/site-header";
import EmptyState from "@/components/common/empty-state";
import RepertoireSection from "@/components/common/repertoire-section";
import RepertoireGrid from "@/components/common/repertoire-grid";
import RecentRepertoire from "@/components/common/recent-repertoire";
import Footer from "../../(home)/_components/footer";

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
        <div key={cinema.id} className={CARD_CLASS}>
          <span className="text-sm md:text-base font-medium uppercase -tracking-[0.01em] text-white/35">
            {cinema.name}
          </span>
          {cinema.street && (
            <span className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/30">
              {cinema.street}
            </span>
          )}
        </div>
      )
    )}
  </div>
);

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

// Prebuild cities that have cinemas so bots never hit a cold render.
// Other slugs still render on demand (dynamicParams defaults to true).
export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  try {
    const { data: groups } = await getCinemas();
    return groups
      .filter((group) => group.cinemas.length > 0)
      .map((group) => ({ slug: group.city.slug }));
  } catch {
    return [];
  }
};

export const generateMetadata = async ({
  params,
}: CityPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const { city, screenings: rawScreenings } = await getCityBySlug(slug);

  // null means the call failed, which is not the same as "no cinemas": a
  // swallowed error used to noindex the page and ISR cached that verdict.
  const cinemasResponse = await fetchCinemas({
    cityId: city.id.toString(),
  }).catch(() => null);
  const cinemasCount =
    cinemasResponse?.data.flatMap((g) => g.cinemas).length ?? 0;
  const screeningGroups = Array.isArray(rawScreenings)
    ? rawScreenings
    : [...(rawScreenings?.data ?? [])];
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
  const titleBase = `Kina studyjne ${prep} ${city.nameDeclinated}`;
  const titleFull = `${titleBase} - repertuar i seanse specjalne`;
  const title =
    titleFull.length <= MAX_TITLE_LENGTH
      ? titleFull
      : `${titleBase} - repertuar`;
  const counts =
    screeningsCount > 0
      ? `${cinemasCount} ${pluralPl(cinemasCount, "kino", "kina", "kin")} i ${screeningsCount} ${pluralPl(screeningsCount, "nadchodzący seans", "nadchodzące seanse", "nadchodzących seansów")}`
      : `${cinemasCount} ${pluralPl(cinemasCount, "kino z seansami specjalnymi", "kina z seansami specjalnymi", "kin z seansami specjalnymi")}`;
  // Same degradation as the title: two-word city names ("Ostrowcu
  // Świętokrzyskim") pushed the full form past the snippet limit on ~45
  // pages (Ahrefs, October 2026), so Google cut it mid-sentence. The
  // shorter tail keeps the counts and the call to action whole.
  const descriptionFull = `${counts} ${prep} ${city.nameDeclinated}. Seanse specjalne, klasyka filmowa i retrospektywy w kinach studyjnych i sieciowych - sprawdź aktualny repertuar.`;
  const description =
    cinemasCount === 0
      ? `Kina i seanse specjalne ${prep} ${city.nameDeclinated}. Aktualna klasyka filmowa, retrospektywy i pokazy specjalne.`
      : descriptionFull.length <= MAX_DESCRIPTION_LENGTH
        ? descriptionFull
        : `${counts} ${prep} ${city.nameDeclinated}. Seanse specjalne i klasyka filmowa - sprawdź repertuar.`;
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
  const noindex =
    (cinemasResponse !== null && cinemasCount === 0) ||
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
  ] = await Promise.all([
    getCinemas({ cityId: city.id.toString() }),
    getGenres(),
    getScreenings({ cityId: city.id.toString() }),
    getScreeningsLastUpdated({ cityId: city.id.toString() }),
    getRecentScreenings({ cityId: city.id.toString() }),
    getIndexableSlugs(),
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
          Kina studyjne {wPrep(cityForCopy)}&nbsp;{cityForCopy}
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
        {cinemasCount > 0 && (
          // Visible freshness signal: newest screening updatedAt for this city.
          <p className="mt-5 text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/50">
            Repertuar zaktualizowano: {formatPlDate(lastUpdated ?? new Date())}
          </p>
        )}
      </header>

      {cinemas.length > 0 && (
        <section className="px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-12 md:pb-16 flex flex-col gap-12 md:gap-16">
          {/* Independent venues first, under the heading people actually
              search for ("kina studyjne w [miasto]"); chain venues keep
              their own heading so neither label misdescribes the rows
              underneath it. */}
          {independentCinemas.length > 0 && (
            <div>
              <h2 className="mb-8 md:mb-10 text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
                Kina studyjne {wPrep(cityForCopy)}&nbsp;{cityForCopy}
              </h2>
              <CinemaCards
                cinemas={independentCinemas}
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
            <EmptyState
              description={
                <>
                  Kina {wPrep(cityForCopy)}&nbsp;{cityForCopy} nie mają teraz
                  zapowiedzianych seansów specjalnych. Repertuar uzupełniamy na
                  bieżąco, zajrzyj ponownie wkrótce.
                </>
              }
              cta={{ href: "/miasta", label: "Inne miasta" }}
            />
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

      <Footer />
    </main>
  );
};

export default CityPage;

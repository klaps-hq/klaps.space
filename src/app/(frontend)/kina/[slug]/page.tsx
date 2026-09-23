import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import {
  getCinemaPageData,
  getCinemaBySlug,
  getCinemas,
  cinemaRepertoireDateTo,
} from "@/lib/cinemas";
import { getGenres } from "@/lib/genres";
import { getRecentScreenings, getScreenings } from "@/lib/screenings";
import { SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH, pluralPl } from "@/lib/seo";
import { cinemaFallbackIntro } from "@/lib/listing-copy";
import { isChainCinema } from "@/lib/cinema-chains";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading from "@/components/ui/page-heading";
import SiteHeader from "@/components/common/site-header";
import EmptyState from "@/components/common/empty-state";
import RepertoireSection from "@/components/common/repertoire-section";
import RepertoireGrid from "@/components/common/repertoire-grid";
import RecentRepertoire from "@/components/common/recent-repertoire";
import Footer from "../../(home)/_components/footer";
import CinemaMapLazy from "./_components/cinema-map-lazy";

// ISR: cached HTML revalidated every 5 minutes. The repertoire filters
// (genres, dates, search) are applied client-side in CinemaRepertoire,
// so this page never reads searchParams and stays statically cacheable.
export const revalidate = 300;

type CinemaPageProps = {
  params: Promise<{ slug: string }>;
};

// Prebuild all cinema pages so bots never hit a cold render.
export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  try {
    const { data: groups } = await getCinemas();
    return groups.flatMap((group) =>
      group.cinemas.map((cinema) => ({ slug: cinema.slug }))
    );
  } catch {
    return [];
  }
};

const MAX_DESCRIPTION_LENGTH = 160;

// Shared style for the small outbound links in the cinema header (official
// site, Filmweb): subtle until hover, with a nudging arrow.
const CINEMA_LINK_CLASS =
  "group inline-flex items-center gap-1 text-white/70 hover:text-white transition-colors border-b border-transparent hover:border-white/40 pb-0.5";

// Live repertoire counts and an example title make every cinema's
// description unique, which improves SERP CTR and avoids the
// boilerplate-description pattern across 500+ cinema pages.
const buildCinemaDescription = (
  cinemaName: string,
  cityName: string,
  screeningGroups: { movie: { title: string }; screenings: unknown[] }[]
): string => {
  const moviesCount = screeningGroups.length;
  if (moviesCount === 0) {
    return `Repertuar kina ${cinemaName} w ${cityName}: seanse specjalne, klasyka filmowa i retrospektywy. Sprawdź, co aktualnie grają.`;
  }

  const screeningsCount = screeningGroups.reduce(
    (sum, group) => sum + group.screenings.length,
    0
  );
  const counts = `${moviesCount} ${pluralPl(moviesCount, "film", "filmy", "filmów")} i ${screeningsCount} ${pluralPl(screeningsCount, "seans", "seanse", "seansów")}`;
  const base = `Repertuar kina ${cinemaName} w ${cityName}: ${counts}`;
  const suffix = ". Seanse specjalne, klasyka filmowa i retrospektywy.";

  // Add an example title only when it fits the SERP snippet budget.
  const firstTitle = screeningGroups[0]?.movie.title;
  const withTitle = firstTitle
    ? `${base}, m.in. „${firstTitle}"${suffix}`
    : `${base}${suffix}`;

  return withTitle.length <= MAX_DESCRIPTION_LENGTH
    ? withTitle
    : `${base}${suffix}`;
};

export const generateMetadata = async ({
  params,
}: CinemaPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const cinema = await getCinemaBySlug(slug);

  // Same call as the page body: deduped by the fetch cache.
  const screeningGroups = await getScreenings({
    cinemaId: cinema.id.toString(),
    dateTo: cinemaRepertoireDateTo(),
  }).catch(() => []);

  // Locative city name ("w Krakowie", not "w Kraków") for natural phrasing.
  const cityName = cinema.city.nameDeclinated ?? cinema.city.name;
  // Chain venues lead with the special-screenings angle instead of
  // "repertuar": on "cinema city X repertuar" the chain's own page, its
  // Google listing and the ticket sellers own the SERP, and 90 days of GSC
  // show 925 impressions and zero clicks from that group. What this site
  // adds for those venues is the special-screenings programme, so the title
  // targets that. Independent cinemas keep the repertoire phrasing, which
  // is what people search for them.
  // Both variants keep the venue name first and the city in the locative
  // after "w", so the chain wording stays grammatical ("w Katowicach", never
  // "Cinema City Silesia, Katowicach").
  const title = isChainCinema(cinema.name)
    ? `${cinema.name} - seanse specjalne i klasyka w ${cityName}`
    : `${cinema.name} - repertuar seansów specjalnych w ${cityName}`;
  const description = buildCinemaDescription(
    cinema.name,
    cityName,
    screeningGroups
  );
  const url = `${SITE_URL}/kina/${cinema.slug}`;

  return {
    title,
    description,
    // Query-param duplicates (filters) are handled by the canonical alone.
    alternates: { canonical: url },
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

const CinemaPageContent = async ({ slug }: { slug: string }) => {
  const [{ cinema }, allGenres] = await Promise.all([
    getCinemaPageData(slug),
    getGenres(),
  ]);

  // Full unfiltered repertoire, narrowed client-side by the URL params.
  // Sibling venues give each cinema page contextual internal links: /kina is
  // the only other place linking here, and it spreads its authority across
  // 900 links, which is why parts of this page group never get crawled.
  const [screenings, siblingResponse, recentScreenings] = await Promise.all([
    getScreenings({
      cinemaId: cinema.id.toString(),
      dateTo: cinemaRepertoireDateTo(),
    }),
    getCinemas({ cityId: cinema.city.id.toString() }).catch(() => ({
      data: [],
    })),
    getRecentScreenings({ cinemaId: cinema.id.toString() }),
  ]);

  const siblingCinemas = siblingResponse.data
    .flatMap((group) => group.cinemas)
    .filter((item) => item.slug !== cinema.slug)
    .sort((a, b) => a.name.localeCompare(b.name, "pl"))
    .slice(0, 12);

  const hasCoordinates = cinema.latitude !== null && cinema.longitude !== null;
  const cityForCopy = cinema.city.nameDeclinated ?? cinema.city.name;

  // Outbound link in the header: the cinema's own website only. A followed
  // link with a referrer is a trust signal and lets cinemas notice
  // klaps.space in their analytics. Filmweb is intentionally NOT shown.
  const externalLinks = (
    cinema.website ? [{ href: cinema.website, label: "Strona kina" }] : []
  ) as { href: string; label: string }[];

  return (
    <>
      <div className="px-6 md:px-12 lg:px-16 pt-6 md:pt-8 pb-4">
        <Breadcrumbs
          items={[
            { name: "Kina", href: "/kina" },
            { name: cinema.name, href: `/kina/${cinema.slug}` },
          ]}
        />
      </div>

      <header className="px-6 md:px-12 lg:px-16 pt-6 md:pt-8 pb-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-5">
            <PageHeading variant="detail" className="max-w-[20ch]">
              {cinema.name}
            </PageHeading>
            <div className="mt-4 md:mt-5 flex flex-col gap-1.5 text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/50">
              {cinema.street && <span>{cinema.street}</span>}
              <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span>
                  <Link
                    href={`/miasta/${cinema.city.slug}`}
                    className="text-white/70 hover:text-white transition-colors border-b border-transparent hover:border-white/40 pb-0.5"
                  >
                    {cinema.city.name}
                  </Link>
                  {cinema.city.voivodeship && <>, {cinema.city.voivodeship}</>}
                </span>
                {externalLinks.map((link) => (
                  <React.Fragment key={link.href}>
                    <span aria-hidden="true">·</span>
                    {/* Plain <a> (not next/link) for an outbound absolute URL:
                        the Link component adds prefetch/onClick handling meant
                        for internal routes. rel keeps "noopener" only - the
                        referrer is intentional so cinemas see klaps.space in
                        their analytics (see externalLinks comment above). */}
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener"
                      className={CINEMA_LINK_CLASS}
                    >
                      {link.label}
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </a>
                  </React.Fragment>
                ))}
              </span>
            </div>
            {cinema.description ? (
              <p className="mt-8 md:mt-10 max-w-[60ch] text-base md:text-lg text-white/65 leading-relaxed">
                {cinema.description}
              </p>
            ) : (
              // Generated intro keeps description-less cinema pages from
              // being thin content - unique copy via the live repertoire
              // counts, the nearest titles and the dominant genres.
              <p className="mt-8 md:mt-10 max-w-[60ch] text-base md:text-lg text-white/65 leading-relaxed">
                {cinemaFallbackIntro(
                  cinema.name,
                  cityForCopy,
                  isChainCinema(cinema.name),
                  screenings
                )}
              </p>
            )}
          </div>

          {hasCoordinates && (
            <div className="lg:col-span-7">
              <CinemaMapLazy cinema={cinema} />
            </div>
          )}
        </div>
      </header>

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
            Repertuar kina {cinema.name}
          </h2>
        }
        emptyState={
          <EmptyState
            description="Brak seansów pasujących do wybranych filtrów. Spróbuj zmienić zakres dat, gatunek lub frazę."
            cta={{
              href: `/miasta/${cinema.city.slug}`,
              label: `Inne kina w ${cityForCopy}`,
            }}
          />
        }
      >
        <RepertoireGrid
          screenings={screenings}
          emptyState={
            <EmptyState
              description={
                <>
                  {/* Bare name, no "Kino" prefix: many venues are already
                      called "Kino X" and the prefix would double it. */}
                  {cinema.name} nie ma teraz zapowiedzianych seansów
                  specjalnych. Repertuar uzupełniamy na bieżąco, zajrzyj
                  ponownie wkrótce.
                </>
              }
              cta={{
                href: `/miasta/${cinema.city.slug}`,
                label: `Inne kina w ${cityForCopy}`,
              }}
            />
          }
        />
      </RepertoireSection>

      <RecentRepertoire
        heading="Ostatnio w repertuarze"
        items={recentScreenings}
      />

      {siblingCinemas.length > 0 && (
        // Contextual links out of this page: they spread crawl paths across
        // the cinema group instead of funnelling everything through /kina,
        // and the anchors carry the city phrase the hub links lack.
        <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-20 md:pb-28">
          <div className="mb-8 md:mb-10 flex items-end justify-between gap-6 flex-wrap">
            <h2 className="text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
              Inne kina w&nbsp;{cityForCopy}
            </h2>
            <Link
              href={`/miasta/${cinema.city.slug}`}
              className="group inline-flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.28em] text-white/55 hover:text-white transition-colors border-b border-transparent hover:border-white/40 pb-0.5"
            >
              Kina studyjne w&nbsp;{cityForCopy}
              <ArrowUpRight
                aria-hidden="true"
                className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-px pl-px">
            {siblingCinemas.map((item) => (
              <Link
                key={item.id}
                href={`/kina/${item.slug}`}
                className="group bg-black hover:bg-white/[0.04] transition-colors border border-[#1a1a1a] -mt-px -ml-px px-4 md:px-5 py-5 md:py-6 flex flex-col gap-1"
              >
                <span className="text-sm md:text-base font-medium uppercase -tracking-[0.01em] text-white/65 group-hover:text-white transition-colors">
                  {item.name}
                </span>
                {item.street && (
                  <span className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/50">
                    {item.street}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

const CinemaPage = async ({ params }: CinemaPageProps) => {
  const { slug } = await params;

  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />
      {/* No Suspense around the page content: on a cold render (first hit
          after a deploy) the streamed shell would carry only the loader,
          so crawlers that read raw HTML would see no h1, breadcrumbs or
          JSON-LD. Blocking on data is fine here because ISR serves cached
          HTML for every later request. */}
      <CinemaPageContent slug={slug} />
      <Footer />
    </main>
  );
};

export default CinemaPage;

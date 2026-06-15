import React, { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { getCinemaPageData, getCinemaBySlug, getCinemas } from "@/lib/cinemas";
import { getGenres } from "@/lib/genres";
import { getScreenings } from "@/lib/screenings";
import { SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH, pluralPl } from "@/lib/seo";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading from "@/components/ui/page-heading";
import SiteHeader from "@/components/common/site-header";
import SectionLoader from "@/components/ui/section-loader";
import Footer from "../../(home)/_components/footer";
import CinemaMapLazy from "./_components/cinema-map-lazy";
import CinemaRepertoire from "./_components/cinema-repertoire";

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
  }).catch(() => []);

  // Locative city name ("w Krakowie", not "w Kraków") for natural phrasing.
  const cityName = cinema.city.nameDeclinated ?? cinema.city.name;
  // "repertuar seansów specjalnych", not "kino studyjne": the catalog
  // includes multiplexes, and GSC queries follow the "kino X repertuar"
  // pattern, so the title carries that keyword instead.
  const title = `${cinema.name} - repertuar seansów specjalnych w ${cityName}`;
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

  // Full unfiltered repertoire - CinemaRepertoire narrows it down
  // client-side based on the URL params.
  const screenings = await getScreenings({
    cinemaId: cinema.id.toString(),
  });

  const hasCoordinates = cinema.latitude !== null && cinema.longitude !== null;
  const cityForCopy = cinema.city.nameDeclinated ?? cinema.city.name;

  // Outbound links in the header: the cinema's own site (preferred) and its
  // Filmweb listing. Followed links with a referrer are a trust signal and
  // let cinemas notice klaps.space in their analytics.
  const externalLinks = [
    cinema.website && { href: cinema.website, label: "Strona kina" },
    cinema.filmwebUrl && { href: cinema.filmwebUrl, label: "Filmweb" },
  ].filter(Boolean) as { href: string; label: string }[];

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
                    <Link
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
                    </Link>
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
              // being thin content.
              <p className="mt-8 md:mt-10 max-w-[60ch] text-base md:text-lg text-white/65 leading-relaxed">
                {cinema.name} to kino w&nbsp;{cityForCopy}, w&nbsp;którym
                odbywają się seanse specjalne. Sprawdź aktualny repertuar
                pokazów, retrospektyw i&nbsp;klasyki filmowej na dużym ekranie.
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

      {/* Suspense: useSearchParams() in the client repertoire needs a
          boundary during static prerender (CSR bailout). */}
      <Suspense fallback={<SectionLoader label="Ładowanie repertuaru" />}>
        <CinemaRepertoire
          cinemaName={cinema.name}
          citySlug={cinema.city.slug}
          cityForCopy={cityForCopy}
          screenings={screenings}
          genres={allGenres}
        />
      </Suspense>
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

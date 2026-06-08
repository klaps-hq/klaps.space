import React, { Suspense } from "react";
import { Metadata } from "next";
import {
  getDirectorPageData,
  getDirectors,
  getMoviesByDirector,
  getScreeningsByDirector,
  getDirectorScreeningsLastUpdated,
  DIRECTOR_INDEX_THRESHOLD,
} from "@/lib/directors";
import { getGenres } from "@/lib/genres";
import { SITE_URL } from "@/lib/site-config";
import {
  BASE_OPEN_GRAPH,
  NOINDEX_FOLLOW,
  clampText,
  formatPlDate,
  pluralPl,
} from "@/lib/seo";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading from "@/components/ui/page-heading";
import SiteHeader from "@/components/common/site-header";
import SectionLoader from "@/components/ui/section-loader";
import DirectorPhoto from "@/components/common/director-photo";
import MoviesGrid from "@/app/filmy/_components/movies-grid";
import Footer from "../../(home)/_components/footer";
import DirectorRepertoire from "./_components/director-repertoire";

// ISR: cached HTML revalidated every 5 minutes. The repertoire filters
// (city, genres, dates, search) are applied client-side in
// DirectorRepertoire, so this page never reads searchParams or cookies
// and stays statically cacheable.
export const revalidate = 300;

type DirectorPageProps = {
  params: Promise<{ slug: string }>;
};

// Prebuild only indexable directors (>= threshold upcoming screenings); the
// long tail renders on demand (dynamicParams defaults to true).
export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  try {
    const { data } = await getDirectors();
    return data
      .filter((d) => d.upcomingScreeningsCount >= DIRECTOR_INDEX_THRESHOLD)
      .map((d) => ({ slug: d.slug }));
  } catch {
    return [];
  }
};

export const generateMetadata = async ({
  params,
}: DirectorPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const director = await getDirectorPageData(slug);

  const title = `${director.name} - filmy i seanse w kinach studyjnych`;
  const description = director.bio
    ? clampText(director.bio)
    : `Filmy w reżyserii ${director.name} na seansach specjalnych w kinach studyjnych w Polsce. Retrospektywy, klasyka filmowa i kino autorskie na dużym ekranie.`;
  const url = `${SITE_URL}/rezyserzy/${director.slug}`;

  // Thin until the director has enough upcoming screenings; keep those pages
  // out of the index (matches the sitemap threshold). Query-param duplicates
  // (filters) on indexable pages are handled by the canonical alone.
  const noindex = director.upcomingScreeningsCount < DIRECTOR_INDEX_THRESHOLD;

  return {
    title,
    description,
    ...(noindex ? NOINDEX_FOLLOW : { alternates: { canonical: url } }),
    openGraph: {
      ...BASE_OPEN_GRAPH,
      type: "profile",
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

const DirectorPageContent = async ({ slug }: { slug: string }) => {
  const director = await getDirectorPageData(slug);

  // Full unfiltered repertoire - DirectorRepertoire narrows it down
  // client-side based on the URL params / preferred city.
  const [moviesResponse, allGenres, screenings, lastUpdated] =
    await Promise.all([
      getMoviesByDirector(director.id),
      getGenres(),
      getScreeningsByDirector(director.id),
      getDirectorScreeningsLastUpdated(director.id),
    ]);

  const movies = moviesResponse.data;
  const moviesCount = moviesResponse.meta.total || movies.length;

  return (
    <>
      <div className="px-6 md:px-12 lg:px-16 pt-6 md:pt-8 pb-4">
        <Breadcrumbs
          items={[
            { name: "Reżyserzy", href: "/rezyserzy" },
            { name: director.name },
          ]}
        />
      </div>

      <header className="px-6 md:px-12 lg:px-16 pt-6 md:pt-8 pb-12 md:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="relative aspect-[3/4] max-w-[320px] overflow-hidden border border-white/10 bg-white/[0.03]">
              <DirectorPhoto
                photoUrl={director.photoUrl}
                name={director.name}
                width={480}
                height={640}
                priority
                sizes="(max-width: 1024px) 60vw, 320px"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-8 xl:col-span-9">
            <p className="mb-4 md:mb-5 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/45">
              Reżyser
            </p>
            <PageHeading variant="detail" className="max-w-[20ch]">
              {director.name}
            </PageHeading>
            {director.bio ? (
              <p className="mt-8 md:mt-10 max-w-[64ch] text-base md:text-lg text-white/65 leading-relaxed">
                {director.bio}
              </p>
            ) : (
              <p className="mt-8 md:mt-10 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
                Filmy w&nbsp;reżyserii {director.name} pokazywane w&nbsp;polskich
                kinach studyjnych. Sprawdź filmografię oraz aktualny repertuar
                seansów specjalnych, retrospektyw i&nbsp;klasyki filmowej.
              </p>
            )}
            {director.upcomingScreeningsCount > 0 && (
              // Visible freshness signal: newest screening updatedAt for this
              // director, mirroring dateModified in JSON-LD.
              <p className="mt-5 text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/35">
                Repertuar zaktualizowano:{" "}
                {formatPlDate(lastUpdated ?? new Date())}
              </p>
            )}
          </div>
        </div>
      </header>

      {movies.length > 0 && (
        <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-12 md:pb-16">
          <div className="mb-8 md:mb-10 flex items-end justify-between gap-6 flex-wrap">
            <h2 className="text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
              Filmografia
            </h2>
            <span className="text-[10px] md:text-xs uppercase tracking-[0.28em] text-white/45">
              {moviesCount} {pluralPl(moviesCount, "film", "filmy", "filmów")}
            </span>
          </div>
          <MoviesGrid movies={movies} showHoverOverlay={false} />
        </section>
      )}

      {/* Suspense: useSearchParams() in the client repertoire needs a
          boundary during static prerender (CSR bailout). */}
      <Suspense fallback={<SectionLoader label="Ładowanie repertuaru" />}>
        <DirectorRepertoire
          directorName={director.name}
          screenings={screenings}
          genres={allGenres}
        />
      </Suspense>
    </>
  );
};

const DirectorPage = async ({ params }: DirectorPageProps) => {
  const { slug } = await params;

  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />
      <Suspense fallback={<SectionLoader label="Ładowanie reżysera" />}>
        <DirectorPageContent slug={slug} />
      </Suspense>
      <Footer />
    </main>
  );
};

export default DirectorPage;

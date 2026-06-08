import React, { Suspense } from "react";
import { Metadata } from "next";
import {
  getDirectorPageData,
  getDirectors,
  getMoviesByDirector,
  getScreeningsByDirector,
  DIRECTOR_INDEX_THRESHOLD,
} from "@/lib/directors";
import { getGenres } from "@/lib/genres";
import { SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH, NOINDEX_FOLLOW, clampText } from "@/lib/seo";
import { directorFallbackIntro } from "@/lib/listing-copy";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading from "@/components/ui/page-heading";
import SiteHeader from "@/components/common/site-header";
import SectionLoader from "@/components/ui/section-loader";
import DirectorPhoto from "@/components/common/director-photo";
import RelatedMovies from "@/app/filmy/[slug]/_components/related-movies";
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
  const [moviesResponse, allGenres, screenings] = await Promise.all([
    getMoviesByDirector(director.id),
    getGenres(),
    getScreeningsByDirector(director.id),
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
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          <div className="w-full max-w-[300px] shrink-0">
            {/* Grayscale portrait matches the B&W directors grid; colour
                returns on hover for a subtle moment of life. */}
            <div className="group relative aspect-[3/4] overflow-hidden bg-white/[0.03] ring-1 ring-inset ring-white/10">
              <DirectorPhoto
                photoUrl={director.photoUrl}
                name={director.name}
                width={480}
                height={640}
                priority
                sizes="(max-width: 1024px) 60vw, 300px"
                className="w-full h-full object-cover grayscale transition-[filter,scale] duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.02]"
              />
            </div>
          </div>

          <div className="flex-1 min-w-0">
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
                {directorFallbackIntro(director.name, moviesCount, movies)}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Suspense: useSearchParams() in the client repertoire needs a
          boundary during static prerender (CSR bailout). */}
      <Suspense fallback={<SectionLoader label="Ładowanie repertuaru" />}>
        <DirectorRepertoire
          directorName={director.name}
          screenings={screenings}
          genres={allGenres}
        />
      </Suspense>

      {movies.length > 0 && (
        <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-16 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8 lg:gap-x-12">
            <div className="lg:col-span-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium uppercase -tracking-[0.02em] leading-[1] text-white">
                Filmografia
              </h2>
            </div>
            <div className="lg:col-span-8">
              <RelatedMovies movies={[...movies]} />
            </div>
          </div>
        </section>
      )}
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

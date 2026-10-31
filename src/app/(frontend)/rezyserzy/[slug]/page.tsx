import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  getDirectorPageData,
  getDirectors,
  getMoviesByDirector,
  getScreeningsByDirector,
  isDirectorIndexable,
} from "@/lib/directors";
import { getGenres } from "@/lib/genres";
import { SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH, NOINDEX_FOLLOW, clampToSentences } from "@/lib/seo";
import { directorFallbackIntro } from "@/lib/listing-copy";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading, { PageHeadingMuted } from "@/components/ui/page-heading";
import SiteHeader from "@/components/common/site-header";
import DirectorPhoto from "@/components/common/director-photo";
import RelatedMovies from "@/app/filmy/[slug]/_components/related-movies";
import Footer from "../../(home)/_components/footer";
import EmptyState from "@/components/common/empty-state";
import RepertoireSection from "@/components/common/repertoire-section";
import RepertoireGrid from "@/components/common/repertoire-grid";
import ProgrammeProfile from "@/components/common/programme-profile";
import { getProgrammeProfile } from "@/lib/programme-profile";
import { getIndexableSlugs } from "@/lib/sitemap-entries";
import { WAJDA_SLUG, WAJDA_YEAR, WAJDA_YEAR_PATH } from "@/lib/wajda-year";

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
      .filter((d) => isDirectorIndexable(d))
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
    ? clampToSentences(director.bio)
    : `${director.name}: filmy na seansach specjalnych w kinach studyjnych w Polsce. Retrospektywy, klasyka filmowa i kino autorskie na dużym ekranie.`;
  const url = `${SITE_URL}/rezyserzy/${director.slug}`;

  // Thin until the director has enough upcoming screenings; keep those pages
  // out of the index (matches the sitemap threshold). Query-param duplicates
  // (filters) on indexable pages are handled by the canonical alone.
  //
  // `upcomingScreeningsCount` is the right source here and needs no
  // cross-check against the rendered page: this template shows two card
  // grids - the repertoire and, below "Filmografia", the director's whole
  // back catalogue - so counting cards measures the catalogue, not what is
  // playing. Kieslowski renders 15 cards and has 1 film in the repertoire.
  const noindex = !isDirectorIndexable(director);

  return {
    title,
    description,
    // Self-canonical on noindex pages too, instead of inheriting the hub's.
    alternates: { canonical: url },
    ...(noindex ? NOINDEX_FOLLOW : {}),
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
  const [moviesResponse, allGenres, screenings, profile, indexable] =
    await Promise.all([
      getMoviesByDirector(director.id),
      getGenres(),
      getScreeningsByDirector(director.id),
      getProgrammeProfile({ directorSlug: director.slug }),
      getIndexableSlugs(),
    ]);

  const movies = moviesResponse.data;
  const moviesCount = moviesResponse.meta.total || movies.length;
  // Only films in the repertoire get a link from the filmography: the rest
  // render noindex, and linking them chained crawlers through pages Google
  // will not index (see RelatedMovies).
  const screeningSlugs = new Set(screenings.map((group) => group.movie.slug));

  return (
    <>
      <div className="px-6 md:px-12 lg:px-16 pt-6 md:pt-8 pb-4">
        <Breadcrumbs
          items={[
            { name: "Reżyserzy", href: "/rezyserzy" },
            { name: director.name, href: `/rezyserzy/${director.slug}` },
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
            <p className="mb-4 md:mb-5 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50">
              Reżyser
            </p>
            {/* The name alone competes with Wikipedia/Filmweb for a query
                whose intent is a biography, not a screening. The muted second
                line carries the phrase this page can actually rank for and
                keeps the name in the nominative (API names are not
                declined). */}
            <PageHeading variant="detail" className="max-w-[20ch]">
              {director.name}
              {/* Separator for the text crawlers read; visually the second
                  line is already set apart. */}
              <span className="sr-only"> -</span>
              <PageHeadingMuted className="mt-2 md:mt-3 text-xl md:text-3xl lg:text-4xl normal-case tracking-tight">
                Filmy i&nbsp;seanse w&nbsp;kinach studyjnych
              </PageHeadingMuted>
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

      {/* The repertoire grid is rendered here on the server (passed as
          children) so it lives in the static HTML, crawlable without JS.
          Only the filter controls read useSearchParams, inside their own
          Suspense island in RepertoireSection. */}
      <RepertoireSection
        screenings={screenings}
        genres={allGenres}
        usePreferredLocation
        className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-20 md:pb-28"
        heading={
          <h2 className="mb-6 md:mb-8 text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
            Repertuar - {director.name}
          </h2>
        }
        emptyState={
          <EmptyState
            description={
              <>
                Brak seansów filmów w&nbsp;reżyserii {director.name} pasujących
                do wybranych filtrów. Spróbuj zmienić zakres dat, miasto lub
                frazę.
              </>
            }
            cta={{ href: "/rezyserzy", label: "Inni reżyserzy" }}
          />
        }
      >
        <RepertoireGrid
          screenings={screenings}
          emptyState={
            <EmptyState
              description={
                <>
                  Filmy w&nbsp;reżyserii {director.name} nie mają teraz
                  zapowiedzianych seansów. Repertuar uzupełniamy na bieżąco,
                  zajrzyj ponownie wkrótce.
                </>
              }
              cta={{ href: "/rezyserzy", label: "Inni reżyserzy" }}
            />
          }
        />
      </RepertoireSection>

      <ProgrammeProfile
        heading={<>{director.name} na seansach specjalnych w&nbsp;liczbach</>}
        profile={profile}
        subject={{ kind: "director", directorName: director.name }}
        indexable={indexable}
      />

      {director.slug === WAJDA_SLUG && (
        <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 py-10 md:py-14">
          <Link
            href={WAJDA_YEAR_PATH}
            className="group flex items-center justify-between gap-6 text-white"
          >
            <span className="flex flex-col gap-2">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50">
                Rok Andrzeja Wajdy {WAJDA_YEAR}
              </span>
              <span className="text-2xl md:text-4xl font-medium -tracking-[0.02em] leading-tight underline decoration-white/25 underline-offset-4 group-hover:decoration-white transition-colors">
                Rok Wajdy w&nbsp;liczbach: seanse miesiąc po miesiącu, miasta
                i&nbsp;kina
              </span>
            </span>
            <ArrowRight
              aria-hidden="true"
              className="shrink-0 size-6 md:size-8 text-white/50 group-hover:text-white transition-colors"
            />
          </Link>
        </section>
      )}

      {movies.length > 0 && (
        <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-16 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8 lg:gap-x-12">
            <div className="lg:col-span-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium uppercase -tracking-[0.02em] leading-[1] text-white">
                Filmografia
              </h2>
            </div>
            <div className="lg:col-span-8">
              <RelatedMovies
                movies={[...movies]}
                linkableSlugs={screeningSlugs}
              />
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
      {/* No Suspense around the page content: on a cold render the
          streamed shell would carry only the loader, so crawlers that
          read raw HTML would see no h1 or breadcrumbs. The inner
          repertoire boundary above stays (useSearchParams bailout). */}
      <DirectorPageContent slug={slug} />
      <Footer />
    </main>
  );
};

export default DirectorPage;

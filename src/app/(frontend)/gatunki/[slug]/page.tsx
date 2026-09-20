import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getGenrePageData, getGenres } from "@/lib/genres";
import { getScreenings } from "@/lib/screenings";
import { SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH, NOINDEX_FOLLOW, pluralPl } from "@/lib/seo";
import { genreFallbackIntro } from "@/lib/listing-copy";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading from "@/components/ui/page-heading";
import SiteHeader from "@/components/common/site-header";
import EmptyState from "@/components/common/empty-state";
import RepertoireSection from "@/components/common/repertoire-section";
import RepertoireGrid from "@/components/common/repertoire-grid";
import Footer from "../../(home)/_components/footer";

// ISR: cached HTML revalidated every 5 minutes. The repertoire filters
// (city, dates, search) are applied client-side in GenreRepertoire,
// so this page never reads searchParams or cookies and stays cacheable.
export const revalidate = 300;

type GenrePageProps = {
  params: Promise<{ slug: string }>;
};

// Prebuild all genre pages so bots never hit a cold render.
export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  try {
    const genres = await getGenres();
    return genres.map((genre) => ({ slug: genre.slug }));
  } catch {
    return [];
  }
};

export const generateMetadata = async ({
  params,
}: GenrePageProps): Promise<Metadata> => {
  const { slug } = await params;
  const genre = await getGenrePageData(slug);

  // This page renders upcoming screenings and nothing else, so the count
  // that drives both the description and the index decision has to come from
  // the screenings feed rather than the movie catalogue. Counting catalogue
  // entries kept genres whose films are not playing anywhere - /gatunki/western,
  // zero screenings and 151 words of boilerplate - indexable and in the
  // sitemap. Next's fetch memoization deduplicates this against the identical
  // call in the page render below.
  const screeningGroups = await getScreenings({
    genreId: genre.id.toString(),
  });
  const moviesCount = screeningGroups.length;
  const screeningsCount = screeningGroups.reduce(
    (sum, group) => sum + group.screenings.length,
    0
  );

  const genreLower = genre.name.toLowerCase();
  const title = `${genre.name} - filmy w kinach studyjnych`;
  const description =
    moviesCount > 0
      ? `${moviesCount} ${pluralPl(moviesCount, "film", "filmy", "filmów")} i ${screeningsCount} ${pluralPl(screeningsCount, "seans", "seanse", "seansów")} z gatunku ${genreLower} w kinach studyjnych w Polsce. Seanse specjalne, klasyka filmowa i retrospektywy - ${genreLower} na dużym ekranie.`
      : `Filmy z gatunku ${genreLower} dostępne w kinach studyjnych w Polsce. Seanse specjalne, klasyka filmowa i retrospektywy.`;
  const url = `${SITE_URL}/gatunki/${genre.slug}`;

  // A genre nobody is screening right now renders an empty grid; that is
  // thin content, so keep it out of the index until it has something to show.
  // Query-param duplicates (filters) are handled by the canonical alone.
  const noindex = moviesCount === 0;

  return {
    title,
    description,
    ...(noindex ? NOINDEX_FOLLOW : { alternates: { canonical: url } }),
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

const GenrePage = async ({ params }: GenrePageProps) => {
  const { slug } = await params;

  const genre = await getGenrePageData(slug);

  // Nationwide, unfiltered repertoire - GenreRepertoire narrows it down
  // client-side (preferred city, dates, search).
  const [allGenres, screenings] = await Promise.all([
    getGenres(),
    getScreenings({ genreId: genre.id.toString() }),
  ]);

  const relatedGenres = allGenres
    .filter((item) => item.slug !== genre.slug)
    .sort((a, b) => a.name.localeCompare(b.name, "pl"))
    .slice(0, 10);

  const genreNameLower = genre.name.toLowerCase();

  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-4">
        <Breadcrumbs
          items={[
            { name: "Gatunki", href: "/gatunki" },
            { name: genre.name, href: `/gatunki/${genre.slug}` },
          ]}
        />
      </div>

      <header className="px-6 md:px-12 lg:px-16 pt-6 md:pt-8 pb-8 md:pb-12">
        <PageHeading variant="detail" className="max-w-[20ch]">
          Filmy z&nbsp;gatunku {genreNameLower}
        </PageHeading>
        {genre.description ? (
          <p className="mt-8 md:mt-10 max-w-[64ch] text-base md:text-lg text-white/65 leading-relaxed">
            {genre.description}
          </p>
        ) : (
          <p className="mt-8 md:mt-10 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
            {genreFallbackIntro(genreNameLower, screenings)}
          </p>
        )}
      </header>

      {/* The repertoire grid is rendered here on the server (passed as
          children) so it lives in the static HTML, crawlable without JS.
          Only the filter controls read useSearchParams, inside their own
          Suspense island in RepertoireSection. */}
      <RepertoireSection
        screenings={screenings}
        genres={allGenres}
        hideGenres
        usePreferredLocation
        className="px-6 md:px-12 lg:px-16 pb-20 md:pb-28"
        heading={
          // Without this the page jumped H1 to the cards' H3, which breaks
          // heading order and left the listing unlabelled.
          <h2 className="mb-6 md:mb-8 text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
            Seanse z&nbsp;gatunku {genreNameLower}
          </h2>
        }
        emptyState={
          <EmptyState
            description={
              <>
                Brak seansów z&nbsp;gatunku {genreNameLower} pasujących do
                wybranych filtrów. Spróbuj zmienić zakres dat, miasto lub
                frazę.
              </>
            }
            cta={{ href: "/gatunki", label: "Inne gatunki" }}
          />
        }
      >
        <RepertoireGrid
          screenings={screenings}
          emptyState={
            <EmptyState
              description={
                <>
                  Nie ma teraz zapowiedzianych seansów z&nbsp;gatunku{" "}
                  {genreNameLower}. Repertuar uzupełniamy na bieżąco, zajrzyj
                  ponownie wkrótce.
                </>
              }
              cta={{ href: "/gatunki", label: "Inne gatunki" }}
            />
          }
        />
      </RepertoireSection>

      {relatedGenres.length > 0 && (
        <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-20 md:pb-28">
          <div className="mb-8 md:mb-10 flex items-end justify-between gap-6 flex-wrap">
            <h2 className="text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
              Inne gatunki
            </h2>
            <Link
              href="/gatunki"
              className="group inline-flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.28em] text-white/55 hover:text-white transition-colors border-b border-transparent hover:border-white/40 pb-0.5"
            >
              Wszystkie gatunki
              <ArrowRight
                aria-hidden="true"
                className="size-3.5 shrink-0 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 border-t border-l border-white/10">
            {relatedGenres.map((item) => (
              <Link
                key={item.id}
                href={`/gatunki/${item.slug}`}
                className="group bg-black hover:bg-white/[0.04] transition-colors border-r border-b border-white/10 px-4 md:px-5 py-5 md:py-6 flex items-center"
              >
                <span className="text-sm md:text-base font-medium uppercase -tracking-[0.01em] text-white/65 group-hover:text-white transition-colors">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
};

export default GenrePage;

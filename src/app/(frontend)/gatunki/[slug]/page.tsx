import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { getGenrePageData, getGenres } from "@/lib/genres";
import { getMovies } from "@/lib/movies";
import { getScreenings } from "@/lib/screenings";
import { getPreferredCityId } from "@/lib/get-preferred-city";
import { SITE_URL } from "@/lib/site-config";
import {
  BASE_OPEN_GRAPH,
  NOINDEX_FOLLOW,
  hasQueryParams,
  pluralPl,
} from "@/lib/seo";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import SiteHeader from "@/components/common/site-header";
import Footer from "../../(home)/_components/footer";
import GenreRepertoire from "./_components/genre-repertoire";

export const revalidate = 300;

type SearchParams = {
  city?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
};

type GenrePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
};

export const generateMetadata = async ({
  params,
  searchParams,
}: GenrePageProps): Promise<Metadata> => {
  const [{ slug }, queryParams] = await Promise.all([params, searchParams]);
  const genre = await getGenrePageData(slug);

  const { meta } = await getMovies({
    genreId: genre.id.toString(),
    limit: 1,
  });
  const moviesCount = meta.total;

  const genreLower = genre.name.toLowerCase();
  const title = `${genre.name} - filmy w kinach studyjnych`;
  const description =
    moviesCount > 0
      ? `${moviesCount} ${pluralPl(moviesCount, "film", "filmy", "filmów")} z gatunku ${genreLower} w kinach studyjnych w Polsce. Seanse specjalne, klasyka filmowa i retrospektywy - ${genreLower} na dużym ekranie.`
      : `Filmy z gatunku ${genreLower} dostępne w kinach studyjnych w Polsce. Seanse specjalne, klasyka filmowa i retrospektywy.`;
  const url = `${SITE_URL}/gatunki/${genre.slug}`;

  // A genre with no movies is thin content; keep it out of the index.
  const noindex = moviesCount === 0 || hasQueryParams(queryParams);

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

const GenrePage = async ({ params, searchParams }: GenrePageProps) => {
  const { slug } = await params;
  const sp = await searchParams;

  const genre = await getGenrePageData(slug);

  const cityId = await getPreferredCityId({ city: sp.city });

  const [allGenres, screenings] = await Promise.all([
    getGenres(),
    getScreenings({
      genreId: genre.id.toString(),
      cityId: cityId ?? null,
      dateFrom: sp.dateFrom,
      dateTo: sp.dateTo,
      search: sp.search,
    }),
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
            { name: genre.name },
          ]}
        />
      </div>

      <header className="px-6 md:px-12 lg:px-16 pt-6 md:pt-8 pb-12 md:pb-16">
        <Link
          href="/gatunki"
          className="inline-block w-fit text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40 hover:text-white/80 transition-colors mb-3 md:mb-4"
        >
          Gatunek
        </Link>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium uppercase -tracking-[0.03em] leading-[0.95] text-white max-w-[20ch]">
          {genre.name}
        </h1>
        {genre.description ? (
          <p className="mt-8 md:mt-10 max-w-[64ch] text-base md:text-lg text-white/65 leading-relaxed">
            {genre.description}
          </p>
        ) : (
          <p className="mt-8 md:mt-10 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
            Filmy z&nbsp;gatunku {genreNameLower} pokazywane aktualnie
            w&nbsp;polskich kinach studyjnych. Filtruj po mieście, dacie
            lub frazie poniżej.
          </p>
        )}
      </header>

      <GenreRepertoire
        genreName={genre.name}
        genreNameLower={genreNameLower}
        screenings={screenings}
        genres={allGenres}
      />

      {relatedGenres.length > 0 && (
        <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-20 md:pb-28">
          <div className="mb-8 md:mb-10 flex items-end justify-between gap-6 flex-wrap">
            <h2 className="text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
              Inne gatunki
            </h2>
            <Link
              href="/gatunki"
              className="group inline-flex items-baseline gap-2 text-[10px] md:text-xs uppercase tracking-[0.28em] text-white/55 hover:text-white transition-colors border-b border-transparent hover:border-white/40 pb-0.5"
            >
              Wszystkie gatunki
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1"
              >
                →
              </span>
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

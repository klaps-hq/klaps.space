import { getMovieBySlug } from "@/lib/movies";
import { getMovieScreenings } from "@/lib/screenings";
import { tmdbImageUrl } from "@/lib/tmdb";
import { SITE_URL } from "@/lib/site-config";
import { buildScreeningEventsJsonLd } from "@/lib/screening-event-jsonld";
import { IMovie } from "@/interfaces/IMovies";
import { IScreening } from "@/interfaces/IScreenings";
import JsonLd from "@/components/common/json-ld";

type MovieLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

const buildMovieJsonLd = (movie: IMovie) => {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    url: `${SITE_URL}/filmy/${movie.slug}`,
    description: movie.description ?? undefined,
    datePublished: movie.productionYear.toString(),
    genre: movie.genres.map((g) => g.name),
  };

  if (movie.titleOriginal) {
    jsonLd.alternateName = movie.titleOriginal;
  }

  if (movie.duration) {
    const hours = Math.floor(movie.duration / 60);
    const minutes = movie.duration % 60;
    jsonLd.duration = `PT${hours}H${minutes}M`;
  }

  if (movie.posterUrl) {
    jsonLd.image = tmdbImageUrl(movie.posterUrl, "w780");
  }

  if (movie.directors?.length) {
    jsonLd.director = movie.directors.map((d) => ({
      "@type": "Person",
      name: d.name,
    }));
  }

  if (movie.actors?.length) {
    jsonLd.actor = movie.actors.map((a) => ({
      "@type": "Person",
      name: a.name,
    }));
  }

  // Audience rating - also rendered visibly in MovieAbout, as Google
  // requires structured data to reflect on-page content.
  const userRating = movie.ratings?.users;
  if (userRating && userRating.votes > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: Number(userRating.score.toFixed(1)),
      ratingCount: userRating.votes,
      bestRating: 10,
      worstRating: 1,
    };
  }

  if (movie.filmwebUrl) {
    jsonLd.sameAs = [movie.filmwebUrl];
  }

  return jsonLd;
};

const buildMovieScreeningEvents = (movie: IMovie, screenings: IScreening[]) =>
  buildScreeningEventsJsonLd(
    screenings.map((screening) => ({
      movie: {
        title: movie.title,
        slug: movie.slug,
        duration: movie.duration,
      },
      cinema: {
        name: screening.cinema.name,
        slug: screening.cinema.slug,
        street: screening.cinema.street,
        cityName: screening.cinema.city.name,
      },
      dateTime: screening.dateTime,
      ticketUrl: screening.ticketUrl,
    })),
    `${SITE_URL}/filmy/${movie.slug}`
  );

export default async function MovieLayout({
  children,
  params,
}: Readonly<MovieLayoutProps>) {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);
  const screenings = await getMovieScreenings({
    movieId: movie.id.toString(),
  }).catch(() => []);

  const events = buildMovieScreeningEvents(movie, screenings);

  return (
    <>
      <JsonLd data={buildMovieJsonLd(movie)} />
      {/* BreadcrumbList comes from the visible Breadcrumbs component. */}
      {events.length > 0 && <JsonLd data={events} />}
      {children}
    </>
  );
}

import { getMovieBySlug } from "@/lib/movies";
import { getMovieScreenings } from "@/lib/screenings";
import { tmdbImageUrl } from "@/lib/tmdb";
import { SITE_URL } from "@/lib/site-config";
import { IMovie } from "@/interfaces/IMovies";
import { IScreening } from "@/interfaces/IScreenings";
import JsonLd from "@/components/common/json-ld";

// Keep the events payload reasonable — soonest screenings first.
const MAX_JSONLD_EVENTS = 50;

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
    dateCreated: movie.productionYear.toString(),
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

  // Audience rating — also rendered visibly in MovieAbout, as Google
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

const buildMovieBreadcrumbJsonLd = (movie: IMovie) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Strona główna",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Seanse",
      item: `${SITE_URL}/seanse`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: movie.title,
    },
  ],
});

const buildScreeningEventsJsonLd = (movie: IMovie, screenings: IScreening[]) => {
  const movieUrl = `${SITE_URL}/filmy/${movie.slug}`;
  const now = Date.now();

  const upcoming = screenings
    .filter((s) => {
      const start = new Date(s.dateTime).getTime();
      return !Number.isNaN(start) && start >= now;
    })
    .sort((a, b) => a.dateTime.localeCompare(b.dateTime))
    .slice(0, MAX_JSONLD_EVENTS);

  return upcoming.map((screening) => {
    const event: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "ScreeningEvent",
      name: `${movie.title} - seans w ${screening.cinema.name}, ${screening.cinema.city.name}`,
      startDate: screening.dateTime,
      eventStatus: "https://schema.org/EventScheduled",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      url: movieUrl,
      location: {
        "@type": "MovieTheater",
        name: screening.cinema.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: screening.cinema.street ?? undefined,
          addressLocality: screening.cinema.city.name,
          addressCountry: "PL",
        },
      },
      workPresented: {
        "@type": "Movie",
        name: movie.title,
        url: movieUrl,
      },
    };

    if (movie.duration) {
      event.endDate = new Date(
        new Date(screening.dateTime).getTime() + movie.duration * 60 * 1000
      ).toISOString();
    }

    if (screening.ticketUrl) {
      event.offers = {
        "@type": "Offer",
        url: screening.ticketUrl,
        availability: "https://schema.org/InStock",
      };
    }

    return event;
  });
};

export default async function MovieLayout({
  children,
  params,
}: Readonly<MovieLayoutProps>) {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);
  const screenings = await getMovieScreenings({
    movieId: movie.id.toString(),
  }).catch(() => []);

  const events = buildScreeningEventsJsonLd(movie, screenings);

  return (
    <>
      <JsonLd data={buildMovieJsonLd(movie)} />
      <JsonLd data={buildMovieBreadcrumbJsonLd(movie)} />
      {events.length > 0 && <JsonLd data={events} />}
      {children}
    </>
  );
}

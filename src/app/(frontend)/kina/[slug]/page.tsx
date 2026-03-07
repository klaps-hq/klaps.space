import { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { getCinemaBySlug } from "@/lib/cinemas";
import { getScreenings } from "@/lib/screenings";
import { ApiNotFoundError } from "@/lib/client";
import SectionDivider from "@/components/ui/section-divider";
import CinemaMapLazy from "./_components/cinema-map-lazy";
import CinemaScreenings from "./_components/cinema-screenings";
import JsonLd from "@/components/common/json-ld";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { SITE_URL } from "@/lib/site-config";
import { ICinema } from "@/interfaces/ICinema";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { IGenre } from "@/interfaces/IMovies";
import SectionHeader from "@/components/common/section-header";

export const revalidate = 300;

type CinemaPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const hasQueryParams = (
  params: Record<string, string | string[] | undefined>
) =>
  Object.values(params).some((value) =>
    Array.isArray(value)
      ? value.some((item) => item.trim().length > 0)
      : typeof value === "string" && value.trim().length > 0
  );

const buildCinemaJsonLd = (cinema: ICinema) => {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MovieTheater",
    name: cinema.name,
    url: `${SITE_URL}/kina/${cinema.slug}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: cinema.street ?? undefined,
      addressLocality: cinema.city.name,
      addressCountry: "PL",
    },
  };

  if (cinema.latitude && cinema.longitude) {
    jsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: cinema.latitude,
      longitude: cinema.longitude,
    };
  }

  if (cinema.sourceUrl) {
    jsonLd.sameAs = cinema.sourceUrl;
  }

  return jsonLd;
};

const CinemaPage = async ({ params }: CinemaPageProps) => {
  const { slug } = await params;

  let cinema: ICinema;
  let screenings: IScreeningGroup[];

  try {
    cinema = await getCinemaBySlug(slug);

    if (cinema.slug !== slug) {
      permanentRedirect(`/kina/${cinema.slug}`);
    }

    const cityScreenings = await getScreenings({
      cityId: cinema.city.id.toString(),
      limit: 1000,
    });

    screenings = cityScreenings
      .map((group) => ({
        ...group,
        screenings: group.screenings.filter((s) => s.cinema.id === cinema.id),
      }))
      .filter((group) => group.screenings.length > 0);
  } catch (error) {
    if (error instanceof ApiNotFoundError) {
      notFound();
    }
    throw error;
  }

  const cinemaGenres = Array.from(
    new Map<string, IGenre>(
      screenings
        .flatMap((group) => group.movie.genres)
        .filter((genre) => genre.slug)
        .map((genre) => [genre.slug, genre])
    ).values()
  )
    .sort((a, b) => a.name.localeCompare(b.name, "pl"))
    .slice(0, 10);

  return (
    <>
      <JsonLd data={buildCinemaJsonLd(cinema)} />
      <main className="bg-black min-h-screen px-8 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
          <Breadcrumbs
            items={[{ name: "Kina", href: "/kina" }, { name: cinema.name }]}
          />
          <SectionHeader
            prefix="Kino"
            title={cinema.name}
            description={cinema?.description ?? undefined}
          />
          <SectionDivider />

          <section className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl md:text-3xl font-semibold uppercase text-white tracking-wide">
                Lokalizacja kina
              </h2>

              <address className="text-white/80 max-w-4xl">
                {cinema.street
                  ? `${cinema.name}, ${cinema.street}, ${cinema.city.name}.`
                  : `${cinema.name}, ${cinema.city.name}.`}
              </address>
            </div>

            <CinemaMapLazy cinema={cinema} />
          </section>

          <SectionDivider />
          <CinemaScreenings screenings={screenings} />
        </div>
      </main>
    </>
  );
};

export const generateMetadata = async ({
  params,
  searchParams,
}: CinemaPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const queryParams = searchParams ? await searchParams : {};
  const cinema = await getCinemaBySlug(slug);

  const title = `${cinema.name} - kino studyjne ${cinema.city.name}`;
  const description = `${cinema.name} - kino studyjne w ${cinema.city.name}. Repertuar seansów specjalnych, klasyki filmowej i retrospektyw. Sprawdź co grają.`;
  const url = `${SITE_URL}/kina/${cinema.slug}`;
  const image = `${SITE_URL}/klaps-og.png`;

  return {
    title,
    description,
    keywords: [
      cinema.name,
      `kino studyjne ${cinema.city.name}`,
      `repertuar ${cinema.name}`,
      `seanse specjalne ${cinema.city.name}`,
    ],
    alternates: {
      canonical: url,
    },
    ...(hasQueryParams(queryParams) && {
      robots: {
        index: false,
        follow: true,
      },
    }),
    openGraph: {
      title,
      description,
      url,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${cinema.name} - kino studyjne w ${cinema.city.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
};

export default CinemaPage;

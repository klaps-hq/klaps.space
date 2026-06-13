import React from "react";
import Link from "next/link";
import { getCinemas } from "@/lib/cinemas";
import { ICinemaGroup } from "@/interfaces/ICinema";
import { SITE_URL } from "@/lib/site-config";
import JsonLd from "@/components/common/json-ld";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading, {
  PageHeadingMuted,
} from "@/components/ui/page-heading";
import SiteHeader from "@/components/common/site-header";
import SiteSearch from "@/components/common/site-search";
import EmptyState from "@/components/common/empty-state";
import Footer from "../(home)/_components/footer";

export const revalidate = 300;

const formatPlural = (
  n: number,
  forms: [singular: string, few: string, many: string]
): string => {
  if (n === 1) return forms[0];
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
};

// Serializing all ~500 cinemas inflates the page with ~50 KB of JSON-LD;
// a capped list keeps the signal with a fraction of the payload.
const MAX_JSONLD_CINEMAS = 100;

const buildCinemasJsonLd = (cinemaGroups: readonly ICinemaGroup[]) => {
  const cinemas = cinemaGroups.flatMap((group) => group.cinemas);

  // Newest cinema updatedAt, i.e. a real data change rather than render
  // time (ISR re-renders every 5 min, which would fake freshness).
  const newestUpdatedAt = cinemas.reduce<string | null>((newest, cinema) => {
    const updatedAt = cinema.updatedAt ?? null;
    return updatedAt && (!newest || updatedAt > newest) ? updatedAt : newest;
  }, null);

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Kina studyjne w Polsce",
    url: `${SITE_URL}/kina`,
    description:
      "Pełna lista kin studyjnych i niezależnych w Polsce wraz z repertuarem seansów specjalnych.",
    ...(newestUpdatedAt && { dateModified: newestUpdatedAt }),
    mainEntity: {
      "@type": "ItemList",
      // The full count, even though the listed elements are capped.
      numberOfItems: cinemas.length,
      itemListElement: cinemas
        .slice(0, MAX_JSONLD_CINEMAS)
        .map((cinema, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${SITE_URL}/kina/${cinema.slug}`,
          name: cinema.name,
        })),
    },
  };
};

const CinemasPage = async () => {
  const { data: cinemaGroups } = await getCinemas({ limit: 1000 });
  const sortedGroups = [...cinemaGroups].sort((a, b) =>
    a.city.name.localeCompare(b.city.name, "pl")
  );
  const totalCinemas = sortedGroups.reduce(
    (acc, g) => acc + g.cinemas.length,
    0
  );
  const totalCities = sortedGroups.length;

  return (
    <main className="bg-black text-white min-h-screen">
      {sortedGroups.length > 0 && (
        <JsonLd data={buildCinemasJsonLd(sortedGroups)} />
      )}
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-6">
        <Breadcrumbs items={[{ name: "Kina", href: "/kina" }]} />
      </div>

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-10 md:pb-14">
        <PageHeading variant="editorial">
          Kina studyjne w&nbsp;Polsce.
          <PageHeadingMuted>
            Niezależne ekrany z&nbsp;autorskim programem.
          </PageHeadingMuted>
        </PageHeading>
        <p className="mt-4 md:mt-5 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
          Pełna lista {totalCinemas}{" "}
          {formatPlural(totalCinemas, [
            "kina studyjnego",
            "kin studyjnych",
            "kin studyjnych",
          ])}{" "}
          w&nbsp;{totalCities}{" "}
          {formatPlural(totalCities, ["mieście", "miastach", "miastach"])}{" "}
          w&nbsp;Polsce. Niezależne miejsca z&nbsp;autorskim repertuarem.
          Klasyka, retrospektywy, pokazy specjalne i&nbsp;cykle tematyczne.
          Zobacz też{" "}
          <Link
            href="/mapa-kin"
            className="text-white/80 underline underline-offset-4 decoration-white/25 hover:text-white hover:decoration-white transition-colors"
          >
            mapę kin studyjnych
          </Link>{" "}
          albo przeglądaj{" "}
          <Link
            href="/miasta"
            className="text-white/80 underline underline-offset-4 decoration-white/25 hover:text-white hover:decoration-white transition-colors"
          >
            kina według miast
          </Link>
          .
        </p>
        <SiteSearch mode="cinemas" className="mt-8 md:mt-10 max-w-md" />
      </div>

      <div className="px-6 md:px-12 lg:px-16 pb-24 md:pb-32">
        {sortedGroups.length === 0 ? (
          <EmptyState description="Brak kin do wyświetlenia." />
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-x-10 lg:gap-x-16">
            {sortedGroups.map((group) => (
              <section
                key={group.city.id}
                className="mb-14 md:mb-16 break-inside-avoid"
              >
                <div className="border-b border-white/10 pb-3 mb-6">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase -tracking-[0.02em]">
                    <Link
                      href={`/miasta/${group.city.slug}`}
                      className="text-white hover:text-white/70 transition-colors"
                    >
                      {group.city.name}
                    </Link>
                  </h2>
                </div>
                <ul className="flex flex-col gap-3">
                  {group.cinemas.map((cinema) => (
                    <li key={cinema.id}>
                      <Link
                        href={`/kina/${cinema.slug}`}
                        className="text-base md:text-lg text-white/65 hover:text-white transition-colors block truncate"
                      >
                        {cinema.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
};

export default CinemasPage;

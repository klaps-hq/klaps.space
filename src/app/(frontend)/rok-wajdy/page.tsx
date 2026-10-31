import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { formatCount, monthName, screeningsLabel } from "@/lib/month-stats";
import { getCinemasWithCoordinates } from "@/lib/cinemas";
import { getScreenings } from "@/lib/screenings";
import { getIndexableSlugs } from "@/lib/sitemap-entries";
import { ORGANIZATION_ID, SITE_NAME, SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH, clampText, formatPlDate, pluralPl } from "@/lib/seo";
import { getDateString } from "@/lib/utils";
import {
  getWajdaYearData,
  LARGEST_CITIES,
  outsideLargestCities,
  topStudioCinemas,
  WAJDA_SLUG,
  WAJDA_YEAR,
  WAJDA_YEAR_PATH,
  wajdaYearSummary,
  yearMonthBars,
} from "@/lib/wajda-year";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading, { PageHeadingMuted } from "@/components/ui/page-heading";
import SiteHeader from "@/components/common/site-header";
import EmptyState from "@/components/common/empty-state";
import JsonLd from "@/components/common/json-ld";
import Footer from "../(home)/_components/footer";
import MonthlyChart from "./_components/monthly-chart";
import CityDotMap, { CityDot } from "./_components/city-dot-map";

// Past screenings only, so the numbers move once a day at most; an hour
// keeps the press page fresh without hammering the profile endpoint.
export const revalidate = 3600;

const PAGE_URL = `${SITE_URL}${WAJDA_YEAR_PATH}`;
const TITLE = `Rok Wajdy w liczbach: filmy Andrzeja Wajdy w kinach w ${WAJDA_YEAR}`;
const FALLBACK_DESCRIPTION = `Ile razy polskie kina pokazały filmy Andrzeja Wajdy w Roku Wajdy ${WAJDA_YEAR}? Seanse miesiąc po miesiącu, najczęściej grane tytuły, miasta i kina studyjne.`;

const SECTION_CLASS =
  "border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-12 md:pb-16";
const SECTION_HEADING_CLASS =
  "text-3xl md:text-4xl xl:text-5xl font-medium uppercase -tracking-[0.02em] leading-[1] text-white break-words";
const LINK_CLASS =
  "underline decoration-white/25 underline-offset-4 hover:decoration-white transition-colors";
const PLAIN_LINK_CLASS = "hover:text-white transition-colors";
const ROW_CLASS =
  "grid grid-cols-[2rem_1fr_auto] items-baseline gap-4 border-t border-white/10 first:border-t-0 first:pt-0 last:pb-0 py-3 md:py-4";

// Cities named on the map; the rest are dots with a tooltip.
const MAP_LABELS = 8;

export const generateMetadata = async (): Promise<Metadata> => {
  const data = await getWajdaYearData();
  const description =
    data && data.profile.screenings > 0
      ? clampText(
          `${wajdaYearSummary(data.profile)} Seanse miesiąc po miesiącu, rankingi filmów, miast i kin.`
        )
      : FALLBACK_DESCRIPTION;
  return {
    title: TITLE,
    description,
    alternates: { canonical: PAGE_URL },
    openGraph: {
      ...BASE_OPEN_GRAPH,
      type: "website",
      title: TITLE,
      description,
      url: PAGE_URL,
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description,
    },
  };
};

interface SectionProps {
  title: string;
  note?: React.ReactNode;
  children: React.ReactNode;
}

const Section = ({ title, note, children }: SectionProps) => (
  <section className={SECTION_CLASS}>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-8 lg:gap-x-12">
      <div className="lg:col-span-4 flex flex-col gap-3">
        <h2 className={SECTION_HEADING_CLASS}>{title}</h2>
        {note && (
          <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-[36ch]">
            {note}
          </p>
        )}
      </div>
      <div className="lg:col-span-8">{children}</div>
    </div>
  </section>
);

interface MaybeLinkProps {
  href: string | null;
  plain?: boolean;
  children: React.ReactNode;
}

/** Links only indexable targets; the rest render as plain text. */
const MaybeLink = ({ href, plain = false, children }: MaybeLinkProps) =>
  href ? (
    <Link href={href} className={plain ? PLAIN_LINK_CLASS : LINK_CLASS}>
      {children}
    </Link>
  ) : (
    <>{children}</>
  );

interface RankedRow {
  key: string;
  label: React.ReactNode;
  count: number;
}

interface RankedRowsProps {
  rows: RankedRow[];
  /** Draw a bar under each label, scaled to the first row. */
  bars?: boolean;
}

const RankedRows = ({ rows, bars = false }: RankedRowsProps) => {
  const top = rows[0]?.count ?? 0;
  return (
    <ol className="flex flex-col">
      {rows.map((row, index) => (
        <li key={row.key} className={ROW_CLASS}>
          <span className="text-xs tabular-nums text-white/50">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="flex flex-col gap-2 min-w-0 text-lg md:text-xl text-white/85">
            <span>{row.label}</span>
            {bars && (
              <span
                aria-hidden="true"
                className="block h-[3px] bg-white/40"
                style={{
                  width: `${top > 0 ? Math.max((row.count / top) * 100, 2) : 0}%`,
                }}
              />
            )}
          </span>
          <span className="text-lg md:text-xl tabular-nums text-white">
            {formatCount(row.count)}
          </span>
        </li>
      ))}
    </ol>
  );
};

/** Mean position of a city's cinemas, from the same data as /mapa-kin. */
const cityPositions = async (): Promise<
  Map<string, { lat: number; lon: number }>
> => {
  const cinemas = await getCinemasWithCoordinates();
  const sums = new Map<string, { lat: number; lon: number; n: number }>();
  for (const cinema of cinemas) {
    const entry = sums.get(cinema.city.slug) ?? { lat: 0, lon: 0, n: 0 };
    entry.lat += cinema.latitude as number;
    entry.lon += cinema.longitude as number;
    entry.n += 1;
    sums.set(cinema.city.slug, entry);
  }
  return new Map(
    [...sums].map(([slug, s]) => [slug, { lat: s.lat / s.n, lon: s.lon / s.n }])
  );
};

const buildDatasetJsonLd = (description: string, until: string | null) => ({
  "@context": "https://schema.org",
  "@type": "Dataset",
  "@id": `${PAGE_URL}#dataset`,
  name: `Rok Wajdy w liczbach ${WAJDA_YEAR}`,
  description,
  url: PAGE_URL,
  temporalCoverage: `${WAJDA_YEAR}-03/${until ?? `${WAJDA_YEAR}-12-31`}`,
  spatialCoverage: { "@type": "Country", name: "Polska" },
  inLanguage: "pl",
  isAccessibleForFree: true,
  license: "https://creativecommons.org/licenses/by/4.0/",
  ...(until && { dateModified: until }),
  about: {
    "@type": "Person",
    name: "Andrzej Wajda",
    url: `${SITE_URL}/rezyserzy/${WAJDA_SLUG}`,
  },
  variableMeasured: [
    "Liczba seansów filmów Andrzeja Wajdy",
    "Liczba seansów w poszczególnych miesiącach",
    "Najczęściej grane filmy",
    "Ranking miast według liczby seansów",
    "Ranking kin studyjnych według liczby seansów",
  ],
  creator: {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
  },
});

const WajdaYearPage = async () => {
  const data = await getWajdaYearData();
  const profile = data?.profile ?? null;
  const hasData = profile !== null && profile.screenings > 0;

  const [indexable, screenings, positions] = hasData
    ? await Promise.all([
        getIndexableSlugs(),
        getScreenings(),
        cityPositions(),
      ])
    : [null, [], new Map<string, { lat: number; lon: number }>()];
  // Film pages without upcoming screenings are noindex, so only films in
  // the current repertoire get a link. An empty feed is a backend hiccup.
  const repertoire =
    screenings.length > 0
      ? new Set(screenings.map((group) => group.movie.slug))
      : null;
  const movieHref = (slug: string) =>
    !repertoire || repertoire.has(slug) ? `/filmy/${slug}` : null;
  const cinemaHref = (slug: string) =>
    indexable?.cinemas.has(slug) ? `/kina/${slug}` : null;
  const cityHref = (slug: string) =>
    indexable?.cities.has(slug) ? `/miasta/${slug}` : null;

  const today = getDateString(new Date());
  const bars = hasData && profile.byMonth ? yearMonthBars(profile, today) : [];
  const partialBar = bars.find((bar) => bar.partial);
  const untilLabel = profile?.until
    ? formatPlDate(new Date(`${profile.until}T12:00:00Z`))
    : null;
  const outside = data ? outsideLargestCities(data) : null;
  const cities = hasData ? profile.topCities.slice(0, 10) : [];
  const studios = hasData ? topStudioCinemas(profile, 10) : [];
  const dots: CityDot[] =
    hasData && data?.complete
      ? profile.topCities.flatMap((city) => {
          const position = positions.get(city.slug);
          return position ? [{ ...city, ...position }] : [];
        })
      : [];
  const summary = hasData ? wajdaYearSummary(profile) : "";
  const citation = `Źródło: Klaps (klaps.space), „Rok Wajdy w liczbach”${untilLabel ? `, dane do ${untilLabel}` : ""}.`;

  return (
    <main className="bg-black text-white min-h-screen">
      {hasData && (
        <JsonLd data={buildDatasetJsonLd(summary, profile.until)} />
      )}
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-6">
        <Breadcrumbs
          items={[
            { name: "Klaps w liczbach", href: "/w-liczbach" },
            { name: "Rok Wajdy w liczbach", href: WAJDA_YEAR_PATH },
          ]}
        />
      </div>

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-10 md:pb-14">
        <PageHeading variant="editorial">
          Rok Wajdy w&nbsp;liczbach.
          <PageHeadingMuted>Andrzej Wajda w&nbsp;kinach, {WAJDA_YEAR}.</PageHeadingMuted>
        </PageHeading>
        <p className="mt-4 md:mt-5 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
          {WAJDA_YEAR} to Rok Andrzeja Wajdy, w&nbsp;setną rocznicę urodzin
          reżysera. Sprawdziliśmy, jak często jego filmy wracały na duży ekran.
          {hasData && (
            <>
              {" "}
              {summary}
              {untilLabel && <> Dane do {untilLabel}.</>}
            </>
          )}
        </p>
      </div>

      {!hasData ? (
        <div className="px-6 md:px-12 lg:px-16 pb-16 md:pb-24">
          <EmptyState
            title="Brak danych."
            description="Zestawienie pojawi się, gdy tylko pobierzemy dane o seansach."
            cta={{ href: `/rezyserzy/${WAJDA_SLUG}`, label: "Filmy Andrzeja Wajdy" }}
          />
        </div>
      ) : (
        <>
          <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 py-12 md:py-16">
            <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-10">
              {[
                {
                  label: pluralPl(profile.screenings, "seans", "seanse", "seansów"),
                  value: profile.screenings,
                },
                {
                  label: pluralPl(profile.movies, "film", "filmy", "filmów"),
                  value: profile.movies,
                },
                {
                  label: pluralPl(profile.cinemas, "kino", "kina", "kin"),
                  value: profile.cinemas,
                },
                {
                  label: pluralPl(profile.cities, "miasto", "miasta", "miast"),
                  value: profile.cities,
                },
              ].map((item) => (
                <div key={item.label} className="flex flex-col-reverse gap-3">
                  <dt className="text-xs md:text-sm uppercase tracking-[0.25em] text-white/50">
                    {item.label}
                  </dt>
                  <dd className="text-5xl md:text-7xl lg:text-8xl font-medium tabular-nums -tracking-[0.04em] leading-none text-white">
                    {formatCount(item.value)}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {bars.length > 0 && (
            <Section
              title="Miesiąc po miesiącu"
              note={
                <>
                  Liczba seansów filmów Andrzeja Wajdy w&nbsp;kolejnych
                  miesiącach {WAJDA_YEAR} roku. Historia repertuaru zaczyna
                  się w&nbsp;marcu.
                  {partialBar && (
                    <>
                      {" "}
                      * <span className="capitalize">{monthName(partialBar.month)}</span>{" "}
                      w&nbsp;toku, liczba jeszcze wzrośnie.
                    </>
                  )}
                </>
              }
            >
              <figure className="max-w-3xl">
                <MonthlyChart
                  bars={bars}
                  label={`Seanse filmów Andrzeja Wajdy według miesięcy ${WAJDA_YEAR}`}
                />
                <figcaption className="sr-only">
                  Seanse według miesięcy, liczby w&nbsp;tabeli poniżej.
                </figcaption>
              </figure>
              <table className="mt-8 w-full max-w-md text-sm md:text-base">
                <caption className="sr-only">
                  Seanse filmów Andrzeja Wajdy według miesięcy
                </caption>
                <thead>
                  <tr className="text-left text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/50">
                    <th scope="col" className="pb-2 font-normal">
                      Miesiąc
                    </th>
                    <th scope="col" className="pb-2 font-normal text-right">
                      Seanse
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bars
                    .filter((bar) => bar.screenings !== null)
                    .map((bar) => (
                      <tr key={bar.month} className="border-t border-white/10">
                        <td className="py-2 text-white/75">
                          <span className="capitalize">{monthName(bar.month)}</span>
                          {bar.partial && " (w toku)"}
                        </td>
                        <td className="py-2 text-right tabular-nums text-white">
                          {formatCount(bar.screenings ?? 0)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </Section>
          )}

          {profile.topMovies.length > 0 && (
            <Section
              title="Najczęściej grane filmy"
              note="Tytuły z największą liczbą seansów od marca."
            >
              <RankedRows
                bars
                rows={profile.topMovies.map((movie) => ({
                  key: movie.slug,
                  label: (
                    <>
                      <MaybeLink href={movieHref(movie.slug)} plain>
                        {movie.title}
                      </MaybeLink>
                      <span className="text-white/45">
                        , {movie.productionYear}
                      </span>
                    </>
                  ),
                  count: movie.count,
                }))}
              />
            </Section>
          )}

          {cities.length > 0 && (
            <Section
              title="Miasta"
              note="Miasta z największą liczbą seansów filmów Wajdy."
            >
              <RankedRows
                bars
                rows={cities.map((city) => ({
                  key: city.slug,
                  label: (
                    <MaybeLink href={cityHref(city.slug)} plain>
                      {city.name}
                    </MaybeLink>
                  ),
                  count: city.count,
                }))}
              />
            </Section>
          )}

          {outside && (
            <Section
              title="Poza największymi miastami"
              note={`Dziesięć największych miast według liczby mieszkańców (GUS): ${LARGEST_CITIES.map((c) => c.name).join(", ")}.`}
            >
              <p className="text-6xl md:text-8xl font-medium tabular-nums -tracking-[0.04em] leading-none text-white">
                {outside.share}%
              </p>
              <p className="mt-6 max-w-[52ch] text-lg md:text-2xl text-white/80 -tracking-[0.01em] leading-snug">
                seansów filmów Wajdy odbyło się poza dziesięcioma największymi
                miastami Polski: {screeningsLabel(outside.screenings)}{" "}
                w&nbsp;{formatCount(outside.cities)}{" "}
                {pluralPl(outside.cities, "mieście", "miastach", "miastach")}.
              </p>
            </Section>
          )}

          {dots.length > 0 && (
            <Section
              title="Mapa"
              note="Każda kropka to miasto, w którym grano filmy Wajdy. Im większa, tym więcej seansów."
            >
              <figure className="max-w-2xl">
                <CityDotMap
                  cities={dots}
                  labelled={new Set(dots.slice(0, MAP_LABELS).map((d) => d.slug))}
                  label={`Mapa ${formatCount(dots.length)} miast z seansami filmów Andrzeja Wajdy`}
                />
              </figure>
            </Section>
          )}

          {studios.length > 0 && (
            <Section
              title="Kina studyjne"
              note="Kina niezależne z największą liczbą seansów. Multipleksów sieciowych nie liczymy."
            >
              <RankedRows
                rows={studios.map((cinema) => ({
                  key: cinema.slug,
                  label: (
                    <>
                      <MaybeLink href={cinemaHref(cinema.slug)} plain>
                        {cinema.name}
                      </MaybeLink>
                      <span className="text-white/45">, {cinema.cityName}</span>
                    </>
                  ),
                  count: cinema.count,
                }))}
              />
            </Section>
          )}
        </>
      )}

      <Section title="Jak liczymy">
        <div className="flex flex-col gap-4 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
          <p>
            Liczymy seanse filmów w&nbsp;reżyserii Andrzeja Wajdy
            w&nbsp;repertuarach kin, które śledzi Klaps. Historię repertuaru
            zbieramy od marca {WAJDA_YEAR}, więc zestawienie obejmuje okres od
            marca do dziś. Wliczamy tylko seanse, które już się odbyły,
            a&nbsp;ten sam film pokazany w&nbsp;kinie o&nbsp;tej samej porze
            liczymy raz.
          </p>
          <p>
            Pomijamy multipleksy sieciowe (Cinema City, Helios, Multikino
            i&nbsp;inne), bo masowe wznowienia zawyżałyby obraz seansów
            specjalnych. Kino trafia do zestawienia, jeśli jest w&nbsp;bazie
            klaps.space i&nbsp;publikuje repertuar w&nbsp;sieci, dlatego liczby
            są dolną granicą: nie obejmują pokazów, których kina nie ogłosiły
            online.
          </p>
          <p>
            Dane udostępniamy na licencji{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/deed.pl"
              rel="license noopener"
              target="_blank"
              className="underline underline-offset-4 hover:text-white transition-colors"
            >
              CC BY 4.0
            </a>
            : można je cytować i&nbsp;wykorzystywać z&nbsp;podaniem źródła.
            Proponowana formuła:
          </p>
          <p className="border-l border-white/20 pl-4 text-white/75">
            {citation}
          </p>
          <p>
            Zestawienie aktualizujemy co godzinę. Aktualne seanse filmów
            Andrzeja Wajdy znajdziesz na{" "}
            <Link href={`/rezyserzy/${WAJDA_SLUG}`} className={LINK_CLASS}>
              stronie reżysera
            </Link>
            , a&nbsp;miesięczne zestawienia klasyki w&nbsp;dziale{" "}
            <Link href="/w-liczbach" className={LINK_CLASS}>
              Klaps w&nbsp;liczbach
            </Link>
            .
          </p>
        </div>
      </Section>

      <Footer />
    </main>
  );
};

export default WajdaYearPage;

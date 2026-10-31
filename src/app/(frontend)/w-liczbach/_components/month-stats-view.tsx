import React from "react";
import Link from "next/link";
import { IMonthStats, IMonthStatsMovie } from "@/interfaces/IMonthStats";
import {
  archiveMonths,
  FIRST_STATS_MONTH,
  formatCount,
  getMonthStats,
  inMonth,
  monthComparison,
  monthName,
  monthPath,
  monthStatsSummary,
  screeningsLabel,
  shiftMonth,
} from "@/lib/month-stats";
import {
  buildCinemaBadgeSnippet,
  CINEMA_BADGE_HEIGHT,
  CINEMA_BADGE_WIDTH,
  cinemaBadgePath,
  getCinemasOfTheMonth,
} from "@/lib/cinema-of-the-month";
import { CLASSIC_MIN_AGE_YEARS } from "@/lib/landing-pages";
import { getScreenings } from "@/lib/screenings";
import { getIndexableSlugs } from "@/lib/sitemap-entries";
import { ORGANIZATION_ID, SITE_NAME, SITE_URL } from "@/lib/site-config";
import { formatPlDate } from "@/lib/seo";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading, { PageHeadingMuted } from "@/components/ui/page-heading";
import SiteHeader from "@/components/common/site-header";
import EmptyState from "@/components/common/empty-state";
import JsonLd from "@/components/common/json-ld";
import MoviePoster from "@/components/common/movie-poster";
import Footer from "../../(home)/_components/footer";
import CinemaBadgeCode from "./cinema-badge-code";

interface MonthStatsViewProps {
  month: string;
  stats: IMonthStats | null;
  /** The current month: numbers still grow as cinemas add screenings. */
  ongoing: boolean;
}

/**
 * Slugs the page may link. Movie, cinema and city pages without upcoming
 * screenings are noindex, and an archive month is full of those, so only
 * pages Google can index get a link; the rest render as plain text. Each
 * set is null when its source failed, and everything is linked then.
 */
interface LinkableSlugs {
  movies: ReadonlySet<string> | null;
  cinemas: ReadonlySet<string> | null;
  cities: ReadonlySet<string> | null;
}

const getLinkableSlugs = async (): Promise<LinkableSlugs> => {
  const [groups, indexable] = await Promise.all([
    getScreenings(),
    getIndexableSlugs(),
  ]);
  return {
    // An empty feed means a backend hiccup, not zero screenings nationwide.
    movies:
      groups.length > 0 ? new Set(groups.map((g) => g.movie.slug)) : null,
    cinemas: indexable?.cinemas ?? null,
    cities: indexable?.cities ?? null,
  };
};

const canLink = (set: ReadonlySet<string> | null, slug: string): boolean =>
  !set || set.has(slug);

const SECTION_CLASS =
  "border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-12 md:pb-16";
const SECTION_HEADING_CLASS =
  "text-3xl md:text-4xl xl:text-5xl font-medium uppercase -tracking-[0.02em] leading-[1] text-white break-words";
const LINK_CLASS =
  "underline decoration-white/25 underline-offset-4 hover:decoration-white transition-colors";
// Ranked rows already carry a divider and a bar, so links there skip the underline
const PLAIN_LINK_CLASS = "hover:text-white transition-colors";

interface MaybeLinkProps {
  href: string;
  linked: boolean;
  plain?: boolean;
  children: React.ReactNode;
}

const MaybeLink: React.FC<MaybeLinkProps> = ({
  href,
  linked,
  plain = false,
  children,
}) =>
  linked ? (
    <Link href={href} className={plain ? PLAIN_LINK_CLASS : LINK_CLASS}>
      {children}
    </Link>
  ) : (
    <>{children}</>
  );

interface SectionProps {
  title: string;
  /** Short line under the heading, e.g. what a ranking covers. */
  note?: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, note, children }) => (
  <section className={SECTION_CLASS}>
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-8 gap-x-8 lg:gap-x-12">
      <div className="lg:col-span-4 flex flex-col gap-3">
        <h2 className={SECTION_HEADING_CLASS}>{title}</h2>
        {note && (
          <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-[32ch]">
            {note}
          </p>
        )}
      </div>
      <div className="lg:col-span-8">{children}</div>
    </div>
  </section>
);

const Poster: React.FC<{ movie: IMonthStatsMovie; sizes: string }> = ({
  movie,
  sizes,
}) => (
  <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
    {movie.posterUrl ? (
      <MoviePoster
        posterUrl={movie.posterUrl}
        title={movie.title}
        productionYear={movie.productionYear}
        width={400}
        height={600}
        sizes={sizes}
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="absolute inset-0 flex items-center justify-center text-white/50 text-[10px] uppercase tracking-[0.25em]">
        Bez plakatu
      </div>
    )}
  </div>
);

const buildDatasetJsonLd = (stats: IMonthStats, ongoing: boolean) => ({
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: `Klaps w liczbach: ${monthName(stats.month)}`,
  description: `${monthStatsSummary(stats, ongoing)} Liczba seansów filmów sprzed co najmniej ${CLASSIC_MIN_AGE_YEARS} lat w polskich kinach, z podziałem na miasta i kina.`,
  url: `${SITE_URL}${ongoing ? "/w-liczbach" : monthPath(stats.month)}`,
  // Stable id per month, also for the in-progress month on /w-liczbach, so
  // the same dataset is not described twice under two URLs.
  "@id": `${SITE_URL}${monthPath(stats.month)}#dataset`,
  temporalCoverage: stats.month,
  // A finished month is complete on the first day of the next one; the
  // month in progress has no publication date yet.
  ...(!ongoing && { datePublished: `${shiftMonth(stats.month, 1)}-01` }),
  spatialCoverage: { "@type": "Country", name: "Polska" },
  inLanguage: "pl",
  isAccessibleForFree: true,
  // Matches the on-page note that the data may be cited with attribution.
  license: "https://creativecommons.org/licenses/by/4.0/",
  variableMeasured: [
    "Liczba seansów klasyki",
    "Liczba kin z seansami klasyki",
    "Liczba miast z seansami klasyki",
    "Najczęściej grane filmy",
    "Ranking miast według liczby seansów klasyki",
  ],
  creator: {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: SITE_NAME,
    url: SITE_URL,
  },
});

const MonthStatsView = async ({
  month,
  stats,
  ongoing,
}: MonthStatsViewProps) => {
  const hasData = stats !== null && stats.screenings > 0;
  const linkable = hasData
    ? await getLinkableSlugs()
    : { movies: null, cinemas: null, cities: null };
  const archive = archiveMonths().filter((m) => m !== month);
  const topCityCount = stats?.byCity[0]?.count ?? 0;
  const previousMonth = shiftMonth(month, -1);
  // A failed lookup only drops the comparison, never the page.
  const previous =
    hasData && previousMonth >= FIRST_STATS_MONTH
      ? await getMonthStats(previousMonth).catch(() => null)
      : null;
  const comparison = hasData ? monthComparison(stats, previous, ongoing) : [];
  // Finished months award the badge and rank independents only; the month
  // in progress keeps the plain ranking of all venues.
  const cinemasOfMonth =
    hasData && !ongoing ? getCinemasOfTheMonth(stats) : [];

  return (
    <main className="bg-black text-white min-h-screen">
      {hasData && <JsonLd data={buildDatasetJsonLd(stats, ongoing)} />}
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-6">
        <Breadcrumbs
          items={
            ongoing
              ? [{ name: "Klaps w liczbach", href: "/w-liczbach" }]
              : [
                  { name: "Klaps w liczbach", href: "/w-liczbach" },
                  { name: monthName(month), href: monthPath(month) },
                ]
          }
        />
      </div>

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-10 md:pb-14">
        <PageHeading variant="editorial">
          Klaps w liczbach.
          <PageHeadingMuted>
            <span className="capitalize">{monthName(month)}</span>.
          </PageHeadingMuted>
        </PageHeading>
        {hasData && (
          <p className="mt-4 md:mt-5 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
            {monthStatsSummary(stats, ongoing)}
            {ongoing && (
              <>
                {" "}
                Stan na {formatPlDate(new Date())}. Liczby obejmują seanse
                zagrane i&nbsp;zapowiedziane do końca miesiąca, więc mogą
                jeszcze wzrosnąć.
              </>
            )}
          </p>
        )}
      </div>

      {!hasData ? (
        <div className="px-6 md:px-12 lg:px-16 pb-16 md:pb-24">
          <EmptyState
            title="Brak danych."
            description={
              <>
                Nie mamy jeszcze seansów klasyki {inMonth(month)}. Zestawienie
                pojawi się, gdy kina opublikują repertuar.
              </>
            }
            cta={{ href: "/seanse", label: "Aktualne seanse" }}
          />
        </div>
      ) : (
        <>
          <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 py-12 md:py-16">
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-10">
              {[
                { label: "seansów klasyki", value: stats.screenings },
                { label: "kin", value: stats.cinemas },
                { label: "miast", value: stats.cities },
              ].map((item) => (
                <div key={item.label} className="flex flex-col-reverse gap-3">
                  <dt className="text-xs md:text-sm uppercase tracking-[0.25em] text-white/50">
                    {item.label}
                  </dt>
                  <dd className="text-6xl md:text-7xl lg:text-8xl font-medium tabular-nums -tracking-[0.04em] leading-none text-white">
                    {formatCount(item.value)}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {comparison.length > 0 && (
            <Section
              title="Miesiąc do miesiąca"
              note={
                ongoing
                  ? "Miesiąc w toku porównujemy z pełnym poprzednim, więc różnice jeszcze się zmienią."
                  : undefined
              }
            >
              <ul className="flex flex-col gap-3 max-w-[64ch] text-lg md:text-xl text-white/80 leading-snug">
                {comparison.map((sentence) => (
                  <li key={sentence}>{sentence}</li>
                ))}
              </ul>
            </Section>
          )}

          {stats.topMovie && (
            <Section title="Film miesiąca">
              <div className="grid grid-cols-[minmax(0,9rem)_1fr] md:grid-cols-[minmax(0,12rem)_1fr] gap-6 md:gap-10 items-start">
                <Poster
                  movie={stats.topMovie.movie}
                  sizes="(max-width: 768px) 144px, 192px"
                />
                <div className="flex flex-col gap-3 min-w-0">
                  <h3 className="text-2xl md:text-4xl font-semibold uppercase leading-tight tracking-tight">
                    <MaybeLink
                      href={`/filmy/${stats.topMovie.movie.slug}`}
                      linked={canLink(
                        linkable.movies,
                        stats.topMovie.movie.slug
                      )}
                    >
                      {stats.topMovie.movie.title}
                    </MaybeLink>
                  </h3>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/50">
                    {stats.topMovie.movie.productionYear}
                  </p>
                  <p className="text-base md:text-lg text-white/70 leading-relaxed">
                    {screeningsLabel(stats.topMovie.screenings)}{" "}
                    {stats.topMovie.cities === 1
                      ? "w 1 mieście"
                      : `w ${formatCount(stats.topMovie.cities)} miastach`}
                    . Najczęściej grany klasyk {inMonth(month)}.
                  </p>
                </div>
              </div>
            </Section>
          )}

          {stats.highlights.length > 0 && (
            <Section
              title="Najczęściej grane"
              note="Filmy z największą liczbą seansów w miesiącu."
            >
              <ol className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10">
                {stats.highlights.map((movie, index) => (
                  <li key={movie.id} className="flex flex-col gap-3">
                    <Poster
                      movie={movie}
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                    <div className="flex items-baseline gap-3 min-w-0">
                      <span className="shrink-0 text-xs tabular-nums text-white/50">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-base md:text-lg font-semibold uppercase leading-tight tracking-tight line-clamp-2">
                        <MaybeLink
                          href={`/filmy/${movie.slug}`}
                          linked={canLink(linkable.movies, movie.slug)}
                        >
                          {movie.title}
                        </MaybeLink>
                      </span>
                    </div>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {stats.oldestMovie && (
            <Section title="Najstarszy film">
              <p className="max-w-[52ch] text-lg md:text-2xl text-white/80 -tracking-[0.01em] leading-snug">
                <MaybeLink
                  href={`/filmy/${stats.oldestMovie.slug}`}
                  linked={canLink(linkable.movies, stats.oldestMovie.slug)}
                >
                  {stats.oldestMovie.title}
                </MaybeLink>{" "}
                z&nbsp;{stats.oldestMovie.productionYear} roku to najstarszy
                film, który {ongoing ? "można" : "można było"} zobaczyć na
                dużym ekranie{" "}
                {inMonth(month)}.
              </p>
            </Section>
          )}

          {stats.byCity.length > 0 && (
            <Section
              title="Miasta"
              note="Miasta z największą liczbą seansów klasyki w miesiącu."
            >
              <ol className="flex flex-col">
                {stats.byCity.map((city, index) => (
                  <li
                    key={city.slug}
                    className="grid grid-cols-[2rem_1fr_auto] items-baseline gap-4 border-t border-white/10 first:border-t-0 first:pt-0 last:pb-0 py-3 md:py-4"
                  >
                    <span className="text-xs tabular-nums text-white/50">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="flex flex-col gap-2 min-w-0">
                      <span className="text-lg md:text-xl text-white/85">
                        <MaybeLink
                          href={`/miasta/${city.slug}`}
                          linked={canLink(linkable.cities, city.slug)}
                          plain
                        >
                          {city.name}
                        </MaybeLink>
                      </span>
                      <span
                        aria-hidden="true"
                        className="block h-[3px] bg-white/40"
                        style={{
                          width: `${topCityCount > 0 ? Math.max((city.count / topCityCount) * 100, 2) : 0}%`,
                        }}
                      />
                    </span>
                    <span className="text-lg md:text-xl tabular-nums text-white">
                      {formatCount(city.count)}
                    </span>
                  </li>
                ))}
              </ol>
            </Section>
          )}

          {cinemasOfMonth.length > 0 ? (
            <Section
              title="Kina klasyki miesiąca"
              note={`Kina spoza sieci multipleksów z największą liczbą seansów klasyki ${inMonth(month)}. Każde może wkleić na swoją stronę odznakę z miejscem w zestawieniu.`}
            >
              <ol className="flex flex-col">
                {cinemasOfMonth.map((cinema) => (
                  <li
                    key={cinema.slug}
                    className="grid grid-cols-[2rem_1fr_auto] items-baseline gap-4 border-t border-white/10 first:border-t-0 first:pt-0 last:pb-0 py-3 md:py-4"
                  >
                    <span className="text-xs tabular-nums text-white/50">
                      {String(cinema.rank).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 text-lg md:text-xl text-white/85">
                      <MaybeLink
                        href={`/kina/${cinema.slug}`}
                        linked={canLink(linkable.cinemas, cinema.slug)}
                        plain
                      >
                        {cinema.name}
                      </MaybeLink>
                      <span className="text-white/45">, {cinema.city}</span>
                    </span>
                    <span className="text-lg md:text-xl tabular-nums text-white">
                      {formatCount(cinema.count)}
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-12 md:mt-16">
                <CinemaBadgeCode
                  badges={cinemasOfMonth.map((cinema) => ({
                    slug: cinema.slug,
                    name: cinema.name,
                    rank: cinema.rank,
                    src: {
                      dark: cinemaBadgePath(month, cinema.slug, "dark"),
                      light: cinemaBadgePath(month, cinema.slug, "light"),
                    },
                    snippet: {
                      dark: buildCinemaBadgeSnippet(month, cinema, "dark"),
                      light: buildCinemaBadgeSnippet(month, cinema, "light"),
                    },
                  }))}
                  width={CINEMA_BADGE_WIDTH}
                  height={CINEMA_BADGE_HEIGHT}
                />
              </div>
            </Section>
          ) : stats.topCinemas.length > 0 && (
            <Section
              title="Kina"
              note="Kina, które pokazały najwięcej seansów klasyki."
            >
              <ol className="flex flex-col">
                {stats.topCinemas.map((cinema, index) => (
                  <li
                    key={cinema.slug}
                    className="grid grid-cols-[2rem_1fr_auto] items-baseline gap-4 border-t border-white/10 first:border-t-0 first:pt-0 last:pb-0 py-3 md:py-4"
                  >
                    <span className="text-xs tabular-nums text-white/50">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 text-lg md:text-xl text-white/85">
                      <MaybeLink
                        href={`/kina/${cinema.slug}`}
                        linked={canLink(linkable.cinemas, cinema.slug)}
                        plain
                      >
                        {cinema.name}
                      </MaybeLink>
                      <span className="text-white/45">, {cinema.city}</span>
                    </span>
                    <span className="text-lg md:text-xl tabular-nums text-white">
                      {formatCount(cinema.count)}
                    </span>
                  </li>
                ))}
              </ol>
            </Section>
          )}
        </>
      )}

      <Section title="Jak liczymy">
        <div className="flex flex-col gap-4 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
          <p>
            Klasyka to filmy sprzed co najmniej {CLASSIC_MIN_AGE_YEARS} lat,
            ta sama definicja co w&nbsp;dziale Klasyka w&nbsp;kinach. Liczymy każdy seans
            takiego filmu w&nbsp;repertuarach kin, które śledzi Klaps, od
            pierwszego do ostatniego dnia miesiąca. Miasto i&nbsp;kino trafiają
            do zestawienia, jeśli pokazały co najmniej jeden taki seans.
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
            : można je cytować i&nbsp;wykorzystywać z&nbsp;podaniem źródła: Klaps
            (klaps.space). Zestawienie za bieżący miesiąc aktualizujemy co godzinę.
          </p>
        </div>
      </Section>

      {archive.length > 0 && (
        <Section title="Archiwum">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-lg md:text-xl">
            {!ongoing && (
              <li>
                <Link href="/w-liczbach" className={LINK_CLASS}>
                  Bieżący miesiąc
                </Link>
              </li>
            )}
            {archive.map((m) => (
              <li key={m}>
                <Link href={monthPath(m)} className={`capitalize ${LINK_CLASS}`}>
                  {monthName(m)}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Footer />
    </main>
  );
};

export default MonthStatsView;

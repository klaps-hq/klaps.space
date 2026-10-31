import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH, inPlace, NOINDEX_FOLLOW, pluralPl } from "@/lib/seo";
import { CLASSIC_PATH } from "@/lib/landing-pages";
import {
  CHRISTMAS_PATH,
  ChristmasCinema,
  ChristmasCity,
  christmasFaq,
  christmasIntro,
  cityMetaLine,
  fetchChristmasScreenings,
  formatChristmasDay,
  getChristmasSeason,
  groupChristmasByCity,
  isChristmasIndexable,
  seasonRangeLabel,
  summarizeChristmas,
} from "@/lib/christmas";
import SiteHeader from "@/components/common/site-header";
import EmptyState from "@/components/common/empty-state";
import ListingFaq from "@/components/common/listing-faq";
import {
  LandingHeader,
  LandingJsonLd,
  LinkGrid,
} from "@/components/common/landing-page";
import Footer from "../(home)/_components/footer";

// Hourly: the listing changes when cinemas publish their December
// programmes, and the page is the one the "updated hourly" note promises.
export const revalidate = 3600;

const URL = `${SITE_URL}${CHRISTMAS_PATH}`;

// Showtime days listed per film and cinema; a multiplex re-release can run
// twice a day for five weeks, which would bloat the HTML for no reader.
const MAX_DAYS_PER_FILM = 6;

const H2_CLASS =
  "text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium";
const LINK_CLASS =
  "underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors";

const getSeasonScreenings = () =>
  fetchChristmasScreenings().catch(() => null);

const pageTitle = (year: number) => `Świąteczne hity w kinach ${year}`;

export const generateMetadata = async (): Promise<Metadata> => {
  const season = getChristmasSeason();
  const groups = await getSeasonScreenings();
  const summary = summarizeChristmas(groups ?? []);
  const title = `${pageTitle(season.year)}: gdzie obejrzeć filmy świąteczne`;
  const description =
    summary.screenings > 0
      ? `Świąteczne hity na dużym ekranie: ${summary.screenings} ${pluralPl(summary.screenings, "seans", "seanse", "seansów")} w ${summary.cities} ${pluralPl(summary.cities, "mieście", "miastach", "miastach")} od ${seasonRangeLabel(season)}. Kina, dni i godziny, miasto po mieście.`
      : `Gdzie obejrzeć w kinie „Kevina”, „Grincha” czy „To właśnie miłość”? Seanse świątecznych hitów od ${seasonRangeLabel(season)}, miasto po mieście.`;

  return {
    title,
    description,
    alternates: { canonical: URL },
    ...(isChristmasIndexable(groups) === false ? NOINDEX_FOLLOW : {}),
    openGraph: {
      ...BASE_OPEN_GRAPH,
      type: "website",
      title,
      description,
      url: URL,
    },
    twitter: { card: "summary_large_image", title, description },
  };
};

interface CinemaBlockProps {
  cinema: ChristmasCinema;
}

const CinemaBlock = ({ cinema }: CinemaBlockProps) => (
  <li className="border-t border-white/10 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-12">
    <h3 className="lg:col-span-4 text-lg md:text-xl text-white -tracking-[0.01em] leading-snug">
      {/* Chain venues are noindex, so they get no link. */}
      {cinema.isChain ? (
        cinema.name
      ) : (
        <Link href={`/kina/${cinema.slug}`} className={LINK_CLASS}>
          {cinema.name}
        </Link>
      )}
    </h3>
    <ul className="lg:col-span-8 flex flex-col gap-5">
      {cinema.films.map((film) => {
        const shown = film.days.slice(0, MAX_DAYS_PER_FILM);
        const hidden = film.days
          .slice(MAX_DAYS_PER_FILM)
          .reduce((sum, day) => sum + day.times.length, 0);
        return (
          <li key={film.slug} data-christmas-film="">
            <p className="text-base md:text-lg text-white">
              <Link href={`/filmy/${film.slug}`} className={LINK_CLASS}>
                {film.title}
              </Link>{" "}
              <span className="text-white/45">({film.year})</span>
            </p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm md:text-base text-white/65 tabular-nums">
              {shown.map((day) => (
                <li key={day.date}>
                  <span className="text-white/45">
                    {formatChristmasDay(day.date)}:
                  </span>{" "}
                  {day.times.join(", ")}
                </li>
              ))}
              {hidden > 0 && (
                <li className="text-white/45">
                  i {hidden} {pluralPl(hidden, "kolejny seans", "kolejne seanse", "kolejnych seansów")}
                </li>
              )}
            </ul>
          </li>
        );
      })}
    </ul>
  </li>
);

interface CitySectionProps {
  city: ChristmasCity;
}

const CitySection = ({ city }: CitySectionProps) => (
  <section
    id={city.slug}
    className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-12 md:pb-16 scroll-mt-24"
  >
    <h2 className={H2_CLASS}>
      Święta w kinie {inPlace(city.nameDeclinated)}
    </h2>
    <p className="mt-4 text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/50">
      {cityMetaLine(city)} ·{" "}
      <Link href={`/miasta/${city.slug}`} className="hover:text-white transition-colors">
        Cały repertuar {inPlace(city.nameDeclinated)}
      </Link>
    </p>
    <ul className="mt-8 md:mt-10">
      {city.cinemas.map((cinema) => (
        <CinemaBlock key={cinema.slug} cinema={cinema} />
      ))}
    </ul>
  </section>
);

const ChristmasPage = async () => {
  const season = getChristmasSeason();
  const groups = (await getSeasonScreenings()) ?? [];
  const cities = groupChristmasByCity(groups);
  const summary = summarizeChristmas(groups);
  const intro = christmasIntro(summary, season);
  const title = pageTitle(season.year);

  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />
      <LandingJsonLd
        name={title}
        path={CHRISTMAS_PATH}
        description={intro}
        screenings={groups}
      />

      <LandingHeader
        breadcrumbs={[{ name: "Święta w kinie", href: CHRISTMAS_PATH }]}
        title={
          <>
            Świąteczne hity w&nbsp;kinach {season.year}
          </>
        }
        intro={intro}
      />

      {cities.length > 1 && (
        <nav
          aria-label="Miasta"
          className="px-6 md:px-12 lg:px-16 pb-10 md:pb-14"
        >
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm md:text-base text-white/65">
            {cities.map((city) => (
              <li key={city.slug}>
                <a href={`#${city.slug}`} className={LINK_CLASS}>
                  {city.name}
                </a>{" "}
                <span className="text-white/40 tabular-nums">
                  {city.screenings}
                </span>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {cities.length > 0 ? (
        cities.map((city) => <CitySection key={city.slug} city={city} />)
      ) : (
        <div className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-20 md:pb-28">
          <EmptyState
            title={<>Grudniowy repertuar jeszcze się nie ukazał.</>}
            description={
              <>
                Kina publikują program na grudzień zwykle w&nbsp;drugiej połowie
                listopada. Strona uzupełnia się sama co godzinę, gdy tylko
                świąteczne seanse trafią do repertuarów.
              </>
            }
            cta={{ href: "/seanse", label: "Wszystkie seanse" }}
          />
        </div>
      )}

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-12 md:pb-16">
        <h2 className={H2_CLASS}>Skąd są dane</h2>
        <div className="mt-6 md:mt-8 flex flex-col gap-4 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
          <p>
            Zestawienie powstaje z&nbsp;repertuarów kin, które śledzi Klaps,
            i&nbsp;obejmuje seanse od {seasonRangeLabel(season)}. Liczymy
            każdy seans filmu z&nbsp;listy świątecznych hitów, a&nbsp;seanse,
            które już się odbyły, znikają ze strony.
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
            (klaps.space). Zestawienie aktualizujemy co godzinę.
          </p>
        </div>
      </section>

      <ListingFaq
        heading="Najczęstsze pytania"
        questions={christmasFaq(groups, cities, summary, season)}
      />

      <LinkGrid
        heading="Przeglądaj dalej"
        items={[
          { href: "/seanse", label: "Wszystkie seanse" },
          { href: "/miasta", label: "Miasta" },
          { href: CLASSIC_PATH, label: "Klasyka w kinach" },
          { href: "/w-liczbach", label: "Klaps w liczbach" },
        ]}
      />

      <Footer />
    </main>
  );
};

export default ChristmasPage;

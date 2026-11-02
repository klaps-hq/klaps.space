import React from "react";
import Link from "next/link";
import { IProgrammeProfile } from "@/interfaces/IProgrammeProfile";
import { IndexableSlugs } from "@/lib/sitemap-entries";
import {
  ProfileSubject,
  buildProfileSentences,
  hasProfileContent,
  MIN_SCREENINGS_FOR_PATTERN,
  sinceMonth,
  studioCinemas,
} from "@/lib/programme-profile";
import { pluralPl } from "@/lib/seo";
import UncrawledLink from "@/components/common/uncrawled-link";
import ContentSection, {
  SECTION_META_CLASS,
} from "@/components/common/content-section";

interface ProgrammeProfileProps {
  /** Content of the section's H2. */
  heading: React.ReactNode;
  profile: IProgrammeProfile | null;
  subject: ProfileSubject;
  /** null links nothing: a failed lookup must not link noindex pages. */
  indexable: IndexableSlugs | null;
}

interface StatProps {
  value: React.ReactNode;
  label: string;
}

interface UncrawledTarget {
  basePath: "/kina" | "/miasta" | "/filmy" | "/gatunki" | "/rezyserzy";
  slug: string;
}

interface RankedListProps {
  title: string;
  items: {
    key: string;
    label: string;
    href: string | null;
    /** Noindex target: clickable for people, invisible to crawlers. */
    uncrawled?: UncrawledTarget;
    count: number;
  }[];
}

const WEEKDAY_SHORT = ["pn", "wt", "śr", "cz", "pt", "sb", "nd"];

const META_CLASS = SECTION_META_CLASS;

const Stat = ({ value, label }: StatProps) => (
  <div className="flex flex-col gap-1.5 border-t border-white/15 pt-4">
    <span className="text-3xl md:text-4xl font-light -tracking-[0.03em] text-white tabular-nums leading-none">
      {value}
    </span>
    <span className={META_CLASS}>{label}</span>
  </div>
);

const RankedList = ({ title, items }: RankedListProps) => {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className={`${META_CLASS} mb-2`}>{title}</h3>
      <ol className="flex flex-col">
        {items.map((item) => (
          <li
            key={item.key}
            className="flex items-baseline justify-between gap-4 border-t border-white/10 py-2 text-sm"
          >
            {item.href ? (
              <Link
                href={item.href}
                className="min-w-0 text-white/75 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ) : item.uncrawled ? (
              <UncrawledLink
                basePath={item.uncrawled.basePath}
                slug={item.uncrawled.slug}
                className="min-w-0 cursor-pointer text-white/75 hover:text-white transition-colors"
              >
                {item.label}
              </UncrawledLink>
            ) : (
              <span className="min-w-0 text-white/75">{item.label}</span>
            )}
            <span className="shrink-0 text-xs text-white/40 tabular-nums">
              {item.count}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
};

/**
 * "W liczbach": what a cinema, city, genre or director's special programme
 * has looked like so far, from screening history in the database. Gives
 * venue and hub pages facts no other site has, and the copy changes with
 * the data instead of repeating a template.
 *
 * Server-rendered, so it ships in the static HTML. Links only point at
 * pages that are indexable; films stay plain text because a film without
 * recent screenings has a noindex page.
 */
const ProgrammeProfile = ({
  heading,
  profile,
  subject,
  indexable,
}: ProgrammeProfileProps) => {
  if (!hasProfileContent(profile)) return null;

  const sentences = buildProfileSentences(profile, subject);
  const maxWeekday = Math.max(...profile.weekdays);
  const showChart =
    profile.screenings >= MIN_SCREENINGS_FOR_PATTERN && maxWeekday > 0;

  const genreHref = (slug: string) =>
    indexable && (!indexable.genres || indexable.genres.has(slug))
      ? `/gatunki/${slug}`
      : null;
  const directorHref = (slug: string) =>
    indexable?.directors.has(slug) ? `/rezyserzy/${slug}` : null;
  const cinemaHref = (slug: string) =>
    indexable?.cinemas.has(slug) ? `/kina/${slug}` : null;
  const cityHref = (slug: string) =>
    indexable?.cities.has(slug) ? `/miasta/${slug}` : null;

  const lists: RankedListProps[] = [
    {
      title: "Najczęściej grane filmy",
      items: profile.topMovies.map((m) => ({
        key: m.slug,
        label: `${m.title} (${m.productionYear})`,
        href: null,
        uncrawled: { basePath: "/filmy", slug: m.slug },
        count: m.count,
      })),
    },
  ];
  if (subject.kind === "city" || subject.kind === "genre" || subject.kind === "director") {
    lists.push({
      title: "Kina studyjne z największą liczbą seansów",
      items: studioCinemas(profile).slice(0, 5).map((c) => ({
        key: c.slug,
        label: subject.kind === "city" ? c.name : `${c.name}, ${c.cityName}`,
        href: cinemaHref(c.slug),
        uncrawled: { basePath: "/kina", slug: c.slug },
        count: c.count,
      })),
    });
  }
  if (subject.kind !== "genre") {
    lists.push({
      title: "Gatunki",
      items: profile.topGenres.map((g) => ({
        key: g.slug,
        label: g.name,
        href: genreHref(g.slug),
        uncrawled: { basePath: "/gatunki", slug: g.slug },
        count: g.count,
      })),
    });
  }
  if (subject.kind === "cinema" || subject.kind === "city") {
    lists.push({
      title: "Reżyserzy",
      items: profile.topDirectors.map((d) => ({
        key: d.slug,
        label: d.name,
        href: directorHref(d.slug),
        uncrawled: { basePath: "/rezyserzy", slug: d.slug },
        count: d.count,
      })),
    });
  }
  if (subject.kind === "movie") {
    // One film: its own top film, genre and director lists say nothing.
    // Where it played is the point, chains included.
    lists.splice(0, lists.length, {
      title: "Kina, które najczęściej go grały",
      items: profile.topCinemas.slice(0, 8).map((c) => ({
        key: c.slug,
        label: `${c.name}, ${c.cityName}`,
        href: cinemaHref(c.slug),
        uncrawled: { basePath: "/kina", slug: c.slug },
        count: c.count,
      })),
    });
  }
  if (
    subject.kind === "genre" ||
    subject.kind === "director" ||
    subject.kind === "movie"
  ) {
    lists.push({
      title: "Miasta",
      items: profile.topCities.map((c) => ({
        key: c.slug,
        label: c.name,
        href: cityHref(c.slug),
        uncrawled: { basePath: "/miasta", slug: c.slug },
        count: c.count,
      })),
    });
  }

  // A film page, or a director with one film in the history.
  const singleFilm =
    subject.kind === "movie" ||
    (subject.kind === "director" && profile.movies === 1);

  const venueStat =
    subject.kind === "cinema"
      ? {
          value: profile.monthsActive,
          label: pluralPl(
            profile.monthsActive,
            "miesiąc z seansami",
            "miesiące z seansami",
            "miesięcy z seansami"
          ),
        }
      : {
          value: profile.cinemas,
          label: pluralPl(profile.cinemas, "kino", "kina", "kin"),
        };

  const [leadSentence, ...restSentences] = sentences;

  return (
    <ContentSection
      heading={heading}
      lead={`Z historii repertuaru zbieranej przez Klaps${profile.since ? ` ${sinceMonth(profile.since)}` : ""}. Liczymy tylko seanse, które już się odbyły.`}
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6">
        <Stat
          value={profile.screenings}
          label={pluralPl(profile.screenings, "seans", "seanse", "seansów")}
        />
        {/* One film: "1 film" and its own year as "the oldest film" are
            template noise, so count cities and months instead. */}
        {singleFilm ? (
          <Stat
            value={profile.cities}
            label={pluralPl(profile.cities, "miasto", "miasta", "miast")}
          />
        ) : (
          <Stat
            value={profile.movies}
            label={pluralPl(profile.movies, "film", "filmy", "filmów")}
          />
        )}
        <Stat value={venueStat.value} label={venueStat.label} />
        {singleFilm ? (
          <Stat
            value={profile.monthsActive}
            label={pluralPl(
              profile.monthsActive,
              "miesiąc z seansami",
              "miesiące z seansami",
              "miesięcy z seansami"
            )}
          />
        ) : (
          profile.oldestMovie && (
            <Stat
              value={profile.oldestMovie.productionYear}
              label="rok najstarszego filmu"
            />
          )
        )}
      </div>

      <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
        <div className="md:col-span-7 flex flex-col gap-3 max-w-[60ch]">
          {leadSentence && (
            <p className="text-base md:text-lg text-white/80 leading-relaxed">
              {leadSentence}
            </p>
          )}
          {restSentences.map((sentence) => (
            <p
              key={sentence}
              className="text-sm md:text-[15px] text-white/55 leading-relaxed"
            >
              {sentence}
            </p>
          ))}
        </div>

        {showChart && (
          <figure className="md:col-span-5">
            <figcaption className={`${META_CLASS} mb-3`}>
              Seanse według dnia tygodnia
            </figcaption>
            <div className="flex items-end gap-2 md:gap-3 h-24 md:h-28" aria-hidden="true">
              {profile.weekdays.map((count, index) => (
                <div
                  key={WEEKDAY_SHORT[index]}
                  className="flex-1 flex flex-col items-center justify-end gap-1.5 h-full"
                >
                  <span className="text-[10px] tabular-nums text-white/40">
                    {count}
                  </span>
                  <div
                    className="w-full max-w-5 bg-white/70"
                    style={{
                      height: `${Math.max((count / maxWeekday) * 100, count > 0 ? 4 : 1)}%`,
                      opacity: count > 0 ? 1 : 0.15,
                    }}
                  />
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/45">
                    {WEEKDAY_SHORT[index]}
                  </span>
                </div>
              ))}
            </div>
            {/* The bars are decorative; the same numbers in text for screen
                readers and crawlers. */}
            <p className="sr-only">
              {profile.weekdays
                .map((count, index) => `${WEEKDAY_SHORT[index]}: ${count}`)
                .join(", ")}
            </p>
          </figure>
        )}
      </div>

      <div className="mt-10 md:mt-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-8">
        {lists.map((list) => (
          <RankedList key={list.title} title={list.title} items={list.items} />
        ))}
      </div>
    </ContentSection>
  );
};

export default ProgrammeProfile;

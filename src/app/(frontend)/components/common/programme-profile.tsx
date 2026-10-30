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

const CELL_CLASS =
  "border border-[#1a1a1a] -mt-px -ml-px px-4 md:px-5 py-5 md:py-6 flex flex-col gap-1";
const META_CLASS =
  "text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/50";

const Stat = ({ value, label }: StatProps) => (
  <div className={CELL_CLASS}>
    <span className="text-3xl md:text-5xl font-medium -tracking-[0.03em] text-white tabular-nums">
      {value}
    </span>
    <span className={META_CLASS}>{label}</span>
  </div>
);

const RankedList = ({ title, items }: RankedListProps) => {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className={`${META_CLASS} mb-3 md:mb-4`}>{title}</h3>
      <ol className="flex flex-col">
        {items.map((item) => (
          <li
            key={item.key}
            className="flex items-baseline justify-between gap-4 border-t border-white/10 first:border-t-0 first:pt-0 last:pb-0 py-2.5 text-sm md:text-base"
          >
            {item.href ? (
              <Link
                href={item.href}
                className="text-white/75 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ) : item.uncrawled ? (
              <UncrawledLink
                basePath={item.uncrawled.basePath}
                slug={item.uncrawled.slug}
                className="cursor-pointer text-white/75 hover:text-white transition-colors"
              >
                {item.label}
              </UncrawledLink>
            ) : (
              <span className="text-white/75">{item.label}</span>
            )}
            <span className="shrink-0 text-xs md:text-sm text-white/45 tabular-nums">
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

  return (
    <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-20 md:pb-28">
      <h2 className="text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
        {heading}
      </h2>
      <p className="mt-4 md:mt-5 mb-8 md:mb-10 max-w-[64ch] text-sm md:text-base text-white/55 leading-relaxed">
        {`Z historii repertuaru zbieranej przez Klaps${profile.since ? ` ${sinceMonth(profile.since)}` : ""}. Liczymy tylko seanse, które już się odbyły.`}
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 pt-px pl-px">
        <Stat
          value={profile.screenings}
          label={pluralPl(profile.screenings, "seans", "seanse", "seansów")}
        />
        <Stat
          value={profile.movies}
          label={pluralPl(profile.movies, "film", "filmy", "filmów")}
        />
        <Stat value={venueStat.value} label={venueStat.label} />
        {profile.oldestMovie && (
          <Stat
            value={profile.oldestMovie.productionYear}
            label="rok najstarszego filmu"
          />
        )}
      </div>

      <div className="mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-7 flex flex-col gap-4 max-w-[64ch] text-base md:text-lg text-white/70 leading-relaxed">
          {sentences.map((sentence) => (
            <p key={sentence}>{sentence}</p>
          ))}
        </div>

        {showChart && (
          <figure className="lg:col-span-5">
            <figcaption className={`${META_CLASS} mb-4`}>
              Seanse według dnia tygodnia
            </figcaption>
            <div className="flex items-end gap-6 md:gap-10 h-32 md:h-40" aria-hidden="true">
              {profile.weekdays.map((count, index) => (
                <div
                  key={WEEKDAY_SHORT[index]}
                  className="flex-1 flex flex-col items-center justify-end gap-2 h-full"
                >
                  <span className="text-[10px] tabular-nums text-white/45">
                    {count}
                  </span>
                  <div
                    className="w-full max-w-6 bg-white/80"
                    style={{
                      height: `${Math.max((count / maxWeekday) * 100, count > 0 ? 4 : 1)}%`,
                      opacity: count > 0 ? 1 : 0.15,
                    }}
                  />
                  <span className="text-[10px] uppercase tracking-[0.18em] text-white/50">
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

      <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
        {lists.map((list) => (
          <RankedList key={list.title} title={list.title} items={list.items} />
        ))}
      </div>
    </section>
  );
};

export default ProgrammeProfile;

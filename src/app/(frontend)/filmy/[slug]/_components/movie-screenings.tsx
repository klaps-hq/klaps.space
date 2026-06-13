"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { IScreening } from "@/interfaces/IScreenings";
import CityField from "@/app/(home)/_components/screenings/city-field";
import AddToCalendarButton from "@/components/common/add-to-calendar-button";
import ShareButton from "@/components/common/share-button";
import { usePreferredCity } from "@/contexts/city-context";
import { groupScreeningsByCinema } from "@/lib/screenings";
import { SITE_URL } from "@/lib/site-config";
import { formatDateLabel, cn, WARSAW_TZ } from "@/lib/utils";
import { wallTimeToInstant } from "@/lib/warsaw-time";
import { voivodeshipLocative } from "@/lib/voivodeships";

interface MovieScreeningsProps {
  screenings: IScreening[];
  movieTitle: string;
  movieSlug: string;
  movieDuration: number | null;
}

interface ScreeningTimeProps {
  screening: IScreening;
}

const formatFullDateLabel = (dateStr: string): string => {
  const base = formatDateLabel(dateStr);
  if (base === "Dziś" || base === "Jutro") {
    const date = new Date(dateStr).toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      timeZone: WARSAW_TZ,
    });
    return `${base} · ${date}`;
  }
  return base;
};

const formatShortDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    timeZone: WARSAW_TZ,
  });

// We do not sell tickets or broker reservations, so the time is plain
// text and never links out to a booking page.
const ScreeningTime: React.FC<ScreeningTimeProps> = ({ screening }) => {
  return (
    <span className="flex flex-col items-center gap-1.5 cursor-default">
      <span className="text-2xl md:text-3xl font-semibold tabular-nums -tracking-[0.01em] text-white/80">
        {screening.time}
      </span>
      <span className="text-[10px] uppercase tracking-[0.2em] tabular-nums text-white/50">
        {formatShortDate(screening.date)}
      </span>
    </span>
  );
};

interface CinemaRowProps {
  screenings: IScreening[];
  movieTitle: string;
  movieSlug: string;
  movieDuration: number | null;
  activeDate: string;
}

// Weekday + numeric date for the share message, e.g. "czw., 12.06".
const formatShareDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("pl-PL", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    timeZone: WARSAW_TZ,
  });

const CinemaRow: React.FC<CinemaRowProps> = ({
  screenings,
  movieTitle,
  movieSlug,
  movieDuration,
  activeDate,
}) => {
  const first = screenings[0];
  if (!first) return null;

  const sorted = [...screenings].sort((a, b) =>
    a.dateTime.localeCompare(b.dateTime)
  );

  // Deep link back to this exact view: the ?city/?date params preselect
  // the sharer's city and date, #seanse scrolls to the screenings section.
  const shareParams = new URLSearchParams({
    city: String(first.cinema.city.id),
    date: activeDate,
  });
  const shareUrl = `${SITE_URL}/filmy/${movieSlug}?${shareParams.toString()}#seanse`;
  const shareTimes = sorted.map((s) => s.time).join(", ");
  const shareText = `${movieTitle} - ${first.cinema.name}, ${first.cinema.city.name}, ${formatShareDate(activeDate)}, godz. ${shareTimes}`;

  const movieUrl = `${SITE_URL}/filmy/${movieSlug}`;
  const calendarOptions = sorted.map((screening) => ({
    label: `${screening.time} · ${formatShortDate(screening.date)}`,
    // Calendar exports need a real instant; the API's dateTime is Warsaw
    // wall time with a misleading "Z" and would land 1-2 h late as UTC.
    start: wallTimeToInstant(screening.dateTime).toISOString(),
    uid: `screening-${screening.id}@klaps.space`,
    fileName: `${movieSlug}-${screening.date}-${screening.time.replace(":", "")}.ics`,
    description: [
      `Seans filmu "${movieTitle}" w ${first.cinema.name}, ${first.cinema.city.name}.`,
      `Szczegóły: ${movieUrl}`,
    ].join("\n"),
  }));

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8 py-5 md:py-6">
      <div className="flex flex-col gap-1 min-w-0">
        <Link
          href={`/kina/${first.cinema.slug}`}
          className="w-fit text-xl md:text-2xl lg:text-3xl font-medium uppercase -tracking-[0.01em] leading-tight text-white hover:text-white/70 transition-colors"
        >
          {first.cinema.name}
        </Link>
        <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/50">
          {/* py/-my widen the ~12px text to a usable tap target. */}
          <Link
            href={`/miasta/${first.cinema.city.slug}`}
            className="inline-block py-2.5 -my-2.5 hover:text-white underline-offset-4 hover:underline transition-colors"
          >
            {first.cinema.city.name}
          </Link>
          {first.cinema.street ? ` · ${first.cinema.street}` : ""}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 md:justify-end md:gap-x-7 shrink-0">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 md:justify-end">
          {sorted.map((screening) => (
            <ScreeningTime key={screening.id} screening={screening} />
          ))}
        </div>
        {/* Desktop: quiet icon actions behind a divider. */}
        <div className="hidden md:flex items-center gap-5 self-stretch border-l border-white/10 pl-7">
          <AddToCalendarButton
            title={`${movieTitle} - ${first.cinema.name}`}
            durationMinutes={movieDuration}
            location={[first.cinema.name, first.cinema.street, first.cinema.city.name]
              .filter(Boolean)
              .join(", ")}
            url={movieUrl}
            options={calendarOptions}
          />
          <ShareButton
            variant="compact"
            title={`${movieTitle} - ${first.cinema.name}`}
            text={shareText}
            url={shareUrl}
          />
        </div>
        {/* Mobile: right-aligned column of labeled buttons with tall touch targets. */}
        <div className="flex md:hidden flex-col items-start gap-y-2 ml-auto">
          <AddToCalendarButton
            variant="labeled"
            title={`${movieTitle} - ${first.cinema.name}`}
            durationMinutes={movieDuration}
            location={[first.cinema.name, first.cinema.street, first.cinema.city.name]
              .filter(Boolean)
              .join(", ")}
            url={movieUrl}
            options={calendarOptions}
          />
          <ShareButton
            variant="labeled"
            title={`${movieTitle} - ${first.cinema.name}`}
            text={shareText}
            url={shareUrl}
          />
        </div>
      </div>
    </div>
  );
};

const MovieScreenings: React.FC<MovieScreeningsProps> = ({
  screenings,
  movieTitle,
  movieSlug,
  movieDuration,
}) => {
  const { cityId, voivodeship, locationLabel, isHydrated, setCityId, cities } =
    usePreferredCity();

  // Resolve voivodeship from the canonical cities list (the same source
  // the city select is built from) keyed by city id, rather than the
  // screening payload's city.voivodeship - that field is not guaranteed
  // to be populated on the per-movie screenings endpoint, which would
  // wrongly empty the list for a voivodeship that does have showtimes.
  const voivodeshipByCityId = useMemo(() => {
    const map = new Map<number, string | null>();
    for (const city of cities) {
      map.set(city.id, city.voivodeship);
    }
    return map;
  }, [cities]);

  // The page is statically cached with the nationwide list, so the
  // preferred-location filter is applied here after hydration. A city
  // or voivodeship with no showtimes renders an explicit empty state.
  const visibleScreenings = useMemo(() => {
    if (!isHydrated || (cityId === null && voivodeship === null)) {
      return screenings;
    }
    if (cityId !== null) {
      return screenings.filter((s) => s.cinema.city.id === cityId);
    }
    return screenings.filter(
      (s) => voivodeshipByCityId.get(s.cinema.city.id) === voivodeship
    );
  }, [screenings, cityId, voivodeship, isHydrated, voivodeshipByCityId]);

  const cityEmpty = screenings.length > 0 && visibleScreenings.length === 0;

  const availableDates = [
    ...new Set(visibleScreenings.map((s) => s.date)),
  ].sort();
  const [selectedDate, setSelectedDate] = useState<string | null>(
    () => availableDates[0] ?? null
  );

  // Shared screening links carry ?date= - preselect that day when it
  // still has showtimes. Read from window (not useSearchParams) to keep
  // the statically cached page free of a Suspense boundary.
  useEffect(() => {
    const dateParam = new URLSearchParams(window.location.search).get("date");
    if (dateParam && screenings.some((s) => s.date === dateParam)) {
      setSelectedDate(dateParam);
    }
    // Run once on mount - the param does not change without navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (screenings.length === 0) {
    return (
      <div className="flex flex-col items-center text-center gap-8 py-8 md:py-12">
        <div className="flex flex-col items-center gap-3 md:gap-4">
          <p className="text-2xl md:text-3xl lg:text-4xl font-medium -tracking-[0.02em] leading-tight text-white max-w-[24ch]">
            Brak nadchodzących seansów tego filmu.
          </p>
          <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-[52ch]">
            Repertuar aktualizujemy regularnie, zajrzyj ponownie za kilka dni
            albo sprawdź, co innego grają kina studyjne.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <Link
            href="/seanse"
            className="group inline-flex items-center gap-2.5 text-[11px] md:text-xs uppercase tracking-[0.25em] text-white"
          >
            <span className="underline underline-offset-4 decoration-white/30 group-hover:decoration-white transition-colors">
              Pełny repertuar
            </span>
            <ArrowRight
              aria-hidden="true"
              className="size-3.5 shrink-0 transition-transform group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/kina"
            className="group inline-flex items-center gap-2.5 text-[11px] md:text-xs uppercase tracking-[0.25em] text-white/70 hover:text-white transition-colors"
          >
            <span className="underline underline-offset-4 decoration-white/20 group-hover:decoration-white transition-colors">
              Kina studyjne
            </span>
            <ArrowRight
              aria-hidden="true"
              className="size-3.5 shrink-0 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    );
  }

  // The chosen location has no showtimes for this movie: explicit empty
  // state with the city select still available, plus a one-click reset.
  if (cityEmpty) {
    return (
      <div className="flex flex-col">
        <div className="flex justify-end">
          <CityField />
        </div>
        <div className="flex flex-col items-center text-center gap-6 py-10 md:py-14">
          <p className="text-xl md:text-2xl font-medium -tracking-[0.01em] leading-tight text-white max-w-[28ch]">
            {voivodeship !== null
              ? `Brak seansów tego filmu w województwie ${voivodeshipLocative(voivodeship)}.`
              : `Brak seansów tego filmu w mieście ${locationLabel}.`}
          </p>
          <button
            type="button"
            onClick={() => setCityId(null)}
            className="inline-flex items-center border border-white/30 hover:border-white hover:bg-white/[0.06] px-6 md:px-8 py-3 text-[11px] md:text-xs uppercase tracking-[0.28em] text-white transition-colors"
          >
            Pokaż wszystkie miasta
          </button>
        </div>
      </div>
    );
  }

  // Always exactly one selected date; if the selected one disappeared
  // (e.g. after a city change), fall back to the earliest available.
  const activeDate =
    selectedDate && availableDates.includes(selectedDate)
      ? selectedDate
      : availableDates[0];

  const groups = groupScreeningsByCinema(
    visibleScreenings.filter((s) => s.date === activeDate)
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-col md:flex-row md:flex-wrap md:items-center gap-4 md:gap-x-6 md:gap-y-3 pb-5 border-b border-white/10">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {availableDates.map((date) => {
            const active = activeDate === date;
            return (
              <button
                key={date}
                type="button"
                onClick={() => setSelectedDate(date)}
                className={cn(
                  // The before: overlay widens the ~22px tab to a 44px tap
                  // target without moving the underline or the layout.
                  "relative before:absolute before:-inset-x-2 before:-inset-y-3 before:content-['']",
                  "shrink-0 pb-1 text-[11px] uppercase tracking-wider border-b transition-colors whitespace-nowrap",
                  active
                    ? "text-white border-white"
                    : "text-white/55 border-transparent hover:text-white hover:border-white/40"
                )}
              >
                {formatFullDateLabel(date)}
              </button>
            );
          })}
        </div>
        <div className="md:ml-auto">
          <CityField className="w-full md:w-auto" />
        </div>
      </div>

      <ul className="divide-y divide-white/10">
        {groups.map((cinemaScreenings) => (
          <li key={cinemaScreenings[0].cinema.id}>
            <CinemaRow
              screenings={cinemaScreenings}
              movieTitle={movieTitle}
              movieSlug={movieSlug}
              movieDuration={movieDuration}
              activeDate={activeDate}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovieScreenings;

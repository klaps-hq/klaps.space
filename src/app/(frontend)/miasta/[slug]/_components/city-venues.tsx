import React from "react";
import Link from "next/link";
import {
  CityVenueSummary,
  hasVenueFacts,
  roomLabel,
  screensPl,
  seatsPl,
} from "@/lib/city-venues";
import { pluralPl } from "@/lib/seo";
import UncrawledLink from "@/components/common/uncrawled-link";

interface CityVenuesProps {
  heading: React.ReactNode;
  summary: CityVenueSummary;
  /** Venues whose page is noindex render as plain text, without a link. */
  isLinked: (slug: string) => boolean;
}

interface StatProps {
  value: React.ReactNode;
  label: string;
}

const META_CLASS =
  "text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/50";

const Stat = ({ value, label }: StatProps) => (
  <div className="border border-[#1a1a1a] -mt-px -ml-px px-4 md:px-5 py-5 md:py-6 flex flex-col gap-1">
    <span className="text-2xl md:text-4xl font-light tabular-nums text-white -tracking-[0.02em]">
      {value}
    </span>
    <span className={META_CLASS}>{label}</span>
  </div>
);

/**
 * The city's independent venues side by side: rooms, seats, operator and
 * accessibility, aggregated from the researched cinema details. Hidden when
 * no venue in the city has any of these facts.
 */
const CityVenues = ({ heading, summary, isLinked }: CityVenuesProps) => {
  if (!hasVenueFacts(summary)) return null;
  const { rows, largest } = summary;

  return (
    <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-20 md:pb-28">
      <h2 className="mb-8 md:mb-10 text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
        {heading}
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 pt-px pl-px">
        <Stat
          value={rows.length}
          label={pluralPl(rows.length, "kino studyjne", "kina studyjne", "kin studyjnych")}
        />
        {summary.venuesWithScreens > 0 && (
          <Stat
            value={summary.screens}
            label={`${pluralPl(summary.screens, "sala", "sale", "sal")}${
              summary.venuesWithScreens < rows.length
                ? ` w ${summary.venuesWithScreens} ${pluralPl(summary.venuesWithScreens, "kinie", "kinach", "kinach")}`
                : ""
            }`}
          />
        )}
        {summary.venuesWithSeats > 0 && (
          <Stat
            value={summary.seats}
            label={`${pluralPl(summary.seats, "miejsce", "miejsca", "miejsc")}${
              summary.venuesWithSeats < rows.length
                ? ` w ${summary.venuesWithSeats} ${pluralPl(summary.venuesWithSeats, "kinie", "kinach", "kinach")}`
                : ""
            }`}
          />
        )}
        {largest && (
          <Stat
            value={largest.seats}
            label={`największa sala: ${largest.cinemaName}`}
          />
        )}
      </div>

      <div className="mt-10 md:mt-12 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm md:text-base">
          <thead>
            <tr className={META_CLASS}>
              <th scope="col" className="py-3 pr-4 font-normal">Kino</th>
              <th scope="col" className="py-3 pr-4 font-normal">Sale</th>
              <th scope="col" className="py-3 pr-4 font-normal">Miejsca</th>
              <th scope="col" className="py-3 pr-4 font-normal">Dostępność</th>
              <th scope="col" className="py-3 font-normal">Prowadzi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.slug} className="border-t border-white/10 align-top">
                <th scope="row" className="py-3 pr-4 font-medium text-white/85">
                  {isLinked(row.slug) ? (
                    <Link
                      href={`/kina/${row.slug}`}
                      className="hover:text-white underline-offset-4 hover:underline"
                    >
                      {row.name}
                    </Link>
                  ) : (
                    <UncrawledLink
                      basePath="/kina"
                      slug={row.slug}
                      className="cursor-pointer hover:text-white underline-offset-4 hover:underline"
                    >
                      {row.name}
                    </UncrawledLink>
                  )}
                </th>
                <td className="py-3 pr-4 tabular-nums text-white/70">
                  {row.screens ?? "-"}
                </td>
                <td className="py-3 pr-4 tabular-nums text-white/70">
                  {row.seats ?? "-"}
                </td>
                <td className="py-3 pr-4 text-white/70">
                  {[
                    row.wheelchair && "wózki",
                    row.hearingLoop && "pętla indukcyjna",
                  ]
                    .filter(Boolean)
                    .join(", ") || "-"}
                </td>
                <td className="py-3 text-white/60">{row.operator ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {largest && (
        <p className="mt-8 max-w-[68ch] text-sm md:text-base text-white/55 leading-relaxed">
          Największa sala to {roomLabel(largest.roomName)} w&nbsp;kinie{" "}
          {largest.cinemaName} ({seatsPl(largest.seats)}).
          {summary.venuesWithScreens > 0 &&
            ` Kina, które podają liczbę sal, mają ich łącznie ${screensPl(summary.screens)}.`}{" "}
          Dane pochodzą ze stron kin i&nbsp;instytucji, które je prowadzą.
        </p>
      )}
    </section>
  );
};

export default CityVenues;

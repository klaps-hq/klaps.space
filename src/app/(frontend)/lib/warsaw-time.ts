import { WARSAW_TZ } from "./utils";

// The screenings API serializes Warsaw wall-clock times with a "Z"
// suffix: "2026-06-13T18:30:00Z" means 18:30 on Polish clocks, not UTC.
// Parsing it as-is yields a pseudo instant shifted by the UTC offset,
// which corrupts every consumer that treats it as a real instant
// (JSON-LD startDate, calendar exports, date formatting near midnight).

// Real Europe/Warsaw UTC offset (in minutes) at the given instant.
const offsetMinutesAt = (instant: Date): number => {
  const name =
    new Intl.DateTimeFormat("en-US", {
      timeZone: WARSAW_TZ,
      timeZoneName: "longOffset",
    })
      .formatToParts(instant)
      .find((part) => part.type === "timeZoneName")?.value ?? "GMT+01:00";
  const match = name.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!match) return 60;
  const sign = match[1] === "-" ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3]));
};

// Offset for a wall time parsed as if it were UTC. Computed at the
// pseudo instant first, then refined once so wall times right after a
// DST switch resolve to the post-switch offset.
const offsetForWallTime = (pseudoInstant: Date): number => {
  const guess = offsetMinutesAt(pseudoInstant);
  return offsetMinutesAt(new Date(pseudoInstant.getTime() - guess * 60000));
};

/** True instant of an API wall time: "…18:30:00Z" -> 16:30 UTC in summer. */
export const wallTimeToInstant = (apiDateTime: string | Date): Date => {
  const pseudo =
    apiDateTime instanceof Date ? apiDateTime : new Date(apiDateTime);
  return new Date(pseudo.getTime() - offsetForWallTime(pseudo) * 60000);
};

/**
 * ISO 8601 string keeping the API's wall-clock hour with the real
 * Warsaw offset attached: "2026-06-13T18:30:00+02:00". The pages display
 * that wall-clock hour, so structured data must carry the same value.
 */
export const wallTimeToWarsawIso = (apiDateTime: string | Date): string => {
  const pseudo =
    apiDateTime instanceof Date ? apiDateTime : new Date(apiDateTime);
  const offset = offsetForWallTime(pseudo);
  const sign = offset < 0 ? "-" : "+";
  const abs = Math.abs(offset);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  return `${pseudo.toISOString().slice(0, 19)}${sign}${hh}:${mm}`;
};

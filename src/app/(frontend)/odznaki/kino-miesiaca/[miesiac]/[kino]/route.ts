import { NextRequest } from "next/server";
import {
  BadgeTheme,
  buildCinemaBadgeSvg,
  getCinemasOfTheMonth,
  isFinishedStatsMonth,
} from "@/lib/cinema-of-the-month";
import { getMonthStats } from "@/lib/month-stats";

interface CinemaBadgeRouteContext {
  params: Promise<{ miesiac: string; kino: string }>;
}

// A finished month never changes, so a served badge can sit in caches for
// a long time. Misses stay short: a month that is still running gets its
// badges once it ends.
const HIT_CACHE = "public, max-age=604800, s-maxage=2592000";
const MISS_CACHE = "public, max-age=3600";

const notFound = () =>
  new Response("Not found", {
    status: 404,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": MISS_CACHE,
    },
  });

// GET /odznaki/kino-miesiaca/2026-10/iluzjon.svg[?theme=light]
export async function GET(
  request: NextRequest,
  { params }: CinemaBadgeRouteContext
) {
  const { miesiac, kino } = await params;
  const slug = kino.replace(/\.svg$/, "");
  if (!isFinishedStatsMonth(miesiac)) return notFound();

  let stats;
  try {
    stats = await getMonthStats(miesiac);
  } catch {
    // An API outage must not be cached as a missing badge.
    return new Response("Service unavailable", {
      status: 503,
      headers: { "Cache-Control": "no-store", "Retry-After": "300" },
    });
  }
  const cinema = stats
    ? getCinemasOfTheMonth(stats).find((item) => item.slug === slug)
    : undefined;
  if (!cinema) return notFound();

  const theme: BadgeTheme =
    request.nextUrl.searchParams.get("theme") === "light" ? "light" : "dark";

  return new Response(buildCinemaBadgeSvg(miesiac, cinema, theme), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": HIT_CACHE,
      // Opened directly, the file must not run anything or pull resources.
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
      "X-Content-Type-Options": "nosniff",
      // Embedded on cinema sites, i.e. cross-origin.
      "Cross-Origin-Resource-Policy": "cross-origin",
    },
  });
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = process.env.API_URL!;
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY!;

const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

const SLUG_ROUTES: Record<string, string> = {
  filmy: "movies",
  kina: "cinemas",
  miasta: "cities",
  gatunki: "genres",
};

const IS_NUMERIC = /^\d+$/;
const NOINDEX_QUERY_PREFIXES = new Set([
  "filmy",
  "kina",
  "miasta",
  "gatunki",
  "seanse",
]);

// Filter params produce a narrowed duplicate of the clean listing, so those
// variants are the ones to keep out of the index. Mirrors
// SCREENING_FILTER_PARAM_KEYS in lib/seo.ts; kept as a literal here because
// the proxy runs on the edge and should not pull in app code.
const FILTER_PARAM_KEYS = [
  "city",
  "voivodeship",
  "genres",
  "dateFrom",
  "dateTo",
  "search",
];

const hasFilterParam = (search: string): boolean => {
  const params = new URLSearchParams(search);
  return FILTER_PARAM_KEYS.some((key) =>
    params.getAll(key).some((value) => value.trim().length > 0)
  );
};

// Only filtered variants get noindex. Plain pagination (`?page=2`) stays
// indexable on purpose: it carries a unique title, a self-canonical and rel
// prev/next, and it is the crawl path into the deeper listing. Tracking
// params (utm_*, fbclid) also stay indexable and are consolidated by the
// canonical, matching the contract documented on hasFilterParams.
const shouldNoindexForQueryPath = (pathname: string, search: string) => {
  if (!hasFilterParam(search)) return false;
  if (pathname === "/") return true;
  const [firstSegment] = pathname.split("/").filter(Boolean);
  return Boolean(firstSegment && NOINDEX_QUERY_PREFIXES.has(firstSegment));
};

const fetchSlugById = async (
  apiEntity: string,
  numericId: string
): Promise<string | null> => {
  try {
    const res = await fetch(`${API_URL}/${apiEntity}/${numericId}`, {
      headers: { "x-internal-api-key": INTERNAL_API_KEY },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data.slug ?? null;
  } catch {
    return null;
  }
};

export async function proxy(request: NextRequest) {
  if (process.env.MAINTENANCE_MODE === "true" && !request.nextUrl.pathname.startsWith("/maintenance")) {
    // 503 + Retry-After: Google pauses crawling instead of deindexing pages.
    return NextResponse.rewrite(new URL("/maintenance", request.url), {
      status: 503,
      headers: { "Retry-After": "3600" },
    });
  }

  const { hostname, pathname, search } = request.nextUrl;

  if (hostname.startsWith("www.")) {
    const canonicalHost = hostname.replace(/^www\./, "");
    const destination = new URL(`https://${canonicalHost}${pathname}${search}`);
    return NextResponse.redirect(destination, 301);
  }

  if (pathname === "/index") {
    return NextResponse.redirect(new URL("/", request.url), 301);
  }

  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 2) {
    const [routePrefix, segment] = segments;

    // Single-screening pages were removed - old URLs (previously in the
    // sitemap and Google's index) get a 301 to the screenings list.
    if (routePrefix === "seanse" && IS_NUMERIC.test(segment)) {
      return NextResponse.redirect(new URL("/seanse", request.url), 301);
    }

    const apiEntity = SLUG_ROUTES[routePrefix];

    if (apiEntity && IS_NUMERIC.test(segment)) {
      const slug = await fetchSlugById(apiEntity, segment);

      // Some slugs are purely numeric (movies titled "1976", "1990");
      // redirecting to the same path would loop forever, so only
      // redirect when the resolved slug actually differs.
      if (slug && slug !== segment) {
        const destination = new URL(`/${routePrefix}/${slug}`, request.url);
        destination.search = search;
        return NextResponse.redirect(destination, 301);
      }
    }
  }

  const response = NextResponse.next();

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  if (search && shouldNoindexForQueryPath(pathname, search)) {
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

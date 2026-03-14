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

const shouldNoindexForQueryPath = (pathname: string) => {
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
    return NextResponse.rewrite(new URL("/maintenance", request.url));
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
    const apiEntity = SLUG_ROUTES[routePrefix];

    if (apiEntity && IS_NUMERIC.test(segment)) {
      const slug = await fetchSlugById(apiEntity, segment);

      if (slug) {
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

  if (search && shouldNoindexForQueryPath(pathname)) {
    response.headers.set("X-Robots-Tag", "noindex, follow");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

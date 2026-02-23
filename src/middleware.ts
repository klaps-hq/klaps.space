import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export const middleware = (request: NextRequest) => {
  const { hostname, pathname, search } = request.nextUrl;

  if (hostname.startsWith("www.")) {
    const canonicalHost = hostname.replace(/^www\./, "");
    const destination = new URL(`https://${canonicalHost}${pathname}${search}`);
    return NextResponse.redirect(destination, 301);
  }

  if (pathname === "/index") {
    return NextResponse.redirect(new URL("/", request.url), 301);
  }

  const response = NextResponse.next();

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  return response;
};

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

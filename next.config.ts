import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const PRODUCTION_URL = "https://klaps.space";
// Mirrors the guard in robots.ts: only the production host gets the policy.
const isProduction =
  (process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_URL) === PRODUCTION_URL;

// Report-Only baseline: violations surface in DevTools without breaking
// anything. Tighten and switch to enforcing Content-Security-Policy once
// the console stays clean across the app (map, trailers, GA, Ahrefs).
const CSP_REPORT_ONLY = [
  "default-src 'self'",
  // 'unsafe-inline' is required by Next.js bootstrap scripts and gtag
  // until a nonce-based setup is wired through the app.
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://analytics.ahrefs.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://media.klaps.space https://image.tmdb.org https://*.basemaps.cartocdn.com https://*.google-analytics.com",
  "font-src 'self'",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://analytics.ahrefs.com https://basemaps.cartocdn.com https://*.basemaps.cartocdn.com",
  // YouTube trailers open in an embedded iframe (trailer-modal).
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
  // MapLibre GL renders via blob: workers.
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
].join("; ");

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  // Compression moved to Traefik (compress middleware): it can serve
  // brotli/zstd, while the built-in Node pipeline only does gzip. With
  // this enabled Traefik would pass the already-gzipped body through
  // and never get the chance to apply the better encodings.
  compress: false,
  // Do not advertise the framework/CMS stack in response headers.
  poweredByHeader: false,
  async redirects() {
    return [
      // /filmy has no listing page of its own; movie pages live at
      // /filmy/[slug] and the listing equivalent is /seanse.
      {
        source: "/filmy",
        destination: "/seanse",
        permanent: true,
      },
      // Movies the scraper had matched to the wrong TMDB title; fixed in the
      // database together with their slugs, so the old URLs move for good.
      {
        source: "/filmy/ziemia-obiecana-1927",
        destination: "/filmy/ziemia-obiecana-1975",
        permanent: true,
      },
      {
        source:
          "/filmy/die-abtei-des-verbrechens-umberto-ecos-der-name-der-rose-wird-verfilmt-1986",
        destination: "/filmy/imie-rozy-1986",
        permanent: true,
      },
      // Short link for the Instagram bio: Instagram shows the first link's
      // address on the profile, so the UTM-tagged URL lives here instead.
      // Temporary, so the target (or its tags) can change without browsers
      // caching the old one.
      {
        source: "/ig",
        destination: "/?utm_source=instagram&utm_medium=bio",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      // generateSitemaps (app/sitemap.ts) serves sub-sitemaps at
      // /sitemap/[id].xml but emits no index, so the conventional
      // /sitemap.xml would 404. Serve the hand-rolled index there.
      {
        source: "/sitemap.xml",
        destination: "/sitemap-index",
      },
    ];
  },
  async headers() {
    // HSTS only on production. Preview/staging deployments are left off the
    // policy so a non-HTTPS host can never get pinned in a browser. The
    // `preload` directive opts the domain into the browser HSTS preload list
    // (submit separately at hstspreload.org); it covers every subdomain.
    const securityHeaders = [
      {
        key: "Content-Security-Policy-Report-Only",
        value: CSP_REPORT_ONLY,
      },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
    ];
    if (!isProduction) {
      return [{ source: "/:path*", headers: securityHeaders }];
    }
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          ...securityHeaders,
        ],
      },
    ];
  },
  images: {
    // WebP only, on purpose (no AVIF for now): wide-screen heroes still feed
    // the optimizer a full-size TMDB "original", and AVIF-encoding that
    // large a source on a cold cache is slow enough to dominate hero LCP.
    // WebP encodes far faster for a ~30% byte penalty, which is the better
    // trade while those sources stay this big.
    formats: ["image/webp"],
    qualities: [75],
    // TMDB files are content-addressed and immutable, so optimized
    // variants can be cached for a year instead of the short default.
    // After a redeploy wipes this cache, origin re-fetches hit the local
    // MinIO mirror (NEXT_PUBLIC_TMDB_IMAGE_BASE_URL), not the TMDB CDN.
    minimumCacheTTL: 31536000,
    // Deliberately sparse: every width is a separate optimizer variant, and
    // on a cold cache each one costs a full fetch + resize. Fewer, coarser
    // steps mean far more requests land on an already-encoded file. No 4K
    // step: full-bleed heroes sit under gradient and grain overlays, so it
    // adds bytes with no visible gain. 1200 stays within the w1280 backdrop
    // source (lib/tmdb.ts), 1920 is the only step that reads the original.
    deviceSizes: [640, 828, 1200, 1920],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // MinIO media served over HTTPS via Traefik
        protocol: "https",
        hostname: "media.klaps.space",
      },
    ],
  },
};

export default withPayload(nextConfig);

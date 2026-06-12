import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const PRODUCTION_URL = "https://klaps.space";
// Mirrors the guard in robots.ts: only the production host gets the policy.
const isProduction =
  (process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_URL) === PRODUCTION_URL;

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  async redirects() {
    return [
      // /filmy has no listing page of its own; movie pages live at
      // /filmy/[slug] and the listing equivalent is /seanse.
      {
        source: "/filmy",
        destination: "/seanse",
        permanent: true,
      },
    ];
  },
  async headers() {
    // HSTS only on production. Preview/staging deployments are left off the
    // policy so a non-HTTPS host can never get pinned in a browser. The
    // `preload` directive opts the domain into the browser HSTS preload list
    // (submit separately at hstspreload.org); it covers every subdomain.
    if (!isProduction) return [];
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
  images: {
    qualities: [75],
    // TMDB files are content-addressed and immutable, so optimized
    // variants can be cached for a year instead of the short default.
    // After a redeploy wipes this cache, origin re-fetches hit the local
    // MinIO mirror (NEXT_PUBLIC_TMDB_IMAGE_BASE_URL), not the TMDB CDN.
    minimumCacheTTL: 31536000,
    // Default list minus 3840: full-bleed heroes sit under gradient and
    // grain overlays, so 4K variants add bytes with no visible gain.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
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

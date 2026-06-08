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
    // 60 is used for hero backdrops, which sit under heavy gradient
    // overlays, so the lower quality is invisible but saves bytes.
    qualities: [60, 75],
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
    ],
  },
};

export default withPayload(nextConfig);

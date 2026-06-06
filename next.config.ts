import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

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
  images: {
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

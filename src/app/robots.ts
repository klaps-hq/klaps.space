import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

// AI search and assistant crawlers - explicitly allowed so the site
// is eligible for citations in AI search results (GEO/AEO).
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "CCBot",
];

const PRODUCTION_URL = "https://klaps.space";

const DISALLOWED_PATHS = ["/api/", "/maintenance"];

const robots = (): MetadataRoute.Robots => {
  // Guard non-production deployments (preview/staging with a different
  // NEXT_PUBLIC_SITE_URL) from being indexed.
  if (SITE_URL !== PRODUCTION_URL) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
      {
        userAgent: AI_CRAWLERS,
        allow: "/",
        disallow: DISALLOWED_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
};

export default robots;

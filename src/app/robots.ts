import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

// AI search and assistant crawlers — explicitly allowed so the site
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

const robots = (): MetadataRoute.Robots => ({
  rules: [
    {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    {
      userAgent: AI_CRAWLERS,
      allow: "/",
      disallow: ["/api/"],
    },
  ],
  sitemap: `${SITE_URL}/sitemap.xml`,
});

export default robots;

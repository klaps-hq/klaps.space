import { SITE_URL } from "@/lib/site-config";
import { SITEMAP_IDS } from "@/lib/sitemap-entries";

// Sitemap index. Next's generateSitemaps (app/sitemap.ts) emits the per-type
// sub-sitemaps at /sitemap/[id].xml but does NOT produce an index, so the
// conventional /sitemap.xml would 404. This route hand-rolls the
// <sitemapindex> pointing at those sub-sitemaps; a rewrite in next.config.ts
// exposes it at /sitemap.xml (a folder literally named "sitemap.xml" can't be
// used here - it collides with the sitemap metadata convention).
// The id set is fixed, so the index is fully static.
export const dynamic = "force-static";

const buildSitemapIndex = (): string => {
  const entries = SITEMAP_IDS.map(
    (id) => `  <sitemap>\n    <loc>${SITE_URL}/sitemap/${id}.xml</loc>\n  </sitemap>`
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>\n`;
};

export function GET(): Response {
  return new Response(buildSitemapIndex(), {
    headers: {
      "Content-Type": "application/xml",
      // Mirrors the sub-sitemaps' revalidate window.
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

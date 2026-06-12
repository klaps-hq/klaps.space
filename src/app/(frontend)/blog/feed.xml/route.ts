import { SITE_URL } from "@/lib/site-config";
import { getPublishedPosts } from "@/lib/posts";

// Same ISR window as the blog pages: posts change only on publish.
export const revalidate = 300;

const FEED_TITLE = "Blog Klaps";
const FEED_DESCRIPTION =
  "Artykuły o kinie studyjnym: klasyka filmowa na dużym ekranie, retrospektywy, seanse specjalne i kultura filmowa w polskich kinach.";

const escapeXml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

// RSS dates use the RFC 822 format (toUTCString output is accepted).
const toRssDate = (value: string | null | undefined): string | null => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toUTCString();
};

export async function GET() {
  // An unreachable database serves an empty (but valid) feed; ISR refills it.
  const posts = await getPublishedPosts().catch(() => []);

  const items = posts
    .filter((post) => post.slug)
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const pubDate = toRssDate(post.publishedAt);
      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        ...(pubDate ? [`      <pubDate>${pubDate}</pubDate>`] : []),
        `      <description>${escapeXml(post.excerpt)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const lastBuildDate = toRssDate(posts[0]?.publishedAt);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${SITE_URL}/blog</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>pl</language>
    <atom:link href="${SITE_URL}/blog/feed.xml" rel="self" type="application/rss+xml"/>
${lastBuildDate ? `    <lastBuildDate>${lastBuildDate}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300",
    },
  });
}

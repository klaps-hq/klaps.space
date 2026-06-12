import type { CollectionAfterChangeHook } from "payload";

import { SITE_URL } from "@/lib/site-config";
import type { Post } from "@/payload-types";

// Only the production host may ping: dev/preview URLs would either leak a
// staging domain or get the key flagged for submitting unverifiable hosts.
const PRODUCTION_URL = "https://klaps.space";

// Notify IndexNow-enabled search engines (Bing, Yandex, Seznam and others;
// Google does not consume IndexNow) whenever a post is published or a
// published post is updated. Draft autosaves are skipped. The repertoire
// backend pings the same endpoint for cinema/movie pages; this hook covers
// blog URLs, which only change through the CMS.
export const pingIndexNow: CollectionAfterChangeHook<Post> = async ({
  doc,
  req,
}) => {
  const key = process.env.INDEXNOW_KEY;
  if (!key || SITE_URL !== PRODUCTION_URL) return doc;
  if (doc._status !== "published" || !doc.slug) return doc;

  const body = {
    host: new URL(SITE_URL).host,
    key,
    keyLocation: `${SITE_URL}/indexnow-key.txt`,
    // The listing changes together with the post, so submit both.
    urlList: [`${SITE_URL}/blog/${doc.slug}`, `${SITE_URL}/blog`],
  };

  // A failed ping must never fail the publish; log and move on.
  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      req.payload.logger.warn(
        `IndexNow ping for ${doc.slug} returned ${res.status}`
      );
    }
  } catch (error) {
    req.payload.logger.warn({ err: error }, "IndexNow ping failed");
  }

  return doc;
};

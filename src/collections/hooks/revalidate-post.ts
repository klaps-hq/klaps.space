import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";

import type { Post } from "@/payload-types";

/**
 * `next/cache` is imported lazily, at call time rather than module load.
 *
 * The Payload CLI (`generate:types`, `generate:importmap`) loads the config,
 * which pulls in this collection and therefore this hook. Its SWC ESM loader
 * cannot resolve the bare `next/cache` specifier and the whole command dies
 * with ERR_MODULE_NOT_FOUND, which is why the import map went stale and the
 * lexical blocks feature never reached the admin panel.
 *
 * Deferring the import keeps the CLI working while the hook itself still
 * runs inside Next, where the specifier resolves normally.
 */
const revalidate = async (path: string) => {
  const { revalidatePath } = await import("next/cache");
  revalidatePath(path);
};

// Without this hook a published change waits out the ISR windows: up to
// 5 minutes for the listing, post page and RSS feed, up to an hour for
// the sitemap. Revalidating on publish makes changes visible immediately.
const revalidatePostPaths = async (slug: string | null | undefined) => {
  await revalidate("/blog");
  await revalidate("/blog/feed.xml");
  // Blog posts live in the per-type sub-sitemap, not the /sitemap.xml index
  // (the index is a static list of sub-sitemaps and never changes content).
  await revalidate("/sitemap/blog.xml");
  if (slug) await revalidate(`/blog/${slug}`);
};

export const revalidatePost: CollectionAfterChangeHook<Post> = async ({
  doc,
  previousDoc,
}) => {
  // Draft autosaves don't touch public pages; revalidate only when the
  // published version changes (publish, republish or unpublish).
  if (doc._status !== "published" && previousDoc?._status !== "published") {
    return doc;
  }

  await revalidatePostPaths(doc.slug);
  // A slug change leaves the old path serving a stale page; refresh it
  // so it starts returning 404.
  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    await revalidate(`/blog/${previousDoc.slug}`);
  }

  return doc;
};

export const revalidateDeletedPost: CollectionAfterDeleteHook<Post> = async ({
  doc,
}) => {
  await revalidatePostPaths(doc?.slug);
  return doc;
};

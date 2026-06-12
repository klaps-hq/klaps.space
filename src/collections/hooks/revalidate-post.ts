import { revalidatePath } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";

import type { Post } from "@/payload-types";

// Without this hook a published change waits out the ISR windows: up to
// 5 minutes for the listing, post page and RSS feed, up to an hour for
// the sitemap. Revalidating on publish makes changes visible immediately.
const revalidatePostPaths = (slug: string | null | undefined) => {
  revalidatePath("/blog");
  revalidatePath("/blog/feed.xml");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/blog/${slug}`);
};

export const revalidatePost: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
}) => {
  // Draft autosaves don't touch public pages; revalidate only when the
  // published version changes (publish, republish or unpublish).
  if (doc._status !== "published" && previousDoc?._status !== "published") {
    return doc;
  }

  revalidatePostPaths(doc.slug);
  // A slug change leaves the old path serving a stale page; refresh it
  // so it starts returning 404.
  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    revalidatePath(`/blog/${previousDoc.slug}`);
  }

  return doc;
};

export const revalidateDeletedPost: CollectionAfterDeleteHook<Post> = ({
  doc,
}) => {
  revalidatePostPaths(doc?.slug);
  return doc;
};

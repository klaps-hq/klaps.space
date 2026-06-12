import { getPayload } from "payload";
import config from "@payload-config";
import type { Media, Post } from "@/payload-types";

// Blog posts come straight from Payload's Local API (no HTTP hop).
// overrideAccess: false makes the collection's access control apply, so
// anonymous reads only ever return published documents; draft: false keeps
// autosaved draft versions out even for published posts.

const POSTS_LIMIT = 100;

/** Listing page size: enough rows to feel like an archive, light to render. */
const POSTS_PER_PAGE = 10;

export interface PostsPage {
  posts: Post[];
  totalPages: number;
}

/** One listing page of published posts, newest first. */
export const getPostsPage = async (page: number): Promise<PostsPage> => {
  const payload = await getPayload({ config });
  const { docs, totalPages } = await payload.find({
    collection: "posts",
    draft: false,
    overrideAccess: false,
    sort: "-publishedAt",
    depth: 1,
    limit: POSTS_PER_PAGE,
    page,
  });
  return { posts: docs, totalPages };
};

/** Newest published posts for teaser sections (e.g. the homepage). */
export const getLatestPosts = async (limit: number): Promise<Post[]> => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "posts",
    draft: false,
    overrideAccess: false,
    sort: "-publishedAt",
    depth: 1,
    limit,
  });
  return docs;
};

export const getPublishedPosts = async (): Promise<Post[]> => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "posts",
    draft: false,
    overrideAccess: false,
    sort: "-publishedAt",
    depth: 1,
    limit: POSTS_LIMIT,
  });
  return docs;
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "posts",
    draft: false,
    overrideAccess: false,
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  });
  return docs[0] ?? null;
};

/** Cover relation resolved to a Media doc (requires depth >= 1), or null. */
export const getCover = (post: Post): Media | null =>
  typeof post.coverImage === "object" ? post.coverImage : null;

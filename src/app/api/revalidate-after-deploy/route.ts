import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

// `next build` runs without the API and the CMS, so the pages fed by them
// ship prerendered empty and stay that way until the first ISR revalidation,
// up to five minutes after every release. Google fetched /sitemap/blog.xml
// inside that window and recorded it as an error. The deploy workflow calls
// this right after the new container answers, so the empty copies are
// dropped within seconds instead.
const BUILD_EMPTY_PATHS = [
  "/blog",
  "/blog/feed.xml",
  "/sitemap/blog.xml",
  "/sitemap/tematy.xml",
  "/kino-plenerowe",
  "/klasyka-w-kinach",
];

const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY ?? "";

const isAuthorized = (provided: string | null): boolean => {
  if (!INTERNAL_API_KEY || !provided) return false;
  const expected = Buffer.from(INTERNAL_API_KEY);
  const actual = Buffer.from(provided);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
};

export async function POST(request: NextRequest) {
  if (!isAuthorized(request.headers.get("x-internal-api-key"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  for (const path of BUILD_EMPTY_PATHS) {
    revalidatePath(path);
  }
  return NextResponse.json({ revalidated: BUILD_EMPTY_PATHS });
}

import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/common/site-header";
import JsonLd from "@/components/common/json-ld";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import {
  FOUNDER,
  FOUNDER_PATH,
  ORGANIZATION_ID,
  SITE_URL,
} from "@/lib/site-config";
import { BASE_OPEN_GRAPH, clampText, formatPlDate } from "@/lib/seo";
import { getCover, getPostBySlug, getPublishedPosts } from "@/lib/posts";
import { resolveScreeningBlocks } from "@/lib/post-screening-blocks";
import { extractPostFaq } from "@/lib/post-faq";
import type { Post } from "@/payload-types";
import RichText from "../_components/rich-text";
import Footer from "../../(home)/_components/footer";

// ISR: posts change only on publish, so a 5 minute window keeps pages
// fresh without hitting the database on every request.
export const revalidate = 300;

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

// Prebuild published posts; an unreachable database (isolated CI build)
// falls back to on-demand rendering (dynamicParams defaults to true).
export const generateStaticParams = async (): Promise<{ slug: string }[]> => {
  try {
    const posts = await getPublishedPosts();
    return posts.flatMap((post) => (post.slug ? [{ slug: post.slug }] : []));
  } catch {
    return [];
  }
};

export const generateMetadata = async ({
  params,
}: PostPageProps): Promise<Metadata> => {
  const { slug } = await params;
  // Only "no such post" (null) means 404. A database error propagates so
  // ISR keeps serving the last good copy instead of caching a 404 for a
  // live article (Mongo is briefly unreachable right after a deploy).
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = post.meta?.title || post.title;
  const description = post.meta?.description || clampText(post.excerpt);
  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...BASE_OPEN_GRAPH,
      type: "article",
      title,
      description,
      url,
      ...(post.publishedAt ? { publishedTime: post.publishedAt } : {}),
      modifiedTime: clampModified(post),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
};

// Payload's updatedAt can predate a scheduled/post-dated publishedAt,
// and "modified before published" is a contradictory freshness signal.
const clampModified = (post: Post): string => {
  const published = post.publishedAt ? Date.parse(post.publishedAt) : NaN;
  const updated = Date.parse(post.updatedAt);
  return !Number.isNaN(published) && updated < published
    ? (post.publishedAt as string)
    : post.updatedAt;
};

// A post counts as updated when it changed at least a day after publishing;
// the same-day edits right after a publish are not worth a visible label.
const UPDATE_THRESHOLD_MS = 24 * 60 * 60 * 1000;

const visibleUpdate = (post: Post): string | null => {
  if (!post.publishedAt) return null;
  const modified = clampModified(post);
  return Date.parse(modified) - Date.parse(post.publishedAt) >=
    UPDATE_THRESHOLD_MS
    ? modified
    : null;
};

const buildFaqJsonLd = (post: Post) => {
  const items = extractPostFaq(post.content);
  if (items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
};

const buildPostJsonLd = (post: Post) => {
  const cover = getCover(post);
  // Local storage yields relative URLs (/media/...), the S3 adapter yields
  // absolute ones (https://media.klaps.space/...); only prefix the former.
  const coverUrl = cover?.url
    ? cover.url.startsWith("http")
      ? cover.url
      : `${SITE_URL}${cover.url}`
    : null;
  // Credited to the editorial team, not to the Payload user who published
  // it: posts are drafted with AI, so naming a person as the author would
  // overstate who wrote them. The founder is linked from the Organization.
  const author = {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "Klaps",
    url: SITE_URL,
  };

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: `${SITE_URL}/blog/${post.slug}`,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    inLanguage: "pl-PL",
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    dateModified: clampModified(post),
    // ImageObject with dimensions (when Payload measured them) instead of
    // a bare URL: preferred by Google for Article rich results.
    ...(coverUrl
      ? {
          image: {
            "@type": "ImageObject",
            url: coverUrl,
            ...(cover?.width ? { width: cover.width } : {}),
            ...(cover?.height ? { height: cover.height } : {}),
          },
        }
      : {}),
    author,
    // The named person who edits and fact-checks the AI-assisted drafts
    // (content audit, October 2026: an Organization-only byline was the
    // weakest E-E-A-T signal). Authorship stays with the editorial team.
    editor: {
      "@type": "Person",
      "@id": FOUNDER.id,
      name: FOUNDER.name,
      url: FOUNDER.url,
    },
    publisher: {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Klaps",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/web-app-manifest-512x512.png`,
      },
    },
  };
};

const PostPage = async ({ params }: PostPageProps) => {
  const { slug } = await params;
  // See generateMetadata: errors propagate, only null is a 404.
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const cover = getCover(post);

  // Resolved here rather than inside the converter: Lexical's JSX
  // converters are synchronous, so the showtimes would otherwise have to be
  // fetched after hydration and would not reach the server HTML.
  const screeningsByBlockId = await resolveScreeningBlocks(post.content);
  const faqJsonLd = buildFaqJsonLd(post);
  const updatedAt = visibleUpdate(post);

  return (
    <main className="bg-black text-white min-h-screen">
      <JsonLd data={buildPostJsonLd(post)} />
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      <SiteHeader />

      <article className="px-6 md:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl pt-8 md:pt-12 pb-20 md:pb-28">
          <div className="mb-8 md:mb-10">
            <Breadcrumbs
              items={[
                { name: "Blog", href: "/blog" },
                { name: post.title, href: `/blog/${post.slug}` },
              ]}
            />
          </div>

          <header>
            {post.publishedAt && (
              <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs uppercase tracking-[0.2em] text-white/50">
                <time dateTime={post.publishedAt}>
                  {formatPlDate(new Date(post.publishedAt))}
                </time>
                {updatedAt && (
                  <span>
                    Zaktualizowano{" "}
                    <time dateTime={updatedAt}>
                      {formatPlDate(new Date(updatedAt))}
                    </time>
                  </span>
                )}
              </p>
            )}
            <h1 className="mt-4 text-3xl md:text-5xl font-medium -tracking-[0.02em] leading-[1.05]">
              {post.title}
            </h1>
            <p className="mt-5 max-w-[64ch] text-lg md:text-xl text-white/55 leading-relaxed">
              {post.excerpt}
            </p>
          </header>

          {cover?.url && (
            <figure className="mt-10 md:mt-14">
              <div className="relative aspect-[2/1] overflow-hidden">
                <Image
                  src={cover.url}
                  alt={cover.alt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 896px"
                  className="object-cover"
                />
              </div>
              {cover.caption && (
                <figcaption className="mt-3 text-sm text-white/50">
                  {cover.caption}
                </figcaption>
              )}
            </figure>
          )}

          <div
            className="mt-10 md:mt-14 max-w-[70ch] text-base md:text-lg leading-relaxed text-white/75
              [&_p]:mt-5
              [&_h2]:mt-12 [&_h2]:text-2xl md:[&_h2]:text-3xl [&_h2]:font-medium [&_h2]:-tracking-[0.02em] [&_h2]:text-white
              [&_h3]:mt-9 [&_h3]:text-xl md:[&_h3]:text-2xl [&_h3]:font-medium [&_h3]:text-white
              [&_h4]:mt-7 [&_h4]:text-lg [&_h4]:font-medium [&_h4]:text-white
              [&_a]:text-white [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-white/40 hover:[&_a]:decoration-white
              [&_strong]:text-white
              [&_blockquote]:mt-6 [&_blockquote]:border-l [&_blockquote]:border-white/30 [&_blockquote]:pl-5 [&_blockquote]:text-white/60 [&_blockquote]:italic
              [&_ul]:mt-5 [&_ul]:list-disc [&_ul]:pl-6
              [&_ol]:mt-5 [&_ol]:list-decimal [&_ol]:pl-6
              [&_li]:mt-2
              [&_hr]:my-10 [&_hr]:border-white/10"
          >
            <RichText
              data={post.content}
              screeningsByBlockId={screeningsByBlockId}
            />
          </div>

          <footer className="mt-14 border-t border-white/10 pt-8">
            <p className="mb-8 max-w-[64ch] text-sm md:text-base text-white/50 leading-relaxed">
              Opracowanie: redakcja klaps.space. Tekst powstał z&nbsp;pomocą AI,
              na podstawie danych z&nbsp;serwisu i&nbsp;sprawdzonych źródeł.
              Redakcja i&nbsp;weryfikacja faktów: {FOUNDER.name}.{" "}
              <Link
                href={FOUNDER_PATH}
                className="text-white/75 underline underline-offset-4 decoration-white/30 hover:text-white hover:decoration-white transition-colors"
              >
                Kto stoi za serwisem
              </Link>
            </p>
            <Link
              href="/blog"
              className="text-base uppercase text-white border-b border-white/50 pb-0.5 hover:border-white transition-colors"
            >
              Wszystkie wpisy
            </Link>
          </footer>
        </div>
      </article>

      <Footer />
    </main>
  );
};

export default PostPage;

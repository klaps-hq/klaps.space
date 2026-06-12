import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import SiteHeader from "@/components/common/site-header";
import JsonLd from "@/components/common/json-ld";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import { SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH, clampText, formatPlDate } from "@/lib/seo";
import { getCover, getPostBySlug, getPublishedPosts } from "@/lib/posts";
import type { Post } from "@/payload-types";
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
  const post = await getPostBySlug(slug).catch(() => null);
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
      modifiedTime: post.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
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
  const author =
    typeof post.author === "object" && post.author?.name
      ? { "@type": "Person", name: post.author.name }
      : { "@type": "Organization", name: "Klaps", url: SITE_URL };

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: `${SITE_URL}/blog/${post.slug}`,
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
    inLanguage: "pl-PL",
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    dateModified: post.updatedAt,
    ...(coverUrl ? { image: coverUrl } : {}),
    author,
    publisher: {
      "@type": "Organization",
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
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) notFound();

  const cover = getCover(post);

  return (
    <main className="bg-black text-white min-h-screen">
      <JsonLd data={buildPostJsonLd(post)} />
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
              <time
                dateTime={post.publishedAt}
                className="text-xs uppercase tracking-[0.2em] text-white/45"
              >
                {formatPlDate(new Date(post.publishedAt))}
              </time>
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
                <figcaption className="mt-3 text-sm text-white/40">
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
            <RichText data={post.content} />
          </div>

          <footer className="mt-14 border-t border-white/10 pt-8">
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

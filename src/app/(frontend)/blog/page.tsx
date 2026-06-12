import React from "react";
import { Metadata } from "next";
import SiteHeader from "@/components/common/site-header";
import JsonLd from "@/components/common/json-ld";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading, { PageHeadingMuted } from "@/components/ui/page-heading";
import { SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH } from "@/lib/seo";
import { getCover, getPostsPage } from "@/lib/posts";
import type { Post } from "@/payload-types";
import Footer from "../(home)/_components/footer";
import PostListItem from "./_components/post-list-item";
import PaginationNav from "./_components/pagination-nav";

export const revalidate = 300;

const TITLE = "Blog - kino studyjne z bliska";
const DESCRIPTION =
  "Artykuły o kinie studyjnym: klasyka filmowa na dużym ekranie, retrospektywy, seanse specjalne i kultura filmowa w polskich kinach.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    ...BASE_OPEN_GRAPH,
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/blog`,
  },
};

const buildBlogJsonLd = (posts: readonly Post[]) => ({
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Blog Klaps",
  url: `${SITE_URL}/blog`,
  description: DESCRIPTION,
  inLanguage: "pl-PL",
  blogPost: posts.map((post) => {
    const cover = getCover(post);
    // Local storage yields relative URLs (/media/...), the S3 adapter
    // yields absolute ones; only prefix the former.
    const coverUrl = cover?.url
      ? cover.url.startsWith("http")
        ? cover.url
        : `${SITE_URL}${cover.url}`
      : null;
    return {
      "@type": "BlogPosting",
      headline: post.title,
      url: `${SITE_URL}/blog/${post.slug}`,
      ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
      ...(coverUrl ? { image: coverUrl } : {}),
      // Summary references still need author for valid Article markup;
      // mirrors the Person/Organization fallback on the post page.
      author:
        typeof post.author === "object" && post.author?.name
          ? { "@type": "Person", name: post.author.name }
          : { "@type": "Organization", name: "Klaps", url: SITE_URL },
    };
  }),
});

const BlogPage = async () => {
  // An unreachable database (e.g. during an isolated CI build) renders an
  // empty listing instead of failing the build; ISR refills it at runtime.
  const { posts, totalPages } = await getPostsPage(1).catch(() => ({
    posts: [] as Post[],
    totalPages: 0,
  }));

  return (
    <main className="bg-black text-white min-h-screen">
      {posts.length > 0 && <JsonLd data={buildBlogJsonLd(posts)} />}
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-6">
        <Breadcrumbs items={[{ name: "Blog", href: "/blog" }]} />
      </div>

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-10 md:pb-14">
        <PageHeading variant="editorial">
          Blog.
          <PageHeadingMuted>Kino studyjne z bliska.</PageHeadingMuted>
        </PageHeading>
        <p className="mt-4 md:mt-5 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
          Klasyka filmowa na dużym ekranie, retrospektywy i&nbsp;seanse
          specjalne. Piszemy o&nbsp;tym, co warto zobaczyć w&nbsp;kinach
          studyjnych i&nbsp;dlaczego.
        </p>
      </div>

      <section className="px-6 md:px-12 lg:px-16 pb-20 md:pb-28">
        {posts.length > 0 ? (
          <>
            <div className="border-t border-white/10">
              {posts.map((post) => (
                <PostListItem key={post.id} post={post} />
              ))}
            </div>
            <PaginationNav currentPage={1} totalPages={totalPages} />
          </>
        ) : (
          <p className="border-t border-white/10 pt-10 text-lg text-white/55">
            Pierwsze wpisy pojawią się tu wkrótce.
          </p>
        )}
      </section>

      <Footer />
    </main>
  );
};

export default BlogPage;

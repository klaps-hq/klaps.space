import React from "react";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import SiteHeader from "@/components/common/site-header";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading, { PageHeadingMuted } from "@/components/ui/page-heading";
import { SITE_URL } from "@/lib/site-config";
import { BASE_OPEN_GRAPH } from "@/lib/seo";
import { getPostsPage } from "@/lib/posts";
import type { Post } from "@/payload-types";
import Footer from "../../../(home)/_components/footer";
import PostListItem from "../../_components/post-list-item";
import PaginationNav from "../../_components/pagination-nav";

export const revalidate = 300;

interface BlogArchivePageProps {
  params: Promise<{ page: string }>;
}

// Strict positive-integer parse: "2" passes, "02", "2x" and "-1" give a 404.
const parsePage = (raw: string): number | null => {
  const page = Number(raw);
  return Number.isInteger(page) && page >= 1 && String(page) === raw
    ? page
    : null;
};

// Prebuild pages 2..N; page 1 lives at /blog. An unreachable database
// (isolated CI build) falls back to on-demand rendering.
export const generateStaticParams = async (): Promise<{ page: string }[]> => {
  try {
    const { totalPages } = await getPostsPage(1);
    return Array.from({ length: Math.max(totalPages - 1, 0) }, (_, index) => ({
      page: String(index + 2),
    }));
  } catch {
    return [];
  }
};

export const generateMetadata = async ({
  params,
}: BlogArchivePageProps): Promise<Metadata> => {
  const { page: raw } = await params;
  const page = parsePage(raw);
  if (!page || page < 2) return {};

  const title = `Blog - strona ${page}`;
  const description = `Starsze wpisy bloga Klaps (strona ${page}). Artykuły o kinie studyjnym: klasyka filmowa na dużym ekranie, retrospektywy i seanse specjalne.`;
  const url = `${SITE_URL}/blog/strona/${page}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      ...BASE_OPEN_GRAPH,
      type: "website",
      title,
      description,
      url,
    },
  };
};

const BlogArchivePage = async ({ params }: BlogArchivePageProps) => {
  const { page: raw } = await params;
  const page = parsePage(raw);
  if (!page) notFound();
  // Page 1 is /blog itself; keep a single canonical URL for it.
  if (page === 1) permanentRedirect("/blog");

  const { posts, totalPages } = await getPostsPage(page).catch(() => ({
    posts: [] as Post[],
    totalPages: 0,
  }));
  if (posts.length === 0) notFound();

  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-6">
        <Breadcrumbs
          items={[
            { name: "Blog", href: "/blog" },
            { name: `Strona ${page}`, href: `/blog/strona/${page}` },
          ]}
        />
      </div>

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-10 md:pb-14">
        <PageHeading variant="editorial">
          Blog.
          <PageHeadingMuted>Strona {page}.</PageHeadingMuted>
        </PageHeading>
      </div>

      <section className="px-6 md:px-12 lg:px-16 pb-20 md:pb-28">
        <div className="border-t border-white/10">
          {posts.map((post) => (
            <PostListItem key={post.id} post={post} />
          ))}
        </div>
        <PaginationNav currentPage={page} totalPages={totalPages} />
      </section>

      <Footer />
    </main>
  );
};

export default BlogArchivePage;

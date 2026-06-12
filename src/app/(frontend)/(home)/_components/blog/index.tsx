import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { formatPlDate } from "@/lib/seo";
import { getLatestPosts, getCover } from "@/lib/posts";
import { cn } from "@/lib/utils";
import type { Post } from "@/payload-types";

const FEATURED_COUNT = 3;

// Column count follows the number of posts so one or two entries don't
// stretch into empty grid tracks. Full class names, Tailwind cannot see
// interpolated strings.
const GRID_COLS_BY_COUNT: Record<number, string> = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
};

interface BlogCardProps {
  post: Post;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const cover = getCover(post);

  return (
    <article>
      <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-5">
        <div className="relative aspect-[3/2] overflow-hidden bg-white/5">
          {cover?.url ? (
            <Image
              src={cover.url}
              alt={cover.alt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/30 text-[10px] uppercase tracking-[0.25em]">
              Bez okładki
            </div>
          )}
        </div>
        <div className="flex flex-col gap-3">
          {post.publishedAt && (
            <time
              dateTime={post.publishedAt}
              className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/45"
            >
              {formatPlDate(new Date(post.publishedAt))}
            </time>
          )}
          <h3 className="text-xl md:text-2xl font-medium -tracking-[0.02em] leading-tight text-white decoration-white/40 underline-offset-4 group-hover:underline">
            {post.title}
          </h3>
          <p className="text-sm md:text-base text-white/55 leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>
      </Link>
    </article>
  );
};

// Server section: an unreachable database (e.g. during an isolated CI
// build) hides the section instead of failing the build; ISR refills it
// at runtime.
const Blog = async () => {
  const posts = await getLatestPosts(FEATURED_COUNT).catch(
    () => [] as Post[]
  );
  if (posts.length === 0) return null;

  return (
    <section className="relative bg-black text-white border-t border-white/10">
      <div className="px-6 md:px-12 lg:px-16 pt-24 md:pt-32 pb-10 md:pb-14">
        <h2 className="text-3xl md:text-5xl lg:text-6xl leading-[1.05] -tracking-[0.02em] max-w-[26ch]">
          <span className="block text-white font-medium">Z&nbsp;bloga.</span>
          <span className="block text-white/40">
            Kino studyjne z&nbsp;bliska.
          </span>
        </h2>
        <p className="mt-4 md:mt-5 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
          Klasyka filmowa na dużym ekranie, retrospektywy i&nbsp;seanse
          specjalne. Piszemy o&nbsp;tym, co warto zobaczyć w&nbsp;kinach
          studyjnych i&nbsp;dlaczego.
        </p>
      </div>

      <div className="px-6 md:px-12 lg:px-16 pb-12 md:pb-16">
        <div
          className={cn(
            "grid grid-cols-1 gap-x-8 lg:gap-x-12 gap-y-12",
            GRID_COLS_BY_COUNT[Math.min(posts.length, FEATURED_COUNT)]
          )}
        >
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      <div className="px-6 md:px-12 lg:px-16 pb-12 md:pb-16 flex justify-center">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-4 text-xs md:text-sm uppercase tracking-[0.28em] text-white border border-white/25 hover:border-white hover:bg-white/[0.04] px-8 md:px-10 py-4 md:py-5 transition-colors"
        >
          Wszystkie wpisy
          <ArrowRight
            aria-hidden="true"
            className="size-4 shrink-0 transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
};

export default Blog;

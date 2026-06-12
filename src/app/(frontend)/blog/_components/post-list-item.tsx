import React from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPlDate } from "@/lib/seo";
import { getCover } from "@/lib/posts";
import type { Post } from "@/payload-types";

interface PostListItemProps {
  post: Post;
}

const PostListItem = ({ post }: PostListItemProps) => {
  const cover = getCover(post);

  return (
    <article className="border-b border-white/10">
      <Link
        href={`/blog/${post.slug}`}
        className="group grid items-start gap-6 py-8 md:grid-cols-[1fr_280px] md:gap-10 md:py-10"
      >
        <div>
          {post.publishedAt && (
            <time
              dateTime={post.publishedAt}
              className="text-xs uppercase tracking-[0.2em] text-white/45"
            >
              {formatPlDate(new Date(post.publishedAt))}
            </time>
          )}
          <h2 className="mt-3 text-2xl md:text-4xl font-medium -tracking-[0.02em] leading-tight decoration-white/40 underline-offset-4 group-hover:underline">
            {post.title}
          </h2>
          <p className="mt-4 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
        {cover?.url && (
          <div className="relative hidden aspect-[3/2] overflow-hidden md:block">
            <Image
              src={cover.url}
              alt={cover.alt}
              fill
              sizes="280px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
        )}
      </Link>
    </article>
  );
};

export default PostListItem;

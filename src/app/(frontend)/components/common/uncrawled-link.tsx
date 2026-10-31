"use client";

import React, { useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { PrefetchKind } from "next/dist/client/components/router-reducer/router-reducer-types";

interface UncrawledLinkProps {
  basePath: "/kina" | "/miasta" | "/filmy" | "/gatunki" | "/rezyserzy";
  slug: string;
  className?: string;
  children: React.ReactNode;
}

const openInNewTab = (href: string) =>
  window.open(href, "_blank", "noopener");

// Navigates like a link but renders no <a href>, so crawlers do not discover
// or follow it. Used for noindex pages (empty cinemas and cities) that stay
// reachable for people without spending crawl budget on them. Keep these
// pages out of the sitemap, footer and breadcrumbs as well.
// The path is joined on the client so the RSC payload in the HTML carries no
// full URL string that a crawler could pick up.
const UncrawledLink: React.FC<UncrawledLinkProps> = ({
  basePath,
  slug,
  className,
  children,
}) => {
  const router = useRouter();
  const ref = useRef<HTMLSpanElement>(null);
  const [pending, startTransition] = useTransition();
  const href = `${basePath}/${slug}`;

  // A real <Link> prefetches once it scrolls into view; this does the same,
  // so a click (or a tap on a phone, where there is no hover) navigates at
  // once. These pages are not prebuilt, and the default "auto" prefetch only
  // fetches up to a loading boundary there, so the whole page is requested.
  // Next's prefetch scheduler caps the concurrent requests.
  const prefetch = () => router.prefetch(href, { kind: PrefetchKind.FULL });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (connection?.saveData) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        router.prefetch(href, { kind: PrefetchKind.FULL });
      },
      { rootMargin: "200px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [router, href]);
  const navigate = () => startTransition(() => router.push(href));

  const handleClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey) {
      openInNewTab(href);
      return;
    }
    navigate();
  };

  const handleAuxClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    // Middle click opens a new tab, as it would on a real link.
    if (event.button === 1) openInNewTab(href);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (event.metaKey || event.ctrlKey) openInNewTab(href);
    else navigate();
  };

  return (
    <span
      ref={ref}
      role="link"
      tabIndex={0}
      className={`${className ?? ""} ${pending ? "opacity-60 cursor-progress" : ""}`}
      aria-busy={pending || undefined}
      data-pending={pending || undefined}
      onMouseEnter={prefetch}
      onFocus={prefetch}
      onTouchStart={prefetch}
      onClick={handleClick}
      onAuxClick={handleAuxClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </span>
  );
};

export default UncrawledLink;

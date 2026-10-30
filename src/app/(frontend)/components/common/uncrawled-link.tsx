"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";

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
  const [pending, startTransition] = useTransition();
  const href = `${basePath}/${slug}`;

  // A real <Link> prefetches on its own; without href we warm the route on
  // intent instead, so the click navigates at once rather than waiting for
  // an on-demand render of a page that was not prebuilt.
  const prefetch = () => router.prefetch(href);
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

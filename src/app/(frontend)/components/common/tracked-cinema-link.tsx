"use client";

import React from "react";
import { trackEvent } from "@/lib/analytics";

interface TrackedCinemaLinkProps {
  href: string;
  cinemaSlug: string;
  className?: string;
  children: React.ReactNode;
}

// Outbound link to a cinema's own website. Plain <a> on purpose and rel keeps
// "noopener" only, so cinemas still see klaps.space as the referrer.
const TrackedCinemaLink: React.FC<TrackedCinemaLinkProps> = ({
  href,
  cinemaSlug,
  className,
  children,
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener"
    className={className}
    onClick={() =>
      trackEvent("cinema_website_click", { cinema_slug: cinemaSlug })
    }
  >
    {children}
  </a>
);

export default TrackedCinemaLink;

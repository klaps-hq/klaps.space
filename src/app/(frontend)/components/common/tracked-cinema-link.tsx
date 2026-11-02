"use client";

import React from "react";
import { CinemaLinkPlacement, trackEvent } from "@/lib/analytics";

interface TrackedCinemaLinkProps {
  href: string;
  cinemaSlug: string;
  placement: CinemaLinkPlacement;
  // Film whose screening row holds the link, when there is one.
  movieSlug?: string;
  className?: string;
  "aria-label"?: string;
  children: React.ReactNode;
}

// Outbound link to a cinema's own website. A real <a target="_blank"> that
// the browser opens itself (no window.open, so no popup blocker prompt);
// the click handler only reports the event and never prevents navigation.
// gtag sends events with the beacon transport, so the hit survives the
// page losing focus. rel keeps "noopener" only, so cinemas still see
// klaps.space as the referrer.
const TrackedCinemaLink: React.FC<TrackedCinemaLinkProps> = ({
  href,
  cinemaSlug,
  placement,
  movieSlug,
  className,
  "aria-label": ariaLabel,
  children,
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener"
    className={className}
    aria-label={ariaLabel}
    onClick={() =>
      trackEvent("cinema_website_click", {
        cinema_slug: cinemaSlug,
        link_placement: placement,
        ...(movieSlug && { movie_slug: movieSlug }),
      })
    }
  >
    {children}
  </a>
);

export default TrackedCinemaLink;

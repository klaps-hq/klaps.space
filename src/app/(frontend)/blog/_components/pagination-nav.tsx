import React from "react";
import Link from "next/link";

interface PaginationNavProps {
  currentPage: number;
  totalPages: number;
}

// Page 1 lives at /blog itself, deeper pages under /blog/strona/N.
const pageHref = (page: number): string =>
  page === 1 ? "/blog" : `/blog/strona/${page}`;

const edgeLinkClass =
  "text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors";
const edgePlaceholderClass =
  "text-xs uppercase tracking-[0.2em] text-white/15 select-none";

const PaginationNav = ({ currentPage, totalPages }: PaginationNavProps) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Paginacja"
      className="mt-10 flex items-baseline justify-between md:mt-12"
    >
      {currentPage > 1 ? (
        <Link href={pageHref(currentPage - 1)} rel="prev" className={edgeLinkClass}>
          Nowsze
        </Link>
      ) : (
        <span aria-hidden className={edgePlaceholderClass}>
          Nowsze
        </span>
      )}

      <ul className="flex items-baseline gap-4 md:gap-5">
        {pages.map((page) =>
          page === currentPage ? (
            <li key={page}>
              <span
                aria-current="page"
                className="text-sm text-white border-b border-white/60 pb-0.5"
              >
                {page}
              </span>
            </li>
          ) : (
            <li key={page}>
              <Link
                href={pageHref(page)}
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                {page}
              </Link>
            </li>
          )
        )}
      </ul>

      {currentPage < totalPages ? (
        <Link href={pageHref(currentPage + 1)} rel="next" className={edgeLinkClass}>
          Starsze
        </Link>
      ) : (
        <span aria-hidden className={edgePlaceholderClass}>
          Starsze
        </span>
      )}
    </nav>
  );
};

export default PaginationNav;

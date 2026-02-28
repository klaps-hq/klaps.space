import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginatedNavProps {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

const getVisiblePages = (
  current: number,
  total: number
): (number | "dots")[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "dots")[] = [1];

  if (current > 3) {
    pages.push("dots");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("dots");
  }

  pages.push(total);

  return pages;
};

const PaginatedNav: React.FC<PaginatedNavProps> = ({
  currentPage,
  totalPages,
  buildHref,
}) => {
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(currentPage, totalPages);
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <Pagination>
      <PaginationContent className="gap-1">
        <PaginationItem>
          <PaginationPrevious
            href={hasPrevious ? buildHref(currentPage - 1) : undefined}
            tabIndex={hasPrevious ? 0 : -1}
            className={
              !hasPrevious ? "pointer-events-none text-neutral-700" : undefined
            }
          />
        </PaginationItem>

        {visiblePages.map((page, index) => {
          if (page === "dots") {
            return (
              <PaginationItem key={`dots-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          const isActive = page === currentPage;

          return (
            <PaginationItem key={page}>
              <PaginationLink href={buildHref(page)} isActive={isActive}>
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={hasNext ? buildHref(currentPage + 1) : undefined}
            tabIndex={hasNext ? 0 : -1}
            className={
              !hasNext ? "pointer-events-none text-neutral-700" : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginatedNav;

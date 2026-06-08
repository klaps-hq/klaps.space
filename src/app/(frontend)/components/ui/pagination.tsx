import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn(
        "flex flex-row flex-wrap items-center justify-center gap-5 md:gap-6",
        className,
      )}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & React.ComponentProps<"a">;

function PaginationLink({
  className,
  isActive,
  ...props
}: PaginationLinkProps) {
  return (
    <a
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        "inline-flex items-baseline justify-center text-lg md:text-xl tabular-nums tracking-tight transition-colors duration-200 cursor-pointer pb-1 border-b",
        isActive
          ? "text-white border-white"
          : "text-white/40 border-transparent hover:text-white hover:border-white/40",
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <a
      data-slot="pagination-link"
      aria-label="Poprzednia strona"
      className={cn(
        "inline-flex items-center justify-center text-white/40 hover:text-white transition-colors duration-200 cursor-pointer",
        className,
      )}
      {...props}
    >
      <ChevronLeftIcon className="size-6" />
    </a>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <a
      data-slot="pagination-link"
      aria-label="Następna strona"
      className={cn(
        "inline-flex items-center justify-center text-white/40 hover:text-white transition-colors duration-200 cursor-pointer",
        className,
      )}
      {...props}
    >
      <ChevronRightIcon className="size-6" />
    </a>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="pagination-ellipsis"
      className={cn(
        "inline-flex items-baseline justify-center text-white/25 text-lg md:text-xl",
        className,
      )}
      {...props}
    >
      ···
      <span className="sr-only">Więcej stron</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};

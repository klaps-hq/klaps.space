import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

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
      className={cn("flex flex-row items-center gap-1", className)}
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
        "inline-flex items-center justify-center size-10 text-sm font-semibold uppercase tracking-wider transition-colors duration-200 cursor-pointer",
        isActive
          ? "bg-blood-red text-white"
          : "text-neutral-400 hover:text-white hover:bg-white/5",
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
    <PaginationLink className={cn("size-10", className)} {...props}>
      <ChevronLeftIcon className="size-5" />
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink className={cn("size-10", className)} {...props}>
      <ChevronRightIcon className="size-5" />
    </PaginationLink>
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
        "flex size-10 items-center justify-center text-neutral-600",
        className,
      )}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
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

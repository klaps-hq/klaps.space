"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  label: string;
  onClick?: () => void;
  tabIndex?: number;
  className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  label,
  onClick,
  tabIndex,
  className,
}) => {
  const pathname = usePathname();
  const isHashLink = href.startsWith("#");
  const isActive =
    !isHashLink &&
    (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <Link
      href={href}
      onClick={onClick}
      tabIndex={tabIndex}
      className={cn(
        "relative font-medium uppercase tracking-[0.16em] transition-colors duration-300 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blood-red focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        "after:absolute after:left-0 after:bottom-0 after:h-px after:bg-blood-red after:transition-all after:duration-300",
        isActive
          ? "text-blood-red after:w-full"
          : "text-white/70 hover:text-white after:w-0 hover:after:w-full",
        className
      )}
    >
      {label}
    </Link>
  );
};

export default NavLink;

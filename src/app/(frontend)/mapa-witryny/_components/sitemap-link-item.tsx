import React from "react";
import Link from "next/link";

interface SitemapLinkItemProps {
  href: string;
  label: string;
}

const SitemapLinkItem: React.FC<SitemapLinkItemProps> = ({ href, label }) => {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-baseline gap-4 py-3 transition-colors duration-200 hover:text-blood-red focus-visible:text-blood-red focus-visible:outline-none"
      >
        <span className="text-neutral-300 text-base md:text-lg leading-snug group-hover:text-blood-red group-focus-visible:text-blood-red transition-colors duration-200">
          {label}
        </span>
      </Link>
    </li>
  );
};

export default SitemapLinkItem;

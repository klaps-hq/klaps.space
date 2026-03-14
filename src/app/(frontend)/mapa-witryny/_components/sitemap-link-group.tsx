import React from "react";
import SitemapLinkItem from "./sitemap-link-item";

type SitemapLink = {
  href: string;
  label: string;
};

interface SitemapLinkGroupProps {
  heading: string;
  links: SitemapLink[];
}

const SitemapLinkGroup: React.FC<SitemapLinkGroupProps> = ({
  heading,
  links,
}) => {
  return (
    <div>
      <h2 className="text-white text-xs md:text-sm font-bold uppercase tracking-widest leading-none mb-6">
        {heading}
      </h2>

      <ul className="divide-y divide-neutral-800">
        {links.map((link) => (
          <SitemapLinkItem
            key={link.href}
            href={link.href}
            label={link.label}
          />
        ))}
      </ul>
    </div>
  );
};

export default SitemapLinkGroup;

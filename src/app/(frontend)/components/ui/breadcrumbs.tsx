import React from "react";
import Link from "next/link";
import JsonLd from "@/components/common/json-ld";
import { SITE_URL } from "@/lib/site-config";

type BreadcrumbItem = {
  name: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  const allItems = [{ name: "Strona główna", href: "/" }, ...items];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: allItems.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            // Home resolves to the bare origin (no trailing slash) so it
            // matches the canonical and sitemap form of the homepage URL.
            ...(item.href && {
              item: item.href === "/" ? SITE_URL : `${SITE_URL}${item.href}`,
            }),
          })),
        }}
      />

      {/* The links' py-2 tap padding lives INSIDE the scroll container
          (negative margin on the nav compensates the layout), otherwise
          it overflows the box vertically and forces a scrollbar. The
          horizontal scrollbar is hidden but scrolling still works. */}
      <nav
        aria-label="Breadcrumb"
        className="w-full overflow-x-auto -my-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <ol className="inline-flex items-center gap-2 whitespace-nowrap text-[11px] md:text-xs uppercase tracking-[0.12em]">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;

            return (
              <li key={`${item.name}-${index}`} className="flex items-center gap-2">
                {index > 0 && (
                  <span className="text-white/25 select-none" aria-hidden="true">
                    &gt;
                  </span>
                )}
                {isLast ? (
                  <span
                    className="max-w-[220px] truncate text-white/90 md:max-w-[320px]"
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href ?? "/"}
                    // py-2 widens the touch target; the nav's -my-2 keeps
                    // the layout in place (bare text is ~16px tall).
                    className="inline-block py-2 max-w-[220px] truncate text-white/50 transition-colors duration-300 hover:text-white/85 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/80 md:max-w-[320px]"
                    tabIndex={0}
                    aria-label={`Przejdź do ${item.name}`}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;

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
            ...(item.href && { item: `${SITE_URL}${item.href}` }),
          })),
        }}
      />

      <nav aria-label="Breadcrumb" className="w-full overflow-x-auto">
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
                    className="max-w-[220px] truncate text-white/45 transition-colors duration-300 hover:text-white/85 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blood-red/80 md:max-w-[320px]"
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

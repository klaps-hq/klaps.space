import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
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
      <nav aria-label="Breadcrumb" className="w-full">
        <ol className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em]">
          {allItems.map((item, index) => {
            const isLast = index === allItems.length - 1;
            const isHome = index === 0;

            return (
              <li key={item.name} className="flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight
                    className="size-3 text-neutral-600 shrink-0"
                    aria-hidden="true"
                  />
                )}
                {isLast ? (
                  <span
                    className="text-neutral-400 truncate max-w-[200px] md:max-w-[300px]"
                    aria-current="page"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href ?? "/"}
                    className="text-neutral-500 hover:text-blood-red transition-colors duration-300 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blood-red rounded-sm"
                    tabIndex={0}
                    aria-label={
                      isHome ? "Przejdź do strony głównej" : item.name
                    }
                  >
                    {isHome && (
                      <Home className="size-3 shrink-0" aria-hidden="true" />
                    )}
                    <span>{item.name}</span>
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

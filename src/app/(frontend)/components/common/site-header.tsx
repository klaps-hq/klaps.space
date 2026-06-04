"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useHeaderScroll } from "@/hooks/use-header-scroll";
import MobileNav from "./mobile-nav";

const NAV_LINKS = [
  { href: "/seanse", label: "Seanse" },
  { href: "/gatunki", label: "Gatunki" },
  { href: "/kina", label: "Kina" },
  { href: "/miasta", label: "Miasta" },
  { href: "/mapa-kin", label: "Mapa" },
];

const SiteHeader: React.FC = () => {
  const hasScrolled = useHeaderScroll({ threshold: 50 });

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-300",
        hasScrolled
          ? "bg-black/85 backdrop-blur-md border-white/10"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="flex items-center justify-between gap-8 px-6 md:px-12 lg:px-16 py-6">
        <Link
          href="/"
          aria-label="Klaps, strona główna"
          className="flex items-center gap-2.5 text-white shrink-0"
        >
          <svg
            viewBox="0 0 28 20"
            className="w-5 h-5"
            fill="currentColor"
            aria-hidden="true"
          >
            <polygon points="0,8 28,0 28,20 0,12" />
          </svg>
          <span className="text-xl font-medium lowercase tracking-tight">
            klaps
          </span>
        </Link>
        <nav
          aria-label="Główna nawigacja"
          className="hidden md:flex items-center gap-6 lg:gap-8 text-sm text-white/80"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <MobileNav links={NAV_LINKS} />
      </div>
    </header>
  );
};

export default SiteHeader;

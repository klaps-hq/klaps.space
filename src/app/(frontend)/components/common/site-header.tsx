import React from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/seanse", label: "Seanse" },
  { href: "/filmy", label: "Filmy" },
  { href: "/gatunki", label: "Gatunki" },
  { href: "/kina", label: "Kina" },
  { href: "/miasta", label: "Miasta" },
  { href: "/mapa-kin", label: "Mapa" },
];

const SiteHeader: React.FC = () => (
  <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-md">
    <div className="flex items-center justify-between gap-6 px-6 md:px-12 lg:px-16 py-4 md:py-5">
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
        className="hidden md:flex items-center gap-5 lg:gap-8 text-[11px] lg:text-xs uppercase tracking-[0.22em] text-white/65"
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
    </div>
  </header>
);

export default SiteHeader;

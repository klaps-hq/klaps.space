import React from "react";
import Link from "next/link";

const NAV_COLUMNS = [
  {
    heading: "Przeglądaj",
    links: [
      { label: "Filmy", href: "/filmy" },
      { label: "Kina", href: "/kina" },
      { label: "Miasta", href: "/miasta" },
      { label: "Seanse", href: "/seanse" },
    ],
  },
  {
    heading: "Informacje",
    links: [
      { label: "O projekcie", href: "/o-projekcie" },
      { label: "Jak to działa", href: "/jak-to-dziala" },
      { label: "FAQ", href: "/faq" },
      { label: "Kontakt", href: "/kontakt" },
    ],
  },
  {
    heading: "Prawne",
    links: [
      { label: "Regulamin", href: "/regulamin" },
      { label: "Polityka prywatności", href: "/polityka-prywatnosci" },
      { label: "Dostępność", href: "/dostepnosc" },
      { label: "Mapa witryny", href: "/mapa-witryny" },
    ],
  },
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      <div className="px-6 md:px-12 lg:px-24 pt-20 md:pt-32 pb-8">
        <div className="mb-12 md:mb-20 flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-white/50">
          <span className="h-px w-12 bg-white/30" />
          <span>Kontakt &amp; mapa</span>
        </div>

        <div className="grid grid-cols-3 gap-6 md:gap-12 lg:gap-24 mb-16 md:mb-24">
          {NAV_COLUMNS.map((column) => (
            <div key={column.heading} className="flex flex-col gap-4 md:gap-5">
              <h3 className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-white/40">
                {column.heading}
              </h3>
              <ul className="flex flex-col gap-2 md:gap-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm md:text-lg text-white/85 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 pt-8 border-t border-white/10 text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/50">
          <span>&copy; {currentYear} Klaps</span>
          <a
            href="https://github.com/klaps-hq/klaps.space"
            target="_blank"
            rel="noreferrer noopener"
            className="hover:text-white transition-colors"
          >
            github.com/klaps-hq
          </a>
        </div>
      </div>

      <Link
        href="/"
        aria-label="Klaps — strona główna"
        className="group flex items-end gap-[2vw] px-6 md:px-12 lg:px-24 pb-[1vw] w-full max-w-full"
      >
        <svg
          viewBox="0 0 28 20"
          className="w-[14vw] h-auto text-white block shrink-0"
          fill="currentColor"
          aria-hidden="true"
        >
          <polygon points="0,8 28,0 28,20 0,12" />
        </svg>
        <h2 className="text-[20vw] leading-[0.78] font-bold uppercase text-white -tracking-[0.04em] whitespace-nowrap">
          Klaps
        </h2>
      </Link>
    </footer>
  );
};

export default Footer;

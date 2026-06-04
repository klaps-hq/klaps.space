import React from "react";
import Image from "next/image";
import Link from "next/link";
import WilhelmEgg from "./wilhelm-egg";

const NAV_COLUMNS = [
  {
    heading: "Przeglądaj",
    links: [
      { label: "Seanse", href: "/seanse" },
      { label: "Kina", href: "/kina" },
      { label: "Miasta", href: "/miasta" },
      { label: "Gatunki", href: "/gatunki" },
      { label: "Mapa kin", href: "/mapa-kin" },
    ],
  },
  {
    heading: "Informacje",
    links: [
      { label: "O projekcie", href: "/o-projekcie" },
      { label: "FAQ", href: "/faq" },
      { label: "Kontakt", href: "/kontakt" },
    ],
  },
  {
    heading: "Prawne",
    links: [
      { label: "Regulamin", href: "/regulamin" },
      { label: "Polityka prywatności", href: "/polityka-prywatnosci" },
    ],
  },
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black text-white overflow-hidden border-t border-white/10">
      <div className="relative z-10 px-6 md:px-12 lg:px-16 pt-20 md:pt-28 pb-8">
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
            href="https://github.com/klaps-hq"
            target="_blank"
            rel="noreferrer noopener nofollow"
            className="group inline-flex items-baseline gap-2 hover:text-white transition-colors"
          >
            <span className="underline underline-offset-4 decoration-white/25 group-hover:decoration-white transition-colors">
              github.com/klaps-hq
            </span>
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            >
              ↗
            </span>
          </a>
        </div>
      </div>

      <div className="flex items-end gap-[1.5vw] w-full pl-6 md:pl-12 lg:pl-16 pb-[1vw]">
        <WilhelmEgg />
        <Link
          href="/"
          aria-label="Klaps, strona główna"
          className="block"
        >
          <h2 className="text-[24vw] leading-[0.78] font-bold uppercase text-white -tracking-[0.04em] whitespace-nowrap">
            Klaps
          </h2>
        </Link>
      </div>

      <div className="flex items-center gap-3 px-6 md:px-12 lg:px-16 pb-6 text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/40">
        <a
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noreferrer noopener nofollow"
          className="shrink-0 opacity-50 hover:opacity-80 transition-opacity"
        >
          <Image src="/tmdb-logo.svg" alt="TMDB" width={90} height={12} />
        </a>
        <p>
          Dane filmowe dostarcza TMDB. Serwis nie jest powiązany
          z&nbsp;TMDB.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

import React from "react";
import Link from "next/link";

type FooterLinkGroup = {
  heading: string;
  links: { href: string; label: string }[];
};

const FOOTER_NAV_GROUPS: FooterLinkGroup[] = [
  {
    heading: "Nawigacja",
    links: [
      { href: "/", label: "Strona główna" },
      { href: "#seanse", label: "Seanse" },
      { href: "/filmy", label: "Filmy" },
      { href: "/kina", label: "Kina" },
      { href: "/miasta", label: "Miasta" },
      { href: "/gatunki", label: "Gatunki" },
    ],
  },
  {
    heading: "Informacje",
    links: [
      { href: "/o-projekcie", label: "O projekcie" },
      { href: "/jak-to-dziala", label: "Jak to działa" },
      { href: "/kontakt", label: "Kontakt" },
      { href: "/faq", label: "FAQ" },
      { href: "/regulamin", label: "Regulamin" },
      { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
      { href: "/mapa-witryny", label: "Mapa witryny" },
      { href: "/dostepnosc", label: "Dostępność" },
    ],
  },
];

const FooterNav: React.FC = () => {
  return (
    <nav className="grid grid-cols-2 gap-8">
      {FOOTER_NAV_GROUPS.map((group) => (
        <div key={group.heading} className="flex flex-col gap-4">
          <h3 className="text-lg uppercase tracking-[0.3em] text-blood-red font-semibold">
            {group.heading}
          </h3>

          <ul className="flex flex-col gap-3" role="list">
            {group.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs uppercase tracking-[0.12em] text-white/50 hover:text-white transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blood-red focus-visible:ring-offset-2 focus-visible:ring-offset-dark-ink rounded-sm"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
};

export default FooterNav;

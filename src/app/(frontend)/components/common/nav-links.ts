export interface NavLink {
  href: string;
  label: string;
}

// Shared primary navigation, used by the site header (desktop + mobile) and
// the homepage hero nav so the link set never drifts between them.
export const NAV_LINKS: NavLink[] = [
  { href: "/seanse", label: "Seanse" },
  { href: "/gatunki", label: "Gatunki" },
  { href: "/rezyserzy", label: "Reżyserzy" },
  { href: "/kina", label: "Kina" },
  { href: "/miasta", label: "Miasta" },
  { href: "/mapa-kin", label: "Mapa" },
  { href: "/blog", label: "Blog" },
];

import React from "react";
import { cn } from "@/lib/utils";
import NavLink from "./nav-link";
import HeaderCitySelect from "./header-city-select";
import { ICity } from "@/interfaces/ICities";

interface NavLinkItem {
  href: string;
  label: string;
}

interface MobileNavProps {
  links: readonly NavLinkItem[];
  cities?: ICity[];
  isOpen: boolean;
  onClose: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({
  links,
  cities,
  isOpen,
  onClose,
}) => {
  return (
    <nav
      id="mobile-menu"
      className={cn(
        "xl:hidden fixed top-0 left-0 right-0 bottom-0 z-40 bg-black flex flex-col items-center justify-center gap-8 transition-all duration-300 pt-[72px]",
        isOpen
          ? "translate-y-0 visible"
          : "-translate-y-full invisible pointer-events-none",
      )}
      aria-label="Nawigacja mobilna"
      aria-hidden={!isOpen}
    >
      {cities && cities.length > 0 && (
        <HeaderCitySelect size="md" className="px-8" />
      )}
      {links.map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          label={link.label}
          onClick={onClose}
          tabIndex={isOpen ? 0 : -1}
          className="text-2xl"
        />
      ))}
    </nav>
  );
};

export default MobileNav;

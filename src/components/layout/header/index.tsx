"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useHeaderScroll } from "@/hooks/use-header-scroll";
import { useMobileMenu } from "@/hooks/use-mobile-menu";
import Logo from "@/components/common/logo";
import DesktopNav from "./desktop-nav";
import MobileMenuButton from "./mobile-menu-button";
import MobileNav from "./mobile-nav";
import HeaderCitySelect from "./header-city-select";
import { ICity } from "@/interfaces/ICities";

const NAV_LINKS = [
  { href: "/", label: "Strona główna" },
  { href: "/seanse", label: "Seanse" },
  { href: "/filmy", label: "Filmy" },
  { href: "/kina", label: "Kina" },
  { href: "/miasta", label: "Miasta" },
  { href: "/o-projekcie", label: "O projekcie" },
  { href: "/kontakt", label: "Kontakt" },
] as const;

interface HeaderProps {
  cities?: ICity[];
}

const Header: React.FC<HeaderProps> = ({ cities }) => {
  const hasScrolled = useHeaderScroll({ threshold: 50 });
  const hasCitySelect = Boolean(cities && cities.length > 0);
  const {
    isOpen: isMenuOpen,
    handleToggle,
    handleClose,
    handleKeyDown,
  } = useMobileMenu();

  return (
    <>
      <header
        className={cn(
          "flex items-center justify-between px-4 md:px-8 w-full z-50 py-4 fixed top-0 left-0 right-0 transition-all duration-300",
          hasScrolled || isMenuOpen || hasCitySelect
            ? "bg-black/95 backdrop-blur-sm"
            : "bg-linear-to-b from-black via-black/60 to-transparent"
        )}
      >
        <Logo />
        <div className="hidden xl:flex items-center gap-4">
          <DesktopNav links={NAV_LINKS} />
          {hasCitySelect && (
            <>
              <div className="h-4 w-px bg-white/20" aria-hidden />
              <HeaderCitySelect size="sm" />
            </>
          )}
        </div>
        <MobileMenuButton
          isOpen={isMenuOpen}
          onToggle={handleToggle}
          onKeyDown={handleKeyDown}
        />
      </header>
      <MobileNav
        links={NAV_LINKS}
        cities={cities}
        isOpen={isMenuOpen}
        onClose={handleClose}
      />
    </>
  );
};

export default Header;

import React from "react";
import NavLink from "./nav-link";

interface NavLinkItem {
  href: string;
  label: string;
}

interface DesktopNavProps {
  links: readonly NavLinkItem[];
}

const DesktopNav: React.FC<DesktopNavProps> = ({ links }) => {
  return (
    <nav className="hidden xl:flex items-center gap-7">
      {links.map((link) => (
        <NavLink
          key={link.href}
          href={link.href}
          label={link.label}
          className="text-sm pb-1.5"
        />
      ))}
    </nav>
  );
};

export default DesktopNav;

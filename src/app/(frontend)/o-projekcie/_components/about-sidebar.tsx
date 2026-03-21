"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SidebarLink {
  id: string;
  label: string;
}

interface AboutSidebarProps {
  links: SidebarLink[];
  activeId: string;
}

const AboutSidebar: React.FC<AboutSidebarProps> = ({ links, activeId }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;

    element.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <nav className="sticky top-28 flex flex-col gap-1">
        {links.map((link) => {
          const isActive = activeId === link.id;

          return (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleClick(e, link.id)}
              className={cn(
                "text-sm py-2 pl-4 border-l-2 transition-all duration-300",
                isActive
                  ? "text-blood-red border-blood-red font-semibold"
                  : "text-neutral-600 border-transparent hover:text-neutral-300 hover:border-white/20"
              )}
            >
              {link.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
};

export default AboutSidebar;

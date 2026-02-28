"use client";

import React from "react";
import { cn } from "@/lib/utils";

type SidebarLink = {
  id: string;
  label: string;
};

type TermsSidebarProps = {
  links: SidebarLink[];
  activeId: string;
};

const TermsSidebar: React.FC<TermsSidebarProps> = ({ links, activeId }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;

    element.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    <aside className="hidden md:block w-48 shrink-0">
      <nav className="sticky top-28 flex flex-col gap-1">
        {links.map((link) => {
          const isActive = activeId === link.id;

          return (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleClick(e, link.id)}
              className={cn(
                "text-sm uppercase tracking-widest py-2 pl-4 border-l transition-all duration-300",
                isActive
                  ? "text-blood-red border-blood-red"
                  : "text-neutral-600 border-neutral-800 hover:text-neutral-400 hover:border-neutral-600"
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

export default TermsSidebar;

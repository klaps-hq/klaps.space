"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  links: NavLink[];
}

const MobileNav: React.FC<MobileNavProps> = ({ links }) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Lock body scroll while the menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Otwórz menu"
        aria-expanded={open}
        className="text-[11px] uppercase tracking-[0.25em] text-white/80 hover:text-white transition-colors py-2"
      >
        Menu
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Menu nawigacji"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90] bg-black flex flex-col"
          >
            <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
              <Link
                href="/"
                aria-label="Klaps, strona główna"
                className="flex items-center gap-2.5 text-white"
                onClick={() => setOpen(false)}
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
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Zamknij menu"
                className="text-[11px] uppercase tracking-[0.25em] text-white/60 hover:text-white transition-colors py-2"
              >
                Zamknij
              </button>
            </div>

            <motion.nav
              aria-label="Główna nawigacja"
              className="flex-1 flex flex-col justify-center px-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.06, delayChildren: 0.1 },
                },
              }}
            >
              <ul className="flex flex-col divide-y divide-white/10">
                {links.map((link) => (
                  <motion.li
                    key={link.href}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.5,
                          ease: [0.22, 1, 0.36, 1],
                        },
                      },
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={
                        pathname === link.href
                          ? "block py-5 text-4xl font-medium uppercase -tracking-[0.02em] leading-none text-white"
                          : "block py-5 text-4xl font-medium uppercase -tracking-[0.02em] leading-none text-white/55 hover:text-white transition-colors"
                      }
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNav;

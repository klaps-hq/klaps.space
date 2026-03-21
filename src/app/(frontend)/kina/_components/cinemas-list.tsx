"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ICinemaGroup } from "@/interfaces/ICinema";
import SearchInput from "@/components/common/search-input";

interface CinemasListProps {
  cinemaGroups: ICinemaGroup[];
}

interface FlatCinema {
  id: number;
  slug: string;
  name: string;
  street: string | null;
  cityName: string;
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.02 } },
};

const item = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const CinemasList: React.FC<CinemasListProps> = ({ cinemaGroups }) => {
  const [query, setQuery] = useState("");

  const allCinemas = useMemo<FlatCinema[]>(() => {
    const flat = cinemaGroups.flatMap((group) =>
      group.cinemas.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        street: c.street,
        cityName: group.city.name,
      })),
    );
    return flat.sort((a, b) => a.name.localeCompare(b.name, "pl"));
  }, [cinemaGroups]);

  const filtered = useMemo(() => {
    if (!query.trim()) return allCinemas;
    const q = query.toLowerCase().trim();
    return allCinemas.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.cityName.toLowerCase().includes(q),
    );
  }, [allCinemas, query]);

  if (cinemaGroups.length === 0) {
    return (
      <p className="text-neutral-500 text-base">
        Brak kin do wyświetlenia.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Szukaj kina lub miasta..."
        className="max-w-md"
      />

      {filtered.length === 0 ? (
        <p className="text-neutral-500 text-sm">
          Nie znaleziono kin dla &ldquo;{query}&rdquo;
        </p>
      ) : (
        <motion.ul
          key={query}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-16 border-t border-white/[0.06]"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {filtered.map((cinema) => (
            <motion.li
              key={cinema.id}
              className="border-b border-white/[0.06]"
              variants={item}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link
                href={`/kina/${cinema.slug}`}
                className="group flex items-center justify-between gap-4 py-4 transition-colors duration-300"
              >
                <div className="flex flex-col min-w-0">
                  <span className="text-neutral-300 text-base font-semibold uppercase tracking-wide group-hover:text-blood-red transition-colors duration-300 truncate">
                    {cinema.name}
                  </span>
                  {cinema.street && (
                    <span className="text-neutral-600 text-xs truncate">
                      {cinema.street}
                    </span>
                  )}
                </div>

                <span className="text-neutral-400 text-xs font-medium uppercase tracking-wider shrink-0">
                  {cinema.cityName}
                </span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default CinemasList;

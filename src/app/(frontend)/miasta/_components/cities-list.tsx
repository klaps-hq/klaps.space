"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ICity } from "@/interfaces/ICities";
import SearchInput from "@/components/common/search-input";

interface CitiesListProps {
  cities: ICity[];
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.02 } },
};

const item = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const CitiesList: React.FC<CitiesListProps> = ({ cities }) => {
  const [query, setQuery] = useState("");

  const sorted = useMemo(
    () => [...cities].sort((a, b) => a.name.localeCompare(b.name, "pl")),
    [cities],
  );

  const filtered = useMemo(() => {
    if (!query.trim()) return sorted;
    const q = query.toLowerCase().trim();
    return sorted.filter((c) => c.name.toLowerCase().includes(q));
  }, [sorted, query]);

  if (cities.length === 0) {
    return (
      <p className="text-neutral-500 text-base">
        Brak miast do wyświetlenia.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <SearchInput
        value={query}
        onChange={setQuery}
        placeholder="Szukaj miasta..."
        className="max-w-md"
      />

      {filtered.length === 0 ? (
        <p className="text-neutral-500 text-sm">
          Nie znaleziono miast dla &ldquo;{query}&rdquo;
        </p>
      ) : (
        <motion.ul
          key={query}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 border-t border-white/[0.06]"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {filtered.map((city) => (
            <motion.li
              key={city.id}
              className="border-b border-white/[0.06]"
              variants={item}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link
                href={`/miasta/${city.slug}`}
                className="group flex items-center justify-between py-4 transition-colors duration-300"
              >
                <span className="text-neutral-300 text-base font-semibold uppercase tracking-wide group-hover:text-blood-red transition-colors duration-300">
                  {city.name}
                </span>

                <span className="text-neutral-700 text-xs tabular-nums group-hover:text-neutral-500 transition-colors duration-300">
                  {city.numberOfCinemas}{" "}
                  {city.numberOfCinemas === 1
                    ? "kino"
                    : city.numberOfCinemas < 5
                      ? "kina"
                      : "kin"}
                </span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
};

export default CitiesList;

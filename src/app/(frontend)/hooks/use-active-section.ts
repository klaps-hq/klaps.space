"use client";

import { useEffect, useRef, useState } from "react";

type UseActiveSectionOptions = {
  sectionIds: readonly string[];
  rootMargin?: string;
};

export const useActiveSection = ({
  sectionIds,
  rootMargin = "-20% 0px -60% 0px",
}: UseActiveSectionOptions): string => {
  const [activeId, setActiveId] = useState<string>(sectionIds[0]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sectionElements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (sectionElements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length === 0) return;

        const topMost = visibleEntries.reduce((prev, curr) =>
          prev.boundingClientRect.top < curr.boundingClientRect.top
            ? prev
            : curr
        );

        setActiveId(topMost.target.id);
      },
      { rootMargin, threshold: 0 }
    );

    sectionElements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [sectionIds, rootMargin]);

  return activeId;
};

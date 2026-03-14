"use client";

import React from "react";
import HowItWorksSidebar from "./how-it-works-sidebar";
import IntroSection from "./sections/intro-section";
import DataSourcesSection from "./sections/data-sources-section";
import FilteringSection from "./sections/filtering-section";
import UsageSection from "./sections/usage-section";
import UpdatesSection from "./sections/updates-section";
import LimitationsSection from "./sections/limitations-section";
import { useActiveSection } from "@/hooks/use-active-section";

const SECTION_IDS = [
  "wprowadzenie",
  "zrodla-danych",
  "filtrowanie",
  "korzystanie",
  "aktualizacje",
  "ograniczenia",
] as const;

const SIDEBAR_LINKS = [
  { id: "wprowadzenie", label: "Na czym to polega?" },
  { id: "zrodla-danych", label: "Źródła danych" },
  { id: "filtrowanie", label: "Co filtrujemy?" },
  { id: "korzystanie", label: "Korzystanie" },
  { id: "aktualizacje", label: "Aktualizacje" },
  { id: "ograniczenia", label: "Ograniczenia" },
];

const HowItWorksPageContent: React.FC = () => {
  const activeId = useActiveSection({ sectionIds: SECTION_IDS });

  return (
    <div className="flex gap-16">
      <HowItWorksSidebar links={SIDEBAR_LINKS} activeId={activeId} />

      <div className="flex flex-col gap-20 flex-1 min-w-0">
        <IntroSection />
        <DataSourcesSection />
        <FilteringSection />
        <UsageSection />
        <UpdatesSection />
        <LimitationsSection />
      </div>
    </div>
  );
};

export default HowItWorksPageContent;

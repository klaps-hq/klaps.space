"use client";

import React from "react";
import FaqSidebar from "./faq-sidebar";
import GeneralSection from "./sections/general-section";
import ScreeningsSection from "./sections/screenings-section";
import CinemasSection from "./sections/cinemas-section";
import TicketsSection from "./sections/tickets-section";
import TechnicalSection from "./sections/technical-section";
import { useActiveSection } from "@/hooks/use-active-section";

const SECTION_IDS = [
  "ogolne",
  "seanse-i-repertuar",
  "kina-i-miasta",
  "bilety",
  "kwestie-techniczne",
] as const;

const SIDEBAR_LINKS = [
  { id: "ogolne", label: "Ogólne" },
  { id: "seanse-i-repertuar", label: "Seanse" },
  { id: "kina-i-miasta", label: "Kina i miasta" },
  { id: "bilety", label: "Bilety" },
  { id: "kwestie-techniczne", label: "Techniczne" },
];

const FaqPageContent: React.FC = () => {
  const activeId = useActiveSection({ sectionIds: SECTION_IDS });

  return (
    <div className="flex gap-16">
      <FaqSidebar links={SIDEBAR_LINKS} activeId={activeId} />
      <div className="flex flex-col gap-20 flex-1 min-w-0">
        <GeneralSection />
        <ScreeningsSection />
        <CinemasSection />
        <TicketsSection />
        <TechnicalSection />
      </div>
    </div>
  );
};

export default FaqPageContent;

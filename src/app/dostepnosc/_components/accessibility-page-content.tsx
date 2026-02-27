"use client";

import React from "react";
import AccessibilitySidebar from "./accessibility-sidebar";
import CommitmentSection from "./sections/commitment-section";
import StandardsSection from "./sections/standards-section";
import CompatibilitySection from "./sections/compatibility-section";
import LimitationsSection from "./sections/limitations-section";
import ContactSection from "./sections/contact-section";
import { useActiveSection } from "@/hooks/use-active-section";

const SECTION_IDS = [
  "zobowiazanie",
  "standardy",
  "kompatybilnosc",
  "ograniczenia",
  "kontakt",
] as const;

const SIDEBAR_LINKS = [
  { id: "zobowiazanie", label: "Zobowiązanie" },
  { id: "standardy", label: "Standardy" },
  { id: "kompatybilnosc", label: "Kompatybilność" },
  { id: "ograniczenia", label: "Ograniczenia" },
  { id: "kontakt", label: "Kontakt" },
];

const AccessibilityPageContent: React.FC = () => {
  const activeId = useActiveSection({ sectionIds: SECTION_IDS });

  return (
    <div className="flex gap-16">
      <AccessibilitySidebar links={SIDEBAR_LINKS} activeId={activeId} />

      <div className="flex flex-col gap-20 flex-1 min-w-0">
        <CommitmentSection />
        <StandardsSection />
        <CompatibilitySection />
        <LimitationsSection />
        <ContactSection />
      </div>
    </div>
  );
};

export default AccessibilityPageContent;

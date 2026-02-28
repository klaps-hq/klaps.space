"use client";

import React from "react";
import TermsSidebar from "./terms-sidebar";
import GeneralSection from "./sections/general-section";
import DefinitionsSection from "./sections/definitions-section";
import UsageRulesSection from "./sections/usage-rules-section";
import DataDisclaimerSection from "./sections/data-disclaimer-section";
import LiabilitySection from "./sections/liability-section";
import CopyrightSection from "./sections/copyright-section";
import ChangesSection from "./sections/changes-section";
import FinalSection from "./sections/final-section";
import { useActiveSection } from "@/hooks/use-active-section";

const SECTION_IDS = [
  "postanowienia-ogolne",
  "definicje",
  "zasady-korzystania",
  "dane-i-zrodla",
  "odpowiedzialnosc",
  "prawa-autorskie",
  "zmiany-regulaminu",
  "postanowienia-koncowe",
] as const;

const SIDEBAR_LINKS = [
  { id: "postanowienia-ogolne", label: "Ogólne" },
  { id: "definicje", label: "Definicje" },
  { id: "zasady-korzystania", label: "Zasady" },
  { id: "dane-i-zrodla", label: "Dane i źródła" },
  { id: "odpowiedzialnosc", label: "Odpowiedzialność" },
  { id: "prawa-autorskie", label: "Prawa autorskie" },
  { id: "zmiany-regulaminu", label: "Zmiany" },
  { id: "postanowienia-koncowe", label: "Końcowe" },
];

const TermsPageContent: React.FC = () => {
  const activeId = useActiveSection({ sectionIds: SECTION_IDS });

  return (
    <div className="flex gap-16">
      <TermsSidebar links={SIDEBAR_LINKS} activeId={activeId} />
      <div className="flex flex-col gap-20 flex-1 min-w-0">
        <GeneralSection />
        <DefinitionsSection />
        <UsageRulesSection />
        <DataDisclaimerSection />
        <LiabilitySection />
        <CopyrightSection />
        <ChangesSection />
        <FinalSection />
      </div>
    </div>
  );
};

export default TermsPageContent;

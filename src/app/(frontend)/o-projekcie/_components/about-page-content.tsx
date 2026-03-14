"use client";

import React from "react";
import AboutSidebar from "./about-sidebar";
import IntroSection from "./sections/intro-section";
import ProblemSection from "./sections/problem-section";
import WhyCinemaSection from "./sections/why-cinema-section";
import ScopeSection from "./sections/scope-section";
import GoalsSection from "./sections/goals-section";
import PhilosophySection from "./sections/philosophy-section";
import AudienceSection from "./sections/audience-section";
import CharacterSection from "./sections/character-section";
import OpenSourceSection from "./sections/open-source-section";
import SummarySection from "./sections/summary-section";
import { useActiveSection } from "@/hooks/use-active-section";

const SECTION_IDS = [
  "czym-jest",
  "problem",
  "dlaczego-kino",
  "zakres",
  "cele",
  "filozofia",
  "grupa-docelowa",
  "charakter",
  "kod-zrodlowy",
  "podsumowanie",
] as const;

const SIDEBAR_LINKS = [
  { id: "czym-jest", label: "Czym jest Klaps?" },
  { id: "problem", label: "Problem" },
  { id: "dlaczego-kino", label: "Dlaczego kino?" },
  { id: "zakres", label: "Zakres projektu" },
  { id: "cele", label: "Cele projektu" },
  { id: "filozofia", label: "Filozofia" },
  { id: "grupa-docelowa", label: "Grupa docelowa" },
  { id: "charakter", label: "Charakter projektu" },
  { id: "kod-zrodlowy", label: "Kod źródłowy" },
  { id: "podsumowanie", label: "Podsumowanie" },
];

const AboutPageContent: React.FC = () => {
  const activeId = useActiveSection({ sectionIds: SECTION_IDS });

  return (
    <div className="flex gap-16">
      <AboutSidebar links={SIDEBAR_LINKS} activeId={activeId} />
      <div className="flex flex-col gap-20 flex-1 min-w-0">
        <IntroSection />
        <ProblemSection />
        <WhyCinemaSection />
        <ScopeSection />
        <GoalsSection />
        <PhilosophySection />
        <AudienceSection />
        <CharacterSection />
        <OpenSourceSection />
        <SummarySection />
      </div>
    </div>
  );
};

export default AboutPageContent;

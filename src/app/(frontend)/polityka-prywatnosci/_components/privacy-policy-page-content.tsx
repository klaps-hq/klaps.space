"use client";

import React from "react";
import PrivacyPolicySidebar from "./privacy-policy-sidebar";
import GeneralSection from "./sections/general-section";
import AdministratorSection from "./sections/administrator-section";
import DataScopeSection from "./sections/data-scope-section";
import CookiesSection from "./sections/cookies-section";
import ThirdPartySection from "./sections/third-party-section";
import UserRightsSection from "./sections/user-rights-section";
import DataSecuritySection from "./sections/data-security-section";
import ChangesSection from "./sections/changes-section";
import ContactSection from "./sections/contact-section";
import { useActiveSection } from "@/hooks/use-active-section";

const SECTION_IDS = [
  "postanowienia-ogolne",
  "administrator",
  "zakres-danych",
  "pliki-cookies",
  "uslugi-zewnetrzne",
  "prawa-uzytkownikow",
  "bezpieczenstwo",
  "zmiany-polityki",
  "kontakt",
] as const;

const SIDEBAR_LINKS = [
  { id: "postanowienia-ogolne", label: "Ogólne" },
  { id: "administrator", label: "Administrator" },
  { id: "zakres-danych", label: "Zakres danych" },
  { id: "pliki-cookies", label: "Cookies" },
  { id: "uslugi-zewnetrzne", label: "Usługi zewnętrzne" },
  { id: "prawa-uzytkownikow", label: "Prawa" },
  { id: "bezpieczenstwo", label: "Bezpieczeństwo" },
  { id: "zmiany-polityki", label: "Zmiany" },
  { id: "kontakt", label: "Kontakt" },
];

const PrivacyPolicyPageContent: React.FC = () => {
  const activeId = useActiveSection({ sectionIds: SECTION_IDS });

  return (
    <div className="flex gap-16">
      <PrivacyPolicySidebar links={SIDEBAR_LINKS} activeId={activeId} />
      <div className="flex flex-col gap-20 flex-1 min-w-0">
        <GeneralSection />
        <AdministratorSection />
        <DataScopeSection />
        <CookiesSection />
        <ThirdPartySection />
        <UserRightsSection />
        <DataSecuritySection />
        <ChangesSection />
        <ContactSection />
      </div>
    </div>
  );
};

export default PrivacyPolicyPageContent;

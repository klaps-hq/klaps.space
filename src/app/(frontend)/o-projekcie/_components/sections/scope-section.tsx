import React from "react";
import ContentSection from "@/components/common/content-section";
import AboutBorderedList from "../about-bordered-list";

const ScopeSection: React.FC = () => {
  return (
    <ContentSection id="zakres" title="Zakres projektu">
      <p className="text-white/80 font-medium">Klaps obejmuje:</p>

      <AboutBorderedList
        items={[
          <>Repertuar kin studyjnych w&nbsp;całej Polsce</>,
          "Wybrane seanse specjalne organizowane przez kina sieciowe",
          "Klasyczne filmy, retrospektywy, przeglądy tematyczne",
          <>Wznowienia i&nbsp;pojedyncze pokazy archiwalne</>,
          <>Wydarzenia kinowe niezwiązane z&nbsp;bieżącymi premierami</>,
        ]}
      />

      <p className="text-white/80 font-medium mt-4">Czego Klaps nie robi?</p>

      <AboutBorderedList
        items={[
          "Nie śledzi codziennego repertuaru premierowego",
          "Nie promuje masowych hitów kinowych",
          "Nie publikuje recenzji ani ocen filmów",
          "Nie tworzy rankingów popularności",
        ]}
        className="border-neutral-800/50 text-neutral-500"
      />

      <p>
        Granica jest prosta: jeśli film można obejrzeć w&nbsp;każdym
        multipleksie przez najbliższe trzy tygodnie – Klaps się nim nie
        zajmuje. Jeśli wyświetlany jest przez jeden wieczór w&nbsp;trzech kinach
        w&nbsp;Polsce – wtedy właśnie Klaps jest potrzebny.
      </p>
    </ContentSection>
  );
};

export default ScopeSection;

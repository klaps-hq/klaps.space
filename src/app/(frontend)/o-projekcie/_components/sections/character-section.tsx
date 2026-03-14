import React from "react";
import ContentSection from "@/components/common/content-section";
import AboutBorderedList from "../about-bordered-list";

const CharacterSection: React.FC = () => {
  return (
    <ContentSection id="charakter" title="Charakter projektu">
      <p>Klaps jest projektem:</p>

      <AboutBorderedList
        items={[
          <>
            <span className="text-white/80 font-medium">Niekomercyjnym</span>{" "}
            w&nbsp;swojej podstawowej formie
          </>,
          <>
            <span className="text-white/80 font-medium">Redakcyjnym</span>, ale
            nie opiniotwórczym
          </>,
          <>
            <span className="text-white/80 font-medium">Informacyjnym</span>,
            ale nie suchym
          </>,
          <>
            <span className="text-white/80 font-medium">Cyfrowym</span>, ale
            mocno zakorzenionym w&nbsp;doświadczeniu fizycznego kina
          </>,
        ]}
      />

      <p>
        To narzędzie, które ma służyć widzom, a&nbsp;nie ich zatrzymywać na
        stronie.
      </p>
    </ContentSection>
  );
};

export default CharacterSection;

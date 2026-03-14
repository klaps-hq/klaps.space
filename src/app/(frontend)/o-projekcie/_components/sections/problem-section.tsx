import React from "react";
import ContentSection from "@/components/common/content-section";
import AboutBorderedList from "../about-bordered-list";

const ProblemSection: React.FC = () => {
  return (
    <ContentSection id="problem" title="Problem, na który odpowiada projekt">
      <p>
        Współczesny widz filmowy funkcjonuje w&nbsp;środowisku nadmiaru treści.
        Platformy streamingowe oferują tysiące tytułów, a&nbsp;algorytmy
        decydują o&nbsp;tym, co jest promowane i&nbsp;widoczne. W&nbsp;tym samym
        czasie kina – zarówno studyjne, jak i&nbsp;sieciowe – regularnie
        organizują pokazy wartościowych filmów z&nbsp;przeszłości, które
        pozostają praktycznie niewidoczne dla szerokiego grona odbiorców.
      </p>

      <p className="text-white/80 font-medium">
        Informacje o&nbsp;takich seansach są:
      </p>

      <AboutBorderedList
        items={[
          "Rozproszone po stronach poszczególnych kin",
          "Publikowane w mało czytelnych repertuarach",
          <>
            Dostępne głównie dla osób, które już aktywnie śledzą konkretne
            miejsca
          </>,
        ]}
      />

      <p>
        W&nbsp;efekcie wiele wartościowych pokazów odbywa się przy ograniczonej
        frekwencji, a&nbsp;potencjalni widzowie dowiadują się o&nbsp;nich
        dopiero po fakcie – jeśli w&nbsp;ogóle.
      </p>

      <p>
        Klaps powstaje jako odpowiedź na ten problem. Jego zadaniem jest
        zebranie rozproszonych informacji w&nbsp;jednym miejscu i&nbsp;podanie
        ich w&nbsp;formie czytelnej, uporządkowanej i&nbsp;pozbawionej nadmiaru
        bodźców.
      </p>
    </ContentSection>
  );
};

export default ProblemSection;

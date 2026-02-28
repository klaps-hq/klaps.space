import React from "react";
import ContentSection from "@/components/common/content-section";

const CompatibilitySection: React.FC = () => {
  return (
    <ContentSection id="kompatybilnosc" title="Kompatybilność">
      <p>
        Serwis jest responsywny i&nbsp;dostosowuje się do różnych rozmiarów
        ekranów, od urządzeń mobilnych po monitory stacjonarne.
      </p>

      <p>
        Klaps jest testowany i&nbsp;wspierany w&nbsp;najnowszych wersjach
        popularnych przeglądarek: Chrome, Firefox, Safari oraz Edge.
      </p>

      <p>
        Serwis umożliwia nawigację za pomocą klawiatury. Elementy interaktywne,
        takie jak odnośniki i&nbsp;przyciski, są dostępne przy użyciu klawisza
        Tab oraz Enter.
      </p>
    </ContentSection>
  );
};

export default CompatibilitySection;

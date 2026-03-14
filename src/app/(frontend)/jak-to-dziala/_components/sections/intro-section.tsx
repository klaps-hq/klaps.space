import React from "react";
import ContentSection from "@/components/common/content-section";

const IntroSection: React.FC = () => {
  return (
    <ContentSection id="wprowadzenie" title="Na czym to polega?">
      <p>
        Klaps działa w&nbsp;prosty sposób: zbieramy informacje o&nbsp;seansach
        z&nbsp;kin studyjnych i&nbsp;wybranych kin sieciowych w&nbsp;całej
        Polsce, filtrujemy je pod kątem pokazów specjalnych, klasyki
        i&nbsp;retrospektyw, a&nbsp;następnie prezentujemy w&nbsp;jednym,
        czytelnym miejscu.
      </p>

      <p>
        Cały proces można opisać w&nbsp;trzech krokach: pozyskanie danych,
        filtrowanie repertuaru i&nbsp;udostępnienie go użytkownikom. Poniżej
        opisujemy każdy z&nbsp;tych etapów, a&nbsp;także sposób korzystania
        z&nbsp;serwisu i&nbsp;jego ograniczenia.
      </p>
    </ContentSection>
  );
};

export default IntroSection;

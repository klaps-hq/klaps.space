import React from "react";
import ContentSection from "@/components/common/content-section";

const FilteringSection: React.FC = () => {
  return (
    <ContentSection id="filtrowanie" title="Co filtrujemy?">
      <p>
        Nie pokazujemy pełnego repertuaru kinowego. Klaps koncentruje się na
        seansach, które wyróżniają się na tle bieżących premier: pokazach
        specjalnych, klasyce filmowej, retrospektywach reżyserskich,
        wznowieniach i&nbsp;wydarzeniach jednorazowych.
      </p>

      <p>
        To repertuar, który często ginie wśród masowych tytułów
        i&nbsp;blockbusterów. Pojedynczy pokaz filmu z&nbsp;lat 70. w&nbsp;małym
        kinie studyjnym jest dokładnie tym, co Klaps stara się wyłapać
        i&nbsp;pokazać.
      </p>

      <p>
        Filtrowanie odbywa się na podstawie typu seansu, kategorii filmu
        i&nbsp;charakteru wydarzenia. Nie stosujemy algorytmów rekomendacyjnych.
        Pokazujemy wszystko, co spełnia nasze kryteria, bez subiektywnego
        rankingu.
      </p>
    </ContentSection>
  );
};

export default FilteringSection;

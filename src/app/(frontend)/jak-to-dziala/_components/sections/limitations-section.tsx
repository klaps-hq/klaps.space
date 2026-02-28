import React from "react";
import ContentSection from "@/components/common/content-section";

const LimitationsSection: React.FC = () => {
  return (
    <ContentSection id="ograniczenia" title="Czego nie robimy?">
      <p>
        Klaps nie jest portalem filmowym w&nbsp;tradycyjnym tego słowa
        znaczeniu. Nie publikujemy recenzji, nie tworzymy rankingów, nie
        przyznajemy ocen i&nbsp;nie prowadzimy rekomendacji opartych
        o&nbsp;algorytmy.
      </p>

      <p>
        Nie sprzedajemy biletów ani nie pośredniczymy w&nbsp;rezerwacjach.
        Serwis pełni rolę informatora. Pokazujemy gdzie i&nbsp;kiedy odbywa się
        dany seans, a&nbsp;zakup biletu odbywa się bezpośrednio na stronie kina.
      </p>

      <p>
        Nie obejmujemy też pełnego repertuaru wszystkich kin w&nbsp;Polsce.
        Skupiamy się na seansach specjalnych i&nbsp;klasyce, pomijając bieżące
        premiery komercyjne. Nasza baza kin jest w&nbsp;ciągłym rozwoju
        i&nbsp;z&nbsp;czasem obejmie coraz więcej miejsc.
      </p>
    </ContentSection>
  );
};

export default LimitationsSection;

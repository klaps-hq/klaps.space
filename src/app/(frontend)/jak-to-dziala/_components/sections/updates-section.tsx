import React from "react";
import ContentSection from "@/components/common/content-section";

const UpdatesSection: React.FC = () => {
  return (
    <ContentSection id="aktualizacje" title="Jak często aktualizujemy dane?">
      <p>
        Repertuar jest aktualizowany regularnie, tak aby informacje prezentowane
        w&nbsp;serwisie były jak najbardziej zbliżone do rzeczywistego stanu.
        Częstotliwość aktualizacji zależy od źródła. Niektóre kina publikują
        repertuar z&nbsp;wyprzedzeniem tygodniowym, inne dziennym.
      </p>

      <p>
        Mimo regularnych aktualizacji mogą zdarzyć się rozbieżności między
        danymi w&nbsp;Klapsie a&nbsp;aktualnym repertuarem kina. Zawsze
        rekomendujemy sprawdzenie szczegółów seansu bezpośrednio na stronie kina
        przed wizytą.
      </p>
    </ContentSection>
  );
};

export default UpdatesSection;

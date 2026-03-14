import React from "react";
import ContentSection from "@/components/common/content-section";

const CookiesSection: React.FC = () => {
  return (
    <ContentSection id="pliki-cookies" title="Pliki cookies">
      <p>
        Serwis Klaps może wykorzystywać pliki cookies (ciasteczka), czyli
        niewielkie pliki tekstowe zapisywane na urządzeniu użytkownika.
      </p>

      <p>
        Pliki cookies wykorzystywane w&nbsp;serwisie mają charakter techniczny
        i&nbsp;służą do zapamiętywania preferencji użytkownika, takich jak
        wybrane miasto. Nie są wykorzystywane do śledzenia aktywności
        użytkowników w&nbsp;celach reklamowych.
      </p>

      <p>
        Użytkownik może w&nbsp;każdej chwili zmienić ustawienia dotyczące plików
        cookies w&nbsp;swojej przeglądarce, w&nbsp;tym zablokować ich
        zapisywanie lub usunąć już zapisane pliki. Ograniczenie stosowania plików
        cookies może wpłynąć na niektóre funkcjonalności serwisu.
      </p>
    </ContentSection>
  );
};

export default CookiesSection;

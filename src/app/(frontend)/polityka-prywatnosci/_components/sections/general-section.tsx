import React from "react";
import ContentSection from "@/components/common/content-section";
import { SITE_DOMAIN } from "@/constants";

const GeneralSection: React.FC = () => {
  return (
    <ContentSection id="postanowienia-ogolne" title="Postanowienia ogólne">
      <p>
        Niniejsza polityka prywatności określa zasady przetwarzania danych
        osobowych oraz wykorzystywania plików cookies w&nbsp;serwisie Klaps,
        dostępnym pod adresem {SITE_DOMAIN}.
      </p>

      <p>
        Serwis Klaps jest projektem niezależnym, prowadzonym niekomercyjnie.
        Ochrona prywatności użytkowników jest dla nas priorytetem. Dokładamy
        wszelkich starań, aby przetwarzanie danych odbywało się zgodnie
        z&nbsp;obowiązującymi przepisami, w&nbsp;tym z&nbsp;Rozporządzeniem
        Parlamentu Europejskiego i&nbsp;Rady (UE) 2016/679 (RODO).
      </p>

      <p>
        Korzystanie z&nbsp;serwisu jest bezpłatne i&nbsp;nie wymaga rejestracji
        ani podawania danych osobowych.
      </p>
    </ContentSection>
  );
};

export default GeneralSection;

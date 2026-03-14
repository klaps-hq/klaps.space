import React from "react";
import ContentSection from "@/components/common/content-section";

const DataDisclaimerSection: React.FC = () => {
  return (
    <ContentSection id="dane-i-zrodla" title="Dane i źródła">
      <p>
        Informacje prezentowane w&nbsp;serwisie pochodzą z&nbsp;publicznie
        dostępnych źródeł, w&nbsp;szczególności ze stron internetowych kin.
        Serwis nie jest oficjalnym źródłem repertuaru żadnego kina.
      </p>

      <p>
        Dane w&nbsp;serwisie mogą różnić się od aktualnego stanu repertuaru
        danego kina. Przed wizytą w&nbsp;kinie zalecamy sprawdzenie informacji
        bezpośrednio na stronie internetowej kina.
      </p>

      <p>
        Serwis nie ponosi odpowiedzialności za aktualność, kompletność ani
        dokładność prezentowanych danych. Informacje mają charakter wyłącznie
        poglądowy i&nbsp;informacyjny.
      </p>
    </ContentSection>
  );
};

export default DataDisclaimerSection;

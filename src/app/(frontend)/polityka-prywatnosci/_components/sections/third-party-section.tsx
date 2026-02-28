import React from "react";
import ContentSection from "@/components/common/content-section";

const ThirdPartySection: React.FC = () => {
  return (
    <ContentSection id="uslugi-zewnetrzne" title="Usługi zewnętrzne">
      <p>
        Serwis może korzystać z&nbsp;usług zewnętrznych dostawców w&nbsp;celu
        zapewnienia prawidłowego działania, analizy ruchu lub wyświetlania
        treści. W&nbsp;szczególności serwis może wykorzystywać usługi
        hostingowe, usługi dostarczania map oraz narzędzia analityczne.
      </p>

      <p>
        Zewnętrzni dostawcy mogą przetwarzać dane techniczne użytkowników (np.
        adres IP) zgodnie z&nbsp;własnymi politykami prywatności.
        Rekomendujemy zapoznanie się z&nbsp;politykami prywatności tych usług.
      </p>

      <p>
        Serwis zawiera odnośniki do stron internetowych kin i&nbsp;serwisów
        biletowych. Kliknięcie w&nbsp;taki odnośnik powoduje przejście do
        serwisu zewnętrznego, którego zasady przetwarzania danych mogą się różnić
        od niniejszej polityki prywatności.
      </p>
    </ContentSection>
  );
};

export default ThirdPartySection;

import React from "react";
import ContentSection from "@/components/common/content-section";

const ChangesSection: React.FC = () => {
  return (
    <ContentSection id="zmiany-polityki" title="Zmiany polityki prywatności">
      <p>
        Zastrzegamy sobie prawo do wprowadzania zmian w&nbsp;niniejszej polityce
        prywatności. Zmiany mogą wynikać ze zmian w&nbsp;przepisach prawa,
        rozwoju funkcjonalności serwisu lub zmiany stosowanych technologii.
      </p>

      <p>
        Aktualna wersja polityki prywatności jest zawsze dostępna na tej stronie.
        Zalecamy regularne zapoznawanie się z&nbsp;jej treścią.
      </p>
    </ContentSection>
  );
};

export default ChangesSection;

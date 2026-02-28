import React from "react";
import ContentSection from "@/components/common/content-section";

const StandardsSection: React.FC = () => {
  return (
    <ContentSection id="standardy" title="Standardy">
      <p>
        Serwis jest projektowany z&nbsp;uwzględnieniem wytycznych WCAG 2.1
        na&nbsp;poziomie AA. Staramy się, aby struktura stron, kontrast kolorów
        oraz nawigacja spełniały wymagania tych wytycznych.
      </p>

      <p>
        Stosujemy semantyczny HTML, logiczną hierarchię nagłówków
        oraz&nbsp;odpowiednie oznaczenia elementów interaktywnych, aby ułatwić
        korzystanie z&nbsp;serwisu przy użyciu technologii asystujących.
      </p>
    </ContentSection>
  );
};

export default StandardsSection;

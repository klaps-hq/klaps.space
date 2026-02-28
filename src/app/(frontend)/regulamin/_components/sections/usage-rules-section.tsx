import React from "react";
import ContentSection from "@/components/common/content-section";

const UsageRulesSection: React.FC = () => {
  return (
    <ContentSection id="zasady-korzystania" title="Zasady korzystania">
      <p>
        Użytkownik może korzystać z&nbsp;serwisu wyłącznie w&nbsp;sposób zgodny
        z&nbsp;jego przeznaczeniem, to znaczy w&nbsp;celu przeglądania
        informacji o&nbsp;seansach filmowych i&nbsp;kinach.
      </p>

      <p>
        Zabronione jest wykorzystywanie serwisu w&nbsp;sposób naruszający
        obowiązujące przepisy prawa, prawa osób trzecich lub dobre obyczaje.
        W&nbsp;szczególności zabronione jest automatyczne pobieranie danych
        z&nbsp;serwisu (scraping) bez uprzedniej zgody.
      </p>

      <p>
        Serwis nie wymaga zakładania konta ani podawania danych osobowych.
        Użytkownik korzysta z&nbsp;serwisu anonimowo.
      </p>
    </ContentSection>
  );
};

export default UsageRulesSection;

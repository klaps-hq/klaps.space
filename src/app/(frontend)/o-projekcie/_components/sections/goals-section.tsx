import React from "react";
import ContentSection from "@/components/common/content-section";
import AboutBorderedList from "../about-bordered-list";
import AboutDetailItem from "../about-detail-item";

const GoalsSection: React.FC = () => {
  return (
    <ContentSection id="cele" title="Cele projektu">
      <p className="text-white/80 font-medium">Cele krótkoterminowe:</p>

      <AboutBorderedList
        gap="loose"
        items={[
          <AboutDetailItem
            key="central"
            title="Centralny punkt repertuarowy"
            description="Stworzenie jednego miejsca z repertuarem seansów klasycznych i specjalnych."
          />,
          <AboutDetailItem
            key="search"
            title="Łatwe wyszukiwanie"
            description="Ułatwienie wyszukiwania seansów według miasta, daty i filmu."
          />,
          <AboutDetailItem
            key="visibility"
            title="Widoczność pokazów"
            description="Zwiększenie widoczności pokazów, które obecnie są trudne do znalezienia."
          />,
          <AboutDetailItem
            key="encourage"
            title="Zachęta do kina"
            description="Zachęcenie widzów do częstszych wizyt w kinach."
          />,
        ]}
      />

      <p className="text-white/80 font-medium mt-4">Cele długoterminowe:</p>

      <AboutBorderedList
        gap="loose"
        items={[
          <AboutDetailItem
            key="habit"
            title="Budowanie nawyku"
            description="Regularne sprawdzanie repertuaru kinowego jako codzienna praktyka."
          />,
          <AboutDetailItem
            key="attendance"
            title="Frekwencja"
            description="Zwiększenie frekwencji na seansach klasycznych i archiwalnych."
          />,
          <AboutDetailItem
            key="position"
            title="Pozycja kin studyjnych"
            description="Wzmocnienie pozycji kin studyjnych jako ważnych instytucji kultury."
          />,
          <AboutDetailItem
            key="archive"
            title="Archiwum pokazów"
            description="Stworzenie archiwum historycznych pokazów kinowych w Polsce."
          />,
          <AboutDetailItem
            key="development"
            title="Rozwój projektu"
            description="Rozwój Klapsa jako niezależnego narzędzia wspierającego kulturę filmową."
          />,
        ]}
      />
    </ContentSection>
  );
};

export default GoalsSection;

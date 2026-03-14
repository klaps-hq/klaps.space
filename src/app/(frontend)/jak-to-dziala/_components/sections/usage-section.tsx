import React from "react";
import ContentSection from "@/components/common/content-section";

const UsageSection: React.FC = () => {
  return (
    <ContentSection id="korzystanie" title="Jak korzystać z serwisu?">
      <p>
        Na stronie głównej znajdziesz listę aktualnych seansów. Możesz filtrować
        je według miasta, gatunku filmowego lub zakresu dat. Wystarczy wybrać
        interesujące Cię parametry, a&nbsp;lista automatycznie się zaktualizuje.
      </p>

      <p>
        Każdy seans prowadzi do strony filmu, gdzie znajdziesz podstawowe
        informacje: tytuł, rok produkcji, gatunek i&nbsp;opis. Z&nbsp;kolei
        strony kin prezentują ich lokalizację oraz aktualny repertuar.
      </p>

      <p>
        Serwis nie wymaga rejestracji ani logowania. Wszystkie informacje są
        dostępne bezpłatnie i&nbsp;bez ograniczeń. Klaps działa jako
        przeglądarka repertuarowa. Wchodzisz, sprawdzasz co grają
        i&nbsp;wybierasz seans.
      </p>
    </ContentSection>
  );
};

export default UsageSection;

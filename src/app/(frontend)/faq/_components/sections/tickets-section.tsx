import React from "react";
import ContentSection from "@/components/common/content-section";
import FaqItem from "../faq-item";

const TicketsSection: React.FC = () => {
  return (
    <ContentSection id="bilety" title="Bilety">
      <FaqItem question="Czy mogę kupić bilety przez Klaps?">
        <p>
          Nie. Klaps nie pośredniczy w&nbsp;sprzedaży biletów ani rezerwacji
          miejsc. Serwis wyłącznie agreguje i&nbsp;prezentuje informacje
          o&nbsp;seansach.
        </p>
      </FaqItem>

      <FaqItem question="Jak mogę kupić bilet na seans?">
        <p>
          Klaps nie umożliwia zakupu biletów. Aby kupić bilet, sprawdź
          szczegóły seansu bezpośrednio na stronie danego kina. Zakup odbywa
          się wyłącznie między Tobą a&nbsp;kinem.
        </p>
      </FaqItem>

      <FaqItem question="Czy ceny biletów podane w serwisie są aktualne?">
        <p>
          Serwis Klaps nie prezentuje cen biletów. Informacje o&nbsp;cenach
          dostępne są bezpośrednio na stronach poszczególnych kin.
        </p>
      </FaqItem>
    </ContentSection>
  );
};

export default TicketsSection;

import React from "react";
import ContentSection from "@/components/common/content-section";
import FaqItem from "../faq-item";

const ScreeningsSection: React.FC = () => {
  return (
    <ContentSection id="seanse-i-repertuar" title="Seanse i repertuar">
      <FaqItem question="Skąd pochodzą informacje o seansach?">
        <p>
          Informacje o&nbsp;seansach są pozyskiwane automatycznie
          z&nbsp;publicznie dostępnych źródeł kin. Dane są regularnie
          aktualizowane, aby zapewnić jak największą dokładność.
        </p>
      </FaqItem>

      <FaqItem question="Jak często aktualizowany jest repertuar?">
        <p>
          Repertuar jest aktualizowany regularnie, mniej więcej raz
          w&nbsp;tygodniu. Częstotliwość zależy od tego, kiedy poszczególne kina
          publikują swoje repertuary.
        </p>
      </FaqItem>

      <FaqItem question="Czy wszystkie seanse w serwisie to seanse specjalne?">
        <p>
          Tak. Klaps koncentruje się wyłącznie na seansach specjalnych, takich
          jak pokazy klasyki filmowej, retrospektywy, pokazy z&nbsp;cykli
          tematycznych oraz inne wyjątkowe wydarzenia kinowe. Nie prezentujemy
          standardowego repertuaru komercyjnego.
        </p>
      </FaqItem>

      <FaqItem question="Co zrobić, jeśli informacje o seansie są nieaktualne?">
        <p>
          Zawsze rekomendujemy weryfikację szczegółów seansu (data, godzina,
          cena) bezpośrednio na stronie kina. Jeśli zauważysz błąd, możesz
          skontaktować się z&nbsp;nami przez stronę kontaktową.
        </p>
      </FaqItem>

      <FaqItem question="Czy mogę filtrować seanse według gatunku lub daty?">
        <p>
          Tak. Serwis umożliwia filtrowanie seansów po mieście, kinie, gatunku
          filmowym oraz dacie. Filtry są dostępne na stronie seansów.
        </p>
      </FaqItem>
    </ContentSection>
  );
};

export default ScreeningsSection;

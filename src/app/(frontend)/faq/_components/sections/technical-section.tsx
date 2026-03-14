import React from "react";
import ContentSection from "@/components/common/content-section";
import FaqItem from "../faq-item";
import { CONTACT_EMAIL } from "@/constants";

const TechnicalSection: React.FC = () => {
  return (
    <ContentSection id="kwestie-techniczne" title="Kwestie techniczne">
      <FaqItem question="Jak zmienić wybrane miasto?">
        <p>
          Miasto możesz zmienić w&nbsp;każdej chwili, korzystając z&nbsp;listy
          rozwijanej w&nbsp;nagłówku strony. Twój wybór zostanie zapamiętany
          w&nbsp;przeglądarce, dzięki czemu przy kolejnej wizycie serwis
          automatycznie wyświetli seanse z&nbsp;Twojego miasta.
        </p>
      </FaqItem>

      <FaqItem question="Czy serwis działa na urządzeniach mobilnych?">
        <p>
          Tak. Serwis jest w&nbsp;pełni responsywny i&nbsp;dostosowany do
          korzystania na telefonach, tabletach oraz komputerach.
        </p>
      </FaqItem>

      <FaqItem question="Dlaczego strona nie wyświetla się poprawnie?">
        <p>
          Upewnij się, że korzystasz z&nbsp;aktualnej wersji przeglądarki.
          Serwis działa najlepiej w&nbsp;przeglądarkach Chrome, Firefox, Safari
          i&nbsp;Edge. Jeśli problem nadal występuje, skontaktuj się z&nbsp;nami
          pod adresem{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-blood-red hover:text-white transition-colors duration-300"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </FaqItem>

      <FaqItem question="Czy mogę zaproponować nową funkcję?">
        <p>
          Oczywiście. Chętnie wysłuchamy Twoich sugestii. Skontaktuj się
          z&nbsp;nami przez stronę kontaktową lub bezpośrednio na adres{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-blood-red hover:text-white transition-colors duration-300"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </FaqItem>
    </ContentSection>
  );
};

export default TechnicalSection;

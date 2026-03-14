import React from "react";
import ContentSection from "@/components/common/content-section";
import { CONTACT_EMAIL } from "@/constants";

const ContactSection: React.FC = () => {
  return (
    <ContentSection id="kontakt" title="Kontakt">
      <p>
        W&nbsp;przypadku jakichkolwiek pytań dotyczących niniejszej polityki
        prywatności lub przetwarzania danych w&nbsp;serwisie Klaps, prosimy
        o&nbsp;kontakt pod adresem e-mail:{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-blood-red hover:text-white transition-colors duration-300"
        >
          {CONTACT_EMAIL}
        </a>
        .
      </p>

      <p>
        Dołożymy wszelkich starań, aby odpowiedzieć na Twoje zapytanie
        w&nbsp;możliwie najkrótszym czasie.
      </p>
    </ContentSection>
  );
};

export default ContactSection;

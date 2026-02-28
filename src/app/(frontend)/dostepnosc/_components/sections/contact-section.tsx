import React from "react";
import ContentSection from "@/components/common/content-section";
import { CONTACT_EMAIL } from "@/constants";

const ContactSection: React.FC = () => {
  return (
    <ContentSection id="kontakt" title="Kontakt w sprawie dostępności">
      <p>
        Jeśli napotkasz barierę dostępności lub masz sugestie dotyczące
        usprawnienia serwisu, prosimy o&nbsp;kontakt pod adresem{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-blood-red hover:text-white transition-colors duration-200 underline underline-offset-4"
        >
          {CONTACT_EMAIL}
        </a>
        .
      </p>

      <p>
        Każde zgłoszenie jest dla nas cenne i&nbsp;pomoże nam uczynić Klaps
        bardziej dostępną dla wszystkich.
      </p>
    </ContentSection>
  );
};

export default ContactSection;

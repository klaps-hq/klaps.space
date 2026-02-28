import React from "react";
import ContentSection from "@/components/common/content-section";
import { CONTACT_EMAIL } from "@/constants";

const AdministratorSection: React.FC = () => {
  return (
    <ContentSection id="administrator" title="Administrator danych">
      <p>
        Administratorem danych przetwarzanych w&nbsp;związku z&nbsp;korzystaniem
        z&nbsp;serwisu Klaps jest twórca serwisu.
      </p>

      <p>
        W&nbsp;sprawach dotyczących ochrony danych osobowych możesz skontaktować
        się z&nbsp;nami pod adresem e-mail:{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-blood-red hover:text-white transition-colors duration-300"
        >
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </ContentSection>
  );
};

export default AdministratorSection;

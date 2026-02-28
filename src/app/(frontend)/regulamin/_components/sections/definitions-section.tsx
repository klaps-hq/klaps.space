import React from "react";
import ContentSection from "@/components/common/content-section";
import { SITE_DOMAIN } from "@/constants";

const DefinitionsSection: React.FC = () => {
  return (
    <ContentSection id="definicje" title="Definicje">
      <p>
        <span className="text-white/80 font-medium">Serwis</span> oznacza stronę
        internetową Klaps dostępną pod adresem {SITE_DOMAIN} wraz ze wszystkimi
        jej podstronami.
      </p>

      <p>
        <span className="text-white/80 font-medium">Użytkownik</span> oznacza
        każdą osobę korzystającą z&nbsp;serwisu, niezależnie od sposobu
        i&nbsp;zakresu korzystania.
      </p>

      <p>
        <span className="text-white/80 font-medium">Repertuar</span> oznacza
        informacje o&nbsp;seansach filmowych prezentowane w&nbsp;serwisie,
        pozyskiwane z&nbsp;publicznie dostępnych źródeł.
      </p>

      <p>
        <span className="text-white/80 font-medium">Kino</span> oznacza obiekt
        kinowy, którego repertuar jest prezentowany w&nbsp;serwisie.
      </p>
    </ContentSection>
  );
};

export default DefinitionsSection;

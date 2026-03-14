import React from "react";
import ContentSection from "@/components/common/content-section";
import { SITE_DOMAIN } from "@/constants";

const GeneralSection: React.FC = () => {
  return (
    <ContentSection id="postanowienia-ogolne" title="Postanowienia ogólne">
      <p>
        Niniejszy regulamin określa zasady korzystania z&nbsp;serwisu
        internetowego Klaps, dostępnego pod adresem {SITE_DOMAIN}.
      </p>

      <p>
        Serwis Klaps jest projektem niezależnym, prowadzonym niekomercyjnie.
        Jego celem jest agregowanie i&nbsp;udostępnianie informacji
        o&nbsp;seansach specjalnych, klasyce filmowej oraz retrospektywach
        organizowanych przez kina studyjne i&nbsp;wybrane kina sieciowe
        w&nbsp;Polsce.
      </p>

      <p>
        Korzystanie z&nbsp;serwisu jest bezpłatne i&nbsp;nie wymaga rejestracji.
        Korzystając z&nbsp;serwisu, użytkownik akceptuje postanowienia
        niniejszego regulaminu.
      </p>
    </ContentSection>
  );
};

export default GeneralSection;

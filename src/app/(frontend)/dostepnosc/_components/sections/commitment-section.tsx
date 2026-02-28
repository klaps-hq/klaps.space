import React from "react";
import ContentSection from "@/components/common/content-section";
import { SITE_DOMAIN } from "@/constants";

const CommitmentSection: React.FC = () => {
  return (
    <ContentSection id="zobowiazanie" title="Nasze zobowiązanie">
      <p>
        Serwis Klaps, dostępny pod adresem {SITE_DOMAIN}, jest projektem
        niezależnym, którego celem jest udostępnianie informacji o&nbsp;seansach
        specjalnych i&nbsp;klasyce filmowej w&nbsp;kinach studyjnych w&nbsp;Polsce.
      </p>

      <p>
        Dokładamy starań, aby serwis był dostępny dla jak najszerszego grona
        odbiorców, niezależnie od używanego urządzenia, oprogramowania
        czy&nbsp;indywidualnych potrzeb użytkownika.
      </p>
    </ContentSection>
  );
};

export default CommitmentSection;

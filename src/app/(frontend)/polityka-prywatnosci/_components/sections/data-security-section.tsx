import React from "react";
import ContentSection from "@/components/common/content-section";

const DataSecuritySection: React.FC = () => {
  return (
    <ContentSection id="bezpieczenstwo" title="Bezpieczeństwo danych">
      <p>
        Dokładamy wszelkich starań, aby zapewnić bezpieczeństwo danych
        przetwarzanych w&nbsp;związku z&nbsp;działaniem serwisu. Stosujemy
        odpowiednie środki techniczne i&nbsp;organizacyjne, w&nbsp;tym
        szyfrowanie połączenia (SSL/TLS).
      </p>

      <p>
        Pomimo stosowania odpowiednich zabezpieczeń, należy pamiętać, że żadna
        metoda przesyłania danych przez internet ani metoda elektronicznego
        przechowywania nie jest w&nbsp;pełni bezpieczna. Nie możemy zagwarantować
        absolutnego bezpieczeństwa danych.
      </p>
    </ContentSection>
  );
};

export default DataSecuritySection;

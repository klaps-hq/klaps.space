import React from "react";
import ContentSection from "@/components/common/content-section";
import Link from "next/link";

const DataSourcesSection: React.FC = () => {
  return (
    <ContentSection id="zrodla-danych" title="Skąd bierzemy dane?">
      <p>
        Repertuar pozyskujemy z&nbsp;publicznie dostępnych źródeł kin, które
        regularnie organizują pokazy specjalne, retrospektywy lub wznowienia
        klasyków.
      </p>

      <p>
        Nie korzystamy z&nbsp;zamkniętych baz danych ani komercyjnych API.
        Wszystkie informacje, które prezentujemy, są dostępne publicznie na
        stronach poszczególnych kin. Klaps jedynie zbiera je w&nbsp;jednym
        miejscu i&nbsp;prezentuje w&nbsp;ujednoliconej formie.
      </p>

      <p>
        Lista obsługiwanych kin jest stale rozwijana. Jeśli znasz kino, które
        powinno się znaleźć w&nbsp;serwisie, zachęcamy do{" "}
        <Link href="/kontakt" className="text-blood-red hover:underline">
          kontaktu
        </Link>
        .
      </p>
    </ContentSection>
  );
};

export default DataSourcesSection;

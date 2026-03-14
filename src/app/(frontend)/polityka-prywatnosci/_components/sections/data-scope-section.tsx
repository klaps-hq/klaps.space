import React from "react";
import ContentSection from "@/components/common/content-section";

const DataScopeSection: React.FC = () => {
  return (
    <ContentSection id="zakres-danych" title="Zakres przetwarzanych danych">
      <p>
        Serwis Klaps nie wymaga rejestracji, logowania ani podawania
        jakichkolwiek danych osobowych. Nie zbieramy imion, nazwisk, adresów
        e-mail ani innych danych identyfikujących użytkowników.
      </p>

      <p>
        W&nbsp;ramach korzystania z&nbsp;serwisu mogą być automatycznie
        przetwarzane dane techniczne, takie jak adres IP, typ przeglądarki,
        system operacyjny, rozdzielczość ekranu oraz informacje
        o&nbsp;odwiedzanych podstronach. Dane te służą wyłącznie do zapewnienia
        prawidłowego działania serwisu oraz celów statystycznych.
      </p>

      <p>
        Serwis przechowuje w&nbsp;pamięci przeglądarki (localStorage) informację
        o&nbsp;wybranym przez użytkownika mieście. Dane te nie są przesyłane na
        serwer i&nbsp;służą wyłącznie do personalizacji wyświetlanych treści.
      </p>
    </ContentSection>
  );
};

export default DataScopeSection;

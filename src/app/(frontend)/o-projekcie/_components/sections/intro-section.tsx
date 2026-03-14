import React from "react";
import ContentSection from "@/components/common/content-section";

const IntroSection: React.FC = () => {
  return (
    <ContentSection id="czym-jest" title="Czym jest Klaps?">
      <p>
        Klaps to niezależny, ogólnopolski przewodnik po repertuarze kinowym,
        skupiony na seansach specjalnych, klasyce oraz filmach spoza bieżącego,
        komercyjnego obiegu. Projekt zbiera informacje o&nbsp;pokazach
        organizowanych zarówno przez kina studyjne, jak i&nbsp;wybrane kina
        sieciowe – wszędzie tam, gdzie stare filmy, retrospektywy
        i&nbsp;wznowienia wracają na duży ekran.
      </p>

      <p>
        Celem Klapsa nie jest konkurowanie z&nbsp;dużymi portalami filmowymi ani
        tworzenie kolejnej bazy danych filmów. Projekt nie oferuje recenzji,
        rankingów ani rekomendacji opartych o&nbsp;algorytmy. Zamiast tego
        Klaps pełni rolę jednego, spójnego miejsca, w&nbsp;którym można
        sprawdzić, co faktycznie warto zobaczyć w&nbsp;kinie – tu i&nbsp;teraz –
        w&nbsp;różnych miastach w&nbsp;Polsce.
      </p>

      <p>
        Klaps koncentruje się na seansach, które łatwo przegapić: pojedynczych
        pokazach, krótkich przeglądach, retrospektywach reżyserskich,
        wznowieniach klasyków oraz wydarzeniach specjalnych. To repertuar, który
        często ginie wśród premier i&nbsp;masowych tytułów.
      </p>
    </ContentSection>
  );
};

export default IntroSection;

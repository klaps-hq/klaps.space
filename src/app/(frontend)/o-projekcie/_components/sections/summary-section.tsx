import React from "react";
import ContentSection from "@/components/common/content-section";

const SummarySection: React.FC = () => {
  return (
    <ContentSection id="podsumowanie" title="Podsumowanie">
      <p>
        Klaps to projekt, który wyrasta z&nbsp;prostej obserwacji: wartościowe
        seanse kinowe odbywają się każdego dnia, ale informacja o&nbsp;nich jest
        rozproszona, trudno dostępna i&nbsp;łatwa do przeoczenia.
      </p>

      <p>
        Projekt nie aspiruje do bycia kolejnym portalem filmowym. Nie ocenia,
        nie rankinguje, nie podpowiada algorytmicznie. Zamiast tego zbiera
        w&nbsp;jednym miejscu to, co naprawdę się dzieje na ekranach kin
        w&nbsp;Polsce i&nbsp;podaje to w&nbsp;formie, która szanuje czas
        i&nbsp;uwagę widza.
      </p>

      <p>
        Jeśli kiedykolwiek żałowałeś, że dowiedziałeś się o&nbsp;pokazie
        ulubionego filmu dzień po seansie, Klaps jest właśnie dla Ciebie.
      </p>
    </ContentSection>
  );
};

export default SummarySection;

import React from "react";
import ContentSection from "@/components/common/content-section";

const LiabilitySection: React.FC = () => {
  return (
    <ContentSection id="odpowiedzialnosc" title="Odpowiedzialność">
      <p>
        Serwis jest udostępniany w&nbsp;stanie, w&nbsp;jakim się znajduje (as
        is), bez jakichkolwiek gwarancji, wyraźnych lub dorozumianych.
      </p>

      <p>
        Twórcy serwisu nie ponoszą odpowiedzialności za szkody wynikające
        z&nbsp;korzystania z&nbsp;serwisu lub niemożności korzystania
        z&nbsp;niego, w&nbsp;tym za decyzje podjęte na podstawie informacji
        prezentowanych w&nbsp;serwisie.
      </p>

      <p>
        Serwis nie pośredniczy w&nbsp;sprzedaży biletów ani rezerwacji miejsc.
        Wszelkie transakcje związane z&nbsp;zakupem biletów odbywają się
        bezpośrednio między użytkownikiem a&nbsp;kinem.
      </p>
    </ContentSection>
  );
};

export default LiabilitySection;

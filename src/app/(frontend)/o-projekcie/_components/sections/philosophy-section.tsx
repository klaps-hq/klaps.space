import React from "react";
import ContentSection from "@/components/common/content-section";
import AboutBorderedList from "../about-bordered-list";

const PhilosophySection: React.FC = () => {
  return (
    <ContentSection id="filozofia" title="Filozofia projektu">
      <p>Klaps opiera się na kilku prostych zasadach:</p>

      <AboutBorderedList
        items={[
          <>
            <span className="text-white/80 font-medium">Brak algorytmów</span> –
            brak personalizowanych rekomendacji
          </>,
          <>
            <span className="text-white/80 font-medium">Brak reklam</span> –
            treści nie są promowane komercyjnie
          </>,
          <>
            <span className="text-white/80 font-medium">Brak rankingów</span> –
            filmy nie są wartościowane liczbami
          </>,
          <>
            <span className="text-white/80 font-medium">
              Czytelność ponad wszystko
            </span>{" "}
            – interfejs ma pomagać, nie rozpraszać
          </>,
          <>
            <span className="text-white/80 font-medium">Inkluzywność</span> –
            projekt nie dzieli kin na &quot;lepsze&quot; i&nbsp;&quot;gorsze&quot;
          </>,
        ]}
      />

      <p>
        Celem nie jest edukowanie widza ani narzucanie gustu, lecz umożliwienie
        świadomego wyboru.
      </p>
    </ContentSection>
  );
};

export default PhilosophySection;

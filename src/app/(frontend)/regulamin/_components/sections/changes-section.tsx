import React from "react";
import ContentSection from "@/components/common/content-section";

const ChangesSection: React.FC = () => {
  return (
    <ContentSection id="zmiany-regulaminu" title="Zmiany regulaminu">
      <p>
        Twórcy serwisu zastrzegają sobie prawo do zmiany niniejszego regulaminu
        w&nbsp;dowolnym czasie. Zmiany wchodzą w&nbsp;życie z&nbsp;chwilą
        opublikowania zaktualizowanej wersji regulaminu na stronie serwisu.
      </p>

      <p>
        Dalsze korzystanie z&nbsp;serwisu po wprowadzeniu zmian oznacza
        akceptację zaktualizowanego regulaminu. Zalecamy regularne zapoznawanie
        się z&nbsp;treścią regulaminu.
      </p>
    </ContentSection>
  );
};

export default ChangesSection;

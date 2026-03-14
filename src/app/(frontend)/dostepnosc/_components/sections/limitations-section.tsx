import React from "react";
import ContentSection from "@/components/common/content-section";

const LimitationsSection: React.FC = () => {
  return (
    <ContentSection id="ograniczenia" title="Znane ograniczenia">
      <p>
        Pomimo naszych starań, niektóre elementy serwisu mogą nie być w&nbsp;pełni
        dostępne. Dotyczy to w&nbsp;szczególności:
      </p>

      <p>
        <span className="text-white/80 font-medium">Plakaty filmowe</span> pochodzą
        ze źródeł zewnętrznych i&nbsp;mogą nie posiadać pełnych opisów
        alternatywnych.
      </p>

      <p>
        <span className="text-white/80 font-medium">Treści zewnętrzne</span>, takie
        jak dane repertuarowe pobierane z&nbsp;serwisów kin, są prezentowane
        w&nbsp;formie, w&nbsp;jakiej zostały udostępnione przez źródło.
      </p>

      <p>
        Stale pracujemy nad poprawą dostępności i&nbsp;eliminowaniem
        zidentyfikowanych barier.
      </p>
    </ContentSection>
  );
};

export default LimitationsSection;

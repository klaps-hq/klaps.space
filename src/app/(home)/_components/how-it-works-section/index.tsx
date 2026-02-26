import React from "react";
import SectionHeader from "@/components/common/section-header";
import HowItWorksList from "./how-it-works-list";
import LinkWithArrow from "@/components/ui/read-more-link";
import SectionReveal from "@/components/animations/section-reveal";

const HowItWorksSection: React.FC = () => {
  return (
    <SectionReveal className="bg-black px-8 py-24 md:py-32" delay={0.06}>
      <div className="max-w-[1400px] mx-auto flex flex-col gap-16">
        <SectionHeader
          prefix="W trzech krokach"
          title="Jak to działa"
          description="Od danych z&nbsp;kin do Twojego ekranu. Prosto i&nbsp;bez zbędnych kroków."
        />

        <HowItWorksList />

        <LinkWithArrow href="/jak-to-dziala" label="Dowiedz się więcej" />
      </div>
    </SectionReveal>
  );
};

export default HowItWorksSection;

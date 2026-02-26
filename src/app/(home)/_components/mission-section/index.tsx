import React from "react";
import MissionImage from "./mission-image";
import MissionText from "./mission-text";
import SectionReveal from "@/components/animations/section-reveal";

const MissionSection: React.FC = () => {
  return (
    <SectionReveal
      id="o-projekcie"
      className="bg-black px-8 py-24 md:py-32"
      delay={0.08}
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <MissionImage />
        <MissionText />
      </div>
    </SectionReveal>
  );
};

export default MissionSection;

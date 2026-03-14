import React from "react";
import SectionHeader from "@/components/common/section-header";
import MissionContent from "./mission-content";

const MissionText: React.FC = () => {
  return (
    <div className="flex lg:py-16 flex-col gap-10 max-w-lg">
      <SectionHeader prefix="O projekcie" title="Klaps" />
      <MissionContent />
    </div>
  );
};

export default MissionText;

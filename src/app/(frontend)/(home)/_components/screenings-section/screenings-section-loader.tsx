import React from "react";
import SectionLoader from "@/components/ui/section-loader";

const ScreeningsSectionLoader: React.FC = () => (
  <section id="seanse" className="bg-black px-8 py-16">
    <SectionLoader label="Ładowanie seansów…" />
  </section>
);

export default ScreeningsSectionLoader;

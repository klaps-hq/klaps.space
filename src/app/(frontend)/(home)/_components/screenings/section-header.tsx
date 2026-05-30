import React from "react";

const SectionHeader: React.FC = () => (
  <div className="px-6 md:px-12 lg:px-16 pt-24 md:pt-32 pb-10 md:pb-14">
    <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] -tracking-[0.02em] max-w-[26ch]">
      <span className="block text-white font-medium">
        Repertuar kin studyjnych.
      </span>
      <span className="block text-white/40">
        Klasyka i&nbsp;pokazy specjalne w&nbsp;całej Polsce.
      </span>
    </h2>
    <p className="mt-4 md:mt-5 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
      Aktualny program niezależnych kin studyjnych w&nbsp;Polsce.
      Retrospektywy, klasyka kina autorskiego, pokazy z&nbsp;dyskusją
      i&nbsp;wydarzenia kuratorowane. Filtruj seanse po mieście, dacie
      i&nbsp;gatunku poniżej. Pełny repertuar otwiera się pod przyciskiem
      na&nbsp;dole sekcji.
    </p>
  </div>
);

export default SectionHeader;

import React from "react";

const SectionHeader: React.FC = () => (
  <div className="px-6 md:px-12 lg:px-16 pt-24 md:pt-32 pb-10 md:pb-14">
    <h2 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] -tracking-[0.02em] max-w-[22ch]">
      <span className="block text-white font-medium">Repertuar.</span>
      <span className="block text-white/40">
        Polskie kina studyjne.
      </span>
    </h2>
    <p className="mt-4 md:mt-5 max-w-[58ch] text-base md:text-lg text-white/55 leading-relaxed">
      Klasyka, retrospektywy i&nbsp;pokazy specjalne. Wybierz miasto, datę
      i&nbsp;gatunek poniżej. Pełna lista czeka pod przyciskiem na&nbsp;dole.
    </p>
  </div>
);

export default SectionHeader;

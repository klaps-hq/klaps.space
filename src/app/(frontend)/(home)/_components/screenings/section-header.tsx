import React from "react";

interface SectionHeaderProps {
  total: number;
}

const formatCount = (n: number) => {
  if (n === 1) return "1 seans";
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${n} seanse`;
  }
  return `${n} seansów`;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({ total }) => (
  <div className="px-6 md:px-12 lg:px-16 pt-24 md:pt-32 pb-10 md:pb-14">
    <div className="mb-8 flex items-center gap-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50">
      <span className="h-px w-12 bg-white/30" aria-hidden="true" />
      <span>Repertuar — {formatCount(total)}</span>
    </div>
    <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[140px] font-bold uppercase leading-[0.9] -tracking-[0.03em] text-white">
      Seanse
    </h2>
    <p className="mt-6 max-w-xl text-sm md:text-base text-white/60 leading-relaxed">
      Klasyka, retrospektywy i pokazy specjalne w kinach studyjnych w całej
      Polsce. Wybierz miasto, datę i gatunek — znajdź seans dla siebie.
    </p>
  </div>
);

export default SectionHeader;

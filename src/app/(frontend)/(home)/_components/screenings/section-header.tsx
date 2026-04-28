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
    <div className="mb-6 flex items-center gap-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/45">
      <span className="h-px w-12 bg-white/25" aria-hidden="true" />
      <span>Repertuar — {formatCount(total)}</span>
    </div>
    <h2 className="max-w-4xl text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.2] -tracking-[0.01em]">
      <span className="block text-white font-medium">
        Seanse w kinach studyjnych w&nbsp;całej Polsce.
      </span>
      <span className="block text-white/45">
        Klasyka, retrospektywy i pokazy specjalne — wybierz miasto, datę
        i&nbsp;gatunek.
      </span>
    </h2>
  </div>
);

export default SectionHeader;

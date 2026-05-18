import React from "react";
import SectionHeading from "@/components/common/section-heading";

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
  <SectionHeading
    className="px-6 md:px-12 lg:px-16 pt-24 md:pt-32 pb-10 md:pb-14"
    eyebrow={`Repertuar — ${formatCount(total)}`}
    title={<>Seanse w kinach studyjnych w&nbsp;całej Polsce.</>}
    subtitle={
      <>
        Klasyka, retrospektywy i pokazy specjalne — wybierz miasto, datę
        i&nbsp;gatunek.
      </>
    }
  />
);

export default SectionHeader;

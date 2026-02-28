import React from "react";

interface CityStatsProps {
  cinemasCount: number;
  moviesCount: number;
  screeningsCount: number;
}

const CityStats: React.FC<CityStatsProps> = ({
  cinemasCount,
  moviesCount,
  screeningsCount,
}) => {
  const stats = [
    { label: "Kina", value: cinemasCount.toString() },
    { label: "Filmy w repertuarze", value: moviesCount.toString() },
    { label: "Zaplanowane seanse", value: screeningsCount.toString() },
  ];

  return (
    <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col gap-1 border-l-4 border-l-blood-red pl-4"
        >
          <dt className="text-neutral-500 text-sm uppercase tracking-widest">
            {stat.label}
          </dt>
          <dd className="text-white text-2xl md:text-3xl font-bold">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default CityStats;

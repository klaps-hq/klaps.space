import React from "react";
import { IScreening } from "@/interfaces/IScreenings";
import { formatDatePL } from "@/lib/utils";
import ScreeningInfoItem from "./screening-info-item";

type ScreeningInfoProps = {
  screening: IScreening;
};

const ScreeningInfo: React.FC<ScreeningInfoProps> = ({ screening }) => {
  const formatTags = (): string[] => {
    const tags: string[] = [];
    if (screening.isDubbing) tags.push("Dubbing");
    if (screening.isSubtitled) tags.push("Napisy");
    if (tags.length === 0) tags.push("Wersja oryginalna");
    return tags;
  };

  const items = [
    { label: "Data", value: formatDatePL(screening.date) },
    { label: "Godzina", value: screening.time },
    { label: "Wersja", value: formatTags().join(", ") },
  ];

  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-white text-2xl md:text-3xl font-bold uppercase tracking-wide">
        Szczegoly seansu
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <ScreeningInfoItem
            key={item.label}
            label={item.label}
            value={item.value}
          />
        ))}
      </div>
    </section>
  );
};

export default ScreeningInfo;

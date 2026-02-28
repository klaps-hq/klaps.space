"use client";

import React from "react";
import { ICity } from "@/interfaces/ICities";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { useCityParam, type CityOption } from "@/hooks/use-city-param";

interface CitySelectProps {
  cities: ICity[];
}

const CitySelect: React.FC<CitySelectProps> = ({ cities }) => {
  const { selectedCity, handleCityChange, options } = useCityParam(cities);

  return (
    <Combobox
      items={options}
      value={selectedCity}
      onValueChange={handleCityChange}
    >
      <ComboboxInput placeholder="Wybierz miasto" showTrigger showClear />

      <ComboboxContent>
        <ComboboxEmpty>Nie znaleziono miasta</ComboboxEmpty>
        <ComboboxList>
          {(option: CityOption) => (
            <ComboboxItem key={option.value ?? "all"} value={option}>
              {option.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default CitySelect;

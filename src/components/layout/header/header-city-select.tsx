"use client";

import React from "react";
import { MapPin } from "lucide-react";
import {
  Combobox,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxInput,
} from "@/components/ui/combobox";
import { usePreferredCity, type CityOption } from "@/contexts/city-context";
import { cn } from "@/lib/utils";

type HeaderCitySelectSize = "sm" | "md";

interface HeaderCitySelectProps {
  size?: HeaderCitySelectSize;
  className?: string;
}

const PLACEHOLDER = "Wszystkie miasta";

const sizeStyles: Record<HeaderCitySelectSize, string> = {
  sm: "h-8 min-w-[200px] max-w-[240px] border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 [&_input]:text-[11px]",
  md: "h-10 min-w-[220px] border-2 border-blood-red bg-transparent hover:bg-blood-red/10 [&_input]:text-sm",
};

const iconSizeStyles: Record<HeaderCitySelectSize, string> = {
  sm: "size-3.5",
  md: "size-4",
};

const HeaderCitySelect: React.FC<HeaderCitySelectProps> = ({
  size = "sm",
  className,
}) => {
  const { cityId, cityName, isHydrated, setCityId, options } =
    usePreferredCity();

  const selectedOption: CityOption | null =
    isHydrated && cityId !== null
      ? options.find((o) => o.value === cityId) ?? null
      : null;

  const handleCityChange = (option: CityOption | null) => {
    setCityId(option?.value ?? null);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const displayPlaceholder = isHydrated ? cityName : PLACEHOLDER;

  return (
    <div className={cn("flex items-center", className)}>
      <Combobox
        items={options}
        value={selectedOption}
        onValueChange={handleCityChange}
      >
        <ComboboxInput
          placeholder={displayPlaceholder}
          showTrigger
          showClear={isHydrated && !!cityId}
          leadingIcon={
            <MapPin
              className={cn("text-blood-red shrink-0", iconSizeStyles[size])}
            />
          }
          className={cn(
            "transition-all [&_input]:tracking-[0.15em] [&_input]:font-medium [&_input]:text-white/90 [&_input]:placeholder:text-white/60",
            sizeStyles[size]
          )}
        />
        <ComboboxContent>
          <ComboboxEmpty>Nie znaleziono miasta</ComboboxEmpty>
          <ComboboxList>
            {(option: CityOption) => (
              <ComboboxItem
                key={option.value ?? "all"}
                value={option}
                tabIndex={0}
              >
                {option.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
};

export default HeaderCitySelect;

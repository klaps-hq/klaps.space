"use client";

import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatDateLabel } from "@/lib/utils";

type DateOption = {
  value: string;
  label: string;
};

interface DateTabsProps {
  dates: string[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  label?: string;
  className?: string;
}

const DateTabs: React.FC<DateTabsProps> = ({
  dates,
  selectedDate,
  onDateChange,
  label = "Data",
  className,
}) => {
  if (dates.length === 0) return null;

  const options: DateOption[] = dates.map((date) => ({
    value: date,
    label: formatDateLabel(date),
  }));

  const handleItemClick = (value: string) => {
    if (value === selectedDate) {
      onDateChange("");
    }
  };

  return (
    <div className={className}>
      {label && (
        <span className="text-sm uppercase tracking-wider text-white/50 mb-3 block">
          {label}
        </span>
      )}

      <RadioGroup
        value={selectedDate}
        onValueChange={onDateChange}
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => (
          <RadioGroupItem
            key={option.value}
            value={option.value}
            variant="tag"
            size="sm"
            onClick={() => handleItemClick(option.value)}
          >
            {option.label}
          </RadioGroupItem>
        ))}
      </RadioGroup>
    </div>
  );
};

export default DateTabs;

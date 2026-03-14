"use client";

import React from "react";
import { useDateParam } from "@/hooks/use-date-param";
import DateTabs from "@/components/common/date-tabs";

const ScreeningsDatePicker: React.FC = () => {
  const { dateFrom, daysOptions, handleDateChange } = useDateParam();

  const dates = daysOptions.map((o) => o.value);

  return (
    <DateTabs
      dates={dates}
      selectedDate={dateFrom ?? ""}
      onDateChange={handleDateChange}
    />
  );
};

export default ScreeningsDatePicker;

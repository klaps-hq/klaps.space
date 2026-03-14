"use client";

import { useEffect, useState } from "react";

interface UseDebouncedValueOptions {
  delayMs?: number;
}

export const useDebouncedValue = <T>(
  value: T,
  options: UseDebouncedValueOptions = {}
): T => {
  const { delayMs = 400 } = options;
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [delayMs, value]);

  return debouncedValue;
};

"use client";

import { useState, useCallback } from "react";

interface UseMobileMenuReturn {
  isOpen: boolean;
  handleToggle: () => void;
  handleClose: () => void;
  handleKeyDown: (event: React.KeyboardEvent) => void;
}

export const useMobileMenu = (): UseMobileMenuReturn => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleToggle();
      }
      if (event.key === "Escape") {
        handleClose();
      }
    },
    [handleToggle, handleClose]
  );

  return {
    isOpen,
    handleToggle,
    handleClose,
    handleKeyDown,
  };
};

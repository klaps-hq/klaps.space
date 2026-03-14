import React from "react";
import { cn } from "@/lib/utils";

interface MobileMenuButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({
  isOpen,
  onToggle,
  onKeyDown,
}) => {
  return (
    <button
      type="button"
      className="xl:hidden flex flex-col justify-center items-center w-12 h-12 gap-1.5 bg-black focus-visible:outline focus-visible:ring-2 focus-visible:ring-blood-red"
      onClick={onToggle}
      onKeyDown={onKeyDown}
      aria-label={isOpen ? "Zamknij menu" : "Otwórz menu"}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      <span
        className={cn(
          "block w-6 h-0.5 bg-white transition-all duration-300",
          isOpen && "rotate-45 translate-y-2"
        )}
      />
      <span
        className={cn(
          "block w-6 h-0.5 bg-white transition-all duration-300",
          isOpen && "opacity-0"
        )}
      />
      <span
        className={cn(
          "block w-6 h-0.5 bg-white transition-all duration-300",
          isOpen && "-rotate-45 -translate-y-2"
        )}
      />
    </button>
  );
};

export default MobileMenuButton;

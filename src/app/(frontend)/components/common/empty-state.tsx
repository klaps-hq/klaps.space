import React from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  headline?: string;
  description?: string;
  className?: string;
}

const DEFAULT_HEADLINE = "Nie znaleziono seansów";
const DEFAULT_DESCRIPTION =
  "Zmień kryteria wyszukiwania lub sprawdź ponownie później.";

const EmptyState: React.FC<EmptyStateProps> = ({
  headline = DEFAULT_HEADLINE,
  description = DEFAULT_DESCRIPTION,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 pb-20",
        className
      )}
    >
      <h3 className="text-white text-lg tracking-widest uppercase text-center font-medium">
        {headline}
      </h3>
      <p className="text-white/50 text-center mt-2 max-w-md">{description}</p>
    </div>
  );
};

export default EmptyState;

import React from "react";
import { cn } from "@/lib/utils";

type AboutBorderedListProps = {
  items: React.ReactNode[];
  className?: string;
  gap?: "tight" | "loose";
};

const AboutBorderedList: React.FC<AboutBorderedListProps> = ({
  items,
  className,
  gap = "tight",
}) => {
  return (
    <ul
      className={cn(
        "list-none flex flex-col pl-4 border-l border-neutral-800",
        gap === "tight" ? "gap-2" : "gap-4",
        className
      )}
    >
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
};

export default AboutBorderedList;

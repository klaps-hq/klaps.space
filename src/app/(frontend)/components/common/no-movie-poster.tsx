import { cn } from "@/lib/utils";
import React from "react";

interface NoMoviePosterProps {
  className?: string;
  width?: number;
  height?: number;
  title?: string;
}

const NoMoviePoster: React.FC<NoMoviePosterProps> = ({
  className,
  width,
  height,
}) => {
  return (
    <div
      className={cn(className, "w-full h-full bg-gray-200")}
      style={{ width, height }}
    />
  );
};

export default NoMoviePoster;

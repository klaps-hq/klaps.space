import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionLoaderProps {
  label?: string;
  className?: string;
}

const SectionLoader: React.FC<SectionLoaderProps> = ({ label, className }) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center gap-4 min-h-screen",
      className,
    )}
  >
    <Loader2 className="h-8 w-8 text-blood-red animate-spin" />
    {label && (
      <p className="text-white/50 text-xs uppercase tracking-[0.25em] font-semibold">
        {label}
      </p>
    )}
  </div>
);

export default SectionLoader;

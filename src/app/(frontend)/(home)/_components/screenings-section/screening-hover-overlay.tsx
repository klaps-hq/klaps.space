import React from "react";
import { Ticket } from "lucide-react";

const ScreeningHoverOverlay: React.FC = () => (
  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
    <span className="flex items-end gap-1.5 text-xs text-white font-medium">
      <Ticket className="size-3.5 text-blood-red" aria-hidden="true" />
      <span>Sprawdź seanse i kina</span>
    </span>
  </div>
);

export default ScreeningHoverOverlay;

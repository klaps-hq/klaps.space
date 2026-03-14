import React from "react";
import { Film } from "lucide-react";

const FilmFrame: React.FC = () => {
  return (
    <div className="flex items-center gap-2 md:gap-4 select-none">
      <span className="text-7xl md:text-9xl font-monoton text-blood-red leading-none drop-shadow-[0_0_30px_rgba(220,19,1,0.3)]">
        4
      </span>
      <Film
        className="size-16 md:size-24 text-blood-red drop-shadow-[0_0_30px_rgba(220,19,1,0.3)]"
        strokeWidth={1.5}
      />
      <span className="text-7xl md:text-9xl font-monoton text-blood-red leading-none drop-shadow-[0_0_30px_rgba(220,19,1,0.3)]">
        4
      </span>
    </div>
  );
};

export default FilmFrame;

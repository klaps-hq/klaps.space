import Link from "next/link";
import React from "react";

const LOGO_TAGLINE = "Klasyka kina. Lokalnie.";

const Logo: React.FC = () => {
  return (
    <Link
      href="/"
      className="inline-flex flex-col gap-0.5 transition-opacity hover:opacity-90 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blood-red focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-sm"
    >
      <span className="text-4xl font-monoton uppercase text-blood-red drop-shadow-[0_0_1px_rgba(255,255,255,0.3)]">
        Klaps
      </span>

      <span className="text-[10px] uppercase tracking-widest text-white/80 font-oswald font-light">
        {LOGO_TAGLINE}
      </span>
    </Link>
  );
};

export default Logo;

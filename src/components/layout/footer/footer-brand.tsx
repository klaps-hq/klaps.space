import React from "react";
import Link from "next/link";
import SocialLinks from "@/components/common/social-links";

const FooterBrand: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/"
        className="inline-block self-start text-5xl md:text-6xl font-monoton uppercase text-blood-red drop-shadow-[0_0_1px_rgba(255,255,255,0.3)] transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blood-red focus-visible:ring-offset-2 focus-visible:ring-offset-dark-ink rounded-sm"
      >
        Klaps
      </Link>

      <p className="text-xs uppercase tracking-[0.25em] text-white/40 font-oswald font-light max-w-xs">
        Ogólnopolski repertuar seansów specjalnych, klasyki i&nbsp;filmów spoza
        głównego obiegu.
      </p>

      <SocialLinks
        className="pt-1"
        focusRingOffsetClassName="focus-visible:ring-offset-dark-ink"
      />
    </div>
  );
};

export default FooterBrand;

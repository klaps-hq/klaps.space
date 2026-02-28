import React from "react";
import Image from "next/image";

const MISSION_IMAGE_SRC = "/images/mission-section-image.jpg";
const MISSION_IMAGE_ALT =
  "Osoba rozłożona na fotelu w ciemnej sali kinowej z uniesioną ręką, niebieskie fotele w tle";
const MISSION_IMAGE_CREDIT_URL =
  "https://www.pexels.com/pl-pl/zdjecie/mezczyzna-osoba-anonimowy-siedzenia-8273643/";
const MISSION_IMAGE_CREDIT_AUTHOR = "cottonbro studio";

const MissionImage: React.FC = () => {
  return (
    <div className="relative aspect-3/4 w-full max-h-[650px] group">
      <div className="absolute -top-3 -left-3 w-16 h-16 border-t-2 border-l-2 border-blood-red z-10 pointer-events-none" />
      <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-2 border-r-2 border-blood-red z-10 pointer-events-none" />

      <Image
        src={MISSION_IMAGE_SRC}
        alt={MISSION_IMAGE_ALT}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 60vw, 50vw"
      />

      <span className="absolute bottom-2 right-2 z-10 text-[10px] text-white/50 hover:text-white/80 transition-colors">
        Fot.{" "}
        <a
          href={MISSION_IMAGE_CREDIT_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Zdjęcie autorstwa ${MISSION_IMAGE_CREDIT_AUTHOR} na Pexels`}
          tabIndex={0}
        >
          {MISSION_IMAGE_CREDIT_AUTHOR}
        </a>
        {" / Pexels"}
      </span>
    </div>
  );
};

export default MissionImage;

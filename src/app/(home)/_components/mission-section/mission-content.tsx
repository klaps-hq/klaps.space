import React from "react";
import { Badge } from "@/components/ui/badge";
import LinkWithArrow from "@/components/ui/read-more-link";

const MissionContent: React.FC = () => {
  return (
    <>
      <div className="text-neutral-400 text-base md:text-lg leading-relaxed space-y-6">
        <p>
          Klaps to ogólnopolski repertuar seansów specjalnych, klasyki
          i&nbsp;filmów spoza głównego obiegu. Zbieramy program kin studyjnych
          oraz wybrane seanse z&nbsp;większych sieci kinowych&nbsp;- wszędzie
          tam, gdzie stare filmy wracają na duży ekran.
        </p>

        <p>
          Pomagamy znaleźć pokazy, które łatwo przegapić: retrospektywy,
          przeglądy, wznowienia.
        </p>
      </div>

      <Badge variant="label" suffix="Kina w&nbsp;całej Polsce.">
        Jedno miejsce
      </Badge>

      <LinkWithArrow href="/o-projekcie" label="Czytaj więcej" />
    </>
  );
};

export default MissionContent;

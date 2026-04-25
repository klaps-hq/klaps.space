import React from "react";

const About: React.FC = () => (
  <section className="relative bg-black text-white border-y border-white/10">
    <div className="px-6 md:px-12 lg:px-16 py-24 md:py-40">
      <div className="max-w-4xl flex flex-col gap-10 md:gap-14">
        <div className="flex items-center gap-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50">
          <span className="h-px w-12 bg-white/30" aria-hidden="true" />
          <span>O projekcie · Klaps</span>
        </div>

        <p className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white leading-[1.15] -tracking-[0.01em]">
          Klaps to ogólnopolski repertuar seansów specjalnych, klasyki
          i&nbsp;filmów spoza głównego obiegu. Zbieramy program kin studyjnych
          oraz wybrane seanse z&nbsp;większych sieci kinowych — wszędzie tam,
          gdzie stare filmy wracają na duży ekran.
        </p>

        <p className="text-base md:text-lg text-white/55 leading-relaxed max-w-2xl">
          Pomagamy znaleźć pokazy, które łatwo przegapić: retrospektywy,
          przeglądy, wznowienia.
        </p>
      </div>
    </div>
  </section>
);

export default About;

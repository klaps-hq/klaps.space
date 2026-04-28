import React from "react";

const About: React.FC = () => (
  <section className="relative bg-black text-white border-y border-white/10">
    <div className="px-6 md:px-12 lg:px-16 py-24 md:py-40">
      <div className="max-w-5xl flex flex-col gap-10 md:gap-12">
        <div className="flex items-center gap-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/45">
          <span className="h-px w-12 bg-white/25" aria-hidden="true" />
          <span>O projekcie · Klaps</span>
        </div>

        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-[1.2] -tracking-[0.01em]">
          <span className="block text-white font-medium">
            Klaps to ogólnopolski repertuar seansów specjalnych, klasyki
            i&nbsp;filmów spoza głównego obiegu.
          </span>
          <span className="block mt-2 text-white/45">
            Zbieramy program kin studyjnych oraz wybrane seanse z&nbsp;większych
            sieci kinowych — wszędzie tam, gdzie stare filmy wracają na duży
            ekran.
          </span>
        </h2>
      </div>
    </div>
  </section>
);

export default About;

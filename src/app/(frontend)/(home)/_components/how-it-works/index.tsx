import React from "react";

interface Step {
  label: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    label: "Zbieramy",
    title: "Repertuary z całej Polski",
    description:
      "Skanujemy strony kin studyjnych i wybranych kin sieciowych. Łączymy rozproszone harmonogramy w jeden, aktualny strumień danych.",
  },
  {
    label: "Filtrujemy",
    title: "Tylko to, co warto",
    description:
      "Klasyka, retrospektywy, pokazy specjalne, festiwale. Odsiewamy hity dla mas — zostawiamy seanse, dla których chodzi się do kina.",
  },
  {
    label: "Pokazujemy",
    title: "W jednym miejscu",
    description:
      "Wybierz miasto, datę, gatunek. Klaps pokazuje, gdzie i kiedy zagrają konkretny film — bez przeskakiwania między pięcioma stronami.",
  },
];

const HowItWorks: React.FC = () => (
  <section className="relative bg-black text-white">
    <div className="px-6 md:px-12 lg:px-16 pt-24 md:pt-32 pb-12 md:pb-16">
      <div className="mb-8 flex items-center gap-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/50">
        <span className="h-px w-12 bg-white/30" aria-hidden="true" />
        <span>Jak to działa</span>
      </div>
      <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[120px] font-bold uppercase leading-[0.9] -tracking-[0.03em] text-white">
        Trzy kroki
        <br />
        do seansu
      </h2>
      <p className="mt-6 max-w-xl text-sm md:text-base text-white/55 leading-relaxed">
        Klaps to niezależny agregator seansów z kin studyjnych. Robimy żmudną
        pracę zbierania repertuarów, żebyś Ty mógł skupić się na tym, co
        ważniejsze — na filmie.
      </p>
    </div>

    <ol className="grid grid-cols-1 md:grid-cols-3 border-t md:border-b border-white/10">
      {STEPS.map((step, index) => (
        <li
          key={step.label}
          className="relative px-6 md:px-10 lg:px-12 py-10 md:py-14 border-b md:border-b-0 md:border-r last:border-r-0 border-white/10 flex flex-col gap-6"
        >
          <div className="flex items-baseline justify-between gap-4">
            <span className="font-mono tabular-nums text-[10px] md:text-[11px] tracking-[0.3em] text-white/35">
              {String(index + 1).padStart(2, "0")} / 03
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/45">
              {step.label}
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold uppercase -tracking-[0.02em] leading-[0.95] text-white">
            {step.title}
          </h3>

          <p className="text-sm md:text-base text-white/55 leading-relaxed">
            {step.description}
          </p>
        </li>
      ))}
    </ol>

  </section>
);

export default HowItWorks;

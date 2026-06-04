import React from "react";

const TAGS = [
  "Klasyka",
  "Retrospektywy",
  "Pokazy specjalne",
  "Kino autorskie",
  "Kuratorowane",
  "Niezależne",
];

const About: React.FC = () => (
  <section className="relative bg-black text-white border-t border-white/10">
    <div className="px-6 md:px-12 lg:px-16 pt-24 md:pt-32 pb-24 md:pb-32">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12 lg:gap-20">
        <div className="lg:flex-1">
          <h2 className="text-3xl md:text-5xl lg:text-6xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
            Klaps to spis seansów filmowych w&nbsp;polskich kinach studyjnych.
            Klasyka, retrospektywy, pokazy specjalne. Wszystko
            w&nbsp;jednym miejscu, bezpłatnie.
          </h2>
        </div>

        <aside className="lg:shrink-0 lg:w-60 flex flex-col lg:items-end">
          <span className="mb-5 md:mb-6 text-[10px] uppercase tracking-[0.3em] text-white/35">
            Tematy
          </span>
          <ul className="flex flex-col gap-2 lg:text-right">
            {TAGS.map((tag) => (
              <li
                key={tag}
                className="text-base md:text-lg uppercase tracking-[0.18em] text-white/65"
              >
                {tag}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  </section>
);

export default About;

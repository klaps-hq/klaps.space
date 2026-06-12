import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
          {/* Heading holds only the brand definition; the rest is body
              copy so extractors read structure, not a 22-word heading. */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
            Klaps to spis seansów filmowych w&nbsp;polskich kinach studyjnych.
          </h2>
          <p className="text-3xl md:text-5xl lg:text-6xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
            Klasyka, retrospektywy, pokazy specjalne. Wszystko
            w&nbsp;jednym miejscu, bezpłatnie.
          </p>
          <div className="mt-8 md:mt-10">
            <Link
              href="/o-projekcie"
              className="group inline-flex items-center gap-3 text-xs md:text-sm uppercase tracking-[0.28em] text-white/70 hover:text-white transition-colors"
            >
              Więcej o&nbsp;projekcie
              <ArrowRight
                aria-hidden="true"
                className="size-4 shrink-0 transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        <aside className="lg:shrink-0 lg:w-60 flex flex-col lg:items-end">
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

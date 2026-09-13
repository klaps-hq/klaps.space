import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface ScreeningType {
  name: string;
  definition: string;
  href: string;
}

// The kinds of special screening this guide covers. The API has no screening
// type field (only isDubbing / isSubtitled), so these are editorial rather
// than data-driven: each one explains a term people search for and hands the
// reader the article that covers it. Once the backend classifies screenings
// by type, these headings become real filtered listings.
const SCREENING_TYPES: ScreeningType[] = [
  {
    name: "Retrospektywa",
    definition:
      "Przegląd kilku lub kilkunastu filmów jednego reżysera, aktora albo nurtu, pokazywanych w jednym cyklu, zwykle przez kilka tygodni.",
    href: "/blog/retrospektywa-filmowa-co-to-jest-i-jak-ja-ogladac",
  },
  {
    name: "Seans z prelekcją",
    definition:
      "Pokaz poprzedzony kilkunastominutowym wprowadzeniem krytyka lub filmoznawcy, po którym często odbywa się dyskusja z widownią.",
    href: "/blog/seans-z-prelekcja-jak-wyglada-i-dla-kogo-jest",
  },
  {
    name: "DKF",
    definition:
      "Dyskusyjny Klub Filmowy: cykliczne pokazy z omówieniem, prowadzone przez klub działający przy kinie, zwykle z własnym kluczem programowym.",
    href: "/blog/dkf-czym-jest-dyskusyjny-klub-filmowy",
  },
  {
    name: "Klasyka na dużym ekranie",
    definition:
      "Filmy sprzed lat wracające do kin, często w odrestaurowanych kopiach cyfrowych albo z taśmy, w jakości nieosiągalnej w streamingu.",
    href: "/blog/dlaczego-warto-ogladac-klasyke-kina-na-duzym-ekranie",
  },
];

// Server-rendered editorial block under the listing. The listing itself
// answers "co gra"; this answers "co to właściwie jest", which is the
// informational half of the query set and the half no aggregator covers.
const ScreeningTypesSection: React.FC = () => (
  <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-20 md:pb-28">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 gap-x-8 lg:gap-x-12">
      <div className="lg:col-span-4">
        <h2 className="text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] text-white font-medium max-w-[16ch]">
          Rodzaje seansów specjalnych
        </h2>
        {/* Quotable definition: the short, self-contained answer that search
            engines and AI summaries lift for "czym jest seans specjalny". */}
        <p className="mt-6 md:mt-8 max-w-[46ch] text-base md:text-lg text-white/65 leading-relaxed">
          Seans specjalny to pokaz, który wykracza poza zwykłe wyświetlenie
          filmu z repertuaru: retrospektywa, przedpremiera, klasyka
          w&nbsp;odrestaurowanej kopii, pokaz z&nbsp;prelekcją albo dyskusją.
          Organizują je głównie kina studyjne i&nbsp;niezależne, a&nbsp;terminy
          bywają jednorazowe.
        </p>
        <Link
          href="/blog/seanse-specjalne-w-kinie-rodzaje-i-co-warto-wiedziec"
          className="group mt-6 inline-flex items-center gap-2 text-[10px] md:text-xs uppercase tracking-[0.28em] text-white/55 hover:text-white transition-colors border-b border-transparent hover:border-white/40 pb-0.5"
        >
          Pełny przewodnik
          <ArrowUpRight
            aria-hidden="true"
            className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>

      <div className="lg:col-span-8">
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 md:gap-y-10">
          {SCREENING_TYPES.map((type) => (
            <div key={type.href} className="flex flex-col gap-2">
              <dt>
                <h3 className="text-sm md:text-base font-semibold uppercase -tracking-[0.01em] text-white">
                  {type.name}
                </h3>
              </dt>
              <dd className="text-sm md:text-base text-white/60 leading-relaxed">
                {type.definition}
              </dd>
              <Link
                href={type.href}
                className="mt-1 self-start text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/50 hover:text-white transition-colors border-b border-transparent hover:border-white/40 pb-0.5"
              >
                Czytaj więcej
              </Link>
            </div>
          ))}
        </dl>

        <p className="mt-10 md:mt-12 max-w-[64ch] text-sm md:text-base text-white/55 leading-relaxed">
          Seanse specjalne najczęściej trafiają do repertuaru{" "}
          <Link
            href="/kina"
            className="text-white/80 underline underline-offset-4 decoration-white/25 hover:text-white hover:decoration-white transition-colors"
          >
            kin studyjnych
          </Link>
          , które programują je obok bieżących premier. Sprawdź, co grają{" "}
          <Link
            href="/miasta"
            className="text-white/80 underline underline-offset-4 decoration-white/25 hover:text-white hover:decoration-white transition-colors"
          >
            w&nbsp;Twoim mieście
          </Link>
          , albo przeglądaj repertuar{" "}
          <Link
            href="/gatunki"
            className="text-white/80 underline underline-offset-4 decoration-white/25 hover:text-white hover:decoration-white transition-colors"
          >
            według gatunku
          </Link>
          .
        </p>
      </div>
    </div>
  </section>
);

export default ScreeningTypesSection;

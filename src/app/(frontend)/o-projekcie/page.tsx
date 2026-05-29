import React from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import SiteHeader from "@/components/common/site-header";
import Footer from "../(home)/_components/footer";

interface ManifestoItem {
  n: string;
  title: string;
  body: string;
}

const MANIFESTO: ManifestoItem[] = [
  {
    n: "01",
    title: "Niezależność",
    body: "Bez reklam, bez algorytmów rekomendujących, bez rankingów. Treści nie są promowane komercyjnie ani wartościowane liczbami.",
  },
  {
    n: "02",
    title: "Klasyka",
    body: "Seanse specjalne, retrospektywy, wznowienia, pokazy archiwalne. Filmy, których nie obejrzysz w każdym multipleksie przez najbliższe trzy tygodnie.",
  },
  {
    n: "03",
    title: "Cała Polska",
    body: "Repertuar kin studyjnych z każdego miasta i wybrane seanse specjalne organizowane przez kina sieciowe. Bez podziału na lepsze i gorsze.",
  },
  {
    n: "04",
    title: "Czytelność",
    body: "Interfejs ma pomagać, nie rozpraszać. Bez nadmiaru bodźców. Sprawdzasz co gra, idziesz do kina, wychodzisz ze strony.",
  },
  {
    n: "05",
    title: "Otwartość",
    body: "Otwarty kod źródłowy, otwarta baza danych, otwarta misja. Bezpłatnie i na zawsze. Klaps należy do widzów, nie do inwestorów.",
  },
  {
    n: "06",
    title: "Kino",
    body: "Duży ekran, skupiona uwaga, wspólne doświadczenie. Klaps nie walczy ze streamingiem. Przypomina, że kino jako przestrzeń wciąż ma sens.",
  },
];

const SCOPE_INCLUDED = [
  "Repertuar kin studyjnych w całej Polsce",
  "Wybrane seanse specjalne organizowane przez kina sieciowe",
  "Klasyczne filmy, retrospektywy, przeglądy tematyczne",
  "Wznowienia i pojedyncze pokazy archiwalne",
  "Wydarzenia kinowe niezwiązane z bieżącymi premierami",
];

const SCOPE_EXCLUDED = [
  "Codzienny repertuar premierowy",
  "Promocja masowych hitów kinowych",
  "Recenzje i oceny filmów",
  "Rankingi popularności",
  "Algorytmiczne rekomendacje",
];

const AUDIENCE = [
  "Osoby zainteresowane kinem klasycznym i historią filmu",
  "Widzowie chcący wychodzić do kina częściej",
  "Osoby nie śledzące na bieżąco repertuarów poszczególnych kin",
  "Mieszkańcy mniejszych miast, gdzie informacje o seansach są trudniej dostępne",
  "Widzowie zmęczeni algorytmicznym podawaniem treści",
];

const AboutPage = () => {
  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-4">
        <Breadcrumbs items={[{ name: "O projekcie", href: "/o-projekcie" }]} />
      </div>

      <header className="px-6 md:px-12 lg:px-16 pt-6 md:pt-8 pb-16 md:pb-20">
        <p className="mb-3 md:mb-4 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40">
          O projekcie
        </p>
        <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-medium uppercase -tracking-[0.03em] leading-[0.95] text-white">
          Klaps
        </h1>
        <p className="mt-8 md:mt-10 max-w-[64ch] text-base md:text-lg lg:text-xl text-white/65 leading-relaxed">
          Niezależny, ogólnopolski przewodnik po repertuarze kinowym, skupiony
          na seansach specjalnych, klasyce i&nbsp;filmach spoza komercyjnego
          obiegu. Jedno miejsce, w&nbsp;którym można sprawdzić, co naprawdę
          warto zobaczyć w&nbsp;kinie tu i&nbsp;teraz.
        </p>
      </header>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-16 md:pt-20 pb-16 md:pb-20">
        <h2 className="mb-8 md:mb-10 text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
          Czym jest Klaps
        </h2>
        <div className="flex flex-col gap-5 max-w-[64ch] text-base md:text-lg text-white/65 leading-relaxed">
          <p>
            Klaps zbiera informacje o&nbsp;pokazach organizowanych przez kina
            studyjne i&nbsp;wybrane kina sieciowe. Wszędzie tam, gdzie stare
            filmy, retrospektywy i&nbsp;wznowienia wracają na duży ekran.
          </p>
          <p>
            Projekt nie konkuruje z&nbsp;dużymi portalami filmowymi ani nie
            tworzy kolejnej bazy danych filmów. Nie ma recenzji, rankingów ani
            rekomendacji algorytmicznych. Klaps pełni rolę jednego, spójnego
            miejsca: sprawdzasz co gra, planujesz wyjście, idziesz do kina.
          </p>
          <p>
            Koncentrujemy się na seansach, które łatwo przegapić: pojedyncze
            pokazy, krótkie przeglądy, retrospektywy reżyserskie, wznowienia
            klasyków i&nbsp;wydarzenia specjalne. Repertuar, który ginie wśród
            premier i&nbsp;masowych tytułów.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-16 md:pt-20 pb-20 md:pb-24">
        <div className="mb-12 md:mb-16 flex items-end justify-between gap-6 flex-wrap">
          <h2 className="text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
            Manifest
          </h2>
          <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/35 tabular-nums">
            6 zasad
          </span>
        </div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 lg:gap-x-16 gap-y-12 md:gap-y-16">
          {MANIFESTO.map((item) => (
            <li key={item.n} className="flex flex-col">
              <span className="text-5xl md:text-6xl lg:text-7xl font-light tabular-nums text-white/15 -tracking-[0.03em] leading-none">
                {item.n}
              </span>
              <h3 className="mt-4 md:mt-5 text-lg md:text-xl lg:text-2xl font-medium text-white -tracking-[0.01em] leading-tight">
                {item.title}
              </h3>
              <p className="mt-3 text-sm md:text-base text-white/55 leading-relaxed max-w-[40ch]">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-16 md:pt-20 pb-16 md:pb-20">
        <h2 className="mb-10 md:mb-14 text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
          Zakres
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <p className="mb-5 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40">
              Klaps obejmuje
            </p>
            <ul className="flex flex-col gap-3 border-l border-white/15 pl-5">
              {SCOPE_INCLUDED.map((item) => (
                <li
                  key={item}
                  className="text-base md:text-lg text-white/75 leading-snug"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-5 text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40">
              Czego Klaps nie robi
            </p>
            <ul className="flex flex-col gap-3 border-l border-white/10 pl-5">
              {SCOPE_EXCLUDED.map((item) => (
                <li
                  key={item}
                  className="text-base md:text-lg text-white/45 leading-snug"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-10 md:mt-12 max-w-[60ch] text-base md:text-lg text-white/65 leading-relaxed">
          Granica jest prosta: jeśli film można obejrzeć w&nbsp;każdym
          multipleksie przez najbliższe trzy tygodnie, Klaps się nim nie
          zajmuje. Jeśli wyświetlany jest przez jeden wieczór w&nbsp;trzech
          kinach w&nbsp;Polsce, wtedy właśnie Klaps jest potrzebny.
        </p>
      </section>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-16 md:pt-20 pb-16 md:pb-20">
        <h2 className="mb-10 md:mb-12 text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium">
          Dla kogo
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 max-w-[80ch]">
          {AUDIENCE.map((item, i) => (
            <li
              key={item}
              className="flex items-baseline gap-3 text-base md:text-lg text-white/65 leading-snug"
            >
              <span className="shrink-0 text-[10px] uppercase tracking-[0.25em] text-white/30 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-16 md:pt-20 pb-20 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[20ch] text-white font-medium">
              Otwarty kod
            </h2>
            <p className="mt-6 md:mt-8 max-w-[48ch] text-base md:text-lg text-white/65 leading-relaxed">
              Klaps jest projektem open source. Kod aplikacji jest publicznie
              dostępny na GitHubie. Scrapper odpowiedzialny za pobieranie
              danych pozostaje zamknięty z&nbsp;przyczyn prawnych.
            </p>
          </div>
          <ul className="lg:col-span-7 flex flex-col">
            <li className="border-t border-white/10 py-5">
              <a
                href="https://github.com/klaps-hq/klaps.space"
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-baseline justify-between gap-4"
              >
                <span className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Frontend · Next.js
                  </span>
                  <span className="text-base md:text-lg text-white group-hover:text-white/80 transition-colors">
                    github.com/klaps-hq/klaps.space
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-white/40 group-hover:text-white transition-transform group-hover:translate-x-1"
                >
                  ↗
                </span>
              </a>
            </li>
            <li className="border-t border-white/10 py-5">
              <a
                href="https://github.com/klaps-hq/api.klaps.space"
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-baseline justify-between gap-4"
              >
                <span className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Backend · NestJS
                  </span>
                  <span className="text-base md:text-lg text-white group-hover:text-white/80 transition-colors">
                    github.com/klaps-hq/api.klaps.space
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-white/40 group-hover:text-white transition-transform group-hover:translate-x-1"
                >
                  ↗
                </span>
              </a>
            </li>
            <li className="border-t border-b border-white/10 py-5">
              <a
                href="https://github.com/klaps-hq"
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-baseline justify-between gap-4"
              >
                <span className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Organizacja
                  </span>
                  <span className="text-base md:text-lg text-white group-hover:text-white/80 transition-colors">
                    github.com/klaps-hq
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-white/40 group-hover:text-white transition-transform group-hover:translate-x-1"
                >
                  ↗
                </span>
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-20 md:pt-28 pb-24 md:pb-32">
        <div className="flex flex-col items-start gap-8 md:gap-10 max-w-[60ch]">
          <p className="text-xl md:text-2xl lg:text-3xl leading-[1.3] -tracking-[0.01em] text-white/85">
            Jeśli kiedykolwiek żałowałeś, że dowiedziałeś się o&nbsp;pokazie
            ulubionego filmu dzień po seansie, Klaps jest właśnie dla Ciebie.
          </p>
          <Link
            href="/seanse"
            className="group inline-flex items-center gap-4 text-xs md:text-sm uppercase tracking-[0.28em] text-white border border-white/25 hover:border-white hover:bg-white/[0.04] px-8 md:px-10 py-4 md:py-5 transition-colors"
          >
            Zobacz repertuar
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default AboutPage;

import React from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading from "@/components/ui/page-heading";
import SiteHeader from "@/components/common/site-header";
import Footer from "../(home)/_components/footer";

interface ManifestoItem {
  n: string;
  title: string;
  body: string;
}

interface RepoItem {
  label: string;
  href: string;
  handle: string;
  stack: string;
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
    body: "Interfejs ma pomagać, nie rozpraszać. Bez nadmiaru bodźców. Sprawdzasz, co gra, idziesz do kina, wychodzisz ze strony.",
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
  "Recenzje redakcyjne",
  "Rankingi popularności",
  "Algorytmiczne rekomendacje",
];

const AUDIENCE = [
  "Osoby zainteresowane kinem klasycznym i historią filmu",
  "Widzowie chcący wychodzić do kina częściej",
  "Osoby nieśledzące na bieżąco repertuarów poszczególnych kin",
  "Mieszkańcy mniejszych miast, gdzie informacje o seansach są trudniej dostępne",
  "Widzowie zmęczeni algorytmicznym podawaniem treści",
];

const REPOS: RepoItem[] = [
  {
    label: "Frontend",
    stack: "Next.js",
    href: "https://github.com/klaps-hq/klaps.space",
    handle: "klaps-hq/klaps.space",
  },
  {
    label: "Backend",
    stack: "NestJS",
    href: "https://github.com/klaps-hq/api.klaps.space",
    handle: "klaps-hq/api.klaps.space",
  },
  {
    label: "Organizacja",
    stack: "GitHub",
    href: "https://github.com/klaps-hq",
    handle: "klaps-hq",
  },
];

const AboutPage = () => {
  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-4">
        <Breadcrumbs items={[{ name: "O projekcie", href: "/o-projekcie" }]} />
      </div>

      <header className="px-6 md:px-12 lg:px-16 pt-6 md:pt-10 pb-14 md:pb-20">
        <PageHeading variant="display">Klaps</PageHeading>
        <p className="mt-10 md:mt-14 max-w-[58ch] text-lg md:text-2xl lg:text-3xl text-white/75 leading-[1.4] -tracking-[0.005em]">
          Niezależny, ogólnopolski przewodnik po repertuarze kinowym, skupiony
          na seansach specjalnych, klasyce i&nbsp;filmach spoza komercyjnego
          obiegu.
        </p>
      </header>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-14 md:pt-20 pb-14 md:pb-20">
        <h2 className="mb-10 md:mb-14 text-3xl md:text-5xl lg:text-6xl leading-[1] -tracking-[0.03em] text-white font-medium">
          Czym jest Klaps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 lg:gap-x-16 gap-y-8 text-base md:text-lg text-white/65 leading-relaxed">
          <p>
            Klaps zbiera informacje o&nbsp;pokazach organizowanych przez kina
            studyjne i&nbsp;wybrane kina sieciowe. Wszędzie tam, gdzie stare
            filmy, retrospektywy i&nbsp;wznowienia wracają na duży ekran.
          </p>
          <p>
            Projekt nie konkuruje z&nbsp;dużymi portalami filmowymi ani nie
            tworzy kolejnej bazy danych filmów. Nie ma recenzji redakcyjnych
            ani rekomendacji algorytmicznych. Klaps pełni rolę jednego,
            spójnego miejsca: sprawdzasz, co gra, planujesz wyjście, idziesz
            do kina.
          </p>
          <p>
            Koncentrujemy się na seansach, które łatwo przegapić: pojedyncze
            pokazy, krótkie przeglądy, retrospektywy reżyserskie, wznowienia
            klasyków i&nbsp;wydarzenia specjalne. Repertuar, który ginie wśród
            premier i&nbsp;masowych tytułów.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-14 md:pt-20 pb-14 md:pb-20">
        <h2 className="mb-10 md:mb-14 text-3xl md:text-5xl lg:text-6xl leading-[1] -tracking-[0.03em] text-white font-medium">
          Manifest
        </h2>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 lg:gap-x-14 gap-y-10 md:gap-y-12">
          {MANIFESTO.map((item) => (
            <li key={item.n} className="flex flex-col">
              <span className="text-4xl md:text-5xl lg:text-6xl font-light tabular-nums text-white/15 -tracking-[0.03em] leading-none">
                {item.n}
              </span>
              <h3 className="mt-4 md:mt-5 text-lg md:text-xl font-medium text-white -tracking-[0.01em] leading-tight">
                {item.title}
              </h3>
              <p className="mt-3 text-sm md:text-base text-white/55 leading-relaxed max-w-[40ch]">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-14 md:pt-20 pb-14 md:pb-20">
        <h2 className="mb-8 md:mb-10 text-3xl md:text-5xl lg:text-6xl leading-[1] -tracking-[0.03em] text-white font-medium">
          Zakres
        </h2>
        <p className="mb-12 md:mb-16 max-w-[72ch] text-base md:text-xl text-white/70 leading-relaxed">
          Granica jest prosta: jeśli film można obejrzeć w&nbsp;każdym
          multipleksie przez najbliższe trzy tygodnie, Klaps się nim nie
          zajmuje. Jeśli wyświetlany jest przez jeden wieczór w&nbsp;trzech
          kinach w&nbsp;Polsce, wtedy właśnie Klaps jest potrzebny.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
          <ul className="flex flex-col gap-3">
            {SCOPE_INCLUDED.map((item) => (
              <li
                key={item}
                className="flex items-baseline gap-3 text-base md:text-lg text-white/85 leading-snug"
              >
                <span aria-hidden="true" className="shrink-0 text-white/40">
                  +
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-3">
            {SCOPE_EXCLUDED.map((item) => (
              <li
                key={item}
                className="flex items-baseline gap-3 text-base md:text-lg text-white/40 leading-snug"
              >
                <span aria-hidden="true" className="shrink-0 text-white/25">
                  −
                </span>
                <span className="line-through decoration-white/15">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-14 md:pt-20 pb-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <h2 className="lg:col-span-4 text-3xl md:text-5xl lg:text-6xl leading-[1] -tracking-[0.03em] text-white font-medium">
            Źródła danych
          </h2>
          <div className="lg:col-span-8 flex flex-col gap-5 max-w-[68ch] text-base md:text-lg text-white/65 leading-relaxed">
            <p>
              Repertuar pozyskujemy z&nbsp;publicznie dostępnych źródeł kin,
              które regularnie organizują pokazy specjalne, retrospektywy
              i&nbsp;wznowienia. Nie korzystamy z&nbsp;zamkniętych baz danych
              ani komercyjnych API. Klaps zbiera informacje w&nbsp;jednym
              miejscu i&nbsp;pokazuje je w&nbsp;ujednoliconej formie.
            </p>
            <p>
              Nie sprzedajemy biletów ani nie pośredniczymy
              w&nbsp;rezerwacjach. Klaps to informator. Pokazujemy, gdzie
              i&nbsp;kiedy odbywa się dany seans, a&nbsp;zakup biletu odbywa
              się bezpośrednio na stronie kina.
            </p>
            <p>
              Lista obsługiwanych kin jest stale rozwijana. Jeśli znasz kino,
              które powinno się znaleźć w&nbsp;serwisie,{" "}
              <Link
                href="/kontakt"
                className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors"
              >
                napisz do nas
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-14 md:pt-20 pb-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <h2 className="lg:col-span-4 text-3xl md:text-5xl lg:text-6xl leading-[1] -tracking-[0.03em] text-white font-medium">
            Aktualizacje
          </h2>
          <div className="lg:col-span-8 flex flex-col gap-5 max-w-[68ch] text-base md:text-lg text-white/65 leading-relaxed">
            <p>
              Repertuar jest aktualizowany regularnie, tak by dane były jak
              najbardziej zbliżone do rzeczywistego stanu. Częstotliwość zależy
              od źródła. Niektóre kina publikują repertuar z&nbsp;tygodniowym
              wyprzedzeniem, inne dziennym.
            </p>
            <p>
              Mimo regularnych aktualizacji mogą zdarzyć się rozbieżności
              między danymi w&nbsp;Klapsie a&nbsp;aktualnym repertuarem kina.
              Przed wizytą warto sprawdzić szczegóły seansu bezpośrednio na
              stronie kina.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-14 md:pt-20 pb-14 md:pb-20">
        <h2 className="mb-10 md:mb-14 text-3xl md:text-5xl lg:text-6xl leading-[1] -tracking-[0.03em] text-white font-medium">
          Dla kogo
        </h2>
        <ul className="flex flex-col">
          {AUDIENCE.map((item) => (
            <li
              key={item}
              className="border-t border-white/10 last:border-b py-5 md:py-6 text-xl md:text-2xl lg:text-3xl text-white/85 -tracking-[0.01em] leading-snug"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-14 md:pt-20 pb-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4">
            <h2 className="text-3xl md:text-5xl lg:text-6xl leading-[1] -tracking-[0.03em] text-white font-medium">
              Open source
            </h2>
            <p className="mt-6 md:mt-8 max-w-[44ch] text-base md:text-lg text-white/65 leading-relaxed">
              Klaps powstaje publicznie. Frontend i&nbsp;backend są open
              source, kod możesz przeczytać, sklonować, zgłosić problem albo
              zaproponować zmianę. Scraper pobierający dane z&nbsp;kin
              pozostaje zamknięty z&nbsp;przyczyn prawnych.
            </p>
          </div>
          <ul className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {REPOS.map((repo) => (
              <li key={repo.handle}>
                <a
                  href={repo.href}
                  target="_blank"
                  rel="noreferrer noopener nofollow"
                  className="group flex h-full flex-col justify-between gap-8 p-6 md:p-7 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xl md:text-2xl font-medium text-white -tracking-[0.01em]">
                      {repo.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-white/40 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      ↗
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">
                      {repo.stack}
                    </span>
                    <span className="text-sm md:text-base text-white/70 break-all">
                      {repo.handle}
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-20 md:pt-28 pb-24 md:pb-32">
        <p className="max-w-[26ch] text-3xl md:text-5xl lg:text-6xl leading-[1.05] -tracking-[0.02em] text-white font-medium">
          Jeśli kiedykolwiek żałowałeś, że dowiedziałeś się o&nbsp;pokazie
          ulubionego filmu dzień po seansie, Klaps jest właśnie dla Ciebie.
        </p>
        <Link
          href="/seanse"
          className="group mt-12 md:mt-16 inline-flex items-center gap-4 text-xs md:text-sm uppercase tracking-[0.28em] text-white border border-white/25 hover:border-white hover:bg-white/[0.04] px-8 md:px-10 py-4 md:py-5 transition-colors"
        >
          Zobacz repertuar
          <span
            aria-hidden="true"
            className="transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </section>

      <Footer />
    </main>
  );
};

export default AboutPage;

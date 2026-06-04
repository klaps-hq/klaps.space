import React from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import SiteHeader from "@/components/common/site-header";
import Footer from "../(home)/_components/footer";
import { CONTACT_EMAIL, SITE_DOMAIN } from "@/constants";

interface LegalSection {
  id: string;
  title: string;
  body: React.ReactNode;
}

const Term: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <strong className="font-medium text-white">{children}</strong>
);

const SECTIONS: LegalSection[] = [
  {
    id: "postanowienia-ogolne",
    title: "Postanowienia ogólne",
    body: (
      <>
        <p>
          Niniejszy regulamin określa zasady korzystania z&nbsp;serwisu
          internetowego Klaps, dostępnego pod adresem {SITE_DOMAIN}.
        </p>
        <p>
          Serwis Klaps jest projektem niezależnym, prowadzonym
          niekomercyjnie. Jego celem jest agregowanie i&nbsp;udostępnianie
          informacji o&nbsp;seansach specjalnych, klasyce filmowej oraz
          retrospektywach organizowanych przez kina studyjne i&nbsp;wybrane
          kina sieciowe w&nbsp;Polsce.
        </p>
        <p>
          Korzystanie z&nbsp;serwisu jest bezpłatne i&nbsp;nie wymaga
          rejestracji. Korzystając z&nbsp;serwisu, użytkownik akceptuje
          postanowienia niniejszego regulaminu.
        </p>
      </>
    ),
  },
  {
    id: "definicje",
    title: "Definicje",
    body: (
      <>
        <p>
          <Term>Serwis</Term> oznacza stronę internetową Klaps dostępną pod
          adresem {SITE_DOMAIN} wraz ze wszystkimi jej podstronami.
        </p>
        <p>
          <Term>Użytkownik</Term> oznacza każdą osobę korzystającą
          z&nbsp;serwisu, niezależnie od sposobu i&nbsp;zakresu korzystania.
        </p>
        <p>
          <Term>Repertuar</Term> oznacza informacje o&nbsp;seansach filmowych
          prezentowane w&nbsp;serwisie, pozyskiwane z&nbsp;publicznie
          dostępnych źródeł.
        </p>
        <p>
          <Term>Kino</Term> oznacza obiekt kinowy, którego repertuar jest
          prezentowany w&nbsp;serwisie.
        </p>
      </>
    ),
  },
  {
    id: "zasady-korzystania",
    title: "Zasady korzystania",
    body: (
      <>
        <p>
          Użytkownik może korzystać z&nbsp;serwisu wyłącznie w&nbsp;sposób
          zgodny z&nbsp;jego przeznaczeniem, to znaczy w&nbsp;celu
          przeglądania informacji o&nbsp;seansach filmowych i&nbsp;kinach.
        </p>
        <p>
          Zabronione jest wykorzystywanie serwisu w&nbsp;sposób naruszający
          obowiązujące przepisy prawa, prawa osób trzecich lub dobre
          obyczaje. W&nbsp;szczególności zabronione jest automatyczne
          pobieranie danych z&nbsp;serwisu (scraping) bez uprzedniej zgody.
        </p>
        <p>
          Serwis nie wymaga zakładania konta ani podawania danych osobowych.
          Użytkownik korzysta z&nbsp;serwisu anonimowo.
        </p>
      </>
    ),
  },
  {
    id: "dane-i-zrodla",
    title: "Dane i źródła",
    body: (
      <>
        <p>
          Informacje prezentowane w&nbsp;serwisie pochodzą z&nbsp;publicznie
          dostępnych źródeł, w&nbsp;szczególności ze stron internetowych
          kin. Serwis nie jest oficjalnym źródłem repertuaru żadnego kina.
        </p>
        <p>
          Dane w&nbsp;serwisie mogą różnić się od aktualnego stanu
          repertuaru danego kina. Przed wizytą w&nbsp;kinie zalecamy
          sprawdzenie informacji bezpośrednio na stronie internetowej kina.
        </p>
        <p>
          Serwis nie ponosi odpowiedzialności za aktualność, kompletność ani
          dokładność prezentowanych danych. Informacje mają charakter
          wyłącznie poglądowy i&nbsp;informacyjny.
        </p>
      </>
    ),
  },
  {
    id: "odpowiedzialnosc",
    title: "Odpowiedzialność",
    body: (
      <>
        <p>
          Serwis jest udostępniany w&nbsp;stanie, w&nbsp;jakim się znajduje
          (as is), bez jakichkolwiek gwarancji, wyraźnych lub
          dorozumianych.
        </p>
        <p>
          Twórcy serwisu nie ponoszą odpowiedzialności za szkody wynikające
          z&nbsp;korzystania z&nbsp;serwisu lub niemożności korzystania
          z&nbsp;niego, w&nbsp;tym za decyzje podjęte na podstawie
          informacji prezentowanych w&nbsp;serwisie.
        </p>
        <p>
          Serwis nie pośredniczy w&nbsp;sprzedaży biletów ani rezerwacji
          miejsc. Wszelkie transakcje związane z&nbsp;zakupem biletów
          odbywają się bezpośrednio między użytkownikiem a&nbsp;kinem.
        </p>
      </>
    ),
  },
  {
    id: "prawa-autorskie",
    title: "Prawa autorskie",
    body: (
      <>
        <p>
          Układ graficzny serwisu, logo, teksty oraz pozostałe elementy
          twórcze stanowią własność twórców serwisu i&nbsp;podlegają
          ochronie prawnej.
        </p>
        <p>
          Informacje o&nbsp;filmach prezentowane w&nbsp;serwisie,
          w&nbsp;tym opisy i&nbsp;plakaty, stanowią własność ich
          odpowiednich właścicieli i&nbsp;są wykorzystywane wyłącznie
          w&nbsp;celach informacyjnych.
        </p>
        <p>
          Kopiowanie, rozpowszechnianie lub wykorzystywanie treści serwisu
          w&nbsp;celach komercyjnych bez zgody twórców jest zabronione.
        </p>
      </>
    ),
  },
  {
    id: "zmiany-regulaminu",
    title: "Zmiany regulaminu",
    body: (
      <>
        <p>
          Twórcy serwisu zastrzegają sobie prawo do zmiany niniejszego
          regulaminu w&nbsp;dowolnym czasie. Zmiany wchodzą w&nbsp;życie
          z&nbsp;chwilą opublikowania zaktualizowanej wersji regulaminu na
          stronie serwisu.
        </p>
        <p>
          Dalsze korzystanie z&nbsp;serwisu po wprowadzeniu zmian oznacza
          akceptację zaktualizowanego regulaminu. Zalecamy regularne
          zapoznawanie się z&nbsp;treścią regulaminu.
        </p>
      </>
    ),
  },
  {
    id: "postanowienia-koncowe",
    title: "Postanowienia końcowe",
    body: (
      <>
        <p>
          W&nbsp;sprawach nieuregulowanych niniejszym regulaminem
          zastosowanie mają odpowiednie przepisy prawa polskiego.
        </p>
        <p>
          Wszelkie pytania, uwagi oraz zgłoszenia dotyczące regulaminu lub
          działania serwisu prosimy kierować na adres e-mail:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
        <p>
          Regulamin obowiązuje od dnia jego opublikowania na stronie
          serwisu.
        </p>
      </>
    ),
  },
];

const TermsPage = () => {
  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-4">
        <Breadcrumbs items={[{ name: "Regulamin", href: "/regulamin" }]} />
      </div>

      <header className="px-6 md:px-12 lg:px-16 pt-6 md:pt-10 pb-14 md:pb-20">
        <h1 className="text-5xl md:text-8xl lg:text-9xl xl:text-[10rem] font-medium uppercase -tracking-[0.04em] leading-[0.9] text-white">
          Regulamin
        </h1>
        <p className="mt-10 md:mt-14 max-w-[58ch] text-lg md:text-2xl lg:text-3xl text-white/75 leading-[1.4] -tracking-[0.005em]">
          Zasady korzystania z&nbsp;serwisu, granice odpowiedzialności
          i&nbsp;prawa autorskie do prezentowanych treści.
        </p>
      </header>

      {SECTIONS.map((section, i) => (
        <section
          key={section.id}
          id={section.id}
          className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-14 md:pt-20 pb-14 md:pb-20 scroll-mt-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 md:gap-y-12 gap-x-6 lg:gap-x-8">
            <div className="lg:col-span-4">
              <span className="block text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/35 tabular-nums leading-none mb-3 md:mb-4">
                § {i + 1}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] text-white font-medium">
                {section.title}
              </h2>
            </div>
            <div className="lg:col-span-8 flex flex-col gap-5 max-w-[68ch] text-base md:text-lg text-white/65 leading-relaxed [&_a]:text-white [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-white/30 [&_a]:transition-colors [&_a:hover]:decoration-white">
              {section.body}
            </div>
          </div>
        </section>
      ))}

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-20 md:pt-28 pb-24 md:pb-32">
        <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40">
          Dokumenty powiązane
        </p>
        <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 max-w-[60ch]">
          <Link
            href="/polityka-prywatnosci"
            className="group flex items-baseline justify-between gap-4 p-5 md:p-6 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
          >
            <span className="text-lg md:text-xl text-white -tracking-[0.01em]">
              Polityka prywatności
            </span>
            <span
              aria-hidden="true"
              className="text-white/40 group-hover:text-white transition-transform group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
          <Link
            href="/kontakt"
            className="group flex items-baseline justify-between gap-4 p-5 md:p-6 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
          >
            <span className="text-lg md:text-xl text-white -tracking-[0.01em]">
              Kontakt
            </span>
            <span
              aria-hidden="true"
              className="text-white/40 group-hover:text-white transition-transform group-hover:translate-x-1"
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

export default TermsPage;

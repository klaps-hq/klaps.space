import React from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import SiteHeader from "@/components/common/site-header";
import Footer from "../(home)/_components/footer";
import { CONTACT_EMAIL } from "@/constants";

interface FaqQuestion {
  q: string;
  a: React.ReactNode;
}

interface FaqSectionData {
  id: string;
  title: string;
  questions: FaqQuestion[];
}

const FAQ: FaqSectionData[] = [
  {
    id: "seanse-i-repertuar",
    title: "Seanse i repertuar",
    questions: [
      {
        q: "Skąd pochodzą informacje o seansach?",
        a: (
          <p>
            Informacje o&nbsp;seansach są pozyskiwane automatycznie
            z&nbsp;publicznie dostępnych źródeł kin. Dane są regularnie
            aktualizowane, aby zapewnić jak największą dokładność.
          </p>
        ),
      },
      {
        q: "Jak często aktualizowany jest repertuar?",
        a: (
          <p>
            Repertuar jest aktualizowany regularnie, mniej więcej raz
            w&nbsp;tygodniu. Częstotliwość zależy od tego, kiedy poszczególne
            kina publikują swoje repertuary.
          </p>
        ),
      },
      {
        q: "Czy wszystkie seanse w serwisie to seanse specjalne?",
        a: (
          <p>
            Tak. Klaps koncentruje się wyłącznie na seansach specjalnych,
            takich jak pokazy klasyki filmowej, retrospektywy, pokazy
            z&nbsp;cykli tematycznych oraz inne wyjątkowe wydarzenia kinowe.
            Nie prezentujemy standardowego repertuaru komercyjnego.
          </p>
        ),
      },
      {
        q: "Co zrobić, jeśli informacje o seansie są nieaktualne?",
        a: (
          <p>
            Zawsze rekomendujemy weryfikację szczegółów seansu (data, godzina,
            cena) bezpośrednio na stronie kina. Jeśli zauważysz błąd, możesz
            skontaktować się z&nbsp;nami przez{" "}
            <Link href="/kontakt">stronę kontaktową</Link>.
          </p>
        ),
      },
      {
        q: "Czy mogę filtrować seanse według gatunku lub daty?",
        a: (
          <p>
            Tak. Serwis umożliwia filtrowanie seansów po mieście, kinie,
            gatunku filmowym oraz dacie. Filtry są dostępne na stronie
            seansów.
          </p>
        ),
      },
    ],
  },
  {
    id: "kina-i-miasta",
    title: "Kina i miasta",
    questions: [
      {
        q: "Jakie kina są uwzględnione w serwisie?",
        a: (
          <p>
            Serwis obejmuje kina studyjne oraz wybrane kina sieciowe
            w&nbsp;całej Polsce, które organizują seanse specjalne, pokazy
            klasyki filmowej lub retrospektywy.
          </p>
        ),
      },
      {
        q: "Czy mogę zaproponować dodanie kina do serwisu?",
        a: (
          <p>
            Tak. Jeśli znasz kino, które organizuje seanse specjalne
            i&nbsp;nie jest jeszcze uwzględnione w&nbsp;serwisie, skontaktuj
            się z&nbsp;nami przez{" "}
            <Link href="/kontakt">stronę kontaktową</Link>. Rozpatrzymy każde
            zgłoszenie.
          </p>
        ),
      },
      {
        q: "Jak mogę przeglądać kina w moim mieście?",
        a: (
          <p>
            Możesz wybrać swoje miasto z&nbsp;listy rozwijanej w&nbsp;nagłówku
            strony lub przejść do zakładki Miasta, gdzie znajdziesz pełną
            listę miast z&nbsp;informacjami o&nbsp;dostępnych kinach
            i&nbsp;seansach.
          </p>
        ),
      },
      {
        q: "Ile miast jest dostępnych w serwisie?",
        a: (
          <p>
            Liczba miast stale rośnie. Aktualną listę wszystkich dostępnych
            miast znajdziesz na stronie <Link href="/miasta">Miasta</Link>.
          </p>
        ),
      },
    ],
  },
  {
    id: "bilety",
    title: "Bilety",
    questions: [
      {
        q: "Czy mogę kupić bilety przez Klaps?",
        a: (
          <p>
            Nie. Klaps nie pośredniczy w&nbsp;sprzedaży biletów ani
            rezerwacji miejsc. Serwis wyłącznie agreguje i&nbsp;prezentuje
            informacje o&nbsp;seansach.
          </p>
        ),
      },
      {
        q: "Jak mogę kupić bilet na seans?",
        a: (
          <p>
            Aby kupić bilet, sprawdź szczegóły seansu bezpośrednio na stronie
            danego kina. Zakup odbywa się wyłącznie między Tobą
            a&nbsp;kinem.
          </p>
        ),
      },
      {
        q: "Czy ceny biletów podane w serwisie są aktualne?",
        a: (
          <p>
            Serwis Klaps nie prezentuje cen biletów. Informacje
            o&nbsp;cenach dostępne są bezpośrednio na stronach poszczególnych
            kin.
          </p>
        ),
      },
    ],
  },
  {
    id: "kwestie-techniczne",
    title: "Kwestie techniczne",
    questions: [
      {
        q: "Jak zmienić wybrane miasto?",
        a: (
          <p>
            Miasto możesz zmienić w&nbsp;każdej chwili, korzystając
            z&nbsp;listy rozwijanej w&nbsp;nagłówku strony. Twój wybór
            zostanie zapamiętany w&nbsp;przeglądarce, dzięki czemu przy
            kolejnej wizycie serwis automatycznie wyświetli seanse
            z&nbsp;Twojego miasta.
          </p>
        ),
      },
      {
        q: "Czy serwis działa na urządzeniach mobilnych?",
        a: (
          <p>
            Tak. Serwis jest w&nbsp;pełni responsywny i&nbsp;dostosowany do
            korzystania na telefonach, tabletach oraz komputerach.
          </p>
        ),
      },
      {
        q: "Dlaczego strona nie wyświetla się poprawnie?",
        a: (
          <p>
            Upewnij się, że korzystasz z&nbsp;aktualnej wersji przeglądarki.
            Serwis działa najlepiej w&nbsp;przeglądarkach Chrome, Firefox,
            Safari i&nbsp;Edge. Jeśli problem nadal występuje, napisz na{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        ),
      },
      {
        q: "Czy mogę zaproponować nową funkcję?",
        a: (
          <p>
            Chętnie wysłuchamy Twoich sugestii. Skontaktuj się
            z&nbsp;nami przez <Link href="/kontakt">stronę kontaktową</Link>{" "}
            lub bezpośrednio na adres{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        ),
      },
    ],
  },
];

const FaqPage = () => {
  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-4">
        <Breadcrumbs items={[{ name: "FAQ", href: "/faq" }]} />
      </div>

      <header className="px-6 md:px-12 lg:px-16 pt-6 md:pt-10 pb-14 md:pb-20">
        <h1 className="text-5xl md:text-8xl lg:text-9xl font-medium uppercase -tracking-[0.04em] leading-[0.9] text-white">
          FAQ
        </h1>
        <p className="mt-10 md:mt-14 max-w-[58ch] text-lg md:text-2xl lg:text-3xl text-white/75 leading-[1.4] -tracking-[0.005em]">
          Najczęściej zadawane pytania o&nbsp;działaniu serwisu, danych
          o&nbsp;seansach i&nbsp;kinach.
        </p>
      </header>

      {FAQ.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-14 md:pt-20 pb-14 md:pb-20 scroll-mt-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <h2 className="lg:col-span-4 text-3xl md:text-5xl lg:text-6xl leading-[1] -tracking-[0.03em] text-white font-medium">
              {section.title}
            </h2>
            <ul className="lg:col-span-8 flex flex-col">
              {section.questions.map((qa) => (
                <li key={qa.q}>
                  <details className="group border-t border-white/10 first:border-t-0 py-5 md:py-6 [&_a]:text-white [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-white/30 [&_a]:transition-colors [&_a:hover]:decoration-white">
                    <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
                      <span className="text-lg md:text-xl lg:text-2xl text-white -tracking-[0.01em] leading-snug">
                        {qa.q}
                      </span>
                      <span
                        aria-hidden="true"
                        className="shrink-0 text-2xl md:text-3xl font-light text-white/40 leading-none mt-1 group-open:rotate-45 transition-transform duration-300"
                      >
                        +
                      </span>
                    </summary>
                    <div className="mt-5 max-w-[68ch] text-base md:text-lg text-white/65 leading-relaxed">
                      {qa.a}
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-20 md:pt-28 pb-24 md:pb-32">
        <p className="text-3xl md:text-5xl lg:text-6xl leading-[1.05] -tracking-[0.02em] text-white font-medium">
          Nie znalazłeś odpowiedzi?
          <br />
          <span className="whitespace-nowrap">Napisz do&nbsp;nas.</span>
        </p>
        <p className="mt-6 md:mt-8 max-w-[64ch] text-base md:text-lg lg:text-xl text-white/65 leading-relaxed">
          Każde zgłoszenie czytamy osobiście i&nbsp;odpowiadamy zwykle
          w&nbsp;ciągu kilku dni roboczych. Jeśli czegoś brakuje, coś nie
          działa albo masz pomysł na nową funkcję, daj znać. Pomyłki, błędy
          w&nbsp;danych i&nbsp;propozycje nowych kin też są mile widziane.
        </p>
        <Link
          href="/kontakt"
          className="group mt-10 md:mt-12 inline-flex items-center gap-4 text-xs md:text-sm uppercase tracking-[0.28em] text-white border border-white/25 hover:border-white hover:bg-white/[0.04] px-8 md:px-10 py-4 md:py-5 transition-colors"
        >
          Kontakt
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

export default FaqPage;

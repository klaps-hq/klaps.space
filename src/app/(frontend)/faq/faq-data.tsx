import React from "react";
import Link from "next/link";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/constants";

export interface FaqQuestion {
  q: string;
  /** Answer rendered on the page (with links). */
  a: React.ReactNode;
  /**
   * Plain-text answer for FAQPage JSON-LD - must match the content
   * visible on the page (Google guidelines for structured data).
   */
  aText: string;
}

export interface FaqSectionData {
  id: string;
  title: string;
  questions: FaqQuestion[];
}

export const FAQ_SECTIONS: FaqSectionData[] = [
  {
    id: "kino-studyjne",
    title: "Kino studyjne i seanse specjalne",
    questions: [
      {
        q: "Czym jest kino studyjne?",
        a: (
          <p>
            Kino studyjne to kino o&nbsp;profilu artystycznym, które obok
            premier pokazuje przede wszystkim klasykę filmową, kino autorskie
            i&nbsp;dokumenty. Zwykle prowadzi własny, starannie układany
            program: retrospektywy, cykle tematyczne oraz pokazy
            z&nbsp;prelekcjami i&nbsp;dyskusjami. Pełną listę takich miejsc
            znajdziesz na stronie <Link href="/kina">Kina</Link>.
          </p>
        ),
        aText:
          "Kino studyjne to kino o profilu artystycznym, które obok premier pokazuje przede wszystkim klasykę filmową, kino autorskie i dokumenty. Zwykle prowadzi własny, starannie układany program: retrospektywy, cykle tematyczne oraz pokazy z prelekcjami i dyskusjami.",
      },
      {
        q: "Czym kino studyjne różni się od multipleksu?",
        a: (
          <p>
            Multipleks koncentruje się na bieżących premierach
            i&nbsp;masowym repertuarze. Kino studyjne stawia na program
            autorski: wznowienia klasyki, filmy spoza komercyjnego obiegu
            i&nbsp;wydarzenia towarzyszące, takie jak spotkania
            z&nbsp;twórcami czy dyskusje po seansie.
          </p>
        ),
        aText:
          "Multipleks koncentruje się na bieżących premierach i masowym repertuarze. Kino studyjne stawia na program autorski: wznowienia klasyki, filmy spoza komercyjnego obiegu i wydarzenia towarzyszące, takie jak spotkania z twórcami czy dyskusje po seansie.",
      },
      {
        q: "Co to jest seans specjalny?",
        a: (
          <p>
            Seans specjalny to pokaz wykraczający poza codzienny repertuar
            premierowy: wznowienie klasyki, pokaz archiwalny, projekcja
            z&nbsp;prelekcją, maraton filmowy albo seans w&nbsp;ramach cyklu
            tematycznego. Często odbywa się tylko raz lub kilka razy, dlatego
            łatwo go przegapić. Aktualne pokazy zbieramy na stronie{" "}
            <Link href="/seanse">Seanse</Link>.
          </p>
        ),
        aText:
          "Seans specjalny to pokaz wykraczający poza codzienny repertuar premierowy: wznowienie klasyki, pokaz archiwalny, projekcja z prelekcją, maraton filmowy albo seans w ramach cyklu tematycznego. Często odbywa się tylko raz lub kilka razy, dlatego łatwo go przegapić. Aktualne pokazy zbieramy na stronie Seanse.",
      },
      {
        q: "Co to jest retrospektywa?",
        a: (
          <p>
            Retrospektywa to cykl pokazów przybliżający dorobek jednego
            reżysera, aktora albo nurtu filmowego. Kina studyjne organizują
            retrospektywy regularnie. To okazja, żeby zobaczyć na dużym
            ekranie filmy, których od lat nie było w&nbsp;repertuarach.
          </p>
        ),
        aText:
          "Retrospektywa to cykl pokazów przybliżający dorobek jednego reżysera, aktora albo nurtu filmowego. Kina studyjne organizują retrospektywy regularnie. To okazja, żeby zobaczyć na dużym ekranie filmy, których od lat nie było w repertuarach.",
      },
      {
        q: "Gdzie obejrzeć stare filmy w kinie?",
        a: (
          <p>
            Stare filmy regularnie wracają na ekrany kin studyjnych
            w&nbsp;ramach retrospektyw, wznowień i&nbsp;cykli klasyki. Klaps
            zbiera takie seanse z&nbsp;całej Polski w&nbsp;jednym miejscu:
            wybierz swoje miasto na stronie{" "}
            <Link href="/miasta">Miasta</Link> i&nbsp;sprawdź, co aktualnie
            grają.
          </p>
        ),
        aText:
          "Stare filmy regularnie wracają na ekrany kin studyjnych w ramach retrospektyw, wznowień i cykli klasyki. Klaps zbiera takie seanse z całej Polski w jednym miejscu: wybierz swoje miasto na stronie Miasta i sprawdź, co aktualnie grają.",
      },
    ],
  },
  {
    id: "o-serwisie",
    title: "O serwisie",
    questions: [
      {
        q: "Czym jest Klaps?",
        a: (
          <p>
            Klaps to niezależny serwis internetowy, który agreguje informacje
            o&nbsp;seansach specjalnych, klasyce filmowej
            i&nbsp;retrospektywach w&nbsp;kinach studyjnych na terenie całej
            Polski. Więcej przeczytasz na stronie{" "}
            <Link href="/o-projekcie">O&nbsp;projekcie</Link>.
          </p>
        ),
        aText:
          "Klaps to niezależny serwis internetowy, który agreguje informacje o seansach specjalnych, klasyce filmowej i retrospektywach w kinach studyjnych na terenie całej Polski.",
      },
      {
        q: "Czy korzystanie z serwisu jest bezpłatne?",
        a: (
          <p>
            Tak. Klaps jest projektem niekomercyjnym i&nbsp;w&nbsp;pełni
            bezpłatnym. Nie wymaga rejestracji, logowania ani podawania
            jakichkolwiek danych osobowych.
          </p>
        ),
        aText:
          "Tak. Klaps jest projektem niekomercyjnym i w pełni bezpłatnym. Nie wymaga rejestracji, logowania ani podawania jakichkolwiek danych osobowych.",
      },
      {
        q: "Kto stoi za projektem Klaps?",
        a: (
          <p>
            Klaps jest projektem niezależnym, tworzonym z&nbsp;pasji do kina
            studyjnego. Nie jest powiązany z&nbsp;żadnym kinem, dystrybutorem
            ani siecią kinową.
          </p>
        ),
        aText:
          "Klaps jest projektem niezależnym, tworzonym z pasji do kina studyjnego. Nie jest powiązany z żadnym kinem, dystrybutorem ani siecią kinową.",
      },
      {
        q: "Czy muszę się rejestrować, żeby korzystać z serwisu?",
        a: (
          <p>
            Nie. Serwis nie wymaga rejestracji ani zakładania konta. Wszystkie
            funkcje są dostępne od razu po wejściu na stronę.
          </p>
        ),
        aText:
          "Nie. Serwis nie wymaga rejestracji ani zakładania konta. Wszystkie funkcje są dostępne od razu po wejściu na stronę.",
      },
      {
        q: "Jak mogę się z Wami skontaktować?",
        a: (
          <p>
            Najwygodniej przez <Link href="/kontakt">stronę kontaktową</Link>{" "}
            lub e-mail:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            Znajdziesz nas też na profilach:{" "}
            <a href={SOCIAL_LINKS.threads} rel="noreferrer noopener" target="_blank">
              Threads
            </a>
            ,{" "}
            <a href={SOCIAL_LINKS.x} rel="noreferrer noopener" target="_blank">
              X
            </a>
            ,{" "}
            <a href={SOCIAL_LINKS.instagram} rel="noreferrer noopener" target="_blank">
              Instagram
            </a>{" "}
            i{" "}
            <a href={SOCIAL_LINKS.facebook} rel="noreferrer noopener" target="_blank">
              Facebook
            </a>
            .
          </p>
        ),
        aText:
          "Najwygodniej przez stronę kontaktową lub e-mail: kontakt@klaps.space. Znajdziesz nas też na profilach: Threads, X, Instagram i Facebook.",
      },
    ],
  },
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
        aText:
          "Informacje o seansach są pozyskiwane automatycznie z publicznie dostępnych źródeł kin. Dane są regularnie aktualizowane, aby zapewnić jak największą dokładność.",
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
        aText:
          "Repertuar jest aktualizowany regularnie, mniej więcej raz w tygodniu. Częstotliwość zależy od tego, kiedy poszczególne kina publikują swoje repertuary.",
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
        aText:
          "Tak. Klaps koncentruje się wyłącznie na seansach specjalnych, takich jak pokazy klasyki filmowej, retrospektywy, pokazy z cykli tematycznych oraz inne wyjątkowe wydarzenia kinowe. Nie prezentujemy standardowego repertuaru komercyjnego.",
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
        aText:
          "Zawsze rekomendujemy weryfikację szczegółów seansu (data, godzina, cena) bezpośrednio na stronie kina. Jeśli zauważysz błąd, możesz skontaktować się z nami przez stronę kontaktową.",
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
        aText:
          "Tak. Serwis umożliwia filtrowanie seansów po mieście, kinie, gatunku filmowym oraz dacie. Filtry są dostępne na stronie seansów.",
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
        aText:
          "Serwis obejmuje kina studyjne oraz wybrane kina sieciowe w całej Polsce, które organizują seanse specjalne, pokazy klasyki filmowej lub retrospektywy.",
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
        aText:
          "Tak. Jeśli znasz kino, które organizuje seanse specjalne i nie jest jeszcze uwzględnione w serwisie, skontaktuj się z nami przez stronę kontaktową. Rozpatrzymy każde zgłoszenie.",
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
        aText:
          "Możesz wybrać swoje miasto z listy rozwijanej w nagłówku strony lub przejść do zakładki Miasta, gdzie znajdziesz pełną listę miast z informacjami o dostępnych kinach i seansach.",
      },
      {
        q: "Ile miast jest dostępnych w serwisie?",
        a: (
          <p>
            Liczba miast stale rośnie. Aktualną listę wszystkich dostępnych
            miast znajdziesz na stronie <Link href="/miasta">Miasta</Link>.
          </p>
        ),
        aText:
          "Liczba miast stale rośnie. Aktualną listę wszystkich dostępnych miast znajdziesz na stronie Miasta.",
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
        aText:
          "Nie. Klaps nie pośredniczy w sprzedaży biletów ani rezerwacji miejsc. Serwis wyłącznie agreguje i prezentuje informacje o seansach.",
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
        aText:
          "Aby kupić bilet, sprawdź szczegóły seansu bezpośrednio na stronie danego kina. Zakup odbywa się wyłącznie między Tobą a kinem.",
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
        aText:
          "Serwis Klaps nie prezentuje cen biletów. Informacje o cenach dostępne są bezpośrednio na stronach poszczególnych kin.",
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
        aText:
          "Miasto możesz zmienić w każdej chwili, korzystając z listy rozwijanej w nagłówku strony. Twój wybór zostanie zapamiętany w przeglądarce, dzięki czemu przy kolejnej wizycie serwis automatycznie wyświetli seanse z Twojego miasta.",
      },
      {
        q: "Czy serwis działa na urządzeniach mobilnych?",
        a: (
          <p>
            Tak. Serwis jest w&nbsp;pełni responsywny i&nbsp;dostosowany do
            korzystania na telefonach, tabletach oraz komputerach.
          </p>
        ),
        aText:
          "Tak. Serwis jest w pełni responsywny i dostosowany do korzystania na telefonach, tabletach oraz komputerach.",
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
        aText:
          "Upewnij się, że korzystasz z aktualnej wersji przeglądarki. Serwis działa najlepiej w przeglądarkach Chrome, Firefox, Safari i Edge. Jeśli problem nadal występuje, napisz na kontakt@klaps.space.",
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
        aText:
          "Chętnie wysłuchamy Twoich sugestii. Skontaktuj się z nami przez stronę kontaktową lub bezpośrednio na adres kontakt@klaps.space.",
      },
    ],
  },
];

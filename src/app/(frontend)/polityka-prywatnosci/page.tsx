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

const SECTIONS: LegalSection[] = [
  {
    id: "postanowienia-ogolne",
    title: "Postanowienia ogólne",
    body: (
      <>
        <p>
          Niniejsza polityka prywatności określa zasady przetwarzania danych
          osobowych oraz wykorzystywania plików cookies w&nbsp;serwisie
          Klaps, dostępnym pod adresem {SITE_DOMAIN}.
        </p>
        <p>
          Serwis Klaps jest projektem niezależnym, prowadzonym
          niekomercyjnie. Ochrona prywatności użytkowników jest dla nas
          priorytetem. Dokładamy wszelkich starań, aby przetwarzanie danych
          odbywało się zgodnie z&nbsp;obowiązującymi przepisami, w&nbsp;tym
          z&nbsp;Rozporządzeniem Parlamentu Europejskiego i&nbsp;Rady (UE)
          2016/679 (RODO).
        </p>
        <p>
          Korzystanie z&nbsp;serwisu jest bezpłatne i&nbsp;nie wymaga
          rejestracji ani podawania danych osobowych.
        </p>
      </>
    ),
  },
  {
    id: "administrator",
    title: "Administrator danych",
    body: (
      <>
        <p>
          Administratorem danych przetwarzanych w&nbsp;związku
          z&nbsp;korzystaniem z&nbsp;serwisu Klaps jest twórca serwisu.
        </p>
        <p>
          W&nbsp;sprawach dotyczących ochrony danych osobowych możesz
          skontaktować się z&nbsp;nami pod adresem e-mail:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </>
    ),
  },
  {
    id: "zakres-danych",
    title: "Zakres przetwarzanych danych",
    body: (
      <>
        <p>
          Serwis Klaps nie wymaga rejestracji, logowania ani podawania
          jakichkolwiek danych osobowych. Nie zbieramy imion, nazwisk,
          adresów e-mail ani innych danych identyfikujących użytkowników.
        </p>
        <p>
          W&nbsp;ramach korzystania z&nbsp;serwisu mogą być automatycznie
          przetwarzane dane techniczne, takie jak adres IP, typ
          przeglądarki, system operacyjny, rozdzielczość ekranu oraz
          informacje o&nbsp;odwiedzanych podstronach. Dane te służą wyłącznie
          do zapewnienia prawidłowego działania serwisu oraz celów
          statystycznych.
        </p>
        <p>
          Serwis przechowuje w&nbsp;pamięci przeglądarki (localStorage)
          informację o&nbsp;wybranym przez użytkownika mieście. Dane te nie
          są przesyłane na serwer i&nbsp;służą wyłącznie do personalizacji
          wyświetlanych treści.
        </p>
      </>
    ),
  },
  {
    id: "pliki-cookies",
    title: "Pliki cookies",
    body: (
      <>
        <p>
          Serwis Klaps może wykorzystywać pliki cookies (ciasteczka), czyli
          niewielkie pliki tekstowe zapisywane na urządzeniu użytkownika.
        </p>
        <p>
          Pliki cookies wykorzystywane w&nbsp;serwisie mają charakter
          techniczny i&nbsp;służą do zapamiętywania preferencji
          użytkownika, takich jak wybrane miasto. Nie są wykorzystywane do
          śledzenia aktywności użytkowników w&nbsp;celach reklamowych.
        </p>
        <p>
          Użytkownik może w&nbsp;każdej chwili zmienić ustawienia
          dotyczące plików cookies w&nbsp;swojej przeglądarce, w&nbsp;tym
          zablokować ich zapisywanie lub usunąć już zapisane pliki.
          Ograniczenie stosowania plików cookies może wpłynąć na niektóre
          funkcjonalności serwisu.
        </p>
      </>
    ),
  },
  {
    id: "uslugi-zewnetrzne",
    title: "Usługi zewnętrzne",
    body: (
      <>
        <p>
          Serwis może korzystać z&nbsp;usług zewnętrznych dostawców
          w&nbsp;celu zapewnienia prawidłowego działania, analizy ruchu
          lub wyświetlania treści. W&nbsp;szczególności serwis może
          wykorzystywać usługi hostingowe, usługi dostarczania map oraz
          narzędzia analityczne.
        </p>
        <p>
          Zewnętrzni dostawcy mogą przetwarzać dane techniczne użytkowników
          (np. adres IP) zgodnie z&nbsp;własnymi politykami prywatności.
          Rekomendujemy zapoznanie się z&nbsp;politykami prywatności tych
          usług.
        </p>
        <p>
          Serwis zawiera odnośniki do stron internetowych kin
          i&nbsp;serwisów biletowych. Kliknięcie w&nbsp;taki odnośnik
          powoduje przejście do serwisu zewnętrznego, którego zasady
          przetwarzania danych mogą się różnić od niniejszej polityki
          prywatności.
        </p>
      </>
    ),
  },
  {
    id: "prawa-uzytkownikow",
    title: "Prawa użytkowników",
    body: (
      <>
        <p>
          Zgodnie z&nbsp;RODO, każdemu użytkownikowi przysługuje prawo
          dostępu do swoich danych, ich sprostowania, usunięcia,
          ograniczenia przetwarzania, przenoszenia danych oraz wniesienia
          sprzeciwu wobec przetwarzania.
        </p>
        <p>
          Ze względu na to, że serwis Klaps nie zbiera danych osobowych
          umożliwiających identyfikację użytkowników, realizacja powyższych
          praw może być ograniczona. Jeśli jednak uważasz, że Twoje dane są
          przetwarzane w&nbsp;sposób niezgodny z&nbsp;prawem, masz prawo
          wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych (UODO).
        </p>
        <p>
          W&nbsp;przypadku pytań dotyczących swoich praw prosimy
          o&nbsp;kontakt pod adresem:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </>
    ),
  },
  {
    id: "bezpieczenstwo",
    title: "Bezpieczeństwo danych",
    body: (
      <>
        <p>
          Dokładamy wszelkich starań, aby zapewnić bezpieczeństwo danych
          przetwarzanych w&nbsp;związku z&nbsp;działaniem serwisu. Stosujemy
          odpowiednie środki techniczne i&nbsp;organizacyjne, w&nbsp;tym
          szyfrowanie połączenia (SSL/TLS).
        </p>
        <p>
          Pomimo stosowania odpowiednich zabezpieczeń, należy pamiętać, że
          żadna metoda przesyłania danych przez internet ani metoda
          elektronicznego przechowywania nie jest w&nbsp;pełni bezpieczna.
          Nie możemy zagwarantować absolutnego bezpieczeństwa danych.
        </p>
      </>
    ),
  },
  {
    id: "zmiany-polityki",
    title: "Zmiany polityki prywatności",
    body: (
      <>
        <p>
          Zastrzegamy sobie prawo do wprowadzania zmian w&nbsp;niniejszej
          polityce prywatności. Zmiany mogą wynikać ze zmian
          w&nbsp;przepisach prawa, rozwoju funkcjonalności serwisu lub
          zmiany stosowanych technologii.
        </p>
        <p>
          Aktualna wersja polityki prywatności jest zawsze dostępna na tej
          stronie. Zalecamy regularne zapoznawanie się z&nbsp;jej treścią.
        </p>
      </>
    ),
  },
  {
    id: "kontakt",
    title: "Kontakt",
    body: (
      <>
        <p>
          W&nbsp;przypadku jakichkolwiek pytań dotyczących niniejszej
          polityki prywatności lub przetwarzania danych w&nbsp;serwisie
          Klaps, prosimy o&nbsp;kontakt pod adresem e-mail:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
        <p>
          Dołożymy wszelkich starań, aby odpowiedzieć na Twoje zapytanie
          w&nbsp;możliwie najkrótszym czasie.
        </p>
      </>
    ),
  },
];

const PrivacyPolicyPage = () => {
  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-4">
        <Breadcrumbs
          items={[
            { name: "Polityka prywatności", href: "/polityka-prywatnosci" },
          ]}
        />
      </div>

      <header className="px-6 md:px-12 lg:px-16 pt-6 md:pt-10 pb-14 md:pb-20">
        <h1 className="text-4xl md:text-7xl lg:text-8xl font-medium uppercase -tracking-[0.04em] leading-[0.9] text-white">
          Polityka
          <br />
          prywatności
        </h1>
        <p className="mt-10 md:mt-14 max-w-[58ch] text-lg md:text-2xl lg:text-3xl text-white/75 leading-[1.4] -tracking-[0.005em]">
          Klaps nie wymaga rejestracji ani danych osobowych. Poniżej opisujemy
          dokładnie, jakie dane techniczne mogą być przetwarzane
          i&nbsp;dlaczego.
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
            href="/regulamin"
            className="group flex items-baseline justify-between gap-4 p-5 md:p-6 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
          >
            <span className="text-lg md:text-xl text-white -tracking-[0.01em]">
              Regulamin
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

export default PrivacyPolicyPage;

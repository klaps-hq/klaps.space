import React from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading from "@/components/ui/page-heading";
import SiteHeader from "@/components/common/site-header";
import JsonLd from "@/components/common/json-ld";
import { getCinemas } from "@/lib/cinemas";
import { SITE_URL } from "@/lib/site-config";
import { CONTACT_EMAIL } from "@/constants";
import Footer from "../(home)/_components/footer";
import BadgeGenerator, {
  BadgeCinemaOption,
} from "./_components/badge-generator";

// The cinema list behind the generator changes rarely.
export const revalidate = 3600;

interface BenefitItem {
  n: string;
  title: string;
  body: string;
}

const BENEFITS: BenefitItem[] = [
  {
    n: "01",
    title: "Własna strona kina",
    body: "Każde kino ma na Klapsie stronę z aktualnym repertuarem seansów specjalnych, adresem, mapą i filmami, które grało ostatnio.",
  },
  {
    n: "02",
    title: "Widzowie spoza okolicy",
    body: "Klaps zbiera seanse z całej Polski. Osoby szukające klasyki, retrospektyw i pokazów specjalnych trafiają do Was, nawet jeśli nie śledzą Waszego profilu.",
  },
  {
    n: "03",
    title: "Bez kosztów i umów",
    body: "Klaps jest niekomercyjny i open source. Nie pobieramy opłat, nie wyświetlamy reklam i nie pośredniczymy w sprzedaży. Widz zawsze kończy na Waszej stronie.",
  },
];

const STEPS = [
  "Wyszukaj swoje kino w generatorze poniżej.",
  "Wybierz wersję odznaki pasującą do koloru Waszej strony.",
  "Skopiuj kod i wklej go w stopce, w zakładce z repertuarem albo w sekcji z partnerami.",
];

const ForCinemasPage = async () => {
  // A failed fetch leaves the generator usable with the homepage link.
  const { data: groups } = await getCinemas();
  const cinemas: BadgeCinemaOption[] = groups
    .flatMap((group) =>
      group.cinemas.map((cinema) => ({
        slug: cinema.slug,
        name: cinema.name,
        city: group.city.name,
      }))
    )
    .sort((a, b) => a.name.localeCompare(b.name, "pl"));

  return (
    <main className="bg-black text-white min-h-screen">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Dla kin",
          url: `${SITE_URL}/dla-kin`,
          description:
            "Darmowa odznaka klaps.space z linkiem do repertuaru seansów specjalnych kina.",
          inLanguage: "pl-PL",
          isPartOf: { "@type": "WebSite", name: "Klaps", url: SITE_URL },
        }}
      />
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-4">
        <Breadcrumbs items={[{ name: "Dla kin", href: "/dla-kin" }]} />
      </div>

      <header className="px-6 md:px-12 lg:px-16 pt-6 md:pt-10 pb-14 md:pb-20">
        <PageHeading variant="display">Dla kin</PageHeading>
        <p className="mt-10 md:mt-14 max-w-[58ch] text-lg md:text-2xl lg:text-3xl text-white/75 leading-[1.4] -tracking-[0.005em]">
          Wasze kino jest na Klapsie. Wklejcie odznakę na swoją stronę
          i&nbsp;pokażcie widzom, gdzie znajdą Wasze seanse specjalne obok
          repertuaru kin studyjnych z&nbsp;całej Polski.
        </p>
      </header>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-14 md:pt-20 pb-14 md:pb-20">
        <h2 className="mb-10 md:mb-14 text-3xl md:text-5xl lg:text-6xl leading-[1] -tracking-[0.03em] text-white font-medium">
          Co zyskujecie
        </h2>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-x-10 lg:gap-x-14 gap-y-10">
          {BENEFITS.map((item) => (
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <h2 className="lg:col-span-4 text-3xl md:text-5xl lg:text-6xl leading-[1] -tracking-[0.03em] text-white font-medium">
            Jak dodać
          </h2>
          <ol className="lg:col-span-8 flex flex-col">
            {STEPS.map((step, index) => (
              <li
                key={step}
                className="flex items-baseline gap-5 md:gap-8 border-t border-white/10 first:border-t-0 first:pt-0 last:pb-0 py-5 md:py-7"
              >
                <span className="shrink-0 text-xs md:text-sm tabular-nums text-white/50 leading-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="max-w-[52ch] text-lg md:text-2xl text-white/80 -tracking-[0.01em] leading-snug">
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="odznaka"
        className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-14 md:pt-20 pb-14 md:pb-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4">
            <h2 className="text-3xl md:text-5xl lg:text-6xl leading-[1] -tracking-[0.03em] text-white font-medium">
              Odznaka
            </h2>
            <p className="mt-5 md:mt-6 max-w-[40ch] text-sm md:text-base text-white/55 leading-relaxed">
              Prowadzi prosto do strony Waszego kina na klaps.space. Plik jest
              lekki, nie śledzi odwiedzających i nie ładuje żadnych skryptów.
            </p>
          </div>
          <div className="lg:col-span-8">
            <BadgeGenerator cinemas={cinemas} />
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-14 md:pt-20 pb-24 md:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <h2 className="lg:col-span-4 text-3xl md:text-5xl lg:text-6xl leading-[1] -tracking-[0.03em] text-white font-medium">
            Poprawki danych
          </h2>
          <div className="lg:col-span-8 flex flex-col gap-5 max-w-[68ch] text-base md:text-lg text-white/65 leading-relaxed">
            <p>
              Brakuje Waszego kina, seansu albo adres jest nieaktualny? Chcecie
              dodać pokaz DKF lub wydarzenie, którego nie ma w&nbsp;sieci?
              Napiszcie, poprawimy dane ręcznie.
            </p>
            <p>
              Na stronie kina pokazujemy też sale z&nbsp;liczbą miejsc,
              informacje o&nbsp;dostępności, logo i&nbsp;zdjęcia. Jeśli czegoś
              brakuje albo się zmieniło, prześlijcie nam aktualne dane. Logo
              i&nbsp;zdjęcia opublikujemy tylko za Waszą zgodą, z&nbsp;podpisem
              autora.
            </p>
            <p className="flex flex-wrap gap-x-6 gap-y-2">
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Dane kina na klaps.space")}`}
                className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
              <Link
                href="/kontakt"
                className="text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors"
              >
                Przejdź do kontaktu
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default ForCinemasPage;

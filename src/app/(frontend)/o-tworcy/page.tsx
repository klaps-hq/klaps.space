import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading from "@/components/ui/page-heading";
import SiteHeader from "@/components/common/site-header";
import JsonLd from "@/components/common/json-ld";
import { FOUNDER, ORGANIZATION_ID, SITE_URL } from "@/lib/site-config";
import Footer from "../(home)/_components/footer";

interface ProfileLink {
  label: string;
  href: string;
  handle: string;
}

interface ContentSource {
  title: string;
  body: string;
}

const PROFILE_LINKS: ProfileLink[] = [
  {
    label: "Strona osobista",
    href: "https://www.robertsinski.dev/",
    handle: "robertsinski.dev",
  },
  {
    label: "GitHub",
    href: "https://github.com/Biplo12",
    handle: "Biplo12",
  },
];

// How each kind of content on the site is made. Spelled out because the
// blog is drafted with AI: readers should know who and what stands behind
// every part of the site.
const CONTENT_SOURCES: ContentSource[] = [
  {
    title: "Repertuar",
    body: "Zbiera go automat, który codziennie sprawdza repertuar ponad 560 kin i wyłuskuje z niego seanse specjalne: klasykę, retrospektywy, pokazy DKF i maratony.",
  },
  {
    title: "Opisy kin",
    body: "Powstają na podstawie stron samych kin, instytucji, które je prowadzą, i innych sprawdzalnych źródeł. Gdy informacji brakuje, opis zostaje krótki, zamiast zgadywać.",
  },
  {
    title: "Blog",
    body: "Wpisy przygotowuje redakcja klaps.space z pomocą AI, na podstawie danych z serwisu i sprawdzonych źródeł. Dlatego podpisujemy je jako redakcja, a nie jako autor.",
  },
];

const FounderPage = () => {
  return (
    <main className="bg-black text-white min-h-screen">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          url: FOUNDER.url,
          inLanguage: "pl-PL",
          mainEntity: {
            "@type": "Person",
            "@id": FOUNDER.id,
            name: FOUNDER.name,
            jobTitle: FOUNDER.jobTitle,
            url: FOUNDER.url,
            image: FOUNDER.image,
            sameAs: FOUNDER.sameAs,
            homeLocation: { "@type": "Place", name: "Katowice" },
            worksFor: {
              "@type": "Organization",
              "@id": ORGANIZATION_ID,
              name: "Klaps",
              url: SITE_URL,
            },
          },
        }}
      />
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-4">
        <Breadcrumbs items={[{ name: "O twórcy", href: "/o-tworcy" }]} />
      </div>

      <header className="px-6 md:px-12 lg:px-16 pt-6 md:pt-10 pb-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
          <div className="lg:col-span-4">
            <div className="relative aspect-square w-full max-w-[320px] overflow-hidden">
              <Image
                src="/images/autor/robert-sinski.jpg"
                alt="Robert Siński, twórca klaps.space"
                fill
                priority
                sizes="(max-width: 1024px) 320px, 30vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-8">
            <PageHeading variant="display">Robert Siński</PageHeading>
            <p className="mt-6 md:mt-8 text-[10px] md:text-xs uppercase tracking-[0.28em] text-white/50">
              Twórca klaps.space · Katowice
            </p>
          </div>
        </div>
      </header>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-14 md:pt-20 pb-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <h2 className="lg:col-span-4 text-3xl md:text-5xl lg:text-6xl leading-[1] -tracking-[0.03em] text-white font-medium">
            Kim jest
          </h2>
          <div className="lg:col-span-8 flex flex-col gap-5 max-w-[68ch] text-base md:text-lg text-white/65 leading-relaxed">
            <p>
              Robert Siński tworzy klaps.space, niekomercyjny przewodnik po
              seansach specjalnych w&nbsp;polskich kinach studyjnych. Zbudował
              system, który codziennie automatycznie sprawdza repertuar ponad
              560 kin i&nbsp;wyłuskuje z&nbsp;niego to, czego trudno szukać
              gdzie indziej: klasykę, retrospektywy, pokazy DKF i&nbsp;maratony.
            </p>
            <p>
              Na co dzień pracuje jako programista fullstack w&nbsp;Katowicach.
              Klaps powstaje od stycznia 2026 roku, od zbierania danych po
              stronę, którą właśnie czytasz.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-14 md:pt-20 pb-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <h2 className="lg:col-span-4 text-3xl md:text-5xl lg:text-6xl leading-[1] -tracking-[0.03em] text-white font-medium">
            Dlaczego Klaps
          </h2>
          <blockquote className="lg:col-span-8 max-w-[62ch] text-lg md:text-xl lg:text-2xl text-white/80 leading-[1.4] -tracking-[0.01em]">
            <p>
              Kocham stare filmy, a&nbsp;jeszcze bardziej lubię oglądać je na
              dużym ekranie. Przez długi czas szukanie takich seansów wyglądało
              tak samo: kilkanaście stron kin, osobne repertuary
              i&nbsp;sprawdzanie dzień po dniu, czy gdzieś nie pojawia się
              klasyka. W&nbsp;styczniu 2026 roku zacząłem więc budować
              klaps.space, system, który robi to za mnie codziennie i&nbsp;dla
              całej Polski. Najlepszą rekomendacją, jaką mogę mu wystawić, jest
              to, że sam z&nbsp;niego korzystam, zanim wybiorę się do kina.
            </p>
          </blockquote>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-14 md:pt-20 pb-14 md:pb-20">
        <h2 className="mb-10 md:mb-14 text-3xl md:text-5xl lg:text-6xl leading-[1] -tracking-[0.03em] text-white font-medium">
          Jak powstają treści
        </h2>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-x-10 lg:gap-x-14 gap-y-10">
          {CONTENT_SOURCES.map((item, index) => (
            <li key={item.title} className="flex flex-col">
              <span className="text-4xl md:text-5xl font-light tabular-nums text-white/15 -tracking-[0.03em] leading-none">
                {String(index + 1).padStart(2, "0")}
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
            Gdzie indziej
          </h2>
          <ul className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {PROFILE_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="me noopener"
                  className="group flex h-full flex-col justify-between gap-8 p-6 md:p-7 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xl md:text-2xl font-medium text-white -tracking-[0.01em]">
                      {link.label}
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-5 md:size-6 shrink-0 text-white/40 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </div>
                  <span className="text-sm md:text-base text-white/70 break-all">
                    {link.handle}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-20 md:pt-28 pb-24 md:pb-32">
        <p className="max-w-[26ch] text-3xl md:text-5xl lg:text-6xl leading-[1.05] -tracking-[0.02em] text-white font-medium">
          Więcej o&nbsp;tym, czym jest Klaps i&nbsp;czego w&nbsp;nim nie ma.
        </p>
        <Link
          href="/o-projekcie"
          className="group mt-12 md:mt-16 inline-flex items-center gap-4 text-xs md:text-sm uppercase tracking-[0.28em] text-white border border-white/25 hover:border-white hover:bg-white/[0.04] px-8 md:px-10 py-4 md:py-5 transition-colors"
        >
          O projekcie
          <ArrowRight
            aria-hidden="true"
            className="size-4 shrink-0 transition-transform group-hover:translate-x-1"
          />
        </Link>
      </section>

      <Footer />
    </main>
  );
};

export default FounderPage;

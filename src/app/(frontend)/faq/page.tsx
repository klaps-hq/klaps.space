import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading from "@/components/ui/page-heading";
import SiteHeader from "@/components/common/site-header";
import Footer from "../(home)/_components/footer";
import { FAQ_SECTIONS } from "./faq-data";

const FaqPage = () => {
  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-4">
        <Breadcrumbs items={[{ name: "FAQ", href: "/faq" }]} />
      </div>

      <header className="px-6 md:px-12 lg:px-16 pt-6 md:pt-10 pb-14 md:pb-20">
        <PageHeading variant="display">FAQ</PageHeading>
        <p className="mt-10 md:mt-14 max-w-[58ch] text-lg md:text-2xl lg:text-3xl text-white/75 leading-[1.4] -tracking-[0.005em]">
          Najczęściej zadawane pytania o&nbsp;działanie serwisu, dane
          o&nbsp;seansach i&nbsp;kinach.
        </p>
      </header>

      {FAQ_SECTIONS.map((section) => (
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
          działa albo masz pomysł na nową funkcję, daj znać. Zgłoszenia
          pomyłek, błędów w&nbsp;danych i&nbsp;propozycje nowych kin też są
          mile widziane.
        </p>
        <Link
          href="/kontakt"
          className="group mt-10 md:mt-12 inline-flex items-center gap-4 text-xs md:text-sm uppercase tracking-[0.28em] text-white border border-white/25 hover:border-white hover:bg-white/[0.04] px-8 md:px-10 py-4 md:py-5 transition-colors"
        >
          Kontakt
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

export default FaqPage;

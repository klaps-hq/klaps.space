import React from "react";
import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaThreads,
  FaXTwitter,
} from "react-icons/fa6";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import SiteHeader from "@/components/common/site-header";
import Footer from "../(home)/_components/footer";
import { CONTACT_EMAIL, SOCIAL_LINKS } from "@/constants";

interface SocialItem {
  label: string;
  handle: string;
  href: string;
  Icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
}

const SOCIALS: SocialItem[] = [
  {
    label: "X",
    handle: "@KlapsSpace",
    href: SOCIAL_LINKS.x,
    Icon: FaXTwitter,
  },
  {
    label: "Threads",
    handle: "@klaps.space",
    href: SOCIAL_LINKS.threads,
    Icon: FaThreads,
  },
  {
    label: "Instagram",
    handle: "@klaps.space",
    href: SOCIAL_LINKS.instagram,
    Icon: FaInstagram,
  },
  {
    label: "Facebook",
    handle: "Klapsspace",
    href: SOCIAL_LINKS.facebook,
    Icon: FaFacebookF,
  },
];

const ContactPage = () => {
  return (
    <main className="bg-black text-white min-h-screen">
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-4">
        <Breadcrumbs items={[{ name: "Kontakt", href: "/kontakt" }]} />
      </div>

      <header className="px-6 md:px-12 lg:px-16 pt-6 md:pt-10 pb-14 md:pb-20">
        <h1 className="text-5xl md:text-8xl lg:text-9xl xl:text-[10rem] font-medium uppercase -tracking-[0.04em] leading-[0.9] text-white">
          Kontakt
        </h1>
        <p className="mt-10 md:mt-14 max-w-[58ch] text-lg md:text-2xl lg:text-3xl text-white/75 leading-[1.4] -tracking-[0.005em]">
          Napisz, jeśli masz pytanie, propozycję współpracy albo zauważyłeś
          coś, co powinniśmy poprawić. Odpowiadamy zwykle w&nbsp;ciągu kilku
          dni roboczych.
        </p>
      </header>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-14 md:pt-20 pb-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 lg:items-center">
          <div className="lg:col-span-4">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40">
              E-mail
            </p>
            <p className="mt-6 md:mt-8 max-w-[44ch] text-base md:text-lg text-white/65 leading-relaxed">
              Najszybszy sposób kontaktu. Prosimy o&nbsp;zwięzły opis sprawy
              w&nbsp;temacie wiadomości, ułatwi nam to szybką odpowiedź.
            </p>
          </div>
          <div className="lg:col-span-8">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group inline-flex items-baseline gap-4 md:gap-6"
            >
              <span className="text-2xl md:text-4xl lg:text-5xl font-medium text-white -tracking-[0.02em] break-all">
                {CONTACT_EMAIL}
              </span>
              <span
                aria-hidden="true"
                className="shrink-0 text-2xl md:text-3xl text-white/40 group-hover:text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              >
                ↗
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-14 md:pt-20 pb-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <h2 className="lg:col-span-4 text-3xl md:text-5xl lg:text-6xl leading-[1] -tracking-[0.03em] text-white font-medium">
            Współpraca
          </h2>
          <div className="lg:col-span-8 flex flex-col gap-5 max-w-[68ch] text-base md:text-lg text-white/65 leading-relaxed">
            <p>
              Jesteś przedstawicielem kina studyjnego i&nbsp;chciałbyś, aby
              Twoje kino pojawiło się w&nbsp;serwisie? Prowadzisz festiwal
              filmowy lub cykl pokazów specjalnych? Napisz do nas. Chętnie
              porozmawiamy o&nbsp;możliwościach współpracy.
            </p>
            <p>
              Klaps nie pobiera opłat za obecność w&nbsp;serwisie ani nie
              promuje wybranych kin. Każde miejsce, które organizuje seanse
              wpisujące się w&nbsp;profil projektu, jest mile widziane.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-14 md:pt-20 pb-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <h2 className="lg:col-span-4 text-3xl md:text-5xl lg:text-6xl leading-[1] -tracking-[0.03em] text-white font-medium">
            Zgłoszenia
          </h2>
          <div className="lg:col-span-8 flex flex-col gap-5 max-w-[68ch] text-base md:text-lg text-white/65 leading-relaxed">
            <p>
              Zauważyłeś błąd w&nbsp;repertuarze, brakujące kino albo
              nieaktualną informację? Każde zgłoszenie pomaga rozwijać
              projekt.
            </p>
            <p>
              Wszelkie problemy techniczne, błędy wyświetlania
              i&nbsp;niedziałające elementy strony prosimy kierować
              bezpośrednio na adres e-mail powyżej. Pomocny będzie krótki
              opis problemu i&nbsp;informacja o&nbsp;przeglądarce lub
              urządzeniu, na którym wystąpił.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-14 md:pt-20 pb-14 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4">
            <h2 className="text-3xl md:text-5xl lg:text-6xl leading-[1] -tracking-[0.03em] text-white font-medium">
              Social
            </h2>
            <p className="mt-6 md:mt-8 max-w-[44ch] text-base md:text-lg text-white/65 leading-relaxed">
              Krótkie zapowiedzi seansów, nowe kina w&nbsp;serwisie
              i&nbsp;rekomendacje. Wiadomości prywatne też czytamy.
            </p>
          </div>
          <ul className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {SOCIALS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex h-full flex-col justify-between gap-8 p-5 md:p-6 bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <social.Icon size={18} aria-hidden />
                    <span
                      aria-hidden="true"
                      className="text-white/40 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      ↗
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-lg md:text-xl font-medium text-white -tracking-[0.01em]">
                      {social.label}
                    </span>
                    <span className="text-xs md:text-sm text-white/55 break-all">
                      {social.handle}
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-20 md:pt-28 pb-24 md:pb-32">
        <p className="text-3xl md:text-5xl lg:text-6xl leading-[1.05] -tracking-[0.02em] text-white font-medium">
          Wracasz do&nbsp;repertuaru?
        </p>
        <p className="mt-6 md:mt-8 max-w-[60ch] text-base md:text-lg lg:text-xl text-white/65 leading-relaxed">
          Sprawdź, co dzisiaj grają kina studyjne w&nbsp;Twojej okolicy.
        </p>
        <Link
          href="/seanse"
          className="group mt-10 md:mt-12 inline-flex items-center gap-4 text-xs md:text-sm uppercase tracking-[0.28em] text-white border border-white/25 hover:border-white hover:bg-white/[0.04] px-8 md:px-10 py-4 md:py-5 transition-colors"
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

export default ContactPage;

import React from "react";
import Link from "next/link";
import ContentSection from "@/components/common/content-section";
import FaqItem from "../faq-item";
import { CONTACT_EMAIL, SITE_DOMAIN, SOCIAL_LINKS } from "@/constants";

const LINK_CLASSNAME =
  "text-white/80 underline underline-offset-4 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blood-red focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const SOCIAL_CONTACT_LINKS = [
  { id: "threads", label: "Threads", href: SOCIAL_LINKS.threads },
  { id: "x", label: "X", href: SOCIAL_LINKS.x },
  { id: "instagram", label: "Instagram", href: SOCIAL_LINKS.instagram },
  { id: "facebook", label: "Facebook", href: SOCIAL_LINKS.facebook },
] as const;

const GeneralSection: React.FC = () => {
  return (
    <ContentSection id="ogolne" title="Ogólne">
      <FaqItem question="Czym jest Klaps?">
        <p>
          Klaps to niezależny serwis internetowy, który agreguje informacje
          o&nbsp;seansach specjalnych, klasyce filmowej i&nbsp;retrospektywach
          w&nbsp;kinach studyjnych na terenie całej Polski. Serwis jest dostępny
          pod adresem {SITE_DOMAIN}.
        </p>
      </FaqItem>

      <FaqItem question="Czy korzystanie z serwisu jest bezpłatne?">
        <p>
          Tak. Klaps jest projektem niekomercyjnym i&nbsp;w&nbsp;pełni
          bezpłatnym. Nie wymaga rejestracji, logowania ani podawania
          jakichkolwiek danych osobowych.
        </p>
      </FaqItem>

      <FaqItem question="Kto stoi za projektem Klaps?">
        <p>
          Klaps jest projektem niezależnym, tworzonym z&nbsp;pasji do kina
          studyjnego. Nie jest powiązana z&nbsp;żadnym kinem, dystrybutorem ani
          siecią kinową.
        </p>
      </FaqItem>

      <FaqItem question="Czy muszę się rejestrować, żeby korzystać z serwisu?">
        <p>
          Nie. Serwis nie wymaga rejestracji ani zakładania konta. Wszystkie
          funkcje są dostępne od razu po wejściu na stronę.
        </p>
      </FaqItem>

      <FaqItem question="Jak mogę się z Wami skontaktować?">
        <p>
          Najwygodniej przez stronę{" "}
          <Link
            href="/kontakt"
            className={LINK_CLASSNAME}
          >
            kontakt
          </Link>
          , e-mail:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className={LINK_CLASSNAME}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
        <ul className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          {SOCIAL_CONTACT_LINKS.map((socialLink) => (
            <li key={socialLink.id}>
              <a
                href={socialLink.href}
                target="_blank"
                rel="noopener noreferrer"
                className={LINK_CLASSNAME}
              >
                {socialLink.label}
              </a>
            </li>
          ))}
        </ul>
      </FaqItem>
    </ContentSection>
  );
};

export default GeneralSection;

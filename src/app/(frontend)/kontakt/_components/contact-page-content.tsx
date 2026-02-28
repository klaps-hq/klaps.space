import React from "react";
import ContentSection from "@/components/common/content-section";
import SocialLinks from "@/components/common/social-links";
import ContactInfoItem from "./contact-info-item";
import ContactSidebar from "./contact-sidebar";
import { CONTACT_EMAIL } from "@/constants";

const ContactPageContent: React.FC = () => {
  return (
    <div className="flex gap-16">
      <div className="flex flex-col gap-20 flex-1 min-w-0">
        <ContentSection id="o-kontakcie" title="Jak się z nami skontaktować?">
          <p>
            Klaps to projekt rozwijany niezależnie, z&nbsp;myślą
            o&nbsp;miłośnikach kina studyjnego i&nbsp;klasyki filmowej. Jeśli
            chcesz się z&nbsp;nami skontaktować, napisz. Odpowiadamy na
            wiadomości w&nbsp;ciągu kilku dni roboczych.
          </p>
        </ContentSection>

        <div className="flex flex-col md:hidden">
          <ContactInfoItem
            label="E-mail"
            value={CONTACT_EMAIL}
            href={`mailto:${CONTACT_EMAIL}`}
          />
          <ContactInfoItem
            label="Czas odpowiedzi"
            value="Do kilku dni roboczych"
          />
        </div>

        <ContentSection id="wspolpraca" title="Współpraca">
          <p>
            Jesteś przedstawicielem kina studyjnego i&nbsp;chciałbyś, aby Twoje
            kino pojawiło się w&nbsp;serwisie? Prowadzisz festiwal filmowy lub
            cykl pokazów specjalnych? Napisz do nas. Chętnie porozmawiamy
            o&nbsp;możliwościach współpracy.
          </p>

          <p>
            Jeśli zauważyłeś błąd w&nbsp;repertuarze, brakujące kino lub
            nieaktualną informację, również daj nam znać. Każda informacja
            pomaga rozwijać projekt.
          </p>
        </ContentSection>

        <ContentSection id="social-media" title="Social media">
          <p>
            Możesz też skontaktować się z nami przez nasze profile w mediach
            społecznościowych:
          </p>

          <SocialLinks />
        </ContentSection>

        <ContentSection id="uwagi" title="Zgłoszenia i uwagi">
          <p>
            Klaps jest projektem w&nbsp;ciągłym rozwoju. Jeśli masz pomysł na
            usprawnienie serwisu, sugestię dotyczącą funkcjonalności lub chcesz
            podzielić się opinią na temat działania strony, Twoja wiadomość jest
            mile widziana.
          </p>

          <p>
            Wszelkie zgłoszenia dotyczące błędów technicznych, problemów
            z&nbsp;wyświetlaniem lub niedziałających elementów prosimy kierować
            bezpośrednio na adres e-mail podany powyżej.
          </p>
        </ContentSection>
      </div>

      <ContactSidebar />
    </div>
  );
};

export default ContactPageContent;

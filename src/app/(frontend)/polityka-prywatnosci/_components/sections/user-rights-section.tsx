import React from "react";
import ContentSection from "@/components/common/content-section";
import { CONTACT_EMAIL } from "@/constants";

const UserRightsSection: React.FC = () => {
  return (
    <ContentSection id="prawa-uzytkownikow" title="Prawa użytkowników">
      <p>
        Zgodnie z&nbsp;RODO, każdemu użytkownikowi przysługuje prawo dostępu do
        swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania,
        przenoszenia danych oraz wniesienia sprzeciwu wobec przetwarzania.
      </p>

      <p>
        Ze względu na to, że serwis Klaps nie zbiera danych osobowych
        umożliwiających identyfikację użytkowników, realizacja powyższych praw
        może być ograniczona. Jeśli jednak uważasz, że Twoje dane są
        przetwarzane w&nbsp;sposób niezgodny z&nbsp;prawem, masz prawo wnieść
        skargę do Prezesa Urzędu Ochrony Danych Osobowych (UODO).
      </p>

      <p>
        W&nbsp;przypadku pytań dotyczących swoich praw prosimy o&nbsp;kontakt
        pod adresem:{" "}
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="text-blood-red hover:text-white transition-colors duration-300"
        >
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </ContentSection>
  );
};

export default UserRightsSection;

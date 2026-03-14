import React from "react";
import ContentSection from "@/components/common/content-section";
import AboutBorderedList from "../about-bordered-list";

const GITHUB_FRONTEND = "https://github.com/klaps-hq/klaps.space";
const GITHUB_BACKEND = "https://github.com/klaps-hq/api.klaps.space";

const OpenSourceSection: React.FC = () => {
  return (
    <ContentSection id="kod-zrodlowy" title="Kod źródłowy">
      <p>
        Klaps jest projektem open source. Kod źródłowy aplikacji jest publicznie
        dostępny na GitHubie:
      </p>

      <AboutBorderedList
        items={[
          <>
            <span className="text-white/80 font-medium">Frontend</span>{" "}
            (Next.js) &mdash;{" "}
            <a
              href={GITHUB_FRONTEND}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blood-red hover:underline"
              aria-label="Repozytorium frontend na GitHubie"
            >
              github.com/klaps-hq/klaps.space
            </a>
          </>,
          <>
            <span className="text-white/80 font-medium">Backend</span> (NestJS)
            &mdash;{" "}
            <a
              href={GITHUB_BACKEND}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blood-red hover:underline"
              aria-label="Repozytorium backend na GitHubie"
            >
              github.com/klaps-hq/api.klaps.space
            </a>
          </>,
        ]}
      />

      <p>
        Scrapper odpowiedzialny za pobieranie danych nie jest udostępniany
        publicznie z&nbsp;przyczyn prawnych.
      </p>
    </ContentSection>
  );
};

export default OpenSourceSection;

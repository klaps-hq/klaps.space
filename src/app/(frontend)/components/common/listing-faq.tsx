import React from "react";
import JsonLd from "@/components/common/json-ld";
import { FaqItem } from "@/lib/listing-faq";
import ContentSection from "@/components/common/content-section";

interface ListingFaqProps {
  heading: React.ReactNode;
  questions: FaqItem[];
}

// Data-driven FAQ for listing pages, same markup as /faq. The visible
// answers are the exact strings in the FAQPage JSON-LD, as Google requires
// for structured data.
const ListingFaq: React.FC<ListingFaqProps> = ({ heading, questions }) => {
  if (questions.length === 0) return null;

  return (
    <ContentSection heading={heading}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: questions.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
      <ul className="flex flex-col border-b border-white/10">
        {questions.map((qa) => (
          <li key={qa.q}>
            <details className="group border-t border-white/10 py-4 md:py-5">
              <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
                <h3 className="text-base md:text-lg text-white/85 group-hover:text-white group-open:text-white -tracking-[0.01em] leading-snug font-normal transition-colors">
                  {qa.q}
                </h3>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-xl font-light text-white/40 leading-none mt-0.5 group-open:rotate-45 transition-transform duration-300"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-[68ch] text-sm md:text-base text-white/60 leading-relaxed">
                {qa.a}
              </p>
            </details>
          </li>
        ))}
      </ul>
    </ContentSection>
  );
};

export default ListingFaq;

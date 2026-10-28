import React from "react";
import JsonLd from "@/components/common/json-ld";
import { FaqItem } from "@/lib/listing-faq";

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
    <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-14 md:pt-20 pb-14 md:pb-20">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <h2 className="lg:col-span-4 text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] text-white font-medium max-w-[16ch]">
          {heading}
        </h2>
        <ul className="lg:col-span-8 flex flex-col">
          {questions.map((qa) => (
            <li key={qa.q}>
              <details className="group border-t border-white/10 first:border-t-0 py-5 md:py-6">
                <summary className="flex items-start justify-between gap-6 cursor-pointer list-none">
                  <h3 className="text-lg md:text-xl lg:text-2xl text-white -tracking-[0.01em] leading-snug font-normal">
                    {qa.q}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-2xl md:text-3xl font-light text-white/40 leading-none mt-1 group-open:rotate-45 transition-transform duration-300"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-5 max-w-[68ch] text-base md:text-lg text-white/65 leading-relaxed">
                  {qa.a}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ListingFaq;

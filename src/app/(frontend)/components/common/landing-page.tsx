import React from "react";
import Link from "next/link";
import { IGenre } from "@/interfaces/IMovies";
import { IScreeningGroup } from "@/interfaces/IScreenings";
import { SITE_URL } from "@/lib/site-config";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading from "@/components/ui/page-heading";
import EmptyState from "@/components/common/empty-state";
import JsonLd from "@/components/common/json-ld";
import RepertoireSection from "@/components/common/repertoire-section";
import RepertoireGrid from "@/components/common/repertoire-grid";

// Building blocks shared by the long-tail landing pages (/kino-plenerowe,
// /klasyka-w-kinach). Same layout and type scale as /gatunki/[slug], so the
// pages read as part of the site rather than as a separate template.

const H2_CLASS =
  "text-2xl md:text-4xl lg:text-5xl leading-[1.05] -tracking-[0.02em] max-w-[26ch] text-white font-medium";

interface LandingHeaderProps {
  breadcrumbs: { name: string; href: string }[];
  title: React.ReactNode;
  intro: string;
}

export const LandingHeader = ({
  breadcrumbs,
  title,
  intro,
}: LandingHeaderProps) => (
  <>
    <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-4">
      <Breadcrumbs items={breadcrumbs} />
    </div>
    <header className="px-6 md:px-12 lg:px-16 pt-6 md:pt-8 pb-8 md:pb-12">
      <PageHeading variant="detail" className="max-w-[20ch]">
        {title}
      </PageHeading>
      <p className="mt-8 md:mt-10 max-w-[64ch] text-base md:text-lg text-white/65 leading-relaxed">
        {intro}
      </p>
    </header>
  </>
);

interface LandingRepertoireProps {
  screenings: IScreeningGroup[];
  genres: IGenre[];
  heading: React.ReactNode;
  /** Shown when nothing is scheduled at all. */
  emptyDescription: React.ReactNode;
  cta: { href: string; label: string };
  hideCity?: boolean;
}

/**
 * Repertoire grid rendered on the server (so it is in the static HTML)
 * with the usual client-side filters on top.
 */
export const LandingRepertoire = ({
  screenings,
  genres,
  heading,
  emptyDescription,
  cta,
  hideCity,
}: LandingRepertoireProps) => (
  <RepertoireSection
    screenings={screenings}
    genres={genres}
    hideCity={hideCity}
    className="px-6 md:px-12 lg:px-16 pb-20 md:pb-28"
    heading={<h2 className={`mb-6 md:mb-8 ${H2_CLASS}`}>{heading}</h2>}
    emptyState={
      <EmptyState
        description={
          <>
            Brak seansów pasujących do wybranych filtrów. Spróbuj zmienić
            zakres dat, miasto lub frazę.
          </>
        }
        cta={cta}
      />
    }
  >
    <RepertoireGrid
      screenings={screenings}
      emptyState={<EmptyState description={emptyDescription} cta={cta} />}
    />
  </RepertoireSection>
);

interface LinkGridProps {
  heading: React.ReactNode;
  description?: React.ReactNode;
  items: { href?: string; label: string; meta?: string }[];
}

/**
 * Bordered grid of links, the "Inne gatunki" pattern. Items without an
 * href render as plain text: venue pages that are noindex get no link.
 */
export const LinkGrid = ({ heading, description, items }: LinkGridProps) => {
  if (items.length === 0) return null;

  return (
    <section className="border-t border-white/10 px-6 md:px-12 lg:px-16 pt-12 md:pt-16 pb-20 md:pb-28">
      <h2 className={H2_CLASS}>{heading}</h2>
      {description && (
        <p className="mt-4 md:mt-5 max-w-[64ch] text-sm md:text-base text-white/55 leading-relaxed">
          {description}
        </p>
      )}
      <ul className="mt-8 md:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-t border-l border-white/10">
        {items.map((item) => {
          const body = (
            <>
              <span
                className={`text-sm md:text-base font-medium uppercase -tracking-[0.01em] text-white/65 transition-colors ${item.href ? "group-hover:text-white" : ""}`}
              >
                {item.label}
              </span>
              {item.meta && (
                <span className="text-[10px] md:text-xs uppercase tracking-[0.22em] text-white/50">
                  {item.meta}
                </span>
              )}
            </>
          );
          const cellClass =
            "border-r border-b border-white/10 px-4 md:px-5 py-5 md:py-6 flex flex-col gap-1";

          return (
            <li key={`${item.href ?? ""}${item.label}`} className="flex">
              {item.href ? (
                <Link
                  href={item.href}
                  className={`group w-full bg-black hover:bg-white/[0.04] transition-colors ${cellClass}`}
                >
                  {body}
                </Link>
              ) : (
                <div className={`w-full ${cellClass}`}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};

/** CollectionPage + ItemList of the films the page lists. */
export const LandingJsonLd = ({
  name,
  path,
  description,
  screenings,
}: {
  name: string;
  path: string;
  description: string;
  screenings: IScreeningGroup[];
}) => {
  const movies = screenings.map((group) => group.movie).slice(0, 24);
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name,
        url: `${SITE_URL}${path}`,
        description,
        inLanguage: "pl-PL",
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: movies.length,
          itemListElement: movies.map((movie, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `${SITE_URL}/filmy/${movie.slug}`,
            name: movie.title,
          })),
        },
      }}
    />
  );
};

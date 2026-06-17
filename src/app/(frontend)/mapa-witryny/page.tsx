import React from "react";
import Link from "next/link";
import { getGenres } from "@/lib/genres";
import { getDirectors, DIRECTOR_INDEX_THRESHOLD } from "@/lib/directors";
import { getPublishedPosts } from "@/lib/posts";
import { IGenre } from "@/interfaces/IMovies";
import { IDirector } from "@/interfaces/IDirectors";
import type { Post } from "@/payload-types";
import { SITE_URL } from "@/lib/site-config";
import JsonLd from "@/components/common/json-ld";
import Breadcrumbs from "@/components/ui/breadcrumbs";
import PageHeading, { PageHeadingMuted } from "@/components/ui/page-heading";
import SiteHeader from "@/components/common/site-header";
import Footer from "../(home)/_components/footer";

export const revalidate = 300;

// Primary hubs, mirrored from the site nav and footer so the site map never
// drifts from the real navigation. Each carries a short hint so the index
// reads as more than a bare wall of links.
const PRIMARY_SECTIONS = [
  {
    label: "Seanse",
    href: "/seanse",
    hint: "Aktualny repertuar seansów specjalnych w całej Polsce.",
  },
  {
    label: "Kina",
    href: "/kina",
    hint: "Katalog kin studyjnych i niezależnych.",
  },
  {
    label: "Mapa kin",
    href: "/mapa-kin",
    hint: "Interaktywna mapa ekranów w Twojej okolicy.",
  },
  {
    label: "Miasta",
    href: "/miasta",
    hint: "Kina i seanse pogrupowane według miast.",
  },
  {
    label: "Gatunki",
    href: "/gatunki",
    hint: "Przeglądaj seanse po gatunku filmowym.",
  },
  {
    label: "Reżyserzy",
    href: "/rezyserzy",
    hint: "Twórcy, których kino wraca na duży ekran.",
  },
  {
    label: "Blog",
    href: "/blog",
    hint: "Teksty o kinie studyjnym, klasyce i seansach specjalnych.",
  },
] as const;

const INFO_LINKS = [
  { label: "O projekcie", href: "/o-projekcie" },
  { label: "FAQ", href: "/faq" },
  { label: "Kontakt", href: "/kontakt" },
] as const;

const LEGAL_LINKS = [
  { label: "Regulamin", href: "/regulamin" },
  { label: "Polityka prywatności", href: "/polityka-prywatnosci" },
] as const;

const buildSiteMapJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Mapa witryny",
  url: `${SITE_URL}/mapa-witryny`,
  description: "Wszystkie sekcje serwisu Klaps w jednym miejscu.",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: PRIMARY_SECTIONS.length,
    itemListElement: PRIMARY_SECTIONS.map((section, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}${section.href}`,
      name: section.label,
    })),
  },
});

interface SectionHeadingProps {
  title: string;
  count?: number;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ title, count }) => (
  <div className="flex items-baseline gap-3 border-b border-white/10 pb-3 mb-5">
    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold uppercase -tracking-[0.02em] text-white">
      {title}
    </h2>
    {count !== undefined && (
      <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 tabular-nums">
        {count}
      </span>
    )}
  </div>
);

const linkClass =
  "text-base md:text-lg text-white/65 hover:text-white transition-colors block truncate";

const SiteMapPage = async () => {
  // Resilient fan-out: a hiccup in any single feed degrades to an empty
  // section instead of 500ing the whole index.
  const [genres, directorsResult, posts] = await Promise.all([
    getGenres().catch(() => [] as IGenre[]),
    getDirectors().catch(() => ({ data: [] as IDirector[] })),
    getPublishedPosts().catch(() => [] as Post[]),
  ]);

  const sortedGenres = [...genres].sort((a, b) =>
    a.name.localeCompare(b.name, "pl")
  );

  // Only link directors above the indexing threshold: thinner pages carry a
  // noindex meta and stay out of the sitemap, so linking them here would
  // just point at dead ends.
  const indexableDirectors = [...directorsResult.data]
    .filter(
      (director) => director.upcomingScreeningsCount >= DIRECTOR_INDEX_THRESHOLD
    )
    .sort((a, b) => a.name.localeCompare(b.name, "pl"));

  const publishedPosts = posts.filter((post) => Boolean(post.slug));

  return (
    <main className="bg-black text-white min-h-screen">
      <JsonLd data={buildSiteMapJsonLd()} />
      <SiteHeader />

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-10 pb-6">
        <Breadcrumbs
          items={[{ name: "Mapa witryny", href: "/mapa-witryny" }]}
        />
      </div>

      <div className="px-6 md:px-12 lg:px-16 pt-8 md:pt-12 pb-10 md:pb-14">
        <PageHeading variant="editorial">
          Mapa witryny.
          <PageHeadingMuted>
            Wszystko, co znajdziesz w&nbsp;serwisie.
          </PageHeadingMuted>
        </PageHeading>
        <p className="mt-4 md:mt-5 max-w-[64ch] text-base md:text-lg text-white/55 leading-relaxed">
          Pełny spis sekcji Klapsa w&nbsp;jednym miejscu: repertuar seansów
          specjalnych, katalog kin studyjnych, miasta, gatunki, reżyserzy
          i&nbsp;blog. Wybierz dział, żeby przejść dalej.
        </p>
      </div>

      <div className="px-6 md:px-12 lg:px-16 pb-24 md:pb-32 flex flex-col gap-16 md:gap-24">
        <section>
          <SectionHeading title="Główne sekcje" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/10">
            {PRIMARY_SECTIONS.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="group bg-black hover:bg-white/[0.04] transition-colors border-r border-b border-white/10 p-6 md:p-8 flex flex-col gap-2"
              >
                <span className="text-lg md:text-xl font-medium uppercase -tracking-[0.01em] text-white/80 group-hover:text-white transition-colors">
                  {section.label}
                </span>
                <span className="text-sm text-white/45 leading-relaxed">
                  {section.hint}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {sortedGenres.length > 0 && (
          <section className="break-inside-avoid">
            <SectionHeading title="Gatunki" count={sortedGenres.length} />
            <ul className="columns-2 md:columns-3 lg:columns-4 gap-x-8 lg:gap-x-12">
              {sortedGenres.map((genre) => (
                <li key={genre.id} className="mb-2 break-inside-avoid">
                  <Link href={`/gatunki/${genre.slug}`} className={linkClass}>
                    {genre.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {indexableDirectors.length > 0 && (
          <section className="break-inside-avoid">
            <SectionHeading
              title="Reżyserzy"
              count={indexableDirectors.length}
            />
            <ul className="columns-2 md:columns-3 lg:columns-4 gap-x-8 lg:gap-x-12">
              {indexableDirectors.map((director) => (
                <li key={director.slug} className="mb-2 break-inside-avoid">
                  <Link
                    href={`/rezyserzy/${director.slug}`}
                    className={linkClass}
                  >
                    {director.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {publishedPosts.length > 0 && (
          <section className="break-inside-avoid">
            <SectionHeading title="Na blogu" count={publishedPosts.length} />
            <ul className="columns-1 md:columns-2 gap-x-12 lg:gap-x-16">
              {publishedPosts.map((post) => (
                <li key={post.id} className="mb-2 break-inside-avoid">
                  <Link href={`/blog/${post.slug}`} className={linkClass}>
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 md:gap-24">
          <section className="break-inside-avoid">
            <SectionHeading title="Informacje" />
            <ul className="flex flex-col gap-2">
              {INFO_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="break-inside-avoid">
            <SectionHeading title="Dokumenty" />
            <ul className="flex flex-col gap-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default SiteMapPage;

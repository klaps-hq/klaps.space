import { Metadata } from "next";
import JsonLd from "@/components/common/json-ld";
import { getGenres } from "@/lib/genres";
import { SITE_URL } from "@/lib/site-config";
import { IGenre } from "@/interfaces/IMovies";

const buildGenresJsonLd = (genres: readonly IGenre[]) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Gatunki filmowe",
  url: `${SITE_URL}/gatunki`,
  description:
    "Gatunki filmowe w seansach specjalnych kin studyjnych w Polsce.",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: genres.length,
    itemListElement: genres.map((genre, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/gatunki/${genre.slug}`,
      name: genre.name,
    })),
  },
});

export const metadata: Metadata = {
  title: "Gatunki filmowe - klasyka i retrospektywy w kinach",
  description:
    "Przeglądaj klasykę filmową według gatunku. Dramaty, thrillery, komedie i inne filmy na seansach specjalnych w kinach studyjnych w Polsce.",
  alternates: {
    canonical: `${SITE_URL}/gatunki`,
  },
  openGraph: {
    title: "Gatunki filmowe - klasyka i retrospektywy w kinach studyjnych",
    description:
      "Przeglądaj klasykę filmową według gatunku. Seanse specjalne w kinach studyjnych w Polsce.",
    url: `${SITE_URL}/gatunki`,
  },
};

export default async function GenresLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let genres: IGenre[] = [];
  try {
    genres = await getGenres();
  } catch {
    // JSON-LD is an enhancement - render the page without it on API errors.
  }

  return (
    <>
      {genres.length > 0 && <JsonLd data={buildGenresJsonLd(genres)} />}
      {children}
    </>
  );
}

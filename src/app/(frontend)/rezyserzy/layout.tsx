import JsonLd from "@/components/common/json-ld";
import { getDirectors } from "@/lib/directors";
import { SITE_URL } from "@/lib/site-config";
import { IDirector } from "@/interfaces/IDirectors";

// Only directors with an active repertoire are worth surfacing in the
// ItemList; including the full long tail would bloat the payload.
const buildDirectorsJsonLd = (directors: readonly IDirector[]) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Reżyserzy",
  url: `${SITE_URL}/rezyserzy`,
  description:
    "Reżyserzy, których filmy grają na seansach specjalnych w kinach studyjnych w Polsce.",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: directors.length,
    itemListElement: directors.map((director, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/rezyserzy/${director.slug}`,
      name: director.name,
    })),
  },
});

// Metadata lives in page.tsx (generateMetadata): pagination needs
// searchParams, which layouts cannot access.

export default async function DirectorsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let directors: IDirector[] = [];
  try {
    directors = (await getDirectors()).data.filter(
      (director) => director.upcomingScreeningsCount > 0
    );
  } catch {
    // JSON-LD is an enhancement - render the page without it on API errors.
  }

  return (
    <>
      {directors.length > 0 && (
        <JsonLd data={buildDirectorsJsonLd(directors)} />
      )}
      {children}
    </>
  );
}

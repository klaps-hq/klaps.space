export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://klaps.space";

export const SITE_NAME = "Klaps";

export const SITE_DESCRIPTION =
  "Ogólnopolski przewodnik po seansach specjalnych, klasyce filmowej i retrospektywach w kinach studyjnych w Polsce. Repertuar, filmy i kina w jednym miejscu.";

// Stable JSON-LD node ids. The same entity is described on several pages
// (a cinema on its own page and as every screening's location, a movie on
// its page and as every screening's workPresented); a shared @id lets
// Google merge those descriptions into one entity instead of many.
export const cinemaEntityId = (slug: string): string =>
  `${SITE_URL}/kina/${slug}#kino`;
export const movieEntityId = (slug: string): string =>
  `${SITE_URL}/filmy/${slug}#film`;
export const directorEntityId = (slug: string): string =>
  `${SITE_URL}/rezyserzy/${slug}#osoba`;

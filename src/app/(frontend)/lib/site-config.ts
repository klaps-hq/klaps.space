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

export const ORGANIZATION_ID = `${SITE_URL}/#organizacja`;

export const FOUNDER_PATH = "/o-tworcy";

/**
 * The person behind the site. Shown on the founder page and referenced as
 * the Organization's founder in JSON-LD: a named, verifiable person behind
 * the service is a trust signal, while blog posts stay credited to the
 * editorial team because they are drafted with AI.
 */
export const FOUNDER = {
  id: `${SITE_URL}${FOUNDER_PATH}#osoba`,
  name: "Robert Siński",
  jobTitle: "Twórca klaps.space",
  url: `${SITE_URL}${FOUNDER_PATH}`,
  image: `${SITE_URL}/images/autor/robert-sinski.jpg`,
  sameAs: ["https://github.com/Biplo12", "https://www.robertsinski.dev/"],
} as const;

// "kina" / "kinie" before a venue name, without doubling it: about a third
// of the venues are called "Kino X", and "Repertuar kina Kino Pod Baranami"
// or "seans w kinie Kino Kijów" read as broken Polish in titles, snippets
// and structured data. Those names inflect themselves ("Kina Pod Baranami",
// "w Kinie Kijów"); any other name stays in the nominative after the noun.

const KINO_TEATR = /^kino-teatr\s+/i;
const KINO = /^kino\s+/i;

/** "kina Muranów", "Kina Pod Baranami", "Kina-Teatru Syrena". */
export const cinemaGenitive = (name: string): string => {
  if (KINO_TEATR.test(name)) return name.replace(KINO_TEATR, "Kina-Teatru ");
  if (KINO.test(name)) return name.replace(KINO, "Kina ");
  return `kina ${name}`;
};

/** "kinie Muranów", "Kinie Kijów", "Kinie-Teatrze Syrena". */
export const cinemaLocative = (name: string): string => {
  if (KINO_TEATR.test(name)) return name.replace(KINO_TEATR, "Kinie-Teatrze ");
  if (KINO.test(name)) return name.replace(KINO, "Kinie ");
  return `kinie ${name}`;
};

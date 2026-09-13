/**
 * Tells apart multiplex-chain cinemas from independent / arthouse ones.
 *
 * The API has no chain field, so the split is derived from the venue name,
 * which is reliable here: Polish chains brand every location with the chain
 * name ("Cinema City Silesia", "Helios Alfa", "Multikino Stary Browar").
 *
 * Used for two things: keeping chain venues out of the "kina studyjne"
 * headings on city pages (the listing mixes both, and a "studyjne" heading
 * over a Cinema City row would read as inaccurate), and steering the chain
 * pages' own titles onto the special-screenings angle instead of competing
 * with the chain's official repertoire page.
 */

const CHAIN_PATTERNS = [
  /\bcinema\s?city\b/i,
  /\bhelios\b/i,
  /\bmultikino\b/i,
  /\bcinepolis\b/i,
  /\bcinema\s?3d\b/i,
  // An IMAX screen in Poland sits inside a chain multiplex, never in an
  // arthouse venue, so the brand name is a reliable chain marker too.
  /\bimax\b/i,
];

export const isChainCinema = (name: string): boolean =>
  CHAIN_PATTERNS.some((pattern) => pattern.test(name));

// Splits a cinema list into independents first (the site's actual subject)
// and chain venues second, each keeping the incoming order.
export const splitByChain = <T extends { name: string }>(
  cinemas: T[]
): { independent: T[]; chain: T[] } => ({
  independent: cinemas.filter((cinema) => !isChainCinema(cinema.name)),
  chain: cinemas.filter((cinema) => isChainCinema(cinema.name)),
});

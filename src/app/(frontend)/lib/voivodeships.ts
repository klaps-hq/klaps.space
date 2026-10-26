/**
 * Canonical list of Polish voivodeships (lowercase, with diacritics),
 * mirroring the values stored by the API and accepted by its
 * ?voivodeship= query param.
 */
export const VOIVODESHIPS = [
  "dolnośląskie",
  "kujawsko-pomorskie",
  "lubelskie",
  "lubuskie",
  "łódzkie",
  "małopolskie",
  "mazowieckie",
  "opolskie",
  "podkarpackie",
  "podlaskie",
  "pomorskie",
  "śląskie",
  "świętokrzyskie",
  "warmińsko-mazurskie",
  "wielkopolskie",
  "zachodniopomorskie",
] as const;

export type Voivodeship = (typeof VOIVODESHIPS)[number];

export const isVoivodeship = (value: string): value is Voivodeship =>
  (VOIVODESHIPS as readonly string[]).includes(value);

/** "mazowieckie" -> "Mazowieckie" for headings and select labels. */
export const formatVoivodeship = (name: string): string =>
  name.charAt(0).toUpperCase() + name.slice(1);

/**
 * "mazowieckie" -> "mazowieckim" for phrases like
 * "w województwie mazowieckim". Every canonical name ends in "-ie",
 * so the locative is the stem plus "m".
 */
export const voivodeshipLocative = (name: string): string =>
  name.endsWith("ie") ? `${name.slice(0, -1)}m` : name;

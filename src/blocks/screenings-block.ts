import type { Block } from "payload";

/**
 * Live repertoire embedded inside an article.
 *
 * The editorial posts explain what a DKF or a retrospective is; competitors
 * rank for the same terms with static text that does not even link to the
 * cinemas it names. Real showtimes are the one thing they cannot copy, so
 * this block lets an author drop the current repertoire straight into the
 * paragraph that discusses it.
 *
 * Scoping is by slug rather than a relationship: cinemas, cities and genres
 * live in the repertoire API, not in Payload, so there is nothing here to
 * relate to. The renderer resolves the slug and falls back to the nationwide
 * listing when it does not match.
 */
export const ScreeningsBlock: Block = {
  slug: "screenings",
  labels: {
    singular: "Seanse z repertuaru",
    plural: "Seanse z repertuaru",
  },
  fields: [
    {
      name: "heading",
      label: "Nagłówek",
      type: "text",
      admin: {
        description:
          "Opcjonalny. Pozostaw puste, żeby wstawić samą listę bez nagłówka.",
      },
    },
    {
      name: "scope",
      label: "Zakres",
      type: "select",
      required: true,
      defaultValue: "all",
      options: [
        { label: "Cała Polska", value: "all" },
        { label: "Wybrane miasto", value: "city" },
        { label: "Wybrany gatunek", value: "genre" },
      ],
    },
    {
      name: "citySlug",
      label: "Miasto (slug)",
      type: "text",
      admin: {
        condition: (_, siblingData) => siblingData?.scope === "city",
        description:
          "Slug z adresu strony miasta, np. „krakow” dla /miasta/krakow.",
      },
    },
    {
      name: "genreSlug",
      label: "Gatunek (slug)",
      type: "text",
      admin: {
        condition: (_, siblingData) => siblingData?.scope === "genre",
        description:
          "Slug z adresu strony gatunku, np. „dramat” dla /gatunki/dramat.",
      },
    },
    {
      name: "limit",
      label: "Liczba filmów",
      type: "number",
      defaultValue: 8,
      min: 2,
      max: 24,
      admin: {
        description:
          "Ile filmów pokazać. Blok znika, gdy w wybranym zakresie nie ma nadchodzących seansów.",
      },
    },
  ],
};

export default ScreeningsBlock;

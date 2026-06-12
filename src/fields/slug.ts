import type { FieldHook, TextField } from "payload";

// Lowercases, strips Polish diacritics and collapses everything else into
// single hyphens. NFD decomposition covers most diacritics, but "ł" has no
// combining-mark decomposition so it needs an explicit mapping.
const formatSlug = (value: string): string =>
  value
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const formatSlugHook =
  (fallbackField: string): FieldHook =>
  ({ data, value }) => {
    if (typeof value === "string" && value.length > 0) {
      return formatSlug(value);
    }

    const fallback = data?.[fallbackField];
    if (typeof fallback === "string" && fallback.length > 0) {
      return formatSlug(fallback);
    }

    return value;
  };

interface SlugFieldOptions {
  fallbackField?: string;
}

export const slugField = ({
  fallbackField = "title",
}: SlugFieldOptions = {}): TextField => ({
  name: "slug",
  type: "text",
  unique: true,
  index: true,
  admin: {
    position: "sidebar",
    description:
      "Adres URL wpisu. Zostawione puste wygeneruje się z tytułu.",
  },
  hooks: {
    beforeValidate: [formatSlugHook(fallbackField)],
  },
});

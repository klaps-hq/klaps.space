import { buildOgImage, OG_SIZE } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Klaps - Seanse specjalne i klasyka filmowa w kinach studyjnych";

// Root fallback for any route without its own opengraph-image,
// kept in sync with the (home) variant.
export default function OgImage() {
  return buildOgImage({
    eyebrow: "Kina studyjne w Polsce",
    title: "Klaps",
    subtitle: "Seanse specjalne i klasyka filmowa w kinach studyjnych w Polsce",
  });
}
